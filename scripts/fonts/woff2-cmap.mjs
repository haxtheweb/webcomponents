/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * The code points a woff2 font file can actually draw, read from its cmap
 * table with nothing but Node's own Brotli. Used by scripts/vendor-fonts.mjs
 * so every @font-face unicode-range names only code points its file has: a
 * browser downloads a subset for each character its range claims, so a
 * range that claims glyphs the file lacks costs a download that draws
 * nothing (the character then falls back to the next font anyway).
 */
import fs from "node:fs";
import zlib from "node:zlib";

// WOFF2 known-table tags, by the 6-bit index in a table directory entry
const KNOWN_TAGS = [
  "cmap",
  "head",
  "hhea",
  "hmtx",
  "maxp",
  "name",
  "OS/2",
  "post",
  "cvt ",
  "fpgm",
  "glyf",
  "loca",
  "prep",
  "CFF ",
  "VORG",
  "EBDT",
  "EBLC",
  "gasp",
  "hdmx",
  "kern",
  "LTSH",
  "PCLT",
  "VDMX",
  "vhea",
  "vmtx",
  "BASE",
  "GDEF",
  "GPOS",
  "GSUB",
  "EBSC",
  "JSTF",
  "MATH",
  "CBDT",
  "CBLC",
  "COLR",
  "CPAL",
  "SVG ",
  "sbix",
  "acnt",
  "avar",
  "bdat",
  "bloc",
  "bsln",
  "cvar",
  "fdsc",
  "feat",
  "fmtx",
  "fvar",
  "gvar",
  "hsty",
  "just",
  "lcar",
  "mort",
  "morx",
  "opbd",
  "prop",
  "trak",
  "Zapf",
  "Silf",
  "Glat",
  "Gloc",
  "Feat",
  "Sill",
];

function readBase128(buf, pos) {
  let value = 0;
  for (let i = 0; i < 5; i++) {
    const byte = buf[pos.at++];
    value = value * 128 + (byte & 0x7f);
    if (!(byte & 0x80)) return value;
  }
  throw new Error("woff2: bad UIntBase128");
}

// the uncompressed cmap table of a woff2 file
function cmapTable(buf) {
  if (buf.toString("latin1", 0, 4) !== "wOF2") {
    throw new Error("not a woff2 file");
  }
  const numTables = buf.readUInt16BE(12);
  const totalCompressedSize = buf.readUInt32BE(20);
  const pos = { at: 48 };
  let offset = 0;
  let cmap = null;
  for (let i = 0; i < numTables; i++) {
    const flags = buf[pos.at++];
    let tag = KNOWN_TAGS[flags & 0x3f];
    if ((flags & 0x3f) === 0x3f) {
      tag = buf.toString("latin1", pos.at, pos.at + 4);
      pos.at += 4;
    }
    const length = readBase128(buf, pos);
    const version = flags >> 6;
    // glyf/loca are transformed unless version 3; every other table is
    // transformed only when version is non-zero
    const transformed =
      tag === "glyf" || tag === "loca" ? version !== 3 : version !== 0;
    const stored = transformed ? readBase128(buf, pos) : length;
    if (tag === "cmap") cmap = { offset, length };
    offset += stored;
  }
  if (!cmap) throw new Error("woff2: no cmap table");
  // collection files carry a header here; HAX only vendors single fonts
  const data = zlib.brotliDecompressSync(
    buf.subarray(pos.at, pos.at + totalCompressedSize),
  );
  return data.subarray(cmap.offset, cmap.offset + cmap.length);
}

// code points mapped to a real glyph by a format 4 or 12 subtable
function codePoints(cmap) {
  const count = cmap.readUInt16BE(2);
  let best = null;
  for (let i = 0; i < count; i++) {
    const platform = cmap.readUInt16BE(4 + i * 8);
    const encoding = cmap.readUInt16BE(6 + i * 8);
    const at = cmap.readUInt32BE(8 + i * 8);
    const format = cmap.readUInt16BE(at);
    const unicode =
      platform === 0 || (platform === 3 && (encoding === 1 || encoding === 10));
    if (!unicode || (format !== 4 && format !== 12)) continue;
    if (!best || format === 12) best = { at, format };
  }
  if (!best) throw new Error("woff2: no Unicode cmap subtable");
  const points = new Set();
  const at = best.at;
  if (best.format === 12) {
    const groups = cmap.readUInt32BE(at + 12);
    for (let g = 0; g < groups; g++) {
      const start = cmap.readUInt32BE(at + 16 + g * 12);
      const end = cmap.readUInt32BE(at + 20 + g * 12);
      const glyph = cmap.readUInt32BE(at + 24 + g * 12);
      for (let c = start; c <= end; c++) {
        if (glyph + (c - start) !== 0) points.add(c);
      }
    }
    return points;
  }
  const segX2 = cmap.readUInt16BE(at + 6);
  const ends = at + 14;
  const starts = ends + segX2 + 2;
  const deltas = starts + segX2;
  const rangeOffsets = deltas + segX2;
  for (let s = 0; s < segX2 / 2; s++) {
    const end = cmap.readUInt16BE(ends + s * 2);
    const start = cmap.readUInt16BE(starts + s * 2);
    const delta = cmap.readInt16BE(deltas + s * 2);
    const ro = cmap.readUInt16BE(rangeOffsets + s * 2);
    for (let c = start; c <= end && c !== 0xffff; c++) {
      let glyph;
      if (ro === 0) {
        glyph = (c + delta) & 0xffff;
      } else {
        const g = cmap.readUInt16BE(
          rangeOffsets + s * 2 + ro + (c - start) * 2,
        );
        glyph = g === 0 ? 0 : (g + delta) & 0xffff;
      }
      if (glyph !== 0) points.add(c);
    }
  }
  return points;
}

export function woff2CodePoints(file) {
  return codePoints(cmapTable(fs.readFileSync(file)));
}

// "U+0000-00FF,U+0131" -> Set of code points
export function parseUnicodeRange(range) {
  const points = new Set();
  range.split(",").forEach((raw) => {
    const part = raw.trim().toUpperCase().replace(/^U\+/, "");
    if (!part) return;
    let lo;
    let hi;
    if (part.includes("?")) {
      lo = parseInt(part.replace(/\?/g, "0"), 16);
      hi = parseInt(part.replace(/\?/g, "F"), 16);
    } else if (part.includes("-")) {
      [lo, hi] = part.split("-").map((h) => parseInt(h, 16));
    } else {
      lo = hi = parseInt(part, 16);
    }
    for (let c = lo; c <= hi; c++) points.add(c);
  });
  return points;
}

// Set of code points -> "U+0000-00FF,U+0131", in the Fontsource form
export function formatUnicodeRange(points) {
  const hex = (n) => n.toString(16).toUpperCase().padStart(4, "0");
  const sorted = [...points].sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < sorted.length; i++) {
    const lo = sorted[i];
    while (i + 1 < sorted.length && sorted[i + 1] === sorted[i] + 1) i++;
    out.push(
      lo === sorted[i] ? `U+${hex(lo)}` : `U+${hex(lo)}-${hex(sorted[i])}`,
    );
  }
  return out.join(",");
}
