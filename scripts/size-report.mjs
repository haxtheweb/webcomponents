#!/usr/bin/env node
/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE.md for full text.
 *
 * Size report and per-element size budgets (haxtheweb/issues#3283).
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
 * Each entry also gets an "own" size: the entry file plus the files of its
 * own element folder it statically imports (its lib/ files), raw and gzip.
 * Anything shared (lit, d-d-d, every other HAX package) is left out
 * of it, so a change to a shared file moves one number, not hundreds. The
 * budgets in scripts/size-budgets.json are on that own size.
 *
 *   node scripts/size-report.mjs --json sizes.json            measure this checkout
 *   node scripts/size-report.mjs --root ../base --json base.json   measure another checkout
 *   node scripts/size-report.mjs --compare base.json sizes.json [--summary-file out.md]
 *                                                             markdown delta of what changed
 *   node scripts/size-report.mjs --check-budgets [--changed-from base.json] [--summary-file out.md]
 *                                                             own size against the budgets
 *   node scripts/size-report.mjs --update-budgets elements/video-player
 *                                                             raise (or set) budgets on purpose
 *
 * --check-budgets exits 1 when an entry is over its budget, and only then.
 * With --changed-from it only looks at entries whose own size differs from
 * that measurement (what a pull request touched). An entry with no budget
 * yet is listed, never failed.
 *
 * --update-budgets sets the budget of every entry under the paths given
 * (an element folder or one entry file) to its current own size plus
 * headroom; with no path it regenerates the whole file. Commit the result
 * in the same pull request as the growth it allows.
 *
 * The other modes exit 0 unless they cannot run: they report, never gate.
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

const BUDGETS_FILE = "scripts/size-budgets.json";
// headroom over the measured size when a budget is written: 10%, and at
// least 2 KB raw / 1 KB gzip so a small element can take a real change
const HEADROOM = { pct: 0.1, raw: 2048, gzip: 1024 };

const argv = process.argv.slice(2);
const opt = (name) => {
  const i = argv.indexOf(name);
  const v = i === -1 ? null : argv[i + 1];
  return v && !v.startsWith("--") ? v : null;
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
    // own: the entry and what it imports from its own element folder,
    // followed only through that folder
    const dir = entry.split("/").slice(0, 2).join("/") + "/";
    const own = new Set();
    const ownStack = [entry];
    while (ownStack.length) {
      const f = ownStack.pop();
      if (own.has(f)) continue;
      own.add(f);
      for (const d of info(f).deps) {
        if (d.startsWith(dir)) ownStack.push(d);
      }
    }
    const ownSize = { files: own.size, raw: 0, gzip: 0 };
    for (const f of own) {
      ownSize.raw += info(f).raw;
      ownSize.gzip += info(f).gzip;
    }
    return { files: seen.size, raw, gzip, own: ownSize };
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
    "What a page downloads for each element: the gzip size of every file in its eager import closure (HAX serves unbundled modules; third-party packages like lit are not counted). This part never fails the build; the budgets below are on each entry's own size.",
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
// budgets
// ---------------------------------------------------------------------------
const withHeadroom = (n, floor) =>
  Math.ceil((n + Math.max(n * HEADROOM.pct, floor)) / 100) * 100;

function readBudgets(file) {
  if (!fs.existsSync(file)) return {};
  return JSON.parse(fs.readFileSync(file, "utf8")).budgets || {};
}

/** set budgets from the measured sizes; `only` limits it to some paths */
function updateBudgets(file, sizes, only) {
  const wanted = only.map((p) =>
    p.split(path.sep).join("/").replace(/\/+$/, ""),
  );
  const match = (entry) =>
    !wanted.length ||
    wanted.some((w) => entry === w || entry.startsWith(w + "/"));
  // a full regeneration also drops entries that no longer exist
  const budgets = wanted.length ? readBudgets(file) : {};
  let changed = 0;
  for (const [entry, s] of Object.entries(sizes)) {
    if (!match(entry)) continue;
    budgets[entry] = {
      raw: withHeadroom(s.own.raw, HEADROOM.raw),
      gzip: withHeadroom(s.own.gzip, HEADROOM.gzip),
    };
    changed += 1;
  }
  const sorted = {};
  for (const key of Object.keys(budgets).sort()) sorted[key] = budgets[key];
  const about =
    "Byte budgets for each element entry's own size: the entry file plus the files of its own element folder it statically imports. Shared packages are not counted. Raise one on purpose with: node scripts/size-report.mjs --update-budgets elements/<name>";
  fs.writeFileSync(
    file,
    JSON.stringify({ about, budgets: sorted }, null, 2) + "\n",
  );
  return changed;
}

/** @returns {{md: string, over: number}} */
function checkBudgets(sizes, budgets, base) {
  const rows = [];
  const missing = [];
  let checked = 0;
  for (const [entry, s] of Object.entries(sizes)) {
    if (base) {
      const b = base[entry] && base[entry].own;
      if (b && b.raw === s.own.raw && b.gzip === s.own.gzip) continue;
    }
    const budget = budgets[entry];
    if (!budget) {
      missing.push(entry);
      continue;
    }
    checked += 1;
    const over = s.own.raw > budget.raw || s.own.gzip > budget.gzip;
    if (over || base) rows.push({ entry, s: s.own, budget, over });
  }
  rows.sort(
    (x, y) => Number(y.over) - Number(x.over) || x.entry.localeCompare(y.entry),
  );
  const over = rows.filter((r) => r.over);
  const lines = [
    "## Element size budgets",
    "",
    `Each entry's own size (its file plus what it imports from its own element folder; shared packages are not counted) against \`${BUDGETS_FILE}\`.`,
    "",
  ];
  if (!rows.length) {
    lines.push(
      base
        ? "No budgeted entry changed its own size."
        : `All ${checked} budgeted entries are within budget.`,
    );
  } else {
    lines.push(
      `${checked} entr${checked === 1 ? "y" : "ies"} checked, ${over.length} over budget.`,
      "",
      "| Entry | raw (size / budget) | gzip (size / budget) | Status |",
      "| --- | --- | --- | --- |",
    );
    for (const r of rows.slice(0, 60)) {
      lines.push(
        `| \`${r.entry.replace(/^elements\//, "")}\` | ${kb(r.s.raw)} / ${kb(r.budget.raw)} | ${kb(r.s.gzip)} / ${kb(r.budget.gzip)} | ${r.over ? "**over budget**" : "within budget"} |`,
      );
    }
    if (rows.length > 60) lines.push("", `…and ${rows.length - 60} more.`);
  }
  if (over.length) {
    lines.push(
      "",
      "If the growth is intended, raise the budget in this pull request and commit the file:",
      "",
      "```",
      `node scripts/size-report.mjs --update-budgets ${[
        ...new Set(over.map((r) => r.entry.split("/").slice(0, 2).join("/"))),
      ].join(" ")}`,
      "```",
    );
  }
  if (missing.length) {
    lines.push(
      "",
      `No budget yet for ${missing.length} entr${missing.length === 1 ? "y" : "ies"} (not a failure): ${missing
        .slice(0, 10)
        .map((m) => `\`${m.replace(/^elements\//, "")}\``)
        .join(
          ", ",
        )}${missing.length > 10 ? "…" : ""}. Add with \`node scripts/size-report.mjs --update-budgets <path>\`.`,
    );
  }
  return { md: lines.join("\n") + "\n", over: over.length };
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
} else if (argv.includes("--update-budgets")) {
  const root = path.resolve(opt("--root") || scriptRoot);
  const only = argv
    .slice(argv.indexOf("--update-budgets") + 1)
    .filter((a, i, rest) => !a.startsWith("--") && rest[i - 1] !== "--root");
  const file = path.join(root, BUDGETS_FILE);
  const count = updateBudgets(file, measure(root), only);
  if (!count) {
    console.error(`size-report: no entry under ${only.join(", ")}`);
    process.exit(2);
  }
  console.log(`size-report: ${count} budget(s) written to ${BUDGETS_FILE}`);
} else if (argv.includes("--check-budgets")) {
  const root = path.resolve(opt("--root") || scriptRoot);
  const basePath = opt("--changed-from");
  const { md, over } = checkBudgets(
    measure(root),
    readBudgets(path.join(root, BUDGETS_FILE)),
    basePath ? JSON.parse(fs.readFileSync(basePath, "utf8")) : null,
  );
  const summary = opt("--summary-file");
  if (summary) fs.writeFileSync(summary, md);
  console.log(md);
  process.exit(over ? 1 : 0);
} else {
  const root = path.resolve(opt("--root") || scriptRoot);
  const sizes = measure(root);
  const out = opt("--json");
  if (out) fs.writeFileSync(out, JSON.stringify(sizes, null, 1) + "\n");
  const list = Object.entries(sizes);
  const top = list.sort((a, b) => b[1].gzip - a[1].gzip).slice(0, 10);
  console.log(`size-report: ${list.length} entries measured in ${root}`);
  console.log("largest download (eager import closure):");
  for (const [file, s] of top) {
    console.log(
      `  ${kb(s.gzip).padStart(10)} gzip  ${kb(s.raw).padStart(10)} raw  ${String(s.files).padStart(4)} files  ${file}`,
    );
  }
  console.log("largest own size (what the budgets are on):");
  for (const [file, s] of list
    .sort((a, b) => b[1].own.raw - a[1].own.raw)
    .slice(0, 10)) {
    console.log(
      `  ${kb(s.own.gzip).padStart(10)} gzip  ${kb(s.own.raw).padStart(10)} raw  ${String(s.own.files).padStart(4)} files  ${file}`,
    );
  }
}
