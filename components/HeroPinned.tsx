"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { prefersReducedMotion } from "@/lib/motion";
import CardScene, { cardReveal } from "@/components/CardScene";
import HeroSmoke from "@/components/HeroSmoke";
import SkillsRing from "@/components/SkillsRing";
import CardTuner from "@/components/CardTuner";
import RingTuner from "@/components/RingTuner";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Observer);
}

// Temporarily off while the smoke is being redesigned; flip to bring it back.
const SHOW_SMOKE = false;

// The hero is scene one of a full-screen, scene-by-scene page. There is no
// native scrolling: the page is locked to the viewport, and a wheel tick /
// swipe / arrow key plays the transition to the next scene (or back) as a
// timed animation, one step per gesture. Scene one -> two: the poster's
// content lets go (edge lockups, skills ring, portrait, backdrop devices all
// blur out) while the frame and its backdrop contract from the whole screen
// down to the left half, and the metal card (CardScene) rises into it from below. Scrolling
// back up runs the same timeline in reverse. Desktop-only (see .hero-pin
// CSS): on touch/reduced-motion nothing is locked and the hero just stays a
// static full-screen poster.
export default function HeroPinned({ copy, skillsItems }: { copy: ReactNode; skillsItems: string[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  // Which scene the dev tuners should serve; flips the moment a transition starts.
  const [scene, setScene] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const bgEl = bgRef.current;
    const frameEl = frameRef.current;
    if (!wrap || !bgEl || !frameEl) return;
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse), (hover: none)").matches) return;

    // Only lock the page once we know we'll drive it ourselves.
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    let current = 0;
    let locked = false;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });
      // Opacity + blur only, no transforms: several of these already position
      // themselves with CSS transforms (translate(-50%), rotate(180deg)) that
      // a tween would otherwise have to re-parse.
      const letGo = (selector: string, at: number, duration = 0.5, blur = 8) =>
        tl.to(selector, { autoAlpha: 0, filter: `blur(${blur}px)`, duration }, at);

      letGo(".hero-edge-lockup", 0, 0.45);
      letGo(".scroll-cue", 0, 0.25, 0);
      letGo(".skills-ring", 0.08, 0.5);
      letGo(".hero-character", 0.2, 0.5, 10);
      letGo(".hero-ghost-wall", 0.25, 0.45, 0);
      letGo(".hero-scrim", 0.25, 0.45, 0);
      letGo(".hero-streaks", 0.25, 0.45, 0);
      // The frame and its backdrop contract together, once the content has
      // mostly cleared: the right edge travels from the screen's edge to the
      // vertical midline. Explicit percent endpoints so GSAP never has to
      // convert from computed pixels.
      tl.fromTo([bgEl, frameEl], { right: "0%" }, { right: "50%", ease: "power3.inOut", duration: 0.9 }, 0.55);
      // Scene two's card rises into the contracted frame as it settles.
      tl.to(".card-scene", { autoAlpha: 1, ease: "none", duration: 0.4 }, 1.05);
      // Linear on purpose: CardScene runs its own damped springs after this target.
      tl.to(cardReveal, { v: 1, ease: "none", duration: 0.8 }, 1.05);

      // A short cooldown after each transition swallows the tail of a
      // trackpad's inertia, which would otherwise read as a fresh gesture.
      const unlock = () => {
        gsap.delayedCall(0.15, () => {
          locked = false;
        });
      };
      tl.eventCallback("onComplete", unlock);
      tl.eventCallback("onReverseComplete", unlock);

      const go = (next: number) => {
        if (locked || next === current || next < 0 || next > 1) return;
        locked = true;
        current = next;
        setScene(next);
        if (next === 1) tl.play();
        else tl.reverse();
      };

      // wheelSpeed -1 is the Observer convention for "wheel down = onUp":
      // onUp means "advance", onDown means "go back", for wheel and swipe alike.
      // Dragging a tuner slider is a pointer drag, and arrow keys move a
      // focused slider — neither may count as a scene change.
      const inTuner = (t: EventTarget | null) => t instanceof Element && !!t.closest("[data-dev-tuner]");

      const observer = Observer.create({
        target: window,
        ignoreCheck: (e) => inTuner(e.target),
        type: "wheel,touch,pointer",
        wheelSpeed: -1,
        tolerance: 10,
        preventDefault: true,
        onUp: () => go(current + 1),
        onDown: () => go(current - 1),
      });

      const onKey = (e: KeyboardEvent) => {
        if (inTuner(e.target)) return;
        if (["ArrowDown", "PageDown", " "].includes(e.key)) go(current + 1);
        else if (["ArrowUp", "PageUp"].includes(e.key)) go(current - 1);
        else if (e.key === "End") go(1);
        else if (e.key === "Home") go(0);
        else return;
        e.preventDefault();
      };
      window.addEventListener("keydown", onKey);

      return () => {
        observer.kill();
        window.removeEventListener("keydown", onKey);
      };
    }, wrap);

    return () => {
      ctx.revert();
      html.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <div className="hero-pin" id="hero" ref={wrapRef}>
      <div className="hero-bg" ref={bgRef} aria-hidden="true" />
      <div className="hero-ghost-wall" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, row) => (
          <div className="hero-ghost-row" key={row}>
            {"RYDER ".repeat(8)}
          </div>
        ))}
      </div>
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-frame" ref={frameRef} aria-hidden="true">
        <span className="hero-frame-corner tl" />
        <span className="hero-frame-corner tr" />
        <span className="hero-frame-corner bl" />
        <span className="hero-frame-corner br" />
      </div>
      <div className="hero-streaks" aria-hidden="true">
        <span className="hero-streak hero-streak-a" />
        <span className="hero-streak hero-streak-b" />
      </div>
      {SHOW_SMOKE && <HeroSmoke />}
      <div className="hero-edge-lockup hero-edge-lockup--left" aria-hidden="true">
        <span className="hero-edge-tag">Game developer</span>
        <span className="hero-edge-word">Ryder</span>
      </div>
      <div className="hero-edge-lockup hero-edge-lockup--right" aria-hidden="true">
        <span className="hero-edge-word">Ryder</span>
        <span className="hero-edge-tag">Game developer</span>
      </div>
      <div className="container hero">
        <div className="hero-copy-wrap">{copy}</div>
      </div>
      {/* Renders two layers (see .skills-ring--back/--front in globals.css
          and SkillsRing.tsx): one behind .hero-character, one in front of
          him, so the ring actually loops around his body — items on the
          far side of the rotation are hidden by him, items on the near
          side show over him — rather than just steering clear of his
          silhouette. Desktop only (see .skills-ring CSS). */}
      <CardScene />
      <SkillsRing items={skillsItems} />
      <RingTuner visible={scene === 0} />
      <CardTuner visible={scene === 1} />
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
      <div className="scroll-cue">
        scroll to explore
        <span className="scroll-cue-glyph" aria-hidden="true">↓</span>
      </div>
    </div>
  );
}
