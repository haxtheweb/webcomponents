/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Browser Support (AGENTS.md, rule 4e0800ef-32ff-42dc-83f0-bbb953d97554):
 * a pull request adds no new use of a JS built-in or Web API that is not
 * Baseline widely available, unless it marks it as a deliberate exception.
 *
 * `yarn lint` only warns on these (baseline-js/use-baseline), because the
 * rule cannot see a feature check, and code that predates it has many. This
 * gate compares warning counts instead: for each element file the pull
 * request changes, it lints the file as it is now and as it was on the base
 * branch, and fails when the count went up. A deliberate exception is the
 * same as for the lint: a feature check with a working plain path, plus a
 * `// eslint-disable-next-line baseline-js/use-baseline -- <why>` note (see
 * BROWSER-SUPPORT-MATRIX.md), which removes the warning.
 *
 *   node scripts/baseline-apis-check.mjs --base origin/master
 */
import console from "node:console";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { ESLint } from "eslint";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RULE = "baseline-js/use-baseline";

const git = (args) =>
  execFileSync("git", args, {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    stdio: ["ignore", "pipe", "ignore"],
  });

export function grew(before, after) {
  return after.length > before.length;
}

async function main() {
  const at = process.argv.indexOf("--base");
  const base = at !== -1 ? process.argv[at + 1] : null;
  if (!base) {
    console.error("usage: node scripts/baseline-apis-check.mjs --base <ref>");
    process.exit(2);
  }
  const mergeBase = git(["merge-base", base, "HEAD"]).trim();
  const changed = git([
    "diff",
    "--name-only",
    "--diff-filter=AM",
    mergeBase,
    "HEAD",
    "--",
    "elements",
  ])
    .split("\n")
    .filter(
      (f) =>
        /\.js$/.test(f) &&
        !/\/(test|demo|node_modules)\//.test(f) &&
        !/\.min\.js$/.test(f),
    );
  const eslint = new ESLint({ cwd: ROOT });
  const count = async (text, file) => {
    const [result] = await eslint.lintText(text, {
      filePath: path.join(ROOT, file),
    });
    return result ? result.messages.filter((m) => m.ruleId === RULE) : [];
  };
  let failed = 0;
  for (const file of changed) {
    if (await eslint.isPathIgnored(path.join(ROOT, file))) continue;
    let before = "";
    try {
      before = git(["show", `${mergeBase}:${file}`]);
    } catch (e) {
      before = ""; // a new file: every warning in it is new
    }
    const was = before ? await count(before, file) : [];
    const now = await count(git(["show", `HEAD:${file}`]), file);
    if (grew(was, now)) {
      failed++;
      console.log(
        `${file}: ${now.length} non-Baseline API use(s), was ${was.length}:`,
      );
      for (const m of now)
        console.log(`  ${file}:${m.line}:${m.column} ${m.message}`);
    }
  }
  console.log(
    `baseline-apis: ${changed.length} changed file(s), ${failed ? failed + " with new non-Baseline APIs; add a feature check and an eslint-disable-next-line baseline-js/use-baseline -- <why> note, or use a widely available API" : "OK"}`,
  );
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
