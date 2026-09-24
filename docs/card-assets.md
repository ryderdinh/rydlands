# Metal card assets (scene two)

The card is drawn by [components/CardScene.tsx](../components/CardScene.tsx). It has two
faces: a **front**, of which there can be many designs (one per scene), and a single
**back** shared by all of them. Each face is a folder of four images under
[public/card/](../public/card/); the page loads them at `/card/<folder>/<name>.png`.

```text
public/card/
  front/
    main/            <- the front used by scene two today
      color.png
      rough.png
      normal.png
      mask.png
    <another>/       <- add a folder per extra front design
  back/              <- the one back
    color.png ...
```

| File         | Role                                                                          | Made by                                       | Loaded by the page |
| ------------ | ----------------------------------------------------------------------------- | --------------------------------------------- | ------------------ |
| `color.png`  | Base color of the metal: gold ornament on a near-black plate (sRGB)           | **You, by hand** — the single source of truth | Yes                |
| `rough.png`  | Roughness. White = rough, black = mirror-smooth. Only the G channel is read   | Script                                        | Yes                |
| `normal.png` | Makes the gold stand proud of the plate (OpenGL convention, green channel up) | Script                                        | Yes                |
| `mask.png`   | White = gold, black = plate                                                   | Script                                        | Front only         |

All four images in a folder must be the **same size**, and every face should share the
card's aspect ratio in code (`CARD_W` = 1576 / 923). If you change the ratio, update that
constant. For now `back/` is a copy of `front/main/`; edit `back/color.png` to design it.

## Choosing which front to show

`CardScene` takes a `front` prop: `<CardScene front="main" />` shows `front/main/`
(the default). A new scene with a different card front is a new folder plus that prop.
Changing `front` rebuilds the card scene.

## Regenerating the maps after editing a `color.png`

Requires Python 3 and Pillow (`pip install pillow`; already installed on this machine).

From the project root:

```bash
python3 scripts/gen-card-maps.py                # front/main (the default)
python3 scripts/gen-card-maps.py front/other    # another front design
python3 scripts/gen-card-maps.py back           # the back
python3 scripts/gen-card-maps.py --all          # every folder that has a color.png
```

The script reads that folder's `color.png` and overwrites its `mask.png`, `rough.png`
and `normal.png`, at the color art's size. **`color.png` is never written.** Note that it
overwrites hand-painted `rough.png` / `normal.png` too. Then hard-reload the browser
(Cmd+Shift+R) to drop the cached images; the dev server does not need a restart.

To preview without overwriting the images in use (keeps the same `front/<variant>` /
`back` subfolders under the given directory):

```bash
python3 scripts/gen-card-maps.py --all --out /tmp/card-test
```

### Options

| Flag                   | Default      | Effect                                                        |
| ---------------------- | ------------ | ------------------------------------------------------------- |
| `<face>` (positional)  | `front/main` | Folder under `public/card` to generate                        |
| `--all`                | off          | Generate every folder that has a `color.png`                  |
| `--out <dir>`          | in place     | Write under another directory instead                         |
| `--relief-amp <n>`     | `1.4`        | Steepness of the raised edge. Higher = more pronounced relief |
| `--relief-blur <px>`   | `3.5`        | Softness of the raised edge. Higher = more rounded            |
| `--gold-rough <0-255>` | `60`         | Roughness of the gold                                         |
| `--dark-rough <0-255>` | `110`        | Roughness of the black plate                                  |

For example, stronger relief with a crisper edge:

```bash
python3 scripts/gen-card-maps.py --relief-amp 2 --relief-blur 2
```

## Examples

The commands used while setting this up, run from the project root.

Set up the folder layout (front variant `main`, plus the back as a copy of it):

```bash
cd public/card
mkdir -p front/main back
for n in color rough normal mask; do
  mv card-$n.png front/main/$n.png        # the old flat names -> front/main/
  mv card-back-$n.png back/$n.png         # the old back copies -> back/
done
```

Preview the generated maps for every face without touching the images in use (this is the
run that checked the script after the folder change; output shortened):

```bash
python3 scripts/gen-card-maps.py --all --out /tmp/card-test
# back: 1576x923 -> /tmp/card-test/back: mask.png, rough.png, normal.png
# front/main: 1576x923 -> /tmp/card-test/front/main: mask.png, rough.png, normal.png
```

Asking for a folder that has no `color.png` fails without writing anything:

```bash
python3 scripts/gen-card-maps.py nope
# gen-card-maps.py: error: nope/color.png does not exist
```

Regenerate in place after editing a `color.png`:

```bash
python3 scripts/gen-card-maps.py               # front/main
python3 scripts/gen-card-maps.py back          # the back
python3 scripts/gen-card-maps.py --all         # everything
```

Add a second front design for another scene, then generate its maps (edit
`front/other/color.png` before the second command):

```bash
cp -r public/card/front/main public/card/front/other
python3 scripts/gen-card-maps.py front/other
# then: <CardScene front="other" />
```

## How the script tells gold from plate

A pixel counts as **gold** when its red channel is at least about 25 above its
blue channel (a soft ramp over 25–75). Everything else is the plate. So:

- New detail painted in gold → raised, and polished like gold.
- Detail painted in another color (gray, blue, white…) → treated as plate, **not raised**.
- The gold doesn't need to be an exact hex; red just has to clear blue by enough.

If you need something raised that isn't gold, or several relief heights, the
script needs a hand-painted mask instead — reading a mask from a file is not
supported yet.

## Painting the maps yourself instead of using the script

- `rough.png`: overwrite freely, as long as the size matches.
- `normal.png`: if your tool exports DirectX-style normals (Unreal), the
  relief will look sunken — flip the green channel, or invert it in code.
- Don't assign a color profile to the three data images (`rough`, `normal`,
  `mask`); only `color.png` is sRGB.

## Tuning light and material (no image changes needed)

In dev mode, moving to scene two shows the **card tuner** (exposure,
environment light, top light, relief strength, roughness, clearcoat, idle sway,
size, entrance stiffness and damping, colors, and a replay button). When it looks
right, copy the numbers into `cardTuning` at the top of
[components/CardScene.tsx](../components/CardScene.tsx). Corner rounding is
`CORNER_RADIUS` in the same file (keep it under ~0.06 or it clips the gold frame).

## The front's animated plate

The front face's plate (everything `mask.png` marks as not-gold) is not shown as the
flat near-black baked into `color.png`. At render time it's replaced by a set of
flowing colored ribbons, with the plate's own near-black showing through where there's
no ribbon — while the gold ornament still reads straight from `color.png` unchanged.
This means:

- You keep painting `color.png` exactly as documented above — gold ornament on a
  near-black plate — so the existing gold-detection heuristic (and the relief maps
  it drives) keeps working. You do **not** need to paint the ribbons by hand.
- `mask.png` (previously generated but unused) is now loaded at runtime for the
  front face and is what tells the shader where the plate is.
- The back face is untouched — still the flat art from `color.png` — until it gets
  its own design.

The ribbons are genuine flow-field streamlines, not a closed-form shader formula:
[lib/cardPlateStreams.ts](../lib/cardPlateStreams.ts) traces a handful of points
through a curl-noise vector field (an earlier version tried to fake this with an
analytic `fract()`-based band-cutting formula in GLSL — it needed increasingly
careful math to avoid the paths folding into jagged zigzags, and even then only
approximated what tracing gives for free: organic bends, and ribbons unevenly spaced
by the field's own divergence rather than a fixed formula). Each traced path is
stroked onto a small 2D canvas with round joins (`quadraticCurveTo` through the
points), colored by one shared gradient (`plateColorA` → `B` → `C` → `D`, swept along
the canvas' x-axis — the final upright card's vertical, after `CARD_ROLL`), and
uploaded as a `THREE.CanvasTexture`. `makeFace`'s `onBeforeCompile` in
[components/CardScene.tsx](../components/CardScene.tsx) just samples that texture and
mixes it under the gold mask — the shader itself no longer computes the pattern.

Redrawn every frame the card is visible (`drawPlateStreams`, called from the render
loop) with the curl-noise field's time offset advancing, so the streamlines keep
reshaping instead of sitting in one static curve — the "chuyển động" (animated) look
that was the original ask.

Tunable in the card tuner, under `cardTuning.plate*` in
[components/CardScene.tsx](../components/CardScene.tsx): `plateMix` (0 = the
original flat plate, 1 = fully the ribbons — the dial to compare against the old
look), `plateCount` (how many streamlines), `plateWidthPx` (stroke width),
`plateNoiseScale`/`plateSway` (how tight/how strong the bends are), `plateForwardBias`
(how strongly each streamline is pushed to keep advancing — lower lets them loop and
wander more), `plateSpeed` (flow speed), `plateBrightness`, and the four
`plateColor*` stops the gradient sweeps through.

`plateDotScale`/`plateDotSize`/`plateDotDarken` add a fine halftone dot grid over the
whole plate — background and ribbons alike, never the gold — the printed-card
reference art has instead of a flat fill (`plateDotField`/the dot math in
`onBeforeCompile`, applied to `platePixel` before the gold mask mix so it can't touch
the ornament). Density, each dot's radius within its cell, and how much it darkens at
the center; `plateDotDarken: 0` turns it off entirely.

`plateTimeHold`/`plateTimeScrub` freeze the flow at one exact moment instead of
auto-advancing — a Unity-Animation-window-style scrub, in the same seconds-elapsed
units the auto clock uses. Click the "plate: scrub" slider, then use the arrow keys
to step it one frame at a time.

## Hand-shaping a ribbon

For when the flow field's result isn't quite right for a particular ribbon, scene two
also shows **CardPlateEditor** (dev only, [components/CardPlateEditor.tsx](../components/CardPlateEditor.tsx)):
a dot over each ribbon's three middle control points, drag-projected onto the actual
card as it sways. Drag a dot and that ribbon switches from the curl-noise field to a
smooth curve through its (now hand-placed) points — both ends still pinned exactly
where the procedural version pins them (`ANCHOR_X`/`EXIT_X` in
[lib/cardPlateStreams.ts](../lib/cardPlateStreams.ts)); only the interior is yours.
Double-click a dot to hand that one ribbon back to the flow field; the panel's "reset
all" clears every hand-shaped ribbon at once.

Mechanically: a drag is a raycast from the mouse through the actual card mesh, reading
the hit's own interpolated UV (its front-face group is `materialIndex` 1 — see
`createCardGeometry`) — so the dot always lands exactly where the cursor is on the
card's surface, in the same normalized space the plate shader and `color.png` share.

There's also a standalone page for this, `/dev/card-plate`
([app/dev/card-plate/page.tsx](../app/dev/card-plate/page.tsx),
[components/CardPlateEditorPage.tsx](../components/CardPlateEditorPage.tsx)) — the
card by itself with the tuner and editor always on, no scrolling through scene one
first, and the card's idle sway plus the plate's flow are both frozen on entry (nothing
drifts under you while you're placing a point). Dev only in a stronger sense than the
tuners: `process.env.NODE_ENV` is checked at build time, so `pnpm build`'s static
export bakes a plain 404 into that route — the page itself doesn't exist outside
`pnpm dev`, not just its controls.

### Animating a hand-shaped ribbon (keyframes)

A dragged shape is static by default — the same shape at every moment. To animate one,
Unity-Animation-window style: with the card tuner's "plate: hold" on, drag a ribbon's
dots into shape, then release — that **records a keyframe** for that ribbon at the
current "plate: scrub" time (`plateKeyframes` in
[lib/cardPlateStreams.ts](../lib/cardPlateStreams.ts)). Move "plate: scrub" to another
time, drag the same ribbon into a different shape, release again — a second keyframe.
With 2+ keyframes, that ribbon now eases between its recorded shapes as the clock
advances (`applyPlateKeyframes`, called once a frame from CardScene's render loop)
instead of holding one static pose; a dot turns gold in the editor once its ribbon has
enough keyframes to animate (teal = a static hand-placed shape with 0-1 keyframes).
Double-clicking a dot clears both its shape and its keyframes.

**export json** downloads the current `plateKeyframes` as `plate-keyframes.json`;
**import json** loads one back in. Nothing in the site itself reads that file yet —
right now it's purely a way to save/restore a session's work outside the live editor,
not something CardScene loads automatically. Wiring an exported clip into the actual
site (so a chosen animation ships, not just lives in the dev tool) is a natural next
step once a shape is worth keeping, but isn't built yet.
