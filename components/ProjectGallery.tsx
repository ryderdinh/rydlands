"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";
import ProjectVessel, { type VesselType } from "@/components/ProjectVessel";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface Project {
  tag: string;
  title: string;
  desc: string;
  stack: string[];
  vessel: { type: VesselType; layers: { h: number; c: string }[]; pulse?: boolean; shimmer?: boolean };
}

// Pins the section and drags the case-study strip left as the page scrolls
// vertically — a "filmstrip" you scrub through rather than a stacked list.
// On touch/reduced-motion the pin is skipped and the strip is left as a plain
// swipeable horizontal scroller (see .projects-track CSS fallback), with a
// scroll-linked per-card entrance below standing in for the pin/scrub so
// touch still gets real scroll-tied motion, not a static stack.
export default function ProjectGallery({ projects }: { projects: Project[] }) {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) return;
    if (prefersReducedMotion()) return;

    const coarse = window.matchMedia("(pointer: coarse), (hover: none)").matches;

    const ctx = gsap.context(() => {
      // The signature hand-off: the first slide arrives through the same
      // scroll span where the hero's vignette cuts to black, so the cut
      // resolves into a project rather than into an empty static heading.
      // Same tilted-arrival grammar PinnedScene uses everywhere else.
      const firstSlide = track.querySelector<HTMLElement>(".project-slide");
      if (firstSlide) {
        gsap.set(firstSlide, { transformPerspective: 1000, transformOrigin: "50% 100%" });
        gsap.fromTo(
          firstSlide,
          { opacity: 0.1, scale: 0.92, rotateX: 10, z: -160, filter: "blur(12px)" },
          {
            opacity: 1,
            scale: 1,
            rotateX: 0,
            z: 0,
            filter: "blur(0px)",
            ease: "power2.out",
            scrollTrigger: { trigger: pin, start: "top bottom", end: "top 55%", scrub: 0.4 },
          }
        );
      }

      if (coarse) {
        gsap.utils.toArray<HTMLElement>(".project-slide").forEach((slide, i) => {
          if (i === 0) return; // first slide already animates via the crossfade above
          gsap.fromTo(
            slide,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: { trigger: slide, start: "top 88%", once: true },
            }
          );
        });
        return;
      }

      const slides = gsap.utils.toArray<HTMLElement>(".project-slide", track);
      slides.forEach((slide) => gsap.set(slide, { transformPerspective: 1200 }));

      // As the camera pans across the row, each card banks slightly toward
      // or away from center — like passing exhibits arranged on an arc,
      // not a flat strip sliding under a static viewport.
      const updateTilt = () => {
        const pinRect = pin.getBoundingClientRect();
        const center = pinRect.left + pinRect.width / 2;
        slides.forEach((slide) => {
          const rect = slide.getBoundingClientRect();
          const delta = (rect.left + rect.width / 2 - center) / pinRect.width;
          gsap.set(slide, { rotateY: gsap.utils.clamp(-12, 12, delta * 22) });
        });
      };

      const distance = () => Math.max(0, track.scrollWidth - pin.clientWidth);
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: updateTilt,
        },
      });
    }, pin);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" className="projects-pin" ref={pinRef}>
      <div className="projects-viewport">
        <div className="projects-head section-head">
          <h2>Case studies</h2>
          <p className="section-sub">
            Four shipped problems: a liquid shader, an event shimmer, an Android ANR
            root-cause, and an iOS ad-mediation system.
          </p>
        </div>
        <div className="projects-track" ref={trackRef}>
          {projects.map((p) => (
            <article className="project-slide" key={p.title}>
              <div className="project-slide-vessel">
                <ProjectVessel
                  type={p.vessel.type}
                  layers={p.vessel.layers}
                  pulse={p.vessel.pulse}
                  shimmer={p.vessel.shimmer}
                />
              </div>
              <h3>{p.title}</h3>
              <span className="project-tag">{p.tag}</span>
              <p>{p.desc}</p>
              <div className="project-stack">
                {p.stack.map((s) => (
                  <span className="chip" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
