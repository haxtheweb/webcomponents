/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
// elements that can run script or load active content from inside an svg
const blockedSvgElements = [
  "script",
  "foreignobject",
  "iframe",
  "object",
  "embed",
  "base",
  "meta",
];
const hrefAttributes = ["href", "xlink:href"];
const blockedProtocols = ["javascript:", "vbscript:"];

/**
 * Protocol of a URL attribute value with whitespace and control characters
 * removed, so "java\nscript:" cannot slip past the check.
 * @param {string} value
 * @returns {string} lowercase protocol such as "javascript:", or ""
 */
const urlProtocol = (value) => {
  const normalized = String(value || "")
    // strip control characters on purpose (URL sanitizing)
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000- \u007F]+/g, "")
    .toLowerCase();
  const match = normalized.match(/^([a-z][a-z0-9+.-]*:)/);
  return match ? match[1] : "";
};

/**
 * Remove script-capable parts of a parsed svg tree, in place.
 * @param {Element} root
 * @returns {Element} root
 */
export const sanitizeSvgTree = (root) => {
  if (!root || !root.querySelectorAll) {
    return root;
  }
  const all = [root, ...root.querySelectorAll("*")];
  for (let i = 0; i < all.length; i++) {
    const el = all[i];
    // localName catches namespaced elements such as <html:script>
    const name = (el.localName || "").toLowerCase();
    if (el !== root && blockedSvgElements.includes(name)) {
      el.remove();
      continue;
    }
    // animations that rewrite href would get around the href check below
    if (name === "set" || name === "animate") {
      const target = (el.getAttribute("attributeName") || "")
        .trim()
        .toLowerCase();
      if (hrefAttributes.includes(target)) {
        el.remove();
        continue;
      }
    }
    for (let j = el.attributes.length - 1; j >= 0; j--) {
      const attr = el.attributes.item(j);
      const attrName = attr.name.toLowerCase();
      if (attrName.startsWith("on")) {
        el.removeAttribute(attr.name);
        continue;
      }
      if (hrefAttributes.includes(attrName)) {
        const protocol = urlProtocol(attr.value);
        // data: stays allowed for embedded <image> rasters, but never on links
        if (
          blockedProtocols.includes(protocol) ||
          (protocol === "data:" && name === "a")
        ) {
          el.removeAttribute(attr.name);
        }
      }
    }
  }
  return root;
};

/**
 * Parse fetched svg markup without running anything in it and return a
 * sanitized svg element owned by the current document.
 * security: the markup used to go straight into innerHTML, so an svg from a
 * third-party or user-upload host could run script (onload / onerror /
 * script) in the site's origin. DOMParser documents are inert: nothing in
 * them runs or loads while the tree is cleaned. The HTML parser matches the
 * old innerHTML parsing, so svg files without an xmlns keep working.
 * @param {string} markup raw svg text
 * @returns {SVGElement|null} sanitized svg, or null if there is none
 */
export const sanitizedSvgFromMarkup = (markup) => {
  if (typeof markup !== "string" || markup === "") {
    return null;
  }
  const doc = new globalThis.DOMParser().parseFromString(markup, "text/html");
  const svg = doc.querySelector("svg");
  if (!svg) {
    return null;
  }
  sanitizeSvgTree(svg);
  return globalThis.document.importNode(svg, true);
};
