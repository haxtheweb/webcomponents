#!/usr/bin/env node
/**
 * Exports DDD (and SimpleColors) as W3C Design Tokens Community Group (DTCG)
 * JSON, generated from the element source:
 *
 *   elements/d-d-d/tokens/ddd.tokens.json       every token, light values
 *   elements/d-d-d/tokens/ddd.dark.tokens.json  only what changes in dark mode
 *   elements/d-d-d/tokens/$themes.json          Light / Dark for Tokens Studio
 *   elements/d-d-d/tokens/$metadata.json        set order for Tokens Studio
 *
 * Aliases (`var(--ddd-*)`) become DTCG references (`{ddd.color.*}`), and every
 * token carries its CSS custom property name in
 * $extensions["org.haxtheweb.ddd"].cssVar so tools can map back.
 *
 * Usage: node elements/d-d-d/design-system/build-tokens.js [--check]
 *   --check  exit 1 if the committed files are out of date (for CI)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  DDD_DIR,
  dddVariables,
  dddVersion,
  simpleColors,
  splitLightDark,
} from "./lib/source.js";

const EXT = "org.haxtheweb.ddd";
const OUT = path.join(DDD_DIR, "tokens");

// ------------------------------------------------------------ name -> path --

const rules = [
  [/^ddd-theme-default-gradient-(.+)$/, (m) => ["color", "gradient", m[1]], null],
  [/^ddd-theme-default-(.+)$/, (m) => ["color", m[1]], "color"],
  [/^ddd-primary-(\d+)-rgb$/, null],
  [/^ddd-primary-(\d+)$/, (m) => ["color", "primary", m[1]], "color"],
  [/^ddd-accent-(\d+)$/, (m) => ["color", "accent", m[1]], "color"],
  [/^ddd-font-(primary|secondary|navigation)$/, (m) => ["font", "family", m[1]], "fontFamily"],
  [/^ddd-font-weight-(.+)$/, (m) => ["font", "weight", m[1]], "fontWeight"],
  [/^ddd-font-size-(.+)$/, (m) => ["font", "size", m[1]], "dimension"],
  [/^ddd-theme-(h\d|body)-font-size$/, (m) => ["font", "size", m[1]], "dimension"],
  [/^ddd-lh-(\d+)$/, (m) => ["lineHeight", m[1]], "number"],
  [/^ddd-ls-(.+)$/, (m) => ["letterSpacing", m[1]], "dimension"],
  [/^ddd-spacing-(\d+)$/, (m) => ["spacing", m[1]], "dimension"],
  [/^ddd-border-size-(.+)$/, (m) => ["border", "width", m[1]], "dimension"],
  [/^ddd-border-(xs|sm|md|lg)$/, (m) => ["border", m[1]], "border"],
  [/^ddd-theme-header-border-(thickness|treatment)-(.+)$/, (m) => ["headerBorder", m[1], m[2]], "dimension"],
  [/^ddd-theme-header-border-(thickness|treatment)$/, (m) => ["headerBorder", m[1], "default"], "dimension"],
  [/^ddd-boxShadow-(.+)$/, (m) => ["shadow", m[1]], "shadow"],
  [/^ddd-breakpoint-(.+)$/, (m) => ["breakpoint", m[1]], "dimension"],
  [/^ddd-radius-(.+)$/, (m) => ["radius", m[1]], "dimension"],
  [/^ddd-icon-(.+)$/, (m) => ["icon", m[1]], "dimension"],
  [/^ddd-z-(.+)$/, (m) => ["zIndex", m[1]], "number"],
  [/^ddd-opacity-(.+)$/, (m) => ["opacity", m[1]], "number"],
  [/^ddd-duration-(.+)$/, (m) => ["duration", m[1]], "duration"],
  [/^ddd-timing-(.+)$/, (m) => ["easing", m[1]], "cubicBezier"],
  [/^ddd-focus-ring$/, () => ["focus", "ring"], "border"],
  [/^ddd-focus-offset$/, () => ["focus", "offset"], "dimension"],
  [/^ddd-drop-zone-(.+-color)$/, (m) => ["dropZone", m[1]], "color"],
  [/^ddd-drop-zone-(outline-width|outline-offset|radius)$/, (m) => ["dropZone", m[1]], "dimension"],
  [/^ddd-drop-zone-(.+)$/, (m) => ["dropZone", m[1]], null],
  [/^ddd-textfield-height-(.+)$/, (m) => ["textfieldHeight", m[1]], "dimension"],
];

function classify(name) {
  for (const [re, toPath, type] of rules) {
    const m = re.exec(name);
    if (m) return toPath ? { path: ["ddd", ...toPath(m)], type } : null;
  }
  return null; // component defaults DDD happens to set (simple-tooltip etc.)
}

// ---------------------------------------------------------- value parsing --

function rgbaToHex(v) {
  const m = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+%?)\s*)?\)$/.exec(v);
  if (!m) return null;
  const h = (n) => Math.round(Number(n)).toString(16).padStart(2, "0");
  let a = "";
  if (m[4] !== undefined) {
    const alpha = m[4].endsWith("%") ? parseFloat(m[4]) / 100 : Number(m[4]);
    if (alpha < 1) a = h(alpha * 255);
  }
  return `#${h(m[1])}${h(m[2])}${h(m[3])}${a}`;
}

function color(v) {
  if (/^#[0-9a-fA-F]{3,8}$/.test(v)) return v.toLowerCase();
  if (v === "white") return "#ffffff";
  if (v === "black") return "#000000";
  if (v === "transparent") return "#00000000";
  return rgbaToHex(v);
}

export default function build() {
  const vars = dddVariables();
  const byName = new Map(vars.map((v) => [v.name, v]));
  const pathOf = new Map();
  for (const v of vars) {
    const c = classify(v.name);
    if (c) pathOf.set(v.name, c);
  }
  const ref = (name) =>
    pathOf.has(name) ? `{${pathOf.get(name).path.join(".")}}` : null;

  // var(--x) or var(--x, fallback) -> reference; else null
  function alias(v) {
    const m = /^var\(--([\w-]+)(?:,.*)?\)$/.exec(v);
    return m ? ref(m[1]) : null;
  }
  // follow aliases to a literal, for computing composite parts
  function literal(v, seen = new Set()) {
    const m = /^var\(--([\w-]+)(?:,\s*(.*))?\)$/.exec(v);
    if (!m) return v;
    if (byName.has(m[1]) && !seen.has(m[1])) {
      seen.add(m[1]);
      return literal(byName.get(m[1]).value, seen);
    }
    return m[2] ? literal(m[2].trim(), seen) : v;
  }

  function dimension(v) {
    const a = alias(v);
    if (a) return a;
    if (/^-?[\d.]+(px|rem|em)$/.test(v)) return v;
    if (v === "0") return "0px";
    return null;
  }

  function convert(type, v) {
    const a = alias(v);
    switch (type) {
      case "color":
        return a || color(v);
      case "fontFamily":
        return v.split(",").map((s) => s.trim().replace(/^"|"$/g, ""));
      case "fontWeight":
        return a || Number(v);
      case "number":
        if (a) return a;
        if (/%$/.test(v)) return Number(v.slice(0, -1)) / 100;
        return Number(v);
      case "dimension":
        return dimension(v);
      case "duration":
        return a || (/^[\d.]+m?s$/.test(v) ? v : null);
      case "cubicBezier": {
        const m = /^cubic-bezier\(([^)]+)\)$/.exec(v);
        return m ? m[1].split(",").map((n) => Number(n.trim())) : null;
      }
      case "border": {
        const m = /^(\S+)\s+(solid|dashed|dotted|double|groove|ridge)\s+(.+)$/.exec(v);
        if (!m) return null;
        return {
          color: alias(m[3]) || color(literal(m[3])),
          width: dimension(m[1]),
          style: m[2],
        };
      }
      case "shadow": {
        let m = /^((?:rgba?\([^)]*\))|#[0-9a-fA-F]+)\s+(\S+)\s+(\S+)\s+(\S+)(?:\s+(\S+))?$/.exec(v);
        if (!m) {
          // offsets first, colour last: "0px 0px 0px 0px rgba(0, 0, 0, 0)"
          const r = /^(\S+)\s+(\S+)\s+(\S+)(?:\s+(\S+))?\s+((?:rgba?\([^)]*\))|#[0-9a-fA-F]+)$/.exec(v);
          if (r) m = [r[0], r[5], r[1], r[2], r[3], r[4]];
        }
        if (!m) return null;
        return {
          color: color(m[1]),
          offsetX: dimension(m[2]),
          offsetY: dimension(m[3]),
          blur: dimension(m[4]),
          spread: dimension(m[5] || "0px"),
        };
      }
      default:
        return null;
    }
  }

  function token(v, type, value, comment) {
    const t = {};
    let $value = type ? convert(type, value) : null;
    if ($value === null || $value === undefined || Number.isNaN($value)) {
      // gradients, 100% radii, drop-zone mixes: no DTCG type fits, keep CSS
      $value = alias(value) || value;
      if (!alias(value)) type = null;
    }
    if (type) t.$type = type;
    t.$value = $value;
    if (comment) t.$description = comment;
    t.$extensions = { [EXT]: { cssVar: `--${v.name}` } };
    return t;
  }

  function put(tree, p, t) {
    let node = tree;
    for (const k of p.slice(0, -1)) node = node[k] = node[k] || {};
    node[p[p.length - 1]] = t;
  }

  const light = {};
  const dark = {};
  const skipped = [];
  for (const v of vars) {
    const c = pathOf.get(v.name);
    if (!c) {
      skipped.push(v.name);
      continue;
    }
    const ld = splitLightDark(v.value);
    put(light, c.path, token(v, c.type, ld ? ld.light : v.value, v.comment));
    if (ld) put(dark, c.path, token(v, c.type, ld.dark, v.comment));
  }

  // SimpleColors: fixed shades never change; default-theme shades flip
  const sc = simpleColors();
  for (const h of sc.hues) {
    sc.shades[h].forEach((hex, i) => {
      const n = String(i + 1);
      put(light, ["simple-colors", "fixed", h, n], {
        $type: "color",
        $value: hex,
        $extensions: { [EXT]: { cssVar: `--simple-colors-fixed-theme-${h}-${n}` } },
      });
      put(light, ["simple-colors", "default", h, n], {
        $type: "color",
        $value: `{simple-colors.fixed.${h}.${n}}`,
        $extensions: { [EXT]: { cssVar: `--simple-colors-default-theme-${h}-${n}` } },
      });
      const inverse = sc.shades[h][12 - (i + 1)];
      const d = sc.dark[h][i];
      put(dark, ["simple-colors", "default", h, n], {
        $type: "color",
        $value: d === inverse ? `{simple-colors.fixed.${h}.${13 - (i + 1)}}` : d,
        $extensions: { [EXT]: { cssVar: `--simple-colors-default-theme-${h}-${n}` } },
      });
    });
  }

  const head = (desc) => ({
    $description: desc,
    $extensions: {
      [EXT]: {
        generator: "elements/d-d-d/design-system/build-tokens.js",
        package: "@haxtheweb/d-d-d",
        version: dddVersion(),
      },
    },
  });
  const files = {
    "ddd.tokens.json": {
      ...head(
        "DDD (Design, Develop, Destroy) design tokens for HAXTheWeb, light values. Generated from elements/d-d-d/lib/DDDStyles.js and SimpleColors; do not edit by hand.",
      ),
      ...light,
    },
    "ddd.dark.tokens.json": {
      ...head(
        "Dark-mode overrides for ddd.tokens.json: the light-dark() pairs in DDDStyles.js and the SimpleColors default-theme flip. Apply on top of ddd.tokens.json.",
      ),
      ...dark,
    },
    "$metadata.json": { tokenSetOrder: ["ddd.tokens", "ddd.dark.tokens"] },
    "$themes.json": [
      {
        id: "light",
        name: "Light",
        selectedTokenSets: { "ddd.tokens": "enabled", "ddd.dark.tokens": "disabled" },
      },
      {
        id: "dark",
        name: "Dark",
        selectedTokenSets: { "ddd.tokens": "enabled", "ddd.dark.tokens": "enabled" },
      },
    ],
  };
  const count = (o) =>
    Object.entries(o).reduce(
      (n, [k, v]) =>
        k.startsWith("$") || typeof v !== "object"
          ? n
          : n + ("$value" in v ? 1 : count(v)),
      0,
    );
  return {
    files,
    stats: {
      light: count(light),
      dark: count(dark),
      skipped,
    },
  };
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  const check = process.argv.includes("--check");
  const { files, stats } = build();
  let stale = [];
  fs.mkdirSync(OUT, { recursive: true });
  for (const [name, data] of Object.entries(files)) {
    const file = path.join(OUT, name);
    const text = JSON.stringify(data, null, 2) + "\n";
    if (check) {
      // compare parsed JSON so a prettier pass over the files does not count as drift
      let same = false;
      try {
        same = JSON.stringify(JSON.parse(fs.readFileSync(file, "utf8"))) === JSON.stringify(data);
      } catch (e) {
        same = false;
      }
      if (!same) stale.push(name);
    } else {
      fs.writeFileSync(file, text);
    }
  }
  if (check && stale.length) {
    console.error(
      `DTCG tokens are out of date: ${stale.join(", ")}. Run node elements/d-d-d/design-system/build-tokens.js`,
    );
    process.exit(1);
  }
  console.log(
    `${check ? "checked" : "wrote"} ${Object.keys(files).length} files in elements/d-d-d/tokens: ${stats.light} tokens, ${stats.dark} dark overrides` +
      (stats.skipped.length ? `; not exported (RGB channel triplets and component defaults): ${stats.skipped.length}` : ""),
  );
}
