#!/usr/bin/env node
/**
 * Vendor the fonts HAX serves itself (scripts/fonts/hax-fonts.json) into
 * elements/d-d-d/lib/fonts, so DDD, the design system bridges and the
 * themes never load fonts from Google: a site, the CDN build and both
 * backends serve them from the same place as the rest of HAX.
 *
 * For each family it fetches the pinned Fontsource package (`npm pack`, no
 * install, nothing from the package is run), takes the woff2 files for
 * every unicode subset (a browser downloads only the subsets a page uses,
 * as with Google Fonts) and writes:
 *   lib/fonts/<slug>/<slug>.css   @font-face rules under the family's
 *                                 Google Fonts name, so existing
 *                                 font-family stacks keep working
 *   lib/fonts/<slug>/*.woff2      the font files
 *   lib/fonts/<slug>/LICENSE      the font's own license and copyright
 *   lib/fonts/registry.js         family -> CSS file and license, read by
 *                                 d-d-d/lib/fonts.js at run time
 *   lib/fonts/README.md           the list, for people
 *   third-party.json              the vendored fonts, their licenses and
 *                                 license files, read by
 *                                 scripts/copy-dep-licenses.js so each
 *                                 font is listed in THIRD_PARTY_LICENSES.md
 *
 * Only OFL-1.1 and Apache-2.0 fonts are accepted: both ship with HAX and
 * its backends. The committed output is the source of truth; run this only
 * to add a family or move a pin:
 *
 *   node scripts/vendor-fonts.mjs            vendor every family
 *   node scripts/vendor-fonts.mjs --check    exit 1 if the output is stale
 *                                            (no network; compares the
 *                                            registry with the config)
 */
import console from "node:console";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG = path.join(root, "scripts", "fonts", "hax-fonts.json");
const DDD = path.join(root, "elements", "d-d-d");
const OUT = path.join(DDD, "lib", "fonts");
export const FONT_LICENSES = ["OFL-1.1", "Apache-2.0"];

export function fontSlug(family) {
  return family.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function readFontConfig() {
  return JSON.parse(fs.readFileSync(CONFIG, "utf8")).families;
}

// the Fontsource CSS files a family's choice maps to
function cssFiles(entry) {
  if (entry.weights) {
    const out = [];
    entry.weights.forEach((w) => {
      out.push(`${w}.css`);
      if (entry.italic) out.push(`${w}-italic.css`);
    });
    return out;
  }
  const axis = entry.axis || "wght";
  return entry.italic ? [`${axis}.css`, `${axis}-italic.css`] : [`${axis}.css`];
}

// @font-face rules from a Fontsource CSS file, renamed to the Google Fonts
// family and pointed at woff2 files beside the CSS
function rewriteFaces(css, family, slug, files) {
  const out = [];
  const faces = css.match(/@font-face\s*{[^}]*}/g) || [];
  faces.forEach((face) => {
    const src = face.match(/url\(\.\/files\/([^)]+?\.woff2)\)\s*format\(['"]?([a-z0-9-]+)['"]?\)/);
    if (!src) return;
    const file = src[1];
    if (!/^[a-z0-9-]+\.woff2$/.test(file)) {
      throw new Error(`${family}: unexpected file name ${file}`);
    }
    files.add(file);
    const keep = (prop) => {
      const m = face.match(new RegExp(`${prop}\\s*:\\s*([^;]+);`));
      return m ? `  ${prop}: ${m[1].trim()};\n` : "";
    };
    out.push(
      "@font-face {\n" +
        `  font-family: "${family}";\n` +
        keep("font-style") +
        keep("font-display") +
        keep("font-weight") +
        keep("font-stretch") +
        `  src: url(./${file}) format("${src[2]}");\n` +
        keep("unicode-range") +
        "}\n",
    );
  });
  return out;
}

function vendorFamily(entry, scratch) {
  const slug = fontSlug(entry.family);
  const spec = `${entry.package}@${entry.version}`;
  const dir = fs.mkdtempSync(path.join(scratch, `${slug}-`));
  const tgz = execFileSync(
    "npm",
    ["pack", spec, "--silent", "--pack-destination", dir],
    { cwd: dir, encoding: "utf8" },
  )
    .trim()
    .split("\n")
    .pop();
  execFileSync("tar", ["-xzf", path.join(dir, tgz), "-C", dir]);
  const pkg = path.join(dir, "package");
  const meta = JSON.parse(fs.readFileSync(path.join(pkg, "metadata.json"), "utf8"));
  if (meta.family !== entry.family) {
    throw new Error(`${spec} is ${meta.family}, not ${entry.family}`);
  }
  const license = meta.license && meta.license.type;
  if (!FONT_LICENSES.includes(license)) {
    throw new Error(`${entry.family} is ${license}: only ${FONT_LICENSES.join(", ")} ship with HAX`);
  }
  const files = new Set();
  const faces = [];
  cssFiles(entry).forEach((name) => {
    const file = path.join(pkg, name);
    if (!fs.existsSync(file)) {
      throw new Error(`${spec} has no ${name}`);
    }
    faces.push(...rewriteFaces(fs.readFileSync(file, "utf8"), entry.family, slug, files));
  });
  if (!faces.length) {
    throw new Error(`${spec}: no woff2 faces found`);
  }
  const target = path.join(OUT, slug);
  fs.rmSync(target, { recursive: true, force: true });
  fs.mkdirSync(target, { recursive: true });
  files.forEach((file) => {
    fs.copyFileSync(path.join(pkg, "files", file), path.join(target, file));
  });
  fs.copyFileSync(path.join(pkg, "LICENSE"), path.join(target, "LICENSE"));
  const attribution = (meta.license.attribution || "").replace(/\s+/g, " ").trim();
  fs.writeFileSync(
    path.join(target, `${slug}.css`),
    `/* ${entry.family}: ${license}, see LICENSE beside this file.\n` +
      `   ${attribution}\n` +
      `   Google Fonts ${meta.version}, vendored from ${spec} by scripts/vendor-fonts.mjs. */\n` +
      faces.join("\n"),
  );
  let bytes = 0;
  files.forEach((file) => {
    bytes += fs.statSync(path.join(target, file)).size;
  });
  return {
    family: entry.family,
    slug,
    css: `${slug}/${slug}.css`,
    license,
    attribution,
    googleVersion: meta.version,
    source: meta.source || "https://github.com/google/fonts",
    package: spec,
    files: files.size,
    bytes,
  };
}

const HEADER = `/**
 * Copyright ${new Date().getFullYear()} The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Generated by scripts/vendor-fonts.mjs from scripts/fonts/hax-fonts.json:
 * do not edit. The fonts HAX serves itself, by Google Fonts family name:
 * the CSS file under lib/fonts and the font's own license (each font keeps
 * its license, see the LICENSE beside its CSS).
 */
`;

function writeOutputs(results) {
  const registry = {};
  results.forEach((r) => {
    registry[r.family] = { css: r.css, license: r.license };
  });
  fs.writeFileSync(
    path.join(OUT, "registry.js"),
    `${HEADER}export const HAXFontRegistry = ${JSON.stringify(registry, null, 2)};\n`,
  );
  const thirdParty = {
    $comment:
      "Third-party assets vendored into this package, each under its own license (not this package's Apache-2.0). scripts/copy-dep-licenses.js lists them in THIRD_PARTY_LICENSES.md. Fonts: written by scripts/vendor-fonts.mjs.",
    assets: results.map((r) => ({
      name: r.family,
      kind: "font",
      version: `Google Fonts ${r.googleVersion} (${r.package})`,
      license: r.license,
      copyright: r.attribution,
      source: r.source,
      path: `lib/fonts/${r.slug}`,
      licenseFiles: [`lib/fonts/${r.slug}/LICENSE`],
    })),
  };
  fs.writeFileSync(
    path.join(DDD, "third-party.json"),
    JSON.stringify(thirdParty, null, 2) + "\n",
  );
  const total = results.reduce((n, r) => n + r.bytes, 0);
  const rows = results
    .map(
      (r) =>
        `| ${r.family} | ${r.license} | Google Fonts ${r.googleVersion} | \`${r.package}\` | ${r.files} | ${Math.round(r.bytes / 1024)} KB |`,
    )
    .join("\n");
  fs.writeFileSync(
    path.join(OUT, "README.md"),
    `# Fonts HAX serves itself

DDD, the design system bridges and the HAX themes load these fonts from here
instead of Google Fonts, so a HAX site, the CDN build and both backends serve
them alongside the rest of HAX: no visitor's address goes to Google, and
sites work offline and on networks that block Google.

\`lib/fonts.js\` maps a family (or a Google Fonts URL naming it) to the CSS
here; a family that is not listed still loads from Google Fonts. Each font
keeps its own license, in the \`LICENSE\` beside its CSS, and is listed with it
in \`THIRD_PARTY_LICENSES.md\` (from \`third-party.json\`). Only OFL-1.1 and
Apache-2.0 fonts are vendored.

Generated by \`scripts/vendor-fonts.mjs\` from \`scripts/fonts/hax-fonts.json\`:
add a family or move a pin there and run it. Each family carries every unicode
subset as its own woff2 file; a browser downloads only the subsets a page
uses. ${results.length} families, ${(total / 1048576).toFixed(1)} MB in all.

| Family | License | Version | Vendored from | Files | Size |
| --- | --- | --- | --- | --- | --- |
${rows}
`,
  );
}

async function check() {
  const config = readFontConfig();
  const file = path.join(OUT, "registry.js");
  if (!fs.existsSync(file)) {
    console.error("✖ elements/d-d-d/lib/fonts/registry.js is missing: run node scripts/vendor-fonts.mjs");
    return 1;
  }
  const registry = (await import(pathToFileURL(file).href)).HAXFontRegistry;
  const missing = config.filter(
    (e) => !registry[e.family] || !fs.existsSync(path.join(OUT, fontSlug(e.family), `${fontSlug(e.family)}.css`)),
  );
  if (missing.length) {
    console.error(`✖ not vendored yet: ${missing.map((e) => e.family).join(", ")}; run node scripts/vendor-fonts.mjs`);
    return 1;
  }
  console.log(`✔ ${config.length} fonts vendored`);
  return 0;
}

function main() {
  if (process.argv.includes("--check")) {
    return check();
  }
  const config = readFontConfig();
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "hax-fonts-"));
  const results = [];
  try {
    // families no longer in the config leave
    if (fs.existsSync(OUT)) {
      const keep = new Set(config.map((e) => fontSlug(e.family)));
      fs.readdirSync(OUT, { withFileTypes: true }).forEach((d) => {
        if (d.isDirectory() && !keep.has(d.name)) {
          fs.rmSync(path.join(OUT, d.name), { recursive: true, force: true });
        }
      });
    }
    config.forEach((entry) => {
      const r = vendorFamily(entry, scratch);
      console.log(`  ${r.family}: ${r.license}, ${r.files} files, ${Math.round(r.bytes / 1024)} KB`);
      results.push(r);
    });
  } finally {
    fs.rmSync(scratch, { recursive: true, force: true });
  }
  writeOutputs(results);
  // the repo's formatting, so a re-run leaves no churn (the CSS is written
  // in the form stylelint and prettier both leave alone)
  const prettier = path.join(root, "node_modules", "prettier", "bin", "prettier.cjs");
  if (fs.existsSync(prettier)) {
    execFileSync(process.execPath, [
      prettier,
      "--write",
      "--log-level=warn",
      path.join(OUT, "registry.js"),
      path.join(OUT, "README.md"),
      path.join(DDD, "third-party.json"),
    ]);
  }
  const total = results.reduce((n, r) => n + r.bytes, 0);
  console.log(`✔ ${results.length} families vendored, ${(total / 1048576).toFixed(1)} MB`);
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  Promise.resolve(main()).then((code) => process.exit(code));
}
