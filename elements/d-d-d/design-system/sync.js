#!/usr/bin/env node
/**
 * DDD design system sync
 *
 * Rebuilds the files of the DDD Design System artifact (the claude.ai design
 * system that renders every DDD-based element live) from this repo, so it
 * never drifts from what ships. One command:
 *
 *   yarn install                                   # once, for node_modules
 *   node elements/d-d-d/design-system/sync.js      # -> elements/d-d-d/design-system/dist/
 *
 * Options:
 *   --out <dir>            output folder (default elements/d-d-d/design-system/dist)
 *   --node-modules <dir>   where @haxtheweb/* resolve from (default <repo>/node_modules)
 *   --skip-bundle          only refresh tokens, icons, docs and cards
 *
 * What it does:
 *   1. DTCG tokens   -> elements/d-d-d/tokens/*.json (build-tokens.js)
 *   2. tokens.json   -> source/tokens.json with every value re-read from DDDStyles.js
 *                       and SimpleColors (usage notes and structure are kept)
 *   3. cards, docs   -> copied from source/ (hand-authored previews and READMEs)
 *   4. icons         -> runtime/icons/*.json from elements/<x>/lib/svgs/<set>/*.svg
 *   5. theme sites   -> runtime/sites/<theme>/ from elements/<theme>/demo/ + source overrides
 *   6. runtime/nm    -> files the bundle fetches via import.meta.url
 *   7. bundles       -> components/bundle.js and components/lib/*.js (esbuild, or Bun.build under bun)
 *   8. checks        -> the artifact's limits (sizes, names, file count)
 *
 * Then publish dist/ as the design system (ask Claude: "publish
 * elements/d-d-d/design-system/dist as the DDD design system").
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import buildTokens from "./build-tokens.js";
import {
  REPO,
  dddVariables,
  dddVersion,
  simpleColors,
  splitLightDark,
} from "./lib/source.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(HERE, "source");
const argv = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = argv.indexOf(name);
  return i > -1 ? path.resolve(argv[i + 1]) : dflt;
};
const OUT = opt("--out", path.join(HERE, "dist"));
const NM = opt("--node-modules", path.join(REPO, "node_modules"));
const SKIP_BUNDLE = argv.includes("--skip-bundle");

const LIMITS = {
  bundle: 6 * 1024 * 1024,
  library: 2 * 1024 * 1024,
  file: 512 * 1024,
  files: 511,
  colors: 600,
};
const warnings = [];
const warn = (m) => warnings.push(m);
const log = (m) => console.log(m);

function copyDir(from, to, filter = () => true) {
  if (!fs.existsSync(from)) return;
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, e.name);
    const b = path.join(to, e.name);
    if (!filter(a)) continue;
    if (e.isDirectory()) copyDir(a, b, filter);
    else {
      fs.mkdirSync(to, { recursive: true });
      fs.copyFileSync(a, b);
    }
  }
}
const writeJson = (file, data, indent = 1) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, indent) + "\n");
};

// ------------------------------------------------------------ 1. DTCG --

function stepDtcg() {
  const { files, stats } = buildTokens();
  const dir = path.join(REPO, "elements", "d-d-d", "tokens");
  for (const [name, data] of Object.entries(files)) {
    writeJson(path.join(dir, name), data, 2);
  }
  log(`1. DTCG: ${stats.light} tokens, ${stats.dark} dark overrides -> elements/d-d-d/tokens/`);
}

// ------------------------------------------------------- 2. tokens.json --

function stepTokens() {
  const tokens = JSON.parse(fs.readFileSync(path.join(SRC, "tokens.json"), "utf8"));
  const vars = dddVariables();
  const byName = new Map(vars.map((v) => [v.name, v]));
  const resolve = (value, seen = new Set()) => {
    const m = /^var\(--([\w-]+)(?:,.*)?\)$/.exec(value);
    if (!m || seen.has(m[1]) || !byName.has(m[1])) return value;
    seen.add(m[1]);
    return resolve(byName.get(m[1]).value, seen);
  };
  const aliasOf = (value) => {
    const m = /^var\(--([\w-]+)\)$/.exec(value);
    return m ? `{${m[1]}}` : null;
  };
  const sc = simpleColors();
  const scValue = new Map();
  for (const h of sc.hues) {
    sc.shades[h].forEach((hex, i) => {
      const n = i + 1;
      scValue.set(`simple-colors-fixed-theme-${h}-${n}`, hex);
      const inverse = sc.shades[h][12 - n];
      const dark = sc.dark[h][i];
      scValue.set(`simple-colors-default-theme-${h}-${n}`, {
        light: `{simple-colors-fixed-theme-${h}-${n}}`,
        dark: dark === inverse ? `{simple-colors-fixed-theme-${h}-${13 - n}}` : dark,
      });
    });
  }

  const seen = new Set();
  let changed = 0;
  const removed = [];
  for (const [family, data] of Object.entries(tokens)) {
    if (!data || !Array.isArray(data.tokens)) continue;
    data.tokens = data.tokens.filter((t) => {
      let next;
      if (scValue.has(t.name)) next = scValue.get(t.name);
      else if (byName.has(t.name)) {
        const raw = byName.get(t.name).value;
        const ld = splitLightDark(raw);
        if (ld) next = { light: ld.light, dark: ld.dark };
        else if (family === "color") next = aliasOf(raw) || raw;
        else next = raw;
      } else if (/^(ddd-(?!scheme-)|simple-colors-fixed|simple-colors-default-theme-(?!accent))/.test(t.name)) {
        removed.push(t.name);
        return false;
      } else return true; // synthetic: ddd-scheme-* pairs, accent-color shades
      seen.add(t.name);
      if (JSON.stringify(next) !== JSON.stringify(t.value)) {
        t.value = next;
        changed++;
      }
      return true;
    });
  }
  // typography styles read their sizes from the scale
  const size = (n) => resolve(`var(--${n})`);
  for (const g of (tokens.type && tokens.type.groups) || []) {
    for (const s of g.styles) {
      let n = null;
      if (/^fs-/.test(s.name)) n = "ddd-font-size-" + s.name.slice(3);
      else if (/^h[1-6]$/.test(s.name)) n = `ddd-theme-${s.name}-font-size`;
      if (n && byName.has(n) && /px$/.test(size(n)) && s.fontSize !== size(n)) {
        s.fontSize = size(n);
        changed++;
      }
    }
  }
  if (tokens.type && tokens.type.families) {
    for (const f of ["primary", "secondary", "navigation"]) {
      const v = byName.get(`ddd-font-${f}`);
      if (v && tokens.type.families[f] !== v.value) {
        tokens.type.families[f] = v.value;
        changed++;
      }
    }
  }
  const missing = [...byName.keys()].filter(
    (n) =>
      !seen.has(n) &&
      /^ddd-/.test(n) &&
      // these are documented by the type block (families, scale, h1-h6)
      !/^ddd-(theme-(h\d|body)-font-size|font-size-|font-(primary|secondary|navigation)$)/.test(n),
  );
  for (const h of sc.hues) {
    for (let i = 1; i <= 12; i++) {
      for (const k of [`simple-colors-fixed-theme-${h}-${i}`, `simple-colors-default-theme-${h}-${i}`]) {
        if (!seen.has(k)) missing.push(k);
      }
    }
  }
  if (missing.length) {
    warn(
      `tokens.json has no entry for ${missing.length} source tokens; add them (with a usage note) to source/tokens.json: ${missing.slice(0, 20).join(", ")}${missing.length > 20 ? " ..." : ""}`,
    );
  }
  if (removed.length) warn(`dropped tokens no longer in source: ${removed.join(", ")}`);
  if (tokens.meta) tokens.meta.synced = new Date().toISOString().slice(0, 10);
  const colors = tokens.color.tokens.length;
  if (colors > LIMITS.colors) warn(`${colors} colors exceeds the artifact limit of ${LIMITS.colors}`);
  writeJson(path.join(OUT, "tokens.json"), tokens);
  log(`2. tokens.json: ${changed} values updated from source, ${colors} colors`);
}

// ------------------------------------------------- 3. cards, docs, data --

function stepCopy() {
  for (const f of fs.readdirSync(SRC)) {
    if (["tokens.json", "bundle", "runtime", "components"].includes(f)) continue;
    const a = path.join(SRC, f);
    if (fs.statSync(a).isFile()) fs.copyFileSync(a, path.join(OUT, f));
    else copyDir(a, path.join(OUT, f));
  }
  copyDir(path.join(SRC, "components"), path.join(OUT, "components"));
  copyDir(path.join(SRC, "runtime", "data"), path.join(OUT, "runtime", "data"));
  copyDir(path.join(SRC, "runtime", "media"), path.join(OUT, "runtime", "media"));
  const cards = fs
    .readdirSync(path.join(OUT, "components"), { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== "lib")
    .map((e) => e.name);
  // the bundle header lists the cards in display order
  const header = JSON.parse(fs.readFileSync(path.join(SRC, "bundle", "header.json"), "utf8"));
  const listed = new Set(header.components.map((c) => c.name));
  const unlisted = cards.filter((c) => !listed.has(c));
  const orphan = [...listed].filter((c) => !cards.includes(c));
  if (unlisted.length) warn(`cards not in source/bundle/header.json (they will sort last): ${unlisted.join(", ")}`);
  if (orphan.length) warn(`header.json lists cards with no folder: ${orphan.join(", ")}`);
  log(`3. copied ${cards.length} cards, docs, data and media`);
}

// ------------------------------------------------------------- 4. icons --

function stepIcons() {
  const sets = {};
  const elements = path.join(REPO, "elements");
  for (const el of fs.readdirSync(elements)) {
    const dir = path.join(elements, el, "lib", "svgs");
    if (!fs.existsSync(dir)) continue;
    for (const set of fs.readdirSync(dir)) {
      const sdir = path.join(dir, set);
      let isDir = false;
      try {
        isDir = fs.statSync(sdir).isDirectory();
      } catch (e) {
        // dangling symlink (e.g. a set that lives in another repo)
      }
      if (!isDir) continue;
      for (const f of fs.readdirSync(sdir).sort()) {
        if (!f.endsWith(".svg")) continue;
        const svg = fs.readFileSync(path.join(sdir, f));
        sets[set] = sets[set] || {};
        sets[set][f.slice(0, -4)] = "data:image/svg+xml;base64," + svg.toString("base64");
      }
    }
  }
  // split into parts under the per-file limit; a set may span parts
  const budget = LIMITS.file - 40 * 1024;
  const parts = [{}];
  let used = 0;
  for (const [set, icons] of Object.entries(sets)) {
    for (const [name, uri] of Object.entries(icons)) {
      const cost = name.length + uri.length + 8;
      if (used + cost > budget) {
        parts.push({});
        used = 0;
      }
      const part = parts[parts.length - 1];
      (part[set] = part[set] || {})[name] = uri;
      used += cost;
    }
  }
  const dir = path.join(OUT, "runtime", "icons");
  fs.rmSync(dir, { recursive: true, force: true });
  const files = parts.map((p, i) => {
    const f = `icons-${String(i).padStart(2, "0")}.json`;
    writeJson(path.join(dir, f), p, 0);
    return f;
  });
  const counts = Object.fromEntries(Object.entries(sets).map(([k, v]) => [k, Object.keys(v).length]));
  writeJson(path.join(dir, "index.json"), { files, sets: counts });
  log(`4. icons: ${Object.values(counts).reduce((a, b) => a + b, 0)} in ${Object.keys(sets).length} sets, ${files.length} files`);
}

// ------------------------------------------------------- 5. theme sites --

function stepSites() {
  const manifest = JSON.parse(fs.readFileSync(path.join(SRC, "runtime", "sites.json"), "utf8"));
  let n = 0;
  for (const [theme, files] of Object.entries(manifest.sites)) {
    const demo = path.join(REPO, "elements", theme, "demo");
    for (const rel of files) {
      const a = path.join(demo, rel);
      if (!fs.existsSync(a)) {
        warn(`theme site file missing: elements/${theme}/demo/${rel}`);
        continue;
      }
      const b = path.join(OUT, "runtime", "sites", theme, rel);
      fs.mkdirSync(path.dirname(b), { recursive: true });
      fs.copyFileSync(a, b);
      n++;
    }
  }
  copyDir(path.join(SRC, "runtime", "sites"), path.join(OUT, "runtime", "sites"));
  log(`5. theme sites: ${Object.keys(manifest.sites).length} themes, ${n} demo files + overrides`);
}

// --------------------------------------------------------- 6. runtime/nm --

function stepNm() {
  const { files } = JSON.parse(fs.readFileSync(path.join(SRC, "runtime", "nm.json"), "utf8"));
  let n = 0;
  for (const rel of files) {
    const a = path.join(NM, rel);
    if (!fs.existsSync(a)) {
      warn(`runtime file missing from node_modules: ${rel}`);
      continue;
    }
    const b = path.join(OUT, "runtime", "nm", rel);
    fs.mkdirSync(path.dirname(b), { recursive: true });
    fs.copyFileSync(a, b);
    n++;
  }
  log(`6. runtime/nm: ${n} files`);
}

// ----------------------------------------------------------- 7. bundles --

function runtimeLine(global) {
  return (
    `globalThis.${global}=globalThis.${global}||{};` +
    'if(globalThis.document&&!globalThis.DDD_RUNTIME_BASE){globalThis.DDD_RUNTIME_BASE=new URL("../../runtime/",globalThis.document.baseURI).href;}'
  );
}
// a classic <script> that tolerates being inlined into HTML and a page without a charset
function wrap(code, global) {
  code = code.replace(/<\/(script)/gi, "<\\/$1").replaceAll("<!--", "\\x3C!--");
  const out =
    runtimeLine(global) +
    '\n(function dddRun(){var d=globalThis.document;if(d&&!d.body){d.addEventListener("DOMContentLoaded",dddRun,{once:true});return;}\n' +
    code +
    "\n})();\n";
  let ascii = "";
  for (const ch of out) {
    const o = ch.codePointAt(0);
    if (o < 128) ascii += ch;
    else if (o <= 0xffff) ascii += "\\u" + o.toString(16).padStart(4, "0");
    else {
      const v = o - 0x10000;
      ascii +=
        "\\u" + (0xd800 + (v >> 10)).toString(16) + "\\u" + (0xdc00 + (v & 0x3ff)).toString(16);
    }
  }
  return ascii;
}

// import.meta.url -> runtime/nm/<path under node_modules>, other import.meta -> {}
function rewriteImportMeta(file, text) {
  const i = file.lastIndexOf(`${path.sep}node_modules${path.sep}`);
  const rel = i > -1 ? file.slice(i + 14).split(path.sep).join("/") : file.split(path.sep).slice(-3).join("/");
  return text
    .replaceAll(
      "import.meta.url",
      `((globalThis.DDD_RUNTIME_BASE||"https://ddd-runtime.invalid/")+${JSON.stringify("nm/" + rel)})`,
    )
    .replace(/\bimport\.meta\b/g, "({})");
}

async function bundleOne(entryCode, label) {
  const tmp = path.join(OUT, `.${label}.entry.js`);
  fs.writeFileSync(tmp, entryCode);
  try {
    if (globalThis.Bun) {
      const r = await globalThis.Bun.build({
        entrypoints: [tmp],
        format: "iife",
        minify: true,
        target: "browser",
        define: { "process.env.NODE_ENV": '"production"' },
        plugins: [
          {
            name: "import-meta",
            setup(b) {
              b.onLoad({ filter: /\.m?js$/ }, async (a) => ({
                contents: rewriteImportMeta(a.path, await globalThis.Bun.file(a.path).text()),
                loader: "js",
              }));
            },
          },
        ],
      });
      if (!r.success) throw new Error(r.logs.map(String).join("\n"));
      return await r.outputs[0].text();
    }
    let esbuild;
    try {
      esbuild = await import("esbuild");
    } catch (e) {
      throw new Error("esbuild not found: run yarn install at the repo root (or run this script with bun)");
    }
    const r = await esbuild.build({
      entryPoints: [tmp],
      bundle: true,
      format: "iife",
      minify: true,
      platform: "browser",
      write: false,
      preserveSymlinks: true,
      nodePaths: [NM],
      logLevel: "error",
      define: { "process.env.NODE_ENV": '"production"' },
      plugins: [
        {
          name: "import-meta",
          setup(b) {
            b.onLoad({ filter: /\.m?js$/ }, async (a) => ({
              contents: rewriteImportMeta(a.path, await fs.promises.readFile(a.path, "utf8")),
              loader: "js",
            }));
          },
        },
      ],
    });
    return r.outputFiles[0].text;
  } finally {
    fs.rmSync(tmp, { force: true });
  }
}

async function stepBundles() {
  const B = path.join(SRC, "bundle");
  const entries = JSON.parse(fs.readFileSync(path.join(B, "entries.json"), "utf8"));
  const header = fs.readFileSync(path.join(B, "header.json"), "utf8").trim();
  const prelude = JSON.stringify(path.join(B, "prelude.js"));
  const postlude = JSON.stringify(path.join(B, "postlude.js"));
  // bare specifiers resolve from NM; absolute paths keep them out of node resolution
  const imp = (m) => `import ${JSON.stringify(path.join(NM, m))};\n`;
  const version = dddVersion();
  const out = {
    main: { file: "components/bundle.js", limit: LIMITS.bundle },
    sheet: { file: "components/lib/ddd-sheet-music.js", limit: LIMITS.library },
    slide: { file: "components/lib/ddd-slide-deck.js", limit: LIMITS.library },
  };
  for (const [key, spec] of Object.entries(entries)) {
    if (key.startsWith("$")) continue;
    let code = `import ${prelude};\n` + spec.modules.map(imp).join("");
    if (key === "main") {
      code += `import ${postlude};\nglobalThis.DDD = Object.assign(globalThis.DDD || {}, { version: ${JSON.stringify(version)} });\n`;
    } else {
      code += `globalThis.${spec.global} = true;\n`;
    }
    const built = await bundleOne(code, key);
    let text = wrap(built, spec.global);
    if (key === "main") text = `/* @ds-bundle: ${header} */\n` + text;
    const file = path.join(OUT, out[key].file);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, text);
    const size = Buffer.byteLength(text);
    if (size > out[key].limit) warn(`${out[key].file} is ${size} bytes, over the ${out[key].limit} limit`);
    if (/import\.meta/.test(text)) warn(`${out[key].file} still contains import.meta`);
    log(`7. ${out[key].file}: ${(size / 1024 / 1024).toFixed(2)} MB`);
  }
}

// ------------------------------------------------------------ 8. checks --

function stepChecks() {
  const all = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else all.push(path.relative(OUT, p).split(path.sep).join("/"));
    }
  };
  walk(OUT);
  const big = new Set(["components/bundle.js", "components/lib/ddd-sheet-music.js", "components/lib/ddd-slide-deck.js"]);
  for (const f of all) {
    const size = fs.statSync(path.join(OUT, f)).size;
    if (!big.has(f) && size > LIMITS.file) warn(`${f} is ${size} bytes, over the ${LIMITS.file} per-file limit`);
    if (f.split("/").includes("node_modules")) warn(`${f}: node_modules path segments are refused`);
    if (/\.(pptx|docx|xlsx|zip)$/i.test(f)) warn(`${f}: this file type is not served by artifacts`);
    if (/\.xml$/i.test(f) && /<!DOCTYPE/i.test(fs.readFileSync(path.join(OUT, f), "utf8"))) warn(`${f}: XML must not contain a DOCTYPE`);
  }
  for (const d of fs.readdirSync(path.join(OUT, "components"))) {
    if (d !== "lib" && fs.statSync(path.join(OUT, "components", d)).isDirectory() && !/^[A-Za-z_$][A-Za-z0-9_$]{0,63}$/.test(d)) {
      warn(`components/${d}: not a valid component name`);
    }
  }
  if (all.length > LIMITS.files) warn(`${all.length} files, over the ${LIMITS.files} per-version limit`);
  log(`8. ${all.length} files checked`);
}

// ---------------------------------------------------------------- main --

async function main() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  stepDtcg();
  stepTokens();
  stepCopy();
  stepIcons();
  stepSites();
  stepNm();
  if (SKIP_BUNDLE) log("7. bundles skipped (--skip-bundle)");
  else await stepBundles();
  stepChecks();
  if (warnings.length) {
    console.log(`\n${warnings.length} warning(s):`);
    for (const w of warnings) console.log(`  - ${w}`);
  }
  console.log(`\nDone: ${path.relative(process.cwd(), OUT) || OUT}. Publish it as the DDD design system (publish design-system.json last).`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
