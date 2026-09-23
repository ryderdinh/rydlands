"use client";

import { useEffect, useRef } from "react";
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
// gets an environment (three's RoomEnvironment, a soft-box studio) plus a
// light that follows the pointer; tilting the card sweeps those reflections
// across the gold.

// Drives the entrance from outside (HeroPinned tweens it as part of the
// scene-one -> scene-two timeline, so it reverses with it): 0 = tucked away
// and turned edge-on, 1 = settled. Read every frame, like ringTuning.
export const cardReveal = { v: 0 };

// Live values the render loop reads every frame, seeded with the defaults
// below. CardTuner (the dev-only sliders) writes here so a look can be found
// by eye and copied back into these numbers.
export const cardTuning = {
  exposure: 1.05,
  envIntensity: 1,
  glint: 6, // intensity of the pointer-following light
  normal: 1, // strength of the ornament's relief
  roughness: 1, // multiplies the roughness map
  clearcoat: 0.25,
  tilt: 1, // multiplies how far the card follows the pointer
  size: 1,
  tint: "#ffffff", // multiplies the color map
  glintColor: "#fff0d0",
};

const CARD_W = 1576 / 923; // aspect of the art (1576 x 923); height is 1
const CARD_H = 1;
const CARD_D = 0.03;
// Corner radius, in card heights (a bank card is ~0.055). Keep it under ~0.06
// or it starts to clip the art's own chamfered frame corners.
const CORNER_RADIUS = 0.02;
// Fractions of the canvas the card may fill before tilt would clip it.
const FILL_W = 0.74;
const FILL_H = 0.62;
const FOV = 30;
const TILT_Y = 0.38; // rad of yaw at the far edge of the window
const TILT_X = 0.26;

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
  uv.needsUpdate = true;

  // Extrude emits the lids (back cap first, then front cap) as group 0 and the
  // rim as group 1; split them so front, back and rim can each have a material.
  const lids = geometry.groups[0];
  const rim = geometry.groups[1];
  geometry.clearGroups();
  geometry.addGroup(rim.start, rim.count, 0);
  geometry.addGroup(lids.start + lids.count / 2, lids.count / 2, 1);
  geometry.addGroup(lids.start, lids.count / 2, 2);
  return geometry;
}

export default function CardScene() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse), (hover: none)").matches) return;

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

    // A warm light that follows the pointer, for a moving specular glint on
    // top of the (static) environment reflections.
    const glint = new THREE.PointLight(cardTuning.glintColor, cardTuning.glint, 0, 2);
    glint.position.set(0, 0, 1.6);
    scene.add(glint);

    const loader = new THREE.TextureLoader();
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const load = (name: string, srgb: boolean) => {
      const t = loader.load(`/card/${name}.png`);
      t.anisotropy = maxAniso;
      if (srgb) t.colorSpace = THREE.SRGBColorSpace;
      return t;
    };
    const color = load("card-color", true);
    const rough = load("card-rough", false);
    const normal = load("card-normal", false);

    const face = new THREE.MeshPhysicalMaterial({
      map: color,
      metalness: 1,
      roughness: 1,
      roughnessMap: rough,
      normalMap: normal,
      normalScale: new THREE.Vector2(cardTuning.normal, cardTuning.normal),
      clearcoat: cardTuning.clearcoat,
      clearcoatRoughness: 0.25,
    });
    const plain = new THREE.MeshStandardMaterial({ color: 0x1e1e21, metalness: 1, roughness: 0.4 });
    const geometry = createCardGeometry();
    // Groups (see createCardGeometry): 0 = the rim, 1 = front face, 2 = back.
    const card = new THREE.Mesh(geometry, [plain, face, plain]);
    const pivot = new THREE.Group();
    pivot.add(card);
    scene.add(pivot);

    // Pull the camera back just far enough that the card fits the canvas.
    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      const k = 2 * Math.tan(THREE.MathUtils.degToRad(FOV) / 2);
      const d = Math.max(CARD_W / (FILL_W * camera.aspect * k), CARD_H / (FILL_H * k));
      camera.position.set(0, 0, d);
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    const pointer = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);

    let raf = 0;
    let last = performance.now();
    let rotX = 0;
    let rotY = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 1 / 20);
      last = now;
      const v = cardReveal.v;
      // Nothing to draw while the card is tucked away: don't spend the GPU.
      if (v < 0.001) return;

      renderer.toneMappingExposure = cardTuning.exposure;
      scene.environmentIntensity = cardTuning.envIntensity;
      glint.intensity = cardTuning.glint;
      glint.color.set(cardTuning.glintColor);
      face.normalScale.setScalar(cardTuning.normal);
      face.roughness = cardTuning.roughness;
      face.clearcoat = cardTuning.clearcoat;
      face.color.set(cardTuning.tint);

      // Ease toward the pointer-driven tilt (time-based, so frame rate
      // doesn't change how it feels), with a slow idle drift on top.
      const t = now / 1000;
      const k = 1 - Math.exp(-dt * 5);
      rotY += (pointer.x * TILT_Y * cardTuning.tilt - rotY) * k;
      rotX += (pointer.y * TILT_X * cardTuning.tilt - rotX) * k;
      const enter = 1 - v;
      pivot.rotation.y = rotY + Math.sin(t * 0.55) * 0.05 - enter * 1.1;
      pivot.rotation.x = rotX + Math.cos(t * 0.45) * 0.03;
      pivot.position.set(enter * 0.9, Math.sin(t * 0.8) * 0.02, -enter * 0.6);
      pivot.scale.setScalar((0.8 + 0.2 * v) * cardTuning.size);

      glint.position.set(pointer.x * 1.8, -pointer.y * 1.2, 1.6);
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
      geometry.dispose();
      face.dispose();
      plain.dispose();
      color.dispose();
      rough.dispose();
      normal.dispose();
      envMap.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="card-scene" ref={wrapRef} aria-hidden="true" />;
}
