"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

// Dense, one-directional light ribbons sweeping the hero's lower-right,
// echoing the reference's trails — not isotropic drifting noise. The
// fragment shader works in a rotated "flow" frame (one fixed diagonal) and
// renders parallel lane-shaped ribbons along it, with a hot near-white core
// where they're brightest. Plain WebGL (no Three.js): this is one
// fullscreen-triangle fragment shader, not a scene — the scene-graph/camera
// machinery Three.js exists for would be dead weight for a single flat
// pass. Desktop/fine-pointer/no-reduced-motion only, layered above the
// always-on CSS `.hero-streaks` band, which stays the fallback everywhere
// this can't run.
const VERTEX_SRC = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SRC = `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColorA;
uniform vec3 uColorB;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    v += amp * noise(p);
    p *= 2.02;
    amp *= 0.5;
  }
  return v;
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 centered = (vUv - 0.5) * vec2(aspect, 1.0);

  // Rotate into a "flow" frame: fuv.x runs along the streak direction,
  // fuv.y across it — the reference's trails sweep one consistent diagonal,
  // not noise drifting isotropically.
  float angle = radians(-13.0);
  mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  vec2 fuv = rot * centered;

  float speed = 0.22;
  float along = fuv.x * 1.15 + uTime * speed;
  float across = fuv.y * 8.5;

  // Lanes wobble along their length instead of running dead straight.
  float wobble = fbm(vec2(along * 0.35, 7.0)) - 0.5;
  across += wobble * 1.4;

  // Distance from the nearest lane centerline (lanes spaced 1 unit apart).
  float laneDist = abs(fract(across) - 0.5) * 2.0;
  float ribbon = pow(clamp(1.0 - laneDist, 0.0, 1.0), 2.0);

  // Not every lane is lit the whole way — large-scale fbm turns stretches
  // of each one on and off along its length, so it reads as flowing light
  // catching a surface rather than a static striped pattern. Loose
  // threshold: several lanes lit at once for a denser sheet of streaks
  // instead of one isolated line.
  float strength = fbm(vec2(along * 0.22, floor(across) * 1.7));
  ribbon *= smoothstep(0.12, 0.42, strength);

  // Region falloff: concentrated through the lower-right, fading out
  // toward the top and left rather than filling the whole frame.
  float regionFall = smoothstep(0.95, -0.35, fuv.y - fuv.x * 0.25);
  // Pushed further right than the region falloff alone would put it — the
  // hero's copy column lives in this frame's left third, so the ribbons
  // clear it instead of washing out the pitch text.
  float edgeFall = smoothstep(0.24, 0.56, vUv.x) * smoothstep(1.05, 0.7, vUv.x);

  float density = clamp(ribbon * regionFall, 0.0, 1.0);
  vec3 tint = mix(uColorA, uColorB, clamp(strength * 1.3, 0.0, 1.0));
  // Hot core: where a ribbon is at its brightest, blow it toward white
  // rather than staying saturated, like the reference's near-white trails.
  vec3 color = mix(tint, vec3(1.0), pow(density, 3.0) * 0.6);

  float alpha = density * 1.0 * edgeFall;

  gl_FragColor = vec4(color, alpha);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function HeroSmoke() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse), (hover: none)").matches) return;

    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // One triangle big enough to cover the whole clip space — cheaper than
    // a quad (2 triangles) and the overhang is clipped for free.
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "uTime");
    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uColorA = gl.getUniformLocation(program, "uColorA");
    const uColorB = gl.getUniformLocation(program, "uColorB");

    gl.uniform3f(uColorA, 79 / 255, 209 / 255, 197 / 255); // teal
    gl.uniform3f(uColorB, 255 / 255, 209 / 255, 102 / 255); // gold

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    function resize() {
      if (!canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uResolution, w, h);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    const start = performance.now();

    const render = () => {
      const t = (performance.now() - start) / 1000;
      gl.uniform1f(uTime, t);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(render);
    };

    function onVisibility() {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        render();
      }
    }
    document.addEventListener("visibilitychange", onVisibility);

    render();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return <canvas className="hero-smoke-canvas" ref={canvasRef} aria-hidden="true" />;
}
