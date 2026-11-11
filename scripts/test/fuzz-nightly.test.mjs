import test from "node:test";
import assert from "node:assert/strict";
import { parseFailures } from "../fuzz-nightly.mjs";

const report = (seed, path) => [
  "    Property failed after 5 tests",
  `    { seed: ${seed}, path: "${path}", endOnFailure: true }`,
  '    Counterexample: ["q"]',
  "    Shrunk 0 time(s)",
];

test("reads the property name from TAP output (node --test, no TTY)", () => {
  const out = [
    "not ok 1 - never contains q",
    "  ---",
    "  error: |-",
    ...report(12, "4"),
  ];
  assert.deepEqual(parseFailures(out.join("\n")), [
    {
      property: "never contains q",
      seed: 12,
      path: "4",
      counterexample: '["q"]',
    },
  ]);
});

test("reads the property name from the spec / dot reporter", () => {
  const out = [
    "Failed tests:",
    "",
    "✖ never contains q (6.8ms)",
    "  Error:",
    ...report(-7, "2:0"),
  ];
  const [failure] = parseFailures(out.join("\n"));
  assert.equal(failure.property, "never contains q");
  assert.equal(failure.seed, -7);
  assert.equal(failure.path, "2:0");
});

test("reads the property name from the wtr failures reporter", () => {
  const out = [
    "✖ elements/utils/test/x-fuzz.test.js",
    "  • suite > never contains q [Chromium]",
    ...report(815689082, "8:2:0:0:8"),
  ];
  const [failure] = parseFailures(out.join("\n"));
  assert.equal(failure.property, "suite > never contains q");
  assert.equal(failure.path, "8:2:0:0:8");
});

test("reports each property once and handles output with no report", () => {
  const one = [
    "not ok 1 - a",
    ...report(1, "0"),
    "not ok 2 - b",
    ...report(1, "3"),
  ];
  const twice = one.concat(["# replay", "not ok 1 - a", ...report(1, "0")]);
  assert.deepEqual(
    parseFailures(twice.join("\n")).map((f) => f.property),
    ["a", "b"],
  );
  assert.deepEqual(parseFailures("error Command failed with exit code 1."), []);
});
