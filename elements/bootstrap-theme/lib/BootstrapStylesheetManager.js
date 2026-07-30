/**
 * Copyright 2025 The HAX team
 * @license MIT, see License.md for full text.
 *
 * Shared Bootstrap CSS stylesheet manager for the bootstrap-theme family.
 *
 * bootstrap-breadcrumb, bootstrap-search, bootstrap-footer, and bootstrap-theme
 * each live in their own shadow root, so a single <link> in the document head
 * cannot style their shadow DOM. Previously each injected its own <link>,
 * causing the Bootstrap stylesheet to be fetched/parsed repeatedly.
 *
 * This manager fetches the Bootstrap CSS text once, builds a single
 * constructable CSSStyleSheet, and adopts it into every consumer's shadow
 * root via adoptedStyleSheets (one sheet, parsed once, shared across roots).
 * Where constructable stylesheets are unsupported it falls back to a single
 * <link> per shadow root.
 */
const __sheets = new Map(); // path -> CSSStyleSheet | null
const __promises = new Map(); // path -> Promise<CSSStyleSheet | null>
const __cssText = new Map(); // path -> string

function supportsConstructable() {
  return (
    typeof CSSStyleSheet !== "undefined" &&
    typeof CSSStyleSheet.prototype.replaceSync === "function"
  );
}

async function buildSheet(path) {
  try {
    if (!__cssText.has(path)) {
      const res = await fetch(path);
      if (!res.ok) {
        return null;
      }
      __cssText.set(path, await res.text());
    }
    if (supportsConstructable()) {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(__cssText.get(path));
      return sheet;
    }
    return null;
  } catch (e) {
    return null;
  }
}

function injectFallbackLink(root, path) {
  if (root.querySelector('link[data-bootstrap-css="fallback"]')) {
    return;
  }
  const link = globalThis.document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("href", path);
  link.setAttribute("data-bootstrap-css", "fallback");
  root.prepend(link);
}

/**
 * Adopt the shared Bootstrap stylesheet into a host element's shadow root.
 * Call from firstUpdated(). Safe to call multiple times across components;
 * the sheet is built once per path and reused.
 */
export function adoptBootstrapStylesheet(host, path) {
  if (!host || !host.shadowRoot || !path) {
    return;
  }
  const root = host.shadowRoot;

  // Sheet already built for this path
  if (__sheets.has(path)) {
    const sheet = __sheets.get(path);
    if (sheet) {
      const existing = root.adoptedStyleSheets || [];
      if (!existing.includes(sheet)) {
        root.adoptedStyleSheets = [...existing, sheet];
      }
    } else {
      injectFallbackLink(root, path);
    }
    return;
  }

  // No constructable stylesheet support -> fallback <link> per shadow root
  if (!supportsConstructable() || !("adoptedStyleSheets" in root)) {
    __sheets.set(path, null);
    injectFallbackLink(root, path);
    return;
  }

  // Kick off the shared fetch + build (once per path), adopt when ready
  if (!__promises.has(path)) {
    __promises.set(path, buildSheet(path));
  }
  __promises.get(path).then((sheet) => {
    __sheets.set(path, sheet);
    if (sheet && host.shadowRoot) {
      const existing = host.shadowRoot.adoptedStyleSheets || [];
      if (!existing.includes(sheet)) {
        host.shadowRoot.adoptedStyleSheets = [...existing, sheet];
      }
    }
  });
}
