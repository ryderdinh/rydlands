"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  CARD_D,
  CARD_H,
  CARD_W,
  cardReveal,
  cardTuning,
  plateEditorLink,
} from "@/components/CardScene";
import {
  ANCHOR_X,
  EXIT_X,
  plateActiveDrag,
  plateKeyframes,
  plateManualPoints,
  type PlateKeyframe,
  type PlatePoint,
} from "@/lib/cardPlateStreams";

// Dev-only "drag to shape" overlay for the plate's ribbons (see plateManualPoints in
// lib/cardPlateStreams.ts): draws a handle over each ribbon's middle control points,
// projected from the card's own UV space onto the screen every frame so they track it
// as it sways/rotates, and turns a drag back into a UV coordinate by raycasting the
// mouse against the actual card mesh (its front-face group is materialIndex 1 — see
// createCardGeometry in CardScene.tsx) and reading the hit's own interpolated .uv.
// Dragging any handle of a ribbon that's still flowing procedurally seeds it with a
// straight anchor-to-exit line first, then bends that; double-click a handle to hand
// that ribbon back to the flow field. Both ends stay exactly where the procedural
// version pins them (ANCHOR_X/EXIT_X) — only the interior is yours to place.
//
// Recording a motion (Unity-Animation-window style): with "plate: hold" on in the
// card tuner, releasing a drag records/updates a keyframe for that ribbon at the
// current "plate: scrub" time (see plateKeyframes). Scrub to another time, drag again
// — the ribbon now eases between the two recorded shapes as the flow's own clock
// advances, same as any other keyframed animation. Export/import turns that into a
// JSON file to keep outside the live session.
const MAX_RIBBONS = 14; // matches CardTuner's plateCount slider max
const POINTS_PER_RIBBON = 3;

const HANDLE_SIZE = 14;
const COLOR_PROCEDURAL = "rgba(236,236,231,0.55)";
const COLOR_STATIC = "#4fd1c5"; // hand-shaped, no recorded keyframes (or just one)
const COLOR_KEYFRAMED = "#e8c468"; // 2+ recorded keyframes: this ribbon now animates

function defaultPoint(ribbon: number, slot: number, count: number): PlatePoint {
  const y0 = (ribbon + 0.5) / count;
  const t = (slot + 1) / (POINTS_PER_RIBBON + 1);
  return { x: ANCHOR_X + (EXIT_X - ANCHOR_X) * t, y: y0 };
}

// Local position of a front-face UV coordinate, in the card mesh's own (pre-roll)
// space — the inverse of createCardGeometry's uv.setXY, front-cap branch.
function uvToLocal(u: number, v: number): THREE.Vector3 {
  return new THREE.Vector3((u - 0.5) * CARD_W, (v - 0.5) * CARD_H, CARD_D / 2);
}

function handleColor(ribbon: number): string {
  const manual = plateManualPoints[ribbon];
  if (!manual) return COLOR_PROCEDURAL;
  const frames = plateKeyframes[ribbon];
  return frames && frames.length >= 2 ? COLOR_KEYFRAMED : COLOR_STATIC;
}

export default function CardPlateEditor({ visible }: { visible: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const handleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dragRef = useRef<{ ribbon: number; slot: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const worldPos = new THREE.Vector3();
    let raf = 0;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const { camera, card, wrap } = plateEditorLink;
      const root = rootRef.current;
      if (!root) return;
      if (!visible || !camera || !card || !wrap || cardReveal.v < 0.9) {
        root.style.display = "none";
        return;
      }
      root.style.display = "block";
      const rect = wrap.getBoundingClientRect();
      const count = Math.round(cardTuning.plateCount);

      for (let ribbon = 0; ribbon < MAX_RIBBONS; ribbon++) {
        for (let slot = 0; slot < POINTS_PER_RIBBON; slot++) {
          const el = handleRefs.current[ribbon * POINTS_PER_RIBBON + slot];
          if (!el) continue;
          if (ribbon >= count) {
            el.style.display = "none";
            continue;
          }
          const manual = plateManualPoints[ribbon];
          const p = manual?.[slot] ?? defaultPoint(ribbon, slot, count);
          worldPos.copy(uvToLocal(p.x, p.y)).applyMatrix4(card.matrixWorld);
          const ndc = worldPos.project(camera);
          if (ndc.z > 1) {
            el.style.display = "none";
            continue;
          }
          el.style.display = "block";
          el.style.left = `${rect.left + (ndc.x * 0.5 + 0.5) * rect.width - HANDLE_SIZE / 2}px`;
          el.style.top = `${rect.top + (1 - (ndc.y * 0.5 + 0.5)) * rect.height - HANDLE_SIZE / 2}px`;
          el.style.background = handleColor(ribbon);
        }
      }
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  if (process.env.NODE_ENV !== "development") return null;

  // A single stable handler (reading which handle via data attributes) rather than a
  // per-handle closure built during render, so touching refs only ever happens from
  // the actual pointer event, never as a side effect of rendering.
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const ribbon = Number(e.currentTarget.dataset.ribbon);
    const slot = Number(e.currentTarget.dataset.slot);
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { ribbon, slot };
    plateActiveDrag.ribbon = ribbon;
    if (!plateManualPoints[ribbon]) {
      const count = Math.round(cardTuning.plateCount);
      plateManualPoints[ribbon] = [0, 1, 2].map((s) => defaultPoint(ribbon, s, count));
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const { camera, card, wrap } = plateEditorLink;
    if (!drag || !camera || !card || !wrap) return;
    const rect = wrap.getBoundingClientRect();
    const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ndcY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
    const hit = raycaster
      .intersectObject(card, false)
      .find((h) => h.face?.materialIndex === 1 && h.uv);
    if (!hit?.uv) return;
    const pts = plateManualPoints[drag.ribbon];
    if (!pts) return;
    // Keep interior points away from the pinned columns and off the far top/bottom —
    // sane bounds for a middle control point, not a hard requirement of the math.
    pts[drag.slot] = {
      x: THREE.MathUtils.clamp(hit.uv.x, 0.04, 0.96),
      y: THREE.MathUtils.clamp(hit.uv.y, -0.1, 1.1),
    };
  };

  // Releasing a drag is the "record" gesture — see the module comment. Only while
  // "plate: hold" is on: dragging during normal playback still reshapes the ribbon
  // live, it just doesn't bake a keyframe (the scrub time wouldn't mean anything
  // stable to key against while it's simultaneously auto-advancing).
  const handlePointerUp = () => {
    const drag = dragRef.current;
    dragRef.current = null;
    plateActiveDrag.ribbon = null;
    if (!drag || !cardTuning.plateTimeHold) return;
    const pts = plateManualPoints[drag.ribbon];
    if (!pts) return;
    const time = cardTuning.plateTimeScrub;
    const frames = (plateKeyframes[drag.ribbon] ??= []);
    const snapshot: PlatePoint[] = pts.map((p) => ({ x: p.x, y: p.y }));
    const existing = frames.find((f) => Math.abs(f.time - time) < 1 / 120);
    if (existing) existing.points = snapshot;
    else frames.push({ time, points: snapshot });
  };

  const resetRibbon = (ribbon: number) => {
    plateManualPoints[ribbon] = null;
    plateKeyframes[ribbon] = null;
  };

  const resetAll = () => {
    plateManualPoints.length = 0;
    plateKeyframes.length = 0;
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(plateKeyframes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plate-keyframes.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    file
      .text()
      .then((text) => {
        const parsed = JSON.parse(text) as (PlateKeyframe[] | null)[];
        plateKeyframes.length = 0;
        plateManualPoints.length = 0;
        parsed.forEach((frames, i) => {
          plateKeyframes[i] = frames;
          // A single recorded keyframe is a static shape, not something
          // applyPlateKeyframes interpolates (it needs 2+) — seed it directly so it
          // still shows immediately instead of waiting on a scrub that'll never come.
          if (frames && frames.length === 1) plateManualPoints[i] = frames[0].points;
        });
      })
      .catch((err) => console.error("plate-keyframes.json: failed to parse", err));
  };

  const handles: React.ReactElement[] = [];
  for (let ribbon = 0; ribbon < MAX_RIBBONS; ribbon++) {
    for (let slot = 0; slot < POINTS_PER_RIBBON; slot++) {
      const key = `${ribbon}-${slot}`;
      handles.push(
        <div
          key={key}
          ref={(el) => {
            handleRefs.current[ribbon * POINTS_PER_RIBBON + slot] = el;
          }}
          data-ribbon={ribbon}
          data-slot={slot}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onDoubleClick={() => resetRibbon(ribbon)}
          style={{
            position: "fixed",
            width: HANDLE_SIZE,
            height: HANDLE_SIZE,
            borderRadius: "50%",
            border: "1px solid #0b0c0e",
            cursor: "grab",
            touchAction: "none",
            zIndex: 10001,
          }}
        />,
      );
    }
  }

  const buttonStyle: React.CSSProperties = {
    background: "transparent",
    border: "1px solid #3d4147",
    color: "#ecece7",
    cursor: "pointer",
  };

  return (
    <div data-dev-tuner ref={rootRef} style={{ display: "none" }}>
      {handles}
      <div
        style={{
          position: "fixed",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10001,
          background: "rgba(11,12,14,0.92)",
          border: "1px solid #3d4147",
          color: "#ecece7",
          font: "11px var(--font-mono), monospace",
          padding: "6px 10px",
          display: "flex",
          gap: 10,
          alignItems: "center",
          maxWidth: "90vw",
          flexWrap: "wrap",
        }}
      >
        <span style={{ color: "#4fd1c5" }}>
          drag a dot to shape it — with &quot;plate: hold&quot; on, release to key it at
          &quot;plate: scrub&quot; — double-click resets one
        </span>
        <button type="button" onClick={resetAll} style={buttonStyle}>
          reset all
        </button>
        <button type="button" onClick={exportJson} style={buttonStyle}>
          export json
        </button>
        <button type="button" onClick={() => fileInputRef.current?.click()} style={buttonStyle}>
          import json
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          onChange={importJson}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
}
