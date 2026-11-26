import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
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
  countHaxcmsNamespace,
  countRedIncorrect,
  countUndeclaredTracking,
  countLinkRewrites,
  secretFindings,
  modelCallFindings,
  registryFindings,
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

test("mfr-haxcms: counts the retired @haxcms/ namespace only", () => {
  assert.equal(
    countHaxcmsNamespace(
      'MicroFrontendRegistry.call("@haxcms/pageCache", {});',
    ),
    1,
  );
  assert.equal(
    countHaxcmsNamespace(
      'MicroFrontendRegistry.call("@system/importSite"); call("@site/x")',
    ),
    0,
  );
});

test("incorrect-colors: a wrong-answer rule painted red counts, purple does not", () => {
  assert.equal(
    countRedIncorrect(
      ".answer.incorrect { color: var(--ddd-theme-default-error); }",
    ),
    1,
  );
  assert.equal(
    countRedIncorrect(":host([wrong]) .mark { background-color: red; }"),
    1,
  );
  assert.equal(
    countRedIncorrect(".incorrect { color: var(--ddd-status-incorrect-ink); }"),
    0,
  );
  assert.equal(
    countRedIncorrect(
      ".error-message { color: var(--ddd-theme-default-error); }",
    ),
    0,
  );
  assert.equal(countRedIncorrect(".correct { color: green; }"), 0);
});

test("tracking-declared: a file that sends xAPI declares its vocabulary", () => {
  const sends =
    'this.dispatchEvent(new CustomEvent("user-engagement", { detail }));';
  assert.equal(countUndeclaredTracking(sends), 1);
  assert.equal(
    countUndeclaredTracking(
      sends + " static get xapiVocabulary() { return {}; }",
    ),
    0,
  );
  assert.equal(
    countUndeclaredTracking("const s = buildStatement(verb, object);"),
    1,
  );
  assert.equal(
    countUndeclaredTracking('this.addEventListener("click", go);'),
    0,
  );
});

test("link-rewrites: rewriting http links or upgrading requests counts", () => {
  assert.equal(
    countLinkRewrites('href = href.replace("http://", "https://");'),
    1,
  );
  assert.equal(countLinkRewrites("url.replace(/^http:/, 'https:')"), 1);
  assert.equal(
    countLinkRewrites('meta.content = "upgrade-insecure-requests";'),
    1,
  );
  assert.equal(countLinkRewrites("const u = new URL(href, base);"), 0);
});

test("secrets: high-confidence shapes, allow-listed by hash only", () => {
  const key = "AIza" + "B".repeat(35);
  assert.equal(secretFindings("a.json", `{"key":"${key}"}`).length, 1);
  assert.equal(
    secretFindings("a.txt", "-----BEGIN " + "PRIVATE KEY-----").length,
    1,
  );
  assert.equal(secretFindings("a.txt", "token: ghp_short").length, 0);
  const hash = createHash("sha256").update(key).digest("hex");
  assert.equal(
    secretFindings("a.json", `{"key":"${key}"}`, [
      { file: "a.json", sha256: hash },
    ]).length,
    0,
  );
  assert.equal(
    secretFindings("b.json", `{"key":"${key}"}`, [
      { file: "a.json", sha256: hash },
    ]).length,
    1,
  );
});

test("model-calls: a call site must be listed, and a test never reaches a model", () => {
  const call =
    'await fetch("https://api.openai.com/v1/chat/completions", opts);';
  assert.equal(modelCallFindings("elements/x/x.js", call).length, 1);
  assert.equal(
    modelCallFindings("elements/x/x.js", call, [{ file: "elements/x/x.js" }])
      .length,
    0,
  );
  assert.equal(
    modelCallFindings("elements/x/test/x.test.js", call, [
      { file: "elements/x/test/x.test.js" },
    ]).length,
    1,
  );
  assert.equal(
    modelCallFindings("elements/x/x.js", "const s = await Summarizer.create();")
      .length,
    1,
  );
  assert.equal(
    modelCallFindings(
      "elements/x/x.js",
      'import x from "./llms.js"; fetch("/x/api/v1/site");',
    ).length,
    0,
  );
});

test("wc-registry: @haxtheweb entries resolve, and the demo copy matches", () => {
  const reg = { "a-b": "@haxtheweb/a-b/a-b.js", "x-y": "@other/x/x.js" };
  const has = (f) => f === "elements/a-b/a-b.js";
  assert.deepEqual(registryFindings(reg, reg, has), []);
  assert.equal(
    registryFindings({ ...reg, "c-d": "@haxtheweb/c-d/c-d.js" }, null, has)
      .length,
    1,
  );
  assert.match(
    registryFindings(
      reg,
      { "a-b": "@haxtheweb/a-b/old.js", "x-y": "@other/x/x.js" },
      has,
    )[0],
    /differs/,
  );
});
