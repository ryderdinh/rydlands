'use client'

import { prefersReducedMotion } from '@/lib/motion'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import {
	CSS3DObject,
	CSS3DRenderer
} from 'three/examples/jsm/renderers/CSS3DRenderer.js'

// A real 3D scene graph — camera, perspective, a rotating group of
// positioned objects — is exactly what Three.js is for. Deliberately
// CSS3DRenderer, not the WebGL renderer: it drives the same Three.js scene/
// camera math, but the "pixels" it outputs are real DOM text nodes
// positioned via CSS matrix3d transforms, not a rasterized canvas — so the
// ring uses the site's actual font/color at full crispness at any size,
// rather than baking text into a canvas texture. One CSS3DObject per glyph,
// not per word — each letter has its own position around the circle, which
// is what makes a word curve along the ring's path instead of reading as a
// flat card that merely orbits (see computeLayout below).
// Desktop only, no-reduced-motion only, and entirely decorative — the same
// items are listed again, plainly, in the Skills Grid section further down
// the page; this is a hero flourish layered on top, not the accessible
// listing itself.
//
// Each glyph keeps a fixed rotation tangent to the circle (see
// `object.rotation.y = angle` below) — like a label actually glued to the
// surface of a spinning cylinder, reading normally at the front and
// foreshortening toward edge-on at the sides. That's a deliberate choice
// over billboarding (counter-rotating every glyph to always face the
// camera flat-on): billboarding reads as flatter, more like a floating
// HUD than something wrapped around him. Past 90° a glyph is rotated past
// perpendicular to the camera and renders from behind, reading mirrored
// — deliberately not hidden (no backface-visibility on .skills-ring-char)
// and not faded to nothing (MIN_OPACITY below has a floor), so the far
// side of the ring stays visible as one continuous loop rather than
// letters popping in and out of existence at a hard edge.
//
// Actually loops AROUND the character, not just beside him: two
// synchronized scenes/renderers, one painted behind .hero-character and
// one in front of it, with each item handed from one to the other the
// instant its own rotation carries it past the character's picture plane.
// A single CSS3DRenderer can't do this by itself — it can sort its own
// objects by depth relative to each other, but has no way to interleave
// that sort with an external DOM element (the character image) that isn't
// part of its scene at all. Two DOM layers at different z-index is the
// only way to actually occlude against something outside the scene.

const RADIUS = 200
const ROTATION_SPEED = 0.22 // rad/s — a slow, readable drift, not a spin
// Tilts the ring's plane about the X axis (0 = flat horizontal circle, text
// only ever slides sideways; positive tilts the far side up and the near
// side down, like a Saturn ring or a tilted coin) — this is the ring's
// "angle" to change: increase for a more dramatic incline, decrease toward
// 0 to flatten it back out.
const TILT_ANGLE = THREE.MathUtils.degToRad(27)
// Tips the whole ring sideways about the Z axis, after its own spin — the ring
// keeps spinning about its own (now tilted) axis. Negative leans it the other
// way.
const ROLL_ANGLE = THREE.MathUtils.degToRad(-24)
// Uniform scale on the whole ring (glyphs included), on top of resize()'s
// shrink-to-fit factor. Unlike RADIUS this doesn't change glyph spacing.
const RING_SCALE = 0.8

// How close the ring's shrunk-to-fit horizontal reach (see resize()'s
// scale calculation) is allowed to come to the viewport edge before
// .hero-pin's overflow: hidden would clip it.
const EDGE_MARGIN = 48
// Never shrink the ring below this fraction of its designed size, even if
// the viewport is so narrow there isn't room to fit it cleanly — a small
// residual clip beats the ring collapsing to an illegible sliver. (Below
// 900px width it's hidden outright — see the .skills-ring media query.)
const MIN_RING_SCALE = 0.5

// Dims a glyph as it recedes toward the far side of the ring (depth = -1)
// without ever hiding it outright — there's no backface-visibility:
// hidden anymore (see .skills-ring-char), so a glyph past 90° keeps
// rendering, reading mirrored. Never fading below this floor is what
// keeps that mirrored far side looking like a continuous ring rather
// than letters popping in and out of existence at a hard edge.
const MIN_OPACITY = 0.35

// The angle between glyphs is not a constant: the words are one continuous
// run of text — "UNITY ◆ SHADER ◆ …" — separated only by the ◆ (a blank slot
// either side of it), and every glyph slot in that run is the same size, the
// whole set divided evenly around the circle. Letter spacing therefore works
// itself out from the words: more or longer words means tighter letters.
// Glyph size in CSS px (applied as --ring-font-size on the ring containers;
// the dot is sized off it in CSS). Bigger text on a
// full ring runs the letters together — use fewer or shorter words.
const FONT_SIZE = 25
// Glyph weight, 100–800 (applied as --ring-font-weight; JetBrains Mono ships
// every hundred, see app/layout.tsx).
const FONT_WEIGHT = 800
// Shifts the whole ring in scene units (+X right, +Y up); the ring stays
// centered on its container otherwise.
const MOVE_X = -22
const MOVE_Y = 42

// Live values the render loop reads every frame, seeded from the constants
// above. The constants stay the source of truth for production; RingTuner
// (the dev-only sliders) writes here so values can be found by eye and copied
// back into the constants.
export const ringTuning = {
	tilt: TILT_ANGLE,
	yaw: 0,
	roll: ROLL_ANGLE,
	speed: ROTATION_SPEED,
	size: RING_SCALE,
	fontSize: FONT_SIZE,
	fontWeight: FONT_WEIGHT,
	moveX: MOVE_X,
	moveY: MOVE_Y
}

function createScene(container: HTMLDivElement) {
	const scene = new THREE.Scene()
	const camera = new THREE.PerspectiveCamera(50, 1, 1, 2000)
	camera.position.z = 640

	const renderer = new CSS3DRenderer()
	renderer.domElement.style.position = 'absolute'
	renderer.domElement.style.inset = '0'
	container.appendChild(renderer.domElement)

	const group = new THREE.Group()
	// Euler order matters here: 'ZXY' composes as Rz · Rx · Ry, so the spin
	// (rotation.y) is applied first, about the ring's own axis, and the X tilt
	// and Z roll are applied after it, to the ring as a whole. With the default
	// 'XYZ' the roll would land inside the spin and wobble the ring instead of
	// tipping it.
	group.rotation.order = 'ZXY'
	scene.add(group)

	return { scene, camera, renderer, group }
}

interface RingItem {
	object: CSS3DObject
	// Where the glyph sits around the ring is recomputed every frame from
	// these two (see the render loop).
	wordIndex: number
	offsetIndex: number
	inFront: boolean
}

export default function SkillsRing({ items }: { items: string[] }) {
	const backRef = useRef<HTMLDivElement>(null)
	const frontRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const backContainer = backRef.current
		const frontContainer = frontRef.current
		if (!backContainer || !frontContainer) return
		if (prefersReducedMotion()) return
		if (window.matchMedia('(pointer: coarse), (hover: none)').matches) return

		const back = createScene(backContainer)
		const front = createScene(frontContainer)

		// Repeated, like the flat marquee's own content duplication — six
		// items spread once around the full circle left wide, empty gaps
		// between them (usually only one label visible at a time). Doubling
		// the list packs a label every ~30° instead of every ~60° (paired
		// with the larger RADIUS above — packing tighter without it just
		// made adjacent items overlap and run together illegibly, since an
		// item near the front of the ring is magnified by the perspective,
		// not rendered at a flat 1:1 CSS-pixel size), so more than one is
		// usually in view without the text colliding.
		const repeated = [...items, ...items]
		const count = repeated.length
		const ringItems: RingItem[] = []

		// One continuous run: each word is its letters, a blank, the ◆, a blank —
		// nothing else between words. Every one of those slots is the same size,
		// step = 2π / (total slots), so letter spacing and the gaps around each ◆
		// are all the same distance apart. The first word is kept centered on
		// angle 0.
		const wordSlots = repeated.map(text => [...text].length + 3)
		const totalSlots = wordSlots.reduce((sum, n) => sum + n, 0)
		const step = (Math.PI * 2) / totalSlots
		const wordCenters: number[] = []
		let cursor = 0
		wordSlots.forEach(n => {
			wordCenters.push((cursor + n / 2) * step)
			cursor += n
		})
		const firstCenter = wordCenters[0]
		wordCenters.forEach((c, k) => (wordCenters[k] = c - firstCenter))

		repeated.forEach((text, i) => {
			const slotAngle = wordCenters[i]
			// Each word is its own run of glyphs (plus a trailing gap and dot),
			// one CSS3DObject per glyph rather than one per word — a `null`
			// entry consumes an angle step without rendering anything, which is
			// what puts a small gap between the last letter and the dot. Every
			// glyph gets its own position/rotation around the circle, centered
			// on the word's slot, so the word itself curves along the ring
			// instead of reading as one flat card that happens to orbit.
			const glyphs: (string | null)[] = [...text, null, '◆', null]

			glyphs.forEach((glyph, gi) => {
				if (glyph === null) return
				const el = document.createElement('div')
				el.className =
					glyph === '◆'
						? 'skills-ring-char skills-ring-dot'
						: 'skills-ring-char'
				el.textContent = glyph

				const object = new CSS3DObject(el)
				const offsetIndex = gi - (glyphs.length - 1) / 2
				const angle = slotAngle + offsetIndex * step
				object.position.set(
					RADIUS * Math.sin(angle),
					0,
					RADIUS * Math.cos(angle)
				)
				// Faces outward from the ring's center, tangent to the circle at
				// this glyph's own point — reads normally at the front,
				// foreshortens toward edge-on as it swings round to the side,
				// which is what actually sells the "wrapping around a 3D
				// cylinder" illusion (see the file-level comment on the
				// billboard-vs-tangent trade).
				object.rotation.y = angle

				// Starts in the back scene; the render loop's very first pass
				// immediately reassigns it if that's not actually correct yet.
				back.group.add(object)
				ringItems.push({ object, wordIndex: i, offsetIndex, inFront: false })
			})
		})

		let fitScale = 1
		let appliedFontSize = -1
		let appliedFontWeight = -1

		function resize() {
			const w = backContainer!.clientWidth
			const h = backContainer!.clientHeight
			if (w === 0 || h === 0) return

			// The CSS3D camera's projected size tracks container HEIGHT (its
			// focal length is height / 2 / tan(fov/2) — see CSS3DRenderer's own
			// `fov` local), but the ring's horizontal room is capped by
			// container WIDTH and where that container sits in the viewport.
			// Those two are decoupled: on a desktop window just above the
			// mobile breakpoint, height barely shrinks while width shrinks a
			// lot, so the ring's fixed RADIUS overshoots the viewport edge and
			// gets clipped by .hero-pin's overflow: hidden (letters lost off
			// one side mid-word). Shrink the whole ring — never grow it past
			// its designed size — so its worst-case horizontal reach (RADIUS
			// world units, empirically the max |x| any glyph hits over a full
			// rotation regardless of tilt) always lands inside however much
			// room actually exists between the container's center and the
			// nearer edge of the viewport.
			const rect = backContainer!.getBoundingClientRect()
			const centerX = rect.left + rect.width / 2
			const availableHalfWidth =
				Math.min(centerX, window.innerWidth - centerX) - EDGE_MARGIN
			const focalLength =
				h / 2 / Math.tan(THREE.MathUtils.degToRad(back.camera.fov) / 2)
			const naturalMaxOffset = (RADIUS * focalLength) / back.camera.position.z
			const scale = THREE.MathUtils.clamp(
				availableHalfWidth / naturalMaxOffset,
				MIN_RING_SCALE,
				1
			)

			for (const { camera, renderer } of [back, front]) {
				camera.aspect = w / h
				camera.updateProjectionMatrix()
				renderer.setSize(w, h)
			}
			fitScale = scale
		}
		resize()
		const ro = new ResizeObserver(resize)
		ro.observe(backContainer)

		let raf = 0
		let rotation = 0
		let lastT = performance.now()
		const rotationMatrix = new THREE.Matrix4()
		const worldPosition = new THREE.Vector3()

		const render = () => {
			const now = performance.now()
			const dt = Math.min((now - lastT) / 1000, 1 / 30)
			lastT = now
			rotation += dt * ringTuning.speed
			// Both groups share one rotation value, kept in sync by hand every
			// frame (not a shared Three.js parent) — that's what lets an item
			// move from one scene's group to the other's mid-rotation without
			// any visual pop, since both parents always have an identical
			// transform at the moment of the handoff. The X tilt is constant,
			// but set here too rather than once outside the loop, so it stays
			// trivially in sync with rotation.y the same way.
			back.group.rotation.set(
				ringTuning.tilt,
				rotation + ringTuning.yaw,
				ringTuning.roll
			)
			front.group.rotation.copy(back.group.rotation)
			rotationMatrix.makeRotationFromEuler(back.group.rotation)
			// fitScale is resize()'s shrink-to-fit factor; size is the tuner's
			// manual multiplier on top of it.
			back.group.scale.setScalar(fitScale * ringTuning.size)
			front.group.scale.setScalar(fitScale * ringTuning.size)
			// Tilting rotates the whole group about its local origin, which
			// drags the near (front, most visually prominent) side down by
			// RADIUS × sin(tilt) — nudge the group back up by that same
			// (scaled) amount so the front of the ring settles at roughly the
			// same height it sat at untilted, rather than drooping toward the
			// character's waist. Per frame (not in resize) so it follows the
			// tilt while it's being tuned.
			const lift = RADIUS * Math.sin(ringTuning.tilt) * back.group.scale.x
			back.group.position.set(ringTuning.moveX, lift + ringTuning.moveY, 0)
			front.group.position.copy(back.group.position)

			if (ringTuning.fontSize !== appliedFontSize) {
				appliedFontSize = ringTuning.fontSize
				for (const c of [backContainer, frontContainer]) {
					c.style.setProperty('--ring-font-size', `${appliedFontSize}px`)
				}
			}

			if (ringTuning.fontWeight !== appliedFontWeight) {
				appliedFontWeight = ringTuning.fontWeight
				for (const c of [backContainer, frontContainer]) {
					c.style.setProperty('--ring-font-weight', `${appliedFontWeight}`)
				}
			}

			for (const item of ringItems) {
				const angle =
					wordCenters[item.wordIndex] + item.offsetIndex * step
				item.object.position.set(
					RADIUS * Math.sin(angle),
					0,
					RADIUS * Math.cos(angle)
				)
				item.object.rotation.y = angle
				// 1 = nearest the camera (in front of the character), -1 =
				// farthest (behind him) — dims the far side as a depth cue
				// (see MIN_OPACITY) and decides which of the two scenes
				// currently owns this item (so it paints behind vs. in front
				// of the character). Read off the item's actual rotated
				// position rather than cos(spin angle): that shortcut is only
				// right for a pure X-tilt + Y-spin, and put glyphs in the wrong
				// scene as soon as the ring is rolled about Z.
				const depth =
					worldPosition.copy(item.object.position).applyMatrix4(rotationMatrix)
						.z / RADIUS
				item.object.element.style.opacity = String(
					MIN_OPACITY + (1 - MIN_OPACITY) * ((depth + 1) / 2)
				)

				const shouldBeFront = depth > 0
				if (shouldBeFront !== item.inFront) {
					if (shouldBeFront) {
						back.group.remove(item.object)
						front.group.add(item.object)
					} else {
						front.group.remove(item.object)
						back.group.add(item.object)
					}
					item.inFront = shouldBeFront
				}
			}

			back.renderer.render(back.scene, back.camera)
			front.renderer.render(front.scene, front.camera)
			raf = requestAnimationFrame(render)
		}

		function onVisibility() {
			if (document.hidden) {
				if (raf) cancelAnimationFrame(raf)
				raf = 0
			} else if (!raf) {
				lastT = performance.now()
				render()
			}
		}
		document.addEventListener('visibilitychange', onVisibility)

		render()

		return () => {
			if (raf) cancelAnimationFrame(raf)
			ro.disconnect()
			document.removeEventListener('visibilitychange', onVisibility)
			backContainer!.removeChild(back.renderer.domElement)
			frontContainer!.removeChild(front.renderer.domElement)
		}
	}, [items])

	return (
		<>
			<div
				className='skills-ring skills-ring--back'
				ref={backRef}
				aria-hidden='true'
			/>
			<div
				className='skills-ring skills-ring--front'
				ref={frontRef}
				aria-hidden='true'
			/>
		</>
	)
}
