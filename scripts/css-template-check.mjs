/**
 * Strict syntax check for Lit css`` templates in elements/.
 *
 * Browsers silently drop CSS they cannot parse: an invalid selector throws
 * away its whole rule (including the valid selectors in the same list), and an
 * invalid declaration is skipped. Nothing reports it, so these bugs sit in
 * shipped elements unnoticed. This script parses every css`` template with
 * lightningcss and lists what a browser would discard.
 *
 * Advisory, like ESLint here: known, deliberate cases (for example the
 * grid-plate Safari media-query hack) live in
 * scripts/css-template-check.baseline.json, and only problems missing from
 * the baseline are reported as new.
 *
 *   node scripts/css-template-check.mjs                  report new problems (exit 1 if any)
 *   node scripts/css-template-check.mjs --all            also list baselined problems
 *   node scripts/css-template-check.mjs --update-baseline  accept the current state
 *   node scripts/css-template-check.mjs elements/foo     limit to some paths
 */
import console from "node:console";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { findCssTemplates, checkCss } from "./lib/css-templates.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASELINE = path.join(root, "scripts", "css-template-check.baseline.json");
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
let uncheckable = 0;
const problems = [];
for (const abs of files) {
  const rel = path.relative(root, abs).split(path.sep).join("/");
  const source = fs.readFileSync(abs, "utf8");
  if (source.indexOf("css`") === -1) {
    continue;
  }
  for (const t of findCssTemplates(source)) {
    templates += 1;
    const res = checkCss(t);
    uncheckable += res.uncheckable;
    res.errors.forEach((e) => problems.push({ file: rel, ...e }));
  }
}

if (UPDATE) {
  const keys = [
    ...new Set(problems.map((p) => keyOf(p.file, p.message))),
  ].sort();
  fs.writeFileSync(BASELINE, JSON.stringify(keys, null, 2) + "\n");
  console.log(
    `css-template-check: baseline updated with ${keys.length} known problem(s).`,
  );
  process.exit(0);
}

const baseline = new Set(
  fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, "utf8")) : [],
);
const fresh = problems.filter((p) => !baseline.has(keyOf(p.file, p.message)));
const known = problems.length - fresh.length;
const show = ALL ? problems : fresh;
show.forEach((p) => console.log(`${p.file}:${p.line}  ${p.message}`));
console.log(
  `css-template-check: ${files.length} files, ${templates} css templates, ${fresh.length} new problem(s), ${known} baselined, ${uncheckable} skipped (runtime value)`,
);
process.exit(fresh.length ? 1 : 0);
