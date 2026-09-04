"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

export function useTilt<T extends HTMLElement>(maxTilt = 8) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    // quickTo's reset path looks up the property by its literal string, unresolved
    // through GSAP's alias table — "rotateX"/"rotateY" are aliases for the real
    // internal names "rotationX"/"rotationY", so quickTo must use the real names
    // directly or every reset warns "not eligible for reset".
    const rotX = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3" });
    const rotY = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3" });

    function onMove(e: MouseEvent) {
      const r = el!.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      rotY((px - 0.5) * maxTilt * 2);
      rotX(-(py - 0.5) * maxTilt * 2);
      el!.style.setProperty("--mx", `${px * 100}%`);
      el!.style.setProperty("--my", `${py * 100}%`);
    }

    function onLeave() {
      rotX(0);
      rotY(0);
    }

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [maxTilt]);

  return ref;
}
