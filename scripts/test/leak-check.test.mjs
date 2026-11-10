// node --test scripts/test/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CHECKS,
  changedFolders,
  compareToBaseline,
  frameToRepoPath,
  groupRecords,
  leakThreshold,
  toChecks,
} from "../lib/leak-check.mjs";

test("stack frame URLs become repo paths with a line", () => {
  assert.equal(
    frameToRepoPath("http://localhost:8002/elements/a/a.js:12:5"),
    "elements/a/a.js:12",
  );
  assert.equal(
    frameToRepoPath(
      "http://127.0.0.1:9000/__wds-outside-root__/1/node_modules/x/y.js?wds-import-map=0:7:1",
    ),
    "node_modules/x/y.js:7",
  );
  assert.equal(frameToRepoPath(""), "");
  assert.equal(frameToRepoPath("not a frame"), "not a frame");
});

test("the threshold is half the cycles, at least two", () => {
  assert.equal(leakThreshold(12), 6);
  assert.equal(leakThreshold(13), 7);
  assert.equal(leakThreshold(2), 2);
});

test("groupRecords keeps only groups that grew with the cycles", () => {
  const records = [];
  for (let i = 0; i < 12; i++) {
    records.push({ what: 'window "resize" listener', where: "a.js:1" });
  }
  records.push({ what: 'window "scroll" listener', where: "a.js:9" });
  assert.deepEqual(groupRecords(records, 6), [
    'window "resize" listener x12  at a.js:1',
  ]);
});

test("toChecks turns per-cycle leftovers into checks and ignores constants", () => {
  const twelve = (what, where) =>
    Array.from({ length: 12 }, () => ({
      what,
      where: `http://localhost:1/${where}:3:1`,
    }));
  const checks = toChecks({
    cycles: 12,
    listeners: twelve('window "resize" listener', "elements/a/a.js"),
    observers: twelve("ResizeObserver", "elements/a/b.js"),
    intervals: [
      { what: "setInterval(100ms)", where: "http://localhost:1/x.js:1:1" },
    ],
    raf: [{ where: "http://localhost:1/elements/a/a.js:40:2", perFrame: 12 }],
    stores: [
      { path: "Store.instance.items", delta: 12 },
      { path: "Store.instance.tags", delta: 1 },
    ],
    retained: 12,
  });
  assert.deepEqual(Object.keys(checks).sort(), [
    "global-stores",
    "listeners",
    "observers",
    "raf-loops",
    "retained",
  ]);
  assert.deepEqual(checks.listeners, [
    'window "resize" listener x12  at elements/a/a.js:3',
  ]);
  assert.deepEqual(checks["global-stores"], [
    "globalThis.Store.instance.items +12",
  ]);
  assert.deepEqual(toChecks({ cycles: 12, retained: 1 }), {});
});

test("compareToBaseline: new, known and fixed per tag and check", () => {
  const results = {
    "a-b": { listeners: ["x"], retained: ["y"] },
    "c-d": {},
  };
  const baseline = { "a-b": { retained: 1 }, "c-d": { intervals: 1 } };
  const { fresh, known, fixed } = compareToBaseline(
    results,
    baseline,
    Object.keys(CHECKS),
  );
  assert.deepEqual(
    fresh.map((f) => `${f.tag} ${f.check}`),
    ["a-b listeners"],
  );
  assert.deepEqual(
    known.map((f) => `${f.tag} ${f.check}`),
    ["a-b retained"],
  );
  assert.deepEqual(fixed, [{ tag: "c-d", check: "intervals" }]);
});

test("changedFolders maps files to element folders", () => {
  assert.deepEqual(
    [
      ...changedFolders([
        "elements/a11y-tabs/a11y-tabs.js",
        "elements/a11y-tabs/lib/x.js",
        "scripts/leak-check.mjs",
      ]),
    ],
    ["a11y-tabs"],
  );
});
