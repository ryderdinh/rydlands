"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

// A viewfinder-style reticle (four corner brackets), not a glow blob — reads as
// an inspector tool crosshair rather than a decorative cursor effect.
export default function CustomCursor() {
  const reticleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const reticle = reticleRef.current;
    if (!reticle) return;

    gsap.set(reticle, { x: -100, y: -100 });

    const xTo = gsap.quickTo(reticle, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(reticle, "y", { duration: 0.4, ease: "power3" });

    function move(e: MouseEvent) {
      xTo(e.clientX);
      yTo(e.clientY);
    }
    window.addEventListener("mousemove", move);

    function onEnter() {
      reticle!.classList.add("is-active");
      gsap.to(reticle, { scale: 1.6, duration: 0.25, ease: "power2.out" });
    }
    function onLeave() {
      reticle!.classList.remove("is-active");
      gsap.to(reticle, { scale: 1, duration: 0.25, ease: "power2.out" });
    }

    const interactive = document.querySelectorAll("a, button");
    interactive.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      window.removeEventListener("mousemove", move);
      interactive.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <div ref={reticleRef} className="cursor-reticle" aria-hidden="true">
      <span className="cursor-tick cursor-tick-tl" />
      <span className="cursor-tick cursor-tick-tr" />
      <span className="cursor-tick cursor-tick-bl" />
      <span className="cursor-tick cursor-tick-br" />
    </div>
  );
}
