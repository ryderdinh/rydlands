"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { prefersReducedMotion } from "@/lib/motion";
import TiltCard from "@/components/TiltCard";

interface SkillGroup {
  title: string;
  tags: string[];
  tick: string;
}

// The one section driven by anime.js rather than GSAP — cards spring in and
// each tag chip pops in on an elastic stagger, a distinctly different feel
// from the GSAP power-eases used everywhere else on the page.
export default function SkillGrid({
  groups,
  pinOwned = false,
}: {
  groups: SkillGroup[];
  /** True when a parent PinnedScene already owns this section's enter/exit
   * transition on desktop — the cards then render already-visible instead of
   * fighting the parent's own scrub with a second, independent animation. */
  pinOwned?: boolean;
}) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const coarse = window.matchMedia("(pointer: coarse), (hover: none)").matches;

    if (prefersReducedMotion() || (pinOwned && !coarse)) {
      grid.querySelectorAll<HTMLElement>(".skill-card, .tag").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    const cards = grid.querySelectorAll<HTMLElement>(".skill-card");
    const tags = grid.querySelectorAll<HTMLElement>(".tag");
    let played = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (played) return;
        if (!entries[0]?.isIntersecting) return;
        played = true;

        animate(cards, {
          opacity: [0, 1],
          translateY: [26, 0],
          duration: 620,
          delay: stagger(90),
          ease: "outQuad",
        });
        animate(tags, {
          opacity: [0, 1],
          scale: [0.6, 1],
          duration: 640,
          delay: stagger(28, { start: 260 }),
          ease: "outElastic(1, 0.6)",
        });

        observer.disconnect();
      },
      { threshold: 0.2 }
    );
    observer.observe(grid);
    return () => observer.disconnect();
  }, [pinOwned]);

  return (
    <div className="skill-groups" ref={gridRef}>
      {groups.map((g) => (
        <TiltCard as="div" className="skill-card" key={g.title} maxTilt={6} glare style={{ opacity: 0 }}>
          <span className="skill-tick" style={{ "--skill-c": g.tick } as React.CSSProperties} />
          <h3>{g.title}</h3>
          <div className="tag-row">
            {g.tags.map((t) => (
              <span className="tag" key={t} style={{ opacity: 0 }}>
                {t}
              </span>
            ))}
          </div>
        </TiltCard>
      ))}
    </div>
  );
}
