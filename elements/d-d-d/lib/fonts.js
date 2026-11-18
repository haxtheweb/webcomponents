/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Fonts HAX serves itself. DDD, the design system bridges and the themes
 * name their fonts by family ("IBM Plex Sans"), as Google Fonts names them;
 * these functions turn a family into its stylesheet under lib/fonts, which HAX ships with the rest of the build (the CDN, both
 * backends, a site's own copy). A family that is not vendored keeps loading
 * from Google Fonts, so nothing that names a new family breaks.
 *
 * Invariant: no request goes to Google for a family listed in
 * lib/fonts/registry.js. Side-effect free: importing this loads nothing.
 */
import { HAXFontRegistry } from "./fonts/registry.js";

const GOOGLE_HOST = "fonts.googleapis.com";

/**
 * The local stylesheet for a font family, or null when HAX doesn't ship it.
 * @param {String} family a Google Fonts family name, for example "Roboto Slab"
 * @returns {String|null} absolute URL of the family's CSS
 */
export function haxFontURL(family) {
  const name = String(family || "").trim();
  const entry = Object.prototype.hasOwnProperty.call(HAXFontRegistry, name)
    ? HAXFontRegistry[name]
    : null;
  return entry ? new URL(`./fonts/${entry.css}`, import.meta.url).href : null;
}

/**
 * The stylesheet to load for a family by name: HAX's own copy, otherwise the
 * Google Fonts css2 stylesheet for it.
 * @param {String} family a Google Fonts family name
 * @param {String} [spec] css2 axes for the Google fallback, for example
 *   "wght@400;700" (ignored when HAX ships the family: it has every weight)
 * @returns {String}
 */
export function fontStylesheetURL(family, spec) {
  const local = haxFontURL(family);
  if (local) {
    return local;
  }
  const name = String(family || "")
    .trim()
    .replace(/ /g, "+");
  return `https://${GOOGLE_HOST}/css2?family=${name}${spec ? `:${spec}` : ""}&display=swap`;
}

// "Roboto+Slab:wght@300;400" (css2) or "Roboto:300,400|Open Sans" (css v1)
// -> [["Roboto Slab", "wght@300;400"], ...]
function familiesOf(url) {
  const out = [];
  url.searchParams.getAll("family").forEach((value) => {
    const parts = url.pathname === "/css" ? value.split("|") : [value];
    parts.forEach((part) => {
      const at = part.indexOf(":");
      const name = (at === -1 ? part : part.slice(0, at)).trim();
      if (name) {
        out.push([name, at === -1 ? "" : part.slice(at + 1)]);
      }
    });
  });
  return out;
}

/**
 * The stylesheets for a design system's fonts list. Each entry is a family
 * name (the convention: "Roboto Slab") or, as older systems and custom
 * themes may still have, a stylesheet URL. A family HAX ships is served
 * locally; a Google Fonts URL becomes one local stylesheet per vendored
 * family plus a Google URL for whatever families are left; other URLs pass
 * through. No duplicates.
 * @param {Array<String>} fonts family names or stylesheet URLs
 * @returns {Array<String>}
 */
export function resolveFontURLs(fonts) {
  const list = Array.isArray(fonts) ? fonts : [];
  const out = [];
  const add = (href) => {
    if (href && !out.includes(href)) {
      out.push(href);
    }
  };
  list.forEach((font) => {
    // a family name: no scheme, so not a URL
    if (typeof font === "string" && font.indexOf("://") === -1) {
      add(fontStylesheetURL(font));
      return;
    }
    let url = null;
    try {
      url = new URL(font);
    } catch {
      url = null;
    }
    if (
      !url ||
      url.hostname !== GOOGLE_HOST ||
      (url.pathname !== "/css2" && url.pathname !== "/css")
    ) {
      add(font);
      return;
    }
    const remote = [];
    familiesOf(url).forEach(([name, spec]) => {
      const local = haxFontURL(name);
      if (local) {
        add(local);
      } else {
        remote.push([name, spec]);
      }
    });
    if (remote.length) {
      // what HAX doesn't ship still comes from Google, as asked
      const params = remote.map(
        ([name, spec]) =>
          `family=${name.replace(/ /g, "+")}${spec ? `:${spec}` : ""}`,
      );
      const display = url.searchParams.get("display");
      if (display) {
        params.push(`display=${display}`);
      }
      add(`https://${GOOGLE_HOST}/css2?${params.join("&")}`);
    }
  });
  return out;
}

/**
 * Load a font family's stylesheet into a document once (font faces must be
 * declared in the document for shadow roots to use them).
 * @param {String} family a Google Fonts family name
 * @param {Object} [options]
 * @param {Document} [options.document] defaults to the global document
 * @param {String} [options.spec] css2 axes for the Google fallback
 * @param {String} [options.priority] fetchpriority for a new link
 *   ("low" for a face that can arrive after first paint)
 * @returns {HTMLLinkElement|null} the link, new or already there
 */
export function loadFontFamily(family, options) {
  const opts = options || {};
  const doc = opts.document || globalThis.document;
  if (!doc || !doc.head || !family) {
    return null;
  }
  const href = fontStylesheetURL(family, opts.spec);
  const existing = Array.from(
    doc.head.querySelectorAll('link[rel="stylesheet"]'),
  ).find((link) => link.href === href);
  if (existing) {
    return existing;
  }
  const link = doc.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.setAttribute("data-hax-font", family);
  if (opts.priority) {
    link.setAttribute("fetchpriority", opts.priority);
  }
  doc.head.appendChild(link);
  return link;
}
