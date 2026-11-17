/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Image framing: one photo framed for each screen size (haxtheweb/issues#2976).
 *
 * A framing is where a frame of the screen size's shape sits on the photo and
 * how close it is, as fractions of the photo: { x, y, w, h }. Sizes the
 * author never touches are "automatic": the widest frame of that shape,
 * centered on the focal point. Only custom framings are saved, as the
 * element's `framing` attribute:
 *
 *   framing='{"sm":{"x":0.12,"y":0,"w":0.76,"h":1}}'
 *
 * The HAXcms backends cut each custom framing into files when the page is
 * saved, and width variants of the original for the automatic sizes, under
 * files/haxcms-managed/framing/. The names below are the contract: the
 * backends (haxcms-nodejs lib/imageFraming.js, haxcms-php
 * lib/ImageFraming.php) build the same names from the same values, and all
 * three test the same golden names.
 */

/**
 * The screen sizes: the DDD breakpoints (sm 600, md 900, xl 1440).
 * `cut` is the width each size is shown up to, so its cuts are made at 1x
 * and 2x of it; `media` picks the size in a picture source.
 */
export const FRAMING_SIZES = Object.freeze([
  Object.freeze({
    id: "sm",
    label: "Phone",
    range: "Up to 599px",
    media: "(max-width: 599px)",
    cut: 600,
  }),
  Object.freeze({
    id: "md",
    label: "Tablet",
    range: "600-899px",
    media: "(min-width: 600px) and (max-width: 899px)",
    cut: 900,
  }),
  Object.freeze({
    id: "lg",
    label: "Desktop",
    range: "900-1439px",
    media: "(min-width: 900px) and (max-width: 1439px)",
    cut: 1440,
  }),
  Object.freeze({
    id: "xl",
    label: "Wide",
    range: "1440px and up",
    media: "(min-width: 1440px)",
    cut: 1920,
  }),
]);

/** widths of the original made for the automatic sizes */
export const FRAMING_FULL_WIDTHS = Object.freeze([600, 1200, 1920, 2880]);

/** files the backends can cut: still images only */
export const FRAMING_FORMATS = Object.freeze(["jpg", "jpeg", "png", "webp"]);

/** where cuts live, inside the site */
export const FRAMING_DIR = "files/haxcms-managed/framing/";

/** the smallest frame, as a share of the widest one (300% zoom) */
export const FRAMING_MIN_SCALE = 1 / 3;

const clamp01 = (n) => Math.min(1, Math.max(0, n));
const isNum = (n) => typeof n === "number" && Number.isFinite(n);

/** round to the 3 decimals framings are saved with */
export function roundFraming(n) {
  return Math.round(n * 1000) / 1000;
}

/**
 * Parse a framing attribute into { sizeId: rect }, keeping only well-formed
 * rects inside the photo. Anything else (bad JSON, unknown sizes) is dropped.
 */
export function parseFraming(value) {
  let data = value;
  if (typeof value === "string") {
    if (value.trim() === "") return {};
    try {
      data = JSON.parse(value);
    } catch {
      return {};
    }
  }
  const out = {};
  if (!data || typeof data !== "object" || Array.isArray(data)) return out;
  FRAMING_SIZES.forEach((size) => {
    const r = data[size.id];
    if (
      r &&
      isNum(r.x) &&
      isNum(r.y) &&
      isNum(r.w) &&
      isNum(r.h) &&
      r.w > 0 &&
      r.h > 0 &&
      r.x >= 0 &&
      r.y >= 0 &&
      r.x + r.w <= 1.0005 &&
      r.y + r.h <= 1.0005
    ) {
      out[size.id] = {
        x: roundFraming(r.x),
        y: roundFraming(r.y),
        w: roundFraming(r.w),
        h: roundFraming(r.h),
      };
    }
  });
  return out;
}

/** the framing attribute for these custom rects, sizes in order; "" if none */
export function serializeFraming(custom) {
  const parsed = parseFraming(custom || {});
  const ids = FRAMING_SIZES.map((s) => s.id).filter((id) => parsed[id]);
  if (!ids.length) return "";
  const out = {};
  ids.forEach((id) => {
    out[id] = parsed[id];
  });
  return JSON.stringify(out);
}

/**
 * The widest frame of shape `aspect` (width / height) that fits a photo of
 * `photoAspect`, as fractions of the photo
 */
export function maxFrame(aspect, photoAspect) {
  return aspect > photoAspect
    ? { w: 1, h: photoAspect / aspect }
    : { w: aspect / photoAspect, h: 1 };
}

/**
 * A frame of shape `aspect`, `zoom` times closer than the widest one
 * (1 = widest), centered on (cx, cy) and kept inside the photo
 */
export function placeFrame(aspect, photoAspect, cx, cy, zoom) {
  const m = maxFrame(aspect, photoAspect);
  const z = Math.min(1 / FRAMING_MIN_SCALE, Math.max(1, zoom || 1));
  const w = m.w / z;
  const h = m.h / z;
  return {
    x: clamp01(Math.min(1 - w, cx - w / 2)),
    y: clamp01(Math.min(1 - h, cy - h / 2)),
    w,
    h,
  };
}

/**
 * The automatic frame: the widest frame of the shape, placed the way CSS
 * object-position puts a focal point of (fx, fy) (0-1) in a cover-fit box,
 * so a frame drawn from it and the photo shown with object-fit: cover and
 * object-position: fx% fy% are the same picture
 */
export function autoFrame(aspect, photoAspect, fx, fy) {
  const m = maxFrame(aspect, photoAspect);
  return {
    x: clamp01(fx) * (1 - m.w),
    y: clamp01(fy) * (1 - m.h),
    w: m.w,
    h: m.h,
  };
}

/** how close a rect is, 1 = the widest frame of its shape */
export function frameZoom(rect, aspect, photoAspect) {
  return maxFrame(aspect, photoAspect).w / rect.w;
}

/** 32-bit FNV-1a of an ASCII string, as 8 hex digits */
export function fnv1a(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i) & 0xff;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

/** the rect as the backends hash it: 3 decimals, comma separated */
export function framingKey(rect) {
  return [rect.x, rect.y, rect.w, rect.h].map((n) => n.toFixed(3)).join(",");
}

/**
 * The photo's path split for naming: { stem, ext } for a still image under
 * files/ (not already a managed file), else null. Only these get cuts.
 */
export function framingSource(source) {
  if (typeof source !== "string") return null;
  const clean = source.split(/[?#]/)[0];
  const parts = clean.split("/");
  // files/<folders>/<name>.<ext>, plain segments only
  if (parts.length < 2 || parts[0] !== "files") return null;
  if (parts[1] === "haxcms-managed") return null;
  const segment = /^[A-Za-z0-9_-][A-Za-z0-9._-]*$/;
  for (let i = 1; i < parts.length; i++) {
    if (!segment.test(parts[i]) || parts[i].indexOf("..") !== -1) return null;
  }
  const file = parts[parts.length - 1];
  const dot = file.lastIndexOf(".");
  if (dot < 1) return null;
  const ext = file.slice(dot + 1).toLowerCase();
  if (!FRAMING_FORMATS.includes(ext)) return null;
  // folders become part of the name so two photos with one name don't meet
  const stem = parts.slice(1, -1).concat(file.slice(0, dot)).join("--");
  return { stem, ext };
}

/** the width variant of the original at `width` */
export function framingFullUrl(source, width) {
  const s = framingSource(source);
  if (!s) return null;
  return `${FRAMING_DIR}${s.stem}-full-${width}w.${s.ext}`;
}

/** the cut of `rect` for screen size `sizeId` at `width` */
export function framingCutUrl(source, sizeId, rect, width) {
  const s = framingSource(source);
  if (!s) return null;
  return `${FRAMING_DIR}${s.stem}-${sizeId}-${fnv1a(framingKey(rect))}-${width}w.${s.ext}`;
}

/** the widths a size's cuts are made at */
export function framingCutWidths(sizeId) {
  const size = FRAMING_SIZES.find((s) => s.id === sizeId);
  return size ? [size.cut, size.cut * 2] : [];
}
