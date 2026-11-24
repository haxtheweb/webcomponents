#!/usr/bin/env node
/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Version references across the ubiquity network that are not package
 * versions, dependency ranges or .version files. release-version,
 * version-match, the `npm update`s in ubiquity-push.sh and the satellites step
 * own those; this owns the rest (generated docs data, design tokens, agent
 * skill references, ecosystem data, examples), listed with the reason for each
 * in scripts/release-references.json.
 *
 *   node scripts/release-references.mjs stamp [--repos a,b] [--version x.y.z] [--dry-run]
 *       move every listed reference to the release version (`ranges` rules to
 *       ^version; `delete` rules remove site.json fields that must never be
 *       public); --dry-run (or
 *       UBIQUITY_DRY_RUN=1) reports without writing
 *   node scripts/release-references.mjs check [--repos a,b] [--version x.y.z]
 *       exit 1 when a listed reference is not on the release version
 *   node scripts/release-references.mjs scan [--repos a,b] [--previous x.y.z]
 *       report-only: every other mention of the previous release line in the
 *       network's tracked files, minus scanIgnore (changelogs, history,
 *       fixtures, lockfiles, build output), so new kinds of reference get
 *       listed here or fixed at their source. Never fails.
 *
 * The release version is --version, else .version in this checkout. The
 * previous release is --previous, else the newest v* tag in this checkout on
 * an older major.minor line. Checkouts are found under $HAXTHEWEB_ROOT the
 * same way ubiquity-network.mjs finds them; missing ones are skipped.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import console from "node:console";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const WC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HOME_ROOT = path.join(process.env.HOME || "", "haxtheweb");
const ROOT = path.resolve(
  process.env.HAXTHEWEB_ROOT ||
    (fs.existsSync(HOME_ROOT) ? HOME_ROOT : path.join(WC, "..")),
);
const CONFIG = JSON.parse(
  fs.readFileSync(path.join(WC, "scripts", "release-references.json"), "utf8"),
);
const NETWORK = JSON.parse(
  fs.readFileSync(path.join(WC, "scripts", "ubiquity-network.json"), "utf8"),
);
const VERSION = /^\d+\.\d+\.\d+$/;
const V = "(\\d+\\.\\d+\\.\\d+)";

const argv = process.argv.slice(2);
const option = (name) => {
  const i = argv.indexOf(name);
  return i > -1 && argv[i + 1] ? argv[i + 1].trim() : null;
};

/** where a repo of the network is checked out */
export function repoDir(repo, root = ROOT) {
  // this checkout is webcomponents, wherever it sits, unless a root was named
  return repo === "webcomponents" &&
    root === ROOT &&
    !process.env.HAXTHEWEB_ROOT
    ? WC
    : path.join(root, repo);
}

export function releaseVersion(root = ROOT) {
  const given = option("--version");
  if (given) return given;
  if (
    process.env.UBIQUITY_DRY_RUN === "1" &&
    process.env.UBIQUITY_DRY_RUN_VERSION
  ) {
    return process.env.UBIQUITY_DRY_RUN_VERSION.trim();
  }
  try {
    return fs
      .readFileSync(path.join(repoDir("webcomponents", root), ".version"), "utf8")
      .trim();
  } catch (e) {
    return null;
  }
}

const line = (v) => String(v).split(".").slice(0, 2).map(Number);
const olderLine = (a, b) => {
  const [am, an] = line(a);
  const [bm, bn] = line(b);
  return am < bm || (am === bm && an < bn);
};

/** the newest release on a major.minor line before `release` */
export function previousVersion(release, root = ROOT) {
  const given = option("--previous");
  if (given) return given;
  let tags = [];
  try {
    tags = execFileSync("git", ["tag", "-l", "v*"], {
      cwd: repoDir("webcomponents", root),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
      .split("\n")
      .map((t) => t.trim().replace(/^v/, ""))
      .filter((t) => VERSION.test(t) && olderLine(t, release));
  } catch (e) {
    return null;
  }
  tags.sort((a, b) => {
    const pa = a.split(".").map(Number);
    const pb = b.split(".").map(Number);
    for (let i = 0; i < 3; i++) if (pa[i] !== pb[i]) return pb[i] - pa[i];
    return 0;
  });
  return tags[0] || null;
}

// ------------------------------------------------------------------ paths

/** split a rule path on unescaped dots: a\.b.c -> ["a.b", "c"] */
function splitPath(p) {
  const parts = [];
  let cur = "";
  for (let i = 0; i < p.length; i++) {
    if (p[i] === "\\" && p[i + 1] === ".") {
      cur += ".";
      i++;
    } else if (p[i] === ".") {
      parts.push(cur);
      cur = "";
    } else {
      cur += p[i];
    }
  }
  parts.push(cur);
  return parts;
}

/**
 * Every path (array of keys and indexes) a rule path names in data. `a[]`
 * walks each item of array a; a last segment ending in `*` names every key
 * with that prefix.
 */
function locate(data, rulePath) {
  let found = [[data, []]];
  const parts = splitPath(rulePath);
  parts.forEach((part, i) => {
    const last = i === parts.length - 1;
    const each = part.endsWith("[]");
    const key = each ? part.slice(0, -2) : part;
    const next = [];
    found.forEach(([value, at]) => {
      if (!value || typeof value !== "object") return;
      if (last && key.endsWith("*")) {
        const prefix = key.slice(0, -1);
        Object.keys(value)
          .filter((k) => k.startsWith(prefix))
          .forEach((k) => next.push([value[k], [...at, k]]));
      } else if (each) {
        (Array.isArray(value[key]) ? value[key] : []).forEach((item, n) =>
          next.push([item, [...at, key, n]]),
        );
      } else if (key in value) {
        next.push([value[key], [...at, key]]);
      }
    });
    found = next;
  });
  return found.map(([value, at]) => ({ value, at }));
}

/** package names a release puts on npm at the release version */
function releasedPackages() {
  const names = new Set();
  NETWORK.repos.forEach((e) => e.publish && names.add(e.publish));
  const elements = path.join(repoDir("webcomponents"), "elements");
  if (fs.existsSync(elements)) {
    fs.readdirSync(elements).forEach((dir) => {
      try {
        const pkg = JSON.parse(
          fs.readFileSync(path.join(elements, dir, "package.json"), "utf8"),
        );
        if (pkg.name && !pkg.private) names.add(pkg.name);
      } catch (e) {
        // not an element
      }
    });
  }
  return names;
}

/** ecosystem player nodes released from a network package or repo */
function networkReleases(data) {
  const packages = releasedPackages();
  const repos = new Set(NETWORK.repos.map((e) => e.repo));
  const found = [];
  const walk = (value, at) => {
    if (!value || typeof value !== "object") return;
    if (
      typeof value.release === "string" &&
      typeof value.version === "string"
    ) {
      const [kind, name] = value.release.split(/:(.*)/s);
      if (
        (kind === "npm" && packages.has(name)) ||
        (kind === "git" &&
          name.startsWith("haxtheweb/") &&
          repos.has(name.slice("haxtheweb/".length)))
      ) {
        found.push({ value: value.version, at: [...at, "version"] });
      }
    }
    Object.keys(value).forEach((k) =>
      walk(value[k], [...at, Array.isArray(value) ? Number(k) : k]),
    );
  };
  walk(data, []);
  return found;
}

/**
 * Where every member sits in JSON text: path key -> { valueStart, valueEnd,
 * memberStart, memberEnd } (member spans cover `"key": value` for object
 * members). Edits are made in the text at these spans, so the rest of the
 * file keeps its formatting (inline arrays, escapes) byte for byte.
 */
export function jsonSpans(text) {
  const spans = new Map();
  let i = 0;
  const ws = () => {
    while (/\s/.test(text[i] || "")) i++;
  };
  const str = () => {
    const start = i;
    i++;
    while (text[i] !== '"') i += text[i] === "\\" ? 2 : 1;
    i++;
    return JSON.parse(text.slice(start, i));
  };
  const value = (at) => {
    ws();
    const start = i;
    if (text[i] === "{") {
      i++;
      ws();
      while (text[i] !== "}") {
        const memberStart = i;
        const key = str();
        ws();
        i++; // :
        ws();
        const vStart = i;
        value([...at, key]);
        spans.set(JSON.stringify([...at, key]), {
          valueStart: vStart,
          valueEnd: i,
          memberStart,
          memberEnd: i,
        });
        ws();
        if (text[i] === ",") i++;
        ws();
      }
      i++;
    } else if (text[i] === "[") {
      i++;
      ws();
      let n = 0;
      while (text[i] !== "]") {
        const vStart = i;
        value([...at, n]);
        spans.set(JSON.stringify([...at, n]), {
          valueStart: vStart,
          valueEnd: i,
        });
        n++;
        ws();
        if (text[i] === ",") i++;
        ws();
      }
      i++;
    } else if (text[i] === '"') {
      str();
    } else {
      while (i < text.length && !/[,\]}\s]/.test(text[i])) i++;
    }
    return start;
  };
  value([]);
  return spans;
}

/** remove one object member, its line and the comma that joined it */
function removeMember(text, span) {
  let start = span.memberStart;
  let end = span.memberEnd;
  const after = /^\s*,/.exec(text.slice(end));
  if (after) {
    end += after[0].length;
  } else {
    // last member: drop the comma before it instead
    const before = /,\s*$/.exec(text.slice(0, start));
    if (before) start = before.index;
  }
  // take the whole line when the member was alone on it
  const lineStart = text.lastIndexOf("\n", start - 1) + 1;
  if (after && /^[ \t]*$/.test(text.slice(lineStart, start))) {
    const nl = /^[ \t]*\n/.exec(text.slice(end));
    if (nl) {
      start = lineStart;
      end += nl[0].length;
    }
  }
  return text.slice(0, start) + text.slice(end);
}

// ------------------------------------------------------------------ rules

function ruleFiles(rule, dir) {
  if (!fs.existsSync(dir)) return [];
  const found = new Set();
  rule.files.forEach((pattern) => {
    fs.globSync(pattern, {
      cwd: dir,
      exclude: (f) => path.basename(f) === "node_modules",
    }).forEach((f) => found.add(f));
  });
  return [...found].sort();
}

/**
 * What one rule changes in one file's text: { text, changes[] }, where each
 * change is "where: from -> to" ("removed" for deletes).
 */
export function applyRule(rule, text, version) {
  const changes = [];
  if (rule.pattern) {
    const re = new RegExp(rule.pattern.split("{v}").join(V), "gm");
    const out = text.replace(re, (match, ...groups) => {
      const caps = groups.slice(0, rule.pattern.split("{v}").length - 1);
      if (caps.every((c) => c === version)) return match;
      let i = 0;
      const next = match.replace(new RegExp(V, "g"), (v) =>
        i++ < caps.length ? version : v,
      );
      changes.push(`${caps.join(", ")} -> ${version}`);
      return next;
    });
    return { text: out, changes };
  }
  const data = JSON.parse(text);
  const spans = jsonSpans(text);
  const edits = [];
  if (rule.delete) {
    rule.delete.forEach((p) => {
      locate(data, p).forEach(({ value, at }) => {
        changes.push(`${p} ${value} removed`);
        edits.push({ remove: true, span: spans.get(JSON.stringify(at)) });
      });
    });
  } else {
    const target = rule.ranges ? `^${version}` : version;
    const found = rule.ranges
      ? ["dependencies", "devDependencies", "optionalDependencies"].flatMap(
          (block) => locate(data, `${block}.${rule.ranges}*`),
        )
      : [].concat(rule.set).flatMap((p) =>
          p === "network-releases" ? networkReleases(data) : locate(data, p),
        );
    found.forEach(({ value, at }) => {
      if (typeof value === "string" && value !== target) {
        changes.push(`${at[at.length - 1]} ${value} -> ${target}`);
        edits.push({ span: spans.get(JSON.stringify(at)) });
      }
    });
  }
  // apply from the end of the file back, so earlier spans stay valid
  edits.sort((a, b) => b.span.valueStart - a.span.valueStart);
  let out = text;
  edits.forEach(({ remove, span }) => {
    out = remove
      ? removeMember(out, span)
      : out.slice(0, span.valueStart) +
        JSON.stringify(rule.ranges ? `^${version}` : version) +
        out.slice(span.valueEnd);
  });
  return { text: out, changes };
}

function selectedRules() {
  const only = option("--repos");
  const wanted = only ? new Set(only.split(",").map((r) => r.trim())) : null;
  return CONFIG.rules.filter((r) => !wanted || wanted.has(r.repo));
}

/** stamp (write) or check (report) every listed reference; returns misses */
export function run({ write, version, root = ROOT, rules = selectedRules() }) {
  let behind = 0;
  let missing = new Set();
  rules.forEach((rule) => {
    const dir = repoDir(rule.repo, root);
    if (!fs.existsSync(dir)) {
      missing.add(rule.repo);
      return;
    }
    ruleFiles(rule, dir).forEach((rel) => {
      const file = path.join(dir, rel);
      const before = fs.readFileSync(file, "utf8");
      let result;
      try {
        result = applyRule(rule, before, version);
      } catch (e) {
        console.log(`  [${rule.repo}] ${rel}: skipped, ${e.message}`);
        return;
      }
      if (!result.changes.length) return;
      behind += result.changes.length;
      console.log(`  [${rule.repo}] ${rel}: ${result.changes.join("; ")}`);
      if (write) fs.writeFileSync(file, result.text);
    });
  });
  missing.forEach((repo) =>
    console.log(`  [${repo}] no checkout under ${root}; skipped`),
  );
  return behind;
}

/**
 * Stamp (or with write: false, report) the listed references of some repos;
 * returns how many were behind. For release-version and the satellites step.
 */
export function stampRepos(repos, version, { write = true, root = ROOT } = {}) {
  const wanted = new Set(repos);
  const rules = CONFIG.rules.filter((r) => wanted.has(r.repo));
  if (!rules.length) return 0;
  return run({ write, version, root, rules });
}

// ------------------------------------------------------------------ scan

function globToRegExp(glob) {
  let re = "";
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === "*" && glob[i + 1] === "*") {
      re += glob[i + 2] === "/" ? "(?:.*/)?" : ".*";
      i += glob[i + 2] === "/" ? 2 : 1;
    } else if (c === "*") re += "[^/]*";
    else if (c === "?") re += "[^/]";
    else re += c.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  }
  return new RegExp(`^${re}$`);
}

// release files other steps write (version-match, release-version, the
// satellites step, ubiquity-push.sh); their own gates cover them
const OWNED_FILES = new Set([".version", "VERSION.txt", "lerna.json"]);

/**
 * Lines in a package.json another release step rewrites: the version of a
 * repo's own package (commit-and-tag-version, satellites), and @haxtheweb/
 * ranges in element package.json files (release-version) and in a repo's
 * root package.json (the `npm update`s in ubiquity-push.sh). @haxtheweb/
 * ranges anywhere else (a nested tools/package.json) are not owned, so the
 * scan still reports them.
 */
function ownedLine(repo, rel) {
  if (path.basename(rel) !== "package.json") return () => false;
  const root = rel === "package.json";
  const element = repo === "webcomponents" && /^elements\/[^/]+\/package\.json$/.test(rel);
  return (l) =>
    ((root || element) && /^\s*"version"\s*:/.test(l)) ||
    ((root || element) && /^\s*"@haxtheweb\//.test(l));
}

/** tracked files in the network still naming the previous release line */
export function scan({ previous, root = ROOT, repos }) {
  const ignore = CONFIG.scanIgnore.map(globToRegExp);
  const [major, minor] = line(previous);
  const re = new RegExp(`(?<![\\d.])${major}\\.${minor}\\.\\d+(?![\\d.])`);
  const hits = {};
  repos.forEach((repo) => {
    const dir = repoDir(repo, root);
    if (!fs.existsSync(path.join(dir, ".git"))) return;
    let files = [];
    try {
      files = execFileSync("git", ["ls-files"], {
        cwd: dir,
        encoding: "utf8",
        maxBuffer: 256 * 1024 * 1024,
      })
        .split("\n")
        .filter(Boolean);
    } catch (e) {
      return;
    }
    files.forEach((rel) => {
      if (ignore.some((r) => r.test(`${repo}/${rel}`) || r.test(rel))) return;
      const file = path.join(dir, rel);
      let stat;
      try {
        stat = fs.statSync(file);
      } catch (e) {
        return;
      }
      if (!stat.isFile() || stat.size > 2 * 1024 * 1024) return;
      const text = fs.readFileSync(file, "utf8");
      if (text.includes("\u0000") || !re.test(text)) return;
      if (OWNED_FILES.has(path.basename(rel))) return;
      const owned = ownedLine(repo, rel);
      text.split("\n").forEach((l, i) => {
        if (re.test(l) && !owned(l)) {
          (hits[repo] = hits[repo] || []).push(
            `${rel}:${i + 1}: ${l.trim().slice(0, 140)}`,
          );
        }
      });
    });
  });
  return hits;
}

// ------------------------------------------------------------------ cli

function main() {
  const command = argv[0];
  const version = releaseVersion();
  if (!VERSION.test(version || "")) {
    console.log(
      `release-references: no release version (${version}); pass --version x.y.z`,
    );
    return 1;
  }
  if (command === "stamp" || command === "check") {
    const dry =
      command === "check" ||
      argv.includes("--dry-run") ||
      process.env.UBIQUITY_DRY_RUN === "1";
    console.log(
      `release-references ${command}: ${version}${dry && command === "stamp" ? " (dry run)" : ""}`,
    );
    const behind = run({ write: !dry, version });
    if (command === "check") {
      if (behind) {
        console.log(
          `ERROR: ${behind} listed reference(s) not on ${version}; run: node scripts/release-references.mjs stamp`,
        );
        return 1;
      }
      console.log("  every listed reference is on the release version");
    } else if (!behind) {
      console.log("  nothing to change");
    }
    return 0;
  }
  if (command === "scan") {
    const previous = previousVersion(version);
    if (!VERSION.test(previous || "")) {
      console.log(
        "release-references scan: no previous release found; pass --previous x.y.z",
      );
      return 0;
    }
    const only = option("--repos");
    const repos = only
      ? only.split(",").map((r) => r.trim())
      : NETWORK.repos.map((e) => e.repo);
    const [major, minor] = line(previous);
    console.log(
      `release-references scan: mentions of ${major}.${minor}.x (report only)`,
    );
    const hits = scan({ previous, repos });
    const names = Object.keys(hits);
    names.forEach((repo) => {
      console.log(`  ${repo}: ${hits[repo].length}`);
      hits[repo].slice(0, 15).forEach((h) => console.log(`    ${h}`));
      if (hits[repo].length > 15)
        console.log(`    ... ${hits[repo].length - 15} more`);
    });
    console.log(
      names.length
        ? "  List each kind in scripts/release-references.json, fix it where it is generated, or add it to scanIgnore if it is history."
        : "  none",
    );
    return 0;
  }
  console.log(
    "usage: node scripts/release-references.mjs stamp|check|scan [--repos a,b] [--version x.y.z] [--previous x.y.z] [--dry-run]",
  );
  return 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = main();
}
