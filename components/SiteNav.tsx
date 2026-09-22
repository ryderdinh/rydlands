"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const LINKS = [
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

// The active-link pill is a single shared element (Motion layoutId) that
// glides between link positions rather than snapping — the one place this
// site uses Motion instead of GSAP, deliberately: layout animation is
// Motion's native strength.
export default function SiteNav() {
  const [active, setActive] = useState<string | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => !!el
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="nav">
      <div className="container nav-inner">
        <a href="#top" className="logo">
          <span className="logo-dot" />
          RYDER
        </a>
        <ul className="nav-links">
          {LINKS.map((l) => (
            <li key={l.id} className="nav-link-item">
              <a
                href={`#${l.id}`}
                ref={(el) => {
                  linkRefs.current[l.id] = el;
                }}
                className={active === l.id ? "is-active" : undefined}
              >
                {active === l.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="nav-pill"
                    transition={{ type: "spring", stiffness: 420, damping: 38, mass: 0.6 }}
                  />
                )}
                <span className="nav-link-label">{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
