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
    lineHeight: 0.82
    letterSpacing: "-0.01em"
  display:
    fontFamily: "var(--font-display), sans-serif"
    fontSize: "clamp(28px, 3.6vw, 44px)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  hero-h1:
    fontFamily: "var(--font-display), sans-serif"
    fontSize: "clamp(22px, 2.6vw, 32px)"
    fontWeight: 600
    lineHeight: 1.32
    letterSpacing: "-0.01em"
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
**The Instrumentation-Only Rule.** Accent color (teal/gold/coral) is applied to small, functional marks — dots, ticks, borders, single HUD labels — never as a large background fill or a decorative gradient wash. The only large-surface color exception is the live shader material itself, which is the one place color is the subject rather than a signal.

**The Legibility-Scrim, Not Glass, Rule.** `backdrop-filter: blur()` appears in exactly two places (sticky nav background, hero telemetry chip) to keep text readable over moving content underneath. It is not a general glassmorphism device; new panels default to a flat, opaque `--bg-inset` surface with a hairline border instead.

## Typography

**Display Font:** Unbounded (`var(--font-display)`, weights 600/700/800), with sans-serif fallback.
**Wordmark Font:** Oswald (`var(--font-wordmark)`, weights 600/700) — condensed grotesk, reserved for exactly one element.
**Body Font:** IBM Plex Sans (`var(--font-body)`, weights 400/500/600).
**Label/Mono Font:** JetBrains Mono (`var(--font-mono)`, weights 400/500).

**Character:** Unbounded gives every heading a geometric, slightly display-weight presence without reading as condensed; JetBrains Mono carries every instrumentation label (nav links, tags, HUD text, chips) so the "inspector panel" reads consistently across the whole page; Oswald's condensed grotesk is deliberately confined to the one poster-scale wordmark that needs a narrower, taller character than Unbounded can give it.

### Hierarchy
- **Wordmark** (700, `clamp(72px, 14vw, 210px)`, line-height 0.82): the single decorative hero "RYDER" lockup, `aria-hidden`; the real `<h1>` is the sentence beneath it. Deliberately past the normal display ceiling — this is the site's one committed signature, not a precedent for other headings.
- **Display** (600, `clamp(28px, 3.6vw, 44px)`, tight tracking `-0.01em`): section headings (`h2`).
- **Hero Headline** (600, `clamp(22px, 2.6vw, 32px)`, line-height 1.32, max-width 20ch): the hero's real `<h1>` sentence.
- **Body** (400, 16.5px hero / 15–15.5px section body, line-height 1.65–1.75): paragraph copy, max-width 50–58ch.
- **Label** (400–500, 10–13px, JetBrains Mono, letter-spacing 0.03–0.08em, usually uppercase): nav links, HUD readouts, tags/chips, marquee items, footer credit line.

### Named Rules
**The One Wordmark Rule.** Oswald renders exactly one element on the whole site (the hero "RYDER" lockup). Every other heading, including section titles at similar visual weight, stays in Unbounded. Do not introduce a second Oswald instance to "match" the hero elsewhere.

## Layout

Single-column content sits inside a `1120px` max-width container with `24px` side padding (`.container`). Sections use a flat, repeated shell: `64px` vertical padding, a `1px` hairline bottom border, and a `section-head` block (`h2` + one `.section-sub` paragraph, max 58ch) that precedes the section's content.

The page is built from alternating full-bleed pinned "stage" moments and normal-flow container sections: sticky inspector nav (60px, `position: sticky`) → full-bleed marquee ribbon → full-viewport pinned hero (`100vh`, GSAP ScrollTrigger `pin: true`, desktop/fine-pointer only) → full-viewport pinned horizontal project filmstrip (same pin pattern) → normal-flow container sections for skills, about, contact, footer. The two pinned stages are desktop-with-hover-only; touch and `prefers-reduced-motion` fall back to plain auto-height document flow with scroll-linked (not pinned) entrance animation, never a static frame.

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

Borders are hairline (1px, `--line` or `--line-strong`) throughout — never a heavier structural border. A recurring signature detail is the open corner-bracket ("viewfinder") mark: two 1.5px `--teal` L-shaped strokes at opposite corners of the about-card, and the same four-tick pattern in the custom cursor reticle. This is the system's one non-hairline decorative device, and it is confined to these two uses — it reads as a targeting/inspection reticle, not a generic corner ornament to scatter on new cards.

## Components

### Buttons
- **Shape:** small radius (`3px`).
- **Primary:** teal fill (`#4fd1c5`), dark ink text (`#06201d`), 1px teal border, 600 weight, `12px 20px` padding, JetBrains Mono label type. Hover brightens the fill to `#6fe0d4` and lifts `1px` on translateY, plus a GSAP-driven magnetic pull toward the cursor within a small radius (`MagneticButton`: `x * 0.3`, `y * 0.45`, `power3` ease) that springs back to rest on mouse-leave.
- **Ghost:** transparent fill, `--ink` text, `--line-strong` border; hover shifts both border and text to teal. Same magnetic behavior as primary.

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
- Sticky top bar (60px), translucent dark background with a 6px legibility blur, 1px bottom hairline. Logo is a small teal square dot + Unbounded wordmark text. Links are mono, uppercase-scale 12.5px, `--ink-dim` at rest, teal on hover/focus/active. The active link's highlight is a single shared Motion (`layoutId="nav-pill"`) element that glides between link positions on scroll-driven section change (via `IntersectionObserver`), rather than snapping or fading — the page's one Motion-owned interaction. Mobile (<640px) hides the link list entirely; no hamburger menu exists in the build.

### Render Stage (signature component)
The hero's full-bleed Three.js canvas: a single `IcosahedronGeometry` with a custom noise-displaced, fresnel-mixed `ShaderMaterial` (teal→gold color stops over a near-black base), a soft additive dust-point field for depth, and a GSAP `quickTo`-driven parallax that tilts the mesh toward the cursor. Camera dollies and fog density are scroll-scrubbed (GSAP ScrollTrigger) against the same span `HeroPinned` uses to pin the section, so the render literally moves the viewer through the scene as they scroll. A `stage-hud` overlay (mono micro-labels, teal/gold) and a floating telemetry chip (live fps + elapsed time, teal pulsing status dot) read the scene like an engine debug view. On WebGL failure it falls back to a static radial-gradient glow rather than an empty box; on `prefers-reduced-motion` it renders one static frame with no telemetry.

### Project Vessel (signature component)
The small per-project "bottle" or "orb" glyph (`ProjectVessel`) rendered in flat CSS/HTML rather than 3D: a bottle is a bordered rectangle with stacked color-layer divs; an orb is a circle with a radial gradient between two project-specific colors, optionally animated with a diagonal shimmer sweep or a soft coral pulse glow. Each project's vessel colors are drawn from the same teal/gold/coral system palette, making the filmstrip read as variations on one material rather than four unrelated illustrations.

## Do's and Don'ts

### Do:
- **Do** keep accent color (teal/gold/coral) to small functional marks — dots, ticks, chip borders, single HUD labels — per the Instrumentation-Only Rule.
- **Do** set every heading in Unbounded; reserve Oswald for the one hero wordmark only.
- **Do** keep cards and panels flat (hairline border, no shadow) at rest; the telemetry chip's shadow stays the one exception.
- **Do** route scroll choreography and pinning through GSAP + ScrollTrigger + Lenis, the hero's live material through Three.js, the nav pill through Motion's `layoutId`, and the skills-grid entrance through anime.js — one library per job, per the Library Lane Rule.
- **Do** provide a non-pinned, scroll-linked (not static) fallback for any pinned/3D moment on touch and `prefers-reduced-motion`, matching the pattern already in `HeroPinned`, `HeroScope`, and `ProjectGallery`.

### Don't:
- **Don't** add decorative `backdrop-filter` glass panels beyond the two functional legibility scrims (nav, telemetry chip) — the brief explicitly rejects glass/gradient decoration as chrome.
- **Don't** apply the corner-bracket ("viewfinder") device to arbitrary new cards; it's confined to the about-card and cursor reticle, not a general corner ornament.
- **Don't** give ordinary content cards a rounded radius — square corners are the panel convention; small radius (3px/6px) is reserved for buttons, tags, and chips.
- **Don't** introduce a second animation library for a job one of the four (GSAP/Three.js/Motion/anime.js) already owns.
