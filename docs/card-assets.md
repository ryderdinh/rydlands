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
| `mask.png`   | White = gold, black = plate. Reference only                                   | Script                                        | No                 |

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
