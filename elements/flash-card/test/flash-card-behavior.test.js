import { fixture, expect, html } from "@open-wc/testing";
import "../flash-card.js";
import { FlashCard } from "../flash-card.js";
import "../lib/flash-card-answer-box.js";
import { FlashCardAnswerBox } from "../lib/flash-card-answer-box.js";
import "../lib/flash-card-prompt-img.js";
import { FlashCardPromptImg } from "../lib/flash-card-prompt-img.js";
import "../lib/flash-card-set.js";
import { FlashCardSet } from "../lib/flash-card-set.js";

const DATA_URI =
  "data:image/gif;base64,R0lGODlhAQABAAAAACw="; // 1x1 gif, no network

const cardFixture = () => html`
  <flash-card>
    <div slot="front">What is 2 + 2?</div>
    <div slot="back">four</div>
  </flash-card>
`;

const setInputValue = (flashCardElement, value) => {
  const answerBox = flashCardElement.shadowRoot.querySelector(
    "flash-card-answer-box",
  );
  const input = answerBox.shadowRoot.querySelector("input#answer");
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
  return input;
};

describe("flash-card answer flow behavior", () => {
  let element;
  let answerBox;

  beforeEach(async () => {
    element = await fixture(cardFixture());
    await element.updateComplete;
    answerBox = element.shadowRoot.querySelector("flash-card-answer-box");
    await answerBox.updateComplete;
  });

  it("has answer box defaults", async () => {
    expect(answerBox.back).to.be.false;
    expect(answerBox.status).to.equal("pending");
    expect(answerBox.sideToShow).to.equal("front");
    expect(answerBox.userAnswer).to.equal("");
    expect(answerBox.showResult).to.be.false;
    expect(answerBox.correctAnswer).to.equal("");
    expect(answerBox.t.yourAnswer).to.equal("Your answer");
    expect(answerBox.t.checkAnswer).to.equal("Check answer");
    expect(answerBox.t.retry).to.equal("Retry");
  });

  it("mirrors back to side-to-show and reflects it", async () => {
    const box = await fixture(
      html`<flash-card-answer-box></flash-card-answer-box>`,
    );
    await box.updateComplete;
    expect(box.getAttribute("side-to-show")).to.equal("front");

    box.back = true;
    await box.updateComplete;
    await box.updateComplete;
    expect(box.sideToShow).to.equal("back");
    expect(box.getAttribute("side-to-show")).to.equal("back");
    expect(box.getAttribute("back")).to.equal("");

    box.back = false;
    await box.updateComplete;
    await box.updateComplete;
    expect(box.sideToShow).to.equal("front");
  });

  it("tracks the user answer as they type and gates the check button", async () => {
    expect(answerBox.shadowRoot.querySelector("button#check")).to.exist;

    const input = setInputValue(element, "fi");
    await answerBox.updateComplete;
    expect(answerBox.userAnswer).to.equal("fi");
    // a non-empty answer enables the check button
    expect(answerBox.shadowRoot.querySelector("button#check").disabled).to.be
      .false;

    input.value = "";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    await answerBox.updateComplete;
    expect(answerBox.userAnswer).to.equal("");
    expect(answerBox.shadowRoot.querySelector("button#check").disabled).to.be
      .true;
  });

  it("marks a matching answer correct end to end", async () => {
    setInputValue(element, "four");
    await answerBox.updateComplete;

    answerBox.shadowRoot.querySelector("button#check").click();
    await answerBox.updateComplete;
    await element.updateComplete;

    expect(answerBox.correct).to.be.true;
    expect(answerBox.status).to.equal("correct");
    expect(answerBox.getAttribute("status")).to.equal("correct");
    expect(answerBox.icon).to.equal("check");
    expect(answerBox.message).to.equal("Correct!");
    expect(answerBox.showResult).to.be.false;
    expect(answerBox.correctAnswer).to.equal("four");
    // answer recorded message includes the correct answer
    expect(answerBox.shadowRoot.querySelector(".answer-message").textContent).to
      .include("four");

    // status event propagated to the host flash-card
    expect(element.status).to.equal("correct");
    expect(element.getAttribute("status")).to.equal("correct");

    // status message replaces the check button once answered
    const statusMessage = answerBox.shadowRoot.querySelector(
      "span#status-message",
    );
    expect(statusMessage).to.exist;
    expect(statusMessage.textContent.trim()).to.equal("Correct!");

    // interaction is locked after answering
    expect(answerBox.shadowRoot.querySelector("input#answer").disabled).to.be
      .true;
  });

  it("marks a non-matching answer incorrect end to end", async () => {
    setInputValue(element, "five");
    await answerBox.updateComplete;

    answerBox.shadowRoot.querySelector("button#check").click();
    await answerBox.updateComplete;
    await element.updateComplete;

    expect(answerBox.correct).to.be.false;
    expect(answerBox.status).to.equal("incorrect");
    expect(answerBox.icon).to.equal("cancel");
    expect(answerBox.message).to.equal("Incorrect!");
    expect(answerBox.showResult).to.be.true;
    expect(answerBox.correctAnswer).to.equal("four");
    // the correct answer is revealed on a miss
    expect(answerBox.shadowRoot.querySelector(".answer-message").textContent).to
      .include("Correct Answer: four");

    expect(element.status).to.equal("incorrect");
    const statusMessage = answerBox.shadowRoot.querySelector(
      "span#status-message",
    );
    expect(statusMessage.textContent.trim()).to.equal("Incorrect!");
    // aria-invalid flips on for a wrong answer
    expect(
      answerBox.shadowRoot.querySelector("input#answer").getAttribute(
        "aria-invalid",
      ),
    ).to.equal("true");
  });

  it("checks against the front side when the back is showing", async () => {
    answerBox.back = true;
    await answerBox.updateComplete;
    await answerBox.updateComplete;
    setInputValue(element, "What is 2 + 2?");
    await answerBox.updateComplete;

    answerBox.shadowRoot.querySelector("button#check").click();
    await answerBox.updateComplete;
    await element.updateComplete;

    // the comparison flips to the front content and reports it as the answer
    expect(answerBox.status).to.equal("correct");
    expect(answerBox.correctAnswer).to.equal("What is 2 + 2?");
  });

  it("compares the answer case-insensitively", async () => {
    setInputValue(element, "FOUR");
    await answerBox.updateComplete;

    answerBox.shadowRoot.querySelector("button#check").click();
    await answerBox.updateComplete;

    expect(answerBox.status).to.equal("correct");
  });

  it("checks the answer with the Enter key", async () => {
    const input = setInputValue(element, "four");
    await answerBox.updateComplete;

    input.dispatchEvent(
      new KeyboardEvent("keypress", { key: "Enter", bubbles: true }),
    );
    await answerBox.updateComplete;

    expect(answerBox.status).to.equal("correct");
    expect(answerBox.shadowRoot.querySelector("input#answer").disabled).to.be
      .true;
  });

  it("dispatches correct and incorrect feedback events", async () => {
    const seen = { toast: null, sound: null, toastCount: 0, soundCount: 0 };
    const onToast = (e) => {
      seen.toast = e.detail;
      seen.toastCount++;
    };
    const onSound = (e) => {
      seen.sound = e.detail;
      seen.soundCount++;
    };
    globalThis.addEventListener("simple-toast-show", onToast);
    globalThis.addEventListener("playaudio", onSound);
    try {
      // correct answer feedback
      setInputValue(element, "four");
      await answerBox.updateComplete;
      answerBox.shadowRoot.querySelector("button#check").click();
      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(seen.toast.text).to.equal("Correct!");
      expect(seen.toast.accentColor).to.equal("green");
      expect(seen.sound.sound).to.equal("success");

      // incorrect answer feedback
      setInputValue(element, "five");
      answerBox.shadowRoot.querySelector("input#answer").disabled = false;
      answerBox.status = "pending";
      await answerBox.updateComplete;
      await element.updateComplete;
      answerBox.checkUserAnswer();
      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(seen.toast.text).to.equal("Try again!");
      expect(seen.toast.accentColor).to.equal("red");
      expect(seen.sound.sound).to.equal("error");
      expect(seen.toastCount).to.be.greaterThan(1);
      expect(seen.soundCount).to.be.greaterThan(1);
    } finally {
      globalThis.removeEventListener("simple-toast-show", onToast);
      globalThis.removeEventListener("playaudio", onSound);
    }
  });

  it("resets the card for another attempt from the retry button", async () => {
    setInputValue(element, "five");
    await answerBox.updateComplete;
    answerBox.shadowRoot.querySelector("button#check").click();
    await answerBox.updateComplete;
    await element.updateComplete;
    expect(answerBox.status).to.equal("incorrect");

    // retry control is visible once a status is set
    answerBox.shadowRoot
      .querySelector(".retry simple-icon-button-lite")
      .click();
    await answerBox.updateComplete;
    await element.updateComplete;

    expect(answerBox.status).to.equal("pending");
    expect(answerBox.showResult).to.be.false;
    expect(answerBox.userAnswer).to.equal("");
    expect(answerBox.correct).to.be.false;
    expect(answerBox.correctAnswer).to.equal("");
    expect(answerBox.sideToShow).to.equal("front");

    const input = answerBox.shadowRoot.querySelector("input#answer");
    expect(input.disabled).to.be.false;
    expect(input.value).to.equal("");
    // check button is back and disabled until an answer is typed
    const check = answerBox.shadowRoot.querySelector("button#check");
    expect(check).to.exist;
    expect(check.disabled).to.be.true;
  });
});

describe("flash-card oer schema and hax integration", () => {
  it("marks itself as an oer:Practice and emits oer meta", async () => {
    const el = await fixture(
      html`<flash-card
        type-of-action="recall"
        has-learning-objective="addition"
      ></flash-card>`,
    );
    await el.updateComplete;

    expect(el.getAttribute("typeof")).to.equal("oer:Practice");
    const actionMeta = el.shadowRoot.querySelector(
      'meta[property="oer:typeOfAction"]',
    );
    expect(actionMeta.getAttribute("content")).to.equal("recall");
    const objectiveMeta = el.shadowRoot.querySelector(
      'meta[property="oer:hasLearningObjective"]',
    );
    expect(objectiveMeta.getAttribute("content")).to.equal("addition");
  });

  it("exposes haxProperties via file reference", () => {
    expect(FlashCard.haxProperties).to.include("haxProperties.json");
  });
});

describe("flash-card-image-prompt behavior", () => {
  it("has defaults and reflects status-driven icon state", async () => {
    const el = await fixture(
      html`<flash-card-image-prompt
        img-src="${DATA_URI}"
        img-keyword="strawberry"
      ></flash-card-image-prompt>`,
    );
    await el.updateComplete;

    expect(el.imgKeyword).to.equal("strawberry");
    expect(el.status).to.equal("pending");
    expect(el.answerIcon).to.be.false;
    expect(el.getAttribute("img-src")).to.equal(DATA_URI);
    expect(el.shadowRoot.querySelector("img").getAttribute("src")).to.equal(
      DATA_URI,
    );

    el.status = "correct";
    await el.updateComplete;
    await el.updateComplete;
    expect(el.answerIcon).to.be.true;
    expect(el.icon).to.equal("check");
    let statusIcon = el.shadowRoot.querySelector("simple-icon-lite");
    expect(statusIcon.getAttribute("icon")).to.equal("check");

    el.status = "incorrect";
    await el.updateComplete;
    await el.updateComplete;
    expect(el.icon).to.equal("cancel");
    statusIcon = el.shadowRoot.querySelector("simple-icon-lite");
    expect(statusIcon.getAttribute("icon")).to.equal("cancel");

    el.status = "pending";
    await el.updateComplete;
    await el.updateComplete;
    expect(el.answerIcon).to.be.false;
    expect(el.shadowRoot.querySelector("simple-icon-lite")).to.not.exist;
  });

  it("falls back to a keyword placeholder url when no img-src is set", () => {
    // render is a pure read of state; invoking it against a stub avoids
    // mounting an img that would reach out to the loremflickr service
    const result = FlashCardPromptImg.prototype.render.call({
      imgSrc: "",
      imgKeyword: "strawberry",
      answerIcon: false,
      icon: "",
    });
    // the img branch is a nested TemplateResult in the outer template values
    const imgBranch = result.values.find(
      (value) => value && value.strings && value.strings.join("").includes("src"),
    );
    expect(imgBranch).to.exist;
    expect(imgBranch.strings.join("")).to.include("loremflickr.com/320/240/");
    expect(imgBranch.strings.join("")).to.include("lock=1");
    expect(imgBranch.values).to.include("strawberry");
  });

  it("exposes its tag", () => {
    expect(FlashCardPromptImg.tag).to.equal("flash-card-image-prompt");
  });
});

describe("flash-card-set behavior", () => {
  let element;

  beforeEach(async () => {
    // the image url must be static template text: getData() reads innerHTML
    // and interpolated values would carry lit marker comments into the data
    element = await fixture(html`
      <flash-card-set>
        <ul>
          <li>
            <p slot="front">What is strawberry in Spanish?</p>
            <p slot="back">fresa</p>
            <p slot="attributes">dark</p>
          </li>
          <li>
            <p slot="front">What is food in Spanish?</p>
            <p slot="back">comida</p>
            <p slot="image">data:image/gif;base64,R0lGODlhAQABAAAAACw=</p>
          </li>
        </ul>
      </flash-card-set>
    `);
    await element.updateComplete;
  });

  it("reads slotted cards into its questions data", async () => {
    expect(element.questions).to.have.length(8);
    expect(element.questions[0]).to.equal("What is strawberry in Spanish?");
    expect(element.questions[1]).to.equal("fresa");
    expect(element.questions[3]).to.equal("dark");
    expect(element.questions[4]).to.equal("What is food in Spanish?");
    expect(element.questions[5]).to.equal("comida");
    expect(element.questions[6]).to.equal(DATA_URI);
  });

  it("renders one flash-card per slotted li into the content area", async () => {
    const cards = element.shadowRoot.querySelectorAll("#content flash-card");
    expect(cards.length).to.equal(2);

    const first = element.shadowRoot.querySelector("#card0");
    expect(first).to.exist;
    expect(first.getAttribute("id")).to.equal("card0");
    // the dark attribute option flags the card
    expect(first.hasAttribute("dark")).to.be.true;
    expect(first.querySelector('[slot="front"]').textContent).to.equal(
      "What is strawberry in Spanish?",
    );
    expect(first.querySelector('[slot="back"]').textContent).to.equal("fresa");

    const second = element.shadowRoot.querySelector("#card1");
    expect(second).to.exist;
    expect(second.hasAttribute("dark")).to.be.false;
    // image slot data flows to img-source on the generated card
    expect(second.getAttribute("img-source")).to.equal(DATA_URI);
  });

  it("shows the first card and hides the rest", async () => {
    const first = element.shadowRoot.querySelector("#card0");
    const second = element.shadowRoot.querySelector("#card1");
    expect(first.className).to.equal("");
    expect(second.className).to.equal("hidden");
  });

  it("navigates forward and back through the cards", async () => {
    const first = element.shadowRoot.querySelector("#card0");
    const second = element.shadowRoot.querySelector("#card1");

    element.shadowRoot
      .querySelector("simple-icon-button-lite.arrow-right")
      .click();
    await element.updateComplete;
    expect(element.currentQuestion).to.equal(1);
    expect(second.className).to.equal("visible");
    expect(first.className).to.equal("hidden");

    // prev from the last card goes back to the first
    element.shadowRoot
      .querySelector("simple-icon-button-lite.arrow-left")
      .click();
    await element.updateComplete;
    expect(element.currentQuestion).to.equal(0);
    expect(first.className).to.equal("visible");
    expect(second.className).to.equal("hidden");
  });

  it("does not navigate past the first or last card", async () => {
    // prev at the first card is a no-op
    element._prevCard();
    await element.updateComplete;
    expect(element.currentQuestion).to.equal(0);

    // next past the last card is a no-op
    element._nextCard();
    await element.updateComplete;
    expect(element.currentQuestion).to.equal(1);
    element._nextCard();
    await element.updateComplete;
    expect(element.currentQuestion).to.equal(1);
  });

  it("rebuilds without duplicating when questions data is reassigned", async () => {
    // regression: updated() calls renderTags() on every update and
    // renderTags() used to call getData() again without clearing
    // this.questions, so any reactive update (e.g. a new questions array
    // from HAX) re-read the slot, doubled the questions data, and appended
    // cards for every group of 4 without clearing #content first.
    // renderTags() now clears both before re-reading.
    const before = element.shadowRoot.querySelectorAll("#content flash-card")
      .length;
    expect(before).to.equal(2);

    element.questions = [...element.questions];
    await element.updateComplete;
    await element.updateComplete;

    const after = element.shadowRoot.querySelectorAll("#content flash-card")
      .length;
    // data re-read from the slot stays at 8 entries and the content area is
    // rebuilt with the same 2 cards rather than accumulating duplicates
    expect(element.questions.length).to.equal(8);
    expect(after).to.equal(2);
  });

  it("exposes haxProperties via file reference", () => {
    expect(FlashCardSet.haxProperties).to.include("haxProperties.json");
  });
});
