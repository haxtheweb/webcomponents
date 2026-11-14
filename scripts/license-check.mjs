#!/usr/bin/env node

/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Dependency license policy check (haxtheweb/issues#3262).
 *
 * The policy lives in .github/license-policy.json:
 *   allow       SPDX ids compatible with Apache-2.0
 *   review      SPDX id prefixes that need a person to look (LGPL, MPL)
 *   exceptions  accepted packages, keyed by purl without version, each with
 *               the license expressions that were accepted for it
 *
 * A license expression is scored ok, review or fail: OR takes the best
 * branch, AND the worst. Anything not allowed and not in review (GPL, AGPL,
 * SSPL, BUSL, Commons Clause, LicenseRef-*, NOASSERTION, unknown) fails.
 *
 * Usage:
 *   node scripts/license-check.mjs --allow-licenses
 *       print the allow list comma separated (dependency-review-action input)
 *   node scripts/license-check.mjs --exception-purls
 *       print the exception purls comma separated (allow-dependencies-licenses)
 *   node scripts/license-check.mjs --pr <invalid-license-changes.json>
 *       PR gate: classify what dependency-review-action reported. Fails on
 *       unknown licenses (the action only warns) and explains LGPL/MPL.
 *   node scripts/license-check.mjs --sweep <sbom.json>
 *       weekly sweep of the whole tree from GitHub's dependency graph SBOM
 *       (SPDX JSON). Fails on new problems and on accepted exceptions whose
 *       license changed.
 *
 * Markdown findings go to stdout and, in Actions, to the job summary.
 * Exit code 1 when anything needs attention.
 */

import console from "node:console";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const POLICY_FILE = path.join(root, ".github", "license-policy.json");

const RANK = { ok: 0, review: 1, fail: 2 };
const NAMES = ["ok", "review", "fail"];

export function loadPolicy(file = POLICY_FILE) {
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  return {
    allow: new Set(raw.allow || []),
    review: raw.review || [],
    exceptions: raw.exceptions || {},
  };
}

// split an SPDX expression into tokens: ( ) AND OR WITH and license ids
function tokenize(expression) {
  return String(expression)
    .replace(/\(/g, " ( ")
    .replace(/\)/g, " ) ")
    .split(/\s+/)
    .filter((t) => t.length > 0);
}

function scoreId(id, policy) {
  const clean = id.replace(/\+$/, "");
  if (policy.allow.has(clean)) {
    return RANK.ok;
  }
  for (const prefix of policy.review) {
    if (clean.startsWith(prefix)) {
      return RANK.review;
    }
  }
  return RANK.fail;
}

/**
 * Score an SPDX license expression against the policy.
 * @returns {"ok"|"review"|"fail"}
 */
export function evaluate(expression, policy) {
  if (expression === null || expression === undefined) {
    return "fail";
  }
  const tokens = tokenize(expression);
  if (tokens.length === 0) {
    return "fail";
  }
  let pos = 0;
  let broken = false;

  function primary() {
    const t = tokens[pos];
    if (t === undefined) {
      broken = true;
      return RANK.fail;
    }
    pos++;
    if (t === "(") {
      const value = orExpr();
      if (tokens[pos] === ")") {
        pos++;
      } else {
        broken = true;
      }
      return value;
    }
    if (t === ")" || t === "AND" || t === "OR" || t === "WITH") {
      broken = true;
      return RANK.fail;
    }
    let value = scoreId(t, policy);
    // "X WITH some-exception": the exception only adds permissions, so the
    // base license decides
    if (tokens[pos] === "WITH") {
      pos += 2;
    }
    return value;
  }

  function andExpr() {
    let value = primary();
    while (tokens[pos] === "AND") {
      pos++;
      value = Math.max(value, primary());
    }
    return value;
  }

  function orExpr() {
    let value = andExpr();
    while (tokens[pos] === "OR") {
      pos++;
      value = Math.min(value, andExpr());
    }
    return value;
  }

  const value = orExpr();
  if (broken || pos !== tokens.length) {
    return "fail";
  }
  return NAMES[value];
}

/** "pkg:npm/%40scope/name@1.2.3" -> "pkg:npm/%40scope/name" */
export function purlKey(purl) {
  const noQualifiers = String(purl).split("?")[0].split("#")[0];
  const at = noQualifiers.lastIndexOf("@");
  return at > noQualifiers.indexOf("/")
    ? noQualifiers.slice(0, at)
    : noQualifiers;
}

// only third-party npm packages are in scope: workspace packages are our own
// Apache-2.0 code and GitHub Actions carry no license in the graph. A
// workspace the lockfile lists by its folder ("elements/<name>") reaches the
// graph under that path, which no registry package can be named: an npm name
// only holds a "/" after an "@scope".
function inScope(purl) {
  if (typeof purl !== "string" || !purl.startsWith("pkg:npm/")) {
    return false;
  }
  if (
    purl.startsWith("pkg:npm/%40haxtheweb/") ||
    purl.startsWith("pkg:npm/@haxtheweb/")
  ) {
    return false;
  }
  const name = decodeURIComponent(
    purl.slice("pkg:npm/".length).split(/[?#]/)[0],
  );
  return name.startsWith("@") || !name.includes("/");
}

function accepted(policy, key, license) {
  const list = policy.exceptions[key];
  return Array.isArray(list) && list.includes(license);
}

/**
 * Sweep every package in a GitHub dependency graph SBOM (SPDX JSON).
 * @returns {{problems: object[], accepted: object[], stale: string[], total: number}}
 */
export function sweep(sbom, policy) {
  const packages = (sbom.sbom || sbom).packages || [];
  const problems = [];
  const acceptedList = [];
  const flagged = new Set();
  const unique = new Set();
  let total = 0;
  for (const pkg of packages) {
    const ref = (pkg.externalRefs || []).find(
      (r) => r.referenceType === "purl",
    );
    const purl = ref ? ref.referenceLocator : null;
    if (!inScope(purl)) {
      continue;
    }
    // the graph lists a package once per manifest that pulls it in
    if (unique.has(purl)) {
      continue;
    }
    unique.add(purl);
    total++;
    const key = purlKey(purl);
    const license =
      pkg.licenseConcluded || pkg.licenseDeclared || "NOASSERTION";
    const verdict = evaluate(license, policy);
    if (verdict === "ok") {
      continue;
    }
    const row = {
      key,
      name: pkg.name,
      version: pkg.versionInfo,
      license,
      verdict,
    };
    if (accepted(policy, key, license)) {
      acceptedList.push(row);
      flagged.add(key);
    } else {
      row.changed = Array.isArray(policy.exceptions[key]);
      problems.push(row);
    }
  }
  // listed, but either gone from the tree or now under an allowed license
  const stale = Object.keys(policy.exceptions).filter(
    (key) => !flagged.has(key),
  );
  return { problems, accepted: acceptedList, stale, total };
}

/**
 * Classify dependency-review-action's invalid-license-changes output.
 * The action already fails on forbidden and unresolved; this adds unknown
 * licenses and a clearer message for LGPL/MPL.
 */
export function reviewPr(invalid, policy) {
  const problems = [];
  const groups = [
    ["unlicensed", "unknown"],
    ["unresolved", "invalid SPDX expression"],
    ["forbidden", null],
  ];
  for (const [group, reason] of groups) {
    for (const change of invalid[group] || []) {
      if (!inScope(change.package_url)) {
        continue;
      }
      const license = change.license || "NOASSERTION";
      let verdict = "fail";
      if (group === "forbidden") {
        verdict = evaluate(license, policy);
        if (verdict === "ok") {
          // dependency-review-action allows only plain ids in its list; an
          // expression it rejected can still satisfy our policy
          continue;
        }
      }
      problems.push({
        key: purlKey(change.package_url),
        name: change.name,
        version: change.version,
        manifest: change.manifest,
        license,
        verdict,
        reason:
          reason ||
          (verdict === "review"
            ? "needs review (weak copyleft)"
            : "incompatible with Apache-2.0"),
      });
    }
  }
  return problems;
}

function cell(value) {
  if (value === undefined || value === null) {
    return "";
  }
  // escape backslashes first, then pipes, so a cell cannot break the table
  return String(value).replace(/\\/g, "\\\\").replace(/\|/g, "\\|");
}

function table(rows, columns) {
  const out = [
    `| ${columns.map((c) => c[0]).join(" | ")} |`,
    `| ${columns.map(() => "---").join(" | ")} |`,
  ];
  for (const row of rows) {
    out.push(`| ${columns.map((c) => cell(row[c[1]])).join(" | ")} |`);
  }
  return out.join("\n");
}

function emit(markdown) {
  console.log(markdown);
  const summary = process.env.GITHUB_STEP_SUMMARY;
  if (summary) {
    fs.appendFileSync(summary, `${markdown}\n`);
  }
}

const HOW_TO =
  "Allowed: the `allow` list in `.github/license-policy.json` (MIT, ISC, BSD, Apache-2.0, 0BSD, CC0, Unlicense, Python-2.0, BlueOak). " +
  "Pick a dependency under one of those, or, after a maintainer has reviewed the license, add the package to `exceptions` in that file with the exact license expression.";

function runPr(file, policy) {
  const invalid = JSON.parse(fs.readFileSync(file, "utf8") || "{}");
  const problems = reviewPr(invalid, policy);
  if (problems.length === 0) {
    emit(
      "### Dependency licenses\n\nNo new dependency with a disallowed or unknown license.",
    );
    return 0;
  }
  const review = problems.filter((p) => p.verdict === "review");
  const lines = ["### Dependency licenses", ""];
  if (review.length > 0) {
    lines.push(
      `**${review.length} new dependenc${review.length === 1 ? "y needs" : "ies need"} license review (LGPL / MPL).** These weak-copyleft licenses can be fine to depend on but must be checked by a maintainer before merging.`,
      "",
    );
  }
  lines.push(
    table(problems, [
      ["Package", "name"],
      ["Version", "version"],
      ["License", "license"],
      ["Problem", "reason"],
      ["Manifest", "manifest"],
    ]),
    "",
    HOW_TO,
  );
  emit(lines.join("\n"));
  for (const p of problems) {
    console.log(
      `::error title=Dependency license::${p.name}@${p.version} (${p.license}): ${p.reason}`,
    );
  }
  return 1;
}

function runSweep(file, policy) {
  const sbom = JSON.parse(fs.readFileSync(file, "utf8"));
  const result = sweep(sbom, policy);
  const lines = [
    "### Dependency license sweep",
    "",
    `${result.total} third-party npm packages checked against \`.github/license-policy.json\`.`,
    "",
  ];
  if (result.problems.length > 0) {
    for (const p of result.problems) {
      p.reason = p.changed
        ? "license changed since it was accepted"
        : p.verdict === "review"
          ? "needs review (weak copyleft)"
          : "incompatible with Apache-2.0 or unknown";
    }
    lines.push(
      `**${result.problems.length} problem(s)**`,
      "",
      table(result.problems, [
        ["Package", "name"],
        ["Version", "version"],
        ["License", "license"],
        ["Problem", "reason"],
      ]),
      "",
      HOW_TO,
      "",
    );
  } else {
    lines.push("No problems.", "");
  }
  if (result.accepted.length > 0) {
    lines.push(
      `<details><summary>${result.accepted.length} accepted exception(s) still present</summary>`,
      "",
      table(result.accepted, [
        ["Package", "name"],
        ["Version", "version"],
        ["License", "license"],
      ]),
      "",
      "</details>",
      "",
    );
  }
  if (result.stale.length > 0) {
    lines.push(
      `Exceptions no longer needed (safe to remove): ${result.stale.map((s) => `\`${s}\``).join(", ")}`,
    );
  }
  emit(lines.join("\n"));
  return result.problems.length > 0 ? 1 : 0;
}

function main(argv) {
  const policy = loadPolicy();
  const [flag, file] = argv;
  if (flag === "--allow-licenses") {
    console.log([...policy.allow].join(","));
    return 0;
  }
  if (flag === "--exception-purls") {
    console.log(Object.keys(policy.exceptions).join(","));
    return 0;
  }
  if (flag === "--pr" && file) {
    return runPr(file, policy);
  }
  if (flag === "--sweep" && file) {
    return runSweep(file, policy);
  }
  console.error(
    "usage: license-check.mjs --allow-licenses | --exception-purls | --pr <file> | --sweep <sbom.json>",
  );
  return 2;
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  process.exitCode = main(process.argv.slice(2));
}
