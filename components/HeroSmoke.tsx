"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

// Comet-tail light ribbons flaring from a source point low in the hero's
// right side, thick and saturated near it, thinning and paling as they
// trail up-left — not parallel bands of constant width. That's what the
// reference actually does: a dense, colorful mass low-right with pale
// wisps extending away from it, not a uniform repeating stripe pattern.
// Plain WebGL (no Three.js): this is one fullscreen-triangle fragment
// shader, not a scene — the scene-graph/camera machinery Three.js exists
// for would be dead weight for a single flat pass. Desktop/fine-pointer/
// no-reduced-motion only, layered above the always-on CSS `.hero-streaks`
// band, which stays the fallback everywhere this can't run.
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

  // Everything flares from one source point, low on the right — the
  // reference's colorful mass sits there, with pale trails extending away
  // from it, not a band of parallel stripes with no origin.
  vec2 source = vec2(aspect * 0.3, -0.42);

  // Steep diagonal, up and to the left.
  float flowAngle = radians(148.0);
  vec2 flowDir = vec2(cos(flowAngle), sin(flowAngle));
  vec2 acrossDir = vec2(-flowDir.y, flowDir.x);

  vec2 toPixel = centered - source;
  float along = dot(toPixel, flowDir);
  float across = dot(toPixel, acrossDir);

  float t = uTime * 0.12;

  // Strands are combined with max(), not additive accumulation — additive
  // gaussian bands stacked across several overlapping strands washed out
  // into one soft indistinct glow with no readable line structure, which
  // is exactly why the flow direction was unreadable. max() keeps each
  // strand visually distinct wherever they cross.
  vec3 maxColor = vec3(0.0);
  float maxAlpha = 0.0;

  const int STRANDS = 6;
  for (int i = 0; i < STRANDS; i++) {
    float fi = float(i);
    float laneOffset = (fi - float(STRANDS - 1) * 0.5) * 0.13;
    float speed = 0.5 + fi * 0.08;
    float a = along - fi * 0.03;

    // The centerline bends gently along its length instead of running
    // ruler-straight, and drifts slowly over time for a living, not
    // static, flow. Bend amplitude grows with distance from the source so
    // strands stay tight and legible near it and loosen as they trail off.
    float bend = fbm(vec2(a * 1.6 + fi * 17.0, t * speed)) - 0.5;
    float centerline = laneOffset + bend * (0.14 + a * 0.12);
    float d = across - centerline;

    // The "comet tail" look: width and brightness both fall off with
    // distance from the source, and nothing renders behind it (a < 0).
    // A longer reach keeps the tail visible well across the frame so the
    // direction of travel is unmistakable, not just legible near the source.
    float reach = 1.35;
    float taper = clamp(1.0 - a / reach, 0.0, 1.0);
    taper = pow(taper, 0.5);

    // A steep power (>2) cross-section reads as a defined ribbon with a
    // bright core and a soft skirt — a plain gaussian here always looked
    // like a blurred smudge no matter how narrow it was made. Wider than
    // the first pass: that pass was legible but too thin to read as smoke.
    float width = mix(0.03, 0.085, taper);
    float core = exp(-pow(abs(d) / width, 2.2));
    float skirt = exp(-pow(abs(d) / (width * 2.8), 2.0)) * 0.45;
    float shape = (core + skirt) * taper;
    shape *= smoothstep(-0.04, 0.1, a);

    // Fine turbulence breaks the strand into wisps along its length
    // instead of a smooth solid tube.
    float wisp = 0.6 + 0.4 * fbm(vec2(a * 6.0 - t * (speed + 0.4), fi * 5.0));
    shape *= wisp;

    vec3 tint = mix(uColorA, uColorB, fract(fi * 0.61 + 0.15));
    vec3 strandColor = mix(tint, vec3(1.0), clamp(core * 0.5 + (1.0 - taper) * 0.15, 0.0, 0.6));

    vec3 contribution = strandColor * shape;
    if (shape > maxAlpha) {
      maxColor = contribution;
      maxAlpha = shape;
    }
  }

  maxAlpha = min(maxAlpha, 0.92);

  // Kept clear of the copy column in the left third so the tail doesn't
  // wash out the pitch text.
  float edgeFall = smoothstep(0.14, 0.42, vUv.x);

  vec3 color = clamp(maxColor, 0.0, 1.4);
  float alpha = maxAlpha * edgeFall;

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
