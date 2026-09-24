// Draws the metal card's front plate pattern (see docs/card-assets.md, "The front's
// animated plate") as genuine flow-field streamlines onto a 2D canvas, instead of
// approximating the look with a closed-form GLSL formula. Real flow-field art (the
// look the card is chasing) is normally made this way — seed points carried along a
// smooth curl-noise vector field, the resulting paths stroked with round joins — and
// getting it from a formula turned out to fight the medium: analytic band-cutting
// (an earlier version of this file) needed increasingly careful math to avoid folding
// into zigzags and to avoid every "ribbon" being an identical parallel copy, and even
// then only approximated the organic, unevenly-spaced curves this produces for free.
// CardScene.tsx uploads the canvas as a CanvasTexture and mixes it under the gold
// ornament in the card's fragment shader.

// Classic 2D Perlin (Ken Perlin) gradient noise — simple, well-understood, and enough
// to build a curl-noise field from. A fixed seed so the field's overall character is
// stable across reloads (only its evolution over time animates).
const PERLIN_PERM = (() => {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  let seed = 1337;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = p[i];
    p[i] = p[j];
    p[j] = tmp;
  }
  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  return perm;
})();

function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}
function lerp(t: number, a: number, b: number) {
  return a + t * (b - a);
}
function grad(hash: number, x: number, y: number) {
  const h = hash & 3;
  const u = h < 2 ? x : y;
  const v = h < 2 ? y : x;
  return (h & 1 ? -u : u) + (h & 2 ? -v : v);
}
function perlin2(x: number, y: number): number {
  const xi = Math.floor(x) & 255;
  const yi = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const u = fade(xf);
  const v = fade(yf);
  const perm = PERLIN_PERM;
  const aa = perm[perm[xi] + yi];
  const ab = perm[perm[xi] + yi + 1];
  const ba = perm[perm[xi + 1] + yi];
  const bb = perm[perm[xi + 1] + yi + 1];
  return lerp(
    v,
    lerp(u, grad(aa, xf, yf), grad(ba, xf - 1, yf)),
    lerp(u, grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1)),
  );
}

// A deterministic 0..1 "random" value for a given input, stable across redraws (unlike
// Math.random(), which would make e.g. each streamline's width flicker every frame).
function hash1(n: number): number {
  const s = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s);
}

// The curl of a scalar potential built from Perlin noise (finite differences): a
// divergence-free vector field, so it never "pools" or "sources" — just swirls, which
// is what keeps traced streamlines organic instead of spiralling into a point.
function curl2(x: number, y: number): [number, number] {
  const eps = 0.06;
  const dPhiDy = (perlin2(x, y + eps) - perlin2(x, y - eps)) / (2 * eps);
  const dPhiDx = (perlin2(x + eps, y) - perlin2(x - eps, y)) / (2 * eps);
  return [dPhiDy, -dPhiDx];
}

export interface PlateStreamOptions {
  count: number; // how many streamlines
  noiseScale: number; // spatial frequency of the flow field: lower = broader, slower bends
  sway: number; // how strongly the field deflects a streamline off a straight line
  forwardBias: number; // how strongly each streamline is pushed to keep advancing (vs. free to wander/loop)
  width: number; // stroke width, in canvas px
  timeOffset: number; // shifts the field over time so the streamlines keep flowing, not just sit still
  brightness: number;
  colors: readonly [string, string, string, string]; // 4-stop gradient the streamlines sweep through
}

// Every streamline is rooted at the same fixed (ANCHOR_X, y0) every single frame —
// not derived from the field at all, so it can never drift. ANCHOR_X only needs to
// clear the widest stroke the tuner allows (60px on a 700px-wide canvas is a ~0.043
// half-width) so its round cap stays hidden behind the card's gold frame.
export const ANCHOR_X = -0.08;
// The anchor fixes *where* each ribbon roots, but the field could still send it off in
// almost any direction the instant it leaves — including sideways or briefly backward
// — which would show as a kink right at that fixed point. Ramping sway in linearly
// over the first SETTLE_STEPS instead means every ribbon always leaves its anchor
// running straight forward (pure forwardBias) and only picks up curl a little at a
// time, so what's pinned at the top reads as a clean root, not another kind of head.
const SETTLE_STEPS = 16;
// The mirror of ANCHOR_X on the far side — same margin, so its round cap is equally
// hidden behind the frame there. Every streamline is walked all the way to exactly
// this point (same y0 as its anchor: it exits directly across from where it entered),
// exactly like ANCHOR_X pins the start — "cố định 2 đầu".
export const EXIT_X = 1 - ANCHOR_X;
// Mirrors SETTLE_STEPS at the other end: over the last EXIT_SETTLE_STEPS, the
// direction eases from free curl-following over to aiming straight at (EXIT_X, y0),
// so the exit is a clean landing rather than a positional snap tacked on afterwards.
const EXIT_SETTLE_STEPS = 40;
const TRACE_STEPS = 240;
// Generous arc-length budget: needs to cover roughly ANCHOR_X..EXIT_X (about 1.16)
// even when curl deflection eats into forward progress, not just the straight-line
// distance — and EXIT_SETTLE_STEPS' final aim-at-target run eats into that further.
const TRACE_STEP_SIZE = 2.9 / TRACE_STEPS;

// Traces one streamline forward from the anchor through the curl-noise field, always
// for the full TRACE_STEPS (see drawPlateStreams' comment on why it doesn't stop
// early). Unlike an implicit formula, a traced path has no monotonicity to preserve —
// each step just follows the local flow — so smoothness comes for free from small
// steps drawn with round joins, not from careful algebra.
function traceStreamline(
  y0: number,
  opts: Pick<PlateStreamOptions, "noiseScale" | "sway" | "forwardBias" | "timeOffset">,
) {
  const pts: { x: number; y: number }[] = [{ x: ANCHOR_X, y: y0 }];
  let x = ANCHOR_X;
  let y = y0;
  for (let i = 0; i < TRACE_STEPS; i++) {
    const settleIn = Math.min(i / SETTLE_STEPS, 1);
    const settleOut = Math.min((TRACE_STEPS - i) / EXIT_SETTLE_STEPS, 1); // 1 until near the end, ->0 at the last step
    const [cx, cy] = curl2(x * opts.noiseScale + opts.timeOffset, y * opts.noiseScale);
    const freeDx = opts.forwardBias + cx * opts.sway * settleIn;
    const freeDy = cy * opts.sway * settleIn;
    const toExitX = EXIT_X - x;
    const toExitY = y0 - y;
    const toExitLen = Math.hypot(toExitX, toExitY) || 1;
    const dx = lerp(1 - settleOut, freeDx, toExitX / toExitLen);
    const dy = lerp(1 - settleOut, freeDy, toExitY / toExitLen);
    const len = Math.hypot(dx, dy) || 1;
    x += (dx / len) * TRACE_STEP_SIZE;
    y += (dy / len) * TRACE_STEP_SIZE;
    pts.push({ x, y });
  }
  // Land exactly on the fixed exit, however close settleOut's easing got it — the
  // last couple of steps' arc-length is coarse enough that it can otherwise miss by a
  // visible amount, which would show as its own small kink right at the pinned exit.
  pts[pts.length - 1] = { x: EXIT_X, y: y0 };
  return pts;
}

// Per-streamline point history, carried between drawPlateStreams calls so each
// redraw can ease toward its freshly-traced path instead of snapping straight to it
// — see that function's comment. Own one of these per canvas (createPlateStreamState);
// don't share it between two unrelated canvases.
export interface PlateStreamState {
  smoothed: { x: number; y: number }[][] | null;
}
export function createPlateStreamState(): PlateStreamState {
  return { smoothed: null };
}

export interface PlatePoint {
  x: number;
  y: number;
}

// A ribbon can be hand-shaped instead of procedurally traced: plateManualPoints[i],
// when set, is that ribbon's own middle control points (in the same normalized
// texture-UV space as everything else here — the same one CardScene's mask/color maps
// use). Left null/undefined, ribbon i keeps flowing through the curl-noise field as
// usual. CardPlateEditor.tsx (a dev-only drag-to-shape overlay rendered over the card)
// writes into this; drawPlateStreams reads it every frame — the same "live
// module-level object" pattern as cardTuning. Both ends stay pinned exactly like a
// procedural ribbon's (ANCHOR_X/EXIT_X, same y0): only the interior is yours to shape.
//
// This is also the *live* value a keyframed ribbon's points get driven from every
// frame (see applyPlateKeyframes below) — dragging always edits this array directly;
// recording a keyframe just snapshots whatever's in it at that moment.
export const plateManualPoints: (PlatePoint[] | null | undefined)[] = [];

export interface PlateKeyframe {
  time: number; // seconds — the same units/scale as cardTuning.plateTimeScrub
  points: PlatePoint[];
}

// Ribbon i's recorded keyframes (Unity-Animation-window style: CardPlateEditor drags
// plateManualPoints[i] into shape at one plateTimeScrub value, records a keyframe
// there, moves the scrub time, drags again, records again — applyPlateKeyframes then
// interpolates between them every frame instead of holding one static shape). Empty
// or missing for a ribbon that has no recorded keyframes — plateManualPoints[i] is
// just a plain static shape (or the ribbon is still fully procedural) in that case.
export const plateKeyframes: (PlateKeyframe[] | null | undefined)[] = [];

// Which ribbon CardPlateEditor is currently dragging, if any — applyPlateKeyframes
// skips it so scrubbing the timeline doesn't fight a live drag.
export const plateActiveDrag: { ribbon: number | null } = { ribbon: null };

function sampleKeyframes(frames: readonly PlateKeyframe[], time: number): PlatePoint[] {
  const sorted = [...frames].sort((a, b) => a.time - b.time);
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  if (time <= first.time) return first.points;
  if (time >= last.time) return last.points;
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (time >= a.time && time <= b.time) {
      const t = (time - a.time) / (b.time - a.time || 1);
      return a.points.map((p, k) => ({
        x: p.x + ((b.points[k]?.x ?? p.x) - p.x) * t,
        y: p.y + ((b.points[k]?.y ?? p.y) - p.y) * t,
      }));
    }
  }
  return last.points;
}

// Call once per frame (CardScene's render loop, right before drawPlateStreams) to
// drive every keyframed ribbon's plateManualPoints from its recorded timeline at the
// given time. A ribbon with 0-1 keyframes doesn't need interpolating — its single
// recorded shape (or whatever's already in plateManualPoints) just stands as-is.
export function applyPlateKeyframes(time: number) {
  for (let i = 0; i < plateKeyframes.length; i++) {
    const frames = plateKeyframes[i];
    if (!frames || frames.length < 2 || plateActiveDrag.ribbon === i) continue;
    plateManualPoints[i] = sampleKeyframes(frames, time);
  }
}

// Turns a handful of control points into `total` evenly-parametrized points along the
// smooth (Catmull-Rom) curve through them, so a hand-shaped ribbon produces the same
// dense, uniformly-indexed array traceStreamline does — required for it to draw with
// the same code and ease frame-to-frame with the same per-index temporal smoothing.
function catmullRomSample(pts: PlatePoint[], total: number): PlatePoint[] {
  const n = pts.length;
  const at = (i: number) => pts[Math.max(0, Math.min(n - 1, i))];
  const segments = n - 1;
  const out: PlatePoint[] = [];
  for (let k = 0; k < total; k++) {
    const t = (k / (total - 1)) * segments; // 0..segments
    const s = Math.min(segments - 1, Math.floor(t));
    const lt = t - s;
    const lt2 = lt * lt;
    const lt3 = lt2 * lt;
    const p0 = at(s - 1);
    const p1 = at(s);
    const p2 = at(s + 1);
    const p3 = at(s + 2);
    const x =
      0.5 *
      (2 * p1.x +
        (p2.x - p0.x) * lt +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * lt2 +
        (3 * p1.x - p0.x - 3 * p2.x + p3.x) * lt3);
    const y =
      0.5 *
      (2 * p1.y +
        (p2.y - p0.y) * lt +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * lt2 +
        (3 * p1.y - p0.y - 3 * p2.y + p3.y) * lt3);
    out.push({ x, y });
  }
  return out;
}

// Redraws the plate's flowing ribbons onto `ctx` (a canvas sized w×h, in the card
// art's own texture space — see CardScene's makeFace). Streamlines are seeded evenly
// along the left edge; the field's own divergence is what pulls some together and
// pushes others apart (see docs/card-assets.md), so no separate "uneven spacing"
// parameter is needed the way the earlier formula-based version required one.
//
// Each call re-traces every streamline from scratch through that moment's field
// snapshot (opts.timeOffset) rather than incrementally advecting a persisted particle
// — simpler, and it's what keeps the ribbons spanning the whole card every frame
// instead of being short comet-like trails. The cost is that streamline tracing is an
// iterative, 240-step process, so it's sensitive to its starting conditions: a small
// shift in the field between two frames can occasionally make a path branch a
// noticeably different way by the time it's iterated all the way out, which reads as
// the ribbon abruptly relocating instead of drifting. `state` is what fixes that: each
// point eases toward its freshly-traced counterpart (by index) rather than jumping to
// it, so any such branch happens gradually over several frames instead of as a pop.
// traceStreamline always returning exactly the same number of points (no early exit)
// is what makes "by index" a stable correspondence frame to frame.
export function drawPlateStreams(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  opts: PlateStreamOptions,
  state: PlateStreamState,
) {
  ctx.clearRect(0, 0, w, h);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const gradient = ctx.createLinearGradient(0, 0, w, 0);
  gradient.addColorStop(0, opts.colors[0]);
  gradient.addColorStop(1 / 3, opts.colors[1]);
  gradient.addColorStop(2 / 3, opts.colors[2]);
  gradient.addColorStop(1, opts.colors[3]);
  ctx.strokeStyle = gradient;
  ctx.globalAlpha = Math.max(0, Math.min(opts.brightness, 1));
  // globalAlpha only covers 0..1; brightness above 1 is applied as a shader
  // multiplier instead (see uPlateBrightness in CardScene.tsx).

  // How much of the way each point moves toward its fresh trace per frame. Lower
  // means slower to react (a shifting slider takes longer to visibly settle) but also
  // a gentler, less noticeable glide when the underlying trace branches abruptly.
  const SMOOTHING = 0.06;
  const nextSmoothed: { x: number; y: number }[][] = [];

  for (let i = 0; i < opts.count; i++) {
    const y0 = (i + 0.5) / opts.count;
    const manual = plateManualPoints[i];
    const raw =
      manual && manual.length > 0
        ? catmullRomSample(
            [{ x: ANCHOR_X, y: y0 }, ...manual, { x: EXIT_X, y: y0 }],
            TRACE_STEPS + 1,
          )
        : traceStreamline(y0, opts);
    const prev = state.smoothed?.[i];
    // Hand-shaped ribbons draw immediately, not eased in: they're static (no chaotic
    // frame-to-frame branching to smooth away), and easing would make dragging a
    // handle in CardPlateEditor feel laggy instead of tracking the cursor directly.
    const pts =
      prev && !manual
        ? raw.map((p, k) => {
            const q = prev[k];
            return q ? { x: lerp(SMOOTHING, q.x, p.x), y: lerp(SMOOTHING, q.y, p.y) } : p;
          })
        : raw;
    nextSmoothed.push(pts);

    // Each streamline gets its own fixed width (0.55x..1.45x the base), so the set
    // reads as varied ribbons rather than a uniform comb — stable per index, not
    // re-randomized every redraw.
    ctx.lineWidth = opts.width * (0.55 + hash1(i * 3.17 + 11) * 0.9);
    ctx.beginPath();
    ctx.moveTo(pts[0].x * w, pts[0].y * h);
    // Smooth curve through the traced points: a quadratic segment from each point to
    // the midpoint of it and the next, which rounds off every joint automatically.
    for (let k = 1; k < pts.length - 1; k++) {
      const midX = ((pts[k].x + pts[k + 1].x) / 2) * w;
      const midY = ((pts[k].y + pts[k + 1].y) / 2) * h;
      ctx.quadraticCurveTo(pts[k].x * w, pts[k].y * h, midX, midY);
    }
    const last = pts[pts.length - 1];
    ctx.lineTo(last.x * w, last.y * h);
    ctx.stroke();
  }

  state.smoothed = nextSmoothed;
}
