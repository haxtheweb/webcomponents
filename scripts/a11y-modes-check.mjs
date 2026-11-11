#!/usr/bin/env node
/**
 * Forced colors, focus visibility, reflow and target size gate on element
 * demos.
 *
 * Invariant: an element in a changed folder stays usable in Windows high
 * contrast (forced colors), keeps a visible focus indicator in forced colors
 * and in dark mode, reflows to 320 CSS px (WCAG 1.4.10), and gives pointer
 * targets 24x24 CSS px or the spacing to match (WCAG 2.5.8 AA); or the
 * failure is already listed in scripts/a11y-modes.baseline.json. The
 * baseline only shrinks.
 *
 * How: each changed element's demo/index.html opens in Chromium with
 * reducedMotion "reduce", served locally with every outside request
 * aborted, in three contexts:
 *   forced   1280x900, forcedColors "active", colorScheme dark (the black
 *            high contrast palette, where dark hard-coded fills vanish)
 *   dark     1280x900, colorScheme dark: the reference for what is visible
 *            without forced colors, and the wide reference for reflow
 *   reflow   320x640, colorScheme light: 1280 CSS px at 400% zoom
 * The element's own tags are the ones whose customElements.define ran from
 * a module in its folder (the dark mode gate's tracking); a part belongs to
 * the own tag that is it, or whose shadow root it sits in. Light DOM
 * children belong to the demo and are not judged.
 *
 * Rules (each a baseline group; keys name the tag, then the part by tag
 * name and first class, "<tag> >> <part>.<class>"):
 *   forced-focus     up to 4 focusable parts of the first visible instance
 *                    of each own tag (60 per demo) are focused with
 *                    :focus-visible; under forced colors fewer than 4
 *                    pixels around the part change by 3:1 or more. Usual
 *                    cause: a focus ring drawn with box-shadow or a
 *                    background, which forced colors removes. Use an
 *                    outline (outline: 2px solid transparent shows as a
 *                    system color in forced colors).
 *   dark-focus       the same measure in dark mode (no forced colors): the
 *                    focus indicator is missing or under 3:1 against what
 *                    it replaces (WCAG 1.4.11 / 2.4.7).
 *   forced-invisible a focusable part that can be seen in dark mode (some
 *                    pixel inside it at 1.5:1 or more against its
 *                    surroundings) shows nothing under forced colors: a
 *                    control drawn only with backgrounds or box-shadows.
 *                    Give it a border, outline or text.
 *   forced-icon      an inline <svg> or *icon* element (8 to 96 px) in an
 *                    own shadow root that reaches 3:1 in dark mode drops
 *                    under 3:1 under forced colors: a hard-coded fill or
 *                    color. Use fill: currentColor, or set colors under
 *                    @media (forced-colors: active) (or
 *                    forced-color-adjust: none with system colors).
 *   reflow-overflow  at 320 px the page scrolls sideways and an own part
 *                    (the outermost one) sticks out past the right edge.
 *   reflow-clipped   at 320 px an overflow: hidden/clip box cuts off own
 *                    text that the 1280 px run shows whole (so carousels
 *                    and truncation that happen at any width are not
 *                    reflow findings).
 *   reflow-overlap   at 320 px two own text runs overlap that do not at
 *                    1280 px.
 *   target-size      in the dark run, an own target (a native control or
 *                    an element with an interactive role or tabindex)
 *                    under 24x24 whose 24px circle meets another target or
 *                    another undersized target's circle. Exempt: inline
 *                    targets in a sentence, user agent sized checkboxes
 *                    and radios, visually hidden ones (2px or less), and a
 *                    wrapper around another target (the inner one counts).
 * Reflow leaves out content that needs two dimensions (WCAG 1.4.10
 * exception): parts inside table, pre, code, img, svg, video, iframe,
 * canvas, math, grid/table/img/application roles, or a tag named like
 * code/editor/map/table/chart/video/player/image (see TWO_D_* in
 * scripts/lib/a11y-modes.mjs). Focus is judged only on a part that can
 * be seen at rest, renders the same in two shots 60ms apart, is not
 * covered by something else, and where focus lands and matches
 * :focus-visible. Every key is recorded once per demo (presence, not a
 * count). A demo with new findings is run again and only what both runs
 * show counts.
 *
 * Shared with the other demo gates: scripts/lib/demo-runner.mjs (server,
 * Chromium, demo loading) and scripts/lib/gate-baseline.mjs (baseline).
 *
 *   yarn test:a11y-modes                      demos of element folders changed vs the base branch
 *   yarn test:a11y-modes --base <ref>         compare with another ref (CI passes HEAD^1)
 *   yarn test:a11y-modes --elements a-b,c-d   only these elements
 *   yarn test:a11y-modes --all                every element demo
 *   yarn test:a11y-modes --update-baseline    drop what the checked demos no longer show (only removes)
 *   yarn test:a11y-modes --update-baseline --allow-additions   only add (CI fails a baseline that grew)
 *   yarn test:a11y-modes --check-baseline <ref>   fail if the baseline grew compared with <ref>
 *   A11Y_MODES_DUMP=<file> yarn test:a11y-modes ...   also write the raw measurements, for tuning the rules
 *
 * Exit 1 on a new failure (or a grown baseline), 0 otherwise. Demos that do
 * not load are listed as advisory. hal-9000 is skipped (its demo drives
 * speech recognition and is being reworked for headless runs).
 */
import { execFileSync } from "node:child_process";
import console from "node:console";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { changedFiles, changedFolders } from "./lib/i18n-layout.mjs";
import {
  demoElements,
  launchChromium,
  openDemo,
  runPool,
  startServer,
} from "./lib/demo-runner.mjs";
import {
  baselineGrowth,
  baselineSize,
  compareToBaseline,
  mergeResults,
  shrinkBaseline,
  sortBaseline,
} from "./lib/gate-baseline.mjs";
import { pageInit } from "./lib/dark-motion.mjs";
import {
  TWO_D_SELECTOR,
  TWO_D_TAG,
  VISIBLE_CONTRAST,
  decodePng,
  findings,
  focusChange,
  pageBlur,
  pageClip,
  pageControls,
  pageFocus,
  pageIcons,
  pageReflow,
  pageSetup,
  pageTargetList,
  visibility,
} from "./lib/a11y-modes.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASELINE_REL = "scripts/a11y-modes.baseline.json";
const BASELINE = path.join(root, BASELINE_REL);
const CONCURRENCY = Number(process.env.A11Y_MODES_CONCURRENCY) || 4;
const PAGE_TIMEOUT = Number(process.env.A11Y_MODES_PAGE_TIMEOUT) || 45000;
const LIST_LIMIT = 8;
// demos this gate does not open (each with the reason, in the header)
const SKIP = new Set(["hal-9000"]);
const PER_TAG = 4;
const CONTROL_CAP = 60;
const ICON_CAP = 40;
const MODES = {
  forced: {
    colorScheme: "dark",
    forcedColors: "active",
    viewport: { width: 1280, height: 900 },
  },
  dark: {
    colorScheme: "dark",
    forcedColors: "none",
    viewport: { width: 1280, height: 900 },
  },
  reflow: {
    colorScheme: "light",
    forcedColors: "none",
    viewport: { width: 320, height: 640 },
  },
};
const CHECKS = {
  "forced-focus":
    "focus shows nothing under forced colors (draw the focus ring with outline, not box-shadow or background)",
  "dark-focus":
    "focus indicator is missing or under 3:1 in dark mode (use the DDD focus tokens, which switch with the color scheme)",
  "forced-invisible":
    "a control that shows in dark mode disappears under forced colors (give it a border, outline or text)",
  "forced-icon":
    "an icon drops under 3:1 under forced colors (fill: currentColor, or system colors under @media (forced-colors: active))",
  "reflow-overflow":
    "at 320 CSS px the page scrolls sideways because of this part (let it wrap or shrink: max-width: 100%, flex-wrap, min-width: 0)",
  "reflow-clipped":
    "at 320 CSS px this text is cut off by an overflow: hidden box (let the box grow or wrap)",
  "reflow-overlap":
    "at 320 CSS px these texts overlap (avoid fixed heights and absolute positioning for text)",
  "target-size":
    "pointer target under 24x24 CSS px without 24px spacing (WCAG 2.5.8: make it bigger or space it out)",
};
// changes to the check itself re-check every demo
const TOOLING = [
  /^scripts\/a11y-modes/,
  /^scripts\/lib\/a11y-modes\.mjs$/,
  /^scripts\/lib\/dark-motion\.mjs$/,
  /^scripts\/lib\/demo-runner\.mjs$/,
  /^scripts\/lib\/gate-baseline\.mjs$/,
  /^web-dev-server\.config\.mjs$/,
  /^\.github\/workflows\/a11y-modes\.yml$/,
];

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const option = (name) => {
  const i = argv.indexOf(name);
  return i !== -1 && argv[i + 1] && !argv[i + 1].startsWith("--")
    ? argv[i + 1]
    : null;
};

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
      "Known forced colors, focus visibility, reflow and target size failures in element demos: element -> check -> key -> 1. Shrink-only: generated by yarn test:a11y-modes --update-baseline, which only removes entries. See CONTRIBUTING.md (Forced colors, reflow and target size check).",
    elements: sortBaseline(elements),
  };
  fs.writeFileSync(BASELINE, JSON.stringify(data, null, 2) + "\n");
}

function selectElements(all) {
  const wanted = option("--elements");
  if (wanted) {
    const want = new Set(wanted.split(",").map((t) => t.trim()));
    return {
      picked: all.filter((e) => want.has(e)),
      why: `--elements (${want.size})`,
    };
  }
  if (flag("--all")) {
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

function checkBaselineShrinkOnly(ref) {
  const before = git(["show", `${ref}:${BASELINE_REL}`]);
  if (before === null) {
    console.log(
      `a11y-modes: no ${BASELINE_REL} at ${ref}; nothing to compare (first baseline).`,
    );
    return 0;
  }
  const grown = baselineGrowth(parseBaseline(before), readBaseline());
  if (!grown.length) {
    console.log(
      `a11y-modes: ${BASELINE_REL} did not grow compared with ${ref}.`,
    );
    return 0;
  }
  console.log(
    `\n${BASELINE_REL} grew compared with ${ref} (${grown.length} entr${grown.length === 1 ? "y" : "ies"}). The baseline only shrinks: fix the element instead.`,
  );
  grown
    .slice(0, 40)
    .forEach((g) =>
      console.log(
        `  ${g.element}  ${g.group}  ${g.key}  (${g.baseline} -> ${g.count})`,
      ),
    );
  return 1;
}

async function shot(page, clip) {
  return decodePng(
    await page.screenshot({ clip, animations: "disabled", caret: "hide" }),
  );
}

/** scroll part i of a list into view, let it settle, then measure it */
async function clipOf(page, list, i, pad) {
  const there = await page.evaluate(pageClip, { list, i, pad, scroll: true });
  if (!there) {
    return null;
  }
  await page.waitForTimeout(60);
  return page.evaluate(pageClip, { list, i, pad, scroll: false });
}

/**
 * Focus each control: how visible it is at rest and how many pixels focus
 * changes by 3:1. Focus is only judged on a control that can be seen at
 * rest and renders the same twice in a row (no animation or late paint).
 */
async function measureControls(page) {
  const keys = await page.evaluate(pageControls, {
    perTag: PER_TAG,
    cap: CONTROL_CAP,
  });
  const out = [];
  for (let i = 0; i < keys.length; i++) {
    const at = await clipOf(page, "controls", i, 6);
    if (!at) {
      out.push({ key: keys[i] });
      continue;
    }
    const before = await shot(page, at.clip);
    const visible = visibility(before, at.inner);
    let change = null;
    await page.waitForTimeout(60);
    const steady = focusChange(before, await shot(page, at.clip)) === 0;
    if (steady && visible >= VISIBLE_CONTRAST) {
      const f = await page.evaluate(pageFocus, i);
      if (f.ok) {
        await page.waitForTimeout(60);
        change = focusChange(before, await shot(page, at.clip));
      }
      await page.evaluate(pageBlur);
    }
    out.push({ key: keys[i], visible, change });
  }
  return out;
}

async function measureIcons(page) {
  const keys = await page.evaluate(pageIcons, {
    perTag: PER_TAG,
    cap: ICON_CAP,
  });
  const out = [];
  for (let i = 0; i < keys.length; i++) {
    const at = await clipOf(page, "icons", i, 3);
    out.push({
      key: keys[i],
      visible: at ? visibility(await shot(page, at.clip), at.inner) : null,
    });
  }
  return out;
}

/**
 * Many demos never set a page background, so dark mode would show them on
 * white. A dark-mode page is dark: this style goes first in <head>, so any
 * background the demo sets still wins.
 */
function darkPage() {
  document.addEventListener("DOMContentLoaded", () => {
    const style = document.createElement("style");
    style.textContent =
      ":root{color-scheme:light dark}body{background-color:Canvas;color:CanvasText}";
    document.head.prepend(style);
  });
}

/** one demo in one mode */
async function runDemo(browser, origin, element, mode) {
  const context = await browser.newContext({
    ...MODES[mode],
    reducedMotion: "reduce",
    deviceScaleFactor: 1,
  });
  try {
    await context.addInitScript(pageInit);
    if (mode === "dark") {
      await context.addInitScript(darkPage);
    }
    const page = await openDemo(context, origin, element, PAGE_TIMEOUT, {
      settled: true,
    });
    // keyboard modality, so programmatic focus matches :focus-visible
    await page.keyboard.press("Shift");
    await page.mouse.move(0, 0);
    const tags = await page.evaluate(pageSetup, element);
    const r = { tags };
    const twoD = { twoDSelector: TWO_D_SELECTOR, twoDTag: TWO_D_TAG };
    if (mode === "reflow") {
      r.reflow = await page.evaluate(pageReflow, twoD);
      return r;
    }
    if (mode === "dark") {
      // layout before anything is focused or scrolled
      r.reflow = await page.evaluate(pageReflow, twoD);
      r.targets = await page.evaluate(pageTargetList);
    }
    r.controls = await measureControls(page);
    r.icons = await measureIcons(page);
    return r;
  } catch (e) {
    return { error: String((e && e.message) || e).split("\n")[0] };
  } finally {
    await context.close().catch(() => {});
  }
}

async function runAll(picked) {
  const browser = await launchChromium(process.env.A11Y_MODES_CHROMIUM);
  let server;
  let origin;
  try {
    ({ server, origin } = await startServer(
      root,
      Number(process.env.A11Y_MODES_PORT) || 8767,
    ));
  } catch (e) {
    await browser.close().catch(() => {});
    throw e;
  }
  const jobs = [];
  for (const element of picked) {
    for (const mode of Object.keys(MODES)) {
      jobs.push({ element, mode });
    }
  }
  console.log(
    `a11y-modes: ${picked.length} demo(s) x forced colors, dark and 320px in Chromium (${origin})`,
  );
  const runs = {};
  const errors = {};
  try {
    await runPool(
      jobs,
      CONCURRENCY,
      async ({ element, mode }) => {
        const r = await runDemo(browser, origin, element, mode);
        if (r.error) {
          errors[element] = `${mode}: ${r.error}`;
        } else {
          runs[element] = runs[element] || {};
          runs[element][mode] = r;
        }
      },
      "a11y-modes",
    );
  } finally {
    await browser.close().catch(() => {});
    await server.stop().catch(() => {});
  }
  if (process.env.A11Y_MODES_DUMP) {
    // raw measurements, for tuning the rules
    const dump = process.env.A11Y_MODES_DUMP;
    fs.writeFileSync(
      fs.existsSync(dump) ? `${dump}.again.json` : dump,
      JSON.stringify(runs, null, 1),
    );
  }
  const results = {};
  for (const element of Object.keys(runs)) {
    const r = runs[element];
    if (errors[element] || !r.forced || !r.dark || !r.reflow) {
      continue;
    }
    results[element] = findings(r);
  }
  return { results, errors };
}

function line(out, text) {
  console.log(text);
  out.push(text);
}

function listItems(out, items) {
  const by = {};
  for (const i of items) {
    (by[`${i.element}  ${i.group}`] =
      by[`${i.element}  ${i.group}`] || []).push(i);
  }
  for (const head of Object.keys(by)) {
    line(out, `  ${head}`);
    by[head].slice(0, LIST_LIMIT).forEach((i) => line(out, `      ${i.key}`));
    if (by[head].length > LIST_LIMIT) {
      line(out, `      ...and ${by[head].length - LIST_LIMIT} more`);
    }
  }
}

async function main() {
  const shrinkRef = option("--check-baseline");
  if (shrinkRef) {
    return checkBaselineShrinkOnly(shrinkRef);
  }
  const all = demoElements(root);
  const { picked: chosen, why } = selectElements(all);
  const picked = chosen.filter((e) => !SKIP.has(e));
  console.log(`a11y-modes: ${why}`);
  if (picked.length < chosen.length) {
    console.log(
      `a11y-modes: skipped ${chosen.filter((e) => SKIP.has(e)).join(", ")}`,
    );
  }
  if (!picked.length) {
    console.log("a11y-modes: no element demos to check.");
    return 0;
  }
  const first = await runAll(picked);
  const errors = first.errors;
  let results = first.results;
  const baseline = readBaseline();
  const out = [];

  if (flag("--update-baseline")) {
    // a second run: an entry only leaves the baseline when neither run saw
    // it, and only enters it (--allow-additions) when either did
    console.log(
      "a11y-modes: second run, so timing-dependent findings are kept",
    );
    const second = await runAll(Object.keys(results));
    results = mergeResults(results, second.results, Math.max);
    const allow = flag("--allow-additions");
    const next = shrinkBaseline(baseline, results, { allowAdditions: allow });
    writeBaseline(next);
    console.log(
      `a11y-modes: baseline ${baselineSize(baseline)} -> ${baselineSize(next)} for ${Object.keys(results).length} checked demo(s)${allow ? `, ${baselineGrowth(baseline, next).length} added (--allow-additions)` : " (only removes; --allow-additions only adds)"}.`,
    );
    const errNames = Object.keys(errors);
    if (errNames.length) {
      console.log(
        `a11y-modes: left unchanged for ${errNames.length} demo(s) that did not load: ${errNames.join(", ")}`,
      );
    }
    return 0;
  }

  let { fresh, known, fixed } = compareToBaseline(results, baseline);
  if (fresh.length) {
    // a finding only counts when a second run shows it too
    const again = [...new Set(fresh.map((f) => f.element))];
    console.log(
      `a11y-modes: re-checking ${again.length} demo(s) with new findings: ${again.join(", ")}`,
    );
    const second = await runAll(again);
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
      `\nAdvisory: ${known.length} baselined forced colors / focus / reflow / target size failure(s) in the checked demos (work these down):`,
    );
    listItems(out, known);
  }
  const errNames = Object.keys(errors);
  if (errNames.length) {
    line(
      out,
      `\nAdvisory: ${errNames.length} demo(s) did not load and were not checked:`,
    );
    errNames.forEach((e) => line(out, `  ${e}: ${errors[e]}`));
  }
  if (fixed.length) {
    const names = [...new Set(fixed.map((f) => f.element))].join(",");
    line(
      out,
      `\nFixed since the baseline (run yarn test:a11y-modes --update-baseline --elements ${names} and commit the smaller baseline):`,
    );
    listItems(out, fixed);
  }
  if (fresh.length) {
    line(out, `\nNEW forced colors / focus / reflow / target size failures:`);
    listItems(out, fresh);
    [...new Set(fresh.map((f) => f.group))].forEach((g) =>
      line(out, `  ${g}: ${CHECKS[g] || g}`),
    );
  }
  line(
    out,
    `\na11y-modes: ${Object.keys(results).length} demo(s) checked, ${fresh.length} new, ${known.length} baselined, ${fixed.length} fixed.`,
  );
  if (process.env.GITHUB_STEP_SUMMARY) {
    try {
      fs.appendFileSync(
        process.env.GITHUB_STEP_SUMMARY,
        `## Forced colors, focus, reflow and target size\n\n\`\`\`\n${out.join("\n").trim()}\n\`\`\`\n`,
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
    console.error(`a11y-modes: ${(e && e.stack) || e}`);
    process.exit(1);
  },
);
