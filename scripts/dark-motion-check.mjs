#!/usr/bin/env node
/**
 * Dark mode and reduced motion gate on element demos.
 *
 * Invariant: an element in a changed folder (1) responds to dark mode: when
 * it sets colors of its own, they change under prefers-color-scheme: dark or
 * its styles handle dark mode (light-dark(), a prefers-color-scheme query, or
 * an explicit color-scheme), and (2) respects reduced motion: with
 * prefers-reduced-motion: reduce, no CSS animation, transition or
 * element.animate() longer than 10ms runs on it or inside its shadow root
 * after load or on hover/focus; or the failure is already listed in
 * scripts/dark-motion.baseline.json. The baseline only shrinks.
 *
 * Contrast in dark mode is the color-contrast gate's job
 * (scripts/contrast-check.mjs); this one only asks whether the element
 * ignores dark mode. Both share the demo runner (scripts/lib/demo-runner.mjs)
 * and the baseline rules (scripts/lib/gate-baseline.mjs).
 *
 * How: each changed element's demo/index.html opens in Chromium with
 * reducedMotion "reduce", once with colorScheme light and once dark, served
 * locally with every outside request aborted. The element's own tags are the
 * ones whose customElements.define ran from a module in its folder. In the
 * light run the first visible instance of each tag (and up to three
 * focusable parts inside it) is hovered and focused, and every animation
 * seen running from page load on is recorded.
 *
 * Baseline: element folder -> "dark-ignored" -> tag, and element folder ->
 * "motion" -> "<transition|animation|script> <name> on <tag> >> <part>". A demo with new findings is run again and only what both runs
 * show counts.
 *
 *   yarn test:dark-motion                      demos of element folders changed vs the base branch
 *   yarn test:dark-motion --base <ref>         compare with another ref (CI passes HEAD^1)
 *   yarn test:dark-motion --elements a-b,c-d   only these elements
 *   yarn test:dark-motion --all                every element demo
 *   yarn test:dark-motion --update-baseline    drop what the checked demos no longer show (only removes)
 *   yarn test:dark-motion --update-baseline --allow-additions   only add (CI fails a baseline that grew)
 *   yarn test:dark-motion --check-baseline <ref>   fail if the baseline grew compared with <ref>
 *
 * Exit 1 on a new failure (or a grown baseline), 0 otherwise. Demos that do
 * not load are listed as advisory.
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
import {
  MOTION_THRESHOLD_MS,
  darkFindings,
  motionCounts,
  pageCollect,
  pageInit,
  pageTarget,
  pageTargets,
} from "./lib/dark-motion.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASELINE_REL = "scripts/dark-motion.baseline.json";
const BASELINE = path.join(root, BASELINE_REL);
const CONCURRENCY = Number(process.env.DARK_MOTION_CONCURRENCY) || 4;
const PAGE_TIMEOUT = Number(process.env.DARK_MOTION_PAGE_TIMEOUT) || 45000;
const LIST_LIMIT = 8;
const CHECKS = {
  "dark-ignored":
    "sets its own colors and renders them unchanged with prefers-color-scheme: dark (use DDD light-dark tokens, or declare color-scheme if it is meant to look the same)",
  motion:
    "animates for more than 10ms with prefers-reduced-motion: reduce (wrap the animation or transition in @media (prefers-reduced-motion: no-preference), or use DDD motion tokens)",
};
// changes to the check itself re-check every demo
const TOOLING = [
  /^scripts\/dark-motion/,
  /^scripts\/lib\/dark-motion\.mjs$/,
  /^scripts\/lib\/demo-runner\.mjs$/,
  /^scripts\/lib\/gate-baseline\.mjs$/,
  /^web-dev-server\.config\.mjs$/,
  /^\.github\/workflows\/dark-motion\.yml$/,
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
      'Known dark mode and reduced motion failures in element demos: element -> "dark-ignored" -> tag, element -> "motion" -> animation -> count. Shrink-only: generated by yarn test:dark-motion --update-baseline, which only removes entries. See CONTRIBUTING.md (Dark mode and reduced motion check).',
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
      `dark-motion: no ${BASELINE_REL} at ${ref}; nothing to compare (first baseline).`,
    );
    return 0;
  }
  const grown = baselineGrowth(parseBaseline(before), readBaseline());
  if (!grown.length) {
    console.log(
      `dark-motion: ${BASELINE_REL} did not grow compared with ${ref}.`,
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

/** one demo in one color scheme; the light run also hovers and focuses */
async function runDemo(browser, origin, element, mode) {
  const context = await browser.newContext({
    colorScheme: mode,
    reducedMotion: "reduce",
    viewport: { width: 1280, height: 900 },
  });
  try {
    await context.addInitScript(pageInit);
    const page = await openDemo(context, origin, element, PAGE_TIMEOUT);
    const arg = { folder: element, threshold: MOTION_THRESHOLD_MS };
    // colors are read before any hover or focus, so both schemes compare
    // the same resting state
    const atRest = await page.evaluate(pageCollect, arg);
    if (mode === "light") {
      const { targets } = await page.evaluate(pageTargets, element);
      for (let i = 0; i < targets; i++) {
        const at = await page.evaluate(pageTarget, i);
        if (at) {
          await page.mouse.move(at.x, at.y);
        }
        await page.waitForTimeout(80);
        await page.evaluate(() => globalThis.__darkMotion.poll());
      }
      if (targets) {
        // leaving hover and focus can start transitions too
        await page.mouse.move(0, 0);
        await page.evaluate(() => {
          if (document.activeElement) {
            document.activeElement.blur();
          }
        });
        await page.waitForTimeout(80);
      }
    }
    const after = await page.evaluate(pageCollect, arg);
    return { colors: atRest.colors, motion: after.motion };
  } catch (e) {
    return { error: String((e && e.message) || e).split("\n")[0] };
  } finally {
    await context.close().catch(() => {});
  }
}

async function runAll(picked) {
  const browser = await launchChromium(process.env.DARK_MOTION_CHROMIUM);
  let server;
  let origin;
  try {
    ({ server, origin } = await startServer(
      root,
      Number(process.env.DARK_MOTION_PORT) || 8766,
    ));
  } catch (e) {
    await browser.close().catch(() => {});
    throw e;
  }
  const jobs = [];
  for (const element of picked) {
    for (const mode of ["light", "dark"]) {
      jobs.push({ element, mode });
    }
  }
  console.log(
    `dark-motion: ${picked.length} demo(s) x 2 color schemes in Chromium with reduced motion (${origin})`,
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
          errors[element] = r.error;
        } else {
          runs[element] = runs[element] || {};
          runs[element][mode] = r;
        }
      },
      "dark-motion",
    );
  } finally {
    await browser.close().catch(() => {});
    await server.stop().catch(() => {});
  }
  const results = {};
  for (const element of Object.keys(runs)) {
    if (errors[element] || !runs[element].light || !runs[element].dark) {
      continue;
    }
    const { light, dark } = runs[element];
    results[element] = {
      "dark-ignored": darkFindings(light, dark),
      motion: motionCounts(light.motion),
    };
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
    by[head]
      .slice(0, LIST_LIMIT)
      .forEach((i) =>
        line(
          out,
          `      ${i.key}${i.count > 1 || i.baseline ? `  (${i.count}${i.baseline ? `, baseline ${i.baseline}` : ""})` : ""}`,
        ),
      );
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
  const { picked, why } = selectElements(demoElements(root));
  console.log(`dark-motion: ${why}`);
  if (!picked.length) {
    console.log("dark-motion: no element demos to check.");
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
      "dark-motion: second run, so timing-dependent findings are kept",
    );
    const second = await runAll(Object.keys(results));
    results = mergeResults(results, second.results, Math.max);
    const allow = flag("--allow-additions");
    const next = shrinkBaseline(baseline, results, { allowAdditions: allow });
    writeBaseline(next);
    console.log(
      `dark-motion: baseline ${baselineSize(baseline)} -> ${baselineSize(next)} for ${Object.keys(results).length} checked demo(s)${allow ? `, ${baselineGrowth(baseline, next).length} added (--allow-additions)` : " (only removes; --allow-additions only adds)"}.`,
    );
    const errNames = Object.keys(errors);
    if (errNames.length) {
      console.log(
        `dark-motion: left unchanged for ${errNames.length} demo(s) that did not load: ${errNames.join(", ")}`,
      );
    }
    return 0;
  }

  let { fresh, known, fixed } = compareToBaseline(results, baseline);
  if (fresh.length) {
    // a finding only counts when a second run shows it too
    const again = [...new Set(fresh.map((f) => f.element))];
    console.log(
      `dark-motion: re-checking ${again.length} demo(s) with new findings: ${again.join(", ")}`,
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
      `\nAdvisory: ${known.reduce((n, k) => n + k.count, 0)} baselined dark mode / reduced motion failure(s) in the checked demos (work these down):`,
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
      `\nFixed since the baseline (run yarn test:dark-motion --update-baseline --elements ${names} and commit the smaller baseline):`,
    );
    listItems(out, fixed);
  }
  if (fresh.length) {
    line(out, `\nNEW dark mode / reduced motion failures:`);
    listItems(out, fresh);
    [...new Set(fresh.map((f) => f.group))].forEach((g) =>
      line(out, `  ${g}: ${CHECKS[g] || g}`),
    );
  }
  line(
    out,
    `\ndark-motion: ${Object.keys(results).length} demo(s) checked, ${fresh.length} new, ${known.length} baselined, ${fixed.length} fixed.`,
  );
  if (process.env.GITHUB_STEP_SUMMARY) {
    try {
      fs.appendFileSync(
        process.env.GITHUB_STEP_SUMMARY,
        `## Dark mode and reduced motion\n\n\`\`\`\n${out.join("\n").trim()}\n\`\`\`\n`,
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
    console.error(`dark-motion: ${(e && e.stack) || e}`);
    process.exit(1);
  },
);
