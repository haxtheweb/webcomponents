#!/usr/bin/env node

/**
 * Sync locale files for a shared i18n namespace.
 *
 * Some elements register a single i18n namespace from many files. `hax-body`, for
 * example, calls registerLocalization({ namespace: "hax" }) from 12 different files,
 * and every `this.t` declared across them feeds one set of `hax.<lang>.json` files.
 *
 * Single-file extractors cannot describe that shape: pointed at the element's main
 * file they see only the keys declared there and would overwrite the reference
 * `<namespace>.en.json` with that fragment. This script scans every contributing file
 * instead, builds the true canonical key set, and aligns all locale files to it.
 *
 * Dry run by default; pass --write to apply.
 *
 *   node scripts/sync-shared-namespace-locales.js --element hax-body --namespace hax
 *   node scripts/sync-shared-namespace-locales.js --element hax-body --namespace hax --write
 */

const fs = require("fs");
const path = require("path");

const SKIP_DIRS = new Set([
  "node_modules",
  "locales",
  "build",
  "dist",
  "demo",
  "test",
  ".git",
]);

function parseArgs(argv) {
  const args = { element: null, namespace: null, write: false, verbose: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--element") args.element = argv[++i];
    else if (a === "--namespace") args.namespace = argv[++i];
    else if (a === "--write") args.write = true;
    else if (a === "--verbose") args.verbose = true;
  }
  return args;
}

/** Recursively collect .js files, skipping build output and locale data. */
function collectJsFiles(dir, acc = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return acc;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) collectJsFiles(full, acc);
    } else if (entry.name.endsWith(".js")) {
      acc.push(full);
    }
  }
  return acc;
}

/**
 * Return the body of the object literal that starts at `open` (index of "{"),
 * tracking string and comment state so braces inside strings do not confuse it.
 */
function readObjectBody(src, open) {
  let depth = 0;
  let quote = null;
  let comment = null;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    const next = src[i + 1];
    if (comment === "line") {
      if (c === "\n") comment = null;
      continue;
    }
    if (comment === "block") {
      if (c === "*" && next === "/") {
        comment = null;
        i++;
      }
      continue;
    }
    if (quote) {
      if (c === "\\") i++;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      quote = c;
      continue;
    }
    if (c === "/" && next === "/") {
      comment = "line";
      i++;
      continue;
    }
    if (c === "/" && next === "*") {
      comment = "block";
      i++;
      continue;
    }
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return src.slice(open + 1, i);
    }
  }
  return null;
}

/** Split an object-literal body on top-level commas. */
function splitTopLevel(body) {
  const parts = [];
  let depth = 0;
  let quote = null;
  let current = "";
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (quote) {
      current += c;
      if (c === "\\") {
        current += body[++i] || "";
      } else if (c === quote) {
        quote = null;
      }
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      quote = c;
      current += c;
      continue;
    }
    if (c === "{" || c === "[" || c === "(") depth++;
    else if (c === "}" || c === "]" || c === ")") depth--;
    if (c === "," && depth === 0) {
      parts.push(current);
      current = "";
      continue;
    }
    current += c;
  }
  parts.push(current);
  return parts;
}

/** Extract `this.t = { ... }` keys and their English defaults from one source file. */
function extractKeys(src) {
  const found = [];
  const re = /this\.t\s*=\s*\{/g;
  let match;
  while ((match = re.exec(src)) !== null) {
    const open = src.indexOf("{", match.index);
    const body = readObjectBody(src, open);
    if (body === null) continue;
    for (const part of splitTopLevel(body)) {
      const keyMatch = part.match(/^\s*["']?([A-Za-z0-9_$]+)["']?\s*:/);
      if (!keyMatch) continue;
      const valueMatch = part.match(/:\s*(["'])((?:\\.|(?!\1).)*)\1/);
      found.push({
        key: keyMatch[1],
        value: valueMatch ? valueMatch[2] : null,
      });
    }
  }
  return found;
}

/** Keys a file reads back off `this.t`, so undeclared reads can be surfaced. */
function extractReads(src) {
  const out = [];
  src.split("\n").forEach((line, i) => {
    for (const m of line.matchAll(/\bthis\.t\s*\??\s*\.\s*([A-Za-z0-9_$]+)/g)) {
      out.push({ key: m[1], line: i + 1 });
    }
    for (const m of line.matchAll(
      /\bthis\.t\s*\??\s*\[\s*["'`]([^"'`]+)["'`]\s*\]/g,
    )) {
      out.push({ key: m[1], line: i + 1 });
    }
  });
  return out;
}

function writeJson(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + "\n", "utf8");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.element || !args.namespace) {
    console.error(
      "Usage: sync-shared-namespace-locales.js --element <dir> --namespace <ns> [--write] [--verbose]",
    );
    process.exit(1);
  }

  const elementDir = path.join(__dirname, "..", "elements", args.element);
  const localesDir = path.join(elementDir, "locales");
  if (!fs.existsSync(localesDir)) {
    console.error("locales directory not found:", localesDir);
    process.exit(1);
  }

  console.log(
    `\n Scanning ${args.element} for namespace "${args.namespace}"...\n`,
  );

  // Only files that actually register this namespace contribute to it.
  const nsPattern = new RegExp(
    `namespace:\\s*["']${args.namespace}["']`,
  );
  const contributors = [];
  const canonical = new Map();
  const reads = new Map();

  for (const file of collectJsFiles(elementDir)) {
    const src = fs.readFileSync(file, "utf8");
    if (!nsPattern.test(src)) continue;
    const keys = extractKeys(src);
    contributors.push({ file, count: keys.length });
    for (const { key, value } of keys) {
      if (!canonical.has(key)) canonical.set(key, value);
    }
    for (const { key, line } of extractReads(src)) {
      if (!reads.has(key)) reads.set(key, `${path.relative(elementDir, file)}:${line}`);
    }
  }

  console.log(`  ${contributors.length} file(s) register this namespace:`);
  for (const c of contributors) {
    console.log(
      `    ${String(c.count).padStart(3)} key(s)  ${path.relative(elementDir, c.file)}`,
    );
  }

  const enFile = path.join(localesDir, `${args.namespace}.en.json`);
  if (!fs.existsSync(enFile)) {
    console.error("\n  reference locale missing:", enFile);
    process.exit(1);
  }
  const en = JSON.parse(fs.readFileSync(enFile, "utf8"));
  const enKeys = Object.keys(en);

  const missingFromEn = [...canonical.keys()].filter((k) => !(k in en));
  const orphansInEn = enKeys.filter((k) => !canonical.has(k));

  console.log(`\n  code keys      : ${canonical.size}`);
  console.log(`  ${args.namespace}.en.json  : ${enKeys.length}`);
  console.log(`  missing from en: ${missingFromEn.length}`);
  console.log(`  orphans in en  : ${orphansInEn.length}`);
  if (args.verbose && missingFromEn.length) {
    console.log("    missing: " + missingFromEn.join(", "));
  }
  if (args.verbose && orphansInEn.length) {
    console.log("    orphans: " + orphansInEn.join(", "));
  }

  // A key read off this.t but never declared resolves to undefined unless some
  // locale file happens to carry it. That is how copiedToClipboard hid for so
  // long: translated locales supplied it, English did not.
  const undeclaredReads = [...reads.keys()].filter((k) => !canonical.has(k));
  if (undeclaredReads.length) {
    console.log(`\n  WARNING: ${undeclaredReads.length} key(s) read but never declared:`);
    for (const k of undeclaredReads) {
      console.log(`    ${k}  (${reads.get(k)})`);
    }
    console.log("    Declare these in the owning component's this.t.");
  }

  // Canonical order: keep en.json's existing order, append genuinely new keys.
  const orderedKeys = enKeys
    .filter((k) => canonical.has(k))
    .concat(missingFromEn);

  const nextEn = {};
  for (const k of orderedKeys) {
    nextEn[k] = k in en ? en[k] : canonical.get(k);
  }

  const localeFiles = fs
    .readdirSync(localesDir)
    .filter(
      (f) => f.startsWith(`${args.namespace}.`) && f.endsWith(".json"),
    )
    .sort();

  let filesChanged = 0;
  let keysRemoved = 0;
  let keysAdded = 0;
  let bytesBefore = 0;
  let bytesAfter = 0;

  for (const name of localeFiles) {
    const file = path.join(localesDir, name);
    const raw = fs.readFileSync(file, "utf8");
    const current = JSON.parse(raw);
    const isReference = name === `${args.namespace}.en.json`;

    const next = {};
    for (const k of orderedKeys) {
      if (k in current) next[k] = current[k];
      else next[k] = isReference ? nextEn[k] : (canonical.get(k) ?? nextEn[k]);
    }

    const removed = Object.keys(current).filter((k) => !(k in next)).length;
    const added = orderedKeys.filter((k) => !(k in current)).length;
    const serialized = JSON.stringify(next, null, 2) + "\n";

    bytesBefore += Buffer.byteLength(raw);
    bytesAfter += Buffer.byteLength(serialized);

    if (serialized !== raw) {
      filesChanged++;
      keysRemoved += removed;
      keysAdded += added;
      if (args.verbose) {
        console.log(`    ${name}: -${removed} +${added}`);
      }
      if (args.write) writeJson(file, next);
    }
  }

  const deltaBytes = bytesAfter - bytesBefore;
  const sign = deltaBytes > 0 ? "+" : "-";
  const savedKb = (Math.abs(deltaBytes) / 1024).toFixed(1);
  const pct =
    bytesBefore > 0
      ? ((Math.abs(deltaBytes) / bytesBefore) * 100).toFixed(1)
      : "0.0";

  console.log(`\n  locale files   : ${localeFiles.length}`);
  console.log(`  files changed  : ${filesChanged}`);
  console.log(`  keys removed   : ${keysRemoved}`);
  console.log(`  keys added     : ${keysAdded}`);
  console.log(
    `  payload        : ${(bytesBefore / 1024).toFixed(1)} KB -> ${(bytesAfter / 1024).toFixed(1)} KB (${sign}${savedKb} KB, ${sign}${pct}%)`,
  );

  if (args.write) {
    console.log("\n  wrote changes to disk.\n");
  } else {
    console.log("\n  dry run; re-run with --write to apply.\n");
  }
}

main();
