#!/usr/bin/env node

/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Color vision check for opposing action pairs (save vs cancel, keep vs
 * delete). It answers one question per pair: when color can't be trusted,
 * can someone still tell the two apart at a glance?
 *
 * Every pair in scripts/vision-pairs.json is resolved from the real DDD and
 * HAX UI token sources (elements/d-d-d/lib) for the light and dark schemes,
 * then run through greyscale (achromatopsia), protanopia, deuteranopia and
 * tritanopia (scripts/lib/vision-deficiency.mjs).
 *
 * Per scheme and mode a pair is:
 *   pass  the two fills differ by at least 3:1 in luminance, so they read
 *         apart in greyscale and under every deficiency
 *   cue   they don't, but a non-color cue the pair declares (outline,
 *         pattern, strike, label, position, weight) carries the difference. Meets WCAG 1.4.1
 *         and is reported so it can be judged by eye.
 *   fail  nothing but hue separates them
 * A filled member also fails if it is under 3:1 against the background
 * (WCAG 1.4.11 non-text contrast).
 *
 * Report-only by default, like the other advisory checks; --strict exits 1
 * on any fail.
 *
 * Usage:
 *   node scripts/vision-pairs-check.mjs            # markdown report
 *   node scripts/vision-pairs-check.mjs --json     # machine-readable
 *   node scripts/vision-pairs-check.mjs --strict   # exit 1 on fail
 *   node scripts/vision-pairs-check.mjs --quiet    # summary + failing pairs only
 *
 * yarn precheck runs it with --strict --quiet. A pair may list evidence
 * (file + text) for its non-color cues; if that text leaves the source the
 * cue stops counting, so removing a hatch or underline is caught.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  MODES,
  parseColor,
  composite,
  simulate,
  contrastRatio,
  deltaE2000,
  toHex,
} from "./lib/vision-deficiency.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TOKEN_FILES = [
  "elements/d-d-d/lib/DDDStyles.js",
  "elements/d-d-d/lib/HaxUiAdminTokens.js",
];
const SCHEMES = ["light", "dark"];
const MIN_CONTRAST = 3;
// what can carry the difference when color can't: a border, a texture,
// struck text, words, a switch knob's position, bolder type
const NON_COLOR_CUES = new Set([
  "outline",
  "pattern",
  "strike",
  "label",
  "position",
  "weight",
]);

/** First declaration of every --custom-property in the token sources. */
export function readTokens(files = TOKEN_FILES, root = ROOT) {
  const tokens = new Map();
  for (const rel of files) {
    const src = fs.readFileSync(path.join(root, rel), "utf8");
    // strip comments so a commented-out declaration can't win
    const clean = src.replace(/\/\*[\s\S]*?\*\//g, "");
    const re = /(--[\w-]+)\s*:\s*([^;{}]+);/g;
    let m;
    while ((m = re.exec(clean))) {
      if (!tokens.has(m[1])) tokens.set(m[1], m[2].replace(/\s+/g, " ").trim());
    }
  }
  return tokens;
}

/** Split on commas that are not inside parentheses. */
function splitArgs(s) {
  const out = [];
  let depth = 0;
  let cur = "";
  for (const ch of s) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      out.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

function fnCall(value, name) {
  const v = value.trim();
  if (!v.startsWith(`${name}(`) || !v.endsWith(")")) return null;
  return splitArgs(v.slice(name.length + 1, -1));
}

/**
 * Resolve a token name or CSS value to { r, g, b, a } for a scheme.
 * Understands var() with fallbacks, light-dark(), and
 * color-mix(in srgb, X N%, transparent). Returns null when it can't.
 */
export function resolveColor(value, scheme, tokens, depth = 0) {
  if (depth > 20 || value === undefined || value === null) return null;
  let v = String(value).trim();
  if (v.startsWith("--")) v = `var(${v})`;
  const direct = parseColor(v);
  if (direct) return direct;
  let args = fnCall(v, "var");
  if (args) {
    if (tokens.has(args[0])) {
      const hit = resolveColor(tokens.get(args[0]), scheme, tokens, depth + 1);
      if (hit) return hit;
    }
    return args.length > 1
      ? resolveColor(args.slice(1).join(", "), scheme, tokens, depth + 1)
      : null;
  }
  args = fnCall(v, "light-dark");
  if (args && args.length === 2) {
    return resolveColor(
      scheme === "dark" ? args[1] : args[0],
      scheme,
      tokens,
      depth + 1,
    );
  }
  args = fnCall(v, "color-mix");
  if (args && args.length === 3 && /^in srgb$/.test(args[0])) {
    const [colorA, pctA] = args[1].split(/\s+(?=[\d.]+%$)/);
    const colorB = args[2].trim();
    const pct = parseFloat(pctA) / 100;
    const a = resolveColor(colorA, scheme, tokens, depth + 1);
    if (!a) return null;
    if (colorB === "transparent")
      return { ...a, a: (a.a === undefined ? 1 : a.a) * pct };
    const b = resolveColor(colorB, scheme, tokens, depth + 1);
    if (!b) return null;
    return {
      r: a.r * pct + b.r * (1 - pct),
      g: a.g * pct + b.g * (1 - pct),
      b: a.b * pct + b.b * (1 - pct),
      a: 1,
    };
  }
  return null;
}

function pick(spec, scheme) {
  return spec && typeof spec === "object" ? spec[scheme] : spec;
}

/**
 * Source snippets a pair's non-color cues depend on. Returns a message for
 * each one that is missing, so deleting a hatch or an underline later turns
 * the pair into a fail instead of a cue that no longer exists.
 */
export function missingEvidence(pair, root = ROOT) {
  const missing = [];
  for (const ev of pair.evidence || []) {
    const file = path.join(root, ev.file);
    if (!fs.existsSync(file)) {
      missing.push(`evidence file not found: ${ev.file}`);
    } else if (!fs.readFileSync(file, "utf8").includes(ev.text)) {
      missing.push(`cue no longer in ${ev.file}: ${ev.text}`);
    }
  }
  return missing;
}

/**
 * Score one pair for one scheme; one row per vision mode. missing is the
 * missingEvidence() result: when any is missing the declared cues don't
 * count.
 */
export function scorePair(pair, scheme, tokens, missing = []) {
  const bgRaw = resolveColor(pick(pair.background, scheme), scheme, tokens);
  if (!bgRaw)
    throw new Error(`${pair.id}: can't resolve background (${scheme})`);
  const bg = composite(bgRaw, { r: 0, g: 0, b: 0, a: 1 });
  const fillOf = (member) => {
    const f = pick(member.fill, scheme);
    if (f === "background") return { color: bg, filled: false };
    const c = resolveColor(f, scheme, tokens);
    if (!c) throw new Error(`${pair.id}: can't resolve ${f} (${scheme})`);
    return { color: composite(c, bg), filled: true };
  };
  const a = fillOf(pair.accept);
  const r = fillOf(pair.reject);
  const cues = missing.length
    ? []
    : [...(pair.accept.cues || []), ...(pair.reject.cues || [])].filter((c) =>
        NON_COLOR_CUES.has(c),
      );
  return MODES.map((mode) => {
    const sa = simulate(a.color, mode);
    const sr = simulate(r.color, mode);
    const sbg = simulate(bg, mode);
    const pairContrast = contrastRatio(sa, sr);
    const problems = [...missing];
    for (const [m, s, label] of [
      [a, sa, pair.accept.label],
      [r, sr, pair.reject.label],
    ]) {
      if (m.filled && contrastRatio(s, sbg) < MIN_CONTRAST && !cues.length) {
        problems.push(`${label} fill under ${MIN_CONTRAST}:1 vs background`);
      }
    }
    let status = "pass";
    if (pairContrast < MIN_CONTRAST) status = cues.length ? "cue" : "fail";
    if (problems.length) status = "fail";
    return {
      mode,
      accept: toHex(sa),
      reject: toHex(sr),
      background: toHex(sbg),
      pairContrast: Number(pairContrast.toFixed(2)),
      deltaE: Number(deltaE2000(sa, sr).toFixed(1)),
      cues,
      problems,
      status,
    };
  });
}

export function runCheck(config, tokens, root = ROOT) {
  return config.pairs.map((pair) => {
    const missing = missingEvidence(pair, root);
    return {
      id: pair.id,
      where: pair.where,
      schemes: Object.fromEntries(
        SCHEMES.map((s) => [s, scorePair(pair, s, tokens, missing)]),
      ),
    };
  });
}

function worst(rows) {
  if (rows.some((r) => r.status === "fail")) return "fail";
  if (rows.some((r) => r.status === "cue")) return "cue";
  return "pass";
}

function toMarkdown(results) {
  const lines = ["# Color vision pair check", ""];
  for (const res of results) {
    const all = [...res.schemes.light, ...res.schemes.dark];
    lines.push(`## ${res.id}: ${worst(all)}`, "", res.where, "");
    lines.push(
      "| scheme | mode | accept | reject | pair contrast | ΔE2000 | result |",
      "| --- | --- | --- | --- | --- | --- | --- |",
    );
    for (const scheme of SCHEMES) {
      for (const row of res.schemes[scheme]) {
        const note = row.problems.length
          ? ` (${row.problems.join("; ")})`
          : row.status === "cue"
            ? ` (${row.cues.join(", ")})`
            : "";
        lines.push(
          `| ${scheme} | ${row.mode} | ${row.accept} | ${row.reject} | ${row.pairContrast}:1 | ${row.deltaE} | ${row.status}${note} |`,
        );
      }
    }
    lines.push("");
  }
  return lines.join("\n");
}

function main() {
  const args = new Set(process.argv.slice(2));
  const config = JSON.parse(
    fs.readFileSync(path.join(__dirname, "vision-pairs.json"), "utf8"),
  );
  const results = runCheck(config, readTokens());
  const failed = results.filter(
    (r) => worst([...r.schemes.light, ...r.schemes.dark]) === "fail",
  );
  if (args.has("--json")) {
    console.log(JSON.stringify(results, null, 2));
  } else if (args.has("--quiet")) {
    // one summary line, plus the full table for anything that fails
    const counts = { pass: 0, cue: 0, fail: 0 };
    results.forEach((r) => {
      counts[worst([...r.schemes.light, ...r.schemes.dark])]++;
    });
    console.log(
      `vision-pairs-check: ${results.length} pairs, ${counts.pass} pass, ${counts.cue} by non-color cue, ${counts.fail} fail`,
    );
    if (failed.length) console.log(toMarkdown(failed));
  } else {
    console.log(toMarkdown(results));
  }
  if (failed.length) {
    console.error(
      `${failed.length} pair(s) fail (hue alone, low contrast or a missing cue): ${failed.map((f) => f.id).join(", ")}`,
    );
    if (args.has("--strict")) process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
