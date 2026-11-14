/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
// geometry and source checks for identify-hotspots; no DOM, so it can be
// unit tested and run on the server

/**
 * A number held between two bounds; the fallback when it is not a number
 * @param {*} value
 * @param {number} min
 * @param {number} max
 * @param {number} fallback
 * @returns {number}
 */
export function clampNumber(value, min, max, fallback) {
  const n =
    value === null || value === undefined || value === "" ? NaN : Number(value);
  if (!Number.isFinite(n)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, n));
}

/**
 * The shape of an authored answer: its box in percent of the image and
 * whether it is a hotspot to find (correct) or a named decoy
 * @param {object} answer { x, y, width, height, correct }
 * @returns {{x: number, y: number, width: number, height: number, correct: boolean}}
 */
export function normalizeRegion(answer) {
  const a = answer || {};
  return {
    x: clampNumber(a.x, 0, 100, 40),
    y: clampNumber(a.y, 0, 100, 40),
    width: clampNumber(a.width, 1, 100, 20),
    height: clampNumber(a.height, 1, 100, 20),
    correct: Boolean(a.correct),
  };
}

/**
 * Whether a point (percent of the image) is inside the ellipse inscribed in
 * a region's box
 * @param {{x: number, y: number, width: number, height: number}} region
 * @param {number} px
 * @param {number} py
 * @returns {boolean}
 */
export function regionContains(region, px, py) {
  if (!region || !(region.width > 0) || !(region.height > 0)) {
    return false;
  }
  const rx = region.width / 2;
  const ry = region.height / 2;
  const dx = (px - (region.x + rx)) / rx;
  const dy = (py - (region.y + ry)) / ry;
  return dx * dx + dy * dy <= 1;
}

const IMAGE_DATA = /^data:image\/(?:png|jpeg|gif|webp|avif|svg\+xml)[;,]/i;
const SCHEME = /^([a-z][a-z0-9+.-]*):/i;

/**
 * An image address that is safe to put in src: http(s), a relative path or
 * an inline image. Anything else (javascript:, other schemes) gives "".
 * @param {string} src
 * @returns {string}
 */
export function safeImageSrc(src) {
  const raw = String(src === null || src === undefined ? "" : src).trim();
  if (!raw) {
    return "";
  }
  // browsers drop control characters and spaces inside a scheme
  let compact = "";
  for (let i = 0; i < raw.length; i++) {
    if (raw.charCodeAt(i) > 32) {
      compact += raw[i];
    }
  }
  const scheme = SCHEME.exec(compact);
  if (!scheme) {
    return raw;
  }
  const name = scheme[1].toLowerCase();
  if (name === "http" || name === "https") {
    return raw;
  }
  if (name === "data" && IMAGE_DATA.test(compact)) {
    return raw;
  }
  return "";
}
