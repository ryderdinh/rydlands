"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollReveal({
  children,
  className,
  stagger = 0.08,
  focusPull = false,
  pinOwned = false,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  /** Cinematic "rack focus" entrance (blur + scale, not just fade/slide) — used
   * for scene handoffs between sections rather than local list reveals. */
  focusPull?: boolean;
  /** True when a parent PinnedScene already owns this section's enter/exit
   * transition on desktop — this component then only supplies the reveal on
   * touch/reduced-motion, where no pin exists, instead of double-animating
   * the same properties as the parent's scrub. */
  pinOwned?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.children.length ? Array.from(el.children) : [el];
    const coarse = window.matchMedia("(pointer: coarse), (hover: none)").matches;

    if (prefersReducedMotion() || (pinOwned && !coarse)) {
      gsap.set(targets, { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" });
      return;
    }

    const from = focusPull
      ? { opacity: 0, y: 36, scale: 0.96, filter: "blur(14px)" }
      : { opacity: 0, y: 28 };
    const to = focusPull
      ? {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power3.out",
        }
      : { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" };

    const ctx = gsap.context(() => {
      gsap.fromTo(targets, from, {
        ...to,
        stagger,
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
          once: true,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [stagger, focusPull, pinOwned]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
