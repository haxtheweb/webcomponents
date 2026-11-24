#!/usr/bin/env node
/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Step 2 of a release: publish every element whose version is not on npm yet.
 * Safe to re-run: what is already on npm is skipped, so a run that stopped at
 * package 140 (rate limit, network, an expired login) carries on from there.
 * Run `yarn run release-version <x.y.z>` first.
 *
 *   yarn run release-publish                  publish what is missing
 *   yarn run release-publish --check          exit 1 unless every element is on npm
 *   yarn run release-publish --dry-run        list what would be published
 *   yarn run release-publish --concurrency 2  publishes at a time (default 4)
 *   yarn run release-publish --provenance     attach provenance (on by default in GitHub Actions)
 *
 * Every element must already be on lerna.json's version (release-version does
 * that); a mismatch stops before anything is published.
 * Transient npm failures (429, 5xx, timeouts, resets) are retried with back-off.
 * An authentication failure (expired login, one-time password needed) stops
 * the run, since every later publish would fail the same way.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import console from "node:console";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const WC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ELEMENTS = path.join(WC, "elements");
const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const option = (name, fallback) => {
  const i = argv.indexOf(name);
  return i > -1 && argv[i + 1] ? argv[i + 1] : fallback;
};
const check = flag("--check");
const dry = flag("--dry-run");
const concurrency = Math.max(
  1,
  parseInt(option("--concurrency", "4"), 10) || 4,
);
const provenance =
  flag("--provenance") || process.env.GITHUB_ACTIONS === "true";
const RETRIES = 4;
const BACKOFF = [15, 30, 60, 120];

const TRANSIENT =
  /E429|Too Many Requests|E5\d\d|ETIMEDOUT|ESOCKETTIMEDOUT|ECONNRESET|ECONNREFUSED|EAI_AGAIN|ENOTFOUND|socket hang up|network/i;
const ALREADY =
  /cannot publish over|previously published version|EPUBLISHCONFLICT/i;
const AUTH =
  /EOTP|one-time pass|ENEEDAUTH|E401|need auth|not logged in|E403 403 Forbidden - PUT/i;

// Run as a yarn (v1) script, npm inherits npm_config_registry=registry.yarnpkg.com.
// `npm login` keeps its token for registry.npmjs.org, so publishing through the
// yarn mirror has no token (ENEEDAUTH). Talk to npm's own registry instead.
const NPM_ENV = { ...process.env };
if (/yarnpkg\.com/.test(NPM_ENV.npm_config_registry || "")) {
  NPM_ENV.npm_config_registry = "https://registry.npmjs.org/";
}

const sleep = (s) => new Promise((resolve) => setTimeout(resolve, s * 1000));

/** run a command, collecting its output; never throws */
function run(cmd, args, cwd) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, {
      cwd,
      env: NPM_ENV,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (out += d));
    child.on("error", (e) => resolve({ code: 1, out: String(e.message) }));
    child.on("close", (code) => resolve({ code, out }));
  });
}

/** run fn over items, `limit` at a time, in order of start */
async function pool(items, limit, fn) {
  let next = 0;
  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (next < items.length) {
        const i = next++;
        await fn(items[i], i);
      }
    },
  );
  await Promise.all(workers);
}

/** is name@version on the registry? true, false, or null when npm could not say */
async function published(name, version) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const r = await run(
      "npm",
      ["view", `${name}@${version}`, "version", "--json"],
      WC,
    );
    if (r.code === 0) return r.out.trim().length > 0;
    if (/E404|is not in this registry|404 Not Found/i.test(r.out)) return false;
    await sleep(5 * (attempt + 1));
  }
  return null;
}

const lernaVersion = JSON.parse(
  fs.readFileSync(path.join(WC, "lerna.json"), "utf8"),
).version;
const packages = fs
  .readdirSync(ELEMENTS)
  .map((dir) => ({
    dir: path.join(ELEMENTS, dir),
    file: path.join(ELEMENTS, dir, "package.json"),
  }))
  .filter((p) => fs.existsSync(p.file))
  .map((p) =>
    Object.assign(p, { json: JSON.parse(fs.readFileSync(p.file, "utf8")) }),
  )
  .filter((p) => p.json.name && !p.json.private);

const off = packages.filter((p) => p.json.version !== lernaVersion);
if (off.length) {
  console.log(
    `ERROR: ${off.length} element(s) are not on lerna.json's ${lernaVersion}: ${off
      .map((p) => `${p.json.name}@${p.json.version}`)
      .join(
        ", ",
      )}\nRun yarn run release-version <x.y.z> first; nothing was published.`,
  );
  process.exit(1);
}

console.log(
  `release-publish: checking npm for ${packages.length} elements at ${lernaVersion}`,
);
const missing = [];
const unknown = [];
await pool(packages, 8, async (p) => {
  const on = await published(p.json.name, p.json.version);
  if (on === null) unknown.push(p);
  else if (!on) missing.push(p);
});
missing.sort((a, b) => a.json.name.localeCompare(b.json.name));
if (unknown.length) {
  console.log(
    `WARNING: npm did not answer for ${unknown.length}: ${unknown.map((p) => p.json.name).join(", ")}`,
  );
}
console.log(
  `  ${packages.length - missing.length - unknown.length} already on npm, ${missing.length} to publish`,
);

if (check || dry) {
  missing.forEach((p) =>
    console.log(`  missing: ${p.json.name}@${p.json.version}`),
  );
  if (check && (missing.length || unknown.length)) {
    console.log(
      "ERROR: not every element is on npm at the release version; run yarn run release-publish",
    );
    process.exit(1);
  }
  if (check) console.log(`every element is on npm at ${lernaVersion}`);
  process.exit(0);
}

const failed = [];
let stopped = "";
let done = 0;
// a package npm could not report on is published too: a duplicate is
// recognised and counted as already there
const todo = missing.concat(unknown);
await pool(todo, concurrency, async (p) => {
  const label = `${p.json.name}@${p.json.version}`;
  for (let attempt = 1; attempt <= RETRIES; attempt++) {
    if (stopped) return;
    const args = ["publish", "--access", "public"];
    if (provenance) args.push("--provenance");
    const r = await run("npm", args, p.dir);
    if (r.code === 0 || ALREADY.test(r.out)) {
      done++;
      console.log(
        `  [${done}/${todo.length}] ${label} ${r.code === 0 ? "published" : "already on npm"}${attempt > 1 ? ` (attempt ${attempt})` : ""}`,
      );
      return;
    }
    if (AUTH.test(r.out)) {
      stopped = `${label}: npm refused the login (${(r.out.match(AUTH) || [""])[0]}). Log in, or set a token that can publish without a one-time password, then re-run.`;
      failed.push(label);
      return;
    }
    if (TRANSIENT.test(r.out) && attempt < RETRIES) {
      const wait = BACKOFF[attempt - 1];
      console.log(
        `  ${label}: npm ${(r.out.match(TRANSIENT) || [""])[0]}, retrying in ${wait}s`,
      );
      await sleep(wait);
      continue;
    }
    const last = r.out
      .split("\n")
      .filter((l) => /ERR!|error/i.test(l))
      .slice(-2)
      .join(" | ");
    console.log(`  ${label}: FAILED ${last || `exit ${r.code}`}`);
    failed.push(label);
    return;
  }
});

if (stopped) console.log(`STOPPED: ${stopped}`);
if (failed.length || stopped) {
  const left = todo.length - done;
  console.log(
    `ERROR: ${left} element(s) not published${failed.length ? ` (failed: ${failed.join(", ")})` : ""}. Re-run yarn run release-publish; what is on npm is skipped.`,
  );
  process.exit(1);
}
console.log(
  `release-publish: all ${packages.length} elements are on npm at ${lernaVersion}`,
);
console.log(
  "next: yarn run ubiquity-git-sync && yarn run ubiquity-dry-run, then yarn run ubiquity-publish",
);
