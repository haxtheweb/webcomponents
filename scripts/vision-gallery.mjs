#!/usr/bin/env node

/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Color vision screenshot gallery: opens a page in Chromium and captures it
 * (or one element on it) under every vision mode Chrome can emulate, then
 * writes a contact sheet so a person can judge the results side by side.
 * The math check (vision-pairs-check.mjs) says whether a pair passes; this
 * shows what it actually looks like, including patterns and icons the math
 * can't see.
 *
 * Uses the Chrome DevTools Protocol's Emulation.setEmulatedVisionDeficiency,
 * the same filter as DevTools > Rendering > "Emulate vision deficiencies".
 * Chromium only (Firefox and WebKit have no equivalent hook).
 *
 * Usage:
 *   node scripts/vision-gallery.mjs <url> [options]
 *     --selector <css>     capture one element instead of the viewport
 *     --out <dir>          where to write (default: vision-gallery/)
 *     --scheme light|dark|both   prefers-color-scheme to emulate (default both)
 *     --width <px> --height <px> viewport (default 1280x800)
 *     --wait <ms>          extra settle time after load (default 1000)
 *     --executable <path>  use an installed Chrome instead of Playwright's
 *
 * Example, the editor top bar of a local haxcms-nodejs site:
 *   node scripts/vision-gallery.mjs http://localhost:3000/ \
 *     --selector haxcms-site-editor-ui --scheme both
 */

import fs from "fs";
import path from "path";

export const EMULATIONS = [
  { id: "none", label: "Typical color vision" },
  { id: "achromatopsia", label: "Greyscale (achromatopsia)" },
  { id: "protanopia", label: "Protanopia (no red cones)" },
  { id: "deuteranopia", label: "Deuteranopia (no green cones)" },
  { id: "tritanopia", label: "Tritanopia (no blue cones)" },
  { id: "reducedContrast", label: "Reduced contrast" },
  { id: "blurredVision", label: "Blurred vision" },
];

function parseArgs(argv) {
  const opts = {
    url: null,
    selector: null,
    out: "vision-gallery",
    scheme: "both",
    width: 1280,
    height: 800,
    wait: 1000,
    executable: null,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === "--selector") opts.selector = next();
    else if (a === "--out") opts.out = next();
    else if (a === "--scheme") opts.scheme = next();
    else if (a === "--width") opts.width = Number(next());
    else if (a === "--height") opts.height = Number(next());
    else if (a === "--wait") opts.wait = Number(next());
    else if (a === "--executable") opts.executable = next();
    else if (!a.startsWith("--")) opts.url = a;
  }
  return opts;
}

async function loadChromium() {
  for (const name of ["playwright", "playwright-core"]) {
    try {
      const mod = await import(name);
      return (mod.default || mod).chromium;
    } catch (e) {
      // try the next package
    }
  }
  throw new Error(
    "Playwright is not installed (it comes with the repo's dev dependencies; run yarn install)",
  );
}

const escapeHtml = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

function contactSheet(url, shots) {
  const schemes = [...new Set(shots.map((s) => s.scheme))];
  const sections = schemes
    .map((scheme) => {
      const cells = shots
        .filter((s) => s.scheme === scheme)
        .map(
          (s) =>
            `<figure><img src="${escapeHtml(s.file)}" alt="${escapeHtml(`${s.label}, ${scheme} scheme`)}"><figcaption>${escapeHtml(s.label)}</figcaption></figure>`,
        )
        .join("\n");
      return `<h2>${escapeHtml(scheme)} scheme</h2>\n<div class="grid">${cells}</div>`;
    })
    .join("\n");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Vision gallery</title>
<style>
  body { font-family: system-ui, sans-serif; margin: 16px; background: #f2f2f4; color: #262626; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
  figure { margin: 0; background: #fff; border: 1px solid #a2aaad; border-radius: 4px; padding: 8px; }
  img { max-width: 100%; display: block; }
  figcaption { font-size: 14px; margin-top: 8px; }
</style>
</head>
<body>
<h1>Vision gallery</h1>
<p>${escapeHtml(url)}</p>
${sections}
</body>
</html>
`;
}

export async function captureGallery(opts) {
  if (!opts.url) throw new Error("a url is required");
  const chromium = await loadChromium();
  const browser = await chromium.launch(
    opts.executable ? { executablePath: opts.executable } : {},
  );
  const schemes = opts.scheme === "both" ? ["light", "dark"] : [opts.scheme];
  fs.mkdirSync(opts.out, { recursive: true });
  const shots = [];
  try {
    for (const scheme of schemes) {
      const context = await browser.newContext({
        viewport: { width: opts.width, height: opts.height },
        colorScheme: scheme,
      });
      const page = await context.newPage();
      await page.goto(opts.url, { waitUntil: "networkidle" });
      await page.waitForTimeout(opts.wait);
      const cdp = await context.newCDPSession(page);
      for (const em of EMULATIONS) {
        await cdp.send("Emulation.setEmulatedVisionDeficiency", {
          type: em.id,
        });
        // let the filter apply before capturing
        await page.waitForTimeout(100);
        const file = `${scheme}-${em.id}.png`;
        const target = opts.selector
          ? page.locator(opts.selector).first()
          : page;
        await target.screenshot({ path: path.join(opts.out, file) });
        shots.push({ scheme, file, label: em.label });
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }
  fs.writeFileSync(
    path.join(opts.out, "index.html"),
    contactSheet(opts.url, shots),
  );
  return shots;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const opts = parseArgs(process.argv.slice(2));
  captureGallery(opts)
    .then((shots) => {
      console.log(
        `vision-gallery: ${shots.length} screenshots in ${opts.out}/ (open index.html)`,
      );
    })
    .catch((e) => {
      console.error(e.message);
      process.exit(1);
    });
}
