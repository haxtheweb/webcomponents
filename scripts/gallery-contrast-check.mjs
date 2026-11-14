#!/usr/bin/env node
/**
 * Gallery contrast gate: the component gallery's own page chrome (header,
 * sidebar, search, filters, toolbar, demo picker) is readable in light and
 * dark mode.
 *
 * Invariant: text in the gallery chrome meets WCAG AA contrast in both
 * color schemes, and every select's open list draws its options on an
 * opaque background at 4.5:1 or better.
 *
 * Why a separate gate: the element contrast gate (scripts/contrast-check.mjs)
 * opens element demos, never the gallery page itself, and axe cannot see a
 * select's open list because the browser draws it outside the page. A
 * gallery select once showed white options on a white list in dark mode.
 *
 * What runs: scripts/build-component-gallery.js builds index.html, the
 * repo's web-dev-server config serves the repo locally (never a live site)
 * and Chromium opens /index.html?element=<a component with several demos>
 * so the demo picker shows, once with prefers-color-scheme light and once
 * dark, reduced motion, every request that leaves the local server blocked,
 * motion ended and layout settled (scripts/lib/demo-runner.mjs).
 *   - color-contrast: axe-core's color-contrast rule over the page, shadow
 *     DOM included, the demo iframe excluded (element demos are the element
 *     contrast gate's job).
 *   - open-list: each option of every select (shadow DOM included) has an
 *     opaque background and text at 4.5:1 or better on it. A transparent
 *     option background is what let the browser paint a light list under
 *     dark-scheme text.
 * There is no baseline: the gallery starts clean and any finding fails.
 *
 * Run locally: `yarn test:gallery-contrast` (`--no-build` to reuse an
 * existing index.html). Exit 1 means a finding. Set
 * GALLERY_CONTRAST_CHROMIUM=<path> to use a Chromium other than
 * Playwright's. See CONTRIBUTING.md, "Gallery contrast check".
 */
import console from "node:console";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { MODES } from "./lib/contrast.mjs";
import { launchChromium, openPage, startServer } from "./lib/demo-runner.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const AXE = path.join(root, "node_modules", "axe-core", "axe.min.js");
const PAGE_TIMEOUT = Number(process.env.GALLERY_CONTRAST_PAGE_TIMEOUT) || 60000;
const MIN_RATIO = 4.5;
// used when the built gallery lists no component with extra demos
const FALLBACK_ELEMENT = "a11y-tabs";

const args = process.argv.slice(2);

/** a component with more than one demo, so the demo picker is shown */
function pickElement(html) {
  const marker = "const COMPONENTS = ";
  const at = html.indexOf(marker);
  if (at === -1) return FALLBACK_ELEMENT;
  try {
    const start = at + marker.length;
    const end = html.indexOf("\n    ];", start);
    const list = JSON.parse(html.slice(start, end + "\n    ]".length));
    const preferred = list.find(
      (c) => c.name === FALLBACK_ELEMENT && c.additionalDemos.length > 0,
    );
    const any = list.find(
      (c) => c.additionalDemos && c.additionalDemos.length > 0,
    );
    return (preferred || any || { name: FALLBACK_ELEMENT }).name;
  } catch {
    return FALLBACK_ELEMENT;
  }
}

// runs in the page: options of every select, shadow DOM included, whose
// background is not opaque or whose text is under minRatio on it
function openListFindings(minRatio) {
  const parse = (value) => {
    const m = /rgba?\(([^)]+)\)/.exec(value || "");
    if (!m) return null;
    const p = m[1]
      .split(/[\s,/]+/)
      .filter(Boolean)
      .map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const lum = (c) => {
    const ch = [c.r, c.g, c.b].map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  };
  const ratio = (a, b) => {
    const l1 = lum(a);
    const l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };
  const describe = (el) => {
    const parts = [];
    let node = el;
    while (node && parts.length < 4) {
      if (node.nodeType === 1) {
        parts.unshift(
          node.tagName.toLowerCase() +
            (node.id ? `#${node.id}` : "") +
            (node.classList && node.classList.length
              ? `.${node.classList[0]}`
              : ""),
        );
        node = node.parentNode;
      } else if (node.host) {
        parts.unshift(">>");
        node = node.host;
      } else {
        break;
      }
    }
    return parts.join(" ");
  };
  const selects = [];
  const walk = (scope) => {
    for (const el of scope.querySelectorAll("*")) {
      if (el.tagName === "SELECT") selects.push(el);
      if (el.shadowRoot) walk(el.shadowRoot);
    }
  };
  walk(document);
  const findings = [];
  for (const select of selects) {
    for (const option of select.options) {
      const style = globalThis.getComputedStyle(option);
      const fg = parse(style.color);
      const bg = parse(style.backgroundColor);
      const where = `${describe(select)} option "${option.textContent.trim()}"`;
      if (!bg || bg.a < 1) {
        findings.push(
          `${where}: background ${style.backgroundColor} is not opaque, so the browser picks the list color`,
        );
        continue;
      }
      if (!fg) continue;
      const r = ratio(fg, bg);
      if (r < minRatio) {
        findings.push(
          `${where}: ${style.color} on ${style.backgroundColor} is ${r.toFixed(2)}:1`,
        );
      }
    }
  }
  return { selects: selects.length, findings };
}

async function audit(browser, origin, element, mode, axeSource) {
  const context = await browser.newContext({
    colorScheme: mode,
    reducedMotion: "reduce",
    viewport: { width: 1280, height: 900 },
  });
  try {
    const page = await openPage(
      context,
      origin,
      `/index.html?element=${encodeURIComponent(element)}`,
      PAGE_TIMEOUT,
      { settled: true },
    );
    const picker = await page.evaluate(() => {
      const box = document.getElementById("demoSelectorContainer");
      return !!box && !box.classList.contains("hidden");
    });
    await page.addScriptTag({ content: axeSource });
    const contrast = await page.evaluate(async () => {
      const res = await globalThis.axe.run(
        { exclude: [["#demoFrame"]] },
        {
          runOnly: { type: "rule", values: ["color-contrast"] },
          resultTypes: ["violations"],
          iframes: false,
        },
      );
      const out = [];
      for (const v of res.violations) {
        for (const n of v.nodes) {
          out.push(
            `${n.target.join(" >> ")}: ${(n.any[0] && n.any[0].message) || v.help}`,
          );
        }
      }
      return out;
    });
    const list = await page.evaluate(openListFindings, MIN_RATIO);
    return { picker, contrast, list };
  } finally {
    await context.close().catch(() => {});
  }
}

async function main() {
  if (!args.includes("--no-build")) {
    console.log("building the component gallery (index.html)");
    execFileSync(
      process.execPath,
      [path.join(root, "scripts", "build-component-gallery.js")],
      { cwd: root, stdio: "inherit" },
    );
  }
  const indexFile = path.join(root, "index.html");
  if (!fs.existsSync(indexFile)) {
    throw new Error("index.html is missing; run without --no-build");
  }
  const element = pickElement(fs.readFileSync(indexFile, "utf8"));
  const axeSource = fs.readFileSync(AXE, "utf8");
  const browser = await launchChromium(process.env.GALLERY_CONTRAST_CHROMIUM);
  let server;
  let origin;
  try {
    ({ server, origin } = await startServer(
      root,
      Number(process.env.GALLERY_CONTRAST_PORT) || 8766,
    ));
  } catch (e) {
    await browser.close().catch(() => {});
    throw e;
  }
  const lines = [];
  let failures = 0;
  try {
    for (const mode of MODES) {
      const r = await audit(browser, origin, element, mode, axeSource);
      const problems = [];
      if (!r.picker) {
        problems.push(
          `the demo picker did not show for ${element}, so its open list was not checked`,
        );
      }
      for (const c of r.contrast) problems.push(`color-contrast: ${c}`);
      for (const f of r.list.findings) problems.push(`open-list: ${f}`);
      failures += problems.length;
      lines.push(
        `${problems.length ? "✖" : "✔"} ${mode}: ${r.contrast.length} contrast, ${r.list.findings.length} open-list finding(s) (${r.list.selects} select(s), ?element=${element})`,
      );
      for (const p of problems) lines.push(`    ${p}`);
    }
  } finally {
    await browser.close().catch(() => {});
    await server.stop().catch(() => {});
  }
  for (const l of lines) console.log(l);
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      `## Gallery contrast (light and dark)\n\n\`\`\`\n${lines.join("\n")}\n\`\`\`\n`,
    );
  }
  return failures ? 1 : 0;
}

main().then(
  (code) => process.exit(code),
  (e) => {
    console.error(e);
    process.exit(1);
  },
);
