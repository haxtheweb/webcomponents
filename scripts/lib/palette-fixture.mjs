/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
/**
 * Palette fixture for the contrast gate (scripts/contrast-check.mjs).
 *
 * Invariant: every theme x palette x color scheme x design system run
 * measures the same palette-reactive content, not only what a theme's demo
 * site happens to contain. A theme demo without a link in its pages would
 * otherwise pass every palette no matter what color its links get.
 *
 * - PALETTE_FIXTURE_HTML: content that themes and DDD color from the
 *   palette (links in prose, lists, quotes and tables, list markers, details
 *   summaries, mark, code, kbd, data-accent blocks, headings) and the
 *   palette-reactive HAX blocks in PALETTE_FIXTURE_MODULES (steps list,
 *   tabs, collapse, learning component, activity box, stop note).
 * - preparePaletteFixture({ html, modules }): runs in the page. Opens a nested page of the
 *   demo site when there is one (so breadcrumbs, parent links and
 *   pagination render) and appends the fixture to the theme's content.
 * - runNonTextContrast(): runs in the page. The icon of an icon-only control
 *   (a button, link or icon button with no visible text) needs 3:1 against
 *   what is behind it (WCAG 1.4.11), which axe's color-contrast rule does
 *   not measure; a control with visible text is identified by its text.
 *   Returns violations in axe's shape with id "non-text-contrast".
 */

export const PALETTE_FIXTURE_HTML = `
<h2>Palette fixture</h2>
<p>Prose with an <a href="#fixture-inline">inline link</a>, a
<strong><a href="#fixture-strong">strong link</a></strong>,
<mark>marked text</mark>, <code>inline code</code> and
<kbd>Ctrl</kbd> + <kbd>K</kbd>.</p>
<p data-accent="1">An accented paragraph with
<a href="#fixture-accent">a link inside it</a>.</p>
<ul>
  <li>List item with <a href="#fixture-list">a link</a>
    <ul><li>Nested item with <a href="#fixture-nested">a link</a></li></ul>
  </li>
  <li>Plain list item</li>
</ul>
<ol><li>Ordered item with <a href="#fixture-ordered">a link</a></li></ol>
<blockquote>A quotation with <a href="#fixture-quote">a cited link</a>.</blockquote>
<details><summary>Closed summary</summary><p>Hidden text</p></details>
<details open><summary>Open summary</summary>
  <p>Disclosed text with <a href="#fixture-details">a link</a>.</p></details>
<ddd-steps-list>
  <ddd-steps-list-item step="1" title="First step"><p>Do the first thing.</p></ddd-steps-list-item>
  <ddd-steps-list-item step="2" title="Second step"><p>Then the next.</p></ddd-steps-list-item>
</ddd-steps-list>
<a11y-tabs>
  <a11y-tab id="fixture-tab-1" label="Overview">Selected tab panel.</a11y-tab>
  <a11y-tab id="fixture-tab-2" label="Practice">Second tab panel.</a11y-tab>
</a11y-tabs>
<a11y-collapse expanded heading="An open collapse"><p>Open collapse body.</p></a11y-collapse>
<a11y-collapse heading="A closed collapse"><p>Closed collapse body.</p></a11y-collapse>
<learning-component type="read" url="#fixture-read"><p>A learning component.</p></learning-component>
<activity-box tag="Activity"><p>An activity box.</p></activity-box>
<stop-note status="warning" title="Warning"><span slot="message">A stop note.</span></stop-note>
<h3>Heading three</h3>
<h4>Heading four</h4>
<table>
  <caption>Fixture table</caption>
  <thead><tr><th scope="col">Name</th><th scope="col">Link</th></tr></thead>
  <tbody><tr><td>Row</td><td><a href="#fixture-table">table link</a></td></tr></tbody>
</table>
`;

/**
 * palette-reactive HAX blocks in the fixture: [tag, module URL on the local
 * server]; a module is only imported when its tag is not defined yet, so
 * nothing the theme already loaded is loaded again
 */
export const PALETTE_FIXTURE_MODULES = [
  ["ddd-steps-list", "/node_modules/@haxtheweb/d-d-d/lib/ddd-steps-list.js"],
  [
    "ddd-steps-list-item",
    "/node_modules/@haxtheweb/d-d-d/lib/ddd-steps-list-item.js",
  ],
  ["a11y-tabs", "/node_modules/@haxtheweb/a11y-tabs/a11y-tabs.js"],
  ["a11y-tab", "/node_modules/@haxtheweb/a11y-tabs/lib/a11y-tab.js"],
  ["a11y-collapse", "/node_modules/@haxtheweb/a11y-collapse/a11y-collapse.js"],
  [
    "learning-component",
    "/node_modules/@haxtheweb/course-design/lib/learning-component.js",
  ],
  [
    "activity-box",
    "/node_modules/@haxtheweb/course-design/lib/activity-box.js",
  ],
  ["stop-note", "/node_modules/@haxtheweb/stop-note/stop-note.js"],
];

// runs in the page: open a nested page when the site has one, then append
// the fixture to the theme's content; false when there is no theme element
export async function preparePaletteFixture({ html, modules }) {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const frame = () =>
    new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  let theme = document.querySelector(".haxcms-theme-element");
  if (!theme) {
    return false;
  }
  const hax = globalThis.HAXCMS;
  const store = hax && hax.instance ? hax.instance.store : null;
  const items =
    store && store.manifest && Array.isArray(store.manifest.items)
      ? store.manifest.items
      : [];
  const nested = items.find((item) => item && item.parent);
  if (nested && store.activeId !== nested.id) {
    store.activeId = nested.id;
    const deadline = Date.now() + 8000;
    // the new page's content lands in the theme's light DOM
    while (Date.now() < deadline) {
      await sleep(100);
      theme = document.querySelector(".haxcms-theme-element");
      if (
        theme &&
        [...theme.children].some(
          (c) => c.id !== "ddd-palette-fixture" && c.localName !== "page-break",
        )
      ) {
        break;
      }
    }
  }
  theme = document.querySelector(".haxcms-theme-element");
  if (!theme) {
    return false;
  }
  for (const [tag, url] of modules || []) {
    if (!globalThis.customElements.get(tag)) {
      try {
        await import(url);
      } catch {
        // a block that fails to load is left out, not a contrast finding
      }
    }
  }
  const old = theme.querySelector("#ddd-palette-fixture");
  if (old) {
    old.remove();
  }
  const template = document.createElement("template");
  // the fixture is a constant from this repository, not page or user data
  template.innerHTML = html;
  const wrap = document.createElement("div");
  wrap.id = "ddd-palette-fixture";
  wrap.appendChild(template.content);
  theme.appendChild(wrap);
  if (theme.updateComplete) {
    await theme.updateComplete;
  }
  // let the blocks in the fixture render before anything is measured
  const blocks = [...wrap.querySelectorAll("*")].filter(
    (el) => el.localName.includes("-") && el.updateComplete,
  );
  await Promise.all(blocks.map((el) => el.updateComplete));
  await frame();
  return true;
}

// runs in the page: icons that identify a control below 3:1 against the
// composited background behind them, in axe's violation shape
export function runNonTextContrast() {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const rgba = (value) => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "#000";
    ctx.fillStyle = value;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2], d[3] / 255];
  };
  const channel = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const lum = (c) =>
    0.2126 * channel(c[0]) + 0.7152 * channel(c[1]) + 0.0722 * channel(c[2]);
  const ratio = (a, b) => {
    const x = lum(a);
    const y = lum(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  };
  const blend = (top, bottom) => {
    const a = top[3];
    return [
      top[0] * a + bottom[0] * (1 - a),
      top[1] * a + bottom[1] * (1 - a),
      top[2] * a + bottom[2] * (1 - a),
      1,
    ];
  };
  // composed-tree parent: slot, then parent node, then shadow host
  const up = (node) => {
    if (node.assignedSlot) {
      return node.assignedSlot;
    }
    if (node.parentNode && node.parentNode.nodeType === 11) {
      return node.parentNode.host;
    }
    return node.parentNode;
  };
  const background = (el) => {
    const layers = [];
    let node = el;
    let image = false;
    while (node && node.nodeType === 1) {
      const cs = getComputedStyle(node);
      if (cs.backgroundImage && cs.backgroundImage !== "none") {
        image = true;
      }
      const c = rgba(cs.backgroundColor);
      if (c[3] > 0) {
        layers.push(c);
        if (c[3] >= 1) {
          break;
        }
      }
      node = up(node);
    }
    let base = [255, 255, 255, 1];
    for (let i = layers.length - 1; i >= 0; i--) {
      base = blend(layers[i], base);
    }
    return { color: base, image };
  };
  const controlOf = (el) => {
    let node = up(el);
    while (node && node.nodeType === 1) {
      const name = node.localName;
      if (
        name === "button" ||
        name === "a" ||
        name === "simple-icon-button" ||
        name === "simple-icon-button-lite" ||
        node.getAttribute("role") === "button"
      ) {
        return node;
      }
      node = up(node);
    }
    return null;
  };
  const disabled = (control) =>
    control.hasAttribute("disabled") ||
    control.getAttribute("aria-disabled") === "true";
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) {
      return false;
    }
    const cs = getComputedStyle(el);
    return (
      cs.visibility !== "hidden" &&
      cs.display !== "none" &&
      parseFloat(cs.opacity) > 0
    );
  };
  // axe-like target: one selector per shadow root, outermost first
  const describe = (el) => {
    const parts = [];
    let node = el;
    let current = [];
    while (node && node.nodeType === 1) {
      const classes = [...node.classList].slice(0, 2);
      current.unshift(
        node.localName + (classes.length ? "." + classes.join(".") : ""),
      );
      const parent = node.parentNode;
      if (parent && parent.nodeType === 11) {
        parts.unshift(current.slice(-3).join(" > "));
        current = [];
        node = parent.host;
      } else {
        node = parent;
      }
    }
    parts.unshift(current.slice(-3).join(" > "));
    return parts.filter(Boolean);
  };
  const icons = [];
  const walk = (root) => {
    for (const el of root.querySelectorAll("*")) {
      if (
        el.localName === "simple-icon" ||
        el.localName === "simple-icon-lite"
      ) {
        icons.push(el);
      }
      if (el.shadowRoot) {
        walk(el.shadowRoot);
      }
    }
  };
  walk(document);
  const nodes = [];
  for (const icon of icons) {
    const control = controlOf(icon);
    if (!control || disabled(control) || !visible(icon)) {
      continue;
    }
    // a control with visible text is identified by that text (the text rule
    // measures it); only an icon-only control depends on its icon
    if ((control.innerText || "").trim() !== "") {
      continue;
    }
    if (icon.hasAttribute("no-colorize")) {
      // an image icon that keeps its own colors
      continue;
    }
    // simple-icon floods the glyph (feFlood, flood-color:
    // var(--simple-icon-color, currentColor)), so that flood color is the
    // paint; the host's own color only when there is no flood to read
    const flood = icon.shadowRoot
      ? icon.shadowRoot.querySelector("feFlood")
      : null;
    const fg = rgba(
      flood ? getComputedStyle(flood).floodColor : getComputedStyle(icon).color,
    );
    const bg = background(icon);
    if (bg.image) {
      // a picture behind the icon: not measurable from colors alone
      continue;
    }
    const shown = fg[3] < 1 ? blend(fg, bg.color) : fg;
    if (ratio(shown, bg.color) < 3) {
      nodes.push({ target: describe(icon) });
    }
  }
  return nodes.length ? [{ id: "non-text-contrast", nodes }] : [];
}
