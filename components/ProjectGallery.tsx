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
// swipeable horizontal scroller (see .projects-track CSS fallback).
export default function ProjectGallery({ projects }: { projects: Project[] }) {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) return;
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse), (hover: none)").matches) return;

    const ctx = gsap.context(() => {
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
        },
      });
    }, pin);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" className="projects-pin" ref={pinRef}>
      <div className="projects-viewport">
        <div className="projects-head">
          <p className="eyebrow">đã triển khai</p>
          <h2>Case study kỹ thuật</h2>
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
              <span className="project-tag">{p.tag}</span>
              <h3>{p.title}</h3>
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
