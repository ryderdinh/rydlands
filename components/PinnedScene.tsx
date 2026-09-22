"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Pins a section for one scroll "beat" and flies the camera through it: the
// content arrives tilted back and out of focus in real 3D perspective
// (rotateX + translateZ, not a CSS scale trick standing in for depth),
// levels out flat for a clear dwell, then keeps traveling forward and tilts
// away as the next scene cuts in — each section reads as a place the camera
// visits, not a card that fades past on a flat page. Desktop/fine-pointer
// only: on touch or reduced-motion this renders as a plain block and the
// section's own content (ScrollReveal `pinOwned`, SkillGrid `pinOwned`)
// supplies its normal scroll-triggered entrance instead.
export default function PinnedScene({
  children,
  id,
  className,
  accent = "teal",
}: {
  children: ReactNode;
  id?: string;
  className?: string;
  /** Which system accent tints this scene's ambient glow — a distinct
   * "location" per scene rather than every section sharing one backdrop. */
  accent?: "teal" | "gold";
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
      gsap.set(content, { transformPerspective: 1000, transformOrigin: "50% 30%" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scene,
          start: "top top",
          end: "+=120%",
          scrub: 0.4,
          pin: true,
        },
      });
      // Arrive: tilted back and distant, leveling out to a clear, held read.
      tl.fromTo(
        content,
        { autoAlpha: 0, scale: 0.9, rotateX: 12, y: 90, z: -240, filter: "blur(18px)" },
        {
          autoAlpha: 1,
          scale: 1,
          rotateX: 0,
          y: 0,
          z: 0,
          filter: "blur(0px)",
          ease: "power2.out",
          duration: 0.16,
        },
        0
      )
        // Depart: keep flying forward, tilting away past the viewer.
        .to(
          content,
          {
            autoAlpha: 0,
            scale: 1.08,
            rotateX: -10,
            y: -80,
            z: 180,
            filter: "blur(18px)",
            ease: "power2.in",
            duration: 0.16,
          },
          0.84
        );
    }, scene);

    return () => ctx.revert();
  }, []);

  return (
    <section id={id} className={`scene-pin scene-pin--${accent} ${className ?? ""}`} ref={sceneRef}>
      <div className="scene-pin-content" ref={contentRef}>
        <div className="container">{children}</div>
      </div>
    </section>
  );
}
