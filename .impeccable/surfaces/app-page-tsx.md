---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: []
---

## Scope

Whole-site redesign, single surface: `app/page.tsx` and its supporting components (Persuade mode — a personal portfolio landing page).

## Direction contract

THESIS: The site is not a page describing a shader developer, it is a live render viewport — the surface itself is the demo, refusing the category-default "hero photo + text card" portfolio shell.

OWN-WORLD: Near-black engine-viewport ground (`#0a0b0d`) with a single live procedural liquid/chromatophore Three.js material as the recurring visual motif (teal `#4fd1c5`, gold `#ffd166`, coral `#ff6b6b` — the exact palette already in the codebase's project "vessel" data, now promoted to the whole system); huge condensed display type (a technical/grotesk face) set directly over the render surface, oryzo-style; UI chrome reads as inspector-panel — thin hairline rules, monospace micro-labels, tick marks — never glass or gradient decoration.

STORY: A recruiter or freelance client lands, immediately sees Ryder's actual shader craft rendering live (not a screenshot), scrolls through four real project "render passes" pinned and scrubbed one at a time, and leaves believing this person owns gameplay + shader + native/monetization + performance — then emails.

FIRST VIEWPORT: Full-bleed pinned hero. Sticky inspector-style nav top (logo dot + wordmark left, section links right). Live WebGL liquid-shader panel fills the viewport behind/behind-blended with giant display wordmark "RYDER". Eyebrow + one-line positioning statement + CTA row lower-left. A floating "▶ REEL" video/demo chip bottom-right (oryzo homage). "scroll to render ↓" cue bottom-center.

FORM: Brief-pinned direction (user supplied oryzo.ai screenshots + explicit ask for Three.js/GSAP/Motion/anime.js showcase + explicit "chuyển cảnh rất mượt" scene-transition smoothness requirement, confirmed live via structured question against a fused alternative). Concept-seed ran at surface scope (seed key `be1cc89d`, dealt candidates 5/1/3); rather than building a raw dealt card, one dealt challenger (`reefs-bioluminescent-nocturnal-chromatophore-skin-language` — living skin as GPU-shaded display) was fused into the pinned oryzo interaction grammar because it names, almost exactly, the real technique (procedural GPU liquid shader as the page's own material) — this is the raise. Substitution disclosed: no decision-page/comp round was served (no image generation available on this machine; this is a code-led build by contract); direction was instead confirmed via a compact two-card structured question, which the user picked ("Render Bench" over a literal-oryzo alternative).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Audience / job / action / proof / constraints

- Audience: recruiters/hiring managers and freelance clients, both technical evaluators skimming for shader/gameplay/performance proof.
- Job: decide whether to email Ryder about a role or a freelance engagement.
- Action: click an email/contact CTA.
- Proof/content: 4 real project case studies (Water Sort liquid shader, WinStreakEvent1 shimmer, Android ANR root-cause, iOS bid-floor interstitial system) — no invented projects, no fabricated logos/photos/testimonials.
- Constraints: stack fixed (Next.js App Router, React, TS, GSAP, Three.js — Motion/anime.js may be added); brand name RYDER and domain rydlands.com preserved exactly; GitHub/LinkedIn stay placeholder `#` links; copy rewritten fully in English; smooth non-standard scroll choreography (Lenis + GSAP ScrollTrigger scrub, no default-feeling section snap) is a named requirement from the user, given twice.

## Signature interaction / memorable moment

Pinned hero → first project transition: the live Three.js liquid-shader panel zooms/deforms and cross-dissolves into the first project's "render pass" card as the user scrolls, so the transition between scenes never feels like a normal page (this directly answers the user's "transitions must be very smooth" note). Each project section is scroll-scrubbed (progress tied to scroll position, not autoplay), not just faded in.

## Unresolved decisions

- Exact display typeface pairing (condensed grotesk for display + a technical mono for labels) — will pick concrete open-source faces during build (Google Fonts), not left generic.
- Whether the "REEL" chip links to a real video (none on hand) — will omit rather than fabricate, or reuse the About statement.
