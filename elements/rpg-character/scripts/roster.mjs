#!/usr/bin/env node
/**
 * Regenerate the named-character roster that ships with rpg-character:
 *
 *   characters.png  every preset, rendered by the real element, labeled
 *   CHARACTERS.md   the same list as a table (name, preset, default gear, code)
 *
 * Run it after adding or changing a preset. Start the dev server first
 * (from elements/rpg-character: `yarn start`, which serves the monorepo on
 * http://localhost:8000), then:
 *
 *   node scripts/roster.mjs [--url URL] [--cols 8]
 *
 * Needs Playwright with Chromium (the monorepo's test setup already has it).
 */
/* global process, console, document, customElements, URL */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { codeSlots, encodeCharacter } from "../lib/rpg-character-code.js";
import { poseArt } from "../lib/rpg-character-overlays.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const url = flag(
  "url",
  "http://localhost:8000/elements/rpg-character/demo/index.html",
);
const cols = Number(flag("cols", 8));
const size = 120;

const schema = JSON.parse(
  readFileSync(join(root, "lib/rpg-character.haxProperties.json"), "utf8"),
);
const labelsFor = (property) => {
  const field = schema.settings.configure.find((f) => f.property === property);
  return (field && field.options) || {};
};
const presetLabels = labelsFor("preset");

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: "networkidle" });
const presets = await page.evaluate(
  async ({ cols, size, presetLabels }) => {
    await customElements.whenDefined("rpg-character");
    // the same module instance the page already loaded
    const mod = await import(
      new URL("../rpg-character.js", document.baseURI).href
    );
    document.body.innerHTML = "";
    const grid = document.createElement("div");
    grid.id = "sheet";
    grid.style.cssText = `display:grid;grid-template-columns:repeat(${cols},${size}px);gap:12px 8px;padding:12px;background:#fff;width:max-content;font:12px sans-serif;color:#222`;
    for (const name of Object.keys(mod.presets)) {
      const cell = document.createElement("figure");
      cell.style.cssText = "margin:0;text-align:center";
      const character = document.createElement("rpg-character");
      character.setAttribute("seed", name);
      character.setAttribute("preset", name);
      character.style.cssText = `width:${size}px;height:${Math.round((size * 142) / 113)}px;display:block`;
      const caption = document.createElement("figcaption");
      caption.textContent = presetLabels[name] || name;
      cell.append(character, caption);
      grid.append(cell);
    }
    document.body.append(grid);
    return mod.presets;
  },
  { cols, size, presetLabels },
);
await page.waitForLoadState("networkidle");
await page.waitForTimeout(500);
await page.locator("#sheet").screenshot({ path: join(root, "characters.png") });
await browser.close();

/**
 * How many characters can be made. Counted from the registry, so it stays
 * current; see "How many characters are there?" in the README for the
 * formula and what it leaves out.
 */
function combinations() {
  const n = Object.fromEntries(
    codeSlots.map((slot) => [slot.name, BigInt(slot.values.length)]),
  );
  const codes = Object.values(n).reduce((a, b) => a * b, 1n);
  // head: shaved (one bald look), or a hat color, plus hair on base 1
  const head = 1n + n.hatColor + n.hatColor * n.hair;
  // makeup replaces the face, a preset replaces shirt and pants
  const face = n.face + (n.makeup - 1n);
  const outfit = n.shirt * n.pants + (n.preset - 1n);
  // "random" is not a look; fire with no hat draws the coffee hat
  const hats = n.hat - 1n;
  const hatAndFire = hats + (hats - 1n);
  // a raised hand drops what it was holding
  const poses = [[], ...Object.values(poseArt).map((pose) => pose.hide)];
  const hands = poses.reduce(
    (sum, hide) =>
      sum +
      (hide.includes("right") ? 1n : n.item) *
        (hide.includes("left") ? 1n : n.offhand),
    0n,
  );
  const factors = {
    head,
    skin: n.skin,
    face,
    faceItem: n.faceItem,
    accessories: n.accessories,
    outfit,
    "hat and fire": hatAndFire,
    mask: n.mask,
    pet: n.pet,
    expression: n.expression,
    circle: n.circle,
    feet: n.feet,
    "pose and hands": hands,
  };
  const looks = Object.values(factors).reduce((a, b) => a * b, 1n);
  const seedLooks =
    (n.hatColor + n.hatColor * n.hair) *
    n.skin *
    n.face *
    n.faceItem *
    n.accessories *
    n.shirt *
    n.pants;
  return { codes, looks, seedLooks, factors };
}
const fmt = (big) => big.toLocaleString("en-US");
const count = combinations();

const gearSlots = ["hat", "mask", "makeup", "item", "offhand", "feet"];
const gearLabels = Object.fromEntries(gearSlots.map((s) => [s, labelsFor(s)]));
const rows = Object.entries(presets).map(([name, gear], i) => {
  const parts = gearSlots
    .filter((slot) => gear[slot])
    .map((slot) => `${slot}: ${gearLabels[slot][gear[slot]] || gear[slot]}`);
  if (gear.shaved) {
    parts.push("shaved head");
  }
  return `| ${i + 1} | ${presetLabels[name] || name} | \`${name}\` | ${parts.join(", ") || "outfit only"} | \`${encodeCharacter({ preset: name })}\` |`;
});
writeFileSync(
  join(root, "CHARACTERS.md"),
  `# Named characters

Every character type (\`preset\`) that ships with \`rpg-character\`: ${rows.length} in all.
Use one with \`<rpg-character preset="..." seed="..."></rpg-character>\`. The seed
still decides skin, face and the other seed traits, and any default piece
can be swapped by setting that attribute. The code recreates the preset on
the default (blank) seed with \`<rpg-character code="...">\`.

![Every named character](./characters.png)

Live version: \`demo/characters.html\`. This file and \`characters.png\` are
generated by \`node scripts/roster.mjs\`; don't edit them by hand.

## How many characters?

- **${fmt(count.looks)}** different-looking characters
  (${Object.entries(count.factors)
    .map(([name, value]) => `${name} ${value}`)
    .join(" × ")}).
- **${fmt(count.seedLooks)}** of those come from a seed alone, before choosing anything.
- **${fmt(count.codes)}** possible character codes. Codes also record
  choices that end up hidden, such as hair on base 0.

See "How many characters are there?" in the README for how this is counted.

## The list

| # | Character | preset | Default pieces | Code |
| --- | --- | --- | --- | --- |
${rows.join("\n")}
`,
);
console.log(
  `${rows.length} characters -> characters.png, CHARACTERS.md; ${fmt(count.looks)} looks`,
);
