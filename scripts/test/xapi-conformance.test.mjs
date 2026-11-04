import { test } from "node:test";
import assert from "node:assert/strict";
import { validateStatement } from "../lib/xapi-conformance.mjs";
import {
  buildStatement,
  choiceResponse,
  componentIds,
  describeResponse,
  deviceActor,
  fillInItem,
  fillInResponse,
  fillInText,
  interactionComponents,
  matchingResponse,
  XAPI_EXTENSIONS,
} from "../../elements/user-action/lib/xapi.js";

const page = "https://example.org/site/page";
const actor = deviceActor("4b9f1c1e-0000-4000-8000-000000000000", page);
const statement = (object, result = {}) =>
  buildStatement({
    verb: "answered",
    actor,
    object: { id: `${page}#q`, name: "Q", ...object },
    result: {
      score: { raw: 1, max: 1, min: 0 },
      extensions: { [XAPI_EXTENSIONS.attempts]: 1 },
      ...result,
    },
    context: { pageId: page, siteId: "https://example.org/site/" },
  });
const ok = (s) => {
  const r = validateStatement(s, { haxExtensions: true });
  assert.deepEqual(r.errors, []);
};
const fails = (s, re) => {
  const r = validateStatement(s);
  assert.equal(r.valid, false);
  assert.ok(
    r.errors.some((e) => re.test(e)),
    `expected ${re} in ${r.errors.join("; ")}`,
  );
};

test("component ids: stable across reorder, unique, delimiter free", () => {
  const a = componentIds(["Light", "Sound", "Heat"]);
  const b = componentIds(["Heat", "Light", "Sound"]);
  assert.deepEqual([b[1], b[2], b[0]], a);
  a.forEach((id) => assert.match(id, /^c-[0-9a-f]{8}$/));
  // rewording changes the id, whitespace does not
  assert.notEqual(componentIds(["Light!"])[0], a[0]);
  assert.equal(componentIds(["  Light \n"])[0], a[0]);
  // duplicates are told apart the same way in any order
  const d = componentIds(["x", "y", "x"]);
  assert.equal(new Set(d).size, 3);
  assert.equal(d[2], `${d[0]}-2`);
});

test("choice, true-false, sequencing, matching, fill-in conform", () => {
  const choices = interactionComponents(["Huey", "Mickey", "Dewey"]);
  ok(
    statement(
      {
        interactionType: "choice",
        choices,
        correctResponsesPattern: [
          choiceResponse([choices[0].id, choices[2].id]),
        ],
      },
      { response: choiceResponse([choices[1].id]) },
    ),
  );
  ok(
    statement(
      { interactionType: "true-false", correctResponsesPattern: ["false"] },
      { response: "true" },
    ),
  );
  ok(
    statement(
      {
        interactionType: "sequencing",
        choices,
        correctResponsesPattern: [choiceResponse(choices.map((c) => c.id))],
      },
      { response: choiceResponse(choices.map((c) => c.id).reverse()) },
    ),
  );
  const source = interactionComponents(["Dog", "Cat"]);
  const target = interactionComponents(["Bark", "Meow"]);
  ok(
    statement(
      {
        interactionType: "matching",
        source,
        target,
        correctResponsesPattern: [
          matchingResponse([
            [source[0].id, target[0].id],
            [source[1].id, target[1].id],
          ]),
        ],
      },
      { response: matchingResponse([[source[0].id, target[1].id]]) },
    ),
  );
  ok(
    statement(
      {
        interactionType: "fill-in",
        correctResponsesPattern: [fillInResponse(["red", "{blue}"], "en")],
      },
      { response: fillInResponse(["Red", "{blue}"], "en") },
    ),
  );
});

test("the validator rejects what the spec does not allow", () => {
  const choices = interactionComponents(["A", "B"]);
  const good = statement(
    { interactionType: "choice", choices },
    { response: choices[0].id },
  );
  const clone = () => JSON.parse(JSON.stringify(good));
  let s = clone();
  s.result.response = "A";
  fails(s, /not an id in choices/);
  s = clone();
  s.object.definition.interactionType = "pick-one";
  fails(s, /interactionType/);
  s = clone();
  s.object.definition.choices[0].description = "A";
  fails(s, /description must be object/);
  s = clone();
  s.object.definition.source = choices;
  fails(s, /schema \/object\/definition/);
  s = clone();
  s.verb.id = "answered";
  fails(s, /verb\/id must match pattern/);
  s = clone();
  s.timestamp = "yesterday";
  fails(s, /timestamp must match pattern/);
  s = clone();
  s.result.score = { raw: 3, min: 0, max: 1, scaled: 1 };
  fails(s, /raw above max/);
  s = clone();
  s.result.score.scaled = 2;
  fails(s, /scaled must be <= 1/);
  s = clone();
  s.actor = { objectType: "Agent", account: { homePage: "site", name: "x" } };
  fails(s, /homePage must match pattern/);
  s = clone();
  delete s.actor;
  fails(s, /required property 'actor'/);
  s = clone();
  s.object.definition.interactionType = "true-false";
  delete s.object.definition.choices;
  fails(s, /must be "true" or "false"/);
  s = clone();
  s.object.definition.interactionType = "fill-in";
  delete s.object.definition.choices;
  s.result.response = "{case_matters=true}red";
  fails(s, /pattern parameters/);
  s = clone();
  s.object.definition.interactionType = "matching";
  delete s.object.definition.choices;
  s.object.definition.source = choices;
  s.object.definition.target = choices;
  s.result.response = `${choices[0].id}`;
  fails(s, /not source\[\.\]target/);
  s = clone();
  s.context.extensions["https://haxtheweb.org/xapi/attempts"] = 1;
  const r = validateStatement(s, { haxExtensions: true });
  assert.ok(r.errors.some((e) => /outside/.test(e)));
});

test("fill-in text: delimiters neutralised, leading brace kept via {lang=}", () => {
  assert.equal(fillInItem("a[,]b[.]c", "en"), "a,b.c");
  assert.equal(fillInItem("{x}", "en"), "{lang=en}{x}");
  assert.equal(fillInText(fillInItem("{lang=fr}hi", "en")), "{lang=fr}hi");
  assert.equal(fillInText("plain"), "plain");
});

test("describeResponse resolves ids through the definition", () => {
  const choices = interactionComponents(["Huey", "Dewey"]);
  assert.equal(
    describeResponse(
      statement(
        { interactionType: "choice", choices },
        { response: choiceResponse(choices.map((c) => c.id)) },
      ),
    ),
    "Huey, Dewey",
  );
  const source = interactionComponents(["Dog"]);
  const target = interactionComponents(["Bark"]);
  assert.equal(
    describeResponse(
      statement(
        { interactionType: "matching", source, target },
        { response: matchingResponse([[source[0].id, target[0].id]]) },
      ),
    ),
    "Dog → Bark",
  );
  assert.equal(
    describeResponse(
      statement({ interactionType: "true-false" }, { response: "false" }),
    ),
    "False",
  );
  assert.equal(
    describeResponse(
      statement(
        { interactionType: "fill-in" },
        { response: fillInResponse(["{a}", "b"], "en") },
      ),
    ),
    "{a}, b",
  );
});
