"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

// A viewfinder-style reticle (four corner brackets), not a glow blob — reads as
// an inspector tool crosshair rather than a decorative cursor effect.
//
// The reticle is one box that eases toward a target box every frame:
//  - by default the target is a small square under the pointer;
//  - over a link or button it grows a little (the gold state);
//  - over an element marked `data-cursor-target` it locks on: the target becomes
//    that element's own rectangle (plus PAD), so the brackets wrap the object
//    and stretch to its size. Leaving it, they shrink back and follow the pointer.
// Targets are found by hit-testing their rectangles on each mouse move, not via
// hover events, so they work on elements that have `pointer-events: none`.
// A word on the skills ring locks on too: it is many separate letter elements
// that keep orbiting, so its target is the union of its letters' rectangles,
// re-measured every frame — the brackets ride along with the word.
const BASE = 22; // px, the resting reticle
const HOT = 36; // px, over a link or button
const PAD = 14; // px, gap between a locked-on element and the brackets
const RING_PAD = 10; // px, the same for a word on the skills ring
const FOLLOW = 12; // 1/s: how fast the box catches up with its target

export default function CustomCursor() {
  const reticleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const reticle = reticleRef.current;
    if (!reticle) return;

    const cur = { x: -100, y: -100, w: BASE, h: BASE };
    const pointer = { x: -100, y: -100, hot: false };
    // What the brackets are wrapped around: `el` (for the visibility check) and a
    // `rect` measured fresh every frame, because a ring word moves.
    interface Lock {
      el: HTMLElement;
      pad: number;
      rect: () => { left: number; top: number; right: number; bottom: number };
    }
    let locked: Lock | null = null;

    // A target is usable only while it is actually on screen: not faded out by a
    // scene change, and not while the preloader still covers the page.
    const usable = (el: HTMLElement) => {
      const s = getComputedStyle(el);
      return s.visibility !== "hidden" && Number(s.opacity) > 0.05;
    };

    const findTarget = (x: number, y: number, over: EventTarget | null): Lock | null => {
      if (document.querySelector(".preloader")) return null;
      // Dev panels sit on top of the page; don't lock through them.
      if (over instanceof Element && over.closest("[data-dev-tuner]")) return null;

      // A word on the skills ring: the letters carry data-word (the dot between
      // words doesn't, so it never locks).
      const glyph = over instanceof Element ? over.closest<HTMLElement>(".skills-ring-char[data-word]") : null;
      if (glyph && usable(glyph)) {
        const letters = [...document.querySelectorAll<HTMLElement>(`.skills-ring-char[data-word="${glyph.dataset.word}"]`)];
        return {
          el: glyph,
          pad: RING_PAD,
          rect: () => {
            const box = { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity };
            for (const l of letters) {
              const r = l.getBoundingClientRect();
              box.left = Math.min(box.left, r.left);
              box.top = Math.min(box.top, r.top);
              box.right = Math.max(box.right, r.right);
              box.bottom = Math.max(box.bottom, r.bottom);
            }
            return box;
          },
        };
      }

      for (const el of document.querySelectorAll<HTMLElement>("[data-cursor-target]")) {
        const r = el.getBoundingClientRect();
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom && usable(el)) {
          return { el, pad: PAD, rect: () => el.getBoundingClientRect() };
        }
      }
      return null;
    };

    const onMove = (e: MouseEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.hot = e.target instanceof Element && !!e.target.closest("a, button");
      locked = findTarget(e.clientX, e.clientY, e.target);
      reticle.classList.toggle("is-locked", !!locked);
      reticle.classList.toggle("is-active", pointer.hot && !locked);
    };
    window.addEventListener("mousemove", onMove);

    const tick = (_time: number, deltaMs: number) => {
      let tx = pointer.x;
      let ty = pointer.y;
      let tw = pointer.hot ? HOT : BASE;
      let th = tw;
      if (locked) {
        const r = locked.rect();
        // Let go if the element fades out (scene change) or, for something that
        // moves, has slid out from under a pointer that is standing still.
        const under =
          pointer.x >= r.left - locked.pad &&
          pointer.x <= r.right + locked.pad &&
          pointer.y >= r.top - locked.pad &&
          pointer.y <= r.bottom + locked.pad;
        if (!usable(locked.el) || !under) {
          locked = null;
          reticle.classList.remove("is-locked");
        } else {
          tx = (r.left + r.right) / 2;
          ty = (r.top + r.bottom) / 2;
          tw = r.right - r.left + locked.pad * 2;
          th = r.bottom - r.top + locked.pad * 2;
        }
      }
      // Time-based easing, so a dropped frame doesn't change how it feels.
      const k = 1 - Math.exp((-FOLLOW * deltaMs) / 1000);
      cur.x += (tx - cur.x) * k;
      cur.y += (ty - cur.y) * k;
      cur.w += (tw - cur.w) * k;
      cur.h += (th - cur.h) * k;
      reticle.style.width = `${cur.w}px`;
      reticle.style.height = `${cur.h}px`;
      reticle.style.transform = `translate3d(${cur.x - cur.w / 2}px, ${cur.y - cur.h / 2}px, 0)`;
    };
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div ref={reticleRef} className="cursor-reticle" aria-hidden="true">
      <span className="cursor-tick cursor-tick-tl" />
      <span className="cursor-tick cursor-tick-tr" />
      <span className="cursor-tick cursor-tick-bl" />
      <span className="cursor-tick cursor-tick-br" />
    </div>
  );
}
