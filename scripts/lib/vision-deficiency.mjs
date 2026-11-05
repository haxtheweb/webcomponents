/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Color vision math for checking that UI pairs (accept vs dismiss, save vs
 * cancel, keep vs delete) stay tellable apart when color is unreliable:
 * greyscale screens (low power, night modes, personal preference) and the
 * common color vision deficiencies.
 *
 * - simulate(hex, mode) runs a color through the Machado, Oliveira and
 *   Fernandes (2009) full-severity matrices for protanopia, deuteranopia and
 *   tritanopia, or collapses it to its luminance for achromatopsia.
 *   These are the same models Chrome's "Emulate vision deficiencies" uses.
 * - contrastRatio() is the WCAG 2 ratio, deltaE2000() is CIEDE2000.
 *
 * No dependencies, so it runs in node and in the browser.
 */

export const MODES = [
  "none",
  "achromatopsia",
  "protanopia",
  "deuteranopia",
  "tritanopia",
];

// Machado et al. 2009, severity 1.0, applied in linear RGB
const MATRICES = {
  protanopia: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deuteranopia: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
  tritanopia: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733, 0.691367, 0.3039],
  ],
};

const clamp01 = (n) => Math.min(1, Math.max(0, n));

/**
 * Parse #rgb, #rrggbb, #rrggbbaa, rgb() or rgba() into { r, g, b, a } with
 * channels 0-255 and alpha 0-1. Returns null for anything else.
 */
export function parseColor(value) {
  if (!value) return null;
  const v = String(value).trim().toLowerCase();
  if (v === "transparent") return { r: 0, g: 0, b: 0, a: 0 };
  if (v === "white") return { r: 255, g: 255, b: 255, a: 1 };
  if (v === "black") return { r: 0, g: 0, b: 0, a: 1 };
  let m = v.match(/^#([0-9a-f]{3,8})$/);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) {
      h = h
        .split("")
        .map((c) => c + c)
        .join("");
    }
    if (h.length !== 6 && h.length !== 8) return null;
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
      a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1,
    };
  }
  m = v.match(/^rgba?\(([^)]+)\)$/);
  if (m) {
    const parts = m[1]
      .split(/[\s,/]+/)
      .filter(Boolean)
      .map(Number);
    if (parts.length < 3 || parts.some((n) => Number.isNaN(n))) return null;
    return {
      r: parts[0],
      g: parts[1],
      b: parts[2],
      a: parts.length > 3 ? parts[3] : 1,
    };
  }
  return null;
}

export function toHex({ r, g, b }) {
  const h = (n) =>
    Math.round(Math.min(255, Math.max(0, n)))
      .toString(16)
      .padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

/** Composite a color that may be translucent over an opaque background. */
export function composite(fg, bg) {
  const a = fg.a === undefined ? 1 : fg.a;
  return {
    r: fg.r * a + bg.r * (1 - a),
    g: fg.g * a + bg.g * (1 - a),
    b: fg.b * a + bg.b * (1 - a),
    a: 1,
  };
}

const toLinear = (c) => {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};
const fromLinear = (l) => {
  const s = l <= 0.0031308 ? l * 12.92 : 1.055 * Math.pow(l, 1 / 2.4) - 0.055;
  return clamp01(s) * 255;
};

/** WCAG 2 relative luminance of an opaque color. */
export function luminance(c) {
  return (
    0.2126 * toLinear(c.r) + 0.7152 * toLinear(c.g) + 0.0722 * toLinear(c.b)
  );
}

/** WCAG 2 contrast ratio between two opaque colors (1 to 21). */
export function contrastRatio(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** How a color is seen under the given mode (see MODES). */
export function simulate(c, mode) {
  if (!mode || mode === "none") return { ...c, a: 1 };
  if (mode === "achromatopsia") {
    const g = fromLinear(luminance(c));
    return { r: g, g, b: g, a: 1 };
  }
  const m = MATRICES[mode];
  if (!m) throw new Error(`unknown vision mode: ${mode}`);
  const lin = [toLinear(c.r), toLinear(c.g), toLinear(c.b)];
  const out = m.map((row) =>
    fromLinear(row[0] * lin[0] + row[1] * lin[1] + row[2] * lin[2]),
  );
  return { r: out[0], g: out[1], b: out[2], a: 1 };
}

function toLab(c) {
  const r = toLinear(c.r);
  const g = toLinear(c.g);
  const b = toLinear(c.b);
  // sRGB D65 to XYZ, normalized by the D65 white point
  const x = (0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.95047;
  const y = 0.2126729 * r + 0.7151522 * g + 0.072175 * b;
  const z = (0.0193339 * r + 0.119192 * g + 0.9503041 * b) / 1.08883;
  const f = (t) =>
    t > 216 / 24389 ? Math.cbrt(t) : ((24389 / 27) * t + 16) / 116;
  const fx = f(x);
  const fy = f(y);
  const fz = f(z);
  return { L: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}

/** CIEDE2000 color difference between two opaque colors. */
export function deltaE2000(c1, c2) {
  const p = toLab(c1);
  const q = toLab(c2);
  const rad = Math.PI / 180;
  const C1 = Math.hypot(p.a, p.b);
  const C2 = Math.hypot(q.a, q.b);
  const Cbar = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Cbar ** 7 / (Cbar ** 7 + 25 ** 7)));
  const a1 = (1 + G) * p.a;
  const a2 = (1 + G) * q.a;
  const C1p = Math.hypot(a1, p.b);
  const C2p = Math.hypot(a2, q.b);
  const hue = (bb, aa) => {
    if (bb === 0 && aa === 0) return 0;
    const h = Math.atan2(bb, aa) / rad;
    return h >= 0 ? h : h + 360;
  };
  const h1 = hue(p.b, a1);
  const h2 = hue(q.b, a2);
  const dL = q.L - p.L;
  const dC = C2p - C1p;
  let dh = 0;
  if (C1p * C2p !== 0) {
    dh = h2 - h1;
    if (dh > 180) dh -= 360;
    else if (dh < -180) dh += 360;
  }
  const dH = 2 * Math.sqrt(C1p * C2p) * Math.sin((dh * rad) / 2);
  const Lbar = (p.L + q.L) / 2;
  const Cbarp = (C1p + C2p) / 2;
  let hbar = h1 + h2;
  if (C1p * C2p !== 0) {
    if (Math.abs(h1 - h2) > 180) hbar += h1 + h2 < 360 ? 360 : -360;
    hbar /= 2;
  }
  const T =
    1 -
    0.17 * Math.cos((hbar - 30) * rad) +
    0.24 * Math.cos(2 * hbar * rad) +
    0.32 * Math.cos((3 * hbar + 6) * rad) -
    0.2 * Math.cos((4 * hbar - 63) * rad);
  const SL = 1 + (0.015 * (Lbar - 50) ** 2) / Math.sqrt(20 + (Lbar - 50) ** 2);
  const SC = 1 + 0.045 * Cbarp;
  const SH = 1 + 0.015 * Cbarp * T;
  const RT =
    -2 *
    Math.sqrt(Cbarp ** 7 / (Cbarp ** 7 + 25 ** 7)) *
    Math.sin(60 * Math.exp(-(((hbar - 275) / 25) ** 2)) * rad);
  return Math.sqrt(
    (dL / SL) ** 2 +
      (dC / SC) ** 2 +
      (dH / SH) ** 2 +
      RT * (dC / SC) * (dH / SH),
  );
}

/**
 * Compare two button fills sitting on one background, under every mode.
 * Translucent fills are composited over the background first.
 * Returns one row per mode with the contrast between the two fills, each
 * fill's contrast against the background, and the CIEDE2000 difference.
 */
export function comparePair(fillA, fillB, background) {
  const bg = composite(parseColor(background), { r: 0, g: 0, b: 0, a: 1 });
  const a = composite(parseColor(fillA), bg);
  const b = composite(parseColor(fillB), bg);
  return MODES.map((mode) => {
    const sa = simulate(a, mode);
    const sb = simulate(b, mode);
    const sbg = simulate(bg, mode);
    return {
      mode,
      a: toHex(sa),
      b: toHex(sb),
      background: toHex(sbg),
      pairContrast: contrastRatio(sa, sb),
      aVsBackground: contrastRatio(sa, sbg),
      bVsBackground: contrastRatio(sb, sbg),
      deltaE: deltaE2000(sa, sb),
    };
  });
}
