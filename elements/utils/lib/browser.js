/**
 * Browser detection utilities.
 *
 * isWebKit covers Safari on macOS AND every browser on iOS/iPadOS
 * (Chrome, Firefox, Edge on iOS all use the WebKit engine under the hood).
 * This is the check you almost always want when working around WebKit-specific
 * quirks such as selection being cleared on mousedown.
 *
 * isSafari is a narrower check that only matches actual Safari instances
 * (desktop + mobile). Use this when the issue is Safari-specific rather than
 * WebKit-wide.
 */

// Cache the results so the regex only runs once.
let _isWebKit;
let _isSafari;

/**
 * Returns true when the current browser uses the WebKit engine.
 * Covers Safari (macOS/iOS) and every iOS browser (Chrome, Firefox, Edge, etc.)
 * since Apple requires them to use WebKit on iOS/iPadOS.
 *
 * Detection strategy:
 *  1. Check for the WebKit-only CSS property `webkitLineBreak` (layout engine sniff).
 *  2. Fall back to UA string for edge-cases (older WebViews, SSR guards, etc.).
 *
 * @returns {boolean}
 */
export function isWebKit() {
  if (_isWebKit !== undefined) return _isWebKit;
  if (typeof globalThis.document === "undefined") {
    _isWebKit = false;
    return _isWebKit;
  }
  // Feature detect first — this is reliable and survives UA spoofing.
  // webkitLineBreak is a non-standard CSS property exclusive to WebKit.
  var docStyle = globalThis.document.documentElement
    ? globalThis.document.documentElement.style
    : null;
  if (docStyle && "webkitLineBreak" in docStyle) {
    _isWebKit = true;
    return _isWebKit;
  }
  // Fallback: UA sniff — iPad with "desktop" mode can masquerade as Mac.
  var ua = (globalThis.navigator && globalThis.navigator.userAgent) || "";
  _isWebKit =
    /AppleWebKit/i.test(ua) &&
    !/Chrome\/|Chromium\/|Edg\/|OPR\/|Brave\//i.test(ua);
  return _isWebKit;
}

/**
 * Returns true only when the browser is Safari itself (desktop or mobile).
 * Does NOT match Chrome/Firefox/Edge on iOS even though they use WebKit.
 *
 * @returns {boolean}
 */
export function isSafari() {
  if (_isSafari !== undefined) return _isSafari;
  var ua = (globalThis.navigator && globalThis.navigator.userAgent) || "";
  // Safari UA contains "Safari/" but NOT "Chrome/", "CriOS/", "FxiOS/", "Edg/", etc.
  _isSafari =
    /Safari\//i.test(ua) &&
    !/Chrome\/|Chromium\/|CriOS\/|FxiOS\/|Edg\/|OPR\/|Brave\//i.test(ua);
  return _isSafari;
}
