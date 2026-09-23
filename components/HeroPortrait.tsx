"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

// The hero portrait, with an occasional digital glitch. Idle it is a plain
// image. Every few seconds a short burst plays: the red and cyan channels of
// the picture split apart sideways (chromatic aberration), a horizontal band of
// it shears off to one side, and the whole image jitters and skews for a few
// frames, then snaps back. The colour channels are SVG feColorMatrix copies of
// the same image, screen-blended over it; the sheared band is a clipped copy.
// Nothing here is a second asset: every layer is the same portrait file.
const FIRST_DELAY_S = 3.5; // after mount: the preloader still covers the page

// Live values read at the start of every burst, seeded with the defaults below.
// GlitchTuner (the dev-only sliders) writes here so a look can be found by eye
// and copied back into these numbers. Each "random range" below is
// [value * 0.3..0.6, value]: the slider sets the top, bursts vary under it.
export const glitchTuning = {
  auto: 1, // 1 = bursts repeat by themselves, 0 = only the trigger button
  gapMin: 3, // seconds between bursts
  gapMax: 6,
  steps: 5, // hard-cut frames per burst (varies between 60% and 100% of this)
  speed: 1.55, // > 1 = each frame is shorter
  split: 30, // px the red / cyan channels part by
  intensity: 0.3, // opacity of the channel and band layers while a burst is on
  bandShift: 98, // px the sheared band slides sideways
  bandHeight: 7, // % of the image height the band can cover
  jitter: 7.5, // px the whole image shakes sideways
  skew: 0.75, // degrees the whole image shears
  stutter: 0.25, // chance of a clean frame between two glitch frames
};

// Starts a burst now (CardTuner-style "play again"); set by the mounted portrait.
let burstNow: (() => void) | null = null;
export function triggerGlitch() {
  burstNow?.();
}

function Picture({ className }: { className?: string }) {
  return (
    <picture className={className}>
      <source srcSet="/ryder-portrait.webp" type="image/webp" />
      <img src="/ryder-portrait.png" alt="" />
    </picture>
  );
}

export default function HeroPortrait() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    const main = root.querySelector(".hero-glitch-main");
    const red = root.querySelector(".hero-glitch-red");
    const cyan = root.querySelector(".hero-glitch-cyan");
    const slice = root.querySelector(".hero-glitch-slice");
    if (!main || !red || !cyan || !slice) return;

    const rnd = gsap.utils.random;
    let pending: gsap.core.Tween | null = null;
    let running: gsap.core.Timeline | null = null;

    const reset = () => {
      gsap.set([red, cyan, slice], { opacity: 0, x: 0 });
      gsap.set(main, { x: 0, skewX: 0 });
    };

    const burst = () => {
      pending?.kill();
      running?.kill();
      reset();
      const g = glitchTuning;
      const tl = gsap.timeline({
        onComplete: () => {
          pending = g.auto ? gsap.delayedCall(rnd(g.gapMin, Math.max(g.gapMin, g.gapMax)), burst) : null;
        },
      });
      running = tl;
      const steps = Math.max(1, Math.round(rnd(g.steps * 0.6, g.steps)));
      const frame = (lo: number, hi: number) => rnd(lo, hi) / Math.max(g.speed, 0.1);
      let at = 0;
      for (let i = 0; i < steps; i++) {
        const split = rnd(g.split * 0.3, g.split);
        const height = rnd(g.bandHeight * 0.25, g.bandHeight);
        const top = rnd(5, Math.max(6, 95 - height));
        // Each step is a hard cut, not a tween: glitches don't ease.
        tl.set([red, cyan, slice], { opacity: g.intensity }, at)
          .set(red, { x: -split }, at)
          .set(cyan, { x: split }, at)
          .set(slice, { x: rnd(-g.bandShift, g.bandShift), clipPath: `inset(${top}% 0 ${100 - top - height}% 0)` }, at)
          .set(main, { x: rnd(-g.jitter, g.jitter), skewX: rnd(-g.skew, g.skew) }, at);
        at += frame(0.04, 0.09);
        // Now and then a clean frame in the middle, so it stutters.
        if (i > 0 && i < steps - 1 && Math.random() < g.stutter) {
          tl.set([red, cyan, slice], { opacity: 0 }, at).set(main, { x: 0, skewX: 0 }, at);
          at += frame(0.03, 0.06);
        }
      }
      tl.set([red, cyan, slice], { opacity: 0, x: 0 }, at).set(main, { x: 0, skewX: 0 }, at);
    };

    pending = gsap.delayedCall(FIRST_DELAY_S, burst);
    burstNow = burst;
    return () => {
      burstNow = null;
      pending?.kill();
      running?.kill();
      gsap.set([red, cyan, slice, main], { clearProps: "all" });
    };
  }, []);

  return (
    <div className="hero-character" aria-hidden="true">
      {/* Zero-size SVG holding the filters that isolate the red and the cyan
          (green + blue) channels of an image. */}
      <svg width="0" height="0" style={{ position: "absolute" }} focusable="false">
        <defs>
          <filter id="hero-glitch-red" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          </filter>
          <filter id="hero-glitch-cyan" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
          </filter>
        </defs>
      </svg>
      <div className="hero-portrait" ref={rootRef}>
        <Picture className="hero-glitch-main" />
        <Picture className="hero-glitch-layer hero-glitch-red" />
        <Picture className="hero-glitch-layer hero-glitch-cyan" />
        <Picture className="hero-glitch-layer hero-glitch-slice" />
      </div>
    </div>
  );
}
