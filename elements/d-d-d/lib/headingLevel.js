/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */

/**
 * Heading level an element's own heading should have where it sits on the
 * page: one below the nearest heading before it, inside the same document
 * or shadow root. Elements that draw a fixed h3 use this to set aria-level,
 * so the outline reads in order without changing the tag or its look.
 * With no heading before it, content sits under the page title (an h1 in
 * the theme), so the answer is 2.
 *
 * @param {Element} host element whose heading is being placed
 * @returns {number} level from 2 to 6
 */
export function contextHeadingLevel(host) {
  if (!host || typeof host.getRootNode !== "function") {
    return 2;
  }
  const root = host.getRootNode();
  const doc = host.ownerDocument || globalThis.document;
  if (!root || !doc || typeof doc.createTreeWalker !== "function") {
    return 2;
  }
  const walker = doc.createTreeWalker(root, 1);
  walker.currentNode = host;
  let node = walker.previousNode();
  while (node) {
    const level = headingLevelOf(node);
    // a heading that contains the host (an ancestor) is not before it
    if (level && !node.contains(host)) {
      return Math.min(level + 1, 6);
    }
    node = walker.previousNode();
  }
  return 2;
}

/**
 * Level of a heading element or role=heading, 0 when it is not one
 * @param {Element} node
 * @returns {number}
 */
export function headingLevelOf(node) {
  if (!node || !node.tagName) {
    return 0;
  }
  const match = /^H([1-6])$/.exec(node.tagName);
  const aria = parseInt(node.getAttribute("aria-level"), 10);
  if (match) {
    return aria >= 1 && aria <= 6 ? aria : parseInt(match[1], 10);
  }
  if (node.getAttribute("role") === "heading") {
    return aria >= 1 && aria <= 6 ? aria : 2;
  }
  return 0;
}

/**
 * Set aria-level on a heading from where its host sits on the page.
 * Does nothing when the heading already has the right level by its tag.
 *
 * @param {Element} host element that owns the heading
 * @param {Element} heading the h2 to h6 to adjust
 * @param {number} [offset=0] levels below the context level (a heading
 *   nested one step inside the host's own heading passes 1)
 */
export function applyContextHeadingLevel(host, heading, offset = 0) {
  if (!heading || typeof heading.setAttribute !== "function") {
    return;
  }
  const level = Math.min(contextHeadingLevel(host) + offset, 6);
  const match = /^H([1-6])$/.exec(heading.tagName || "");
  if (match && parseInt(match[1], 10) === level) {
    heading.removeAttribute("aria-level");
  } else {
    heading.setAttribute("aria-level", String(level));
  }
}
