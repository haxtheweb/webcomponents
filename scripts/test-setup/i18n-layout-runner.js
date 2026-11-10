/**
 * Browser half of the i18n layout check (scripts/i18n-layout-check.mjs
 * generates one small test file per batch of tags that calls runBatch).
 *
 * For each tag: import its module, keep it only when it is HAX-capable (its
 * class has haxProperties, own or inherited, or the package calls
 * setHaxProperties for it), render its first demoSchema entry inside a
 * 640px content column, then measure four scenarios:
 *
 *   control       English, left-to-right
 *   pseudo        pseudo-locale (~40% longer, accented, ⟦ ⟧ markers)
 *   pseudo-rtl    pseudo-locale with dir="rtl" lang="ar" on the column
 *   rtl           English strings with dir="rtl" lang="ar" on the column
 *
 * The pseudo-locale goes through the real i18n-manager path: the document
 * lang changes, i18n-manager loads the translation manifest and then
 * <localesPath>/<namespace>.qps-ploc.json for every registered element. Only
 * window.fetch is wrapped in this test page, to answer those two requests:
 * the manifest gains the pseudo language for every namespace, and the
 * namespace file is the element's own English this.t defaults run through
 * pseudoLocalize. Nothing is written to disk.
 *
 * A scenario reports only what differs from control, so text that already
 * overflows in English (or an intended popover outside the host) is not
 * blamed on translation or direction.
 */
import { executeServerCommand } from "@web/test-runner-commands";
import {
  PSEUDO_LANG,
  pseudoLocalizeObject,
  hasPseudoMarker,
} from "../lib/pseudo-locale.mjs";

const COLUMN_WIDTH = 360;
const IMPORT_TIMEOUT = 6000;
const TOLERANCE = 1;
const INTERACTIVE =
  "button, a[href], input, select, textarea, [role=button], [role=tab], [role=link], [tabindex]:not([tabindex='-1'])";

function manager() {
  return globalThis.I18NManagerStore && globalThis.I18NManagerStore.instance;
}

// Errors an element throws while it renders (a failed fetch, a missing
// backend) belong to that element's own tests. Here they must not fail the
// whole batch, so while a batch runs they are recorded against the tag being
// rendered and stopped before mocha sees them.
let current = null;
let active = false;
const pageErrors = {};
function trap(e) {
  if (!active) {
    return;
  }
  const reason = e.error || e.reason || e.message;
  const msg = String((reason && reason.message) || reason || "error");
  if (current) {
    pageErrors[current] = pageErrors[current] || msg.slice(0, 200);
  }
  e.preventDefault();
  e.stopImmediatePropagation();
}
globalThis.addEventListener("error", trap, true);
globalThis.addEventListener("unhandledrejection", trap, true);

let fetchWrapped = false;
function wrapFetch() {
  if (fetchWrapped) {
    return;
  }
  fetchWrapped = true;
  const realFetch = globalThis.fetch.bind(globalThis);
  const json = (data, status = 200) =>
    new globalThis.Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  const suffix = `.${PSEUDO_LANG}.json`;
  globalThis.fetch = async (input, init) => {
    const url =
      typeof input === "string"
        ? input
        : input && input.url
          ? input.url
          : String(input);
    const clean = url.split("?")[0];
    if (clean.endsWith("/translation-manifest.json")) {
      let data = { manifest: {} };
      try {
        const res = await realFetch(input, init);
        if (res.ok) {
          data = await res.json();
        }
      } catch {
        // fall through with an empty manifest
      }
      const list = data.manifest || {};
      const m = manager();
      const namespaces = new Set(Object.keys(list));
      if (m) {
        m.elements.forEach((el) => namespaces.add(el.namespace));
      }
      namespaces.forEach((ns) => {
        list[ns] = (Array.isArray(list[ns]) ? list[ns] : []).concat([
          PSEUDO_LANG,
        ]);
      });
      data.manifest = list;
      return json(data);
    }
    if (clean.endsWith(suffix)) {
      const file = clean.slice(clean.lastIndexOf("/") + 1);
      const ns = decodeURIComponent(file.slice(0, -suffix.length));
      const m = manager();
      const reg = m
        ? m.elements.find(
            (el) => el.namespace === ns && el.context && el.context._t,
          )
        : null;
      return reg ? json(pseudoLocalizeObject(reg.context._t)) : json({}, 404);
    }
    return realFetch(input, init);
  };
}

const nextFrame = () =>
  new Promise((resolve) => globalThis.requestAnimationFrame(() => resolve()));
const sleep = (ms) =>
  new Promise((resolve) => globalThis.setTimeout(resolve, ms));

function withTimeout(promise, ms, label) {
  let timer;
  return Promise.race([
    promise,
    new Promise((resolve, reject) => {
      timer = globalThis.setTimeout(
        () => reject(new Error(`${label} timed out`)),
        ms,
      );
    }),
  ]).finally(() => globalThis.clearTimeout(timer));
}

/** wait for every Lit element under root (shadow roots included) */
async function settle(root) {
  for (let pass = 0; pass < 2; pass++) {
    const pending = [];
    const visit = (node) => {
      if (
        node.updateComplete &&
        typeof node.updateComplete.then === "function"
      ) {
        pending.push(node.updateComplete.catch(() => {}));
      }
      if (node.shadowRoot) {
        node.shadowRoot.querySelectorAll("*").forEach(visit);
      }
    };
    root.querySelectorAll("*").forEach(visit);
    await withTimeout(Promise.all(pending), 3000, "update").catch(() => {});
    await nextFrame();
    await nextFrame();
  }
}

/** visible pseudo-marked strings across every host (own shadow roots) */
function markerCount(hosts) {
  let count = 0;
  hosts.forEach((host) => {
    if (host.shadowRoot) {
      count += (host.shadowRoot.textContent.match(/[\u27E6\u27E7]/g) || [])
        .length;
    }
  });
  return count;
}

/**
 * Re-renders that follow a language switch are not all awaited by Lit
 * (some elements copy strings into state on a timer or after data loads),
 * so poll until the marker count stops changing (pseudo) or reaches zero
 * (English), for at most ~2s.
 */
async function waitForStrings(hosts, english) {
  let last = -1;
  for (let i = 0; i < 20; i++) {
    const now = markerCount(hosts);
    if ((english && now === 0) || (!english && now === last)) {
      return;
    }
    last = now;
    await sleep(100);
  }
}

async function setLanguage(lang) {
  globalThis.document.documentElement.setAttribute("lang", lang);
  const m = manager();
  if (m) {
    m.lang = lang;
    await withTimeout(m.updateLanguage(lang), 5000, "language").catch(() => {});
  }
}

function kebab(key) {
  return key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

async function haxSchema(Ctor) {
  let schema = null;
  try {
    schema = Ctor.haxProperties;
  } catch {
    return null;
  }
  if (typeof schema === "string") {
    try {
      const res = await globalThis.fetch(schema);
      schema = res.ok ? await res.json() : null;
    } catch {
      schema = null;
    }
  }
  return schema && typeof schema === "object" ? schema : null;
}

/** strings the author supplies through the demo; never hard-coded text */
function demoStrings(demo, out) {
  if (typeof demo === "string") {
    demo
      .replace(/<[^<>]*>/g, "\n")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((s) => out.add(s));
  } else if (Array.isArray(demo)) {
    demo.forEach((d) => demoStrings(d, out));
  } else if (demo && typeof demo === "object") {
    Object.keys(demo).forEach((k) => demoStrings(demo[k], out));
  }
  return out;
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

/**
 * Build the demo the way HAX inserts content: as markup the parser upgrades,
 * not document.createElement (which refuses elements whose constructor sets
 * attributes)
 */
function buildHost(tag, demo) {
  const name =
    demo && typeof demo.tag === "string" && /^[a-z][a-z0-9-]*$/.test(demo.tag)
      ? demo.tag
      : tag;
  const props = (demo && demo.properties) || {};
  let attrs = "";
  Object.keys(props).forEach((key) => {
    const value = props[key];
    const attr = kebab(key);
    if (
      value === null ||
      value === undefined ||
      value === false ||
      !/^[a-z][a-z0-9_.:-]*$/.test(attr)
    ) {
      return;
    }
    if (value === true) {
      attrs += ` ${attr}`;
    } else {
      const text = typeof value === "object" ? JSON.stringify(value) : value;
      attrs += ` ${attr}="${escapeAttr(text)}"`;
    }
  });
  const content = demo && typeof demo.content === "string" ? demo.content : "";
  // demo markup is the element's own demoSchema from the repo
  const tpl = globalThis.document.createElement("template");
  tpl.innerHTML = `<${name}${attrs}>${content}</${name}>`;
  return tpl.content;
}

function describeNode(node, root) {
  const parts = [];
  let cur = node;
  while (cur && cur !== root && parts.length < 4) {
    let part = cur.localName;
    if (cur.id) {
      part += `#${cur.id}`;
    } else if (cur.classList && cur.classList.length) {
      part += `.${cur.classList[0]}`;
    } else if (cur.getAttribute && cur.getAttribute("part")) {
      part += `[part=${cur.getAttribute("part").split(" ")[0]}]`;
    }
    parts.unshift(part);
    cur = cur.parentElement;
  }
  return parts.join(" > ");
}

function isRendered(el) {
  const style = globalThis.getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden") {
    return false;
  }
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0;
}

function ownText(el) {
  let text = "";
  el.childNodes.forEach((n) => {
    if (n.nodeType === 3) {
      text += n.textContent;
    }
  });
  return text.trim();
}

function textOf(el) {
  if (el.localName === "input" || el.localName === "textarea") {
    return (el.value || el.placeholder || "").trim();
  }
  return ownText(el);
}

/** measurements of one rendered host in its own shadow root */
function measure(host, column, demoText) {
  const result = {
    overflow: new Set(),
    outside: new Set(),
    controls: new Map(),
    hardcoded: new Set(),
    marked: 0,
  };
  const root = host.shadowRoot;
  if (!root) {
    return result;
  }
  let box = host.getBoundingClientRect();
  if (box.width < 1 || box.height < 1) {
    box = column.getBoundingClientRect();
  }
  const col = column.getBoundingClientRect();
  root.querySelectorAll("*").forEach((el) => {
    if (
      el.localName === "style" ||
      el.localName === "slot" ||
      el.localName === "template" ||
      !isRendered(el)
    ) {
      return;
    }
    const style = globalThis.getComputedStyle(el);
    const label = describeNode(el, root);
    const text = textOf(el);
    if (/[A-Za-zÀ-ɏ؀-ۿ]/.test(text)) {
      const scrollX = /auto|scroll/.test(style.overflowX);
      const scrollY = /auto|scroll/.test(style.overflowY);
      const wide = !scrollX && el.scrollWidth > el.clientWidth + TOLERANCE;
      const clippedY =
        !scrollY &&
        /hidden|clip/.test(style.overflowY) &&
        el.scrollHeight > el.clientHeight + TOLERANCE;
      if (el.clientWidth > 0 && (wide || clippedY)) {
        result.overflow.add(label);
      }
      if (hasPseudoMarker(text)) {
        result.marked += 1;
      }
      if (
        !hasPseudoMarker(text) &&
        /[A-Za-z]{2}/.test(text) &&
        !demoText.has(text)
      ) {
        result.hardcoded.add(text.slice(0, 60));
      }
    }
    // accessible names and hints are read out, so they need translating too
    ["aria-label", "title", "placeholder", "alt"].forEach((attr) => {
      const value = (el.getAttribute(attr) || "").trim();
      if (
        value &&
        /[A-Za-z]{2}/.test(value) &&
        !hasPseudoMarker(value) &&
        !demoText.has(value)
      ) {
        result.hardcoded.add(`[${attr}] ${value.slice(0, 60)}`);
      }
    });
    const r = el.getBoundingClientRect();
    if (
      r.left < box.left - TOLERANCE ||
      r.right > box.right + TOLERANCE ||
      r.top < box.top - TOLERANCE ||
      r.bottom > box.bottom + TOLERANCE
    ) {
      // position: fixed parts (dialogs, toasts) are meant to escape
      if (style.position !== "fixed") {
        result.outside.add(label);
      }
    }
    if (el.matches(INTERACTIVE)) {
      const inColumn =
        r.right > col.left + TOLERANCE && r.left < col.right - TOLERANCE;
      result.controls.set(label, inColumn);
    }
  });
  return result;
}

const minus = (a, b) => [...a].filter((x) => !b.has(x)).sort();

async function report(tag, data) {
  try {
    await executeServerCommand("i18n-layout-report", { tag, data });
  } catch {
    // the runner reports missing results as render-error
  }
}

function setDirection(columns, rtl) {
  columns.forEach((column) => {
    if (rtl) {
      column.setAttribute("dir", "rtl");
      column.setAttribute("lang", "ar");
    } else {
      column.removeAttribute("dir");
      column.removeAttribute("lang");
    }
  });
}

/**
 * @param {Array<{tag:string, module:string, setHax:boolean}>} entries
 */
export async function runBatch(entries) {
  active = true;
  try {
    await measureBatch(entries);
  } finally {
    // let late async errors settle before mocha listens again
    await sleep(200);
    active = false;
    current = null;
  }
}

async function measureBatch(entries) {
  wrapFetch();
  await setLanguage("en");
  const stage = globalThis.document.createElement("div");
  globalThis.document.body.appendChild(stage);
  const items = [];
  for (const entry of entries) {
    const data = {};
    current = entry.tag;
    try {
      await withTimeout(import(`/${entry.module}`), IMPORT_TIMEOUT, "import");
      const Ctor = globalThis.customElements.get(entry.tag);
      if (!Ctor) {
        throw new Error("module did not define the tag");
      }
      const schema = await haxSchema(Ctor);
      if (!schema && !entry.setHax) {
        data.notHaxCapable = true;
        await report(entry.tag, data);
        continue;
      }
      const demos =
        schema && Array.isArray(schema.demoSchema) ? schema.demoSchema : [];
      const demo = demos.find((d) => d && d.tag === entry.tag) || demos[0];
      const column = globalThis.document.createElement("div");
      column.style.cssText = `width:${COLUMN_WIDTH}px;margin:16px auto;position:relative;`;
      column.appendChild(buildHost(entry.tag, demo));
      stage.appendChild(column);
      const host = column.firstElementChild;
      if (!host) {
        throw new Error("demo did not produce an element");
      }
      const target =
        host.localName === entry.tag
          ? host
          : host.querySelector(entry.tag) || host;
      items.push({
        entry,
        data,
        column,
        host: target,
        demoText: demoStrings(demo || {}, new Set()),
      });
    } catch (e) {
      data.renderError = String((e && e.message) || e).slice(0, 200);
      await report(entry.tag, data);
    }
  }
  const columns = items.map((i) => i.column);
  const snap = () =>
    items.map((i) => {
      try {
        return measure(i.host, i.column, i.demoText);
      } catch {
        return null;
      }
    });
  await settle(stage);
  await sleep(150);
  const control = snap();
  const hosts = items.map((i) => i.host);
  await setLanguage(PSEUDO_LANG);
  await settle(stage);
  await waitForStrings(hosts, false);
  await settle(stage);
  const pseudo = snap();
  setDirection(columns, true);
  await settle(stage);
  const pseudoRtl = snap();
  // guard against a silent no-op: the column direction must reach the host
  const direction = items.map(
    (i) => globalThis.getComputedStyle(i.host).direction,
  );
  await setLanguage("en");
  await settle(stage);
  await waitForStrings(hosts, true);
  await settle(stage);
  const rtl = snap();
  setDirection(columns, false);

  for (let n = 0; n < items.length; n++) {
    const { entry, data } = items[n];
    const c = control[n];
    if (!c || !pseudo[n] || !pseudoRtl[n] || !rtl[n]) {
      data.renderError = "measurement failed";
      await report(entry.tag, data);
      continue;
    }
    data.pseudoStrings = pseudo[n].marked;
    const checks = {};
    const add = (name, list) => {
      if (list.length) {
        checks[name] = list;
      }
    };
    if (direction[n] !== "rtl") {
      add("rtl-ignored", [`computed direction: ${direction[n] || "(none)"}`]);
    }
    add("overflow-pseudo", minus(pseudo[n].overflow, c.overflow));
    add("overflow-rtl", minus(rtl[n].overflow, c.overflow));
    add("overflow-pseudo-rtl", minus(pseudoRtl[n].overflow, c.overflow));
    add("outside-pseudo", minus(pseudo[n].outside, c.outside));
    add("outside-rtl", minus(rtl[n].outside, c.outside));
    add("outside-pseudo-rtl", minus(pseudoRtl[n].outside, c.outside));
    const lost = [];
    c.controls.forEach((visible, label) => {
      if (visible && rtl[n].controls.get(label) !== true) {
        lost.push(label);
      }
    });
    add("rtl-unusable", lost.sort());
    add("hardcoded", [...pseudo[n].hardcoded].sort());
    data.checks = checks;
    await report(entry.tag, data);
  }
  stage.remove();
}
