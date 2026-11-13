/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { css } from "lit";

/**
 * The HAX TV kit (retro-vcr, retro-console, retro-controller) comes in the
 * Future Traveler's colors. Each colorway is a body color, a button color
 * and an ink for labels on the dark faceplate; every ink keeps 4.5:1 on the
 * faceplate and every button 3:1.
 */
export const RETRO_KIT_COLORWAYS = {
  helmet: { body: "#bc204b", accent: "#2fd3e0", ink: "#2fd3e0" },
  goggle: { body: "#2fd3e0", accent: "#ffd100", ink: "#ffd100" },
  bulb: { body: "#ffd100", accent: "#f2665e", ink: "#ffd100" },
};

/**
 * `colorway` on a kit piece sets --retro-kit-body / -accent / -ink. A page
 * can set the same custom properties to theme every piece at once.
 */
export const RetroKitStyles = css`
  :host {
    --retro-kit-body: var(--retro-kit-color-body, #bc204b);
    --retro-kit-accent: var(--retro-kit-color-accent, #2fd3e0);
    --retro-kit-ink: var(--retro-kit-color-ink, #2fd3e0);
    --retro-kit-plate: #26262b;
    --retro-kit-plate-ink: #e4e5e7;
    /* printed hardware: the same in light and dark */
    color-scheme: only dark;
  }
  :host([colorway="goggle"]) {
    --retro-kit-body: #2fd3e0;
    --retro-kit-accent: #ffd100;
    --retro-kit-ink: #ffd100;
  }
  :host([colorway="bulb"]) {
    --retro-kit-body: #ffd100;
    --retro-kit-accent: #f2665e;
    --retro-kit-ink: #ffd100;
  }
`;

/**
 * The controller buttons a key stands for: arrows are the D-pad, A and B
 * are A and B. Returns "" for any other key, or when a modifier is held.
 * @param {KeyboardEvent} e
 * @returns {String} u, d, l, r, a, b or ""
 */
export function retroKitKey(e) {
  if (!e || e.ctrlKey || e.altKey || e.metaKey) {
    return "";
  }
  const map = {
    ArrowUp: "u",
    ArrowDown: "d",
    ArrowLeft: "l",
    ArrowRight: "r",
    a: "a",
    A: "a",
    b: "b",
    B: "b",
  };
  return map[e.key] || "";
}

/**
 * Whether a key event happened somewhere a person is typing or choosing,
 * where the kit must leave the key alone.
 * @param {Event} e
 * @returns {Boolean}
 */
export function retroKitInField(e) {
  const path = e && e.composedPath ? e.composedPath() : [];
  return path.some(
    (n) =>
      n &&
      n.matches &&
      n.matches(
        "input, textarea, select, [contenteditable], [role=listbox], [role=option], [role=radiogroup], [role=combobox]",
      ),
  );
}
