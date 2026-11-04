// node --test scripts/test
import { test } from "node:test";
import assert from "node:assert/strict";
import { findCssTemplates } from "../lib/css-templates.mjs";
import { minifyRaw, minifyTemplate } from "../lib/minify-css-template.mjs";

const mid = { afterExpr: false, beforeExpr: false };
const one = (source) => minifyTemplate(findCssTemplates(source)[0]);

test("drops comments and collapses whitespace", () => {
  assert.equal(
    minifyRaw("\n  /* note */\n  :host {\n    display: block;\n  }\n", mid),
    ":host{display: block;}",
  );
});

test("keeps quoted strings and escapes byte for byte", () => {
  assert.equal(
    minifyRaw(':host::before { content: "a  /* b */  c"; }', mid),
    ':host::before{content: "a  /* b */  c";}',
  );
  assert.equal(
    minifyRaw("  .i::after {  content: '\\\\f101' ; }", mid),
    ".i::after{content: '\\\\f101';}",
  );
});

test("keeps the space after a colon, so an empty custom property stays empty", () => {
  assert.equal(minifyRaw(":host { --empty: ; }", mid), ":host{--empty: ;}");
});

test("keeps descendant combinators, calc spacing and comma spacing", () => {
  assert.equal(
    minifyRaw(".a   .b ,  .c { width: calc(100%   -   var(--x, 2px)); }", mid),
    ".a .b , .c{width: calc(100% - var(--x, 2px));}",
  );
});

test("a comment between tokens still separates them", () => {
  assert.equal(minifyRaw(".a/* x */.b{}", mid), ".a .b{}");
});

test("keeps one space or newline where a piece touches an expression", () => {
  assert.equal(
    minifyRaw("\n  .a{}\n  ", { afterExpr: true, beforeExpr: true }),
    "\n.a{}\n",
  );
  assert.equal(
    minifyRaw(" px  solid ", { afterExpr: true, beforeExpr: true }),
    " px solid ",
  );
  assert.equal(
    minifyRaw("  { color: red; }\n  ", { afterExpr: true, beforeExpr: false }),
    "{color: red;}",
  );
});

test("an unclosed comment (spanning an expression) is refused", () => {
  assert.equal(minifyRaw("a { /* open", mid), null);
});

test("whole templates: expressions untouched, result equivalent", () => {
  const res = one(
    "const s = css`\n  :host {\n    padding: ${pad}px;\n  }\n  ${unsafeCSS(more)}\n  @media (max-width: ${bp}px) {\n    :host { display: none; }\n  }\n`;",
  );
  assert.deepEqual(res.raws, [
    ":host{padding: ",
    "px;}\n",
    "\n@media (max-width: ",
    "px){:host{display: none;}}",
  ]);
});

test("modern syntax passes through", () => {
  const res = one(
    "css`\n  :host {\n    color: light-dark(#000, #fff);\n    & .a { color: red; }\n  }\n  @container (min-width: 400px) {\n    :is(h1, h2) + p { margin: 0; }\n  }\n`",
  );
  assert.ok(res.raws);
  assert.match(res.raws[0], /& \.a\{color: red;\}/);
  assert.match(res.raws[0], /@container \(min-width: 400px\)\{/);
});

test("templates that fail the syntax check are left alone", () => {
  assert.equal(one("css`:host { z-index: var(--a - 1); }`").reason, "syntax");
});
