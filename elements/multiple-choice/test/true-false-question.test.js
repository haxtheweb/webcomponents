import { fixture, expect, html } from "@open-wc/testing";
import "../lib/true-false-question.js";
import { TrueFalseQuestion } from "../lib/true-false-question.js";

const flush = (ms = 60) => new Promise((r) => setTimeout(r, ms));

const tfFixture = () => html`<true-false-question
  question="Ducks can fly?"
>
  <input correct value="True" />
  <input value="False" />
</true-false-question>`;

describe("true-false-question", () => {
  it("has the expected tag and forces single option", () => {
    expect(TrueFalseQuestion.tag).to.equal("true-false-question");
    const el = globalThis.document.createElement("true-false-question");
    expect(el.singleOption).to.equal(true);
    expect(el._tfanswer).to.equal(null);
  });

  it("exposes haxProperties as a file reference", () => {
    expect(TrueFalseQuestion.haxProperties.endsWith(
      "true-false-question.haxProperties.json",
    )).to.equal(true);
  });

  it("parses the two inputs and renders radio options", async () => {
    const el = await fixture(tfFixture());
    await el.updateComplete;
    expect(el.answers.length).to.equal(2);
    expect(el.answers[0].label).to.equal("True");
    expect(el.answers[0].correct).to.equal(true);
    expect(el.answers[1].correct).to.equal(false);
    const fields = el.shadowRoot.querySelectorAll("simple-fields-field");
    expect(fields.length).to.equal(2);
    expect(fields[0].getAttribute("type")).to.equal("radio");
    // uses the QuestionElement base directions text
    expect(el.renderDirections().strings.join("")).to.include(
      "Select the answer",
    );
  });

  it("reads data-correct inputs from light dom (data-correct migration)", async () => {
    const el = await fixture(html`
      <true-false-question question="Ducks can fly?">
        <input data-correct="true" value="True" />
        <input value="False" />
      </true-false-question>
    `);
    await el.updateComplete;
    await flush();
    expect(el.answers.length).to.equal(2);
    expect(el.answers[0].label).to.equal("True");
    expect(el.answers[0].correct).to.equal(true);
    expect(el.answers[1].correct).to.equal(false);
  });

  it("_tfanswer true marks the first answer correct", async () => {
    const el = await fixture(tfFixture());
    await el.updateComplete;
    el._tfanswer = "true";
    await el.updateComplete;
    await flush();
    expect(el.answers[0].correct).to.equal(true);
    expect(el.answers[1].correct).to.equal(false);
  });

  it("_tfanswer false flips correctness to the second answer", async () => {
    const el = await fixture(tfFixture());
    await el.updateComplete;
    el._tfanswer = "false";
    await el.updateComplete;
    await flush();
    expect(el.answers[0].correct).to.equal(false);
    expect(el.answers[1].correct).to.equal(true);
    // and clearing the flag re-derives it from the answers
    el._tfanswer = null;
    await el.updateComplete;
    await flush();
    expect(el._tfanswer).to.equal("false");
  });

  it("checks the right answer through the radio interaction", async () => {
    const el = await fixture(tfFixture());
    await el.updateComplete;
    el.displayedAnswers = el.displayedAnswers.map((a) => ({
      ...a,
      userGuess: a.correct === true,
    }));
    el.checkAnswerCallback();
    await el.updateComplete;
    expect(el.showAnswer).to.equal(true);
    expect(el.isCorrect()).to.equal(true);
  });
});
