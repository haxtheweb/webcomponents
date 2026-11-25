#!/usr/bin/env node
/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * The HAX release network: what ubiquity does with every repo, read from
 * scripts/ubiquity-network.json. ubiquity-push.sh calls it; a maintainer can
 * run any part of it on its own.
 *
 *   node scripts/ubiquity-network.mjs versions [--strict]
 *       .version against every repo's version file. Without --strict it warns
 *       when one is ahead; with it, .version must be past every one (a
 *       release would otherwise tag backwards and npm publish would fail).
 *   node scripts/ubiquity-network.mjs coverage
 *       every repo PRAW names (ecosystem/network.json properties, and the
 *       ecosystem map) is listed in ubiquity-network.json or excluded there.
 *   node scripts/ubiquity-network.mjs preflight
 *       before anything changes: coverage, then every checkout is there, is
 *       a git repo on its branch, and has the tools its steps use.
 *   node scripts/ubiquity-network.mjs landed [--version x.y.z] [--once] [--package name]
 *       wait (default up to 30 minutes) until every npm package and public
 *       URL in the list reports the release version. --package waits on that
 *       one npm package only (e.g. before npm-updating to it).
 *   node scripts/ubiquity-network.mjs satellites [--version x.y.z] [--dry-run] [--only a,b]
 *       refresh, version, commit, tag and push the satellite repos, in order.
 *       Run it after `landed` passes; it is safe to run again on its own.
 *   node scripts/ubiquity-network.mjs plan
 *       print what a release does, repo by repo.
 *   node scripts/ubiquity-network.mjs sync [--clone] [--delay s] [--retries n] [--retry-wait s]
 *       (yarn run ubiquity-git-sync) bring every checkout up to date before a
 *       dry run or release: coverage, then a fast-forward-only `git pull` of
 *       each repo's release branch, and of the waxam mirror. Missing
 *       checkouts and checkouts on another branch are reported, not
 *       changed; --clone clones the missing ones. Exits 1 unless every repo
 *       is there, on its branch and current.
 *       GitHub throttles many connections in a row, so sync waits --delay
 *       seconds (default 3) between repos, and a failed pull is tried again
 *       up to --retries times (default 3), waiting --retry-wait seconds
 *       (default 20) times the attempt number first: 20s, 40s, 60s. A
 *       connection that stops sending data is dropped after about a minute
 *       rather than hanging, so it is retried too.
 *
 * Checkouts are found under $HAXTHEWEB_ROOT, which defaults to ~/haxtheweb
 * (where ubiquity-push.sh works) or, without one, the folder this
 * webcomponents checkout sits in.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import console from "node:console";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { stampRepos } from "./release-references.mjs";

const WC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// the same default ubiquity-push.sh and refresh-haxsite.mjs use, then the
// folder this checkout sits in
const HOME_ROOT = path.join(os.homedir(), "haxtheweb");
export const ROOT = path.resolve(
  process.env.HAXTHEWEB_ROOT ||
    (fs.existsSync(HOME_ROOT) ? HOME_ROOT : path.join(WC, "..")),
);
export const NETWORK = JSON.parse(
  fs.readFileSync(path.join(WC, "scripts", "ubiquity-network.json"), "utf8"),
);

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const option = (name) => {
  const i = argv.indexOf(name);
  return i > -1 ? argv[i + 1] : undefined;
};

export function repoDir(entry) {
  return path.join(ROOT, entry.repo);
}

/** the release version: --version, else .version in this checkout */
export function releaseVersion() {
  const given = option("--version");
  if (given) return given.trim();
  // a dry run may preview a release whose release-version has not happened yet
  if (
    process.env.UBIQUITY_DRY_RUN === "1" &&
    process.env.UBIQUITY_DRY_RUN_VERSION
  ) {
    return process.env.UBIQUITY_DRY_RUN_VERSION.trim();
  }
  try {
    return fs.readFileSync(path.join(WC, ".version"), "utf8").trim() || null;
  } catch (e) {
    return null;
  }
}

export function readVersion(file) {
  try {
    const text = fs.readFileSync(file, "utf8");
    if (file.endsWith(".json")) {
      return JSON.parse(text).version || null;
    }
    if (file.endsWith(".toml")) {
      // [project] version, the first top-level version key
      const m = /^version\s*=\s*"([^"]+)"/m.exec(text);
      return m ? m[1] : null;
    }
    return text.trim() || null;
  } catch (e) {
    return null;
  }
}

// numeric compare of x.y.z; prerelease tags are not used in this ecosystem
export function compare(a, b) {
  const pa = String(a)
    .split(/[.-]/)
    .map((n) => parseInt(n, 10) || 0);
  const pb = String(b)
    .split(/[.-]/)
    .map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < 3; i++) {
    if (pa[i] !== pb[i]) {
      return pa[i] > pb[i] ? 1 : -1;
    }
  }
  return 0;
}

const isVersion = (v) => /^\d+\.\d+\.\d+$/.test(v || "");

function git(dir, args) {
  return execFileSync("git", args, {
    cwd: dir,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function which(cmd) {
  try {
    // a dry run puts logging stubs first on PATH; look past them
    const env = Object.assign({}, process.env, {
      PATH: process.env.UBIQUITY_REAL_PATH || process.env.PATH,
    });
    execFileSync("which", [cmd], { stdio: "ignore", env });
    return true;
  } catch (e) {
    return false;
  }
}

// ---------------------------------------------------------------- versions

/**
 * The repos whose version file is at or past the release. Releasing
 * (strict) needs .version strictly past every repo that publishes to npm or
 * bumps with commit-and-tag-version: an equal version is already published
 * or tagged there. A repo that only records the version (a .version file, a
 * direct tag) just must not be ahead. Between releases every one equals
 * .version, so the non-strict build-time report only flags real drift
 * (ahead).
 */
export function versionsAhead(release, strict) {
  const ahead = [];
  NETWORK.repos.forEach((entry) => {
    if (!entry.versionFile || entry.repo === "webcomponents") return;
    const version = readVersion(path.join(repoDir(entry), entry.versionFile));
    const bumps =
      !!entry.publish || String(entry.tag).includes("commit-and-tag-version");
    if (version && compare(version, release) >= (strict && bumps ? 0 : 1)) {
      ahead.push(`${entry.repo} ${version}`);
    }
  });
  return ahead;
}

export function cmdVersions() {
  const strict = flag("--strict");
  const release = releaseVersion();
  if (!release) {
    console.log("ubiquity-network: no .version yet; run gulp version-match");
    return strict ? 1 : 0;
  }
  const ahead = versionsAhead(release, strict);
  if (ahead.length) {
    console.log(
      `WARNING: release version ${release} (.version) is ${strict ? "not past" : "behind"} ${ahead.join(", ")}; ` +
        "releasing now would re-tag or tag backwards and npm publish would fail. " +
        "Run `yarn run release-version <x.y.z>` past these first (releases are year.month, e.g. `yarn run release-version 26.11.0`), then `yarn run release-publish`, and re-run.",
    );
    return strict ? 1 : 0;
  }
  console.log(
    `ubiquity-network: ${release} is ${strict ? "past every" : "not behind any"} repo in the network`,
  );
  return 0;
}

// ---------------------------------------------------------------- coverage

/** every haxtheweb repo PRAW names: network properties, then the ecosystem map */
export function prawRepos() {
  const praw = path.join(ROOT, "praw");
  const named = new Map();
  const network = path.join(praw, "ecosystem", "network.json");
  if (!fs.existsSync(network)) {
    throw new Error(
      `${network} not found; coverage reads the network from a praw checkout`,
    );
  }
  const record = JSON.parse(fs.readFileSync(network, "utf8"));
  Object.keys(record.properties).forEach((id) => {
    const repo = record.properties[id].repo;
    if (repo) named.set(repo, `network property ${id}`);
  });
  const map = path.join(praw, "ecosystem", "web", "hax-ecosystem.json");
  if (fs.existsSync(map)) {
    const text = fs.readFileSync(map, "utf8");
    const re = /github\.com\/haxtheweb\/([A-Za-z0-9_.-]+)/g;
    let m;
    while ((m = re.exec(text)) !== null) {
      const repo = m[1].replace(/\.git$/, "");
      if (!named.has(repo)) named.set(repo, "ecosystem map");
    }
  }
  return named;
}

export function uncovered() {
  const listed = new Set(
    [...NETWORK.repos, ...NETWORK.excluded].map((e) => e.repo.toLowerCase()),
  );
  const missing = [];
  prawRepos().forEach((where, repo) => {
    if (!listed.has(repo.toLowerCase())) missing.push(`${repo} (${where})`);
  });
  return missing;
}

function cmdCoverage() {
  let missing;
  try {
    missing = uncovered();
  } catch (e) {
    console.log(`ERROR: ${e.message}`);
    return 1;
  }
  if (missing.length) {
    console.log(
      "ERROR: PRAW names repos that scripts/ubiquity-network.json does not account for:\n" +
        missing.map((m) => `  ${m}`).join("\n") +
        "\nAdd each to `repos` (with what a release does to it) or to `excluded` (with the reason).",
    );
    return 1;
  }
  console.log(
    `ubiquity-network: every repo PRAW names is in the release network (${NETWORK.repos.length} released, ${NETWORK.excluded.length} excluded)`,
  );
  return 0;
}

// ---------------------------------------------------------------- preflight

function cmdPreflight() {
  const errors = [];
  const warnings = [];
  if (cmdCoverage() !== 0) errors.push("coverage (above)");
  NETWORK.repos.forEach((entry) => {
    const dir = repoDir(entry);
    const name = entry.repo;
    if (!fs.existsSync(path.join(dir, ".git"))) {
      errors.push(`${name}: no git checkout at ${dir}`);
      return;
    }
    let branch = "";
    try {
      branch = git(dir, ["rev-parse", "--abbrev-ref", "HEAD"]);
    } catch (e) {
      errors.push(`${name}: git cannot read ${dir}`);
      return;
    }
    if (branch !== entry.branch) {
      errors.push(`${name}: on ${branch}, the release pushes ${entry.branch}`);
    }
    if (git(dir, ["status", "--porcelain"]).length) {
      // ubiquity commits everything in a checkout (git add -A), on purpose
      warnings.push(
        `${name}: uncommitted changes will go out with the release`,
      );
    }
    if (
      entry.tag === "commit-and-tag-version" &&
      !fs.existsSync(
        path.join(dir, "node_modules", ".bin", "commit-and-tag-version"),
      )
    ) {
      errors.push(
        `${name}: node_modules/.bin/commit-and-tag-version missing (npm install there)`,
      );
    }
    if (entry.versionFile && entry.versionFile.endsWith(".json")) {
      if (!fs.existsSync(path.join(dir, entry.versionFile))) {
        errors.push(`${name}: ${entry.versionFile} missing`);
      }
    }
    if (
      entry.refresh === "haxsite" &&
      !fs.existsSync(path.join(dir, "site.json"))
    ) {
      errors.push(`${name}: refresh haxsite needs a site.json at its root`);
    }
  });
  if (!which("uv")) errors.push("haxcms-mcp: uv is not on PATH");
  if (NETWORK.repos.some((e) => e.publish)) {
    try {
      execFileSync("npm", ["whoami"], { stdio: "ignore" });
    } catch (e) {
      warnings.push("npm whoami failed: npm publish will need a login");
    }
  }
  warnings.forEach((w) => console.log(`WARNING: ${w}`));
  if (errors.length) {
    console.log(
      "ERROR: preflight failed, nothing was changed:\n" +
        errors.map((e) => `  ${e}`).join("\n"),
    );
    return 1;
  }
  console.log(
    `ubiquity-network: preflight passed for ${NETWORK.repos.length} repos under ${ROOT}`,
  );
  return 0;
}

// ---------------------------------------------------------------- landed

async function npmHas(name, version) {
  try {
    return (
      execFileSync("npm", ["view", `${name}@${version}`, "version"], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim() === version
    );
  } catch (e) {
    return false;
  }
}

async function checkLanded(version, only) {
  const pending = [];
  if (only) {
    // one npm package, whether or not the network lists it
    return (await npmHas(only, version)) ? [] : [`npm ${only}@${version}`];
  }
  for (const entry of NETWORK.repos) {
    if (entry.publish) {
      const ok = await npmHas(entry.publish, version);
      if (!ok) pending.push(`npm ${entry.publish}@${version}`);
    }
    if (entry.landed) {
      let ok = false;
      try {
        const res = await fetch(`${entry.landed}?ubiquity=${Date.now()}`, {
          cache: "no-store",
        });
        ok = res.ok && (await res.text()).trim() === version;
      } catch (e) {
        ok = false;
      }
      if (!ok) pending.push(`${entry.landed} = ${version}`);
    }
  }
  return pending;
}

async function cmdLanded() {
  const version = releaseVersion();
  if (!isVersion(version)) {
    console.log(`ERROR: no release version to wait for (${version})`);
    return 1;
  }
  const once = flag("--once");
  const only = option("--package");
  const timeout = parseInt(option("--timeout") || "1800", 10) * 1000;
  const interval = parseInt(option("--interval") || "30", 10) * 1000;
  const start = Date.now();
  for (;;) {
    const pending = await checkLanded(version, only);
    if (!pending.length) {
      console.log(
        `ubiquity-network: ${version} is public everywhere it is checked`,
      );
      return 0;
    }
    if (once || Date.now() - start >= timeout) {
      console.log(
        `${once ? "NOT YET" : "ERROR"}: ${version} has not landed at:\n` +
          pending.map((p) => `  ${p}`).join("\n") +
          (once
            ? ""
            : "\nOnce it has, run: node scripts/ubiquity-network.mjs satellites --version " +
              version),
      );
      return 1;
    }
    console.log(`waiting on ${pending.length}: ${pending.join(", ")}`);
    await new Promise((r) => setTimeout(r, interval));
  }
}

// ---------------------------------------------------------------- satellites

function setPackageVersion(file, version, prefix) {
  const pkg = JSON.parse(fs.readFileSync(file, "utf8"));
  const changes = [];
  if (pkg.version !== version) {
    changes.push(`version ${pkg.version} -> ${version}`);
    pkg.version = version;
  }
  if (prefix) {
    ["dependencies", "devDependencies", "peerDependencies"].forEach((k) => {
      const deps = pkg[k] || {};
      Object.keys(deps).forEach((d) => {
        if (d.startsWith(prefix) && deps[d] !== `^${version}`) {
          changes.push(`${d} ${deps[d]} -> ^${version}`);
          deps[d] = `^${version}`;
        }
      });
    });
  }
  return { text: JSON.stringify(pkg, null, 2) + "\n", changes };
}

function cmdSatellites() {
  const version = releaseVersion();
  const dry = flag("--dry-run") || process.env.UBIQUITY_DRY_RUN === "1";
  if (!isVersion(version)) {
    console.log(`ERROR: no release version (${version})`);
    return 1;
  }
  const only = option("--only");
  const wanted = only ? new Set(only.split(",")) : null;
  const run = (dir, cmd, args) => {
    console.log(`  [${path.basename(dir)}] ${cmd} ${args.join(" ")}`);
    if (!dry) execFileSync(cmd, args, { cwd: dir, stdio: "inherit" });
  };
  const satellites = NETWORK.repos.filter(
    (e) => e.phase === "satellite" && (!wanted || wanted.has(e.repo)),
  );
  for (const entry of satellites) {
    const dir = repoDir(entry);
    console.log(`${entry.repo}${dry ? " (dry run)" : ""}`);
    if (!fs.existsSync(path.join(dir, ".git"))) {
      console.log(
        `ERROR: no checkout at ${dir}; stopping before ${entry.repo}`,
      );
      return 1;
    }
    try {
      run(dir, "git", ["pull", "origin", entry.branch]);
      if (entry.refresh === "haxsite") {
        // the site's managed files from the haxcms-nodejs this release built,
        // and the magic script (build.js, build-haxcms.js) it loads with
        // refresh-haxsite has its own read-only --dry-run, so a dry run
        // still runs it to report what it would change
        const refresh = [
          path.join(WC, "scripts", "refresh-haxsite.mjs"),
          "--haxsite",
          dir,
          "--haxcms",
          path.join(ROOT, "haxcms-nodejs"),
          ...(dry ? ["--dry-run"] : []),
        ];
        console.log(`  [${entry.repo}] node ${refresh.join(" ")}`);
        execFileSync(process.execPath, refresh, { cwd: dir, stdio: "inherit" });
        ["build.js", "build-haxcms.js"].forEach((f) => {
          const to = path.join(dir, f);
          if (!fs.existsSync(to)) return;
          const from = path.join(WC, f);
          const same =
            Buffer.compare(fs.readFileSync(from), fs.readFileSync(to)) === 0;
          console.log(
            `  [${entry.repo}] ${f}: ${same ? "current" : "refresh from webcomponents"}`,
          );
          if (!same && !dry) fs.copyFileSync(from, to);
        });
      }
      // the release references scripts/release-references.json lists here
      stampRepos([entry.repo], version, { write: !dry, root: ROOT });
      if (entry.versionFile) {
        const file = path.join(dir, entry.versionFile);
        if (entry.versionFile.endsWith("package.json")) {
          const { text, changes } = setPackageVersion(
            file,
            version,
            entry.dependencies,
          );
          console.log(
            `  [${entry.repo}] ${entry.versionFile}: ${changes.length ? changes.join(", ") : "current"}`,
          );
          if (changes.length && !dry) fs.writeFileSync(file, text);
        } else if (readVersion(file) !== version) {
          console.log(`  [${entry.repo}] ${entry.versionFile} -> ${version}`);
          if (!dry) fs.writeFileSync(file, version);
        }
      }
      const dirty = dry ? "" : git(dir, ["status", "--porcelain"]);
      if (dirty) {
        run(dir, "git", ["add", "-A"]);
        run(dir, "git", ["commit", "-m", "ubiquity publish"]);
      } else if (dry) {
        console.log(
          `  [${entry.repo}] git add -A && git commit -m "ubiquity publish" (if anything changed)`,
        );
      }
      if (entry.tag === "direct") {
        const tagged = git(dir, ["tag", "-l", `v${version}`]) === `v${version}`;
        if (!tagged)
          run(dir, "git", ["tag", "-a", `v${version}`, "-m", `v${version}`]);
      }
      run(dir, "git", ["push", "--follow-tags", "origin", entry.branch]);
      if (entry.deploy)
        console.log(`  [${entry.repo}] deploys: ${entry.deploy}`);
    } catch (e) {
      console.log(
        `ERROR: ${entry.repo} failed (${e.message}); the satellites after it were not touched. ` +
          `Fix it, then: node scripts/ubiquity-network.mjs satellites --version ${version} --only <the rest>`,
      );
      return 1;
    }
  }
  return 0;
}

// ---------------------------------------------------------------- plan

function cmdPlan() {
  const version = releaseVersion() || "(no .version)";
  console.log(`Release ${version}, checkouts under ${ROOT}\n`);
  ["core", "satellite"].forEach((phase) => {
    console.log(
      phase === "core"
        ? "Core (ubiquity-push.sh steps 0-6):"
        : "Satellites (step 7, after `landed`):",
    );
    NETWORK.repos
      .filter((e) => e.phase === phase)
      .forEach((e) => {
        const what = [
          e.refresh ? `refresh ${e.refresh}` : "",
          e.versionFile ? `version ${e.versionFile}` : "",
          e.tag !== "none" ? `tag ${e.tag}` : "",
          e.publish ? `publish ${e.publish}` : "",
        ]
          .filter(Boolean)
          .join(", ");
        console.log(`  ${e.repo} (${e.branch}): ${what || "commit and push"}`);
      });
  });
  console.log("\nExcluded:");
  NETWORK.excluded.forEach((e) => console.log(`  ${e.repo}: ${e.reason}`));
  return 0;
}

// ---------------------------------------------------------------- sync

const WAXAM = path.join(os.homedir(), "Documents", "git", "waxam", "cdn");

// git never waits on a prompt nobody can see: no credential prompt, and ssh
// fails instead of asking for a passphrase (an ssh-agent still works).
// A connection the other side stops answering ends instead of hanging: ssh
// after four missed 15 second keepalives, https after 60 seconds under
// 1 KB/s. Either is then retried like any other failed pull.
const SYNC_ENV = Object.assign({}, process.env, {
  GIT_TERMINAL_PROMPT: "0",
  GIT_SSH_COMMAND:
    process.env.GIT_SSH_COMMAND ||
    "ssh -o BatchMode=yes -o ServerAliveInterval=15 -o ServerAliveCountMax=4",
  GIT_HTTP_LOW_SPEED_LIMIT: process.env.GIT_HTTP_LOW_SPEED_LIMIT || "1000",
  GIT_HTTP_LOW_SPEED_TIME: process.env.GIT_HTTP_LOW_SPEED_TIME || "60",
});

const sleep = (seconds) =>
  new Promise((r) => setTimeout(r, Math.max(0, seconds) * 1000));

/** a non-negative number from --name, else the environment, else fallback */
function syncNumber(name, envName, fallback) {
  const raw = option(name) || process.env[envName];
  const n = parseFloat(raw);
  return raw !== undefined && Number.isFinite(n) && n >= 0 ? n : fallback;
}

/** fast-forward one checkout; never merges, rebases or touches local edits */
function pullFastForward(dir, args) {
  const before = git(dir, ["rev-parse", "HEAD"]);
  // git's own progress and errors go straight to the terminal, so a large
  // download (art) shows as progress rather than as a hang
  const pulled = spawnSync("git", ["pull", "--ff-only", ...args], {
    cwd: dir,
    env: SYNC_ENV,
    stdio: ["ignore", "ignore", "inherit"],
  });
  if (pulled.error || pulled.status !== 0) {
    return { ok: false, text: "pull failed (git's message is above)" };
  }
  const after = git(dir, ["rev-parse", "HEAD"]);
  if (before === after) return { ok: true, text: "up to date" };
  const n = git(dir, ["rev-list", "--count", `${before}..${after}`]);
  return { ok: true, text: `updated, ${n} new commit${n === "1" ? "" : "s"}` };
}

async function cmdSync() {
  const clone = flag("--clone");
  const delay = syncNumber("--delay", "UBIQUITY_SYNC_DELAY", 3);
  const retries = Math.floor(
    syncNumber("--retries", "UBIQUITY_SYNC_RETRIES", 3),
  );
  const retryWait = syncNumber("--retry-wait", "UBIQUITY_SYNC_RETRY_WAIT", 20);
  const problems = [];
  if (cmdCoverage() !== 0) problems.push("coverage (above)");
  console.log(
    `ubiquity-network: syncing checkouts under ${ROOT} (${delay}s between repos, up to ${retries} retries)`,
  );
  const width = Math.max(...NETWORK.repos.map((e) => e.repo.length));
  const line = (name, text) => console.log(`  ${name.padEnd(width)}  ${text}`);
  // pause only between network calls, so a repo that is skipped costs nothing
  let contacted = false;
  const pace = async () => {
    if (contacted && delay > 0) await sleep(delay);
    contacted = true;
  };
  /** a fast-forward pull, tried again with a growing wait when it fails */
  const pullPaced = async (name, dir, args) => {
    await pace();
    let result = pullFastForward(dir, args);
    for (let attempt = 1; !result.ok && attempt <= retries; attempt++) {
      const wait = retryWait * attempt;
      line(
        name,
        `pull failed; waiting ${wait}s before retry ${attempt} of ${retries}`,
      );
      await sleep(wait);
      result = pullFastForward(dir, args);
    }
    return result;
  };
  for (const entry of NETWORK.repos) {
    const dir = repoDir(entry);
    const name = entry.repo;
    if (!fs.existsSync(path.join(dir, ".git"))) {
      const url = `https://github.com/haxtheweb/${name}.git`;
      if (!clone) {
        line(name, `MISSING: git clone -b ${entry.branch} ${url} ${dir}`);
        problems.push(`${name}: no checkout (rerun with --clone)`);
        continue;
      }
      await pace();
      try {
        execFileSync("git", ["clone", "-q", "-b", entry.branch, url, dir], {
          env: SYNC_ENV,
          stdio: ["ignore", "ignore", "pipe"],
        });
        line(name, `cloned (${entry.branch})`);
      } catch (e) {
        line(name, `CLONE FAILED: ${String(e.stderr || e.message).trim()}`);
        problems.push(`${name}: clone failed`);
      }
      continue;
    }
    let branch = "";
    try {
      branch = git(dir, ["rev-parse", "--abbrev-ref", "HEAD"]);
    } catch (e) {
      line(name, "ERROR: git cannot read this checkout");
      problems.push(`${name}: unreadable`);
      continue;
    }
    if (branch !== entry.branch) {
      line(name, `SKIPPED: on ${branch}, the release uses ${entry.branch}`);
      problems.push(`${name}: on ${branch}, not ${entry.branch}`);
      continue;
    }
    console.log(`  ${name.padEnd(width)}  pulling origin ${entry.branch}...`);
    const result = await pullPaced(name, dir, ["origin", entry.branch]);
    line(name, result.ok ? result.text : `FAILED: ${result.text}`);
    if (!result.ok) problems.push(`${name}: ${result.text}`);
  }
  // the waxam mirror is outside $HAXTHEWEB_ROOT and optional; pull it on
  // whatever branch it tracks when it is a git checkout
  if (fs.existsSync(WAXAM)) {
    try {
      const top = git(WAXAM, ["rev-parse", "--show-toplevel"]);
      console.log(`  ${"waxam".padEnd(width)}  pulling...`);
      const result = await pullPaced("waxam", top, []);
      line("waxam", result.ok ? result.text : `FAILED: ${result.text}`);
      if (!result.ok) problems.push(`waxam: ${result.text}`);
    } catch (e) {
      line("waxam", "not a git checkout; skipped");
    }
  } else {
    line("waxam", `not found at ${WAXAM}; skipped`);
  }
  if (problems.length) {
    console.log(
      "ERROR: not every checkout is current:\n" +
        problems.map((p) => `  ${p}`).join("\n"),
    );
    return 1;
  }
  console.log(
    `ubiquity-network: all ${NETWORK.repos.length} repos are on their release branch and up to date`,
  );
  return 0;
}

const commands = {
  versions: cmdVersions,
  coverage: cmdCoverage,
  preflight: cmdPreflight,
  landed: cmdLanded,
  satellites: cmdSatellites,
  plan: cmdPlan,
  sync: cmdSync,
};

// Run directly (not imported). ubiquity-push.sh calls scripts through the
// ~/haxtheweb symlink; node resolves import.meta.url to the real path but
// leaves process.argv[1] as typed, so compare real paths or nothing runs.
function invokedDirectly() {
  try {
    return (
      fs.realpathSync(process.argv[1]) ===
      fs.realpathSync(fileURLToPath(import.meta.url))
    );
  } catch (e) {
    return false;
  }
}

if (invokedDirectly()) {
  const command = commands[argv[0]];
  if (!command) {
    console.log(
      `usage: node scripts/ubiquity-network.mjs <${Object.keys(commands).join("|")}> [options]`,
    );
    process.exit(2);
  }
  process.exitCode = await command();
}
