/**
 * Minify the CSS inside Lit css`` templates of built JS files, in place.
 *
 * Terser leaves template literal text alone, so every comment and indent in
 * css`` ships. This step removes CSS comments and collapses whitespace, and
 * nothing else (see scripts/lib/minify-css-template.mjs). A template is only
 * rewritten when it passes the strict syntax check and lightningcss agrees the
 * result is equivalent; anything else is left byte for byte as it was.
 * html`` templates are never touched.
 *
 * Meant for build output (the ubiquity build runs it on build/es6 before
 * terser). Do not run it on source in elements/.
 *
 *   node scripts/minify-css-templates.mjs build/es6/node_modules/@haxtheweb
 *   node scripts/minify-css-templates.mjs <dir> --dry-run   report only
 */
import console from "node:console";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { findCssTemplates } from "./lib/css-templates.mjs";
import { minifyTemplate } from "./lib/minify-css-template.mjs";

const argv = process.argv.slice(2);
const DRY = argv.includes("--dry-run");
const dirs = argv.filter((a) => !a.startsWith("--"));
if (!dirs.length) {
  console.error(
    "usage: node scripts/minify-css-templates.mjs <dir> [...dirs] [--dry-run]",
  );
  process.exit(2);
}

function listJs(dir, out, top) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) {
      continue;
    }
    if (entry.isDirectory()) {
      // packages nested under a package's own node_modules are third party
      if (!(entry.name === "node_modules" && dir !== top)) {
        listJs(full, out, top);
      }
    } else if (entry.name.endsWith(".js")) {
      out.push(full);
    }
  }
  return out;
}

const stats = {
  files: 0,
  changedFiles: 0,
  templates: 0,
  minified: 0,
  skipped: {},
  before: 0,
  after: 0,
};
for (const dir of dirs) {
  const top = path.resolve(dir);
  for (const file of listJs(top, [], top)) {
    stats.files += 1;
    const source = fs.readFileSync(file, "utf8");
    if (source.indexOf("css`") === -1) {
      continue;
    }
    const edits = [];
    for (const t of findCssTemplates(source)) {
      stats.templates += 1;
      const res = minifyTemplate(t);
      if (!res.raws) {
        stats.skipped[res.reason] = (stats.skipped[res.reason] || 0) + 1;
        continue;
      }
      stats.minified += 1;
      t.quasis.forEach((q, i) => {
        edits.push({ start: q.start, end: q.end, text: res.raws[i] });
      });
    }
    if (!edits.length) {
      continue;
    }
    edits.sort((a, b) => b.start - a.start);
    let next = source;
    for (const e of edits) {
      next = next.slice(0, e.start) + e.text + next.slice(e.end);
    }
    stats.before += Buffer.byteLength(source);
    stats.after += Buffer.byteLength(next);
    stats.changedFiles += 1;
    if (!DRY) {
      fs.writeFileSync(file, next);
    }
  }
}

const skipped = Object.entries(stats.skipped)
  .map(([k, v]) => `${v} ${k}`)
  .join(", ");
console.log(
  `minify-css-templates${DRY ? " (dry run)" : ""}: ${stats.minified}/${stats.templates} css templates in ${stats.changedFiles} files, ${stats.before - stats.after} bytes saved${skipped ? `; left as is: ${skipped}` : ""}`,
);
