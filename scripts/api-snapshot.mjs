#!/usr/bin/env node
/**
 * Public API snapshot gate for HAX-capable elements.
 *
 * Invariant: content authored with a HAX-capable element keeps working. Once
 * an attribute, slot, HAX setting, event, CSS part or documented CSS custom
 * property of an authorable tag is in api-snapshot/elements/<tag>.json, it
 * cannot disappear or be renamed unless the same pull request lists it in
 * api-snapshot/allowed-removals.json with a reason.
 *
 * Which tags: every custom element tag in hax-elements-registry.json (the
 * repo's list of tags HAX can place in content, also what elements-catalog
 * marks haxCapable) whose class really carries a HAXSchema: a
 * `static get haxProperties()` on the class or an ancestor, or a
 * setHaxProperties(schema, "<tag>") call. Native HTML primitives (no hyphen)
 * are browser API, not ours. Registry entries without a HAXSchema (app shells
 * that only mention haxProperties in a comment) are not authorable and are
 * left out.
 *
 * What is captured per tag (the authored-content contract):
 *   attributes     observed attribute -> property (Lit properties, including
 *                  `attribute: "x"` mappings, inherited across packages)
 *   slots          named slots and "(default)", from the render template
 *   events         custom event names the element dispatches
 *   cssParts       part="..." names and @csspart docs
 *   cssProperties  documented @cssprop custom properties
 *   hax            HAXSchema: settings property/attribute/slot names (array
 *                  sub-fields as "prop[].child"), gizmo present, demoSchema
 *                  tags. Gizmo handles (drag-and-drop mappings) are only
 *                  checked for oddities: they shape insertion, not content.
 *
 * usage:
 *   node scripts/api-snapshot.mjs --write          (yarn api:snapshot)
 *   node scripts/api-snapshot.mjs --check [--base <git-ref>]   (yarn api:check)
 *   node scripts/api-snapshot.mjs --check --base-dir <dir>  base snapshot
 *                                                  from a folder (CI)
 *   node scripts/api-snapshot.mjs --report         oddities, e.g. HAX settings
 *                                                  naming a property the
 *                                                  element does not have
 *
 * --check exits 1 when something in the snapshot (and, with --base, in the
 * base branch's snapshot) is gone and not allowed, or when an allowed
 * removal is still listed in the committed snapshot. Additions only warn.
 *
 * Attributes are read with @custom-elements-manifest/analyzer (the version
 * every element builds with) in memory, never from the committed
 * custom-elements.json files, which are often stale. CEM_ANALYZER_DIR points
 * at a folder whose node_modules holds the analyzer (CI installs only it).
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const SNAPSHOT_DIR = "api-snapshot/elements";
export const ALLOWED_FILE = "api-snapshot/allowed-removals.json";
export const KINDS = [
  "attributes",
  "slots",
  "events",
  "cssParts",
  "cssProperties",
  "hax.gizmo",
  "hax.properties",
  "hax.attributes",
  "hax.slots",
  "hax.demoTags",
];
// events every element fires through shared mixins; not an authored contract
const IGNORED_EVENTS = new Set(["i18n-manager-register-element"]);
// attributes any element accepts, so HAX settings naming them are fine
export const GLOBAL_ATTRIBUTE =
  /^(?:id|class|style|title|lang|dir|role|hidden|slot|tabindex|alt|href|src|accesskey|contenteditable|draggable|inert|translate|aria-[a-z-]+|data-[a-z0-9-]+)$/;

// DOM properties HAX may set on any element
export const DOM_PROPERTY =
  /^(?:innerHTML|innerText|textContent|id|title|lang)$/;

// ---------------------------------------------------------------- analyzer

/** the custom elements manifest analyzer, or null when it is not installed */
export async function loadAnalyzer() {
  try {
    const from = process.env.CEM_ANALYZER_DIR
      ? path.join(path.resolve(process.env.CEM_ANALYZER_DIR), "noop.js")
      : fileURLToPath(import.meta.url);
    const pkgJson = createRequire(from).resolve(
      "@custom-elements-manifest/analyzer/package.json",
    );
    const dir = path.dirname(pkgJson);
    const load = (rel) => import(pathToFileURL(path.join(dir, rel)).href);
    const globbyPath = createRequire(pkgJson).resolve("globby");
    const [{ create, ts }, helpers, lit, globbyMod] = await Promise.all([
      load("index.js"),
      load("src/utils/cli-helpers.js"),
      load("src/features/framework-plugins/lit/lit.js"),
      import(pathToFileURL(globbyPath).href),
    ]);
    const globby = globbyMod.default || globbyMod;
    const version = JSON.parse(fs.readFileSync(pkgJson, "utf8")).version;
    return { create, ts, helpers, litPlugin: lit.litPlugin, globby, version };
  } catch {
    return null;
  }
}

const readJson = (p) => {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
};

/** --globs / --exclude of an element's `cem analyze` build step */
function cemArgs(pkg) {
  const script = String((pkg && pkg.scripts && pkg.scripts.build) || "");
  const at = script.indexOf("cem analyze");
  const rest = at === -1 ? "" : script.slice(at + "cem analyze".length);
  const end = rest.indexOf("&&");
  const cmd = end === -1 ? rest : rest.slice(0, end);
  const values = (re) => [...cmd.matchAll(re)].map((m) => m[1] || m[2]);
  const globs = values(/--globs\s+(?:"([^"]*)"|(\S+))/g);
  const exclude = values(/--exclude\s+(?:"([^"]*)"|(\S+))/g);
  return {
    // top-level files and lib/** always: some authorable tags live there even
    // when the build only documents one file (and "{*}.js" matches nothing)
    globs: [...new Set([...globs, "*.js", "lib/**/*.js"])],
    exclude: exclude.length ? exclude : ["(public|*.stories.js)"],
  };
}

// ------------------------------------------------------------- repo model

/**
 * Lazily analyzed element packages of one repo root. Each package is
 * analyzed on its own (as its build does), then superclasses and mixins
 * that live in other packages are followed by package specifier.
 */
export class Repo {
  constructor(root, cem) {
    this.root = root;
    this.cem = cem;
    this.elementsDir = path.join(root, "elements");
    this.folders = new Map(); // package name -> folder name
    this.cache = new Map(); // folder -> { pkg, modules, sources, files }
    for (const d of fs.readdirSync(this.elementsDir, { withFileTypes: true })) {
      if (!d.isDirectory()) continue;
      const pkg = readJson(path.join(this.elementsDir, d.name, "package.json"));
      if (pkg && pkg.name) this.folders.set(pkg.name, d.name);
    }
  }

  /** analyzed package: manifest modules plus parsed sources by module path */
  pkg(folder) {
    if (this.cache.has(folder)) return this.cache.get(folder);
    const dir = path.join(this.elementsDir, folder);
    const pkg = readJson(path.join(dir, "package.json")) || {};
    const { globs, exclude } = cemArgs(pkg);
    const patterns = this.cem.helpers.mergeGlobsAndExcludes(
      { globs: [] },
      {},
      { globs, exclude },
    );
    const files = this.cem.globby
      .sync(patterns, { cwd: dir })
      .filter(
        (f) => !/(^|\/)(node_modules|test|demo|locales|build|dist)\//.test(f),
      )
      .filter((f) => !/\.(test|min|stories)\.js$/.test(f))
      .sort();
    const sources = new Map();
    const modules = files.map((rel) => {
      const sf = this.cem.ts.createSourceFile(
        rel,
        fs.readFileSync(path.join(dir, rel), "utf8"),
        this.cem.ts.ScriptTarget.ES2020,
        true,
      );
      sources.set(rel, sf);
      return sf;
    });
    let manifest = { modules: [] };
    try {
      manifest = this.cem.create({
        modules,
        plugins: [...(this.cem.litPlugin() || [])],
        context: { dev: false, thirdPartyCEMs: [] },
      });
    } catch (e) {
      manifest = { modules: [], error: e.message };
    }
    const entry = { folder, dir, pkg, sources, manifest };
    this.cache.set(folder, entry);
    return entry;
  }

  /** declaration by name in a module of a package, following re-exports */
  find(folder, modulePath, name, seen = new Set()) {
    const key = `${folder}:${modulePath}:${name}`;
    if (seen.has(key)) return null;
    seen.add(key);
    const p = this.pkg(folder);
    const mods = p.manifest.modules || [];
    const norm = (s) => String(s || "").replace(/^\.\//, "");
    const mod = mods.find((m) => m.path === norm(modulePath));
    const inMod = (m) =>
      m && (m.declarations || []).find((d) => d.name === name);
    if (inMod(mod)) return { folder, module: mod.path, decl: inMod(mod) };
    if (mod) {
      for (const ex of mod.exports || []) {
        if (ex.name === name && ex.declaration && ex.declaration.name) {
          const r = this.resolveRef(
            { ...ex.declaration },
            folder,
            mod.path,
            seen,
          );
          if (r) return r;
        }
      }
    }
    // fall back to any module of the package that declares the name
    for (const m of mods) {
      if (inMod(m)) return { folder, module: m.path, decl: inMod(m) };
    }
    return null;
  }

  /** a CEM reference ({name, module} or {name, package}) to a declaration */
  resolveRef(ref, folder, fromModule, seen = new Set()) {
    if (!ref || !ref.name) return null;
    if (ref.package) {
      const spec = ref.package;
      const parts = spec.split("/");
      const pkgName = spec.startsWith("@")
        ? parts.slice(0, 2).join("/")
        : parts[0];
      const sub = parts.slice(spec.startsWith("@") ? 2 : 1).join("/");
      const target = this.folders.get(pkgName);
      if (!target) return null; // third party (lit, etc.)
      return this.find(target, sub, ref.name, seen);
    }
    // CEM module refs are relative to the package root
    return this.find(folder, ref.module || fromModule, ref.name, seen);
  }

  /** the class node for a declaration, for template and haxProperties reads */
  classNode(folder, modulePath, name) {
    const sf = this.pkg(folder).sources.get(modulePath);
    if (!sf) return null;
    const ts = this.cem.ts;
    let found = null;
    const visit = (n) => {
      if (found) return;
      if (
        (ts.isClassDeclaration(n) || ts.isClassExpression(n)) &&
        n.name &&
        n.name.text === name
      ) {
        found = n;
        return;
      }
      // const Foo = class extends ... / mixins: const M = (s) => class extends s
      if (ts.isVariableDeclaration(n) && n.name && n.name.text === name) {
        const inner = [];
        const walk = (c) => {
          if (ts.isClassExpression(c) || ts.isClassDeclaration(c))
            inner.push(c);
          else ts.forEachChild(c, walk);
        };
        if (n.initializer) walk(n.initializer);
        if (inner.length) {
          found = inner[0];
          return;
        }
      }
      ts.forEachChild(n, visit);
    };
    visit(sf);
    return found ? { node: found, sf } : null;
  }

  /** the string a class's `static get tag()` returns, if literal */
  staticTag(folder, modulePath, name) {
    const c = this.classNode(folder, modulePath, name);
    if (!c) return null;
    const ts = this.cem.ts;
    for (const m of c.node.members) {
      if (
        ts.isGetAccessorDeclaration(m) &&
        m.name.getText() === "tag" &&
        (m.modifiers || []).some(
          (x) => x.kind === ts.SyntaxKind.StaticKeyword,
        ) &&
        m.body
      ) {
        const ret = m.body.statements.find(ts.isReturnStatement);
        const v = ret ? evalLiteral(ts, ret.expression, "") : null;
        return typeof v === "string" ? v : null;
      }
    }
    return null;
  }

  /** the declaration chain: class, then superclasses and mixins (deduped) */
  chain(start) {
    const out = [];
    const seen = new Set();
    const walk = (r) => {
      if (!r) return;
      const key = `${r.folder}:${r.module}:${r.decl.name}`;
      if (seen.has(key)) return;
      seen.add(key);
      out.push(r);
      const refs = [];
      if (r.decl.superclass) refs.push(r.decl.superclass);
      for (const m of r.decl.mixins || []) refs.push(m);
      for (const ref of refs) walk(this.resolveRef(ref, r.folder, r.module));
    };
    walk(start);
    return out;
  }

  /** every class in the repo that declares an authorable tag name */
  tagIndex(tags) {
    const wanted = new Set(tags);
    const index = new Map();
    // only analyze packages whose sources mention a wanted tag
    for (const folder of [...this.folders.values()].sort()) {
      const dir = path.join(this.elementsDir, folder);
      let mentions = false;
      const scan = (d, depth) => {
        if (mentions) return;
        for (const e of fs.readdirSync(d, { withFileTypes: true })) {
          if (e.isDirectory()) {
            if (
              depth < 4 &&
              !/^(node_modules|test|demo|locales|build|dist)$/.test(e.name)
            )
              scan(path.join(d, e.name), depth + 1);
          } else if (
            e.name.endsWith(".js") &&
            !/\.(test|min)\.js$/.test(e.name)
          ) {
            const src = fs.readFileSync(path.join(d, e.name), "utf8");
            for (const m of src.matchAll(
              /["'`]([a-z][a-z0-9]*-[a-z0-9-]*)["'`]/g,
            )) {
              if (wanted.has(m[1])) {
                mentions = true;
                return;
              }
            }
          }
        }
      };
      scan(dir, 0);
      if (!mentions) continue;
      const p = this.pkg(folder);
      for (const mod of p.manifest.modules || []) {
        for (const decl of mod.declarations || []) {
          if (decl.kind !== "class") continue;
          // the class's own `static get tag()` wins over the analyzer's guess
          const tag =
            this.staticTag(folder, mod.path, decl.name) || decl.tagName;
          if (!tag || !wanted.has(tag)) continue;
          const prev = index.get(tag);
          // the package named after the tag wins over a re-declaration
          if (!prev || (folder === tag && prev.folder !== folder)) {
            index.set(tag, { folder, module: mod.path, decl });
          }
        }
      }
    }
    return index;
  }
}

// ----------------------------------------------------- static evaluation

const UNRESOLVED = Symbol("unresolved");

/** value of a literal expression; anything computed becomes UNRESOLVED */
function evalLiteral(ts, node, tag) {
  if (!node) return UNRESOLVED;
  if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node))
    return evalLiteral(ts, node.expression, tag);
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
    return node.text;
  if (ts.isTemplateExpression(node)) {
    let s = node.head.text;
    for (const span of node.templateSpans) {
      const t = span.expression.getText();
      if (!/(^|\.)tag$/.test(t)) return UNRESOLVED;
      s += tag + span.literal.text;
    }
    return s;
  }
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isPrefixUnaryExpression(node) && ts.isNumericLiteral(node.operand))
    return -Number(node.operand.text);
  if (ts.isArrayLiteralExpression(node))
    return node.elements.map((e) =>
      ts.isSpreadElement(e) ? UNRESOLVED : evalLiteral(ts, e, tag),
    );
  if (ts.isObjectLiteralExpression(node)) {
    const out = {};
    for (const p of node.properties) {
      if (ts.isPropertyAssignment(p) && p.name) {
        const key =
          ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)
            ? p.name.text
            : null;
        if (key !== null) out[key] = evalLiteral(ts, p.initializer, tag);
      }
    }
    return out;
  }
  if (
    ts.isTaggedTemplateExpression(node) ||
    ts.isCallExpression(node) ||
    ts.isPropertyAccessExpression(node) ||
    ts.isIdentifier(node)
  )
    return UNRESOLVED;
  return UNRESOLVED;
}

/** read the HAXSchema a `static get haxProperties()` returns */
function haxFromGetter(repo, folder, modulePath, classNode, tag) {
  const ts = repo.cem.ts;
  const getter = classNode.members.find(
    (m) =>
      ts.isGetAccessorDeclaration(m) &&
      m.name &&
      m.name.getText() === "haxProperties" &&
      (m.modifiers || []).some((x) => x.kind === ts.SyntaxKind.StaticKeyword),
  );
  if (!getter || !getter.body) return null;
  const returns = getter.body.statements.filter(ts.isReturnStatement);
  const ret = returns.length ? returns[returns.length - 1].expression : null;
  let expr = ret;
  while (expr && ts.isParenthesizedExpression(expr)) expr = expr.expression;
  // new URL("./lib/<tag>.haxProperties.json", import.meta.url).href
  if (expr && ts.isPropertyAccessExpression(expr) && expr.name.text === "href")
    expr = expr.expression;
  if (expr && ts.isNewExpression(expr) && expr.expression.getText() === "URL") {
    const rel = evalLiteral(ts, (expr.arguments || [])[0], tag);
    if (typeof rel !== "string") return { error: "computed haxProperties URL" };
    const pkgDir = repo.pkg(folder).dir;
    const file = path.resolve(pkgDir, path.dirname(modulePath), rel);
    // only files inside the element's own package
    if (!file.startsWith(pkgDir + path.sep))
      return { error: "haxProperties URL leaves package" };
    const json = readJson(file);
    if (!json) return { error: `missing ${path.relative(repo.root, file)}` };
    return {
      schema: json,
      from: path.relative(repo.root, file).split(path.sep).join("/"),
    };
  }
  if (expr && ts.isObjectLiteralExpression(expr)) {
    return {
      schema: evalLiteral(ts, expr, tag),
      from: `elements/${folder}/${modulePath}`,
    };
  }
  return { error: "haxProperties getter is not a literal or URL" };
}

/** setHaxProperties(<literal or const>, "<tag>") anywhere in the package */
function haxFromSetCall(repo, folder, tag) {
  const ts = repo.cem.ts;
  for (const [modulePath, sf] of repo.pkg(folder).sources) {
    if (!sf.text.includes("setHaxProperties")) continue;
    let hit = null;
    const visit = (n) => {
      if (hit) return;
      if (
        ts.isCallExpression(n) &&
        /(^|\.)setHaxProperties$/.test(n.expression.getText()) &&
        n.arguments.length >= 2 &&
        evalLiteral(ts, n.arguments[1], tag) === tag
      ) {
        let arg = n.arguments[0];
        if (ts.isIdentifier(arg)) {
          const name = arg.text;
          const decl = [];
          const find = (c) => {
            if (
              ts.isVariableDeclaration(c) &&
              c.name.getText() === name &&
              c.initializer
            )
              decl.push(c.initializer);
            ts.forEachChild(c, find);
          };
          find(sf);
          arg = decl[0];
        }
        hit = {
          schema: evalLiteral(ts, arg, tag),
          from: `elements/${folder}/${modulePath}`,
        };
        return;
      }
      ts.forEachChild(n, visit);
    };
    visit(sf);
    if (hit) return hit;
  }
  return null;
}

/**
 * Lit properties the analyzer cannot see: `...sharedProps` and
 * `...OtherClass.properties` spreads inside `static get properties()`,
 * followed through local consts and imports within this repo.
 * Returns { pairs: [[attribute, property]], hidden: Set } where hidden holds
 * the `attribute: false` / `state: true` properties (the analyzer lists those
 * as attributes too, but Lit does not observe them).
 */
function spreadProperties(repo, folder, modulePath, classNode) {
  const ts = repo.cem.ts;
  const out = [];
  const hidden = new Set();
  const seen = new Set();
  const getterReturn = (cls) => {
    const g = cls.members.find(
      (m) =>
        ts.isGetAccessorDeclaration(m) &&
        m.name.getText() === "properties" &&
        (m.modifiers || []).some((x) => x.kind === ts.SyntaxKind.StaticKeyword),
    );
    if (!g || !g.body) return null;
    const r = g.body.statements.filter(ts.isReturnStatement).pop();
    return r ? r.expression : null;
  };
  // a name bound in a module: local const/class, or an import we can follow
  const bind = (f, mod, name, depth) => {
    const sf = repo.pkg(f).sources.get(mod);
    if (!sf || depth > 6) return null;
    for (const st of sf.statements) {
      if (ts.isVariableStatement(st)) {
        for (const d of st.declarationList.declarations) {
          if (d.name.getText() === name && d.initializer)
            return { f, mod, node: d.initializer };
        }
      }
      if (ts.isClassDeclaration(st) && st.name && st.name.text === name)
        return { f, mod, node: st };
      if (
        ts.isImportDeclaration(st) &&
        st.importClause &&
        st.importClause.namedBindings
      ) {
        const nb = st.importClause.namedBindings;
        const el = ts.isNamedImports(nb)
          ? nb.elements.find((e) => e.name.text === name)
          : null;
        if (!el) continue;
        const spec = st.moduleSpecifier.text;
        const orig = el.propertyName ? el.propertyName.text : name;
        let tf = f;
        let tm = null;
        if (spec.startsWith(".")) {
          tm = path.posix.normalize(
            path.posix.join(path.posix.dirname(mod), spec),
          );
          if (tm.startsWith("..")) return null;
        } else {
          const parts = spec.split("/");
          const scoped = spec.startsWith("@");
          tf = repo.folders.get(parts.slice(0, scoped ? 2 : 1).join("/"));
          tm = parts.slice(scoped ? 2 : 1).join("/");
          if (!tf) return null;
        }
        return bind(tf, tm, orig, depth + 1);
      }
    }
    return null;
  };
  const walkObject = (f, mod, obj, depth) => {
    if (!obj || !ts.isObjectLiteralExpression(obj) || depth > 6) return;
    for (const p of obj.properties) {
      if (ts.isPropertyAssignment(p) && p.name) {
        const key = p.name.getText().replace(/^["']|["']$/g, "");
        const opts = ts.isObjectLiteralExpression(p.initializer)
          ? evalLiteral(ts, p.initializer, "")
          : {};
        if (opts.attribute === false || opts.state === true) {
          hidden.add(key);
          continue;
        }
        out.push([
          typeof opts.attribute === "string" ? opts.attribute : key,
          key,
        ]);
      } else if (ts.isSpreadAssignment(p)) {
        const e = p.expression;
        let target = null;
        if (ts.isIdentifier(e)) target = bind(f, mod, e.text, depth);
        else if (
          ts.isPropertyAccessExpression(e) &&
          e.name.text === "properties" &&
          ts.isIdentifier(e.expression)
        )
          target = bind(f, mod, e.expression.text, depth);
        if (!target) continue;
        const key = `${target.f}:${target.mod}:${target.node.pos}`;
        if (seen.has(key)) continue;
        seen.add(key);
        let node = target.node;
        if (ts.isClassDeclaration(node) || ts.isClassExpression(node))
          node = getterReturn(node);
        while (node && ts.isParenthesizedExpression(node))
          node = node.expression;
        walkObject(target.f, target.mod, node, depth + 1);
      }
    }
  };
  let ret = getterReturn(classNode);
  while (ret && ts.isParenthesizedExpression(ret)) ret = ret.expression;
  walkObject(folder, modulePath, ret, 0);
  return { pairs: out, hidden };
}

// --------------------------------------------------------------- extract

const uniqSort = (a) =>
  [...new Set(a.filter((x) => typeof x === "string" && x))].sort();

/** settings property/attribute/slot names, array sub-fields as prop[].child */
function haxSettingNames(settings) {
  const props = [];
  const attrs = [];
  const slots = [];
  const walk = (items, prefix) => {
    if (!Array.isArray(items)) return;
    for (const s of items) {
      if (!s || typeof s !== "object") continue;
      if (typeof s.property === "string") props.push(prefix + s.property);
      if (typeof s.attribute === "string") attrs.push(prefix + s.attribute);
      if (typeof s.slot === "string") slots.push(prefix + s.slot);
      const child =
        typeof s.property === "string" ? `${prefix}${s.property}[].` : prefix;
      if (Array.isArray(s.properties)) walk(s.properties, child);
    }
  };
  if (settings && typeof settings === "object") {
    for (const k of Object.keys(settings).sort()) walk(settings[k], "");
  }
  return { props, attrs, slots };
}

/**
 * the snapshot record of one authorable tag, plus oddities found on the way
 * and the facts behind them (the raw HAXSchema with what the element
 * declares), which scripts/haxschema-check.mjs validates
 */
function extractTag(repo, tag, start) {
  const odd = [];
  const chain = repo.chain(start);
  // attributes: own first, then ancestors; the observed name is lowercase
  const attributes = {};
  const fields = new Set();
  const docParts = [];
  const docProps = [];
  const docSlots = [];
  const events = [];
  const nodes = chain.map((l) =>
    repo.classNode(l.folder, l.module, l.decl.name),
  );
  const addAttr = (attr, prop) => {
    // Lit observes the lowercased name; underscore names are internal
    const name = String(attr || "").toLowerCase();
    if (!name || name.startsWith("_") || String(prop).startsWith("_")) return;
    if (!(name in attributes)) attributes[name] = prop;
  };
  const parsed = chain.map((link, i) =>
    nodes[i]
      ? spreadProperties(repo, link.folder, link.module, nodes[i].node)
      : { pairs: [], hidden: new Set() },
  );
  // the nearest class that declares a property decides whether it is observed
  const observed = new Map();
  for (const p of parsed) {
    for (const [, f] of p.pairs) if (!observed.has(f)) observed.set(f, true);
    for (const f of p.hidden) if (!observed.has(f)) observed.set(f, false);
  }
  chain.forEach((link, i) => {
    for (const a of link.decl.attributes || []) {
      const field = a.fieldName || a.name;
      if (observed.get(field) !== false) addAttr(a.name, field);
    }
    for (const [a, p] of parsed[i].pairs) addAttr(a, p);
    for (const m of link.decl.members || []) if (m.name) fields.add(m.name);
    for (const p of link.decl.cssParts || []) docParts.push(p.name);
    for (const p of link.decl.cssProperties || []) docProps.push(p.name);
    for (const s of link.decl.slots || [])
      docSlots.push(s.name ? s.name : "(default)");
    for (const e of link.decl.events || []) if (e.name) events.push(e.name);
  });
  for (const p of Object.values(attributes)) fields.add(p);

  // templates: the class body, or the nearest superclass that renders
  const own = nodes[0];
  const ts = repo.cem.ts;
  const renders = (n) =>
    n && n.node.members.some((m) => m.name && m.name.getText() === "render");
  let tpl = own;
  if (!renders(own)) {
    const sup = chain.findIndex(
      (l, i) => i > 0 && l.decl.kind === "class" && renders(nodes[i]),
    );
    if (sup > 0) tpl = nodes[sup];
  }
  const slots = [...docSlots];
  const parts = [...docParts];
  if (tpl) {
    const text = tpl.node.getText(tpl.sf);
    for (const m of text.matchAll(/<slot\b([^>]*)>/g)) {
      const nm = m[1].match(/\bname\s*=\s*["']([^"']*)["']/);
      if (!nm) slots.push("(default)");
      else if (!nm[1].includes("${")) slots.push(nm[1]);
    }
    for (const m of text.matchAll(/\bpart\s*=\s*["']([^"']*)["']/g)) {
      if (!m[1].includes("${")) parts.push(...m[1].split(/\s+/));
    }
  }
  if (own) {
    const text = own.node.getText(own.sf);
    for (const m of text.matchAll(
      /new\s+CustomEvent\(\s*["'`]([\w:.-]+)["'`]/g,
    ))
      events.push(m[1]);
  }

  // HAXSchema: own getter, an inherited getter, or a setHaxProperties call
  let hax = null;
  for (let i = 0; i < chain.length && !hax; i++) {
    if (nodes[i])
      hax = haxFromGetter(
        repo,
        chain[i].folder,
        chain[i].module,
        nodes[i].node,
        tag,
      );
  }
  if (!hax) hax = haxFromSetCall(repo, start.folder, tag);
  if (!hax) return { record: null, odd };
  if (hax.error) {
    odd.push(`${tag}: ${hax.error}; HAX settings not captured`);
    hax = { schema: {}, error: hax.error };
  }
  const schema = hax.schema && typeof hax.schema === "object" ? hax.schema : {};
  const gizmo =
    schema.gizmo && typeof schema.gizmo === "object" ? schema.gizmo : null;
  const { props, attrs, slots: haxSlots } = haxSettingNames(schema.settings);
  const handles = [];
  for (const h of (gizmo && Array.isArray(gizmo.handles) && gizmo.handles) ||
    []) {
    if (!h || typeof h.type !== "string") continue;
    for (const k of Object.keys(h)) {
      if (k !== "type" && typeof h[k] === "string")
        handles.push(`${h.type}:${k}=${h[k]}`);
    }
  }
  const demoTags = (Array.isArray(schema.demoSchema) ? schema.demoSchema : [])
    .map((d) => d && d.tag)
    .filter((t) => typeof t === "string");

  // oddities worth a person's look (reported, never fatal)
  for (const p of uniqSort(props)) {
    const top = p.split("[]")[0];
    if (
      !p.includes("[]") &&
      !fields.has(top) &&
      !(top.toLowerCase() in attributes) &&
      !DOM_PROPERTY.test(top)
    )
      odd.push(
        `${tag}: HAX setting property "${p}" is not a property of the element`,
      );
  }
  for (const a of uniqSort(attrs)) {
    if (
      !a.includes("[]") &&
      !(a.toLowerCase() in attributes) &&
      !GLOBAL_ATTRIBUTE.test(a)
    )
      odd.push(
        `${tag}: HAX setting attribute "${a}" is not an attribute of the element`,
      );
  }
  const slotSet = new Set(slots);
  for (const h of uniqSort(handles)) {
    const prop = h.split("=")[1];
    if (
      !fields.has(prop) &&
      !(prop.toLowerCase() in attributes) &&
      !slotSet.has(prop) &&
      !DOM_PROPERTY.test(prop) &&
      !GLOBAL_ATTRIBUTE.test(prop)
    )
      odd.push(
        `${tag}: gizmo handle ${h} names a property the element does not have`,
      );
  }
  if (!gizmo) odd.push(`${tag}: HAXSchema has no gizmo`);

  const sortedAttrs = {};
  for (const k of Object.keys(attributes).sort())
    sortedAttrs[k] = attributes[k];
  const record = {
    tag,
    package: start.decl && repo.pkg(start.folder).pkg.name,
    source: `elements/${start.folder}/${start.module}`,
    attributes: sortedAttrs,
    slots: uniqSort(slots),
    events: uniqSort(events).filter((e) => !IGNORED_EVENTS.has(e)),
    cssParts: uniqSort(parts),
    cssProperties: uniqSort(docProps),
    hax: {
      schema: hax.from || null,
      gizmo: Boolean(gizmo),
      properties: uniqSort(props),
      attributes: uniqSort(attrs),
      slots: uniqSort(haxSlots),
      demoTags: uniqSort(demoTags),
    },
  };
  // a subclass can render slots from methods its superclass's render()
  // calls, so the facts list slots from every class in the chain
  const chainSlots = [...slots];
  for (const n of nodes) {
    if (!n) continue;
    for (const m of n.node.getText(n.sf).matchAll(/<slot\b([^>]*)>/g)) {
      const nm = m[1].match(/\bname\s*=\s*["']([^"']*)["']/);
      if (!nm) chainSlots.push("(default)");
      else if (!nm[1].includes("${")) chainSlots.push(nm[1]);
    }
  }
  const facts = {
    schema: hax.schema,
    error: hax.error || null,
    from: hax.from || null,
    folder: start.folder,
    attributes: sortedAttrs,
    fields: [...fields].sort(),
    slots: uniqSort(chainSlots),
    // false when no render template was found to read slots from
    templateRead: Boolean(tpl),
  };
  return { record, odd, facts };
}

/**
 * Snapshot every authorable tag of a repo root.
 * Returns { records: {tag: record}, skipped: [{tag, why}], oddities: [],
 * facts: {tag: facts} }
 */
export function buildSnapshot(root, cem) {
  const repo = new Repo(root, cem);
  const registry =
    readJson(path.join(root, "hax-elements-registry.json")) || {};
  const tags = Object.keys(registry)
    .filter((t) => /^[a-z][a-z0-9]*-[a-z0-9-]*$/.test(t))
    .sort();
  const index = repo.tagIndex(tags);
  const records = {};
  const skipped = [];
  const oddities = [];
  const facts = {};
  for (const tag of tags) {
    const start = index.get(tag);
    if (!start) {
      skipped.push({ tag, why: "no class declares this tag" });
      continue;
    }
    const { record, odd, facts: f } = extractTag(repo, tag, start);
    oddities.push(...odd);
    if (f) facts[tag] = f;
    if (!record) {
      skipped.push({ tag, why: "no HAXSchema (haxProperties) on the class" });
      continue;
    }
    records[tag] = record;
  }
  return { records, skipped, oddities, facts };
}

// ------------------------------------------------------------------ diff

/** flat list of [kind, item] for one record */
function entries(rec) {
  const out = [];
  for (const [a, p] of Object.entries(rec.attributes || {}))
    out.push(["attributes", a, p]);
  for (const k of ["slots", "events", "cssParts", "cssProperties"])
    for (const v of rec[k] || []) out.push([k, v]);
  const hax = rec.hax || {};
  if (hax.gizmo) out.push(["hax.gizmo", "gizmo"]);
  for (const k of ["properties", "attributes", "slots", "demoTags"])
    for (const v of hax[k] || []) out.push([`hax.${k}`, v]);
  return out;
}

const LABEL = {
  attributes: "attribute",
  slots: "slot",
  events: "event",
  cssParts: "CSS part",
  cssProperties: "CSS custom property",
  "hax.gizmo": "HAX gizmo",
  "hax.properties": "HAX setting property",
  "hax.attributes": "HAX setting attribute",
  "hax.slots": "HAX setting slot",
  "hax.demoTags": "demoSchema tag",
};

/**
 * Compare a baseline snapshot with the current API.
 * removals: [{tag, kind, item, message}]; additions: [{tag, kind, item}]
 */
export function diffSnapshots(before, after) {
  const removals = [];
  const additions = [];
  for (const tag of Object.keys(before).sort()) {
    const old = before[tag];
    const cur = after[tag];
    if (!cur) {
      removals.push({
        tag,
        kind: "tag",
        item: tag,
        message: `<${tag}> is no longer an authorable HAX element (its class, tag or HAXSchema is gone)`,
      });
      continue;
    }
    const curEntries = entries(cur);
    const has = new Set(curEntries.map(([k, i]) => `${k}\u0000${i}`));
    for (const [kind, item, prop] of entries(old)) {
      if (kind === "attributes") {
        const now = cur.attributes[item];
        if (now === undefined) {
          const moved = Object.keys(cur.attributes).find(
            (a) => cur.attributes[a] === prop,
          );
          removals.push({
            tag,
            kind,
            item,
            message: moved
              ? `<${tag}> attribute "${item}" was renamed to "${moved}" (property ${prop})`
              : `<${tag}> attribute "${item}" (property ${prop}) was removed`,
          });
        } else if (now !== prop) {
          removals.push({
            tag,
            kind,
            item,
            message: `<${tag}> attribute "${item}" now sets property ${now} instead of ${prop}`,
          });
        }
        continue;
      }
      if (!has.has(`${kind}\u0000${item}`)) {
        const added = curEntries
          .filter(
            ([k, i]) =>
              k === kind &&
              !entries(old).some(([k2, i2]) => k2 === k && i2 === i),
          )
          .map(([, i]) => i);
        const hint = added.length === 1 ? ` (renamed to "${added[0]}"?)` : "";
        removals.push({
          tag,
          kind,
          item,
          message: `<${tag}> ${LABEL[kind]} "${item}" was removed${hint}`,
        });
      }
    }
  }
  for (const tag of Object.keys(after).sort()) {
    const old = before[tag];
    if (!old) {
      additions.push({ tag, kind: "tag", item: tag });
      continue;
    }
    const was = new Set(entries(old).map(([k, i]) => `${k}\u0000${i}`));
    for (const [kind, item] of entries(after[tag])) {
      if (!was.has(`${kind}\u0000${item}`)) additions.push({ tag, kind, item });
    }
  }
  return { removals, additions };
}

/** allowed-removals.json entries, validated */
export function loadAllowed(file) {
  const errors = [];
  if (!fs.existsSync(file)) return { allowed: [], errors };
  const data = readJson(file);
  const list = data && Array.isArray(data.removals) ? data.removals : null;
  if (!list)
    return {
      allowed: [],
      errors: [`${ALLOWED_FILE} must be {"removals": [...]}`],
    };
  const allowed = [];
  list.forEach((e, i) => {
    const where = `${ALLOWED_FILE} removals[${i}]`;
    if (!e || typeof e.tag !== "string")
      return errors.push(`${where}: "tag" is required`);
    const kind = e.kind || "tag";
    if (kind !== "tag" && !KINDS.includes(kind))
      return errors.push(
        `${where}: unknown kind "${kind}" (one of tag, ${KINDS.join(", ")})`,
      );
    if (kind !== "tag" && typeof e.item !== "string")
      return errors.push(`${where}: "item" is required for kind ${kind}`);
    if (typeof e.reason !== "string" || e.reason.trim().length < 10)
      return errors.push(
        `${where}: give a "reason" (why breaking authored content is acceptable)`,
      );
    allowed.push({
      tag: e.tag,
      kind,
      item: kind === "tag" ? e.tag : e.item,
      reason: e.reason,
    });
  });
  return { allowed, errors };
}

const isAllowed = (allowed, r) =>
  allowed.some(
    (a) =>
      a.tag === r.tag &&
      (a.kind === "tag" || (a.kind === r.kind && a.item === r.item)),
  );

/** read a snapshot directory (or a git tree) into {tag: record} */
export function readSnapshotDir(dir) {
  const out = {};
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir).sort()) {
    if (!f.endsWith(".json")) continue;
    const rec = readJson(path.join(dir, f));
    if (rec && rec.tag) out[rec.tag] = rec;
  }
  return out;
}

const GIT_REF = /^[A-Za-z0-9][A-Za-z0-9._/^~-]{0,200}$/;

function readSnapshotAtRef(root, ref) {
  if (!GIT_REF.test(ref)) throw new Error(`not a git ref: ${ref}`);
  const git = (args) =>
    execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
  let names = [];
  try {
    names = git(["ls-tree", "--name-only", `${ref}:${SNAPSHOT_DIR}`])
      .split("\n")
      .filter((n) => n.endsWith(".json"));
  } catch {
    return null; // the base has no snapshot yet
  }
  const out = {};
  for (const n of names) {
    try {
      const rec = JSON.parse(git(["show", `${ref}:${SNAPSHOT_DIR}/${n}`]));
      if (rec && rec.tag) out[rec.tag] = rec;
    } catch {
      // unreadable entry: ignore, the head comparison still runs
    }
  }
  return out;
}

/**
 * The gate. Pure apart from its inputs so tests can drive it.
 * baselines: [{label, snapshot}] (committed snapshot, base branch snapshot)
 * Returns { ok, errors, warnings, notes }
 */
export function evaluate({
  current,
  committed,
  baselines,
  allowed,
  allowedErrors,
}) {
  const errors = [...(allowedErrors || [])];
  const warnings = [];
  const notes = [];
  const seen = new Set();
  const used = new Set();
  for (const { label, snapshot } of baselines) {
    for (const r of diffSnapshots(snapshot, current).removals) {
      const key = `${r.tag}\u0000${r.kind}\u0000${r.item}`;
      if (seen.has(key)) continue;
      seen.add(key);
      if (isAllowed(allowed, r)) {
        used.add(`${r.tag}\u0000${r.kind}\u0000${r.item}`);
        notes.push(`allowed by ${ALLOWED_FILE}: ${r.message}`);
        continue;
      }
      errors.push(
        `${r.message} (in ${label}).\n` +
          `    Content already authored with it would stop working. Restore it (when renaming, keep the old name working too),\n` +
          `    or, if this break is intended, add {"tag": "${r.tag}", "kind": "${r.kind}", ${
            r.kind === "tag" ? "" : `"item": "${r.item}", `
          }"reason": "..."} to ${ALLOWED_FILE} and run yarn api:snapshot.`,
      );
    }
  }
  // the committed snapshot must not keep listing what is gone, or the next PR inherits it
  const stale = diffSnapshots(committed, current).removals.filter((r) =>
    isAllowed(allowed, r),
  );
  for (const r of stale) {
    errors.push(
      `${r.message}, but ${SNAPSHOT_DIR}/${r.tag}.json still lists it: run yarn api:snapshot and commit the result.`,
    );
  }
  const { additions } = diffSnapshots(committed, current);
  if (additions.length) {
    const byTag = {};
    for (const a of additions)
      (byTag[a.tag] = byTag[a.tag] || []).push(
        a.kind === "tag" ? "new tag" : `${LABEL[a.kind]} "${a.item}"`,
      );
    for (const tag of Object.keys(byTag))
      warnings.push(
        `<${tag}> gained ${byTag[tag].join(", ")}: run yarn api:snapshot and commit ${SNAPSHOT_DIR}/${tag}.json so it is protected too.`,
      );
  }
  // same API, other details (source file, schema path) moved
  for (const tag of Object.keys(current).sort()) {
    if (
      committed[tag] &&
      !additions.some((a) => a.tag === tag) &&
      JSON.stringify(committed[tag]) !== JSON.stringify(current[tag])
    )
      warnings.push(
        `${SNAPSHOT_DIR}/${tag}.json is out of date (source or schema path): run yarn api:snapshot.`,
      );
  }
  for (const a of allowed) {
    const key = `${a.tag}\u0000${a.kind}\u0000${a.item}`;
    const anyUse = [...used].some(
      (u) => u === key || (a.kind === "tag" && u.startsWith(`${a.tag}\u0000`)),
    );
    if (!anyUse)
      notes.push(
        `${ALLOWED_FILE}: entry for ${a.tag} ${a.kind} "${a.item}" matched nothing and can be removed once its PR has merged.`,
      );
  }
  return { ok: errors.length === 0, errors, warnings, notes };
}

// ------------------------------------------------------------------- cli

function writeSnapshot(root, records) {
  const dir = path.join(root, SNAPSHOT_DIR);
  fs.mkdirSync(dir, { recursive: true });
  const keep = new Set();
  for (const tag of Object.keys(records).sort()) {
    const f = `${tag}.json`;
    keep.add(f);
    fs.writeFileSync(
      path.join(dir, f),
      JSON.stringify(records[tag], null, 2) + "\n",
    );
  }
  for (const f of fs.readdirSync(dir)) {
    if (f.endsWith(".json") && !keep.has(f)) fs.unlinkSync(path.join(dir, f));
  }
}

function annotate(level, title, msg) {
  if (process.env.GITHUB_ACTIONS === "true") {
    const flat = msg
      .replace(/%/g, "%25")
      .replace(/\r/g, "")
      .replace(/\n/g, "%0A");
    console.log(`::${level} title=${title}::${flat}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const mode = args.includes("--write")
    ? "write"
    : args.includes("--report")
      ? "report"
      : "check";
  const flag = (name) => {
    const i = args.indexOf(name);
    return i !== -1 && args[i + 1] && !args[i + 1].startsWith("--")
      ? args[i + 1]
      : "";
  };
  const base = flag("--base");
  const baseDir = flag("--base-dir");
  const cem = await loadAnalyzer();
  if (!cem) {
    console.error(
      "api-snapshot: @custom-elements-manifest/analyzer is not installed. Run yarn install, or set CEM_ANALYZER_DIR to a folder whose node_modules holds it.",
    );
    process.exit(2);
  }
  const t0 = Date.now();
  const { records, skipped, oddities } = buildSnapshot(ROOT, cem);
  const count = Object.keys(records).length;
  const secs = ((Date.now() - t0) / 1000).toFixed(1);

  if (mode === "write") {
    writeSnapshot(ROOT, records);
    console.log(
      `api-snapshot: wrote ${count} authorable tags to ${SNAPSHOT_DIR}/ (${secs}s, analyzer ${cem.version})`,
    );
    return;
  }
  if (mode === "report") {
    console.log(
      `${count} authorable tags snapshotted; ${skipped.length} registry tags skipped:`,
    );
    for (const s of skipped) console.log(`  skipped ${s.tag}: ${s.why}`);
    console.log(`${oddities.length} oddities:`);
    for (const o of oddities) console.log(`  ${o}`);
    return;
  }

  const committed = readSnapshotDir(path.join(ROOT, SNAPSHOT_DIR));
  const baselines = [{ label: `${SNAPSHOT_DIR}/`, snapshot: committed }];
  if (baseDir) {
    const dir = path.resolve(baseDir);
    if (fs.existsSync(dir))
      baselines.push({
        label: "the base branch snapshot",
        snapshot: readSnapshotDir(dir),
      });
    else
      console.log(
        `api-snapshot: no base snapshot at ${baseDir}; comparing with the committed snapshot only.`,
      );
  } else if (base) {
    const atBase = readSnapshotAtRef(ROOT, base);
    if (atBase)
      baselines.push({
        label: `the ${SNAPSHOT_DIR}/ of ${base}`,
        snapshot: atBase,
      });
    else
      console.log(
        `api-snapshot: ${base} has no ${SNAPSHOT_DIR}/ yet; comparing with the committed snapshot only.`,
      );
  }
  const { allowed, errors: allowedErrors } = loadAllowed(
    path.join(ROOT, ALLOWED_FILE),
  );
  const res = evaluate({
    current: records,
    committed,
    baselines,
    allowed,
    allowedErrors,
  });
  console.log(
    `api-snapshot: checked ${count} authorable HAX tags in ${secs}s${base || baseDir ? ` (base: ${baseDir || base})` : ""}.`,
  );
  for (const n of res.notes) console.log(`note: ${n}`);
  for (const w of res.warnings) {
    console.log(`warning: ${w}`);
    annotate("warning", "HAX API snapshot out of date", w);
  }
  for (const e of res.errors) {
    console.error(`error: ${e}`);
    annotate("error", "HAX element API removed", e);
  }
  if (process.env.GITHUB_STEP_SUMMARY) {
    const lines = ["## HAX element API snapshot", ""];
    lines.push(
      res.ok
        ? `No removals across ${count} authorable tags.`
        : `**${res.errors.length} breaking change(s).**`,
    );
    for (const e of res.errors) lines.push(`- ${e.split("\n")[0]}`);
    for (const w of res.warnings) lines.push(`- (warning) ${w}`);
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join("\n") + "\n");
  }
  if (!res.ok) {
    console.error(
      `\napi-snapshot: ${res.errors.length} breaking change(s) to authored-content API. See docs: CONTRIBUTING.md#hax-element-api-snapshot`,
    );
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
