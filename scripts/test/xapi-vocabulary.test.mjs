import { test } from "node:test";
import assert from "node:assert/strict";
import { collectVocabulary, isUpToDate } from "../generate-xapi-vocabulary.mjs";

test("every xapiVocabulary getter parses and names a tag", () => {
  const { vocab, errors } = collectVocabulary();
  assert.deepEqual(errors, []);
  for (const [tag, v] of Object.entries(vocab)) {
    assert.equal(v.tag, tag);
    assert.equal(typeof v.event, "string");
    assert.ok(Array.isArray(v.verbs) && v.verbs.length, `${tag} verbs`);
    assert.equal(typeof v.countsTowardCompletion, "boolean", tag);
  }
  assert.ok(vocab["multiple-choice"].countsTowardCompletion);
  assert.equal(vocab["user-action"].countsTowardCompletion, false);
});

test("elements that send nothing on purpose say so, with a reason", () => {
  const { vocab, silent, errors } = collectVocabulary();
  assert.deepEqual(errors, []);
  for (const [tag, v] of Object.entries(silent)) {
    assert.equal(v.tag, tag);
    assert.equal(v.tracks, false);
    assert.ok(v.reason.length > 0, `${tag} reason`);
    assert.equal(typeof v.readingCheckpoint, "boolean", tag);
    // never also in the list of what sends statements
    assert.equal(vocab[tag], undefined, tag);
  }
  assert.equal(silent["page-break"].readingCheckpoint, false);
  assert.equal(silent["stop-note"].readingCheckpoint, true);
});

test("elements/user-action/lib/xapi-vocabulary.{json,js} are up to date", () => {
  assert.ok(
    isUpToDate(),
    "run node scripts/generate-xapi-vocabulary.mjs and commit the result",
  );
});
