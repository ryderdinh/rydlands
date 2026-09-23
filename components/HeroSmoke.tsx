"use client";

import { useEffect, useRef } from "react";
import { Application, Container, Sprite, Texture } from "pixi.js";
import { prefersReducedMotion } from "@/lib/motion";

// A real sprite particle system, not an analytic shader shape — that's the
// point of using Pixi here. Several rounds of raw-WebGL gaussian ribbons all
// read as smooth vector shapes (clean, mathematically continuous edges), no
// matter how their width/taper/noise was tuned, because a single continuous
// analytic band just doesn't have the texture organic smoke/light trails
// have. Real VFX tools (Unity's Shuriken, Unreal's Niagara — the reference's
// own poster likely came from something in this family) build that texture
// from many small soft sprites with randomized size/opacity/drift, not one
// continuous shape. Pixi is a right-sized choice for that: a 2D sprite/
// particle renderer with blend modes, not a 3D scene graph — the same
// reasoning that kept the smoke's previous version on plain WebGL instead of
// pulling in Three.js applies here too; this is a sprite compositor, not a
// 3D engine. No-reduced-motion only — unlike the shader version this
// replaced, there's no separate pointer/hover gate: a ~90-sprite particle
// pool is a trivial GPU workload (mobile games run far larger ones), so the
// old "desktop/fine-pointer only" restriction (really a proxy for "don't
// run a per-pixel fragment shader on a weak mobile GPU") doesn't apply to
// it. Layered above the always-on CSS `.hero-streaks` band, which stays the
// fallback wherever this can't run (reduced motion, WebGL unavailable).

const TEAL: [number, number, number] = [79, 209, 197];
const GOLD: [number, number, number] = [255, 209, 102];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function mixColor(t: number): number {
  const r = Math.round(lerp(TEAL[0], GOLD[0], t));
  const g = Math.round(lerp(TEAL[1], GOLD[1], t));
  const b = Math.round(lerp(TEAL[2], GOLD[2], t));
  return (r << 16) | (g << 8) | b;
}

// A soft radial-gradient "puff" brush, generated once and reused for every
// particle (tinted/scaled per-instance) — the same technique a Shuriken/
// Niagara smoke texture uses, not a fabricated image asset, just a plain
// feathered dot drawn to an offscreen canvas.
function createPuffTexture(): Texture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Texture.EMPTY;
  const r = size / 2;
  const gradient = ctx.createRadialGradient(r, r, 0, r, r, r);
  gradient.addColorStop(0, "rgba(255,255,255,0.9)");
  gradient.addColorStop(0.35, "rgba(255,255,255,0.55)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return Texture.from(canvas);
}

interface Particle {
  sprite: Sprite;
  vx: number;
  vy: number;
  age: number;
  life: number;
  wobblePhase: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  baseScale: number;
  hue: number;
}

// Low across the bottom of the frame, left to right, with only a gentle
// rise — not a comet shooting diagonally up from a corner. Confirmed
// against the actual Chamber reference image: the trail starts low-left,
// stays low the whole way, and only lifts slightly as it sweeps right.
// Screen-space y-down, so "rising" is a small negative y component.
const FLOW = normalize(1, -0.16);
const ACROSS = normalize(-FLOW[1], FLOW[0]);

function normalize(x: number, y: number): [number, number] {
  const len = Math.hypot(x, y) || 1;
  return [x / len, y / len];
}

export default function HeroSmoke() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;
    if (prefersReducedMotion()) return;

    // Mobile isn't just a smaller version of the same layout — the copy
    // column runs full-width there with the CTA row roughly mid-canvas
    // and the character starting below it (see HeroPinned's mobile flow),
    // instead of desktop's narrow left column with the CTA tucked low.
    // The safe region for the trail to start from and stay inside of is
    // genuinely different, not just scaled, so it's tuned per layout
    // rather than as one set of fractions. Calibrated against the actual
    // on-page bounding boxes of .cta-row/.hero-character at this
    // breakpoint, the same way the desktop thresholds were against the
    // headline.
    const isNarrow = window.matchMedia("(max-width: 900px)").matches;

    let destroyed = false;
    let app: Application | null = null;
    let onVisibility: (() => void) | null = null;

    (async () => {
      const application = new Application();
      try {
        await application.init({
          canvas,
          // Pointed at the wrapper, not the canvas itself: resizeTo: canvas
          // creates a self-referential loop — Pixi's autoDensity sets an
          // inline width/height style directly on the canvas, which (being
          // more specific than the CSS width: 100% rule) becomes the
          // canvas's own new authoritative size, which Pixi then measures
          // again on the next resize check. In practice this got stuck at
          // Pixi's 800×600 fallback default the instant that first
          // measurement landed before layout was fully settled, silently
          // capping the canvas at 800px wide regardless of the hero's
          // actual (1440px+) width — every position tuned as a fraction of
          // "canvas width" was quietly wrong by whatever that ratio was.
          // The wrapper only ever gets sized by plain CSS percentages
          // against .hero-pin, so it can't be corrupted by Pixi's own
          // inline styling the way the canvas can.
          resizeTo: wrapper,
          backgroundAlpha: 0,
          antialias: true,
          resolution: Math.min(window.devicePixelRatio, 1.5),
          autoDensity: true,
          powerPreference: "low-power",
        });
      } catch {
        // WebGL unavailable or context creation failed — leave the always-
        // on CSS .hero-streaks fallback as the only effect, same as the
        // pointer/reduced-motion gates above.
        return;
      }
      if (destroyed) {
        application.destroy(true, { children: true, texture: true });
        return;
      }
      app = application;

      const puffTexture = createPuffTexture();
      const container = new Container();
      app.stage.addChild(container);

      // Modest pool, small sprites, low per-particle alpha: the first pass
      // used 140 large (up to 280px) sprites at 0.32 alpha on "add" —
      // enough overlap near the source to saturate straight to a blown-out
      // white disc before any individual-puff texture could read. Fewer,
      // smaller, dimmer sprites leave the overlaps additive blending is
      // good at (bright where several genuinely coincide) without every
      // near-source frame clipping to white.
      const POOL_SIZE = 130;
      const particles: Particle[] = [];

      function resetParticle(p: Particle, fresh: boolean) {
        const w = app!.renderer.width / app!.renderer.resolution;
        const h = app!.renderer.height / app!.renderer.resolution;
        // Source sits low and just clear of the copy — on desktop that
        // means to the right of the narrow text column (which runs out to
        // roughly x=0.42w); on mobile the copy runs full-width with the
        // CTA row mid-canvas, so "clear of the copy" instead means near
        // the left edge, below where the CTA row ends and the character
        // begins. Either way, a fixed origin point the whole trail flares
        // from and sweeps right from, matching the reference. Each
        // particle also gets its own perpendicular offset at spawn (not
        // just a velocity-angle spread), so the trail has width from the
        // start instead of every particle emitting from one exact point.
        const perpOffset = (Math.random() - 0.5) * h * 0.07;
        const sourceXFrac = isNarrow ? 0.12 : 0.46;
        const sourceYFrac = isNarrow ? 0.78 : 0.9;
        const sx = w * sourceXFrac + (Math.random() - 0.5) * w * 0.03 + ACROSS[0] * perpOffset;
        const sy = h * sourceYFrac + (Math.random() - 0.5) * h * 0.03 + ACROSS[1] * perpOffset;
        const speed = w * (0.2 + Math.random() * 0.14); // px/sec, scales with canvas width now that travel is mostly horizontal
        const spread = (Math.random() - 0.5) * 0.6;
        p.vx = (FLOW[0] + ACROSS[0] * spread) * speed;
        p.vy = (FLOW[1] + ACROSS[1] * spread) * speed;
        p.life = 1.1 + Math.random() * 1.3;
        // Only the initial pool fill needs an in-flight head start — a
        // reset mid-animation should always restart clean at the source.
        // Without this, every pool particle spawns with position pinned
        // to the source regardless of its assigned age, so the whole pool
        // sits stacked on top of each other for the first ~1.5s of real
        // time (however "old" their age field claims to be) instead of
        // already being spread out along the trail — additive blending
        // 140 overlapping sprites at one point reads as a single blown-out
        // disc, not a tail.
        p.age = fresh ? Math.random() * p.life : 0;
        p.sprite.x = sx + p.vx * p.age;
        p.sprite.y = sy + p.vy * p.age;
        p.wobblePhase = Math.random() * Math.PI * 2;
        p.wobbleSpeed = 0.6 + Math.random() * 0.8;
        p.wobbleAmp = h * (0.01 + Math.random() * 0.02);
        // Sized off the canvas's smaller dimension, not always h: on
        // desktop's wide box those're the same thing, but on mobile's much
        // narrower, tall box, sizing purely off h produced sprites wide
        // enough relative to the actual (narrow) width to blow out into
        // one solid cluster instead of a readable trail.
        p.baseScale = (0.05 + Math.random() * 0.09) * (Math.min(w, h) / 128);
        p.hue = Math.random();
        p.sprite.tint = mixColor(p.hue);
      }

      for (let i = 0; i < POOL_SIZE; i++) {
        const sprite = new Sprite(puffTexture);
        sprite.anchor.set(0.5);
        // "screen" over "add": screen's 1-(1-a)(1-b) accumulation
        // approaches white asymptotically as sprites overlap, rather than
        // "add"'s straight sum, which clips to solid white the moment
        // enough sprites coincide — exactly what produced the single
        // blown-out disc in the first pass.
        sprite.blendMode = "screen";
        const p: Particle = {
          sprite,
          vx: 0,
          vy: 0,
          age: 0,
          life: 1,
          wobblePhase: 0,
          wobbleSpeed: 1,
          wobbleAmp: 0,
          baseScale: 1,
          hue: 0,
        };
        resetParticle(p, true);
        container.addChild(sprite);
        particles.push(p);
      }

      const tick = (ticker: { deltaMS: number }) => {
        const dt = Math.min(ticker.deltaMS / 1000, 1 / 30);
        const w = app!.renderer.width / app!.renderer.resolution;
        const h = app!.renderer.height / app!.renderer.resolution;
        for (const p of particles) {
          p.age += dt;
          if (p.age >= p.life) {
            resetParticle(p, false);
            continue;
          }
          const tNorm = p.age / p.life;
          p.wobblePhase += dt * p.wobbleSpeed;
          const wobble = Math.sin(p.wobblePhase) * p.wobbleAmp * tNorm;
          p.sprite.x += p.vx * dt + ACROSS[0] * wobble * dt * 4;
          p.sprite.y += p.vy * dt + ACROSS[1] * wobble * dt * 4;

          // Grows slightly then thins toward the end of life — a puff
          // expanding and dissipating, not a fixed-size dot fading out.
          const growth = Math.sin(tNorm * Math.PI) * 0.4 + 0.8;
          // Stretched and oriented along its own velocity — a round dot
          // reads as a static cluster near the source no matter how many
          // of them there are; elongating each one into a small streak
          // pointed the way it's actually moving is what makes the flow
          // direction and the "flying" motion read at a glance, the same
          // way a motion-streak/comet sprite works in a real particle
          // system rather than a puff of smoke.
          p.sprite.rotation = Math.atan2(p.vy, p.vx);
          p.sprite.scale.set(p.baseScale * growth * 2.6, p.baseScale * growth * 0.6);

          // Fade in fast, hold, fade out over each particle's own life.
          const fadeIn = Math.min(tNorm / 0.12, 1);
          const fadeOut = Math.min((1 - tNorm) / 0.35, 1);
          // A defensive left-edge cutoff on desktop, not the main
          // containment (the source already spawns clear of the copy
          // column at x=0.46w) — guards against perpendicular wobble
          // drifting a particle back toward the text. Not needed on
          // mobile: the copy sits above this effect's vertical band there
          // (see topFall), not beside it, so there's no text to its left
          // to protect.
          const edgeFall = isNarrow
            ? 1
            : Math.min(Math.max((p.sprite.x / w - 0.14) / 0.28, 0), 1);
          // Keeps the trail low in the frame the way the reference does.
          // On desktop it never rises past roughly the lower half even as
          // it sweeps right and gently up — the flow direction/speed
          // already keep a typical particle well within this on their
          // own, so this is a safety net for outliers, not the primary
          // mechanism. On mobile the margin is much tighter (the CTA row
          // ends around y=0.57h and the character starts around y=0.65h),
          // so the cutoff has to do more of the actual containment work
          // there, calibrated directly against those bounding boxes.
          const topFall = isNarrow
            ? Math.min(Math.max((p.sprite.y / h - 0.66) / 0.1, 0), 1)
            : Math.min(Math.max((p.sprite.y / h - 0.45) / 0.15, 0), 1);
          p.sprite.alpha = 0.28 * fadeIn * fadeOut * edgeFall * topFall;
        }
      };

      app.ticker.add(tick);

      onVisibility = () => {
        if (!app) return;
        if (document.hidden) app.ticker.stop();
        else app.ticker.start();
      };
      document.addEventListener("visibilitychange", onVisibility);
    })();

    return () => {
      destroyed = true;
      if (onVisibility) document.removeEventListener("visibilitychange", onVisibility);
      if (app) app.destroy(true, { children: true, texture: true });
    };
  }, []);

  return (
    <div className="hero-smoke-canvas" ref={wrapperRef} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
