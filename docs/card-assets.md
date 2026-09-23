# Metal card assets (scene two)

The card is drawn by [components/CardScene.tsx](../components/CardScene.tsx) from three
images in [public/card/](../public/card/). The page loads them at `/card/<name>.png`.

| File              | Role                                                                          | Made by                                       | Loaded by the page |
| ----------------- | ----------------------------------------------------------------------------- | --------------------------------------------- | ------------------ |
| `card-color.png`  | Base color of the metal: gold ornament on a near-black plate (sRGB)           | **You, by hand** — the single source of truth | Yes                |
| `card-rough.png`  | Roughness. White = rough, black = mirror-smooth. Only the G channel is read   | Script                                        | Yes                |
| `card-normal.png` | Makes the gold stand proud of the plate (OpenGL convention, green channel up) | Script                                        | Yes                |
| `card-mask.png`   | White = gold, black = plate. Reference only                                   | Script                                        | No                 |

All four images must be the **same size**. The card's aspect ratio in code
(`CARD_W` = 1576 / 923) has to match the art; if you change the image's aspect
ratio, update that constant.

## Regenerating the maps after editing `card-color.png`

Requires Python 3 and Pillow (`pip install pillow`; already installed on this machine).

From the project root:

```
python3 scripts/gen-card-maps.py
```

The script reads `card-color.png` and overwrites `card-mask.png`,
`card-rough.png` and `card-normal.png` in `public/card/`, at the color art's
size. **`card-color.png` is never written.** Then hard-reload the browser
(Cmd+Shift+R) to drop the cached images; the dev server does not need a restart.

To preview without overwriting the images in use:

```
python3 scripts/gen-card-maps.py --out /tmp/card-test
```

### Options

| Flag                   | Default       | Effect                                                        |
| ---------------------- | ------------- | ------------------------------------------------------------- |
| `--out <dir>`          | `public/card` | Write somewhere else                                          |
| `--relief-amp <n>`     | `1.4`         | Steepness of the raised edge. Higher = more pronounced relief |
| `--relief-blur <px>`   | `3.5`         | Softness of the raised edge. Higher = more rounded            |
| `--gold-rough <0-255>` | `60`          | Roughness of the gold                                         |
| `--dark-rough <0-255>` | `110`         | Roughness of the black plate                                  |

For example, stronger relief with a crisper edge:

```
python3 scripts/gen-card-maps.py --relief-amp 2 --relief-blur 2
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

- `card-rough.png`: overwrite freely, as long as the size matches.
- `card-normal.png`: if your tool exports DirectX-style normals (Unreal), the
  relief will look sunken — flip the green channel, or invert it in code.
- Don't assign a color profile to the three data images (`rough`, `normal`,
  `mask`); only `card-color.png` is sRGB.

## Tuning light and material (no image changes needed)

In dev mode, moving to scene two shows the **card tuner** (exposure,
environment light, top light, relief strength, roughness, clearcoat, idle sway,
size, colors). When it looks right, copy the numbers into `cardTuning` at the top of
[components/CardScene.tsx](../components/CardScene.tsx). Corner rounding is
`CORNER_RADIUS` in the same file (keep it under ~0.06 or it clips the gold frame).
