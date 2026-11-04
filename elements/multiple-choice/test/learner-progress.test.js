import { fixture, expect, html } from "@open-wc/testing";
import "../multiple-choice.js";
import "../lib/true-false-question.js";
import "../lib/short-answer-question.js";
import {
  activityId,
  XAPI_EXTENSIONS,
  XAPI_VERBS,
} from "@haxtheweb/user-action/lib/xapi.js";

const flush = (ms = 40) => new Promise((r) => setTimeout(r, ms));
const settle = async (els) => {
  await flush();
  await Promise.all(els.map((el) => el.updateComplete));
  await flush();
  await Promise.all(els.map((el) => el.updateComplete));
};
const pill = (el) => el.shadowRoot.querySelector(".shell-pill");

// stand in for the HAXcms learner progress helper: answers requests from a map
function fakeProfile(records) {
  const handler = (e) => {
    if (records[e.detail.activityId]) {
      e.detail.record = records[e.detail.activityId];
    }
  };
  globalThis.addEventListener("learner-progress-request", handler);
  return () =>
    globalThis.removeEventListener("learner-progress-request", handler);
}

describe("QuestionElement learner data", () => {
  it("user-engagement keeps its old fields and adds an xAPI statement", async () => {
    const el = await fixture(
      html`<multiple-choice
        id="q-ducks"
        question="Which are ducks?"
        quiz-name="birds"
        max-attempts="2"
      >
        <input data-correct="true" value="Huey" />
        <input value="Mickey" />
      </multiple-choice>`,
    );
    await settle([el]);
    const events = [];
    el.addEventListener("user-engagement", (e) => events.push(e.detail));
    let state = null;
    el.addEventListener("question-element-state", (e) => {
      state = e.detail;
    });
    el.displayedAnswers.forEach((a) => {
      a.userGuess = a.label === "Mickey" ? true : "";
    });
    el.checkAnswer();
    await settle([el]);
    expect(events.length).to.equal(1);
    const d = events[0];
    expect(d.activityDisplay).to.equal("answered");
    expect(d.objectName).to.equal("birds");
    expect(d.resultSuccess).to.equal(false);
    const s = d.statement;
    expect(s.verb.id).to.equal(XAPI_VERBS.answered);
    expect(s.object.id).to.equal(activityId(el));
    expect(s.object.id.endsWith("#q-ducks")).to.equal(true);
    expect(s.object.definition.type).to.equal(
      "http://adlnet.gov/expapi/activities/cmi.interaction",
    );
    expect(s.object.definition.interactionType).to.equal("choice");
    expect(s.result.success).to.equal(false);
    expect(s.result.completion).to.equal(false);
    expect(s.result.response).to.equal("Mickey");
    expect(s.result.score).to.deep.equal({ min: 0, raw: 0, max: 1, scaled: 0 });
    expect(s.result.extensions[XAPI_EXTENSIONS.attempts]).to.equal(1);
    expect(s.result.extensions[XAPI_EXTENSIONS.maxAttempts]).to.equal(2);
    expect(s.context.extensions[XAPI_EXTENSIONS.educationalRecord]).to.equal(
      true,
    );
    // the state event is unchanged
    expect(state).to.include({
      tag: "multiple-choice",
      question: "Which are ducks?",
      status: "incorrect",
      correct: false,
      attempts: 1,
      maxAttempts: 2,
    });
    // last attempt: completion true even though wrong
    el.resetAnswer();
    await settle([el]);
    el.displayedAnswers.forEach((a) => {
      a.userGuess = a.label === "Mickey" ? true : "";
    });
    el.checkAnswer();
    await settle([el]);
    expect(events[1].statement.result.completion).to.equal(true);
  });

  it("true-false and short-answer say their interaction type", async () => {
    const tf = await fixture(
      html`<true-false-question question="Sky is blue">
        <input data-correct="true" value="True" />
        <input value="False" />
      </true-false-question>`,
    );
    const sa = await fixture(
      html`<short-answer-question question="2+2">
        <input data-correct="true" value="4" />
      </short-answer-question>`,
    );
    await settle([tf, sa]);
    expect(tf.xapiInteractionType()).to.equal("true-false");
    sa.shortanswer = "four";
    expect(sa.engagementDetail(false, 1).statement.result.response).to.equal(
      "four",
    );
    expect(sa.xapiInteractionType()).to.equal("fill-in");
  });

  it("asks for saved progress and works with nobody answering", async () => {
    const asked = [];
    const h = (e) => asked.push(e.detail.activityId);
    globalThis.addEventListener("learner-progress-request", h);
    const el = await fixture(
      html`<multiple-choice id="lonely" question="Q">
        <input data-correct="true" value="A" />
      </multiple-choice>`,
    );
    await settle([el]);
    globalThis.removeEventListener("learner-progress-request", h);
    expect(asked).to.include(activityId(el));
    expect(el.showAnswer).to.equal(false);
    expect(el.attempts).to.equal(0);
  });
});

describe("question stacks resume", () => {
  let off = null;
  afterEach(() => {
    if (off) {
      off();
      off = null;
    }
  });

  const stack = () =>
    fixture(
      html`<div>
        <multiple-choice id="s1" question="Which travels faster in air?">
          <input data-correct="true" value="Light" />
          <input value="Sound" />
        </multiple-choice>
        <true-false-question id="s2" question="Sound travels in a vacuum">
          <input value="True" />
          <input data-correct="true" value="False" />
        </true-false-question>
        <short-answer-question id="s3" question="Pitch depends on">
          <input data-correct="true" value="frequency" />
        </short-answer-question>
      </div>`,
    );

  it("first visit: the first question opens and nothing is restored", async () => {
    const root = await stack();
    const qs = Array.from(root.children);
    await settle(qs);
    expect(qs.map((q) => q.collapsed)).to.deep.equal([false, true, true]);
    expect(pill(qs[1]).textContent.trim()).to.equal("Not attempted");
  });

  it("returning: saved results show and the first unanswered one opens", async () => {
    const page = `${globalThis.location.origin}${globalThis.location.pathname}`;
    off = fakeProfile({
      [`${page}#s1`]: {
        status: "correct",
        done: true,
        attempts: 1,
        response: "Light",
      },
      [`${page}#s2`]: {
        status: "correct",
        done: true,
        attempts: 2,
        response: "False",
      },
    });
    const root = await stack();
    const qs = Array.from(root.children);
    await settle(qs);
    expect(qs.map((q) => q.collapsed)).to.deep.equal([true, true, false]);
    expect(pill(qs[0]).textContent.trim()).to.equal("Correct");
    expect(pill(qs[1]).textContent.trim()).to.equal("Correct");
    // the answers came back for the types that support it
    expect(qs[0].showAnswer).to.equal(true);
    expect(qs[0].isCorrect()).to.equal(true);
    expect(qs[1].attempts).to.equal(2);
    expect(qs[1].isCorrect()).to.equal(true);
    expect(qs[2].showAnswer).to.equal(false);
    // clearing takes the restored answers back
    globalThis.dispatchEvent(new CustomEvent("learner-progress-cleared"));
    await settle(qs);
    expect(qs[0].showAnswer).to.equal(false);
    expect(qs[0].getGuess().length).to.equal(0);
    expect(pill(qs[1]).textContent.trim()).to.equal("Not attempted");
  });

  it("a cleared profile drops the saved pill", async () => {
    const page = `${globalThis.location.origin}${globalThis.location.pathname}`;
    off = fakeProfile({
      [`${page}#s2`]: { status: "incorrect", done: true, attempts: 3 },
    });
    const root = await stack();
    const qs = Array.from(root.children);
    await settle(qs);
    expect(pill(qs[1]).textContent.trim()).to.equal("Incorrect");
    globalThis.dispatchEvent(new CustomEvent("learner-progress-cleared"));
    await settle(qs);
    expect(pill(qs[1]).textContent.trim()).to.equal("Not attempted");
    expect(qs[1].attempts).to.equal(0);
  });

  it("a restored answer never reaches HAX editing", async () => {
    const page = `${globalThis.location.origin}${globalThis.location.pathname}`;
    off = fakeProfile({
      [`${page}#solo`]: {
        status: "correct",
        done: true,
        attempts: 1,
        response: "A",
      },
    });
    const el = await fixture(
      html`<multiple-choice id="solo" question="Q">
        <input data-correct="true" value="A" />
        <input value="B" />
      </multiple-choice>`,
    );
    await settle([el]);
    expect(el.showAnswer).to.equal(true);
    el.haxeditModeChanged(true);
    await settle([el]);
    expect(el.showAnswer).to.equal(false);
    expect(el.attempts).to.equal(0);
    expect(el.getGuess().length).to.equal(0);
  });
});
