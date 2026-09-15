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
 * This script runs in the Vercel build environment (after yarn build-gallery)
 * and patches the generated gallery + every demo HTML in place:
 *
 *  1. Injects an <script type="importmap"> that maps bare specifiers to the
 *     HAX CDN (https://cdn.hax.cloud/cdn/build/es6/node_modules/...).
 *  2. Rewrites src="...node_modules/..." and href="...node_modules/..." paths
 *     to the same CDN so classic scripts and CSS links resolve.
 *
 * The component under review still loads from local source (e.g.
 * import '../video-player.js') since those are relative paths served by Vercel.
 * Only dependencies are remapped to CDN, matching the established magic-script
 * fallback pattern in build.js.
 *
 * Source files in git are NOT affected — this only modifies the ephemeral
 * build-environment copies.
 */

const fs = require('fs');
const path = require('path');

const CDN_BASE = 'https://cdn.hax.cloud/cdn/build/es6/node_modules/';

// Import map covering all scopes present in wc-registry.json plus lit.
// Trailing-slash entries act as prefix mappings per the import maps spec.
const importMap = {
  imports: {
    'lit': CDN_BASE + 'lit/index.js',
    'lit/': CDN_BASE + 'lit/',
    '@haxtheweb/': CDN_BASE + '@haxtheweb/',
    '@a11y/': CDN_BASE + '@a11y/',
    '@github/': CDN_BASE + '@github/',
    '@google/': CDN_BASE + '@google/',
    '@lit-labs/': CDN_BASE + '@lit-labs/',
    'scrollable-component/': CDN_BASE + 'scrollable-component/',
    'web-dialog/': CDN_BASE + 'web-dialog/',
  },
};

const importMapScript =
  '<script type="importmap">\n' +
  JSON.stringify(importMap, null, 2) +
  '\n  </script>\n  ';

// Inject import map into an HTML file before the first <script> tag.
// Returns true if the file was modified.
function injectImportMap(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  if (html.includes('type="importmap"') || html.includes("type='importmap'")) {
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
  fs.writeFileSync(filePath, before + importMapScript + after);
  return true;
}

// Rewrite src="...node_modules/..." and href="...node_modules/..." to CDN URLs.
// Returns true if the file was modified.
function rewriteNodeModulesPaths(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Double-quoted attributes: src="...node_modules/path" / href="...node_modules/path"
  html = html.replace(
    /(src|href)="([^"]*?)node_modules\/([^"]+)"/g,
    function (match, attr, prefix, pkgPath) {
      changed = true;
      return attr + '="' + CDN_BASE + pkgPath + '"';
    }
  );

  // Single-quoted attributes
  html = html.replace(
    /(src|href)='([^']*?)node_modules\/([^']+)'/g,
    function (match, attr, prefix, pkgPath) {
      changed = true;
      return attr + "='" + CDN_BASE + pkgPath + "'";
    }
  );

  if (changed) {
    fs.writeFileSync(filePath, html);
  }
  return changed;
}

// --- Process the generated gallery HTML ---
var galleryFile = './index.html';
if (fs.existsSync(galleryFile)) {
  injectImportMap(galleryFile);
  console.log('Gallery: injected import map into index.html');
} else {
  console.warn('Warning: index.html not found — run yarn build-gallery first');
}

// --- Process all demo HTML files ---
var elementsDir = './elements';
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
    var demoPath = path.join(elementsDir, elementDirs[i], 'demo');
    if (!fs.existsSync(demoPath)) continue;
    var demoFiles = fs
      .readdirSync(demoPath)
      .filter(function (f) {
        return f.endsWith('.html');
      });
    for (var j = 0; j < demoFiles.length; j++) {
      var filePath = path.join(demoPath, demoFiles[j]);
      injectImportMap(filePath);
      if (rewriteNodeModulesPaths(filePath)) {
        rewriteCount++;
      }
      demoCount++;
    }
  }
}

console.log('Demos: processed ' + demoCount + ' files (' + rewriteCount + ' had node_modules paths rewritten)');
console.log('Done: Vercel deploy preparation complete');
