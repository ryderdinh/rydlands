"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Pins the hero for an extra scroll span: copy fades/lifts out first while the
// full-bleed 3D backdrop (see HeroScope) flies the camera through open space,
// then a vignette wipes to black to resolve into the next section — a cut,
// not a normal scroll-off. Desktop-only (see .hero-pin CSS): on touch/reduced-
// motion the section is skipped here and falls back to plain auto-height flow.
export default function HeroPinned({ copy, scope }: { copy: ReactNode; scope: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const copyEl = copyRef.current;
    const vignetteEl = vignetteRef.current;
    if (!wrap || !copyEl || !vignetteEl) return;
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse), (hover: none)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "+=130%",
          scrub: 1,
          pin: true,
        },
      });
      tl.to(copyEl, { autoAlpha: 0, y: -50, ease: "none", duration: 0.4 }, 0).to(
        vignetteEl,
        { autoAlpha: 1, ease: "none", duration: 0.28 },
        0.72
      );
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <div className="hero-pin" id="hero" ref={wrapRef}>
      {scope}
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-vignette" ref={vignetteRef} aria-hidden="true" />
      <div className="container hero">
        <div className="hero-copy-wrap" ref={copyRef}>
          {copy}
        </div>
      </div>
    </div>
  );
}
