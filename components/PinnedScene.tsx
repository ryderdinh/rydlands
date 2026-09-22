"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Pins a section for one scroll "beat" and scrubs it in and back out with a
// focus-pull (blur + scale + opacity) rather than letting it slide past in
// normal document flow — every section becomes a scene the page cuts to,
// matching the pattern HeroPinned/ProjectGallery already use, instead of a
// stop along a continuous slide. Desktop/fine-pointer only: on touch or
// reduced-motion this renders as a plain block and the section's own
// content (ScrollReveal `pinOwned`, SkillGrid `pinOwned`) supplies its
// normal scroll-triggered entrance instead.
export default function PinnedScene({
  children,
  id,
  className,
}: {
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  const sceneRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const content = contentRef.current;
    if (!scene || !content) return;
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse), (hover: none)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scene,
          start: "top top",
          end: "+=100%",
          scrub: 1,
          pin: true,
        },
      });
      tl.fromTo(
        content,
        { autoAlpha: 0, scale: 0.94, filter: "blur(14px)" },
        { autoAlpha: 1, scale: 1, filter: "blur(0px)", ease: "none", duration: 0.3 },
        0
      ).to(
        content,
        { autoAlpha: 0, scale: 1.05, filter: "blur(14px)", ease: "none", duration: 0.3 },
        0.7
      );
    }, scene);

    return () => ctx.revert();
  }, []);

  return (
    <section id={id} className={`scene-pin ${className ?? ""}`} ref={sceneRef}>
      <div className="scene-pin-content" ref={contentRef}>
        {children}
      </div>
    </section>
  );
}
