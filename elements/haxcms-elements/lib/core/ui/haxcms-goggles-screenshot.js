/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Screenshot of what is on screen right now, drawn from the live DOM
 * (shadow roots included) with modern-screenshot (MIT). haxcms-goggles
 * imports this only when someone flags a piece, so nobody else pays for it.
 */
import { domToCanvas } from "modern-screenshot";

/**
 * Draws the viewport as the visitor sees it.
 * - Only what is on screen or above it is cloned: everything below the fold
 *   is skipped (that is most of the cost), everything above is kept so the
 *   layout does not shift.
 * - The clone has no scroll position, so its root is moved up by scrollY.
 * - Sticky parts on screen are pinned where they sit now.
 * @param {Object} options
 * @param {Array<Element>} options.exclude elements to leave out (the goggles themselves)
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function captureViewport(options) {
  const exclude = (options && options.exclude) || [];
  const doc = globalThis.document;
  const vw = globalThis.innerWidth;
  const vh = globalThis.innerHeight;
  const y = globalThis.scrollY;
  const keep = new Set();
  const pinned = [];
  const visit = (el) => {
    if (exclude.indexOf(el) !== -1) {
      return false;
    }
    const cs = globalThis.getComputedStyle(el);
    if (cs.display === "none") {
      return false;
    }
    const r = el.getBoundingClientRect();
    if (cs.position === "sticky" && r.width > 0 && r.bottom > 0 && r.top < vh) {
      el.setAttribute(
        "data-hax-shot-pin",
        [r.top, r.left, r.width].map(Math.round).join(" "),
      );
      pinned.push(el);
    }
    let any = false;
    const kids = Array.from(el.children);
    if (el.shadowRoot) {
      Array.from(el.shadowRoot.children).forEach((k) => kids.push(k));
    }
    kids.forEach((k) => {
      if (visit(k)) {
        any = true;
      }
    });
    if (!any && cs.display !== "contents") {
      any = !(r.width === 0 && r.height === 0) && r.top < vh + 40;
    }
    if (any) {
      keep.add(el);
    }
    return any;
  };
  visit(doc.documentElement);
  const scale = Math.min(globalThis.devicePixelRatio || 1, 2);
  try {
    return await domToCanvas(doc.documentElement, {
      width: vw,
      height: vh,
      scale: scale,
      backgroundColor: globalThis.getComputedStyle(doc.body).backgroundColor,
      filter: (n) =>
        n.nodeType !== 1 ||
        keep.has(n) ||
        ["head", "style", "link"].indexOf(n.localName) !== -1,
      onCloneNode: (root) => {
        root.style.marginTop = -y + "px";
      },
      onCloneEachNode: (c) => {
        if (c.nodeType === 1 && c.hasAttribute("data-hax-shot-pin")) {
          const at = c.getAttribute("data-hax-shot-pin").split(" ");
          c.style.position = "fixed";
          c.style.top = at[0] + "px";
          c.style.left = at[1] + "px";
          c.style.width = at[2] + "px";
          c.style.margin = "0";
          c.removeAttribute("data-hax-shot-pin");
        }
      },
    });
  } finally {
    pinned.forEach((el) => el.removeAttribute("data-hax-shot-pin"));
  }
}
