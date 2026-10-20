// Plain `node --test` suite (no browser needed):  yarn test:node
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  stripHtmlComments,
  stripScriptMarkup,
  stripTagsAndSurroundingSpace,
} from "../../lib/safe-html.js";

const N = 300_000;
const LIMIT_MS = 4000;
function timed(fn) {
  const t = performance.now();
  fn();
  return performance.now() - t;
}

// ---- stripTagsAndSurroundingSpace (code-editor placeholder) ----------------
const oldTags = (c, n) =>
  c.replace(new RegExp("\\s*<\\/?" + n + "[^>]*>\\s*", "g"), "");
test("stripTagsAndSurroundingSpace matches the old regex on realistic markup", () => {
  const cases = [
    "<template>\n  <div>x</div>\n</template>",
    "  <template id=a> foo </template>  bar",
    "a <iframe src=x></iframe> b",
    "<template></template><template>x</template>",
    "no tags here  ",
    "  \n<template>\n\n<script>1</script>\n</template>\n",
    "x<template>\n\t y",
  ];
  for (const c of cases) {
    for (const n of ["template", "iframe"]) {
      assert.equal(stripTagsAndSurroundingSpace(c, n), oldTags(c, n), c);
    }
  }
});
test("stripTagsAndSurroundingSpace + loop leaves no nested tag behind", () => {
  let c = "<tem<template>plate>x</template>";
  let prev;
  do {
    prev = c;
    c = stripTagsAndSurroundingSpace(c, "template");
  } while (c !== prev);
  assert.ok(!/<\/?template/.test(c), c);
});
test("stripTagsAndSurroundingSpace is linear time", () => {
  for (const h of [
    " ".repeat(N) + "x",
    "<template ".repeat(N / 10),
    "<template>".repeat(N / 10),
    " <template> ".repeat(N / 12),
  ]) {
    const ms = timed(() => stripTagsAndSurroundingSpace(h, "template"));
    assert.ok(ms < LIMIT_MS, `took ${ms.toFixed(0)}ms`);
  }
});

// ---- stripScriptMarkup (lrn-h5p) ------------------------------------------
test("stripScriptMarkup matches the old regex for plain <script> blocks", () => {
  const old = (s) => s.replace(/<script>[\s\S]*?(<\/script>|$)/g, "");
  for (const s of [
    "before <script>alert(1)</script> after",
    "<script>a</script><script>b</script>",
    "x <script>never closed",
    "<script>\nmulti\nline\n</script>tail",
    "no script",
  ]) {
    assert.equal(stripScriptMarkup(s), old(s), s);
  }
});
test("stripScriptMarkup also handles case, attributes and </script > closers", () => {
  assert.equal(stripScriptMarkup("a<SCRIPT>x</SCRIPT>b"), "ab");
  assert.equal(stripScriptMarkup('a<script src="x">y</script >b'), "ab");
  assert.equal(stripScriptMarkup("a<script\n>y</script foo>b"), "ab");
});
test("stripScriptMarkup is linear time", () => {
  for (const h of [
    "<script>".repeat(N / 8),
    "<script ".repeat(N / 8),
    "<script></script ".repeat(N / 17),
  ]) {
    const ms = timed(() => stripScriptMarkup(h));
    assert.ok(ms < LIMIT_MS, `took ${ms.toFixed(0)}ms`);
  }
});

// ---- stripHtmlComments (grade-book-lite) ------------------------------------
test("stripHtmlComments removes Lit comments, multi-line and --!> comments", () => {
  assert.equal(stripHtmlComments("a<!---->b<!--?lit$1$-->c"), "abc");
  assert.equal(stripHtmlComments("a<!-- x\ny -->b"), "ab");
  assert.equal(stripHtmlComments("a<!-- x --!>b"), "ab");
  assert.equal(stripHtmlComments("a<!-- open"), "a<!-- open");
});
test("stripHtmlComments is linear time", () => {
  for (const h of [
    "<!--".repeat(N / 4),
    "<!-- ".repeat(N / 5),
    "<!---->".repeat(N / 7),
  ]) {
    const ms = timed(() => stripHtmlComments(h));
    assert.ok(ms < LIMIT_MS, `took ${ms.toFixed(0)}ms`);
  }
});
