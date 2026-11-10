/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE.md for full text.
 *
 * Rule: an element's "dependencies" hold only what its shipped code needs
 * at runtime. Build, test and release tooling (Babel, Rollup, the dev
 * server and test runner, lerna, lint-staged, the HAX CLI...) belongs in
 * "devDependencies"; anything under "dependencies" is installed by every
 * site and app that installs the element from npm.
 *
 * Blocking: nothing is baselined, so a failure is new. Move the package to
 * devDependencies (same version) instead of allowing it here.
 *
 *   node scripts/runtime-deps-check.mjs                     every element
 *   node scripts/runtime-deps-check.mjs elements/x/package.json   only these manifests
 */
import console from "node:console";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Package names (exact) and scopes or prefixes (ending in / or -) that are
// tooling. Each entry names what it is so the list stays reviewable.
const TOOLING = [
  "@babel/", // compiler and presets (rollup.config.js)
  "babel-plugin-",
  "@rollup/", // bundler plugins
  "rollup",
  "rollup-plugin-",
  "@web/dev-server",
  "@web/dev-server-esbuild",
  "@web/test-runner",
  "@web/test-runner-",
  "@web/rollup-plugin-",
  "@open-wc/building-",
  "@open-wc/testing",
  "@custom-elements-manifest/", // custom-elements.json generation
  "@haxtheweb/create", // the HAX CLI
  "commit-and-tag-version",
  "concurrently",
  "esbuild",
  "eslint",
  "eslint-",
  "gulp",
  "gulp-",
  "husky",
  "lerna",
  "lint-staged",
  "prettier",
  "rimraf",
  "stylelint",
  "stylelint-",
];

const isTooling = (name) =>
  TOOLING.some((t) =>
    t.endsWith("/") || t.endsWith("-") ? name.startsWith(t) : name === t,
  );

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const manifests = args.length
  ? args.filter((a) => /(^|\/)elements\/[^/]+\/package\.json$/.test(a))
  : fs
      .readdirSync(path.join(root, "elements"))
      .map((d) => `elements/${d}/package.json`)
      .filter((f) => fs.existsSync(path.join(root, f)));

const problems = [];
for (const file of manifests) {
  const abs = path.join(root, file);
  if (!fs.existsSync(abs)) continue;
  const pkg = JSON.parse(fs.readFileSync(abs, "utf8"));
  for (const [name, version] of Object.entries(pkg.dependencies || {})) {
    if (isTooling(name)) {
      problems.push({ file, name, version });
    }
  }
}

problems.forEach((p) =>
  console.log(
    `${p.file}: "${p.name}": "${p.version}" is build/test tooling; move it to devDependencies`,
  ),
);
console.log(
  `runtime-deps-check: ${manifests.length} manifest(s), ${problems.length} tooling package(s) in dependencies`,
);
process.exit(problems.length ? 1 : 0);
