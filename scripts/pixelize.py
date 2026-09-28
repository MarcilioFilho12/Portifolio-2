#!/usr/bin/env python
"""Turn source art into game-ready pixel assets. Dev-time only, never bundled.

Nearest-neighbour downscale keeps the pixel grid hard; quantizing flattens the
anti-aliasing that image generators add, which is what makes these files heavy.

  python scripts/pixelize.py public/media/rokenpo/*.png --height 130 --colors 32
  python scripts/pixelize.py public/media/rokenpo/*.png --unbg
  python scripts/pixelize.py art/icon.png --height 16 --grid

--grid prints a number[][] indexed against PALETTE in
src/games/rokenpo/domain/constants.ts, ready to paste for PixelArt.vue.
Only worth it for small sprites: PixelArt renders one DOM node per pixel.
"""

from __future__ import annotations

import argparse
import sys
from collections import deque
from pathlib import Path

from PIL import Image

# Mirrors PALETTE in src/games/rokenpo/domain/constants.ts. Index 0 is transparent.
PALETTE = [
    None,
    (0xF4, 0xEF, 0xE6),
    (0x44, 0x40, 0x3C),
    (0x1C, 0x19, 0x17),
    (0xB9, 0x1C, 0x1C),
    (0xD6, 0xA3, 0x5C),
    (0x1E, 0x3A, 0x8A),
    (0x25, 0x63, 0xEB),
    (0x3F, 0x62, 0x12),
    (0xEF, 0x44, 0x44),
    (0xD6, 0xD3, 0xD1),
    (0x78, 0x71, 0x6C),
]


def drop_background(image: Image.Image, cutoff: int) -> Image.Image:
    """Clear the dark backdrop without eating the sprite's own black outlines.

    Flood fills inward from the border, so only dark pixels connected to the
    edge become transparent.
    """
    width, height = image.size
    pixels = image.load()
    seen = bytearray(width * height)
    queue = deque()

    def consider(x: int, y: int) -> None:
        index = y * width + x
        if seen[index]:
            return
        seen[index] = 1
        r, g, b, _ = pixels[x, y]
        if max(r, g, b) <= cutoff:
            pixels[x, y] = (0, 0, 0, 0)
            queue.append((x, y))

    for x in range(width):
        consider(x, 0)
        consider(x, height - 1)
    for y in range(height):
        consider(0, y)
        consider(width - 1, y)

    while queue:
        x, y = queue.popleft()
        if x > 0:
            consider(x - 1, y)
        if x < width - 1:
            consider(x + 1, y)
        if y > 0:
            consider(x, y - 1)
        if y < height - 1:
            consider(x, y + 1)

    return image


def downscale(image: Image.Image, height: int | None) -> Image.Image:
    if not height or height >= image.height:
        return image
    width = max(1, round(image.width * height / image.height))
    return image.resize((width, height), Image.NEAREST)


def quantize(image: Image.Image, colors: int) -> Image.Image:
    alpha = image.getchannel("A")
    flat = image.convert("RGB").quantize(colors=colors, method=Image.MEDIANCUT)
    out = flat.convert("RGBA")
    out.putalpha(alpha)
    return out


def nearest_index(pixel: tuple[int, int, int, int]) -> int:
    r, g, b, a = pixel
    if a < 128:
        return 0
    return min(
        range(1, len(PALETTE)),
        key=lambda i: sum((c - d) ** 2 for c, d in zip((r, g, b), PALETTE[i])),
    )


def to_grid(image: Image.Image) -> list[list[int]]:
    return [
        [nearest_index(image.getpixel((x, y))) for x in range(image.width)]
        for y in range(image.height)
    ]


def print_grid(grid: list[list[int]]) -> None:
    print("[")
    for row in grid:
        print(f"  [{', '.join(str(value) for value in row)}],")
    print("]")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("paths", nargs="+", type=Path)
    parser.add_argument("--height", type=int, help="target height in pixels")
    parser.add_argument("--colors", type=int, help="flatten to at most N colors")
    parser.add_argument(
        "--unbg",
        type=int,
        nargs="?",
        const=40,
        metavar="CUTOFF",
        help="clear the dark backdrop, keeping darks that the border cannot reach",
    )
    parser.add_argument("--grid", action="store_true", help="print number[][] instead of writing")
    parser.add_argument("--out", type=Path, help="output directory (defaults to in place)")
    args = parser.parse_args()

    for path in args.paths:
        if not path.is_file():
            print(f"skip {path}: not a file", file=sys.stderr)
            continue

        before = path.stat().st_size
        image = Image.open(path).convert("RGBA")
        if args.unbg is not None:
            image = drop_background(image, args.unbg)
        image = downscale(image, args.height)

        if args.grid:
            print(f"// {path.name} {image.width}x{image.height}")
            print_grid(to_grid(image))
            continue

        if args.colors:
            image = quantize(image, args.colors)

        target = (args.out / path.name) if args.out else path
        if args.out:
            args.out.mkdir(parents=True, exist_ok=True)
        image.save(target, optimize=True)

        after = target.stat().st_size
        print(f"{path.name} {image.width}x{image.height} {before // 1024}KB -> {after // 1024}KB")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
