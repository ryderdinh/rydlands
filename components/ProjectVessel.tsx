"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";
import TiltCard from "@/components/TiltCard";

export type VesselType = "bottle" | "orb";

interface VesselLayer {
  h: number;
  c: string;
}

interface ProjectVesselProps {
  type: VesselType;
  layers: VesselLayer[];
  pulse?: boolean;
  shimmer?: boolean;
}

export default function ProjectVessel({ type, layers, pulse, shimmer }: ProjectVesselProps) {
  const nodeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (type !== "bottle") return;
    const el = nodeRef.current;
    if (!el) return;
    const layerEls = el.querySelectorAll<HTMLElement>(".layer");

    if (prefersReducedMotion()) {
      gsap.set(layerEls, { scaleY: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        layerEls,
        { scaleY: 0, transformOrigin: "bottom" },
        { scaleY: 1, duration: 1.1, ease: "elastic.out(1, 0.6)", stagger: 0.08, delay: 0.3 }
      );
    }, el);

    return () => ctx.revert();
  }, [type]);

  if (type === "orb") {
    const c1 = layers[0]?.c ?? "#4fd1c5";
    const c2 = layers[1]?.c ?? c1;
    const className = ["orb", pulse && "orb-pulse", shimmer && "orb-shimmer"].filter(Boolean).join(" ");
    return (
      <TiltCard
        as="div"
        className={className}
        maxTilt={14}
        glare
        style={{ "--orb-c1": c1, "--orb-c2": c2 } as React.CSSProperties}
        aria-hidden="true"
      />
    );
  }

  let bottom = 0;
  return (
    <TiltCard as="div" className="bottle" maxTilt={12} glare innerRef={nodeRef} aria-hidden="true">
      {layers.map((layer, idx) => {
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
    </TiltCard>
  );
}
