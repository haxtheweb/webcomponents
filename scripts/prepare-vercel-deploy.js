#!/usr/bin/env node

/**
 * Prepares demo and gallery HTML files for static hosting on Vercel.
 *
 * Locally, demos rely on @web/dev-server to resolve bare module specifiers
 * (e.g. import "@haxtheweb/demo-snippet/demo-snippet.js") and to serve files
 * from node_modules. On Vercel's static hosting there is no module-resolution
 * middleware and node_modules is excluded from the upload, so those references
 * break.
 *
 * A preview deploy exists to review the code in the branch, so every
 * @haxtheweb package is served from this deploy's own /elements/ folder (each
 * package name matches its folder) and only third-party libraries come from
 * the HAX CDN. Everything resolves to ONE url per module: a bare import, a
 * wc-autoload import under /node_modules/ and a demo's ./node_modules/ path
 * all land on /elements/<name>/..., so no element is defined twice and no
 * store (haxcms-site-store, HAXStore) is loaded twice.
 *
 * This script runs in the Vercel build environment (after yarn build-gallery)
 * and patches the generated gallery + every demo HTML in place:
 *
 *  1. Injects an <script type="importmap"> built from the bare specifiers the
 *     elements actually import (scanned below), so a new third-party
 *     dependency does not silently break the preview.
 *  2. Rewrites src="...node_modules/..." and href="...node_modules/..." paths:
 *     @haxtheweb ones to /elements/, everything else to the CDN.
 *
 * Non-module requests under /node_modules/ (json, css, svg fetched at run
 * time) are handled by the matching rewrites in vercel.json. So are the
 * paths elements build by climbing out of their own folder to where
 * node_modules would be (lunr-search, hax-store, code-editor...): on this
 * deploy that is the site root, so /@haxtheweb/... goes to /elements/ and
 * any other missing top-level path (/lunr/lunr.js) goes to the CDN. Vercel
 * only applies a rewrite when no file matches, so real files are untouched.
 *
 * Source files in git are NOT affected — this only modifies the ephemeral
 * build-environment copies.
 */

/* global require, console */
const fs = require("fs");
const path = require("path");

const CDN_BASE = "https://cdn.hax.cloud/cdn/build/es6/node_modules/";
const ELEMENTS = "/elements/";
const elementsDir = "./elements";

// --- the @haxtheweb packages in this repo ---
var workspace = {};
fs.readdirSync(elementsDir, { withFileTypes: true }).forEach(function (d) {
  if (!d.isDirectory()) return;
  var pkgFile = path.join(elementsDir, d.name, "package.json");
  if (!fs.existsSync(pkgFile)) return;
  try {
    var name = JSON.parse(fs.readFileSync(pkgFile, "utf8")).name;
    if (name) workspace[name] = d.name;
  } catch {
    // not a package
  }
});

// --- bare specifiers the element source imports ---
var SKIP_DIRS = ["node_modules", "test", "dist", "build", "demo", ".git"];
var IMPORT_RE =
  /(?:^|[\s;}])(?:import|export)\s[^"'`;]*?from\s*["']([^"'\s]+)["']|(?:^|[\s;}])import\s*["']([^"'\s]+)["']|import\(\s*["']([^"'\s]+)["']\s*\)/g;
// build tooling that runs in node, not in the browser
var BUILD_FILE_RE = /(^|[.-])(config|build|gulpfile|rollup|server)([.-]|$)/;
// files that import node built-ins are scripts, not browser code
var NODE_ONLY_RE =
  /(from\s*|require\(\s*)["'](node:)?(fs|path|os|url|child_process|fs\/promises)["']/;
var PKG_NAME_RE = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;
var specifiers = {};
function scan(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(function (e) {
    if (SKIP_DIRS.indexOf(e.name) !== -1) return;
    var file = path.join(dir, e.name);
    if (e.isDirectory()) {
      scan(file);
    } else if (/\.m?js$/.test(e.name) && !BUILD_FILE_RE.test(e.name)) {
      var src = fs.readFileSync(file, "utf8");
      if (NODE_ONLY_RE.test(src)) return;
      var m;
      IMPORT_RE.lastIndex = 0;
      while ((m = IMPORT_RE.exec(src))) {
        var s = m[1] || m[2] || m[3];
        if (/^(\.|\/|[a-z]+:)/.test(s)) continue;
        specifiers[s] = true;
      }
    }
  });
}
scan(elementsDir);

function packageOf(spec) {
  var parts = spec.split("/");
  return spec[0] === "@" ? parts.slice(0, 2).join("/") : parts[0];
}

// the file a bare package import loads, from its package.json
function entryOf(pkg) {
  var pkgFile = path.join("node_modules", pkg, "package.json");
  if (!fs.existsSync(pkgFile)) return null;
  var json = JSON.parse(fs.readFileSync(pkgFile, "utf8"));
  var exp = json.exports;
  var dot =
    exp && typeof exp === "object" && exp["."] !== undefined ? exp["."] : exp;
  while (dot && typeof dot === "object") {
    dot = dot.browser || dot.import || dot.module || dot.default || null;
  }
  var entry = (typeof dot === "string" && dot) || json.module || json.main;
  return (entry || "index.js").replace(/^\.\//, "");
}

var imports = {
  // every @haxtheweb package is served from this deploy
  "@haxtheweb/": ELEMENTS,
  "/node_modules/@haxtheweb/": ELEMENTS,
  // elements that find node_modules by climbing out of their own folder
  // (new URL("./x.js", import.meta.url) + "/../../../") land at the root
  "/@haxtheweb/": ELEMENTS,
};
var thirdParty = {
  lit: true,
  "@a11y": true,
  "@github": true,
  "@google": true,
  "@lit-labs": true,
  "scrollable-component": true,
  "web-dialog": true,
};
Object.keys(specifiers).forEach(function (spec) {
  var pkg = packageOf(spec);
  if (workspace[pkg]) {
    // "@haxtheweb/x/lib/y" with no extension: name the real file
    var rest = spec.slice(pkg.length + 1);
    var dir = path.join(elementsDir, workspace[pkg]);
    if (
      rest &&
      !fs.existsSync(path.join(dir, rest)) &&
      fs.existsSync(path.join(dir, rest + ".js"))
    ) {
      var target = ELEMENTS + workspace[pkg] + "/" + rest + ".js";
      imports[spec] = target;
      imports["/node_modules/" + spec] = target;
    }
    return;
  }
  if (pkg.indexOf("@haxtheweb/") === 0) return;
  if (!PKG_NAME_RE.test(pkg)) return;
  if (!fs.existsSync(path.join("node_modules", pkg))) return;
  thirdParty[pkg] = true;
});
Object.keys(thirdParty).forEach(function (pkg) {
  if (pkg[0] === "@" && pkg.indexOf("/") === -1) {
    // a whole scope
    imports[pkg + "/"] = CDN_BASE + pkg + "/";
    return;
  }
  imports[pkg + "/"] = CDN_BASE + pkg + "/";
  var entry = entryOf(pkg);
  if (entry) imports[pkg] = CDN_BASE + pkg + "/" + entry;
});
// anything else under /node_modules/ (wc-autoload, demos' ./node_modules/)
imports["/node_modules/"] = CDN_BASE;

// a demo that reaches node_modules through a path relative to its own
// folder (the haxcms-elements demo links its own node_modules) gets the same
// mapping for that path, so those imports load the same module a bare import
// does
function importMapFor(elementName) {
  var map = { imports: Object.assign({}, imports) };
  if (elementName) {
    var prefix = ELEMENTS + elementName + "/demo/node_modules/";
    map.imports[prefix + "@haxtheweb/"] = ELEMENTS;
    map.imports[prefix] = CDN_BASE;
  }
  return (
    '<script type="importmap">\n' +
    JSON.stringify(map, null, 2) +
    "\n  </script>\n  "
  );
}

// Inject import map into an HTML file before the first <script> tag.
// Returns true if the file was modified.
function injectImportMap(filePath, elementName) {
  let html = fs.readFileSync(filePath, "utf8");
  // a real import map tag, not the words inside a script that looks for one
  if (/<script[^>]*\stype=["']?importmap["']?[\s>]/i.test(html)) {
    return false;
  }
  // Find insertion point: before first <script tag, or after <head>, or at start.
  let insertPos = -1;
  var scriptMatch = html.match(/<script[\s>]/i);
  if (scriptMatch) {
    insertPos = scriptMatch.index;
  } else {
    var headMatch = html.match(/<head[^>]*>/i);
    if (headMatch) {
      insertPos = headMatch.index + headMatch[0].length;
    } else {
      insertPos = 0;
    }
  }
  var before = html.slice(0, insertPos);
  var after = html.slice(insertPos);
  fs.writeFileSync(filePath, before + importMapFor(elementName) + after);
  return true;
}

// where a node_modules/<pkgPath> reference is served from
function nodeModulesTarget(pkgPath) {
  if (workspace[packageOf(pkgPath)]) {
    return (
      ELEMENTS +
      workspace[packageOf(pkgPath)] +
      pkgPath.slice(packageOf(pkgPath).length)
    );
  }
  return CDN_BASE + pkgPath;
}

// Rewrite src="...node_modules/..." and href="...node_modules/..." paths.
// Returns true if the file was modified.
function rewriteNodeModulesPaths(filePath) {
  let html = fs.readFileSync(filePath, "utf8");
  let changed = false;

  // Double-quoted attributes: src="...node_modules/path" / href="...node_modules/path"
  html = html.replace(
    /(src|href)="([^"]*?)node_modules\/([^"]+)"/g,
    function (match, attr, prefix, pkgPath) {
      changed = true;
      return attr + '="' + nodeModulesTarget(pkgPath) + '"';
    },
  );

  // Single-quoted attributes
  html = html.replace(
    /(src|href)='([^']*?)node_modules\/([^']+)'/g,
    function (match, attr, prefix, pkgPath) {
      changed = true;
      return attr + "='" + nodeModulesTarget(pkgPath) + "'";
    },
  );

  if (changed) {
    fs.writeFileSync(filePath, html);
  }
  return changed;
}

// --- Process the generated gallery HTML ---
var galleryFile = "./index.html";
if (fs.existsSync(galleryFile)) {
  injectImportMap(galleryFile);
  console.log("Gallery: injected import map into index.html");
} else {
  console.warn("Warning: index.html not found — run yarn build-gallery first");
}

// --- Process all demo HTML files ---
var demoCount = 0;
var rewriteCount = 0;

if (fs.existsSync(elementsDir)) {
  var elementDirs = fs
    .readdirSync(elementsDir, { withFileTypes: true })
    .filter(function (d) {
      return d.isDirectory();
    })
    .map(function (d) {
      return d.name;
    });

  for (var i = 0; i < elementDirs.length; i++) {
    var demoPath = path.join(elementsDir, elementDirs[i], "demo");
    if (!fs.existsSync(demoPath)) continue;
    var demoFiles = fs.readdirSync(demoPath).filter(function (f) {
      return f.endsWith(".html");
    });
    for (var j = 0; j < demoFiles.length; j++) {
      var filePath = path.join(demoPath, demoFiles[j]);
      injectImportMap(filePath, elementDirs[i]);
      if (rewriteNodeModulesPaths(filePath)) {
        rewriteCount++;
      }
      demoCount++;
    }
  }
}

console.log(
  "Import map: " +
    Object.keys(workspace).length +
    " @haxtheweb packages from /elements/, " +
    Object.keys(thirdParty).length +
    " third-party packages from the CDN",
);
console.log(
  "Demos: processed " +
    demoCount +
    " files (" +
    rewriteCount +
    " had node_modules paths rewritten)",
);
console.log("Done: Vercel deploy preparation complete");
