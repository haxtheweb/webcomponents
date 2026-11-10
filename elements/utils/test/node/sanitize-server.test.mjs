// Plain `node --test` suite (no browser needed):  yarn test:node
// Node has no HTML parser, like Lit server rendering, so this checks that
// sanitizeHTMLString fails closed there instead of throwing or passing the
// unsanitized markup through.
import { test } from "node:test";
import assert from "node:assert/strict";
import { sanitizeHTMLString } from "../../lib/sanitize.js";

test("sanitizeHTMLString returns nothing when there is no HTML parser", () => {
  assert.equal(globalThis.document, undefined);
  assert.equal(sanitizeHTMLString('<img src="x" onerror="alert(1)">'), "");
  assert.equal(sanitizeHTMLString("<p>safe</p>"), "");
});

test("sanitizeHTMLString fails closed with a document that cannot parse", () => {
  // the shape @lit-labs/ssr's DOM shim provides: a document without
  // document.implementation
  globalThis.document = { createElement: () => ({}) };
  try {
    assert.equal(sanitizeHTMLString("<script>alert(1)</script>"), "");
  } finally {
    delete globalThis.document;
  }
});
