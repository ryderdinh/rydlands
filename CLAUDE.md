# rydlands.com

Personal portfolio for Ryder (Unity mobile game developer). Next.js 16 App Router +
TypeScript, statically exported (`output: "export"` in `next.config.mjs`), pnpm.

```
pnpm dev            # http://localhost:3000
pnpm build          # static export to out/
pnpm lint           # eslint
pnpm format:check   # prettier
```

`tsc --noEmit` and `eslint` only prove it compiles. Nothing here is unit-tested and the
animation/WebGL can't be verified from the terminal, so say so when you haven't looked
at it in a browser.

## Conventions

- Plain CSS in `app/globals.css`, no Tailwind classes. Design tokens are CSS variables at the top.
- Comments are in English and explain _why_ (the existing code is heavily commented; match it).
- Respect `prefers-reduced-motion` via `lib/motion.ts`. Motion is desktop/fine-pointer only;
  touch and reduced-motion get a static poster.
- The user sometimes edits files directly (assets, constants). Re-read before editing and
  don't revert their changes.

## How the page works now

The site is **one full-screen page made of scenes**, not a scrolling document. `app/page.tsx`
renders only `HeroPinned`; the other sections, the nav and the footer are pulled.

- `components/HeroPinned.tsx` owns the scene machine. It sets `html { overflow: hidden }`,
  listens with GSAP `Observer` (wheel / touch / pointer) plus arrow/PageUp/PageDown/Space/Home/End,
  and one gesture plays one step of a paused GSAP timeline (`play()` forward, `reverse()` back).
  Input is locked while a transition runs (+150ms so trackpad inertia is swallowed).
  Events from inside `[data-dev-tuner]` are ignored so dragging a tuner slider can't change scenes.
- **Scene 1**: the poster (gold frame, backdrop, ghost wall, portrait, edge lockups, the
  `SkillsRing` three.js CSS3D ring, streaks, scroll cue).
- **Scene 2**: content blurs out (opacity + filter only — several of those elements position
  themselves with CSS transforms, so don't tween transforms on them), the frame and its backdrop
  contract to the left half (tweening `right` from `0%` to `50%` on `.hero-bg` and `.hero-frame`),
  and `CardScene` (WebGL metal card, standing upright) rises into the frame from below.
  The right half is left empty for now. The card is driven by the exported
  `cardReveal.v` (0..1), tweened inside the same timeline so it reverses with it.
- `components/Preloader.tsx` (in `app/layout.tsx`) blocks scroll input while covering, sets
  `history.scrollRestoration = "manual"` and scrolls to 0 — the page must always open at the top.
- New scenes: extend the timeline in `HeroPinned` and the `0..1` bounds in `go()`.

## Live-tuning pattern (dev only)

Each tuned scene exports a module-level object read every frame — `ringTuning` in
`SkillsRing.tsx`, `cardTuning` in `CardScene.tsx`. `RingTuner` / `CardTuner` (both thin wrappers
over `TunerPanel`) are dev-only sliders that write into it; `HeroPinned` shows the one for the
current scene. To finish tuning, copy the numbers into the constants at the top of the file.
Panels must keep the `data-dev-tuner` attribute (see above).

## Metal card assets

The card has two faces: many possible **fronts** (one per scene) and one shared **back**,
each a folder of images under `public/card/`: `front/<variant>/` (today `front/main/`) and
`back/` (currently a copy of the front). In each folder `color.png` is the hand-edited
source; `rough.png`, `normal.png` and `mask.png` are generated from it by
`python3 scripts/gen-card-maps.py [front/<variant>|back|--all]` (needs Pillow; run it yourself
when a `color.png` changes, but note it overwrites hand-painted maps). `<CardScene front="main" />`
picks the front. All faces share one size, and `CARD_W` in `CardScene.tsx` must match the art's
aspect ratio. Details: `docs/card-assets.md`.

## Parked / unused

- `HeroSmoke.tsx` (Pixi.js smoke): off via `SHOW_SMOKE = false` in `HeroPinned.tsx`; being redesigned.
- Not rendered anywhere now, kept for when there's a direction for more scenes:
  `SiteNav`, `ProjectGallery`, `ProjectVessel`, `PinnedScene`, `ScrollReveal`, `SkillGrid`,
  `MagneticButton`, `SplitReveal`, `HeroIntro`, `ScrollHud`, `SmoothScroll` (Lenis), `TiltCard`.
  Their CSS is still in `globals.css`. Don't delete them unless asked.

## Design docs

`PRODUCT.md` and `DESIGN.md` (with `.impeccable/`, `.claude/agents/`, `.claude/skills/impeccable`)
belong to the Impeccable design toolkit. They still describe the old multi-section site, so treat
them as design intent, not the current structure.
