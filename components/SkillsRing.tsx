"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { CSS3DObject, CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { prefersReducedMotion } from "@/lib/motion";

// A real 3D scene graph — camera, perspective, a rotating group of
// positioned objects — is exactly what Three.js is for for. Deliberately
// CSS3DRenderer, not the WebGL renderer: it drives the same Three.js scene/
// camera math, but the "pixels" it outputs are real DOM text nodes
// positioned via CSS matrix3d transforms, not a rasterized canvas — so the
// ring uses the site's actual font/color/letter-spacing at full crispness
// at any size, the same way the flat marquee ticker (which this reuses the
// same items and visual language from) already does, rather than baking
// text into a canvas texture. Desktop only, no-reduced-motion only, and
// entirely decorative — the flat marquee ticker up top remains the
// always-visible, accessible list of the same items; this is a hero
// flourish layered on top of it, not a replacement for it.

const RADIUS = 210;

export default function SkillsRing({ items }: { items: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse), (hover: none)").matches) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 1, 2000);
    camera.position.z = 640;

    const renderer = new CSS3DRenderer();
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const objects: { object: CSS3DObject; angle: number }[] = [];
    const count = items.length;
    items.forEach((text, i) => {
      const el = document.createElement("div");
      el.className = "skills-ring-item";
      el.innerHTML = `${text}<span class="skills-ring-dot">◆</span>`;

      const object = new CSS3DObject(el);
      const angle = (i / count) * Math.PI * 2;
      object.position.set(RADIUS * Math.sin(angle), 0, RADIUS * Math.cos(angle));
      // Faces outward from the ring's center, tangent to the circle —
      // reads normally at the front, foreshortens toward edge-on as it
      // swings round to the side/back, which is what actually sells the
      // "wrapping around a 3D cylinder" illusion rather than a flat
      // carousel of billboards that always face the camera.
      object.rotation.y = angle;
      group.add(object);
      objects.push({ object, angle });
    });

    function resize() {
      const w = container!.clientWidth;
      const h = container!.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let raf = 0;
    let rotation = 0;
    let lastT = performance.now();

    const render = () => {
      const now = performance.now();
      const dt = Math.min((now - lastT) / 1000, 1 / 30);
      lastT = now;
      rotation += dt * 0.22; // rad/s — a slow, readable drift, not a spin
      group.rotation.y = rotation;

      // Fades the far side of the ring so it reads as receding into
      // depth instead of every label sitting at identical strength —
      // the CSS3DRenderer doesn't shade objects by depth on its own the
      // way the WebGL renderer would with fog/lighting, so this is done
      // by hand per item, from each one's current angle around the ring.
      for (const { object, angle } of objects) {
        const worldAngle = angle + rotation;
        const depth = Math.cos(worldAngle); // 1 = nearest camera, -1 = farthest
        object.element.style.opacity = String(0.22 + 0.68 * ((depth + 1) / 2));
      }

      renderer.render(scene, camera);
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
      container!.removeChild(renderer.domElement);
    };
  }, [items]);

  return <div className="skills-ring" ref={containerRef} aria-hidden="true" />;
}
