// node --test scripts/test/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  pseudoLocalize,
  pseudoLocalizeObject,
  hasPseudoMarker,
  MARK_OPEN,
  MARK_CLOSE,
} from "../lib/pseudo-locale.mjs";
import {
  findPhysicalCss,
  scanRtlCss,
  compareToBaseline,
  changedFolders,
} from "../lib/i18n-layout.mjs";

test("pseudoLocalize accents, marks and grows a string by ~40%", () => {
  const out = pseudoLocalize("Save changes");
  assert.ok(out.startsWith(MARK_OPEN) && out.endsWith(MARK_CLOSE));
  assert.ok(out.includes("Šåṽé"));
  const inner = [...out].length - 2;
  assert.ok(inner >= Math.ceil("Save changes".length * 1.4));
  assert.ok(hasPseudoMarker(out));
});

test("pseudoLocalize keeps placeholders and markup intact", () => {
  const out = pseudoLocalize(
    "Hello {name}, you have %s <b>new</b> ${count} &amp;",
  );
  for (const keep of ["{name}", "%s", "<b>", "</b>", "${count}", "&amp;"]) {
    assert.ok(out.includes(keep), keep);
  }
});

test("pseudoLocalize leaves strings without letters alone and is idempotent", () => {
  assert.equal(pseudoLocalize("42 / 7"), "42 / 7");
  assert.equal(pseudoLocalize(""), "");
  const once = pseudoLocalize("Close");
  assert.equal(pseudoLocalize(once), once);
});

test("pseudoLocalizeObject walks nested this.t values", () => {
  const out = pseudoLocalizeObject({
    a: "Next",
    b: ["Prev"],
    c: { d: "Go" },
    n: 3,
  });
  assert.ok(hasPseudoMarker(out.a));
  assert.ok(hasPseudoMarker(out.b[0]));
  assert.ok(hasPseudoMarker(out.c.d));
  assert.equal(out.n, 3);
});

test("physical-direction declarations are found", () => {
  const css = `.a { margin-left: 4px; text-align: left; float: right; }
  .b { padding: 0 8px 0 4px; border-right: 1px solid; }`;
  const decls = findPhysicalCss(css).map((h) => h.decl);
  assert.deepEqual(decls, [
    "margin-left: 4px",
    "text-align: left",
    "float: right",
    "padding: 0 8px 0 4px",
    "border-right: 1px solid",
  ]);
});

test("symmetric pairs, centering, logical values and [dir] rules are not reported", () => {
  const css = `.a { left: 0; right: 0; margin-left: auto; margin-right: auto; }
  .b { left: 50%; transform: translateX(-50%); text-align: start; padding: 0 8px; }
  :host([dir="rtl"]) .c { margin-right: 4px; }
  .d:dir(rtl) { padding-left: 2px; }
  :host([offset="left"]) { float: left; margin-left: 2px; }
  :host([data-text-align=right]) .e { text-align: right; }
  /* physical on purpose: drawn over the image, which does not mirror */
  .f { left: 35%; }
  /* margin-left: 9px */`;
  assert.deepEqual(findPhysicalCss(css), []);
});

test("scanRtlCss maps findings to file lines inside css templates", () => {
  const source = [
    'import { css } from "lit";',
    "const s = css`",
    "  :host { display: block; }",
    "  .x { padding-left: 4px; }",
    "`;",
  ].join("\n");
  assert.deepEqual(scanRtlCss(source), [
    { line: 4, decl: "padding-left: 4px" },
  ]);
});

test("compareToBaseline: unknown tag/check pairs are new, known ones are advisory", () => {
  const results = {
    "x-a": {
      "overflow-pseudo": ["div > span"],
      "rtl-css": ["f.js:1  left: 1px"],
    },
    "x-b": { "rtl-css": ["f.js:1  left: 1px", "f.js:2  right: 1px"] },
  };
  const baseline = {
    "x-a": { "overflow-pseudo": 3 },
    "x-b": { "rtl-css": 1 },
    "x-c": { "outside-rtl": 1 },
  };
  const gating = ["overflow-pseudo", "rtl-css", "outside-rtl"];
  const { fresh, known } = compareToBaseline(results, baseline, gating);
  assert.deepEqual(
    fresh.map((f) => `${f.tag} ${f.check}`),
    ["x-a rtl-css", "x-b rtl-css"],
  );
  assert.deepEqual(
    known.map((k) => `${k.tag} ${k.check}`),
    ["x-a overflow-pseudo"],
  );
});

test("compareToBaseline reports checks that no longer fail as fixed", () => {
  const { fixed } = compareToBaseline(
    { "x-a": {} },
    { "x-a": { "outside-rtl": 1 } },
    ["outside-rtl"],
  );
  assert.deepEqual(fixed, [{ tag: "x-a", check: "outside-rtl" }]);
});

test("changedFolders keeps element folders only", () => {
  const folders = changedFolders([
    "elements/a11y-tabs/a11y-tabs.js",
    "elements/a11y-tabs/lib/x.js",
    "scripts/precheck.mjs",
    "elements/self-check/test/self-check.test.js",
  ]);
  assert.deepEqual([...folders].sort(), ["a11y-tabs", "self-check"]);
});
