/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
// One MathJax 4 for every HAX math element on a page (lrn-math, la-tex).
//
// MathJax is not fetched from a third-party CDN: it is the `mathjax` and
// `@mathjax/mathjax-newcm-font` packages lrn-math depends on (Apache-2.0),
// served next to our own elements. Upgrading MathJax is a version bump in
// lrn-math/package.json; ubiquity copies the files into the build
// (gulp vendor-copy-mathjax).
//
// Output is SVG with a per-equation font cache, so each equation carries
// its own glyphs: it needs no web font (no flash of unstyled math while one
// loads) and renders inside shadow roots, which document-level stylesheets
// and font faces do not reach. The only CSS MathJax needs is copied into
// each shadow root that shows math (adoptMathJaxStyles).
//
// Security: the script URL is derived from this module's own location and
// can not be set from markup.

let loading = null;

/**
 * Base URL of the folder that holds the installed npm packages. The build
 * and a site installed from npm put @haxtheweb/lrn-math next to mathjax
 * (node_modules/@haxtheweb/lrn-math/lib/ -> node_modules/); in this
 * monorepo the packages are hoisted to the repository's node_modules.
 * @returns {string}
 */
export function mathJaxPackagesBase() {
  const here = import.meta.url;
  if (here.includes("/node_modules/@haxtheweb/")) {
    return new URL("../../../", here).href;
  }
  return new URL("../../../node_modules/", here).href;
}

/**
 * TeX input matching what MathJax 2 accepted in HAX content: $...$ and
 * \(...\) inline, $$...$$ and \[...\] display, AMS math and symbols, and
 * unknown macros shown in place rather than breaking the page (MathJax 4
 * shows TeX errors in place on its own; MathJax 2 needed noErrors for it).
 * Packages beyond the defaults load on demand (\require, autoload) from the
 * same local copy.
 * @param {string} base node_modules URL
 * @returns {object}
 */
export function mathJaxConfig(base) {
  return {
    loader: {
      paths: {
        mathjax: base + "mathjax",
        fonts: base + "@mathjax",
      },
    },
    startup: {
      // only typeset what HAX elements hand over; never scan the page
      typeset: false,
    },
    tex: {
      inlineMath: [
        ["$", "$"],
        ["\\(", "\\)"],
      ],
      displayMath: [
        ["$$", "$$"],
        ["\\[", "\\]"],
      ],
      processEscapes: true,
      processEnvironments: true,
      packages: { "[+]": ["noundefined"] },
    },
    svg: {
      fontCache: "local",
    },
  };
}

/**
 * Load MathJax once per page. Resolves with the MathJax object once it is
 * ready to typeset; rejects if it can not load (callers leave the TeX
 * source showing).
 * @returns {Promise<object>}
 */
export function loadMathJax() {
  if (loading) {
    return loading;
  }
  const existing = globalThis.MathJax;
  if (existing && existing.startup && existing.startup.promise) {
    // MathJax 3 or 4 already on the page (ours or the site's): share it
    loading = existing.startup.promise.then(() => existing);
    return loading;
  }
  if (existing && existing.Hub) {
    // a site that loads MathJax 2 itself: two versions can not share the
    // MathJax global, so leave the math as source rather than break theirs
    loading = Promise.reject(
      new Error("MathJax 2 is already loaded on this page"),
    );
    return loading;
  }
  const base = mathJaxPackagesBase();
  loading = new Promise((resolve, reject) => {
    const config = mathJaxConfig(base);
    config.startup.ready = () => {
      globalThis.MathJax.startup.defaultReady();
      globalThis.MathJax.startup.promise.then(
        () => resolve(globalThis.MathJax),
        reject,
      );
    };
    globalThis.MathJax = config;
    const script = globalThis.document.createElement("script");
    script.src = base + "mathjax/tex-svg.js";
    script.async = true;
    script.onerror = () => {
      reject(new Error("Error loading MathJax from " + script.src));
    };
    globalThis.document.head.appendChild(script);
  });
  return loading;
}

/**
 * Copy the CSS MathJax's SVG output needs into a shadow root, once.
 * @param {ShadowRoot|Document} root
 * @param {object} MathJax the loaded MathJax
 */
export function adoptMathJaxStyles(root, MathJax) {
  if (!root || !MathJax || !MathJax.svgStylesheet) {
    return;
  }
  if (root.querySelector && root.querySelector("style[data-mathjax-svg]")) {
    return;
  }
  const sheet = MathJax.svgStylesheet();
  const style = globalThis.document.createElement("style");
  style.setAttribute("data-mathjax-svg", "");
  style.textContent = sheet.textContent;
  root.appendChild(style);
}

/**
 * Typeset TeX inside an element, which may be in a shadow root.
 * @param {Element} container holds TeX between the delimiters above
 * @returns {Promise<void>}
 */
export async function typesetIn(container) {
  const MathJax = await loadMathJax();
  adoptMathJaxStyles(container.getRootNode(), MathJax);
  await MathJax.typesetPromise([container]);
}

/**
 * Render one TeX expression to a MathJax container element.
 * @param {string} tex the TeX source, without delimiters
 * @param {boolean} display display (block) or inline math
 * @returns {Promise<Element>}
 */
export async function texToElement(tex, display) {
  const MathJax = await loadMathJax();
  MathJax.texReset();
  return MathJax.tex2svgPromise(tex, { display: !!display });
}
