#!/usr/bin/env node
/**
 * Gallery audit gate: the component gallery (index.html, built by
 * scripts/build-component-gallery.js) holds the same bar as the other HAX
 * properties, on desktop and phone, in light and dark mode, under every
 * design system it offers.
 *
 * Invariants, each checked against the page Chromium renders:
 *   - accessibility: axe-core WCAG 2.2 A/AA rules (target size included)
 *     find nothing in the gallery chrome, in every state a reviewer reaches:
 *     first load, a filter applied, a component's live demo, its
 *     documentation, and on phones the component drawer reopened after
 *     scrolling. The demo iframe is excluded (element demos have their own
 *     gates).
 *   - mobile: nothing scrolls sideways; no control is covered by another
 *     (the sticky title bar, the drawer); the phone drawer starts below the
 *     title bar and is opaque, so the page under it never shows through.
 *   - keyboard: tabbing through the chrome lands only on visible,
 *     uncovered controls that draw a focus indicator.
 *   - dark mode and reduced motion: both schemes are audited; with reduced
 *     motion the loading screen is gone quickly and no chrome animation
 *     runs forever.
 *   - design systems: with each registered design system and a palette
 *     applied (?system=, ?palette=), the chrome still passes axe contrast,
 *     the system is the active one in the gallery and in the demo.
 *   - security: links that open a new window carry rel="noopener"; no
 *     javascript: URLs; the gallery makes no request off the local server
 *     on load, fonts included (HAX serves its own); vercel.json sends nosniff, a referrer policy and a CSP.
 *   - performance: first load stays within request, byte and
 *     time-to-styled budgets (BUDGET below), so a heavy import is caught.
 *   - licenses: the gallery links the project license and the third-party
 *     notices for code it loads.
 *   - no console errors or uncaught exceptions in the gallery page.
 *
 * What runs: the gallery is built, the repo's web-dev-server config serves
 * the repo locally (never a live site), and every request that leaves the
 * local server is aborted (scripts/lib/demo-runner.mjs), so results are
 * the same offline, locally and in CI. There is no baseline: any finding
 * fails.
 *
 * Run locally: `yarn test:gallery-audit` (`--no-build` reuses index.html).
 * GALLERY_AUDIT_CHROMIUM=<path> uses a Chromium other than Playwright's.
 * See CONTRIBUTING.md, "Gallery audit".
 */
import console from "node:console";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import {
  launchChromium,
  startServer,
  runPool,
  LOCAL,
} from "./lib/demo-runner.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const AXE = path.join(root, "node_modules", "axe-core", "axe.min.js");
const TIMEOUT = Number(process.env.GALLERY_AUDIT_PAGE_TIMEOUT) || 20000;
const CONCURRENCY = Number(process.env.GALLERY_AUDIT_CONCURRENCY) || 4;
const AXE_TAGS = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22a",
  "wcag22aa",
];
// a component with several demos, so the demo picker shows
const ELEMENT = "a11y-tabs";
const VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  phone: { width: 390, height: 844, isMobile: true, hasTouch: true },
};
const SCHEMES = ["light", "dark"];
// First load of the gallery page itself (demo iframe not opened). Raise a
// budget only with a reason in the PR. Measured when this gate was written
// (86 requests, about 1.3 MB, styled in about 1.5 s locally) with room for
// slower CI runners
const BUDGET = {
  requests: 150,
  kilobytes: 2500,
  styledMs: 6000,
};
// The Licenses view shows the CDN build's notices; the audit answers that
// request with a small fixture shaped like scripts/copy-dep-licenses.js
// output (an index table and a fenced license text), never the network
const LICENSES_MD = "https://cdn.hax.cloud/cdn/build/THIRD_PARTY_LICENSES.md";
const LICENSES_FIXTURE = [
  "# Third-party licenses",
  "",
  "Every package is at `es6/node_modules/<package>` in the build.",
  "",
  "## Package index",
  "",
  "| Package | License | Attribution |",
  "| --- | --- | --- |",
  "| @haxtheweb/a-very-long-package-name-that-must-wrap-on-phones | Apache-2.0 | License text 1 |",
  "| lit | BSD-3-Clause | License text 2 |",
  "",
  "## License texts",
  "",
  "### License text 1: Apache-2.0",
  "",
  "Used by @haxtheweb/a-very-long-package-name-that-must-wrap-on-phones.",
  "",
  "```text",
  "                                 Apache License, Version 2.0, January 2004, http://www.apache.org/licenses/ (a long unbroken line)",
  "```",
  "",
].join("\n");
const args = process.argv.slice(2);

function readRegistry() {
  const file = path.join(
    root,
    "elements",
    "haxcms-elements",
    "lib",
    "designSystems.json",
  );
  try {
    return Object.keys(JSON.parse(fs.readFileSync(file, "utf8")));
  } catch {
    return [];
  }
}

async function newPage(browser, origin, viewport, scheme, extra = {}) {
  const { width, height, ...device } = VIEWPORTS[viewport];
  const context = await browser.newContext({
    viewport: { width, height },
    ...device,
    colorScheme: scheme,
    reducedMotion: extra.reducedMotion ? "reduce" : "no-preference",
  });
  await context.route(
    (url) => !LOCAL.test(url.href),
    (route) => route.abort(),
  );
  await context.route(LICENSES_MD, (route) =>
    route.fulfill({
      status: 200,
      body: LICENSES_FIXTURE,
      headers: {
        "content-type": "text/markdown",
        "access-control-allow-origin": "*",
      },
    }),
  );
  const page = await context.newPage();
  page.setDefaultTimeout(TIMEOUT);
  const errors = [];
  const offsite = [];
  const stats = { requests: 0, bytes: 0 };
  page.on("pageerror", (e) => errors.push(`uncaught: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error" && m.location().url.indexOf("/demo/") === -1) {
      // aborted off-site requests are reported below, not as errors
      if (!/net::ERR_FAILED|ERR_ABORTED/.test(m.text())) {
        errors.push(`console: ${m.text()}`);
      }
    }
  });
  page.on("request", (r) => {
    if (r.frame() !== page.mainFrame()) return;
    stats.requests++;
    if (!LOCAL.test(r.url()) && r.url() !== LICENSES_MD) {
      offsite.push(r.url());
    }
  });
  page.on("response", async (r) => {
    if (r.frame() !== page.mainFrame()) return;
    const len = Number(r.headers()["content-length"]);
    if (len) {
      stats.bytes += len;
    } else {
      const body = await r.body().catch(() => null);
      if (body) stats.bytes += body.length;
    }
  });
  return { context, page, errors, offsite, stats };
}

async function load(page, origin, query = "") {
  const started = Date.now();
  await page.goto(`${origin}/index.html${query}`, { waitUntil: "load" });
  await page.waitForFunction(() => globalThis.__galleryStyled === true);
  const styledMs = Date.now() - started;
  // the gallery's own elements upgraded (the demo frame is its own document)
  await page
    .waitForFunction(
      () => document.querySelectorAll(":not(:defined)").length === 0,
      null,
      { timeout: 8000 },
    )
    .catch(() => {});
  await page.waitForFunction(() => !document.getElementById("loading"), null, {
    timeout: 10000,
  });
  await page.evaluate(() => (document.fonts ? document.fonts.ready : null));
  await page.waitForTimeout(300);
  return styledMs;
}

async function axe(page, axeSource, rules) {
  if (!(await page.evaluate(() => !!globalThis.axe))) {
    await page.addScriptTag({ content: axeSource });
  }
  return page.evaluate(
    async ({ tags, rules }) => {
      const options = rules
        ? { runOnly: { type: "rule", values: rules } }
        : { runOnly: { type: "tag", values: tags } };
      options.resultTypes = ["violations"];
      const result = await globalThis.axe.run(
        { exclude: [["#demoFrame"]] },
        options,
      );
      const out = [];
      for (const v of result.violations) {
        for (const n of v.nodes) {
          out.push(`${v.id}: ${n.target.join(" ")} (${n.failureSummary.split("\n")[1] || v.help})`);
        }
      }
      return out;
    },
    { tags: AXE_TAGS, rules },
  );
}

// runs in the page: layout findings for the chrome as it rests
function layoutFindings({ drawer }) {
  const out = [];
  const vw = globalThis.innerWidth;
  const vh = globalThis.innerHeight;
  if (document.documentElement.scrollWidth > vw + 1) {
    out.push(
      `page scrolls sideways (${document.documentElement.scrollWidth}px wide in a ${vw}px viewport)`,
    );
  }
  const name = (el) =>
    el.tagName.toLowerCase() +
    (el.id ? `#${el.id}` : "") +
    (el.classList.length ? `.${el.classList[0]}` : "") +
    (el.dataset && el.dataset.filter ? `[${el.dataset.filter}]` : "");
  const contains = (host, el) => {
    let node = el;
    while (node) {
      if (node === host) return true;
      node = node.parentNode || node.host;
    }
    return false;
  };
  const hit = (x, y) => {
    let el = document.elementFromPoint(x, y);
    while (el && el.shadowRoot) {
      const inner = el.shadowRoot.elementFromPoint(x, y);
      if (!inner || inner === el) break;
      el = inner;
    }
    return el;
  };
  // a box an overflow container cuts off (a list item scrolled out of view)
  const clipped = (el, r) => {
    let node = el.parentNode || el.host;
    while (node && node.nodeType !== 9) {
      if (node.nodeType === 1) {
        const cs = getComputedStyle(node);
        if (cs.overflowX !== "visible" || cs.overflowY !== "visible") {
          const c = node.getBoundingClientRect();
          if (r.top < c.top - 1 || r.bottom > c.bottom + 1) return true;
        }
      }
      node = node.parentNode || node.host;
    }
    return false;
  };
  const controls = [
    ...document.querySelectorAll(
      "body > header a, body > header button, .sidebar button, .sidebar simple-fields-field, .sidebar hax-palette-picker, .sidebar a, .demo-header button, .demo-header a, .demo-header simple-fields-field, footer a",
    ),
  ];
  for (const el of controls) {
    const r = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    if (
      !r.width ||
      !r.height ||
      style.visibility === "hidden" ||
      el.closest(".hidden,[hidden],[inert]")
    ) {
      continue;
    }
    // only what is fully on screen and not scrolled out of its list
    if (r.top < 0 || r.left < 0 || r.bottom > vh || r.right > vw) continue;
    if (clipped(el, r)) continue;
    const at = hit(r.left + r.width / 2, r.top + Math.min(r.height / 2, 12));
    if (at && !contains(el, at)) {
      out.push(`${name(el)} is covered by ${name(at.closest("*") || at)}`);
    }
  }
  if (drawer) {
    const sidebar = document.getElementById("sidebar");
    const bar = document.getElementById("mobileBar");
    const s = sidebar.getBoundingClientRect();
    const b = bar.getBoundingClientRect();
    if (!sidebar.classList.contains("open")) {
      out.push("the component drawer did not open");
    } else {
      if (s.top < b.bottom - 1) {
        out.push(
          `the drawer starts under the title bar (drawer top ${Math.round(s.top)}px, bar bottom ${Math.round(b.bottom)}px)`,
        );
      }
      // opaque: the drawer's own background, or the layers it paints
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const cx = canvas.getContext("2d", { willReadFrequently: true });
      const alpha = (value) => {
        cx.clearRect(0, 0, 1, 1);
        cx.fillStyle = value;
        cx.fillRect(0, 0, 1, 1);
        return cx.getImageData(0, 0, 1, 1).data[3] / 255;
      };
      const cs = getComputedStyle(sidebar);
      if (alpha(cs.backgroundColor) < 1) {
        out.push(
          `the drawer background is see-through (${cs.backgroundColor}), so the page shows through it`,
        );
      }
    }
  }
  return out;
}

// Tab through the chrome. A stop passes when it is visible, not covered,
// and focusing it changes how it looks (compared pixel for pixel with the
// same box blurred), so a ring drawn on a wrapper or host counts too.
async function keyboardWalk(page, steps) {
  const out = [];
  await page.evaluate(() => document.activeElement && document.activeElement.blur());
  for (let i = 0; i < steps; i++) {
    await page.keyboard.press("Tab");
    const r = await page.evaluate(() => {
      let el = document.activeElement;
      while (el && el.shadowRoot && el.shadowRoot.activeElement) {
        el = el.shadowRoot.activeElement;
      }
      if (!el || el === document.body) return null;
      if (el.tagName === "IFRAME") return { frame: true };
      let top = el;
      while (top.getRootNode() !== document) top = top.getRootNode().host;
      const label =
        top.tagName.toLowerCase() +
        (top.id ? `#${top.id}` : "") +
        (top.classList.length ? `.${top.classList[0]}` : "") +
        (top.dataset && top.dataset.filter ? `[${top.dataset.filter}]` : "") +
        (top !== el ? ` (${el.tagName.toLowerCase()} inside)` : "");
      const rect = top.getBoundingClientRect();
      let covered = false;
      const x = rect.left + rect.width / 2;
      const y = rect.top + Math.min(rect.height / 2, 12);
      if (rect.width && rect.height && y >= 0 && y <= innerHeight) {
        let at = document.elementFromPoint(x, y);
        let node = at;
        covered = true;
        while (node) {
          if (node === top) {
            covered = false;
            break;
          }
          node = node.parentNode || node.host;
        }
      }
      globalThis.__auditFocus = el;
      return {
        label,
        visible: rect.width > 0 && rect.height > 0,
        covered,
        box: {
          x: Math.max(0, rect.left - 6),
          y: Math.max(0, rect.top - 6),
          width: Math.min(innerWidth, rect.width + 12),
          height: Math.min(innerHeight, rect.height + 12),
        },
      };
    });
    if (!r || r.frame) continue;
    if (!r.visible) {
      out.push(`Tab ${i + 1} lands on ${r.label}, which is not visible`);
      continue;
    }
    if (r.covered) {
      out.push(`Tab ${i + 1} lands on ${r.label}, which is covered`);
      continue;
    }
    const focused = await page.screenshot({ clip: r.box, animations: "disabled" });
    await page.evaluate(() => globalThis.__auditFocus.blur());
    const blurred = await page.screenshot({ clip: r.box, animations: "disabled" });
    await page.evaluate(() => globalThis.__auditFocus.focus({ focusVisible: true }));
    if (focused.equals(blurred)) {
      out.push(`Tab ${i + 1} lands on ${r.label} with no visible focus indicator`);
    }
  }
  return out;
}

// runs in the page: static security and license findings on the built page
function staticFindings() {
  const out = [];
  for (const a of document.querySelectorAll('a[target]:not([target="_self"])')) {
    const rel = (a.getAttribute("rel") || "").split(/\s+/);
    if (!rel.includes("noopener") && !rel.includes("noreferrer")) {
      out.push(`security: ${a.id || a.textContent.trim()} opens a window without rel="noopener"`);
    }
  }
  for (const a of document.querySelectorAll("[href],[src],[action]")) {
    const v = a.getAttribute("href") || a.getAttribute("src") || a.getAttribute("action");
    if (/^\s*javascript:/i.test(v)) out.push(`security: javascript: URL on ${a.tagName.toLowerCase()}`);
  }
  const links = [...document.querySelectorAll("footer a")].map((a) => a.textContent.trim().toLowerCase());
  if (!links.some((t) => t.includes("license"))) {
    out.push("licenses: the gallery footer does not link the project license");
  }
  if (!links.some((t) => t.includes("third-party"))) {
    out.push("licenses: the gallery footer does not link the third-party notices");
  }
  return out;
}

function headerFindings() {
  const out = [];
  let config = {};
  try {
    config = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8"));
  } catch {
    return ["security: vercel.json could not be read"];
  }
  const all = (config.headers || []).find((h) => h.source === "/(.*)");
  const keys = all ? all.headers.map((h) => h.key.toLowerCase()) : [];
  for (const need of [
    "x-content-type-options",
    "referrer-policy",
  ]) {
    if (!keys.includes(need)) out.push(`security: vercel.json does not send ${need}`);
  }
  if (!keys.some((k) => k.startsWith("content-security-policy"))) {
    out.push("security: vercel.json sends no content security policy");
  }
  return out;
}

// one viewport and scheme: every state a reviewer reaches
async function auditStates(browser, origin, axeSource, viewport, scheme) {
  const findings = [];
  const add = (where, list) => list.forEach((f) => findings.push(`${where}: ${f}`));
  const where = `${viewport} ${scheme}`;
  const s = await newPage(browser, origin, viewport, scheme);
  const { page } = s;
  const phone = viewport === "phone";
  try {
    const styledMs = await load(page, origin);
    if (viewport === "desktop" && scheme === "light") {
      const kb = Math.round(s.stats.bytes / 1024);
      console.log(`  first load: ${s.stats.requests} requests, ${kb} KB, styled in ${styledMs} ms`);
      if (s.stats.requests > BUDGET.requests) {
        findings.push(`performance: first load made ${s.stats.requests} requests (budget ${BUDGET.requests})`);
      }
      if (kb > BUDGET.kilobytes) {
        findings.push(`performance: first load fetched ${kb} KB (budget ${BUDGET.kilobytes})`);
      }
      if (styledMs > BUDGET.styledMs) {
        findings.push(`performance: styled after ${styledMs} ms (budget ${BUDGET.styledMs})`);
      }
      add("static", await page.evaluate(staticFindings));
    }
    add(`${where} first load`, await axe(page, axeSource));
    add(`${where} first load`, await page.evaluate(layoutFindings, { drawer: phone }));
    // a filter applied (on phones the drawer is open on first load)
    await page.click('.filter-btn[data-filter="instructional"]');
    await page.waitForTimeout(150);
    add(`${where} filtered`, await axe(page, axeSource));
    add(`${where} filtered`, await page.evaluate(layoutFindings, { drawer: phone }));
    // the appearance panel open
    await page.click("#appearanceToggle");
    await page.waitForTimeout(300);
    add(`${where} appearance`, await axe(page, axeSource));
    add(`${where} appearance`, await page.evaluate(layoutFindings, { drawer: phone }));
    // a component's live demo
    await load(page, origin, `?element=${ELEMENT}`);
    add(`${where} demo`, await axe(page, axeSource));
    add(`${where} demo`, await page.evaluate(layoutFindings, { drawer: false }));
    if (phone) {
      await page.evaluate(() => globalThis.scrollTo(0, 300));
      await page.click("#listToggle");
      await page.waitForTimeout(300);
      add(`${where} drawer after scrolling`, await page.evaluate(layoutFindings, { drawer: true }));
      add(`${where} drawer after scrolling`, await axe(page, axeSource));
    } else {
      add(`${where} keyboard`, await keyboardWalk(page, 30));
    }
    // its documentation
    await load(page, origin, `?element=${ELEMENT}&view=docs`);
    add(`${where} docs`, await axe(page, axeSource));
    add(`${where} docs`, await page.evaluate(layoutFindings, { drawer: false }));
    // the third-party licenses, opened from the footer link: rendered as
    // a page, never under the drawer, never scrolling the page sideways
    await load(page, origin, "?view=licenses");
    const rendered = await page
      .waitForFunction(
        () => {
          const md = document.getElementById("licensesBlock");
          return !!(md && md.shadowRoot && md.shadowRoot.querySelector("table pre, table") && md.shadowRoot.querySelector("pre"));
        },
        null,
        { timeout: 10000 },
      )
      .then(() => true, () => false);
    if (!rendered) findings.push(`${where} licenses: the notices did not render as a table and license text`);
    add(`${where} licenses`, await axe(page, axeSource));
    add(`${where} licenses`, await page.evaluate(layoutFindings, { drawer: false }));
    if (phone && (await page.evaluate(() => document.getElementById("sidebar").classList.contains("open")))) {
      findings.push(`${where} licenses: the component drawer opened over the licenses`);
    }
    add(where, s.errors);
    add(`${where} security`, s.offsite.map((u) => `requested off-site ${u}`));
  } catch (e) {
    findings.push(`${where}: could not be audited (${e.message.split("\n")[0]})`);
  } finally {
    await s.context.close();
  }
  return findings;
}

// reduced motion: the loader leaves at once, nothing in the chrome loops
async function auditReducedMotion(browser, origin) {
  const findings = [];
  const s = await newPage(browser, origin, "desktop", "light", { reducedMotion: true });
  try {
    await s.page.goto(`${origin}/index.html`, { waitUntil: "load" });
    await s.page
      .waitForFunction(() => !document.getElementById("loading"), null, { timeout: 5000 })
      .catch(() => findings.push("reduced motion: the loading screen stayed more than 5 s"));
    await s.page.waitForTimeout(500);
    const looping = await s.page.evaluate(() =>
      document
        .getAnimations()
        .filter((a) => a.playState === "running" && a.effect && a.effect.getTiming().iterations === Infinity)
        .map((a) => (a.effect.target ? a.effect.target.className || a.effect.target.tagName : "?")),
    );
    looping.forEach((l) => findings.push(`reduced motion: ${l} animates forever`));
  } finally {
    await s.context.close();
  }
  return findings;
}

// a design system and palette: applied in the gallery and the demo, and
// the chrome still passes contrast
async function auditSystem(browser, origin, axeSource, system, scheme) {
  const findings = [];
  const add = (where, list) => list.forEach((f) => findings.push(`${where}: ${f}`));
  const where = `${system} ${scheme}`;
  const s = await newPage(browser, origin, "desktop", scheme);
  try {
    await load(s.page, origin, `?element=${ELEMENT}&system=${system}&palette=2`);
    const pageOk = await s.page
      .waitForFunction(
        (name) => document.documentElement.dataset.galleryApplied === name,
        system,
        { timeout: 10000 },
      )
      .then(() => true, () => false);
    if (!pageOk) findings.push(`${where}: the gallery did not switch to ${system}`);
    const frameOk = await s.page
      .waitForFunction(
        (name) => {
          const f = document.getElementById("demoFrame");
          const d = f && f.contentDocument;
          return !!(d && d.documentElement.dataset.galleryApplied === name && d.documentElement.getAttribute("data-palette") === "2");
        },
        system,
        { timeout: 15000 },
      )
      .then(() => true, () => false);
    if (!frameOk) findings.push(`${where}: the demo did not take ${system} and the palette`);
    // the system's styles are in: let them paint before measuring
    await s.page.waitForTimeout(300);
    add(where, await axe(s.page, axeSource, ["color-contrast"]));
    add(where, s.errors);
    // the system's fonts come from HAX, like everything else
    add(`${where} security`, s.offsite.map((u) => `requested off-site ${u}`));
  } catch (e) {
    findings.push(`${where}: could not be audited (${e.message.split("\n")[0]})`);
  } finally {
    await s.context.close();
  }
  return findings;
}

async function audit(browser, origin, axeSource) {
  const jobs = [];
  for (const viewport of Object.keys(VIEWPORTS)) {
    for (const scheme of SCHEMES) {
      jobs.push(() => auditStates(browser, origin, axeSource, viewport, scheme));
    }
  }
  jobs.push(() => auditReducedMotion(browser, origin));
  for (const system of readRegistry()) {
    for (const scheme of SCHEMES) {
      jobs.push(() => auditSystem(browser, origin, axeSource, system, scheme));
    }
  }
  const findings = [];
  await runPool(jobs, CONCURRENCY, async (job) => {
    findings.push(...(await job()));
  }, "gallery audit");
  findings.push(...headerFindings().map((f) => `static: ${f}`));
  return findings;
}

async function main() {
  if (!args.includes("--no-build")) {
    console.log("building the component gallery (index.html)");
    execFileSync(process.execPath, [path.join(root, "scripts", "build-component-gallery.js")], {
      cwd: root,
      stdio: "inherit",
    });
  }
  if (!fs.existsSync(path.join(root, "index.html"))) {
    throw new Error("index.html is missing; run without --no-build");
  }
  const axeSource = fs.readFileSync(AXE, "utf8");
  const browser = await launchChromium(process.env.GALLERY_AUDIT_CHROMIUM);
  let server;
  let origin;
  try {
    ({ server, origin } = await startServer(root, Number(process.env.GALLERY_AUDIT_PORT) || 8767));
  } catch (e) {
    await browser.close().catch(() => {});
    throw e;
  }
  let findings = [];
  try {
    findings = await audit(browser, origin, axeSource);
  } finally {
    await browser.close().catch(() => {});
    await server.stop().catch(() => {});
  }
  // the same finding in several states is reported once, with its states
  const merged = new Map();
  for (const f of findings) {
    const at = f.indexOf(": ");
    const where = f.slice(0, at);
    const what = f.slice(at + 2);
    if (!merged.has(what)) merged.set(what, []);
    merged.get(what).push(where);
  }
  const lines = [...merged].map(([what, wheres]) => `✖ ${what}\n    in: ${wheres.join(", ")}`);
  if (lines.length) {
    console.log(lines.join("\n"));
  }
  console.log(`${lines.length ? "✖" : "✔"} gallery audit: ${lines.length} finding(s)`);
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      `## Gallery audit\n\n\`\`\`\n${lines.join("\n") || "no findings"}\n\`\`\`\n`,
    );
  }
  return lines.length ? 1 : 0;
}

main().then(
  (code) => process.exit(code),
  (e) => {
    console.error(e);
    process.exit(1);
  },
);
