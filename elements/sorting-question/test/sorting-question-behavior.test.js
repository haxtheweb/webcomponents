import { fixture, expect, html } from "@open-wc/testing";
import "../sorting-question.js";
import { SortingQuestion } from "../sorting-question.js";

const flush = (ms = 60) => new Promise((r) => setTimeout(r, ms));

const orderFixture = () => html`
  <sorting-question
    id="basic"
    name="basic"
    title="Order the letters"
    question="Order the letters"
    .randomize=${false}
  >
    <input value="Alpha" />
    <input value="Beta" />
    <input value="Gamma" />
    <div slot="feedbackCorrect">Perfect sequence!</div>
    <div slot="feedbackIncorrect">Check the sequence again.</div>
    <div slot="hint">Alphabetical order.</div>
    <div slot="evidence">The Greek alphabet.</div>
    <div slot="content">Read about Greek letters.</div>
  </sorting-question>
`;

// a sync "view transition" stand-in so wrapped paths run deterministically
const fakeViewTransition = (cb) => {
  cb();
  return { ready: { catch: () => {} } };
};

describe("sorting-question behavior", () => {
  let audioHeard;
  let toasts;
  let toastsHidden;
  let toastHandler;
  let audioHandler;
  let toastHideHandler;

  beforeEach(() => {
    audioHeard = [];
    toasts = [];
    toastsHidden = 0;
    audioHandler = (e) => audioHeard.push(e.detail.sound);
    toastHandler = (e) => toasts.push(e);
    toastHideHandler = () => toastsHidden++;
    globalThis.addEventListener("playaudio", audioHandler);
    globalThis.addEventListener("simple-toast-show", toastHandler);
    globalThis.addEventListener("simple-toast-hide", toastHideHandler);
  });

  afterEach(() => {
    globalThis.removeEventListener("playaudio", audioHandler);
    globalThis.removeEventListener("simple-toast-show", toastHandler);
    globalThis.removeEventListener("simple-toast-hide", toastHideHandler);
    delete globalThis.HAXCMSToast;
  });

  async function ready() {
    const el = await fixture(orderFixture());
    await el.updateComplete;
    // let the __answerLock unlock timeout run: reassigning answers before it
    // fires makes updated() skip the clean/displayedAnswers branch entirely
    await flush(20);
    return el;
  }

  const optionTexts = (el) =>
    Array.from(el.getOptions()).map((option) => option.innerText);

  it("exposes haxProperties as a file reference", () => {
    const href = SortingQuestion.haxProperties;
    expect(typeof href).to.equal("string");
    expect(href.endsWith("sorting-question.haxProperties.json")).to.equal(
      true,
    );
  });

  it("reads inputs into answers in order and strips the inputs", async () => {
    const el = await ready();
    expect(el.answers.length).to.equal(3);
    expect(el.answers[0].label).to.equal("Alpha");
    expect(el.answers[0].order).to.equal(0);
    expect(el.answers[2].label).to.equal("Gamma");
    expect(el.answers[2].order).to.equal(2);
    expect(el.querySelectorAll("input").length).to.equal(0);
    // displayed order matches the answer order (randomize off)
    expect(optionTexts(el).join("|")).to.equal("Alpha|Beta|Gamma");
    expect(el.displayedAnswers.length).to.equal(3);
  });

  it("getOptions reads the rendered options and flags", async () => {
    const el = await ready();
    expect(el.getOptions().length).to.equal(3);
    expect(el.getOptions("correct").length).to.equal(0);
    expect(el.getOptions("incorrect").length).to.equal(0);
  });

  it("getOptions is undefined before there is a shadow root", () => {
    const el = globalThis.document.createElement("sorting-question");
    expect(el.getOptions()).to.equal(undefined);
  });

  it("checkAnswerCallback marks a perfect order correct", async () => {
    const el = await ready();
    el.checkAnswerCallback();
    await el.updateComplete;
    await flush(150);
    expect(el.showAnswer).to.equal(true);
    expect(el.numberCorrect).to.equal(3);
    const options = Array.from(el.getOptions());
    for (const option of options) {
      expect(option.disabled).to.equal(true);
      expect(option.correct).to.equal(true);
      expect(option.incorrect).to.equal(null);
    }
    expect(el.getOptions("correct").length).to.equal(3);
    expect(audioHeard.includes("success")).to.equal(true);
    expect(toasts.length).to.equal(1);
    expect(toasts[0].detail.accentColor).to.equal("green");
    expect(toasts[0].detail.hat).to.equal("party");
    const confetti = el.shadowRoot.querySelector("#confetti");
    expect(confetti.hasAttribute("popped")).to.equal(true);
  });

  it("checkAnswerCallback reports partial correctness on a wrong order", async () => {
    const el = await ready();
    // move Alpha below Beta through the real arrow button click path
    const original = globalThis.document.startViewTransition;
    globalThis.document.startViewTransition = fakeViewTransition;
    try {
      el.getOptions()[0]
        .shadowRoot.querySelector("#downArrow")
        .click();
      await el.updateComplete;
      await flush();
    } finally {
      if (original === undefined) {
        delete globalThis.document.startViewTransition;
      } else {
        globalThis.document.startViewTransition = original;
      }
    }
    expect(optionTexts(el).join("|")).to.equal("Beta|Alpha|Gamma");
    el.checkAnswerCallback();
    await el.updateComplete;
    await flush(150);
    expect(el.numberCorrect).to.equal(1);
    expect(el.getOptions("correct").length).to.equal(1);
    expect(el.getOptions("incorrect").length).to.equal(2);
    expect(audioHeard.includes("error")).to.equal(true);
    expect(toasts.length).to.equal(1);
    expect(toasts[0].detail.accentColor).to.equal("red");
    expect(toasts[0].detail.fire).to.equal(true);
    // feedback paragraph counts the one correct placement
    const feedback = el.shadowRoot.querySelector("p.feedback");
    expect(feedback.textContent.includes("1")).to.equal(true);
    expect(feedback.textContent.includes("out of")).to.equal(true);
    expect(el.shadowRoot.innerHTML.includes("Need a hint?")).to.equal(true);
    expect(
      el.shadowRoot.querySelector('slot[name="feedbackIncorrect"]').getAttribute(
        "property",
      ),
    ).to.equal("oer:incorrectFeedback");
  });

  it("user-engagement fires with quiz name and correctness", async () => {
    const el = await ready();
    let engagement = null;
    el.addEventListener("user-engagement", (e) => {
      engagement = e.detail;
    });
    el.checkAnswerCallback();
    await el.updateComplete;
    expect(engagement).to.not.equal(null);
    expect(engagement.objectName).to.equal("default");
    expect(engagement.resultSuccess).to.equal(true);
    expect(engagement.activityDisplay).to.equal("answered");
  });

  it("renders the correct feedback and OER slot after a perfect answer", async () => {
    const el = await ready();
    el.checkAnswerCallback();
    await el.updateComplete;
    await flush();
    expect(el.shadowRoot.textContent.includes("You are correct!")).to.equal(
      true,
    );
    expect(
      el.shadowRoot.querySelector('slot[name="feedbackCorrect"]').getAttribute(
        "property",
      ),
    ).to.equal("oer:correctFeedback");
    expect(el.shadowRoot.innerHTML.includes("Evidence")).to.equal(true);
    expect(el.shadowRoot.querySelector('slot[name="evidence"]')).to.exist;
  });

  it("focus lands on the feedback summary when checking", async () => {
    const el = await ready();
    el.checkAnswerCallback();
    await el.updateComplete;
    // document.activeElement stops at the shadow host, so walk inward
    const active = globalThis.document.activeElement;
    expect(active.tagName).to.equal("SORTING-QUESTION");
    const inner = active.shadowRoot.activeElement;
    expect(inner.tagName).to.equal("SUMMARY");
    expect(inner.getAttribute("id")).to.equal("feedback");
  });

  it("supports the haxcms toast variant", async () => {
    const el = await ready();
    const haxToasts = [];
    const haxHandler = (e) => haxToasts.push(e);
    globalThis.addEventListener("haxcms-toast-show", haxHandler);
    globalThis.HAXCMSToast = true;
    try {
      el.checkAnswerCallback();
      await el.updateComplete;
      await flush();
      expect(haxToasts.length).to.equal(1);
      expect(haxToasts[0].detail.accentColor).to.equal("green");
    } finally {
      globalThis.removeEventListener("haxcms-toast-show", haxHandler);
    }
  });

  it("resetAnswer re-enables options and focuses the first wrong one", async () => {
    const el = await ready();
    // produce a wrong order: two options misplaced
    const first = el.getOptions()[0];
    first.arrowSortCallback({ getAttribute: () => "downArrow" });
    await flush();
    el.checkAnswerCallback();
    await el.updateComplete;
    await flush(150);
    expect(el.showAnswer).to.equal(true);
    el.resetAnswer();
    await el.updateComplete;
    await flush(150);
    expect(el.showAnswer).to.equal(false);
    expect(toastsHidden).to.be.above(0);
    expect(el.numberCorrect).to.equal(0);
    const options = Array.from(el.getOptions());
    for (const option of options) {
      expect(option.disabled).to.equal(false);
      expect(option.correct).to.equal(null);
      expect(option.incorrect).to.equal(null);
    }
    // focus moved into the first incorrect option's down arrow button;
    // walk the shadow chain inward from the document
    let active = globalThis.document.activeElement;
    expect(active.tagName).to.equal("SORTING-QUESTION");
    active = active.shadowRoot.activeElement;
    expect(active.tagName).to.equal("SORTING-OPTION");
    const optionHost = active;
    expect(optionHost.hasAttribute("incorrect")).to.equal(false);
    active = active.shadowRoot.activeElement;
    expect(active.getAttribute("id")).to.equal("downArrow");
    active = active.shadowRoot.activeElement;
    expect(active.tagName).to.equal("BUTTON");
  });

  it("resetAnswer after a perfect run deals a fresh board", async () => {
    const el = await ready();
    el.checkAnswerCallback();
    await el.updateComplete;
    await flush(150);
    expect(el.showAnswer).to.equal(true);
    el.resetAnswer();
    await el.updateComplete;
    await flush(150);
    expect(el.showAnswer).to.equal(false);
    expect(el.answers.length).to.equal(3);
    expect(el.getOptions().length).to.equal(3);
    expect(optionTexts(el).sort().join("|")).to.equal("Alpha|Beta|Gamma");
    const options = Array.from(el.getOptions());
    for (const option of options) {
      expect(option.disabled).to.equal(false);
    }
    for (const answer of el.answers) {
      expect(answer.userGuess).to.not.equal(true);
    }
  });

  it("checkAnswer wrapper falls back without view transitions", async () => {
    const el = await ready();
    const original = globalThis.document.startViewTransition;
    globalThis.document.startViewTransition = undefined;
    try {
      el.checkAnswer();
      await el.updateComplete;
      await flush(150);
    } finally {
      if (original === undefined) {
        delete globalThis.document.startViewTransition;
      } else {
        globalThis.document.startViewTransition = original;
      }
    }
    expect(el.showAnswer).to.equal(true);
    expect(el.numberCorrect).to.equal(3);
  });

  it("FIXED(sorting-question.js:51-53): maxAttempts is enforced because checkAnswerCallback counts the attempt", async () => {
    // the override mirrors the base QuestionElement attempts bookkeeping,
    // so attemptsExhausted() reports true once the attempts are spent and
    // a second check is blocked after the single allowed attempt
    const el = await ready();
    el.maxAttempts = 1;
    // the real view-transition wrapper is nondeterministic in the test
    // browser, so stand in a synchronous one for this flow
    const original = globalThis.document.startViewTransition;
    globalThis.document.startViewTransition = fakeViewTransition;
    try {
      el.checkAnswer();
      await el.updateComplete;
      await flush(150);
      expect(el.showAnswer).to.equal(true);
      expect(el.attempts).to.equal(1);
      el.showAnswer = false;
      await el.updateComplete;
      el.checkAnswer();
      await el.updateComplete;
      await flush(150);
      expect(el.attempts).to.equal(1);
      expect(el.showAnswer).to.equal(false);
    } finally {
      if (original === undefined) {
        delete globalThis.document.startViewTransition;
      } else {
        globalThis.document.startViewTransition = original;
      }
    }
  });

  it("disabled disables every option and clears correctness", async () => {
    const el = await ready();
    el.disabled = true;
    await el.updateComplete;
    await flush();
    for (const option of Array.from(el.getOptions())) {
      expect(option.disabled).to.equal(true);
      expect(option.correct).to.equal(null);
      expect(option.incorrect).to.equal(null);
    }
    el.disabled = false;
    await el.updateComplete;
    await flush();
    for (const option of Array.from(el.getOptions())) {
      expect(option.disabled).to.equal(false);
    }
  });

  it("renders image answers with alt text", async () => {
    const el = await ready();
    el.answers = [
      {
        label: "Look",
        image: "data:image/gif;base64,R0lGODlhAQABAAAAACw=",
        alt: "a marker",
      },
      { label: "No image" },
    ];
    await el.updateComplete;
    await flush();
    const img = el.getOptions()[0].querySelector("img");
    expect(img).to.exist;
    expect(img.getAttribute("alt")).to.equal("a marker");
    expect(img.getAttribute("src")).to.include("data:image/gif");
  });

  it("emits OER schema markup", async () => {
    const el = await ready();
    expect(el.getAttribute("typeof")).to.equal("oer:Assessment");
    const shadow = el.shadowRoot;
    expect(
      shadow.querySelector('meta[property="oer:assessing"]').getAttribute(
        "content",
      ),
    ).to.equal("");
    el.relatedResource = "related-123";
    el.gradingFormat = "points";
    el.hasLearningObjective = "order sequences";
    el.forCourse = "MATH-101";
    await el.updateComplete;
    expect(
      shadow.querySelector('meta[property="oer:assessing"]').getAttribute(
        "content",
      ),
    ).to.equal("related-123");
    expect(
      shadow.querySelector('meta[property="oer:gradingFormat"]').getAttribute(
        "content",
      ),
    ).to.equal("points");
    expect(
      shadow
        .querySelector('meta[property="oer:hasLearningObjective"]')
        .getAttribute("content"),
    ).to.equal("order sequences");
    expect(
      shadow.querySelector('meta[property="oer:forCourse"]').getAttribute(
        "content",
      ),
    ).to.equal("MATH-101");
    const name = shadow.querySelector('h3[property="oer:name"]');
    expect(name).to.exist;
    expect(name.textContent.trim()).to.equal("Order the letters");
  });

  it("inactiveCase is always true and guesses start empty", async () => {
    const el = await ready();
    expect(el.inactiveCase()).to.equal(true);
    expect(el.getGuess().length).to.equal(0);
    expect(el.guessCount()).to.equal(0);
    // alternate storage keys fall back safely rather than returning undefined
    el.guessDataValue = "nothing-set-anywhere";
    expect(el.getGuess().length).to.equal(0);
    el.guessDataValue = "quizName";
    expect(el.getGuess()).to.equal("default");
    el.guessDataValue = "display";
  });

  it("renders directions and the related content block", async () => {
    const el = await ready();
    expect(el.shadowRoot.querySelector("#directions")).to.exist;
    expect(el.shadowRoot.querySelector("#directions").textContent).to.include(
      "up and down",
    );
    expect(el.shadowRoot.querySelector("#related")).to.exist;
    expect(el.shadowRoot.querySelector('slot[name="content"]')).to.exist;
  });

  it("haxinlineContextMenu wires the three inline buttons", () => {
    const el = globalThis.document.createElement("sorting-question");
    const menu = { ceButtons: null };
    el.haxinlineContextMenu(menu);
    expect(menu.ceButtons.length).to.equal(3);
    expect(menu.ceButtons[0].label).to.equal("Add answer");
    expect(menu.ceButtons[1].callback).to.equal("haxClickInlineRemove");
    expect(menu.ceButtons[2].callback).to.equal("haxToggleEdit");
  });

  it("haxClickInlineAdd appends a Next answer", async () => {
    const el = await ready();
    expect(el.haxClickInlineAdd()).to.equal(true);
    await el.updateComplete;
    await flush(150);
    expect(el.answers.length).to.equal(4);
    expect(el.answers[el.answers.length - 1].label).to.equal("Next");
    expect(el.getOptions().length).to.equal(4);
  });

  it("haxClickInlineRemove pops the last answer and no-ops when empty", async () => {
    const el = await ready();
    expect(el.haxClickInlineRemove()).to.equal(true);
    await el.updateComplete;
    await flush(150);
    expect(el.answers.length).to.equal(2);
    el.answers = [];
    await el.updateComplete;
    await flush(150);
    expect(el.haxClickInlineRemove()).to.equal(undefined);
    expect(el.answers.length).to.equal(0);
  });

  it("edit mode renders the feedback edit wrappers", async () => {
    const el = await ready();
    el._haxstate = true;
    el.edit = true;
    await el.updateComplete;
    await flush();
    const wrapper = el.shadowRoot.querySelector(".edit-wrapper");
    expect(wrapper).to.exist;
    expect(el.shadowRoot.querySelectorAll(".edit-wrapper slot").length).to
      .be.above(0);
    el.edit = false;
    el._haxstate = false;
    await el.updateComplete;
  });

  it("passes the a11y audit with a full board", async () => {
    const el = await ready();
    await expect(el).shadowDom.to.be.accessible();
  });
});
