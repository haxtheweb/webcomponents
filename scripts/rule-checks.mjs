/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Mechanical checks for HAX rules that nothing enforced yet. Each reads the
 * files git tracks, prints file:line (or file) for every finding and exits 1
 * when there is one.
 *
 *   node scripts/rule-checks.mjs typescript
 *     NO TypeScript (AGENTS.md): no .ts, .tsx, .mts or .cts source under
 *     elements/. Type declarations (.d.ts) are allowed: they describe the
 *     JavaScript for editors and are never compiled.
 *
 *   node scripts/rule-checks.mjs node-version
 *     Node.js Version, Latest LTS (praw RULES.md 92dfb3b2): the root
 *     package.json engines.node, any .nvmrc or .node-version, and every
 *     node-version in .github/workflows name the current LTS, NODE_LTS below.
 *     Raise NODE_LTS when a new LTS line starts and fix what this flags.
 *
 *   node scripts/rule-checks.mjs test-sleeps [--base <git ref>] [--update-baseline]
 *     Testing, Poll, Don't Sleep (praw RULES.md 932f6cd4): a test waits for
 *     the condition it needs, never a fixed time. Counts fixed sleeps per
 *     test file (aTimeout(n), new Promise((r) => setTimeout(r, n)),
 *     page.waitForTimeout(n)). Sleeps that predate the rule are listed in
 *     scripts/test-sleeps.baseline.json; a file fails when it has more than
 *     its baseline count. With --base, the baseline itself may only shrink
 *     compared with that ref: no new file, no higher count. After removing
 *     sleeps, run with --update-baseline and commit the file.
 *
 *   node scripts/rule-checks.mjs all       every check above (no --base)
 *
 * Standard library only. Self-tests: scripts/test/rule-checks.test.mjs.
 */
import console from "node:console";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const NODE_LTS = 24;
const BASELINE = "scripts/test-sleeps.baseline.json";

function tracked(root, patterns) {
  const out = execFileSync("git", ["ls-files", "-z", "--", ...patterns], {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  return out.split("\0").filter(Boolean);
}

/* ---------- NO TypeScript ---------- */
export function typescriptFindings(files) {
  return files
    .filter((f) => /\.(ts|tsx|mts|cts)$/.test(f) && !/\.d\.ts$/.test(f))
    .map(
      (f) =>
        `${f}: TypeScript source; HAX elements ship JavaScript (a .d.ts declaration is fine)`,
    );
}

/* ---------- Node.js latest LTS ---------- */
// a version string names the LTS when its major version is NODE_LTS:
// "24", "24.x", "^24", ">=24", "24.11.0", "lts/*" (always the current LTS)
export function namesLts(value, lts = NODE_LTS) {
  const v = String(value)
    .trim()
    .replace(/^["']|["']$/g, "");
  if (/^lts\/\*$/i.test(v) || /^lts\/(\w+)$/i.test(v)) return true;
  const m = v.match(/^(?:v|\^|~|>=\s*)?(\d+)(?:\.(?:\d+|x|\*))*$/i);
  return !!m && Number(m[1]) === lts;
}

export function nodeVersionFindings(
  { pkg, versionFiles, workflows },
  lts = NODE_LTS,
) {
  const out = [];
  const engine = pkg && pkg.engines ? pkg.engines.node : undefined;
  if (!engine)
    out.push(`package.json: engines.node is missing; set it to "${lts}.x"`);
  else if (!namesLts(engine, lts))
    out.push(
      `package.json: engines.node is "${engine}", not Node ${lts} (latest LTS)`,
    );
  for (const [file, text] of Object.entries(versionFiles)) {
    if (!namesLts(text.trim(), lts))
      out.push(`${file}: "${text.trim()}" is not Node ${lts} (latest LTS)`);
  }
  for (const [file, text] of Object.entries(workflows)) {
    text.split("\n").forEach((line, i) => {
      const m = line.match(/^\s*-?\s*node-version:\s*(.+?)\s*(#.*)?$/);
      if (!m) return;
      let raw = m[1];
      if (/\$\{\{/.test(raw)) return; // a matrix value, checked where the matrix lists it
      const values = raw.startsWith("[")
        ? raw.replace(/^\[|\]$/g, "").split(",")
        : [raw];
      for (const v of values) {
        if (v.trim() && !namesLts(v, lts))
          out.push(
            `${file}:${i + 1}: node-version ${v.trim()} is not Node ${lts} (latest LTS)`,
          );
      }
    });
  }
  return out;
}

/* ---------- Poll, don't sleep ---------- */
const SLEEPS = [
  /\baTimeout\s*\(/g,
  /new\s+Promise\s*\(\s*\(?\s*(\w+)\s*\)?\s*=>\s*setTimeout\s*\(\s*\1\s*,/g,
  /\.waitForTimeout\s*\(/g,
];
export function countSleeps(text) {
  return SLEEPS.reduce((n, re) => n + (text.match(re) || []).length, 0);
}

export function sleepFindings(counts, baseline) {
  const out = [];
  for (const [file, n] of Object.entries(counts)) {
    const allowed = baseline[file] || 0;
    if (n > allowed) {
      out.push(
        `${file}: ${n} fixed sleep(s), ${allowed} allowed; wait for the condition instead (poll a property, an event or the DOM)`,
      );
    }
  }
  return out;
}

export function baselineGrowth(previous, next) {
  const out = [];
  for (const [file, n] of Object.entries(next)) {
    if (!(file in previous))
      out.push(`${BASELINE}: adds ${file} (${n}); the baseline only shrinks`);
    else if (n > previous[file])
      out.push(
        `${BASELINE}: raises ${file} from ${previous[file]} to ${n}; the baseline only shrinks`,
      );
  }
  return out;
}

function sleepCounts(root) {
  const counts = {};
  for (const f of tracked(root, [
    "elements/*/test/*.js",
    "elements/*/test/**/*.js",
  ])) {
    const n = countSleeps(fs.readFileSync(path.join(root, f), "utf8"));
    if (n) counts[f] = n;
  }
  return counts;
}

/* ---------- runner ---------- */
function run(check, args, root = ROOT) {
  if (check === "typescript")
    return typescriptFindings(tracked(root, ["elements"]));
  if (check === "node-version") {
    const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
    const versionFiles = {};
    for (const f of [".nvmrc", ".node-version"])
      if (fs.existsSync(path.join(root, f))) versionFiles[f] = read(f);
    const workflows = {};
    for (const f of tracked(root, [".github/workflows"]))
      if (/\.ya?ml$/.test(f)) workflows[f] = read(f);
    return nodeVersionFindings({
      pkg: JSON.parse(read("package.json")),
      versionFiles,
      workflows,
    });
  }
  if (check === "test-sleeps") {
    const counts = sleepCounts(root);
    const file = path.join(root, BASELINE);
    if (args.includes("--update-baseline")) {
      const sorted = Object.fromEntries(
        Object.keys(counts)
          .sort()
          .map((k) => [k, counts[k]]),
      );
      fs.writeFileSync(file, JSON.stringify(sorted, null, 2) + "\n");
      console.log(
        `test-sleeps: baseline written with ${Object.keys(sorted).length} file(s)`,
      );
      return [];
    }
    const baseline = fs.existsSync(file)
      ? JSON.parse(fs.readFileSync(file, "utf8"))
      : {};
    const out = sleepFindings(counts, baseline);
    const at = args.indexOf("--base");
    if (at !== -1 && args[at + 1]) {
      let previous = {};
      try {
        previous = JSON.parse(
          execFileSync("git", ["show", `${args[at + 1]}:${BASELINE}`], {
            cwd: root,
            encoding: "utf8",
            stdio: ["ignore", "pipe", "ignore"],
          }),
        );
      } catch (e) {
        previous = null; // no baseline at the base yet: this pull request adds it
      }
      if (previous) out.push(...baselineGrowth(previous, baseline));
    }
    const fewer = Object.entries(baseline).filter(
      ([f, n]) => (counts[f] || 0) < n,
    ).length;
    if (fewer)
      console.log(
        `test-sleeps: ${fewer} file(s) now have fewer sleeps than the baseline; run with --update-baseline to lock that in`,
      );
    return out;
  }
  throw new Error(`unknown check "${check}"`);
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const [check, ...args] = process.argv.slice(2);
  const checks =
    check === "all" ? ["typescript", "node-version", "test-sleeps"] : [check];
  if (!check) {
    console.error(
      "usage: node scripts/rule-checks.mjs <typescript|node-version|test-sleeps|all> [--base <ref>] [--update-baseline]",
    );
    process.exit(2);
  }
  let failed = 0;
  for (const c of checks) {
    const findings = run(c, args);
    findings.forEach((f) => console.log(f));
    console.log(
      `${c}: ${findings.length ? findings.length + " finding(s)" : "OK"}`,
    );
    failed += findings.length;
  }
  process.exit(failed ? 1 : 0);
}
