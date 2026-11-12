#!/usr/bin/env node
/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * License header on new element source files (haxtheweb/issues#3262).
 *
 * Invariant: a .js source file added under elements/<name>/ opens with the
 * header `hax webcomponent` scaffolds (haxtheweb/create,
 * src/templates/webcomponent/<template>/webcomponent.js):
 *
 *   /**
 *    * Copyright <year> <holder>
 *    * @license Apache-2.0, see LICENSE for full text.
 *    *\/
 *
 * Any year and holder, and any "see ..." pointer, are accepted. First-party
 * files carry `Copyright <year> The Pennsylvania State University`, plus the
 * contributor's own Copyright line where they hold one (the CLA licenses
 * contributions to us; it does not transfer copyright, and it requires the
 * contributor's notice to stay).
 *
 * Every element source file is checked with --all (what CI runs); without
 * it, only files added against the base branch are checked. Third-party or
 * forked code listed in THIRD_PARTY keeps its own notice and is skipped; any
 * other file whose header names a license other than Apache-2.0 fails under
 * --all until it is fixed or listed.
 *
 * Not checked: test/, demo/, locales/, node_modules/, dist/, build/,
 * vendor/ and public/ folders, *.min.js / *.test.js / *.stories.js, tool
 * configs (rollup.config.js, web-dev-server.config.js...), files whose top
 * says they are generated ("generated", "do not edit"), and vendored code
 * that carries its own header (a /*! banner, or a non-Apache @license /
 * SPDX-License-Identifier).
 *
 *   node scripts/license-header-check.mjs --all          every element source file (CI)
 *   node scripts/license-header-check.mjs                files added vs the base branch (plus staged and untracked)
 *   node scripts/license-header-check.mjs --base <ref>   compare with another ref (CI passes HEAD^1)
 *   node scripts/license-header-check.mjs <file>...      check these files as if they were new
 *
 * Exit 1 when a checked file is missing the header, 0 otherwise.
 */
import { execFileSync } from "node:child_process";
import console from "node:console";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const HEADER_EXAMPLE = `/**
 * Copyright ${new Date().getFullYear()} The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */`;

/**
 * Third-party or forked code inside element folders. These keep the notice
 * of the project they came from, so they never get our header.
 */
export const THIRD_PARTY = [
  ["elements/code-sample/lib/highlightjs/", "highlight.js, BSD-3-Clause"],
  ["elements/code-sample/lib/themes/", "highlight.js themes, BSD-3-Clause"],
  ["elements/code-editor/lib/monaco-element/", "fork of monaco-element"],
  ["elements/file-system-broker/lib/xlsx/", "SheetJS, Apache-2.0"],
  ["elements/la-tex/lib/latex2html5.js", "latex2html5, MIT"],
  ["elements/lrn-math/lrn-math.js", "fork of math-tex"],
  ["elements/multiple-choice/lib/confetti-container.js", "confetti-element, MIT"],
  ["elements/music-player/lib/html-midi-player.js", "html-midi-player bundle"],
  ["elements/pdf-browser-viewer/pdf-browser-viewer.js", "fork, BSD"],
  ["elements/q-r/lib/qr.js", "qr.js, public domain / CC0"],
  ["elements/slide-deck/lib/pptx-rendered.js", "pptx renderer bundle (JSZip)"],
  ["elements/utils/lib/marked.js", "marked, MIT"],
  ["elements/utils/lib/selection.js", "Google LLC, Apache-2.0"],
  ["elements/voice-recorder/lib/vmsg-fork.js", "fork of vmsg"],
];

/** listed in THIRD_PARTY (a path, or a folder ending in /) */
export function isThirdParty(file) {
  const f = String(file).split(path.sep).join("/");
  return THIRD_PARTY.some(([p]) => (p.endsWith("/") ? f.startsWith(p) : f === p));
}

const SKIP_DIR =
  /(^|\/)(test|tests|demo|locales|node_modules|dist|build|vendor|public|coverage)\//;
const SKIP_NAME =
  /(\.(min|test|spec|stories)\.js|(^|\/)[\w.-]+\.config\.js|(^|\/)gulpfile\.js)$/;

/** a .js file under elements/<name>/ that should carry the header */
export function inScope(file) {
  const f = String(file).split(path.sep).join("/");
  return (
    /^elements\/[^/]+\/.+\.js$/.test(f) &&
    !SKIP_DIR.test(f) &&
    !SKIP_NAME.test(f)
  );
}

/** the first block comment, after an optional shebang and blank lines */
export function leadingComment(source) {
  const text = String(source)
    .replace(/^﻿/, "")
    .replace(/^#![^\n]*\n/, "");
  const m = text.match(/^\s*\/\*([\s\S]*?)\*\//);
  return m ? { banner: m[0].trimStart().startsWith("/*!"), body: m[1] } : null;
}

/**
 * "ok" (has the header), "missing", or a reason the file is exempt
 * ("generated", "third-party").
 */
export function classify(source) {
  const top = String(source).split("\n").slice(0, 6).join("\n");
  if (
    /\b(auto-?generated|this file is generated|generated by|do not edit)\b/i.test(
      top,
    )
  ) {
    return "generated";
  }
  const c = leadingComment(source);
  if (!c) {
    return "missing";
  }
  const license = c.body.match(
    /(?:@license|SPDX-License-Identifier:)\s*([A-Za-z0-9.+-]+)/,
  );
  if (c.banner || (license && license[1] !== "Apache-2.0")) {
    return "third-party";
  }
  const copyright = /(^|\n)\s*\*?\s*Copyright\s+(\(c\)\s*|©\s*)?\d{4}\b/i.test(
    c.body,
  );
  return copyright && license ? "ok" : "missing";
}

function git(args) {
  try {
    return execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return null;
  }
}

function lines(text) {
  return (text || "").split("\n").filter(Boolean);
}

function findBase() {
  return ["origin/HEAD", "origin/master", "origin/main"].find(
    (ref) => git(["rev-parse", "--verify", "--quiet", ref]) !== null,
  );
}

/** files added since base (renames are not additions), staged or untracked */
export function addedFiles(base) {
  const found = new Set();
  if (base) {
    if (
      git(["rev-parse", "--verify", "--quiet", `${base}^{commit}`]) === null
    ) {
      throw new Error(`base ref not found: ${base}`);
    }
    const mergeBase = (git(["merge-base", "HEAD", base]) || base).trim();
    lines(
      git(["diff", "--name-only", "--diff-filter=A", "-M", mergeBase, "HEAD"]),
    ).forEach((f) => found.add(f));
    // added in the working tree on top of HEAD, compared with the base, so
    // a file staged after a commit is still new
    lines(
      git([
        "diff",
        "--name-only",
        "--diff-filter=A",
        "-M",
        "--cached",
        mergeBase,
      ]),
    ).forEach((f) => found.add(f));
  }
  lines(
    git(["diff", "--name-only", "--diff-filter=A", "-M", "--cached"]),
  ).forEach((f) => found.add(f));
  lines(git(["ls-files", "--others", "--exclude-standard"])).forEach((f) =>
    found.add(f),
  );
  return [...found].sort();
}

function main(argv) {
  const files = [];
  let base = null;
  let all = false;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--all") {
      all = true;
    } else if (argv[i] === "--base") {
      base = argv[++i];
    } else {
      files.push(argv[i]);
    }
  }
  const candidates = files.length
    ? files.map((f) => path.relative(root, path.resolve(f)))
    : all
      ? lines(git(["ls-files", "elements"]))
      : addedFiles(base || findBase());
  const checked = candidates.filter((f) => inScope(f) && !isThirdParty(f));
  const missing = [];
  const exempt = [];
  for (const f of checked) {
    let source;
    try {
      source = fs.readFileSync(path.join(root, f), "utf8");
    } catch {
      continue; // deleted again in the working tree
    }
    const verdict = classify(source);
    if (verdict === "missing" || (all && verdict === "third-party")) {
      missing.push(f);
    } else if (verdict !== "ok") {
      exempt.push(`${f} (${verdict})`);
    }
  }
  console.log(
    `license-header: ${checked.length} element source file(s) checked${files.length ? "" : all ? " (all)" : ` (added vs ${base || findBase() || "local changes"})`}.`,
  );
  if (exempt.length) {
    console.log(`Not checked (own header or generated): ${exempt.join(", ")}`);
  }
  if (!missing.length) {
    return 0;
  }
  console.log(
    `\n${missing.length} file(s) without the Apache-2.0 license header:\n${missing.map((f) => `  ${f}`).join("\n")}\n\nStart each with the header \`hax webcomponent\` writes (any year and copyright holder):\n\n${HEADER_EXAMPLE}\n\nVendored code keeps its own notice: list it in THIRD_PARTY in scripts/license-header-check.mjs. See CONTRIBUTING.md, "License header".`,
  );
  if (process.env.GITHUB_ACTIONS === "true") {
    for (const f of missing) {
      console.log(
        `::error file=${f},line=1,title=License header::Element source file without the Apache-2.0 license header (Copyright <year> <holder> / @license Apache-2.0)`,
      );
    }
  }
  if (process.env.GITHUB_STEP_SUMMARY) {
    try {
      fs.appendFileSync(
        process.env.GITHUB_STEP_SUMMARY,
        `### License header\n\n${missing.map((f) => `- \`${f}\``).join("\n")}\n\nStart each with:\n\n\`\`\`js\n${HEADER_EXAMPLE}\n\`\`\`\n`,
      );
    } catch {
      // the summary is a convenience
    }
  }
  return 1;
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (e) {
    console.error(`license-header: ${(e && e.message) || e}`);
    process.exitCode = 1;
  }
}
