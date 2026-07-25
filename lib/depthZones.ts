// Pure data — no THREE/DOM here so the depth table is easy to tune in isolation.
// Colors stay dark across every zone (only hue/saturation shifts) so page text
// (--text: near-white) always has enough contrast against the ocean canvas behind it.
export interface DepthStop {
  progress: number;
  fogColor: string;
  fogDensity: number;
  causticsOpacity: number;
  causticsColor: string;
  cameraY: number;
  bioPulse: number;
}

export const depthStops: DepthStop[] = [
  { progress: 0, fogColor: "#0d2b33", fogDensity: 0.015, causticsOpacity: 1, causticsColor: "#4fd1c5", cameraY: 0, bioPulse: 0 },
  { progress: 0.25, fogColor: "#0a2430", fogDensity: 0.022, causticsOpacity: 0.75, causticsColor: "#4fd1c5", cameraY: -4, bioPulse: 0 },
  { progress: 0.5, fogColor: "#071a26", fogDensity: 0.03, causticsOpacity: 0.4, causticsColor: "#3fa9c9", cameraY: -8, bioPulse: 0 },
  { progress: 0.75, fogColor: "#050f18", fogDensity: 0.045, causticsOpacity: 0.15, causticsColor: "#2b6f8a", cameraY: -12, bioPulse: 0.35 },
  { progress: 1, fogColor: "#04080d", fogDensity: 0.055, causticsOpacity: 0.3, causticsColor: "#ffd166", cameraY: -16, bioPulse: 1 },
];

export interface DepthState {
  fogColor: string;
  fogDensity: number;
  causticsOpacity: number;
  causticsColor: string;
  cameraY: number;
  bioPulse: number;
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  const c = (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b);
  return `#${c.toString(16).padStart(6, "0")}`;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpColor(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return rgbToHex(lerp(ar, br, t), lerp(ag, bg, t), lerp(ab, bb, t));
}

export function sampleDepth(progress: number): DepthState {
  const p = Math.min(1, Math.max(0, progress));
  let i = 0;
  while (i < depthStops.length - 2 && p > depthStops[i + 1].progress) i++;
  const a = depthStops[i];
  const b = depthStops[i + 1];
  const span = b.progress - a.progress || 1;
  const t = (p - a.progress) / span;

  return {
    fogColor: lerpColor(a.fogColor, b.fogColor, t),
    fogDensity: lerp(a.fogDensity, b.fogDensity, t),
    causticsOpacity: lerp(a.causticsOpacity, b.causticsOpacity, t),
    causticsColor: lerpColor(a.causticsColor, b.causticsColor, t),
    cameraY: lerp(a.cameraY, b.cameraY, t),
    bioPulse: lerp(a.bioPulse, b.bioPulse, t),
  };
}
