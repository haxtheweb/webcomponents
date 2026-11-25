#!/usr/bin/env node
/**
 * Legacy @lrnwebcomponents module shim for a ubiquity build.
 *
 * Sites built before the @haxtheweb rename can ship code compiled against the
 * old scope: a site's custom/build/custom.es6.js, or a third-party element it
 * bundled, imports paths like
 *   ../../build/es6/node_modules/@lrnwebcomponents/simple-toast/simple-toast.js
 * When such a site is rebuilt or republished with a current build, that
 * folder is gone and the whole module fails to load. Everything that has been
 * made has to keep working, so the build answers those paths.
 *
 * Invariants:
 * - Every .js module under es6/node_modules/@haxtheweb/<pkg>/ gets a module at
 *   the same path under es6/node_modules/@lrnwebcomponents/<pkg>/ that only
 *   re-exports it: `export * from "<relative path>"`, plus the default export
 *   when the real module has one.
 * - A stub never holds code. The browser keys modules by URL, so a copy or a
 *   server rewrite would load the real file a second time and its
 *   customElements.define would throw; a re-export shares the one instance.
 * - Paths that already exist under @lrnwebcomponents (the full copies of
 *   wc-autoload and dynamic-import-registry the build makes for old site
 *   boilerplate) are left as they are.
 * - Only .js modules are shimmed: old code imports modules, never assets.
 *
 *   node scripts/legacy-scope-shim.mjs [--build build]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const buildAt = args.indexOf("--build");
const build = path.resolve(buildAt > -1 ? args[buildAt + 1] : "build");
const modules = path.join(build, "es6", "node_modules");
const from = path.join(modules, "@haxtheweb");
const to = path.join(modules, "@lrnwebcomponents");

// a default export in source or minified form: `export default ...` or
// `export { x as default }` / `export{x as default}`
const DEFAULT_EXPORT = /\bexport\s+default\b|\bexport\s*\{[^}]*\bas\s+default\b[^}]*\}/;

/**
 * The text of one stub module for the real module at `real`, written to `stub`.
 * @param {string} real absolute path of the @haxtheweb module
 * @param {string} stub absolute path the stub is written to
 * @param {string} source the real module's text
 * @returns {string}
 */
export function stubFor(real, stub, source) {
  let rel = path.relative(path.dirname(stub), real).split(path.sep).join("/");
  if (!rel.startsWith(".")) {
    rel = `./${rel}`;
  }
  const spec = JSON.stringify(rel);
  return (
    `export * from ${spec};\n` +
    (DEFAULT_EXPORT.test(source) ? `export { default } from ${spec};\n` : "")
  );
}

/**
 * Write a stub for every module under `fromDir` into `toDir`.
 * @param {string} fromDir the @haxtheweb scope folder
 * @param {string} toDir the @lrnwebcomponents scope folder
 * @returns {{ written: number, kept: number }}
 */
export function writeShim(fromDir, toDir) {
  let written = 0;
  let kept = 0;
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const real = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(real);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith(".js")) {
        continue;
      }
      const stub = path.join(toDir, path.relative(fromDir, real));
      if (fs.existsSync(stub)) {
        kept++;
        continue;
      }
      fs.mkdirSync(path.dirname(stub), { recursive: true });
      fs.writeFileSync(
        stub,
        stubFor(real, stub, fs.readFileSync(real, "utf8")),
      );
      written++;
    }
  };
  walk(fromDir);
  return { written, kept };
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  if (!fs.existsSync(from)) {
    console.error(`legacy-scope-shim: no ${from}; run it after polymer build`);
    process.exit(1);
  }
  const { written, kept } = writeShim(from, to);
  console.log(
    `legacy-scope-shim: ${written} @lrnwebcomponents stub module(s) written, ${kept} existing file(s) kept`,
  );
}
