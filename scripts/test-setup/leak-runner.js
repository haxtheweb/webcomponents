/**
 * Browser half of the memory-leak check (scripts/leak-check.mjs generates one
 * small test file per batch of tags that calls runBatch).
 *
 * This module is imported before any element, so it can instrument the page
 * first:
 *
 *   addEventListener / removeEventListener on window, document, <html>,
 *   <body> and MediaQueryList (plus MediaQueryList addListener/removeListener)
 *   ResizeObserver / IntersectionObserver / MutationObserver
 *     (observe / unobserve / disconnect, held weakly)
 *   setInterval / clearInterval
 *   requestAnimationFrame (calls per frame while nothing is attached)
 *
 * Every record keeps the tag and phase it was made in and the first stack
 * frame outside this file, so a leftover points at the line that added it.
 *
 * For each HAX-capable tag (haxProperties on the class or an ancestor, or a
 * setHaxProperties(schema, "<tag>") call), its first demoSchema entry is
 * built, attached, awaited and removed WARMUP times, then CYCLES more times.
 * Whatever a single instance or a singleton creates lands in the warm-up.
 * Only what is left over from the measured cycles is reported, and only when
 * it grew with at least half of them, so a constant amount (one global
 * store, a shared audio context, a registration per tag) never counts.
 * Removed instances are held in WeakRefs and counted after forced garbage
 * collection (Chromium started with --js-flags=--expose-gc).
 */
import { executeServerCommand } from "@web/test-runner-commands";

const WARMUP = 2;
let CYCLES = 12;
const IMPORT_TIMEOUT = 6000;
const UPDATE_TIMEOUT = 1500;
const RAF_FRAMES = 6;
const SELF = "/scripts/test-setup/leak-runner.js";

const real = {
  add: globalThis.EventTarget.prototype.addEventListener,
  remove: globalThis.EventTarget.prototype.removeEventListener,
  setInterval: globalThis.setInterval.bind(globalThis),
  clearInterval: globalThis.clearInterval.bind(globalThis),
  setTimeout: globalThis.setTimeout.bind(globalThis),
  clearTimeout: globalThis.clearTimeout.bind(globalThis),
  raf: globalThis.requestAnimationFrame.bind(globalThis),
};

// what the page and the test framework had before any element loaded; the
// global-store walk only looks at what elements add
const BUILTIN_GLOBALS = new Set(Object.getOwnPropertyNames(globalThis));

// tag and phase ("warmup" | "measure" | "idle") new records are charged to
let currentTag = null;
let phase = "idle";
let active = false;
const pageErrors = {};

/** "url:line:col" of one V8 stack line ("    at fn (url:1:2)"), or "" */
function frameLocation(line) {
  let text = line.trim();
  if (text.endsWith(")") && text.lastIndexOf("(") !== -1) {
    text = text.slice(text.lastIndexOf("(") + 1, -1);
  } else if (text.startsWith("at ")) {
    text = text.slice(3);
  }
  const parts = text.split(":");
  const ok =
    parts.length >= 3 &&
    /^\d+$/.test(parts[parts.length - 1]) &&
    /^\d+$/.test(parts[parts.length - 2]) &&
    (text.startsWith("http") || text.startsWith("/"));
  return ok ? text : "";
}

/** first stack frame outside this file: "url:line:col" */
function origin() {
  const stack = String(new Error().stack || "").split("\n");
  let fallback = "";
  for (const line of stack.slice(1)) {
    const where = frameLocation(line);
    if (!where || where.includes(SELF)) {
      continue;
    }
    if (where.includes("/elements/")) {
      return where;
    }
    if (!fallback) {
      fallback = where;
    }
  }
  return fallback;
}

/* ---------- global listeners ---------- */

const listeners = [];
function targetName(target) {
  const doc = globalThis.document;
  if (target === globalThis) return "window";
  if (target === doc) return "document";
  if (doc && target === doc.documentElement) return "html";
  if (doc && target === doc.body) return "body";
  if (
    globalThis.MediaQueryList &&
    target instanceof globalThis.MediaQueryList
  ) {
    return `matchMedia(${target.media})`;
  }
  return null;
}
function captureOf(options) {
  return typeof options === "boolean"
    ? options
    : Boolean(options && options.capture);
}
function trackAdd(target, type, listener, options) {
  if (!active || !listener) {
    return;
  }
  const name = targetName(target);
  if (!name || (options && typeof options === "object" && options.once)) {
    return;
  }
  const capture = captureOf(options);
  const found = listeners.find(
    (l) =>
      l.target === target &&
      l.type === type &&
      l.listener === listener &&
      l.capture === capture,
  );
  if (found) {
    return;
  }
  const rec = {
    target,
    type: String(type),
    listener,
    capture,
    what: `${name} "${type}" listener`,
    where: origin(),
    tag: currentTag,
    phase,
  };
  listeners.push(rec);
  const signal = options && typeof options === "object" && options.signal;
  if (signal && typeof signal.addEventListener === "function") {
    if (signal.aborted) {
      untrack(target, type, listener, options);
    } else {
      real.add.call(signal, "abort", () =>
        untrack(target, type, listener, options),
      );
    }
  }
}
function untrack(target, type, listener, options) {
  const capture = captureOf(options);
  const i = listeners.findIndex(
    (l) =>
      l.target === target &&
      l.type === String(type) &&
      l.listener === listener &&
      l.capture === capture,
  );
  if (i !== -1) {
    listeners.splice(i, 1);
  }
}
globalThis.EventTarget.prototype.addEventListener = function (
  type,
  listener,
  options,
) {
  trackAdd(this, type, listener, options);
  return real.add.call(this, type, listener, options);
};
globalThis.EventTarget.prototype.removeEventListener = function (
  type,
  listener,
  options,
) {
  untrack(this, type, listener, options);
  return real.remove.call(this, type, listener, options);
};
if (globalThis.MediaQueryList) {
  const proto = globalThis.MediaQueryList.prototype;
  const realAddListener = proto.addListener;
  const realRemoveListener = proto.removeListener;
  if (realAddListener && realRemoveListener) {
    proto.addListener = function (listener) {
      trackAdd(this, "change", listener, false);
      return realAddListener.call(this, listener);
    };
    proto.removeListener = function (listener) {
      untrack(this, "change", listener, false);
      return realRemoveListener.call(this, listener);
    };
  }
}

/* ---------- observers (held weakly, so a collected observer is gone) ---------- */

const observers = [];
const observerMeta = new WeakMap();
function wrapObserver(name) {
  const Real = globalThis[name];
  if (typeof Real !== "function") {
    return;
  }
  const Tracked = class extends Real {
    constructor(callback, options) {
      super(callback, options);
      if (active) {
        const meta = {
          what: name,
          where: origin(),
          tag: currentTag,
          phase,
          observing: 0,
        };
        observerMeta.set(this, meta);
        observers.push({ ref: new WeakRef(this), meta });
      }
    }
    observe(target, options) {
      const meta = observerMeta.get(this);
      if (meta) {
        meta.observing += 1;
      }
      return super.observe(target, options);
    }
    disconnect() {
      const meta = observerMeta.get(this);
      if (meta) {
        meta.observing = 0;
      }
      return super.disconnect();
    }
  };
  if (typeof Real.prototype.unobserve === "function") {
    Tracked.prototype.unobserve = function (target) {
      const meta = observerMeta.get(this);
      if (meta) {
        meta.observing = Math.max(0, meta.observing - 1);
      }
      return Real.prototype.unobserve.call(this, target);
    };
  }
  Object.defineProperty(Tracked, "name", { value: name });
  globalThis[name] = Tracked;
}
["ResizeObserver", "IntersectionObserver", "MutationObserver"].forEach(
  wrapObserver,
);

/* ---------- timers ---------- */

const intervals = new Map();
globalThis.setInterval = function (handler, ms, ...args) {
  const id = real.setInterval(handler, ms, ...args);
  if (active) {
    intervals.set(id, {
      what: `setInterval(${Number(ms) || 0}ms)`,
      where: origin(),
      tag: currentTag,
      phase,
    });
  }
  return id;
};
globalThis.clearInterval = function (id) {
  intervals.delete(id);
  return real.clearInterval(id);
};

let rafCounting = false;
let rafCalls = [];
globalThis.requestAnimationFrame = function (callback) {
  if (rafCounting) {
    rafCalls.push(origin());
  }
  return real.raf(callback);
};

/* ---------- helpers ---------- */

// Errors an element throws while it renders (a failed fetch, a missing
// backend) belong to that element's own tests. Here they must not fail the
// whole batch, so while a batch runs they are recorded against the tag being
// cycled and stopped before mocha sees them.
function trap(e) {
  if (!active) {
    return;
  }
  const reason = e.error || e.reason || e.message;
  const msg = String((reason && reason.message) || reason || "error");
  if (currentTag) {
    pageErrors[currentTag] = pageErrors[currentTag] || msg.slice(0, 200);
  }
  e.preventDefault();
  e.stopImmediatePropagation();
}
real.add.call(globalThis, "error", trap, true);
real.add.call(globalThis, "unhandledrejection", trap, true);

const nextFrame = () => new Promise((resolve) => real.raf(() => resolve()));
const sleep = (ms) => new Promise((resolve) => real.setTimeout(resolve, ms));

function withTimeout(promise, ms, label) {
  let timer;
  return Promise.race([
    promise,
    new Promise((resolve, reject) => {
      timer = real.setTimeout(
        () => reject(new Error(`${label} timed out`)),
        ms,
      );
    }),
  ]).finally(() => real.clearTimeout(timer));
}

async function collectGarbage() {
  for (let i = 0; i < 2; i++) {
    // WeakRef targets stay alive until the current job ends
    await sleep(0);
    if (typeof globalThis.gc === "function") {
      globalThis.gc();
    } else {
      try {
        await executeServerCommand("leak-gc");
      } catch {
        // without a collector, retained counts stay at the cycle count and
        // the run reports it (see gcAvailable)
      }
    }
  }
  await sleep(0);
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
function demoMarkup(tag, demo) {
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
  return `<${name}${attrs}>${content}</${name}>`;
}

/**
 * Wait for every Lit element under root (shadow roots included). Two passes:
 * the first render often creates the nested elements (players, tabs) that
 * set up the listeners and registrations this check is about.
 */
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
    visit(root);
    root.querySelectorAll("*").forEach(visit);
    await withTimeout(Promise.all(pending), UPDATE_TIMEOUT, "update").catch(
      () => {},
    );
    await nextFrame();
  }
}

/* ---------- global stores ---------- */

const MAX_KEYS = 300;
function sizeOf(value) {
  if (Array.isArray(value)) return value.length;
  if (value instanceof Map || value instanceof Set) return value.size;
  const proto = Object.getPrototypeOf(value);
  if (proto === Object.prototype || proto === null) {
    return Object.keys(value).length;
  }
  return null;
}
/** MobX observers on an observable object (reactions, autoruns, computeds) */
function mobxObservers(value) {
  let total = null;
  for (const sym of Object.getOwnPropertySymbols(value)) {
    if (sym.description !== "mobx administration") {
      continue;
    }
    const admin = Object.getOwnPropertyDescriptor(value, sym).value;
    const values = admin && admin.values_;
    if (values && typeof values.forEach === "function") {
      total = 0;
      values.forEach((v) => {
        if (v && v.observers_ && typeof v.observers_.size === "number") {
          total += v.observers_.size;
        }
      });
    }
  }
  return total;
}
/**
 * Record the collection at parent[key] and walk into it. Sizes are keyed by
 * slot (parent object + property name), not by the collection object, so a
 * store that replaces its array (this.list = this.list.filter(...)) is still
 * compared with itself.
 */
function walk(parent, key, value, path, depth, out, seen) {
  if (
    value === null ||
    (typeof value !== "object" && typeof value !== "function")
  ) {
    return;
  }
  let size = null;
  let mobx = null;
  try {
    size = typeof value === "object" && depth > 0 ? sizeOf(value) : null;
    mobx = mobxObservers(value);
  } catch {
    return;
  }
  if (size !== null || mobx !== null) {
    if (!out.has(parent)) {
      out.set(parent, new Map());
    }
    out.get(parent).set(key, { path, size, mobx });
  }
  if (
    seen.has(value) ||
    depth >= 3 ||
    Array.isArray(value) ||
    value instanceof Map ||
    value instanceof Set
  ) {
    return;
  }
  seen.add(value);
  let keys;
  try {
    keys = Object.getOwnPropertyNames(value).slice(0, MAX_KEYS);
  } catch {
    return;
  }
  for (const name of keys) {
    let d;
    try {
      d = Object.getOwnPropertyDescriptor(value, name);
    } catch {
      continue;
    }
    // data properties only: never run a getter
    if (d && "value" in d && name !== "prototype") {
      walk(value, name, d.value, `${path}.${name}`, depth + 1, out, seen);
    }
  }
}
/**
 * Collections and MobX observables reachable from what elements added to
 * globalThis: Map<parent object, Map<property, {path, size, mobx}>>
 */
function storeSizes() {
  const out = new Map();
  const seen = new WeakSet();
  for (const name of Object.getOwnPropertyNames(globalThis)) {
    if (BUILTIN_GLOBALS.has(name)) {
      continue;
    }
    const d = Object.getOwnPropertyDescriptor(globalThis, name);
    if (d && "value" in d) {
      walk(globalThis, name, d.value, name, 0, out, seen);
    }
  }
  return out;
}
/**
 * Growth of collections in slots that existed before the measured cycles. A
 * new object hangs off a parent that existed, so the parent grows instead;
 * a lazily built constant table (library defaults) never counts.
 */
function storeGrowth(before, after) {
  const grown = [];
  after.forEach((slots, parent) => {
    const old = before.get(parent);
    if (!old) {
      return;
    }
    slots.forEach((now, key) => {
      const was = old.get(key);
      if (!was) {
        return;
      }
      if (now.size !== null && was.size !== null && now.size > was.size) {
        grown.push({ path: now.path, delta: now.size - was.size });
      }
      if (now.mobx !== null && was.mobx !== null && now.mobx > was.mobx) {
        grown.push({
          path: `${now.path} (MobX observers)`,
          delta: now.mobx - was.mobx,
        });
      }
    });
  });
  return grown;
}

/*
 * Shared leaks that every element using a common mixin has. They are
 * reported once as advisory (SHARED_LEAKS in scripts/lib/leak-check.mjs)
 * and released here before instances are counted, so `retained` still
 * catches anything else that keeps an element alive.
 */
function releaseSharedLeaks() {
  // i18n-manager keeps the registration of every I18NMixin instance
  const m = globalThis.I18NManagerStore && globalThis.I18NManagerStore.instance;
  if (m && Array.isArray(m.elements)) {
    for (let i = m.elements.length - 1; i >= 0; i--) {
      const ctx = m.elements[i] && m.elements[i].context;
      if (ctx && ctx.nodeType === 1 && !ctx.isConnected) {
        m.elements.splice(i, 1);
      }
    }
  }
}

/* ---------- measuring ---------- */

async function rafPerFrame() {
  // a callback queued by the last cycle fires in the first frames
  await nextFrame();
  await nextFrame();
  rafCalls = [];
  rafCounting = true;
  for (let i = 0; i < RAF_FRAMES; i++) {
    await nextFrame();
  }
  rafCounting = false;
  const calls = rafCalls;
  rafCalls = [];
  return calls;
}

async function quiet() {
  await sleep(50);
  await nextFrame();
  await collectGarbage();
}

/** one attach/detach cycle; returns the instance it made (or null) */
async function cycle(stage, tag, markup) {
  const tpl = globalThis.document.createElement("template");
  // demo markup is the element's own demoSchema from the repo
  tpl.innerHTML = markup;
  const host = tpl.content.firstElementChild;
  if (!host) {
    throw new Error("demo did not produce an element");
  }
  stage.appendChild(host);
  const target =
    host.localName === tag ? host : host.querySelector(tag) || host;
  await settle(host);
  host.remove();
  await Promise.resolve();
  return target;
}

function leftovers(list, tag) {
  return list
    .filter((r) => r.tag === tag && r.phase === "measure")
    .map((r) => ({ what: r.what, where: r.where }));
}

async function measureTag(stage, entry) {
  const data = {};
  const { tag } = entry;
  await withTimeout(import(`/${entry.module}`), IMPORT_TIMEOUT, "import");
  const Ctor = globalThis.customElements.get(tag);
  if (!Ctor) {
    throw new Error("module did not define the tag");
  }
  const schema = await haxSchema(Ctor);
  if (!schema && !entry.setHax) {
    data.notHaxCapable = true;
    return data;
  }
  const demos =
    schema && Array.isArray(schema.demoSchema) ? schema.demoSchema : [];
  const demo = demos.find((d) => d && d.tag === tag) || demos[0];
  const markup = demoMarkup(tag, demo);

  phase = "warmup";
  for (let i = 0; i < WARMUP; i++) {
    await cycle(stage, tag, markup);
  }
  phase = "idle";
  await quiet();
  const storesBefore = storeSizes();
  const rafBefore = await rafPerFrame();

  phase = "measure";
  const refs = [];
  for (let i = 0; i < CYCLES; i++) {
    const made = await cycle(stage, tag, markup);
    refs.push(new WeakRef(made));
  }
  phase = "idle";
  await quiet();
  await sleep(100);
  await collectGarbage();
  const storesAfter = storeSizes();
  data.stores = storeGrowth(storesBefore, storesAfter);
  storesBefore.clear();
  storesAfter.clear();
  releaseSharedLeaks();
  await collectGarbage();
  const rafAfter = await rafPerFrame();

  data.cycles = CYCLES;
  data.gc = typeof globalThis.gc === "function";
  data.listeners = leftovers(listeners, tag);
  data.observers = leftovers(
    observers
      .filter((o) => o.meta.observing > 0 && o.ref.deref())
      .map((o) => o.meta),
    tag,
  );
  data.intervals = leftovers([...intervals.values()], tag);
  // rAF: extra callbacks per frame, by origin
  const perOrigin = (calls) => {
    const m = {};
    calls.forEach((w) => (m[w] = (m[w] || 0) + 1));
    return m;
  };
  const before = perOrigin(rafBefore);
  const after = perOrigin(rafAfter);
  data.raf = Object.keys(after)
    .map((where) => ({
      where,
      perFrame: (after[where] - (before[where] || 0)) / RAF_FRAMES,
    }))
    .filter((r) => r.perFrame > 0);
  data.retained = refs.filter((r) => r.deref()).length;
  if (data.retained) {
    // work an element queued before removal (a timer, a fetch, an animation)
    // can hold it for a moment; only what outlives that counts
    await sleep(1000);
    await collectGarbage();
    data.retained = refs.filter((r) => r.deref()).length;
  }
  if (pageErrors[tag]) {
    data.pageError = pageErrors[tag];
  }
  return data;
}

async function report(tag, data) {
  try {
    await executeServerCommand("leak-report", { tag, data });
  } catch {
    // the runner reports missing results as render-error
  }
}

/**
 * @param {Array<{tag:string, module:string, setHax:boolean}>} entries
 * @param {{cycles?:number}} [options] measured cycles per tag
 */
export async function runBatch(entries, options = {}) {
  CYCLES = Math.max(4, Number(options.cycles) || 12);
  active = true;
  const stage = globalThis.document.createElement("div");
  stage.style.cssText = "width:640px;position:relative;";
  globalThis.document.body.appendChild(stage);
  try {
    for (const entry of entries) {
      currentTag = entry.tag;
      let data;
      try {
        data = await measureTag(stage, entry);
      } catch (e) {
        data = { renderError: String((e && e.message) || e).slice(0, 200) };
      }
      phase = "idle";
      await report(entry.tag, data);
      stage.replaceChildren();
    }
  } finally {
    // let late async errors settle before mocha listens again
    await sleep(200);
    stage.remove();
    active = false;
    currentTag = null;
  }
}
