/**
 * Local CodeQL scan, so a PR passes the CodeQL check on its first push.
 *
 * Mirrors .github/workflows/codeql-analysis.yml: the same JavaScript
 * code-scanning query suite and the same paths-ignore list from
 * .github/codeql/codeql-config.yml. To stay fast (about a minute instead of a
 * full monorepo scan) it only builds a database for the element folders this
 * branch changed, and only reports alerts that land in changed files, which is
 * what the PR check annotates. CI still scans everything and stays the source
 * of truth; this catches the alerts a PR introduces before it goes up.
 *
 *   yarn codeql            scan the element folders changed on this branch
 *   yarn codeql:install    download the CodeQL CLI bundle (one time, ~1GB unpacked)
 *   node scripts/codeql-local.mjs --check-cli   exit 0 when the CLI is available
 *
 * Memory: CodeQL's default Java heap is too small for larger scans and fails with
 * "ran out of Java heap". The scan passes --ram (60% of this machine's memory,
 * 2048-8192 MB); set CODEQL_RAM=<megabytes> to override.
 *
 * CLI lookup order: $CODEQL_CLI, `codeql` on PATH, then the bundle that
 * `yarn codeql:install` puts in $XDG_CACHE_HOME/haxtheweb/codeql (default
 * ~/.cache/haxtheweb/codeql).
 *
 * Exit codes: 0 clean, 1 alerts in changed files, 3 CodeQL CLI not installed,
 * 4 CodeQL itself failed.
 */

import { spawnSync } from "node:child_process";
import console from "node:console";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_FILE = path.join(root, ".github", "codeql", "codeql-config.yml");
// Same suite GitHub's code scanning runs for JavaScript by default.
const SUITE =
  "codeql/javascript-queries:codeql-suites/javascript-code-scanning.qls";
const BUNDLE_URL =
  "https://github.com/github/codeql-action/releases/latest/download/codeql-bundle-linux64.tar.gz";
const BUNDLE_URLS = {
  linux: BUNDLE_URL,
  darwin: BUNDLE_URL.replace("linux64", "osx64"),
  win32: BUNDLE_URL.replace("linux64", "win64"),
};
const SCANNED = /\.(m?js|cjs|html?)$/;

const cacheDir = path.join(
  process.env.XDG_CACHE_HOME || path.join(os.homedir(), ".cache"),
  "haxtheweb",
  "codeql",
);
const exe = process.platform === "win32" ? "codeql.exe" : "codeql";

function run(cmd, args, opts = {}) {
  return spawnSync(cmd, args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
    ...opts,
  });
}

function works(bin) {
  const res = run(bin, ["version", "--format=terse"]);
  return res.status === 0;
}

export function findCodeql() {
  const candidates = [
    process.env.CODEQL_CLI,
    "codeql",
    path.join(cacheDir, "codeql", exe),
  ].filter(Boolean);
  return candidates.find((bin) => works(bin)) || null;
}

function install() {
  const url = BUNDLE_URLS[process.platform];
  if (!url) {
    console.error(`codeql: no CodeQL bundle for platform ${process.platform}`);
    return 4;
  }
  fs.mkdirSync(cacheDir, { recursive: true });
  const archive = path.join(cacheDir, "codeql-bundle.tar.gz");
  console.log(`codeql: downloading CodeQL bundle to ${cacheDir} ...`);
  let res = run("curl", ["-fsSL", "-o", archive, url], { stdio: "inherit" });
  if (res.status !== 0) {
    console.error("codeql: download failed");
    return 4;
  }
  fs.rmSync(path.join(cacheDir, "codeql"), { recursive: true, force: true });
  res = run("tar", ["-xzf", archive, "-C", cacheDir], { stdio: "inherit" });
  fs.rmSync(archive, { force: true });
  if (res.status !== 0) {
    console.error("codeql: unpacking the bundle failed");
    return 4;
  }
  const bin = path.join(cacheDir, "codeql", exe);
  const version = run(bin, ["version", "--format=terse"]).stdout.trim();
  console.log(`codeql: installed CodeQL ${version} at ${bin}`);
  return 0;
}

function git(args) {
  const res = run("git", args);
  return res.status === 0 ? res.stdout.trim() : "";
}

function changedFiles() {
  const base = ["origin/HEAD", "origin/master", "origin/main"].find((ref) =>
    git(["rev-parse", "--verify", "--quiet", ref]),
  );
  const found = new Set();
  const add = (text) =>
    text
      .split("\n")
      .filter(Boolean)
      .forEach((f) => found.add(f));
  if (base) {
    const mergeBase = git(["merge-base", "HEAD", base]) || base;
    add(git(["diff", "--name-only", "--diff-filter=ACMR", mergeBase, "HEAD"]));
  }
  add(git(["diff", "--name-only", "--diff-filter=ACMR", "HEAD"]));
  add(git(["ls-files", "--others", "--exclude-standard"]));
  return [...found].filter(
    (f) => SCANNED.test(f) && fs.existsSync(path.join(root, f)),
  );
}

// What to put in the CodeQL config's `paths`: each changed element's whole
// folder, other files' own folder, and a root-level file by itself. Scanning
// "." for a root file (package.json scripts, web-test-runner.config.mjs) would
// build a database of the entire monorepo.
export function scanTargets(changed) {
  return [
    ...new Set(
      changed.map((f) => {
        const m = f.match(/^elements\/[^/]+/);
        if (m) {
          return m[0];
        }
        const dir = path.posix.dirname(f);
        return dir === "." ? f : dir;
      }),
    ),
  ];
}

// --ram for CodeQL, in MB: CODEQL_RAM if set, otherwise 60% of total memory
// clamped to 2048-8192.
export function ramMegabytes(env = process.env, totalBytes = os.totalmem()) {
  const asked = Number(env.CODEQL_RAM);
  if (Number.isInteger(asked) && asked > 0) {
    return asked;
  }
  const sixty = Math.floor((totalBytes / 1024 / 1024) * 0.6);
  return Math.min(8192, Math.max(2048, sixty));
}

// paths-ignore entries from the repo's CodeQL config, so the local scan skips
// exactly what CI skips (tests, demos, vendored libraries).
function ignoredPaths() {
  const text = fs.readFileSync(CONFIG_FILE, "utf8");
  const block = text.split(/^paths-ignore:\s*$/m)[1] || "";
  return [...block.matchAll(/^\s+-\s+"?([^"\n#]+?)"?\s*$/gm)].map((m) => m[1]);
}

function scan(codeql) {
  const changed = changedFiles();
  const dirs = scanTargets(changed);
  const ram = `--ram=${ramMegabytes()}`;
  if (!dirs.length) {
    console.log("codeql: no changed JS/HTML files, nothing to scan.");
    return 0;
  }
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "codeql-local-"));
  try {
    const cfg = path.join(tmp, "config.yml");
    fs.writeFileSync(
      cfg,
      [
        'name: "local scan of changed elements"',
        "paths:",
        ...dirs.map((d) => `  - "${d}"`),
        "paths-ignore:",
        ...ignoredPaths().map((p) => `  - "${p}"`),
        "",
      ].join("\n"),
    );
    const db = path.join(tmp, "db");
    const sarif = path.join(tmp, "results.sarif");
    console.log(`codeql: scanning ${dirs.join(", ")}`);
    let res = run(codeql, [
      "database",
      "create",
      db,
      "--language=javascript",
      `--source-root=${root}`,
      `--codescanning-config=${cfg}`,
      "--overwrite",
      ram,
      "--quiet",
    ]);
    if (res.status !== 0) {
      console.error(res.stderr || res.stdout);
      console.error("codeql: database creation failed");
      return 4;
    }
    res = run(codeql, [
      "database",
      "analyze",
      db,
      SUITE,
      "--format=sarif-latest",
      `--output=${sarif}`,
      ram,
      "--quiet",
    ]);
    if (res.status !== 0) {
      console.error(res.stderr || res.stdout);
      console.error("codeql: analysis failed");
      return 4;
    }
    const results = JSON.parse(fs.readFileSync(sarif, "utf8")).runs.flatMap(
      (r) => r.results || [],
    );
    const hits = results.filter((r) =>
      changed.includes(r.locations[0].physicalLocation.artifactLocation.uri),
    );
    hits.forEach((r) => {
      const loc = r.locations[0].physicalLocation;
      // drop the markdown link targets CodeQL puts in messages
      const message = r.message.text.replace(/\]\(\d+\)/g, "]");
      console.log(
        `  ${loc.artifactLocation.uri}:${loc.region.startLine}  ${r.ruleId}\n    ${message}`,
      );
    });
    const other = results.length - hits.length;
    console.log(
      `codeql: ${hits.length} alert(s) in changed files` +
        (other ? ` (${other} already in untouched files, not blocking)` : ""),
    );
    if (hits.length) {
      console.log(
        "codeql: fix these before pushing; rule help: https://codeql.github.com/codeql-query-help/javascript/",
      );
    }
    return hits.length ? 1 : 0;
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("--install")) {
    return install();
  }
  const codeql = findCodeql();
  if (argv.includes("--check-cli")) {
    return codeql ? 0 : 3;
  }
  if (!codeql) {
    console.error(
      "codeql: the CodeQL CLI is not installed. Run `yarn codeql:install` (one time), or set CODEQL_CLI.",
    );
    return 3;
  }
  return scan(codeql);
}

// run only as a script, so tests can import the helpers above
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  process.exitCode = main();
}
