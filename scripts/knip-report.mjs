#!/usr/bin/env node
/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE.md for full text.
 *
 * Runs knip (configured in knip.config.js) and writes a markdown summary:
 * counts per category, then the findings worth acting on first. Advisory:
 * exits 0 whatever knip finds, non-zero only if knip itself could not run.
 *
 *   node scripts/knip-report.mjs [--summary-file out.md] [--json-file out.json]
 *
 * `yarn knip` prints knip's own full report instead.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function parseArgs(argv) {
  const opts = { summaryFile: null, jsonFile: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--summary-file" && i + 1 < argv.length) {
      opts.summaryFile = path.resolve(argv[++i]);
    } else if (argv[i] === "--json-file" && i + 1 < argv.length) {
      opts.jsonFile = path.resolve(argv[++i]);
    } else {
      throw new Error(`unknown option ${argv[i]}`);
    }
  }
  return opts;
}

// Files that never reach someone who installs the package from npm, or
// that only run during development: an undeclared import there cannot break
// an install. Everything else under elements/ ships.
function isDevOnly(file) {
  if (!file.startsWith("elements/")) return true;
  const parts = file.split("/");
  const devDirs = ["demo", "test", "tests", "scripts", "automation"];
  if (parts.some((p) => devDirs.includes(p))) return true;
  const base = parts[parts.length - 1];
  return (
    base.startsWith("gulpfile.") ||
    base.includes(".config.") ||
    base.endsWith("-automation.js")
  );
}

const CATEGORIES = [
  ["unlisted", "Unlisted dependencies (imported, not in that package.json)"],
  ["dependencies", "Unused dependencies"],
  ["devDependencies", "Unused devDependencies"],
  ["files", "Unused files"],
  ["exports", "Unused exports"],
  ["duplicates", "Duplicate exports"],
  ["unresolved", "Unresolved imports"],
  ["binaries", "Unlisted binaries"],
];

const workspaceOf = (file) =>
  file.startsWith("elements/")
    ? file.split("/").slice(0, 2).join("/")
    : "(root)";

function collect(report) {
  const rows = {};
  for (const [key] of CATEGORIES) rows[key] = [];
  for (const issue of report.issues) {
    // knip 6 reports unused files as an issue on the file itself
    if (issue.files && issue.files.length) {
      rows.files.push({ file: issue.file, name: "" });
    }
    for (const [key] of CATEGORIES) {
      if (key === "files" || !Array.isArray(issue[key])) continue;
      for (const item of issue[key]) {
        const names = Array.isArray(item)
          ? item.map((i) => i.name).join(" = ")
          : item.name;
        rows[key].push({ file: issue.file, name: names });
      }
    }
  }
  return rows;
}

function details(title, items, limit = 150) {
  if (!items.length) return [];
  const out = [
    "",
    `<details><summary>${title} (${items.length})</summary>`,
    "",
  ];
  items.slice(0, limit).forEach((r) => {
    out.push(`- \`${r.file}\`${r.name ? ` → \`${r.name}\`` : ""}`);
  });
  if (items.length > limit) {
    out.push(
      `- ...and ${items.length - limit} more (see the knip-report artifact or run \`yarn knip\`)`,
    );
  }
  out.push("", "</details>");
  return out;
}

function summarize(rows) {
  const shipping = rows.unlisted.filter((r) => !isDevOnly(r.file));
  const devUnlisted = rows.unlisted.filter((r) => isDevOnly(r.file));
  const lines = [
    "## Unused code report (knip, advisory)",
    "",
    "| Category | Count |",
    "| --- | --- |",
  ];
  for (const [key, label] of CATEGORIES) {
    lines.push(`| ${label} | ${rows[key].length} |`);
  }
  lines.push(
    `| of which unlisted in shipping code | ${shipping.length} |`,
    "",
    "### Unlisted dependencies in shipping code",
    "",
    "These files are published to npm and import a package their own package.json does not declare, so installing that element from npm can leave the import unresolved. Fix by adding the package to that element's `dependencies`.",
    "",
  );
  if (shipping.length) {
    const byWorkspace = new Map();
    shipping.forEach((r) => {
      const ws = workspaceOf(r.file);
      if (!byWorkspace.has(ws)) byWorkspace.set(ws, new Set());
      byWorkspace.get(ws).add(r.name);
    });
    lines.push("| Package | Missing from its package.json |", "| --- | --- |");
    [...byWorkspace.keys()].sort().forEach((ws) => {
      const missing = [...byWorkspace.get(ws)].sort().map((n) => `\`${n}\``);
      lines.push(`| \`${ws}\` | ${missing.join(", ")} |`);
    });
  } else {
    lines.push("None.");
  }
  lines.push(
    ...details("Unlisted dependencies in shipping code, by file", shipping),
    ...details(
      "Unlisted dependencies in demos, tests and tooling",
      devUnlisted,
    ),
    ...details("Unused dependencies", rows.dependencies),
    ...details("Unused devDependencies", rows.devDependencies),
    ...details("Unused files", rows.files),
    ...details("Unresolved imports", rows.unresolved),
    ...details(
      "Unused exports (often public API by deep import; check before removing)",
      rows.exports,
    ),
    ...details("Duplicate exports", rows.duplicates),
    ...details("Unlisted binaries", rows.binaries),
    "",
    'Elements load by tag at runtime, so knip.config.js treats every file in wc-registry.json as an entry point. If something is reported unused but is loaded some other way, add it to the entries there. See CONTRIBUTING.md, "Unused code report".',
  );
  return lines.join("\n") + "\n";
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const knip = path.join(root, "node_modules", "knip", "bin", "knip.js");
  const res = spawnSync(
    process.execPath,
    [
      knip,
      "--reporter",
      "json",
      "--no-progress",
      "--no-exit-code",
      "--no-config-hints",
    ],
    { cwd: root, encoding: "utf8", maxBuffer: 256 * 1024 * 1024 },
  );
  if (res.status !== 0) {
    process.stderr.write(res.stderr || String(res.error));
    throw new Error(`knip exited with ${res.status}`);
  }
  const report = JSON.parse(res.stdout);
  if (opts.jsonFile)
    fs.writeFileSync(opts.jsonFile, JSON.stringify(report, null, 2));
  const summary = summarize(collect(report));
  if (opts.summaryFile) fs.writeFileSync(opts.summaryFile, summary);
  else process.stdout.write(summary);
}

try {
  main();
} catch (e) {
  console.error(`knip-report: ${e.message}`);
  process.exit(1);
}
