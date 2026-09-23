"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { prefersReducedMotion } from "@/lib/motion";

// Scene two's centerpiece: a metal card, rendered with real lighting (WebGL,
// not CSS3D — CSS transforms have no lights, so they can't make metal look
// like metal). Both the raised ornament and the plate are metal: the ornament
// polished gold, the plate black. A flat rounded slab, not a model: the design lives
// in four maps generated from the card art (public/card/) —
//   color  : gold where the ornament is, near-black elsewhere (metal base color)
//   rough  : polished gold, slightly rougher black
//   normal : the ornament stands proud of the plate (bevelled edges catch light)
// Metal only reads as metal when there is something to reflect, so the scene
// gets an environment (three's RoomEnvironment, a soft-box studio) plus one
// soft light from above; the card's idle sway then slides that light across
// the relief and the reflections across the gold. Nothing here reacts to the
// pointer.

// Drives the entrance from outside (HeroPinned tweens it as part of the
// scene-one -> scene-two timeline, so it reverses with it): 0 = tucked away
// below the frame, 1 = settled in the middle of it. Read every frame, like
// ringTuning.
export const cardReveal = { v: 0 };

// The two springs that chase `cardReveal.v` (see the render loop). Module-level
// so the entrance can be replayed from outside.
const rise = { x: 0, v: 0 };
const spin = { x: 0, v: 0 };
// The idle sway's weight (0..1, a critically damped spring so it starts and
// ends with zero slope) and its own clock. The clock only advances by `w` per
// second, and every sway term is a plain sine, so at the moment the sway starts
// every term is 0 with zero speed: the hand-off from the entrance is seamless.
const idle = { w: 0, v: 0, t: 0 };

// Dev helper (CardTuner's "replay" button): put the card back below the frame
// with the springs at rest, then bring it in again over the same 0.8s the scene
// transition uses.
export function replayCardEntrance() {
  rise.x = rise.v = spin.x = spin.v = idle.w = idle.v = idle.t = 0;
  cardReveal.v = 0;
  gsap.to(cardReveal, { v: 1, ease: "none", duration: 0.8 });
}

// Live values the render loop reads every frame, seeded with the defaults
// below. CardTuner (the dev-only sliders) writes here so a look can be found
// by eye and copied back into these numbers.
export const cardTuning = {
  exposure: 1.05,
  envIntensity: 1,
  light: 1.2, // intensity of the soft light from above
  normal: 1, // strength of the ornament's relief
  roughness: 1, // multiplies the roughness map
  clearcoat: 0.25,
  idle: 1, // multiplies the idle sway once the entrance has finished
  size: 0.76,
  stiffness: 40, // spring pulling the entrance toward its target (higher = snappier)
  damping: 0.6, // damping ratio: 1 = no overshoot, lower = bouncier settle
  turns: 1, // full turns about its vertical axis on the way up; it lands face-on
  tint: "#ffffff", // multiplies the color map
  lightColor: "#fff4e0",
};

const CARD_W = 1576 / 923; // aspect of the art (1576 x 923); height is 1
const CARD_H = 1;
// The art is landscape; the card stands upright, so it is rolled a quarter turn
// (counter-clockwise: the two logos along the top, the striped ornament at the
// bottom). Flip the sign to turn it the other way up.
const CARD_ROLL = Math.PI / 2;
const CARD_D = 0.03;
// Corner radius, in card heights (a bank card is ~0.055). Keep it under ~0.06
// or it starts to clip the art's own chamfered frame corners.
const CORNER_RADIUS = 0.02;
// Fractions of the canvas the card may fill before the idle sway would clip it.
const FILL_W = 0.74;
const FILL_H = 0.72;
const FOV = 30;
// Idle sway (radians / world units at idle = 1): a slow yaw and pitch that let
// the light travel across the relief, a hint of roll, and a gentle float.
const IDLE_YAW = 0.2;
const IDLE_PITCH = 0.07;
const IDLE_ROLL = 0.02;
const IDLE_FLOAT = 0.035;

// A rounded-rectangle slab, extruded to the card's thickness. The art's UVs
// are rewritten from the shape's own coordinates so the front face maps the
// four textures 1:1 whatever the corner radius (ExtrudeGeometry's stock UVs are
// in world units). The rim is smooth-shaded around the corners, but the edge
// between face and rim stays a hard 90 degrees, like the flat card in the art.
function createCardGeometry() {
  const hw = CARD_W / 2;
  const hh = CARD_H / 2;
  const r = CORNER_RADIUS;
  const shape = new THREE.Shape();
  shape.moveTo(-hw + r, -hh);
  shape.lineTo(hw - r, -hh);
  shape.absarc(hw - r, -hh + r, r, -Math.PI / 2, 0, false);
  shape.lineTo(hw, hh - r);
  shape.absarc(hw - r, hh - r, r, 0, Math.PI / 2, false);
  shape.lineTo(-hw + r, hh);
  shape.absarc(-hw + r, hh - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(-hw, -hh + r);
  shape.absarc(-hw + r, -hh + r, r, Math.PI, Math.PI * 1.5, false);

  const extruded = new THREE.ExtrudeGeometry(shape, { depth: CARD_D, bevelEnabled: false, curveSegments: 24 });
  extruded.translate(0, 0, -CARD_D / 2);
  // Smooths the rim's normals in place (the geometry is already non-indexed).
  const geometry = toCreasedNormals(extruded, THREE.MathUtils.degToRad(60));

  const pos = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, pos.getX(i) / CARD_W + 0.5, pos.getY(i) / CARD_H + 0.5);
  }
  // The back cap shows its own art (public/card/back/). Seen from behind, after the
  // card has turned about its vertical axis, the same UVs would read mirrored
  // along the art's vertical, so flip v there to make the back read correctly.
  const lids = geometry.groups[0];
  const backStart = lids.start;
  const backEnd = lids.start + lids.count / 2;
  for (let i = backStart; i < backEnd; i++) {
    uv.setY(i, 1 - uv.getY(i));
  }
  uv.needsUpdate = true;

  // Extrude emits the lids (back cap first, then front cap) as group 0 and the
  // rim as group 1; split them so front, back and rim can each have a material.
  const rim = geometry.groups[1];
  geometry.clearGroups();
  geometry.addGroup(rim.start, rim.count, 0);
  geometry.addGroup(lids.start + lids.count / 2, lids.count / 2, 1);
  geometry.addGroup(lids.start, lids.count / 2, 2);
  return geometry;
}

// `front` picks which front design to show: the folder public/card/front/<front>/.
// The back is always public/card/back/, one design for every front.
export default function CardScene({ front = "main" }: { front?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (prefersReducedMotion()) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = cardTuning.exposure;
    wrap.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 50);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envMap = pmrem.fromScene(roomEnv, 0.04).texture;
    scene.environment = envMap;
    scene.environmentIntensity = cardTuning.envIntensity;
    roomEnv.dispose();

    // One soft light from above, slightly in front: it skims the raised
    // ornament's upper edges (the relief) and leaves the flat faces evenly lit,
    // on top of the environment's reflections. Fixed; the card moves under it.
    const light = new THREE.DirectionalLight(cardTuning.lightColor, cardTuning.light);
    light.position.set(0, 3, 1.5);
    scene.add(light);

    const loader = new THREE.TextureLoader();
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const load = (path: string, srgb: boolean) => {
      const t = loader.load(`/card/${path}.png`);
      t.anisotropy = maxAniso;
      if (srgb) t.colorSpace = THREE.SRGBColorSpace;
      return t;
    };
    // Front and back are separate sets of the same three maps: <dir>/color, /rough,
    // /normal (see docs/card-assets.md).
    const textures: THREE.Texture[] = [];
    const makeFace = (dir: string) => {
      const map = load(`${dir}/color`, true);
      const roughnessMap = load(`${dir}/rough`, false);
      const normalMap = load(`${dir}/normal`, false);
      textures.push(map, roughnessMap, normalMap);
      return new THREE.MeshPhysicalMaterial({
        map,
        metalness: 1,
        roughness: 1,
        roughnessMap,
        normalMap,
        normalScale: new THREE.Vector2(cardTuning.normal, cardTuning.normal),
        clearcoat: cardTuning.clearcoat,
        clearcoatRoughness: 0.25,
      });
    };
    const face = makeFace(`front/${front}`);
    const backFace = makeFace("back");
    const faces = [face, backFace];
    const plain = new THREE.MeshStandardMaterial({ color: 0x1e1e21, metalness: 1, roughness: 0.4 });
    const geometry = createCardGeometry();
    // Groups (see createCardGeometry): 0 = the rim, 1 = front face, 2 = back face.
    const card = new THREE.Mesh(geometry, [plain, face, backFace]);
    card.rotation.z = CARD_ROLL;
    const pivot = new THREE.Group();
    pivot.add(card);
    scene.add(pivot);

    // How far below the middle the card starts, so it begins fully out of
    // view (set by resize, in world units at the card's depth).
    let travel = 3;

    // Pull the camera back just far enough that the card fits the canvas. The
    // card stands upright, so its on-screen width is CARD_H and height CARD_W.
    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      const k = 2 * Math.tan(THREE.MathUtils.degToRad(FOV) / 2);
      const d = Math.max(CARD_H / (FILL_W * camera.aspect * k), CARD_W / (FILL_H * k));
      camera.position.set(0, 0, d);
      travel = (d * k) / 2 + CARD_W * 0.6;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 1 / 20);
      last = now;
      const v = cardReveal.v;

      // The entrance is not glued to the timeline: `v` is the target, and two
      // damped springs chase it — the rise, and the spin a touch heavier so it
      // trails the rise. Underdamped, so the card overshoots its landing a
      // little and settles, instead of stopping dead where the tween ends.
      const stiffness = cardTuning.stiffness;
      const stepSpring = (s: { x: number; v: number }, damping: number) => {
        const c = 2 * damping * Math.sqrt(stiffness);
        const steps = 2; // sub-steps keep the integration stable on a slow frame
        for (let i = 0; i < steps; i++) {
          s.v += ((v - s.x) * stiffness - s.v * c) * (dt / steps);
          s.x += s.v * (dt / steps);
        }
      };
      stepSpring(rise, cardTuning.damping);
      stepSpring(spin, Math.min(cardTuning.damping + 0.15, 1.5));

      // Nothing to draw while the card is tucked away (target at rest and both
      // springs settled at it): don't spend the GPU.
      const moving = Math.max(Math.abs(rise.x - v), Math.abs(rise.v), Math.abs(spin.x - v), Math.abs(spin.v));
      if (v < 0.001 && moving < 0.001) return;

      renderer.toneMappingExposure = cardTuning.exposure;
      scene.environmentIntensity = cardTuning.envIntensity;
      light.intensity = cardTuning.light;
      light.color.set(cardTuning.lightColor);
      for (const f of faces) {
        f.normalScale.setScalar(cardTuning.normal);
        f.roughness = cardTuning.roughness;
        f.clearcoat = cardTuning.clearcoat;
        f.color.set(cardTuning.tint);
      }

      // The idle sway starts when the entrance target is reached, and is simply
      // added on top of the entrance springs: it is not gated on those springs
      // being at rest (an underdamped one keeps ringing for a while, and a gate
      // on it flickers on and off as it passes through the landing point).
      const kIdle = 8;
      idle.v += ((v > 0.99 ? 1 : 0) - idle.w) * kIdle * dt - idle.v * 2 * Math.sqrt(kIdle) * dt;
      idle.w = Math.max(0, idle.w + idle.v * dt);
      idle.t += dt * idle.w;
      const sway = idle.w * cardTuning.idle;
      const t = idle.t;
      const enterRise = 1 - rise.x;
      const enterSpin = 1 - spin.x;
      // Entrance: rises from below the frame while spinning about its vertical
      // axis, leaning back a little; all of it goes to nothing as the springs
      // settle. Idle: the slow sway on top.
      pivot.rotation.y = enterSpin * cardTuning.turns * Math.PI * 2 + sway * IDLE_YAW * Math.sin(t * 0.5);
      pivot.rotation.x = -enterRise * 0.35 + sway * IDLE_PITCH * Math.sin(t * 0.37);
      pivot.rotation.z = sway * IDLE_ROLL * Math.sin(t * 0.29);
      pivot.position.set(0, -enterRise * travel + sway * IDLE_FLOAT * Math.sin(t * 0.7), 0);
      pivot.scale.setScalar(cardTuning.size);

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      geometry.dispose();
      faces.forEach((f) => f.dispose());
      plain.dispose();
      textures.forEach((t) => t.dispose());
      envMap.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [front]);

  return <div className="card-scene" ref={wrapRef} aria-hidden="true" />;
}
