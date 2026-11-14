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
 * Each upstream source is fetched with `npm pack` at its pinned version, so
 * nothing from the upstream system is added to the monorepo's dependencies.
 * A system that lives in the theme itself (no npm package) is a "local"
 * source: its file is read from the theme folder, under the theme's own
 * license.
 * Sources are compiled CSS (custom properties per light/dark selector) or
 * DTCG token JSON (written out as custom properties under a given prefix).
 *
 * Output (in <theme>/lib/):
 *   <Prefix>Tokens.js        upstream tokens as CSS (light-dark() pairs)
 *   <Prefix>DDDMap.js        --ddd-* → upstream token remap as CSS
 *   <system>.ddd-map.json    machine-readable map + per-tier coverage + contrast report
 *
 * What a bridge may map is set by contract.json (structure is locked;
 * identity is expected; feel and semantic are optional and guarded).
 *
 * Usage:
 *   node elements/d-d-d/design-system/bridge/build-bridge.js <theme-dir> [--upstream <dir>] [--check]
 *     --upstream  an already-extracted package for the first source (skips npm pack)
 *     --check     exit 1 if the committed outputs are out of date
 */
import crypto from "crypto";
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

// one or more upstream sources; a single legacy "upstream" is the first
const sources = config.sources || [
  { ...config.upstream, format: "css", scopes: config.scopes },
];

// licenses that can ship inside an Apache-2.0 project; anything else stops
// the build so an incompatible system never lands in the monorepo
// CC0-1.0 is a public domain dedication (USWDS: U.S. government work)
const SHIPPABLE = [
  "MIT",
  "Apache-2.0",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "ISC",
  "CC0-1.0",
];
const SHIPPABLE_FONTS = ["OFL-1.1", "Apache-2.0", "MIT"];
sources.forEach((source) => {
  if (!SHIPPABLE.includes(source.license)) {
    console.error(
      `License ${source.license} for ${source.package || source.file} is not on the shippable list (${SHIPPABLE.join(", ")}).`,
    );
    process.exit(1);
  }
});
(config.fonts || []).forEach((font) => {
  if (!SHIPPABLE_FONTS.includes(font.license)) {
    console.error(`Font ${font.family} is ${font.license}, which can't ship.`);
    process.exit(1);
  }
});

/* ---------------------------------------------------------------- upstream */

// the theme's own license, for systems whose tokens live in the theme
const themePkg = fs.existsSync(path.join(themeDir, "package.json"))
  ? JSON.parse(fs.readFileSync(path.join(themeDir, "package.json"), "utf8"))
  : {};

const packed = {};
function fetchSource(source, index) {
  if (source.local) {
    if (themePkg.license !== source.license) {
      console.error(
        `bridge.json says ${source.license} but the theme is ${themePkg.license}.`,
      );
      process.exit(1);
    }
    return themeDir;
  }
  const given = option("--upstream");
  if (given && index === 0) return path.resolve(given);
  const spec = `${source.package}@${source.version}`;
  if (packed[spec]) return packed[spec];
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ddd-bridge-"));
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
  // "SEE LICENSE IN <file>": read that file and check it for the declared
  // license's own text instead of trusting a free-form field
  const seeFile = /^SEE LICENSE IN (\S+)$/.exec(pkg.license || "");
  if (seeFile) {
    const file = path.join(tmp, "package", path.basename(seeFile[1]));
    const text = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
    if (!text.includes(LICENSE_TEXT[source.license])) {
      console.error(
        `${spec} points at ${seeFile[1]}, which doesn't read as ${source.license}.`,
      );
      process.exit(1);
    }
  } else if (pkg.license !== source.license) {
    console.error(
      `bridge.json says ${source.license} but ${spec} declares ${pkg.license}.`,
    );
    process.exit(1);
  }
  packed[spec] = path.join(tmp, "package");
  return packed[spec];
}

/**
 * A source that isn't published to npm (shadcn's theme lives in its repo):
 * a raw URL pinned to a commit, verified by sha256, with its LICENSE file
 * fetched from the same commit and checked for the declared license.
 */
const LICENSE_TEXT = {
  MIT: "MIT License",
  "Apache-2.0": "Apache License",
  "BSD-2-Clause": "BSD 2-Clause",
  "BSD-3-Clause": "BSD 3-Clause",
  ISC: "ISC License",
  "CC0-1.0": "CC0 1.0 Universal",
};
const curl = (url) =>
  execFileSync("curl", ["-fsSL", "--max-time", "60", url], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
function fetchUrl(source) {
  if (!/^https:\/\/[\w.-]+\/.+\/[0-9a-f]{40}\//.test(source.url)) {
    console.error(
      `${source.url} must be https and pinned to a full commit sha.`,
    );
    process.exit(1);
  }
  const text = curl(source.url);
  const digest = crypto.createHash("sha256").update(text).digest("hex");
  if (digest !== source.sha256) {
    console.error(
      `${source.url} sha256 is ${digest}, bridge.json pins ${source.sha256}.`,
    );
    process.exit(1);
  }
  const license = curl(source.licenseUrl);
  if (!license.includes(LICENSE_TEXT[source.license])) {
    console.error(`${source.licenseUrl} doesn't read as ${source.license}.`);
    process.exit(1);
  }
  return text;
}

const kebab = (key) =>
  String(key)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();

/** a DTCG $value as CSS */
function dtcgValue(token, prefix) {
  const value = token.$value;
  if (typeof value === "string") {
    // {group.token} aliases point at another token in the same file
    const alias = /^\{([^}]+)\}$/.exec(value);
    if (alias) {
      return `var(${prefix}${alias[1].split(".").map(kebab).join("-")})`;
    }
    return value;
  }
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) {
    if (token.$type === "cubicBezier")
      return `cubic-bezier(${value.join(", ")})`;
    if (token.$type === "fontFamily") {
      return value.map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(", ");
    }
    return value.join(" ");
  }
  if (value && typeof value === "object") {
    if (value.hex) return value.hex;
    if (value.value !== undefined && value.unit) {
      return `${value.value}${value.unit}`;
    }
  }
  throw new Error(`unsupported DTCG value ${JSON.stringify(value)}`);
}

/** DTCG JSON → { --prefix-group-token: css } */
function flattenDTCG(json, prefix, pathParts = [], out = {}) {
  Object.entries(json).forEach(([key, node]) => {
    if (key.startsWith("$") || !node || typeof node !== "object") return;
    const parts = [...pathParts, kebab(key)];
    if (node.$value !== undefined) {
      out[`${prefix}${parts.join("-")}`] = dtcgValue(node, prefix);
    } else {
      flattenDTCG(node, prefix, parts, out);
    }
  });
  return out;
}

/** custom property declarations per selector, in source order */
/**
 * custom property declarations per selector, in source order. Blocks can
 * nest (Tailwind's @theme holds @keyframes), so declarations belong to the
 * innermost block they sit in and nested blocks never leak into it.
 */
function parseBlocks(cssText) {
  const text = cssText.replace(/\/\*[\s\S]*?\*\//g, "");
  const blocks = [];
  const stack = [];
  let buffer = "";
  let quote = null;
  const flushDecl = () => {
    const top = stack[stack.length - 1];
    const decl = buffer;
    buffer = "";
    if (!top) return;
    const i = decl.indexOf(":");
    if (i === -1) return;
    const name = decl.slice(0, i).trim();
    if (!name.startsWith("--")) return;
    top.decls[name] = decl
      .slice(i + 1)
      .replace(/\s+/g, " ")
      .trim();
  };
  for (const c of text) {
    if (quote) {
      buffer += c;
      if (c === quote) quote = null;
    } else if (c === '"' || c === "'") {
      quote = c;
      buffer += c;
    } else if (c === "{") {
      const block = { selector: buffer.replace(/\s+/g, " ").trim(), decls: {} };
      buffer = "";
      blocks.push(block);
      stack.push(block);
    } else if (c === "}") {
      flushDecl();
      stack.pop();
    } else if (c === ";") {
      flushDecl();
    } else {
      buffer += c;
    }
  }
  return blocks;
}

/**
 * Sass variable files ($name: value;) as custom properties under prefix.
 * module.$var references become var(--module-var), and local $var
 * references var(<prefix>var), matching Material's own CSS names.
 */
function parseScssVars(text, prefix) {
  const out = {};
  const clean = text.replace(/\/\*[\s\S]*?\*\//g, "");
  clean.split("\n").forEach((line) => {
    const m = /^\$([\w-]+)\s*:\s*(.+?);\s*$/.exec(line.trim());
    if (!m || /\bnull\b/.test(m[2])) return;
    const value = m[2]
      .replace(
        /([\w-]+)\.\$([\w-]+)/g,
        (all, mod, name) => `var(--${mod}-${name})`,
      )
      .replace(
        /(^|[^\w-])\$([\w-]+)/g,
        (all, pre, name) => `${pre}var(${prefix}${name})`,
      );
    out[`${prefix}${m[1]}`] = value;
  });
  return out;
}

/**
 * Sass map files ($name: ("blue": (5: #eff6fb, "vivid": (60: #005ea2))))
 * flattened to custom properties under prefix: --usa-blue-5,
 * --usa-blue-vivid-60. Entries set to false (no value at that step) are
 * skipped. Only literal values are read; nothing is evaluated.
 */
function parseScssMaps(text, prefix) {
  const out = {};
  const clean = text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1");
  // split a map body on commas at depth 0
  const entries = (body) => {
    const parts = [];
    let depth = 0;
    let start = 0;
    for (let i = 0; i < body.length; i++) {
      if (body[i] === "(") depth++;
      else if (body[i] === ")") depth--;
      else if (body[i] === "," && depth === 0) {
        parts.push(body.slice(start, i));
        start = i + 1;
      }
    }
    parts.push(body.slice(start));
    return parts.map((p) => p.trim()).filter(Boolean);
  };
  const unquote = (k) => k.trim().replace(/^["']|["']$/g, "");
  const walk = (body, keys) => {
    entries(body).forEach((entry) => {
      const colon = entry.indexOf(":");
      if (colon === -1) return;
      const key = unquote(entry.slice(0, colon));
      const value = entry.slice(colon + 1).trim();
      if (value.startsWith("(") && value.endsWith(")")) {
        walk(value.slice(1, -1), [...keys, key]);
      } else if (value !== "false" && value !== "null") {
        out[`${prefix}${[...keys, key].join("-")}`] = unquote(value);
      }
    });
  };
  const re = /\$[\w-]+\s*:\s*\(/g;
  while (re.exec(clean)) {
    let depth = 1;
    let i = re.lastIndex;
    for (; i < clean.length && depth > 0; i++) {
      if (clean[i] === "(") depth++;
      else if (clean[i] === ")") depth--;
    }
    walk(clean.slice(re.lastIndex, i - 1), []);
    re.lastIndex = i;
  }
  return out;
}

function scopeEnv(blocks, selectors) {
  const env = {};
  selectors.forEach((sel) => {
    blocks
      .filter(
        (b) => b.selector === sel || selectorList(b.selector).includes(sel),
      )
      .forEach((b) => Object.assign(env, b.decls));
  });
  return env;
}

/**
 * the selectors of a selector list, split at top-level commas only, so a
 * scope can name one member of a shared rule (Web Awesome writes
 * ":where(:root), .wa-theme-default, .wa-light, ..." for its light theme)
 */
function selectorList(selector) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < selector.length; i++) {
    const c = selector[i];
    if (c === "(" || c === "[") depth++;
    else if (c === ")" || c === "]") depth--;
    else if (c === "," && depth === 0) {
      parts.push(selector.slice(start, i).trim());
      start = i + 1;
    }
  }
  parts.push(selector.slice(start).trim());
  return parts;
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

// light and dark environments, merged across sources in order
const light = {};
const dark = {};
const readSource = (source, index, file) => {
  if (source.url) return fetchUrl(source);
  return fs.readFileSync(path.join(fetchSource(source, index), file), "utf8");
};
sources.forEach((source, index) => {
  if (source.format === "dtcg") {
    // DTCG files here are mode-free (palettes, motion): same in both modes
    const flat = flattenDTCG(
      JSON.parse(readSource(source, index, source.file)),
      source.prefix,
    );
    Object.assign(light, flat);
    Object.assign(dark, flat);
  } else if (source.format === "scss-map") {
    // mode-free palettes; files: [ ... ] merged in order
    (source.files || [source.file]).forEach((file) => {
      const flat = parseScssMaps(
        readSource(source, index, file),
        source.prefix,
      );
      Object.assign(light, flat);
      Object.assign(dark, flat);
    });
  } else if (source.format === "scss-vars") {
    // one file for both modes, or files: { light, dark }
    const files = source.files || { light: source.file, dark: source.file };
    Object.assign(
      light,
      parseScssVars(readSource(source, index, files.light), source.prefix),
    );
    Object.assign(
      dark,
      parseScssVars(readSource(source, index, files.dark), source.prefix),
    );
  } else {
    const blocks = parseBlocks(readSource(source, index, source.file));
    Object.assign(light, scopeEnv(blocks, source.scopes.light));
    Object.assign(dark, scopeEnv(blocks, source.scopes.dark));
  }
});

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
  if (entry.token && entry.fromMode) {
    // a palette that only exists per mode (Spectrum): take the value the
    // named mode gives and write it as a constant
    const t = tokenByName[entry.token] || { light: "", dark: "" };
    lightValue = t[entry.fromMode];
    darkValue = t[entry.fromMode];
    css = lightValue;
  } else if (entry.token) {
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
    fromMode: entry.fromMode || null,
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
    const rowHex = row ? toHex(row.light) : null;
    if (!rowHex) return;
    const [r, g, b] = hexToRgb(rowHex);
    const parts = v.value.split(",").map((s) => s.trim());
    const alpha = parts.length === 4 ? `, ${parts[3]}` : "";
    rgbRows.push({ ddd: "--" + v.name, css: `${r}, ${g}, ${b}${alpha}` });
  });

/* contract: which DDD tokens a bridge may answer (contract.json, by tier) */
const contract = JSON.parse(
  fs.readFileSync(new URL("./contract.json", import.meta.url), "utf8"),
);
const tierOf = (name) =>
  contract.tiers.find((tier) =>
    tier.patterns.some((pattern) => new RegExp(pattern).test(name)),
  ) || null;
const px = (value) => {
  const text = String(value).trim();
  // calc(<length> * <number>) or calc(<number> * <length>): Tailwind writes
  // every spacing step as a multiple of its one --spacing token
  const calc =
    /^calc\(\s*([\d.]+(?:px|rem|em)?)\s*\*\s*([\d.]+(?:px|rem|em)?)\s*\)$/.exec(
      text,
    );
  if (calc) {
    const a = px(calc[1]);
    const b = px(calc[2]);
    if (a !== null && /^[\d.]+$/.test(calc[2])) return a * Number(calc[2]);
    if (b !== null && /^[\d.]+$/.test(calc[1])) return b * Number(calc[1]);
    return null;
  }
  const m = /^(-?[\d.]+)(px|rem|em)$/.exec(text);
  if (!m) return null;
  return m[2] === "px" ? Number(m[1]) : Number(m[1]) * 16;
};
rows.forEach((row) => {
  const tier = tierOf(row.ddd.slice(2));
  row.tier = tier ? tier.id : null;
  if (!tier) {
    problems.push(
      `${row.ddd} is not in the bridge contract; add it to a tier in contract.json before mapping it`,
    );
  } else if (tier.mapping === "forbidden") {
    problems.push(`${row.ddd} is ${tier.title}: ${tier.why}`);
  }
});

/* guards: the contract's floors, checked against the resolved values */
const resolvedDDD = (name, mode) => {
  const row = rows.find((r) => r.ddd === name);
  if (row) return mode === "dark" ? row.dark : row.light;
  const v = dddByName[name];
  if (!v) return null;
  // DDD aliases such as var(--ddd-font-size-l) resolve through DDD itself
  const alias = /^var\((--ddd-[\w-]+)\)$/.exec(v.value.trim());
  return alias ? resolvedDDD(alias[1], mode) : v.value;
};
const guards = Object.assign(
  {},
  ...contract.tiers.map((tier) => tier.guards || {}),
);
if (guards.bodyMinPx) {
  const body = px(resolvedDDD("--ddd-theme-body-font-size", "light"));
  if (body !== null && body < guards.bodyMinPx) {
    problems.push(
      `--ddd-theme-body-font-size resolves to ${body}px, below the ${guards.bodyMinPx}px floor`,
    );
  }
  let previous = Infinity;
  [1, 2, 3, 4, 5, 6].forEach((level) => {
    const name = `--ddd-theme-h${level}-font-size`;
    const size = px(resolvedDDD(name, "light"));
    if (size === null) return;
    if (body !== null && size < body) {
      problems.push(
        `${name} (${size}px) is smaller than body text (${body}px)`,
      );
    }
    if (size > previous) {
      problems.push(`${name} (${size}px) is larger than the level above it`);
    }
    previous = size;
  });
}
if (guards.densityMinPx) {
  Object.entries(guards.densityMinPx).forEach(([name, min]) => {
    const row = rows.find((r) => r.ddd === name);
    if (!row) return;
    const size = px(row.light);
    if (size === null) {
      problems.push(
        `${name} resolves to ${row.light}, which can't be checked against its ${min}px floor`,
      );
    } else if (size < min) {
      problems.push(`${name} resolves to ${size}px, below its ${min}px floor`);
    }
  });
}
if (guards.controlMinPx) {
  rows
    .filter((row) => /^--ddd-(control|textfield)-height(-|$)/.test(row.ddd))
    .forEach((row) => {
      const size = px(row.light);
      if (size !== null && size < guards.controlMinPx) {
        problems.push(
          `${row.ddd} resolves to ${size}px, below the ${guards.controlMinPx}px minimum target`,
        );
      }
    });
}

/* coverage per tier and family, so every system reports the same surface */
const coverage = {};
contract.tiers
  .filter((tier) => tier.families)
  .forEach((tier) => {
    let total = 0;
    let mapped = 0;
    const families = {};
    Object.entries(tier.families).forEach(([family, pattern]) => {
      const re = new RegExp(pattern);
      const names = ddd.map((v) => v.name).filter((n) => re.test(n));
      const hit = names.filter((n) => map["--" + n]);
      total += names.length;
      mapped += hit.length;
      families[family] = {
        mapped: hit.length,
        total: names.length,
        keptDDD: names.filter((n) => !map["--" + n]).map((n) => "--" + n),
      };
    });
    coverage[tier.id] = {
      mapping: tier.mapping,
      percent: Math.round((mapped / Math.max(total, 1)) * 100),
      families,
    };
  });

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
  const ha = toHex(a);
  const hb = toHex(b);
  const ratio = ha && hb ? contrast(ha, hb) : null;
  if (
    ratio === null &&
    (rows.some((r) => r.ddd === fg) || rows.some((r) => r.ddd === bg))
  ) {
    problems.push(
      `${fg} on ${bg}: can't read the mapped colors to check contrast (${a} / ${b})`,
    );
  }
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

/*
 * paired text colors: DDD gives every primary palette the text color that
 * reads on it (--ddd-primary-N-on, black or white, chosen for DDD's own
 * colors). A bridge that remaps a palette to a lighter or darker color can
 * break that pair, so each remapped palette is re-checked in both modes:
 * a pair the bridge sets itself is checked as given; otherwise DDD's pair is
 * kept when it still passes and flipped when only the other one does. A
 * palette neither black nor white reads on is a problem.
 */
const PAIR_MIN = 4.5;
const pairRatio = (on, bgName) => {
  const ratios = ["light", "dark"].map((mode) => {
    const a = toHex(on);
    const b = toHex(value(bgName, mode));
    return a && b ? contrast(a, b) : null;
  });
  return ratios.includes(null) ? null : Math.min(...ratios);
};
const onRows = [];
const pairsReport = [];
ddd
  .map((v) => /^ddd-primary-(\d+)$/.exec(v.name))
  .filter((m) => m)
  .forEach((m) => {
    const n = m[1];
    const alias = /^var\((--ddd-theme-default-[\w-]+)\)$/.exec(
      dddByName[`--ddd-primary-${n}`].value.trim(),
    );
    const onName = `--ddd-primary-${n}-on`;
    if (!alias || !dddByName[onName]) return;
    const bg = alias[1];
    // only palettes this bridge remaps can have drifted from their pair
    if (!rows.some((r) => r.ddd === bg)) return;
    const given = rows.find((r) => r.ddd === onName);
    const dddOn = dddByName[onName].value.trim();
    let on = given ? given.light : dddOn;
    let source = given ? "bridge" : "ddd";
    let ratio = pairRatio(on, bg);
    if (ratio === null) {
      problems.push(
        `${onName} on ${bg}: can't read the mapped colors to check contrast`,
      );
      return;
    }
    if (!given && ratio < PAIR_MIN) {
      const other = dddOn === "black" ? "white" : "black";
      const otherRatio = pairRatio(other, bg);
      if (otherRatio !== null && otherRatio > ratio) {
        on = other;
        ratio = otherRatio;
        source = "paired";
        onRows.push({ ddd: onName, css: other });
      }
    }
    if (ratio < PAIR_MIN) {
      problems.push(
        `${onName} (${on}) on ${bg}: ${ratio.toFixed(2)} < ${PAIR_MIN}`,
      );
    }
    pairsReport.push({
      primary: Number(n),
      color: bg,
      on,
      ratio: Number(ratio.toFixed(2)),
      source,
    });
  });

/* ------------------------------------------------------------------ output */

const prefix = config.prefix;
const header = (what) =>
  `/**\n * ${what}\n * GENERATED by elements/d-d-d/design-system/bridge/build-bridge.js from\n * ${sources.map((src) => (src.local ? `${themePkg.name}/${src.file}` : `${src.package}@${src.version}`) + ` (${src.license})`).join(", ")}, ${config.homepage || sources[0].homepage}.\n * Do not edit by hand: change design-system/bridge.json and rebuild.\n */\n`;
/**
 * An opaque color as #rrggbb for contrast and rgb-channel math, or null.
 * Upstream values stay as written in the output (oklch is fine in CSS).
 */
function toHex(value) {
  const v = String(value || "").trim();
  // keyword colors upstream writes literally (USWDS: white, black)
  const keyword = { white: "#ffffff", black: "#000000" }[v.toLowerCase()];
  if (keyword) return keyword;
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(v);
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].replace(/./g, "$&$&") : hex[1];
    return `#${h.toLowerCase()}`;
  }
  const byte = (n) =>
    Math.round(Math.min(1, Math.max(0, n)) * 255)
      .toString(16)
      .padStart(2, "0");
  const rgb =
    /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)\s*(?:[,/]\s*([\d.]+%?))?\s*\)$/i.exec(
      v,
    );
  if (rgb) {
    if (
      rgb[4] !== undefined &&
      parseFloat(rgb[4]) < (rgb[4].endsWith("%") ? 100 : 1)
    ) {
      return null;
    }
    return `#${[rgb[1], rgb[2], rgb[3]].map((n) => byte(Number(n) / 255)).join("")}`;
  }
  const ok =
    /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+|none)\s+([\d.]+|none)\s*(?:\/\s*([\d.]+%?))?\s*\)$/i.exec(
      v,
    );
  if (ok) {
    if (
      ok[5] !== undefined &&
      parseFloat(ok[5]) < (ok[5].endsWith("%") ? 100 : 1)
    ) {
      return null;
    }
    // OKLCH → OKLab → linear sRGB → sRGB (Björn Ottosson's matrices)
    const L = ok[2] ? Number(ok[1]) / 100 : Number(ok[1]);
    // "none" is a missing component (Tailwind writes neutrals that way): 0
    const C = ok[3] === "none" ? 0 : Number(ok[3]);
    const H = ok[4] === "none" ? 0 : (Number(ok[4]) * Math.PI) / 180;
    const a = C * Math.cos(H);
    const b = C * Math.sin(H);
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s2 = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
    const lin = [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s2,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s2,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s2,
    ];
    const gamma = (x) =>
      x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
    return `#${lin.map((x) => byte(gamma(x))).join("")}`;
  }
  return null;
}

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
  (onRows.length
    ? "\n    /* text color paired with each remapped palette, where DDD's own no longer reads */\n"
    : "") +
  onRows.map((r) => `    ${r.ddd}: ${r.css};`).join("\n") +
  `\n  }\n\`;\n`;

const report = {
  system: config.system,
  title: config.title,
  sources: sources.map((source) => {
    const listed = { ...source };
    delete listed.scopes;
    return listed;
  }),
  fonts: config.fonts || [],
  coverage,
  contrast: contrastReport,
  pairs: pairsReport,
  problems,
  contract: contract.version,
  map: rows.map(({ ddd: d, tier, token, light: l, dark: dk, note }) => ({
    ddd: d,
    tier,
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
  `${config.title}: ${tokens.length} upstream tokens, ${rows.length} DDD tokens mapped\n` +
    Object.entries(coverage)
      .map(
        ([tier, c]) =>
          `  ${tier} ${c.percent}% (${Object.entries(c.families)
            .map(([f, v]) => `${f} ${v.mapped}/${v.total}`)
            .join(", ")})`,
      )
      .join("\n"),
);
if (problems.length) {
  console.error("Problems:\n  " + problems.join("\n  "));
  process.exit(1);
}
