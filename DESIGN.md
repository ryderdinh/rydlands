---
name: Ryder — Render Bench
description: A Unity shader developer's portfolio that behaves like a live engine viewport, not a page describing one.
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

# Design System: Ryder — Render Bench

## Overview

**Creative North Star: "The Render Bench"**

The site is not a page that describes a shader developer — it is presented as the live engine viewport itself, refusing the category-default "hero photo + text card" portfolio shell. A near-black ground reads as a scene backdrop, not a page background; a single live procedural Three.js material (the "blob") is the recurring visual motif rather than a decorative hero graphic; and UI chrome throughout reads as an inspector panel — hairline rules, monospace micro-labels, tick marks, corner brackets — never as glass or gradient decoration for its own sake.

The build carries two deliberate, non-negotiable typography and motion facts forward as system invariants, not open questions: Unbounded is the one display face for all regular headings, while Oswald ("--font-wordmark") is reserved for exactly one element — the giant hero "RYDER" wordmark — because Unbounded alone read geometric/normal-width where the wordmark needed a condensed, poster-scale character. And the four motion libraries in the stack are lane-disciplined, not overlapping: GSAP + ScrollTrigger + Lenis own all scroll choreography and pinning; Three.js owns only the hero's live procedural shader material; Motion (`motion/react`, `layoutId`) owns exactly one shared-layout micro-interaction (the sliding nav active-link pill); anime.js owns exactly one section's entrance (the skills-grid card/tag stagger). A future edit should not blur these back together or add a redundant library for a job one of the four already owns.

Color is applied as instrumentation, not paint: the near-black/off-white ground is the resting state, and the three accents (teal, gold, coral) appear as small, purposeful signals — a status dot, a tick mark, a tag border — almost never as large fills. The two `backdrop-filter: blur()` uses in the build (sticky nav background, the hero telemetry chip) are narrow legibility scrims over moving content, not a glassmorphism system; they should not be read as license for decorative glass panels elsewhere.

**Key Characteristics:**
- Near-black engine-viewport ground with three signal accents (teal, gold, coral) used sparingly and functionally.
- One live WebGL shader material as the page's signature visual, not a static hero image.
- Inspector-panel chrome: hairlines, monospace micro-labels, corner-bracket details — flat by default, shadow reserved for exactly one floating element.
- Two-face type system: Unbounded for every heading, Oswald confined to the single hero wordmark.
- Four animation libraries, four disjoint jobs — no overlap, no redundancy.

## Colors

A near-black instrumentation ground carries three saturated signal colors used narrowly, plus a three-step ink scale for text hierarchy.

### Primary
- **Render Teal** (`#4fd1c5`): the system's default accent — logo dot, active nav state/pill accent color, primary button fill, telemetry status dot, first shader-material color stop, first skill-group tick.

### Secondary
- **Signal Gold** (`#ffd166`): second accent — used for one HUD label (`stage-hud-b`), tag/chip borders and text in the project filmstrip, second shader-material color stop, shimmer/orb vessel color.

### Tertiary
- **Alert Coral** (`#ff6b6b`): reserved for diagnostic/alert-flavored content — the Android ANR case-study's pulse-orb vessel, one skill-group tick, third liquid-layer color in project vessels. Reads as "something under stress," matching its one case-study use.

### Neutral
- **Viewport Black** (`#101214`, base `--bg`): page background.
- **Inset Black** (`#0b0c0e`, `--bg-inset`): recessed surfaces — cards, panels, marquee strip, project slides, about card.
- **Raised Panel** (`#17191c`, `--bg-raised`): the nav's active-pill fill and tag-chip background — the "one step up" surface.
- **Hairline** (`#2a2d31`, `--line`): default dividers and section borders.
- **Hairline Strong** (`#3d4147`, `--line-strong`): card/panel borders, ghost-button borders, corner-bracket accents' resting stroke.
- **Ink** (`#ecece7`, `--ink`): primary text and headings.
- **Ink Dim** (`#90959b`, `--ink-dim`): body copy, secondary text.
- **Ink Faint** (`#5b5f64`, `--ink-faint`): tertiary/label text, marquee items, idle telemetry dot.

### Named Rules
**The Instrumentation-Only Rule.** Accent color (teal/gold/coral) is applied to small, functional marks — dots, ticks, borders, single HUD labels — never as a large background fill or a decorative gradient wash. Two large-surface exceptions exist, both deliberate and both capped: the live shader material itself, where color is the subject rather than a signal, and the hero's diagonal light streaks (`.hero-streaks`), a user-directed "agent reveal" escalation confined to a low-opacity, screen-blended band at the very bottom of the hero — see Hero Character & Frame. Coral is excluded from the streaks; it stays confined to its diagnostic/alert uses. Do not add a third.

**The Legibility-Scrim, Not Glass, Rule.** `backdrop-filter: blur()` appears in exactly two places (sticky nav background, hero telemetry chip) to keep text readable over moving content underneath. It is not a general glassmorphism device; new panels default to a flat, opaque `--bg-inset` surface with a hairline border instead.

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
Desktop, the hero's copy column does not sit as one centered stacked block — it splits into two groups pinned to opposite ends of the 100vh frame (`.hero-copy-inner`, `display:flex; flex-direction:column; justify-content:space-between`), with the shader mesh given the open middle to breathe: a **masthead** (`.hero-masthead`: eyebrow + wordmark) anchored near the top, and the **pitch** (headline + paragraph + CTA row) anchored near the bottom. This is deliberate — a single eyebrow→h1→paragraph→dual-button stack read as generic template boilerplate at the wordmark's scale; splitting the copy into two small, quiet groups with real negative space between them reads as an edited, considered layout instead. `.hero-copy-inner`'s padding (`110px 0 140px`) is asymmetric on purpose: `.hero-pin` is a full `100vh` box, but the nav + marquee ahead of it in document flow push its top ~100px below the actual viewport top at rest (before GSAP's pin engages on scroll), so the bottom padding is generous enough that the pitch group — CTA included — still lands inside the frame that's actually visible at scroll 0, not just inside the box's own coordinate space. Mobile/touch/reduced-motion never gets this split; it falls back to the plain stacked flow (`.hero-copy-wrap`/`.hero-masthead` render as ordinary blocks with no flex).

Grids used: the skills grid is `repeat(auto-fit, minmax(220px, 1fr))` with a 1px `--line`-colored gap that doubles as hairline dividers between cards. The about section is an `0.8fr 1.2fr` two-column grid collapsing to one column under 760px. The project filmstrip is a horizontal flex track (`gap: 28px`), each slide `min(480px, 82vw)` wide.

## Elevation & Depth

The system is flat by default: nearly every surface (cards, panels, chips, nav) is a solid `--bg-inset` or `--bg-raised` fill with a 1px hairline border and no shadow. Depth is conveyed by layering (inset vs. raised surface tone) and by the live 3D scene itself (fog, camera dolly, parallax), not by drop shadows.

### Shadow Vocabulary
- **Telemetry lift** (`box-shadow: 0 16px 34px -14px rgba(0,0,0,0.6)`): the one floating element on the page (hero telemetry chip) — a soft ambient shadow to read as detached from the viewport surface. Not reused elsewhere.
- **Status-dot glow** (`box-shadow: 0 0 0 3px rgba(79,209,197,0.18)`): a soft ring around the live telemetry dot, signaling "active," paired with a pulse opacity animation.

### Named Rules
**The Flat-Surface Rule.** Cards, panels, chips, and nav are flat at rest — hairline border, no shadow. Shadow is reserved for the single floating telemetry chip; introducing shadows on ordinary cards breaks the inspector-panel flatness the rest of the system depends on.

## Shapes

Corners are small and utilitarian: `3px` (`--radius-sm`, the default for buttons, tags, nav pill, telemetry dot) and `6px` (`--radius-md`, the telemetry chip's slightly larger panel). Nothing uses a large or pill-shaped radius except the fully circular telemetry dot and orb vessels (`border-radius: 50%`), which are deliberately circular render objects, not a rounded-corner convention.

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
- **Chrome-less first frame.** The nav starts invisible (`autoAlpha: 0`) and fades in over the first ~160px of scroll (`SiteNav`'s own GSAP ScrollTrigger on `document.documentElement`), so the very first thing a visitor sees is the render stage alone — no bar, no links — like a title card, matching the reference's nav-less opening frame. It reappears the instant the visitor starts scrolling, not gated behind the full hero span. Desktop/no-reduced-motion only; touch and `prefers-reduced-motion` keep the nav visible from load, since there's no scroll-linked precision to hide it against.

### Render Stage (signature component)
The hero's full-bleed Three.js canvas: a single `IcosahedronGeometry` with a custom noise-displaced, fresnel-mixed `ShaderMaterial` (teal→gold color stops over a near-black base), a soft additive dust-point field for depth, and a GSAP `quickTo`-driven parallax that tilts the mesh toward the cursor. Camera dollies and fog density are scroll-scrubbed (GSAP ScrollTrigger) against the same span `HeroPinned` uses to pin the section, so the render literally moves the viewer through the scene as they scroll. A `stage-hud` overlay (mono micro-labels, teal/gold) and a floating telemetry chip (live fps + elapsed time, teal pulsing status dot) read the scene like an engine debug view. On WebGL failure it falls back to a static radial-gradient glow rather than an empty box; on `prefers-reduced-motion` it renders one static frame with no telemetry.

### Hero Character & Frame (signature component)
The hero's centerpiece is a commissioned illustrated bust portrait (`public/ryder-portrait.png`/`.webp`, transparent background, pre-trimmed to its content bounds) standing right-of-center in front of the Render Stage's shader mesh — the mesh now reads as the character's own glowing energy/aura rather than a competing abstract graphic. It's framed by four gold corner brackets (`.hero-frame-corner`, 2px `--gold` L-strokes) at the hero's true corners, a ghosted vertical "RYDER" running the left edge (`.hero-edge-lockup`, outline-only Oswald, wide desktop only — narrower desktop widths lose the `.container` margin this needs to clear the masthead/pitch text underneath), and two soft diagonal teal/gold light streaks low in the frame (`.hero-streaks`, `mix-blend-mode: screen`, glowing across the character's lower half). Together these read as a game "agent reveal" card rather than a generic hero photo — a deliberate, user-directed escalation past the system's usual restraint (see Named Rules below for what that costs and where the line still holds). Hidden entirely below 900px width: the character's absolute positioning sizes itself against `.hero-pin`'s 100vh box, which mobile's plain stacked flow doesn't have, so naive scaling buried the copy under a full-resolution portrait — a right-sized non-overlapping mobile treatment is future work, not yet built.

**Stacking note.** `.hero-stage` (the Three.js canvas's container) deliberately carries no `z-index` — giving it one would make it a stacking context that traps its children (the canvas, the telemetry chip) at that single layer regardless of their own `z-index`, which silently capped the telemetry chip below anything added later. The hero's real paint order, back to front, is: canvas/stage-hud (auto) → `.hero-scrim` (1) → `.hero-character` (1, after scrim in DOM) → `.telemetry-chip`/`.hero-edge-lockup`/`.hero-streaks` (2) → `.hero-frame-corner` (3) → `.hero-vignette` (4, so the scene's cut to black covers the character and every frame device, not just the shader). A new floating hero element should slot into this scale rather than pick an unrelated number.

### Project Vessel (signature component)
The small per-project "bottle" or "orb" glyph (`ProjectVessel`) rendered in flat CSS/HTML rather than 3D: a bottle is a bordered rectangle with stacked color-layer divs; an orb is a circle with a radial gradient between two project-specific colors, optionally animated with a diagonal shimmer sweep or a soft coral pulse glow. Each project's vessel colors are drawn from the same teal/gold/coral system palette, making the filmstrip read as variations on one material rather than four unrelated illustrations.

### Scene Transition Grammar (signature interaction)
Every scroll boundary between pinned stages (hero → projects → skills → about → contact) shares one motion vocabulary: real 3D perspective, not a 2D crossfade standing in for depth. Content arrives tilted back and distant (`rotateX` off vertical, negative `translateZ`, reduced scale, blurred), levels out to a flat, sharp, held dwell for reading, then keeps traveling forward and tilts the other way as it exits (positive `translateZ`, opposite `rotateX`, increased scale, re-blurred) — the same "arrive → dwell → depart" beat `PinnedScene` drives with one GSAP scrub timeline (`transformPerspective` set once per element, `power2.out`/`power2.in` eases shaping the curve, not linear scrub). `HeroPinned`'s copy exit and `ProjectGallery`'s first-slide entrance use the identical grammar so the hero → filmstrip hand-off reads as one continuous camera move rather than a different effect at that one boundary. Within the filmstrip itself, cards additionally bank in `rotateY` as they pass the pin's horizontal center (`ProjectGallery`'s `updateTilt`), like exhibits arranged on a shallow arc the camera pans across.

Each pinned scene is also a distinct "location," not a repeated card on identical ground: `PinnedScene`'s root section is full-bleed (not the `.container`-classed content itself) and carries a persistent low-opacity engine-grid pattern plus one accent-tinted ambient glow (`accent="teal"|"gold"`, positioned per scene via `--glow-x`/`--glow-y`) — same alpha range as the hero's existing WebGL-fallback glow, so this stays inside the Instrumentation-Only Rule rather than introducing a new large color fill. Coral is not used for scene glows; it stays confined to its existing diagnostic/alert uses.

### Named Rules
**The One Flight Grammar Rule.** Every pinned scene boundary — hero exit, filmstrip entrance, and all three `PinnedScene` sections — uses the same arrive/dwell/depart perspective transform (`rotateX` + `translateZ` + scale + blur), not a mix of fades, wipes, and zooms. A new pinned moment should extend this grammar, not invent a second one.

## Do's and Don'ts

### Do:
- **Do** keep accent color (teal/gold/coral) to small functional marks — dots, ticks, chip borders, single HUD labels — per the Instrumentation-Only Rule.
- **Do** set every heading in Unbounded; reserve Oswald for the one hero wordmark only.
- **Do** keep cards and panels flat (hairline border, no shadow) at rest; the telemetry chip's shadow stays the one exception.
- **Do** route scroll choreography and pinning through GSAP + ScrollTrigger + Lenis, the hero's live material through Three.js, the nav pill through Motion's `layoutId`, and the skills-grid entrance through anime.js — one library per job, per the Library Lane Rule.
- **Do** provide a non-pinned, scroll-linked (not static) fallback for any pinned/3D moment on touch and `prefers-reduced-motion`, matching the pattern already in `HeroPinned`, `HeroScope`, and `ProjectGallery`.

### Don't:
- **Don't** add decorative `backdrop-filter` glass panels beyond the two functional legibility scrims (nav, telemetry chip) — the brief explicitly rejects glass/gradient decoration as chrome.
- **Don't** apply the corner-bracket ("viewfinder") device to arbitrary new cards; it's confined to the about-card, cursor reticle, and hero frame, not a general corner ornament.
- **Don't** give ordinary content cards a rounded radius — square corners are the panel convention; small radius (3px/6px) is reserved for buttons, tags, and chips.
- **Don't** introduce a second animation library for a job one of the four (GSAP/Three.js/Motion/anime.js) already owns.
