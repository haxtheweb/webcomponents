// Shared a11y test harness for HAXCMSLitElementTheme-derived themes.
//
// This is test-only helper code (not used by any production code path),
// but it lives under lib/core/utils rather than test/ so that sibling
// theme packages can import it: the monorepo's postinstall symlink step
// only links each package's lib/locales/server/build/dist directories into
// node_modules/@haxtheweb/<package>, not test/, so a module placed in
// test/ is not resolvable via `@haxtheweb/haxcms-elements/test/...` from
// another package.
//
// HAXCMSLitElementTheme gates every theme behind theme-ready (visibility)
// and then fades the host in with a 0.6s opacity transition. That reveal is
// rAF-gated, and headless test sessions share one browser where inactive
// pages can starve requestAnimationFrame entirely (deferring the fade
// indefinitely), while active pages race the audit through the fade:
// axe-core's color-contrast check blends text color with the element
// opacity, so an audit mid-fade reports bogus near-white foreground colors
// (e.g. #fdfdfd on #ffffff) as false color-contrast violations. Auditing
// before theme-ready is just as wrong: content is still visibility:hidden
// so axe skips it and the audit passes vacuously.
//
// Prior to this shared module, individual theme test suites independently
// reinvented (or omitted) a fix for this race. This module consolidates
// those approaches so every theme suite can opt in with one import.

/**
 * Deterministically reveal a theme instance by disabling the fade
 * transition and flipping themeReady directly, bypassing the rAF gate
 * entirely. Fast and reliable, but does not exercise the real reveal
 * timing (the natural rAF-gated reveal is covered by
 * HAXCMSLitElementTheme's own test suite).
 *
 * @param {HTMLElement} element a HAXCMSLitElementTheme instance
 */
export async function forceThemeReveal(element) {
  element.style.setProperty("transition", "none");
  element.themeReady = true;
  await element.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Collapse the fade to a single frame and poll the computed opacity until
 * it settles to 1 (with a timeout escape), instead of bypassing the real
 * reveal gate. Slower than forceThemeReveal but exercises the actual
 * themeReady transition path.
 *
 * @param {HTMLElement} element a HAXCMSLitElementTheme instance
 * @param {number} timeoutMs safety-net escape if opacity never settles
 */
export async function settleThemeFade(element, timeoutMs = 2000) {
  element.style.transitionDuration = "0.01s";
  await new Promise((resolve) => {
    const start = globalThis.performance.now();
    const check = () => {
      const settled =
        globalThis.getComputedStyle(element).opacity === "1" ||
        globalThis.performance.now() - start > timeoutMs;
      if (settled) {
        resolve();
      } else {
        globalThis.requestAnimationFrame(check);
      }
    };
    globalThis.requestAnimationFrame(check);
  });
}

/**
 * Lock document.documentElement's color-scheme to "light" so light-dark()
 * CSS resolves deterministically regardless of the host OS/browser's
 * prefers-color-scheme. Without this, headless Chromium may resolve
 * light-dark() to near-white text on white, producing a flaky
 * color-contrast violation.
 *
 * @returns {Function} restore function; call in an after()/afterEach() hook
 */
export function lockLightColorScheme() {
  const saved = globalThis.document.documentElement.style.colorScheme;
  globalThis.document.documentElement.style.colorScheme = "light";
  return function restoreColorScheme() {
    if (saved === "") {
      globalThis.document.documentElement.style.removeProperty("color-scheme");
    } else {
      globalThis.document.documentElement.style.colorScheme = saved;
    }
  };
}

/**
 * Lock the haxcms-site-store's darkMode to false, so themes that mirror
 * store.darkMode (e.g. via HAXCMSThemeParts) render their light variant
 * deterministically during a11y audits.
 *
 * @param {object} store the haxcms-site-store singleton
 * @returns {Function} restore function; call in an after()/afterEach() hook
 */
export function lockLightDarkMode(store) {
  const saved = store.darkMode;
  store.darkMode = false;
  return function restoreDarkMode() {
    store.darkMode = saved;
  };
}

/**
 * Convenience wrapper combining lockLightColorScheme + lockLightDarkMode,
 * matching the repeated save/restore pattern seen across multiple theme
 * test suites.
 *
 * @param {object} store the haxcms-site-store singleton
 * @returns {Function} restore function; call in an after()/afterEach() hook
 */
export function lockLightThemeEnvironment(store) {
  const restoreColorScheme = lockLightColorScheme();
  const restoreDarkMode = lockLightDarkMode(store);
  return function restoreThemeEnvironment() {
    restoreDarkMode();
    restoreColorScheme();
  };
}
