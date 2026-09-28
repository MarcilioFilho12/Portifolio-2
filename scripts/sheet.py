#!/usr/bin/env python
"""Render text pixel grids into sprite sheets. Dev-time only, never bundled.

Art lives in art/*.txt as one character per pixel, which stays editable and
diffable. The game only ever loads the PNG this produces.

  .        transparent
  1-9,a-f  index into PALETTE from src/games/rokenpo/domain/constants.ts

Frames are separated by a line of ---, and every frame must share one size.
Output is a horizontal strip, so CSS can step through it with translateX.

  python scripts/sheet.py art/fighter-taijutsu.txt
  python scripts/sheet.py art/aura.txt --name aura-sennin --recolor 4=7,9=b
  python scripts/sheet.py art/fighter-taijutsu.txt --preview 6
"""

from __future__ import annotations

import argparse
import re
import tempfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
CONSTANTS = ROOT / "src" / "games" / "rokenpo" / "domain" / "constants.ts"
CHARS = ".123456789abcdef"


def load_palette() -> list[tuple[int, int, int, int]]:
    """Single source of truth: the same PALETTE the Vue components render."""
    source = CONSTANTS.read_text(encoding="utf-8")
    block = re.search(r"export const PALETTE = \[(.*?)\]", source, re.S)
    if not block:
        raise SystemExit(f"could not find PALETTE in {CONSTANTS}")

    colors: list[tuple[int, int, int, int]] = []
    for entry in re.findall(r"'([^']+)'", block.group(1)):
        if entry == "transparent":
            colors.append((0, 0, 0, 0))
            continue
        value = entry.lstrip("#")
        colors.append((int(value[0:2], 16), int(value[2:4], 16), int(value[4:6], 16), 255))
    return colors


def parse_frames(path: Path) -> list[list[str]]:
    frames: list[list[str]] = [[]]
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.rstrip()
        if line.startswith("#") or (not line and not frames[-1]):
            continue
        if line.startswith("---"):
            frames.append([])
            continue
        if line:
            frames[-1].append(line)

    frames = [frame for frame in frames if frame]
    if not frames:
        raise SystemExit(f"{path}: no frames")

    width = len(frames[0][0])
    height = len(frames[0])
    for index, frame in enumerate(frames):
        if len(frame) != height:
            raise SystemExit(f"{path}: frame {index} has {len(frame)} rows, expected {height}")
        for y, row in enumerate(frame):
            if len(row) != width:
                raise SystemExit(f"{path}: frame {index} row {y} is {len(row)} wide, expected {width}")
            bad = set(row) - set(CHARS)
            if bad:
                raise SystemExit(f"{path}: frame {index} row {y} has unknown chars {sorted(bad)}")
    return frames


def parse_recolor(spec: str | None) -> dict[int, int]:
    if not spec:
        return {}
    mapping: dict[int, int] = {}
    for pair in spec.split(","):
        source, target = pair.split("=")
        mapping[CHARS.index(source.strip())] = CHARS.index(target.strip())
    return mapping


def render(frames: list[list[str]], palette, recolor: dict[int, int]) -> Image.Image:
    width = len(frames[0][0])
    height = len(frames[0])
    sheet = Image.new("RGBA", (width * len(frames), height), (0, 0, 0, 0))
    pixels = sheet.load()

    for index, frame in enumerate(frames):
        for y, row in enumerate(frame):
            for x, char in enumerate(row):
                value = CHARS.index(char)
                value = recolor.get(value, value)
                if value:
                    pixels[index * width + x, y] = palette[value]
    return sheet


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("paths", nargs="+", type=Path)
    parser.add_argument("--out", type=Path, default=ROOT / "public" / "media" / "rokenpo")
    parser.add_argument("--name", help="output stem (defaults to the input stem)")
    parser.add_argument("--recolor", help="swap indices, e.g. 4=7,9=b")
    parser.add_argument("--preview", type=int, metavar="SCALE", help="also write a scaled copy")
    args = parser.parse_args()

    palette = load_palette()
    recolor = parse_recolor(args.recolor)

    for path in args.paths:
        frames = parse_frames(path)
        sheet = render(frames, palette, recolor)
        frame_width = sheet.width // len(frames)

        args.out.mkdir(parents=True, exist_ok=True)
        target = args.out / f"{args.name or path.stem}.png"
        sheet.save(target, optimize=True)

        print(
            f"{target.name} {len(frames)} quadros de {frame_width}x{sheet.height} "
            f"-> {sheet.width}x{sheet.height}, {target.stat().st_size} bytes"
        )

        if args.preview:
            scaled = sheet.resize(
                (sheet.width * args.preview, sheet.height * args.preview), Image.NEAREST
            )
            backdrop = Image.new("RGBA", scaled.size, (0x10, 0x0C, 0x0A, 255))
            # Temp, never public/, so previews cannot ship with the site.
            preview = Path(tempfile.gettempdir()) / f"preview-{args.name or path.stem}.png"
            Image.alpha_composite(backdrop, scaled).convert("RGB").save(preview)
            print(f"  previa {preview}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
