// node --test scripts/test/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  checkTag,
  loadValidator,
  plainSchema,
  stablePath,
} from "../lib/haxschema.mjs";
import {
  baselineGrowth,
  compareToBaseline,
  mergeResults,
  shrinkBaseline,
} from "../lib/gate-baseline.mjs";

const validate = loadValidator();

const facts = (schema, extra = {}) => ({
  schema,
  folder: "x-el",
  from: "elements/x-el/lib/x-el.haxProperties.json",
  attributes: { "image-src": "imageSrc", dark: "dark" },
  fields: ["imageSrc", "dark", "items"],
  slots: ["(default)", "title"],
  templateRead: true,
  ...extra,
});

const good = {
  canScale: true,
  canEditSource: true,
  gizmo: { title: "X", icon: "icons:android" },
  settings: {
    configure: [
      { property: "imageSrc", title: "Image", inputMethod: "haxupload" },
      { attribute: "dark", title: "Dark", inputMethod: "boolean" },
      { slot: "title", title: "Title", inputMethod: "code-editor" },
      { slot: "", title: "Body", inputMethod: "code-editor" },
      {
        property: "items",
        title: "Items",
        inputMethod: "array",
        properties: [
          { property: "label", title: "Label", inputMethod: "textfield" },
        ],
      },
    ],
    advanced: [],
  },
  demoSchema: [{ tag: "x-el", content: "", properties: { dark: true } }],
};

test("a matching, valid schema has no findings", () => {
  assert.deepEqual(checkTag("x-el", facts(good), validate), {});
});

test("settings must name what the element declares", () => {
  const schema = JSON.parse(JSON.stringify(good));
  schema.settings.configure.push(
    { property: "nope", title: "a", inputMethod: "textfield" },
    { attribute: "not-there", title: "b", inputMethod: "textfield" },
    { attribute: "aria-label", title: "c", inputMethod: "textfield" },
    { property: "innerHTML", title: "d", inputMethod: "textfield" },
    { slot: "missing", title: "e", inputMethod: "textfield" },
  );
  schema.demoSchema.push({ tag: "other-el", content: "", properties: {} });
  assert.deepEqual(checkTag("x-el", facts(schema), validate), {
    "setting-property": { nope: 1 },
    "setting-attribute": { "not-there": 1 },
    "setting-slot": { missing: 1 },
    "demo-tag": { "other-el": 1 },
  });
});

test("slots are not judged when no template was read", () => {
  const schema = JSON.parse(JSON.stringify(good));
  schema.settings.configure.push({ slot: "x", title: "x" });
  const r = checkTag("x-el", facts(schema, { templateRead: false }), validate);
  assert.equal(r["setting-slot"], undefined);
});

test("JSON Schema errors are keyed by the field, not its position", () => {
  const schema = JSON.parse(JSON.stringify(good));
  schema.desc = "typo";
  schema.settings.configure[0].inputMethod = "select";
  const r = checkTag("x-el", facts(schema), validate);
  assert.ok(r.schema['/: must NOT have additional properties "desc"']);
  assert.ok(
    r.schema[
      "/settings/configure/[property=imageSrc]: select needs options or itemsList"
    ],
  );
});

test("a gizmo without a demoSchema entry is reported", () => {
  const schema = JSON.parse(JSON.stringify(good));
  delete schema.demoSchema;
  const r = checkTag("x-el", facts(schema), validate);
  assert.deepEqual(Object.keys(r.schema), [
    "/demoSchema: an element with a gizmo needs a demoSchema entry (the first is what HAX inserts)",
  ]);
});

test("values computed at runtime are not reported", () => {
  const computed = Symbol("unresolved");
  const schema = JSON.parse(JSON.stringify(good));
  schema.gizmo.title = computed;
  schema.settings.configure[0].title = computed;
  const { doc, unresolved } = plainSchema(schema);
  assert.equal(doc.gizmo.title, undefined);
  assert.ok(unresolved.has("/gizmo/title"));
  assert.deepEqual(checkTag("x-el", facts(schema), validate), {});
});

test("an unreadable schema is its own finding", () => {
  assert.deepEqual(
    checkTag("x-el", facts({}, { error: "computed haxProperties URL" })),
    { unreadable: { "computed haxProperties URL": 1 } },
  );
});

test("stablePath names settings fields by target", () => {
  assert.equal(
    stablePath(good, "/settings/configure/1/title"),
    "/settings/configure/[attribute=dark]/title",
  );
  assert.equal(stablePath(good, "/demoSchema/0/tag"), "/demoSchema/N/tag");
});

test("gate baseline: new, known, fixed, growth and shrink", () => {
  const baseline = { a: { schema: { k1: 1, k2: 2 } } };
  const results = { a: { schema: { k2: 3 }, "demo-tag": { t: 1 } } };
  const { fresh, known, fixed } = compareToBaseline(results, baseline);
  assert.deepEqual(
    fresh.map((f) => `${f.group}:${f.key}`),
    ["demo-tag:t", "schema:k2"],
  );
  assert.equal(known.length, 0);
  assert.deepEqual(
    fixed.map((f) => f.key),
    ["k1"],
  );
  assert.deepEqual(shrinkBaseline(baseline, results), {
    a: { schema: { k2: 2 } },
  });
  const added = shrinkBaseline(baseline, results, { allowAdditions: true });
  assert.deepEqual(added, {
    a: { "demo-tag": { t: 1 }, schema: { k1: 1, k2: 3 } },
  });
  assert.equal(baselineGrowth(baseline, added).length, 2);
  assert.equal(baselineGrowth(added, baseline).length, 0);
  assert.deepEqual(
    mergeResults(
      { a: { m: { x: 2, y: 1 } } },
      { a: { m: { x: 1 } } },
      Math.min,
    ),
    { a: { m: { x: 1 } } },
  );
});
