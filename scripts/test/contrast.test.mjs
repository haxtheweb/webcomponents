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
