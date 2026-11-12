/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */

/**
 * Keepcase: the case generator behind vhs-blog-theme.
 *
 * Every post gets a one-of-a-kind video case from a hash of its title, the
 * same idea as rpg-character's seed: the same title always gives the same
 * case, on any site, in any build, with nothing stored. Each visual axis
 * (palette, face, case type, layout, ...) hashes the title with its own salt
 * so axes vary independently.
 *
 * Invariants this module keeps (covered by test/vhs-blog-case.test.js):
 * - title text always uses the palette ink, and every ink is at least 4.5:1
 *   on its background;
 * - an accent colour is used for title text (the two-tone last word) only
 *   when it is also at least 4.5:1 on the background;
 * - every face is a legible text face (no display faces that trade reading
 *   for decoration), and spine titles never go below 18px;
 * - the result is a pure function of (title, seed).
 */

// [background, ink, accent]
export const VHS_BLOG_PALETTES = [
  ["#0d0d0d", "#f5f1e8", "#e63946"],
  ["#f5f1e8", "#141414", "#c1121f"],
  ["#1d3557", "#f1faee", "#a8dadc"],
  ["#ffbe0b", "#1b1b1b", "#d62828"],
  ["#3a0ca3", "#ffffff", "#f72585"],
  ["#1b6e35", "#ffffff", "#ffff3f"],
  ["#e85d04", "#1b1b1b", "#ffffff"],
  ["#0077b6", "#ffffff", "#90e0ef"],
  ["#ffffff", "#0b3d91", "#e63946"],
  ["#6a040f", "#ffd6a5", "#ffba08"],
  ["#14213d", "#fca311", "#e5e5e5"],
  ["#c1121f", "#ffffff", "#ffba08"],
  ["#2d2d2d", "#e0e0e0", "#ff006e"],
  ["#ccd5ae", "#283618", "#7a2e0b"],
  ["#0b090a", "#ffd60a", "#ff0054"],
  ["#5e548e", "#ffffff", "#e0b1cb"],
  ["#fefae0", "#7f1d1d", "#283618"],
  ["#00b4d8", "#03045e", "#6a040f"],
];

// [family, weight, text-transform, letter-spacing, font-style, size scale]
export const VHS_BLOG_FACES = [
  ["Anton", 400, "uppercase", "0.02em", "normal", 1.1],
  ["Bebas Neue", 400, "uppercase", "0.05em", "normal", 1.25],
  ["Oswald", 700, "uppercase", "0", "normal", 1.05],
  ["Playfair Display", 900, "none", "0", "italic", 1],
  ["Cinzel", 700, "uppercase", "0.06em", "normal", 0.9],
  ["Permanent Marker", 400, "none", "0", "normal", 0.95],
  ["Righteous", 400, "none", "0.01em", "normal", 1],
  ["Bungee", 400, "uppercase", "0", "normal", 0.85],
  ["Abril Fatface", 400, "none", "0.01em", "normal", 1],
  ["Orbitron", 800, "uppercase", "0.04em", "normal", 0.85],
  ["Russo One", 400, "uppercase", "0.02em", "normal", 0.95],
  ["Special Elite", 400, "none", "0", "normal", 1],
  ["Staatliches", 400, "uppercase", "0.06em", "normal", 1.1],
  ["Black Ops One", 400, "uppercase", "0.02em", "normal", 0.95],
  ["Archivo Black", 400, "none", "0", "normal", 0.95],
  ["Lobster", 400, "none", "0", "normal", 1.05],
];

// weighted: plain black keepcases are the most common, like a real shelf
export const VHS_BLOG_CASES = [
  "keep",
  "keep",
  "keep",
  "clear",
  "white",
  "steel",
  "slim",
  "snap",
];
export const VHS_BLOG_LAYOUTS = ["solid", "art", "art", "split", "band"];
export const VHS_BLOG_ARTS = [
  "sunburst",
  "horizon",
  "stripes",
  "dots",
  "portrait",
];
export const VHS_BLOG_TREATMENTS = [
  "plain",
  "plain",
  "shadow",
  "tracked",
  "twotone",
];
// badges are cover art lettering, not interface text
export const VHS_BLOG_BADGES = [
  "",
  "",
  "",
  "",
  "Director’s Cut",
  "Collector’s Edition",
  "Unrated",
  "Special Edition",
  "Widescreen",
  "Remastered",
];
// invented studios; no real studio names or marks
export const VHS_BLOG_STUDIOS = [
  "Pegboard Pictures",
  "Rewind Home Video",
  "Bargain Bin Films",
  "Late Show Studios",
  "Static Pictures",
  "Tracking Films",
  "Be Kind Video",
  "Two Dollar Features",
  "Midnight Matinee",
  "Keepcase Classics",
];
export const VHS_BLOG_SHAPES = [
  "circle",
  "shield",
  "triangle",
  "star",
  "square",
];
// every sticker carries #1b1b1b text, at least 4.5:1 on each of these
export const VHS_BLOG_STICKERS = [
  "#ff7a1a",
  "#ff7a1a",
  "#ff7a1a",
  "#ffd60a",
  "#9ef01a",
  "#ffffff",
];

/**
 * 53-bit string hash (cyrb53). Fast, well distributed, no dependencies.
 * @param {string} str
 * @param {number} seed
 * @returns {number}
 */
export function vhsBlogHash(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

function luminance(hex) {
  const h = hex.replace("#", "");
  const c = [0, 2, 4].map((i) => {
    const v = parseInt(h.substring(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

/**
 * WCAG contrast ratio of two #rrggbb colours.
 */
export function vhsBlogContrast(a, b) {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/**
 * Spine title size in px for a title length; never below 18px.
 */
export function vhsBlogSpineSize(length, scale = 1, boxset = false) {
  let base = 20;
  if (length <= 12) {
    base = 30;
  } else if (length <= 22) {
    base = 26;
  } else if (length <= 32) {
    base = 22;
  }
  if (boxset) {
    base = base * 1.2;
  }
  return Math.max(18, Math.round(base * scale));
}

const CONDENSED = ["Anton", "Bebas Neue", "Oswald", "Staatliches"];

/**
 * Average glyph width of a case title, in em, for the longest-word fit:
 * uppercase and tracked titles run wider, condensed faces narrower.
 */
export function vhsBlogGlyphWidth(c) {
  let w = c.transform === "uppercase" ? 0.72 : 0.58;
  if (CONDENSED.includes(c.family)) {
    w = w * 0.72;
  }
  if (c.treatment === "tracked") {
    w = w + 0.12;
  }
  return Math.round(w * 100) / 100;
}

/**
 * Characters in the longest word, so a title can shrink until no word has
 * to break across lines.
 */
export function vhsBlogLongestWord(title) {
  return String(title || "")
    .split(/\s+/)
    .reduce((m, w) => Math.max(m, w.length), 1);
}

/**
 * Cover title size in px for a title length.
 */
export function vhsBlogCoverSize(length, scale = 1) {
  let base = 26;
  if (length <= 10) {
    base = 56;
  } else if (length <= 18) {
    base = 46;
  } else if (length <= 28) {
    base = 38;
  } else if (length <= 40) {
    base = 32;
  }
  return Math.round(base * scale);
}

/**
 * Build the case for a title.
 * @param {string} title post title
 * @param {number} [seed] optional re-roll seed (0 = the title alone)
 * @returns {object} everything a spine or cover needs to render
 */
export function vhsBlogCase(title, seed = 0) {
  const t = String(title || "").trim() || "Untitled";
  const pick = (list, salt) =>
    list[vhsBlogHash(t, salt + seed * 97) % list.length];
  const [bg, ink, accent] = pick(VHS_BLOG_PALETTES, 1);
  const face = pick(VHS_BLOG_FACES, 2);
  const words = t.split(/\s+/);
  const accentReadable = vhsBlogContrast(bg, accent) >= 4.5;
  let treatment = pick(VHS_BLOG_TREATMENTS, 6);
  if (treatment === "twotone" && (!accentReadable || words.length < 2)) {
    treatment = "plain";
  }
  // a shadow under light ink on a dark case; never on dark ink
  if (treatment === "shadow" && luminance(ink) < 0.4) {
    treatment = "plain";
  }
  const studio = pick(VHS_BLOG_STUDIOS, 7);
  const tilt = (vhsBlogHash(t, 9 + seed * 97) % 11) - 6;
  return {
    title: t,
    first: treatment === "twotone" ? words.slice(0, -1).join(" ") : t,
    last: treatment === "twotone" ? words[words.length - 1] : "",
    bg,
    ink,
    accent,
    family: face[0],
    weight: face[1],
    transform: face[2],
    letterSpacing: face[3],
    fontStyle: face[4],
    scale: face[5],
    caseType: pick(VHS_BLOG_CASES, 3),
    layout: pick(VHS_BLOG_LAYOUTS, 4),
    art: pick(VHS_BLOG_ARTS, 5),
    treatment,
    badge: pick(VHS_BLOG_BADGES, 10),
    studio,
    studioInitials: studio
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2),
    shape: pick(VHS_BLOG_SHAPES, 8),
    sticker: pick(VHS_BLOG_STICKERS, 13),
    tilt,
    barcode: vhsBlogHash(t, 11 + seed * 97) % 10 < 3,
    catalog:
      "KC-" +
      vhsBlogHash(t, 12 + seed * 97)
        .toString(16)
        .slice(-5)
        .toUpperCase(),
  };
}

const FONT_QUERY = {
  "Playfair Display": "Playfair+Display:ital,wght@1,900",
  Oswald: "Oswald:wght@700",
  Cinzel: "Cinzel:wght@700",
  Orbitron: "Orbitron:wght@800",
  Archivo: "Archivo:wght@400;600;800",
  "Archivo Narrow": "Archivo+Narrow:wght@500;700",
  "IBM Plex Mono": "IBM+Plex+Mono:wght@500",
};

/**
 * Load a Google Fonts family once per document, only when a case on the
 * page uses it. @font-face has to live in the document for shadow roots to
 * use it, so this adds one <link> per family to document.head.
 * @param {string} family
 */
export function vhsBlogLoadFace(family) {
  const doc = globalThis.document;
  if (!doc || !doc.head || !family) {
    return;
  }
  const id =
    "vhs-blog-font-" + family.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (doc.getElementById(id)) {
    return;
  }
  const query = FONT_QUERY[family] || family.replace(/ /g, "+");
  const link = doc.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${query}&display=swap`;
  doc.head.appendChild(link);
}
