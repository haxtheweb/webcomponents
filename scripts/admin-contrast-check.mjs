#!/usr/bin/env node
/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Admin contrast gate: the HAXcms admin (editor top bar, every site admin
 * section, the unsaved-changes card, the confirm and prompt cards) measured
 * in light and dark under DDD and under every bridged design system.
 *
 * The admin builds its colors from DDD tokens that a design system bridge
 * remaps, so a bridge recolors the admin even though no bridge styles it on
 * purpose. contrast-check.mjs measures element demos and theme chrome and
 * never opens the admin, and vision-pairs-check.mjs reads the admin tokens
 * from source under DDD only; this opens each admin surface in the
 * haxcms-elements editor demo with a design system active and measures
 * what renders.
 *
 * Two rules run on each surface, both scoped to admin chrome (the site
 * content behind a dialog is left out):
 *   text      axe-core's color-contrast rule (WCAG 1.4.3: 4.5:1, 3:1 for
 *             large text)
 *   non-text  WCAG 1.4.11 (3:1) for what identifies a control: a button,
 *             field, switch or checkbox has a fill or a border at 3:1
 *             against what is around it (a control with neither, such as a
 *             text button, is told apart by its text, which the text rule
 *             measures), and an icon-only button's icon is 3:1 against the
 *             button
 *
 * Findings that already exist are listed per design system in
 * scripts/admin-contrast.baseline.json; only new ones fail. A finding is
 * keyed by surface + mode + rule + target. The baseline only shrinks: fix a
 * finding, then run --update-baseline.
 *
 * Usage:
 *   node scripts/admin-contrast-check.mjs                     DDD and every design system
 *   node scripts/admin-contrast-check.mjs --design-system carbon,ddd
 *   node scripts/admin-contrast-check.mjs --surfaces appearance,confirm-danger
 *   node scripts/admin-contrast-check.mjs --all               list every finding with its colors
 *   node scripts/admin-contrast-check.mjs --json out.json     write the report
 *   node scripts/admin-contrast-check.mjs --update-baseline   drop what is fixed
 *   node scripts/admin-contrast-check.mjs --update-baseline --allow-additions
 *
 * CONTRAST_CHROMIUM points at a Chromium binary when Playwright's own is
 * not installed.
 */

import console from "node:console";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import {
  activateDesignSystemInPage,
  listDesignSystems,
} from "./lib/design-systems.mjs";
import {
  launchChromium,
  openPage,
  runPool,
  startServer,
  waitForSettledRender,
} from "./lib/demo-runner.mjs";
import {
  baselineSize,
  compareToBaseline,
  mergeResults,
  MODES,
  shrinkBaseline,
  sortBaseline,
} from "./lib/contrast.mjs";
import { SITE_ADMIN_SECTIONS } from "../elements/haxcms-elements/lib/core/admin/site-admin-sections.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASELINE = path.join(root, "scripts", "admin-contrast.baseline.json");
const AXE = path.join(root, "node_modules", "axe-core", "axe.min.js");
const DEMO = "/elements/haxcms-elements/demo/index.html";
const PAGE_TIMEOUT = 90000;
const DDD = "ddd";

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--")
    ? args[i + 1]
    : null;
};
const UPDATE = flag("--update-baseline");
const ALLOW_ADDITIONS = flag("--allow-additions");
const LIST_ALL = flag("--all");
const JSON_OUT = option("--json");
const CONCURRENCY = Number(option("--concurrency")) || 3;

/**
 * Every admin surface, by name. A route surface opens that site admin
 * section; the rest draw the editor or a card. Child routes are left out
 * when they render their parent section scrolled (the same surface).
 */
export function adminSurfaces() {
  const out = [{ name: "top-bar", kind: "editor" }];
  for (const section of SITE_ADMIN_SECTIONS) {
    if (section.shell === false || !section.route) {
      continue;
    }
    out.push({ name: section.route, kind: "route", route: section.route });
    for (const child of section.children || []) {
      if (child.route && child.tag && child.tag !== section.tag) {
        out.push({ name: child.route, kind: "route", route: child.route });
      }
    }
  }
  out.push({ name: "leave", kind: "leave", route: "appearance" });
  out.push({ name: "confirm", kind: "confirm", danger: false });
  out.push({ name: "confirm-danger", kind: "confirm", danger: true });
  out.push({ name: "prompt", kind: "prompt" });
  return out;
}

function pickSystems() {
  const all = listDesignSystems(root);
  const value = option("--design-system") || "all";
  const names =
    value === "all"
      ? [DDD, ...all.map((s) => s.name)]
      : value.split(",").map((s) => s.trim());
  return names.map((name) => {
    if (name === DDD) {
      return { name: DDD, title: "DDD" };
    }
    const system = all.find((s) => s.name === name);
    if (!system) {
      throw new Error(
        `no design system named ${name} (have: ${[DDD, ...all.map((s) => s.name)].join(", ")})`,
      );
    }
    return system;
  });
}

function pickSurfaces() {
  const all = adminSurfaces();
  const value = option("--surfaces");
  if (!value) {
    return all;
  }
  const names = value.split(",").map((s) => s.trim());
  const unknown = names.filter((n) => !all.some((s) => s.name === n));
  if (unknown.length) {
    throw new Error(
      `unknown surface(s): ${unknown.join(", ")} (have: ${all.map((s) => s.name).join(", ")})`,
    );
  }
  return all.filter((s) => names.includes(s.name));
}

// runs in the page: open one admin surface and wait for it to be drawn
async function openSurface(surface) {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const frames = () =>
    new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  const ui = document.querySelector("haxcms-site-editor-ui");
  // put away what the previous surface left open: a card, unsaved state,
  // and (for the editor and the cards) the admin dialog
  document.querySelectorAll("haxcms-admin-confirm").forEach((c) => c.remove());
  const shellBefore = ui && ui.__siteAdminShell;
  if (shellBefore) {
    shellBefore._leave = null;
    shellBefore._status = "clean";
    shellBefore.requestUpdate();
  }
  const modal =
    globalThis.SimpleModal && globalThis.SimpleModal.requestAvailability
      ? globalThis.SimpleModal.requestAvailability()
      : null;
  if (surface.kind !== "route" && surface.kind !== "leave" && modal) {
    if (modal.opened) {
      modal.close();
      await wait(300);
    }
  }
  if (surface.kind === "editor") {
    return !!ui;
  }
  if (surface.kind === "confirm" || surface.kind === "prompt") {
    const mod =
      await import("/elements/haxcms-elements/lib/core/admin/haxcms-admin-confirm.js");
    const options = {
      title: "Delete this page?",
      message: "This removes the page and everything under it.",
      confirmLabel: surface.danger ? "Delete" : "Continue",
      danger: !!surface.danger,
      label: "Name",
      value: "A value",
    };
    // left open: it is measured, then the page closes
    (surface.kind === "prompt" ? mod.adminPrompt : mod.adminConfirm)(options);
    await wait(300);
    await frames();
    return !!document.querySelector("haxcms-admin-confirm");
  }
  if (!ui || typeof ui._showSiteAdminShell !== "function") {
    return false;
  }
  await ui._showSiteAdminShell(surface.route);
  const shell = ui.__siteAdminShell;
  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    if (
      shell &&
      shell.isConnected &&
      shell._sectionEl &&
      shell._sectionEl.isConnected &&
      globalThis.customElements.get(shell._sectionEl.localName)
    ) {
      break;
    }
    await wait(100);
  }
  if (!shell || !shell._sectionEl) {
    return false;
  }
  if (shell._sectionEl.updateComplete) {
    await shell._sectionEl.updateComplete;
  }
  if (surface.kind === "leave") {
    shell._status = "dirty";
    shell.requestLeave(() => {});
    shell.requestUpdate();
    await shell.updateComplete;
  }
  await wait(400);
  await frames();
  return true;
}

// runs in the page: the admin roots on screen, as composed-tree elements
function adminRootsSource() {
  return `
    const roots = [];
    const ui = document.querySelector("haxcms-site-editor-ui");
    const modal = globalThis.SimpleModal && globalThis.SimpleModal.requestAvailability
      ? globalThis.SimpleModal.requestAvailability() : null;
    const confirm = document.querySelector("haxcms-admin-confirm");
    if (confirm) roots.push(confirm);
    else if (modal && modal.opened) roots.push(modal);
    else if (ui) roots.push(ui);
  `;
}

// runs in the page: axe's color-contrast rule, kept to admin chrome
async function runTextRule(rootsSource) {
  // eslint-disable-next-line no-new-func
  const roots = new Function(`${rootsSource}; return roots;`)();
  const inAdmin = (node) => {
    let el = node;
    while (el) {
      if (roots.includes(el)) {
        return true;
      }
      el =
        el.parentElement ||
        (el.getRootNode && el.getRootNode() !== document
          ? el.getRootNode().host
          : null);
    }
    return false;
  };
  const res = await globalThis.axe.run(document, {
    runOnly: { type: "rule", values: ["color-contrast"] },
    resultTypes: ["violations"],
    elementRef: true,
  });
  const out = [];
  for (const v of res.violations) {
    for (const n of v.nodes) {
      if (n.element && inAdmin(n.element)) {
        const data = (n.any && n.any[0] && n.any[0].data) || {};
        out.push({
          rule: "text",
          target: n.target,
          detail: `${data.contrastRatio}:1 ${data.fgColor} on ${data.bgColor}`,
        });
      }
    }
  }
  return out;
}

// runs in the page: WCAG 1.4.11 for the controls in admin chrome
function runNonTextRule(rootsSource) {
  // eslint-disable-next-line no-new-func
  const roots = new Function(`${rootsSource}; return roots;`)();
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const cx = canvas.getContext("2d", { willReadFrequently: true });
  // any CSS color (oklch, color-mix, named) to [r, g, b, a]
  const rgba = (c) => {
    if (!c || c === "transparent") {
      return [0, 0, 0, 0];
    }
    cx.clearRect(0, 0, 1, 1);
    cx.fillStyle = "#000";
    cx.fillStyle = c;
    cx.fillRect(0, 0, 1, 1);
    const d = cx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2], d[3] / 255];
  };
  const over = (top, under) => {
    const a = top[3];
    return [
      top[0] * a + under[0] * (1 - a),
      top[1] * a + under[1] * (1 - a),
      top[2] * a + under[2] * (1 - a),
      1,
    ];
  };
  const lum = (c) => {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  };
  const ratio = (a, b) => {
    const x = lum(a);
    const y = lum(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  };
  const up = (el) =>
    el.assignedSlot ||
    el.parentElement ||
    (el.getRootNode && el.getRootNode() !== document
      ? el.getRootNode().host
      : null);
  // the solid color behind an element: its ancestors' fills composed up to
  // the first opaque one; null over an image, which can't be measured
  const behind = (el) => {
    const layers = [];
    let e = el;
    while (e && e.nodeType === 1) {
      const cs = getComputedStyle(e);
      if (cs.backgroundImage && cs.backgroundImage !== "none") {
        return null;
      }
      const c = rgba(cs.backgroundColor);
      if (c[3] > 0) {
        layers.push(c);
        if (c[3] >= 0.999) {
          break;
        }
      }
      e = up(e);
    }
    let color = [255, 255, 255, 1];
    if (!layers.length || layers[layers.length - 1][3] < 0.999) {
      const page = rgba(getComputedStyle(document.body).backgroundColor);
      color = page[3] >= 0.999 ? page : color;
    }
    for (let i = layers.length - 1; i >= 0; i--) {
      color = over(layers[i], color);
    }
    return color;
  };
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) {
      return false;
    }
    let e = el;
    while (e && e.nodeType === 1) {
      const cs = getComputedStyle(e);
      if (
        cs.display === "none" ||
        cs.visibility === "hidden" ||
        parseFloat(cs.opacity) < 0.1
      ) {
        return false;
      }
      e = up(e);
    }
    return true;
  };
  const isControl = (el) => {
    const tag = el.localName;
    const role = el.getAttribute("role");
    if (tag === "button" || role === "button") {
      return "button";
    }
    if (tag === "select" || tag === "textarea") {
      return "field";
    }
    if (tag === "input") {
      const type = (el.getAttribute("type") || "text").toLowerCase();
      if (["hidden", "range", "color", "file", "image"].includes(type)) {
        return null;
      }
      return type === "checkbox" || type === "radio" ? "check" : "field";
    }
    if (role === "switch" || role === "checkbox" || role === "radio") {
      return "check";
    }
    return null;
  };
  const label = (el) => {
    const parts = [];
    let e = el;
    while (e && parts.length < 3) {
      if (e.nodeType === 1) {
        const cls =
          typeof e.className === "string" && e.className.trim()
            ? `.${e.className.trim().split(/\s+/).slice(0, 2).join(".")}`
            : "";
        const id = e.id ? `#${e.id}` : "";
        parts.unshift(`${e.localName}${id}${cls}`);
      }
      e =
        e.parentElement ||
        (e.getRootNode && e.getRootNode() !== document
          ? e.getRootNode().host
          : null);
    }
    return parts.join(" > ");
  };
  // text a sighted user sees on the control (visually hidden labels, the
  // offscreen kind, do not count): the composed tree, shadow and slotted
  const clipped = (el) => {
    let e = el;
    while (e && e.nodeType === 1) {
      const cs = getComputedStyle(e);
      const r = e.getBoundingClientRect();
      if (
        (cs.position === "absolute" || cs.position === "fixed") &&
        (r.width <= 1 ||
          r.height <= 1 ||
          cs.clip !== "auto" ||
          (cs.clipPath && cs.clipPath !== "none"))
      ) {
        return true;
      }
      e = up(e);
    }
    return false;
  };
  const hasOwnText = (el) => {
    if (
      el.localName === "input" &&
      ["button", "submit", "reset"].includes(
        (el.getAttribute("type") || "").toLowerCase(),
      )
    ) {
      return true;
    }
    const stack = [el];
    while (stack.length) {
      const n = stack.pop();
      if (n.nodeType === 3) {
        if (
          n.textContent.trim() &&
          n.parentElement &&
          visible(n.parentElement)
        ) {
          const range = document.createRange();
          range.selectNodeContents(n);
          const r = range.getBoundingClientRect();
          if (r.width > 2 && r.height > 2 && !clipped(n.parentElement)) {
            return true;
          }
        }
        continue;
      }
      if (n.nodeType !== 1 && n.nodeType !== 11) {
        continue;
      }
      if (n.localName === "slot") {
        n.assignedNodes({ flatten: true }).forEach((c) => stack.push(c));
        continue;
      }
      if (n.shadowRoot) {
        stack.push(n.shadowRoot);
      }
      n.childNodes.forEach((c) => stack.push(c));
    }
    return false;
  };
  const out = [];
  const seen = new Set();
  const walk = function* (node) {
    for (const el of node.querySelectorAll("*")) {
      yield el;
      if (el.shadowRoot) {
        yield* walk(el.shadowRoot);
      }
    }
  };
  for (const r of roots) {
    const scan = r.shadowRoot
      ? [r, ...walk(r.shadowRoot), ...walk(r)]
      : [r, ...walk(r)];
    for (const el of scan) {
      if (seen.has(el)) {
        continue;
      }
      seen.add(el);
      const kind = isControl(el);
      if (!kind || !visible(el) || el.disabled) {
        continue;
      }
      const cs = getComputedStyle(el);
      // a native checkbox or radio the browser draws is out of scope (WCAG
      // 1.4.11 leaves unmodified user agent controls to the browser), and
      // its look is not in computed style to measure
      if (
        kind === "check" &&
        el.localName === "input" &&
        cs.appearance !== "none"
      ) {
        continue;
      }
      const around = behind(up(el));
      if (!around) {
        continue;
      }
      const fill = over(rgba(cs.backgroundColor), around);
      const fillRatio = ratio(fill, around);
      const widths = ["Top", "Right", "Bottom", "Left"].map((s) =>
        parseFloat(cs[`border${s}Width`]),
      );
      const borderSides = ["Top", "Right", "Bottom", "Left"].filter(
        (s, i) =>
          widths[i] >= 1 &&
          cs[`border${s}Style`] !== "none" &&
          cs[`border${s}Style`] !== "hidden",
      );
      // a field may show only its bottom border; any drawn side counts
      const borderRatio = borderSides.length
        ? Math.max(
            ...borderSides.map((s) =>
              ratio(over(rgba(cs[`border${s}Color`]), fill), around),
            ),
          )
        : 0;
      const outlineRatio =
        parseFloat(cs.outlineWidth) >= 1 && cs.outlineStyle !== "none"
          ? ratio(over(rgba(cs.outlineColor), around), around)
          : 0;
      let boundary = Math.max(fillRatio, borderRatio, outlineRatio);
      // a bare input or select inside a bordered wrapper (a labelled tool
      // field, a simple-fields field) shows its edge through the wrapper
      if (kind !== "button" && boundary < 2.95) {
        let wrap = up(el);
        for (let i = 0; wrap && wrap.nodeType === 1 && i < 8; i++) {
          const w = getComputedStyle(wrap);
          const outside = behind(up(wrap));
          if (outside) {
            const wFill = over(rgba(w.backgroundColor), outside);
            const wBorder =
              parseFloat(w.borderTopWidth) >= 1 && w.borderTopStyle !== "none"
                ? ratio(over(rgba(w.borderTopColor), wFill), outside)
                : 0;
            const wShadow = /inset 0px 0px 0px 1px/.test(w.boxShadow)
              ? ratio(
                  over(rgba(w.boxShadow.split(" inset")[0]), wFill),
                  outside,
                )
              : 0;
            const found = Math.max(ratio(wFill, outside), wBorder, wShadow);
            if (wBorder > 0 || wShadow > 0 || found >= 1.05) {
              boundary = Math.max(boundary, found);
              break;
            }
          }
          wrap = up(wrap);
        }
      }
      const icon =
        el.querySelector("simple-icon-lite, simple-icon, svg") ||
        (el.shadowRoot &&
          el.shadowRoot.querySelector("simple-icon-lite, simple-icon, svg"));
      const iconOnly = kind === "button" && !hasOwnText(el) && icon;
      if (iconOnly) {
        const iconColor = rgba(getComputedStyle(icon).color);
        const iconRatio = ratio(over(iconColor, fill), fill);
        if (iconRatio < 2.95) {
          out.push({
            rule: "non-text",
            target: [label(el)],
            detail: `icon ${iconRatio.toFixed(2)}:1`,
          });
        }
        continue;
      }
      if (kind === "button") {
        // a button with visible text is identified by that text, which the
        // text rule measures; its fill or border is decoration (1.4.11)
        continue;
      }
      if (boundary < 2.95) {
        out.push({
          rule: "non-text",
          target: [label(el)],
          detail: `${kind} boundary ${boundary.toFixed(2)}:1`,
        });
      }
    }
  }
  return out;
}

function keyOf(finding) {
  const parts = [];
  const flat = (t) =>
    Array.isArray(t) ? t.forEach(flat) : parts.push(String(t));
  flat(finding.target);
  return `${finding.rule}: ${parts
    .map((s) =>
      s
        .replace(/:nth-(child|of-type|last-child|last-of-type)\([^)]*\)/g, "")
        .replace(/\d+/g, "N")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .join(" >> ")}`;
}

async function auditSession(
  browser,
  origin,
  axeSource,
  system,
  surfaces,
  mode,
) {
  const context = await browser.newContext({
    colorScheme: mode,
    reducedMotion: "reduce",
    viewport: { width: 1400, height: 900 },
  });
  const out = {};
  try {
    const page = await openPage(context, origin, DEMO, PAGE_TIMEOUT, {
      settled: true,
    });
    if (system.name !== DDD) {
      const active = await page.evaluate(activateDesignSystemInPage, {
        src: system.src,
        activate: system.activate,
        name: system.name,
      });
      if (active !== system.name) {
        throw new Error(`design system ${system.name} did not activate`);
      }
    }
    await page.addScriptTag({ content: axeSource });
    const rootsSource = adminRootsSource();
    for (const surface of surfaces) {
      try {
        if (!(await page.evaluate(openSurface, surface))) {
          throw new Error(`${surface.name} did not open`);
        }
        await waitForSettledRender(page);
        const findings = [
          ...(await page.evaluate(runTextRule, rootsSource)),
          ...(await page.evaluate(runNonTextRule, rootsSource)),
        ];
        const counts = {};
        const details = {};
        for (const f of findings) {
          const key = keyOf(f);
          counts[key] = (counts[key] || 0) + 1;
          details[key] = f.detail;
        }
        out[surface.name] = { counts, details };
      } catch (e) {
        out[surface.name] = {
          error: String((e && e.message) || e).split("\n")[0],
        };
      }
    }
  } finally {
    await context.close();
  }
  return out;
}

async function runAudits(browser, origin, axeSource, systems, surfaces) {
  // results: { system: { surface: { mode: { key: count } } } }
  const results = {};
  const details = {};
  const errors = {};
  const jobs = [];
  for (const system of systems) {
    results[system.name] = {};
    for (const mode of MODES) {
      jobs.push({ system, mode });
    }
  }
  await runPool(
    jobs,
    CONCURRENCY,
    async ({ system, mode }) => {
      let session;
      try {
        session = await auditSession(
          browser,
          origin,
          axeSource,
          system,
          surfaces,
          mode,
        );
      } catch (e) {
        errors[`${system.name} ${mode}`] = String((e && e.message) || e).split(
          "\n",
        )[0];
        return;
      }
      for (const name of Object.keys(session)) {
        const r = session[name];
        if (r.error) {
          errors[`${system.name} ${name} ${mode}`] = r.error;
          continue;
        }
        results[system.name][name] = results[system.name][name] || {};
        results[system.name][name][mode] = r.counts;
        for (const k of Object.keys(r.details)) {
          details[`${system.name} ${name} ${mode} ${k}`] = r.details[k];
        }
      }
    },
    "admin-contrast",
  );
  return { results, details, errors };
}

function readBaseline() {
  try {
    return JSON.parse(fs.readFileSync(BASELINE, "utf8"));
  } catch {
    return {};
  }
}

async function main() {
  if (!fs.existsSync(AXE)) {
    throw new Error("axe-core is not installed (yarn install)");
  }
  const axeSource = fs.readFileSync(AXE, "utf8");
  const systems = pickSystems();
  const surfaces = pickSurfaces();
  console.log(
    `admin-contrast: ${surfaces.length} admin surface(s) x ${systems.length} design system(s) (${systems.map((s) => s.name).join(", ")}) x light and dark`,
  );
  const { server, origin } = await startServer(
    root,
    Number(process.env.ADMIN_CONTRAST_PORT) || 8771,
  );
  const browser = await launchChromium(process.env.CONTRAST_CHROMIUM);
  const baseline = readBaseline();
  let code = 0;
  try {
    const first = await runAudits(
      browser,
      origin,
      axeSource,
      systems,
      surfaces,
    );
    let { results } = first;
    const { details, errors } = first;
    if (UPDATE) {
      // a second run, so an entry only leaves the baseline when neither
      // run saw it
      const second = await runAudits(
        browser,
        origin,
        axeSource,
        systems,
        surfaces,
      );
      const next = { ...baseline };
      for (const name of Object.keys(results)) {
        const merged = mergeResults(
          results[name],
          second.results[name] || {},
          Math.max,
        );
        next[name] = shrinkBaseline(baseline[name] || {}, merged, {
          allowAdditions: ALLOW_ADDITIONS,
        });
      }
      const sorted = {};
      for (const name of Object.keys(next).sort()) {
        sorted[name] = sortBaseline(next[name]);
      }
      fs.writeFileSync(BASELINE, `${JSON.stringify(sorted, null, 2)}\n`);
      const size = (b) =>
        Object.values(b).reduce((n, m) => n + baselineSize(m), 0);
      console.log(
        `admin-contrast: baseline ${size(baseline)} -> ${size(sorted)} finding(s)${ALLOW_ADDITIONS ? " (--allow-additions)" : " (only removes)"}`,
      );
      return 0;
    }
    const out = [];
    let freshTotal = 0;
    for (const system of systems) {
      const name = system.name;
      let { fresh, known, fixed } = compareToBaseline(
        results[name],
        baseline[name] || {},
      );
      if (fresh.length) {
        // a finding only counts when a second run shows it too
        const again = surfaces.filter((s) =>
          fresh.some((f) => f.element === s.name),
        );
        const second = await runAudits(
          browser,
          origin,
          axeSource,
          [system],
          again,
        );
        results[name] = mergeResults(
          results[name],
          second.results[name] || {},
          Math.min,
        );
        ({ fresh, known, fixed } = compareToBaseline(
          results[name],
          baseline[name] || {},
        ));
      }
      freshTotal += fresh.length;
      const show = (list) =>
        list.forEach((f) =>
          out.push(
            `  ${f.element} [${f.mode}] ${f.key}${details[`${name} ${f.element} ${f.mode} ${f.key}`] ? ` (${details[`${name} ${f.element} ${f.mode} ${f.key}`]})` : ""}`,
          ),
        );
      if (fresh.length) {
        out.push(`\nNEW under ${system.title} (${fresh.length}):`);
        show(fresh);
      }
      if (LIST_ALL && known.length) {
        out.push(`\nBaselined under ${system.title} (${known.length}):`);
        show(known);
      }
      if (fixed.length) {
        out.push(
          `\nFixed under ${system.title} since the baseline (run --update-baseline --design-system ${name} and commit the smaller baseline): ${fixed.length}`,
        );
      }
    }
    const errorKeys = Object.keys(errors);
    if (errorKeys.length) {
      out.push(`\nAdvisory: ${errorKeys.length} run(s) did not finish:`);
      errorKeys.forEach((k) => out.push(`  ${k}: ${errors[k]}`));
    }
    out.push(
      `\nadmin-contrast: ${surfaces.length} surface(s) x ${systems.length} design system(s), ${freshTotal} new finding(s).`,
    );
    console.log(out.join("\n"));
    if (JSON_OUT) {
      fs.writeFileSync(
        JSON_OUT,
        JSON.stringify({ results, details, errors }, null, 1),
      );
    }
    if (process.env.GITHUB_STEP_SUMMARY) {
      try {
        fs.appendFileSync(
          process.env.GITHUB_STEP_SUMMARY,
          `## Admin contrast under each design system\n\n\`\`\`\n${out.join("\n").trim()}\n\`\`\`\n`,
        );
      } catch {
        // the summary is a convenience
      }
    }
    code = freshTotal ? 1 : 0;
  } finally {
    await browser.close();
    await server.stop();
  }
  return code;
}

main().then(
  (code) => process.exit(code),
  (e) => {
    console.error(`admin-contrast: ${(e && e.stack) || e}`);
    process.exit(1);
  },
);
