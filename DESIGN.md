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
  display:
    fontFamily: "var(--font-display), sans-serif"
    fontSize: "clamp(28px, 3.6vw, 44px)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  hero-edge-word:
    fontFamily: "var(--font-wordmark), sans-serif"
    fontSize: "clamp(56px, min(22vh, 12vw), 230px)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.04em"
  hero-edge-tag:
    fontFamily: "var(--font-body), system-ui, sans-serif"
    fontSize: "clamp(15px, 2.9vh, 24px)"
    fontWeight: 700
    letterSpacing: "0.42em"
  ring-glyph:
    fontFamily: "var(--font-mono), monospace"
    fontSize: "25px"
    fontWeight: 800
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

The hero is staged like a game's character-reveal card, not a category-default "hero photo + text card" portfolio shell: the poster fills the whole screen, an illustrated bust portrait stands dead center, the name "RYDER" runs vertically down both edges, mirrored and solid gold, and a gold metal frame lit from above closes the whole thing in — with a ghosted repeat of the wordmark tiled across the backdrop. There is no copy column: the pitch (headline, paragraph, CTA) was pulled from the hero for now, and only a visually hidden `<h1>` remains so the page keeps its heading. This replaced an earlier direction built around a live procedural Three.js shader material (the "Render Bench") — the user pointed at a Valorant agent-reveal poster and asked for that instead, character portrait in hand. Three.js was removed from the stack entirely at that point, not just unused — no live render, no shader telemetry, nothing to fabricate a "live" claim for — and later reintroduced for one specific, user-directed effect (`SkillsRing`'s 3D orbiting skills ring, see below); it isn't the Render Bench coming back, just the one dependency being confined to a single, narrow, explicitly-requested lane rather than owning the hero's identity the way it used to. Everywhere outside the hero, the site keeps its inspector-panel chrome — hairline rules, monospace micro-labels, tick marks, corner brackets — never glass or gradient decoration for its own sake; that language wasn't tied to the shader and survives the pivot intact.

The build carries two deliberate, non-negotiable typography and motion facts forward as system invariants, not open questions: Unbounded is the one display face for all regular headings, while Oswald ("--font-wordmark") is reserved for the hero — the vertical "RYDER" name on each edge and the ghosted background wall, never a second unrelated heading — because Unbounded alone read geometric/normal-width where the wordmark needed a condensed, poster-scale character. And the motion libraries in the stack are lane-disciplined, not overlapping: GSAP + ScrollTrigger + Lenis own all scroll choreography and pinning; Motion (`motion/react`, `layoutId`) owns exactly one shared-layout micro-interaction (the sliding nav active-link pill); anime.js owns exactly one section's entrance (the skills-grid card/tag stagger). A future edit should not blur these back together or add a redundant library for a job one of the three already owns.

Color is applied as instrumentation, not paint: the near-black/off-white ground is the resting state, and the three accents (teal, gold, coral) appear as small, purposeful signals — a status dot, a tick mark, a tag border — almost never as large fills. The hero's diagonal light streaks are the one deliberate, capped exception (see Colors — Named Rules). The one `backdrop-filter: blur()` left in the build (sticky nav background) is a narrow legibility scrim over moving content, not a glassmorphism system; it should not be read as license for decorative glass panels elsewhere.

**Key Characteristics:**
- Near-black instrumentation ground with three signal accents (teal, gold, coral) used sparingly and functionally, everywhere except the hero.
- The hero is a full-screen character-reveal poster: centered portrait, mirrored solid-gold vertical name, one lit gold metal frame — the page's one deliberately louder moment, not the norm to extend elsewhere.
- Inspector-panel chrome: hairlines, monospace micro-labels, corner-bracket details — flat by default, no shadow except the hero character's own drop-shadow.
- Two-face type system: Unbounded for every heading, Oswald confined to the hero's vertical name and its ghosted wall.
- A cold-open preloader — a glowing gold ring that shrinks to a point and launches outward to reveal the hero — so the page opens like a title card (see Preloader).
- Three animation libraries, three disjoint jobs — no overlap, no redundancy. `HeroSmoke` owns a fourth, narrower lane: Pixi.js, a 2D sprite/particle renderer, for the hero's light-trail particle system — not a competitor to GSAP/Motion/anime.js's animation-timeline jobs, and not a 3D scene graph. `SkillsRing` owns a fifth: Three.js, reintroduced at explicit user direction specifically for one genuinely 3D effect (skills items orbiting the character in real perspective) after having been removed entirely earlier in the build — see Skills Ring below for what it's confined to and why CSS 3D transforms were the (declined) alternative.

## Colors

A near-black instrumentation ground carries three saturated signal colors used narrowly, plus a three-step ink scale for text hierarchy.

### Primary
- **Render Teal** (`#4fd1c5`): the system's default accent — logo dot, active nav state/pill accent color, primary button fill, hero ambient glow, the skills ring's diamond separators (fill), one hero light streak, first skill-group tick.

### Secondary
- **Signal Gold** (`#ffd166`): second accent — the hero's gold metal frame and the vertical "RYDER" name (a solid fill there — the hero is the one place gold is a large surface), the skills ring's diamond separators (outline), tag/chip borders and text in the project filmstrip, one hero light streak, shimmer/orb vessel color.

### Tertiary
- **Alert Coral** (`#ff6b6b`): reserved for diagnostic/alert-flavored content — the Android ANR case-study's pulse-orb vessel, one skill-group tick, third liquid-layer color in project vessels. Reads as "something under stress," matching its one case-study use. Never used in the hero's streaks or frame.

### Neutral
- **Viewport Black** (`#101214`, base `--bg`): page background.
- **Inset Black** (`#0b0c0e`, `--bg-inset`): recessed surfaces — cards, panels, project slides, about card.
- **Raised Panel** (`#17191c`, `--bg-raised`): the nav's active-pill fill and tag-chip background — the "one step up" surface.
- **Hairline** (`#2a2d31`, `--line`): default dividers and section borders.
- **Hairline Strong** (`#3d4147`, `--line-strong`): card/panel borders, ghost-button borders, corner-bracket accents' resting stroke.
- **Ink** (`#ecece7`, `--ink`): primary text and headings.
- **Ink Dim** (`#90959b`, `--ink-dim`): body copy, secondary text.
- **Ink Faint** (`#5b5f64`, `--ink-faint`): tertiary/label text, hero edge tags, scroll cue.

### Named Rules
**The Instrumentation-Only Rule.** Accent color (teal/gold/coral) is applied to small, functional marks — dots, ticks, borders, single HUD labels — never as a large background fill or a decorative gradient wash, everywhere except the hero. The hero's bottom band is the one large-surface exception, and it's exactly one band, built in two layers: the always-on CSS light streaks (`.hero-streaks`) and, where WebGL/motion/a fine pointer allow it, an animated noise-flow shader on top (`HeroSmoke`) — both a user-directed "agent reveal" escalation, both confined to the same low-opacity, screen-blended region at the very bottom of the hero. See Hero Character & Frame. Coral is excluded from both; it stays confined to its diagnostic/alert uses. Do not add a second large-surface exception outside this one band.

**The Legibility-Scrim, Not Glass, Rule.** `backdrop-filter: blur()` appears in exactly one place (sticky nav background) to keep text readable over moving content underneath. It is not a general glassmorphism device; new panels default to a flat, opaque `--bg-inset` surface with a hairline border instead.

## Typography

**Display Font:** Unbounded (`var(--font-display)`, weights 600/700/800), with sans-serif fallback.
**Wordmark Font:** Oswald (`var(--font-wordmark)`, weights 600/700) — condensed grotesk, reserved for exactly one element.
**Body Font:** IBM Plex Sans (`var(--font-body)`, weights 400/500/600).
**Label/Mono Font:** JetBrains Mono (`var(--font-mono)`, weights 400/500).

**Character:** Unbounded gives every heading a geometric, slightly display-weight presence without reading as condensed; JetBrains Mono carries every instrumentation label (nav links, tags, HUD text, chips) so the "inspector panel" reads consistently across the whole page; Oswald's condensed grotesk is deliberately confined to the one poster-scale wordmark that needs a narrower, taller character than Unbounded can give it.

**Self-hosted via `@fontsource`, not `next/font/google`** (`app/layout.tsx`, weight-specific CSS imports; the plain `--font-*` variable values live in `app/globals.css`'s `:root`, not a `next/font` `.variable` className on `<html>` anymore). This isn't a style choice — Turbopack's `next/font/google` resolves Google Fonts through `@vercel/turbopack-next`, an internal package only available in Vercel's own build environment; the production build failed on Cloudflare Pages with "Module not found" on every font, while working fine locally and would have on Vercel. Each `@fontsource/<family>/<weight>.css` import already bundles every subset for that weight (including vietnamese for Unbounded) in one file via per-subset `unicode-range` `@font-face` blocks — the same technique `next/font` itself used, just resolved at install time from a real npm package instead of fetched at build time through a Vercel-only resolver. Adding a new weight or family means adding the matching `@fontsource` import here, not reaching for `next/font/google` again.

### Hierarchy
- **Display** (600, `clamp(28px, 3.6vw, 44px)`, tight tracking `-0.01em`): section headings (`h2`).
- **Body** (400, 15px hero / 15–15.5px section body, line-height 1.68–1.75): paragraph copy, max-width 40ch hero / 50–58ch elsewhere. The hero's column is tighter than section body copy on purpose — a short, edited pitch, not a wide paragraph block.
- **Label** (400–500, 10–13px, JetBrains Mono, letter-spacing 0.03–0.08em, usually uppercase): nav links, HUD readouts, tags/chips, skills ring items, footer credit line.
- **Hero Edge Word** (700, `clamp(56px, min(22vh, 12vw), 230px)`, Oswald, letter-spacing `0.04em`, solid `--gold` fill with a soft drop shadow): the vertical "RYDER" running down both edges (`.hero-edge-lockup`), mirrored — the left one reads bottom-to-top, the right top-to-bottom. With the horizontal wordmark and pitch column gone, these two *are* the name and the hero's dominant type. Sized off the smaller of viewport height and width so the pair stays clear of the centered character.
- **Hero Edge Tag** (700, `clamp(15px, 2.9vh, 24px)`, IBM Plex Sans, letter-spacing `0.42em`, uppercase, `--ink`): "Game developer", set beside each name on its midline, along the same vertical axis. Hidden at 640px and below.
- **Ring Glyph** (800, 25px, JetBrains Mono, uppercase): each letter of the skills ring. Size and weight come from `FONT_SIZE` / `FONT_WEIGHT` in `SkillsRing.tsx` via `--ring-font-size` / `--ring-font-weight`; JetBrains Mono is loaded in every hundred-weight from 100 to 800 for it.

### Named Rules
**The One Wordmark Rule.** Oswald renders the hero's name and nothing else on the whole site: the vertical "RYDER" pair on the hero's edges (`.hero-edge-word`) and the outline-only ghost wall behind the character. No other h1/h2-weight text, including section titles at similar visual size, is ever set in Oswald. The name appears exactly as the mirrored pair — do not add a third readable instance (a horizontal lockup, a section title) to "match" the hero elsewhere.

## Layout

Single-column content sits inside a `1120px` max-width container with `24px` side padding (`.container`). Sections use a flat, repeated shell: `64px` vertical padding, a `1px` hairline bottom border, and a `section-head` block (`h2` + one `.section-sub` paragraph, max 58ch) that precedes the section's content.

The page is one continuous run of full-bleed pinned "stage" moments, book-ended by normal-flow chrome: sticky inspector nav (60px, `position: sticky`) → full-viewport pinned hero (`100vh`, GSAP ScrollTrigger `pin: true`, desktop/fine-pointer only) → full-viewport pinned horizontal project filmstrip (same pin pattern) → three more full-viewport pinned scenes (skills, about, contact — see `PinnedScene`) → footer. Every pinned scene is full-bleed at its root (its own grid-floor + accent-glow background), with a `.container` div nested inside for the actual text column — the section itself is the scene's viewport, not a centered content block that happens to be pinned. All pinned stages are desktop-with-hover-only; touch and `prefers-reduced-motion` fall back to plain auto-height document flow with scroll-linked (not pinned) entrance animation, never a static frame.

### Hero Composition (full-bleed poster)
The hero is one poster frame that fills the screen at every width: `100vh` and pinned on desktop, `min-height: 100svh` in the un-pinned touch / reduced-motion flow. The sticky nav ahead of it in flow (60px, invisible until the first scroll) would otherwise push the hero's top edge below the real top of the viewport and its bottom past the fold, so on desktop the hero is pulled up under the nav (`margin-top: -60px`) and the frame *is* the screen — every edge device sits the same distance from the edge as its opposite. Composition, left to right: the vertical name (left edge, reading bottom-to-top) → the character, centered horizontally and anchored to the bottom edge, height `96vh` → the vertical name (right edge, top-to-bottom). The skills ring is centered on the character, and the light-trail band runs across the bottom, over the frame. The name pair is inset 104px on desktop (clear of the fixed `.scroll-hud`, which owns the right edge's vertical center) and `clamp(20px, 5vw, 88px)` below 901px. The pitch copy that used to sit in a masthead/pitch split is not rendered; its `<h1>` stays in the DOM, visually hidden (Tailwind's `sr-only`).

Grids used: the skills grid is `repeat(auto-fit, minmax(220px, 1fr))` with a 1px `--line`-colored gap that doubles as hairline dividers between cards. The about section is an `0.8fr 1.2fr` two-column grid collapsing to one column under 760px. The project filmstrip is a horizontal flex track (`gap: 28px`), each slide `min(480px, 82vw)` wide.

## Elevation & Depth

The system is flat by default: nearly every surface (cards, panels, chips, nav) is a solid `--bg-inset` or `--bg-raised` fill with a 1px hairline border and no shadow. Depth in the hero comes from real layering (ghost wall behind character, character in front of it, frame chrome on top) rather than drop shadows; elsewhere, depth is conveyed by surface tone alone (inset vs. raised).

### Shadow Vocabulary
- **Character lift** (`filter: drop-shadow(0 30px 54px rgba(0,0,0,0.55))`, `.hero-character img`): the one floating element on the page — a soft ambient shadow grounding the portrait against the backdrop. Not reused elsewhere.

### Named Rules
**The Flat-Surface Rule.** Cards, panels, chips, and nav are flat at rest — hairline border, no shadow. Shadow is reserved for the hero's character portrait; introducing shadows on ordinary cards breaks the inspector-panel flatness the rest of the system depends on.

## Shapes

Corners are small and utilitarian: `3px` (`--radius-sm`), the one radius token in the system, default for buttons, tags, and the nav pill. Nothing uses a large or pill-shaped radius except orb vessels (`border-radius: 50%`), which are deliberately circular render objects, not a rounded-corner convention.

Borders are hairline (1px, `--line` or `--line-strong`) throughout — never a heavier structural border. A recurring signature detail is the open corner-bracket ("viewfinder") mark: two 1.5px `--teal` L-shaped strokes at opposite corners of the about-card, the same four-tick pattern in the custom cursor reticle, and — the one heavy exception — the hero's frame: a full-perimeter gold border (`--frame`, `clamp(10px, 1.1vw, 18px)`) with a square plate (`--plate`, `clamp(44px, 5.4vw, 96px)`) at each corner, each plate carrying a small dark bracket mark (see Hero Character & Frame). This is the system's one non-hairline decorative device, and it is confined to these three uses — it reads as a targeting/inspection reticle (about-card, cursor) or a reveal-poster frame (hero), not a generic corner ornament to scatter on new cards.

## Components

### Buttons
- **Shape:** small radius (`3px`).
- **Primary:** teal fill (`#4fd1c5`), dark ink text (`#06201d`), 1px teal border, 600 weight, `12px 20px` padding, JetBrains Mono label type. Hover brightens the fill to `#6fe0d4` and lifts `1px` on translateY, plus a GSAP-driven magnetic pull toward the cursor within a small radius (`MagneticButton`: `x * 0.3`, `y * 0.45`, `power3` ease) that springs back to rest on mouse-leave.
- **Ghost:** transparent fill, `--ink` text, `--line-strong` border; hover shifts both border and text to teal. Same magnetic behavior as primary.
- **Link** (`.btn-link`, hero only): no fill, no border — an underlined text link with a trailing arrow glyph (`.btn-link-arrow`) that nudges right on hover. Reserved for the hero's secondary action so it doesn't read as a second boxed button competing with the primary CTA at the wordmark's scale; every other secondary action in the build stays `.btn-ghost`. Currently unused: the hero's CTA row was pulled along with the pitch, so this variant has no call site until it returns.

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
The hero's centerpiece is a commissioned illustrated bust portrait (`public/ryder-portrait.png`/`.webp`, transparent background, pre-trimmed to its content bounds) centered horizontally and anchored to the bottom edge (`.hero-character`). The `<img>` is sized off the viewport (`height: 96vh`, `74svh` below 900px), not as a percentage of its flex wrapper — that percentage doesn't reliably resolve against a flex item's cross-size and silently fell back to the image's native ~920px height, which cropped his head off on a short, wide window.

**The frame is one piece of metal, not parts.** `.hero-frame` is a single full-size element whose background is one gradient field — a warm key light from directly above (a hot spot on the top edge, falling to a deeper gold at the bottom, deliberately low-contrast: `#f6d888` → `#ffd166` → `#e6b34f` → `#c28d2f`) — and its shape (border band plus the four corner plates) is cut out of that field with a single `clip-path` (evenodd polygon in `--frame` / `--plate`). The plates carry no fill of their own; an earlier version gave them separate gradients and the seams made the frame read as discrete pieces. The frame sits at z-index 2 but *earlier in the DOM* than `.hero-streaks` and `.hero-smoke-canvas` (same tier), so the screen-blended light trails sweep over the border the way the reference poster's do; the character sits below it, so nothing overlaps the border. The name lockups (`.hero-edge-lockup`, z-index 1) sit under the character, so he can overlap them slightly instead of the name printing across him. The scrim (`.hero-scrim`) is a symmetric dark shoulder at both edges — contrast for the vertical names — with the middle clear for the ghost wall.

A low band of flowing teal/gold color runs across the bottom: always-on CSS light streaks (`.hero-streaks`) with an animated particle system layered on top where it can run (`HeroSmoke` — see below), both anchored to the true bottom edge so they cross the frame. Behind all of it, `.hero-ghost-wall` tiles six rows of outline-only "RYDER" at a slight rotation — the backdrop texture, the same repeated-wordmark technique the Valorant reference uses.

**Stacking note.** The hero's paint order, by z-index (low to high): `.hero-ghost-wall` (auto) → `.hero-scrim` / `.hero-edge-lockup` / `.hero-character` / `.skills-ring--back` (1, DOM order breaks ties) → `.hero-frame` / `.hero-streaks` / `.hero-smoke-canvas` / `.skills-ring--front` (2, frame first in DOM) → `.hero-vignette` (4, so the scene's cut to black covers the character and every frame device). A new floating hero element should slot into this scale rather than pick an unrelated number.

### Hero Smoke (signature component)
`HeroSmoke` (`components/HeroSmoke.tsx`) is a Pixi.js sprite particle system, not an analytic shader shape — a deliberate technique change, not just another tuning pass. Every earlier version was a single continuous procedural shape (isotropic fbm noise, noise-derived `fract()` "lanes," additive gaussian-band ribbons, then sharp-edged max-blended ribbons) and every one of them read as a smooth, clean, mathematically-continuous vector shape no matter how its width/taper/noise was tuned — because that's what a single continuous analytic band *is*. Real VFX tools (Unity's Shuriken, Unreal's Niagara) don't build a "flying light trail" that way; they build it from many small soft sprites with randomized size/opacity/drift, which is what actually produces organic-looking texture. Pixi is a 2D sprite/particle renderer with blend modes — a right-sized choice for that job, not a 3D scene graph.

**Flow direction: low across the bottom, left to right.** Every version before this one had the trail shooting diagonally up from a corner — first up-left, tuned that way against a guess at the reference rather than the reference itself. Once the user shared the actual Chamber reveal image, the trail there is a bottom-hugging band that sweeps left to right with only a gentle rise, never approaching the upper half of the frame. `FLOW = normalize(1, -0.16)` (screen-space y-down, so the small negative y is a slight lift) replaced the old steep up-left vector; get the sign or magnitude of this wrong again and the whole effect reads backwards no matter how good the particle technique underneath it is — the direction is the part worth double-checking against the reference image directly, not inferring from taste.

The system: a pool of 130 sprites (a soft radial-gradient "puff" texture, generated once on an offscreen canvas, not a fabricated image asset) continuously emitted from one fixed source point, each with its own velocity along the shared flow direction plus random perpendicular spread, teal/gold tint, and 1.1–2.4s lifetime; expired particles reset to the source rather than being destroyed/recreated. Each sprite is **rotated to match its own velocity and stretched non-uniformly** (`scale.set(base*2.6, base*0.6)`) into a small oriented streak rather than a round dot — round dots, even many of them, read as a static glowing cluster near the source with no sense of motion; an elongated sprite pointed the way it's actually traveling is what makes the flow direction and the "flying" motion legible at a glance. Sprites blend with **`screen`**, not `add`: an early pass with `add` and larger/brighter sprites saturated straight to a single blown-out white disc wherever several overlapped, which is easy to hit when a continuously-emitting pool naturally clusters near its own source — `screen`'s `1-(1-a)(1-b)` accumulation approaches white asymptotically instead of clipping to it outright. Sprite size is scaled off `Math.min(w, h)`, not just `h`: on desktop's wide canvas those are the same number, but sizing purely off height blew out into one solid cluster on mobile's much narrower, taller canvas, where the same absolute sprite size covers a far larger fraction of the available width.

**Layout-aware containment, not just scaled.** Alpha is shaped by fade-in/fade-out over each particle's own lifetime plus two positional falloffs (`edgeFall`, `topFall`) that keep the trail clear of the copy — and these aren't the same fractions scaled down for mobile, because the two layouts aren't the same shape scaled down. Desktop's copy sits in a narrow left column with the CTA row tucked low, so the source spawns beside it (`x=0.46w`) and `edgeFall` is a left-side cutoff; mobile's copy runs full-width with the CTA row roughly mid-canvas and the character starting below it (see Hero Character & Frame), so there's no "beside the text" — the source spawns near the left edge but low (`x=0.12w, y=0.78h`), `edgeFall` is disabled entirely, and `topFall` does the real containment work, calibrated tightly against the actual on-page bounding boxes of `.cta-row` and `.hero-character` at that breakpoint (CTA ends around `y=0.57h`, the character begins around `y=0.65h`) rather than the far looser desktop threshold. A layout change to either breakpoint's copy stack should re-check these against fresh bounding boxes, not assume the existing fractions still clear the text. **Current state:** the hero no longer renders a copy stack (the pitch was pulled — see Hero Composition), so these fractions are left as tuned and now simply keep the trail in the lower part of the frame; if the pitch returns, re-check them against it.

**Debugging notes, in the order they were found:**
- **Spawn-position bug.** The initial particle pool assigned each sprite a random starting *age* (so the pool wouldn't all be born and die in lockstep) but always positioned it at the exact source point regardless of that age, so for the pool's first ~1.5s of real time every sprite sat stacked on the source — however "old" its age field claimed — before its own velocity had carried it anywhere. Fixed by fast-forwarding each fresh particle's spawn position by `velocity × age`. Generalizes: when a particle/object pool pre-populates with randomized lifecycle state to avoid a synchronized pulse, every other piece of that object's state has to be advanced to match, or the pool renders as freshly-spawned regardless of what its bookkeeping says.
- **`resizeTo: canvas` self-referential sizing bug.** Passing the canvas element itself as `resizeTo` silently locked the renderer at Pixi's 800×600 fallback default on every viewport tested, including a real 1440px-wide desktop one — invisible in code review, and easy to miss visually since the effect still rendered, just inside a canvas quietly capped at 800px regardless of the CSS `width: 100%` rule. The mechanism: Pixi's `autoDensity` sets an inline `width`/`height` style directly on the canvas, which (being more specific than the class-based CSS width rule) becomes the canvas's own new authoritative size — which `resizeTo: canvas` then measures again on the next check, so if the very first measurement landed before layout had settled, that wrong size became permanent. Every position tuned as a fraction of "canvas width" up to this point was quietly wrong by whatever that ratio was — this is why the trail kept reading as short/faint even after the particle technique itself was working. Fixed by wrapping the canvas in a plain `<div className="hero-smoke-canvas">` sized by CSS percentages against `.hero-pin` (immune to Pixi's inline styling, since Pixi never touches the wrapper) and pointing `resizeTo` at that wrapper instead of the canvas. Generalizes: never point a library's own auto-resize/auto-fit option at the exact element it also writes inline sizing to — put a plain wrapper in between.

Rendered via `app.init({ canvas, resizeTo: canvas, resolution: min(devicePixelRatio, 1.5) })` and composited with `mix-blend-mode: screen` at the CSS level (on top of each particle's own internal `screen` blend against other particles — two different compositing questions: how particles blend with each other, and how the whole canvas blends with the page). No-reduced-motion only — no separate pointer/hover gate, unlike the shader version this replaced (see the component's own top comment: a ~90-sprite pool is cheap enough that the old "desktop/fine-pointer only" restriction, really a proxy for "don't run a per-pixel fragment shader on a weak mobile GPU," doesn't apply to it), so it now runs on mobile too. `Application.init()`'s rejection is caught and treated as "can't run" the same as a missing WebGL context would be, paused via `ticker.stop()`/`start()` on `visibilitychange`, and fully torn down (`app.destroy(true, { children: true, texture: true })`) on unmount. `.hero-streaks` is not a loading state for this — it's the permanent, always-rendered base layer everywhere `HeroSmoke` can't or won't run (reduced motion, WebGL unavailable), so the bottom band is never empty.

### Skills Ring (signature component)
`SkillsRing` (`components/SkillsRing.tsx`) orbits the skills items around the character in real 3D perspective — a genuine Three.js scene (camera, group, per-object rotation), reintroduced to the stack at explicit user direction after having been removed entirely earlier in the build (see Overview). The user was offered CSS 3D transforms first (`perspective` + `rotateY`/`translateZ`, no new dependency) and chose Three.js anyway — a deliberate reversal, so don't "fix" it back to CSS without asking.

Deliberately `CSS3DRenderer`, not the WebGL renderer: the same scene/camera/perspective math, but real DOM text positioned via CSS `matrix3d`, so the ring uses the site's actual mono font at full crispness at any size. The ring is `aria-hidden` and decorative; the same items are listed plainly in the Skills Grid section. Desktop / fine pointer / no reduced motion only, hidden below 900px.

**Layout: one continuous run, every slot equal.** The items are doubled and laid end to end as one run of text — each word is its letters, a blank, a diamond, a blank — and every glyph slot in the whole run is the same angular size: `step = 2π / total slots`. Letter spacing is therefore *derived*, never a constant to tune, and nothing but the diamond separates two words (earlier layouts centered each word on an evenly spaced slot, which left wide gaps after short words and crowded long ones). More or longer words means tighter letters. The separator is a diamond glyph, `--bg-inset` fill with a `--gold` outline (`-webkit-text-stroke` with `paint-order: stroke fill`, so only the stroke's outer half shows).

**One `CSS3DObject` per glyph, tangent rotation.** Each glyph is positioned on the circle and rotated tangent to it (`rotation.y = angle`), so a word genuinely curves along the cylinder and foreshortens toward the sides. This was chosen over billboarding (counter-rotating every glyph to face the camera), which read flatter, like a floating HUD. There is deliberately no `backface-visibility: hidden`: a glyph past 90° keeps rendering from behind, reading mirrored, dimmed by depth (`MIN_OPACITY` 0.35 at the far side) — the far half of the ring stays visible as one continuous loop instead of letters popping out at a hard edge. Hiding the backface and fading it were both tried and both cut words off mid-letter.

**Orientation.** The group's Euler order is `'ZXY'`, so the spin about the ring's own axis is applied first and the X tilt (`TILT_ANGLE`) and Z roll (`ROLL_ANGLE`) tip the whole ring afterward — with the default `'XYZ'` a roll lands inside the spin and wobbles the ring instead of tipping it. Front/back scene ownership is read off each glyph's actual rotated position (`z / RADIUS`), not `cos(spin angle)`, which is only right without a roll. The group is lifted by `RADIUS × sin(tilt)` so the near side doesn't droop toward the waist, then shifted by `MOVE_X` / `MOVE_Y`. Uniform `RING_SCALE` multiplies the shrink-to-fit factor `resize()` computes from the container's room in the viewport, so the ring never clips at the viewport edge (the camera's projected size tracks container *height*, its horizontal room is capped by *width*).

**Two synchronized scenes for real occlusion.** A single `CSS3DRenderer` can't interleave with `.hero-character`, a plain `<img>` outside its scene. So there are two scene/camera/renderer instances — `.skills-ring--back` (z-index 1, behind him) and `.skills-ring--front` (z-index 2, in front) — with identical framing; each frame, a glyph is handed to whichever scene its depth says, with both groups' transforms kept identical by hand so the handoff is invisible.

**Tuning.** Live values (`ringTuning`: tilt, yaw, roll, speed, size, font size, font weight, move X/Y) are read every frame; `components/RingTuner.tsx` renders dev-only sliders for them (development builds only) and the chosen numbers are copied back into the constants at the top of the file — `TILT_ANGLE` 27°, `ROLL_ANGLE` −24°, `RING_SCALE` 0.8, `FONT_SIZE` 25, `FONT_WEIGHT` 800, `MOVE_X` −22, `MOVE_Y` 42, `ROTATION_SPEED` 0.22, `RADIUS` 200.

### Project Vessel (signature component)
The small per-project "bottle" or "orb" glyph (`ProjectVessel`) rendered in flat CSS/HTML rather than 3D: a bottle is a bordered rectangle with stacked color-layer divs; an orb is a circle with a radial gradient between two project-specific colors, optionally animated with a diagonal shimmer sweep or a soft coral pulse glow. Each project's vessel colors are drawn from the same teal/gold/coral system palette, making the filmstrip read as variations on one material rather than four unrelated illustrations.

### Preloader (signature component)
`Preloader` (`components/Preloader.tsx`, mounted first in `app/layout.tsx`) is the page's cold-open: a full-screen `--bg-inset` cover with a glowing gold ring and a percent count in the middle. When loading finishes, the ring shrinks to a point and then launches outward, and the hole it leaves reveals the hero underneath. It's part of the same "reveal poster" idea as the hero — a title card that opens — not a spinner.

**Ring from the first frame, not a progress arc.** The ring is a complete circle the moment the page paints (it's in the server HTML, so there's no flash of unstyled page before hydration); loading only drives the mono percent readout. An earlier version drew the ring as a growing arc (SVG dash, then a conic-masked gradient), and both left a visible jump where it handed off to the ring that scales — two techniques never render the same pixels, so it got dropped for one technique used the whole way through.

**One element, two gradient layers.** `.preloader` paints everything itself: the top layer is the rim (2px solid gold core, soft edge, a wide fading gold glow reaching about 90px out and 70px in), the bottom layer is the opaque cover with a transparent hole. Two CSS variables, `--ring-r` and `--hole-r` (unitless px), are the only thing animated per frame. This replaced a CSS `mask` plus a `box-shadow: 0 0 80px` ring that was resized through `width`/`height` each frame — that combination re-laid-out and re-rasterized a screen-sized blur every frame and stuttered badly. Don't reintroduce a resized, blurred element for the ring.

**Motion: one `back.in` curve.** The ring shrinks to a point, then accelerates out past the corners, on a single curve, `f(t) = t²((s+1)t − s)`, with `s` solved at runtime so the dip equals the ring's own radius (it stops at radius 0, never inverts). Chained tweens each stop dead at their joins and read as stutter; a single curve doesn't. Time is warped piecewise (`SHRINK_S` 0.65s, `LAUNCH_S` 0.5s) so the outward run is faster than the shrink; speed is 0 at the bottom of the dip, so the join is smooth. The hole in the cover only opens once the ring has bottomed out and turns outward, so the cover stays closed while the ring shrinks.

**Timing rules.** The reveal never starts before 1s, even when everything is cached; it waits for fonts, the hero portrait, and window `load`, and it opens anyway after 8s so a stuck asset can't trap the visitor. The percent counts by elapsed time (frame drops don't stall it), and lands on 100 for certain, with a short hold, before the ring starts to shrink. While the cover is up, wheel, touchmove, and scroll keys are swallowed in the capture phase so Lenis never sees them. `prefers-reduced-motion` skips the ring motion for a plain fade, and the cover is hidden without JS (`<noscript>`).

**Stacking.** z-index 1000: above the nav, hero, and grain (200), below the custom cursor reticle (9999), which stays visible over the cover.

**Not done, deliberately.** The hero's entrance animations still start at mount, under the cover, rather than waiting for the reveal; nothing signals "preloader finished" yet. The percent readout is mono (JetBrains Mono), not "RYDER": the One Wordmark Rule keeps the name to the hero's mirrored pair.

### Scene Transition Grammar (signature interaction)
Every scroll boundary between pinned stages (hero → projects → skills → about → contact) shares one motion vocabulary: real 3D perspective, not a 2D crossfade standing in for depth. Content arrives tilted back and distant (`rotateX` off vertical, negative `translateZ`, reduced scale, blurred), levels out to a flat, sharp, held dwell for reading, then keeps traveling forward and tilts the other way as it exits (positive `translateZ`, opposite `rotateX`, increased scale, re-blurred) — the same "arrive → dwell → depart" beat `PinnedScene` drives with one GSAP scrub timeline (`transformPerspective` set once per element, `power2.out`/`power2.in` eases shaping the curve, not linear scrub). `HeroPinned`'s copy exit and `ProjectGallery`'s first-slide entrance use the identical grammar so the hero → filmstrip hand-off reads as one continuous camera move rather than a different effect at that one boundary. Within the filmstrip itself, cards additionally bank in `rotateY` as they pass the pin's horizontal center (`ProjectGallery`'s `updateTilt`), like exhibits arranged on a shallow arc the camera pans across.

Each pinned scene is also a distinct "location," not a repeated card on identical ground: `PinnedScene`'s root section is full-bleed (not the `.container`-classed content itself) and carries a persistent low-opacity engine-grid pattern plus one accent-tinted ambient glow (`accent="teal"|"gold"`, positioned per scene via `--glow-x`/`--glow-y`) — same alpha range (~0.1) as the hero's own ambient radial glow on `.hero-pin`, so this stays inside the Instrumentation-Only Rule rather than introducing a new large color fill. Coral is not used for scene glows; it stays confined to its existing diagnostic/alert uses.

### Named Rules
**The One Flight Grammar Rule.** Every pinned scene boundary — hero exit, filmstrip entrance, and all three `PinnedScene` sections — uses the same arrive/dwell/depart perspective transform (`rotateX` + `translateZ` + scale + blur), not a mix of fades, wipes, and zooms. A new pinned moment should extend this grammar, not invent a second one.

## Do's and Don'ts

### Do:
- **Do** keep accent color (teal/gold/coral) to small functional marks — dots, ticks, chip borders, single HUD labels — per the Instrumentation-Only Rule.
- **Do** set every heading in Unbounded; reserve Oswald for the hero's vertical name and ghost wall only.
- **Do** keep cards and panels flat (hairline border, no shadow) at rest; the hero character's drop-shadow stays the one exception.
- **Do** route scroll choreography and pinning through GSAP + ScrollTrigger + Lenis, the nav pill through Motion's `layoutId`, and the skills-grid entrance through anime.js — one library per job, per the Library Lane Rule. Pixi.js owns exactly one lane (`HeroSmoke`'s particle system) and Three.js owns exactly one other (`SkillsRing`'s 3D orbit, via `CSS3DRenderer`, at explicit user direction). Don't reach for either outside its one lane, and don't introduce a further rendering/3D library without discussing it first.
- **Do** provide a non-pinned, scroll-linked (not static) fallback for any pinned moment on touch and `prefers-reduced-motion`, matching the pattern already in `HeroPinned` and `ProjectGallery`.

### Don't:
- **Don't** add decorative `backdrop-filter` glass panels beyond the nav's one functional legibility scrim — the brief explicitly rejects glass/gradient decoration as chrome.
- **Don't** apply the corner-bracket ("viewfinder") device to arbitrary new cards; it's confined to the about-card, cursor reticle, and hero frame, not a general corner ornament.
- **Don't** build the hero frame from separately filled parts: the border and its corner plates are one clipped gradient field so the metal reads as a single piece.
- **Don't** re-add a horizontal "RYDER" wordmark or a left-column pitch to the hero without deciding it deliberately — the poster's name is the mirrored vertical pair.
- **Don't** give ordinary content cards a rounded radius — square corners are the panel convention; small radius (3px/6px) is reserved for buttons, tags, and chips.
- **Don't** introduce a second animation library for a job one of the three (GSAP/Motion/anime.js) already owns.
