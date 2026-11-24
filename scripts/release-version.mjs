#!/usr/bin/env node
/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Step 1 of a release: put every element, and everything that records the
 * release version, on one version number, then commit and tag it. Nothing is
 * published here; `yarn run release-publish` does that, and can be re-run
 * until every package is on npm.
 *
 *   yarn run release-version 26.11.0             bump, commit, tag v26.11.0, push
 *   yarn run release-version 26.11.0 --dry-run   report what would change
 *   yarn run release-version 26.11.0 --no-push   bump, commit and tag locally only
 *
 * It sets, to exactly the release version:
 *   - "version" in every elements/<name>/package.json (all of them, changed or
 *     not, so no element is left on an older or hotfix version)
 *   - every dependency/devDependency/optionalDependency range on another
 *     element, as ^<version> (peerDependencies are minimums and are left alone)
 *   - lerna.json "version", the root package.json "version", root
 *     "resolutions" pins on elements, and .version
 *   - the generated references scripts/release-references.json lists for this
 *     repo (element docs data, DDD tokens and design-system manifests), and
 *     the HAXcms version removed from demo site.json files, which must never
 *     carry it
 *
 * The release then runs in this order:
 *   yarn run release-version <x.y.z>
 *   yarn run release-publish            (re-run until it reports nothing left)
 *   yarn run ubiquity-git-sync && yarn run ubiquity-dry-run
 *   yarn run ubiquity-publish
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import console from "node:console";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { stampRepos } from "./release-references.mjs";

const WC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ELEMENTS = path.join(WC, "elements");
const argv = process.argv.slice(2);
const dry = argv.includes("--dry-run");
const push = !argv.includes("--no-push");
const version = argv.find((a) => !a.startsWith("--"));
const BRANCH = "master";
const DEP_KEYS = ["dependencies", "devDependencies", "optionalDependencies"];

function die(message) {
  console.log(`ERROR: ${message}`);
  process.exit(1);
}

function git(args) {
  return execFileSync("git", args, {
    cwd: WC,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 64 * 1024 * 1024,
  }).trim();
}

const parse = (v) =>
  String(v)
    .split(".")
    .map((n) => parseInt(n, 10) || 0);
function compare(a, b) {
  const pa = parse(a);
  const pb = parse(b);
  for (let i = 0; i < 3; i++) {
    if (pa[i] !== pb[i]) return pa[i] > pb[i] ? 1 : -1;
  }
  return 0;
}

const readJSON = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
// 2-space JSON with a trailing newline, the format these files already use
const writeJSON = (file, data) =>
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);

if (!/^\d+\.\d+\.\d+$/.test(version || "")) {
  die(
    "usage: yarn run release-version <x.y.z> [--dry-run] [--no-push]  (releases are year.month, e.g. 26.11.0)",
  );
}

// the elements: every elements/<name>/package.json that is not private
const packages = fs
  .readdirSync(ELEMENTS)
  .map((dir) => path.join(ELEMENTS, dir, "package.json"))
  .filter((file) => fs.existsSync(file))
  .map((file) => ({ file, json: readJSON(file) }))
  .filter((p) => p.json.name && !p.json.private);
const names = new Set(packages.map((p) => p.json.name));

// never go backwards: a release below an element already published past it
// would fail on npm and tag behind
const ahead = packages.filter((p) => compare(p.json.version, version) > 0);
if (ahead.length) {
  die(
    `${version} is behind ${ahead.length} element(s): ${ahead
      .map((p) => `${p.json.name}@${p.json.version}`)
      .join(", ")}`,
  );
}

if (!dry) {
  if (git(["rev-parse", "--abbrev-ref", "HEAD"]) !== BRANCH) {
    die(`check out ${BRANCH} first; a release is versioned on ${BRANCH}`);
  }
  if (git(["status", "--porcelain"]).length) {
    die(
      "commit or stash local changes first; the release commit holds only the version bump",
    );
  }
  git(["fetch", "--quiet", "origin", BRANCH]);
  if (git(["rev-parse", "HEAD"]) !== git(["rev-parse", `origin/${BRANCH}`])) {
    die(`${BRANCH} is not even with origin/${BRANCH}; pull (or push) first`);
  }
  if (git(["tag", "-l", `v${version}`])) {
    die(`tag v${version} already exists; this version was already set`);
  }
}

const lernaFile = path.join(WC, "lerna.json");
const lerna = readJSON(lernaFile);
const rootFile = path.join(WC, "package.json");
const root = readJSON(rootFile);

// what moves; an element not on lerna.json's version is drift worth naming
const normalized = [];
let ranges = 0;
packages.forEach((p) => {
  if (p.json.version !== version) {
    if (p.json.version !== lerna.version) {
      normalized.push(`${p.json.name} ${p.json.version}`);
    }
    p.json.version = version;
    p.changed = true;
  }
  DEP_KEYS.forEach((key) => {
    const deps = p.json[key];
    if (!deps) return;
    Object.keys(deps).forEach((name) => {
      if (names.has(name) && deps[name] !== `^${version}`) {
        deps[name] = `^${version}`;
        ranges++;
        p.changed = true;
      }
    });
  });
});

const pins = Object.keys(root.resolutions || {}).filter(
  (name) => names.has(name) && root.resolutions[name] !== version,
);

console.log(`release-version: ${version}`);
console.log(
  `  elements: ${packages.filter((p) => p.changed).length} of ${packages.length} package.json files change, ${ranges} internal range(s) -> ^${version}`,
);
if (normalized.length) {
  console.log(
    `  off-version elements brought in line: ${normalized.join(", ")}`,
  );
}
console.log(`  lerna.json ${lerna.version} -> ${version}`);
console.log(`  package.json ${root.version} -> ${version}`);
console.log(`  root resolutions on elements: ${pins.length} -> ${version}`);
console.log(`  .version -> ${version}`);
console.log("  release references (scripts/release-references.json):");

if (dry) {
  stampRepos(["webcomponents"], version, { write: false });
  console.log("dry run: nothing written");
  process.exit(0);
}

packages.filter((p) => p.changed).forEach((p) => writeJSON(p.file, p.json));
// lerna.json keeps its one-line arrays: change only the version value
fs.writeFileSync(
  lernaFile,
  fs
    .readFileSync(lernaFile, "utf8")
    .replace(/("version"\s*:\s*")[^"]*(")/, `$1${version}$2`),
);
root.version = version;
pins.forEach((name) => {
  root.resolutions[name] = version;
});
writeJSON(rootFile, root);
fs.writeFileSync(path.join(WC, ".version"), version);
stampRepos(["webcomponents"], version);

git(["add", "-A", "lerna.json", "package.json", ".version", "elements"]);
git(["commit", "-m", `v${version}`]);
git(["tag", "-a", `v${version}`, "-m", `v${version}`]);
console.log(`committed and tagged v${version}`);
if (push) {
  execFileSync("git", ["push", "--follow-tags", "origin", BRANCH], {
    cwd: WC,
    stdio: "inherit",
  });
  console.log(`pushed ${BRANCH} and v${version}`);
} else {
  console.log(`not pushed: git push --follow-tags origin ${BRANCH}`);
}
console.log("next: yarn run release-publish");
