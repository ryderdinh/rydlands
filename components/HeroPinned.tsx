"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";
import HeroSmoke from "@/components/HeroSmoke";
import SkillsRing from "@/components/SkillsRing";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Pins the hero for an extra scroll span: copy fades/lifts out first, then a
// vignette wipes to black to resolve into the next section — a cut, not a
// normal scroll-off. Desktop-only (see .hero-pin CSS): on touch/reduced-
// motion the section is skipped here and falls back to plain auto-height flow.
export default function HeroPinned({ copy, skillsItems }: { copy: ReactNode; skillsItems: string[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const copyEl = copyRef.current;
    const vignetteEl = vignetteRef.current;
    const cueEl = cueRef.current;
    if (!wrap || !copyEl || !vignetteEl) return;
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse), (hover: none)").matches) return;

    const ctx = gsap.context(() => {
      gsap.set(copyEl, { transformPerspective: 900, transformOrigin: "0% 100%" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "+=130%",
          scrub: 0.4,
          pin: true,
        },
      });
      // The copy doesn't just fade up — it tilts and pulls back like the
      // camera lifting off it, the same flight grammar PinnedScene uses for
      // every later scene boundary.
      tl.to(
        copyEl,
        { autoAlpha: 0, y: -60, z: 80, rotateX: -10, filter: "blur(6px)", ease: "power2.in", duration: 0.4 },
        0
      )
        .to(cueEl, { autoAlpha: 0, ease: "none", duration: 0.15 }, 0)
        // The pin's own scroll-out cross-dissolves the render surface to black —
        // this is the "cut" the next (pinned) section fades up from, rather than
        // an ordinary section boundary.
        .to(vignetteEl, { autoAlpha: 1, ease: "none", duration: 0.28 }, 0.72);
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <div className="hero-pin" id="hero" ref={wrapRef}>
      <div className="hero-ghost-wall" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, row) => (
          <div className="hero-ghost-row" key={row}>
            {"RYDER ".repeat(8)}
          </div>
        ))}
      </div>
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-vignette" ref={vignetteRef} aria-hidden="true" />
      <div className="hero-streaks" aria-hidden="true">
        <span className="hero-streak hero-streak-a" />
        <span className="hero-streak hero-streak-b" />
      </div>
      <HeroSmoke />
      <div className="hero-edge-lockup hero-edge-lockup--left" aria-hidden="true">
        <span className="hero-edge-tag">Portfolio reveal</span>
        <span className="hero-edge-word">Ryder</span>
      </div>
      <div className="hero-edge-lockup hero-edge-lockup--right" aria-hidden="true">
        <span className="hero-edge-word">Ryder</span>
        <span className="hero-edge-tag">Unity developer</span>
      </div>
      <div className="hero-frame" aria-hidden="true">
        <span className="hero-frame-corner tl" />
        <span className="hero-frame-corner tr" />
        <span className="hero-frame-corner bl" />
        <span className="hero-frame-corner br" />
      </div>
      <div className="container hero">
        <div className="hero-copy-wrap" ref={copyRef}>
          {copy}
        </div>
      </div>
      {/* Before .hero-character in the DOM on purpose: both sit at
          z-index: 1, so the character (later in the DOM) paints on top of
          the ring where they overlap — it reads as passing behind him,
          not through him. Desktop only (see .skills-ring CSS). */}
      <SkillsRing items={skillsItems} />
      {/* Desktop: absolutely positioned centerpiece, sized off .hero-pin's
          100vh box (see .hero-character). Mobile: that box doesn't exist, so
          this same element switches to normal document flow after the copy
          instead — DOM position here only matters for mobile's stacked
          layout, since desktop's absolute positioning is order-independent. */}
      <div className="hero-character" aria-hidden="true">
        <picture>
          <source srcSet="/ryder-portrait.webp" type="image/webp" />
          <img src="/ryder-portrait.png" alt="" />
        </picture>
      </div>
      <div className="scroll-cue" ref={cueRef}>
        scroll to explore
        <span className="scroll-cue-glyph" aria-hidden="true">↓</span>
      </div>
    </div>
  );
}
