"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SECTION_IDS = ["hero", "projects", "skills", "about", "contact"];

// A fixed scroll-position readout — reads like a render/profiler timeline
// scrubber rather than a generic "back to top" progress bar.
export default function ScrollHud() {
  const fillRef = useRef<HTMLDivElement>(null);
  const [percent, setPercent] = useState(0);
  const [section, setSection] = useState("hero");

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        setPercent(Math.round(self.progress * 100));
        if (fillRef.current) {
          fillRef.current.style.transform = `scaleY(${self.progress})`;
        }
      },
    });

    // Section elements double as pin targets (hero, projects), which makes a
    // manual getBoundingClientRect-in-onUpdate reading unreliable while a pin
    // is engaged — an IntersectionObserver (same approach as SiteNav's active
    // link) tracks which section is centered instead.
    const sectionEls = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setSection(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sectionEls.forEach((el) => observer.observe(el));

    return () => {
      trigger.kill();
      observer.disconnect();
    };
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
