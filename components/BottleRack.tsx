"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

const bottles = [
  { layers: [{ h: 55, c: "#4fd1c5" }, { h: 30, c: "#ffd166" }] },
  { layers: [{ h: 40, c: "#ff6b6b" }, { h: 25, c: "#4fd1c5" }, { h: 15, c: "#ffd166" }] },
  { layers: [{ h: 60, c: "#ffd166" }] },
  { layers: [{ h: 35, c: "#4fd1c5" }, { h: 35, c: "#ff6b6b" }] },
];

export default function BottleRack() {
  const rackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rack = rackRef.current;
    if (!rack) return;
    const layers = rack.querySelectorAll<HTMLElement>(".layer");

    if (prefersReducedMotion()) {
      gsap.set(layers, { scaleY: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        layers,
        { scaleY: 0, transformOrigin: "bottom" },
        {
          scaleY: 1,
          duration: 1.1,
          ease: "elastic.out(1, 0.6)",
          stagger: 0.08,
          delay: 0.3,
        }
      );
    }, rack);

    return () => ctx.revert();
  }, []);

  return (
    <div className="rack" ref={rackRef} aria-hidden="true">
      {bottles.map((b, i) => {
        let bottom = 0;
        return (
          <div className="bottle" key={i}>
            {b.layers.map((layer, idx) => {
              const el = (
                <div
                  key={idx}
                  className="layer"
                  style={{
                    height: `${layer.h}%`,
                    bottom: `${bottom}%`,
                    background: layer.c,
                  }}
                />
              );
              bottom += layer.h;
              return el;
            })}
          </div>
        );
      })}
    </div>
  );
}
