#!/usr/bin/env node
/**
 * Compare the ecosystem release version in .version (written by the
 * version-match gulp task from @haxtheweb/haxcms-elements, i.e. the lerna
 * version) with the packages that ubiquity-push.sh tags and publishes with
 * `commit-and-tag-version --release-as <.version>`.
 *
 * When one of those packages is already ahead (say a 26.8.1 hotfix of
 * haxcms-nodejs or create while the elements are still 26.8.0), releasing at
 * .version would tag backwards and `npm publish` would fail on a version that
 * already exists. Bump the elements first (lerna version) so .version moves
 * past every package.
 *
 * Sibling checkouts are found next to this repo (../haxcms-nodejs, ...), the
 * same layout the theme and language-registry syncs use; missing ones are
 * skipped.
 *
 *   node scripts/check-ecosystem-version.mjs           report (exit 0)
 *   node scripts/check-ecosystem-version.mjs --strict  exit 1 when behind
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import console from "node:console";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STRICT = process.argv.includes("--strict");
// packages that ubiquity-push.sh releases with --release-as $(cat .version)
const SIBLINGS = [
  "haxcms-nodejs",
  "haxcms-php",
  "create",
  "hax11ty",
  "psucdn",
  "open-apis",
];

function readVersion(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")).version || null;
  } catch (e) {
    return null;
  }
}

// numeric compare of x.y.z; prerelease tags are not used in this ecosystem
function compare(a, b) {
  const pa = String(a).split(/[.-]/).map((n) => parseInt(n, 10) || 0);
  const pb = String(b).split(/[.-]/).map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < 3; i++) {
    if (pa[i] !== pb[i]) {
      return pa[i] > pb[i] ? 1 : -1;
    }
  }
  return 0;
}

let release = null;
try {
  release = fs.readFileSync(path.join(ROOT, ".version"), "utf8").trim();
} catch (e) {
  release = null;
}
if (!release) {
  console.log("check-ecosystem-version: no .version yet; run gulp version-match");
  process.exit(STRICT ? 1 : 0);
}

const ahead = [];
for (const name of SIBLINGS) {
  const version = readVersion(path.join(ROOT, "..", name, "package.json"));
  if (version && compare(version, release) > 0) {
    ahead.push(`${name} ${version}`);
  }
}

if (ahead.length) {
  console.log(
    `WARNING: release version ${release} (.version) is behind ${ahead.join(", ")}; ` +
      "releasing now would tag backwards and npm publish would fail. " +
      "Bump the elements (lerna version) past these first.",
  );
  process.exit(STRICT ? 1 : 0);
}
console.log(`check-ecosystem-version: ${release} is not behind any sibling package`);
