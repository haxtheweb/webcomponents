#!/usr/bin/env node
/**
 * Build elements-catalog.json: a searchable catalog of every element in
 * this monorepo, so agents (and people) can find an existing element before
 * writing a new one. haxtheweb/issues#3119
 *
 * Sources, per element package in elements/:
 *   - custom-elements.json  -> tag names, descriptions, module paths
 *   - lib/*.haxProperties.json and *.haxProperties.json -> HAX type
 *     (element / grid), gizmo title, description and tags
 *   - hax-elements-registry.json (root) -> titles of HAX-capable elements
 *   - package.json -> package name, fallback description
 *   - <name>/<name>.js -> tag fallback for packages without a manifest
 *
 * Output: elements-catalog.json at the repo root, consumed by
 * `hax wc --search <query>` in @haxtheweb/create.
 *
 * Node built-ins only. Run: node scripts/build-elements-catalog.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ELEMENTS = path.join(ROOT, 'elements');
const OUTPUT = path.join(ROOT, 'elements-catalog.json');

// Human-maintained "reach for these first" list. Keep it short.
const PREFERRED = [
  { tag: 'simple-fields-field', useFor: 'form inputs (text, select, checkbox, textarea, ...) instead of raw <input> / <select>' },
  { tag: 'simple-tooltip', useFor: 'tooltips, attached with for="<id>"' },
  { tag: 'simple-icon', useFor: 'icons' },
  { tag: 'simple-icon-button', useFor: 'icon-only buttons' },
  { tag: 'a11y-collapse', useFor: 'expand / collapse sections (set heading-button)' },
  { tag: 'a11y-tabs', useFor: 'tabbed content' },
  { tag: 'ddd-card', useFor: 'cards' },
  { tag: 'ddd-steps-list', useFor: 'numbered steps; reference grid parent/child pattern' },
  { tag: 'video-player', useFor: 'video' },
  { tag: 'multiple-choice', useFor: 'quiz questions; reference for haxHooks' },
];

function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return null;
  }
}

function cleanDescription(text, tag) {
  if (!text) {
    return '';
  }
  let t = String(text);
  // drop the conventional leading "`tag-name`" line and any section headings onward
  t = t.replace(/^\s*`[a-z0-9-]+`\s*/, '');
  t = t.split(/(?:^|\n)\s*#{2,}\s/)[0];
  t = t.replace(/`/g, '').replace(/\s+/g, ' ').trim();
  if (/^start of /i.test(t)) {
    return '';
  }
  return t.length > 300 ? t.substring(0, 297).trim() + '...' : t;
}

const SKIP_DIRS = new Set(['node_modules', 'test', 'demo', 'locales', 'build', 'dist', 'server', 'docs']);
function elementSourceFiles(dir, depth = 0) {
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      // top level files plus lib/ (and its subfolders)
      if ((depth === 0 && entry.name === 'lib') || (depth > 0 && !SKIP_DIRS.has(entry.name))) {
        files = files.concat(elementSourceFiles(path.join(dir, entry.name), depth + 1));
      }
    }
    else if (entry.name.endsWith('.js') && !entry.name.endsWith('.test.js') && !entry.name.endsWith('.stories.js')) {
      files.push(path.join(dir, entry.name));
    }
  }
  return files;
}

function haxPropertiesFiles(dir) {
  const found = [];
  for (const sub of ['', 'lib']) {
    const d = path.join(dir, sub);
    if (!fs.existsSync(d)) {
      continue;
    }
    for (const f of fs.readdirSync(d)) {
      if (f.endsWith('.haxProperties.json')) {
        found.push(path.join(d, f));
      }
    }
  }
  return found;
}

const registryTitles = readJSON(path.join(ROOT, 'hax-elements-registry.json')) || {};
const byTag = new Map();

for (const pkgDir of fs.readdirSync(ELEMENTS).sort()) {
  const dir = path.join(ELEMENTS, pkgDir);
  if (!fs.statSync(dir).isDirectory()) {
    continue;
  }
  const pkg = readJSON(path.join(dir, 'package.json')) || {};
  const packageName = pkg.name || `@haxtheweb/${pkgDir}`;
  const add = (tag, modulePath, description) => {
    if (!tag || byTag.has(tag)) {
      return;
    }
    byTag.set(tag, {
      tag,
      title: registryTitles[tag] || '',
      description: cleanDescription(description, tag),
      package: packageName,
      import: `${packageName}/${modulePath.replace(/^\.\//, '')}`,
      type: 'element',
      haxCapable: Object.prototype.hasOwnProperty.call(registryTitles, tag),
      tags: [],
    });
  };
  // descriptions from custom-elements.json, by tag and by class name
  // (many declarations there lack tagName when the tag comes from `static get tag()`)
  const manifestByTag = {};
  const manifestByClass = {};
  const manifest = readJSON(path.join(dir, 'custom-elements.json'));
  if (manifest && Array.isArray(manifest.modules)) {
    for (const mod of manifest.modules) {
      for (const dec of mod.declarations || []) {
        if (dec.tagName && !manifestByTag[dec.tagName]) {
          manifestByTag[dec.tagName] = dec.description;
        }
        if (dec.name && dec.description) {
          manifestByClass[dec.name] = dec.description;
        }
      }
    }
  }
  // the source of truth for tags is `static get tag() { return "x"; }`
  for (const file of elementSourceFiles(dir)) {
    const src = fs.readFileSync(file, 'utf8');
    const rel = path.relative(dir, file).split(path.sep).join('/');
    const tagRe = /static\s+get\s+tag\(\)\s*\{\s*return\s+['"`]([a-z0-9]+-[a-z0-9-]+)['"`]/g;
    let m;
    while ((m = tagRe.exec(src)) !== null) {
      const before = src.substring(0, m.index);
      const classMatches = [...before.matchAll(/class\s+([A-Za-z0-9_$]+)/g)];
      const className = classMatches.length ? classMatches[classMatches.length - 1][1] : '';
      let doc = '';
      if (classMatches.length) {
        const classIndex = classMatches[classMatches.length - 1].index;
        const docMatch = before.substring(0, classIndex).match(/\/\*\*((?:(?!\*\/)[\s\S])*)\*\/\s*(?:export\s+)?$/);
        if (docMatch) {
          doc = docMatch[1].replace(/^\s*\*\s?/gm, '').replace(/^@.*$/gm, '');
        }
      }
      const description = manifestByTag[m[1]] || manifestByClass[className] || doc || (m[1] === pkgDir ? pkg.description : '');
      add(m[1], rel, description);
    }
    // inline `static get haxProperties()` (no .haxProperties.json): only
    // trusted when the file defines a single element
    const tagsInFile = [...src.matchAll(/static\s+get\s+tag\(\)/g)].length;
    const fileTag = (src.match(/static\s+get\s+tag\(\)\s*\{\s*return\s+['"`]([a-z0-9]+-[a-z0-9-]+)['"`]/) || [])[1];
    if (tagsInFile === 1 && fileTag && byTag.has(fileTag) && /static\s+get\s+haxProperties\s*\(/.test(src)) {
      const entry = byTag.get(fileTag);
      entry.haxCapable = true;
      if (/\btype:\s*['"]grid['"]/.test(src)) {
        entry.type = 'grid';
      }
    }
  }
  // HAX schema details
  for (const file of haxPropertiesFiles(dir)) {
    const hax = readJSON(file);
    if (!hax) {
      continue;
    }
    const tag = path.basename(file).replace('.haxProperties.json', '');
    const entry = byTag.get(tag);
    if (!entry) {
      continue;
    }
    entry.haxCapable = true;
    if (hax.type) {
      entry.type = hax.type;
    }
    if (hax.gizmo) {
      if (hax.gizmo.title && !entry.title) {
        entry.title = hax.gizmo.title;
      }
      if (hax.gizmo.description && !entry.description) {
        entry.description = cleanDescription(hax.gizmo.description, tag);
      }
      if (Array.isArray(hax.gizmo.tags)) {
        entry.tags = hax.gizmo.tags;
      }
    }
  }
}

const elements = Array.from(byTag.values()).sort((a, b) => a.tag.localeCompare(b.tag));
const known = new Set(elements.map((e) => e.tag));
const catalog = {
  description: 'Elements in the haxtheweb/webcomponents monorepo. Search with `hax wc --search <query>`. Generated by scripts/build-elements-catalog.mjs; do not edit by hand.',
  preferred: PREFERRED.filter((p) => known.has(p.tag)),
  elements,
};
fs.writeFileSync(OUTPUT, JSON.stringify(catalog, null, 2) + '\n');
console.log(`elements-catalog.json: ${elements.length} elements (${elements.filter((e) => e.haxCapable).length} HAX-capable, ${elements.filter((e) => e.type === 'grid').length} grid)`);
