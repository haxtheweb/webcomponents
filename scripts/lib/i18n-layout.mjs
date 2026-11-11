/**
 * Node side of the i18n layout check (scripts/i18n-layout-check.mjs).
 *
 * - listTagEntries(root): every custom element tag in
 *   hax-elements-registry.json with the module that defines it. Whether a tag
 *   is HAX-capable is decided in the browser with the same rule as the API
 *   snapshot gate: its class has haxProperties (own or inherited) or the
 *   package calls setHaxProperties(schema, "<tag>").
 * - scanRtlCss(source): physical-direction CSS (margin-left, padding-right,
 *   left:, text-align: left, border-left, float: right...) in css`` templates,
 *   which keeps the left/right sides in right-to-left languages where the
 *   logical properties (margin-inline-start, inset-inline-start,
 *   text-align: start...) would flip. Reuses findCssTemplates from
 *   css-templates.mjs, the parser behind scripts/css-template-check.mjs.
 * - compareToBaseline(): which failures are new, per tag and check.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { findCssTemplates } from "./css-templates.mjs";

// runtime checks; each compares the scenario with a plain English,
// left-to-right render of the same demo, so only what the language or the
// direction changes is reported
export const CHECKS = {
  "overflow-pseudo":
    "text overflows or is truncated in its box with ~40% longer strings",
  "overflow-rtl": "text overflows or is truncated in its box in dir=rtl",
  "overflow-pseudo-rtl":
    "text overflows or is truncated with longer strings in dir=rtl",
  "outside-pseudo": "parts render outside the host box with longer strings",
  "outside-rtl": "parts render outside the host box in dir=rtl",
  "outside-pseudo-rtl":
    "parts render outside the host box with longer strings in dir=rtl",
  "rtl-unusable":
    "an interactive control visible in left-to-right is pushed outside the content column (or collapses) in dir=rtl",
  "rtl-css":
    "physical-direction CSS (left/right) in css`` templates that does not flip in right-to-left languages",
};
// reported, never gating: a visible shadow-DOM string without the pseudo
// markers did not come from this.t (or from the author's content)
export const ADVISORY_CHECKS = {
  hardcoded:
    "visible text in the shadow DOM that is not in this.t (hard-coded string candidate)",
  "rtl-ignored":
    "dir=rtl on the content column did not reach the element (it forces a direction or is not rendered)",
  "render-error": "the element did not import or render in the test page",
};

const PHYSICAL_PROPS = new Set([
  "margin-left",
  "margin-right",
  "padding-left",
  "padding-right",
  "left",
  "right",
  "border-left",
  "border-right",
  "border-left-width",
  "border-right-width",
  "border-left-color",
  "border-right-color",
  "border-left-style",
  "border-right-style",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-bottom-left-radius",
  "border-bottom-right-radius",
  "scroll-margin-left",
  "scroll-margin-right",
  "scroll-padding-left",
  "scroll-padding-right",
]);
// property: value pairs that are physical only for these values
const PHYSICAL_VALUES = {
  "text-align": new Set(["left", "right"]),
  float: new Set(["left", "right"]),
  clear: new Set(["left", "right"]),
};
const SHORTHAND_4 = new Set(["margin", "padding"]);

function mirrorOf(prop) {
  if (prop.includes("left")) {
    return prop.replace("left", "right");
  }
  if (prop.includes("right")) {
    return prop.replace("right", "left");
  }
  return null;
}

/** split a CSS value on top-level whitespace (ignores spaces inside ()) */
function splitValue(value) {
  const parts = [];
  let depth = 0;
  let cur = "";
  for (const ch of value) {
    if (ch === "(") depth += 1;
    if (ch === ")") depth = Math.max(0, depth - 1);
    if (/\s/.test(ch) && depth === 0) {
      if (cur) parts.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  if (cur) parts.push(cur);
  return parts;
}

/**
 * Physical-direction declarations in one CSS string.
 * Not reported: rules aimed at a direction on purpose ([dir=rtl], :dir()),
 * symmetric pairs in the same rule (left: 0; right: 0 / equal margin-left
 * and margin-right), and left: 50% centering.
 * @returns {Array<{index:number, decl:string}>} index: offset in css
 */
export function findPhysicalCss(css) {
  const out = [];
  // blank out comments but keep offsets
  const text = css.replace(/\/\*[\s\S]*?\*\//g, (c) =>
    c.replace(/[^\n]/g, " "),
  );
  const block = /([^{}]*)\{([^{}]*)\}/g;
  let m;
  while ((m = block.exec(text)) !== null) {
    const selector = m[1];
    if (/\bdir\s*=|:dir\(/i.test(selector)) {
      continue;
    }
    const bodyStart = m.index + m[1].length + 1;
    const decls = [];
    let offset = 0;
    for (const piece of m[2].split(";")) {
      const colon = piece.indexOf(":");
      if (colon > 0) {
        const prop = piece.slice(0, colon).trim().toLowerCase();
        const value = piece
          .slice(colon + 1)
          .replace(/!important/i, "")
          .trim()
          .toLowerCase();
        const lead = piece.length - piece.trimStart().length;
        decls.push({ prop, value, index: bodyStart + offset + lead });
      }
      offset += piece.length + 1;
    }
    const values = new Map(decls.map((d) => [d.prop, d.value]));
    for (const d of decls) {
      let physical = false;
      if (PHYSICAL_PROPS.has(d.prop)) {
        const mirror = mirrorOf(d.prop);
        const symmetric = mirror && values.get(mirror) === d.value;
        const centered = d.prop === "left" && d.value === "50%";
        physical = !symmetric && !centered;
      } else if (PHYSICAL_VALUES[d.prop]) {
        physical = PHYSICAL_VALUES[d.prop].has(d.value);
      } else if (SHORTHAND_4.has(d.prop)) {
        const parts = splitValue(d.value);
        physical = parts.length === 4 && parts[1] !== parts[3];
      }
      if (physical && !d.value.includes("x-hax-expr")) {
        const value = d.value.replace(/\s+/g, " ");
        out.push({
          index: d.index,
          decl: `${d.prop}: ${value.length > 100 ? `${value.slice(0, 100)}...` : value}`,
        });
      }
    }
  }
  return out;
}

/**
 * Physical-direction CSS in every css`` template of a JS module.
 * @returns {Array<{line:number, decl:string}>}
 */
export function scanRtlCss(source) {
  if (source.indexOf("css`") === -1) {
    return [];
  }
  const found = [];
  for (const t of findCssTemplates(source)) {
    for (const hit of findPhysicalCss(t.css)) {
      const lineIndex = t.css.slice(0, hit.index).split("\n").length - 1;
      found.push({
        line: t.lineMap[lineIndex] || t.line,
        decl: hit.decl,
      });
    }
  }
  return found;
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

/** package name -> element folder name */
function packageFolders(root) {
  const map = new Map();
  const dir = path.join(root, "elements");
  for (const name of fs.readdirSync(dir)) {
    const pj = readJson(path.join(dir, name, "package.json"), null);
    if (pj && pj.name) {
      map.set(pj.name, name);
    }
  }
  return map;
}

/**
 * Every hyphenated tag in hax-elements-registry.json with the file that
 * defines it (from wc-registry.json).
 * @returns {Array<{tag:string, folder:string, module:string, setHax:boolean}>}
 *   module is relative to the repo root (elements/<folder>/<file>.js)
 */
export function listTagEntries(root) {
  const registry = readJson(path.join(root, "hax-elements-registry.json"), {});
  const wc = readJson(path.join(root, "wc-registry.json"), {});
  const folders = packageFolders(root);
  const out = [];
  for (const tag of Object.keys(registry).sort()) {
    if (
      !/^[a-z][a-z0-9]*-[a-z0-9-]*$/.test(tag) ||
      typeof wc[tag] !== "string"
    ) {
      continue;
    }
    const spec = wc[tag];
    const parts = spec.split("/");
    const pkg = spec.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
    const rest = parts.slice(spec.startsWith("@") ? 2 : 1).join("/");
    const folder = folders.get(pkg);
    if (!folder || !rest) {
      continue;
    }
    const module = `elements/${folder}/${rest}`;
    if (!fs.existsSync(path.join(root, module))) {
      continue;
    }
    const source = fs.readFileSync(path.join(root, module), "utf8");
    out.push({
      tag,
      folder,
      module,
      setHax:
        source.includes("setHaxProperties(") && source.includes(`"${tag}"`),
    });
  }
  return out;
}

const IMPORT_RE =
  /(?:import|export)[^'"`;]*?from\s*["'](\.{1,2}\/[^"']+\.js)["']|import\s*["'](\.{1,2}\/[^"']+\.js)["']/g;

/**
 * The tag's module plus the relative imports it pulls in from its own element
 * folder (its lib/ parts), where its styles live.
 */
export function tagSourceFiles(root, entry) {
  const folderAbs = path.join(root, "elements", entry.folder);
  const seen = new Set();
  const queue = [path.join(root, entry.module)];
  while (queue.length && seen.size < 40) {
    const file = queue.shift();
    if (seen.has(file) || !fs.existsSync(file)) {
      continue;
    }
    seen.add(file);
    const source = fs.readFileSync(file, "utf8");
    let m;
    IMPORT_RE.lastIndex = 0;
    while ((m = IMPORT_RE.exec(source)) !== null) {
      const rel = m[1] || m[2];
      const next = path.resolve(path.dirname(file), rel);
      const inside = path.relative(folderAbs, next);
      if (
        !inside.startsWith("..") &&
        !path.isAbsolute(inside) &&
        !inside
          .split(path.sep)
          .some(
            (p) =>
              p === "node_modules" ||
              p === "dist" ||
              p === "test" ||
              p === "demo",
          )
      ) {
        queue.push(next);
      }
    }
  }
  return [...seen].map((f) => path.relative(root, f).split(path.sep).join("/"));
}

/** static rtl-css findings for one tag: ["file:line  decl", ...] */
export function rtlCssForTag(root, entry) {
  const details = [];
  for (const rel of tagSourceFiles(root, entry)) {
    const source = fs.readFileSync(path.join(root, rel), "utf8");
    for (const hit of scanRtlCss(source)) {
      details.push(`${rel}:${hit.line}  ${hit.decl}`);
    }
  }
  return details;
}

function git(root, args) {
  const res = spawnSync("git", args, { cwd: root, encoding: "utf8" });
  return res.status === 0 ? res.stdout.trim() : null;
}

/**
 * Files changed relative to a base ref (merge-base when it shares history),
 * plus uncommitted and untracked files.
 */
export function changedFiles(root, base) {
  const found = new Set();
  const add = (text) =>
    (text || "")
      .split("\n")
      .filter(Boolean)
      .forEach((f) => found.add(f));
  if (base) {
    if (!git(root, ["rev-parse", "--verify", "--quiet", `${base}^{commit}`])) {
      throw new Error(`base ref not found: ${base}`);
    }
    const mergeBase = git(root, ["merge-base", "HEAD", base]) || base;
    add(git(root, ["diff", "--name-only", mergeBase, "HEAD"]));
  }
  add(git(root, ["diff", "--name-only", "HEAD"]));
  add(git(root, ["ls-files", "--others", "--exclude-standard"]));
  return [...found].sort();
}

/** element folders touched by a list of changed files */
export function changedFolders(files) {
  const out = new Set();
  for (const f of files) {
    const m = f.match(/^elements\/([^/]+)\//);
    if (m) {
      out.add(m[1]);
    }
  }
  return out;
}

// static checks give the same answer on every machine, so for them a
// higher count than the baseline is new as well
export const COUNTED_CHECKS = ["rtl-css"];

/**
 * results: { [tag]: { [check]: string[] details } }
 * baseline: { [tag]: { [check]: number of findings } }
 * A failure is new when the tag has no baseline entry for that check, or, for
 * COUNTED_CHECKS, more findings than the baseline. Runtime details (shadow
 * DOM selectors) are only listed, never compared, so a renamed class inside
 * an already-baselined check does not fail a build.
 */
export function compareToBaseline(results, baseline, gatingChecks) {
  const fresh = [];
  const known = [];
  const fixed = [];
  for (const tag of Object.keys(results).sort()) {
    const now = results[tag] || {};
    const before = baseline[tag] || {};
    for (const check of Object.keys(now).sort()) {
      if (!gatingChecks.includes(check) || !now[check].length) {
        continue;
      }
      const item = { tag, check, details: now[check] };
      const grew =
        COUNTED_CHECKS.includes(check) &&
        typeof before[check] === "number" &&
        now[check].length > before[check];
      if (before[check] && !grew) {
        known.push(item);
      } else {
        fresh.push(item);
      }
    }
    for (const check of Object.keys(before)) {
      if (!now[check] || !now[check].length) {
        fixed.push({ tag, check });
      }
    }
  }
  return { fresh, known, fixed };
}
