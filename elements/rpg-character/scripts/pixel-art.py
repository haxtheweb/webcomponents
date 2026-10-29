#!/usr/bin/env python3
"""Draw rpg-character art as cell grids and write it out as layer SVGs.

Every rpg-character layer is a 113x142 SVG drawn on a 22 x 28 grid of 5px
cells. Cell (col i, row j) covers x = 3 + 5i, y = 2 + 5j, 5px square. Art
uses flat colors and a 1-cell black outline, so a piece is easiest to make
as a grid of characters: paint filled shapes, let `outline()` add the black
border, and emit one <path> per color.

Use it two ways.

As a library (best for a batch of pieces):

    import importlib.util, sys
    spec = importlib.util.spec_from_file_location("pixel_art", "scripts/pixel-art.py")
    pa = importlib.util.module_from_spec(spec); spec.loader.exec_module(pa)
    g = pa.Grid()
    g.rect(1, 3, 5, 15, "r").span(4, 5, "rwwwwwwwwwr").hand()
    pa.write(g, {"r": "#d32f2f", "w": "#ffffff"}, "lib/hat/example.svg")

From the command line, with a JSON spec (one piece or a list of pieces):

    python3 scripts/pixel-art.py spec.json [--lib lib] [--preview out.txt]

    {
      "path": "hat/example.svg",          # written under --lib (default ./lib)
      "palette": {"r": "#d32f2f", "w": ["#ffffff", 0.6]},
      "rows": ["......rrrr....", ...],     # up to 28 rows of up to 22 cells
      "top": 0, "left": 0,                 # optional offset of rows[0][0]
      "outline": true,                     # add the black border (default true)
      "hand": false                        # keep the right hand clear (default false)
    }

Grid characters: "." or " " is empty, "X" is black outline, "_" is a cell
that must stay empty even next to paint (eye holes, the held-item hand), any
other character is looked up in the palette. A palette value may be
[color, opacity] for translucent fills (glass, water, ghosts).

Landmarks on the grid (rows 0-27, cols 0-21), from the stock layers:
  head silhouette  rows 2-15, cols 3-17 (ears reach cols 1-19 on rows 9-10)
  face             rows 11-15, cols 4-14  hat band / brim  rows 7-10
  shirt            rows 16-20, cols 6-14  right arm  col 15, rows 16-23
  right hand       rows 21-22, cols 15-16 (held items go in cols 15-19;
                   draw around the hand and call hand())
  off-hand items   rows 16-20, cols 1-6   pants  rows 21-24, cols 7-13
  feet             rows 25-27, cols 6-14  ground pets  rows 20-27, cols 0-5
  perched pets     rows 11-18, cols 0-4   floating pets  rows 0-5, cols 0-6
These are approximate. Check a new piece against its neighbors with
--read, which prints existing layers stacked as ASCII:

    python3 scripts/pixel-art.py --read lib/base/0.svg lib/item/sword.svg

(--read needs the cairosvg and Pillow packages.)
"""
import argparse
import json
import os
import sys

COLS = 22
ROWS = 28
WIDTH = 113
HEIGHT = 142
HEAD = (
    f'<svg xmlns="http://www.w3.org/2000/svg" fill="none" width="{WIDTH}" '
    f'height="{HEIGHT}" viewBox="0 0 {WIDTH} {HEIGHT}">'
)
EMPTY = "._ "


def cell_xy(col, row):
    """Top-left pixel of a grid cell."""
    return 3 + 5 * col, 2 + 5 * row


class Grid:
    """A 22 x 28 canvas of characters. Methods return self so calls chain."""

    def __init__(self):
        self.g = [["."] * COLS for _ in range(ROWS)]

    def rect(self, r0, r1, c0, c1, ch):
        """Fill rows r0..r1 and cols c0..c1 (inclusive) with ch."""
        for r in range(r0, r1 + 1):
            for c in range(c0, c1 + 1):
                if 0 <= r < ROWS and 0 <= c < COLS:
                    self.g[r][c] = ch
        return self

    def dot(self, r, c, ch):
        return self.rect(r, r, c, c, ch)

    def span(self, r, c0, text):
        """Write text along row r from col c0; spaces leave cells untouched."""
        for i, ch in enumerate(text):
            if ch != " " and 0 <= c0 + i < COLS:
                self.g[r][c0 + i] = ch
        return self

    def paste(self, rows, top=0, left=0):
        """Copy a list of row strings onto the grid; '.' and ' ' are skipped."""
        for j, row in enumerate(rows):
            for i, ch in enumerate(row):
                if ch not in ". " and 0 <= top + j < ROWS and 0 <= left + i < COLS:
                    self.g[top + j][left + i] = ch
        return self

    def hand(self):
        """Keep the right hand visible under a held item."""
        for r in (21, 22):
            for c in (15, 16):
                if self.g[r][c] == ".":
                    self.g[r][c] = "_"
        return self

    def outline(self):
        """Turn every empty cell that touches paint into black outline."""
        add = []
        for r in range(ROWS):
            for c in range(COLS):
                if self.g[r][c] != ".":
                    continue
                for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    rr, cc = r + dr, c + dc
                    if 0 <= rr < ROWS and 0 <= cc < COLS and self.g[rr][cc] not in "._X":
                        add.append((r, c))
                        break
        for r, c in add:
            self.g[r][c] = "X"
        return self

    def rows(self):
        return ["".join(row).replace("_", ".") for row in self.g]

    def text(self):
        """ASCII preview, handy for eyeballing a piece before writing it."""
        return "\n".join(self.rows())


def to_svg(rows, palette, top=0, left=0):
    """Emit SVG markup for rows of characters, one path per color."""
    pal = dict(palette)
    pal.setdefault("X", "#000")
    paths = {}
    for j, row in enumerate(rows):
        i = 0
        while i < len(row):
            ch = row[i]
            if ch in EMPTY:
                i += 1
                continue
            if ch not in pal:
                raise KeyError(f"no palette color for {ch!r} (row {top + j})")
            k = i
            while k < len(row) and row[k] == ch:
                k += 1
            x, y = cell_xy(left + i, top + j)
            w = 5 * (k - i)
            h = min(5, HEIGHT - y)
            if x + w > WIDTH:
                w = WIDTH - x
            if w > 0 and h > 0:
                paths.setdefault(ch, []).append(f"M{x} {y}h{w}v{h}h-{w}Z")
            i = k
    out = [HEAD]
    # outline last so it sits on top of the fills
    for ch in sorted(paths, key=lambda c: (c == "X", c)):
        color = pal[ch]
        opacity = ""
        if isinstance(color, (list, tuple)):
            color, alpha = color
            opacity = f' fill-opacity="{alpha}"'
        out.append(f'<path d="{"".join(paths[ch])}" fill="{color}"{opacity}/>')
    out.append("</svg>")
    return "".join(out)


def write(grid, palette, path, outline=True):
    """Outline (optionally) and write a Grid to path, creating folders."""
    if outline:
        grid.outline()
    os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
    with open(path, "w") as f:
        f.write(to_svg(grid.rows(), palette) + "\n")
    return path


def from_spec(spec):
    grid = Grid().paste(spec["rows"], spec.get("top", 0), spec.get("left", 0))
    if spec.get("hand"):
        grid.hand()
    if spec.get("outline", True):
        grid.outline()
    return grid


def read_layers(paths):
    """Rasterize layer SVGs and stack them as ASCII, one letter per file."""
    import io

    import cairosvg
    from PIL import Image

    grid = [["."] * COLS for _ in range(ROWS)]
    legend = []
    for n, path in enumerate(paths):
        ch = "abcdefghijklmnopqrstuvwyz0123456789"[n % 35]
        legend.append(f"{ch} = {path}")
        png = cairosvg.svg2png(url=path, output_width=WIDTH, output_height=HEIGHT)
        image = Image.open(io.BytesIO(png)).convert("RGBA")
        for r in range(ROWS):
            for c in range(COLS):
                x, y = cell_xy(c, r)
                if image.getpixel((x + 2, y + 2))[3] > 100:
                    grid[r][c] = ch
    header = "   " + "".join(str(c % 10) for c in range(COLS))
    body = [f"{r:2d} {''.join(row)}" for r, row in enumerate(grid)]
    return "\n".join(legend + [header] + body)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("spec", nargs="?", help="JSON file with one piece or a list of pieces")
    parser.add_argument("--read", nargs="+", metavar="SVG", help="print existing layer SVGs stacked as ASCII and exit")
    parser.add_argument("--lib", default="lib", help="folder the piece paths are relative to")
    parser.add_argument("--preview", help="also write ASCII previews to this file")
    args = parser.parse_args(argv)
    if args.read:
        print(read_layers(args.read))
        return 0
    if not args.spec:
        parser.error("a spec file or --read is required")
    with open(args.spec) as f:
        specs = json.load(f)
    if isinstance(specs, dict):
        specs = [specs]
    previews = []
    for spec in specs:
        grid = from_spec(spec)
        path = os.path.join(args.lib, spec["path"])
        write(grid, spec["palette"], path, outline=False)
        previews.append(f"# {spec['path']}\n{grid.text()}\n")
        print(path)
    if args.preview:
        with open(args.preview, "w") as f:
            f.write("\n".join(previews))
    return 0


if __name__ == "__main__":
    sys.exit(main())
