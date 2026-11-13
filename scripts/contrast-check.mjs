#!/usr/bin/env node
/**
 * Color-contrast gate: axe-core's color-contrast rule on element demos, in
 * light and dark mode.
 *
 * Invariant: text in an element's demo meets WCAG AA contrast in both color
 * schemes, or the failure is already listed in scripts/contrast.baseline.json.
 * The baseline only shrinks: it lists today's known failures per element,
 * mode and target, and a pull request may remove entries but never add them.
 *
 * How: the repo's web-dev-server config (web-dev-server.config.mjs) serves the
 * repo locally, never a live site. Each element's demo/index.html is opened in
 * Chromium (Playwright) with prefers-color-scheme light, then dark, reduced
 * motion, and every request that leaves the local server aborted, so the
 * result is the same offline, locally and in CI. Animations are ended and the
 * layout must stop changing before measuring (scripts/lib/demo-runner.mjs
 * waitForSettledRender), so the result does not depend on how fast the
 * runner is. axe-core then runs only the color-contrast rule over the page,
 * shadow DOM included.
 *
 * Palettes: a HAXcms theme can be given any DDD palette (site settings set
 * data-palette on the theme element), and its own colors come from the
 * palette tokens. So for a theme that takes palettes (its demo is a HAXcms
 * site, demo/site.json, and its own source reads --ddd-palette-* tokens or
 * reflects data-palette), the same page is measured again in each color
 * scheme with every palette in the DDD palette registry
 * (elements/d-d-d/lib/DDDPaletteRegistry.js) set on the theme element.
 * Those results use the mode "<scheme>@<palette key>", e.g.
 * "dark@salmon-season"; the palette the demo already shows is the plain
 * "light" / "dark" run and is not measured twice. When the folder ships more
 * than one site theme (elements/haxcms-elements/lib/themes.json), each other
 * theme is switched in on the same demo site (HAXCMS.setTheme) and measured
 * the same way, as "<scheme>@<theme>" and "<scheme>@<theme>:<palette key>".
 *
 * A finding is keyed by element + mode + target, where the target is axe's
 * selector path with positions and digits dropped (scripts/lib/contrast.mjs),
 * and counted per key. A key missing from the baseline, or more nodes than
 * the baseline lists for it, is new and fails.
 *
 *   yarn test:contrast                      demos of element folders changed vs the base branch
 *   yarn test:contrast --base <ref>         compare with another ref (CI passes HEAD^1)
 *   yarn test:contrast --elements a-b,c-d   only these elements
 *   yarn test:contrast --all                every element demo
 *   yarn test:contrast --update-baseline    drop what the checked demos no longer show (only removes)
 *   yarn test:contrast --update-baseline --allow-additions   only add new findings (CI fails a baseline that grew)
 *   yarn test:contrast --check-baseline <ref>   fail if the baseline grew compared with <ref>
 *
 * Exit 1 when a checked demo has a new failure (or the baseline grew), 0
 * otherwise. Demos that do not load are listed as advisory.
 */
import { execFileSync } from "node:child_process";
import console from "node:console";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { changedFiles, changedFolders } from "./lib/i18n-layout.mjs";
import {
  demoElements as listDemoElements,
  launchChromium,
  openDemo,
  runPool,
  startServer,
  waitForSettledRender,
} from "./lib/demo-runner.mjs";
import { DDDPaletteRegistry } from "../elements/d-d-d/lib/DDDPaletteRegistry.js";
import {
  MODES,
  baselineGrowth,
  baselineSize,
  compareToBaseline,
  countViolations,
  mergeResults,
  paletteMode,
  shrinkBaseline,
  sortBaseline,
  takesPalettes,
} from "./lib/contrast.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASELINE_REL = "scripts/contrast.baseline.json";
const BASELINE = path.join(root, BASELINE_REL);
const AXE = path.join(root, "node_modules", "axe-core", "axe.min.js");
const CONCURRENCY = Number(process.env.CONTRAST_CONCURRENCY) || 4;
const PAGE_TIMEOUT = Number(process.env.CONTRAST_PAGE_TIMEOUT) || 45000;
const LIST_LIMIT = 8;
// changes to the check itself re-check every demo
const TOOLING = [
  /^scripts\/contrast/,
  /^scripts\/lib\/contrast\.mjs$/,
  /^scripts\/lib\/demo-runner\.mjs$/,
  /^elements\/d-d-d\/lib\/DDDPaletteRegistry\.js$/,
  /^web-dev-server\.config\.mjs$/,
  /^\.github\/workflows\/contrast\.yml$/,
];

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const option = (name) => {
  const i = argv.indexOf(name);
  return i !== -1 && argv[i + 1] && !argv[i + 1].startsWith("--")
    ? argv[i + 1]
    : null;
};
const UPDATE = flag("--update-baseline");
const ALLOW_ADDITIONS = flag("--allow-additions");
const ALL = flag("--all");
const ELEMENTS = option("--elements");

function git(args) {
  try {
    return execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return null;
  }
}

function findBase() {
  return ["origin/HEAD", "origin/master", "origin/main"].find(
    (ref) => git(["rev-parse", "--verify", "--quiet", ref]) !== null,
  );
}

function parseBaseline(text) {
  try {
    return JSON.parse(text).elements || {};
  } catch {
    return {};
  }
}

function readBaseline() {
  try {
    return parseBaseline(fs.readFileSync(BASELINE, "utf8"));
  } catch {
    return {};
  }
}

function writeBaseline(elements) {
  const data = {
    about:
      "Known color-contrast failures in element demos: element -> mode -> target -> nodes. Shrink-only: generated by yarn test:contrast --update-baseline, which only removes entries. See CONTRIBUTING.md (Color contrast check).",
    elements: sortBaseline(elements),
  };
  fs.writeFileSync(BASELINE, JSON.stringify(data, null, 2) + "\n");
}

/** element folders that have a demo page */
const demoElements = () => listDemoElements(root);

/** the element's own source files (folder root and lib/), as text */
function ownSources(element) {
  const dir = path.join(root, "elements", element);
  const out = [];
  for (const sub of ["", "lib"]) {
    let names = [];
    try {
      names = fs.readdirSync(path.join(dir, sub));
    } catch {
      continue;
    }
    for (const name of names) {
      if (/\.js$/.test(name) && !/\.(min|haxProperties)\./.test(name)) {
        try {
          out.push(fs.readFileSync(path.join(dir, sub, name), "utf8"));
        } catch {
          // unreadable file: not a source
        }
      }
    }
  }
  return out;
}

/** a HAXcms theme demo whose own colors follow the DDD palette */
function isPaletteTheme(element) {
  return (
    fs.existsSync(path.join(root, "elements", element, "demo", "site.json")) &&
    takesPalettes(ownSources(element))
  );
}

/**
 * other site themes the element folder ships, from the theme registry:
 * [{ tag, src }] where src is the module's path on the local server
 */
function siblingThemes(element) {
  let themes = {};
  try {
    themes = JSON.parse(
      fs.readFileSync(
        path.join(root, "elements", "haxcms-elements", "lib", "themes.json"),
        "utf8",
      ),
    );
  } catch {
    return [];
  }
  const prefix = `@haxtheweb/${element}/`;
  return Object.keys(themes)
    .filter(
      (tag) =>
        tag !== element && String(themes[tag].path || "").startsWith(prefix),
    )
    .sort()
    .map((tag) => ({
      tag,
      src: `/elements/${element}/${themes[tag].path.slice(prefix.length)}`,
    }));
}

const PALETTES = DDDPaletteRegistry.map((p) => ({
  key: p.key,
  value: p.dataPalette,
}));

function selectElements(all) {
  if (ELEMENTS) {
    const want = new Set(ELEMENTS.split(",").map((t) => t.trim()));
    return {
      picked: all.filter((e) => want.has(e)),
      why: `--elements (${want.size})`,
    };
  }
  if (ALL) {
    return { picked: all, why: "all element demos" };
  }
  const base = option("--base") || findBase();
  const files = changedFiles(root, base);
  if (files.some((f) => TOOLING.some((re) => re.test(f)))) {
    return { picked: all, why: "the check itself changed: all element demos" };
  }
  const folders = changedFolders(files);
  return {
    picked: all.filter((e) => folders.has(e)),
    why: `element folders changed vs ${base || "local changes"}: ${[...folders].sort().join(", ") || "none"}`,
  };
}

/** fail the run when the baseline file grew compared with ref */
function checkBaselineShrinkOnly(ref) {
  const before = git(["show", `${ref}:${BASELINE_REL}`]);
  if (before === null) {
    console.log(
      `contrast: no ${BASELINE_REL} at ${ref}; nothing to compare (first baseline).`,
    );
    return 0;
  }
  const grown = baselineGrowth(parseBaseline(before), readBaseline());
  if (!grown.length) {
    console.log(`contrast: ${BASELINE_REL} did not grow compared with ${ref}.`);
    return 0;
  }
  console.log(
    `\n${BASELINE_REL} grew compared with ${ref} (${grown.length} entr${grown.length === 1 ? "y" : "ies"}). The baseline only shrinks: fix the contrast instead.`,
  );
  grown
    .slice(0, 40)
    .forEach((g) =>
      console.log(
        `  ${g.element}  ${g.mode}  ${g.key}  (${g.baseline} -> ${g.count})`,
      ),
    );
  return 1;
}

// runs in the page: axe's color-contrast rule over the whole document
async function runContrastRule() {
  const res = await globalThis.axe.run(document, {
    runOnly: { type: "rule", values: ["color-contrast"] },
    resultTypes: ["violations"],
  });
  return res.violations.map((v) => ({
    id: v.id,
    nodes: v.nodes.map((n) => ({ target: n.target })),
  }));
}

// runs in the page: set a palette on the site's theme element and wait for
// it to render; false when the page has no theme element
async function applyPalette(value) {
  const theme = document.querySelector(".haxcms-theme-element");
  if (!theme) {
    return false;
  }
  theme.setAttribute("data-palette", value);
  if (theme.updateComplete) {
    await theme.updateComplete;
  }
  await new Promise((r) =>
    requestAnimationFrame(() => requestAnimationFrame(r)),
  );
  return true;
}

// runs in the page: load another site theme's module, switch the demo site
// to it and wait for it to be the rendered theme element; false when it
// never arrives
async function switchTheme({ tag, src }) {
  if (!globalThis.HAXCMS || typeof globalThis.HAXCMS.setTheme !== "function") {
    return false;
  }
  await import(src);
  globalThis.HAXCMS.setTheme(tag);
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    const theme = document.querySelector(".haxcms-theme-element");
    if (
      theme &&
      theme.localName === tag &&
      globalThis.customElements.get(tag) &&
      theme.shadowRoot
    ) {
      if (theme.updateComplete) {
        await theme.updateComplete;
      }
      return true;
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  return false;
}

/**
 * the theme's own palette run is the plain mode; every other registry
 * palette is applied to the theme element and measured as scheme@key
 * (scheme@theme:key for a sibling theme)
 */
async function auditPalettes(page, scheme, theme) {
  const current = await page.evaluate(() => {
    const theme = document.querySelector(".haxcms-theme-element");
    return theme ? theme.getAttribute("data-palette") : null;
  });
  const out = {};
  for (const palette of PALETTES) {
    if (
      current !== null &&
      (current === palette.value || current === palette.key)
    ) {
      continue;
    }
    const applied = await page.evaluate(applyPalette, palette.value);
    if (!applied) {
      return out;
    }
    await waitForSettledRender(page);
    out[paletteMode(scheme, palette.key, theme)] = countViolations(
      await page.evaluate(runContrastRule),
    );
  }
  return out;
}

async function auditDemo(browser, origin, element, mode, axeSource, palettes) {
  const context = await browser.newContext({
    colorScheme: mode,
    reducedMotion: "reduce",
    viewport: { width: 1280, height: 900 },
  });
  try {
    // measured at rest: animations ended, late renders landed
    const page = await openDemo(context, origin, element, PAGE_TIMEOUT, {
      settled: true,
    });
    await page.addScriptTag({ content: axeSource });
    const counts = {
      [mode]: countViolations(await page.evaluate(runContrastRule)),
    };
    if (palettes) {
      Object.assign(counts, await auditPalettes(page, mode, null));
      for (const theme of palettes.siblings) {
        if (!(await page.evaluate(switchTheme, theme))) {
          throw new Error(`site theme ${theme.tag} did not render on the demo`);
        }
        await waitForSettledRender(page);
        counts[paletteMode(mode, null, theme.tag)] = countViolations(
          await page.evaluate(runContrastRule),
        );
        Object.assign(counts, await auditPalettes(page, mode, theme.tag));
      }
    }
    return { counts };
  } catch (e) {
    return { error: String((e && e.message) || e).split("\n")[0] };
  } finally {
    await context.close().catch(() => {});
  }
}

async function runAudits(picked) {
  const axeSource = fs.readFileSync(AXE, "utf8");
  const browser = await launchChromium(process.env.CONTRAST_CHROMIUM);
  let server;
  let origin;
  try {
    ({ server, origin } = await startServer(
      root,
      Number(process.env.CONTRAST_PORT) || 8765,
    ));
  } catch (e) {
    await browser.close().catch(() => {});
    throw e;
  }
  const jobs = [];
  const paletteThemes = picked.filter(isPaletteTheme);
  for (const element of picked) {
    const palettes = paletteThemes.includes(element)
      ? { siblings: siblingThemes(element) }
      : null;
    for (const mode of MODES) {
      jobs.push({ element, mode, palettes });
    }
  }
  console.log(
    `contrast: ${picked.length} demo(s) x ${MODES.length} modes in Chromium (${origin})`,
  );
  if (paletteThemes.length) {
    console.log(
      `contrast: palette themes, also measured in each of ${PALETTES.length} DDD palettes: ${paletteThemes
        .map((e) => {
          const more = siblingThemes(e);
          return more.length
            ? `${e} (+ ${more.map((t) => t.tag).join(", ")})`
            : e;
        })
        .join(", ")}`,
    );
  }
  const results = {};
  const errors = {};
  try {
    await runPool(
      jobs,
      CONCURRENCY,
      async ({ element, mode, palettes }) => {
        const r = await auditDemo(
          browser,
          origin,
          element,
          mode,
          axeSource,
          palettes,
        );
        if (r.error) {
          errors[element] = errors[element] || {};
          errors[element][mode] = r.error;
        } else {
          results[element] = Object.assign(results[element] || {}, r.counts);
        }
      },
      "contrast",
    );
  } finally {
    await browser.close().catch(() => {});
    await server.stop().catch(() => {});
  }
  // an element is only compared (or shrunk) when both modes ran
  for (const element of Object.keys(errors)) {
    delete results[element];
  }
  return { results, errors };
}

function line(out, text) {
  console.log(text);
  out.push(text);
}

function listItems(out, items) {
  const byElement = {};
  for (const i of items) {
    (byElement[`${i.element}  ${i.mode}`] =
      byElement[`${i.element}  ${i.mode}`] || []).push(i);
  }
  for (const head of Object.keys(byElement)) {
    const list = byElement[head];
    line(out, `  ${head}  (${list.reduce((n, i) => n + i.count, 0)} node(s))`);
    list
      .slice(0, LIST_LIMIT)
      .forEach((i) =>
        line(
          out,
          `      ${i.key}${i.baseline ? `  (${i.count}, baseline ${i.baseline})` : ""}`,
        ),
      );
    if (list.length > LIST_LIMIT) {
      line(out, `      ...and ${list.length - LIST_LIMIT} more`);
    }
  }
}

async function main() {
  const shrinkRef = option("--check-baseline");
  if (shrinkRef) {
    return checkBaselineShrinkOnly(shrinkRef);
  }
  const { picked, why } = selectElements(demoElements());
  console.log(`contrast: ${why}`);
  if (!picked.length) {
    console.log("contrast: no element demos to check.");
    return 0;
  }
  const first = await runAudits(picked);
  const errors = first.errors;
  let results = first.results;
  const baseline = readBaseline();
  const out = [];

  if (UPDATE) {
    // a second run, so an entry only leaves the baseline when neither run
    // saw it, and only enters it (--allow-additions) when either did
    console.log("contrast: second run, so load-timing findings are kept");
    const second = await runAudits(Object.keys(results));
    results = mergeResults(results, second.results, Math.max);
    const before = baselineSize(baseline);
    const next = shrinkBaseline(baseline, results, {
      allowAdditions: ALLOW_ADDITIONS,
    });
    writeBaseline(next);
    const grown = baselineGrowth(baseline, next);
    console.log(
      `contrast: baseline ${before} -> ${baselineSize(next)} node(s) for ${Object.keys(results).length} checked demo(s)${ALLOW_ADDITIONS ? `, ${grown.length} entr${grown.length === 1 ? "y" : "ies"} added (--allow-additions)` : " (only removes; --allow-additions only adds)"}.`,
    );
    const errNames = Object.keys(errors);
    if (errNames.length) {
      console.log(
        `contrast: left unchanged for ${errNames.length} demo(s) that did not load: ${errNames.join(", ")}`,
      );
    }
    return 0;
  }

  let { fresh, known, fixed } = compareToBaseline(results, baseline);
  if (fresh.length) {
    // re-check the demos with new findings: a finding only counts when both
    // runs show it, so one that depends on load timing does not fail a build
    const again = [...new Set(fresh.map((f) => f.element))];
    console.log(
      `contrast: re-checking ${again.length} demo(s) with new findings: ${again.join(", ")}`,
    );
    const second = await runAudits(again);
    const merged = mergeResults(results, second.results, Math.min);
    for (const element of again) {
      if (merged[element]) {
        results[element] = merged[element];
      }
    }
    ({ fresh, known, fixed } = compareToBaseline(results, baseline));
  }
  if (known.length) {
    line(
      out,
      `\nAdvisory: ${known.reduce((n, k) => n + k.count, 0)} baselined contrast failure(s) in the checked demos (work these down):`,
    );
    listItems(out, known);
  }
  const errNames = Object.keys(errors);
  if (errNames.length) {
    line(
      out,
      `\nAdvisory: ${errNames.length} demo(s) did not load and were not checked:`,
    );
    errNames.forEach((e) =>
      line(
        out,
        `  ${e}: ${Object.keys(errors[e])
          .map((m) => `${m}: ${errors[e][m]}`)
          .join("; ")}`,
      ),
    );
  }
  if (fixed.length) {
    const names = [...new Set(fixed.map((f) => f.element))].join(",");
    line(
      out,
      `\nFixed since the baseline (run yarn test:contrast --update-baseline --elements ${names} and commit the smaller baseline):`,
    );
    listItems(out, fixed);
  }
  if (fresh.length) {
    line(
      out,
      `\nNEW color-contrast failures (${fresh.reduce((n, f) => n + f.count - f.baseline, 0)} node(s)), text below WCAG AA 4.5:1 (3:1 for large text):`,
    );
    listItems(out, fresh);
  }
  line(
    out,
    `\ncontrast: ${Object.keys(results).length} demo(s) checked in light and dark (palette themes in every DDD palette), ${fresh.length} new, ${known.length} baselined, ${fixed.length} fixed.`,
  );
  if (process.env.GITHUB_STEP_SUMMARY) {
    try {
      fs.appendFileSync(
        process.env.GITHUB_STEP_SUMMARY,
        `## Color contrast (light and dark)\n\n\`\`\`\n${out.join("\n").trim()}\n\`\`\`\n`,
      );
    } catch {
      // the summary is a convenience
    }
  }
  return fresh.length ? 1 : 0;
}

main().then(
  (code) => process.exit(code),
  (e) => {
    console.error(`contrast: ${(e && e.stack) || e}`);
    process.exit(1);
  },
);
