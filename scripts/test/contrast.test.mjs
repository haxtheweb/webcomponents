// node --test scripts/test/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  targetKey,
  countViolations,
  compareToBaseline,
  baselineGrowth,
  shrinkBaseline,
  mergeResults,
  baselineSize,
  modesOf,
  paletteMode,
  parseMode,
  sortBaseline,
  takesPalettes,
} from "../lib/contrast.mjs";

test("targetKey joins shadow paths and drops positions and digits", () => {
  assert.equal(
    targetKey([["demo-snippet", "#codeDisplay", "#copyButton"]]),
    "demo-snippet >> #codeDisplay >> #copyButton",
  );
  assert.equal(
    targetKey(["ul > li:nth-child(3) > a", "span:nth-of-type(2)"]),
    "ul > li > a >> span",
  );
  assert.equal(targetKey(["#item-12345 > h2"]), "#item-N > hN");
});

test("countViolations counts nodes per key and ignores other rules", () => {
  const counts = countViolations([
    {
      id: "color-contrast",
      nodes: [
        { target: ["p:nth-child(1)"] },
        { target: ["p:nth-child(2)"] },
        { target: [["x-el", ".label"]] },
      ],
    },
    { id: "image-alt", nodes: [{ target: ["img"] }] },
  ]);
  assert.deepEqual(counts, { p: 2, "x-el >> .label": 1 });
});

test("compareToBaseline: missing key or higher count is new", () => {
  const baseline = { a: { dark: { p: 2, ".gone": 1 } } };
  const results = {
    a: { light: { h1: 1 }, dark: { p: 3 } },
    b: { dark: {} },
  };
  const { fresh, known, fixed } = compareToBaseline(results, baseline);
  assert.deepEqual(
    fresh.map((f) => [f.element, f.mode, f.key, f.count, f.baseline]),
    [
      ["a", "light", "h1", 1, 0],
      ["a", "dark", "p", 3, 2],
    ],
  );
  assert.equal(known.length, 0);
  assert.deepEqual(
    fixed.map((f) => [f.element, f.mode, f.key]),
    [["a", "dark", ".gone"]],
  );
  // equal or lower counts are known
  const again = compareToBaseline({ a: { dark: { p: 1 } } }, baseline);
  assert.equal(again.fresh.length, 0);
  assert.equal(again.known.length, 1);
});

test("baselineGrowth reports added keys and raised counts only", () => {
  const before = { a: { dark: { p: 2 } } };
  assert.deepEqual(baselineGrowth(before, { a: { dark: { p: 1 } } }), []);
  assert.deepEqual(baselineGrowth(before, {}), []);
  const grown = baselineGrowth(before, {
    a: { dark: { p: 3 }, light: { h1: 1 } },
  });
  assert.deepEqual(
    grown.map((g) => [g.mode, g.key, g.count, g.baseline]),
    [
      ["light", "h1", 1, 0],
      ["dark", "p", 3, 2],
    ],
  );
});

test("shrinkBaseline only lowers by default, only adds with allowAdditions", () => {
  const baseline = {
    a: { dark: { p: 2, ".x": 1 } },
    untouched: { light: { h1: 1 } },
  };
  const results = { a: { light: { new: 4 }, dark: { p: 1 } } };
  assert.deepEqual(shrinkBaseline(baseline, results), {
    a: { dark: { p: 1 } },
    untouched: { light: { h1: 1 } },
  });
  assert.deepEqual(
    shrinkBaseline(baseline, results, { allowAdditions: true }),
    {
      a: { light: { new: 4 }, dark: { ".x": 1, p: 2 } },
      untouched: { light: { h1: 1 } },
    },
  );
  // an element with nothing left is dropped
  assert.deepEqual(shrinkBaseline(baseline, { a: { light: {}, dark: {} } }), {
    untouched: { light: { h1: 1 } },
  });
  assert.equal(baselineSize(baseline), 4);
});

test("mergeResults keeps what both runs saw (min) or either saw (max)", () => {
  const a = { e: { light: { p: 2 }, dark: { q: 1 } }, only: { light: {} } };
  const b = { e: { light: { p: 1, r: 1 }, dark: {} } };
  assert.deepEqual(mergeResults(a, b, Math.min), {
    e: { light: { p: 1 }, dark: {} },
  });
  assert.deepEqual(mergeResults(a, b, Math.max), {
    e: { light: { p: 2, r: 1 }, dark: { q: 1 } },
  });
});

test("paletteMode and parseMode round-trip palette and theme modes", () => {
  assert.equal(paletteMode("dark", "salmon-season"), "dark@salmon-season");
  assert.equal(
    paletteMode("light", null, "journey-sidebar-theme"),
    "light@journey-sidebar-theme",
  );
  assert.equal(
    paletteMode("light", "monotone", "journey-sidebar-theme"),
    "light@journey-sidebar-theme:monotone",
  );
  assert.equal(paletteMode("dark", null, null), "dark");
  assert.deepEqual(parseMode("light"), {
    scheme: "light",
    theme: null,
    palette: null,
  });
  assert.deepEqual(parseMode("dark@salmon-season"), {
    scheme: "dark",
    theme: null,
    palette: "salmon-season",
  });
  assert.deepEqual(parseMode("light@journey-sidebar-theme:monotone"), {
    scheme: "light",
    theme: "journey-sidebar-theme",
    palette: "monotone",
  });
  assert.deepEqual(
    parseMode("light@journey-sidebar-theme", ["journey-sidebar-theme"]),
    { scheme: "light", theme: "journey-sidebar-theme", palette: null },
  );
});

test("modesOf lists light and dark first, then palette modes in order", () => {
  assert.deepEqual(
    modesOf(
      { "light@monotone": {}, dark: {} },
      { light: {}, "dark@berry-bramble": {} },
    ),
    ["light", "dark", "dark@berry-bramble", "light@monotone"],
  );
  assert.deepEqual(modesOf(undefined, null), []);
});

test("palette modes go through compare, shrink, merge and sort", () => {
  const baseline = {
    "x-theme": { "dark@monotone": { "x-theme >> header": 2 } },
  };
  const results = {
    "x-theme": {
      light: {},
      dark: {},
      "dark@monotone": { "x-theme >> header": 1 },
      "light@salmon-season": { "x-theme >> footer": 1 },
    },
  };
  const { fresh, fixed } = compareToBaseline(results, baseline);
  assert.deepEqual(
    fresh.map((f) => [f.mode, f.key]),
    [["light@salmon-season", "x-theme >> footer"]],
  );
  assert.deepEqual(
    fixed.map((f) => [f.mode, f.count, f.baseline]),
    [["dark@monotone", 1, 2]],
  );
  assert.deepEqual(shrinkBaseline(baseline, results), {
    "x-theme": { "dark@monotone": { "x-theme >> header": 1 } },
  });
  assert.equal(baselineGrowth(baseline, results).length, 1);
  const merged = mergeResults(
    results,
    { "x-theme": { "dark@monotone": { "x-theme >> header": 3 } } },
    Math.min,
  );
  assert.deepEqual(merged["x-theme"]["dark@monotone"], {
    "x-theme >> header": 1,
  });
  assert.deepEqual(Object.keys(sortBaseline(results)["x-theme"]), [
    "dark@monotone",
    "light@salmon-season",
  ]);
});

test("takesPalettes: palette tokens or a reflected data-palette", () => {
  assert.equal(
    takesPalettes(["a { color: var(--ddd-palette-color-1); }"]),
    true,
  );
  assert.equal(
    takesPalettes(["a { color: var(--ddd-palette-text-color-6); }"]),
    true,
  );
  assert.equal(
    takesPalettes([
      'dataPalette: { type: Number, reflect: true, attribute: "data-palette" }',
    ]),
    true,
  );
  assert.equal(
    takesPalettes(["a { color: var(--ddd-theme-default-white); }"]),
    false,
  );
  assert.equal(takesPalettes([]), false);
});
