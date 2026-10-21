#!/usr/bin/env node
/**
 * Refresh the managed files of the standalone `haxsite` example repo using the
 * haxcms-nodejs core that ubiquity just built, so the example never falls
 * behind the capabilities we ship.
 *
 * This is a maintainer-side step. It is called from scripts/ubiquity-push.sh
 * (and ubiquity-testing.sh) AFTER haxcms-nodejs has been built, because it uses
 * that build's boilerplate. It is intentionally not a CI / GitHub workflow job:
 * the haxsite repo stays a plain site that anyone can fork and edit by hand.
 *
 * How it stays safe:
 *   - The site is loaded in single-site mode (site.json at the repo root), the
 *     same way `npx @haxtheweb/haxcms-nodejs` serves it.
 *   - Generation happens in a scratch copy, then ONLY an allowlist of managed
 *     files is copied back. Authored content (site.json, pages/, files/,
 *     theme/, custom/, assets/, CNAME, README, LICENSE, .github/) is never
 *     touched, so a fork's own content is never at risk from this script.
 *   - Nothing is committed or pushed here; the caller owns version control.
 *
 * Usage:
 *   node scripts/refresh-haxsite.mjs [--haxsite <dir>] [--haxcms <dir>]
 *                                    [--domain <url>] [--dry-run]
 *
 *   --haxsite  haxsite checkout to refresh        (default: $HAXTHEWEB_ROOT/haxsite)
 *   --haxcms   haxcms-nodejs checkout, already built with `npm run build`
 *                                                  (default: $HAXTHEWEB_ROOT/haxcms-nodejs)
 *   --domain   public URL the example is published at. Used for sitemap, feeds,
 *              llms.txt, robots.txt and .well-known. Falls back to HAXSITE_DOMAIN,
 *              then to site.json metadata.site.domain. With none of these, those
 *              domain-bound files are LEFT AS THEY ARE rather than regenerated
 *              with HAXcms' localhost fallback; everything else still refreshes.
 *              Setting metadata.site.domain in the haxsite's site.json is the
 *              durable fix.
 *   --dry-run  report what would change, write nothing
 *
 * $HAXTHEWEB_ROOT defaults to ~/haxtheweb, matching ubiquity-push.sh.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function parseArgs(argv) {
  const args = { dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") args.dryRun = true;
    else if (a === "--haxsite") args.haxsite = argv[++i];
    else if (a === "--haxcms") args.haxcms = argv[++i];
    else if (a === "--domain") args.domain = argv[++i];
    else {
      console.error(`Unknown argument: ${a}`);
      process.exit(2);
    }
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
const root = process.env.HAXTHEWEB_ROOT || path.join(os.homedir(), "haxtheweb");
const haxsiteDir = path.resolve(args.haxsite || path.join(root, "haxsite"));
const haxcmsDir = path.resolve(args.haxcms || path.join(root, "haxcms-nodejs"));
const domain = args.domain || process.env.HAXSITE_DOMAIN || "";

function fail(msg) {
  console.error(`refresh-haxsite: ${msg}`);
  process.exit(1);
}

if (!fs.existsSync(path.join(haxsiteDir, "site.json"))) {
  fail(`no site.json in ${haxsiteDir}; is that a haxsite checkout?`);
}
const coreEntry = path.join(haxcmsDir, "dist", "lib", "HAXCMS.js");
if (!fs.existsSync(coreEntry)) {
  fail(
    `${coreEntry} not found. Build haxcms-nodejs first (cd ${haxcmsDir} && npm run build); ` +
      `this script must run after that so it uses the new boilerplate.`,
  );
}

// Work in a scratch copy so HAXcms can never leave stray runtime folders
// (_config, _sites, ...) or touch authored content in the real checkout.
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "refresh-haxsite-"));
const work = path.join(scratch, path.basename(haxsiteDir));
fs.cpSync(haxsiteDir, work, {
  recursive: true,
  filter: (src) => {
    const name = path.basename(src);
    return name !== ".git" && name !== "node_modules";
  },
});

// Give HAXcms a throwaway config folder next to the scratch site. It looks for
// `_config/.isHAXcmsConfig` walking up from the cwd; without one it falls back
// to ~/.haxcmsconfig or, worse, seeds credentials (.user, .pk, SALT.txt) inside
// the core's own dist/ folder, which `npm publish` would then ship.
const cfg = path.join(scratch, "_config");
fs.cpSync(path.join(haxcmsDir, "dist", "boilerplate", "systemsetup"), cfg, {
  recursive: true,
  filter: (src) => !/(^|[\\/])(\.user|\.pk|\.rpk|SALT\.txt)$/.test(src),
});
fs.writeFileSync(path.join(cfg, ".isHAXcmsConfig"), "");
for (const d of ["tmp", "cache", "settings", "node_modules", "user/files"]) {
  fs.mkdirSync(path.join(cfg, d), { recursive: true });
}

// HAXCMS_ROOT is read when the core module loads, so set it before require().
process.env.HAXCMS_ROOT = work + path.sep;
process.chdir(work);

// Same switch the haxcms-nodejs / hax CLI sets for headless runs. It also keeps
// the core from printing the seeded admin credentials of the throwaway config.
process.env.haxcms_middleware = "node-cli";

const { HAXCMS, systemStructureContext } = require(coreEntry);
const site = await systemStructureContext(work);
if (!site) fail(`haxcms-nodejs could not load ${work} as a single site`);

// In-memory only: site.json in the real checkout is never rewritten.
if (domain) site.manifest.metadata.site.domain = domain;
const hasDomain = !!site.manifest.metadata.site.domain;

// Files that embed the public URL. Without a real domain HAXcms writes
// https://localhost/..., which must never replace what is already committed.
const domainBound = new Set([
  "rss.xml",
  "atom.xml",
  "sitemap.xml",
  "sitemap-index.xml",
  "llms.txt",
  "robots.txt",
  ".well-known/api-catalog",
  ".well-known/security.txt",
]);
const skipped = [];
const allowed = (rel) => {
  if (!hasDomain && domainBound.has(rel)) {
    skipped.push(rel);
    return false;
  }
  return true;
};

await site.rebuildManagedFiles();
// rss.xml, atom.xml, sitemap.xml, sitemap-index.xml, lunrSearchIndex.json, llms.txt
await site.updateAlternateFormats();

// Everything the core regenerates, and nothing else, is allowed back out.
const managedDirs = [".well-known"];
const managed = new Set([
  ...Object.values(site.getManagedTemplateFiles()).filter(
    (rel) => !managedDirs.some((d) => rel.startsWith(d + "/")),
  ),
  "index.php",
  "rss.xml",
  "atom.xml",
  "sitemap.xml",
  "sitemap-index.xml",
  "lunrSearchIndex.json",
  "llms.txt",
]);

function sameFile(a, b) {
  return (
    fs.existsSync(a) &&
    fs.existsSync(b) &&
    Buffer.compare(fs.readFileSync(a), fs.readFileSync(b)) === 0
  );
}

function listFiles(dir, base = dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory()
      ? listFiles(full, base)
      : [path.relative(base, full)];
  });
}

// Twig.js cannot render every template (service-worker.js uses `constant()`),
// and the core leaves such a file as the raw template. That is the same thing a
// normal HAXcms save produces, so we keep parity, but say so out loud.
const unrendered = [...managed].filter((rel) => {
  const f = path.join(work, rel);
  return (
    fs.existsSync(f) &&
    fs.statSync(f).isFile() &&
    /\.(html|json|js|cjs|xml|txt|php|md)$/.test(rel) &&
    /\{\{|\{%/.test(fs.readFileSync(f, "utf8"))
  );
});

const added = [];
const changed = [];
const removed = [];

for (const rel of managed) {
  const from = path.join(work, rel);
  const to = path.join(haxsiteDir, rel);
  if (!fs.existsSync(from) || !allowed(rel)) continue;
  if (!fs.existsSync(to)) added.push(rel);
  else if (!sameFile(from, to)) changed.push(rel);
  else continue;
  if (!args.dryRun) {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
  }
}

for (const dir of managedDirs) {
  const fresh = new Set(listFiles(path.join(work, dir)));
  const current = new Set(listFiles(path.join(haxsiteDir, dir)));
  for (const rel of fresh) {
    const from = path.join(work, dir, rel);
    const to = path.join(haxsiteDir, dir, rel);
    const label = path.join(dir, rel);
    if (!allowed(label)) continue;
    if (!current.has(rel)) added.push(label);
    else if (!sameFile(from, to)) changed.push(label);
    else continue;
    if (!args.dryRun) {
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.copyFileSync(from, to);
    }
  }
  // skills dropped upstream should not linger in the example
  for (const rel of current) {
    if (fresh.has(rel) || domainBound.has(path.join(dir, rel))) continue;
    removed.push(path.join(dir, rel));
    if (!args.dryRun) fs.rmSync(path.join(haxsiteDir, dir, rel));
  }
}

fs.rmSync(scratch, { recursive: true, force: true });

const verb = args.dryRun ? "would be" : "were";
console.log(
  `refresh-haxsite: core ${await HAXCMS.getHAXCMSVersion()} -> ${haxsiteDir}\n` +
    `  ${added.length} added, ${changed.length} changed, ${removed.length} removed ` +
    `(managed files only; authored content untouched; changes ${verb} written)`,
);
if (skipped.length) {
  console.log(
    `  skipped (no domain: set --domain, HAXSITE_DOMAIN or site.json metadata.site.domain): ` +
      [...new Set(skipped)].sort().join(", "),
  );
}
if (unrendered.length) {
  console.log(
    `  note: core left unrendered Twig in ${unrendered.sort().join(", ")} (same as a normal HAXcms save)`,
  );
}
for (const [label, list] of [
  ["added", added],
  ["changed", changed],
  ["removed", removed],
]) {
  if (list.length)
    console.log(`  ${label}:\n    ${list.sort().join("\n    ")}`);
}
