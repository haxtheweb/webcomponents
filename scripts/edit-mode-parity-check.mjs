#!/usr/bin/env node
/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
/**
 * Edit mode parity check: page content looks the same in and out of edit
 * mode, in every HAXcms theme.
 *
 * Invariant: entering edit mode does not change how page content is laid
 * out. Text keeps its size, line height, font, color and measure; blocks
 * keep their width, position and spacing. The editor's own chrome (outlines,
 * the gutter +, page-break shown as a divider, the page details bar above
 * the content) may differ; the content may not.
 *
 * How: serves this repo with @web/dev-server, opens the haxcms-elements demo
 * site in Chromium in each theme (?theme=), measures the computed style and
 * box of every top level content block in view mode, enters edit mode (tray
 * collapsed, so the docked tray's narrower viewport is not counted) and
 * measures the same blocks inside hax-body. Differences are printed per theme.
 *
 *   node scripts/edit-mode-parity-check.mjs                       every theme, default page
 *   node scripts/edit-mode-parity-check.mjs --themes clean-one,polaris-flex-theme
 *   node scripts/edit-mode-parity-check.mjs --page welcome --width 600
 *   node scripts/edit-mode-parity-check.mjs --chrome /usr/bin/google-chrome
 *
 * Exit 1 when any theme drifts, 0 otherwise. Not part of CI yet: it takes a
 * few seconds per theme.
 */
import console from "node:console";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { startDevServer } from "@web/dev-server";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const demo = "/elements/haxcms-elements/demo/";

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

// themes that render site data rather than a page of content
const SKIP = ["haxcms-json-theme", "haxcms-print-theme"];
const themesFile = path.join(
  root,
  "elements",
  "haxcms-elements",
  "lib",
  "themes.json",
);
const themes = arg(
  "themes",
  Object.keys(JSON.parse(fs.readFileSync(themesFile, "utf8")))
    .filter((t) => !SKIP.includes(t))
    .join(","),
)
  .split(",")
  .filter((t) => /^[a-z0-9-]+$/.test(t));
const page = arg("page", "welcome/what-is-hax/meme-maker");
const width = Number(arg("width", "1400"));
const executablePath = arg("chrome", undefined);

const PROPS = [
  "font-size",
  "line-height",
  "font-weight",
  "font-family",
  "letter-spacing",
  "color",
  "margin-top",
  "margin-bottom",
  "padding-left",
  "padding-right",
  "text-align",
  "text-wrap",
];

// runs in the page: top level content blocks, view or edit
function measure(props) {
  const store = globalThis.HAXCMS.instance.store;
  const blocks = store.editMode
    ? Array.from(
        globalThis.HaxStore.requestAvailability().activeHaxBody.children,
      )
    : Array.from(store.themeElement.children).filter(
        (k) => k.tagName !== "HAXCMS-SITE-EDITOR" && !k.hasAttribute("slot"),
      );
  return blocks.map((k) => {
    const cs = globalThis.getComputedStyle(k);
    const r = k.getBoundingClientRect();
    const out = {
      tag: k.tagName.toLowerCase(),
      width: Math.round(r.width),
      x: Math.round(r.x),
    };
    props.forEach((p) => {
      out[p] = cs.getPropertyValue(p);
    });
    const li = k.querySelector("li");
    if (li) {
      const l = globalThis.getComputedStyle(li);
      out["li line-height"] = l.lineHeight;
      out["li margin-bottom"] = l.marginBottom;
      out["li color"] = l.color;
    }
    return out;
  });
}

function compare(view, edit) {
  const out = [];
  if (view.length !== edit.length) {
    out.push(`block count ${view.length} -> ${edit.length}`);
  }
  const x0v = view.length ? view[0].x : 0;
  const x0e = edit.length ? edit[0].x : 0;
  for (let i = 0; i < Math.min(view.length, edit.length); i++) {
    const a = view[i];
    const b = edit[i];
    // lazy loading placeholders and the page-break divider are editor-only
    if (a.tag !== b.tag || a.tag === "page-break") {
      continue;
    }
    const diffs = [];
    for (const key of Object.keys(a)) {
      if (key !== "x" && key !== "tag" && a[key] !== b[key]) {
        diffs.push(`${key}: ${a[key]} -> ${b[key]}`);
      }
    }
    if (a.x - x0v !== b.x - x0e) {
      diffs.push(`offset: ${a.x - x0v} -> ${b.x - x0e}`);
    }
    if (diffs.length) {
      out.push(`[${i}] <${a.tag}> ${diffs.join("; ")}`);
    }
  }
  return out;
}

async function checkTheme(browser, base, theme) {
  const context = await browser.newContext({
    viewport: { width, height: 1000 },
  });
  const tab = await context.newPage();
  try {
    await tab.goto(`${base}${demo}index.html?theme=${theme}`);
    await tab.waitForFunction(
      () =>
        globalThis.HAXCMS &&
        globalThis.HAXCMS.instance &&
        globalThis.HAXCMS.instance.store.themeElement,
      null,
      { timeout: 60000 },
    );
    await tab.waitForTimeout(1500);
    await tab.evaluate((slug) => {
      globalThis.history.pushState({}, "", slug);
      globalThis.dispatchEvent(new globalThis.PopStateEvent("popstate"));
    }, page);
    await tab.waitForFunction(
      () => globalThis.HAXCMS.instance.store.themeElement.children.length > 2,
      null,
      { timeout: 60000 },
    );
    // the editor bar only offers Edit once HAX has its app store; wait for
    // the same before switching modes from here
    await tab.waitForFunction(
      () =>
        globalThis.HaxStore &&
        globalThis.HaxStore.requestAvailability().appStoreLoaded,
      null,
      { timeout: 60000 },
    );
    await tab.waitForTimeout(3000);
    // blocks below the fold load lazily (replace-tag); bring each into view
    // so view mode is measured with the real elements
    for (let pass = 0; pass < 3; pass++) {
      const waiting = await tab.evaluate(() => {
        const lazy = Array.from(
          globalThis.HAXCMS.instance.store.themeElement.querySelectorAll(
            ":scope > replace-tag",
          ),
        );
        lazy.forEach((el) => el.scrollIntoView());
        return lazy.length;
      });
      if (!waiting) {
        break;
      }
      await tab.waitForTimeout(2500);
    }
    await tab.evaluate(() => {
      const first =
        globalThis.HAXCMS.instance.store.themeElement.firstElementChild;
      if (first) {
        first.scrollIntoView();
      }
    });
    await tab.waitForTimeout(1500);
    const view = await tab.evaluate(measure, PROPS);
    await tab.evaluate(() => {
      globalThis.HAXCMS.instance.store.editMode = true;
    });
    await tab.waitForFunction(
      (count) => {
        const store =
          globalThis.HaxStore && globalThis.HaxStore.requestAvailability();
        return (
          store &&
          store.activeHaxBody &&
          store.activeHaxBody.children.length >= count &&
          !globalThis.document.querySelector("h-a-x.haxcms-edit-mode-pending")
        );
      },
      view.length,
      { timeout: 60000 },
    );
    await tab.waitForTimeout(3000);
    await tab.evaluate(() => {
      globalThis.HaxStore.requestAvailability().haxTray.collapsed = true;
    });
    await tab.waitForTimeout(1200);
    // the editor may import the page again as it settles; measure once the
    // same blocks are there as in view mode
    await tab.waitForFunction(
      (count) =>
        globalThis.HaxStore.requestAvailability().activeHaxBody.children
          .length >= count,
      view.length,
      { timeout: 30000 },
    );
    await tab.waitForTimeout(500);
    const edit = await tab.evaluate(measure, PROPS);
    return compare(view, edit);
  } finally {
    await context.close();
  }
}

const server = await startDevServer({
  config: { rootDir: root, port: 0, nodeResolve: true, watch: false },
  readCliArgs: false,
  readFileConfig: false,
  logStartMessage: false,
});
const address = server.server.address();
const base = `http://localhost:${address.port}`;
const browser = await chromium.launch(executablePath ? { executablePath } : {});
let drifting = 0;
try {
  // the first load transforms every module the demo uses; do it once before
  // timing anything
  const warm = await browser.newPage();
  await warm.goto(`${base}${demo}index.html`);
  await warm
    .waitForFunction(
      () => globalThis.HAXCMS && globalThis.HAXCMS.instance.store.themeElement,
      null,
      { timeout: 120000 },
    )
    .catch(() => {});
  await warm.close();
  for (const theme of themes) {
    let result;
    try {
      result = await checkTheme(browser, base, theme);
    } catch (e) {
      result = [`could not check: ${String(e.message).split("\n")[0]}`];
    }
    if (result.length) {
      drifting++;
      console.log(`✗ ${theme}`);
      result.forEach((line) => console.log(`    ${line}`));
    } else {
      console.log(`✓ ${theme}`);
    }
  }
} finally {
  await browser.close();
  await server.stop();
}
console.log(
  `\n${themes.length - drifting} of ${themes.length} themes keep content the same in edit mode (${page}, ${width}px).`,
);
process.exit(drifting ? 1 : 0);
