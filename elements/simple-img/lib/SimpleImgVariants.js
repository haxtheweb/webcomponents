/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * simple-img variants: the sized copy of a site photo that simple-img shows.
 *
 * When a page is saved, the HAXcms backends make the copy each simple-img
 * on it asks for (size, fit, quality, rotation, format, watermark) under
 * files/haxcms-managed/simple-img/, so it is a plain file on every host,
 * static ones included. simple-img works out the same name from its own
 * attributes and shows that file, falling back to the original when the
 * file is not there (a page not saved since, or a photo too big to cut).
 *
 * The names below are the contract: the backends (haxcms-nodejs
 * lib/simpleImgVariants.js, haxcms-php lib/SimpleImgVariants.php) build the
 * same names from the same attributes, and all three test the same golden
 * names. Only photos inside the site (files/...) get variants; any other
 * source, and any watermark that is not a site photo, shows the original.
 */

/** where variants live, inside the site */
export const SIMPLE_IMG_DIR = "files/haxcms-managed/simple-img/";

/** photos a variant can be made from (a gif gives its first frame) */
export const SIMPLE_IMG_SOURCE_FORMATS = Object.freeze([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
]);

/** photos a watermark can be */
export const SIMPLE_IMG_WATERMARK_FORMATS = Object.freeze([
  "jpg",
  "jpeg",
  "png",
  "webp",
]);

/** formats a variant is written as */
export const SIMPLE_IMG_FORMATS = Object.freeze(["jpg", "png", "webp", "gif"]);

/** how the photo fills width x height */
export const SIMPLE_IMG_FITS = Object.freeze([
  "cover",
  "contain",
  "fill",
  "inside",
  "outside",
]);

/** watermark corners */
export const SIMPLE_IMG_SPOTS = Object.freeze(["se", "sw", "ne", "nw"]);

/** simple-img's own defaults when width / height / quality are not set */
export const SIMPLE_IMG_DEFAULT_WIDTH = 300;
export const SIMPLE_IMG_DEFAULT_HEIGHT = 200;
export const SIMPLE_IMG_DEFAULT_QUALITY = 80;

/** the largest side a variant is made at; bigger asks show the original */
export const SIMPLE_IMG_MAX_SIDE = 4000;

/** 32-bit FNV-1a of an ASCII string, as 8 hex digits (as image framing) */
export function fnv1a(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i) & 0xff;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

/**
 * The site path of a photo: { path, stem, ext } for a plain files/ path
 * (not a managed file) with one of `formats`, else null. Folders become
 * part of the stem so two photos with one name don't meet.
 */
export function simpleImgSource(source, formats) {
  if (typeof source !== "string") return null;
  const allowed = formats || SIMPLE_IMG_SOURCE_FORMATS;
  const clean = source.split(/[?#]/)[0];
  const parts = clean.split("/");
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
  if (!allowed.includes(ext)) return null;
  const stem = parts.slice(1, -1).concat(file.slice(0, dot)).join("--");
  return { path: clean, stem, ext };
}

/** a whole number from an attribute value, or null */
function toInt(value) {
  if (value === null || typeof value === "undefined" || value === "") {
    return null;
  }
  const n = parseInt(String(value), 10);
  return Number.isFinite(n) ? n : null;
}

/** a lower-case keyword from an attribute value, or "" */
function toWord(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

/**
 * The variant a simple-img asks for, from its attribute values
 * ({ src, width, height, quality, rotate, fit, format, watermark, wmspot }),
 * or null when there is nothing the backends will make: a source outside the
 * site, a side over SIMPLE_IMG_MAX_SIDE, a rotation that is not a quarter
 * turn, or a watermark that is not a site photo.
 */
export function simpleImgVariant(attrs) {
  const a = attrs || {};
  const source = simpleImgSource(a.src);
  if (!source) return null;
  let width = toInt(a.width);
  if (width === null || width < 1) width = SIMPLE_IMG_DEFAULT_WIDTH;
  let height = toInt(a.height);
  if (height === null || height < 1) height = SIMPLE_IMG_DEFAULT_HEIGHT;
  if (width > SIMPLE_IMG_MAX_SIDE || height > SIMPLE_IMG_MAX_SIDE) return null;
  let quality = toInt(a.quality);
  if (quality === null || quality < 1 || quality > 100) {
    quality = SIMPLE_IMG_DEFAULT_QUALITY;
  }
  let rotate = toInt(a.rotate);
  rotate = rotate === null ? 0 : ((rotate % 360) + 360) % 360;
  if (rotate % 90 !== 0) return null;
  let fit = toWord(a.fit);
  if (!SIMPLE_IMG_FITS.includes(fit)) fit = "cover";
  let format = toWord(a.format);
  if (format === "jpeg") format = "jpg";
  if (!SIMPLE_IMG_FORMATS.includes(format)) format = "jpg";
  let watermark = "";
  if (typeof a.watermark === "string" && a.watermark.trim() !== "") {
    const mark = simpleImgSource(
      a.watermark.trim(),
      SIMPLE_IMG_WATERMARK_FORMATS,
    );
    if (!mark) return null;
    watermark = mark.path;
  }
  let wmspot = toWord(a.wmspot);
  if (!SIMPLE_IMG_SPOTS.includes(wmspot)) wmspot = "se";
  const key = [
    source.path,
    width,
    height,
    quality,
    rotate,
    fit,
    format,
    watermark,
    wmspot,
  ].join("|");
  return {
    source: source.path,
    location: `${SIMPLE_IMG_DIR}${source.stem}-${fnv1a(key)}.${format}`,
    width,
    height,
    quality,
    rotate,
    fit,
    format,
    watermark,
    wmspot,
  };
}

/** the site path of the variant a simple-img asks for, or null */
export function simpleImgVariantUrl(attrs) {
  const variant = simpleImgVariant(attrs);
  return variant ? variant.location : null;
}
