/**
 * Pre-submission quality gate: runs the Prettier, Stylelint, ESLint, DDD token,
 * CSS and HTML template checks and the CodeQL security scan CI runs, so problems are caught and fixed before code is pushed or a PR is
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
 *   yarn precheck --no-codeql         skip the CodeQL scan while iterating locally
 *
 * CodeQL (scripts/codeql-local.mjs) scans the element folders you changed with
 * the same queries as the CodeQL PR check, so security alerts are fixed before
 * the first push instead of after. It is blocking when the CodeQL CLI is
 * installed (`yarn codeql:install`, one time) and skipped with a note when it
 * is not, unless PRECHECK_REQUIRE_CODEQL=1 is set (the Claude Code push hook
 * sets it, so agents always run it).
 *
 * Merge conflicts: refreshes the base branch and dry-run merges HEAD into it
 * (git merge-tree), so a branch that will show as conflicting on GitHub fails
 * here first. Needs git 2.38+; skipped with a note on older git.
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
    // ESLint errors fail CI (build.yml), so they block here too.
    blocking: true,
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
    {
      // Element "dependencies" hold only what shipped code needs at runtime;
      // build/test tooling goes in devDependencies. Blocking: nothing is
      // baselined, so a fail is new.
      label: "Runtime dependencies",
      args: ["scripts/runtime-deps-check.mjs"],
      changedFiles: /^elements\/[^/]+\/package\.json$/,
    },
    {
      // elements/user-action/lib/xapi-vocabulary.{json,js} must match the
      // static xapiVocabulary getters on the elements that send statements
      label: "xAPI vocabulary is up to date",
      args: ["scripts/generate-xapi-vocabulary.mjs", "--check"],
    },
    {
      // CSS in css`` templates that browsers would silently drop. Advisory:
      // known cases live in scripts/css-template-check.baseline.json
      label: "CSS template syntax",
      args: ["scripts/css-template-check.mjs"],
      blocking: false,
    },
    {
      // html``/svg`` markup the browser would build into a different DOM
      // than the source reads. Known cases: scripts/html-template-check.baseline.json
      label: "HTML template structure",
      args: ["scripts/html-template-check.mjs"],
      blocking: false,
    },
    {
      // Accept / dismiss pairs (save vs cancel, keep vs delete, on vs off)
      // must stay tellable apart in greyscale and with color vision
      // deficiencies: by luminance, or by a non-color cue still in the
      // source. Pairs live in scripts/vision-pairs.json; add yours when you
      // add one. Blocking: nothing is baselined, so a fail is new.
      // haxtheweb/issues#3219
      label: "Color vision action pairs",
      args: ["scripts/vision-pairs-check.mjs", "--strict", "--quiet"],
    },
  ],
};

const argv = process.argv.slice(2);
const FIX = argv.includes("--fix");
const ALL = argv.includes("--all");
const NO_CODEQL = argv.includes("--no-codeql");
const REQUIRE_CODEQL = process.env.PRECHECK_REQUIRE_CODEQL === "1";
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

// Merge-conflict gate. A branch can be clean against a stale local copy of the
// base and still conflict on GitHub, so refresh the base first, then do a
// dry-run merge with `git merge-tree --write-tree` (git 2.38+; touches neither
// the index nor the working tree). Also fails on leftover conflict markers in
// changed files. This cannot see merges that land after the push; CI's
// mergeability state still covers that.
function mergeConflictStep(files) {
  if (ALL) {
    return;
  }
  console.log("\n▶ Merge conflicts");
  const markerFiles = files.filter((f) => {
    let text = "";
    try {
      text = fs.readFileSync(path.join(root, f), "utf8");
    } catch {
      return false;
    }
    return /^(<{7}|>{7})( |$)/m.test(text);
  });
  if (markerFiles.length) {
    console.error("  conflict markers found in:");
    markerFiles.forEach((f) => console.error(`    ${f}`));
    failures.push("Merge conflicts (markers)");
  }
  const base = findBase();
  if (!base) {
    console.log("  skipped: no origin/main or origin/master to compare with");
    return;
  }
  const branch = base.replace(/^origin\//, "");
  // best effort: offline runs still check against the local copy
  const fetched = git([
    "fetch",
    "--quiet",
    "origin",
    `+refs/heads/${branch}:refs/remotes/origin/${branch}`,
  ]);
  if (fetched === null) {
    console.log(`  note: could not refresh ${base}; using the local copy`);
  }
  const res = spawnSync(
    "git",
    [
      "merge-tree",
      "--write-tree",
      "--name-only",
      "--no-messages",
      base,
      "HEAD",
    ],
    { cwd: root, encoding: "utf8" },
  );
  if (res.status === 0) {
    console.log(`  merges cleanly into ${base}`);
  } else if (res.status === 1) {
    const conflicted = lines(res.stdout).slice(1);
    console.error(`  conflicts with ${base} in:`);
    conflicted.forEach((f) => console.error(`    ${f}`));
    console.error(
      `  rebase onto ${base} (or merge it) and resolve, then re-run.`,
    );
    failures.push("Merge conflicts");
  } else {
    console.log(
      `  skipped: git merge-tree unavailable (needs git 2.38+): ${(res.stderr || "").trim()}`,
    );
  }
}

// CodeQL security scan of changed element folders (scripts/codeql-local.mjs).
// Not part of --all: CI already scans the whole repo.
function codeqlStep() {
  if (ALL) {
    return;
  }
  console.log("\n▶ CodeQL (changed elements)");
  if (NO_CODEQL) {
    console.log("  skipped (--no-codeql)");
    return;
  }
  const script = path.join(root, "scripts", "codeql-local.mjs");
  const cli = spawnSync(process.execPath, [script, "--check-cli"], {
    cwd: root,
  });
  if (cli.status !== 0) {
    const hint =
      "CodeQL CLI is not installed. Run `yarn codeql:install` once, then re-run.";
    if (REQUIRE_CODEQL) {
      console.error(`  ${hint}`);
      failures.push("CodeQL (CLI not installed)");
    } else {
      console.log(`  skipped: ${hint}`);
    }
    return;
  }
  const res = spawnSync(process.execPath, [script], {
    cwd: root,
    stdio: "inherit",
  });
  if (res.status !== 0) {
    failures.push("CodeQL");
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

  CONFIG.checks.forEach(({ label, args, blocking = true, changedFiles }) => {
    console.log(`\n▶ ${label}`);
    let runArgs = args;
    // checks that take a file list get the changed files (whole repo on --all)
    if (changedFiles && !ALL) {
      const matching = files.filter((f) => changedFiles.test(f));
      if (!matching.length) {
        console.log("  no changed files to check");
        return;
      }
      runArgs = [...args, ...matching];
    }
    const res = spawnSync(process.execPath, runArgs, {
      cwd: root,
      stdio: "inherit",
    });
    if (res.status !== 0) {
      (blocking ? failures : advisories).push(label);
    }
  });

  mergeConflictStep(files);
  codeqlStep();

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
