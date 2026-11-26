#!/usr/bin/env node
/**
 * Theme first-render cost (haxtheweb/issues#3431): for every theme in
 * elements/haxcms-elements/lib/themes.json, the modules its static imports
 * pull in beyond what haxcms-site-builder already loads, and their size.
 * Everything in that closure is downloaded before the theme is defined, so
 * before a visitor sees the page; an import a theme only needs later belongs
 * behind a dynamic import().
 *
 * Report only: nothing fails on it. Reads wc-registry-graph.json (written by
 * the gulp wc-autoloader task) and the files in this checkout.
 *
 *   node scripts/theme-first-render-report.mjs              markdown table
 *   node scripts/theme-first-render-report.mjs --json       machine-readable
 *   node scripts/theme-first-render-report.mjs <tag> ...    those themes, with
 *                                                           their biggest packages
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BUILDER = "@haxtheweb/haxcms-elements/lib/core/haxcms-site-builder.js";

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const only = args.filter((a) => !a.startsWith("--"));

const graph = JSON.parse(
  fs.readFileSync(path.join(ROOT, "wc-registry-graph.json"), "utf8"),
);
const themes = JSON.parse(
  fs.readFileSync(
    path.join(ROOT, "elements/haxcms-elements/lib/themes.json"),
    "utf8",
  ),
);
const index = new Map(graph.paths.map((p, i) => [p, i]));

function closure(entry) {
  const seen = new Set();
  const start = index.get(entry);
  if (start === undefined) {
    return seen;
  }
  const queue = [start];
  while (queue.length) {
    const n = queue.pop();
    if (seen.has(n)) {
      continue;
    }
    seen.add(n);
    for (const next of graph.adj[String(n)] || []) {
      queue.push(next);
    }
  }
  return seen;
}

// a registry path's file in this checkout: @haxtheweb/<pkg>/... lives in
// elements/<pkg>/..., everything else in node_modules
function fileFor(registryPath) {
  const m = /^@haxtheweb\/([^/]+)\/(.+)$/.exec(registryPath);
  const candidates = m
    ? [path.join(ROOT, "elements", m[1], m[2])]
    : [];
  candidates.push(path.join(ROOT, "node_modules", registryPath));
  return candidates.find((f) => fs.existsSync(f)) || null;
}

const sizes = new Map();
function sizeOf(registryPath) {
  if (!sizes.has(registryPath)) {
    const file = fileFor(registryPath);
    if (!file) {
      sizes.set(registryPath, { raw: 0, gz: 0, missing: true });
    } else {
      const buf = fs.readFileSync(file);
      sizes.set(registryPath, {
        raw: buf.length,
        gz: zlib.gzipSync(buf, { level: 9 }).length,
      });
    }
  }
  return sizes.get(registryPath);
}

function pkgOf(registryPath) {
  const parts = registryPath.split("/");
  return registryPath.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

const builder = closure(BUILDER);
const rows = [];
for (const tag of Object.keys(themes).sort()) {
  if (only.length && !only.includes(tag)) {
    continue;
  }
  const entry = String(themes[tag].path || "");
  const all = closure(entry);
  if (!all.size) {
    rows.push({ tag, entry, missing: true });
    continue;
  }
  const extra = [...all].filter((n) => !builder.has(n)).map((n) => graph.paths[n]);
  const packages = new Map();
  let raw = 0;
  let gz = 0;
  for (const p of extra) {
    const s = sizeOf(p);
    raw += s.raw;
    gz += s.gz;
    const k = pkgOf(p);
    const v = packages.get(k) || { modules: 0, gz: 0 };
    v.modules++;
    v.gz += s.gz;
    packages.set(k, v);
  }
  rows.push({
    tag,
    entry,
    modules: extra.length,
    raw,
    gz,
    packages: [...packages]
      .sort((a, b) => b[1].gz - a[1].gz)
      .map(([name, v]) => ({ name, modules: v.modules, gz: v.gz })),
  });
}

if (asJson) {
  console.log(JSON.stringify({ builderModules: builder.size, themes: rows }, null, 2));
} else {
  const kb = (n) => (n / 1024).toFixed(1);
  console.log(
    `Theme first-render cost beyond haxcms-site-builder (${builder.size} modules). Sizes are gzip -9 of the source files.\n`,
  );
  console.log("| Theme | Modules | KB (gzip) | Biggest packages |");
  console.log("|---|---:|---:|---|");
  for (const r of rows.filter((x) => !x.missing).sort((a, b) => b.gz - a.gz)) {
    const top = r.packages
      .slice(0, only.length ? 12 : 3)
      .map((p) => `${p.name} ${kb(p.gz)}`)
      .join(", ");
    console.log(`| ${r.tag} | ${r.modules} | ${kb(r.gz)} | ${top} |`);
  }
  const missing = rows.filter((x) => x.missing).map((x) => x.tag);
  if (missing.length) {
    console.log(`\nNot in wc-registry-graph.json: ${missing.join(", ")}`);
  }
}
