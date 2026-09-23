---
name: Ryder — Agent Reveal
description: A Unity developer's portfolio staged as a game "agent reveal" card — an illustrated character front and center, gold-bracketed frame, ghosted repeated wordmark — not a live-render tech demo or a category-default hero-photo-and-text-card shell.
colors:
  bg: "#101214"
  bg-raised: "#17191c"
  bg-inset: "#0b0c0e"
  line: "#2a2d31"
  line-strong: "#3d4147"
  ink: "#ecece7"
  ink-dim: "#90959b"
  ink-faint: "#5b5f64"
  teal: "#4fd1c5"
  gold: "#ffd166"
  coral: "#ff6b6b"
typography:
  wordmark:
    fontFamily: "var(--font-wordmark), sans-serif"
    fontSize: "clamp(72px, 14vw, 210px)"
    fontWeight: 700
    lineHeight: 0.8
    letterSpacing: "-0.03em"
  eyebrow:
    fontFamily: "var(--font-mono), monospace"
    fontSize: "11.5px"
    fontWeight: 500
    letterSpacing: "0.14em"
  display:
    fontFamily: "var(--font-display), sans-serif"
    fontSize: "clamp(28px, 3.6vw, 44px)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  hero-h1:
    fontFamily: "var(--font-display), sans-serif"
    fontSize: "clamp(19px, 1.9vw, 24px)"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "-0.005em"
  hero-edge-word:
    fontFamily: "var(--font-wordmark), sans-serif"
    fontSize: "48px"
    fontWeight: 700
    letterSpacing: "0.04em"
  hero-ghost-wall:
    fontFamily: "var(--font-wordmark), sans-serif"
    fontSize: "64px"
    fontWeight: 700
    letterSpacing: "0.06em"
  hero-ghost-wall-mobile:
    fontFamily: "var(--font-wordmark), sans-serif"
    fontSize: "40px"
    fontWeight: 700
    letterSpacing: "0.06em"
  body:
    fontFamily: "var(--font-body), system-ui, sans-serif"
    fontSize: "16.5px"
    fontWeight: 400
    lineHeight: 1.68
  label:
    fontFamily: "var(--font-mono), monospace"
    fontSize: "12.5px"
    fontWeight: 400
    letterSpacing: "0.05em"
rounded:
  sm: "3px"
  md: "6px"
spacing:
  section-y: "64px"
  container-max: "1120px"
  container-pad: "24px"
components:
  button-primary:
    backgroundColor: "{colors.teal}"
    textColor: "#06201d"
    rounded: "{rounded.sm}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "#6fe0d4"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "12px 20px"
  tag-chip:
    backgroundColor: "{colors.bg-raised}"
    textColor: "{colors.ink-dim}"
    rounded: "{rounded.sm}"
    padding: "5px 9px"
---

# Design System: Ryder — Agent Reveal

## Overview

**Creative North Star: "Agent Reveal"**

The hero is staged like a game's character-reveal card, not a category-default "hero photo + text card" portfolio shell: an illustrated bust portrait stands front and center, framed by gold corner brackets, a ghosted repeat of the "RYDER" wordmark tiled across the backdrop, and mirrored vertical wordmark echoes running the left and right edges. This replaced an earlier direction built around a live procedural Three.js shader material (the "Render Bench") — the user pointed at a Valorant agent-reveal poster and asked for that instead, character portrait in hand. Three.js is gone from the stack entirely, not just unused: no live render, no shader telemetry, nothing to fabricate a "live" claim for. Everywhere outside the hero, the site keeps its inspector-panel chrome — hairline rules, monospace micro-labels, tick marks, corner brackets — never glass or gradient decoration for its own sake; that language wasn't tied to the shader and survives the pivot intact.

The build carries two deliberate, non-negotiable typography and motion facts forward as system invariants, not open questions: Unbounded is the one display face for all regular headings, while Oswald ("--font-wordmark") is reserved for the hero — the giant "RYDER" wordmark and its own ghosted echoes (edge lockups, background wall), never a second unrelated heading — because Unbounded alone read geometric/normal-width where the wordmark needed a condensed, poster-scale character. And the motion libraries in the stack are lane-disciplined, not overlapping: GSAP + ScrollTrigger + Lenis own all scroll choreography and pinning; Motion (`motion/react`, `layoutId`) owns exactly one shared-layout micro-interaction (the sliding nav active-link pill); anime.js owns exactly one section's entrance (the skills-grid card/tag stagger). A future edit should not blur these back together or add a redundant library for a job one of the three already owns.

Color is applied as instrumentation, not paint: the near-black/off-white ground is the resting state, and the three accents (teal, gold, coral) appear as small, purposeful signals — a status dot, a tick mark, a tag border — almost never as large fills. The hero's diagonal light streaks are the one deliberate, capped exception (see Colors — Named Rules). The one `backdrop-filter: blur()` left in the build (sticky nav background) is a narrow legibility scrim over moving content, not a glassmorphism system; it should not be read as license for decorative glass panels elsewhere.

**Key Characteristics:**
- Near-black instrumentation ground with three signal accents (teal, gold, coral) used sparingly and functionally, everywhere except the hero.
- The hero is a character-reveal card: illustrated portrait, gold frame, ghosted wordmark repeats — the page's one deliberately louder moment, not the norm to extend elsewhere.
- Inspector-panel chrome: hairlines, monospace micro-labels, corner-bracket details — flat by default, no shadow except the hero character's own drop-shadow.
- Two-face type system: Unbounded for every heading, Oswald confined to the hero wordmark and its ghosted echoes.
- Three animation libraries, three disjoint jobs — no overlap, no redundancy, and no 3D scene-graph rendering library: Three.js stays out. `HeroSmoke` owns a fourth, narrower lane: Pixi.js, a 2D sprite/particle renderer, for the hero's light-trail particle system — not a competitor to GSAP/Motion/anime.js's animation-timeline jobs, and still not a 3D scene graph.

## Colors

A near-black instrumentation ground carries three saturated signal colors used narrowly, plus a three-step ink scale for text hierarchy.

### Primary
- **Render Teal** (`#4fd1c5`): the system's default accent — logo dot, active nav state/pill accent color, primary button fill, hero eyebrow text, hero ambient glow, one hero light streak, first skill-group tick.

### Secondary
- **Signal Gold** (`#ffd166`): second accent — the hero's corner-bracket frame and ghosted edge wordmark, tag/chip borders and text in the project filmstrip, one hero light streak, shimmer/orb vessel color.

### Tertiary
- **Alert Coral** (`#ff6b6b`): reserved for diagnostic/alert-flavored content — the Android ANR case-study's pulse-orb vessel, one skill-group tick, third liquid-layer color in project vessels. Reads as "something under stress," matching its one case-study use. Never used in the hero's streaks or frame.

### Neutral
- **Viewport Black** (`#101214`, base `--bg`): page background.
- **Inset Black** (`#0b0c0e`, `--bg-inset`): recessed surfaces — cards, panels, marquee strip, project slides, about card.
- **Raised Panel** (`#17191c`, `--bg-raised`): the nav's active-pill fill and tag-chip background — the "one step up" surface.
- **Hairline** (`#2a2d31`, `--line`): default dividers and section borders.
- **Hairline Strong** (`#3d4147`, `--line-strong`): card/panel borders, ghost-button borders, corner-bracket accents' resting stroke.
- **Ink** (`#ecece7`, `--ink`): primary text and headings.
- **Ink Dim** (`#90959b`, `--ink-dim`): body copy, secondary text.
- **Ink Faint** (`#5b5f64`, `--ink-faint`): tertiary/label text, marquee items.

### Named Rules
**The Instrumentation-Only Rule.** Accent color (teal/gold/coral) is applied to small, functional marks — dots, ticks, borders, single HUD labels — never as a large background fill or a decorative gradient wash, everywhere except the hero. The hero's bottom band is the one large-surface exception, and it's exactly one band, built in two layers: the always-on CSS light streaks (`.hero-streaks`) and, where WebGL/motion/a fine pointer allow it, an animated noise-flow shader on top (`HeroSmoke`) — both a user-directed "agent reveal" escalation, both confined to the same low-opacity, screen-blended region at the very bottom of the hero. See Hero Character & Frame. Coral is excluded from both; it stays confined to its diagnostic/alert uses. Do not add a second large-surface exception outside this one band.

**The Legibility-Scrim, Not Glass, Rule.** `backdrop-filter: blur()` appears in exactly one place (sticky nav background) to keep text readable over moving content underneath. It is not a general glassmorphism device; new panels default to a flat, opaque `--bg-inset` surface with a hairline border instead.

## Typography

**Display Font:** Unbounded (`var(--font-display)`, weights 600/700/800), with sans-serif fallback.
**Wordmark Font:** Oswald (`var(--font-wordmark)`, weights 600/700) — condensed grotesk, reserved for exactly one element.
**Body Font:** IBM Plex Sans (`var(--font-body)`, weights 400/500/600).
**Label/Mono Font:** JetBrains Mono (`var(--font-mono)`, weights 400/500).

**Character:** Unbounded gives every heading a geometric, slightly display-weight presence without reading as condensed; JetBrains Mono carries every instrumentation label (nav links, tags, HUD text, chips) so the "inspector panel" reads consistently across the whole page; Oswald's condensed grotesk is deliberately confined to the one poster-scale wordmark that needs a narrower, taller character than Unbounded can give it.

### Hierarchy
- **Eyebrow** (500, 11.5px, JetBrains Mono, letter-spacing `0.14em`, uppercase, teal): one tracked line directly above the hero wordmark (`.hero-eyebrow`) — the two-tier "lead-in + poster lockup" the hero needed instead of the wordmark standing alone with no hierarchy above it. Confined to this one position; it is not a general section-eyebrow component.
- **Wordmark** (700, `clamp(72px, 14vw, 210px)`, line-height 0.8, letter-spacing `-0.03em`): the single decorative hero "RYDER" lockup, `aria-hidden`; the real `<h1>` is the sentence beneath it. Deliberately past the normal display ceiling — this is the site's one committed signature, not a precedent for other headings. Tracked tight enough that the letterforms read as one poster-scale block, not loose display type.
- **Display** (600, `clamp(28px, 3.6vw, 44px)`, tight tracking `-0.01em`): section headings (`h2`).
- **Hero Headline** (500, `clamp(19px, 1.9vw, 24px)`, line-height 1.4, max-width 19ch): the hero's real `<h1>` sentence. Deliberately quiet — the pitch group it leads reads as a small supporting block under the wordmark's scale, not a second headline competing with it.
- **Body** (400, 15px hero / 15–15.5px section body, line-height 1.68–1.75): paragraph copy, max-width 40ch hero / 50–58ch elsewhere. The hero's column is tighter than section body copy on purpose — a short, edited pitch, not a wide paragraph block.
- **Label** (400–500, 10–13px, JetBrains Mono, letter-spacing 0.03–0.08em, usually uppercase): nav links, HUD readouts, tags/chips, marquee items, footer credit line.
- **Hero Edge Word** (700, 48px, Oswald, letter-spacing `0.04em`, outline-only via `-webkit-text-stroke`, no fill): the ghosted vertical "RYDER" running along the hero's left edge (`.hero-edge-lockup`, wide desktop only). A second, deliberately quieter instance of the wordmark face — see the Hero Frame section below for why this doesn't break the One Wordmark Rule.

### Named Rules
**The One Wordmark Rule.** Oswald renders exactly one *heading* on the whole site (the hero "RYDER" lockup) — no other h1/h2-weight text, including section titles at similar visual size, is ever set in Oswald. The hero's own ghosted edge repeat (`.hero-edge-word`) is the one sanctioned exception: it isn't a second heading, it's the same wordmark echoed as a frame device around the real one (outline-only, no fill, confined to the hero's edge) — see Hero Frame. Do not introduce a third Oswald instance, or promote the edge echo into a readable heading, to "match" the hero elsewhere.

## Layout

Single-column content sits inside a `1120px` max-width container with `24px` side padding (`.container`). Sections use a flat, repeated shell: `64px` vertical padding, a `1px` hairline bottom border, and a `section-head` block (`h2` + one `.section-sub` paragraph, max 58ch) that precedes the section's content.

The page is one continuous run of full-bleed pinned "stage" moments, book-ended by normal-flow chrome: sticky inspector nav (60px, `position: sticky`) → full-bleed marquee ribbon → full-viewport pinned hero (`100vh`, GSAP ScrollTrigger `pin: true`, desktop/fine-pointer only) → full-viewport pinned horizontal project filmstrip (same pin pattern) → three more full-viewport pinned scenes (skills, about, contact — see `PinnedScene`) → footer. Every pinned scene is full-bleed at its root (its own grid-floor + accent-glow background), with a `.container` div nested inside for the actual text column — the section itself is the scene's viewport, not a centered content block that happens to be pinned. All pinned stages are desktop-with-hover-only; touch and `prefers-reduced-motion` fall back to plain auto-height document flow with scroll-linked (not pinned) entrance animation, never a static frame.

### Hero Composition (masthead / open stage / pitch)
Desktop, the hero's copy column does not sit as one centered stacked block — it splits into two groups pinned to opposite ends of the 100vh frame (`.hero-copy-inner`, `display:flex; flex-direction:column; justify-content:space-between`), with the character portrait given the open middle to stand in: a **masthead** (`.hero-masthead`: eyebrow + wordmark) anchored near the top, and the **pitch** (headline + paragraph + CTA row) anchored near the bottom. This is deliberate — a single eyebrow→h1→paragraph→dual-button stack read as generic template boilerplate at the wordmark's scale; splitting the copy into two small, quiet groups with real negative space between them reads as an edited, considered layout instead. `.hero-copy-inner`'s padding (`110px 0 140px`) is asymmetric on purpose: `.hero-pin` is a full `100vh` box, but the nav + marquee ahead of it in document flow push its top ~100px below the actual viewport top at rest (before GSAP's pin engages on scroll), so the bottom padding is generous enough that the pitch group — CTA included — still lands inside the frame that's actually visible at scroll 0, not just inside the box's own coordinate space. Mobile/touch/reduced-motion never gets this split; it falls back to the plain stacked flow (`.hero-copy-wrap`/`.hero-masthead` render as ordinary blocks with no flex).

Grids used: the skills grid is `repeat(auto-fit, minmax(220px, 1fr))` with a 1px `--line`-colored gap that doubles as hairline dividers between cards. The about section is an `0.8fr 1.2fr` two-column grid collapsing to one column under 760px. The project filmstrip is a horizontal flex track (`gap: 28px`), each slide `min(480px, 82vw)` wide.

## Elevation & Depth

The system is flat by default: nearly every surface (cards, panels, chips, nav) is a solid `--bg-inset` or `--bg-raised` fill with a 1px hairline border and no shadow. Depth in the hero comes from real layering (ghost wall behind character, character in front of it, frame chrome on top) rather than drop shadows; elsewhere, depth is conveyed by surface tone alone (inset vs. raised).

### Shadow Vocabulary
- **Character lift** (`filter: drop-shadow(0 30px 54px rgba(0,0,0,0.55))`, `.hero-character img`): the one floating element on the page — a soft ambient shadow grounding the portrait against the backdrop. Not reused elsewhere.

### Named Rules
**The Flat-Surface Rule.** Cards, panels, chips, and nav are flat at rest — hairline border, no shadow. Shadow is reserved for the hero's character portrait; introducing shadows on ordinary cards breaks the inspector-panel flatness the rest of the system depends on.

## Shapes

Corners are small and utilitarian: `3px` (`--radius-sm`), the one radius token in the system, default for buttons, tags, and the nav pill. Nothing uses a large or pill-shaped radius except orb vessels (`border-radius: 50%`), which are deliberately circular render objects, not a rounded-corner convention.

Borders are hairline (1px, `--line` or `--line-strong`) throughout — never a heavier structural border. A recurring signature detail is the open corner-bracket ("viewfinder") mark: two 1.5px `--teal` L-shaped strokes at opposite corners of the about-card, the same four-tick pattern in the custom cursor reticle, and — bolder, 2px `--gold`, at all four true corners — the hero's frame (`.hero-frame-corner`, see Hero Character & Frame). This is the system's one non-hairline decorative device, and it is confined to these three uses — it reads as a targeting/inspection reticle (about-card, cursor) or a reveal-poster frame (hero), not a generic corner ornament to scatter on new cards.

## Components

### Buttons
- **Shape:** small radius (`3px`).
- **Primary:** teal fill (`#4fd1c5`), dark ink text (`#06201d`), 1px teal border, 600 weight, `12px 20px` padding, JetBrains Mono label type. Hover brightens the fill to `#6fe0d4` and lifts `1px` on translateY, plus a GSAP-driven magnetic pull toward the cursor within a small radius (`MagneticButton`: `x * 0.3`, `y * 0.45`, `power3` ease) that springs back to rest on mouse-leave.
- **Ghost:** transparent fill, `--ink` text, `--line-strong` border; hover shifts both border and text to teal. Same magnetic behavior as primary.
- **Link** (`.btn-link`, hero only): no fill, no border — an underlined text link with a trailing arrow glyph (`.btn-link-arrow`) that nudges right on hover. Reserved for the hero's secondary action so it doesn't read as a second boxed button competing with the primary CTA at the wordmark's scale; every other secondary action in the build stays `.btn-ghost`.

### Chips / Tags
- **Skill tag** (`.tag`): `--bg-raised` fill, `--line` border, `--ink-dim` text, mono, 11.5px, small radius.
- **Project stack chip** (`.chip`): transparent fill, gold text, a translucent gold-tinted border (`rgba(255,209,102,0.28)`) — the one chip variant that carries an accent color rather than neutral ink, distinguishing "tech stack" tags from generic skill tags.

### Cards / Containers
- **Corner Style:** no radius on `project-slide`, `about-card`, `skill-card`, `contact-panel` — these are square-cornered inspector panels; small radius is reserved for buttons/tags/chips, not full panels.
- **Background:** `--bg-inset` (recessed) is the default card fill.
- **Shadow Strategy:** none (see Elevation & Depth — Flat-Surface Rule).
- **Border:** 1px `--line-strong`.
- **Internal Padding:** 22–28px for panel-level cards (`project-slide`, `about-card`); 22px top-heavy for `skill-card`.
- **Interactive tilt:** project/skill cards use a shared `TiltCard` primitive (mouse-tracking 3D rotation via `useTilt`, disabled on coarse pointers) with an optional diagonal glare sweep on hover — the system's one recurring "tactile" card behavior.

### Navigation
- Sticky top bar (60px), translucent dark background with a 6px legibility blur, 1px bottom hairline. Logo is a small teal square dot + Unbounded wordmark text. Links are mono, uppercase (`text-transform`), 12.5px with `0.07em` tracking, `--ink-dim` at rest, teal on hover/focus/active. The active link's highlight is a single shared Motion (`layoutId="nav-pill"`) element that glides between link positions on scroll-driven section change (via `IntersectionObserver`), rather than snapping or fading — the page's one Motion-owned interaction. Mobile (<640px) hides the link list entirely; no hamburger menu exists in the build.
- **Chrome-less first frame.** The nav starts invisible (`autoAlpha: 0`) and fades in over the first ~160px of scroll (`SiteNav`'s own GSAP ScrollTrigger on `document.documentElement`), so the very first thing a visitor sees is the hero alone — no bar, no links — like a title card, matching the reference's nav-less opening frame. It reappears the instant the visitor starts scrolling, not gated behind the full hero span. Desktop/no-reduced-motion only; touch and `prefers-reduced-motion` keep the nav visible from load, since there's no scroll-linked precision to hide it against.

### Hero Character & Frame (signature component)
The hero's centerpiece is a commissioned illustrated bust portrait (`public/ryder-portrait.png`/`.webp`, transparent background, pre-trimmed to its content bounds) standing right-of-center. It's framed by four gold corner brackets (`.hero-frame-corner`, 2px `--gold` L-strokes) at the hero's true corners, mirrored ghosted "RYDER" wordmarks running both edges (`.hero-edge-lockup--left`/`--right`, outline-only Oswald, wide desktop only — narrower desktop widths lose the `.container` margin the left one needs to clear the masthead/pitch text underneath; the right one is deliberately off-center, below `.scroll-hud`'s vertical-center track rather than fighting it for the same space), and a low band of flowing teal/gold color across the frame's bottom: always-on CSS light streaks (`.hero-streaks`) with an animated particle system layered on top where it can run (`HeroSmoke` — see below). Behind all of it, `.hero-ghost-wall` tiles six rows of outline-only "RYDER" at a slight rotation — the backdrop texture, replacing an earlier live Three.js shader material with the same repeated-wordmark technique the Valorant reference actually uses (see Overview). Together these read as a game "agent reveal" card rather than a generic hero photo — a deliberate, user-directed escalation past the system's usual restraint (see Colors — Named Rules for what that costs and where the line still holds). Below 900px width, `.hero-character` switches from absolute positioning (sized against `.hero-pin`'s 100vh box, which mobile's plain stacked document flow doesn't have) to `position: relative`, moving in the DOM to render after `.container.hero` so it appears below the copy instead of fighting it for the same space — sized directly on the `<img>` itself (`height: 46vh`, not a percentage routed through the flex wrapper, which doesn't reliably resolve against a flex item's own definite cross-size and silently fell back to intrinsic-aspect-ratio sizing off the full container width, oversized enough to overlap the copy above it). `.hero-scrim`'s mobile gradient — originally a fixed `100vh` fade that predated this and was dead code without a mobile character to show through it — now stretches via `top`/`bottom` to the section's actual (now taller) content height instead, and its stops are spread across more intermediate steps to avoid a visible Mach-band kink where the fade rate suddenly changed, both of which showed as a visible seam across the jacket's flat color before being fixed. A third, unrelated seam came from `.hero-streaks` itself: its `overflow: hidden` clip, combined with `mix-blend-mode: screen`, rendered as a visible line at the container's own top edge wherever that edge crossed the character — a compositing artifact at the clip boundary, not anything drawn there on purpose. Fixed by dropping `overflow: hidden`; the two streak bars' blur bleeding a little past the box's edges is harmless, unlike a hard clip line was. The ghost wall and frame chrome still show on mobile at a smaller scale, and `HeroSmoke` now runs there too (see below) — only `.hero-edge-lockup` stays desktop-only.

**Stacking note.** The hero's paint order, by z-index (low to high): `.hero-ghost-wall` (auto, no z-index) → `.hero-scrim`/`.hero-character` (1) → `.hero-edge-lockup`/`.hero-streaks`/`.hero-smoke-canvas` (2, same tier as `.container.hero`, the copy) → `.hero-frame-corner` (3) → `.hero-vignette` (4, so the scene's cut to black covers the character and every frame device, not just the backdrop). This is numeric z-index order, not DOM order — `.hero-character` is now last in the DOM (see Hero Character & Frame, for the mobile flow reason) but its z-index: 1 still keeps it under everything above it regardless. A new floating hero element should slot into this scale rather than pick an unrelated number. (History: this section used to warn about a stacking-context trap from the Three.js canvas's container forcing an explicit `z-index: 0` — that container is gone along with the shader, so the trap can't recur here, but the same rule applies to any future `position: absolute` + explicit `z-index` wrapper: it isolates its children's stacking from everything outside it, regardless of their own z-index.)

### Hero Smoke (signature component)
`HeroSmoke` (`components/HeroSmoke.tsx`) is a Pixi.js sprite particle system, not an analytic shader shape — a deliberate technique change, not just another tuning pass. Every earlier version was a single continuous procedural shape (isotropic fbm noise, noise-derived `fract()` "lanes," additive gaussian-band ribbons, then sharp-edged max-blended ribbons) and every one of them read as a smooth, clean, mathematically-continuous vector shape no matter how its width/taper/noise was tuned — because that's what a single continuous analytic band *is*. Real VFX tools (Unity's Shuriken, Unreal's Niagara) don't build a "flying light trail" that way; they build it from many small soft sprites with randomized size/opacity/drift, which is what actually produces organic-looking texture. Pixi is a 2D sprite/particle renderer with blend modes — a right-sized choice for that job, not a 3D scene graph, so it doesn't reopen the "don't reintroduce Three.js" rule (see Library Lane Rule).

The system: a pool of ~90 sprites (a soft radial-gradient "puff" texture, generated once on an offscreen canvas, not a fabricated image asset) continuously emitted from one fixed source point low-right in the frame, each with its own velocity along a shared flow direction (steep, up-left) plus random perpendicular spread, teal/gold tint, and 1.1–2.4s lifetime; expired particles reset to the source rather than being destroyed/recreated. Each sprite is **rotated to match its own velocity and stretched non-uniformly** (`scale.set(base*2.6, base*0.6)`) into a small oriented streak rather than a round dot — round dots, even many of them, read as a static glowing cluster near the source with no sense of motion; an elongated sprite pointed the way it's actually traveling is what makes the flow direction and the "flying" motion legible at a glance. Sprites blend with **`screen`**, not `add`: an early pass with `add` and larger/brighter sprites saturated straight to a single blown-out white disc wherever several overlapped, which is easy to hit when a continuously-emitting pool naturally clusters near its own source — `screen`'s `1-(1-a)(1-b)` accumulation approaches white asymptotically instead of clipping to it outright, and dropping sprite size/alpha considerably (from the first pass's up-to-280px/0.32-alpha down to a smaller, dimmer range) left room for the overlaps it's good at (genuinely brighter where several coincide) without every dense frame near the source clipping flat. Alpha is shaped by four independent falloffs multiplied together, each solving a specific failure seen in testing: fade in/out over each particle's own lifetime (a puff, not a hard-edged sprite popping in and out); a horizontal `edgeFall` keeping the trail clear of the copy column on the left (mirrors the previous shader's `smoothstep(0.14, 0.42, ...)`); and a vertical `topFall` (`clamp((y/h - 0.65) / 0.23, 0, 1)`) that fades particles out once they've traveled far enough up the frame to reach the headline's row — calibrated against the actual on-page bounding boxes of the canvas and the `<h1>` (`(h1.top - canvas.top) / canvas.height`), not eyeballed, because reach alone regularly carried particles across "Gameplay that ships. / Shaders I write myself." in testing before this was added.

**Debugging note.** The single biggest bug during this rewrite wasn't a tuning problem: the initial particle pool assigned each sprite a random starting *age* (so the pool wouldn't all be born and die in lockstep) but always positioned it at the exact source point regardless of that age, so for the pool's first ~1.5s of real time every sprite sat stacked on the source — however "old" its age field claimed — before its own velocity had carried it anywhere. Fixed by fast-forwarding each fresh particle's spawn position by `velocity × age`. The lesson generalizes: when a particle/object pool pre-populates with randomized lifecycle state to avoid a synchronized pulse, every other piece of that object's state (position, scale, whatever the lifecycle state is supposed to represent) has to be advanced to match, or the pool renders as freshly-spawned regardless of what its bookkeeping says.

Rendered via `app.init({ canvas, resizeTo: canvas, resolution: min(devicePixelRatio, 1.5) })` and composited with `mix-blend-mode: screen` at the CSS level (on top of each particle's own internal `screen` blend against other particles — two different compositing questions: how particles blend with each other, and how the whole canvas blends with the page). No-reduced-motion only — no separate pointer/hover gate, unlike the shader version this replaced (see the component's own top comment: a ~90-sprite pool is cheap enough that the old "desktop/fine-pointer only" restriction, really a proxy for "don't run a per-pixel fragment shader on a weak mobile GPU," doesn't apply to it), so it now runs on mobile too. `Application.init()`'s rejection is caught and treated as "can't run" the same as a missing WebGL context would be, paused via `ticker.stop()`/`start()` on `visibilitychange`, and fully torn down (`app.destroy(true, { children: true, texture: true })`) on unmount. `.hero-streaks` is not a loading state for this — it's the permanent, always-rendered base layer everywhere `HeroSmoke` can't or won't run (reduced motion, WebGL unavailable), so the bottom band is never empty.

### Project Vessel (signature component)
The small per-project "bottle" or "orb" glyph (`ProjectVessel`) rendered in flat CSS/HTML rather than 3D: a bottle is a bordered rectangle with stacked color-layer divs; an orb is a circle with a radial gradient between two project-specific colors, optionally animated with a diagonal shimmer sweep or a soft coral pulse glow. Each project's vessel colors are drawn from the same teal/gold/coral system palette, making the filmstrip read as variations on one material rather than four unrelated illustrations.

### Scene Transition Grammar (signature interaction)
Every scroll boundary between pinned stages (hero → projects → skills → about → contact) shares one motion vocabulary: real 3D perspective, not a 2D crossfade standing in for depth. Content arrives tilted back and distant (`rotateX` off vertical, negative `translateZ`, reduced scale, blurred), levels out to a flat, sharp, held dwell for reading, then keeps traveling forward and tilts the other way as it exits (positive `translateZ`, opposite `rotateX`, increased scale, re-blurred) — the same "arrive → dwell → depart" beat `PinnedScene` drives with one GSAP scrub timeline (`transformPerspective` set once per element, `power2.out`/`power2.in` eases shaping the curve, not linear scrub). `HeroPinned`'s copy exit and `ProjectGallery`'s first-slide entrance use the identical grammar so the hero → filmstrip hand-off reads as one continuous camera move rather than a different effect at that one boundary. Within the filmstrip itself, cards additionally bank in `rotateY` as they pass the pin's horizontal center (`ProjectGallery`'s `updateTilt`), like exhibits arranged on a shallow arc the camera pans across.

Each pinned scene is also a distinct "location," not a repeated card on identical ground: `PinnedScene`'s root section is full-bleed (not the `.container`-classed content itself) and carries a persistent low-opacity engine-grid pattern plus one accent-tinted ambient glow (`accent="teal"|"gold"`, positioned per scene via `--glow-x`/`--glow-y`) — same alpha range (~0.1) as the hero's own ambient radial glow on `.hero-pin`, so this stays inside the Instrumentation-Only Rule rather than introducing a new large color fill. Coral is not used for scene glows; it stays confined to its existing diagnostic/alert uses.

### Named Rules
**The One Flight Grammar Rule.** Every pinned scene boundary — hero exit, filmstrip entrance, and all three `PinnedScene` sections — uses the same arrive/dwell/depart perspective transform (`rotateX` + `translateZ` + scale + blur), not a mix of fades, wipes, and zooms. A new pinned moment should extend this grammar, not invent a second one.

## Do's and Don'ts

### Do:
- **Do** keep accent color (teal/gold/coral) to small functional marks — dots, ticks, chip borders, single HUD labels — per the Instrumentation-Only Rule.
- **Do** set every heading in Unbounded; reserve Oswald for the one hero wordmark only.
- **Do** keep cards and panels flat (hairline border, no shadow) at rest; the hero character's drop-shadow stays the one exception.
- **Do** route scroll choreography and pinning through GSAP + ScrollTrigger + Lenis, the nav pill through Motion's `layoutId`, and the skills-grid entrance through anime.js — one library per job, per the Library Lane Rule. Pixi.js owns exactly one lane (the hero's `HeroSmoke` particle system) — a 2D sprite/particle renderer, not a 3D scene graph. Don't reintroduce Three.js or another 3D/canvas library without discussing it first, and don't reach for Pixi outside its one lane without the same discussion.
- **Do** provide a non-pinned, scroll-linked (not static) fallback for any pinned moment on touch and `prefers-reduced-motion`, matching the pattern already in `HeroPinned` and `ProjectGallery`.

### Don't:
- **Don't** add decorative `backdrop-filter` glass panels beyond the nav's one functional legibility scrim — the brief explicitly rejects glass/gradient decoration as chrome.
- **Don't** apply the corner-bracket ("viewfinder") device to arbitrary new cards; it's confined to the about-card, cursor reticle, and hero frame, not a general corner ornament.
- **Don't** give ordinary content cards a rounded radius — square corners are the panel convention; small radius (3px/6px) is reserved for buttons, tags, and chips.
- **Don't** introduce a second animation library for a job one of the three (GSAP/Motion/anime.js) already owns.
