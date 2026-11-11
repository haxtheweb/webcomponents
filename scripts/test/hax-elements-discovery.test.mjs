// hax-elements-registry.json lists only tags whose code defines a HAXSchema:
// a comment that mentions haxProperties or shows a setHaxProperties example,
// or code that reads another element's haxProperties, does not make a tag
// HAX-capable (haxtheweb/issues#3284).
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  stripComments,
  hasHaxSchema,
  EXCLUDED_ELEMENT_TAGS,
} from "../hax-elements-discovery.mjs";

const check = (src) => hasHaxSchema(stripComments(src));

test("a static haxProperties getter or field is a HAXSchema", () => {
  assert.equal(
    check("class A { static get haxProperties() { return {}; } }"),
    true,
  );
  assert.equal(check("class A { static haxProperties = {}; }"), true);
  assert.equal(check('HAXStore.setHaxProperties(schema, "my-tag");'), true);
});

test("mentions in comments and non-schema code are not", () => {
  // app shells: a doc comment above a removed getter
  assert.equal(
    check(
      "/**\n * haxProperties integration via file reference\n */\nclass A {}",
    ),
    false,
  );
  // hax-store: a setHaxProperties example inside a block comment
  assert.equal(
    check(
      "/*\n globalThis.HaxStore.requestAvailability().setHaxProperties(x.haxProperties, 'instruction-card');\n*/",
    ),
    false,
  );
  assert.equal(check("// setHaxProperties(schema, 'x-y');"), false);
  // reading another element's schema
  assert.equal(
    check("const hp = customElements.get(tag).haxProperties;"),
    false,
  );
  // URLs inside strings survive comment stripping
  assert.equal(
    stripComments('const u = "https://example.com"; // note').includes(
      "https://example.com",
    ),
    true,
  );
});

test("placeholder schemas that are not content blocks are excluded", () => {
  assert.equal(EXCLUDED_ELEMENT_TAGS.has("simple-fields"), true);
  assert.equal(EXCLUDED_ELEMENT_TAGS.has("beaker-broker"), true);
});
