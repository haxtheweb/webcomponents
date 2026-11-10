/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE.md for full text.
 *
 * knip: unused files, exports and dependencies, plus imports of packages an
 * element does not declare (unlisted dependencies), across the elements/*
 * yarn workspaces. Advisory: `yarn knip` locally, a job summary in CI
 * (.github/workflows/knip.yml). See CONTRIBUTING.md "Unused code report".
 *
 * Elements are mostly loaded by tag at runtime, not imported: the HAX editor
 * and HAXcms autoload a tag's file from wc-registry.json, themes are found by
 * theme discovery, and every file in a package is public (no "exports" map),
 * so another site may deep-import it. Entry points below reflect that:
 *   - each element's main file (package.json "main", picked up by knip)
 *   - lib/*.js, demo/, test/, gulpfile and the element's server/ code
 *   - every file wc-registry.json maps a tag to, for the package it lives in
 * Without the registry entries, files that only HAXcms loads by tag (about
 * twenty in haxcms-elements alone) show up as "unused files".
 */
import fs from "node:fs";
import path from "node:path";

const root = path.dirname(new URL(import.meta.url).pathname);

// generated, vendored or minified files: not ours to trim. Only the ones
// knip would otherwise report are listed (vendored libraries that are loaded
// by path, not imported).
const generated = ["**/dist/**", "**/*.min.js"];
const vendored = {
  "chartist-render": ["lib/chartist*/**"],
  "wave-player": ["lib/**"],
  "moment-element": ["lib/**"],
  "file-system-broker": ["lib/xlsx/**", "lib/mammoth/**"],
  "la-tex": ["lib/latex2html5.js"],
  "music-player": ["lib/html-midi-player.js"],
  "sheet-music": ["lib/alphatab/**"],
};

// tools and build inputs inside an element that are run by path, not
// imported (node scripts, design token build, theme screenshot automation)
const extraEntries = {
  "d-d-d": ["design-system/*.js", "design-system/source/bundle/*.js"],
  "haxcms-elements": ["automation/**/*.js", "*-automation.js"],
};

// package name -> workspace folder, so registry paths map to files; and
// each package's main file, which knip already treats as an entry
const workspaceDir = {};
const mainFile = {};
for (const dir of fs.readdirSync(path.join(root, "elements"))) {
  const pkgFile = path.join(root, "elements", dir, "package.json");
  if (fs.existsSync(pkgFile)) {
    const pkg = JSON.parse(fs.readFileSync(pkgFile, "utf8"));
    workspaceDir[pkg.name] = dir;
    mainFile[dir] = pkg.main;
  }
}

// every file the runtime registry can load by tag, grouped by workspace
const registryEntries = {};
const registry = JSON.parse(
  fs.readFileSync(path.join(root, "wc-registry.json"), "utf8"),
);
for (const file of Object.values(registry)) {
  const parts = file.split("/");
  const dir = workspaceDir[parts.slice(0, 2).join("/")];
  if (dir && parts.slice(2).join("/") !== mainFile[dir]) {
    (registryEntries[dir] = registryEntries[dir] || []).push(
      parts.slice(2).join("/"),
    );
  }
}

/**
 * The JavaScript in an HTML page: inline module scripts as they are, and
 * any script with a src as an import of that src. Plain string search, no
 * regular expression over the page, so no backtracking on odd markup.
 */
// demos load some packages by path ("../../../node_modules/@haxtheweb/x/x.js");
// count that as using the package
function packagePath(src) {
  const at = src.lastIndexOf("node_modules/");
  return at === -1 ? src : src.slice(at + "node_modules/".length);
}

function htmlModuleScripts(text) {
  const out = [];
  const lower = text.toLowerCase();
  let at = 0;
  for (;;) {
    const open = lower.indexOf("<script", at);
    if (open === -1) break;
    const tagEnd = lower.indexOf(">", open);
    if (tagEnd === -1) break;
    const close = lower.indexOf("</script", tagEnd);
    if (close === -1) break;
    const tag = text.slice(open, tagEnd);
    const module = /type\s*=\s*["']?module/i.test(tag);
    const src = /\ssrc\s*=\s*["']([^"']+)["']/i.exec(tag);
    if (src) {
      out.push(`import "${packagePath(src[1])}";`);
    } else if (module) {
      out.push(text.slice(tagEnd + 1, close));
    }
    at = close + 1;
  }
  return out.join("\n");
}

const workspaces = {
  ".": {
    entry: ["scripts/**/*.{js,mjs,cjs}", "*.{js,mjs,cjs}"],
    project: ["scripts/**/*.{js,mjs,cjs}", "*.{js,mjs,cjs}"],
    // loaded by web-test-runner when a script passes --playwright
    ignoreDependencies: ["@web/test-runner-playwright"],
  },
};
// shared entry patterns, kept per workspace only where they match a file
// (knip hints about patterns that match nothing)
const sharedEntries = [
  "lib/*.js",
  "demo/**/*.{js,mjs,html}",
  "test/**/*.{js,mjs}",
  "gulpfile.{cjs,mjs,js}",
  "server/**/*.{js,cjs,mjs}",
  "scripts/**/*.{js,mjs,cjs}",
];
const matches = (dir, pattern) =>
  typeof fs.globSync !== "function" ||
  fs.globSync(pattern, { cwd: path.join(root, "elements", dir) }).length > 0;

for (const dir of Object.values(workspaceDir)) {
  const config = {
    entry: [
      ...sharedEntries.filter((p) => matches(dir, p)),
      ...(extraEntries[dir] || []),
      ...(registryEntries[dir] || []),
    ],
    project: ["**/*.{js,mjs,cjs}"],
  };
  if (matches(dir, "demo/**/*.html")) {
    config.project.push("demo/**/*.html");
  }
  if (vendored[dir]) {
    config.ignore = vendored[dir];
  }
  workspaces[`elements/${dir}`] = config;
}

export default {
  workspaces,
  ignore: generated,
  // `yarn audit` in a workflow, read as a binary named audit
  ignoreBinaries: ["audit"],
  // demo pages load elements with <script type="module">; read those so
  // what a demo uses counts as used
  compilers: { html: htmlModuleScripts },
};
