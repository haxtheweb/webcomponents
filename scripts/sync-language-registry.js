#!/usr/bin/env node

/**
 * Mirror the shared HAXcms JSON files into both backends, the same way
 * scripts/theme-discovery.js mirrors themes.json.
 *
 *   elements/i18n-manager/lib/languages.json
 *     -> ../haxcms-nodejs/src/coreConfig/languages.json
 *     -> ../haxcms-php/system/coreConfig/languages.json
 *     -> ../create/src/lib/languages.json (the hax CLI)
 *   elements/haxcms-elements/lib/haxcms-api-codes.json
 *     -> ../haxcms-nodejs/src/lib/haxcmsApiCodes.json
 *     -> ../haxcms-php/system/backend/php/lib/haxcms-api-codes.json
 *   elements/license-element/lib/licenses.json
 *     -> ../haxcms-nodejs/src/lib/licenses.json
 *     -> ../haxcms-php/system/backend/php/lib/licenses.json
 *
 * It also writes two files that are generated from licenses.json rather than
 * copied, because they cannot read the JSON at run time:
 *   elements/license-element/lib/licenses-data.js (the client's license list)
 *   ../haxcms-php/system/boilerplate/site/config.php (the block between the
 *     BEGIN/END GENERATED: licenses markers, used when a site runs without the
 *     system tree)
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
      "../create/src/lib/languages.json",
    ],
  },
  {
    source: "elements/haxcms-elements/lib/haxcms-api-codes.json",
    targets: [
      "../haxcms-nodejs/src/lib/haxcmsApiCodes.json",
      "../haxcms-php/system/backend/php/lib/haxcms-api-codes.json",
    ],
  },
  {
    source: "elements/license-element/lib/licenses.json",
    targets: [
      "../haxcms-nodejs/src/lib/licenses.json",
      "../haxcms-php/system/backend/php/lib/licenses.json",
    ],
  },
];

const LICENSES_JSON = "elements/license-element/lib/licenses.json";

function phpString(value) {
  return `'${String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
}

/** Files built from licenses.json: target path and the text it should hold. */
const GENERATED = [
  {
    target: "elements/license-element/lib/licenses-data.js",
    render: (data) =>
      "/**\n" +
      " * GENERATED from licenses.json by scripts/sync-language-registry.js.\n" +
      " * Do not edit; change licenses.json and run `yarn run language-registry-sync`.\n" +
      " */\n" +
      `export const licenseData = ${JSON.stringify(data, null, 2)};\n`,
  },
  {
    target: "../haxcms-php/system/boilerplate/site/config.php",
    marker: "licenses",
    render: (data) => {
      const lines = [];
      lines.push("public static function groups()");
      lines.push("{");
      lines.push("    return array(");
      data.groups.forEach((group) => {
        lines.push(
          `        ${phpString(group.id)} => ${phpString(group.name)},`,
        );
      });
      lines.push("    );");
      lines.push("}");
      lines.push("");
      lines.push("public static function entries()");
      lines.push("{");
      lines.push("    return array(");
      data.licenses.forEach((license) => {
        lines.push(
          `        array('code' => ${phpString(license.code)}, 'group' => ${phpString(license.group)}, 'name' => ${phpString(license.name)}, 'link' => ${phpString(license.link)}, 'image' => ${phpString(license.image)}),`,
        );
      });
      lines.push("    );");
      lines.push("}");
      return lines.join("\n");
    },
  },
];

/** Replace the text between the BEGIN/END GENERATED markers in a file. */
function replaceMarked(text, marker, body) {
  const begin = `// BEGIN GENERATED: ${marker}`;
  const end = `// END GENERATED: ${marker}`;
  const start = text.indexOf(begin);
  const stop = text.indexOf(end);
  if (start === -1 || stop === -1 || stop < start) {
    return null;
  }
  // indent the block like the marker line
  const lineStart = text.lastIndexOf("\n", start) + 1;
  const indent = text.slice(lineStart, start);
  const indented = body
    .split("\n")
    .map((line) => (line === "" ? "" : indent + line))
    .join("\n");
  return (
    text.slice(0, start + begin.length) +
    "\n" +
    indented +
    "\n" +
    indent +
    text.slice(stop)
  );
}

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
  const licenses = JSON.parse(
    fs.readFileSync(path.join(root, LICENSES_JSON), "utf8"),
  );
  GENERATED.forEach((entry) => {
    const targetPath = path.join(root, entry.target);
    const result = { source: LICENSES_JSON, target: entry.target, status: "" };
    // marked blocks need the file; whole-file output only needs its folder
    const present = entry.marker
      ? fs.existsSync(targetPath)
      : fs.existsSync(path.dirname(targetPath));
    if (!present) {
      result.status = "skipped";
      results.push(result);
      return;
    }
    const current = fs.existsSync(targetPath)
      ? fs.readFileSync(targetPath, "utf8")
      : "";
    const wanted = entry.marker
      ? replaceMarked(current, entry.marker, entry.render(licenses))
      : entry.render(licenses);
    if (wanted === null) {
      result.status = "no-markers";
    } else if (wanted === current) {
      result.status = "in-sync";
    } else if (check) {
      result.status = "out-of-date";
    } else {
      fs.writeFileSync(targetPath, wanted);
      result.status = "updated";
    }
    results.push(result);
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
    "no-markers": "MARKERS MISSING (BEGIN/END GENERATED not found)",
    updated: "updated",
  };
  results.forEach((r) => {
    console.log(`  ${labels[r.status]}: ${r.target}`);
  });
  const stale = results.filter(
    (r) => r.status === "out-of-date" || r.status === "no-markers",
  ).length;
  if (check && stale > 0) {
    console.log(
      `  ${stale} mirror(s) out of date: run yarn run language-registry-sync`,
    );
  }
  process.exit(check && stale > 0 && process.argv.includes("--strict") ? 1 : 0);
}

module.exports = { sync, FILES };
