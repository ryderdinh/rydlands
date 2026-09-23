#!/usr/bin/env python3
"""Regenerate the metal card's mask / roughness / normal maps from its color art.

    python3 scripts/gen-card-maps.py            # reads and writes public/card/
    python3 scripts/gen-card-maps.py --out /tmp/x   # write elsewhere (to compare first)

The source of truth is public/card/card-color.png: gold ornament on a near-black
plate. Anything gold-ish (red clearly above blue) is treated as the raised gold;
the rest is the plate. From that this writes, at the same size as the color art:

    card-mask.png    white = gold (reference only, the page doesn't load it)
    card-rough.png   polished gold, slightly rougher black (read from the G channel)
    card-normal.png  the gold stands proud of the plate (OpenGL normals, green up)

card-color.png itself is never touched. Needs Pillow (pip install pillow).
"""
import argparse
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
CARD_DIR = ROOT / "public" / "card"

ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
ap.add_argument("--out", type=Path, default=CARD_DIR, help="output folder (default: public/card)")
ap.add_argument("--gold-rough", type=int, default=60, help="roughness of the gold, 0-255 (default 60)")
ap.add_argument("--dark-rough", type=int, default=110, help="roughness of the plate, 0-255 (default 110)")
ap.add_argument("--relief-blur", type=float, default=3.5, help="softness of the raised edge in px (default 3.5)")
ap.add_argument("--relief-amp", type=float, default=1.4, help="steepness of the raised edge (default 1.4)")
args = ap.parse_args()

color = Image.open(CARD_DIR / "card-color.png").convert("RGB")
w, h = color.size
r, _, b = color.split()

# Gold-ness from how far red sits above blue; a soft ramp, then a contrast
# push so the edge is crisp but still antialiased.
mask = ImageChops.subtract(r, b).point(lambda v: max(0, min(255, (v - 25) * 255 // 50)))
mask = mask.filter(ImageFilter.GaussianBlur(0.8)).point(lambda v: max(0, min(255, (v - 128) * 3 + 128)))

rough = Image.composite(Image.new("L", (w, h), args.gold_rough), Image.new("L", (w, h), args.dark_rough), mask)

# Normal map from a softened height field (mask blurred = a bevelled edge).
height = mask.filter(ImageFilter.GaussianBlur(args.relief_blur))
sobel = lambda k: height.filter(ImageFilter.Kernel((3, 3), k, scale=1, offset=128))
gx = sobel([-1, 0, 1, -2, 0, 2, -1, 0, 1])
gy = sobel([1, 2, 1, 0, 0, 0, -1, -2, -1])  # y up
amp = lambda v: max(0, min(255, round((v - 128) * args.relief_amp + 128)))
normal = Image.merge("RGB", (gx.point(amp), gy.point(amp), Image.new("L", (w, h), 255)))

args.out.mkdir(parents=True, exist_ok=True)
mask.save(args.out / "card-mask.png")
rough.save(args.out / "card-rough.png")
normal.save(args.out / "card-normal.png")
print(f"{w}x{h} -> {args.out}: card-mask.png, card-rough.png, card-normal.png")
