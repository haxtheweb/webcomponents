import { fixture, expect, html } from "@open-wc/testing";
import "../multiple-choice.js";
import { MultipleChoice } from "../multiple-choice.js";

const duckFixture = () => html`<multiple-choice
  id="basic"
  name="basic"
  title="Which are ducks?"
  question="Which are ducks?"
>
  <input correct value="Huey" />
  <input correct value="Duey" />
  <input correct value="Daffy" />
  <input correct value="Donald" />
  <input value="Mickey" />
  <div slot="feedbackCorrect">Great job!</div>
  <div slot="feedbackIncorrect">Try the pond again.</div>
  <div slot="hint">They quack.</div>
  <div slot="evidence">Ducks have bills.</div>
  <div slot="content">Read about ducks.</div>
</multiple-choice>`;

const flush = (ms = 60) => new Promise((r) => setTimeout(r, ms));

describe("multiple-choice behavior", () => {
  let audioHeard;
  let toasts;
  let toastHandler;
  let audioHandler;

  beforeEach(() => {
    audioHeard = [];
    toasts = [];
    audioHandler = (e) => audioHeard.push(e.detail.sound);
    toastHandler = (e) => toasts.push(e);
    globalThis.addEventListener("playaudio", audioHandler);
    globalThis.addEventListener("simple-toast-show", toastHandler);
  });

  afterEach(() => {
    globalThis.removeEventListener("playaudio", audioHandler);
    globalThis.removeEventListener("simple-toast-show", toastHandler);
    delete globalThis.HAXCMSToast;
  });

  async function ready() {
    const el = await fixture(duckFixture());
    await el.updateComplete;
    // let the __answerLock unlock timeout run: reassigning answers before it
    // fires makes updated() skip the clean/displayedAnswers branch entirely
    await flush(20);
    return el;
  }

  describe("multiple-choice specifics", () => {
    it("exposes haxProperties as a file reference", () => {
      const href = MultipleChoice.haxProperties;
      expect(typeof href).to.equal("string");
      expect(href.endsWith("multiple-choice.haxProperties.json")).to.equal(
        true,
      );
    });
    it("renderDirections covers both single and multiple wording", async () => {
      const el = await ready();
      // nested template text lives in values, not strings, so assert on the
      // rendered directions text instead
      expect(el.shadowRoot.querySelector("#directions").textContent).to
        .include("Select all that apply");
      el.singleOption = true;
      await el.updateComplete;
      expect(el.shadowRoot.querySelector("#directions").textContent).to
        .include("Select the answer");
    });
    it("haxinlineContextMenu wires the add/remove/edit buttons", () => {
      const el = globalThis.document.createElement("multiple-choice");
      const menu = { ceButtons: null };
      el.haxinlineContextMenu(menu);
      expect(menu.ceButtons.length).to.equal(3);
      expect(menu.ceButtons[0].label).to.equal("Add answer");
      expect(menu.ceButtons[2].callback).to.equal("haxToggleEdit");
    });
    it("haxClickInlineAdd appends a new incorrect answer", async () => {
      const el = await ready();
      const before = el.answers.length;
      expect(el.haxClickInlineAdd()).to.equal(true);
      await el.updateComplete;
      expect(el.answers.length).to.equal(before + 1);
      expect(el.answers[el.answers.length - 1].label).to.equal("New answer");
      expect(el.answers[el.answers.length - 1].correct).to.equal(false);
    });
    it("haxClickInlineRemove pops the last answer and no-ops when empty", async () => {
      const el = await ready();
      const before = el.answers.length;
      expect(el.haxClickInlineRemove()).to.equal(true);
      await el.updateComplete;
      expect(el.answers.length).to.equal(before - 1);
      el.answers = [];
      await el.updateComplete;
      expect(el.haxClickInlineRemove()).to.equal(undefined);
      expect(el.answers.length).to.equal(0);
    });
  });

  describe("light dom ingestion and answer normalization", () => {
    it("reads <input> children into answers and wipes them from the DOM", async () => {
      const el = await ready();
      expect(el.answers.length).to.equal(5);
      expect(el.answers[0].label).to.equal("Huey");
      expect(el.answers[0].correct).to.equal(true);
      expect(el.answers[4].correct).to.equal(false);
      expect(el.answers[0].order).to.equal(0);
      // light dom inputs are stripped after ingestion
      expect(el.querySelectorAll("input").length).to.equal(0);
    });
    it("dispatches answers-changed and displayed-answers-changed events", async () => {
      const el = await ready();
      let answersChanged = 0;
      let displayedChanged = 0;
      el.addEventListener("answers-changed", () => answersChanged++);
      el.addEventListener("displayed-answers-changed", () => displayedChanged++);
      el.answers = [{ label: "New", correct: true }];
      await el.updateComplete;
      await flush();
      expect(answersChanged).to.be.above(0);
      expect(displayedChanged).to.be.above(0);
    });
    it("cleanAnswerData normalizes onto the answer prototype", async () => {
      const el = await ready();
      const cleaned = el.cleanAnswerData([{ label: "x" }, { correct: true }]);
      expect(cleaned.length).to.equal(2);
      expect(cleaned[0].order).to.equal(0);
      expect(cleaned[0].correct).to.equal(false);
      expect(cleaned[1].order).to.equal(1);
      expect(cleaned[1].correct).to.equal(true);
      // unknown keys are preserved through the spread
      expect(cleaned[0].label).to.equal("x");
    });
    it("processInput handles plain objects and out-of-range indexes", async () => {
      const el = await ready();
      const fromObject = el.processInput(0, [{ label: "A", correct: true }], []);
      expect(fromObject.label).to.equal("A");
      expect(fromObject.correct).to.equal(true);
      expect(fromObject.order).to.equal(0);
      const guard = el.processInput(9, [], []);
      expect(guard.order).to.equal(9);
      expect(guard.correct).to.equal(false);
      const host = globalThis.document.createElement("div");
      const input = globalThis.document.createElement("input");
      input.value = "From input";
      input.setAttribute("correct", "correct");
      input.setAttribute("data-image", "https://example.com/i.png");
      input.setAttribute("data-image-alt", "alt text");
      input.setAttribute("data-selected", "good pick");
      input.setAttribute("data-unselected", "not picked");
      host.appendChild(input);
      const fromInput = el.processInput(0, [input], []);
      expect(fromInput.label).to.equal("From input");
      expect(fromInput.correct).to.equal(true);
      expect(fromInput.image).to.equal("https://example.com/i.png");
      expect(fromInput.alt).to.equal("alt text");
      expect(fromInput.selectedFeedback).to.equal("good pick");
      expect(fromInput.unselectedFeedback).to.equal("not picked");
    });
  });

  describe("answer state", () => {
    it("getGuess tracks displayed guesses and alternates on guessDataValue", async () => {
      const el = await ready();
      expect(el.getGuess().length).to.equal(0);
      el.displayedAnswers = el.displayedAnswers.map((a) => ({
        ...a,
        userGuess: true,
      }));
      await el.updateComplete;
      expect(el.getGuess().length).to.equal(5);
      expect(el.guessCount()).to.equal(5);
      expect(el.inactiveCase()).to.equal(true);
      // alternate storage key falls back to any property of that name
      el.guessDataValue = "quizName";
      expect(el.getGuess()).to.equal("default");
    });
    it("checkedEvent records the guess on the displayed answer", async () => {
      const el = await ready();
      el.checkedEvent({ target: { name: 1 }, detail: { value: true } });
      await el.updateComplete;
      expect(el.displayedAnswers[1].userGuess).to.equal(true);
      expect(el.guessCount()).to.equal(1);
    });
    it("resetAnswer wipes guesses and turns the board off", async () => {
      const el = await ready();
      el.displayedAnswers = el.displayedAnswers.map((a) => ({
        ...a,
        userGuess: true,
      }));
      el.showAnswer = true;
      await el.updateComplete;
      el.resetAnswer();
      await el.updateComplete;
      await flush();
      expect(el.showAnswer).to.equal(false);
      expect(el.guessCount()).to.equal(0);
    });
    it("isCorrect requires exactly the right guesses", async () => {
      const el = await ready();
      // select all the correct answers only
      el.displayedAnswers = el.displayedAnswers.map((a) => ({
        ...a,
        userGuess: a.correct === true,
      }));
      await el.updateComplete;
      expect(el.isCorrect()).to.equal(true);
      // select a wrong one too
      el.displayedAnswers = el.displayedAnswers.map((a) => ({
        ...a,
        userGuess: true,
      }));
      expect(el.isCorrect()).to.equal(false);
      // miss a correct one
      el.displayedAnswers = el.displayedAnswers.map((a) => ({
        ...a,
        userGuess: false,
      }));
      expect(el.isCorrect()).to.equal(false);
    });
    it("_computeDisplayedAnswers shuffles only when randomizing", async () => {
      const el = await ready();
      const data = [{ label: "a" }, { label: "b" }, { label: "c" }];
      const same = el._computeDisplayedAnswers(data, false);
      expect(same).to.equal(data);
      const shuffled = el._computeDisplayedAnswers([...data], true);
      // shuffle preserves membership even if the order changes
      expect(shuffled.length).to.equal(3);
      expect(shuffled.map((x) => x.label).sort().join("")).to.equal("abc");
      // editing via hax suppresses randomization
      el._haxstate = true;
      const frozen = el._computeDisplayedAnswers([...data], true);
      expect(frozen.map((x) => x.label).join("")).to.equal("abc");
      el._haxstate = false;
    });
  });

  describe("clickSingle interactions", () => {
    it("mouse interaction on multi-select only records the field change", async () => {
      const el = await ready();
      const fields = el.shadowRoot.querySelectorAll("simple-fields-field");
      fields[0].dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true, composed: true }),
      );
      await el.updateComplete;
      // mouse path defers to the field's own value-changed event
      expect(el.guessCount()).to.equal(0);
    });
    it("keyboard Enter toggles a guess in multi-select", async () => {
      const el = await ready();
      const fields = el.shadowRoot.querySelectorAll("simple-fields-field");
      fields[0].dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Enter",
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;
      expect(el.displayedAnswers[fields[0].getAttribute("name")].userGuess).to
        .equal(true);
      // Enter again untoggles it
      fields[0].dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Enter",
          bubbles: true,
          composed: true,
        }),
      );
      expect(el.displayedAnswers[fields[0].getAttribute("name")].userGuess).to
        .equal("");
    });
    it("ArrowUp/ArrowDown move focus through the options and wrap", async () => {
      const el = await ready();
      const fields = el.shadowRoot.querySelectorAll("simple-fields-field");
      const first = fields[0];
      const second = fields[1];
      const last = fields[fields.length - 1];
      first.focus();
      first.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "ArrowDown",
          bubbles: true,
          composed: true,
        }),
      );
      expect(el.shadowRoot.activeElement === second).to.equal(true);
      second.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "ArrowUp",
          bubbles: true,
          composed: true,
        }),
      );
      expect(el.shadowRoot.activeElement === first).to.equal(true);
      // wrap around to the last option from the first
      first.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "ArrowUp",
          bubbles: true,
          composed: true,
        }),
      );
      expect(el.shadowRoot.activeElement === last).to.equal(true);
      // and back to the first from the last
      last.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "ArrowDown",
          bubbles: true,
          composed: true,
        }),
      );
      expect(el.shadowRoot.activeElement === first).to.equal(true);
    });
    it("single option keyboard interactions toggle exclusively", async () => {
      const el = await ready();
      el.singleOption = true;
      await el.updateComplete;
      const fields = el.shadowRoot.querySelectorAll("simple-fields-field");
      const first = fields[0];
      const second = fields[1];
      second.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Enter",
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;
      const guessIndex = second.getAttribute("name");
      expect(el.displayedAnswers[guessIndex].userGuess).to.equal(true);
      for (const answer of el.displayedAnswers) {
        if (answer !== el.displayedAnswers[guessIndex]) {
          expect(answer.userGuess).to.not.equal(true);
        }
      }
      // space key also proceeds on single option
      first.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: " ",
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;
      const firstIndex = first.getAttribute("name");
      expect(el.displayedAnswers[firstIndex].userGuess).to.equal(true);
      expect(el.displayedAnswers[guessIndex].userGuess).to.not.equal(true);
    });
    it("single option mouse interactions proceed and wipe the others", async () => {
      const el = await ready();
      el.singleOption = true;
      await el.updateComplete;
      el.displayedAnswers = el.displayedAnswers.map((a) => ({
        ...a,
        userGuess: true,
      }));
      const fields = el.shadowRoot.querySelectorAll("simple-fields-field");
      fields[0].dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true, composed: true }),
      );
      await el.updateComplete;
      const firstIndex = fields[0].getAttribute("name");
      for (const [i, answer] of el.displayedAnswers.entries()) {
        if (String(i) !== String(firstIndex)) {
          expect(answer.userGuess).to.not.equal(true);
        }
      }
    });
    it("other keys do nothing in clickSingle", async () => {
      const el = await ready();
      const fields = el.shadowRoot.querySelectorAll("simple-fields-field");
      fields[0].dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "a",
          bubbles: true,
          composed: true,
        }),
      );
      await el.updateComplete;
      expect(el.guessCount()).to.equal(0);
    });
  });

  describe("checkAnswer flows", () => {
    it("correct answers rain confetti, play success and toast green", async () => {
      const el = await ready();
      el.displayedAnswers = el.displayedAnswers.map((a) => ({
        ...a,
        userGuess: a.correct === true,
      }));
      el.attempts = 0;
      // checkAnswer's view-transition wrapper is nondeterministic in the
      // test browser; the callback is the deterministic surface
      el.checkAnswerCallback();
      await el.updateComplete;
      await flush(150);
      expect(el.showAnswer).to.equal(true);
      expect(el.isCorrect()).to.equal(true);
      expect(el.attempts).to.equal(1);
      expect(audioHeard.includes("success")).to.equal(true);
      expect(toasts.length).to.equal(1);
      expect(toasts[0].detail.accentColor).to.equal("green");
      // confetti got triggered through the #confetti container
      const confetti = el.shadowRoot.querySelector("#confetti");
      expect(confetti).to.exist;
      expect(confetti.hasAttribute("popped")).to.equal(true);
    });
    it("wrong answers toast red, play error and fire the feedback", async () => {
      const el = await ready();
      el.displayedAnswers = el.displayedAnswers.map((a) => ({
        ...a,
        userGuess: true,
      }));
      el.checkAnswerCallback();
      await el.updateComplete;
      await flush();
      expect(el.isCorrect()).to.equal(false);
      expect(audioHeard.includes("error")).to.equal(true);
      expect(toasts.length).to.equal(1);
      expect(toasts[0].detail.accentColor).to.equal("red");
      expect(toasts[0].detail.fire).to.equal(true);
    });
    it("user-engagement fires with the quiz name and correctness", async () => {
      const el = await ready();
      let engagement = null;
      el.addEventListener("user-engagement", (e) => {
        engagement = e.detail;
      });
      el.displayedAnswers = el.displayedAnswers.map((a) => ({
        ...a,
        userGuess: a.correct === true,
      }));
      el.checkAnswerCallback();
      await el.updateComplete;
      expect(engagement).to.not.equal(null);
      expect(engagement.objectName).to.equal("default");
      expect(engagement.resultSuccess).to.equal(true);
      expect(engagement.activityDisplay).to.equal("answered");
    });
    it("renders the correct and incorrect feedback slots after checking", async () => {
      const el = await ready();
      el.displayedAnswers = el.displayedAnswers.map((a) => ({
        ...a,
        userGuess: a.correct === true,
      }));
      el.checkAnswerCallback();
      await el.updateComplete;
      await flush();
      const shadow = el.shadowRoot;
      expect(shadow.querySelector('slot[name="feedbackCorrect"]')).to.exist;
      expect(shadow.querySelector('slot[name="evidence"]')).to.exist;
      expect(shadow.innerHTML.includes("Evidence")).to.equal(true);
      // now answer wrong to see the other side
      el.resetAnswer();
      await el.updateComplete;
      await flush();
      el.displayedAnswers = el.displayedAnswers.map((a) => ({
        ...a,
        userGuess: true,
      }));
      el.checkAnswerCallback();
      await el.updateComplete;
      await flush();
      expect(el.shadowRoot.querySelector('slot[name="feedbackIncorrect"]')).to
        .exist;
      expect(el.shadowRoot.querySelector('slot[name="hint"]')).to.exist;
      expect(el.shadowRoot.innerHTML.includes("Need a hint?")).to.equal(true);
    });
    it("supports the haxcms toast variant", async () => {
      const el = await ready();
      globalThis.HAXCMSToast = true;
      el.displayedAnswers = el.displayedAnswers.map((a) => ({
        ...a,
        userGuess: a.correct === true,
      }));
      el.checkAnswerCallback();
      await el.updateComplete;
      expect(el.showAnswer).to.equal(true);
      delete globalThis.HAXCMSToast;
    });
    it("checkAnswer falls back to a direct callback without view transitions", async () => {
      const el = await ready();
      const original = globalThis.document.startViewTransition;
      globalThis.document.startViewTransition = undefined;
      el.displayedAnswers = el.displayedAnswers.map((a) => ({
        ...a,
        userGuess: a.correct === true,
      }));
      el.checkAnswer();
      await el.updateComplete;
      globalThis.document.startViewTransition = original;
      expect(el.showAnswer).to.equal(true);
    });
  });

  describe("rendered surface details", () => {
    it("renders OER schema meta for grading, objective and course", async () => {
      const el = await ready();
      el.gradingFormat = "points";
      el.hasLearningObjective = "identify ducks";
      el.forCourse = "ART-100";
      await el.updateComplete;
      const shadow = el.shadowRoot;
      expect(
        shadow.querySelector('meta[property="oer:gradingFormat"]').getAttribute(
          "content",
        ),
      ).to.equal("points");
      expect(
        shadow
          .querySelector('meta[property="oer:hasLearningObjective"]')
          .getAttribute("content"),
      ).to.equal("identify ducks");
      expect(
        shadow.querySelector('meta[property="oer:forCourse"]').getAttribute(
          "content",
        ),
      ).to.equal("ART-100");
    });
    it("renders image answers with alt text", async () => {
      const el = await ready();
      el.randomize = false;
      el.answers = [
        {
          label: "Look",
          correct: true,
          image: "https://example.com/duck.png",
          alt: "a duck",
        },
        { label: "No image", correct: false },
      ];
      await el.updateComplete;
      await flush();
      const img = el.shadowRoot.querySelector(
        "simple-fields-field img[slot='label-prefix']",
      );
      expect(img).to.exist;
      expect(img.getAttribute("alt")).to.equal("a duck");
      expect(img.getAttribute("src")).to.equal("https://example.com/duck.png");
    });
    it("renders the related content block when slotted", async () => {
      const el = await ready();
      await el.updateComplete;
      expect(el.shadowRoot.querySelector("#related")).to.exist;
      expect(el.shadowRoot.querySelector('slot[name="content"]')).to.exist;
    });
    it("hides the check/reset buttons when hideButtons is set", async () => {
      const el = await ready();
      el.hideButtons = true;
      await el.updateComplete;
      expect(el.shadowRoot.querySelector("#buttons")).to.equal(null);
      el.hideButtons = false;
      await el.updateComplete;
      expect(el.shadowRoot.querySelector("#buttons")).to.exist;
    });
    it("renders the legend inside the feedback details", async () => {
      const el = await ready();
      expect(el.shadowRoot.querySelector("#legend")).to.exist;
      expect(el.shadowRoot.querySelectorAll("#legend dt").length).to.equal(2);
    });
  });

  describe("hax integration hooks", () => {
    it("haxHooks maps all lifecycle hooks", async () => {
      const el = await ready();
      const hooks = el.haxHooks();
      expect(Object.keys(hooks).length).to.equal(5);
      expect(hooks.editModeChanged).to.equal("haxeditModeChanged");
      expect(hooks.preProcessNodeToContent).to.equal(
        "haxpreProcessNodeToContent",
      );
    });
    it("haxactiveElementChanged and haxeditModeChanged track hax state", async () => {
      const el = await ready();
      el.haxactiveElementChanged(el, true);
      expect(el._haxstate).to.equal(true);
      el.haxeditModeChanged(false);
      expect(el._haxstate).to.equal(false);
    });
    it("haxToggleEdit flips edit mode", async () => {
      const el = await ready();
      expect(el.haxToggleEdit()).to.equal(true);
      expect(el.edit).to.equal(true);
      expect(el.haxToggleEdit()).to.equal(true);
      expect(el.edit).to.equal(false);
    });
    it("the base haxinlineContextMenu wires the edit toggle", async () => {
      const el = await ready();
      const menu = { ceButtons: null };
      // invoke the QuestionElement base implementation directly
      Object.getPrototypeOf(Object.getPrototypeOf(el)).haxinlineContextMenu.call(
        el,
        menu,
      );
      expect(menu.ceButtons.length).to.equal(1);
      expect(menu.ceButtons[0].callback).to.equal("haxToggleEdit");
    });
    it("haxpreProcessNodeToContent serializes answers back to inputs", async () => {
      const el = await ready();
      await el.haxpreProcessNodeToContent(el);
      const inputs = Array.from(el.querySelectorAll("input:not([slot])"));
      expect(inputs.length).to.equal(5);
      expect(inputs[0].value).to.equal("Huey");
      expect(inputs[0].hasAttribute("correct")).to.equal(true);
      expect(inputs[4].hasAttribute("correct")).to.equal(false);
      // run again to exercise the input wiping branch
      await el.haxpreProcessNodeToContent(el);
      expect(Array.from(el.querySelectorAll("input:not([slot])")).length).to
        .equal(5);
    });
    it("haxpreProcessNodeToContent writes image and feedback attributes", async () => {
      const el = await ready();
      el.answers = [
        {
          label: "Visual",
          correct: true,
          image: "https://example.com/v.png",
          alt: "visual",
          selectedFeedback: "nice",
          unselectedFeedback: "read again",
        },
      ];
      await el.updateComplete;
      await el.haxpreProcessNodeToContent(el);
      const input = el.querySelector("input:not([slot])");
      expect(input.getAttribute("data-image")).to.equal(
        "https://example.com/v.png",
      );
      expect(input.getAttribute("data-image-alt")).to.equal("visual");
      expect(input.getAttribute("data-selected")).to.equal("nice");
      expect(input.getAttribute("data-unselected")).to.equal("read again");
    });
    it("haxpreProcessInsertContent strips userGuess state", async () => {
      const el = await ready();
      const detail = {
        properties: {
          answers: [
            { label: "a", userGuess: true },
            { label: "b" },
          ],
        },
      };
      const out = el.haxpreProcessInsertContent(detail, null);
      expect(out.properties.answers[0].userGuess).to.equal(undefined);
      expect(out.properties.answers[1].label).to.equal("b");
    });
    it("haxpreProcessInsertContent passes through without answers", async () => {
      const el = await ready();
      const detail = { properties: {} };
      const out = el.haxpreProcessInsertContent(detail, null);
      expect(out).to.equal(detail);
    });
    it("edit mode renders the feedback edit wrappers", async () => {
      const el = await ready();
      el._haxstate = true;
      el.edit = true;
      await el.updateComplete;
      const wrapper = el.shadowRoot.querySelector(".edit-wrapper");
      expect(wrapper).to.exist;
      expect(el.shadowRoot.querySelectorAll(".edit-wrapper slot").length).to
        .equal(5);
      el.edit = false;
      el._haxstate = false;
      await el.updateComplete;
    });
    it("edit mode seeds empty slotted paragraphs for editing", async () => {
      const el = await ready();
      el._haxstate = true;
      el.edit = true;
      await el.updateComplete;
      await flush();
      const slots = [
        "feedbackIncorrect",
        "feedbackCorrect",
        "content",
        "hint",
        "evidence",
      ];
      for (const slot of slots) {
        expect(el.querySelector(`[slot="${slot}"]`)).to.exist;
      }
      el.edit = false;
      el._haxstate = false;
      await el.updateComplete;
    });
  });
});
