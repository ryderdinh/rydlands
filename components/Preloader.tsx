"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

// Never reveal sooner than this, even when every asset is already cached —
// a flash of loader that vanishes instantly reads as a glitch, not an intro.
const MIN_MS = 1000;
// Escape hatch: if an asset never settles, open anyway rather than trap the visitor.
const MAX_MS = 8000;
// The assets the first frame actually depends on (the hero portrait) plus the
// fonts and the window load event. Each one finished = one step of progress.
const PORTRAIT_SRC = "/ryder-portrait.png";
const TASK_COUNT = 3;

// Full-screen dark cover with a circular hole punched through it (CSS mask on
// a radial gradient). Once loading finishes the hole grows from the center
// until it passes the corners, uncovering the page underneath; a thin glowing
// ring rides the hole's edge. The cover is rendered on the server too, so the
// page never flashes unstyled content before hydration.
export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const content = contentRef.current;
    if (!root || !content) return;

    // The ring is there from the first frame, fully drawn (the cover's own
    // gradient rim, --ring-r); loading only counts the percent. It scales up
    // when loading completes. Sized off the viewport so it fits small screens.
    const r0 = Math.min(150, Math.min(window.innerWidth, window.innerHeight) * 0.36);
    root.style.setProperty("--ring-r", String(r0));

    // The intro always plays from the top: stop the browser restoring the last
    // scroll position (reload, back/forward) and pull back up if it already did.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    // Back/forward can also restore the whole page from the bfcache, scroll included.
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) window.scrollTo(0, 0);
    };
    window.addEventListener("pageshow", onPageShow);

    const reduced = prefersReducedMotion();
    const start = performance.now();
    let tasksDone = 0;
    let shown = 0;
    let finished = false;
    let cancelled = false;

    // Swallow scroll input while covered, before Lenis (bubble phase) sees it.
    const block = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const blockKeys = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(e.key)) {
        block(e);
      }
    };
    window.addEventListener("wheel", block, { passive: false, capture: true });
    window.addEventListener("touchmove", block, { passive: false, capture: true });
    window.addEventListener("keydown", blockKeys, { capture: true });
    const unblock = () => {
      window.removeEventListener("wheel", block, { capture: true });
      window.removeEventListener("touchmove", block, { capture: true });
      window.removeEventListener("keydown", blockKeys, { capture: true });
    };

    const complete = () => {
      unblock();
      setDone(true);
    };

    const open = () => {
      if (cancelled) return;
      // Late restoration (e.g. after the load event) must not reveal a mid-page view.
      window.scrollTo(0, 0);
      const tl = gsap.timeline({ onComplete: complete });
      if (reduced) {
        // No moving hole for reduced motion: a short plain fade.
        tl.to(content, { opacity: 0, duration: 0.2 }).to(root, { opacity: 0, duration: 0.3 });
        return;
      }
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Past the farthest corner, plus room for the ring's glow to clear it too.
      const maxR = Math.hypot(w, h) / 2 + 80;
      // A "back.in" ease: the ring first travels backwards (shrinks) and then
      // accelerates forward past its start until it clears the screen, all on
      // one curve so nothing stops dead in between. back.in(s) is
      //   f(t) = t²((s+1)t − s), dipping to −4s³ / (27(s+1)²) at t = 2s / (3(s+1)).
      // Its overshoot s is solved so that dip is exactly the ring's own radius,
      // i.e. the ring shrinks to a point (radius 0) and no further.
      const depth = r0 / (maxR - r0);
      let lo = 0.01;
      let hi = 20;
      for (let i = 0; i < 40; i++) {
        const mid = (lo + hi) / 2;
        if ((4 * mid ** 3) / (27 * (mid + 1) ** 2) < depth) lo = mid;
        else hi = mid;
      }
      const s = (lo + hi) / 2;
      const tMin = (2 * s) / (3 * (s + 1));
      // The cover's hole only opens once the ring has bottomed out and turns
      // outward, so the cover stays closed while the ring shrinks.
      // Time is warped piecewise so the outward run can be quicker than the
      // shrink. Speed is 0 at the bottom (f'(tMin) = 0), so the join is smooth.
      const SHRINK_S = 0.65;
      const LAUNCH_S = 0.5;
      const split = SHRINK_S / (SHRINK_S + LAUNCH_S);
      const proxy = { p: 0 };
      const apply = () => {
        const t =
          proxy.p <= split
            ? tMin * (proxy.p / split)
            : tMin + (1 - tMin) * ((proxy.p - split) / (1 - split));
        const ringR = Math.max(0, r0 + (maxR - r0) * t * t * ((s + 1) * t - s));
        root.style.setProperty("--hole-r", `${t > tMin ? ringR : -2}`);
        root.style.setProperty("--ring-r", `${ringR}`);
      };
      apply();
      tl.to(content, { opacity: 0, scale: 0.94, duration: 0.25, ease: "power2.in" }, 0).to(
        proxy,
        { p: 1, duration: SHRINK_S + LAUNCH_S, ease: "none", onUpdate: apply },
        0,
      );
    };

    const draw = () => {
      if (percentRef.current) {
        percentRef.current.textContent = String(Math.round(shown * 100)).padStart(3, "0");
      }
    };

    // Ready (or timed out): land on 100 for certain, hold a beat so it
    // registers, and only then start the collapse.
    const finish = () => {
      if (finished) return;
      finished = true;
      gsap.ticker.remove(tick);
      const progress = { v: shown };
      gsap.to(progress, {
        v: 1,
        duration: 0.35,
        ease: "power2.inOut",
        onUpdate: () => {
          shown = progress.v;
          draw();
        },
        onComplete: () => {
          shown = 1;
          draw();
          if (!cancelled) gsap.delayedCall(0.15, open);
        },
      });
    };

    const taskDone = () => {
      tasksDone += 1;
    };

    function tick(_time: number, deltaMs: number) {
      const elapsed = performance.now() - start;
      // Progress can't outrun the clock, so the count always runs over >= MIN_MS.
      const target = Math.min(tasksDone / TASK_COUNT, elapsed / MIN_MS);
      // Time-based easing toward the target, so a dropped frame advances the
      // ring by the time it took instead of stalling then jumping.
      shown += (target - shown) * (1 - Math.exp(-deltaMs / 120));
      draw();

      const ready = tasksDone >= TASK_COUNT && elapsed >= MIN_MS;
      if (ready || elapsed >= MAX_MS) finish();
    }
    gsap.ticker.add(tick);

    // Fonts that were actually requested by the first paint.
    document.fonts.ready.then(taskDone, taskDone);

    // The hero portrait — same URL as the hero's own <img>, so this warms its cache.
    const img = new Image();
    img.onload = img.onerror = taskDone;
    img.src = PORTRAIT_SRC;

    if (document.readyState === "complete") {
      taskDone();
    } else {
      window.addEventListener("load", taskDone, { once: true });
    }

    return () => {
      cancelled = true;
      finished = true;
      gsap.ticker.remove(tick);
      gsap.killTweensOf([root, content]);
      window.removeEventListener("load", taskDone);
      window.removeEventListener("pageshow", onPageShow);
      unblock();
    };
  }, []);

  if (done) return null;

  return (
    <>
      <noscript>
        <style>{".preloader{display:none}"}</style>
      </noscript>
      <div ref={rootRef} className="preloader" role="status" aria-label="Loading">
        <div ref={contentRef} className="preloader-content">
          <span className="preloader-percent">
            <span ref={percentRef}>000</span>
            <span className="preloader-percent-unit">%</span>
          </span>
        </div>
      </div>
    </>
  );
}
