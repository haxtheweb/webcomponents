/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Mechanical checks for HAX rules that nothing enforced yet. Each reads the
 * files git tracks, prints file:line (or file) for every finding and exits 1
 * when there is one.
 *
 *   node scripts/rule-checks.mjs typescript
 *     NO TypeScript (AGENTS.md): no .ts, .tsx, .mts or .cts source under
 *     elements/. Type declarations (.d.ts) are allowed: they describe the
 *     JavaScript for editors and are never compiled.
 *
 *   node scripts/rule-checks.mjs node-version
 *     Node.js Version, Latest LTS (praw RULES.md 92dfb3b2): the root
 *     package.json engines.node, any .nvmrc or .node-version, and every
 *     node-version in .github/workflows name the current LTS, NODE_LTS below.
 *     Raise NODE_LTS when a new LTS line starts and fix what this flags.
 *
 *   node scripts/rule-checks.mjs test-sleeps [--base <git ref>] [--update-baseline]
 *     Testing, Poll, Don't Sleep (praw RULES.md 932f6cd4): a test waits for
 *     the condition it needs, never a fixed time. Counts fixed sleeps per
 *     test file (aTimeout(n), new Promise((r) => setTimeout(r, n)),
 *     page.waitForTimeout(n)). Sleeps that predate the rule are listed in
 *     scripts/test-sleeps.baseline.json; a file fails when it has more than
 *     its baseline count. With --base, the baseline itself may only shrink
 *     compared with that ref: no new file, no higher count. After removing
 *     sleeps, run with --update-baseline and commit the file.
 *
 *   node scripts/rule-checks.mjs aria-refs [--base <ref>] [--update-baseline]
 *     Shadow-Boundary ARIA References (praw RULES.md 410c4334): counts, per
 *     element file, id references (aria-labelledby, aria-describedby,
 *     aria-controls, aria-owns, aria-activedescendant, for) whose id is not
 *     written in the same file. A heuristic: ids handed to a template helper
 *     ({ id: "hdr" }) count, dynamic ids are skipped, light-DOM elements are
 *     skipped. Baseline: scripts/aria-refs.baseline.json.
 *
 *   node scripts/rule-checks.mjs a11y-collapse [--base <ref>] [--update-baseline]
 *     a11y-collapse heading-button (praw RULES.md WQoGOB82): counts
 *     <a11y-collapse> without heading-button in element code, demos and HAX
 *     schemas. Baseline: scripts/a11y-collapse.baseline.json.
 *
 *   node scripts/rule-checks.mjs package-names
 *     every elements/<name>/package.json is named @haxtheweb/<name> (AGENTS.md Package Names)
 *
 *   node scripts/rule-checks.mjs themes
 *     every theme in haxcms-elements/lib/themes.json reaches HAXCMSLitElementTheme
 *     (or HAXCMSLitElement) through its extends chain (AGENTS.md Theme Development)
 *
 *   node scripts/rule-checks.mjs element-docs [--base <ref>] [--update-baseline]
 *     an element (its main file defines a custom element) ships lib/<tag>.docs.json
 *     and its build script runs extract-element-docs (praw RULES.md f3c77167)
 *
 *   node scripts/rule-checks.mjs es-modules [--base <ref>] [--update-baseline]
 *     no CommonJS (module.exports, exports.x, require) in shipped element code
 *     (AGENTS.md ES Modules); vendored bundles that predate it are baselined
 *
 *   node scripts/rule-checks.mjs secrets
 *     no tracked file holds a high-confidence secret shape (AGENTS.md
 *     Sensitive Data); a value that has to ship is listed in
 *     scripts/secrets-allow.json by sha256, never by value, with why
 *
 *   node scripts/rule-checks.mjs mfr-haxcms|incorrect-colors|tracking-declared|link-rewrites [--base <ref>] [--update-baseline]
 *     mfr-haxcms: no new calls in the retired @haxcms/ micro-frontend
 *       namespace (praw RULES.md 82dc87fd)
 *     incorrect-colors: no wrong-answer style painted red; incorrect is
 *       purple (--ddd-status-incorrect-*) (RULES.md 8d0c033b)
 *     tracking-declared: a file that sends xAPI declares static get
 *       xapiVocabulary() so the person tracked can see it (RULES.md ea643795)
 *     link-rewrites: no http link rewrite or upgrade-insecure-requests
 *       (RULES.md f54de8cb)
 *
 *   node scripts/rule-checks.mjs model-calls
 *     the AI Content rules (praw RULES.md): no element calls a model (a
 *     hosted provider's API or SDK, or a browser built-in model) unless
 *     scripts/ai-call-sites.json lists the call site with the test that
 *     covers each rule, and no test reaches a real model
 *
 *   Browser Support (non-Baseline APIs) is compared per changed file by
 *   scripts/baseline-apis-check.mjs, which needs ESLint, in the build workflow.
 *
 *   Every baseline only shrinks: with --base, a new file or a higher count
 *   in it fails.
 *
 *   node scripts/rule-checks.mjs all       every check above (no --base)
 *
 * Standard library only. Self-tests: scripts/test/rule-checks.test.mjs.
 */
import console from "node:console";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const NODE_LTS = 24;
const BASELINE = "scripts/test-sleeps.baseline.json";

function tracked(root, patterns) {
  const out = execFileSync("git", ["ls-files", "-z", "--", ...patterns], {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  return out.split("\0").filter(Boolean);
}

/* ---------- NO TypeScript ---------- */
export function typescriptFindings(files) {
  return files
    .filter((f) => /\.(ts|tsx|mts|cts)$/.test(f) && !/\.d\.ts$/.test(f))
    .map(
      (f) =>
        `${f}: TypeScript source; HAX elements ship JavaScript (a .d.ts declaration is fine)`,
    );
}

/* ---------- Node.js latest LTS ---------- */
// a version string names the LTS when its major version is NODE_LTS:
// "24", "24.x", "^24", ">=24", "24.11.0", "lts/*" (always the current LTS)
export function namesLts(value, lts = NODE_LTS) {
  const v = String(value)
    .trim()
    .replace(/^["']|["']$/g, "");
  if (/^lts\/\*$/i.test(v) || /^lts\/(\w+)$/i.test(v)) return true;
  const m = v.match(/^(?:v|\^|~|>=\s*)?(\d+)(?:\.(?:\d+|x|\*))*$/i);
  return !!m && Number(m[1]) === lts;
}

export function nodeVersionFindings(
  { pkg, versionFiles, workflows },
  lts = NODE_LTS,
) {
  const out = [];
  const engine = pkg && pkg.engines ? pkg.engines.node : undefined;
  if (!engine)
    out.push(`package.json: engines.node is missing; set it to "${lts}.x"`);
  else if (!namesLts(engine, lts))
    out.push(
      `package.json: engines.node is "${engine}", not Node ${lts} (latest LTS)`,
    );
  for (const [file, text] of Object.entries(versionFiles)) {
    if (!namesLts(text.trim(), lts))
      out.push(`${file}: "${text.trim()}" is not Node ${lts} (latest LTS)`);
  }
  for (const [file, text] of Object.entries(workflows)) {
    text.split("\n").forEach((line, i) => {
      const m = line.match(/^\s*-?\s*node-version:\s*(.+?)\s*(#.*)?$/);
      if (!m) return;
      let raw = m[1];
      if (/\$\{\{/.test(raw)) return; // a matrix value, checked where the matrix lists it
      const values = raw.startsWith("[")
        ? raw.replace(/^\[|\]$/g, "").split(",")
        : [raw];
      for (const v of values) {
        if (v.trim() && !namesLts(v, lts))
          out.push(
            `${file}:${i + 1}: node-version ${v.trim()} is not Node ${lts} (latest LTS)`,
          );
      }
    });
  }
  return out;
}

/* ---------- Poll, don't sleep ---------- */
const SLEEPS = [
  /\baTimeout\s*\(/g,
  /new\s+Promise\s*\(\s*\(?\s*(\w+)\s*\)?\s*=>\s*setTimeout\s*\(\s*\1\s*,/g,
  /\.waitForTimeout\s*\(/g,
];
export function countSleeps(text) {
  return SLEEPS.reduce((n, re) => n + (text.match(re) || []).length, 0);
}

export function sleepFindings(counts, baseline, what = COUNTED["test-sleeps"]) {
  const out = [];
  for (const [file, n] of Object.entries(counts)) {
    const allowed = baseline[file] || 0;
    if (n > allowed)
      out.push(`${file}: ${n} ${what.noun}, ${allowed} allowed; ${what.fix}`);
  }
  return out;
}

export function baselineGrowth(previous, next, name = BASELINE) {
  const out = [];
  for (const [file, n] of Object.entries(next)) {
    if (!(file in previous))
      out.push(`${name}: adds ${file} (${n}); the baseline only shrinks`);
    else if (n > previous[file])
      out.push(
        `${name}: raises ${file} from ${previous[file]} to ${n}; the baseline only shrinks`,
      );
  }
  return out;
}

/* ---------- Shadow-Boundary ARIA References ---------- */
// An id reference written in a shadow root only resolves inside that root.
// Counts static references (aria-labelledby, aria-describedby,
// aria-controls, aria-owns, aria-activedescendant, for) whose id is not
// written anywhere in the same file: the target lives in another tree, or
// nowhere. Elements that render into light DOM (createRenderRoot returning
// this) are skipped: their references resolve in the document.
const REF =
  /\s(aria-(?:labelledby|describedby|controls|owns|activedescendant)|for)\s*=\s*(["'])([^"'$`{}]*)\2/g;
const ID = /\sid\s*=\s*(["'])([^"'$`{}]+)\1/g;
export function countAriaRefs(text) {
  if (/createRenderRoot\s*\(\s*\)\s*\{\s*return\s+this\b/.test(text)) return 0;
  const ids = new Set();
  for (const m of text.matchAll(ID)) ids.add(m[2].trim());
  // ids handed to a shared template helper ({ id: "hdr" }) or set in code (el.id = "x")
  for (const m of text.matchAll(
    /(?:\bid\s*:|\.id\s*=)\s*(["'])([^"'$`{}]+)\1/g,
  ))
    ids.add(m[2].trim());
  let n = 0;
  for (const m of text.matchAll(REF)) {
    for (const id of m[3].split(/\s+/).filter(Boolean)) if (!ids.has(id)) n++;
  }
  return n;
}

/* ---------- a11y-collapse heading-button ---------- */
// <a11y-collapse> without heading-button: only the small toggle icon opens it
const COLLAPSE = /<a11y-collapse(?=[\s>/])([^>]*)>/g;
export function countCollapses(text) {
  let n = 0;
  for (const m of text.matchAll(COLLAPSE))
    if (!/\bheading-button\b/.test(m[1])) n++;
  return n;
}

/* ---------- ES Modules ---------- */
// CommonJS in shipped element code: module.exports, exports.x = or require()
export function countCommonJs(text) {
  return (
    text.match(
      /\bmodule\.exports\b|(^|[^.\w$])exports\.\w+\s*=|(^|[^.\w$])require\s*\(\s*["'`]/gm,
    ) || []
  ).length;
}

/* ---------- Element Docs Setup ---------- */
// an element (its main file defines a custom element) ships lib/<tag>.docs.json
// and its build script regenerates it
export function docsMissing(text, file, exists, pkg) {
  const m = file.match(/^elements\/([^/]+)\/\1\.js$/);
  if (!m || !/customElements\.define\s*\(/.test(text)) return 0;
  const build = pkg && pkg.scripts ? pkg.scripts.build || "" : "";
  // the extractor names the file after the element's tag, which can differ from the folder
  return exists(`elements/${m[1]}/lib`, ".docs.json") &&
    build.includes("extract-element-docs")
    ? 0
    : 1;
}

/* ---------- Package Names ---------- */
// every element's package.json is named @haxtheweb/<folder>
export function packageNameFindings(packages) {
  return Object.entries(packages)
    .filter(([dir, pkg]) => pkg.name !== `@haxtheweb/${dir}`)
    .map(
      ([dir, pkg]) =>
        `elements/${dir}/package.json: name is "${pkg.name}", not "@haxtheweb/${dir}"`,
    );
}

/* ---------- Theme Development ---------- */
// every theme in haxcms-elements/lib/themes.json reaches HAXCMSLitElement
// (usually through HAXCMSLitElementTheme) by its extends chain
export function themeFindings(themes, sources) {
  const parents = new Map();
  for (const text of Object.values(sources)) {
    for (const m of text.matchAll(
      /(?:class\s+(\w+)|(?:const|let)\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*class)\s+extends\s+([^{]+?)\s*\{/g,
    )) {
      const name = m[1] || m[2];
      if (!parents.has(name)) parents.set(name, m[3]);
    }
  }
  const reaches = (expr, depth = 0) => {
    if (/\bHAXCMSLitElement(Theme)?\b/.test(expr)) return true;
    if (depth > 8) return false;
    return [...expr.matchAll(/\b([A-Z]\w*)\b/g)].some(
      ([, n]) => parents.has(n) && reaches(parents.get(n), depth + 1),
    );
  };
  const out = [];
  for (const [tag, t] of Object.entries(themes)) {
    const file = "elements/" + String(t.path).replace(/^@haxtheweb\//, "");
    const text = sources[file];
    if (text === undefined) {
      out.push(
        `${file}: theme ${tag} is in themes.json but its file is missing`,
      );
      continue;
    }
    const decls = [
      ...text.matchAll(/class\s+\w+\s+extends\s+([^{]+?)\s*\{/g),
    ].map((m) => m[1]);
    if (!decls.some((e) => reaches(e)))
      out.push(
        `${file}: theme ${tag} does not extend HAXCMSLitElementTheme (or HAXCMSLitElement)`,
      );
  }
  return out;
}

/* ---------- MFR Call Namespacing ---------- */
// "@haxcms/..." micro-frontend names: the retired namespace (praw RULES.md 82dc87fd);
// new calls use @system/ or @site/
export function countHaxcmsNamespace(text) {
  return (text.match(/["'`]@haxcms\/[\w-]+/g) || []).length;
}

/* ---------- Green for correct, purple for incorrect ---------- */
// a CSS rule whose selector names a wrong / incorrect state and paints it
// with a red-family color (praw RULES.md 8d0c033b, Meaning Channels).
// Use --ddd-status-incorrect-* (purple) instead.
const RED =
  /--ddd-theme-default-(?:error|original87Pink)\b|(?:^|[\s:,(])(?:red|crimson|#f00\b|#ff0000\b|#d32f2f\b|#e53935\b)/im;
export function countRedIncorrect(text) {
  let n = 0;
  for (const m of text.matchAll(/([^{}]*)\{([^{}]*)\}/g)) {
    if (
      /incorrect|wrong|is-error-answer/i.test(m[1]) &&
      /[.#\[:]/.test(m[1]) &&
      RED.test(m[2])
    )
      n++;
  }
  return n;
}

/* ---------- Tracking Is Visible to the Person Tracked ---------- */
// an element file that sends xAPI (dispatches user-engagement or builds a
// statement) declares static get xapiVocabulary(), which is what the
// "what's tracked" view and My learning read (praw RULES.md ea643795)
export function countUndeclaredTracking(text) {
  const sends =
    /new\s+CustomEvent\(\s*["'`]user-engagement["'`]|\bbuildStatement\s*\(/.test(
      text,
    );
  return sends && !/\bxapiVocabulary\b/.test(text) ? 1 : 0;
}

/* ---------- User-authored links are always respected ---------- */
// code that rewrites http:// links or turns on upgrade-insecure-requests
// (praw RULES.md f54de8cb: authored http links keep working)
export function countLinkRewrites(text) {
  return (
    text.match(
      /upgrade-insecure-requests|\.replace(?:All)?\(\s*(?:\/\^?\(?http:|\/\^?\(?http\\:|["'`]http:\/\/["'`]\s*,\s*["'`]https:\/\/["'`])/g,
    ) || []
  ).length;
}

/* ---------- Sensitive Data ---------- */
// high-confidence secret shapes only: cloud keys, tokens and private keys
const SECRETS = [
  [/AKIA[0-9A-Z]{16}/, "an AWS access key id"],
  [/\bgh[pousr]_[0-9A-Za-z]{36,}\b/, "a GitHub token"],
  [/\bgithub_pat_[0-9A-Za-z_]{40,}\b/, "a GitHub fine-grained token"],
  [/\bxox[abpr]-[0-9A-Za-z-]{10,}/, "a Slack token"],
  [/\bsk-(?:proj-|ant-)?[A-Za-z0-9_-]{32,}/, "an AI provider API key"],
  [/\bAIza[0-9A-Za-z_-]{35}\b/, "a Google API key"],
  [
    /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY( BLOCK)?-----/,
    "a private key",
  ],
];
// allowed: { file, sha256 of the matched text, reason } from scripts/secrets-allow.json,
// for a value that has to ship (a restricted browser key); the file never repeats it
export function secretFindings(file, text, allowed = []) {
  const out = [];
  text.split("\n").forEach((line, i) => {
    for (const [re, what] of SECRETS) {
      const m = line.match(re);
      if (!m) continue;
      const hash = createHash("sha256").update(m[0]).digest("hex");
      if (allowed.some((a) => a.file === file && a.sha256 === hash)) continue;
      out.push(
        `${file}:${i + 1}: looks like ${what} (sha256 ${hash.slice(0, 12)}); never commit secrets (AGENTS.md Sensitive Data)`,
      );
    }
  });
  return out;
}

/* ---------- AI Content ---------- */
// A model call: a hosted provider's API or SDK, or the browser's built-in
// models. Today no element calls a model, so the AI Content rules in praw
// RULES.md (output validated, facts from the data, no self-approval,
// personal information stripped, nothing truncated silently, cost shown,
// tests make no paid calls) have no code to hold yet. This keeps it that
// way until a call site is reviewed against them: a new call site fails
// unless scripts/ai-call-sites.json lists it with the test that covers each
// rule, and a test file may never reach a real provider.
const MODEL_CALL =
  /api\.openai\.com|api\.anthropic\.com|generativelanguage\.googleapis\.com|api\.mistral\.ai|api\.groq\.com|openrouter\.ai\/api|\/v1\/chat\/completions|["'`]@anthropic-ai\/sdk["'`]|\bfrom\s+["'`]openai["'`]|["'`]@google\/generative-ai["'`]|\bLanguageModel\.create\s*\(|\bai\.languageModel\b|\b(?:Summarizer|Writer|Rewriter|Translator)\.create\s*\(/;
export function modelCallFindings(file, text, sites = []) {
  const out = [];
  const isTest = /\/test\//.test(file);
  text.split("\n").forEach((line, i) => {
    if (!MODEL_CALL.test(line)) return;
    if (isTest) {
      out.push(
        `${file}:${i + 1}: a test reaches a real model; tests run against a scripted fake provider (praw RULES.md AI Content: Tests Make No Paid or Networked Model Calls)`,
      );
    } else if (!sites.some((site) => site.file === file)) {
      out.push(
        `${file}:${i + 1}: a model call site that scripts/ai-call-sites.json does not list; list it with the test that covers each AI Content rule (praw RULES.md, AI Content)`,
      );
    }
  });
  return out;
}

/* ---------- counted checks: per-file counts against a baseline that only shrinks ---------- */
const COUNTED = {
  "test-sleeps": {
    globs: ["elements/*/test/*.js", "elements/*/test/**/*.js"],
    count: countSleeps,
    noun: "fixed sleep(s)",
    fix: "wait for the condition instead (poll a property, an event or the DOM)",
  },
  "aria-refs": {
    globs: [
      "elements/*/*.js",
      "elements/*/lib/**/*.js",
      "elements/*/src/**/*.js",
    ],
    count: countAriaRefs,
    skip: /\.(min|umd)\.js$|\/lib\/[^/]*vendor|\/test\//,
    noun: "id reference(s) with no matching id in the same file",
    fix: "keep the control and its label in one shadow root, or set ariaLabelledByElements (praw RULES.md 410c4334)",
  },
  "a11y-collapse": {
    globs: [
      "elements/*/*.js",
      "elements/*/lib/**/*.js",
      "elements/*/demo/*.html",
      "elements/*/lib/*.haxProperties.json",
    ],
    count: countCollapses,
    skip: /\.(min|umd)\.js$|\/lib\/[^/]*vendor|\/test\//,
    noun: "a11y-collapse without heading-button",
    fix: "add heading-button so the whole heading opens it (praw RULES.md WQoGOB82)",
  },
  "es-modules": {
    globs: [
      "elements/*/*.js",
      "elements/*/lib/**/*.js",
      "elements/*/src/**/*.js",
    ],
    count: countCommonJs,
    skip: /\.(min|umd)\.js$|\/test\/|\/demo\//,
    noun: "CommonJS use(s) (module.exports, exports.x, require)",
    fix: "use ES module import / export (AGENTS.md ES Modules); a vendored UMD bundle goes in a .umd.js or .min.js file",
  },
  "element-docs": {
    globs: ["elements/*/*.js"],
    count: (text, file, root) => {
      const m = file.match(/^elements\/([^/]+)\/\1\.js$/);
      if (!m) return 0;
      const pkgFile = path.join(root, `elements/${m[1]}/package.json`);
      const pkg = fs.existsSync(pkgFile)
        ? JSON.parse(fs.readFileSync(pkgFile, "utf8"))
        : null;
      const hasDocs = (dir, ext) => {
        const full = path.join(root, dir);
        return (
          fs.existsSync(full) &&
          fs.readdirSync(full).some((n) => n.endsWith(ext))
        );
      };
      return docsMissing(text, file, hasDocs, pkg);
    },
    noun: "element without its docs data",
    fix: "generate lib/<tag>.docs.json and end the build script with node ../../scripts/extract-element-docs.mjs --write . (praw RULES.md f3c77167)",
  },
  "mfr-haxcms": {
    globs: ["elements/*/*.js", "elements/*/lib/**/*.js"],
    count: countHaxcmsNamespace,
    skip: /\.(min|umd)\.js$|\/lib\/[^/]*vendor|\/test\/|\/demo\//,
    noun: "call(s) in the retired @haxcms/ micro-frontend namespace",
    fix: "use @system/ or @site/ (praw RULES.md 82dc87fd, MFR Call Namespacing)",
  },
  "incorrect-colors": {
    globs: ["elements/*/*.js", "elements/*/lib/**/*.js"],
    count: countRedIncorrect,
    skip: /\.(min|umd)\.js$|\/lib\/[^/]*vendor|\/test\/|\/demo\//,
    noun: "wrong-answer style(s) painted red",
    fix: "incorrect is purple, never red: use --ddd-status-incorrect-* (praw RULES.md 8d0c033b)",
  },
  "tracking-declared": {
    globs: ["elements/*/*.js", "elements/*/lib/**/*.js"],
    count: countUndeclaredTracking,
    skip: /\.(min|umd)\.js$|\/lib\/[^/]*vendor|\/test\/|\/demo\//,
    noun: "file that sends xAPI without declaring static get xapiVocabulary()",
    fix: "declare what it sends so the What's tracked view and My learning can show it (praw RULES.md ea643795)",
  },
  "link-rewrites": {
    globs: ["elements/*/*.js", "elements/*/lib/**/*.js"],
    count: countLinkRewrites,
    skip: /\.(min|umd)\.js$|\/lib\/[^/]*vendor|\/test\/|\/demo\//,
    noun: "http link rewrite(s) or upgrade-insecure-requests",
    fix: "keep authored links as written (praw RULES.md f54de8cb: authored http links keep working)",
  },
};
const baselineFile = (name) => `scripts/${name}.baseline.json`;

function counts(root, what) {
  const out = {};
  for (const f of tracked(root, what.globs)) {
    if (what.skip && what.skip.test(f)) continue;
    const n = what.count(fs.readFileSync(path.join(root, f), "utf8"), f, root);
    if (n) out[f] = n;
  }
  return out;
}

function counted(name, args, root) {
  const what = COUNTED[name];
  const now = counts(root, what);
  const rel = baselineFile(name);
  const file = path.join(root, rel);
  if (args.includes("--update-baseline")) {
    const sorted = Object.fromEntries(
      Object.keys(now)
        .sort()
        .map((k) => [k, now[k]]),
    );
    fs.writeFileSync(file, JSON.stringify(sorted, null, 2) + "\n");
    console.log(
      `${name}: baseline written with ${Object.keys(sorted).length} file(s)`,
    );
    return [];
  }
  const baseline = fs.existsSync(file)
    ? JSON.parse(fs.readFileSync(file, "utf8"))
    : {};
  const out = sleepFindings(now, baseline, what);
  const at = args.indexOf("--base");
  if (at !== -1 && args[at + 1]) {
    let previous = null;
    try {
      previous = JSON.parse(
        execFileSync("git", ["show", `${args[at + 1]}:${rel}`], {
          cwd: root,
          encoding: "utf8",
          stdio: ["ignore", "pipe", "ignore"],
        }),
      );
    } catch (e) {
      previous = null; // no baseline at the base yet: this pull request adds it
    }
    if (previous) out.push(...baselineGrowth(previous, baseline, rel));
  }
  const fewer = Object.entries(baseline).filter(
    ([f, n]) => (now[f] || 0) < n,
  ).length;
  if (fewer)
    console.log(
      `${name}: ${fewer} file(s) are now below the baseline; run with --update-baseline to lock that in`,
    );
  return out;
}

/* ---------- runner ---------- */
function run(check, args, root = ROOT) {
  if (check === "typescript")
    return typescriptFindings(tracked(root, ["elements"]));
  if (check === "node-version") {
    const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
    const versionFiles = {};
    for (const f of [".nvmrc", ".node-version"])
      if (fs.existsSync(path.join(root, f))) versionFiles[f] = read(f);
    const workflows = {};
    for (const f of tracked(root, [".github/workflows"]))
      if (/\.ya?ml$/.test(f)) workflows[f] = read(f);
    return nodeVersionFindings({
      pkg: JSON.parse(read("package.json")),
      versionFiles,
      workflows,
    });
  }
  if (check === "package-names") {
    const packages = {};
    for (const f of tracked(root, ["elements/*/package.json"])) {
      const m = f.match(/^elements\/([^/]+)\/package\.json$/);
      if (m)
        packages[m[1]] = JSON.parse(
          fs.readFileSync(path.join(root, f), "utf8"),
        );
    }
    return packageNameFindings(packages);
  }
  if (check === "themes") {
    const themes = JSON.parse(
      fs.readFileSync(
        path.join(root, "elements/haxcms-elements/lib/themes.json"),
        "utf8",
      ),
    );
    const sources = {};
    for (const f of tracked(root, [
      "elements/*/*.js",
      "elements/*/lib/**/*.js",
    ])) {
      if (/\/test\/|\.min\.js$/.test(f)) continue;
      sources[f] = fs.readFileSync(path.join(root, f), "utf8");
    }
    return themeFindings(themes, sources);
  }
  if (check === "model-calls") {
    const sitesFile = path.join(root, "scripts/ai-call-sites.json");
    const sites = fs.existsSync(sitesFile)
      ? JSON.parse(fs.readFileSync(sitesFile, "utf8")).sites
      : [];
    const out = [];
    for (const f of tracked(root, [
      "elements/*/*.js",
      "elements/*/lib/**/*.js",
      "elements/*/src/**/*.js",
      "elements/*/test/**/*.js",
    ])) {
      if (/\.min\.js$|pptx-rendered\.js$/.test(f)) continue;
      out.push(
        ...modelCallFindings(
          f,
          fs.readFileSync(path.join(root, f), "utf8"),
          sites,
        ),
      );
    }
    return out;
  }
  if (check === "secrets") {
    const out = [];
    const allowFile = path.join(root, "scripts/secrets-allow.json");
    const allowed = fs.existsSync(allowFile)
      ? JSON.parse(fs.readFileSync(allowFile, "utf8")).allowed
      : [];
    for (const f of tracked(root, ["."])) {
      if (
        /(^|\/)node_modules\/|\.(png|jpe?g|gif|webp|ico|woff2?|ttf|otf|eot|mp3|mp4|webm|ogg|wav|zip|gz|pdf|wasm)$|\.min\.js$|(^|\/)yarn\.lock$|package-lock\.json$/.test(
          f,
        )
      )
        continue;
      const full = path.join(root, f);
      let text;
      try {
        if (fs.statSync(full).size > 2 * 1024 * 1024) continue;
        text = fs.readFileSync(full, "utf8");
      } catch (e) {
        continue;
      }
      out.push(...secretFindings(f, text, allowed));
    }
    return out;
  }
  if (COUNTED[check]) return counted(check, args, root);
  throw new Error(`unknown check "${check}"`);
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const [check, ...args] = process.argv.slice(2);
  const checks =
    check === "all"
      ? [
          "typescript",
          "node-version",
          "package-names",
          "themes",
          "secrets",
          "model-calls",
          ...Object.keys(COUNTED),
        ]
      : [check];
  if (!check) {
    console.error(
      `usage: node scripts/rule-checks.mjs <typescript|node-version|package-names|themes|secrets|model-calls|${Object.keys(COUNTED).join("|")}|all> [--base <ref>] [--update-baseline]`,
    );
    process.exit(2);
  }
  let failed = 0;
  for (const c of checks) {
    const findings = run(c, args);
    findings.forEach((f) => console.log(f));
    console.log(
      `${c}: ${findings.length ? findings.length + " finding(s)" : "OK"}`,
    );
    failed += findings.length;
  }
  process.exit(failed ? 1 : 0);
}
