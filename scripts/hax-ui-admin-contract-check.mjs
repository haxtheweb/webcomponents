#!/usr/bin/env node
/**
 * HAX UI admin contract check.
 *
 * Reads the contract-admin-* entries in elements/d-d-d/lib/DDDPatternLibrary.js
 * and checks, from source, that:
 *   - every element they list (targetElements) builds on the HAX UI layer and
 *     its scale (scripts/lib/hax-ui-admin-contract.mjs lists the rules), and
 *   - every admin file that opens a modal or draws a dialog uses the one
 *     dialog frame and the one confirm card, with no browser dialogs.
 * What the contracts require is written out in
 * elements/d-d-d/design-system/source/hax-ui-admin.md, "Contract".
 *
 * Findings that already exist are listed in
 * scripts/hax-ui-admin-contract.baseline.json; only new ones fail. The
 * baseline only shrinks: fix a finding, then run --update-baseline.
 *
 * Usage:
 *   node scripts/hax-ui-admin-contract-check.mjs                    exit 1 on new findings
 *   node scripts/hax-ui-admin-contract-check.mjs --all              list every finding
 *   node scripts/hax-ui-admin-contract-check.mjs --json             machine-readable report
 *   node scripts/hax-ui-admin-contract-check.mjs --update-baseline  drop what is fixed
 *   node scripts/hax-ui-admin-contract-check.mjs --update-baseline --allow-additions
 */
import console from "node:console";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  adminContractTargets,
  checkAdminSource,
  countFindings,
} from "./lib/hax-ui-admin-contract.mjs";
import {
  compareToBaseline,
  shrinkBaseline,
  sortBaseline,
} from "./lib/gate-baseline.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BASELINE = path.join(__dirname, "hax-ui-admin-contract.baseline.json");
const args = new Set(process.argv.slice(2));

/**
 * Where admin chrome lives. Themes, ui-components and anything a site
 * visitor sees are left out: they follow DDD's content scale.
 */
const ADMIN_DIRS = [
  "elements/app-hax",
  "elements/haxcms-elements/lib/core",
  "elements/rpg-character/lib",
  "elements/super-daemon",
  "elements/hax-body/lib",
  "elements/outline-designer",
];
const SKIP = new Set([
  "node_modules",
  "demo",
  "test",
  "locales",
  "dist",
  "build",
]);

function walk(dir, out = []) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) {
    return out;
  }
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) {
      continue;
    }
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(rel, out);
    } else if (entry.name.endsWith(".js")) {
      out.push(rel.split(path.sep).join("/"));
    }
  }
  return out;
}

/** tag -> file, from `static get tag() { return "x" }` or define("x", …) */
function tagFiles(files) {
  const map = {};
  for (const file of files) {
    const src = fs.readFileSync(path.join(ROOT, file), "utf8");
    const re =
      /static\s+get\s+tag\s*\(\s*\)\s*\{[^}]*?return\s+["']([a-z][\w-]*-[\w-]*)["']|customElements\.define\(\s*["']([a-z][\w-]*-[\w-]*)["']/g;
    for (const m of src.matchAll(re)) {
      const tag = m[1] || m[2];
      if (!map[tag]) {
        map[tag] = file;
      }
    }
  }
  return map;
}

async function main() {
  const { INTERNAL_CONTRACTS } = await import(
    pathToFileURL(path.join(ROOT, "elements/d-d-d/lib/DDDPatternLibrary.js"))
      .href
  );
  const targets = adminContractTargets(INTERNAL_CONTRACTS);
  const adminFiles = ADMIN_DIRS.flatMap((d) => walk(d));
  // targets can live outside ADMIN_DIRS (any element a contract names)
  const allFiles = walk("elements");
  const byTag = tagFiles(allFiles);
  const targetFiles = new Map();
  const missing = [];
  for (const tag of targets) {
    if (byTag[tag]) {
      targetFiles.set(byTag[tag], tag);
    } else {
      missing.push(tag);
    }
  }

  const files = [...new Set([...adminFiles, ...targetFiles.keys()])].sort();
  const results = {};
  const detail = {};
  for (const file of files) {
    const src = fs.readFileSync(path.join(ROOT, file), "utf8");
    const findings = checkAdminSource(src, {
      target: targetFiles.has(file),
      opener: true,
    });
    if (findings.length) {
      results[file] = countFindings(findings);
      detail[file] = findings;
    }
  }
  // files with no findings still count, so fixed entries are noticed
  for (const file of files) {
    results[file] = results[file] || {};
  }

  const baseline = fs.existsSync(BASELINE)
    ? JSON.parse(fs.readFileSync(BASELINE, "utf8"))
    : {};

  if (args.has("--update-baseline")) {
    const next = shrinkBaseline(baseline, results, {
      allowAdditions: args.has("--allow-additions"),
    });
    fs.writeFileSync(
      BASELINE,
      JSON.stringify(sortBaseline(next), null, 2) + "\n",
    );
    console.log(
      `hax-ui-admin-contract: baseline written to ${path.relative(ROOT, BASELINE)}`,
    );
    return 0;
  }

  const { fresh, fixed } = compareToBaseline(results, baseline);
  if (args.has("--json")) {
    console.log(
      JSON.stringify(
        { targets, missingTargets: missing, findings: detail, fresh, fixed },
        null,
        2,
      ),
    );
    return fresh.length || missing.length ? 1 : 0;
  }

  const show = args.has("--all")
    ? Object.keys(detail)
    : [...new Set(fresh.map((f) => f.element))];
  for (const file of show) {
    console.log(
      `\n${file}${targetFiles.has(file) ? `  <${targetFiles.get(file)}>` : ""}`,
    );
    for (const f of detail[file] || []) {
      console.log(
        `  ${String(f.line).padStart(5)}  ${f.rule.padEnd(13)} ${f.message}`,
      );
    }
  }
  if (missing.length) {
    console.log(
      `\nContract targets with no element source: ${missing.join(", ")} (remove them from targetElements or restore the element)`,
    );
  }
  const total = Object.values(detail).reduce((n, f) => n + f.length, 0);
  console.log(
    `\nhax-ui-admin-contract: ${files.length} files, ${targets.length} contract targets, ${total} findings (${fresh.length} new, ${fixed.length} fixed since the baseline)`,
  );
  if (fixed.length) {
    console.log("Run with --update-baseline to drop fixed findings.");
  }
  return fresh.length || missing.length ? 1 : 0;
}

main().then(
  (code) => process.exit(code),
  (e) => {
    console.error(e);
    process.exit(2);
  },
);
