import { fixture, expect, html } from "@open-wc/testing";
import "../multiple-choice.js";
import "../lib/true-false-question.js";
import { activityId } from "@haxtheweb/user-action/lib/xapi.js";

const flush = (ms = 40) => new Promise((r) => setTimeout(r, ms));
const settle = async (el) => {
  await flush();
  await el.updateComplete;
  await flush();
  await el.updateComplete;
};
const chip = (el) => el.shadowRoot.querySelector(".ddd-block-chip");
const chipIcon = (el) =>
  chip(el).querySelector("simple-icon-lite").getAttribute("icon");

// matchMedia that answers prefers-reduced-motion with on
function reduceMotion(on) {
  const real = globalThis.matchMedia;
  globalThis.matchMedia = (q) =>
    String(q).indexOf("prefers-reduced-motion") !== -1
      ? {
          matches: on,
          media: q,
          addEventListener() {},
          removeEventListener() {},
        }
      : real.call(globalThis, q);
  return () => {
    globalThis.matchMedia = real;
  };
}

// no view transition, so the check runs (and the burst follows) at once
function noViewTransition() {
  const real = globalThis.document.startViewTransition;
  globalThis.document.startViewTransition = undefined;
  return () => {
    globalThis.document.startViewTransition = real;
  };
}

async function answer(el, label) {
  el.displayedAnswers.forEach((a) => {
    a.userGuess = a.label === label ? true : "";
  });
  await el.checkAnswer();
  await settle(el);
  // the burst waits for the update after the check
  await el._celebration;
}

const quiz = () =>
  fixture(
    html`<multiple-choice question="Where does each unit begin?" single-option>
      <input data-correct="true" value="With a short video" />
      <input value="With the unit exam" />
    </multiple-choice>`,
  );

describe("QuestionElement header chip completion", () => {
  let restores = [];
  beforeEach(() => {
    restores = [noViewTransition()];
  });
  afterEach(() => {
    restores.forEach((r) => r());
  });

  it("a correct answer bursts the chip into a check box, once", async () => {
    restores.push(reduceMotion(false));
    const el = await quiz();
    await settle(el);
    expect(chipIcon(el)).to.equal("hax:head-question");
    expect(chip(el).hasAttribute("data-done")).to.equal(false);
    let played = 0;
    const seen = new MutationObserver((records) => {
      records.forEach((r) => {
        if (r.target.hasAttribute("data-ddd-celebrate")) {
          played++;
        }
      });
    });
    seen.observe(el.shadowRoot, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-ddd-celebrate"],
    });
    await answer(el, "With a short video");
    expect(chip(el).hasAttribute("data-done")).to.equal(true);
    expect(chipIcon(el)).to.equal("icons:check-box");
    expect(chip(el).getAttribute("title")).to.equal("Correct");
    expect(chip(el).hasAttribute("data-ddd-celebrate")).to.equal(true);
    expect(played).to.equal(1);
    // answering correctly again does not play it again
    el.showAnswer = false;
    await settle(el);
    await answer(el, "With a short video");
    expect(played).to.equal(1);
    seen.disconnect();
    await expect(el).shadowDom.to.be.accessible();
  });

  it("a wrong answer never bursts and keeps the question icon", async () => {
    restores.push(reduceMotion(false));
    const el = await quiz();
    await settle(el);
    await answer(el, "With the unit exam");
    expect(chip(el).hasAttribute("data-done")).to.equal(false);
    expect(chipIcon(el)).to.equal("hax:head-question");
    expect(chip(el).hasAttribute("data-ddd-celebrate")).to.equal(false);
    expect(chip(el).querySelector(".ddd-burst")).to.equal(null);
  });

  it("answered correctly on an earlier visit: done without a burst", async () => {
    restores.push(reduceMotion(false));
    const handler = (e) => {
      e.detail.record = {
        status: "correct",
        done: true,
        attempts: 1,
        response: "",
      };
    };
    globalThis.addEventListener("learner-progress-request", handler);
    try {
      const el = await quiz();
      await settle(el);
      expect(el._restored).to.exist;
      expect(chip(el).hasAttribute("data-done")).to.equal(true);
      expect(chipIcon(el)).to.equal("icons:check-box");
      expect(chip(el).hasAttribute("data-ddd-celebrate")).to.equal(false);
      // checking again on the revisit does not celebrate either
      await answer(el, "With a short video");
      expect(chip(el).hasAttribute("data-ddd-celebrate")).to.equal(false);
    } finally {
      globalThis.removeEventListener("learner-progress-request", handler);
    }
  });

  it("reduced motion: the chip shows done with no burst", async () => {
    restores.push(reduceMotion(true));
    const el = await quiz();
    await settle(el);
    await answer(el, "With a short video");
    expect(chip(el).hasAttribute("data-done")).to.equal(true);
    expect(chip(el).hasAttribute("data-ddd-celebrate")).to.equal(false);
  });

  it("other question types share it (true / false)", async () => {
    restores.push(reduceMotion(false));
    const el = await fixture(
      html`<true-false-question question="The sky is blue">
        <input data-correct="true" value="True" />
        <input value="False" />
      </true-false-question>`,
    );
    await settle(el);
    expect(activityId(el)).to.be.a("string");
    el.displayedAnswers.forEach((a) => {
      a.userGuess = a.correct ? true : "";
    });
    await el.checkAnswer();
    await settle(el);
    await el._celebration;
    expect(chip(el).hasAttribute("data-done")).to.equal(true);
    expect(chip(el).hasAttribute("data-ddd-celebrate")).to.equal(true);
  });
});
