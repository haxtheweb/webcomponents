#!/usr/bin/env node
/**
 * Generate the xAPI vocabulary of HAX elements.
 *
 * Every element that emits xAPI statements declares what it sends next to
 * its code, as a static getter whose body returns a plain object literal:
 *
 *   static get xapiVocabulary() {
 *     return {
 *       tag: "multiple-choice",
 *       event: "user-engagement",
 *       verbs: ["answered"],
 *       objectType: "http://adlnet.gov/expapi/activities/cmi.interaction",
 *       interactionType: "choice",
 *       result: ["success", "score", "response", "completion", "extensions.attempts"],
 *       countsTowardCompletion: true,
 *       done: "answered correctly or out of attempts",
 *     };
 *   }
 *
 * An element that sends nothing on purpose says so the same way, so that
 * "no entry" only ever means nobody has decided yet:
 *
 *   static get xapiVocabulary() {
 *     return {
 *       tag: "page-break",
 *       tracks: false,
 *       reason: "marks where a page starts; there is nothing to do with it",
 *     };
 *   }
 *
 * A silent element may add readingCheckpoint: true: page reading
 * (haxcms-reading-progress.js) then notes when it was on screen, as evidence
 * for the one reading record of the page, without a statement of its own.
 *
 * This script scans elements/<name>/*.js and elements/<name>/lib/**.js (no
 * node_modules, tests, demos or builds), evaluates each literal in an empty
 * sandbox (node:vm, no access to anything) and writes, sorted by tag:
 *   elements/user-action/lib/xapi-vocabulary.json  (for tools / dashboards)
 *   elements/user-action/lib/xapi-vocabulary.js    (same data as an ES module,
 *     plus XAPI_DECLARED_SILENT: the elements that send nothing on purpose)
 *   elements/user-action/lib/xapi-declared-silent.json
 *
 *   node scripts/generate-xapi-vocabulary.mjs          write both files
 *   node scripts/generate-xapi-vocabulary.mjs --check  exit 1 when stale
 *
 * Node built-ins only.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const elementsDir = path.join(root, "elements");
const outDir = path.join(elementsDir, "user-action", "lib");
const OUT_JSON = path.join(outDir, "xapi-vocabulary.json");
const OUT_JS = path.join(outDir, "xapi-vocabulary.js");
const OUT_SILENT_JSON = path.join(outDir, "xapi-declared-silent.json");
const SKIP = new Set([
  "node_modules",
  "test",
  "demo",
  "dist",
  "build",
  "coverage",
  "locales",
]);
const MARKER = /static\s+get\s+xapiVocabulary\s*\(\s*\)\s*\{\s*return\s*/g;

function walk(dir, depth, out) {
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (e.isSymbolicLink()) {
      continue;
    }
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (depth < 3 && !SKIP.has(e.name)) {
        walk(full, depth + 1, out);
      }
    } else if (e.name.endsWith(".js") && !e.name.endsWith(".min.js")) {
      out.push(full);
    }
  }
  return out;
}

// the object literal that starts at index i ({ ... } with nesting, strings)
function literalAt(src, i) {
  if (src[i] !== "{") {
    return null;
  }
  let depth = 0;
  let quote = null;
  for (let j = i; j < src.length; j++) {
    const c = src[j];
    if (quote) {
      if (c === "\\") {
        j++;
      } else if (c === quote) {
        quote = null;
      }
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      quote = c;
    } else if (c === "{") {
      depth++;
    } else if (c === "}") {
      depth--;
      if (depth === 0) {
        return src.slice(i, j + 1);
      }
    }
  }
  return null;
}

export function collectVocabulary() {
  const vocab = {};
  const silent = {};
  const errors = [];
  const dirs = fs
    .readdirSync(elementsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("."));
  for (const d of dirs) {
    for (const file of walk(path.join(elementsDir, d.name), 0, [])) {
      const src = fs.readFileSync(file, "utf8");
      if (!src.includes("xapiVocabulary")) {
        continue;
      }
      let m;
      MARKER.lastIndex = 0;
      while ((m = MARKER.exec(src))) {
        const text = literalAt(src, m.index + m[0].length);
        const rel = path.relative(root, file).split(path.sep).join("/");
        if (!text) {
          errors.push(`${rel}: xapiVocabulary must return an object literal`);
          continue;
        }
        let entry;
        try {
          entry = vm.runInNewContext(`(${text})`, Object.create(null), {
            timeout: 100,
          });
        } catch (err) {
          errors.push(`${rel}: ${err.message}`);
          continue;
        }
        if (!entry || typeof entry.tag !== "string" || !entry.tag) {
          errors.push(`${rel}: xapiVocabulary needs a tag`);
          continue;
        }
        if (vocab[entry.tag] || silent[entry.tag]) {
          errors.push(`${rel}: duplicate xapiVocabulary for ${entry.tag}`);
          continue;
        }
        if (entry.tracks === false) {
          // sends nothing on purpose: a reason, and no statement fields
          if (typeof entry.reason !== "string" || !entry.reason.trim()) {
            errors.push(`${rel}: tracks: false needs a reason`);
            continue;
          }
          if (entry.verbs || entry.countsTowardCompletion) {
            errors.push(
              `${rel}: tracks: false cannot list verbs or count toward completion`,
            );
            continue;
          }
          silent[entry.tag] = {
            tag: entry.tag,
            tracks: false,
            reason: entry.reason.trim(),
            readingCheckpoint: entry.readingCheckpoint === true,
            source: rel,
          };
          continue;
        }
        vocab[entry.tag] = {
          ...JSON.parse(JSON.stringify(entry)),
          source: rel,
        };
      }
    }
  }
  const byTag = (map) => {
    const sorted = {};
    Object.keys(map)
      .sort()
      .forEach((k) => {
        sorted[k] = map[k];
      });
    return sorted;
  };
  return { vocab: byTag(vocab), silent: byTag(silent), errors };
}

export function render(vocab, silent = {}) {
  const json = `${JSON.stringify(vocab, null, 2)}\n`;
  const silentJson = `${JSON.stringify(silent, null, 2)}\n`;
  const js = `// generated by scripts/generate-xapi-vocabulary.mjs; do not edit.
// What each HAX element can send as xAPI statements. The source of truth is
// each element's static xapiVocabulary getter.
export const XAPI_VOCABULARY = ${JSON.stringify(vocab, null, 2)};

// tags whose activities count toward a page being done
export const XAPI_TRACKABLE_TAGS = Object.keys(XAPI_VOCABULARY).filter(
  (tag) => XAPI_VOCABULARY[tag].countsTowardCompletion,
);

// elements that send nothing on purpose (tracks: false), with the reason.
// A HAX element in neither list has not said what it tracks yet.
export const XAPI_DECLARED_SILENT = ${JSON.stringify(silent, null, 2)};

// silent elements page reading notes as seen (no statement of their own)
export const XAPI_READING_CHECKPOINT_TAGS = Object.keys(
  XAPI_DECLARED_SILENT,
).filter((tag) => XAPI_DECLARED_SILENT[tag].readingCheckpoint);
`;
  return { json, js, silentJson };
}

function readJson(file = OUT_JSON) {
  try {
    return JSON.stringify(JSON.parse(fs.readFileSync(file, "utf8")));
  } catch {
    return "";
  }
}

function readModule(name = "XAPI_VOCABULARY") {
  try {
    const src = fs
      .readFileSync(OUT_JS, "utf8")
      .replace(/export\s+const\s+/g, "const ");
    const box = Object.create(null);
    vm.runInNewContext(`${src}\n;__out = ${name};`, box, {
      timeout: 100,
    });
    return JSON.stringify(box.__out);
  } catch {
    return "";
  }
}

// compare data, not text, so Prettier formatting of the outputs is fine
function outputsMatch(vocab, silent) {
  const want = JSON.stringify(vocab);
  const wantSilent = JSON.stringify(silent);
  return (
    readJson() === want &&
    readModule() === want &&
    readJson(OUT_SILENT_JSON) === wantSilent &&
    readModule("XAPI_DECLARED_SILENT") === wantSilent
  );
}

export function isUpToDate() {
  const { vocab, silent, errors } = collectVocabulary();
  return !errors.length && outputsMatch(vocab, silent);
}

function main() {
  const check = process.argv.includes("--check");
  const { vocab, silent, errors } = collectVocabulary();
  if (errors.length) {
    errors.forEach((e) => console.error(e));
    process.exit(1);
  }
  const { json, js, silentJson } = render(vocab, silent);
  if (check) {
    if (!outputsMatch(vocab, silent)) {
      console.error(
        "xAPI vocabulary is stale: run node scripts/generate-xapi-vocabulary.mjs",
      );
      process.exit(1);
    }
    console.log(
      `xAPI vocabulary up to date (${Object.keys(vocab).length} elements, ${Object.keys(silent).length} silent on purpose)`,
    );
    return;
  }
  fs.writeFileSync(OUT_JSON, json);
  fs.writeFileSync(OUT_JS, js);
  fs.writeFileSync(OUT_SILENT_JSON, silentJson);
  console.log(
    `wrote ${Object.keys(vocab).length} elements (${Object.keys(silent).length} silent on purpose) to ${path.relative(root, OUT_JSON)}`,
  );
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main();
}
