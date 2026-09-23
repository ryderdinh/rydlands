"use client";

import { useEffect, useRef } from "react";
import { Application, Container, Sprite, Texture } from "pixi.js";
import { prefersReducedMotion } from "@/lib/motion";

// Silk-ribbon smoke, drawn as a sprite system (Pixi.js): a few dozen long,
// opaque-cored ribbons sweep from a low source across the frame, climbing and
// thickening as they go, the way the Chamber reveal art's smoke streams do.
// Not round puffs — a round dot reads as a cloud, and the reference is
// long flowing bands with fine striations inside. Layered over the always-on
// CSS `.hero-streaks` band, which stays the fallback wherever this can't run
// (reduced motion, WebGL unavailable).

// Discrete tints, never blended into each other: gold->teal mixes through
// green, which reads as mud. Layered overlap of the three is what gives the
// multi-colour look.
const COLORS = [0x4fd1c5, 0xffd166, 0xfff4d6];

// One ribbon texture, drawn as a wedge: a point at the tail (left) widening
// to full thickness at the head (right), so a ribbon is itself a thin
// triangle and a fan of them reads as one big triangular plume. Solid through
// the middle (nothing shows through), feathered along the top and bottom,
// with a few faint curved striations cut out so it reads as silk, not a flat
// shape. Generated once per variant and shared (tinted/scaled per-instance).
const RIBBON_W = 512;
const RIBBON_H = 128;
const RIBBON_VARIANTS = 4;
const SLICE = 4;

function createRibbonTextures(): Texture[] {
  const textures: Texture[] = [];
  for (let v = 0; v < RIBBON_VARIANTS; v++) {
    const canvas = document.createElement("canvas");
    canvas.width = RIBBON_W;
    canvas.height = RIBBON_H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return [Texture.EMPTY];
    const cy = RIBBON_H / 2;
    const ripple = 0.05 + Math.random() * 0.06;
    for (let x = 0; x < RIBBON_W; x += SLICE) {
      const t = x / RIBBON_W;
      const half = cy * Math.pow(t, 0.85) * (1 + ripple * Math.sin(t * 7 + v * 1.7));
      if (half < 0.5) continue;
      const a = Math.min(t / 0.1, 1) * Math.min((1 - t) / 0.08, 1);
      const g = ctx.createLinearGradient(0, cy - half, 0, cy + half);
      g.addColorStop(0, "rgba(255,255,255,0)");
      g.addColorStop(0.2, `rgba(255,255,255,${a})`);
      g.addColorStop(0.8, `rgba(255,255,255,${a})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(x, cy - half, SLICE + 1, half * 2);
    }
    ctx.globalCompositeOperation = "destination-out";
    for (let i = 0; i < 8; i++) {
      const y = RIBBON_H * (0.3 + Math.random() * 0.4);
      ctx.lineWidth = 1 + Math.random() * 3;
      ctx.strokeStyle = `rgba(0,0,0,${0.12 + Math.random() * 0.28})`;
      ctx.beginPath();
      ctx.moveTo(RIBBON_W * 0.3, cy);
      ctx.quadraticCurveTo(
        RIBBON_W * 0.65,
        y + (Math.random() - 0.5) * RIBBON_H * 0.3,
        RIBBON_W,
        y + (Math.random() - 0.5) * RIBBON_H * 0.2,
      );
      ctx.stroke();
    }
    textures.push(Texture.from(canvas));
  }
  return textures;
}

interface Ribbon {
  sprite: Sprite;
  // Head position; the body trails behind it along `angle`.
  hx: number;
  hy: number;
  angle: number;
  speed: number;
  traveled: number;
  age: number;
  life: number;
  phase: number;
  length: number;
  thickness: number;
  color: number;
  // Fixed heading (radians, up = negative) this ribbon fans out at.
  fan: number;
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

      const textures = createRibbonTextures();
      const container = new Container();
      app.stage.addChild(container);

      // A modest pool of long, near-opaque ribbons; normal (source-over)
      // blending so where they pile up it is solid, not see-through light.
      const POOL_SIZE = 70;
      const ribbons: Ribbon[] = [];

      // Every ribbon fans out from one apex at the bottom-left corner, each
      // at its own fixed heading: from hugging the bottom edge to climbing
      // steeply. The union of the fan is a triangle — pointed at the corner,
      // flat along the bottom, its top edge rising toward the right — and
      // the ribbons' own wedge shape and flare (see tick) widen it further.
      // A small slow undulation keeps the bands from running ruler-straight.
      function flowAngle(r: Ribbon) {
        return r.fan + Math.sin(r.hx * 0.006 + r.phase + r.age * 0.8) * 0.035;
      }

      function resetRibbon(r: Ribbon, fresh: boolean) {
        const w = app!.renderer.width / app!.renderer.resolution;
        const h = app!.renderer.height / app!.renderer.resolution;
        // Apex just off the bottom-left corner, a hair below the bottom edge
        // so the flat bottom of the plume is clipped by the canvas rather
        // than showing a feathered gap.
        r.hx = -w * (0.03 + Math.random() * 0.04);
        r.hy = h * (0.97 + Math.random() * 0.05);
        r.fan = -(0.01 + Math.pow(Math.random(), 0.9) * 0.4);
        r.speed = w * (0.34 + Math.random() * 0.16);
        r.age = 0;
        r.life = 2.8 + Math.random() * 1;
        r.traveled = 0;
        r.phase = Math.random() * Math.PI * 2;
        r.angle = flowAngle(r);
        r.length = w * (0.5 + Math.random() * 0.4);
        r.thickness = Math.min(w, h) * (0.1 + Math.random() * 0.14);
        const pick = Math.random();
        r.color = pick < 0.3 ? COLORS[0] : pick < 0.75 ? COLORS[1] : COLORS[2];
        r.sprite.texture = textures[Math.floor(Math.random() * textures.length)];
        if (fresh) {
          // Only the initial fill needs a head start, so the pool starts
          // already strung out along the plume instead of stacked at the
          // apex.
          const steps = Math.floor(Math.random() * r.life * 30);
          for (let i = 0; i < steps; i++) advance(r, 1 / 30);
        }
      }

      function advance(r: Ribbon, dt: number) {
        r.age += dt;
        // Ease the heading toward the flow field rather than snapping to it.
        r.angle += (flowAngle(r) - r.angle) * Math.min(1, dt * 3);
        const step = r.speed * dt;
        r.hx += Math.cos(r.angle) * step;
        r.hy += Math.sin(r.angle) * step;
        r.traveled += step;
      }

      for (let i = 0; i < POOL_SIZE; i++) {
        const sprite = new Sprite(textures[0]);
        sprite.anchor.set(0.5);
        sprite.alpha = 0;
        const r: Ribbon = {
          sprite,
          hx: 0,
          hy: 0,
          angle: 0,
          speed: 0,
          traveled: 0,
          age: 0,
          life: 1,
          phase: 0,
          length: 1,
          thickness: 1,
          color: 0,
          fan: 0,
        };
        resetRibbon(r, true);
        container.addChild(sprite);
        ribbons.push(r);
      }

      const tick = (ticker: { deltaMS: number }) => {
        const dt = Math.min(ticker.deltaMS / 1000, 1 / 30);
        const w = app!.renderer.width / app!.renderer.resolution;
        const h = app!.renderer.height / app!.renderer.resolution;
        for (const r of ribbons) {
          advance(r, dt);
          if (r.age >= r.life) {
            resetRibbon(r, false);
            continue;
          }
          const tNorm = r.age / r.life;

          // The ribbon grows out of the source: its tail stays pinned there
          // until it has travelled a full length, then it trails the head.
          const len = Math.min(r.length, r.traveled) + 1;
          const cos = Math.cos(r.angle);
          const sin = Math.sin(r.angle);
          const sprite = r.sprite;
          sprite.x = r.hx - cos * len * 0.5;
          sprite.y = r.hy - sin * len * 0.5;
          sprite.rotation = r.angle;
          // Thicker the farther along the flow it is — the stream flares as
          // it sweeps right.
          const flare = 0.3 + 1.4 * Math.min(Math.max(r.hx / w, 0), 1);
          sprite.scale.set(len / RIBBON_W, (r.thickness * flare) / RIBBON_H);
          sprite.tint = r.color;

          const fadeIn = Math.min(tNorm / 0.12, 1);
          const fadeOut = Math.min((1 - tNorm) / 0.35, 1);
          // Keeps the stream in the lower part of the frame; the climb is
          // shallow enough that this only trims outliers on desktop. On
          // mobile the margin is much tighter (CTA row ends around y=0.57h,
          // character starts around y=0.65h), so it does real work there.
          const topFall = isNarrow
            ? Math.min(Math.max((sprite.y / h - 0.66) / 0.1, 0), 1)
            : Math.min(Math.max((sprite.y / h - 0.3) / 0.15, 0), 1);
          sprite.alpha = 0.88 * fadeIn * fadeOut * topFall;
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
