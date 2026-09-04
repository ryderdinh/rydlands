"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SECTION_IDS = ["hero", "skills", "projects", "about", "contact"];

// A fixed scroll-position readout — reads like a render/profiler timeline
// scrubber rather than a generic "back to top" progress bar.
export default function ScrollHud() {
  const fillRef = useRef<HTMLDivElement>(null);
  const [percent, setPercent] = useState(0);
  const [section, setSection] = useState("hero");

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    // Section elements double as pin targets (hero, projects), so their own
    // ScrollTrigger boundaries are unreliable once pinned/fixed — read live
    // getBoundingClientRect() on every update instead of caching a trigger
    // per section.
    const sectionEls = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el
    );

    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        setPercent(Math.round(self.progress * 100));
        if (fillRef.current) {
          fillRef.current.style.transform = `scaleY(${self.progress})`;
        }

        const mid = window.innerHeight * 0.5;
        let active = sectionEls[0]?.id ?? "hero";
        for (const el of sectionEls) {
          if (el.getBoundingClientRect().top <= mid) active = el.id;
        }
        setSection(active);
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div className="scroll-hud" aria-hidden="true">
      <div className="scroll-hud-track">
        <div className="scroll-hud-fill" ref={fillRef} />
      </div>
      <div className="scroll-hud-label">
        <span>{section}</span>
        <span>{String(percent).padStart(2, "0")}%</span>
      </div>
    </div>
  );
}
