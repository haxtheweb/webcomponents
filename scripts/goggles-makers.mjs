/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE.md for full text.
 *
 * Writes the makers data the HAXcms goggles (developer mode) read:
 * elements/haxcms-elements/lib/core/ui/haxcms-goggles-makers.json
 *
 * Rule: who made a piece comes from git, not from memory. For every tag in
 * the web component registry it records the people with commits to that
 * tag's source file and to its package, with commit counts and years, the
 * total human commits to the file (so shares can be shown), each person's
 * commits per year, which packages have a demo in the gallery, which
 * other tags have a demo page of their own, and which registered tags come
 * from a package outside HAX.
 * Commits made by bots and coding agents are counted apart, never credited
 * to a person. Names and HAX Lab roles come from the HAX Lab roster
 * (hax-marketing-theme/demo/files/contributors.json).
 *
 * Influence git cannot see (who shaped a design without committing to it)
 * is kept by hand in haxcms-goggles-credits.json, not here.
 *
 * Needs the full history: run it from a full clone, not a shallow one.
 * Output is deterministic for a given commit.
 *
 *   node scripts/goggles-makers.mjs
 */
import console from "node:console";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "..",
);
const WC = path.join(ROOT, "elements");
const OUT = path.join(
  WC,
  "haxcms-elements/lib/core/ui/haxcms-goggles-makers.json",
);

const git = (args) =>
  execFileSync("git", ["-C", ROOT, ...args], {
    encoding: "utf8",
    maxBuffer: 1 << 28,
  });
if (git(["rev-parse", "--is-shallow-repository"]).trim() === "true") {
  console.error(
    "goggles-makers: this clone is shallow; run it from a full clone so the history is complete.",
  );
  process.exit(1);
}

const registry = JSON.parse(
  fs.readFileSync(
    path.join(WC, "haxcms-elements/demo/wc-registry.json"),
    "utf8",
  ),
);
const roster = JSON.parse(
  fs.readFileSync(
    path.join(WC, "hax-marketing-theme/demo/files/contributors.json"),
    "utf8",
  ),
);

// commit author names that are the same person as a GitHub login
const ALIASES = {
  "bryan ollendyke": "btopro",
  "nikki massaro kauffman": "nikkimk",
  "zach dodson": "zdodson21",
  "keith charlton": "kchar601",
  "collin kleest": "collinkleest",
  "charles lavera": "cgldevel",
  "christian murphy": "ChristianMurphy",
  "jack davis": "JackWillDavis",
  "griffin sullivan": "Griffin-Sullivan",
  "firaol tulu firew": "firaol4",
  "winston w": "winstonwumbo",
  "winston j wumbo": "winstonwumbo",
  "skyler koba": "SkylerKoba88",
  "jimmy kane": "liljimmyk99",
};
for (const c of roster.code || []) {
  ALIASES[c.login.toLowerCase()] = c.login;
}
const AGENT =
  /claude|renovate|dependabot|copilot|\[bot\]|github-actions|warp|cursor|codex|greenkeeper|snyk/i;
const who = (name, email) => {
  if (AGENT.test(name) || AGENT.test(email)) {
    return null;
  }
  const key = name.trim().toLowerCase();
  if (ALIASES[key]) {
    return ALIASES[key];
  }
  const noreply = email.match(/^\d+\+([^@]+)@users\.noreply/);
  if (noreply) {
    return ALIASES[noreply[1].toLowerCase()] || noreply[1];
  }
  return name.trim();
};

const cache = new Map();
const history = (rel) => {
  if (cache.has(rel)) {
    return cache.get(rel);
  }
  let out = "";
  try {
    out = git(["log", "--format=%an\t%ae\t%ad", "--date=format:%Y", "--", rel]);
  } catch {
    out = "";
  }
  const people = {};
  let agents = 0;
  for (const line of out.split("\n")) {
    if (!line) {
      continue;
    }
    const [name, email, year] = line.split("\t");
    const login = who(name, email);
    if (!login) {
      agents++;
      continue;
    }
    const p = (people[login] = people[login] || {
      c: 0,
      a: +year,
      z: +year,
      y: {},
    });
    p.c++;
    p.a = Math.min(p.a, +year);
    p.z = Math.max(p.z, +year);
    p.y[year] = (p.y[year] || 0) + 1;
  }
  const all = Object.entries(people).sort(
    (a, b) => b[1].c - a[1].c || a[0].localeCompare(b[0]),
  );
  const result = {
    p: all.slice(0, 8).map(([login, o]) => [login, o.c, o.a, o.z]),
    n: all.reduce((t, e) => t + e[1].c, 0),
    g: agents,
    years: people,
  };
  cache.set(rel, result);
  return result;
};

const tags = {};
const pkgs = {};
const years = {};
const counted = new Set();
// registered tags that come from someone else's package: tag -> npm package
const third = {};
for (const tag of Object.keys(registry).sort()) {
  const spec = registry[tag];
  if (!spec.startsWith("@haxtheweb/")) {
    const parts = spec.split("/");
    third[tag] = spec.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
    continue;
  }
  const file = spec.replace("@haxtheweb/", "");
  if (!fs.existsSync(path.join(WC, file))) {
    continue;
  }
  const h = history(`elements/${file}`);
  tags[tag] = { f: file, p: h.p, n: h.n, g: h.g };
  // each file counts once toward a person's commits per year
  if (!counted.has(file)) {
    counted.add(file);
    for (const [login, o] of Object.entries(h.years)) {
      years[login] = years[login] || {};
      for (const [y, c] of Object.entries(o.y)) {
        years[login][y] = (years[login][y] || 0) + c;
      }
    }
  }
  const pkg = file.split("/")[0];
  if (!pkgs[pkg]) {
    const ph = history(`elements/${pkg}`);
    pkgs[pkg] = { p: ph.p, n: ph.n, g: ph.g };
  }
}

const people = {};
for (const person of roster.lab || []) {
  if (person.github) {
    people[person.github] = {
      n: person.name,
      w: (person.work || []).map((w) => `${w.what} (${w.when})`),
      s: person.story || "",
    };
  }
}
const gallery = fs
  .readdirSync(WC)
  .filter((d) => fs.existsSync(path.join(WC, d, "demo/index.html")))
  .sort();

// a tag that is not its package's own element is only shown alone when the
// package has a demo named after it (?element=<package>&demo=<tag>)
const demos = {};
for (const [tag, t] of Object.entries(tags)) {
  const pkg = t.f.split("/")[0];
  if (tag !== pkg && fs.existsSync(path.join(WC, pkg, "demo", `${tag}.html`))) {
    demos[tag] = tag;
  }
}

const data = {
  sha: git(["rev-parse", "--short", "HEAD"]).trim(),
  tags,
  pkgs,
  people,
  years,
  gallery,
  demos,
  third,
};
fs.writeFileSync(OUT, JSON.stringify(data) + "\n");
console.log(
  `goggles-makers: ${Object.keys(tags).length} tags, ${Object.keys(pkgs).length} packages, ${Object.keys(years).length} people, ${fs.statSync(OUT).size} bytes -> ${path.relative(ROOT, OUT)}`,
);
