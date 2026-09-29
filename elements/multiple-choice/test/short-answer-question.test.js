import { fixture, expect, html } from "@open-wc/testing";
import "../lib/short-answer-question.js";
import { ShortAnswerQuestion } from "../lib/short-answer-question.js";

const flush = (ms = 60) => new Promise((r) => setTimeout(r, ms));

// seed a guess value so assertions on the bound textarea value and the
// guess flows below are deterministic from the start
const saFixture = () => html`<short-answer-question
  question="Name a duck"
  .shortanswer=${"duck"}
>
  <input correct value="Huey" />
  <input value="Mickey" />
</short-answer-question>`;

describe("short-answer-question", () => {
  it("has the expected tag and forces single option", () => {
    expect(ShortAnswerQuestion.tag).to.equal("short-answer-question");
    const el = globalThis.document.createElement("short-answer-question");
    expect(el.singleOption).to.equal(true);
    expect(el.guessDataValue).to.equal("shortanswer");
    expect(el.shortanswer).to.equal(null);
  });

  it("exposes haxProperties as a file reference", () => {
    expect(ShortAnswerQuestion.haxProperties.endsWith(
      "short-answer-question.haxProperties.json",
    )).to.equal(true);
  });

  it("renders its own directions and a textarea interaction", async () => {
    const el = await fixture(saFixture());
    await el.updateComplete;
    expect(el.renderDirections().strings.join("")).to.include(
      "Type the answer",
    );
    const field = el.shadowRoot.querySelector(
      'simple-fields-field[name="0"]',
    );
    expect(field).to.exist;
    expect(field.getAttribute("type")).to.equal("textarea");
    expect(field.getAttribute("aria-label")).to.equal("Your answer");
    // the answer text is bound into the textarea value
    expect(field.value).to.equal("duck");
  });

  it("valueUpdate records the typed answer", async () => {
    const el = await fixture(saFixture());
    await el.updateComplete;
    el.valueUpdate({ detail: { value: "Donald" } });
    await el.updateComplete;
    expect(el.shortanswer).to.equal("Donald");
  });

  it("isCorrect matches any answer label case-insensitively", async () => {
    const el = await fixture(saFixture());
    await el.updateComplete;
    el.shortanswer = "HUEY";
    expect(el.isCorrect()).to.equal(true);
    el.shortanswer = "huey";
    expect(el.isCorrect()).to.equal(true);
    // isCorrect matches ANY answer label, even an incorrect one, so use a
    // string that matches no label at all for the negative case
    el.shortanswer = "Goofy";
    expect(el.isCorrect()).to.equal(false);
    // and it also drives the interaction's correct/incorrect styling
    el.shortanswer = "Huey";
    el.showAnswer = true;
    await el.updateComplete;
    expect(
      el.shadowRoot
        .querySelector('simple-fields-field[name="0"]')
        .classList.contains("correct"),
    ).to.equal(true);
  });

  it("checks the answer through the full flow and resets afterwards", async () => {
    const el = await fixture(saFixture());
    await el.updateComplete;
    el.shortanswer = "Huey";
    el.checkAnswerCallback();
    await el.updateComplete;
    expect(el.showAnswer).to.equal(true);
    expect(el.isCorrect()).to.equal(true);
    el.resetAnswer();
    await el.updateComplete;
    await flush();
    // a correct answer resets the typed text as well as the board
    expect(el.shortanswer).to.equal(null);
    // re-seed a value so post-reset renders stay valid (see BUG note below)
    el.shortanswer = "reset-safe";
    await el.updateComplete;
    expect(el.showAnswer).to.equal(false);
  });

  it("inactiveCase reports the typed answer directly", async () => {
    const el = await fixture(saFixture());
    await el.updateComplete;
    // short-answer overrides inactiveCase to return the answer itself
    expect(el.inactiveCase()).to.equal("duck");
    el.shortanswer = "another duck";
    expect(el.inactiveCase()).to.equal("another duck");
  });

  it("isCorrect() throws when shortanswer is null and answers exist (BUG: unguarded toLowerCase)", () => {
    // BUG short-answer-question.js:91-95 isCorrect() calls
    // this.shortanswer.toLowerCase() without a null guard, so evaluating
    // correctness with an empty answer throws a TypeError. This is user
    // reachable: pressing Enter in the empty textarea fires checkAnswer
    // (the renderInteraction keydown handler has no guard) which calls
    // isCorrect before anything has been typed
    const el = globalThis.document.createElement("short-answer-question");
    el.displayedAnswers = [{ label: "Huey", correct: true }];
    el.shortanswer = null;
    let threw = false;
    try {
      el.isCorrect();
    } catch (e) {
      threw = true;
    }
    expect(threw).to.equal(true);
  });
});
