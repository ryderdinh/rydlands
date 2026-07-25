"use client";

import { createElement, type ComponentPropsWithoutRef, type ElementType, type ReactNode, type Ref } from "react";
import { useTilt } from "@/lib/useTilt";

type TiltCardProps = {
  as?: ElementType;
  maxTilt?: number;
  glare?: boolean;
  className?: string;
  children?: ReactNode;
  innerRef?: Ref<HTMLElement>;
} & Omit<ComponentPropsWithoutRef<"div">, "as" | "className" | "children">;

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      else (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

export default function TiltCard({
  as = "div",
  maxTilt = 8,
  glare = false,
  className,
  children,
  innerRef,
  ...rest
}: TiltCardProps) {
  const tiltRef = useTilt<HTMLElement>(maxTilt);
  const ref = innerRef ? mergeRefs(tiltRef, innerRef) : tiltRef;

  return createElement(
    as,
    { ref, className: `tilt-card ${className ?? ""}`.trim(), ...rest } as any,
    <>
      {children}
      {glare && <span className="tilt-glare" aria-hidden="true" />}
    </>
  );
}
