#!/usr/bin/env node

/**
 * Mirror the shared HAXcms JSON files into both backends, the same way
 * scripts/theme-discovery.js mirrors themes.json.
 *
 *   elements/i18n-manager/lib/languages.json
 *     -> ../haxcms-nodejs/src/coreConfig/languages.json
 *     -> ../haxcms-php/system/coreConfig/languages.json
 *   elements/haxcms-elements/lib/haxcms-api-codes.json
 *     -> ../haxcms-nodejs/src/lib/haxcmsApiCodes.json
 *     -> ../haxcms-php/system/backend/php/lib/haxcms-api-codes.json
 *
 * The files are copied byte for byte. A backend checkout that is not next to
 * this repo is skipped with a note (the same as theme-discovery), so this is
 * safe to run anywhere.
 *
 *   node scripts/sync-language-registry.js           copy
 *   node scripts/sync-language-registry.js --check   report drift, change nothing
 *
 * Always exits 0 (report only, like validate-language-registry.js) unless
 * --strict is passed with --check, which exits 1 when a mirror is out of date.
 */

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

const FILES = [
  {
    source: "elements/i18n-manager/lib/languages.json",
    targets: [
      "../haxcms-nodejs/src/coreConfig/languages.json",
      "../haxcms-php/system/coreConfig/languages.json",
    ],
  },
  {
    source: "elements/haxcms-elements/lib/haxcms-api-codes.json",
    targets: [
      "../haxcms-nodejs/src/lib/haxcmsApiCodes.json",
      "../haxcms-php/system/backend/php/lib/haxcms-api-codes.json",
    ],
  },
];

function sync({ check = false } = {}) {
  const results = [];
  FILES.forEach((entry) => {
    const sourcePath = path.join(root, entry.source);
    const contents = fs.readFileSync(sourcePath);
    entry.targets.forEach((target) => {
      const targetPath = path.join(root, target);
      const result = { source: entry.source, target, status: "" };
      if (!fs.existsSync(path.dirname(targetPath))) {
        result.status = "skipped";
      } else if (
        fs.existsSync(targetPath) &&
        Buffer.compare(fs.readFileSync(targetPath), contents) === 0
      ) {
        result.status = "in-sync";
      } else if (check) {
        result.status = "out-of-date";
      } else {
        fs.writeFileSync(targetPath, contents);
        result.status = "updated";
      }
      results.push(result);
    });
  });
  return results;
}

if (require.main === module) {
  const check = process.argv.includes("--check");
  const results = sync({ check });
  const labels = {
    skipped: "skipped (checkout not found)",
    "in-sync": "in sync",
    "out-of-date": "OUT OF DATE",
    updated: "updated",
  };
  results.forEach((r) => {
    console.log(`  ${labels[r.status]}: ${r.target}`);
  });
  const stale = results.filter((r) => r.status === "out-of-date").length;
  if (check && stale > 0) {
    console.log(
      `  ${stale} mirror(s) out of date: run yarn run language-registry-sync`,
    );
  }
  process.exit(check && stale > 0 && process.argv.includes("--strict") ? 1 : 0);
}

module.exports = { sync, FILES };
