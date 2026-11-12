#!/usr/bin/env node
/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
/**
 * DDD design system bridge generator.
 *
 * Makes a third-party design system (PatternFly, Carbon, Spectrum, ...)
 * "DDD capable": its tokens are re-expressed as CSS custom properties under
 * their own upstream names, and every DDD token a HAX element reads is
 * pointed at the closest upstream token. Because HAX elements only read
 * --ddd-* variables, remapping them is enough for the whole block ecosystem
 * to take on the other system's look, and authored content stays portable:
 * the same page renders in DDD in any other theme.
 *
 * Input: <theme>/design-system/bridge.json (see README.md in this folder).
 * The upstream package is fetched with `npm pack` at the pinned version, so
 * nothing from the upstream system is added to the monorepo's dependencies.
 *
 * Output (in <theme>/lib/):
 *   <Prefix>Tokens.js        upstream tokens as CSS (light-dark() pairs)
 *   <Prefix>DDDMap.js        --ddd-* → upstream token remap as CSS
 *   <system>.ddd-map.json    machine-readable map + coverage + contrast report
 *
 * Usage:
 *   node elements/d-d-d/design-system/bridge/build-bridge.js <theme-dir> [--upstream <dir>] [--check]
 *     --upstream  an already-extracted upstream package (skips npm pack)
 *     --check     exit 1 if the committed outputs are out of date
 */
import fs from "fs";
import os from "os";
import path from "path";
import { execFileSync } from "child_process";
import prettier from "prettier";
import { dddVariables, contrast, hexToRgb } from "../lib/source.js";

const args = process.argv.slice(2);
const themeDir = path.resolve(args.find((a) => !a.startsWith("--")) || "");
const flag = (name) => args.includes(name);
const option = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? null : args[i + 1];
};

if (!fs.existsSync(path.join(themeDir, "design-system", "bridge.json"))) {
  console.error(
    "usage: build-bridge.js <theme-dir> [--upstream <dir>] [--check]\n" +
      "  <theme-dir> must contain design-system/bridge.json",
  );
  process.exit(2);
}

const config = JSON.parse(
  fs.readFileSync(path.join(themeDir, "design-system", "bridge.json"), "utf8"),
);

// licenses that can ship inside an Apache-2.0 project; anything else stops
// the build so an incompatible system never lands in the monorepo
const SHIPPABLE = ["MIT", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "ISC"];
const SHIPPABLE_FONTS = ["OFL-1.1", "Apache-2.0", "MIT"];
if (!SHIPPABLE.includes(config.upstream.license)) {
  console.error(
    `License ${config.upstream.license} for ${config.upstream.package} is not on the shippable list (${SHIPPABLE.join(", ")}).`,
  );
  process.exit(1);
}
(config.fonts || []).forEach((font) => {
  if (!SHIPPABLE_FONTS.includes(font.license)) {
    console.error(`Font ${font.family} is ${font.license}, which can't ship.`);
    process.exit(1);
  }
});

/* ---------------------------------------------------------------- upstream */

function fetchUpstream() {
  const given = option("--upstream");
  if (given) return path.resolve(given);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ddd-bridge-"));
  const spec = `${config.upstream.package}@${config.upstream.version}`;
  const tgz = execFileSync(
    "npm",
    ["pack", spec, "--pack-destination", tmp, "--silent"],
    {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    },
  )
    .trim()
    .split("\n")
    .pop();
  execFileSync("tar", ["xzf", path.join(tmp, tgz), "-C", tmp]);
  const pkg = JSON.parse(
    fs.readFileSync(path.join(tmp, "package", "package.json"), "utf8"),
  );
  if (pkg.license !== config.upstream.license) {
    console.error(
      `bridge.json says ${config.upstream.license} but ${spec} declares ${pkg.license}.`,
    );
    process.exit(1);
  }
  return path.join(tmp, "package");
}

/** custom property declarations per selector, in source order */
function parseBlocks(cssText) {
  const text = cssText.replace(/\/\*[\s\S]*?\*\//g, "");
  const blocks = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(text))) {
    const selector = m[1].replace(/\s+/g, " ").trim();
    const decls = {};
    // values can hold ; only inside strings, which custom properties here don't
    m[2].split(";").forEach((decl) => {
      const i = decl.indexOf(":");
      if (i === -1) return;
      const name = decl.slice(0, i).trim();
      if (!name.startsWith("--")) return;
      decls[name] = decl
        .slice(i + 1)
        .replace(/\s+/g, " ")
        .trim();
    });
    blocks.push({ selector, decls });
  }
  return blocks;
}

function scopeEnv(blocks, selectors) {
  const env = {};
  selectors.forEach((sel) => {
    blocks
      .filter((b) => b.selector === sel)
      .forEach((b) => Object.assign(env, b.decls));
  });
  return env;
}

/** replace every var() in value with its resolved value from env */
function resolve(value, env, seen = []) {
  let out = "";
  let i = 0;
  while (i < value.length) {
    const start = value.indexOf("var(", i);
    if (start === -1) {
      out += value.slice(i);
      break;
    }
    out += value.slice(i, start);
    let depth = 0;
    let end = -1;
    let comma = -1;
    for (let j = start + 4; j < value.length; j++) {
      const c = value[j];
      if (c === "(") depth++;
      else if (c === ")") {
        if (depth === 0) {
          end = j;
          break;
        }
        depth--;
      } else if (c === "," && depth === 0 && comma === -1) comma = j;
    }
    if (end === -1) throw new Error(`unbalanced var() in ${value}`);
    const name = value.slice(start + 4, comma === -1 ? end : comma).trim();
    const fallback = comma === -1 ? null : value.slice(comma + 1, end).trim();
    if (seen.includes(name)) throw new Error(`cycle: ${seen.join(" → ")}`);
    if (env[name] !== undefined) {
      out += resolve(env[name], env, [...seen, name]);
    } else if (fallback !== null) {
      out += resolve(fallback, env, seen);
    } else {
      throw new Error(`unresolved ${name} (from ${seen.join(" → ") || "map"})`);
    }
    i = end + 1;
  }
  return out.replace(/\s+/g, " ").trim();
}

/* -------------------------------------------------------------------- build */

const upstreamDir = fetchUpstream();
const blocks = parseBlocks(
  fs.readFileSync(path.join(upstreamDir, config.upstream.file), "utf8"),
);
const light = scopeEnv(blocks, config.scopes.light);
const dark = scopeEnv(blocks, config.scopes.dark);

const ddd = dddVariables();
const dddByName = Object.fromEntries(ddd.map((v) => ["--" + v.name, v]));

// every upstream token the map or the theme points at
const map = config.ddd;
const exported = new Set(config.extraTokens || []);
Object.values(map).forEach((entry) => {
  const target = typeof entry === "string" ? entry : entry.token;
  if (target && target.startsWith("--")) exported.add(target);
  // literal values may embed upstream tokens: var(--pf-...)
  const literal = typeof entry === "string" ? "" : entry.value || "";
  (literal.match(/var\((--[\w-]+)/g) || []).forEach((ref) =>
    exported.add(ref.slice(4)),
  );
});

const problems = [];
const tokens = [...exported].sort().map((name) => {
  if (light[name] === undefined) {
    problems.push(`${name} is not defined upstream`);
    return { name, light: "", dark: "" };
  }
  return {
    name,
    light: resolve(light[name], light),
    dark: resolve(dark[name] !== undefined ? dark[name] : light[name], dark),
  };
});
const tokenByName = Object.fromEntries(tokens.map((t) => [t.name, t]));

const rows = Object.keys(map).map((dddName) => {
  const entry =
    typeof map[dddName] === "string" ? { token: map[dddName] } : map[dddName];
  if (!dddByName[dddName]) problems.push(`${dddName} is not a DDD token`);
  let lightValue;
  let darkValue;
  let css;
  if (entry.token) {
    const t = tokenByName[entry.token] || { light: "", dark: "" };
    lightValue = t.light;
    darkValue = t.dark;
    css = `var(${entry.token})`;
    // named DDD colors are constants that elements pair with light-dark()
    // themselves, so they must point at values that don't flip with the mode
    if (
      dddName.startsWith("--ddd-theme-default-") &&
      !entry.modeAware &&
      t.light !== t.dark
    ) {
      problems.push(
        `${dddName} → ${entry.token} changes between light and dark; point it at a fixed palette value or mark it "modeAware"`,
      );
    }
  } else {
    // swap embedded upstream tokens for their resolved values per mode
    const sub = (mode) =>
      entry.value.replace(/var\((--[\w-]+)\)/g, (all, ref) =>
        tokenByName[ref] ? tokenByName[ref][mode] : all,
      );
    lightValue = sub("light");
    darkValue = sub("dark");
    css = entry.value;
  }
  return {
    ddd: dddName,
    token: entry.token || null,
    css,
    light: lightValue,
    dark: darkValue,
    note: entry.note || "",
  };
});

// --ddd-primary-N-rgb triplets are literal numbers in DDD, so derive them
// from whatever their named color now points at
const rgbRows = [];
ddd
  .filter((v) => /^ddd-primary-\d+-rgb$/.test(v.name))
  .forEach((v) => {
    const alias = dddByName["--" + v.name.replace(/-rgb$/, "")];
    const named =
      alias && /var\((--ddd-theme-default-[\w-]+)/.exec(alias.value);
    const row = named && rows.find((r) => r.ddd === named[1]);
    if (!row || !/^#[0-9a-f]{6}$/i.test(row.light)) return;
    const [r, g, b] = hexToRgb(row.light);
    const parts = v.value.split(",").map((s) => s.trim());
    const alpha = parts.length === 4 ? `, ${parts[3]}` : "";
    rgbRows.push({ ddd: "--" + v.name, css: `${r}, ${g}, ${b}${alpha}` });
  });

/* coverage: the DDD surface a design system is expected to answer */
const FAMILIES = {
  color: (n) => /^ddd-theme-default-[a-zA-Z]+$/.test(n),
  font: (n) => /^ddd-font-(primary|secondary|navigation|mono)$/.test(n),
  radius: (n) => /^ddd-radius-(xs|sm|md|lg|xl)$/.test(n),
  shadow: (n) => /^ddd-boxShadow-(sm|md|lg|xl)$/.test(n),
  focus: (n) => n === "ddd-focus-ring",
};
const coverage = {};
let totalAll = 0;
let mappedAll = 0;
Object.keys(FAMILIES).forEach((family) => {
  const names = ddd.map((v) => v.name).filter(FAMILIES[family]);
  const mapped = names.filter((n) => map["--" + n]);
  totalAll += names.length;
  mappedAll += mapped.length;
  coverage[family] = {
    mapped: mapped.length,
    total: names.length,
    keptDDD: names.filter((n) => !map["--" + n]).map((n) => "--" + n),
  };
});
coverage.percent = Math.round((mappedAll / Math.max(totalAll, 1)) * 100);

/* contrast: the pairings DDD elements lean on, re-checked with mapped values */
const value = (name, mode) => {
  const row = rows.find((r) => r.ddd === name);
  if (row) return mode === "dark" ? row.dark : row.light;
  const v = dddByName[name];
  return v ? v.value : null;
};
const PAIRS = [
  ["--ddd-theme-default-coalyGray", "--ddd-theme-default-white", 4.5],
  ["--ddd-theme-default-link", "--ddd-theme-default-white", 4.5],
  ["--ddd-theme-default-white", "--ddd-theme-default-beaverBlue", 4.5],
  ["--ddd-theme-default-white", "--ddd-theme-default-nittanyNavy", 4.5],
  ["--ddd-theme-default-white", "--ddd-theme-default-coalyGray", 4.5],
  ["--ddd-theme-default-linkLight", "--ddd-theme-default-coalyGray", 4.5],
  ["--ddd-theme-default-error", "--ddd-theme-default-errorLight", 4.5],
  ["--ddd-theme-default-warning", "--ddd-theme-default-warningLight", 4.5],
  ["--ddd-theme-default-info", "--ddd-theme-default-infoLight", 4.5],
  ["--ddd-theme-default-success", "--ddd-theme-default-successLight", 4.5],
  [
    "--ddd-theme-default-coalyGray",
    "--ddd-theme-default-limestoneMaxLight",
    4.5,
  ],
];
const contrastReport = PAIRS.map(([fg, bg, min]) => {
  const a = value(fg, "light");
  const b = value(bg, "light");
  const hex = /^#[0-9a-f]{6}$/i;
  const ratio = hex.test(a) && hex.test(b) ? contrast(a, b) : null;
  if (ratio !== null && ratio < min) {
    problems.push(`${fg} on ${bg}: ${ratio.toFixed(2)} < ${min}`);
  }
  return {
    fg,
    bg,
    ratio: ratio === null ? null : Number(ratio.toFixed(2)),
    min,
  };
});

/* ------------------------------------------------------------------ output */

const prefix = config.prefix;
const header = (what) =>
  `/**\n * ${what}\n * GENERATED by elements/d-d-d/design-system/bridge/build-bridge.js from\n * ${config.upstream.package}@${config.upstream.version} (${config.upstream.license}, ${config.upstream.homepage}).\n * Do not edit by hand: change design-system/bridge.json and rebuild.\n */\n`;
/** split on a separator at paren depth 0 */
function splitTop(value, sep) {
  const parts = [];
  let depth = 0;
  let cur = "";
  for (const c of value) {
    if (c === "(") depth++;
    if (c === ")") depth--;
    if (c === sep && depth === 0) {
      parts.push(cur.trim());
      cur = "";
    } else cur += c;
  }
  parts.push(cur.trim());
  return parts.filter((p) => p !== "");
}
/**
 * light-dark() only takes colors, so a value that differs between modes is
 * diffed part by part (shadow layers, then the words in each layer) and only
 * the differing parts are wrapped; DDD writes its shadows the same way.
 */
function modeValue(name, l, d) {
  if (l === d) return l;
  const lLayers = splitTop(l, ",");
  const dLayers = splitTop(d, ",");
  const color = /^(#|rgba?\(|hsla?\(|oklch\(|color-mix\(|[a-z]+$)/i;
  if (
    lLayers.length === 1 &&
    dLayers.length === 1 &&
    color.test(l) &&
    color.test(d)
  ) {
    return `light-dark(${l}, ${d})`;
  }
  if (lLayers.length === dLayers.length) {
    const layers = lLayers.map((layer, i) => {
      const a = splitTop(layer, " ");
      const b = splitTop(dLayers[i], " ");
      if (a.length !== b.length) return null;
      return a
        .map((part, j) => {
          if (part === b[j]) return part;
          return color.test(part) && color.test(b[j])
            ? `light-dark(${part}, ${b[j]})`
            : null;
        })
        .reduce(
          (acc, p) =>
            acc === null || p === null ? null : `${acc} ${p}`.trim(),
          "",
        );
    });
    if (!layers.includes(null)) return layers.join(", ");
  }
  problems.push(
    `${name} differs between light and dark in a way light-dark() can't express; light value used`,
  );
  return l;
}
const decl = (t) => `    ${t.name}: ${modeValue(t.name, t.light, t.dark)};`;

const tokensJs =
  header(`${config.title} tokens, re-expressed under their upstream names.`) +
  `import { css } from "lit";\n\n` +
  `export const ${prefix}Tokens = css\`\n  :root,\n  :host {\n` +
  tokens.map(decl).join("\n") +
  `\n  }\n\`;\n\n` +
  `export const ${prefix}Fonts = ${JSON.stringify(
    (config.fonts || []).map((f) => f.url),
    null,
    2,
  )};\n`;

const mapJs =
  header(
    `DDD → ${config.title}: points DDD tokens at ${config.title} tokens.`,
  ) +
  `import { css } from "lit";\n\n` +
  `export const ${prefix}DDDMap = css\`\n  :root,\n  :host {\n` +
  rows.map((r) => `    ${r.ddd}: ${r.css};`).join("\n") +
  (rgbRows.length
    ? "\n    /* rgb channels follow their mapped color */\n"
    : "\n") +
  rgbRows.map((r) => `    ${r.ddd}: ${r.css};`).join("\n") +
  `\n  }\n\`;\n`;

const report = {
  system: config.system,
  title: config.title,
  upstream: config.upstream,
  fonts: config.fonts || [],
  coverage,
  contrast: contrastReport,
  problems,
  map: rows.map(({ ddd: d, token, light: l, dark: dk, note }) => ({
    ddd: d,
    token,
    light: l,
    dark: dk,
    note,
  })),
};
const reportJson = JSON.stringify(report, null, 2) + "\n";

// formatted the way the element build's prettier pass leaves them, so a
// rebuild of the element doesn't make --check report them as stale
const format = (source, parser) => prettier.format(source, { parser });
const outputs = {
  [path.join(themeDir, "lib", `${prefix}Tokens.js`)]: await format(
    tokensJs,
    "babel",
  ),
  [path.join(themeDir, "lib", `${prefix}DDDMap.js`)]: await format(
    mapJs,
    "babel",
  ),
  [path.join(themeDir, "lib", `${config.system}.ddd-map.json`)]: await format(
    reportJson,
    "json",
  ),
};

if (flag("--check")) {
  const stale = Object.keys(outputs).filter(
    (file) =>
      !fs.existsSync(file) || fs.readFileSync(file, "utf8") !== outputs[file],
  );
  if (stale.length) {
    console.error("Out of date:\n  " + stale.join("\n  "));
    process.exit(1);
  }
} else {
  Object.entries(outputs).forEach(([file, content]) => {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
  });
}

console.log(
  `${config.title}: ${tokens.length} upstream tokens, ${rows.length} DDD tokens mapped, ` +
    `coverage ${coverage.percent}% (${Object.keys(FAMILIES)
      .map((f) => `${f} ${coverage[f].mapped}/${coverage[f].total}`)
      .join(", ")})`,
);
if (problems.length) {
  console.error("Problems:\n  " + problems.join("\n  "));
  process.exit(1);
}
