import * as THREE from "three";

export function createBubbleTexture(): THREE.CanvasTexture {
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

export interface BubbleFieldOptions {
  count: number;
  /** half-extent of vertical spread in world units — bubbles are distributed across [-spreadY, spreadY] */
  spreadY: number;
  spreadX?: number;
  spreadZ?: number;
  size?: number;
}

export interface BubbleField {
  points: THREE.Points;
  update(t: number, delta: number, bioPulse?: number): void;
  dispose(): void;
}

// Bubbles are denser near the top (surface) and sparser toward the bottom (abyss),
// with the deepest ~15% recolored gold/coral to read as bioluminescence near the
// contact section — spatial distribution stands in for a live "density" control so
// we don't have to create/destroy particles every frame on scroll.
export function createBubbleField(opts: BubbleFieldOptions): BubbleField {
  const { count, spreadY, spreadX = 4.2, spreadZ = 2.5, size = 0.14 } = opts;

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const baseX = new Float32Array(count);
  const speeds = new Float32Array(count);
  const sways = new Float32Array(count);

  const surfaceColor = new THREE.Color("#bff4ee");
  const bioColor = new THREE.Color("#ffd166");
  const bioColor2 = new THREE.Color("#ff9d8a");

  for (let i = 0; i < count; i++) {
    // bias toward the top: sqrt skews a uniform [0,1] sample toward 0
    const yT = Math.pow(Math.random(), 1.6);
    const y = spreadY - yT * spreadY * 2;
    const x = (Math.random() - 0.5) * spreadX;
    baseX[i] = x;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spreadZ;
    speeds[i] = 0.15 + Math.random() * 0.25;
    sways[i] = Math.random() * Math.PI * 2;

    const isBio = y < -spreadY * 0.7 && Math.random() < 0.5;
    const c = isBio ? (Math.random() < 0.5 ? bioColor : bioColor2) : surfaceColor;
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const texture = createBubbleTexture();
  const material = new THREE.PointsMaterial({
    size,
    map: texture,
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  const points = new THREE.Points(geometry, material);
  const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;

  function update(t: number, delta: number, bioPulse = 0) {
    for (let i = 0; i < count; i++) {
      let y = posAttr.getY(i) + speeds[i] * delta * 0.4;
      if (y > spreadY) y = -spreadY;
      const x = baseX[i] + Math.sin(t * 0.6 + sways[i]) * 0.14;
      posAttr.setY(i, y);
      posAttr.setX(i, x);
    }
    posAttr.needsUpdate = true;
    material.opacity = 0.6 + Math.sin(t * 0.6) * 0.05 + bioPulse * 0.15;
  }

  function dispose() {
    geometry.dispose();
    material.dispose();
    texture.dispose();
  }

  return { points, update, dispose };
}
