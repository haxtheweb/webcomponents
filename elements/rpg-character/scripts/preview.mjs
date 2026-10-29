#!/usr/bin/env node
/**
 * Render a contact sheet of rpg-character combinations with the real
 * element, so new art can be judged in place next to everything it layers
 * with.
 *
 * Start the dev server first (from elements/rpg-character: `yarn start`,
 * which serves the monorepo on http://localhost:8000), then:
 *
 *   node scripts/preview.mjs sheet.json out.png [--url URL] [--cols 6] [--size 160]
 *
 * sheet.json is a list of attribute sets, one per character:
 *
 *   [
 *     { "label": "new hat", "seed": "ada", "hat": "example" },
 *     { "label": "+ wave", "seed": "ada", "hat": "example", "pose": "wave" },
 *     { "code": "1-0103090205" }
 *   ]
 *
 * Every key except "label" becomes an attribute on <rpg-character>; true
 * becomes an empty boolean attribute. Pass "-" as sheet.json to read the list
 * from stdin. The script exits non-zero if the page logs errors, which
 * catches misspelled art paths (they 404).
 *
 * Needs Playwright with Chromium (the monorepo's test setup already has it).
 */
/* global process, console, URL, document, customElements */
import { readFileSync } from "node:fs";
import { chromium } from "playwright";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) {
    return fallback;
  }
  const value = args[i + 1];
  args.splice(i, 2);
  return value;
};
const url = flag(
  "url",
  "http://localhost:8000/elements/rpg-character/demo/index.html",
);
const cols = Number(flag("cols", 6));
const size = Number(flag("size", 160));
const [sheetPath, outPath] = args;
if (!sheetPath || !outPath) {
  console.error(
    "usage: node scripts/preview.mjs sheet.json out.png [--url URL] [--cols 6] [--size 160]",
  );
  process.exit(2);
}
const sheet = JSON.parse(
  readFileSync(sheetPath === "-" ? 0 : sheetPath, "utf8"),
);

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2 });
const problems = [];
page.on("pageerror", (e) => problems.push(e.message));
page.on("console", (m) => {
  // failed requests are reported once, below, by the response handler
  if (m.type() === "error" && !m.text().startsWith("Failed to load resource")) {
    problems.push(m.text());
  }
});
page.on("response", (r) => {
  // only the page's own files; outside fonts or CDNs may be unreachable
  if (r.status() >= 400 && new URL(r.url()).origin === new URL(url).origin) {
    problems.push(`${r.status()} ${r.url()}`);
  }
});
await page.goto(url, { waitUntil: "networkidle" });
await page.evaluate(
  async ({ sheet, cols, size }) => {
    await customElements.whenDefined("rpg-character");
    document.body.innerHTML = "";
    const grid = document.createElement("div");
    grid.id = "sheet";
    grid.style.cssText = `display:grid;grid-template-columns:repeat(${cols},${size}px);gap:8px;padding:8px;background:#fff;width:max-content;font:12px sans-serif`;
    for (const entry of sheet) {
      const cell = document.createElement("figure");
      cell.style.cssText = "margin:0;text-align:center";
      const character = document.createElement("rpg-character");
      character.style.cssText = `width:${size}px;height:${Math.round((size * 142) / 113)}px;display:block`;
      for (const [key, value] of Object.entries(entry)) {
        if (key === "label" || value === false || value == null) {
          continue;
        }
        character.setAttribute(key, value === true ? "" : String(value));
      }
      const caption = document.createElement("figcaption");
      caption.textContent = entry.label || entry.code || "";
      cell.append(character, caption);
      grid.append(cell);
    }
    document.body.append(grid);
  },
  { sheet, cols, size },
);
await page.waitForLoadState("networkidle");
await page.waitForTimeout(500);
await page.locator("#sheet").screenshot({ path: outPath });
await browser.close();
console.log(`${sheet.length} characters -> ${outPath}`);
if (problems.length) {
  console.error(`page problems:\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
