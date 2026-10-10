#!/usr/bin/env node

/**
 * DDD unknown-token linter
 *
 * Finds `var(--ddd-*)` references that no file in the repo ever declares.
 * A typo such as `var(--ddd-spacing-33)` or a removed token such as
 * `var(--ddd-text-primary)` silently falls back to the var() fallback (or to
 * nothing), so these are easy to miss in review.
 *
 * Declared = any `--ddd-x:` custom property declaration, any quoted
 * `"--ddd-x"` used as an object key or setProperty() name, or a prefix
 * declared from a template such as `--ddd-primary-${i}:`.
 * Used = any `var(--ddd-x` that is not itself built from a template.
 * Override hooks (`--ddd-component-*`, `--ddd-card-*`, `--ddd-button-*`) are
 * set by consumers, so they are never flagged.
 *
 * Existing violations live in scripts/ddd-token-lint.baseline.json so CI only
 * fails on new ones. Fix a violation, then run with --update-baseline to drop
 * it from the baseline.
 *
 * Usage:
 *   node scripts/ddd-token-lint.js                 # check, exit 1 on new unknown tokens
 *   node scripts/ddd-token-lint.js --all           # list every unknown token, baseline or not
 *   node scripts/ddd-token-lint.js --update-baseline
 *   node scripts/ddd-token-lint.js --json          # machine-readable report
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SCAN_DIRS = ["elements"];
const EXTENSIONS = new Set([".js", ".ts", ".css", ".scss", ".html"]);
const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  "build",
  "demo",
  "test",
  "locales",
  "coverage",
  ".git",
]);
const BASELINE = path.join(__dirname, "ddd-token-lint.baseline.json");
// Override hooks: components read these so authors can restyle one element.
// They are meant to be set by consumers, so nothing in the repo declares them.
const HOOK_PREFIXES = ["--ddd-component-", "--ddd-card-", "--ddd-button-"];

const args = new Set(process.argv.slice(2));
const asJson = args.has("--json");
const showAll = args.has("--all");
const updateBaseline = args.has("--update-baseline");

function walk(dir, out) {
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return out;
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) {
        walk(path.join(dir, entry.name), out);
      }
    } else if (
      EXTENSIONS.has(path.extname(entry.name)) &&
      !entry.name.endsWith(".min.js") &&
      !entry.name.endsWith(".d.ts")
    ) {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

const NAME = "--ddd-[A-Za-z0-9_-]+";
const DECL_RE = new RegExp(`(${NAME})\\s*:(?!:)`, "g");
const QUOTED_DECL_RE = new RegExp(`["'\`](${NAME})["'\`]\\s*[:,]`, "g");
const TEMPLATE_DECL_RE = new RegExp(
  `(--ddd-[A-Za-z0-9_-]*-)\\$\\{[^}]*\\}[A-Za-z0-9_-]*["'\`]?\\s*[:,]`,
  "g",
);
const USE_RE = new RegExp(`var\\(\\s*(${NAME})`, "g");

const files = [];
for (const dir of SCAN_DIRS) {
  walk(path.join(ROOT, dir), files);
}

const declared = new Set();
const declaredPrefixes = new Set();
const uses = []; // { token, file, line }

for (const file of files) {
  const rel = path.relative(ROOT, file).split(path.sep).join("/");
  const text = fs.readFileSync(file, "utf8");
  let m;
  DECL_RE.lastIndex = 0;
  while ((m = DECL_RE.exec(text))) declared.add(m[1]);
  QUOTED_DECL_RE.lastIndex = 0;
  while ((m = QUOTED_DECL_RE.exec(text))) declared.add(m[1]);
  TEMPLATE_DECL_RE.lastIndex = 0;
  while ((m = TEMPLATE_DECL_RE.exec(text))) declaredPrefixes.add(m[1]);
  USE_RE.lastIndex = 0;
  while ((m = USE_RE.exec(text))) {
    const token = m[1];
    const next = text.charAt(m.index + m[0].length);
    // var(--ddd-icon-${size}) and friends are built at runtime; skip them
    if (next === "$" || token.endsWith("-")) continue;
    const line = text.slice(0, m.index).split("\n").length;
    uses.push({ token, file: rel, line });
  }
}

// The design system artifact declares its own role tokens (--ddd-scheme-*) from
// its tokens.json, so its previews may use them.
const ARTIFACT_TOKENS = path.join(ROOT, "elements", "d-d-d", "design-system", "source", "tokens.json");
if (fs.existsSync(ARTIFACT_TOKENS)) {
  const t = JSON.parse(fs.readFileSync(ARTIFACT_TOKENS, "utf8"));
  for (const family of Object.values(t)) {
    if (family && Array.isArray(family.tokens)) {
      for (const tok of family.tokens) {
        if (tok.name.startsWith("ddd-scheme-")) declared.add(`--${tok.name}`);
      }
    }
  }
}

function isDeclared(token) {
  if (declared.has(token)) return true;
  if (HOOK_PREFIXES.some((prefix) => token.startsWith(prefix))) return true;
  for (const prefix of declaredPrefixes) {
    if (token.startsWith(prefix)) return true;
  }
  return false;
}

const unknown = uses.filter((u) => !isDeclared(u.token));

// group as { token: [file, ...] } for a stable, reviewable baseline
const grouped = {};
for (const u of unknown) {
  grouped[u.token] = grouped[u.token] || new Set();
  grouped[u.token].add(u.file);
}
const current = {};
for (const token of Object.keys(grouped).sort()) {
  current[token] = [...grouped[token]].sort();
}

if (updateBaseline) {
  fs.writeFileSync(BASELINE, JSON.stringify(current, null, 2) + "\n");
  console.log(
    `ddd-token-lint: baseline written with ${Object.keys(current).length} unknown tokens in ${unknown.length} places`,
  );
  process.exit(0);
}

let baseline = {};
if (fs.existsSync(BASELINE)) {
  baseline = JSON.parse(fs.readFileSync(BASELINE, "utf8"));
}
const inBaseline = (u) =>
  Array.isArray(baseline[u.token]) && baseline[u.token].includes(u.file);
const fresh = showAll ? unknown : unknown.filter((u) => !inBaseline(u));
const stale = [];
for (const token of Object.keys(baseline)) {
  for (const file of baseline[token]) {
    if (!current[token] || !current[token].includes(file)) {
      stale.push({ token, file });
    }
  }
}

if (asJson) {
  console.log(
    JSON.stringify(
      {
        filesScanned: files.length,
        declared: declared.size,
        uses: uses.length,
        unknown: fresh,
        stale,
      },
      null,
      2,
    ),
  );
} else {
  for (const u of fresh) {
    console.log(`${u.file}:${u.line}  unknown token ${u.token}`);
  }
  if (stale.length) {
    console.log(
      `\n${stale.length} baseline entr${stale.length === 1 ? "y is" : "ies are"} fixed; run with --update-baseline to drop:`,
    );
    for (const s of stale) console.log(`  ${s.token} in ${s.file}`);
  }
  console.log(
    `\nddd-token-lint: ${files.length} files, ${declared.size} declared tokens, ${uses.length} var() uses, ${fresh.length} ${showAll ? "unknown" : "new unknown"}`,
  );
}

process.exit(!showAll && fresh.length ? 1 : 0);
