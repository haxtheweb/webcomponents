import { test } from "node:test";
import assert from "node:assert/strict";
import {
  typescriptFindings,
  namesLts,
  nodeVersionFindings,
  countSleeps,
  sleepFindings,
  baselineGrowth,
  countAriaRefs,
  countCollapses,
  countCommonJs,
  docsMissing,
  packageNameFindings,
  themeFindings,
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

test("aria-refs: counts id references with no id in the same file", () => {
  const ok =
    'html`<h2 id="hdr">T</h2><div aria-labelledby="hdr"></div><label for="f">F</label><input id="f">`';
  assert.equal(countAriaRefs(ok), 0);
  assert.equal(
    countAriaRefs('html`<button aria-controls="menu"></button><slot></slot>`'),
    1,
  );
  assert.equal(
    countAriaRefs('html`<div aria-labelledby="a b"></div><p id="a"></p>`'),
    1,
  );
  // ids handed to a shared helper, and dynamic ids, are not counted
  assert.equal(
    countAriaRefs(
      'header({ id: "hdr" }); html`<div aria-labelledby="hdr"></div>`',
    ),
    0,
  );
  assert.equal(
    countAriaRefs('html`<div aria-labelledby="${this.labelId}"></div>`'),
    0,
  );
  // light DOM elements resolve in the document
  assert.equal(
    countAriaRefs(
      'createRenderRoot() { return this; } html`<div aria-labelledby="x"></div>`',
    ),
    0,
  );
});

test("a11y-collapse: counts collapses without heading-button", () => {
  assert.equal(
    countCollapses(
      '<a11y-collapse heading-button><p slot="heading">A</p></a11y-collapse>',
    ),
    0,
  );
  assert.equal(
    countCollapses(
      '<a11y-collapse\n  accordion\n><p slot="heading">A</p></a11y-collapse>',
    ),
    1,
  );
  assert.equal(
    countCollapses(
      "<a11y-collapse-group><a11y-collapse></a11y-collapse></a11y-collapse-group>",
    ),
    1,
  );
});

test("es-modules: counts CommonJS, not ES modules or lookalikes", () => {
  assert.equal(
    countCommonJs('import x from "./x.js";\nexport const y = 1;'),
    0,
  );
  assert.equal(
    countCommonJs(
      'const a = require("a");\nmodule.exports = a;\nexports.b = 2;',
    ),
    3,
  );
  assert.equal(
    countCommonJs('this.require("x"); obj.exports.y = 1; // requires care'),
    0,
  );
});

test("element-docs: an element needs docs data and a build that regenerates it", () => {
  const el = 'customElements.define("my-el", MyEl);';
  const pkg = {
    scripts: {
      build:
        "cem analyze && node ../../scripts/extract-element-docs.mjs --write .",
    },
  };
  assert.equal(
    docsMissing(el, "elements/my-el/my-el.js", () => true, pkg),
    0,
  );
  assert.equal(
    docsMissing(el, "elements/my-el/my-el.js", () => false, pkg),
    1,
  );
  assert.equal(
    docsMissing(el, "elements/my-el/my-el.js", () => true, {
      scripts: { build: "cem analyze" },
    }),
    1,
  );
  // not an element's main file, or no element defined
  assert.equal(
    docsMissing(el, "elements/my-el/lib/part.js", () => false, pkg),
    0,
  );
  assert.equal(
    docsMissing(
      "export const x = 1;",
      "elements/util/util.js",
      () => false,
      pkg,
    ),
    0,
  );
});

test("package-names: @haxtheweb/<folder>", () => {
  assert.deepEqual(
    packageNameFindings({ "a-b": { name: "@haxtheweb/a-b" } }),
    [],
  );
  assert.equal(
    packageNameFindings({ "a-b": { name: "a-b" }, c: { name: "@haxtheweb/d" } })
      .length,
    2,
  );
});

test("themes: each theme reaches HAXCMSLitElementTheme through its extends chain", () => {
  const themes = {
    "base-theme": { path: "@haxtheweb/t/base-theme.js" },
    "child-theme": { path: "@haxtheweb/t/child-theme.js" },
    "mixin-theme": { path: "@haxtheweb/t/mixin-theme.js" },
  };
  const sources = {
    "elements/t/base-theme.js":
      "export class BaseTheme extends DDDSuper(HAXCMSLitElementTheme) {}",
    "elements/t/child-theme.js": "class ChildTheme extends BaseTheme {}",
    "elements/t/mixin-theme.js":
      "class MixinTheme extends Parts(\n  BaseTheme,\n) {}",
  };
  assert.deepEqual(themeFindings(themes, sources), []);
  const bad = themeFindings(
    {
      "lit-theme": { path: "@haxtheweb/t/lit-theme.js" },
      "gone-theme": { path: "@haxtheweb/t/gone.js" },
    },
    { "elements/t/lit-theme.js": "class LitTheme extends LitElement {}" },
  );
  assert.equal(bad.length, 2);
  assert.match(bad[0], /does not extend HAXCMSLitElementTheme/);
  assert.match(bad[1], /file is missing/);
});
