#!/usr/bin/env node
/**
 * copy-dep-licenses.js
 *
 * Consolidates OSS license attribution for the ubiquity-built node_modules tree
 * into a single THIRD_PARTY_LICENSES.md file that ships with the build.
 *
 * `polymer build` (the first step of the `ubiquity` npm script) copies only the
 * JS/CSS/SVG/source-map files listed in polymer.json `extraDependencies` into
 * build/es6/node_modules. License files and package.json metadata are NOT in
 * that list, so every permissive license's "retain the copyright notice and
 * license text" obligation (MIT s1, BSD s2, Apache-2.0 s4c) would otherwise be
 * silently dropped from the publicly distributed tree.
 *
 * An earlier version of this script restored compliance by copying each
 * package's LICENSE files AND its package.json back into the built tree.
 * Shipping per-package package.json files to the CDN exposed version numbers
 * and other metadata we prefer not to publish, and scattering hundreds of
 * per-package LICENSE files made attribution hard to discover.
 *
 * This version instead writes ONE THIRD_PARTY_LICENSES.md file at the root of
 * the build. It is Markdown so it reads as a page wherever it is shown (the
 * component gallery renders it with md-block) and stays searchable: a package
 * index table, then each license text once, in a fenced code block so its
 * own formatting is kept and nothing in it is read as Markdown or HTML. For every package present in the built tree it records the package
 * name, its location within the build, its SPDX license identifier (read from
 * the source package.json at build time and never shipped), and the full text
 * of that package's license/attribution files. License texts that are
 * byte-identical across packages (e.g. every @haxtheweb/* package shares the
 * same Apache-2.0 LICENSE.md) are printed once and shared by reference, so the
 * file stays small while the "retain the copyright notice and license text"
 * obligation is still satisfied for every package.
 *
 * No per-package package.json or LICENSE files are written into the build.
 *
 * Usage:
 *   node scripts/copy-dep-licenses.js [builtNodeModules] [sourceNodeModules] [outFile]
 *   # defaults:
 *   #   builtNodeModules = build/es6/node_modules
 *   #   sourceNodeModules = node_modules
 *   #   outFile = build/THIRD_PARTY_LICENSES.md  (two levels above builtNodeModules)
 *
 * Standalone, no dependencies. No optional chaining (toolchain constraint).
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.cwd();
const builtDir = path.resolve(
  root,
  process.argv[2] || "build/es6/node_modules",
);
const sourceDir = path.resolve(root, process.argv[3] || "node_modules");

// File names (case-insensitive) treated as license/attribution text to carry.
// Matched at the package root only (not recursively), to avoid dragging in
// nested vendored copies or unrelated NOTICE directories.
const ATTRIBUTION_FILES = [
  "license",
  "license.md",
  "license.txt",
  "licence",
  "licence.md",
  "licence.txt",
  "copying",
  "copying.txt",
  "copying.lesser",
  "notice",
  "notice.md",
];

function exists(p) {
  try {
    fs.statSync(p);
    return true;
  } catch (e) {
    return false;
  }
}

function listDir(p) {
  try {
    return fs.readdirSync(p);
  } catch (e) {
    return null;
  }
}

// Collect attribution files present at the root of a source package dir.
function collectAttribution(srcPkgDir) {
  const entries = listDir(srcPkgDir);
  if (!entries) return [];
  const lower = entries.map((n) => n.toLowerCase());
  const hits = [];
  for (const want of ATTRIBUTION_FILES) {
    const idx = lower.indexOf(want);
    if (idx >= 0) {
      hits.push(entries[idx]); // preserve on-disk casing
    }
  }
  return hits;
}

function readFileText(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch (e) {
    return null;
  }
}

// Read the SPDX license identifier from a source package.json. Build-time only;
// the package.json is never shipped. Returns "" when unknown. Handles `license`
// (string or { type }) and the legacy `licenses` array, without optional
// chaining (toolchain constraint).
function readSpdxLicense(srcPkg) {
  const raw = readFileText(path.join(srcPkg, "package.json"));
  if (!raw) return "";
  try {
    const pkg = JSON.parse(raw);
    if (typeof pkg.license === "string") return pkg.license;
    if (pkg.license && typeof pkg.license === "object" && pkg.license.type) {
      return pkg.license.type;
    }
    if (Array.isArray(pkg.licenses) && pkg.licenses.length) {
      const first = pkg.licenses[0];
      if (typeof first === "string") return first;
      if (first && first.type) return first.type;
    }
  } catch (e) {
    // ignore malformed package.json
  }
  return "";
}

// Some packages in node_modules are yarn-workspace entries that only symlink
// their exported files (package.json, main, lib/) into node_modules - NOT their
// LICENSE files. The real license/attribution text lives in the source tree the
// package.json symlink points at. Resolve that real directory so attribution is
// actually discovered. For normally-installed packages package.json is a real
// file and this returns the package dir unchanged.
function resolveSourceRoot(srcPkg) {
  const pkgJson = path.join(srcPkg, "package.json");
  try {
    return path.dirname(fs.realpathSync(pkgJson));
  } catch (e) {
    return srcPkg;
  }
}

// Resolve a built package path (relative, e.g. "@haxtheweb/foo" or "lit") to its
// source dir. @lrnwebcomponents/* does not exist in source node_modules (it is
// created only in the build as a copy of the @haxtheweb equivalent), so fall
// back to @haxtheweb/<name>.
function resolveSource(relPkg) {
  const direct = path.join(sourceDir, relPkg);
  if (exists(direct)) return direct;
  if (relPkg.indexOf("@lrnwebcomponents/") === 0) {
    const fallback = path.join(
      sourceDir,
      "@haxtheweb",
      relPkg.slice("@lrnwebcomponents/".length),
    );
    if (exists(fallback)) return fallback;
  }
  return null;
}

// Enumerate built package dirs: top-level (lit, jquery, ...) and scoped (@org/name).
function builtPackages() {
  const out = [];
  const top = listDir(builtDir);
  if (!top) return out;
  for (const name of top) {
    if (name.charAt(0) === "@") {
      const scopeDir = path.join(builtDir, name);
      const scoped = listDir(scopeDir);
      if (!scoped) continue;
      for (const sub of scoped) {
        out.push(path.join(name, sub));
      }
    } else if (name.charAt(0) !== ".") {
      out.push(name);
    }
  }
  return out;
}

function main() {
  if (!exists(builtDir)) {
    console.error(
      "copy-dep-licenses: built node_modules not found: " + builtDir,
    );
    process.exit(1);
  }
  if (!exists(sourceDir)) {
    console.error(
      "copy-dep-licenses: source node_modules not found: " + sourceDir,
    );
    process.exit(1);
  }

  const pkgs = builtPackages();
  const buildRoot = path.resolve(builtDir, "..", "..");
  const outFile = path.resolve(
    process.argv[4] || path.join(buildRoot, "THIRD_PARTY_LICENSES.md"),
  );

  // Dedup table: sha1(attribution text) -> { id, spdx, files, text, packages[] }.
  // Identical license texts (e.g. every @haxtheweb Apache-2.0 LICENSE.md) are
  // stored once and referenced from the per-package index.
  const textMap = {};
  const textOrder = [];
  const records = [];
  let missing = 0;
  const missingNames = [];
  let noLicenseFile = 0;
  const noLicenseNames = [];

  for (const rel of pkgs) {
    const srcPkg = resolveSource(rel);
    if (!srcPkg) {
      missing++;
      missingNames.push(rel);
      records.push({
        rel: rel,
        spdx: "",
        textId: 0,
        note: "source package not found in node_modules; no license text available",
      });
      continue;
    }

    const srcRoot = resolveSourceRoot(srcPkg);
    const spdx = readSpdxLicense(srcRoot);
    const attrFiles = collectAttribution(srcRoot);

    if (!attrFiles.length) {
      noLicenseFile++;
      noLicenseNames.push(rel + (spdx ? " (" + spdx + ")" : ""));
      records.push({
        rel: rel,
        spdx: spdx,
        textId: 0,
        note: "no license file found in source package",
      });
      continue;
    }

    // Concatenate this package's attribution files into one block, labeling
    // each file so the consolidated text stays self-describing.
    let text = "";
    for (const file of attrFiles) {
      const body = readFileText(path.join(srcRoot, file));
      if (body === null) continue;
      text += "---- " + file + " ----\n" + body;
      if (body.length && body.charAt(body.length - 1) !== "\n") text += "\n";
    }

    if (!text) {
      noLicenseFile++;
      noLicenseNames.push(rel + (spdx ? " (" + spdx + ")" : ""));
      records.push({
        rel: rel,
        spdx: spdx,
        textId: 0,
        note: "license file(s) found but unreadable in source package",
      });
      continue;
    }

    const key = crypto.createHash("sha1").update(text).digest("hex");
    let entry = textMap[key];
    if (!entry) {
      entry = {
        id: textOrder.length + 1,
        spdx: spdx,
        files: attrFiles.slice(),
        text: text,
        packages: [],
      };
      textMap[key] = entry;
      textOrder.push(entry);
    }
    entry.packages.push(rel);
    records.push({
      rel: rel,
      spdx: spdx,
      textId: entry.id,
      note: "",
    });
  }

  // Stable, readable index order.
  records.sort(function (a, b) {
    return a.rel < b.rel ? -1 : a.rel > b.rel ? 1 : 0;
  });

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  // where every package sits in the build, said once in the file
  const prefix = path.relative(buildRoot, builtDir).split(path.sep).join("/");
  fs.writeFileSync(outFile, buildOutput(records, textOrder, prefix));

  console.log("copy-dep-licenses: scanned " + pkgs.length + " built packages");
  console.log("  consolidated into: " + outFile);
  console.log("  unique license texts: " + textOrder.length);
  console.log(
    "  packages without a license file: " +
      noLicenseFile +
      (noLicenseFile > 0 ? " -> " + noLicenseNames.join(", ") : ""),
  );
  console.log(
    "  missing source package: " +
      missing +
      (missing > 0 ? " -> " + missingNames.join(", ") : ""),
  );
}

// Text for a Markdown table cell: one line, backslashes then pipes escaped,
// so no value can end the cell early or swallow an escape.
function cell(value) {
  return String(value)
    .replace(/\r?\n/g, " ")
    .replace(/\\/g, "\\\\")
    .replace(/\|/g, "\\|");
}

// A code fence longer than any run of backticks in the text, so a license
// that itself contains ``` can't close the block early.
function fenceFor(text) {
  let longest = 0;
  const runs = text.match(/`+/g) || [];
  for (const run of runs) {
    if (run.length > longest) longest = run.length;
  }
  return "`".repeat(Math.max(3, longest + 1));
}

function buildOutput(records, textOrder, prefix) {
  let out = "";

  out += "# Third-party licenses\n\n";
  out +=
    "The open-source license and copyright notices for every package in this " +
    "build of the HAX web component distribution. Every package is at `" +
    prefix +
    "/<package>` in the build. The package index gives each " +
    "package's license and which license text below applies to it. A " +
    "license text that is identical " +
    "across packages is printed once and shared by number. Per-package " +
    "package.json and LICENSE files are intentionally not shipped with the " +
    "build; this file is the attribution record. Each package remains under " +
    "its own license as noted.\n\n";

  out += "## Package index\n\n";
  out += "| Package | License | Attribution |\n";
  out += "| --- | --- | --- |\n";
  for (const r of records) {
    const attribution = r.textId
      ? "License text " + r.textId
      : r.note || "(none)";
    out +=
      "| " +
      cell(r.rel) +
      " | " +
      cell(r.spdx || "(unspecified)") +
      " | " +
      cell(attribution) +
      " |\n";
  }
  out += "\n";

  out += "## License texts\n\n";
  for (const entry of textOrder) {
    const label = entry.spdx || "license text";
    out += "### License text " + entry.id + ": " + label + "\n\n";
    out += "Used by " + entry.packages.join(", ") + ".\n\n";
    out += "Source files: " + entry.files.join(", ") + "\n\n";
    const fence = fenceFor(entry.text);
    out += fence + "text\n" + entry.text;
    if (
      entry.text.length &&
      entry.text.charAt(entry.text.length - 1) !== "\n"
    ) {
      out += "\n";
    }
    out += fence + "\n\n";
  }

  return out;
}

main();
