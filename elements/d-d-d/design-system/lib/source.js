/**
 * Reads the DDD and SimpleColors token sources straight out of the element
 * code, so every generated file tracks what actually ships:
 *
 *   elements/d-d-d/lib/DDDStyles.js                 DDDVariables block
 *   elements/simple-colors-shared-styles/...js      SimpleColors palette (CSS)
 *   elements/simple-colors/simple-colors.js         SimpleColors :host([dark])
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
export const REPO = path.resolve(here, "..", "..", "..", "..");
export const DDD_DIR = path.join(REPO, "elements", "d-d-d");

const read = (...p) => fs.readFileSync(path.join(REPO, ...p), "utf8");

/** every `--name: value; /* comment *\/` in the DDDVariables block, in order */
export function dddVariables() {
  const src = read("elements", "d-d-d", "lib", "DDDStyles.js");
  const block = src.slice(
    src.indexOf("export const DDDVariables"),
    src.indexOf("export const DDDGlobalStyles"),
  );
  const re = /--([\w-]+):\s*((?:[^;])+?);[ \t]*(?:\/\*\s*([\s\S]*?)\s*\*\/)?/g;
  const vars = [];
  let m;
  while ((m = re.exec(block))) {
    const value = m[2]
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\s+/g, " ")
      .replace(/\( /g, "(")
      .replace(/ \)/g, ")")
      .trim();
    vars.push({
      name: m[1],
      value,
      comment: (m[3] || "").replace(/\s+/g, " ").trim(),
    });
  }
  return vars;
}

/** split a top-level light-dark(a, b) into { light, dark }, else null */
export function splitLightDark(value) {
  const i = value.indexOf("light-dark(");
  if (i === -1) return null;
  let depth = 0;
  let comma = -1;
  let end = -1;
  for (let j = i + "light-dark(".length; j < value.length; j++) {
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
  if (comma === -1 || end === -1) return null;
  const before = value.slice(0, i);
  const after = value.slice(end + 1);
  const a = value.slice(i + "light-dark(".length, comma).trim();
  const b = value.slice(comma + 1, end).trim();
  return {
    light: (before + a + after).trim(),
    dark: (before + b + after).trim(),
  };
}

/** SimpleColors: { hues: [...], shades: {hue: [12 hex]}, dark: {hue: [12 hex]} } */
export function simpleColors() {
  const css = read(
    "elements",
    "simple-colors-shared-styles",
    "simple-colors-shared-styles.js",
  );
  const darkSrc = read("elements", "simple-colors", "simple-colors.js");
  const hues = [];
  const shades = {};
  const re = /--simple-colors-fixed-theme-([a-z-]+)-(\d+):\s*(#[0-9a-fA-F]{6});/g;
  let m;
  while ((m = re.exec(css))) {
    if (m[1] === "accent") continue;
    if (!shades[m[1]]) {
      shades[m[1]] = [];
      hues.push(m[1]);
    }
    shades[m[1]][Number(m[2]) - 1] = m[3].toLowerCase();
  }
  const darkBlock = darkSrc.slice(
    darkSrc.indexOf(":host([dark])"),
    darkSrc.indexOf(":host {"),
  );
  const dark = {};
  for (const h of hues) {
    dark[h] = [];
    for (let i = 1; i <= 12; i++) {
      const dm = new RegExp(
        `--simple-colors-default-theme-${h}-${i}:\\s*(#[0-9a-fA-F]{6});`,
      ).exec(darkBlock);
      dark[h][i - 1] = dm ? dm[1].toLowerCase() : shades[h][12 - i];
    }
  }
  return { hues, shades, dark };
}

export function dddVersion() {
  return JSON.parse(read("elements", "d-d-d", "package.json")).version;
}

// ------------------------------------------------------------------ color --

export function hexToRgb(hex) {
  let h = hex.replace("#", "");
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
export function luminance(hex) {
  const c = hexToRgb(hex).map((v) => {
    v = v / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
export function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
