#!/usr/bin/env node
/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE.md for full text.
 *
 * Report-only size delta for elements (haxtheweb/issues#3283 defers budgets
 * until the platform is stable; this is the measurement they will use).
 *
 * HAX serves elements as unbundled ES modules and we don't tree shake, so
 * what a page downloads for a tag is every file in that tag's eager import
 * closure: static `import` / `export ... from`, not `import()`, which loads
 * later and only when needed. Each file travels on its own, so the
 * transfer size is the sum of each file's gzip size, which is what this
 * reports (raw bytes too). Only files in this repo count: third-party
 * packages (lit, mobx...) are shared by everything and left out.
 *
 * Entries measured: every element package's main file and every file
 * wc-registry.json maps a tag to.
 *
 *   node scripts/size-report.mjs --json sizes.json            measure this checkout
 *   node scripts/size-report.mjs --root ../base --json base.json   measure another checkout
 *   node scripts/size-report.mjs --compare base.json sizes.json [--summary-file out.md]
 *                                                             markdown delta of what changed
 *
 * Always exits 0 unless it cannot run: it reports, it never gates.
 */
import console from "node:console";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";

const scriptRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const argv = process.argv.slice(2);
const opt = (name) => {
  const i = argv.indexOf(name);
  return i === -1 ? null : argv[i + 1];
};

// ---------------------------------------------------------------------------
// measure
// ---------------------------------------------------------------------------
function measure(root) {
  const EL = path.join(root, "elements");
  const pkgDir = {};
  const pkgMain = {};
  for (const dir of fs.readdirSync(EL)) {
    const pj = path.join(EL, dir, "package.json");
    if (fs.existsSync(pj)) {
      const meta = JSON.parse(fs.readFileSync(pj, "utf8"));
      pkgDir[meta.name] = dir;
      pkgMain[dir] = meta.module || meta.main || `${dir}.js`;
    }
  }

  const exists = (rel) => fs.existsSync(path.join(root, rel));
  function resolveSpec(fromRel, spec) {
    let target;
    if (spec.startsWith(".")) {
      target = path.posix.join(path.posix.dirname(fromRel), spec);
    } else {
      const m = /^(@[^/]+\/[^/]+)(\/.*)?$/.exec(spec);
      if (!m || !pkgDir[m[1]]) return null; // third party: not counted
      const dir = pkgDir[m[1]];
      target = `elements/${dir}/${m[2] ? m[2].slice(1) : pkgMain[dir]}`;
    }
    if (!target.endsWith(".js") && exists(target + ".js")) target += ".js";
    return exists(target) ? target : null;
  }

  // static import specifiers, from the source with comments removed. A
  // string scan (no regex over whole statements) so odd code cannot make it
  // backtrack; good enough for a report.
  function staticImports(src) {
    const code = src
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/(^|[^:\\])\/\/[^\n]*/g, "$1");
    const out = [];
    const re =
      /(?:^|[;\n}])\s*(?:import|export)\s*(?:[\w$*{},\s]*?\bfrom\s*)?["']([^"'\n]+)["']/g;
    let m;
    while ((m = re.exec(code))) out.push(m[1]);
    return out;
  }

  const fileInfo = new Map();
  function info(rel) {
    if (!fileInfo.has(rel)) {
      const buf = fs.readFileSync(path.join(root, rel));
      fileInfo.set(rel, {
        raw: buf.length,
        gzip: zlib.gzipSync(buf, { level: 9 }).length,
        deps: staticImports(buf.toString("utf8"))
          .map((s) => resolveSpec(rel, s))
          .filter(Boolean),
      });
    }
    return fileInfo.get(rel);
  }

  function closure(entry) {
    const seen = new Set();
    const stack = [entry];
    while (stack.length) {
      const f = stack.pop();
      if (seen.has(f)) continue;
      seen.add(f);
      for (const d of info(f).deps) stack.push(d);
    }
    let raw = 0;
    let gzip = 0;
    for (const f of seen) {
      raw += info(f).raw;
      gzip += info(f).gzip;
    }
    return { files: seen.size, raw, gzip };
  }

  const entries = new Map();
  for (const dir of Object.values(pkgDir)) {
    const main = `elements/${dir}/${pkgMain[dir]}`;
    if (exists(main)) entries.set(main, []);
  }
  const regFile = path.join(root, "wc-registry.json");
  if (fs.existsSync(regFile)) {
    for (const [tag, spec] of Object.entries(
      JSON.parse(fs.readFileSync(regFile, "utf8")),
    )) {
      const file = resolveSpec("elements/x.js", spec);
      if (file) {
        if (!entries.has(file)) entries.set(file, []);
        entries.get(file).push(tag);
      }
    }
  }

  const result = {};
  for (const [file, tags] of [...entries].sort()) {
    result[file] = { tags: tags.sort(), ...closure(file) };
  }
  return result;
}

// ---------------------------------------------------------------------------
// compare
// ---------------------------------------------------------------------------
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const signed = (n) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${kb(Math.abs(n))}`;
const pct = (d, b) =>
  b
    ? `${d > 0 ? "+" : d < 0 ? "−" : ""}${Math.abs((d / b) * 100).toFixed(1)}%`
    : "new";

function compare(base, head, limit = 40) {
  const rows = [];
  for (const file of new Set([...Object.keys(base), ...Object.keys(head)])) {
    const b = base[file];
    const h = head[file];
    const gzipDelta = (h ? h.gzip : 0) - (b ? b.gzip : 0);
    const rawDelta = (h ? h.raw : 0) - (b ? b.raw : 0);
    if (rawDelta === 0 && gzipDelta === 0) continue;
    rows.push({ file, b, h, gzipDelta, rawDelta });
  }
  rows.sort((x, y) => Math.abs(y.gzipDelta) - Math.abs(x.gzipDelta));
  const grew = rows.filter((r) => r.gzipDelta > 0).length;
  const shrank = rows.filter((r) => r.gzipDelta < 0).length;
  const lines = [
    "## Element size (report only)",
    "",
    "What a page downloads for each element: the gzip size of every file in its eager import closure (HAX serves unbundled modules; third-party packages like lit are not counted). Budgets are deferred (haxtheweb/issues#3283); this never fails the build.",
    "",
  ];
  if (!rows.length) {
    lines.push("No element's download size changed.");
  } else {
    lines.push(
      `${rows.length} element entr${rows.length === 1 ? "y" : "ies"} changed: ${grew} grew, ${shrank} shrank.`,
      "",
      "| Entry | Tags | gzip (base → PR) | Δ gzip | Δ raw | Files |",
      "| --- | --- | --- | --- | --- | --- |",
    );
    for (const r of rows.slice(0, limit)) {
      const tags = (r.h || r.b).tags;
      const tagText = tags.length
        ? tags
            .slice(0, 3)
            .map((t) => `\`${t}\``)
            .join(" ") + (tags.length > 3 ? ` +${tags.length - 3}` : "")
        : "";
      lines.push(
        `| \`${r.file.replace(/^elements\//, "")}\` | ${tagText} | ${r.b ? kb(r.b.gzip) : "—"} → ${r.h ? kb(r.h.gzip) : "removed"} | ${signed(r.gzipDelta)} (${pct(r.gzipDelta, r.b ? r.b.gzip : 0)}) | ${signed(r.rawDelta)} | ${r.b ? r.b.files : 0} → ${r.h ? r.h.files : 0} |`,
      );
    }
    if (rows.length > limit) {
      lines.push(
        "",
        `…and ${rows.length - limit} more (see the size-report artifact).`,
      );
    }
  }
  return lines.join("\n") + "\n";
}

// ---------------------------------------------------------------------------
// cli
// ---------------------------------------------------------------------------
const compareIdx = argv.indexOf("--compare");
if (compareIdx !== -1) {
  const basePath = argv[compareIdx + 1];
  const headPath = argv[compareIdx + 2];
  if (!basePath || !headPath) {
    console.error("usage: --compare <base.json> <head.json>");
    process.exit(2);
  }
  const md = compare(
    JSON.parse(fs.readFileSync(basePath, "utf8")),
    JSON.parse(fs.readFileSync(headPath, "utf8")),
  );
  const summary = opt("--summary-file");
  if (summary) fs.writeFileSync(summary, md);
  console.log(md);
} else {
  const root = path.resolve(opt("--root") || scriptRoot);
  const sizes = measure(root);
  const out = opt("--json");
  if (out) fs.writeFileSync(out, JSON.stringify(sizes, null, 1) + "\n");
  const list = Object.entries(sizes);
  const top = list.sort((a, b) => b[1].gzip - a[1].gzip).slice(0, 10);
  console.log(`size-report: ${list.length} entries measured in ${root}`);
  for (const [file, s] of top) {
    console.log(
      `  ${kb(s.gzip).padStart(10)} gzip  ${kb(s.raw).padStart(10)} raw  ${String(s.files).padStart(4)} files  ${file}`,
    );
  }
}
