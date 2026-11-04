/**
 * Structural check for Lit html`` / svg`` templates in elements/.
 *
 * Lit gives each template's markup to the browser's HTML parser. Markup that
 * is not well formed is silently rebuilt into a different DOM than the source
 * reads (a <div> in a <p>, <x-icon/> swallowing its siblings, nested
 * <button>/<a>, a stray end tag, a <div> moved out of a <table>). This
 * compares the tree each template spells out with the tree a WHATWG parser
 * builds from the exact string Lit uses, and lists where they differ (see
 * scripts/lib/html-templates.mjs).
 *
 * eslint-plugin-lit (in ESLint) already covers attribute-level syntax:
 * duplicate attributes and bindings, <x/> on non-void elements, bad binding
 * positions. This adds the tree-level problems it cannot see.
 *
 * Known, accepted cases live in scripts/html-template-check.baseline.json;
 * only problems missing from it are reported as new (exit 1).
 *
 *   node scripts/html-template-check.mjs                    report new problems
 *   node scripts/html-template-check.mjs --all              also list baselined ones
 *   node scripts/html-template-check.mjs --update-baseline  accept the current state
 *   node scripts/html-template-check.mjs elements/foo       limit to some paths
 */
import console from "node:console";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { findHtmlTemplates, checkHtmlTemplate } from "./lib/html-templates.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASELINE = path.join(
  root,
  "scripts",
  "html-template-check.baseline.json",
);
const SKIP_DIRS = new Set([
  "node_modules",
  "test",
  "demo",
  "locales",
  "dist",
  "build",
  "public",
  ".git",
]);
const SKIP_FILE =
  /(\.umd\.js|\.amd\.js|\.es6\.js|rollup\.config\.js|\.stories?\.js)$/;

const argv = process.argv.slice(2);
const ALL = argv.includes("--all");
const UPDATE = argv.includes("--update-baseline");
const targets = argv.filter((a) => !a.startsWith("--"));

function listJs(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) {
        listJs(path.join(dir, entry.name), out);
      }
    } else if (entry.name.endsWith(".js") && !SKIP_FILE.test(entry.name)) {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

// baseline keys ignore line numbers so unrelated edits do not churn them
const keyOf = (file, message) => `${file} :: ${message}`;

const roots = (targets.length ? targets : ["elements"]).map((t) =>
  path.resolve(root, t),
);
const files = roots
  .flatMap((r) =>
    fs.existsSync(r) && fs.statSync(r).isDirectory() ? listJs(r, []) : [r],
  )
  .filter((f) => f.endsWith(".js"))
  .sort();

let templates = 0;
const problems = [];
for (const abs of files) {
  const rel = path.relative(root, abs).split(path.sep).join("/");
  const source = fs.readFileSync(abs, "utf8");
  if (source.indexOf("html`") === -1 && source.indexOf("svg`") === -1) {
    continue;
  }
  for (const t of findHtmlTemplates(source)) {
    templates += 1;
    const res = await checkHtmlTemplate(t);
    if (res) {
      problems.push({ file: rel, line: res.line, message: res.message });
    }
  }
}

if (UPDATE) {
  const keys = [
    ...new Set(problems.map((p) => keyOf(p.file, p.message))),
  ].sort();
  fs.writeFileSync(BASELINE, JSON.stringify(keys, null, 2) + "\n");
  console.log(
    `html-template-check: baseline updated with ${keys.length} known problem(s).`,
  );
  process.exit(0);
}

const baseline = new Set(
  fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, "utf8")) : [],
);
const fresh = problems.filter((p) => !baseline.has(keyOf(p.file, p.message)));
const known = problems.length - fresh.length;
(ALL ? problems : fresh).forEach((p) =>
  console.log(`${p.file}:${p.line}  ${p.message}`),
);
console.log(
  `html-template-check: ${files.length} files, ${templates} html/svg templates, ${fresh.length} new problem(s), ${known} baselined`,
);
process.exit(fresh.length ? 1 : 0);
