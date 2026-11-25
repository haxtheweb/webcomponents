/**
 * Locale URLs in elements/ must point at a locale file that ships.
 *
 * An element tells the i18n manager where its locales live with
 *   new URL("./locales/<tag>.en.json", import.meta.url).href + "/../"
 * The URL names a real file so bundlers (rollup / vite with
 * @web/rollup-plugin-import-meta-assets) can read it, and "/../" lands back
 * on the locales/ folder, so the fetch is the same as pointing at the folder.
 * Anchor on the English file: it is the one locale file every element
 * commits (feature PRs never add other languages).
 *
 * This check fails on:
 * - a URL that points at the folder itself ("./locales/", `./locales`):
 *   bundlers fail with EISDIR
 * - a URL whose file is not in the repo (an .ar.json the element never
 *   shipped): bundlers fail with ENOENT
 * - a URL that builds the file name at runtime (`../locales/${this.tag}...`):
 *   bundlers cannot resolve it, and this.tag is not set on an instance
 *
 * haxtheweb/issues#3402, haxtheweb/issues#1616
 *
 *   node scripts/locale-url-check.mjs              check every element
 *   node scripts/locale-url-check.mjs elements/foo limit to some paths
 */
import console from "node:console";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKIP_DIRS = new Set([
  "node_modules",
  "test",
  "demo",
  "locales",
  "dist",
  "build",
  "public",
  ".git",
]);
// a string (single, double or backtick quotes) that starts with ./ or ../
// and names a locales folder, resolved against import.meta.url
const LOCALE_URL =
  /new URL\(\s*(["'`])((?:\.\.?\/)+locales(?:\/[^"'`]*)?)\1\s*,\s*import\.meta\.url\s*\)/g;

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) {
        walk(path.join(dir, entry.name), out);
      }
    } else if (entry.name.endsWith(".js")) {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

const args = process.argv.slice(2);
const starts = args.length ? args : ["elements"];
const files = [];
for (const start of starts) {
  const abs = path.resolve(root, start);
  if (!fs.existsSync(abs)) {
    continue;
  }
  if (fs.statSync(abs).isDirectory()) {
    walk(abs, files);
  } else if (abs.endsWith(".js")) {
    files.push(abs);
  }
}

const problems = [];
let checked = 0;
for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(LOCALE_URL)) {
    checked++;
    const rel = match[2];
    const line = source.slice(0, match.index).split("\n").length;
    const where = `${path.relative(root, file)}:${line}`;
    if (rel.includes("${")) {
      problems.push(
        `${where}  builds the file name at runtime ("${rel}"); bundlers cannot resolve it`,
      );
    } else if (!rel.endsWith(".json")) {
      problems.push(`${where}  points at the folder "${rel}"`);
    } else if (!fs.existsSync(path.join(path.dirname(file), rel))) {
      problems.push(`${where}  "${rel}" is not in the repo`);
    }
  }
}

console.log(
  `locale-url-check: ${files.length} files, ${checked} locale URLs, ${problems.length} problem(s)`,
);
if (problems.length) {
  for (const p of problems) {
    console.log(`  ${p}`);
  }
  console.log(
    '\nPoint at the element\'s English locale file and add "/../":\n' +
      '  new URL("./locales/<tag>.en.json", import.meta.url).href + "/../"',
  );
  process.exit(1);
}
