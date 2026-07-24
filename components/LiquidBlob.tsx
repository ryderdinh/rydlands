"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

// Ashima/McEwan classic 3D simplex noise - dùng để làm mặt khối "sôi" hữu cơ như chất lỏng
const simplexNoise = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
`;

const vertexShader = `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;

  ${simplexNoise}

  void main() {
    vec3 pos = position;
    vec3 n = normalize(normal);
    float freq = 1.5;
    float amp = 0.24;
    float speed = 0.35;

    float displacement = snoise(pos * freq + uTime * speed) * amp;
    vec3 newPos = pos + n * displacement;

    float eps = 0.06;
    vec3 tangent = normalize(cross(n, abs(n.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
    vec3 bitangent = normalize(cross(n, tangent));

    vec3 posT = pos + tangent * eps;
    float dT = snoise(posT * freq + uTime * speed) * amp;
    vec3 newPosT = posT + normalize(posT) * dT;

    vec3 posB = pos + bitangent * eps;
    float dB = snoise(posB * freq + uTime * speed) * amp;
    vec3 newPosB = posB + normalize(posB) * dB;

    vec3 newNormal = normalize(cross(newPosT - newPos, newPosB - newPos));

    vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
    vNormal = normalize(normalMatrix * newNormal);
    vPosition = mvPosition.xyz;
    vDisplacement = displacement;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(-vPosition);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.2);

    float mixT = smoothstep(-0.18, 0.18, vDisplacement);
    vec3 base = mix(uColorA, uColorB, mixT);
    base = mix(base, uColorC, fresnel * 0.7);

    vec3 glow = base + fresnel * vec3(0.55, 0.85, 0.8);
    float alpha = 0.55 + fresnel * 0.4;

    gl_FragColor = vec4(glow, alpha);
  }
`;

function createBubbleTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255,255,255,0.95)");
  grad.addColorStop(0.4, "rgba(255,255,255,0.35)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

export default function LiquidBlob() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = prefersReducedMotion();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Khối liquid trung tâm
    const geometry = new THREE.IcosahedronGeometry(1.4, 64);
    const uniforms = {
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#0b141c") },
      uColorB: { value: new THREE.Color("#4fd1c5") },
      uColorC: { value: new THREE.Color("#ffd166") },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    });
    const blob = new THREE.Mesh(geometry, material);
    scene.add(blob);

    // Bong bóng nổi lên xung quanh khối
    const bubbleCount = 90;
    const positions = new Float32Array(bubbleCount * 3);
    const baseX = new Float32Array(bubbleCount);
    const speeds = new Float32Array(bubbleCount);
    const sways = new Float32Array(bubbleCount);
    for (let i = 0; i < bubbleCount; i++) {
      const x = (Math.random() - 0.5) * 4.2;
      baseX[i] = x;
      positions[i * 3] = x;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4.4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
      speeds[i] = 0.15 + Math.random() * 0.25;
      sways[i] = Math.random() * Math.PI * 2;
    }
    const bubbleGeo = new THREE.BufferGeometry();
    bubbleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const bubbleTexture = createBubbleTexture();
    const bubbleMat = new THREE.PointsMaterial({
      size: 0.14,
      map: bubbleTexture,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: new THREE.Color("#bff4ee"),
    });
    const bubbles = new THREE.Points(bubbleGeo, bubbleMat);
    scene.add(bubbles);

    function resize() {
      if (!mount) return;
      const { clientWidth, clientHeight } = mount;
      if (clientWidth === 0 || clientHeight === 0) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    }
    resize();
    window.addEventListener("resize", resize);

    const parallax = { rx: 0, ry: 0 };
    const qx = gsap.quickTo(parallax, "rx", { duration: 0.8, ease: "power3" });
    const qy = gsap.quickTo(parallax, "ry", { duration: 0.8, ease: "power3" });

    function onMouseMove(e: MouseEvent) {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      qx(ny * 0.22);
      qy(nx * 0.32);
    }
    if (!reduced) window.addEventListener("mousemove", onMouseMove);

    let raf = 0;
    const clock = new THREE.Clock();
    const posAttr = bubbleGeo.getAttribute("position") as THREE.BufferAttribute;

    function animate() {
      const t = clock.getElapsedTime();
      const delta = clock.getDelta();
      uniforms.uTime.value = t;

      blob.rotation.y = t * 0.18 + parallax.ry;
      blob.rotation.x = parallax.rx;
      blob.rotation.z = Math.sin(t * 0.12) * 0.06;

      for (let i = 0; i < bubbleCount; i++) {
        let y = posAttr.getY(i) + speeds[i] * delta * 0.4;
        if (y > 2.3) y = -2.3;
        const x = baseX[i] + Math.sin(t * 0.6 + sways[i]) * 0.14;
        posAttr.setY(i, y);
        posAttr.setX(i, x);
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
      if (!reduced) raf = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      geometry.dispose();
      material.dispose();
      bubbleGeo.dispose();
      bubbleMat.dispose();
      bubbleTexture.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="liquid-stage">
      <div className="liquid-aura" aria-hidden="true" />
      <div ref={mountRef} className="mount" aria-hidden="true" />
    </div>
  );
}
