"use client";

import { useEffect } from "react";
import CardScene, { cardReveal, cardTuning } from "@/components/CardScene";
import CardTuner from "@/components/CardTuner";
import CardPlateEditor from "@/components/CardPlateEditor";

// The dev-only content of app/dev/card-plate — see that page for why this route only
// exists under `pnpm dev`. Skips HeroPinned's scroll-driven scene machinery entirely:
// the card is revealed instantly on mount instead of waiting on a scene transition, so
// this is a fast, isolated place to iterate on the plate (CardTuner's sliders,
// CardPlateEditor's drag handles) without scrolling through scene one first.
export default function CardPlateEditorPage() {
  useEffect(() => {
    cardReveal.v = 1;
    // Nothing should move on its own while placing a control point: the card's own
    // idle sway constantly shifts where a UV coordinate projects on screen, and the
    // plate's flow field keeps reshaping every un-keyframed ribbon — either alone is
    // enough to make a handle feel like it's drifting out from under the cursor.
    // Restored on unmount so a client-side navigation back to the live site doesn't
    // carry a frozen card with it.
    const prevIdle = cardTuning.idle;
    const prevHold = cardTuning.plateTimeHold;
    cardTuning.idle = 0;
    cardTuning.plateTimeHold = 1;
    return () => {
      cardTuning.idle = prevIdle;
      cardTuning.plateTimeHold = prevHold;
    };
  }, []);

  return (
    <div className="card-editor-page">
      <p className="card-editor-page-note">
        card plate editor (dev only) — scroll/resize the window if the card looks clipped
      </p>
      <CardScene />
      <CardTuner visible />
      <CardPlateEditor visible />
    </div>
  );
}
