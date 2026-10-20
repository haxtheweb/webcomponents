/**
 * Pre-submission quality gate: runs the Prettier, Stylelint, ESLint and DDD token checks
 * CI runs, so problems are caught and fixed before code is pushed or a PR is
 * opened, by humans and AI agents alike.
 *
 * By default only files you changed are checked: everything committed on this
 * branch since it left the base branch, plus staged, unstaged and untracked
 * files. That keeps the check fast and means pre-existing problems in files
 * you never touched do not block you.
 *
 *   yarn precheck             check changed files (what CI will check)
 *   yarn precheck:fix         auto-fix formatting and fixable lint, then check
 *   node scripts/precheck.mjs --all   check the whole repo (slow; much of elements/ predates Prettier)
 *
 * Exit code is 0 when every blocking check passes, 1 otherwise.
 */

import { spawnSync } from "node:child_process";
import console from "node:console";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Per-repo settings. Mirrors .github/workflows/build.yml and
// .github/workflows/ddd-token-lint.yml.
const CONFIG = {
  // Candidate base branches, first one that exists wins.
  bases: ["origin/master", "origin/main"],
  prettier: {
    // CI intends `prettier --check **/*.{js,json}`.
    pattern: /\.(js|json)$/,
    allTargets: ["**/*.{js,json}"],
    // About half of elements/**/*.js already fails Prettier, and CI's unquoted
    // glob never reaches elements/, so those files stay exempt until they are
    // reformatted. Files you add, or that were clean before, are enforced.
    exemptPreexisting: true,
  },
  eslint: {
    pattern: /\.js$/,
    // eslint.config.mjs only covers elements/**/*.js, and CI runs `eslint elements`.
    scope: ["elements/"],
    allTargets: ["elements"],
    // CI runs ESLint with continue-on-error, so it is advisory here too.
    blocking: false,
  },
  stylelint: {
    pattern: /\.css$/,
    allTargets: ["**/*.css"],
  },
  // Cheap repo-wide checks CI also runs; both finish in well under a second.
  checks: [
    {
      label: "DDD token references",
      args: ["scripts/ddd-token-lint.js"],
    },
    {
      label: "DTCG token export is up to date",
      args: ["elements/d-d-d/design-system/build-tokens.js", "--check"],
    },
  ],
};

const argv = process.argv.slice(2);
const FIX = argv.includes("--fix");
const ALL = argv.includes("--all");
const CHUNK = 150;
const LIST_LIMIT = 15;

function git(args) {
  const res = spawnSync("git", args, { cwd: root, encoding: "utf8" });
  return res.status === 0 ? res.stdout.trim() : null;
}

function lines(text) {
  return text ? text.split("\n").filter(Boolean) : [];
}

function chunks(list) {
  const out = [];
  for (let i = 0; i < list.length; i += CHUNK) {
    out.push(list.slice(i, i + CHUNK));
  }
  return out;
}

function findBase() {
  const head = git(["symbolic-ref", "--quiet", "refs/remotes/origin/HEAD"]);
  const candidates = head
    ? [head.replace("refs/remotes/", ""), ...CONFIG.bases]
    : CONFIG.bases;
  return candidates.find((ref) =>
    git(["rev-parse", "--verify", "--quiet", ref]),
  );
}

// Returns the changed files plus the ref they were compared against (used to
// look up each file's original content).
function changedFiles() {
  const found = new Set();
  const base = findBase();
  let note = "";
  let ref = null;
  if (base) {
    const mergeBase = git(["merge-base", "HEAD", base]);
    if (!mergeBase) {
      note = ` (no common history with ${base}; comparing against its tip)`;
    }
    ref = mergeBase || base;
    lines(
      git(["diff", "--name-only", "--diff-filter=ACMR", ref, "HEAD"]),
    ).forEach((f) => found.add(f));
  } else {
    note =
      " (no origin/main or origin/master found; checking local changes only)";
  }
  lines(git(["diff", "--name-only", "--diff-filter=ACMR", "HEAD"])).forEach(
    (f) => found.add(f),
  );
  lines(git(["ls-files", "--others", "--exclude-standard"])).forEach((f) =>
    found.add(f),
  );
  const existing = [...found].filter((f) => fs.existsSync(path.join(root, f)));
  return { files: existing.sort(), base: base || "local changes", note, ref };
}

// Resolve a tool's bin script from the repo's own node_modules so the
// version always matches what CI installs. No npx, no shell.
function toolBin(pkg, name = pkg) {
  const pj = path.join(root, "node_modules", pkg, "package.json");
  if (!fs.existsSync(pj)) {
    return null;
  }
  const meta = JSON.parse(fs.readFileSync(pj, "utf8"));
  const rel = typeof meta.bin === "string" ? meta.bin : meta.bin[name];
  return path.join(path.dirname(pj), rel);
}

const failures = [];
const advisories = [];

function missingTool(label, pkg) {
  console.error(
    `\n✖ ${label}: ${pkg} is not installed. Run "npm install" (or "yarn install") first.`,
  );
  failures.push(label);
}

function runTool(label, pkg, argsFor, targets, { blocking = true } = {}) {
  const bin = toolBin(pkg);
  if (!bin) {
    missingTool(label, pkg);
    return;
  }
  console.log(`\n▶ ${label}`);
  let ok = true;
  chunks(targets).forEach((chunk) => {
    const res = spawnSync(process.execPath, [bin, ...argsFor, ...chunk], {
      cwd: root,
      stdio: "inherit",
    });
    if (res.status !== 0) {
      ok = false;
    }
  });
  if (!ok) {
    (blocking ? failures : advisories).push(label);
  }
}

// Prettier files that would be rewritten. `error` is true when Prettier itself
// could not run (for example a syntax error), which must also fail the check.
function listUnformatted(bin, targets) {
  const files = [];
  let error = false;
  chunks(targets).forEach((chunk) => {
    const res = spawnSync(
      process.execPath,
      [bin, "--list-different", "--ignore-unknown", ...chunk],
      { cwd: root, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
    );
    if (res.status === 1) {
      files.push(...lines(res.stdout));
    } else if (res.status !== 0) {
      error = true;
      console.error(res.stderr || res.stdout);
    }
  });
  return { files, error };
}

// True when the file already failed Prettier before this branch touched it.
function unformattedAtBase(bin, file, ref) {
  const show = spawnSync("git", ["show", `${ref}:${file}`], {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  if (show.status !== 0) {
    return false;
  }
  const res = spawnSync(
    process.execPath,
    [bin, "--check", "--stdin-filepath", file],
    { cwd: root, input: show.stdout, encoding: "utf8" },
  );
  return res.status === 1;
}

function printList(files) {
  files.slice(0, LIST_LIMIT).forEach((f) => console.log(`    ${f}`));
  if (files.length > LIST_LIMIT) {
    console.log(`    ...and ${files.length - LIST_LIMIT} more`);
  }
}

function prettierStep(targets, ref) {
  const bin = toolBin("prettier");
  if (!bin) {
    missingTool("Prettier", "prettier");
    return;
  }
  console.log("\n▶ Prettier");
  const first = listUnformatted(bin, targets);
  let exempt = [];
  let pending = first.files;
  if (CONFIG.prettier.exemptPreexisting && ref) {
    exempt = pending.filter((f) => unformattedAtBase(bin, f, ref));
    pending = pending.filter((f) => !exempt.includes(f));
  }
  let error = first.error;
  if (FIX && pending.length) {
    chunks(pending).forEach((chunk) => {
      spawnSync(process.execPath, [bin, "--write", ...chunk], {
        cwd: root,
        stdio: "inherit",
      });
    });
    const again = listUnformatted(bin, pending);
    pending = again.files;
    error = error || again.error;
  }
  if (pending.length) {
    console.log(`  ${pending.length} file(s) need formatting:`);
    printList(pending);
  }
  if (exempt.length) {
    console.log(
      `  note: ${exempt.length} changed file(s) were already unformatted on the base branch and are not blocking:`,
    );
    printList(exempt);
  }
  if (pending.length || error) {
    failures.push("Prettier");
  } else {
    console.log("  all checked files are formatted");
  }
}

function main() {
  const mode = FIX ? "fix" : "check";
  let files = [];
  let ref = null;
  let baseLabel = "";
  if (ALL) {
    baseLabel = "whole repo";
  } else {
    const changed = changedFiles();
    files = changed.files;
    ref = changed.ref;
    baseLabel = `${files.length} changed file(s) vs ${changed.base}${changed.note}`;
    if (!files.length) {
      console.log("precheck: no changed files, nothing to check.");
      return;
    }
  }
  console.log(`precheck (${mode}): ${baseLabel}`);

  const prettierTargets = ALL
    ? CONFIG.prettier.allTargets
    : files.filter((f) => CONFIG.prettier.pattern.test(f));
  if (prettierTargets.length) {
    prettierStep(prettierTargets, ref);
  }

  const eslintTargets = ALL
    ? CONFIG.eslint.allTargets
    : files.filter(
        (f) =>
          CONFIG.eslint.pattern.test(f) &&
          CONFIG.eslint.scope.some((prefix) => f.startsWith(prefix)),
      );
  if (eslintTargets.length) {
    runTool(
      FIX ? "ESLint (fix)" : "ESLint",
      "eslint",
      ["--no-warn-ignored", ...(FIX ? ["--fix"] : [])],
      eslintTargets,
      { blocking: CONFIG.eslint.blocking },
    );
  }

  const cssTargets = ALL
    ? CONFIG.stylelint.allTargets
    : files.filter((f) => CONFIG.stylelint.pattern.test(f));
  if (cssTargets.length) {
    runTool(
      FIX ? "Stylelint (fix)" : "Stylelint",
      "stylelint",
      FIX ? ["--fix"] : [],
      cssTargets,
    );
  }

  CONFIG.checks.forEach(({ label, args }) => {
    console.log(`\n▶ ${label}`);
    const res = spawnSync(process.execPath, args, {
      cwd: root,
      stdio: "inherit",
    });
    if (res.status !== 0) {
      failures.push(label);
    }
  });

  console.log("");
  if (advisories.length) {
    console.log(
      `precheck: advisory only (not blocking in CI): ${advisories.join(", ")}`,
    );
  }
  if (failures.length) {
    console.error(`precheck FAILED: ${failures.join(", ")}`);
    console.error(
      FIX
        ? "Some problems could not be fixed automatically. Fix them by hand, then re-run: yarn precheck"
        : "Fix the problems above, then re-run: yarn precheck\n(yarn precheck:fix repairs formatting and fixable lint automatically)",
    );
    process.exitCode = 1;
  } else {
    console.log("precheck PASSED");
  }
}

main();
