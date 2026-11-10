#!/usr/bin/env node
/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE.md for full text.
 *
 * Runs the Lit render benchmarks in this folder with tachometer, comparing
 * this working tree against a base git ref in the same browser, with samples
 * interleaved at random, and prints confidence intervals.
 *
 *   yarn bench                         this tree vs origin/master
 *   yarn bench --base <ref>            this tree vs any commit-ish
 *   yarn bench --no-base               this tree only (absolute timings)
 *   yarn bench --only hax-body,grid-plate
 *   yarn bench --sample-size 50 --summary-file out.md --json-file out.json
 *
 * The base ref's elements/ are extracted into benchmarks/work/base/
 * (gitignored; not a dot folder, since the benchmark server will not serve
 * hidden paths) and get their own node_modules made of links: @haxtheweb
 * workspace packages point at the base's elements, everything else at this
 * tree's installed third-party packages. The base runs the benchmark pages
 * from this tree, so both sides run identical benchmark code.
 *
 * tachometer is not a devDependency: one of its dependencies
 * (truncate-utf8-bytes, via sanitize-filename) is WTFPL licensed, which the
 * repo's license policy does not allow in the lockfile. The first run
 * installs the pinned versions below into benchmarks/work/tools/ with npm,
 * outside yarn.lock. A root install of tachometer is used instead if present.
 *
 * Browser settings come from the environment (all optional):
 *   BENCH_CHROME_BINARY   Chrome/Chromium to launch (default: the system one)
 *   BENCH_CHROME_ARGS     extra Chrome flags, space separated
 *   BENCH_WEBDRIVER_URL   use an already running chromedriver at this URL
 *
 * Exit code is non-zero only when the benchmarks could not run; timings never
 * fail it (shared machines are too noisy for a timing gate).
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const work = path.join(here, "work");
const baseDir = path.join(work, "base");
const tools = path.join(work, "tools");
const TACHOMETER = "0.7.2";
const CHROMEDRIVER = "156.0.0";

function parseArgs(argv) {
  const opts = {
    base: "origin/master",
    sampleSize: 30,
    timeout: 0,
    only: null,
    jsonFile: path.join(work, "results.json"),
    summaryFile: null,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => {
      if (i + 1 >= argv.length) {
        throw new Error(`${a} needs a value`);
      }
      i++;
      return argv[i];
    };
    if (a === "--base") opts.base = next();
    else if (a === "--no-base") opts.base = null;
    else if (a === "--sample-size") opts.sampleSize = Number(next());
    else if (a === "--timeout") opts.timeout = Number(next());
    else if (a === "--only") opts.only = next().split(",");
    else if (a === "--json-file") opts.jsonFile = path.resolve(next());
    else if (a === "--summary-file") opts.summaryFile = path.resolve(next());
    else if (a === "--help" || a === "-h") {
      console.log(
        fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split("*/")[0],
      );
      process.exit(0);
    } else throw new Error(`unknown option ${a}`);
  }
  if (!(opts.sampleSize > 1)) throw new Error("--sample-size must be > 1");
  if (!(opts.timeout >= 0)) throw new Error("--timeout must be >= 0");
  return opts;
}

function git(args, options = {}) {
  const res = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8",
    ...options,
  });
  if (res.status !== 0) {
    throw new Error(`git ${args[0]} failed: ${res.stderr || res.error}`);
  }
  return res.stdout;
}

// a ref we hand to git as an argument: no option-looking or odd values
function checkRef(ref) {
  if (!/^[A-Za-z0-9][A-Za-z0-9._/~^@{}-]*$/.test(ref)) {
    throw new Error(`refusing unusual base ref "${ref}"`);
  }
  return git(["rev-parse", "--verify", "--quiet", `${ref}^{commit}`]).trim();
}

/**
 * node_modules for the base tree: same relative links for workspace
 * packages (so they land on the base's elements/), absolute links to this
 * tree's install for everything else
 */
function linkNodeModules(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from)) {
    if (entry === ".bin" || entry === ".cache") continue;
    const src = path.join(from, entry);
    const dest = path.join(to, entry);
    if (entry === "@haxtheweb") {
      fs.mkdirSync(dest, { recursive: true });
      for (const pkg of fs.readdirSync(src)) {
        linkWorkspacePackage(path.join(src, pkg), path.join(dest, pkg));
      }
    } else {
      fs.symlinkSync(src, dest);
    }
  }
}

// A workspace package is either yarn's link to its folder
// (../../elements/<name>) or, after scripts/postinstall.js, a folder of
// per-file links (../../../elements/<name>/<file>). Either way the same
// relative link, made under the base's node_modules, lands in the base tree.
function linkWorkspacePackage(src, dest) {
  const stat = fs.lstatSync(src);
  if (stat.isSymbolicLink()) {
    const target = fs.readlinkSync(src);
    fs.symlinkSync(target.startsWith("../../elements/") ? target : src, dest);
    return;
  }
  if (!stat.isDirectory()) {
    fs.symlinkSync(src, dest);
    return;
  }
  const entries = fs.readdirSync(src);
  const workspace =
    entries.length > 0 &&
    entries.every((e) => {
      const p = path.join(src, e);
      return (
        fs.lstatSync(p).isSymbolicLink() &&
        fs.readlinkSync(p).startsWith("../../../elements/")
      );
    });
  if (!workspace) {
    // a published @haxtheweb package installed from npm
    fs.symlinkSync(src, dest);
    return;
  }
  fs.mkdirSync(dest);
  for (const e of entries) {
    fs.symlinkSync(fs.readlinkSync(path.join(src, e)), path.join(dest, e));
  }
}

function prepareBase(sha) {
  fs.rmSync(baseDir, { recursive: true, force: true });
  fs.mkdirSync(baseDir, { recursive: true });
  const tar = path.join(work, "base.tar");
  git(["archive", "--format=tar", "-o", tar, sha, "--", "elements"]);
  const res = spawnSync("tar", ["-xf", tar, "-C", baseDir], {
    stdio: "inherit",
  });
  fs.rmSync(tar, { force: true });
  if (res.status !== 0) throw new Error("could not extract the base tree");
  // the base runs this tree's benchmark pages (not work/, which holds it)
  for (const entry of fs.readdirSync(here)) {
    const src = path.join(here, entry);
    if (src !== work) {
      fs.cpSync(src, path.join(baseDir, "benchmarks", entry), {
        recursive: true,
      });
    }
  }
  linkNodeModules(
    path.join(root, "node_modules"),
    path.join(baseDir, "node_modules"),
  );
}

/**
 * tachometer's CLI, installed on first use (see the header comment). The
 * chromedriver package goes next to it so tachometer does not install it on
 * demand inside its own folder; its postinstall fetches a driver matching
 * the local Chrome, or nothing when an existing driver is used.
 */
function tachometer() {
  const rootCopy = path.join(
    root,
    "node_modules",
    "tachometer",
    "bin",
    "tach.js",
  );
  if (fs.existsSync(rootCopy)) return rootCopy;
  const bin = path.join(tools, "node_modules", "tachometer", "bin", "tach.js");
  const pkg = path.join(tools, "node_modules", "tachometer", "package.json");
  if (
    fs.existsSync(pkg) &&
    JSON.parse(fs.readFileSync(pkg, "utf8")).version === TACHOMETER
  ) {
    return bin;
  }
  console.log(
    `bench: installing tachometer@${TACHOMETER} into benchmarks/work/tools (first run)`,
  );
  fs.mkdirSync(tools, { recursive: true });
  const env = { ...process.env };
  if (env.BENCH_WEBDRIVER_URL) {
    env.CHROMEDRIVER_SKIP_DOWNLOAD = "true";
  } else if (env.DETECT_CHROMEDRIVER_VERSION === undefined) {
    env.DETECT_CHROMEDRIVER_VERSION = "true";
  }
  const res = spawnSync(
    "npm",
    [
      "install",
      "--prefix",
      tools,
      "--no-save",
      "--no-package-lock",
      "--no-audit",
      "--no-fund",
      `tachometer@${TACHOMETER}`,
      `chromedriver@${CHROMEDRIVER}`,
    ],
    { cwd: tools, env, stdio: "inherit", shell: process.platform === "win32" },
  );
  if (res.status !== 0 || !fs.existsSync(bin)) {
    throw new Error("could not install tachometer");
  }
  return bin;
}

function browserConfig() {
  const browser = { name: "chrome", headless: true };
  if (process.env.BENCH_CHROME_BINARY) {
    browser.binary = process.env.BENCH_CHROME_BINARY;
  }
  if (process.env.BENCH_CHROME_ARGS) {
    browser.addArguments =
      process.env.BENCH_CHROME_ARGS.split(/\s+/).filter(Boolean);
  }
  if (process.env.BENCH_WEBDRIVER_URL) {
    browser.remoteUrl = process.env.BENCH_WEBDRIVER_URL;
  }
  return browser;
}

const MEASURES = ["first-render", "update"];

function tachometerConfig(names, opts) {
  const browser = browserConfig();
  const benchmarks = [];
  for (const name of names) {
    // urls are relative to the config file, which lives in benchmarks/work/
    const variants = [["this change", `../${name}.html`]];
    if (opts.base) {
      variants.unshift(["base", `base/benchmarks/${name}.html`]);
    }
    for (const [label, url] of variants) {
      benchmarks.push({
        name: `${name} | ${label}`,
        url,
        browser,
        measurement: MEASURES.map((m) => ({
          name: m,
          mode: "performance",
          entryName: m,
        })),
      });
    }
  }
  return {
    $schema:
      "https://raw.githubusercontent.com/Polymer/tachometer/master/config.schema.json",
    root: "../..",
    sampleSize: opts.sampleSize,
    timeout: opts.timeout,
    benchmarks,
  };
}

const ms = (v) => `${v.toFixed(2)} ms`;

// At 95% confidence about one row in twenty shows an interval that just
// misses 0 even on identical code, so a change is only called faster or
// slower when the whole interval is beyond this many percent.
const NOISE_PCT = 5;

/**
 * markdown summary from tachometer's JSON: one row per benchmark and
 * measure, base vs this change, with the 95% confidence interval of the
 * difference; an interval that crosses zero means "no detectable change"
 */
function summarize(json, opts, baseSha) {
  const rows = new Map();
  json.benchmarks.forEach((b, index) => {
    // tachometer names each measure "<name> | <side> [<measure>]"
    const open = b.name.lastIndexOf(" [");
    const label = open === -1 ? b.name : b.name.slice(0, open);
    const measure = open === -1 ? "" : b.name.slice(open + 2, -1);
    const bar = label.lastIndexOf(" | ");
    if (bar === -1) return;
    const side = label.slice(bar + 3);
    const key = `${label.slice(0, bar)}\t${measure}`;
    if (!rows.has(key)) rows.set(key, {});
    rows.get(key)[side] = { b, index };
  });
  const lines = [];
  lines.push("## Lit render benchmarks (advisory)");
  lines.push("");
  lines.push(
    opts.base
      ? `Base \`${opts.base}\` (${baseSha.slice(0, 10)}) vs this change, ${opts.sampleSize}+ samples each, interleaved at random in one Chrome. Ranges are 95% confidence intervals. Faster or slower means the whole change interval is beyond ${NOISE_PCT}%; within noise means it excludes 0 but not ${NOISE_PCT}%.`
      : `This tree only, ${opts.sampleSize}+ samples each. Ranges are 95% confidence intervals of the mean.`,
  );
  lines.push("");
  if (opts.base) {
    lines.push("| Benchmark | Measure | Base | This change | Change | |");
    lines.push("| --- | --- | --- | --- | --- | --- |");
  } else {
    lines.push("| Benchmark | Measure | Mean |");
    lines.push("| --- | --- | --- |");
  }
  for (const [key, v] of rows) {
    const [bench, measure] = key.split("\t");
    const mine = v["this change"];
    const fmtMean = (r) =>
      r ? `${ms(r.b.mean.low)} – ${ms(r.b.mean.high)}` : "n/a";
    if (!opts.base) {
      lines.push(`| ${bench} | ${measure} | ${fmtMean(mine)} |`);
      continue;
    }
    const base = v.base;
    let change = "n/a";
    let verdict = "";
    if (base && mine && mine.b.differences) {
      const d = mine.b.differences[base.index];
      if (d) {
        const pct = d.percentChange;
        change = `${pct.low >= 0 ? "+" : ""}${pct.low.toFixed(1)}% to ${pct.high >= 0 ? "+" : ""}${pct.high.toFixed(1)}%`;
        if (pct.high < -NOISE_PCT) verdict = "faster";
        else if (pct.low > NOISE_PCT) verdict = "slower";
        else if (pct.high < 0 || pct.low > 0) verdict = "within noise";
        else verdict = "no change";
      }
    }
    lines.push(
      `| ${bench} | ${measure} | ${fmtMean(base)} | ${fmtMean(mine)} | ${change} | ${verdict} |`,
    );
  }
  lines.push("");
  lines.push(
    "Timings on shared CI runners are noisy: treat a small change as a hint to re-run locally (`yarn bench`), not a verdict. See benchmarks/README.md.",
  );
  return lines.join("\n") + "\n";
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  let names = fs
    .readdirSync(here)
    .filter((f) => f.endsWith(".html"))
    .map((f) => f.slice(0, -5))
    .sort();
  if (opts.only) {
    const unknown = opts.only.filter((n) => !names.includes(n));
    if (unknown.length)
      throw new Error(`no benchmark named ${unknown.join(", ")}`);
    names = names.filter((n) => opts.only.includes(n));
  }
  fs.mkdirSync(work, { recursive: true });
  let baseSha = "";
  if (opts.base) {
    baseSha = checkRef(opts.base);
    console.log(`bench: preparing base ${opts.base} (${baseSha.slice(0, 10)})`);
    prepareBase(baseSha);
  }
  const configFile = path.join(work, "tachometer.json");
  fs.writeFileSync(
    configFile,
    JSON.stringify(tachometerConfig(names, opts), null, 2),
  );
  const tach = tachometer();
  const res = spawnSync(
    process.execPath,
    [tach, "--config", configFile, "--json-file", opts.jsonFile],
    { cwd: root, stdio: "inherit" },
  );
  if (res.status !== 0) {
    throw new Error(`tachometer exited with ${res.status}`);
  }
  const summary = summarize(
    JSON.parse(fs.readFileSync(opts.jsonFile, "utf8")),
    opts,
    baseSha,
  );
  console.log("\n" + summary);
  if (opts.summaryFile) fs.writeFileSync(opts.summaryFile, summary);
}

try {
  main();
} catch (e) {
  console.error(`bench: ${e.message}`);
  process.exit(1);
}
