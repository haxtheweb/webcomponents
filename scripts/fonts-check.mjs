#!/usr/bin/env node
/**
 * Vendored fonts gate. Invariants:
 *   - every font family the elements name (in a design system's fonts list
 *     or a bridge's fonts, by family name as the convention is or as a
 *     fonts.googleapis.com URL, or in a loader call or face list) is one
 *     HAX ships in elements/d-d-d/lib/fonts, so no page sends a visitor to
 *     Google for it (d-d-d/lib/fonts.js serves the local copy)
 *   - no HTML in elements links or preconnects to Google Fonts
 *   - every vendored family has its CSS, its own license file, an OFL-1.1
 *     or Apache-2.0 license, and an entry in d-d-d/third-party.json, which
 *     scripts/copy-dep-licenses.js turns into its THIRD_PARTY_LICENSES.md row
 *   - the vendored output matches scripts/fonts/hax-fonts.json
 *   - every @font-face unicode-range claims only code points its woff2 file
 *     can draw, so a page never downloads a subset that draws nothing
 *
 * To ship a new family: add it to scripts/fonts/hax-fonts.json and run
 * node scripts/vendor-fonts.mjs. Run: node scripts/fonts-check.mjs (exit 1
 * on any finding). Used by yarn precheck and the license-check workflow.
 */
import console from "node:console";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { FONT_LICENSES, fontSlug, readFontConfig } from "./vendor-fonts.mjs";
import { parseUnicodeRange, woff2CodePoints } from "./fonts/woff2-cmap.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ELEMENTS = path.join(root, "elements");
const DDD = path.join(ELEMENTS, "d-d-d");
const FONTS = path.join(DDD, "lib", "fonts");
const SKIP_DIRS = new Set(["node_modules", "dist", "build", ".git", "test", "locales"]);
// generated or vendored third-party code, not HAX source
const SKIP_FILE = /\.min\.js$|\/lib\/fonts\//;

function walk(dir, out) {
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) walk(full, out);
    } else if (/\.(js|mjs|json|html|css)$/.test(e.name) && !SKIP_FILE.test(full)) {
      out.push(full);
    }
  }
  return out;
}

// families in a fonts.googleapis.com stylesheet URL (css2 or the old css API)
function urlFamilies(src) {
  const out = [];
  const re = /fonts\.googleapis\.com\/css2?\?([^"'`\s)]+)/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const query = m[1].replace(/&amp;/g, "&");
    query.split("&").forEach((part) => {
      if (part.indexOf("family=") !== 0) return;
      let value = part.slice(7);
      try {
        value = decodeURIComponent(value.replace(/\+/g, " "));
      } catch {
        // keep as written
      }
      value.split("|").forEach((fam) => {
        const name = fam.split(":")[0].trim();
        // a template placeholder is a name built at run time: the loader
        // that builds it goes through fontStylesheetURL
        if (name && name.indexOf("${") === -1) out.push(name);
      });
    });
  }
  return out;
}

// families loaded by name: loader calls, retro-tv program faces and the
// vhs-blog-theme face lists
function namedFamilies(src) {
  const out = [];
  const grab = (re, group) => {
    let m;
    while ((m = re.exec(src)) !== null) out.push(m[group]);
  };
  grab(/\b(?:retroTvLoadFace|vhsBlogLoadFace|loadFontFamily|fontStylesheetURL|haxFontURL)\(\s*["']([^"']+)["']/g, 1);
  // static get faces() { return ["A", "B"]; }
  let m;
  const faces = /static\s+get\s+faces\s*\(\s*\)\s*{\s*return\s*\[([^\]]*)\]/g;
  while ((m = faces.exec(src)) !== null) {
    const inner = m[1].match(/["']([^"']+)["']/g) || [];
    inner.forEach((q) => out.push(q.slice(1, -1)));
  }
  // design system font lists by family name: export const CarbonFonts =
  // ["IBM Plex Sans"], const PortfolioFonts = [...], DDDFonts
  const fontLists = /\b\w*Fonts\s*=\s*\[([^\]]*)\]/g;
  while ((m = fontLists.exec(src)) !== null) {
    (m[1].match(/["']([^"'/]+)["']/g) || []).forEach((q) => out.push(q.slice(1, -1)));
  }
  // const CHROME_FACES = [...] / export const VHS_BLOG_FACES = [["A", 400, ...], ...]
  const lists = /\b(?:CHROME_FACES|VHS_BLOG_FACES)\s*=\s*\[([\s\S]*?)\];/g;
  while ((m = lists.exec(src)) !== null) {
    const body = m[1];
    const rows = body.match(/\[\s*"([^"]+)"/g);
    if (rows) {
      rows.forEach((r) => out.push(r.replace(/^\[\s*"/, "").replace(/"$/, "")));
    } else {
      (body.match(/"([^"]+)"/g) || []).forEach((q) => out.push(q.slice(1, -1)));
    }
  }
  return out;
}

// a bridge's fonts: { "fonts": [{ "family": "IBM Plex Sans", ... }] }
function jsonFamilies(src) {
  try {
    const fonts = JSON.parse(src).fonts;
    return Array.isArray(fonts) ? fonts.map((f) => f && f.family).filter(Boolean) : [];
  } catch {
    return [];
  }
}

async function main() {
  const findings = [];
  const config = readFontConfig();
  let registry = {};
  try {
    // plain data, no imports: safe to load in node
    registry = (await import(pathToFileURL(path.join(FONTS, "registry.js")).href)).HAXFontRegistry;
  } catch (e) {
    findings.push(`d-d-d/lib/fonts/registry.js is missing or unreadable (${e.message}): run node scripts/vendor-fonts.mjs`);
  }
  // the vendored output matches the config
  const configured = new Set(config.map((e) => e.family));
  config.forEach((e) => {
    if (!registry[e.family]) findings.push(`${e.family} is in hax-fonts.json but not vendored: run node scripts/vendor-fonts.mjs`);
  });
  Object.keys(registry).forEach((f) => {
    if (!configured.has(f)) findings.push(`${f} is vendored but not in hax-fonts.json`);
  });
  // each vendored family: CSS, license file, allowed license, third-party.json
  let assets = [];
  try {
    assets = JSON.parse(fs.readFileSync(path.join(DDD, "third-party.json"), "utf8")).assets || [];
  } catch (e) {
    findings.push(`d-d-d/third-party.json is missing or unreadable (${e.message})`);
  }
  Object.keys(registry).forEach((family) => {
    const entry = registry[family];
    const slug = fontSlug(family);
    if (!fs.existsSync(path.join(FONTS, entry.css))) findings.push(`${family}: ${entry.css} is missing`);
    if (!fs.existsSync(path.join(FONTS, slug, "LICENSE"))) findings.push(`${family}: lib/fonts/${slug}/LICENSE is missing`);
    if (!FONT_LICENSES.includes(entry.license)) findings.push(`${family} is ${entry.license}: only ${FONT_LICENSES.join(", ")} ship with HAX`);
    const asset = assets.find((a) => a.kind === "font" && a.name === family);
    if (!asset) {
      findings.push(`${family} is not listed in d-d-d/third-party.json, so THIRD_PARTY_LICENSES.md would not list it`);
    } else if (!(asset.licenseFiles || []).every((f) => fs.existsSync(path.join(DDD, f)))) {
      findings.push(`${family}: a license file third-party.json names is missing`);
    }
    const cssFile = path.join(FONTS, entry.css);
    if (fs.existsSync(cssFile)) {
      (fs.readFileSync(cssFile, "utf8").match(/@font-face\s*{[^}]*}/g) || []).forEach((face) => {
        const src = face.match(/url\(\.\/([a-z0-9-]+\.woff2)\)/);
        const range = face.match(/unicode-range:\s*([^;]+);/);
        if (!src || !range) return;
        const woff2 = path.join(FONTS, slug, src[1]);
        if (!fs.existsSync(woff2)) {
          findings.push(`${family}: ${src[1]} is missing`);
          return;
        }
        const has = woff2CodePoints(woff2);
        const extra = [...parseUnicodeRange(range[1])].filter((c) => !has.has(c)).length;
        if (extra) {
          findings.push(`${family}: ${src[1]}'s unicode-range claims ${extra} code point(s) it has no glyph for: run node scripts/vendor-fonts.mjs --trim`);
        }
      });
    }
  });
  // every family the elements name is vendored; no HTML points at Google
  const named = new Map();
  walk(ELEMENTS, []).forEach((file) => {
    const src = fs.readFileSync(file, "utf8");
    const rel = path.relative(root, file);
    urlFamilies(src)
      .concat(/\.(js|mjs)$/.test(file) ? namedFamilies(src) : [])
      .concat(/(bridge|\.ddd-map)\.json$/.test(file) ? jsonFamilies(src) : [])
      .forEach((family) => {
      if (!named.has(family)) named.set(family, new Set());
      named.get(family).add(rel);
    });
    if (/\.html$/.test(file) && /<link[^>]+href="https:\/\/fonts\.(googleapis|gstatic)\.com/.test(src)) {
      findings.push(`${rel} links or preconnects to Google Fonts: link the family's CSS under d-d-d/lib/fonts instead`);
    }
  });
  named.forEach((files, family) => {
    if (!registry[family]) {
      findings.push(`${family} is not vendored (named in ${[...files].slice(0, 3).join(", ")}): add it to scripts/fonts/hax-fonts.json and run node scripts/vendor-fonts.mjs`);
    }
  });
  findings.forEach((f) => console.log(`✖ ${f}`));
  console.log(
    `${findings.length ? "✖" : "✔"} fonts: ${Object.keys(registry).length} vendored, ${named.size} named in elements, ${findings.length} finding(s)`,
  );
  return findings.length ? 1 : 0;
}

main().then((code) => process.exit(code));
