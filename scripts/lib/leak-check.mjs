/**
 * Node side of the memory-leak check (scripts/leak-check.mjs).
 *
 * - listTagEntries(root): every custom element tag in
 *   hax-elements-registry.json with the module that defines it. Whether a tag
 *   is HAX-capable is decided in the browser with the same rule as the API
 *   snapshot gate: its class has haxProperties (own or inherited) or the
 *   package calls setHaxProperties(schema, "<tag>").
 * - changedFiles / changedFolders: which element folders a change touches.
 * - compareToBaseline(): which leaks are new, per tag and check.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

// Every check counts what is left over from the measured attach/detach
// cycles of one tag after a few warm-up cycles. Something created once (a
// singleton store, a shared listener) lands in the warm-up and is never
// counted; only growth proportional to the number of cycles is a leak.
export const CHECKS = {
  listeners:
    "listeners added to window, document, <html>, <body> or a matchMedia list during a cycle are still registered after the element is removed",
  observers:
    "ResizeObserver / IntersectionObserver / MutationObserver created during a cycle is still observing and alive after the element is removed and garbage collected",
  intervals: "setInterval started during a cycle is never cleared",
  "raf-loops":
    "requestAnimationFrame loops keep running after the element is removed (more callbacks per frame for every cycle)",
  "global-stores":
    "a collection reachable from globalThis (store arrays, maps, sets, registries, MobX observers) grows with every cycle",
  retained:
    "removed instances are still alive after garbage collection (something global keeps a reference)",
};
// One leak shared by every element built on a common mixin, keyed by the
// globalThis path that grows. Gating on it would block every new element that
// uses the mixin, so it is reported once per run as advisory instead. Empty
// while no such leak is known; add an entry only together with an issue for
// its cause, and remove it once the cause is fixed.
export const SHARED_LEAKS = {};

// reported, never gating
export const ADVISORY_CHECKS = {
  "render-error": "the element did not import or render in the test page",
};

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

/** package name -> element folder name */
function packageFolders(root) {
  const map = new Map();
  const dir = path.join(root, "elements");
  for (const name of fs.readdirSync(dir)) {
    const pj = readJson(path.join(dir, name, "package.json"), null);
    if (pj && pj.name) {
      map.set(pj.name, name);
    }
  }
  return map;
}

/**
 * Every hyphenated tag in hax-elements-registry.json with the file that
 * defines it (from wc-registry.json).
 * @returns {Array<{tag:string, folder:string, module:string, setHax:boolean}>}
 *   module is relative to the repo root (elements/<folder>/<file>.js)
 */
export function listTagEntries(root) {
  const registry = readJson(path.join(root, "hax-elements-registry.json"), {});
  const wc = readJson(path.join(root, "wc-registry.json"), {});
  const folders = packageFolders(root);
  const out = [];
  for (const tag of Object.keys(registry).sort()) {
    if (
      !/^[a-z][a-z0-9]*-[a-z0-9-]*$/.test(tag) ||
      typeof wc[tag] !== "string"
    ) {
      continue;
    }
    const spec = wc[tag];
    const parts = spec.split("/");
    const pkg = spec.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
    const rest = parts.slice(spec.startsWith("@") ? 2 : 1).join("/");
    const folder = folders.get(pkg);
    if (!folder || !rest) {
      continue;
    }
    const module = `elements/${folder}/${rest}`;
    if (!fs.existsSync(path.join(root, module))) {
      continue;
    }
    const source = fs.readFileSync(path.join(root, module), "utf8");
    out.push({
      tag,
      folder,
      module,
      setHax:
        source.includes("setHaxProperties(") && source.includes(`"${tag}"`),
    });
  }
  return out;
}

function git(root, args) {
  const res = spawnSync("git", args, { cwd: root, encoding: "utf8" });
  return res.status === 0 ? res.stdout.trim() : null;
}

/**
 * Files changed relative to a base ref (merge-base when it shares history),
 * plus uncommitted and untracked files.
 */
export function changedFiles(root, base) {
  const found = new Set();
  const add = (text) =>
    (text || "")
      .split("\n")
      .filter(Boolean)
      .forEach((f) => found.add(f));
  if (base) {
    if (!git(root, ["rev-parse", "--verify", "--quiet", `${base}^{commit}`])) {
      throw new Error(`base ref not found: ${base}`);
    }
    const mergeBase = git(root, ["merge-base", "HEAD", base]) || base;
    add(git(root, ["diff", "--name-only", mergeBase, "HEAD"]));
  }
  add(git(root, ["diff", "--name-only", "HEAD"]));
  add(git(root, ["ls-files", "--others", "--exclude-standard"]));
  return [...found].sort();
}

/** element folders touched by a list of changed files */
export function changedFolders(files) {
  const out = new Set();
  for (const f of files) {
    const m = f.match(/^elements\/([^/]+)\//);
    if (m) {
      out.add(m[1]);
    }
  }
  return out;
}

/**
 * Turn a stack-frame URL from the test page into a repo path with line:
 * http://localhost:8000/elements/a/a.js?wds-import-map=0:12:5 -> elements/a/a.js:12
 * Unknown shapes are returned unchanged (trimmed).
 */
export function frameToRepoPath(frame) {
  const m = String(frame || "").match(
    /^(?:https?:\/\/[^/\s]+)?(\/[^\s?#:]+)(?:\?[^\s:]*)?:(\d+)(?::\d+)?$/,
  );
  if (!m) {
    return String(frame || "").trim();
  }
  let file = m[1].replace(/^\/__wds-outside-root__\/\d+\//, "/");
  file = file.replace(/^\//, "");
  return `${file}:${m[2]}`;
}

/**
 * Group leftover records into "what x count at where" detail lines, keeping
 * only groups that grew with at least `min` of the measured cycles.
 * @param {Array<{what:string, where:string}>} records
 * @returns {string[]} sorted, most frequent first
 */
export function groupRecords(records, min) {
  const counts = new Map();
  for (const r of records) {
    const key = `${r.what}  at ${r.where || "(unknown)"}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, n]) => n >= min)
    .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))
    .map(([key, n]) => `${key.replace("  at ", ` x${n}  at `)}`);
}

/**
 * The smallest leftover count, out of `cycles` measured cycles, that counts
 * as growth: half the cycles, so one leak per instance (or every other
 * instance) is caught and a few late async registrations are not.
 */
export function leakThreshold(cycles) {
  return Math.max(2, Math.ceil(cycles / 2));
}

/**
 * One tag's browser measurements -> { check: details[] } for the checks that
 * grew with at least half of the measured cycles.
 */
export function toChecks(raw, defaultCycles = 12) {
  const cycles = Number(raw.cycles) || defaultCycles;
  const min = leakThreshold(cycles);
  const checks = {};
  const add = (name, list) => {
    if (list.length) {
      checks[name] = list;
    }
  };
  const records = (list) =>
    (list || []).map((r) => ({
      what: r.what,
      where: frameToRepoPath(r.where),
    }));
  add("listeners", groupRecords(records(raw.listeners), min));
  add("observers", groupRecords(records(raw.observers), min));
  add("intervals", groupRecords(records(raw.intervals), min));
  const raf = (raw.raf || []).filter((r) => r.perFrame > 0);
  const rafTotal = raf.reduce((sum, r) => sum + r.perFrame, 0);
  if (rafTotal >= min) {
    add(
      "raf-loops",
      raf
        .sort((a, b) => b.perFrame - a.perFrame)
        .map(
          (r) =>
            `+${Math.round(r.perFrame * 10) / 10} rAF callbacks/frame  at ${frameToRepoPath(r.where)}`,
        ),
    );
  }
  add(
    "global-stores",
    (raw.stores || [])
      .filter((s) => s.delta >= min && !SHARED_LEAKS[s.path])
      .sort((a, b) => b.delta - a.delta)
      .map((s) => `globalThis.${s.path} +${s.delta}`),
  );
  if (raw.retained >= min) {
    add("retained", [
      `${raw.retained} of ${cycles} removed instances alive after GC`,
    ]);
  }
  return checks;
}

/** the SHARED_LEAKS paths this tag grew (advisory) */
export function sharedLeaksOf(raw, defaultCycles = 12) {
  const min = leakThreshold(Number(raw.cycles) || defaultCycles);
  return (raw.stores || [])
    .filter((s) => s.delta >= min && SHARED_LEAKS[s.path])
    .map((s) => s.path);
}

/**
 * results: { [tag]: { [check]: string[] details } }
 * baseline: { [tag]: { [check]: number of findings } }
 * A leak is new when the tag has no baseline entry for that check. Counts and
 * details are runtime measurements that move with timing, so they are listed,
 * never compared.
 */
export function compareToBaseline(results, baseline, gatingChecks) {
  const fresh = [];
  const known = [];
  const fixed = [];
  for (const tag of Object.keys(results).sort()) {
    const now = results[tag] || {};
    const before = baseline[tag] || {};
    for (const check of Object.keys(now).sort()) {
      if (!gatingChecks.includes(check) || !now[check].length) {
        continue;
      }
      const item = { tag, check, details: now[check] };
      if (before[check]) {
        known.push(item);
      } else {
        fresh.push(item);
      }
    }
    for (const check of Object.keys(before)) {
      if (!now[check] || !now[check].length) {
        fixed.push({ tag, check });
      }
    }
  }
  return { fresh, known, fixed };
}
