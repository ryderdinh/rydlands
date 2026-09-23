"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { CSS3DObject, CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { prefersReducedMotion } from "@/lib/motion";

// A real 3D scene graph — camera, perspective, a rotating group of
// positioned objects — is exactly what Three.js is for. Deliberately
// CSS3DRenderer, not the WebGL renderer: it drives the same Three.js scene/
// camera math, but the "pixels" it outputs are real DOM text nodes
// positioned via CSS matrix3d transforms, not a rasterized canvas — so the
// ring uses the site's actual font/color at full crispness at any size,
// rather than baking text into a canvas texture. One CSS3DObject per glyph,
// not per word — each letter has its own position/rotation around the
// circle, which is what makes a word curve along the ring instead of
// reading as a flat card that merely orbits (see CHAR_ANGLE_STEP below).
// Desktop only, no-reduced-motion only, and entirely decorative — the same
// items are listed again, plainly, in the Skills Grid section further down
// the page; this is a hero flourish layered on top, not the accessible
// listing itself.
//
// Actually loops AROUND the character, not just beside him: two
// synchronized scenes/renderers, one painted behind .hero-character and
// one in front of it, with each item handed from one to the other the
// instant its own rotation carries it past the character's picture plane.
// A single CSS3DRenderer can't do this by itself — it can sort its own
// objects by depth relative to each other, but has no way to interleave
// that sort with an external DOM element (the character image) that isn't
// part of its scene at all. Two DOM layers at different z-index is the
// only way to actually occlude against something outside the scene.

const RADIUS = 380;
const ROTATION_SPEED = 0.22; // rad/s — a slow, readable drift, not a spin

// Angular gap between adjacent glyphs, tuned against RADIUS the same way the
// item spacing was (see the file-level comment on the spacing fix): arc
// length = angle × RADIUS, so this is roughly "one monospace character's
// width" worth of arc at this radius, not an arbitrary constant.
const CHAR_ANGLE_STEP = 0.026;

function createScene(container: HTMLDivElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 1, 2000);
  camera.position.z = 640;

  const renderer = new CSS3DRenderer();
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.inset = "0";
  container.appendChild(renderer.domElement);

  const group = new THREE.Group();
  scene.add(group);

  return { scene, camera, renderer, group };
}

interface RingItem {
  object: CSS3DObject;
  angle: number;
  inFront: boolean;
}

export default function SkillsRing({ items }: { items: string[] }) {
  const backRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const backContainer = backRef.current;
    const frontContainer = frontRef.current;
    if (!backContainer || !frontContainer) return;
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse), (hover: none)").matches) return;

    const back = createScene(backContainer);
    const front = createScene(frontContainer);

    // Repeated, like the flat marquee's own content duplication — six
    // items spread once around the full circle left wide, empty gaps
    // between them (usually only one label visible at a time). Doubling
    // the list packs a label every ~30° instead of every ~60° (paired
    // with the larger RADIUS above — packing tighter without it just
    // made adjacent items overlap and run together illegibly, since an
    // item near the front of the ring is magnified by the perspective,
    // not rendered at a flat 1:1 CSS-pixel size), so more than one is
    // usually in view without the text colliding.
    const repeated = [...items, ...items];
    const count = repeated.length;
    const ringItems: RingItem[] = [];

    repeated.forEach((text, i) => {
      const slotAngle = (i / count) * Math.PI * 2;
      // Each word is its own run of glyphs (plus a trailing gap and dot),
      // one CSS3DObject per glyph rather than one per word — a `null`
      // entry consumes an angle step without rendering anything, which is
      // what puts a small gap between the last letter and the dot. Every
      // glyph gets its own position/rotation around the circle, centered
      // on the word's slot, so the word itself curves along the ring
      // instead of reading as one flat card that happens to orbit.
      const glyphs: (string | null)[] = [...text, null, "◆"];
      const startOffset = -((glyphs.length - 1) / 2) * CHAR_ANGLE_STEP;

      glyphs.forEach((glyph, gi) => {
        if (glyph === null) return;
        const el = document.createElement("div");
        el.className = glyph === "◆" ? "skills-ring-char skills-ring-dot" : "skills-ring-char";
        el.textContent = glyph;

        const object = new CSS3DObject(el);
        const angle = slotAngle + startOffset + gi * CHAR_ANGLE_STEP;
        object.position.set(RADIUS * Math.sin(angle), 0, RADIUS * Math.cos(angle));
        // Faces outward from the ring's center, tangent to the circle at
        // this glyph's own point — reads normally at the front,
        // foreshortens toward edge-on as it swings round to the side,
        // which is what actually sells the "wrapping around a 3D
        // cylinder" illusion rather than a flat billboard that always
        // faces the camera.
        object.rotation.y = angle;

        // Starts in the back scene; the render loop's very first pass
        // immediately reassigns it if that's not actually correct yet.
        back.group.add(object);
        ringItems.push({ object, angle, inFront: false });
      });
    });

    function resize() {
      const w = backContainer!.clientWidth;
      const h = backContainer!.clientHeight;
      if (w === 0 || h === 0) return;
      for (const { camera, renderer } of [back, front]) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(backContainer);

    let raf = 0;
    let rotation = 0;
    let lastT = performance.now();

    const render = () => {
      const now = performance.now();
      const dt = Math.min((now - lastT) / 1000, 1 / 30);
      lastT = now;
      rotation += dt * ROTATION_SPEED;
      // Both groups share one rotation value, kept in sync by hand every
      // frame (not a shared Three.js parent) — that's what lets an item
      // move from one scene's group to the other's mid-rotation without
      // any visual pop, since both parents always have an identical
      // transform at the moment of the handoff.
      back.group.rotation.y = rotation;
      front.group.rotation.y = rotation;

      for (const item of ringItems) {
        const worldAngle = item.angle + rotation;
        // 1 = nearest the camera (in front of the character), -1 =
        // farthest (behind him) — the same value used both to fade the
        // far side toward the character's own background and to decide
        // which of the two scenes currently owns this item.
        const depth = Math.cos(worldAngle);
        item.object.element.style.opacity = String(0.35 + 0.65 * ((depth + 1) / 2));

        const shouldBeFront = depth > 0;
        if (shouldBeFront !== item.inFront) {
          if (shouldBeFront) {
            back.group.remove(item.object);
            front.group.add(item.object);
          } else {
            front.group.remove(item.object);
            back.group.add(item.object);
          }
          item.inFront = shouldBeFront;
        }
      }

      back.renderer.render(back.scene, back.camera);
      front.renderer.render(front.scene, front.camera);
      raf = requestAnimationFrame(render);
    };

    function onVisibility() {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        lastT = performance.now();
        render();
      }
    }
    document.addEventListener("visibilitychange", onVisibility);

    render();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      backContainer!.removeChild(back.renderer.domElement);
      frontContainer!.removeChild(front.renderer.domElement);
    };
  }, [items]);

  return (
    <>
      <div className="skills-ring skills-ring--back" ref={backRef} aria-hidden="true" />
      <div className="skills-ring skills-ring--front" ref={frontRef} aria-hidden="true" />
    </>
  );
}
