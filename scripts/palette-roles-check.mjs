#!/usr/bin/env node
/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Palette roles gate: the DDD palette's own color pairings, measured in a
 * real browser in every palette, in light and dark, under DDD and under
 * every bridged design system.
 *
 * Invariants:
 *   link      --ddd-palette-link reads at 4.5:1 or better on the page
 *             surface (light: white and limestone max light; dark: coaly
 *             gray and potential midnight) in every palette, scheme and
 *             design system, and so do its halves on their own surfaces in
 *             both schemes (--ddd-palette-link-on-light on the light ones,
 *             --ddd-palette-link-on-dark on the dark ones). Themes and
 *             elements color links and other palette text with them, so
 *             they may never fail.
 *   pairs     each "text on color" pairing a palette declares reads at
 *             4.5:1: --ddd-palette-text-color-N on --ddd-palette-color-N,
 *             --ddd-palette-accent-ink on --ddd-palette-accent and
 *             --ddd-palette-chip-ink on --ddd-palette-chip.
 *
 * Tokens are resolved where they are used (light-dark(), relative color
 * syntax and a bridge's remapped colors only settle in the browser), on a
 * probe inside an element carrying data-palette, so the result is what a
 * theme or block gets. Link failures always fail the run. Pair failures that
 * already exist are listed in scripts/palette-roles.baseline.json (system ->
 * mode -> pair -> ratio) and only new ones fail; the baseline only shrinks.
 *
 * Usage:
 *   node scripts/palette-roles-check.mjs                    DDD and every design system
 *   node scripts/palette-roles-check.mjs --design-system ddd,carbon
 *   node scripts/palette-roles-check.mjs --all              list every pair measured
 *   node scripts/palette-roles-check.mjs --json out.json    write the measurements
 *   node scripts/palette-roles-check.mjs --update-baseline  drop what is fixed (only removes)
 */
import console from "node:console";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { DDDPaletteRegistry } from "../elements/d-d-d/lib/DDDPaletteRegistry.js";
import {
  launchChromium,
  openPage,
  startServer,
  waitForSettledRender,
} from "./lib/demo-runner.mjs";
import {
  activateDesignSystemInPage,
  listDesignSystems,
} from "./lib/design-systems.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASELINE = path.join(root, "scripts", "palette-roles.baseline.json");
const PAGE = "/elements/d-d-d/demo/palette-roles.html";
const SCHEMES = ["light", "dark"];
const TEXT_MIN = 4.5;
const PAGE_TIMEOUT = Number(process.env.CONTRAST_PAGE_TIMEOUT) || 45000;

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const option = (name) => {
  const i = argv.indexOf(name);
  return i !== -1 && argv[i + 1] && !argv[i + 1].startsWith("--")
    ? argv[i + 1]
    : null;
};

const PALETTES = DDDPaletteRegistry.map((p) => ({
  key: p.key,
  value: p.dataPalette,
}));

/** DDD (null) plus each bridge, or only the ones asked for */
function pickSystems() {
  const all = [{ name: "ddd", title: "DDD" }].concat(listDesignSystems(root));
  const want = option("--design-system");
  if (!want || want === "all") {
    return all;
  }
  const names = want.split(",").map((v) => v.trim());
  const unknown = names.filter((n) => !all.some((s) => s.name === n));
  if (unknown.length) {
    throw new Error(
      `unknown design system: ${unknown.join(", ")} (known: ${all.map((s) => s.name).join(", ")})`,
    );
  }
  return all.filter((s) => names.includes(s.name));
}

// runs in the page: every palette's link and pairs, as contrast ratios
function measurePalettes({ palettes, scheme }) {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const rgba = (value) => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "#000";
    ctx.fillStyle = value;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2], d[3] / 255];
  };
  const channel = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const lum = (c) =>
    0.2126 * channel(c[0]) + 0.7152 * channel(c[1]) + 0.0722 * channel(c[2]);
  const ratio = (a, b) => {
    const x = lum(a);
    const y = lum(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  };
  const over = (top, bottom) => {
    const a = top[3];
    return [
      top[0] * a + bottom[0] * (1 - a),
      top[1] * a + bottom[1] * (1 - a),
      top[2] * a + bottom[2] * (1 - a),
      1,
    ];
  };
  const host = document.createElement("div");
  host.style.colorScheme = scheme;
  document.body.appendChild(host);
  const holder = document.createElement("div");
  host.appendChild(holder);
  const probe = document.createElement("span");
  holder.appendChild(probe);
  const resolve = (token) => {
    probe.style.color = "";
    probe.style.color = `var(${token}, rgba(0, 0, 0, 0))`;
    return rgba(getComputedStyle(probe).color);
  };
  const out = {};
  const lightSurfaces = [
    "--ddd-theme-default-white",
    "--ddd-theme-default-limestoneMaxLight",
  ];
  const darkSurfaces = [
    "--ddd-theme-default-coalyGray",
    "--ddd-theme-default-potentialMidnight",
  ];
  // the link role on the scheme's own page surface, and each half on its
  // surface whatever the scheme
  const links = [
    ["--ddd-palette-link", scheme === "light" ? lightSurfaces : darkSurfaces],
    ["--ddd-palette-link-on-light", lightSurfaces],
    ["--ddd-palette-link-on-dark", darkSurfaces],
  ];
  const pairs = [1, 2, 3, 4, 5, 6, 7]
    .map((n) => [`--ddd-palette-text-color-${n}`, `--ddd-palette-color-${n}`])
    .concat([
      ["--ddd-palette-accent-ink", "--ddd-palette-accent"],
      ["--ddd-palette-chip-ink", "--ddd-palette-chip"],
    ]);
  for (const palette of palettes) {
    holder.setAttribute("data-palette", palette.value);
    const row = { link: {}, pairs: {} };
    for (const [token, surfaces] of links) {
      const link = resolve(token);
      for (const surface of surfaces) {
        const bg = over(resolve(surface), [255, 255, 255, 1]);
        row.link[`${token} on ${surface}`] =
          link[3] > 0 ? ratio(over(link, bg), bg) : 0;
      }
    }
    for (const [fgToken, bgToken] of pairs) {
      const bg = resolve(bgToken);
      const fg = resolve(fgToken);
      if (bg[3] === 0 || fg[3] === 0) {
        continue;
      }
      const solid = over(bg, [255, 255, 255, 1]);
      row.pairs[`${fgToken} on ${bgToken}`] = ratio(over(fg, solid), solid);
    }
    out[palette.key] = row;
  }
  host.remove();
  return out;
}

async function measureSystem(browser, origin, system) {
  const results = {};
  for (const scheme of SCHEMES) {
    const context = await browser.newContext({
      colorScheme: scheme,
      reducedMotion: "reduce",
      viewport: { width: 1024, height: 768 },
    });
    try {
      const page = await openPage(context, origin, PAGE, PAGE_TIMEOUT);
      if (system.src) {
        const active = await page.evaluate(activateDesignSystemInPage, {
          src: system.src,
          activate: system.activate,
          name: system.name,
        });
        if (active !== system.name) {
          throw new Error(`design system ${system.name} did not activate`);
        }
        await waitForSettledRender(page);
      }
      results[scheme] = await page.evaluate(measurePalettes, {
        palettes: PALETTES,
        scheme,
      });
    } finally {
      await context.close().catch(() => {});
    }
  }
  return results;
}

function readBaseline() {
  try {
    return JSON.parse(fs.readFileSync(BASELINE, "utf8")).systems || {};
  } catch {
    return {};
  }
}

function writeBaseline(systems) {
  const sorted = {};
  for (const name of Object.keys(systems).sort()) {
    const modes = systems[name];
    const keep = {};
    for (const mode of Object.keys(modes).sort()) {
      const pairs = modes[mode];
      if (Object.keys(pairs).length) {
        keep[mode] = Object.fromEntries(
          Object.keys(pairs)
            .sort()
            .map((k) => [k, pairs[k]]),
        );
      }
    }
    if (Object.keys(keep).length) {
      sorted[name] = keep;
    }
  }
  fs.writeFileSync(
    BASELINE,
    JSON.stringify(
      {
        about:
          "Known palette pairings under 4.5:1: system -> scheme@palette -> pair -> ratio. Shrink-only: node scripts/palette-roles-check.mjs --update-baseline only removes entries. The link role is never baselined.",
        systems: sorted,
      },
      null,
      2,
    ) + "\n",
  );
}

const round = (n) => Math.round(n * 100) / 100;

async function main() {
  const systems = pickSystems();
  const browser = await launchChromium(process.env.CONTRAST_CHROMIUM);
  const { server, origin } = await startServer(
    root,
    Number(process.env.CONTRAST_PORT) || 8767,
  );
  const report = {};
  try {
    for (const system of systems) {
      report[system.name] = await measureSystem(browser, origin, system);
      console.log(`palette-roles: measured ${system.title}`);
    }
  } finally {
    await browser.close().catch(() => {});
    await server.stop().catch(() => {});
  }
  if (option("--json")) {
    fs.writeFileSync(option("--json"), JSON.stringify(report, null, 2));
  }
  const baseline = readBaseline();
  const linkFails = [];
  const freshPairs = [];
  const current = {};
  let pairFailCount = 0;
  for (const [system, schemes] of Object.entries(report)) {
    current[system] = {};
    for (const [scheme, palettes] of Object.entries(schemes)) {
      for (const [palette, row] of Object.entries(palettes)) {
        const mode = `${scheme}@${palette}`;
        for (const [surface, r] of Object.entries(row.link)) {
          if (r < TEXT_MIN) {
            linkFails.push(`${system} ${mode} ${surface}: ${round(r)}`);
          }
        }
        for (const [pair, r] of Object.entries(row.pairs)) {
          if (flag("--all")) {
            console.log(`  ${system} ${mode} ${pair}: ${round(r)}`);
          }
          if (r >= TEXT_MIN) {
            continue;
          }
          pairFailCount++;
          current[system][mode] = current[system][mode] || {};
          current[system][mode][pair] = round(r);
          const known =
            baseline[system] &&
            baseline[system][mode] &&
            typeof baseline[system][mode][pair] === "number";
          if (!known) {
            freshPairs.push(`${system} ${mode} ${pair}: ${round(r)}`);
          }
        }
      }
    }
  }
  if (flag("--update-baseline")) {
    // shrink only: keep entries that still fail and were already listed
    const next = {};
    for (const [system, modes] of Object.entries(baseline)) {
      for (const [mode, pairs] of Object.entries(modes)) {
        for (const pair of Object.keys(pairs)) {
          const now =
            current[system] && current[system][mode]
              ? current[system][mode][pair]
              : undefined;
          if (typeof now === "number") {
            next[system] = next[system] || {};
            next[system][mode] = next[system][mode] || {};
            next[system][mode][pair] = now;
          }
        }
      }
    }
    if (flag("--allow-additions")) {
      for (const [system, modes] of Object.entries(current)) {
        for (const [mode, pairs] of Object.entries(modes)) {
          for (const [pair, r] of Object.entries(pairs)) {
            next[system] = next[system] || {};
            next[system][mode] = next[system][mode] || {};
            next[system][mode][pair] = r;
          }
        }
      }
    }
    writeBaseline(next);
    console.log(`palette-roles: baseline written (${BASELINE})`);
  }
  console.log(
    `palette-roles: ${systems.length} system(s) x ${SCHEMES.length} schemes x ${PALETTES.length} palettes; link failures ${linkFails.length}; pairs under ${TEXT_MIN}:1 ${pairFailCount} (${freshPairs.length} new)`,
  );
  linkFails.slice(0, 40).forEach((l) => console.log(`  link  ${l}`));
  freshPairs.slice(0, 40).forEach((l) => console.log(`  pair  ${l}`));
  if (freshPairs.length > 40) {
    console.log(`  ...and ${freshPairs.length - 40} more new pairs`);
  }
  return linkFails.length || (freshPairs.length && !flag("--update-baseline"))
    ? 1
    : 0;
}

main().then(
  (code) => process.exit(code),
  (e) => {
    console.error(e);
    process.exit(1);
  },
);
