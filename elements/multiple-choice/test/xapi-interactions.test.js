import { fixture, expect, html } from "@open-wc/testing";
import { executeServerCommand } from "@web/test-runner-commands";
import "../multiple-choice.js";
import "../lib/true-false-question.js";
import "../lib/short-answer-question.js";
import {
  activityId,
  authoredResource,
  deviceActor,
  legacyActivityId,
  setActorProvider,
} from "@haxtheweb/user-action/lib/xapi.js";

const flush = (ms = 40) => new Promise((r) => setTimeout(r, ms));
const settle = async (els) => {
  await flush();
  await Promise.all(els.map((el) => el.updateComplete));
  await flush();
  await Promise.all(els.map((el) => el.updateComplete));
};
const page = () =>
  `${globalThis.location.origin}${globalThis.location.pathname}`;
const text = (c) => Object.values(c.description)[0];
const idOf = (list, label) => list.find((c) => text(c) === label).id;

// every statement goes through the xAPI 1.0.3 statement schema (ajv, run by
// the test runner: scripts/lib/xapi-conformance.mjs)
export async function expectConformant(statement) {
  const r = await executeServerCommand("xapi-validate", statement);
  expect(r, "xapi-validate server command").to.be.an("object");
  expect(r.errors).to.deep.equal([]);
  expect(r.valid).to.equal(true);
}

async function check(el, pick) {
  const events = [];
  const h = (e) => events.push(e.detail);
  el.addEventListener("user-engagement", h);
  pick(el);
  await el.checkAnswer();
  await settle([el]);
  el.removeEventListener("user-engagement", h);
  expect(events.length).to.equal(1);
  return events[0];
}

describe("question xAPI interactions (choice, true-false, fill-in)", () => {
  before(() =>
    setActorProvider(() =>
      deviceActor("4b9f1c1e-0000-4000-8000-000000000001", page()),
    ),
  );
  after(() => setActorProvider(null));

  it("multiple-choice: choices, id response, pattern", async () => {
    const el = await fixture(
      html`<multiple-choice id="mc-x" question="Which are ducks?">
        <input data-correct="true" value="Huey" />
        <input value="Mickey" />
        <input data-correct="true" value="Dewey" />
      </multiple-choice>`,
    );
    await settle([el]);
    const d = await check(el, (q) =>
      q.displayedAnswers.forEach((a) => {
        a.userGuess = a.label !== "Dewey" ? true : "";
      }),
    );
    const def = d.statement.object.definition;
    expect(def.interactionType).to.equal("choice");
    expect(def.choices.map(text)).to.deep.equal(["Huey", "Mickey", "Dewey"]);
    const [huey, mickey, dewey] = def.choices.map((c) => c.id);
    expect(def.correctResponsesPattern).to.deep.equal([`${huey}[,]${dewey}`]);
    expect(d.statement.result.response).to.equal(`${huey}[,]${mickey}`);
    // the old event fields are all still there
    expect(d).to.include({ activityDisplay: "answered", resultSuccess: false });
    await expectConformant(d.statement);
  });

  it("component ids do not depend on the order options are shown in", async () => {
    const a = await fixture(
      html`<multiple-choice question="Q">
        <input value="One" /><input value="Two" /><input value="Three" />
      </multiple-choice>`,
    );
    const b = await fixture(
      html`<multiple-choice question="Q" randomize>
        <input value="Three" /><input value="One" /><input value="Two" />
      </multiple-choice>`,
    );
    await settle([a, b]);
    const ids = (el) =>
      Object.fromEntries(
        el.xapiDefinition().choices.map((c) => [c.description, c.id]),
      );
    expect(ids(a)).to.deep.equal(ids(b));
    // rewording an option changes its id only
    b.answers = [
      { label: "Three" },
      { label: "One!" },
      { label: "Two", correct: true },
    ];
    await settle([b]);
    expect(ids(b).Three).to.equal(ids(a).Three);
    expect(ids(b).Two).to.equal(ids(a).Two);
    expect(ids(b)["One!"]).to.not.equal(ids(a).One);
  });

  it("true-false: spec literals, no components", async () => {
    const el = await fixture(
      html`<true-false-question id="tf-x" question="Sound needs air">
        <input data-correct="true" value="True" />
        <input value="False" />
      </true-false-question>`,
    );
    await settle([el]);
    const d = await check(el, (q) =>
      q.displayedAnswers.forEach((a) => {
        a.userGuess = a.label === "False" ? true : "";
      }),
    );
    const def = d.statement.object.definition;
    expect(def.interactionType).to.equal("true-false");
    expect(def.choices).to.equal(undefined);
    expect(def.correctResponsesPattern).to.deep.equal(["true"]);
    expect(d.statement.result.response).to.equal("false");
    await expectConformant(d.statement);
  });

  it("short-answer: learner text, accepted answers as patterns", async () => {
    const el = await fixture(
      html`<short-answer-question id="sa-x" question="Pitch depends on">
        <input data-correct="true" value="frequency" />
        <input data-correct="true" value="{f}" />
      </short-answer-question>`,
    );
    await settle([el]);
    const d = await check(el, (q) => {
      q.shortanswer = "{Frequency} [,] of waves";
    });
    const def = d.statement.object.definition;
    expect(def.interactionType).to.equal("fill-in");
    expect(def.choices).to.equal(undefined);
    expect(def.correctResponsesPattern[0]).to.equal("frequency");
    expect(def.correctResponsesPattern[1]).to.match(/^\{lang=[^}]+\}\{f\}$/);
    // the delimiter can not be escaped, so it is reduced; a leading brace
    // gets the item level {lang=} parameter
    expect(d.statement.result.response).to.match(
      /^\{lang=[^}]+\}\{Frequency\} , of waves$/,
    );
    await expectConformant(d.statement);
  });
});

describe("restoring a saved answer from component ids", () => {
  it("multiple-choice picks the saved ids and ignores stale ones", async () => {
    const el = await fixture(
      html`<multiple-choice question="Q">
        <input data-correct="true" value="A" />
        <input value="B" />
        <input value="C" />
      </multiple-choice>`,
    );
    await settle([el]);
    const choices = el.xapiDefinition().choices;
    const a = choices.find((c) => c.description === "A").id;
    const c = choices.find((x) => x.description === "C").id;
    expect(el.restoreLearnerResponse(`${c}[,]c-deadbeef[,]${a}`)).to.equal(
      true,
    );
    expect(el.getGuess().map((x) => x.label)).to.have.members(["A", "C"]);
    // only stale ids: nothing to put back
    el.forgetLearnerResponse();
    expect(el.restoreLearnerResponse("c-deadbeef")).to.equal(false);
    expect(el.getGuess().length).to.equal(0);
    // a label saved before ids were used still works
    expect(el.restoreLearnerResponse("B")).to.equal(true);
    expect(el.getGuess().map((x) => x.label)).to.deep.equal(["B"]);
  });

  it("true-false and short-answer restore their xAPI responses", async () => {
    const tf = await fixture(
      html`<true-false-question question="Q">
        <input value="True" />
        <input data-correct="true" value="False" />
      </true-false-question>`,
    );
    const sa = await fixture(
      html`<short-answer-question question="Q">
        <input data-correct="true" value="{x}" />
      </short-answer-question>`,
    );
    await settle([tf, sa]);
    expect(tf.restoreLearnerResponse("false")).to.equal(true);
    expect(tf.isCorrect()).to.equal(true);
    sa.shortanswer = "{x}";
    const saved = sa.learnerResponse();
    sa.shortanswer = null;
    expect(sa.restoreLearnerResponse(saved)).to.equal(true);
    expect(sa.shortanswer).to.equal("{x}");
    expect(sa.isCorrect()).to.equal(true);
  });

  it("a returning visit restores from saved ids", async () => {
    const records = {};
    const h = (e) => {
      e.detail.record = records[e.detail.activityId] || null;
    };
    globalThis.addEventListener("learner-progress-request", h);
    try {
      const probe = await fixture(
        html`<multiple-choice question="Q">
          <input data-correct="true" value="Yes" /><input value="No" />
        </multiple-choice>`,
      );
      await settle([probe]);
      const yes = probe
        .xapiDefinition()
        .choices.find((c) => c.description === "Yes").id;
      records[`${page()}#back`] = {
        status: "correct",
        done: true,
        attempts: 1,
        response: yes,
      };
      const el = await fixture(
        html`<multiple-choice id="back" question="Q">
          <input data-correct="true" value="Yes" /><input value="No" />
        </multiple-choice>`,
      );
      await settle([el]);
      expect(el.showAnswer).to.equal(true);
      expect(el.getGuess().map((x) => x.label)).to.deep.equal(["Yes"]);
    } finally {
      globalThis.removeEventListener("learner-progress-request", h);
    }
  });
});

describe("activity id order: id > authored resource > fingerprint", () => {
  it("uses the element id first, then the authored resource", async () => {
    const root = await fixture(
      html`<div>
        <multiple-choice id="named" resource="#res-a" question="Same">
          <input value="A" />
        </multiple-choice>
        <multiple-choice resource="#res-b" question="Same">
          <input value="A" />
        </multiple-choice>
        <multiple-choice question="Same"><input value="A" /></multiple-choice>
      </div>`,
    );
    const [named, authored, plain] = Array.from(root.children);
    await settle([named, authored, plain]);
    expect(activityId(named)).to.equal(`${page()}#named`);
    expect(authoredResource(authored)).to.equal("#res-b");
    expect(activityId(authored)).to.equal(`${page()}#res-b`);
    // the third had no resource: SchemaBehaviors generated one this load,
    // which is ignored; it keeps its content fingerprint key
    expect(plain.getAttribute("resource")).to.match(/^#/);
    expect(authoredResource(plain)).to.equal("");
    expect(activityId(plain)).to.match(/#multiple-choice-[0-9a-f]+$/);
    // its fingerprint key no longer counts the authored element as a twin
    expect(activityId(plain)).to.not.match(/-1$/);
    expect(legacyActivityId(plain)).to.match(/-1$/);
  });

  it("a generated resource never becomes the key, on any upgrade order", async () => {
    // defined before the markup: created, attributes set, then connected
    const made = globalThis.document.createElement("multiple-choice");
    made.setAttribute("resource", "#set-before-connect");
    made.question = "Made";
    const bare = globalThis.document.createElement("multiple-choice");
    bare.question = "Made";
    const host = await fixture(html`<div></div>`);
    host.append(made, bare);
    await settle([made, bare]);
    expect(activityId(made)).to.equal(`${page()}#set-before-connect`);
    expect(bare.getAttribute("resource")).to.match(/^#/);
    expect(activityId(bare)).to.not.contain(
      encodeURIComponent(bare.getAttribute("resource")),
    );
    // parsed markup (innerHTML) with the element already defined
    host.innerHTML = `<multiple-choice resource="#parsed" question="P"></multiple-choice><multiple-choice question="P"></multiple-choice>`;
    const [parsed, parsedBare] = Array.from(host.children);
    await settle([parsed, parsedBare]);
    expect(activityId(parsed)).to.equal(`${page()}#parsed`);
    expect(authoredResource(parsedBare)).to.equal("");
    // a key read before and after the first update is the same
    const before = activityId(parsedBare);
    parsedBare.requestUpdate();
    await settle([parsedBare]);
    expect(activityId(parsedBare)).to.equal(before);
  });

  it("asks for the legacy key when the authored resource changed it", async () => {
    const asked = [];
    const h = (e) => asked.push({ ...e.detail });
    globalThis.addEventListener("learner-progress-request", h);
    const el = await fixture(
      html`<multiple-choice resource="#kept" question="Legacy">
        <input value="A" />
      </multiple-choice>`,
    );
    await settle([el]);
    globalThis.dispatchEvent(new CustomEvent("learner-progress-ready"));
    globalThis.removeEventListener("learner-progress-request", h);
    const mine = asked.find((d) => d.activityId === activityId(el));
    expect(mine.legacyActivityId).to.equal(legacyActivityId(el));
    expect(mine.legacyActivityId).to.match(/#multiple-choice-[0-9a-f]+$/);
    // an element keyed by id has nothing to migrate
    const named = await fixture(
      html`<multiple-choice
        id="no-legacy"
        question="Legacy"
      ></multiple-choice>`,
    );
    await settle([named]);
    expect(legacyActivityId(named)).to.equal(activityId(named));
  });
});

describe("checkAnswer timing", () => {
  it("resolves once the check has run, with or without a view transition", async () => {
    const el = await fixture(
      html`<multiple-choice question="Pick">
        <input value="A" data-correct="true" /><input value="B" />
      </multiple-choice>`,
    );
    await settle([el]);
    const events = [];
    el.addEventListener("user-engagement", (e) => events.push(e.detail));
    el.displayedAnswers[0].userGuess = true;
    const done = el.checkAnswer();
    expect(done).to.be.instanceOf(Promise);
    await done;
    // the statement is out by the time the promise resolves, even when the
    // browser runs the check inside a view transition a frame later
    expect(events.length).to.equal(1);
  });

  it("resolves at once when attempts are spent", async () => {
    const el = await fixture(
      html`<multiple-choice question="Pick" max-attempts="1">
        <input value="A" data-correct="true" /><input value="B" />
      </multiple-choice>`,
    );
    await settle([el]);
    el.attempts = 1;
    await el.checkAnswer();
    expect(el.showAnswer).to.equal(false);
  });
});
