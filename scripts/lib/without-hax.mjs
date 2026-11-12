/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE.md for full text.
 *
 * Shared pieces of the "works with or without HAX" gate
 * (scripts/without-hax-check.mjs).
 *
 * Rule (praw RULES.md, "Works With or Without HAX"): content made with the
 * HAX editor works when HAX is not there. An element that can go in a page
 * body works without the editor, should work without HAXcms, and its HTML
 * pasted onto a plain page with only the autoloader should still work.
 *
 * - authorableTags(root): HAX-capable tags (hax-elements-registry.json)
 *   with the module that defines them (wc-registry.json) and its folder.
 * - importFindings(root, file): hard (static import) and lazy (import())
 *   paths from a module to editor or HAXcms code.
 * - pageBare / pagePaste: page functions for the two runtime levels.
 */
import fs from "node:fs";
import path from "node:path";

// packages whose code is the editor or HAXcms; reaching one from an
// authorable element is what the gate looks for
export const AREAS = {
  editor: ["hax-body", "h-a-x", "super-daemon"],
  haxcms: ["haxcms-elements", "app-hax"],
};

// packages whose elements are built for a HAX site (site-* blocks, learner
// progress): exempt, they are allowed to need one
export const SITE_PACKAGES = ["haxcms-elements"];

// Authorable tags outside those packages that are also built for a HAX site,
// each with why. Add a tag here only when needing HAX is the point of it;
// anything else that needs HAX is a finding to fix.
// https://github.com/haxtheweb/issues/issues/3324
export const SITE_TAGS = {
  "page-break":
    "page metadata HAX itself reads to split and route content, not visual content",
  "page-anchor":
    "page metadata HAX itself reads for in-page anchors, not visual content",
  "h5p-element":
    "works in the context of the HAX system (H5P content served by a HAXcms site)",
  "lrn-h5p":
    "works in the context of the HAX system (H5P content served by a HAXcms site)",
  "page-flag":
    "reviewer flags for signed-in users in a site; future interface for backend plugin systems",
};

export const CHECKS = {
  "editor-import":
    "imports editor code (hax-body, h-a-x, super-daemon) at load: talk to HAX only through haxProperties()/haxHooks(), or import() it when editing starts",
  "haxcms-import":
    "imports HAXcms code (haxcms-elements, app-hax) at load: content in a page body must not need a HAXcms site; read site data optionally, or import() it lazily",
  throws:
    "throws while loading or rendering its demoSchema on a bare page with no editor and no HAXcms",
  blank:
    "renders nothing (no box with any size) on a bare page with no editor and no HAXcms",
  undefined: "its module loads but the tag never gets defined on a bare page",
  "loads-editor":
    "pulls editor modules into a bare page at runtime, with no editor in sight (an import() that always runs, or a lookup that loads it): only load it once editing starts",
  "loads-haxcms":
    "pulls HAXcms modules into a bare page at runtime, with no HAXcms site (an import() that always runs, or a lookup that loads it): only load it when a site is there",
  "paste-throws":
    "its demoSchema HTML throws when pasted onto a plain page with only the wc-autoload magic script",
  "paste-undefined":
    "its demoSchema HTML pasted onto a plain page with only wc-autoload never upgrades",
  "paste-blank":
    "its demoSchema HTML pasted onto a plain page with only wc-autoload renders nothing",
};

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

/** @haxtheweb/<pkg>/<file> or a relative path -> a file under elements/ */
export function resolveSpecifier(root, spec, fromFile) {
  let file;
  if (spec.startsWith(".")) {
    file = path.resolve(path.dirname(fromFile), spec);
  } else if (spec.startsWith("@haxtheweb/")) {
    const [, pkg, ...rest] = spec.split("/");
    file = path.join(root, "elements", pkg, rest.join("/"));
  } else {
    return null;
  }
  try {
    return fs.statSync(file).isFile() ? file : null;
  } catch {
    return null;
  }
}

/** which area (editor / haxcms) a file belongs to, or null */
export function areaOf(root, file) {
  const rel = path.relative(path.join(root, "elements"), file);
  const pkg = rel.split(path.sep)[0];
  for (const [area, pkgs] of Object.entries(AREAS)) {
    if (pkgs.includes(pkg)) {
      return area;
    }
  }
  return null;
}

export function folderOf(root, file) {
  return path.relative(path.join(root, "elements"), file).split(path.sep)[0];
}

/**
 * HAX-capable tags that ship a module: { tag, file, folder, site }. Native
 * HTML tags in the registry (p, div, video...) have no module and are left
 * out.
 */
export function authorableTags(root) {
  const hax = readJson(path.join(root, "hax-elements-registry.json")) || {};
  const wc = readJson(path.join(root, "wc-registry.json")) || {};
  const out = [];
  for (const tag of Object.keys(hax).sort()) {
    const spec = wc[tag];
    if (typeof spec !== "string" || !spec.startsWith("@haxtheweb/")) {
      continue;
    }
    const file = resolveSpecifier(root, spec, root);
    if (!file) {
      continue;
    }
    const folder = folderOf(root, file);
    out.push({
      tag,
      file,
      folder,
      spec,
      site: SITE_PACKAGES.includes(folder) || !!SITE_TAGS[tag],
      siteReason:
        SITE_TAGS[tag] ||
        (SITE_PACKAGES.includes(folder) ? `in ${folder}` : ""),
    });
  }
  return out;
}

const STATIC_IMPORT =
  /(?:^|[;\s}])import\s*(?:[\w$*{}\s,]*?\bfrom\s*)?["']([^"']+)["']/g;
const RE_EXPORT =
  /(?:^|[;\s}])export\s*[\w$*{}\s,]*?\bfrom\s*["']([^"']+)["']/g;
const DYNAMIC_IMPORT = /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g;

function specifiers(source) {
  // comments out first, so an import that is commented out does not count
  const code = source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
  const take = (re) => [...code.matchAll(re)].map((m) => m[1]);
  return {
    hard: [...take(STATIC_IMPORT), ...take(RE_EXPORT)],
    lazy: take(DYNAMIC_IMPORT),
  };
}

const sourceCache = new Map();
function specifiersOf(file) {
  if (!sourceCache.has(file)) {
    let found = { hard: [], lazy: [] };
    try {
      found = specifiers(fs.readFileSync(file, "utf8"));
    } catch {
      // unreadable: no edges
    }
    sourceCache.set(file, found);
  }
  return sourceCache.get(file);
}

/**
 * Walk a module's import graph inside the monorepo. Returns
 * { hard: { area: chain }, lazy: { area: chain } } where chain is the list
 * of repo-relative files from the module to the first editor or HAXcms
 * file. A path that crosses an import() anywhere counts as lazy.
 */
export function importFindings(root, start) {
  const hard = {};
  const lazy = {};
  const seen = new Set();
  const queue = [{ file: start, chain: [start], isLazy: false }];
  while (queue.length) {
    const { file, chain, isLazy } = queue.shift();
    const key = `${file}|${isLazy}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    const { hard: h, lazy: l } = specifiersOf(file);
    const edges = [...h.map((s) => [s, isLazy]), ...l.map((s) => [s, true])];
    for (const [spec, edgeLazy] of edges) {
      const next = resolveSpecifier(root, spec, file);
      if (!next) {
        continue;
      }
      const area = areaOf(root, next);
      const nextChain = [...chain, next];
      if (area) {
        const into = edgeLazy ? lazy : hard;
        if (!into[area]) {
          into[area] = nextChain.map((f) => path.relative(root, f));
        }
        continue;
      }
      queue.push({ file: next, chain: nextChain, isLazy: edgeLazy });
    }
  }
  // a lazy path to an area that is also reached eagerly adds nothing
  for (const area of Object.keys(hard)) {
    delete lazy[area];
  }
  return { hard, lazy };
}

// one stable line per error, so baselines don't churn on ports or columns
export function normalizeError(text, origin) {
  return String(text || "")
    .split("\n")[0]
    .split(origin)
    .join("")
    .replace(/:\d+:\d+/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
}

/** which area a requested URL belongs to (served from elements/ or node_modules/@haxtheweb/) */
export function areaOfUrl(url) {
  const m = String(url).match(
    /\/(?:elements|node_modules\/@haxtheweb|@haxtheweb)\/([^/?#]+)\//,
  );
  if (!m) {
    return null;
  }
  for (const [area, pkgs] of Object.entries(AREAS)) {
    if (pkgs.includes(m[1])) {
      return area;
    }
  }
  return null;
}

// What the magic script (build.js) sets up on any page: the process shim
// mobx and friends need, then wc-autoload with the registry, so nested tags
// in content load. The check serves /wc-registry.json with paths relative to
// the server root (see without-hax-check.mjs), hence basePath "/". That is not the editor or HAXcms, and both levels get
// it so elements are held to what HAX really serves.
const MAGIC_SCRIPT = `<script>
globalThis.process = globalThis.process || { env: { NODE_ENV: "production" } };
globalThis.WCAutoloadRegistryFile = "/wc-registry.json";
globalThis.WCGlobalBasePath = "/";
</script>
<script type="module" src="/elements/wc-autoload/wc-autoload.js"></script>`;

/** the bare level: the magic script, and the element imported directly */
export const BARE_HTML = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>without HAX</title>
${MAGIC_SCRIPT}
</head>
<body><main id="host"></main></body>
</html>`;

/**
 * The paste level: a plain page with only the magic script and the pasted
 * HTML. Nothing from the element is imported directly.
 */
export function pasteHtml(content) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><title>without HAX: pasted</title>
${MAGIC_SCRIPT}
</head>
<body><main id="host">${content}</main></body>
</html>`;
}

// outside requests an element makes on its own (a CDN library, an API, an
// embed). Web fonts are left out: DDD asks for them on every page.
const FONT_HOSTS = /^https?:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com)\//;
export function isServiceRequest(url) {
  return (
    /^https?:\/\//.test(url) && !LOCAL_HOST.test(url) && !FONT_HOSTS.test(url)
  );
}
const LOCAL_HOST = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//;

/**
 * Inserted markup with nothing to show: a bare tag with no attributes and no
 * content, so rendering nothing is not a failure.
 */
export function isEmptyMarkup(html) {
  return String(html || "")
    .split("\n")
    .every((h) => /^<([a-z][a-z0-9-]*)><\/\1>$/.test(h.trim()));
}

/**
 * Runs in the page: import only the element's module, render each
 * demoSchema entry the way HAX inserts it (attributes from properties,
 * innerHTML from content) and report what it did. Returns the HTML that
 * was inserted, for the paste level.
 */
export async function pageBare({ tag, moduleUrl, waitMs }) {
  const out = { defined: false, entries: 0, rendered: false, html: "" };
  try {
    await import(moduleUrl);
  } catch (e) {
    out.importError = String((e && e.message) || e);
    return out;
  }
  const defined = await Promise.race([
    customElements.whenDefined(tag).then(() => true),
    new Promise((r) => setTimeout(() => r(false), waitMs)),
  ]);
  out.defined = defined;
  if (!defined) {
    return out;
  }
  const Cls = customElements.get(tag);
  let schema = null;
  try {
    schema = Cls.haxProperties;
    if (typeof schema === "string") {
      schema = await fetch(schema).then((r) => r.json());
    }
  } catch (e) {
    out.schemaError = String((e && e.message) || e);
  }
  let demos = (schema && schema.demoSchema) || [];
  if (!Array.isArray(demos)) {
    demos = [];
  }
  const kebab = (s) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
  const host = document.getElementById("host");
  const htmls = [];
  for (const demo of demos) {
    if (!demo || demo.tag !== tag) {
      continue;
    }
    const el = document.createElement(tag);
    const props = demo.properties || {};
    for (const name of Object.keys(props)) {
      const value = props[name];
      if (value === false || value === null || value === undefined) {
        continue;
      }
      const attr = kebab(name);
      if (value === true) {
        el.setAttribute(attr, "");
      } else if (typeof value === "object") {
        el.setAttribute(attr, JSON.stringify(value));
      } else {
        el.setAttribute(attr, String(value));
      }
    }
    if (typeof demo.content === "string") {
      el.innerHTML = demo.content;
    }
    // what an author would paste: the markup before the element upgrades
    htmls.push(el.outerHTML);
    host.appendChild(el);
    out.entries += 1;
  }
  if (!out.entries) {
    // no demoSchema entry for this tag: the bare tag is the content
    const el = document.createElement(tag);
    htmls.push(el.outerHTML);
    host.appendChild(el);
    out.noDemoSchema = true;
  }
  out.html = htmls.join("\n");
  // content inserted after load: have the magic script sweep it, as it
  // does for content that is on the page when it loads
  if (globalThis.WCAutoload && globalThis.WCAutoload.process) {
    await globalThis.WCAutoload.process().catch(() => {});
  }
  return out;
}

/**
 * Runs in the page: does any instance of tag render a box with a size,
 * counting its shadow tree and slotted content?
 */
export function pageRendered(tag) {
  const sized = (el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const anySized = (root) => {
    for (const el of root.querySelectorAll("*")) {
      if (sized(el) || (el.shadowRoot && anySized(el.shadowRoot))) {
        return true;
      }
    }
    return false;
  };
  const found = [...document.querySelectorAll(tag)];
  return {
    instances: found.length,
    defined: !!customElements.get(tag),
    rendered: found.some(
      (el) =>
        sized(el) || (el.shadowRoot && anySized(el.shadowRoot)) || anySized(el),
    ),
  };
}
