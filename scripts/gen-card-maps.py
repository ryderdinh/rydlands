#!/usr/bin/env python3
"""Regenerate the metal card's mask / roughness / normal maps from its color art.

    python3 scripts/gen-card-maps.py                  # the default front: front/main
    python3 scripts/gen-card-maps.py front/other      # another front design
    python3 scripts/gen-card-maps.py back             # the (single) back
    python3 scripts/gen-card-maps.py --all            # every design that has a color.png
    python3 scripts/gen-card-maps.py --out /tmp/x     # write elsewhere (to compare first)

Layout under public/card/: front/<variant>/ (any number of front designs) and back/
(one back). In each folder the source of truth is color.png: gold ornament on a
near-black plate. Anything gold-ish (red clearly above blue) is treated as the raised
gold; the rest is the plate. From that this writes, next to it and at the same size:

    mask.png    white = gold (reference only, the page doesn't load it)
    rough.png   polished gold, slightly rougher black (read from the G channel)
    normal.png  the gold stands proud of the plate (OpenGL normals, green up)

color.png itself is never touched. Needs Pillow (pip install pillow).
"""
import argparse
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
CARD_DIR = ROOT / "public" / "card"

ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
ap.add_argument("face", nargs="?", default="front/main", help="folder under public/card (default: front/main)")
ap.add_argument("--all", action="store_true", help="every folder under public/card that has a color.png")
ap.add_argument("--out", type=Path, help="write under this folder instead (keeps the same front/<variant> or back subfolder)")
ap.add_argument("--gold-rough", type=int, default=60, help="roughness of the gold, 0-255 (default 60)")
ap.add_argument("--dark-rough", type=int, default=110, help="roughness of the plate, 0-255 (default 110)")
ap.add_argument("--relief-blur", type=float, default=3.5, help="softness of the raised edge in px (default 3.5)")
ap.add_argument("--relief-amp", type=float, default=1.4, help="steepness of the raised edge (default 1.4)")
args = ap.parse_args()


def generate(face: Path):
    color = Image.open(face / "color.png").convert("RGB")
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

    out = (args.out / face.relative_to(CARD_DIR)) if args.out else face
    out.mkdir(parents=True, exist_ok=True)
    mask.save(out / "mask.png")
    rough.save(out / "rough.png")
    normal.save(out / "normal.png")
    print(f"{face.relative_to(CARD_DIR)}: {w}x{h} -> {out}: mask.png, rough.png, normal.png")


faces = sorted(p.parent for p in CARD_DIR.rglob("color.png")) if args.all else [CARD_DIR / args.face]
if not faces:
    ap.error(f"no color.png found under {CARD_DIR}")
for face in faces:
    if not (face / "color.png").exists():
        ap.error(f"{face.relative_to(CARD_DIR)}/color.png does not exist")
    generate(face)
