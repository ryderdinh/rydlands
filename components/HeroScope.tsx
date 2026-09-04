"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";
import { blobVertexShader, blobFragmentShader } from "@/lib/shaders";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// A thin shell of drifting dust around the mesh — parallaxes against camera
// dolly to sell real depth, the way a dust/mist layer reads distance in fog.
function createDustField(count: number): THREE.Points {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 2.4 + Math.random() * 3.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: new THREE.Color("#8fd8d0"),
    size: 0.022,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.Points(geometry, material);
}

// Cheap feature detection with a throwaway canvas, run before ever touching
// THREE.WebGLRenderer — the renderer's own constructor logs console.error
// internally as it fails, which we can't suppress once it's called.
function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

// Full-bleed 3D backdrop for the hero — the mesh floats free in open space
// behind the copy, not boxed into a small panel. It's a live render of the
// same displacement technique described in the "Water Sort Puzzle" case study
// below (noise-displaced surface, fresnel mix across the three vial colors).
// The FPS readout is measured from real rAF deltas, not a decorative number.
export default function HeroScope() {
  const mountRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [fps, setFps] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState("00:00.0");
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    const stage = stageRef.current;
    if (!mount || !stage) return;

    if (!hasWebGL()) {
      setWebglFailed(true);
      return;
    }

    const reduced = prefersReducedMotion();
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0e1013, 0.09);
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 30);
    camera.position.set(1.4, 0.1, 5.4);
    camera.lookAt(1.4, 0, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setWebglFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    mount.appendChild(renderer.domElement);

    const uniforms = {
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#101214") },
      uColorB: { value: new THREE.Color("#4fd1c5") },
      uColorC: { value: new THREE.Color("#ffd166") },
      uLightDir: { value: new THREE.Vector3(0.4, 0.6, 0.8).normalize() },
    };
    const geometry = new THREE.IcosahedronGeometry(1.3, 48);
    const material = new THREE.ShaderMaterial({
      vertexShader: blobVertexShader,
      fragmentShader: blobFragmentShader,
      uniforms,
      transparent: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(1.9, -0.1, -0.6);
    scene.add(mesh);

    const dust = createDustField(coarse ? 60 : 140);
    scene.add(dust);

    function resize() {
      const w = stage!.clientWidth;
      const h = stage!.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(stage);

    const parallax = { rx: 0, ry: 0 };
    const qx = gsap.quickTo(parallax, "rx", { duration: 0.9, ease: "power3" });
    const qy = gsap.quickTo(parallax, "ry", { duration: 0.9, ease: "power3" });
    function onMouseMove(e: MouseEvent) {
      const r = stage!.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      qx(ny * 0.16);
      qy(nx * 0.22);
    }
    if (!reduced && !coarse) {
      stage.addEventListener("mousemove", onMouseMove);
    }

    // Real 3D depth, not a CSS scale trick: fly the camera through open space
    // as the hero pin scrolls, tied to the same trigger HeroPinned uses.
    const dolly = { z: 5.4, x: 1.4, fog: 0.09 };
    let scrollTrigger: ScrollTrigger | undefined;
    const heroEl = document.getElementById("hero");
    if (!reduced && !coarse && heroEl) {
      scrollTrigger = ScrollTrigger.create({
        trigger: heroEl,
        start: "top top",
        end: "+=130%",
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          dolly.z = 5.4 - p * 3.9;
          dolly.x = 1.4 - p * 1.1;
          dolly.fog = 0.09 + p * 0.05;
        },
      });
    }

    let raf = 0;
    const clock = new THREE.Clock();
    let frameCount = 0;
    let fpsWindowStart = 0;
    let elapsedLabelTick = 0;

    function renderFrame() {
      const t = clock.getElapsedTime();
      const delta = clock.getDelta();
      uniforms.uTime.value = t;
      mesh.rotation.y = t * 0.14 + parallax.ry;
      mesh.rotation.x = parallax.rx;
      mesh.rotation.z = Math.sin(t * 0.08) * 0.05;
      dust.rotation.y = t * 0.025;
      dust.rotation.x = t * 0.012;
      camera.position.z = dolly.z;
      camera.position.x = dolly.x;
      camera.lookAt(1.9, -0.1, -0.6);
      (scene.fog as THREE.FogExp2).density = dolly.fog;
      renderer.render(scene, camera);

      frameCount++;
      if (t - fpsWindowStart >= 0.5) {
        setFps(Math.round(frameCount / (t - fpsWindowStart)));
        frameCount = 0;
        fpsWindowStart = t;
      }
      if (t - elapsedLabelTick >= 0.1) {
        const mm = Math.floor(t / 60)
          .toString()
          .padStart(2, "0");
        const ss = (t % 60).toFixed(1).padStart(4, "0");
        setElapsed(`${mm}:${ss}`);
        elapsedLabelTick = t;
      }
    }

    function animate() {
      renderFrame();
      raf = requestAnimationFrame(animate);
    }

    function onVisibility() {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      } else if (!reduced && !raf) {
        animate();
      }
    }
    document.addEventListener("visibilitychange", onVisibility);

    if (reduced) {
      renderer.render(scene, camera);
      setFps(null);
    } else {
      animate();
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      scrollTrigger?.kill();
      stage.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("visibilitychange", onVisibility);
      geometry.dispose();
      material.dispose();
      dust.geometry.dispose();
      (dust.material as THREE.Material).dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className={`hero-stage${webglFailed ? " hero-stage-fallback" : ""}`}
      ref={stageRef}
      aria-hidden="true"
    >
      {!webglFailed && <div className="hero-stage-canvas" ref={mountRef} />}
      <div className="stage-hud stage-hud-a">SHADER_PREVIEW · URP</div>
      <div className="stage-hud stage-hud-b">
        {webglFailed ? "NO WEBGL" : fps !== null ? `${fps} FPS` : "STATIC"}
      </div>
      <div className="stage-hud stage-hud-c">
        noise(pos, t) · fresnel mix
        <br />
        vial: teal → gold
      </div>
      <div className="stage-hud stage-hud-d">{webglFailed ? "rendered server-side" : `T+ ${elapsed}`}</div>
      <div className="stage-hud stage-hud-e">MESH · ICOSPHERE_48</div>
      <div className="stage-hud stage-hud-f">MAT · URP/LIT</div>
    </div>
  );
}
