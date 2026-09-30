import { fixture, expect, html } from "@open-wc/testing";
import "../mark-the-words.js";
import { MarkTheWords } from "../mark-the-words.js";

const fullCorrectFixture = () => html`
  <mark-the-words
    question="Mark the fruits but not the berries"
    statement="Apples and Pears and Raspberries grow on the farm."
  >
    <input correct value="Apples" data-selected="Yes, apples are fruit." />
    <input
      correct
      value="Pears"
      data-unselected="It is all gone pear shaped."
    />
    <input
      value="Raspberries"
      data-unselected="Berries are sneaky like that."
    />
    <div slot="feedbackCorrect">Fruit basket secured.</div>
    <div slot="evidence">Apples and pears are pome fruits.</div>
  </mark-the-words>
`;

const partialFixture = () => html`
  <mark-the-words
    question="Mark the fruits but not the berries"
    statement="Apples and Pears and Raspberries grow on the farm."
  >
    <input correct value="Apples" data-selected="Yes, apples are fruit." />
    <input
      correct
      value="Pears"
      data-unselected="It is all gone pear shaped."
    />
    <input
      value="Raspberries"
      data-unselected="Berries are sneaky like that."
    />
    <div slot="feedbackIncorrect">Remember to focus on the task.</div>
    <div slot="hint">Berries are not on the list today.</div>
  </mark-the-words>
`;

const duplicateAnswersFixture = () => html`
  <mark-the-words
    question="Mark the fruit"
    statement="Apples grow well here."
  >
    <input correct value="Apples" />
    <input correct value="Apples" />
  </mark-the-words>
`;

const wordButton = (element, word) =>
  Array.from(element.shadowRoot.querySelectorAll("button.tag-option")).find(
    (button) => button.textContent.trim() === word,
  );

describe("mark-the-words behavior", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(fullCorrectFixture());
    await element.updateComplete;
  });

  it("loads light dom inputs into displayedAnswers", async () => {
    expect(element.displayedAnswers).to.have.length(3);
    const labels = element.displayedAnswers.map((answer) => answer.label);
    expect(labels).to.include("Apples");
    expect(labels).to.include("Pears");
    expect(labels).to.include("Raspberries");
    expect(element.displayedAnswers[0].correct).to.be.true;
    expect(element.displayedAnswers[2].correct).to.be.false;
  });

  it("wires per-word feedback from matching displayedAnswers", async () => {
    const apples = element.wordList.find((word) => word.text === "Apples");
    expect(apples.selectedFeedback).to.equal("Yes, apples are fruit.");
    const raspberries = element.wordList.find(
      (word) => word.text === "Raspberries",
    );
    expect(raspberries.unselectedFeedback).to.equal(
      "Berries are sneaky like that.",
    );
    // non-answer words carry no feedback
    const farm = element.wordList.find((word) => word.text === "farm.");
    expect(farm.selectedFeedback).to.equal(null);
  });

  it("getGuess reflects that answers were loaded", async () => {
    // mark-the-words overrides getGuess to a boolean (not an array),
    // so assert the boolean directly rather than guessing a shape
    expect(element.getGuess()).to.be.true;
    element.displayedAnswers = [];
    await element.updateComplete;
    expect(element.getGuess()).to.be.false;
  });

  it("marks a fully correct selection as correct", async () => {
    wordButton(element, "Apples").click();
    wordButton(element, "Pears").click();
    await element.updateComplete;

    expect(element.isCorrect()).to.be.true;
    expect(element.numberCorrect).to.equal(2);
    expect(element.numberGuessed).to.equal(2);
  });

  it("marks a partially correct selection as incorrect", async () => {
    wordButton(element, "Apples").click();
    await element.updateComplete;

    expect(element.isCorrect()).to.be.false;
    expect(element.numberCorrect).to.equal(1);
    expect(element.numberGuessed).to.equal(1);
  });

  it("counts wrongly selected words as guesses but not correct", async () => {
    wordButton(element, "Raspberries").click();
    await element.updateComplete;

    expect(element.isCorrect()).to.be.false;
    expect(element.numberCorrect).to.equal(0);
    expect(element.numberGuessed).to.equal(1);
  });

  it("applies correct and incorrect classes when showing answers", async () => {
    wordButton(element, "Apples").click();
    wordButton(element, "Raspberries").click();
    await element.updateComplete;
    element.isCorrect();
    element.showAnswer = true;
    await element.updateComplete;

    expect(wordButton(element, "Apples").classList.contains("correct")).to.be
      .true;
    expect(wordButton(element, "Raspberries").classList.contains("incorrect"))
      .to.be.true;
    // unselected words carry no correctness class
    expect(wordButton(element, "Pears").classList.contains("correct")).to.be
      .false;
    expect(wordButton(element, "Pears").classList.contains("incorrect")).to.be
      .false;
  });

  it("renders selected and unselected word feedback when showing answers", async () => {
    wordButton(element, "Apples").click();
    await element.updateComplete;
    element.isCorrect();
    element.showAnswer = true;
    await element.updateComplete;

    const selectedHeading = Array.from(
      element.shadowRoot.querySelectorAll("h4"),
    ).find((h) => h.textContent.trim() === "Words selected feedback");
    expect(selectedHeading).to.exist;

    const unselectedHeading = Array.from(
      element.shadowRoot.querySelectorAll("h4"),
    ).find((h) => h.textContent.trim() === "Words not selected feedback");
    expect(unselectedHeading).to.exist;

    const selectedTerms = Array.from(
      element.shadowRoot.querySelectorAll("dt"),
    ).map((dt) => dt.textContent.trim());
    expect(selectedTerms).to.include("Apples");

    const feedbackText = element.shadowRoot
      .querySelector("p.feedback")
      .textContent.trim();
    expect(feedbackText).to.include("1");
    expect(feedbackText).to.include("guessed");
  });

  it("renders correct feedback and evidence slots when fully correct", async () => {
    wordButton(element, "Apples").click();
    wordButton(element, "Pears").click();
    await element.updateComplete;
    element.isCorrect();
    element.showAnswer = true;
    await element.updateComplete;

    const correctSlot = element.shadowRoot.querySelector(
      'slot[name="feedbackCorrect"]',
    );
    expect(correctSlot).to.exist;
    expect(correctSlot.getAttribute("property")).to.equal(
      "oer:correctFeedback",
    );
    const evidenceHeading = Array.from(
      element.shadowRoot.querySelectorAll("h4"),
    ).find((h) => h.textContent.trim() === "Evidence");
    expect(evidenceHeading).to.exist;
    expect(element.shadowRoot.querySelector('slot[name="evidence"]')).to
      .exist;
  });

  it("renders incorrect feedback and hint slots when not fully correct", async () => {
    const el = await fixture(partialFixture());
    await el.updateComplete;
    wordButton(el, "Apples").click();
    await el.updateComplete;
    el.isCorrect();
    el.showAnswer = true;
    await el.updateComplete;

    const incorrectSlot = el.shadowRoot.querySelector(
      'slot[name="feedbackIncorrect"]',
    );
    expect(incorrectSlot).to.exist;
    expect(incorrectSlot.getAttribute("property")).to.equal(
      "oer:incorrectFeedback",
    );
    const hintHeading = Array.from(el.shadowRoot.querySelectorAll("h4")).find(
      (h) => h.textContent.trim() === "Need a hint?",
    );
    expect(hintHeading).to.exist;
    expect(el.shadowRoot.querySelector('slot[name="hint"]')).to.exist;
    // hint only shows while incorrect
    expect(el.shadowRoot.querySelector('slot[name="feedbackCorrect"]')).to.not
      .exist;
  });

  it("resets the board after a correct attempt", async () => {
    wordButton(element, "Apples").click();
    wordButton(element, "Pears").click();
    await element.updateComplete;
    element.isCorrect();
    element.showAnswer = true;
    await element.updateComplete;

    element.resetAnswer();
    await element.updateComplete;
    // the answers reassignment in the base reset schedules a second pass
    await new Promise((resolve) => setTimeout(resolve, 0));
    await element.updateComplete;

    expect(element.showAnswer).to.be.false;
    const selectedButtons = element.shadowRoot.querySelectorAll(
      "button.tag-option.selected",
    );
    expect(selectedButtons.length).to.equal(0);
    expect(element.wordList.length).to.equal(9);
  });

  it("clears selections on reset even when the attempt was incorrect", async () => {
    wordButton(element, "Raspberries").click();
    await element.updateComplete;
    element.isCorrect();
    element.showAnswer = true;
    await element.updateComplete;

    // the override only calls its own rebuild when correct, but the base
    // class reassigns answers which rebuilds the word list either way;
    // either path ends with a clean board for the next attempt
    let overrideRebuildRan = false;
    const originalRebuild = element.rebuildWordList;
    element.rebuildWordList = function (statement) {
      overrideRebuildRan = true;
      return originalRebuild.call(this, statement);
    };
    element.resetAnswer();
    // the override's own rebuild only fires synchronously when correct
    expect(overrideRebuildRan).to.be.false;
    await element.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
    await element.updateComplete;

    expect(element.showAnswer).to.be.false;
    const selectedButtons = element.shadowRoot.querySelectorAll(
      "button.tag-option.selected",
    );
    expect(selectedButtons.length).to.equal(0);
  });

  it("deselects a word when clicked twice", async () => {
    const button = wordButton(element, "Apples");
    button.click();
    await element.updateComplete;
    expect(button.classList.contains("selected")).to.be.true;

    button.click();
    await element.updateComplete;
    expect(button.classList.contains("selected")).to.be.false;
  });

  it("treats duplicate correct answer entries as a single correct answer", async () => {
    // regression: isCorrect() used to double count when the same correct
    // word is authored twice. Selecting the single matching word set
    // numberCorrect=2 (one per duplicate) while numberGuessed=1, so the
    // numberCorrect !== numberGuessed guard marked a correct pick incorrect.
    // isCorrect() now dedupes correct answer labels before counting.
    const el = await fixture(duplicateAnswersFixture());
    await el.updateComplete;
    expect(el.displayedAnswers).to.have.length(2);

    wordButton(el, "Apples").click();
    await el.updateComplete;

    expect(el.isCorrect()).to.be.true;
    expect(el.numberCorrect).to.equal(1);
    expect(el.numberGuessed).to.equal(1);
  });

  it("ignores clicks that match no word in the list", async () => {
    // latent guard: a click target matching no wordList entry must not
    // throw when toggling selection (unreachable via rendered buttons)
    expect(() =>
      element.selectWord({ target: { innerText: "NotInTheList" } }),
    ).to.not.throw();
    expect(element.wordList.filter((word) => word.selected).length).to.equal(0);
  });

  it("exposes haxProperties via file reference", async () => {
    expect(MarkTheWords.haxProperties).to.include("haxProperties.json");
  });
});
