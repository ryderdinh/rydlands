# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, both currently served by the same single-page site:
- Recruiters / hiring managers evaluating candidates for full-time Unity mobile game developer roles.
- Studios / clients looking to hire a freelance Unity developer for short-term project work.

Both are technical evaluators skimming for proof of gameplay, shader, and performance-engineering skill, not general consumers.

## Product Purpose

A personal portfolio/landing page for Ryder, a Unity mobile game developer, whose job is to get the visitor to take one of two actions: reach out about a freelance engagement, or consider Ryder for a full-time role. Success is a contact-form/email click-through from a visitor who trusts the technical depth on display.

## Positioning

Deep, specific Unity URP/HLSL shader work (multi-layer liquid shaders, shimmer/event VFX) combined with production concerns most portfolios skip: native ad-mediation integration (AppLovin MAX) on Android/iOS, and root-causing hard performance bugs (e.g. ANR from WebView ad creative blocking Unity's RenderThread). The claim is "not just gameplay code — I also own the native/monetization/performance layer," which a generic "Unity developer" portfolio cannot truthfully copy.

## Operating Context

Single-page Next.js site (`app/page.tsx`) with sections: nav, hero (pinned "agent reveal" card — illustrated character portrait, gold corner-bracket frame, ghosted repeated-wordmark backdrop, an animated teal/gold particle light-trail low in the frame, and a ring of skills items orbiting the character in 3D), project case studies (4, pinned horizontal filmstrip), skills grid, about, contact, footer. Built with Next.js and GSAP (custom cursor, magnetic buttons, tilt cards, pinned scroll-scrubbed hero and filmstrip) plus Motion (nav active-link layout animation) and anime.js (skills-grid entrance) for interaction/motion. Three.js was in the original build (a live procedural shader material in the hero), was removed entirely at the user's direction in favor of the illustrated-character hero, and was later reintroduced — this time confined to one specific, user-requested effect (`components/SkillsRing.tsx`, the orbiting skills ring) rather than owning the hero's identity again. A flat marquee ticker of the same skills items used to sit above the nav; it was removed once the 3D ring shipped, since it duplicated the ring's content and read as redundant next to it — the same items remain visible in the skills grid section further down the page. The hero's low color band is a separate library, Pixi.js, doing a separate job: a sprite particle system (`components/HeroSmoke.tsx`), introduced because a raw-shader analytic shape kept reading as a smooth vector ribbon rather than an organic light trail across several tuning passes. Copy is in English.

## Capabilities and Constraints

- Stack is fixed: Next.js (App Router), React, TypeScript, GSAP, Motion, anime.js — do not introduce a different animation/rendering framework without discussing it first. Pixi.js and Three.js are both sanctioned exceptions, each confined to exactly one component: Pixi to `HeroSmoke`'s particle system, Three.js to `SkillsRing`'s 3D orbiting ring (reintroduced at explicit user request after being fully removed earlier — see Operating Context; this was a deliberate reversal, not a standing invitation to use it more broadly). Don't reach for either outside its one component, and don't introduce a further rendering/3D library, without discussing it first.
- Brand name "RYDER" and domain "rydlands.com" are real and must be preserved exactly as-is through the redesign.
- GitHub/LinkedIn contact links are currently placeholders (`#`); real URLs are not yet available — keep them as placeholder links, not fabricated ones.
- No demo video/reel exists. The hero originally substituted real live shader telemetry (fps/elapsed) for a fabricated video; that chip was removed along with the shader it reported on rather than left showing fake numbers. The user later supplied a commissioned illustrated character portrait (`public/ryder-portrait.png`/`.webp`), which now stands in the hero as the reveal's centerpiece — this is a real asset the user provided, not a stand-in for a photo.

## Evidence on Hand

Four real project case studies with technical specifics (do not invent additional ones):
1. Water Sort Puzzle Color Master — multi-layer liquid shader (URP/HLSL), meniscus curvature, real-angle bottle tilt, WebGL preview synced to the Unity build.
2. WinStreakEvent1 — URP shine/shimmer shader plus sequential scale + counting animation via UniTask/CancellationTokenSource, synced to AudioController.
3. Android ANR Root-Cause — diagnosed Google Play Console ANR logs to a GPU fence stall caused by WebView ad creative (Pangle/ByteDance) blocking Unity's RenderThread.
4. Bid Floor Interstitial (iOS) — multi-tier bid-floor interstitial ad system in Objective-C, expanded from 2 to 9 ad units, configured via Info.plist.

No photos, logo, resume, or testimonials on hand — the hero's illustrated character portrait (see Capabilities and Constraints) is a commissioned asset, not a substitute for a real photo. Do not fabricate any of the above.

## Product Principles

1. Technical proof over generic claims — every section should demonstrate specific engineering depth (shader math, profiling, native integration), not vague "passionate developer" language.
2. Serve both audiences at once — recruiters and freelance clients read the same page; don't fork the narrative, let the project evidence speak to both.
3. Own the full stack of a mobile game, including the unglamorous parts (ad mediation, native bridges, performance forensics) — this is the differentiator, keep it prominent, not buried.
4. Copy language is English (changed from Vietnamese during the redesign — confirmed by the user). All site copy is being translated and rewritten in professional English; do not leave a mix of the two.

## Accessibility & Inclusion

No specific standard confirmed yet; treat as a general web audience requirement (reasonable contrast, keyboard-operable interactive elements, motion that respects `prefers-reduced-motion`) given the site leans heavily on GSAP-driven motion.
