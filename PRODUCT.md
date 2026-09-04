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

Single-page Next.js site (`app/page.tsx`) with sections: nav, hero, skills marquee, skills grid, project case studies (4), about, contact, footer. Built with Next.js, Three.js, and GSAP for motion/interaction (custom cursor, magnetic buttons, tilt cards, scroll reveal, an ocean/3D scene). Copy is currently in Vietnamese.

## Capabilities and Constraints

- Stack is fixed: Next.js (App Router), React, TypeScript, GSAP, Three.js — do not introduce a different framework.
- Brand name "RYDER" and domain "rydlands.com" are real and must be preserved exactly as-is through the redesign.
- GitHub/LinkedIn contact links are currently placeholders (`#`); real URLs are not yet available — keep them as placeholder links, not fabricated ones.
- This redesign replaces both the visual system and the copy (see Product Principles) — it is not a narrow visual refinement preserving current text verbatim.

## Evidence on Hand

Four real project case studies with technical specifics (do not invent additional ones):
1. Water Sort Puzzle Color Master — multi-layer liquid shader (URP/HLSL), meniscus curvature, real-angle bottle tilt, WebGL preview synced to the Unity build.
2. WinStreakEvent1 — URP shine/shimmer shader plus sequential scale + counting animation via UniTask/CancellationTokenSource, synced to AudioController.
3. Android ANR Root-Cause — diagnosed Google Play Console ANR logs to a GPU fence stall caused by WebView ad creative (Pangle/ByteDance) blocking Unity's RenderThread.
4. Bid Floor Interstitial (iOS) — multi-tier bid-floor interstitial ad system in Objective-C, expanded from 2 to 9 ad units, configured via Info.plist.

No photos, logo, resume, or testimonials on hand. Do not fabricate any of these.

## Product Principles

1. Technical proof over generic claims — every section should demonstrate specific engineering depth (shader math, profiling, native integration), not vague "passionate developer" language.
2. Serve both audiences at once — recruiters and freelance clients read the same page; don't fork the narrative, let the project evidence speak to both.
3. Own the full stack of a mobile game, including the unglamorous parts (ad mediation, native bridges, performance forensics) — this is the differentiator, keep it prominent, not buried.
4. Copy language is English (changed from Vietnamese during the redesign — confirmed by the user). All site copy is being translated and rewritten in professional English; do not leave a mix of the two.

## Accessibility & Inclusion

No specific standard confirmed yet; treat as a general web audience requirement (reasonable contrast, keyboard-operable interactive elements, motion that respects `prefers-reduced-motion`) given the site leans heavily on GSAP/Three.js motion.
