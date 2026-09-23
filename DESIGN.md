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

The hero is staged like a game's character-reveal card, not a category-default "hero photo + text card" portfolio shell: an illustrated bust portrait stands front and center, framed by gold corner brackets, a ghosted repeat of the "RYDER" wordmark tiled across the backdrop, and mirrored vertical wordmark echoes running the left and right edges. This replaced an earlier direction built around a live procedural Three.js shader material (the "Render Bench") — the user pointed at a Valorant agent-reveal poster and asked for that instead, character portrait in hand. Three.js was removed from the stack entirely at that point, not just unused — no live render, no shader telemetry, nothing to fabricate a "live" claim for — and later reintroduced for one specific, user-directed effect (`SkillsRing`'s 3D orbiting marquee, see below); it isn't the Render Bench coming back, just the one dependency being confined to a single, narrow, explicitly-requested lane rather than owning the hero's identity the way it used to. Everywhere outside the hero, the site keeps its inspector-panel chrome — hairline rules, monospace micro-labels, tick marks, corner brackets — never glass or gradient decoration for its own sake; that language wasn't tied to the shader and survives the pivot intact.

The build carries two deliberate, non-negotiable typography and motion facts forward as system invariants, not open questions: Unbounded is the one display face for all regular headings, while Oswald ("--font-wordmark") is reserved for the hero — the giant "RYDER" wordmark and its own ghosted echoes (edge lockups, background wall), never a second unrelated heading — because Unbounded alone read geometric/normal-width where the wordmark needed a condensed, poster-scale character. And the motion libraries in the stack are lane-disciplined, not overlapping: GSAP + ScrollTrigger + Lenis own all scroll choreography and pinning; Motion (`motion/react`, `layoutId`) owns exactly one shared-layout micro-interaction (the sliding nav active-link pill); anime.js owns exactly one section's entrance (the skills-grid card/tag stagger). A future edit should not blur these back together or add a redundant library for a job one of the three already owns.

Color is applied as instrumentation, not paint: the near-black/off-white ground is the resting state, and the three accents (teal, gold, coral) appear as small, purposeful signals — a status dot, a tick mark, a tag border — almost never as large fills. The hero's diagonal light streaks are the one deliberate, capped exception (see Colors — Named Rules). The one `backdrop-filter: blur()` left in the build (sticky nav background) is a narrow legibility scrim over moving content, not a glassmorphism system; it should not be read as license for decorative glass panels elsewhere.

**Key Characteristics:**
- Near-black instrumentation ground with three signal accents (teal, gold, coral) used sparingly and functionally, everywhere except the hero.
- The hero is a character-reveal card: illustrated portrait, gold frame, ghosted wordmark repeats — the page's one deliberately louder moment, not the norm to extend elsewhere.
- Inspector-panel chrome: hairlines, monospace micro-labels, corner-bracket details — flat by default, no shadow except the hero character's own drop-shadow.
- Two-face type system: Unbounded for every heading, Oswald confined to the hero wordmark and its ghosted echoes.
- Three animation libraries, three disjoint jobs — no overlap, no redundancy. `HeroSmoke` owns a fourth, narrower lane: Pixi.js, a 2D sprite/particle renderer, for the hero's light-trail particle system — not a competitor to GSAP/Motion/anime.js's animation-timeline jobs, and not a 3D scene graph. `SkillsRing` owns a fifth: Three.js, reintroduced at explicit user direction specifically for one genuinely 3D effect (the marquee items orbiting the character in real perspective) after having been removed entirely earlier in the build — see Skills Ring below for what it's confined to and why CSS 3D transforms were the (declined) alternative.

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

**Self-hosted via `@fontsource`, not `next/font/google`** (`app/layout.tsx`, weight-specific CSS imports; the plain `--font-*` variable values live in `app/globals.css`'s `:root`, not a `next/font` `.variable` className on `<html>` anymore). This isn't a style choice — Turbopack's `next/font/google` resolves Google Fonts through `@vercel/turbopack-next`, an internal package only available in Vercel's own build environment; the production build failed on Cloudflare Pages with "Module not found" on every font, while working fine locally and would have on Vercel. Each `@fontsource/<family>/<weight>.css` import already bundles every subset for that weight (including vietnamese for Unbounded) in one file via per-subset `unicode-range` `@font-face` blocks — the same technique `next/font` itself used, just resolved at install time from a real npm package instead of fetched at build time through a Vercel-only resolver. Adding a new weight or family means adding the matching `@fontsource` import here, not reaching for `next/font/google` again.

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
`HeroSmoke` (`components/HeroSmoke.tsx`) is a Pixi.js sprite particle system, not an analytic shader shape — a deliberate technique change, not just another tuning pass. Every earlier version was a single continuous procedural shape (isotropic fbm noise, noise-derived `fract()` "lanes," additive gaussian-band ribbons, then sharp-edged max-blended ribbons) and every one of them read as a smooth, clean, mathematically-continuous vector shape no matter how its width/taper/noise was tuned — because that's what a single continuous analytic band *is*. Real VFX tools (Unity's Shuriken, Unreal's Niagara) don't build a "flying light trail" that way; they build it from many small soft sprites with randomized size/opacity/drift, which is what actually produces organic-looking texture. Pixi is a 2D sprite/particle renderer with blend modes — a right-sized choice for that job, not a 3D scene graph.

**Flow direction: low across the bottom, left to right.** Every version before this one had the trail shooting diagonally up from a corner — first up-left, tuned that way against a guess at the reference rather than the reference itself. Once the user shared the actual Chamber reveal image, the trail there is a bottom-hugging band that sweeps left to right with only a gentle rise, never approaching the upper half of the frame. `FLOW = normalize(1, -0.16)` (screen-space y-down, so the small negative y is a slight lift) replaced the old steep up-left vector; get the sign or magnitude of this wrong again and the whole effect reads backwards no matter how good the particle technique underneath it is — the direction is the part worth double-checking against the reference image directly, not inferring from taste.

The system: a pool of 130 sprites (a soft radial-gradient "puff" texture, generated once on an offscreen canvas, not a fabricated image asset) continuously emitted from one fixed source point, each with its own velocity along the shared flow direction plus random perpendicular spread, teal/gold tint, and 1.1–2.4s lifetime; expired particles reset to the source rather than being destroyed/recreated. Each sprite is **rotated to match its own velocity and stretched non-uniformly** (`scale.set(base*2.6, base*0.6)`) into a small oriented streak rather than a round dot — round dots, even many of them, read as a static glowing cluster near the source with no sense of motion; an elongated sprite pointed the way it's actually traveling is what makes the flow direction and the "flying" motion legible at a glance. Sprites blend with **`screen`**, not `add`: an early pass with `add` and larger/brighter sprites saturated straight to a single blown-out white disc wherever several overlapped, which is easy to hit when a continuously-emitting pool naturally clusters near its own source — `screen`'s `1-(1-a)(1-b)` accumulation approaches white asymptotically instead of clipping to it outright. Sprite size is scaled off `Math.min(w, h)`, not just `h`: on desktop's wide canvas those are the same number, but sizing purely off height blew out into one solid cluster on mobile's much narrower, taller canvas, where the same absolute sprite size covers a far larger fraction of the available width.

**Layout-aware containment, not just scaled.** Alpha is shaped by fade-in/fade-out over each particle's own lifetime plus two positional falloffs (`edgeFall`, `topFall`) that keep the trail clear of the copy — and these aren't the same fractions scaled down for mobile, because the two layouts aren't the same shape scaled down. Desktop's copy sits in a narrow left column with the CTA row tucked low, so the source spawns beside it (`x=0.46w`) and `edgeFall` is a left-side cutoff; mobile's copy runs full-width with the CTA row roughly mid-canvas and the character starting below it (see Hero Character & Frame), so there's no "beside the text" — the source spawns near the left edge but low (`x=0.12w, y=0.78h`), `edgeFall` is disabled entirely, and `topFall` does the real containment work, calibrated tightly against the actual on-page bounding boxes of `.cta-row` and `.hero-character` at that breakpoint (CTA ends around `y=0.57h`, the character begins around `y=0.65h`) rather than the far looser desktop threshold. A layout change to either breakpoint's copy stack should re-check these against fresh bounding boxes, not assume the existing fractions still clear the text.

**Debugging notes, in the order they were found:**
- **Spawn-position bug.** The initial particle pool assigned each sprite a random starting *age* (so the pool wouldn't all be born and die in lockstep) but always positioned it at the exact source point regardless of that age, so for the pool's first ~1.5s of real time every sprite sat stacked on the source — however "old" its age field claimed — before its own velocity had carried it anywhere. Fixed by fast-forwarding each fresh particle's spawn position by `velocity × age`. Generalizes: when a particle/object pool pre-populates with randomized lifecycle state to avoid a synchronized pulse, every other piece of that object's state has to be advanced to match, or the pool renders as freshly-spawned regardless of what its bookkeeping says.
- **`resizeTo: canvas` self-referential sizing bug.** Passing the canvas element itself as `resizeTo` silently locked the renderer at Pixi's 800×600 fallback default on every viewport tested, including a real 1440px-wide desktop one — invisible in code review, and easy to miss visually since the effect still rendered, just inside a canvas quietly capped at 800px regardless of the CSS `width: 100%` rule. The mechanism: Pixi's `autoDensity` sets an inline `width`/`height` style directly on the canvas, which (being more specific than the class-based CSS width rule) becomes the canvas's own new authoritative size — which `resizeTo: canvas` then measures again on the next check, so if the very first measurement landed before layout had settled, that wrong size became permanent. Every position tuned as a fraction of "canvas width" up to this point was quietly wrong by whatever that ratio was — this is why the trail kept reading as short/faint even after the particle technique itself was working. Fixed by wrapping the canvas in a plain `<div className="hero-smoke-canvas">` sized by CSS percentages against `.hero-pin` (immune to Pixi's inline styling, since Pixi never touches the wrapper) and pointing `resizeTo` at that wrapper instead of the canvas. Generalizes: never point a library's own auto-resize/auto-fit option at the exact element it also writes inline sizing to — put a plain wrapper in between.

Rendered via `app.init({ canvas, resizeTo: canvas, resolution: min(devicePixelRatio, 1.5) })` and composited with `mix-blend-mode: screen` at the CSS level (on top of each particle's own internal `screen` blend against other particles — two different compositing questions: how particles blend with each other, and how the whole canvas blends with the page). No-reduced-motion only — no separate pointer/hover gate, unlike the shader version this replaced (see the component's own top comment: a ~90-sprite pool is cheap enough that the old "desktop/fine-pointer only" restriction, really a proxy for "don't run a per-pixel fragment shader on a weak mobile GPU," doesn't apply to it), so it now runs on mobile too. `Application.init()`'s rejection is caught and treated as "can't run" the same as a missing WebGL context would be, paused via `ticker.stop()`/`start()` on `visibilitychange`, and fully torn down (`app.destroy(true, { children: true, texture: true })`) on unmount. `.hero-streaks` is not a loading state for this — it's the permanent, always-rendered base layer everywhere `HeroSmoke` can't or won't run (reduced motion, WebGL unavailable), so the bottom band is never empty.

### Skills Ring (signature component)
`SkillsRing` (`components/SkillsRing.tsx`) orbits the marquee's own items around the character in real 3D perspective — a genuine Three.js scene (camera, group, per-object rotation), reintroduced to the stack at explicit user direction after having been removed entirely earlier in the build (see Overview). The user was offered CSS 3D transforms first (`perspective` + `rotateY`/`translateZ`, no new dependency, would have kept the "no 3D scene graph" rule intact) and chose Three.js anyway — that's a real, deliberate reversal of an earlier decision, not an oversight, so don't "fix" it back to CSS without asking first.

Deliberately `CSS3DRenderer`, not the WebGL renderer: it runs the same Three.js scene/camera/perspective math, but outputs real DOM text positioned via CSS `matrix3d` transforms rather than rasterizing to a canvas — the ring uses the site's actual mono font at full crispness at any size, the same visual language as the flat `.marquee` ticker whose items it reuses, instead of baking text into a canvas texture. The flat marquee ticker stays exactly as it was — the permanent, always-visible, accessible list of these items; the ring is a purely decorative hero flourish layered on top, not a replacement for it, and it duplicates the marquee's content on purpose rather than moving it.

Six items positioned evenly around a circle (`angle = i/count × 2π`), each rotated to face outward tangent to the ring (`object.rotation.y = angle`) rather than always facing the camera — foreshortening toward edge-on as an item swings round the side is what actually sells "wrapping around a cylinder," not a flat carousel of billboards. The whole ring spins continuously (`rotation += dt × 0.22`), and each item's opacity is set by hand from its current world angle (`0.35` to `1.0`, based on `cos(angle)`) since `CSS3DRenderer` doesn't shade objects by depth the way the WebGL renderer would with fog — there's no automatic depth cue to lean on here.

**Two synchronized scenes, not one — real occlusion against the character, not just avoiding him.** The first version put the whole ring in one scene at a height where the character's silhouette happened to be narrow, so the text could dodge around him — visually closer to "beside" than "around." Direct user feedback ("phía sau phải bị che, phía trước phải hiện" — the far side should be hidden, the near side should show) called for actual occlusion: items on the far side of the rotation genuinely covered by his body, items on the near side rendered over his jacket. A single `CSS3DRenderer` can't do that — it sorts its own objects by depth relative to each other, but has no way to interleave that sort with `.hero-character`, a plain `<img>` that isn't part of its scene at all. The fix: two complete scene/camera/renderer instances, `.skills-ring--back` (z-index: 1, same tier as `.hero-character`, paints behind him) and `.skills-ring--front` (z-index: 2, same tier as `.hero-streaks`, paints in front of him), with identical camera framing. Every frame, each item's `cos(worldAngle)` decides which of the two scenes should currently own it (`depth > 0` → front), and it's handed from one scene's group to the other's the instant that flips (`group.remove()` / `group.add()`). Both groups' `rotation.y` are kept manually in sync to the same value every frame — not a shared Three.js parent, just two numbers set identically — which is what makes the handoff invisible: the item's own local position/rotation are unchanged, only its parent (and therefore which DOM layer, and which z-index tier, it renders into) changes at the exact moment its own depth crosses zero.

**Positioning had to fight the character's own silhouette even with real occlusion available.** The ring's items all sit at local `y = 0`, so at any moment they trace one flat line across the screen — centering that line low, on the character's full torso, is what actually lets the "loop around him" read (front items sit on his jacket, back items vanish into it), rather than the narrower head/shoulder band the single-scene version needed to find gaps in his silhouette. `bottom: 0; height: 86%` (matching `.hero-character`'s own box) once occlusion made the character's width a feature instead of an obstacle to dodge.

**Debugging note — mirrored text.** Before `backface-visibility: hidden` was added to `.skills-ring-item`, an item rotated past 90° from the camera (the far side of the ring) didn't disappear the way a WebGL backface would — the browser kept rendering the same flat DOM element from behind, which reads as its text mirrored left-right (readable but backwards, like text seen through the back of a pane of glass). This is a standard CSS 3D transforms gotcha, not a Three.js-specific one: any flat element rotated past 90° needs this property or its "back" stays visible and flipped. Still needed with the two-scene split — it's what makes a "back" item disappear cleanly into the character rather than flashing mirrored text right before its scene handoff.

Desktop/fine-pointer/no-reduced-motion only (same gating pattern as `HeroSmoke`'s shader-era version, not its current one — a genuine WebGL/CSS3D scene update every frame, doubled here since there are two scenes, is worth avoiding on touch/weak hardware, unlike `HeroSmoke`'s now-cheap sprite pool), and hidden outright below 900px width in CSS rather than attempting a mobile layout — the character's own position there (full-width, in-flow, below the copy; see Hero Character & Frame) doesn't have a stable "around him" region the way desktop's absolutely-positioned portrait does. `ResizeObserver`-driven camera/renderer resize (both scenes resized together off the back container's dimensions), `visibilitychange` pause, and full teardown (both renderers' `domElement`s removed, `ResizeObserver` disconnected) on unmount, matching the cleanup discipline every other hero effect in this file already follows.

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
- **Do** route scroll choreography and pinning through GSAP + ScrollTrigger + Lenis, the nav pill through Motion's `layoutId`, and the skills-grid entrance through anime.js — one library per job, per the Library Lane Rule. Pixi.js owns exactly one lane (`HeroSmoke`'s particle system) and Three.js owns exactly one other (`SkillsRing`'s 3D orbit, via `CSS3DRenderer`, at explicit user direction). Don't reach for either outside its one lane, and don't introduce a further rendering/3D library without discussing it first.
- **Do** provide a non-pinned, scroll-linked (not static) fallback for any pinned moment on touch and `prefers-reduced-motion`, matching the pattern already in `HeroPinned` and `ProjectGallery`.

### Don't:
- **Don't** add decorative `backdrop-filter` glass panels beyond the nav's one functional legibility scrim — the brief explicitly rejects glass/gradient decoration as chrome.
- **Don't** apply the corner-bracket ("viewfinder") device to arbitrary new cards; it's confined to the about-card, cursor reticle, and hero frame, not a general corner ornament.
- **Don't** give ordinary content cards a rounded radius — square corners are the panel convention; small radius (3px/6px) is reserved for buttons, tags, and chips.
- **Don't** introduce a second animation library for a job one of the three (GSAP/Motion/anime.js) already owns.
