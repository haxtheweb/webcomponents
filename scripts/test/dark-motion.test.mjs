// node --test scripts/test/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { darkFindings, motionCounts } from "../lib/dark-motion.mjs";
import { compareToBaseline } from "../lib/gate-baseline.mjs";

const run = (colors) => ({ colors });

test("own colors unchanged in dark mode are reported", () => {
  const own = ["0:background:rgb(255, 255, 255)", "0:color:rgb(34, 34, 34)"];
  assert.deepEqual(
    darkFindings(
      run({ "x-el": { own, aware: false } }),
      run({ "x-el": { own, aware: false } }),
    ),
    { "x-el": 1 },
  );
});

test("colors that change, dark-aware styles and inherited colors pass", () => {
  const light = ["0:background:rgb(255, 255, 255)"];
  const dark = ["0:background:rgb(0, 0, 0)"];
  assert.deepEqual(
    darkFindings(
      run({
        changes: { own: light, aware: false },
        aware: { own: light, aware: true },
        inherits: { own: [], aware: false },
      }),
      run({
        changes: { own: dark, aware: false },
        aware: { own: light, aware: true },
        inherits: { own: [], aware: false },
      }),
    ),
    {},
  );
});

test("a tag missing from the dark run is not judged", () => {
  assert.deepEqual(
    darkFindings(
      run({ "x-el": { own: ["0:color:red"], aware: false } }),
      run({}),
    ),
    {},
  );
});

test("motion is recorded once per animation, whatever the timing", () => {
  const counts = motionCounts([
    { key: "transition opacity on x-el", ms: "300ms" },
    { key: "transition opacity on x-el", ms: "300ms" },
    { key: "animation spin on x-el >> span.spin", ms: "infinite" },
  ]);
  assert.deepEqual(counts, {
    "transition opacity on x-el": 1,
    "animation spin on x-el >> span.spin": 1,
  });
  const { fresh, known } = compareToBaseline(
    { "x-el": { motion: counts, "dark-ignored": {} } },
    { "x-el": { motion: { "transition opacity on x-el": 1 } } },
  );
  assert.deepEqual(
    fresh.map((f) => f.key),
    ["animation spin on x-el >> span.spin"],
  );
  assert.equal(known.length, 1);
});
