/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
// Keep SVG drawings readable on whatever background they land on.
//
// Diagrams often hard-code their ink (near-black lines and labels) and have
// no background of their own, so they vanish when the page behind them goes
// dark. Rather than boxing every SVG, this measures each drawing's painted
// colors against the background actually behind it and only marks the ones
// that fail WCAG 1.4.11 (3:1 for graphics): data-hax-contrast="light" when
// the ink is dark, "dark" when the ink is light. Whoever shows the drawing
// styles that attribute as a backdrop (HAXCMSLitElementTheme does for page
// content, la-tex for its pictures).
//
// Authors can decide instead with data-backdrop="light" | "dark" | "none"
// on the <svg>. data-hax-contrast is runtime state: hax-store never saves
// it into page content.

export const CONTRAST_ATTRIBUTE = "data-hax-contrast";
export const OVERRIDE_ATTRIBUTE = "data-backdrop";
// WCAG 2.1 SC 1.4.11 non-text contrast
const MIN_CONTRAST = 3;
// painted shapes sampled per drawing, enough to judge a diagram
const MAX_SHAPES = 400;
const SHAPES =
  "path, line, polyline, polygon, rect, circle, ellipse, text, tspan, use";
const WHITE = [255, 255, 255];
const BACKDROP = {
  light: WHITE,
  // DDD coalyGray, the backdrop's ink when dark
  dark: [38, 38, 38],
};

/**
 * @param {string} value a computed color: rgb(), rgba() or a keyword
 * @returns {number[]|null} [r, g, b, a] or null for none / transparent
 */
export function parseColor(value) {
  if (!value || value === "none" || value === "transparent") {
    return null;
  }
  const match = /^rgba?\(([^)]+)\)$/.exec(String(value).trim());
  if (!match) {
    return null;
  }
  const parts = match[1]
    .split(/[\s,/]+/)
    .filter(Boolean)
    .map(Number);
  if (parts.length < 3 || parts.some((n) => Number.isNaN(n))) {
    return null;
  }
  return [parts[0], parts[1], parts[2], parts.length > 3 ? parts[3] : 1];
}

/** WCAG relative luminance of [r, g, b] */
export function luminance(rgb) {
  const [r, g, b] = rgb.slice(0, 3).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio of two [r, g, b] colors */
export function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** the next node up, crossing out of shadow roots */
function parentOf(node) {
  if (node.parentElement) {
    return node.parentElement;
  }
  const root = node.getRootNode ? node.getRootNode() : null;
  return root && root.host ? root.host : null;
}

/**
 * The page canvas: what shows when nothing paints a background. A page in
 * dark mode through color-scheme (no background color of its own) has a
 * dark canvas; the Canvas system color resolves to it.
 * @returns {number[]} [r, g, b]
 */
function canvasColor() {
  const doc = globalThis.document;
  const probe = doc.createElement("span");
  probe.style.backgroundColor = "Canvas";
  probe.style.display = "none";
  doc.documentElement.appendChild(probe);
  const color = parseColor(globalThis.getComputedStyle(probe).backgroundColor);
  probe.remove();
  return color ? color.slice(0, 3) : WHITE;
}

/**
 * The color showing behind an element: the first mostly opaque background
 * on the way up (through shadow roots to the page), else the page canvas.
 * @param {Element} el
 * @returns {number[]} [r, g, b]
 */
export function backgroundBehind(el) {
  let node = parentOf(el);
  while (node && node.nodeType === 1) {
    const bg = parseColor(globalThis.getComputedStyle(node).backgroundColor);
    if (bg && bg[3] >= 0.5) {
      return bg.slice(0, 3);
    }
    node = parentOf(node);
  }
  return canvasColor();
}

/** does a shape enclose any area its fill could paint? */
function hasArea(shape) {
  if (shape.localName === "line") {
    return false;
  }
  if (typeof shape.getBBox !== "function") {
    return true;
  }
  try {
    const box = shape.getBBox();
    return box.width >= 0.5 && box.height >= 0.5;
  } catch {
    // not rendered (display: none ancestors): judge it as painted
    return true;
  }
}

/** the colors a drawing paints with: visible strokes and fills */
function paintedColors(svg) {
  const colors = [];
  const shapes = svg.querySelectorAll(SHAPES);
  const count = Math.min(shapes.length, MAX_SHAPES);
  for (let i = 0; i < count; i++) {
    const style = globalThis.getComputedStyle(shapes[i]);
    if (style.display === "none" || style.visibility === "hidden") {
      continue;
    }
    if (Number(style.opacity) === 0) {
      continue;
    }
    const stroke = parseColor(style.stroke);
    if (
      stroke &&
      stroke[3] > 0 &&
      Number(style.strokeOpacity) > 0 &&
      parseFloat(style.strokeWidth) > 0
    ) {
      colors.push(stroke);
    }
    // a shape with no inside (a line, a straight path) never paints its
    // fill, which is black unless set
    const fill = hasArea(shapes[i]) ? parseColor(style.fill) : null;
    if (fill && fill[3] > 0 && Number(style.fillOpacity) > 0) {
      colors.push(fill);
    }
  }
  return colors;
}

/**
 * Does the drawing bring its own background? A painted rect as its first
 * shape that covers nearly all of it.
 */
function hasOwnBackground(svg) {
  const own = parseColor(globalThis.getComputedStyle(svg).backgroundColor);
  if (own && own[3] >= 0.5) {
    return true;
  }
  const first = svg.querySelector(SHAPES);
  if (!first || first.localName !== "rect") {
    return false;
  }
  const fill = parseColor(globalThis.getComputedStyle(first).fill);
  if (!fill || fill[3] < 0.5) {
    return false;
  }
  const box = svg.getBoundingClientRect();
  const rect = first.getBoundingClientRect();
  return (
    box.width > 0 &&
    box.height > 0 &&
    rect.width * rect.height >= box.width * box.height * 0.9
  );
}

/**
 * Which backdrop, if any, a drawing needs to be readable where it is.
 * @param {SVGSVGElement} svg
 * @returns {"light"|"dark"|null}
 */
export function contrastBackdropFor(svg) {
  const override = svg.getAttribute(OVERRIDE_ATTRIBUTE);
  if (override === "light" || override === "dark") {
    return override;
  }
  if (override === "none" || hasOwnBackground(svg)) {
    return null;
  }
  const colors = paintedColors(svg);
  if (!colors.length) {
    return null;
  }
  const behind = backgroundBehind(svg);
  const failing = colors.filter((c) => contrast(c, behind) < MIN_CONTRAST);
  // most of the drawing has to be lost before it gets a box
  if (failing.length * 2 < colors.length) {
    return null;
  }
  const ink =
    failing.reduce((sum, c) => sum + luminance(c), 0) / failing.length;
  const choice = ink < 0.18 ? "light" : "dark";
  // only when the backdrop actually reads better than what is behind it
  const gain = (bg) =>
    failing.reduce((sum, c) => sum + contrast(c, bg), 0) / failing.length;
  return gain(BACKDROP[choice]) > gain(behind) ? choice : null;
}

/**
 * Mark the drawings under root that need a backdrop and clear the ones that
 * no longer do (dark mode toggled, colors changed).
 * @param {ParentNode} root a page, element or shadow root
 * @param {object} [options]
 * @param {function(SVGSVGElement): Element} [options.target] element that
 *   gets the attribute (default: the svg itself)
 */
export function applySvgContrast(root, options = {}) {
  if (!root || !root.querySelectorAll || !globalThis.getComputedStyle) {
    return;
  }
  const target = options.target || ((svg) => svg);
  root.querySelectorAll("svg").forEach((svg) => {
    // nested drawings are judged with their outer svg; MathJax output and
    // icons follow currentColor, which the page keeps readable
    if (
      (svg.parentElement && svg.parentElement.closest("svg")) ||
      svg.closest("mjx-container")
    ) {
      return;
    }
    const el = target(svg);
    if (!el) {
      return;
    }
    // judge against the page, not a backdrop set last time
    el.removeAttribute(CONTRAST_ATTRIBUTE);
    const backdrop = contrastBackdropFor(svg);
    if (backdrop) {
      el.setAttribute(CONTRAST_ATTRIBUTE, backdrop);
    }
  });
}

/**
 * Re-check root whenever the color scheme may have changed: the page's
 * class, data-theme or style attributes (dark mode toggles) or the OS
 * preference.
 * @param {ParentNode} root
 * @param {object} [options] as applySvgContrast
 * @returns {function(): void} stops watching
 */
export function watchSvgContrast(root, options = {}) {
  let frame = null;
  const schedule = () => {
    if (frame) {
      return;
    }
    frame = globalThis.requestAnimationFrame(() => {
      frame = null;
      applySvgContrast(root, options);
    });
  };
  schedule();
  const observer = new MutationObserver(schedule);
  const doc = globalThis.document;
  [doc.documentElement, doc.body].forEach((node) => {
    if (node) {
      observer.observe(node, {
        attributes: true,
        attributeFilter: ["class", "data-theme", "style"],
      });
    }
  });
  const media = globalThis.matchMedia
    ? globalThis.matchMedia("(prefers-color-scheme: dark)")
    : null;
  if (media && media.addEventListener) {
    media.addEventListener("change", schedule);
  }
  return () => {
    observer.disconnect();
    if (media && media.removeEventListener) {
      media.removeEventListener("change", schedule);
    }
    if (frame) {
      globalThis.cancelAnimationFrame(frame);
      frame = null;
    }
  };
}
