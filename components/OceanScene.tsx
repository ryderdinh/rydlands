"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";
import {
  blobVertexShader,
  blobFragmentShader,
  causticsVertexShader,
  causticsFragmentShader,
} from "@/lib/shaders";
import { createBubbleField } from "@/lib/bubbleField";
import { sampleDepth, type DepthState } from "@/lib/depthZones";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function OceanScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = prefersReducedMotion();
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 6);

    const fog = new THREE.FogExp2(0x0d2b33, 0.015);
    scene.fog = fog;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x0d2b33, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    mount.appendChild(renderer.domElement);

    // Hero focal object — liquid blob (icosahedron displaced by simplex noise, fresnel + fake specular)
    const blobUniforms = {
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#0b141c") },
      uColorB: { value: new THREE.Color("#4fd1c5") },
      uColorC: { value: new THREE.Color("#ffd166") },
      uLightDir: { value: new THREE.Vector3(0.4, 0.6, 0.8).normalize() },
    };
    const blobGeometry = new THREE.IcosahedronGeometry(1.4, 64);
    const blobMaterial = new THREE.ShaderMaterial({
      vertexShader: blobVertexShader,
      fragmentShader: blobFragmentShader,
      uniforms: blobUniforms,
      transparent: true,
    });
    const blob = new THREE.Mesh(blobGeometry, blobMaterial);
    scene.add(blob);

    // Caustic light rays — large plane below/behind the blob, spans the dive
    const causticsUniforms = {
      uTime: { value: 0 },
      uOpacity: { value: 1 },
      uColor: { value: new THREE.Color("#4fd1c5") },
      uOctaves: { value: coarse ? 1 : 2 },
    };
    const causticsGeometry = new THREE.PlaneGeometry(40, 70);
    const causticsMaterial = new THREE.ShaderMaterial({
      vertexShader: causticsVertexShader,
      fragmentShader: causticsFragmentShader,
      uniforms: causticsUniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const caustics = new THREE.Mesh(causticsGeometry, causticsMaterial);
    caustics.position.set(0, -14, -8);
    scene.add(caustics);

    // Bubble field — spans the full scroll-height dive
    const bubbleCount = coarse ? 70 : 220;
    const bubbleField = createBubbleField({ count: bubbleCount, spreadY: 22 });
    scene.add(bubbleField.points);

    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    resize();
    window.addEventListener("resize", resize);

    // Mouse parallax on the blob (desktop only)
    const parallax = { rx: 0, ry: 0 };
    const qx = gsap.quickTo(parallax, "rx", { duration: 0.8, ease: "power3" });
    const qy = gsap.quickTo(parallax, "ry", { duration: 0.8, ease: "power3" });
    function onMouseMove(e: MouseEvent) {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      qx(ny * 0.22);
      qy(nx * 0.32);
    }
    if (!reduced && !coarse) {
      window.addEventListener("mousemove", onMouseMove);
    }

    // Depth state, sampled from scroll progress
    let depth: DepthState = sampleDepth(0);
    let scrollTrigger: ScrollTrigger | undefined;
    if (!reduced) {
      scrollTrigger = ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          depth = sampleDepth(self.progress);
        },
      });
    }

    function applyDepth() {
      fog.color.set(depth.fogColor);
      fog.density = depth.fogDensity;
      renderer.setClearColor(depth.fogColor, 1);
      causticsUniforms.uOpacity.value = depth.causticsOpacity;
      causticsUniforms.uColor.value.set(depth.causticsColor);
      camera.position.y = depth.cameraY;
    }

    let raf = 0;
    const clock = new THREE.Clock();

    function renderFrame() {
      const t = clock.getElapsedTime();
      const delta = clock.getDelta();
      blobUniforms.uTime.value = t;
      causticsUniforms.uTime.value = t;

      blob.rotation.y = t * 0.18 + parallax.ry;
      blob.rotation.x = parallax.rx;
      blob.rotation.z = Math.sin(t * 0.12) * 0.06;

      bubbleField.update(t, delta, depth.bioPulse);
      applyDepth();

      renderer.render(scene, camera);
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
      applyDepth();
      renderer.render(scene, camera);
    } else {
      animate();
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("visibilitychange", onVisibility);
      scrollTrigger?.kill();
      blobGeometry.dispose();
      blobMaterial.dispose();
      causticsGeometry.dispose();
      causticsMaterial.dispose();
      bubbleField.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="ocean-scene" aria-hidden="true" />;
}
