#!/usr/bin/env node

/**
 * Generate elements/README.md — the index of every element in the monorepo.
 *
 * Source of truth is each element's own package.json (`description`), the same
 * field the component gallery and npm use. Fix a description there, not in the
 * README; this file is overwritten on every run.
 *
 * Output is deterministic (sorted, no versions or dates) so it only produces a
 * diff when an element is added, removed or re-described.
 *
 * Usage: node scripts/generate-elements-readme.js [--check]
 *   --check  exit 1 if elements/README.md is out of date (for CI), write nothing
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ELEMENTS_DIR = path.join(ROOT, 'elements');
const OUTPUT_FILE = path.join(ELEMENTS_DIR, 'README.md');

// boilerplate left behind by the element generator / old migrations
const PLACEHOLDER = /^(start of\b|automated conversion of\b)/i;

function collectElements() {
  const elements = [];
  const warnings = [];
  const dirs = fs
    .readdirSync(ELEMENTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
    .map((d) => d.name)
    .sort((a, b) => a.localeCompare(b));

  for (const name of dirs) {
    const pkgPath = path.join(ELEMENTS_DIR, name, 'package.json');
    if (!fs.existsSync(pkgPath)) continue;
    let pkg;
    try {
      pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    } catch (e) {
      warnings.push(`${name}: could not parse package.json`);
      continue;
    }
    if (pkg.private) continue;
    const description = (pkg.description || '').replace(/\s+/g, ' ').trim();
    if (!description) warnings.push(`${name}: missing description`);
    else if (PLACEHOLDER.test(description))
      warnings.push(`${name}: placeholder description "${description}"`);
    elements.push({
      name,
      packageName: pkg.name || '',
      description,
      hasDemo: fs.existsSync(path.join(ELEMENTS_DIR, name, 'demo', 'index.html')),
    });
  }
  return { elements, warnings };
}

const cell = (s) => s.replace(/\|/g, '\\|');

function render(elements) {
  const rows = elements.map((el) => {
    const demo = el.hasDemo ? `[demo](./${el.name}/demo/)` : '';
    const pkg = el.packageName ? `\`${el.packageName}\`` : '';
    return `| [${el.name}](./${el.name}/) | ${cell(el.description)} | ${pkg} | ${demo} |`;
  });
  return [
    '# HAX web components',
    '',
    '<!-- GENERATED FILE: do not edit by hand. Run `yarn run elements-readme` -->',
    '<!-- Descriptions come from each element\'s package.json; edit them there. -->',
    '',
    `Every element in this monorepo (${elements.length} packages). Browse them live with \`yarn gallery\`, or open an element's folder for its own README.`,
    '',
    '| Element | Description | Package | Demo |',
    '| --- | --- | --- | --- |',
    ...rows,
    '',
  ].join('\n');
}

function main() {
  const check = process.argv.includes('--check');
  const { elements, warnings } = collectElements();
  const output = render(elements);
  const current = fs.existsSync(OUTPUT_FILE) ? fs.readFileSync(OUTPUT_FILE, 'utf8') : '';

  warnings.forEach((w) => console.warn(`⚠️  ${w}`));

  if (check) {
    if (current !== output) {
      console.error('❌ elements/README.md is out of date. Run `yarn run elements-readme`.');
      process.exit(1);
    }
    console.log('✅ elements/README.md is up to date');
    return;
  }
  if (current === output) {
    console.log(`✅ elements/README.md already current (${elements.length} elements)`);
    return;
  }
  fs.writeFileSync(OUTPUT_FILE, output);
  console.log(`✅ elements/README.md written (${elements.length} elements)`);
}

main();
