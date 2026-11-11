#!/usr/bin/env node
/**
 * Ubiquity asset manifest (haxtheweb/issues#3262).
 *
 * haxcms-nodejs and haxcms-php do not install web components from npm. They
 * ship the compiled `build/` folder that `yarn run ubiquity` produces here, so
 * their own npm/composer audits cannot see what is inside it. This script
 * records what a build contains and lets each backend check, nightly, whether
 * its copy is behind webcomponents master or bundles a vulnerable package.
 *
 * Invariants:
 * - The manifest is deterministic: sorted keys, no timestamps. The same build
 *   from the same tree always writes the same bytes.
 * - Every file in the build is listed with a fingerprint of its compiled bytes.
 *   A file built from a tracked source file in this repo also carries the
 *   fingerprint of that source, so staleness can be judged from source alone.
 * - Every package folder under es6/node_modules is listed with the version it
 *   was built from. Packages without a source folder in elements/ are the
 *   bundled third-party (npm) packages, and those are what `check` audits.
 * - `check` never fails for staleness, only for a known vulnerability in a
 *   bundled package. A missing manifest is not an error.
 *
 *   node scripts/ubiquity-manifest.mjs write [--build build] [--out <file>]
 *       Fingerprint a local build. Defaults to build/ubiquity-manifest.json, the
 *       place ubiquity copies into both backends. Pass --out to write anywhere
 *       else without touching the build (e.g. to inspect a build).
 *   node scripts/ubiquity-manifest.mjs check --manifest <file> [--build <dir>]
 *       [--summary <file>] [--no-audit]
 *       Dry run: compare a committed manifest with this checkout (meant to be
 *       webcomponents master) without building, check the committed build
 *       still matches its manifest, and audit the bundled third-party
 *       versions against the npm advisory database. --build defaults to the
 *       manifest's folder; --summary defaults to $GITHUB_STEP_SUMMARY.
 *
 * Fingerprints are the first 128 bits of SHA-256, hex. They detect change;
 * they are not a signature.
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import console from "node:console";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

export const MANIFEST_NAME = "ubiquity-manifest.json";
export const FORMAT = 1;
const REPOSITORY = "haxtheweb/webcomponents";
const ADVISORY_URL =
  "https://registry.npmjs.org/-/npm/v1/security/advisories/bulk";
// files whose change can alter every compiled asset
const TOOLCHAIN = ["polymer.json", "gulpfile.mjs"];
// first-party scopes; @lrnwebcomponents holds legacy copies of two packages
const FIRST_PARTY_SCOPES = ["@haxtheweb/", "@lrnwebcomponents/"];
const LIST_LIMIT = 25;

const defaultRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

export function fingerprint(buf) {
  return createHash("sha256").update(buf).digest("hex").slice(0, 32);
}

function toPosix(p) {
  return p.split(path.sep).join("/");
}

/** Sorted relative posix paths of every regular file under dir. */
export function walk(dir) {
  const out = [];
  const visit = (abs, rel) => {
    for (const ent of fs.readdirSync(abs, { withFileTypes: true })) {
      const a = path.join(abs, ent.name);
      const r = rel ? `${rel}/${ent.name}` : ent.name;
      if (ent.isDirectory()) visit(a, r);
      else if (ent.isFile()) out.push(r);
      else if (ent.isSymbolicLink()) {
        const st = fs.statSync(a, { throwIfNoEntry: false });
        if (st && st.isFile()) out.push(r);
        else if (st && st.isDirectory()) visit(a, r);
      }
    }
  };
  visit(dir, "");
  return out.sort();
}

/**
 * Split a build path into its package and the path inside it.
 * "es6/node_modules/@haxtheweb/x/lib/a.js" ->
 *   { key: "@haxtheweb/x", name: "@haxtheweb/x", inner: "lib/a.js" }
 * Nested installs keep the whole chain in key ("a/node_modules/b"), name is b.
 * Files outside node_modules return null.
 */
export function splitAssetPath(rel) {
  const marker = "node_modules/";
  const first = rel.indexOf(marker);
  const last = rel.lastIndexOf(marker);
  if (first === -1) return null;
  const tail = rel.slice(last + marker.length).split("/");
  const nameParts = tail[0].startsWith("@") ? 2 : 1;
  if (tail.length <= nameParts) return null;
  const name = tail.slice(0, nameParts).join("/");
  const inner = tail.slice(nameParts).join("/");
  const key = rel.slice(first + marker.length, rel.length - inner.length - 1);
  return { key, name, inner };
}

/**
 * The polymer.json extraDependencies rules for @haxtheweb packages, as a
 * predicate on a path inside an element folder. Only used to notice source
 * files that are new since the build; files it matches that a build leaves out
 * are recorded as "unshipped", so a mismatch with polymer never reports noise.
 */
export function shippableSource(dirName, rel) {
  const base = rel.split("/").pop();
  if (/^test\/[^/]+$/.test(rel)) return false;
  if (/\.(umd|amd|es6|stories|storiesold|story)\.js$/.test(base)) return false;
  if (dirName === "haxcms-elements" && /^demo\/dist\/[^/]+\.js$/.test(rel))
    return false;
  if (dirName === "elmsln-apps" && /^lib\/[^/]+\/demo\//.test(rel))
    return false;
  if (dirName === "haxcms-elements") return !base.startsWith(".");
  if (/^[^/]+\.js$/.test(rel)) return true;
  if (/^locales\/[^/]+\.json$/.test(rel)) return true;
  if (rel.startsWith("lib/")) return !base.startsWith(".");
  return false;
}

/** name -> folder ("elements/x") for every element in the repo. */
export function elementDirs(root) {
  const map = new Map();
  const elements = path.join(root, "elements");
  if (!fs.existsSync(elements)) return map;
  for (const dir of fs.readdirSync(elements).sort()) {
    const pj = path.join(elements, dir, "package.json");
    if (!fs.existsSync(pj)) continue;
    try {
      const { name, version } = JSON.parse(fs.readFileSync(pj, "utf8"));
      if (name) map.set(name, { dir: `elements/${dir}`, version });
    } catch {
      // unreadable package.json: the element is not buildable either
    }
  }
  return map;
}

function sourceFor(dirs, name) {
  if (dirs.has(name)) return dirs.get(name);
  for (const scope of FIRST_PARTY_SCOPES) {
    if (name.startsWith(scope)) {
      const alt = `@haxtheweb/${name.slice(scope.length)}`;
      if (dirs.has(alt)) return dirs.get(alt);
    }
  }
  return null;
}

/** Tracked files (posix, relative to root) that exist on disk. */
export function trackedFiles(root) {
  const res = spawnSync("git", ["ls-files", "-z"], {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 256,
  });
  if (res.status !== 0) return null;
  return new Set(
    res.stdout
      .split("\0")
      .filter((f) => f && fs.existsSync(path.join(root, f))),
  );
}

function gitHead(root) {
  const res = spawnSync("git", ["rev-parse", "HEAD"], {
    cwd: root,
    encoding: "utf8",
  });
  return res.status === 0 ? res.stdout.trim() : null;
}

function readVersion(root) {
  for (const f of [".version", "VERSION.txt"]) {
    const p = path.join(root, f);
    if (fs.existsSync(p)) return fs.readFileSync(p, "utf8").trim();
  }
  return null;
}

function hashFile(abs) {
  return fingerprint(fs.readFileSync(abs));
}

/** Patch name ("@google+model-viewer+3.2.1.patch") -> patched package name. */
export function patchedPackage(file) {
  const chain = file.replace(/\.patch$/, "").split("++");
  const parts = chain[chain.length - 1].split("+");
  parts.pop(); // version
  return parts.join("/");
}

/** package name -> fingerprint of its patch-package patches. */
export function patchHashes(root) {
  const dir = path.join(root, "patches");
  const map = new Map();
  if (!fs.existsSync(dir)) return map;
  for (const f of fs.readdirSync(dir).sort()) {
    if (!f.endsWith(".patch")) continue;
    const name = patchedPackage(f);
    const prev = map.get(name) || "";
    map.set(name, prev + fs.readFileSync(path.join(dir, f), "utf8"));
  }
  for (const [k, v] of map) map.set(k, fingerprint(v));
  return map;
}

/** yarn v1 lockfile -> name -> Set of resolved versions. */
export function lockVersions(text) {
  const map = new Map();
  let names = null;
  for (const line of text.split("\n")) {
    if (line && !line.startsWith(" ") && !line.startsWith("#")) {
      names = line
        .replace(/:$/, "")
        .split(", ")
        .map((s) => s.replace(/^"|"$/g, ""))
        .map((spec) => spec.slice(0, spec.lastIndexOf("@")))
        .filter(Boolean);
      continue;
    }
    const m = names && /^ {2}version "?([^"]+)"?$/.exec(line);
    if (m) {
      for (const n of new Set(names)) {
        if (!map.has(n)) map.set(n, new Set());
        map.get(n).add(m[1]);
      }
      names = null;
    }
  }
  return map;
}

/** Fingerprint a build folder against the repo it was built from. */
export function buildManifest({ root = defaultRoot, build } = {}) {
  const buildDir = path.resolve(root, build || "build");
  if (!fs.existsSync(buildDir)) throw new Error(`no build at ${buildDir}`);
  const dirs = elementDirs(root);
  const tracked = trackedFiles(root);
  const isTracked = (rel) =>
    tracked ? tracked.has(rel) : fs.existsSync(path.join(root, rel));
  const patches = patchHashes(root);
  const packages = {};
  const loose = {};

  for (const rel of walk(buildDir)) {
    if (rel === MANIFEST_NAME) continue;
    const built = hashFile(path.join(buildDir, rel));
    const split = splitAssetPath(rel);
    if (!split) {
      const src = rel.replace(/^es6\//, "");
      loose[rel] = isTracked(src)
        ? [built, hashFile(path.join(root, src))]
        : [built];
      continue;
    }
    if (!packages[split.key]) {
      const pkg = { files: {} };
      const source = split.key === split.name && sourceFor(dirs, split.name);
      if (source) {
        pkg.source = source.dir;
        pkg.version = source.version || null;
      } else {
        const pj = path.join(root, "node_modules", split.key, "package.json");
        pkg.version = fs.existsSync(pj)
          ? JSON.parse(fs.readFileSync(pj, "utf8")).version || null
          : null;
        if (patches.has(split.name)) pkg.patch = patches.get(split.name);
      }
      packages[split.key] = pkg;
    }
    const pkg = packages[split.key];
    const src = pkg.source && `${pkg.source}/${split.inner}`;
    pkg.files[split.inner] =
      src && isTracked(src) ? [built, hashFile(path.join(root, src))] : [built];
  }

  // source files the shipping rules match that this build left out
  for (const pkg of Object.values(packages)) {
    if (!pkg.source) continue;
    const dirName = pkg.source.split("/").pop();
    const prefix = `${pkg.source}/`;
    const unshipped = [];
    for (const f of tracked || []) {
      if (!f.startsWith(prefix)) continue;
      const inner = f.slice(prefix.length);
      if (!pkg.files[inner] && shippableSource(dirName, inner))
        unshipped.push(inner);
    }
    if (unshipped.length) pkg.unshipped = unshipped.sort();
  }

  const toolchain = {};
  for (const f of TOOLCHAIN) {
    if (fs.existsSync(path.join(root, f)))
      toolchain[f] = hashFile(path.join(root, f));
  }

  return {
    format: FORMAT,
    source: {
      repository: REPOSITORY,
      commit: gitHead(root),
      version: readVersion(root),
    },
    toolchain,
    packages,
    files: loose,
  };
}

/**
 * JSON with sorted object keys, two-space indent, and arrays of plain values
 * kept on one line, so each asset is one line in a diff.
 */
export function stableStringify(value, indent = "") {
  if (Array.isArray(value)) {
    if (value.every((v) => v === null || typeof v !== "object"))
      return `[${value.map((v) => JSON.stringify(v)).join(", ")}]`;
    const next = `${indent}  `;
    return `[\n${value.map((v) => next + stableStringify(v, next)).join(",\n")}\n${indent}]`;
  }
  if (value && typeof value === "object") {
    const keys = Object.keys(value).sort();
    if (!keys.length) return "{}";
    const next = `${indent}  `;
    const body = keys
      .map(
        (k) =>
          `${next}${JSON.stringify(k)}: ${stableStringify(value[k], next)}`,
      )
      .join(",\n");
    return `{\n${body}\n${indent}}`;
  }
  return JSON.stringify(value);
}

/** Compare a manifest with the source tree at root, without building. */
export function compareWithSource(manifest, { root = defaultRoot } = {}) {
  const dirs = elementDirs(root);
  const tracked = trackedFiles(root);
  const isTracked = (rel) =>
    tracked ? tracked.has(rel) : fs.existsSync(path.join(root, rel));
  const lockPath = path.join(root, "yarn.lock");
  const lock = fs.existsSync(lockPath)
    ? lockVersions(fs.readFileSync(lockPath, "utf8"))
    : new Map();
  const patches = patchHashes(root);
  const stale = []; // { package, changed: [], removed: [], added: [] }
  const thirdParty = []; // { package, shipped, master, patchChanged }
  const shippedNames = new Set();

  for (const [key, pkg] of Object.entries(manifest.packages || {})) {
    const split = splitAssetPath(`node_modules/${key}/x`);
    const name = split ? split.name : key;
    shippedNames.add(name);
    if (!pkg.source) {
      const versions = lock.get(name);
      const behind =
        pkg.version && versions && versions.size && !versions.has(pkg.version);
      const patchChanged = (pkg.patch || null) !== (patches.get(name) || null);
      if (behind || patchChanged || !versions)
        thirdParty.push({
          package: key,
          shipped: pkg.version,
          master: versions ? [...versions].sort() : [],
          patchChanged,
        });
      continue;
    }
    const current = sourceFor(dirs, name);
    const entry = { package: key, changed: [], removed: [], added: [] };
    const srcDir = current ? current.dir : pkg.source;
    for (const [inner, hashes] of Object.entries(pkg.files)) {
      if (hashes.length < 2) continue;
      const rel = `${srcDir}/${inner}`;
      if (!current || !isTracked(rel)) entry.removed.push(inner);
      else if (hashFile(path.join(root, rel)) !== hashes[1])
        entry.changed.push(inner);
    }
    if (current && tracked) {
      const known = new Set([
        ...Object.keys(pkg.files),
        ...(pkg.unshipped || []),
      ]);
      const dirName = srcDir.split("/").pop();
      const prefix = `${srcDir}/`;
      for (const f of tracked) {
        if (!f.startsWith(prefix)) continue;
        const inner = f.slice(prefix.length);
        if (!known.has(inner) && shippableSource(dirName, inner))
          entry.added.push(inner);
      }
      entry.added.sort();
    }
    if (entry.changed.length || entry.removed.length || entry.added.length)
      stale.push(entry);
  }

  // elements that a build from this tree would add
  const newPackages = [];
  for (const name of dirs.keys()) {
    if (!shippedNames.has(name)) newPackages.push(name);
  }

  const looseChanged = [];
  for (const [rel, hashes] of Object.entries(manifest.files || {})) {
    if (hashes.length < 2) continue;
    const src = rel.replace(/^es6\//, "");
    if (!isTracked(src) || hashFile(path.join(root, src)) !== hashes[1])
      looseChanged.push(rel);
  }

  const toolchainChanged = [];
  for (const [f, h] of Object.entries(manifest.toolchain || {})) {
    const abs = path.join(root, f);
    if (!fs.existsSync(abs) || hashFile(abs) !== h) toolchainChanged.push(f);
  }

  return {
    stale,
    newPackages,
    looseChanged,
    thirdParty,
    toolchainChanged,
    commit: gitHead(root),
  };
}

/** Compare a committed build with the manifest that describes it. */
export function compareWithBuild(manifest, buildDir) {
  const expected = new Map();
  for (const [key, pkg] of Object.entries(manifest.packages || {})) {
    for (const [inner, hashes] of Object.entries(pkg.files))
      expected.set(`es6/node_modules/${key}/${inner}`, hashes[0]);
  }
  for (const [rel, hashes] of Object.entries(manifest.files || {}))
    expected.set(rel, hashes[0]);
  const modified = [];
  const unexpected = [];
  const seen = new Set();
  for (const rel of walk(buildDir)) {
    if (rel === MANIFEST_NAME) continue;
    seen.add(rel);
    if (!expected.has(rel)) unexpected.push(rel);
    else if (hashFile(path.join(buildDir, rel)) !== expected.get(rel))
      modified.push(rel);
  }
  const missing = [...expected.keys()].filter((r) => !seen.has(r)).sort();
  return { modified, missing, unexpected };
}

/** The third-party packages a manifest bundles: name -> [version]. */
export function bundledThirdParty(manifest) {
  const out = {};
  for (const [key, pkg] of Object.entries(manifest.packages || {})) {
    if (pkg.source || !pkg.version) continue;
    const split = splitAssetPath(`node_modules/${key}/x`);
    const name = split ? split.name : key;
    out[name] = [...new Set([...(out[name] || []), pkg.version])].sort();
  }
  return out;
}

/**
 * Ask the npm advisory database (the endpoint `npm audit` uses) about the
 * bundled versions. Returns [{ package, version, title, severity, url,
 * vulnerable }] or throws when the service cannot be reached.
 */
export async function auditBundled(packages, { fetchImpl = fetch } = {}) {
  if (!Object.keys(packages).length) return [];
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetchImpl(ADVISORY_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(packages),
      });
      if (!res.ok) throw new Error(`advisory service answered ${res.status}`);
      const data = await res.json();
      const found = [];
      for (const [name, advisories] of Object.entries(data || {})) {
        for (const adv of advisories || []) {
          found.push({
            package: name,
            version: (packages[name] || []).join(", "),
            title: adv.title,
            severity: adv.severity,
            url: adv.url,
            vulnerable: adv.vulnerable_versions,
          });
        }
      }
      return found.sort((a, b) =>
        `${a.package}${a.url}`.localeCompare(`${b.package}${b.url}`),
      );
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}

function list(items) {
  const shown = items.slice(0, LIST_LIMIT).map((i) => `\`${i}\``);
  if (items.length > LIST_LIMIT)
    shown.push(`and ${items.length - LIST_LIMIT} more`);
  return shown.join(", ");
}

// only plain https links from the advisory service become markdown links
function advisoryLink(a) {
  const title = cell(a.title).replace(/[[\]]/g, "");
  return /^https:\/\/[^\s()<>]+$/.test(a.url || "")
    ? `[${title}](${a.url})`
    : title;
}

// advisory titles come from the network: keep them to one table cell
function cell(text) {
  return String(text == null ? "" : text)
    .replace(/\\/g, "\\\\")
    .replace(/\|/g, "\\|")
    .replace(/[\r\n]+/g, " ");
}

/** Markdown for the job summary. */
export function renderSummary({ manifest, source, build, audit, auditError }) {
  const out = ["### Ubiquity compiled assets", ""];
  const m = manifest.source || {};
  const link = (sha) =>
    sha
      ? `[\`${sha.slice(0, 10)}\`](https://github.com/${REPOSITORY}/commit/${sha})`
      : "unknown";
  out.push(
    `Shipped build: webcomponents ${link(m.commit)} (version ${m.version || "unknown"}). ` +
      `Compared with webcomponents master ${link(source && source.commit)} from source, without building.`,
    "",
  );

  if (auditError) {
    out.push(
      `**Advisory lookup failed:** ${auditError}. Bundled packages were not audited this run.`,
      "",
    );
  } else if (audit && audit.length) {
    out.push(`#### Vulnerable bundled packages (${audit.length})`, "");
    out.push("| Package | Bundled | Severity | Advisory | Affected |");
    out.push("| --- | --- | --- | --- | --- |");
    for (const a of audit) {
      out.push(
        `| \`${cell(a.package)}\` | ${cell(a.version)} | ${cell(a.severity)} | ${advisoryLink(a)} | \`${cell(a.vulnerable)}\` |`,
      );
    }
    out.push("");
  } else if (audit) {
    out.push("No known advisories for the bundled third-party packages.", "");
  }

  if (source) {
    const files = source.stale.reduce(
      (n, s) => n + s.changed.length + s.removed.length + s.added.length,
      0,
    );
    if (files || source.looseChanged.length || source.newPackages.length) {
      out.push(
        `#### Stale assets (${files + source.looseChanged.length} files in ${source.stale.length + (source.looseChanged.length ? 1 : 0)} packages)`,
        "",
        "Source on master differs from what this build was compiled from. The next ubiquity run updates them.",
        "",
      );
      for (const s of source.stale) {
        const parts = [];
        if (s.changed.length) parts.push(`changed ${list(s.changed)}`);
        if (s.removed.length) parts.push(`removed ${list(s.removed)}`);
        if (s.added.length) parts.push(`new ${list(s.added)}`);
        out.push(`- \`${s.package}\`: ${parts.join("; ")}`);
      }
      if (source.looseChanged.length)
        out.push(`- build root: changed ${list(source.looseChanged)}`);
      if (source.newPackages.length)
        out.push(
          `- new packages not in this build: ${list(source.newPackages)}`,
        );
      out.push("");
    }
    if (source.thirdParty.length) {
      out.push(
        `#### Bundled third-party packages that differ from master's yarn.lock (${source.thirdParty.length})`,
        "",
        "| Package | Bundled | master yarn.lock | Patch changed |",
        "| --- | --- | --- | --- |",
      );
      for (const t of source.thirdParty) {
        out.push(
          `| \`${cell(t.package)}\` | ${cell(t.shipped)} | ${cell(t.master.join(", ") || "not in lockfile")} | ${t.patchChanged ? "yes" : ""} |`,
        );
      }
      out.push("");
    }
    if (source.toolchainChanged.length) {
      out.push(
        `Build toolchain changed on master (${list(source.toolchainChanged)}): any compiled file may differ.`,
        "",
      );
    }
    if (
      !files &&
      !source.looseChanged.length &&
      !source.newPackages.length &&
      !source.thirdParty.length &&
      !source.toolchainChanged.length
    ) {
      out.push("Compiled assets match webcomponents master.", "");
    }
  }

  if (build) {
    const n =
      build.modified.length + build.missing.length + build.unexpected.length;
    if (n) {
      out.push(
        `#### Committed build differs from its manifest (${n} files)`,
        "",
        "These files were edited, removed or added after ubiquity wrote the manifest.",
        "",
      );
      if (build.modified.length)
        out.push(`- modified: ${list(build.modified)}`);
      if (build.missing.length) out.push(`- missing: ${list(build.missing)}`);
      if (build.unexpected.length)
        out.push(`- not in manifest: ${list(build.unexpected)}`);
      out.push("");
    }
  }
  return out.join("\n");
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--no-audit") args.noAudit = true;
    else if (a.startsWith("--")) args[a.slice(2)] = argv[++i];
    else args._.push(a);
  }
  return args;
}

function appendSummary(file, text) {
  if (file) fs.appendFileSync(file, `${text}\n`);
}

async function main(argv) {
  const args = parseArgs(argv);
  const cmd = args._[0];
  if (cmd === "write") {
    const build = path.resolve(defaultRoot, args.build || "build");
    const out = path.resolve(args.out || path.join(build, MANIFEST_NAME));
    const manifest = buildManifest({ root: defaultRoot, build });
    fs.writeFileSync(out, `${stableStringify(manifest)}\n`);
    const pkgs = Object.values(manifest.packages);
    const files =
      pkgs.reduce((n, p) => n + Object.keys(p.files).length, 0) +
      Object.keys(manifest.files).length;
    console.log(
      `ubiquity manifest: ${files} files, ${pkgs.length} packages (${pkgs.filter((p) => !p.source).length} third-party) -> ${out}`,
    );
    return 0;
  }
  if (cmd === "check") {
    if (!args.manifest) {
      console.error("check needs --manifest <file>");
      return 2;
    }
    const summaryFile = args.summary || process.env.GITHUB_STEP_SUMMARY;
    const manifestPath = path.resolve(args.manifest);
    if (!fs.existsSync(manifestPath)) {
      const text =
        "### Ubiquity compiled assets\n\nNo manifest yet: the next ubiquity run writes it. Nothing to compare.\n";
      console.log(text);
      appendSummary(summaryFile, text);
      return 0;
    }
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    if (manifest.format !== FORMAT) {
      const text = `### Ubiquity compiled assets\n\nManifest format ${manifest.format} is not one this checker reads (${FORMAT}); skipped.\n`;
      console.log(text);
      appendSummary(summaryFile, text);
      return 0;
    }
    const buildDir = path.resolve(args.build || path.dirname(manifestPath));
    const source = compareWithSource(manifest, { root: defaultRoot });
    const build = fs.existsSync(buildDir)
      ? compareWithBuild(manifest, buildDir)
      : null;
    let audit = null;
    let auditError = null;
    if (!args.noAudit) {
      try {
        audit = await auditBundled(bundledThirdParty(manifest));
      } catch (e) {
        auditError = e.message;
        console.log(`::warning::advisory lookup failed: ${e.message}`);
      }
    }
    const text = renderSummary({ manifest, source, build, audit, auditError });
    console.log(text);
    appendSummary(summaryFile, text);
    if (audit && audit.length) {
      for (const a of audit)
        console.log(
          `::error::bundled ${a.package} ${a.version}: ${a.title} (${a.severity}) ${a.url}`,
        );
      return 1;
    }
    return 0;
  }
  console.error(
    "usage: ubiquity-manifest.mjs write [--build dir] [--out file]\n" +
      "       ubiquity-manifest.mjs check --manifest file [--build dir] [--summary file] [--no-audit]",
  );
  return 2;
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (e) => {
      console.error(e);
      process.exit(2);
    },
  );
}
