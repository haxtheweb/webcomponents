/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
/**
 * Run non-critical work when the browser is idle instead of on a fixed
 * timer, so it never competes with first paint, input, or navigation.
 *
 * Uses requestIdleCallback where it exists. `timeout` caps the wait, so the
 * work still runs on a busy page. Browsers without requestIdleCallback
 * (Safari) fall back to setTimeout with `fallbackDelay`.
 *
 * @param {Function} callback work to run
 * @param {Object} [options]
 * @param {Number} [options.timeout=2000] longest wait in ms before running anyway
 * @param {Number} [options.fallbackDelay=200] setTimeout delay when idle callbacks are unavailable
 * @returns {Function} cancel, stops the callback if it has not run yet
 */
export function whenIdle(callback, options = {}) {
  const timeout = options.timeout === undefined ? 2000 : options.timeout;
  const fallbackDelay =
    options.fallbackDelay === undefined ? 200 : options.fallbackDelay;
  // eslint-disable-next-line baseline-js/use-baseline -- Safari lacks requestIdleCallback; setTimeout fallback below
  if (typeof globalThis.requestIdleCallback === "function") {
    // eslint-disable-next-line baseline-js/use-baseline -- guarded above
    const id = globalThis.requestIdleCallback(() => callback(), { timeout });
    // eslint-disable-next-line baseline-js/use-baseline -- pairs with requestIdleCallback
    return () => globalThis.cancelIdleCallback(id);
  }
  const id = setTimeout(() => callback(), fallbackDelay);
  return () => clearTimeout(id);
}
