#!/usr/bin/env node
/**
 * Extract living documentation data for elements in this monorepo.
 *
 * For each element folder it builds docs data: attributes, slots,
 * events, haxProperties, demo markup, install snippets and a "surface hash"
 * (a fingerprint of what a person can see and use: attributes, HAX controls,
 * slots, events, demo schema). A walkthrough storyboard stores the hash it was
 * written against, so a changed element flags its walkthrough for review.
 *
 * Consumed by <documentation-player> and by scripts/build-component-gallery.js.
 *
 * usage:
 *   node scripts/extract-element-docs.mjs --write [element ...]
 *       writes elements/<name>/lib/<tag>.docs.json, so the data ships with the
 *       package. Each element's build runs this as `--write .`
 *   node scripts/extract-element-docs.mjs <out-dir> [element ...]
 *       writes <out-dir>/<name>.docs.json (the gallery build uses this)
 *   node scripts/extract-element-docs.mjs --status [element ...]
 *       lists walkthroughs as reviewed, awaiting or stale; exits 1 on stale
 *
 * With no element names every folder in elements/ is processed. Elements that
 * cannot be parsed are skipped with a warning; one bad element never stops a run.
 *
 * Walkthrough storyboards live at elements/<name>/lib/<tag>.motion.json and an
 * optional video tutorial at elements/<name>/lib/<tag>.video.json
 * ({ "source", "title", "captions", "tutorial" }, written by
 * scripts/link-element-tutorial.mjs).
 * Status per element: none | stale | awaiting | reviewed
 *
 * Node built-ins only.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ELEMENTS = path.join(ROOT, "elements");

const readJson = (p) => {
  try {
    return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : null;
  } catch (e) {
    return null;
  }
};

/** return the balanced {...} starting at the first "{" at or after idx */
function balanced(src, idx) {
  const start = src.indexOf("{", idx);
  let depth = 0;
  let str = null;
  let esc = false;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (str) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === str) str = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") str = c;
    else if (c === "{") depth++;
    else if (c === "}" && --depth === 0) return src.slice(start, i + 1);
  }
  throw new Error("unbalanced braces");
}

/** haxProperties is a JSON file next to the element or an inline object literal */
function loadHaxProperties(dir, src, tag) {
  const m = src.match(/static get haxProperties\(\)\s*\{/);
  if (!m) return null;
  const body = balanced(src, m.index);
  if (/new URL\(/.test(body)) {
    const lib = path.join(dir, "lib");
    // packages can hold several elements: prefer the file named for this tag
    const own = `${tag}.haxProperties.json`;
    const files = fs.existsSync(lib) ? fs.readdirSync(lib) : [];
    const f = files.includes(own)
      ? own
      : files.find((x) => x.endsWith(".haxProperties.json"));
    return f ? readJson(path.join(lib, f)) : null;
  }
  const literal = balanced(body, body.indexOf("return"));
  // inline literals may call helper classes defined in the same file
  let preamble = "";
  for (const cm of src.matchAll(/^class (\w+)\s*\{/gm)) {
    if (literal.includes(cm[1]) && !/extends/.test(cm[0])) {
      preamble += `class ${cm[1]} ${balanced(src, cm.index)}\n`;
    }
  }
  return new Function(`${preamble}return (${literal});`)();
}

/**
 * attributes read from `static get properties()` when custom-elements.json has
 * none, so elements without a manifest still document their attributes
 */
function propertiesFromSource(src) {
  const m = src.match(/static get properties\(\)\s*\{/);
  if (!m) return [];
  let body;
  try {
    body = balanced(src, m.index);
  } catch {
    return [];
  }
  const out = [];
  for (const pm of body.matchAll(/^\s{4,8}(\w+)\s*:\s*\{([^{}]*)\}/gm)) {
    const [, field, spec] = pm;
    if (field.startsWith("_") || /attribute\s*:\s*false/.test(spec) || /state\s*:\s*true/.test(spec)) continue;
    const at = spec.match(/attribute\s*:\s*["'`]([\w-]+)["'`]/);
    const ty = spec.match(/type\s*:\s*(\w+)/);
    out.push({
      name: at ? at[1] : field.toLowerCase(),
      fieldName: field,
      type: { text: ty ? ty[1].toLowerCase() : "" },
    });
  }
  return out;
}

/** the opening sentence of a doc comment, without markdown sections */
function firstSentence(text) {
  const t = String(text || "")
    .split(/\n\s*#|###/)[0]
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const m = t.match(/^.{20,220}?[.!?](\s|$)/);
  return m ? m[0].trim() : t.slice(0, 220);
}

/** stable stringify so the hash does not depend on key order */
function stable(v) {
  if (Array.isArray(v)) return `[${v.map(stable).join(",")}]`;
  if (v && typeof v === "object") {
    return `{${Object.keys(v)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${stable(v[k])}`)
      .join(",")}}`;
  }
  return JSON.stringify(v);
}

/** find the storyboard for an element, if any */
function findMotion(dir, name, tag) {
  const lib = path.join(dir, "lib");
  for (const f of [`${tag}.motion.json`, `${name}.motion.json`]) {
    if (fs.existsSync(path.join(lib, f))) return `lib/${f}`;
  }
  return "";
}

function motionStatus(dir, file, hash) {
  if (!file) return { file: "", status: "none" };
  const scene = readJson(path.join(dir, file));
  if (!scene) return { file, status: "stale" };
  if (scene.surfaceHash !== hash) return { file, status: "stale" };
  const r = scene.review;
  return {
    file,
    status:
      r && r.status === "approved" && r.hash === hash ? "reviewed" : "awaiting",
  };
}

/** build the docs data for one element folder name */
export function extractElementDocs(name, elementsDir = ELEMENTS) {
  const dir = path.join(elementsDir, name);
  const pkg = readJson(path.join(dir, "package.json"));
  if (!pkg) throw new Error("no package.json");
  const main = pkg.main || `${name}.js`;
  const mainPath = path.join(dir, main);
  if (!fs.existsSync(mainPath)) throw new Error(`missing ${main}`);
  const src = fs.readFileSync(mainPath, "utf8");
  const tag =
    (src.match(/static get tag\(\)\s*\{\s*return\s*["'`]([\w-]+)["'`]/) ||
      [])[1] || name;
  let hax = {};
  try {
    hax = loadHaxProperties(dir, src, tag) || {};
  } catch (e) {
    hax = {};
  }
  const cem = readJson(path.join(dir, "custom-elements.json"));

  // the class for this tag (the manifest sometimes omits tagName)
  let decl = null;
  for (const mod of (cem && cem.modules) || []) {
    for (const d of mod.declarations || []) {
      if (
        d.kind === "class" &&
        (d.tagName === tag || (!decl && mod.path === main))
      ) {
        decl = decl || d;
      }
    }
  }
  const settings = [
    ...((hax.settings && hax.settings.configure) || []),
    ...((hax.settings && hax.settings.advanced) || []),
    ...((hax.settings && hax.settings.developer) || []),
  ];
  const byProp = Object.fromEntries(settings.map((s) => [s.property, s]));

  const attributes = ((decl && decl.attributes && decl.attributes.length ? decl.attributes : propertiesFromSource(src)) || [])
    .filter((a) => !a.name.startsWith("_"))
    .map((a) => ({
      name: a.name,
      property: a.fieldName,
      type: (a.type && a.type.text) || "",
      default: a.default !== undefined && a.default !== null ? a.default : "",
      description: (a.description || "").replace(/\s+/g, " ").trim(),
      hax: byProp[a.fieldName]
        ? {
            title: byProp[a.fieldName].title,
            input: byProp[a.fieldName].inputMethod,
            options: byProp[a.fieldName].options || null,
          }
        : null,
    }));

  const slotNames = new Set(
    [...src.matchAll(/<slot(?:\s+name="([^"]+)")?\s*>/g)].map(
      (m) => m[1] || "(default)",
    ),
  );
  for (const s of settings) if (s.slot) slotNames.add(s.slot);
  for (const d of hax.demoSchema || []) {
    for (const m of (d.content || "").matchAll(/slot="([^"]+)"/g))
      slotNames.add(m[1]);
  }
  const slots = [...slotNames]
    .map((n) => n.replace(/\$\{\w+\}/g, "N"))
    .filter((n, i, a) => a.indexOf(n) === i)
    .sort();
  const events = new Set(((decl && decl.events) || []).map((e) => e.name));
  for (const m of src.matchAll(/new CustomEvent\(\s*["'`]([\w-]+)["'`]/g))
    events.add(m[1]);
  // events fired by shared mixins are not part of the element's own surface
  events.delete("i18n-manager-register-element");

  const demoHtml = (hax.demoSchema || [])
    .map((d) => {
      const attrs = Object.entries(d.properties || {})
        .map(([k, v]) => {
          const attr =
            (attributes.find((a) => a.property === k) || {}).name || k;
          return v === true ? ` ${attr}` : ` ${attr}="${v}"`;
        })
        .join("");
      return `<${d.tag}${attrs}>${d.content ? "\n  " + d.content.trim().replace(/\n/g, "\n  ") + "\n" : ""}</${d.tag}>`;
    })
    .join("\n");

  const surface = {
    tag,
    attributes: attributes.map((a) => ({ n: a.name, t: a.type, d: a.default })),
    hax: settings.map((s) => ({
      p: s.property || s.slot,
      i: s.inputMethod,
      o: s.options || null,
    })),
    slots,
    events: [...events].sort(),
    demo: hax.demoSchema || [],
  };
  const surfaceHash = crypto
    .createHash("sha256")
    .update(stable(surface))
    .digest("hex")
    .slice(0, 12);

  return {
    tag,
    folder: name,
    package: pkg.name,
    version: pkg.version,
    license: pkg.license,
    title: (hax.gizmo && hax.gizmo.title) || tag,
    description:
      (hax.gizmo && hax.gizmo.description) ||
      pkg.description ||
      firstSentence(decl && decl.description) ||
      "",
    icon: (hax.gizmo && hax.gizmo.icon) || "",
    tags: (hax.gizmo && hax.gizmo.tags) || [],
    haxCapable: Boolean(hax.gizmo),
    import: `${pkg.name}/${main}`,
    cdn: `https://cdn.hax.cloud/cdn/build/es6/node_modules/${pkg.name}/${main}`,
    install: `npm i ${pkg.name}`,
    demoHtml,
    attributes,
    slots,
    events: [...events].sort(),
    hax,
    surfaceHash,
    motion: motionStatus(dir, findMotion(dir, name, tag), surfaceHash),
    video: readJson(path.join(dir, "lib", `${tag}.video.json`)),
    source: { path: `elements/${name}`, file: main },
  };
}

function main() {
  const args = process.argv.slice(2);
  const statusMode = args.includes("--status");
  const writeMode = args.includes("--write");
  // element names, or paths to element folders (". " from an element build)
  const rest = args
    .filter((a) => !a.startsWith("--"))
    .map((a) => (a === "." || a.includes("/") ? path.basename(path.resolve(a)) : a));
  const outDir = statusMode || writeMode ? "" : rest.shift();
  if (!statusMode && !writeMode && !outDir) {
    console.error(
      "usage: extract-element-docs.mjs --write [element ...]\n       extract-element-docs.mjs <out-dir> [element ...]\n       extract-element-docs.mjs --status [element ...]",
    );
    process.exit(1);
  }
  const names = rest.length
    ? rest
    : fs
        .readdirSync(ELEMENTS, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);
  if (outDir) fs.mkdirSync(outDir, { recursive: true });

  let ok = 0;
  const rows = [];
  for (const name of names) {
    try {
      const d = extractElementDocs(name);
      ok++;
      if (outDir)
        fs.writeFileSync(
          path.join(outDir, `${name}.docs.json`),
          JSON.stringify(d),
        );
      if (writeMode) {
        const lib = path.join(ELEMENTS, name, "lib");
        fs.mkdirSync(lib, { recursive: true });
        fs.writeFileSync(
          path.join(lib, `${d.tag}.docs.json`),
          JSON.stringify(d, null, 2) + "\n",
        );
      }
      if (d.motion.status !== "none")
        rows.push([name, d.motion.status, d.surfaceHash]);
    } catch (e) {
      if (rest.length) console.warn(`skipped ${name}: ${e.message}`);
    }
  }
  if (statusMode) {
    for (const r of rows) console.log(r.join("\t"));
    if (!rows.length) console.log("no walkthroughs found");
    process.exit(rows.some((r) => r[1] === "stale") ? 1 : 0);
  }
  console.log(
    `docs data for ${ok} of ${names.length} elements -> ${writeMode ? "elements/*/lib" : outDir}`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
