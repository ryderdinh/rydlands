"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    if (!dot) return;

    gsap.set(dot, { x: -100, y: -100 });

    const xTo = gsap.quickTo(dot, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.5, ease: "power3" });

    function move(e: MouseEvent) {
      xTo(e.clientX);
      yTo(e.clientY);
    }
    window.addEventListener("mousemove", move);

    function onEnter() {
      gsap.to(dot, { scale: 2.6, duration: 0.3, ease: "power2.out" });
    }
    function onLeave() {
      gsap.to(dot, { scale: 1, duration: 0.3, ease: "power2.out" });
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

  return <div ref={dotRef} className="cursor-blob" aria-hidden="true" />;
}
