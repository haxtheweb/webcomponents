/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Shared helpers for the keyboard-flow tests (elements/<name>/test/
 * *-keyboard-flow.test.js). Those tests drive real key presses through
 * Playwright (sendKeys from @web/test-runner-commands) and check, at every
 * focus stop, the invariants a keyboard-only user depends on:
 *
 *   - the focused element shows a visible focus indicator (a computed
 *     outline or box-shadow on it, or on the shadow host / ancestor that
 *     draws the ring for it);
 *   - focus never lands on something hidden, zero-sized, inert or inside
 *     aria-hidden;
 *   - nothing in the flow uses a positive tabindex (tab order follows DOM
 *     order).
 *
 * Any element's test loads it with a relative path
 * (../../../scripts/test-setup/keyboard-flow.js). Compare focused elements
 * with expectFocusOn() rather than handing chai the elements themselves.
 */
import { sendKeys } from "@web/test-runner-commands";

/** wait a number of milliseconds */
export const settle = (ms = 30) =>
  new Promise((resolve) => globalThis.setTimeout(resolve, ms));

/**
 * Walk into open shadow roots to the element that really holds focus.
 */
export function deepActiveElement(root = globalThis.document) {
  let active = root.activeElement;
  while (active && active.shadowRoot && active.shadowRoot.activeElement) {
    active = active.shadowRoot.activeElement;
  }
  return active;
}

/**
 * Parent in the composed tree (crosses shadow boundaries and slots).
 */
export function composedParent(node) {
  if (!node) return null;
  if (node.assignedSlot) return node.assignedSlot;
  if (node.parentElement) return node.parentElement;
  const root = node.getRootNode && node.getRootNode();
  if (root && root.host) return root.host;
  return null;
}

/**
 * True when `node` is `container` or sits inside it in the composed tree.
 */
export function composedContains(container, node) {
  let current = node;
  while (current) {
    if (current === container) return true;
    current = composedParent(current);
  }
  return false;
}

/**
 * Short description of an element for failure messages.
 */
export function describeEl(el) {
  if (!el || !el.tagName) return String(el);
  let out = el.tagName.toLowerCase();
  if (el.id) out += `#${el.id}`;
  const label =
    el.getAttribute("aria-label") ||
    el.getAttribute("label") ||
    (el.textContent || "").trim().slice(0, 30);
  if (label) out += ` "${label}"`;
  const root = el.getRootNode && el.getRootNode();
  if (root && root.host) out += ` in <${root.host.tagName.toLowerCase()}>`;
  return out;
}

function hasRing(el) {
  const cs = globalThis.getComputedStyle(el);
  const outline =
    cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth || "0") > 0;
  const shadow = cs.boxShadow && cs.boxShadow !== "none";
  return outline || shadow;
}

/**
 * Visible focus indicator: the focused element, or one of its nearest (6)
 * composed ancestors (a host drawing the ring through :focus-within or
 * :host(:focus-visible)), has a computed outline or box-shadow.
 */
export function hasVisibleFocusIndicator(el, depth = 6) {
  let current = el;
  for (let i = 0; current && i <= depth; i++) {
    if (current.nodeType === 1 && hasRing(current)) return true;
    current = composedParent(current);
  }
  return false;
}

/**
 * Reason the element should not be able to hold keyboard focus, or null.
 */
export function hiddenReason(el) {
  if (!el || !el.isConnected) return "is detached";
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return "has no size";
  // visually-hidden (sr-only) patterns: parked far off the page
  const pageLeft = rect.right + globalThis.scrollX;
  const pageTop = rect.bottom + globalThis.scrollY;
  if (pageLeft <= 0 || pageTop <= 0) return "is positioned off screen";
  let current = el;
  while (current) {
    if (current.nodeType === 1) {
      if (current.hasAttribute("inert")) return "is inside [inert]";
      if (current.getAttribute("aria-hidden") === "true")
        return 'is inside aria-hidden="true"';
      if (current.hasAttribute("hidden") && current.tagName !== "SLOT")
        return "is inside [hidden]";
      const cs = globalThis.getComputedStyle(current);
      if (cs.display === "none") return "is inside display:none";
      if (current !== el && cs.overflow !== "visible") {
        const box = current.getBoundingClientRect();
        if ((box.width < 2 || box.height < 2) && cs.display !== "contents") {
          return "is clipped by a collapsed overflow:hidden ancestor";
        }
      }
    }
    current = composedParent(current);
  }
  const cs = globalThis.getComputedStyle(el);
  if (cs.visibility === "hidden") return "is visibility:hidden";
  return null;
}

/**
 * Assert the keyboard invariants for the element that currently has focus.
 * Returns the deep active element.
 *
 * `knownBugs` is a list of { match(el) => boolean, reason } for focus stops
 * that fail today on the default branch. A matching stop skips the visibility
 * and ring checks so the rest of the flow still runs; each entry must have a
 * matching `it.skip` test that asserts the fixed behavior, so removing the
 * entry is part of fixing the bug.
 */
export function expectGoodFocusStop(
  expect,
  where = "",
  { knownBugs = [] } = {},
) {
  const el = deepActiveElement();
  const tag = `${where ? where + ": " : ""}${describeEl(el)}`;
  expect(el, `${where}: something should hold focus`).to.exist;
  expect(
    el === globalThis.document.body,
    `${where}: focus fell back to <body>`,
  ).to.equal(false);
  if (knownBugs.some((bug) => bug.match(el))) {
    return el;
  }
  const reason = hiddenReason(el);
  expect(reason, `${tag} received focus but ${reason}`).to.equal(null);
  expect(
    hasVisibleFocusIndicator(el),
    `${tag} has no visible focus indicator (outline/box-shadow)`,
  ).to.equal(true);
  return el;
}

/**
 * Assert that `target` holds focus. Compares by identity and reports with
 * describeEl(), never by handing chai the elements themselves (formatting a
 * shadow-DOM element in a failure message can stall the browser).
 */
export function expectFocusOn(expect, target, message = "") {
  const active = deepActiveElement();
  expect(
    active === target,
    `${message ? message + ": " : ""}expected focus on ${describeEl(
      target,
    )}, was on ${describeEl(active)}`,
  ).to.equal(true);
}

/**
 * Every element in the composed tree under `root` that has a positive
 * tabindex (which breaks logical tab order).
 */
export function positiveTabindexIn(root) {
  const found = [];
  const walk = (node) => {
    if (!node) return;
    const kids = node.children ? Array.from(node.children) : [];
    for (const child of kids) {
      const ti = child.getAttribute("tabindex");
      if (ti !== null && parseInt(ti, 10) > 0) found.push(describeEl(child));
      if (child.shadowRoot) walk(child.shadowRoot);
      walk(child);
    }
  };
  if (root.shadowRoot) walk(root.shadowRoot);
  walk(root);
  return found;
}

/**
 * Press a key (or chord such as "Shift+Tab") and let the page settle.
 */
export async function press(key, ms = 30) {
  await sendKeys({ press: key });
  await settle(ms);
}

/**
 * Type text into whatever holds focus.
 */
export async function type(text, ms = 30) {
  await sendKeys({ type: text });
  await settle(ms);
}

/**
 * Press Tab (or Shift+Tab) `count` times, checking the focus invariants at
 * every stop. Returns the list of deep active elements visited.
 */
export async function tabThrough(
  expect,
  count,
  { shift = false, where = "" } = {},
) {
  const stops = [];
  for (let i = 0; i < count; i++) {
    await press(shift ? "Shift+Tab" : "Tab");
    stops.push(expectGoodFocusStop(expect, `${where} stop ${i + 1}`));
  }
  return stops;
}

/**
 * Poll until `check()` is truthy or the timeout passes.
 */
export async function waitFor(check, timeout = 2000, step = 25) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const value = check();
    if (value) return value;
    await settle(step);
  }
  return check();
}
