import { test } from "node:test";
import assert from "node:assert/strict";
import {
  typescriptFindings,
  namesLts,
  nodeVersionFindings,
  countSleeps,
  sleepFindings,
  baselineGrowth,
} from "../rule-checks.mjs";

test("typescript: flags .ts, .tsx, .mts and .cts, allows .d.ts and .js", () => {
  const got = typescriptFindings([
    "elements/a/a.js",
    "elements/a/a.d.ts",
    "elements/b/b.ts",
    "elements/c/c.tsx",
    "elements/d/d.mts",
    "elements/e/e.cts",
  ]);
  assert.equal(got.length, 4);
  assert.ok(got[0].startsWith("elements/b/b.ts:"));
});

test("node-version: what names the LTS", () => {
  for (const v of ["24", "24.x", "^24", ">=24", "v24.11.0", "'24'", "lts/*"])
    assert.ok(namesLts(v, 24), v);
  for (const v of ["22", "20.x", "18", "^22", "latest"])
    assert.ok(!namesLts(v, 24), v);
});

test("node-version: engines, version files and workflows", () => {
  const ok = nodeVersionFindings(
    {
      pkg: { engines: { node: "24.x" } },
      versionFiles: { ".nvmrc": "24\n" },
      workflows: {
        "a.yml":
          "      - uses: actions/setup-node\n        with:\n          node-version: 24\n",
        "b.yml":
          "        node-version: [24]\n          node-version: ${{ matrix.node-version }}\n",
      },
    },
    24,
  );
  assert.deepEqual(ok, []);
  const bad = nodeVersionFindings(
    {
      pkg: { engines: {} },
      versionFiles: { ".nvmrc": "22\n" },
      workflows: {
        "c.yml":
          "x\n          node-version: 20 # old\n        node-version: [22, 24]\n",
      },
    },
    24,
  );
  assert.equal(bad.length, 4);
  assert.match(bad[0], /engines.node is missing/);
  assert.match(bad[1], /\.nvmrc/);
  assert.match(bad[2], /c\.yml:2: node-version 20/);
  assert.match(bad[3], /c\.yml:3: node-version 22/);
});

test("test-sleeps: counts the fixed-sleep forms, not polling", () => {
  const text = [
    "await aTimeout(100);",
    "await new Promise((r) => setTimeout(r, 50));",
    "await new Promise((resolve) => setTimeout(resolve, ms));",
    "await new Promise(r => setTimeout(r, 0));",
    "await page.waitForTimeout(200);",
    "await waitUntil(() => el.ready);",
    "setTimeout(() => el.click(), 10);",
    "await new Promise((r) => setTimeout(() => r(el.x), 5));",
  ].join("\n");
  assert.equal(countSleeps(text), 5);
});

test("test-sleeps: a file may not exceed its baseline", () => {
  const got = sleepFindings(
    { "elements/a/test/a.test.js": 3, "elements/b/test/b.test.js": 1 },
    { "elements/a/test/a.test.js": 3 },
  );
  assert.equal(got.length, 1);
  assert.match(got[0], /b\.test\.js: 1 fixed sleep\(s\), 0 allowed/);
  assert.deepEqual(sleepFindings({ "x.js": 2 }, { "x.js": 4 }), []);
});

test("test-sleeps: the baseline only shrinks", () => {
  assert.deepEqual(baselineGrowth({ "a.js": 3, "b.js": 1 }, { "a.js": 2 }), []);
  const got = baselineGrowth({ "a.js": 3 }, { "a.js": 4, "c.js": 1 });
  assert.equal(got.length, 2);
  assert.match(got[0], /raises a\.js from 3 to 4/);
  assert.match(got[1], /adds c\.js/);
});
