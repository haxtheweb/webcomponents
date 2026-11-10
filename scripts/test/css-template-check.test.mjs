import { test } from "node:test";
import assert from "node:assert/strict";
import { checkCss } from "../lib/css-templates.mjs";

// a template as findCssTemplates returns it, for plain CSS with no ${}
function template(css) {
  return {
    css,
    placeholderLines: new Set(),
    lineMap: css.split("\n").map((_, i) => i + 1),
  };
}

test("flags a DDD border shorthand followed by a color", () => {
  const { errors } = checkCss(
    template(
      ".a {\n  border: var(--ddd-border-xs, 1px solid)\n    var(--ddd-theme-default-slateGray);\n}",
    ),
  );
  assert.equal(errors.length, 1);
  assert.equal(errors[0].line, 2);
  assert.match(errors[0].message, /--ddd-border-size/);
});

test("flags the shorthand followed by a style and color, and on outline", () => {
  const { errors } = checkCss(
    template(
      ".a { border: var(--ddd-border-xs, 1px) solid red; }\n.b { outline: var(--ddd-border-md) transparent; }",
    ),
  );
  assert.equal(errors.length, 2);
});

test("accepts the shorthand alone and the size token with style and color", () => {
  const { errors } = checkCss(
    template(
      ".a { border: var(--ddd-border-xs); }\n.b { border: var(--ddd-border-size-xs, 1px) solid var(--c); }\n.c { outline: var(--ddd-border-sm) !important; }",
    ),
  );
  assert.equal(errors.length, 0);
});
