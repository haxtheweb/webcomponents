/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE.md for full text.
 *
 * Dead code knip cannot see. We don't tree shake, so every line in a shipped
 * element file reaches every browser that loads it. knip (knip.config.js)
 * already reports unused files, exports and dependencies; this check covers
 * three HAX-specific patterns it has no way to model:
 *
 *   unrendered-import  `import "./x.js";` of an element whose tag the file
 *                      never renders or names. It downloads and defines
 *                      the element on every load of the importer. Tags
 *                      content uses are defined by the autoloader from
 *                      wc-registry.json, so they need no eager import.
 *   uncalled-method    a `_private` class method no code anywhere calls:
 *                      no member access, string (haxHooks, super-daemon
 *                      method names), template binding or this[`x${y}`]
 *                      dispatch. Public methods are API and are not checked.
 *   vendor-copy        an unminified vendored `x.js` sitting next to the
 *                      `x.min.js` that is actually loaded, with nothing
 *                      referencing the unminified copy.
 *
 * Not reported (deliberate patterns): imports of singletons used through
 * globalThis or a named export, imports in files that only re-export
 * (aggregators like haxcms-elements.js), imports in a base class whose
 * subclasses render the tag, and imports of a child that a sibling file in
 * the same package renders.
 *
 * Advisory: known cases live in scripts/dead-code-check.baseline.json and
 * only findings missing from it are reported as new.
 *
 *   node scripts/dead-code-check.mjs                    whole repo, new findings (exit 1 if any)
 *   node scripts/dead-code-check.mjs elements/foo/x.js  only these files (precheck passes changed files)
 *   node scripts/dead-code-check.mjs --all              also list baselined findings
 *   node scripts/dead-code-check.mjs --update-baseline  accept the current state
 *   node scripts/dead-code-check.mjs --summary-file f.md   also write a markdown summary (CI)
 */
import console from "node:console";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { parse } = require("@babel/parser");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ELEMENTS = path.join(root, "elements");
const BASELINE = path.join(root, "scripts", "dead-code-check.baseline.json");

const argv = process.argv.slice(2);
const ALL = argv.includes("--all");
const UPDATE = argv.includes("--update-baseline");
let summaryFile = null;
const targetArgs = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === "--summary-file" && i + 1 < argv.length) {
    summaryFile = path.resolve(argv[++i]);
  } else if (!argv[i].startsWith("--")) {
    targetArgs.push(argv[i]);
  }
}

// Vendored libraries, loaded by path rather than written here; same list as
// `vendored` in knip.config.js. Only the vendor-copy rule looks inside them.
const VENDORED = {
  "chartist-render": ["lib/chartist"],
  "wave-player": ["lib/"],
  "moment-element": ["lib/"],
  "file-system-broker": ["lib/xlsx/", "lib/mammoth/"],
  "la-tex": ["lib/latex2html5.js"],
  "music-player": ["lib/html-midi-player.js"],
  "sheet-music": ["lib/alphatab/"],
};
const SKIP_DIRS = new Set(["node_modules", "locales", ".git"]);
// build output folders, skipped at a package's top level only: vendored
// libraries keep their own dist/ under lib/
const SKIP_TOP_DIRS = new Set(["dist", "build", "public"]);
const DEV_DIRS = new Set(["test", "tests", "demo", "automation", "scripts"]);
const SKIP_FILE =
  /(\.min\.js|\.umd\.js|\.amd\.js|rollup\.config\.js|\.stories?\.js|gulpfile\.\w+js|-automation\.js)$/;

const toPosix = (p) => p.split(path.sep).join("/");
const rel = (abs) => toPosix(path.relative(root, abs));

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const topLevel = path.dirname(dir) === ELEMENTS;
      if (
        !SKIP_DIRS.has(entry.name) &&
        !(topLevel && SKIP_TOP_DIRS.has(entry.name))
      ) {
        walk(path.join(dir, entry.name), out);
      }
    } else {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

const packageOf = (relPath) => relPath.split("/")[1];
const isVendored = (relPath) => {
  const pkg = packageOf(relPath);
  const inside = relPath.split("/").slice(2).join("/");
  return (VENDORED[pkg] || []).some((p) => inside.startsWith(p));
};
const isDev = (relPath) =>
  relPath
    .split("/")
    .slice(2)
    .some((part) => DEV_DIRS.has(part));

// ---------------------------------------------------------------------------
// corpus: every element file that could reference a name or a tag
// ---------------------------------------------------------------------------
const allFiles = walk(ELEMENTS, []).map(rel);
const textCache = new Map();
function text(relPath) {
  if (!textCache.has(relPath)) {
    let t = "";
    try {
      t = fs.readFileSync(path.join(root, relPath), "utf8");
    } catch {
      t = "";
    }
    textCache.set(relPath, t);
  }
  return textCache.get(relPath);
}
// generated manifests list every method; they are not callers
const usageFiles = allFiles.filter(
  (f) =>
    /\.(js|mjs|cjs|html)$/.test(f) && !f.endsWith(".min.js") && !isVendored(f),
);
const shippedFiles = allFiles.filter(
  (f) =>
    f.endsWith(".js") &&
    !SKIP_FILE.test(f) &&
    !isDev(f) &&
    !isVendored(f) &&
    // the element's root files and lib/, as published
    (f.split("/").length === 3 || f.split("/")[2] === "lib"),
);

// how often each identifier-like token appears anywhere in the corpus
// (code, strings, templates and comments alike: generous on purpose)
const tokenCount = new Map();
const extendsNames = new Set();
for (const f of usageFiles) {
  const t = text(f);
  const re = /[A-Za-z_$][\w$]*/g;
  let m;
  while ((m = re.exec(t))) {
    tokenCount.set(m[0], (tokenCount.get(m[0]) || 0) + 1);
  }
  const ext = /\bextends\s+([^{]{1,300})\{/g;
  while ((m = ext.exec(t))) {
    for (const id of m[1].match(/[A-Za-z_$][\w$]*/g) || []) {
      extendsNames.add(id);
    }
  }
}

// ---------------------------------------------------------------------------
// packages, registry and tags
// ---------------------------------------------------------------------------
const pkgDir = {};
const pkgMain = {};
for (const dir of fs.readdirSync(ELEMENTS)) {
  const pj = path.join(ELEMENTS, dir, "package.json");
  if (fs.existsSync(pj)) {
    const meta = JSON.parse(fs.readFileSync(pj, "utf8"));
    pkgDir[meta.name] = dir;
    pkgMain[dir] = meta.module || meta.main || "index.js";
  }
}

function resolveSpec(fromRel, spec) {
  let target = null;
  if (spec.startsWith(".")) {
    target = toPosix(path.posix.join(path.posix.dirname(fromRel), spec));
  } else {
    const m = /^(@[^/]+\/[^/]+)(\/.*)?$/.exec(spec);
    if (!m || !pkgDir[m[1]]) {
      return null;
    }
    const dir = pkgDir[m[1]];
    target = `elements/${dir}/${m[2] ? m[2].slice(1) : pkgMain[dir]}`;
  }
  if (
    !target.endsWith(".js") &&
    fs.existsSync(path.join(root, target + ".js"))
  ) {
    target += ".js";
  }
  return fs.existsSync(path.join(root, target)) ? target : null;
}

const registryTags = new Map();
const registry = JSON.parse(
  fs.readFileSync(path.join(root, "wc-registry.json"), "utf8"),
);
for (const [tag, spec] of Object.entries(registry)) {
  const file = resolveSpec("elements/x.js", spec);
  if (file) {
    if (!registryTags.has(file)) registryTags.set(file, new Set());
    registryTags.get(file).add(tag);
  }
}

const tagCache = new Map();
function tagsOf(file) {
  if (!tagCache.has(file)) {
    const tags = new Set(registryTags.get(file) || []);
    const src = text(file);
    const patterns = [
      /static\s+get\s+tag\s*\(\)\s*\{\s*return\s+["'`]([a-z][a-z0-9]*-[a-z0-9-]*)["'`]/g,
      /customElements\.define\(\s*["'`]([a-z][a-z0-9]*-[a-z0-9-]*)["'`]/g,
    ];
    for (const re of patterns) {
      let m;
      while ((m = re.exec(src))) tags.add(m[1]);
    }
    tagCache.set(file, [...tags]);
  }
  return tagCache.get(file);
}

// names a module makes available without its tag: globals and exports
function namesOf(file, tags) {
  const src = text(file);
  const names = new Set(
    tags.map((t) =>
      t
        .split("-")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(""),
    ),
  );
  const res = [
    /globalThis\.([A-Za-z_$][\w$]*)(?:\.[\w$]+)*\s*=(?!=)/g,
    /window\.([A-Za-z_$][\w$]*)(?:\.[\w$]+)*\s*=(?!=)/g,
    /export\s*\{([^}]*)\}/g,
    /export\s+(?:class|const|let|var|function\*?|async\s+function)\s+([A-Za-z_$][\w$]*)/g,
  ];
  for (const re of res) {
    let m;
    while ((m = re.exec(src))) {
      for (const id of m[1].match(/[A-Za-z_$][\w$]*/g) || []) {
        if (id !== "as") names.add(id);
      }
    }
  }
  return [...names];
}

// a module that does work when imported (starts a singleton, registers a
// listener, injects styles) is imported for that work, not for its tag
const sideEffectCache = new Map();
function runsOnImport(file) {
  if (!sideEffectCache.has(file)) {
    let runs = false;
    const ast = parseFile(file);
    for (const n of ast ? ast.program.body : []) {
      let expr = n.type === "ExpressionStatement" ? n.expression : null;
      if (expr && expr.type === "AwaitExpression") expr = expr.argument;
      if (!expr || expr.type !== "CallExpression") continue;
      const callee = text(file).slice(expr.callee.start, expr.callee.end);
      // registration boilerplate every element module has is not a reason
      // to import it: defining the tag, opting into HAX services, mobx setup
      if (
        !/(^|\.)customElements\.define$|^enableServices$|^configure$/.test(
          callee,
        )
      ) {
        runs = true;
        break;
      }
    }
    sideEffectCache.set(file, runs);
  }
  return sideEffectCache.get(file);
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const mentionsTag = (src, tag) =>
  new RegExp(`(?<![\\w-])${escapeRe(tag)}(?![\\w-])`).test(
    src.replace(/--[\w-]+/g, ""),
  );

// ---------------------------------------------------------------------------
// rules
// ---------------------------------------------------------------------------
function parseFile(file) {
  try {
    return parse(text(file), {
      sourceType: "module",
      errorRecovery: true,
      plugins: ["importAttributes", "decorators-legacy", "topLevelAwait"],
    });
  } catch {
    return null;
  }
}

function walkAst(node, visit) {
  if (!node || typeof node.type !== "string") return;
  visit(node);
  for (const key of Object.keys(node)) {
    if (
      key === "loc" ||
      key === "leadingComments" ||
      key === "trailingComments"
    )
      continue;
    const v = node[key];
    if (Array.isArray(v)) {
      for (const c of v) walkAst(c, visit);
    } else if (v && typeof v.type === "string") {
      walkAst(v, visit);
    }
  }
}

function unrenderedImports(file, ast, findings) {
  const body = ast.program.body;
  const onlyReexports = body.every(
    (n) =>
      [
        "ImportDeclaration",
        "ExportAllDeclaration",
        "ExportNamedDeclaration",
      ].includes(n.type) &&
      (n.type !== "ExportNamedDeclaration" || !n.declaration),
  );
  if (onlyReexports) return;
  const src = text(file);
  const exported = [];
  for (const n of body) {
    if (n.type === "ExportNamedDeclaration" && !n.source) {
      for (const sp of n.specifiers || []) {
        if (sp.local && sp.local.name) exported.push(sp.local.name);
      }
    }
    if (n.type === "ExportNamedDeclaration" && n.declaration) {
      const d = n.declaration;
      if (d.id) exported.push(d.id.name);
      for (const v of d.declarations || []) {
        if (v.id && v.id.name) exported.push(v.id.name);
      }
    }
  }
  const isBase = exported.some((n) => extendsNames.has(n));
  const pkg = packageOf(file);
  for (const n of body) {
    if (n.type !== "ImportDeclaration" || n.specifiers.length) continue;
    const target = resolveSpec(file, n.source.value);
    if (!target) continue;
    const tags = tagsOf(target);
    if (!tags.length) continue;
    const rest = src.slice(0, n.start) + src.slice(n.end);
    if (tags.some((t) => mentionsTag(rest, t))) continue;
    if (
      namesOf(target, tags).some((name) =>
        new RegExp(`(?<![\\w$])${escapeRe(name)}(?![\\w$])`).test(rest),
      )
    )
      continue;
    if (isBase || runsOnImport(target)) continue;
    const sibling = shippedFiles.some(
      (f) =>
        f !== file &&
        f !== target &&
        packageOf(f) === pkg &&
        tags.some((t) => text(f).includes(`<${t}`)),
    );
    if (sibling) continue;
    findings.push({
      rule: "unrendered-import",
      file,
      line: n.loc.start.line,
      name: n.source.value,
      message: `imports ${n.source.value} but never renders or names <${tags.join(">, <")}>`,
    });
  }
}

function uncalledMethods(file, ast, findings) {
  // this[`_on${x}`]() / this["_on" + x]() style dispatch keeps matching names alive
  const dynamic = [];
  let opaque = false;
  walkAst(ast.program, (node) => {
    if (
      node.type === "MemberExpression" &&
      node.computed &&
      node.object.type === "ThisExpression"
    ) {
      const p = node.property;
      if (p.type === "TemplateLiteral") {
        dynamic.push([
          p.quasis[0].value.cooked || "",
          p.quasis[p.quasis.length - 1].value.cooked || "",
        ]);
      } else if (p.type === "BinaryExpression" && p.operator === "+") {
        const left = p.left.type === "StringLiteral" ? p.left.value : "";
        const right = p.right.type === "StringLiteral" ? p.right.value : "";
        dynamic.push([left, right]);
      }
    }
    if (
      node.type === "CallExpression" &&
      node.callee.type === "MemberExpression" &&
      node.callee.computed &&
      node.callee.object.type === "ThisExpression" &&
      node.callee.property.type === "Identifier"
    ) {
      opaque = true;
    }
  });
  if (opaque) return;
  const defs = new Map();
  walkAst(ast.program, (node) => {
    if (
      node.type === "ClassMethod" &&
      !node.computed &&
      node.key.type === "Identifier" &&
      node.key.name.startsWith("_")
    ) {
      const list = defs.get(node.key.name) || [];
      list.push(node);
      defs.set(node.key.name, list);
    }
  });
  for (const [name, nodes] of defs) {
    if ((tokenCount.get(name) || 0) > nodes.length) continue;
    if (
      dynamic.some(
        ([pre, post]) =>
          (pre || post) && name.startsWith(pre) && name.endsWith(post),
      )
    )
      continue;
    findings.push({
      rule: "uncalled-method",
      file,
      line: nodes[0].loc.start.line,
      name,
      message:
        nodes[0].kind === "method"
          ? `${name}() is never called (no reference anywhere in elements/)`
          : `${name} is never read or set (no reference anywhere in elements/)`,
    });
  }
}

function vendorCopies(targets, findings) {
  const minFiles = allFiles.filter(
    (f) => f.endsWith(".min.js") && f.split("/")[2] === "lib",
  );
  for (const min of minFiles) {
    const full = min.replace(/\.min\.js$/, ".js");
    if (!allFiles.includes(full)) continue;
    if (targets && !targets.has(full) && !targets.has(min)) continue;
    const base = path.posix.basename(full);
    // the vendored library's own package.json / README name its files;
    // that is not a page loading them
    const parts = full.split("/");
    const own = parts.length >= 5 ? parts.slice(0, 4).join("/") + "/" : null;
    const referenced = allFiles.some(
      (f) =>
        f !== full &&
        !(own && f.startsWith(own)) &&
        f !== min &&
        !f.endsWith(".map") &&
        !f.endsWith(".min.js") &&
        /\.(js|mjs|cjs|html|json)$/.test(f) &&
        // generated listings that name every file
        !/custom-elements\.json$|\.docs\.json$|wc-registry-graph\.json$/.test(
          f,
        ) &&
        text(f).includes(base),
    );
    if (!referenced) {
      findings.push({
        rule: "vendor-copy",
        file: full,
        line: 1,
        name: base,
        message: `unminified copy of ${path.posix.basename(min)}; nothing loads it`,
      });
    }
  }
}

// ---------------------------------------------------------------------------
// run
// ---------------------------------------------------------------------------
let targets = null;
if (targetArgs.length) {
  targets = new Set();
  for (const t of targetArgs) {
    const abs = path.resolve(root, t);
    if (!fs.existsSync(abs)) continue;
    if (fs.statSync(abs).isDirectory()) {
      walk(abs, []).forEach((f) => targets.add(rel(f)));
    } else {
      targets.add(rel(abs));
    }
  }
}
const checkFiles = shippedFiles.filter((f) => !targets || targets.has(f));

const findings = [];
for (const file of checkFiles) {
  const ast = parseFile(file);
  if (!ast) continue;
  unrenderedImports(file, ast, findings);
  uncalledMethods(file, ast, findings);
}
vendorCopies(targets, findings);

// baseline keys ignore line numbers so unrelated edits do not churn them
const keyOf = (f) => `${f.file} :: ${f.rule} :: ${f.name}`;

if (UPDATE) {
  const keys = [...new Set(findings.map(keyOf))].sort();
  fs.writeFileSync(BASELINE, JSON.stringify(keys, null, 2) + "\n");
  console.log(
    `dead-code-check: baseline updated with ${keys.length} known finding(s).`,
  );
  process.exit(0);
}

const baseline = new Set(
  fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, "utf8")) : [],
);
const fresh = findings.filter((f) => !baseline.has(keyOf(f)));
// whole-repo runs only: baselined findings that are gone (fixed) can be dropped
const stale = targets
  ? []
  : [...baseline].filter((k) => !findings.some((f) => keyOf(f) === k));
const show = ALL ? findings : fresh;
show
  .sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)
  .forEach((f) => console.log(`${f.file}:${f.line}  [${f.rule}] ${f.message}`));
const byRule = (list, rule) => list.filter((f) => f.rule === rule).length;
console.log(
  `dead-code-check: ${checkFiles.length} file(s), ${fresh.length} new finding(s) ` +
    `(${byRule(fresh, "unrendered-import")} unrendered imports, ${byRule(fresh, "uncalled-method")} uncalled methods, ${byRule(fresh, "vendor-copy")} vendor copies), ` +
    `${findings.length - fresh.length} baselined`,
);
if (stale.length) {
  console.log(
    `  ${stale.length} baselined finding(s) are fixed; run \`yarn lint:dead-code --update-baseline\` to drop them.`,
  );
}
if (fresh.length) {
  console.log(
    "  remove the dead code, or if it is used in a way this check cannot see, run\n" +
      "  `yarn lint:dead-code --update-baseline` and say why in the PR.",
  );
}

if (summaryFile) {
  const lines = [
    "## Dead code knip cannot see (advisory)",
    "",
    `${fresh.length} new finding(s) not in \`scripts/dead-code-check.baseline.json\`, ${findings.length - fresh.length} baselined.`,
    "",
  ];
  if (fresh.length) {
    lines.push("| File | Rule | Finding |", "| --- | --- | --- |");
    // markdown table cell: escape backslashes first, then the characters
    // that would end the cell or open an HTML tag
    const cell = (value) =>
      value
        .replace(/\\/g, "\\\\")
        .replace(/\|/g, "\\|")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    for (const f of fresh) {
      lines.push(
        `| \`${f.file}:${f.line}\` | ${f.rule} | ${cell(f.message)} |`,
      );
    }
  }
  fs.writeFileSync(summaryFile, lines.join("\n") + "\n");
}
process.exit(fresh.length ? 1 : 0);
