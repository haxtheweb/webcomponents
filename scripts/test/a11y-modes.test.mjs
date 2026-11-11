// node --test scripts/test/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import zlib from "node:zlib";
import {
  decodePng,
  findings,
  focusChange,
  onlyNarrow,
  targetFindings,
  visibility,
} from "../lib/a11y-modes.mjs";

/** a w x h RGB image filled by fn(x, y) -> [r, g, b] */
function img(w, h, fn) {
  const data = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      data.set([...fn(x, y), 255], (y * w + x) * 4);
    }
  }
  return { width: w, height: h, data };
}

function crc32(buf) {
  let c = ~0;
  for (const b of buf) {
    c ^= b;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1;
    }
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "latin1"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

/** an RGB PNG with one filter type per row, to exercise unfiltering */
function encodePng(w, h, fn) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  const stride = w * 3;
  const rows = [];
  let prev = Buffer.alloc(stride);
  for (let y = 0; y < h; y++) {
    const line = Buffer.alloc(stride);
    for (let x = 0; x < w; x++) {
      Buffer.from(fn(x, y)).copy(line, x * 3);
    }
    const filter = y % 5;
    const out = Buffer.alloc(stride + 1);
    out[0] = filter;
    for (let i = 0; i < stride; i++) {
      const a = i >= 3 ? line[i - 3] : 0;
      const b = prev[i];
      const c = i >= 3 ? prev[i - 3] : 0;
      let p = 0;
      if (filter === 1) {
        p = a;
      } else if (filter === 2) {
        p = b;
      } else if (filter === 3) {
        p = (a + b) >> 1;
      } else if (filter === 4) {
        const q = a + b - c;
        const pa = Math.abs(q - a);
        const pb = Math.abs(q - b);
        const pc = Math.abs(q - c);
        p = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      out[i + 1] = (line[i] - p) & 0xff;
    }
    rows.push(out);
    prev = line;
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(Buffer.concat(rows))),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

test("decodePng reads every filter type back", () => {
  const fn = (x, y) => [(x * 37 + y) & 255, (y * 53) & 255, (x * y) & 255];
  const out = decodePng(encodePng(7, 10, fn));
  assert.equal(out.width, 7);
  assert.equal(out.height, 10);
  assert.deepEqual(out.data, img(7, 10, fn).data);
});

test("visibility: a box drawn only with the page color shows nothing", () => {
  const black = img(20, 20, () => [0, 0, 0]);
  assert.equal(visibility(black, { x: 5, y: 5, width: 10, height: 10 }), 1);
  // the same box filled gray on black is seen (the ring is the background)
  const gray = img(20, 20, (x, y) =>
    x >= 5 && x < 15 && y >= 5 && y < 15 ? [90, 90, 90] : [0, 0, 0],
  );
  assert.ok(visibility(gray, { x: 5, y: 5, width: 10, height: 10 }) > 1.5);
  // white text inside a box on the same black is seen too
  const text = img(20, 20, (x, y) =>
    x === 8 && y === 8 ? [255, 255, 255] : [0, 0, 0],
  );
  assert.ok(visibility(text, { x: 5, y: 5, width: 10, height: 10 }) > 20);
});

test("focusChange counts pixels that change by 3:1 or more", () => {
  const before = img(10, 10, () => [0, 0, 0]);
  const ring = img(10, 10, (x, y) =>
    x === 0 || y === 0 || x === 9 || y === 9 ? [255, 255, 255] : [0, 0, 0],
  );
  assert.equal(focusChange(before, ring), 36);
  // a faint ring: dark gray on black is under 3:1
  const faint = img(10, 10, (x, y) =>
    x === 0 || y === 0 ? [40, 40, 40] : [0, 0, 0],
  );
  assert.equal(focusChange(before, faint), 0);
  assert.equal(
    focusChange(
      before,
      img(11, 10, () => [0, 0, 0]),
    ),
    Infinity,
  );
});

const t = (key, x, y, w, h, extra) => ({
  key,
  x,
  y,
  width: w,
  height: h,
  inline: false,
  ua: false,
  ...extra,
});

test("target size: undersized and crowded fails, spaced or big passes", () => {
  assert.deepEqual(
    targetFindings([
      // two 16px buttons 4px apart: circles overlap
      t("x-el >> button.a", 0, 0, 16, 16),
      t("x-el >> button.b", 20, 0, 16, 16),
      // a 16px button 40px from everything: spacing exception
      t("x-el >> button.lone", 200, 200, 16, 16),
      // 24x24 passes whatever is next to it
      t("x-el >> button.big", 0, 100, 24, 24),
      t("x-el >> button.big2", 24, 100, 24, 24),
    ]),
    { "x-el >> button.a": 1, "x-el >> button.b": 1 },
  );
});

test("target size: inline links, native checkboxes, hidden and foreign targets are exempt", () => {
  assert.deepEqual(
    targetFindings([
      t("x-el >> a", 0, 0, 30, 16, { inline: true }),
      t("x-el >> a.next", 31, 0, 30, 16, { inline: true }),
      t("x-el >> input[type=checkbox]", 0, 20, 13, 13, { ua: true }),
      t("x-el >> input[type=checkbox].b", 0, 34, 13, 13, { ua: true }),
      t("x-el >> a.skip", 0, 60, 1, 1),
      t(null, 100, 100, 10, 10),
      t(null, 112, 100, 10, 10),
    ]),
    {},
  );
});

test("target size: a small target next to a big one fails when the circle reaches it", () => {
  assert.deepEqual(
    targetFindings([
      t("x-el >> button.small", 0, 0, 20, 20),
      t("x-el >> button.big", 21, 0, 40, 40),
    ]),
    { "x-el >> button.small": 1 },
  );
  assert.deepEqual(
    targetFindings([
      t("x-el >> button.small", 0, 0, 20, 20),
      t("x-el >> button.big", 30, 0, 40, 40),
    ]),
    {},
  );
});

test("reflow keys only count when the wide run does not show them", () => {
  assert.deepEqual(onlyNarrow(["a", "b"], ["b"]), { a: 1 });
});

test("findings pairs parts across runs and keeps each rule apart", () => {
  const forced = {
    controls: [
      { key: "x-el >> button", visible: 1, change: 0 },
      { key: "x-el >> button", visible: 21, change: 200 },
      { key: "x-el >> a", visible: 21, change: null },
    ],
    icons: [
      { key: "x-el >> svg", visible: 1.6 },
      { key: "x-el >> simple-icon-lite", visible: 21 },
    ],
  };
  const dark = {
    controls: [
      { key: "x-el >> button", visible: 3, change: 2 },
      { key: "x-el >> button", visible: 1, change: 50 },
      { key: "x-el >> a", visible: 5, change: 40 },
    ],
    icons: [
      { key: "x-el >> svg", visible: 8 },
      { key: "x-el >> simple-icon-lite", visible: 8 },
    ],
    reflow: { clipped: ["x-el >> span.slide"], overlap: [] },
    targets: [],
  };
  const reflow = {
    reflow: {
      overflow: ["x-el >> div.row"],
      clipped: ["x-el >> span.slide", "x-el >> p.title"],
      overlap: ["x-el >> p.a / p.b"],
    },
  };
  assert.deepEqual(findings({ forced, dark, reflow }), {
    // the first button: no ring under forced colors, faint in dark mode,
    // and gone under forced colors while dark mode shows it
    "forced-focus": { "x-el >> button": 1 },
    "dark-focus": { "x-el >> button": 1 },
    "forced-invisible": { "x-el >> button": 1 },
    "forced-icon": { "x-el >> svg": 1 },
    "reflow-overflow": { "x-el >> div.row": 1 },
    "reflow-clipped": { "x-el >> p.title": 1 },
    "reflow-overlap": { "x-el >> p.a / p.b": 1 },
    "target-size": {},
  });
});
