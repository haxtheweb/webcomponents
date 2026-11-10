/**
 * Keyboard flow: question types (multiple-choice, true-false-question).
 * Tab to an answer, Space selects it, Tab to "Check answer", Enter submits,
 * focus moves to the polite status region that announces the result, and
 * "Try again" resets, all without a mouse. See
 * scripts/test-setup/keyboard-flow.js for the per-stop invariants.
 */
import { fixture, expect, html } from "@open-wc/testing";
import "../multiple-choice.js";
import "../lib/true-false-question.js";
import {
  press,
  settle,
  waitFor,
  deepActiveElement,
  expectGoodFocusStop,
  expectFocusOn,
  positiveTabindexIn,
  describeEl,
} from "../../../scripts/test-setup/keyboard-flow.js";

const label = (el) =>
  el && el.getAttribute
    ? el.getAttribute("aria-label") ||
      el.getAttribute("label") ||
      (el.getRootNode().host &&
        el.getRootNode().host.getAttribute &&
        el.getRootNode().host.getAttribute("label")) ||
      (el.textContent || "").trim()
    : "";

async function tabTo(wanted, stopAt, max = 20) {
  for (let i = 0; i < max; i++) {
    await press("Tab");
    const el = expectGoodFocusStop(expect, `Tab toward ${wanted} (${i + 1})`);
    if (wanted.test(label(el))) return el;
    if (el === stopAt) break;
  }
  throw new Error(
    `no focusable control labelled ${wanted} before ${describeEl(stopAt)}`,
  );
}

async function setup(template) {
  const wrapper = await fixture(template);
  const q = wrapper.querySelector("multiple-choice, true-false-question");
  await q.updateComplete;
  // QuestionElement briefly locks answers after first render
  await settle(400);
  wrapper.querySelector("#before").focus();
  return {
    q,
    before: wrapper.querySelector("#before"),
    after: wrapper.querySelector("#after"),
  };
}

// KNOWN BUG: "Check answer" and "Try again" are simple-toolbar-buttons
// rendered outside a simple-toolbar (lib/QuestionElement.js renderButtons).
// simple-toolbar-button only puts its inner <button> in the tab order when
// isCurrentItem is true (lib/simple-toolbar-button.js tabindex binding),
// which only a parent simple-toolbar or a .focus() call sets, so Tab skips
// both buttons and a keyboard user cannot submit an answer. Until that is
// fixed the flows below put focus on the button through its own focus()
// API (what a roving toolbar would do) and then continue with real keys;
// the it.skip tests assert the Tab reachability that should hold.
async function focusButton(fx, id) {
  const btn = fx.q.shadowRoot.querySelector(`#${id}`);
  await waitFor(() => btn && !btn.disabled && !btn.hidden, 1000);
  btn.focus();
  await settle(30);
  return expectGoodFocusStop(expect, `#${id}`);
}

async function answerAndCheck(fx, answer) {
  const option = await tabTo(answer, fx.after);
  expect(option.tagName).to.equal("INPUT");
  await press(" ", 60);
  expect(option.checked, `Space selects ${answer}`).to.equal(true);
  await focusButton(fx, "check");
  await press("Enter", 300);
  await waitFor(() => fx.q.showAnswer, 2000);
  expect(fx.q.showAnswer, "Enter on Check answer submits").to.equal(true);
  // focus lands on the live status region announcing the result
  const status = fx.q.shadowRoot.querySelector("#feedback");
  await waitFor(() => deepActiveElement() === status, 1000);
  expectFocusOn(expect, status, "focus after submit");
  expectGoodFocusStop(expect, "feedback status");
  expect(status.getAttribute("role")).to.equal("status");
  expect(status.getAttribute("aria-live")).to.equal("polite");
  return status;
}

describe("keyboard flow: multiple-choice", () => {
  let fx;
  beforeEach(async () => {
    fx = await setup(
      html`<div>
        <button id="before">before</button>
        <multiple-choice question="Which one is a duck?">
          <input correct value="Donald" />
          <input value="Mickey" />
          <input value="Goofy" />
        </multiple-choice>
        <button id="after">after</button>
      </div>`,
    );
  });

  it("logical tab order with no positive tabindex", async () => {
    expect(positiveTabindexIn(fx.q)).to.deep.equal([]);
    let guard = 0;
    while (deepActiveElement() !== fx.after && guard++ < 20) {
      await press("Tab");
      expectGoodFocusStop(expect, `multiple-choice Tab ${guard}`);
    }
    expectFocusOn(expect, fx.after);
  });

  it("select the right answer, submit, and the correct result is announced", async () => {
    const status = await answerAndCheck(fx, /^donald$/i);
    expect(fx.q.isCorrect()).to.equal(true);
    expect(status.textContent).to.include(fx.q.correctText);
  });

  it("a wrong answer is announced, and Try again resets from the keyboard", async () => {
    const status = await answerAndCheck(fx, /^goofy$/i);
    expect(fx.q.isCorrect()).to.equal(false);
    expect(status.textContent).to.include(fx.q.incorrectText);
    await focusButton(fx, "reset");
    await press("Enter", 200);
    expect(fx.q.showAnswer, "Try again clears the result").to.equal(false);
  });

  // KNOWN BUG: Enter on "Try again" hides that button (renderButtons
  // ?hidden="${!this.edit && !this.showAnswer}") and nothing moves focus, so
  // focus falls back to <body> and a keyboard user loses their place.
  it.skip("KNOWN BUG: focus stays inside the question after Try again", async () => {
    await answerAndCheck(fx, /^goofy$/i);
    await focusButton(fx, "reset");
    await press("Enter", 200);
    const active = expectGoodFocusStop(expect, "after Try again");
    expect(active === fx.after, "focus left the question").to.equal(false);
  });

  it.skip("KNOWN BUG: Check answer is reachable with Tab after selecting an answer", async () => {
    await tabTo(/^donald$/i, fx.after);
    await press(" ", 60);
    await tabTo(/check answer/i, fx.after);
  });

  it.skip("KNOWN BUG: Try again is reachable with Tab after a result", async () => {
    await tabTo(/^goofy$/i, fx.after);
    await press(" ", 60);
    fx.q.shadowRoot.querySelector("#check").click();
    await waitFor(() => fx.q.showAnswer, 2000);
    fx.before.focus();
    await tabTo(/try again/i, fx.after);
  });
});

describe("keyboard flow: true-false-question", () => {
  let fx;
  beforeEach(async () => {
    fx = await setup(
      html`<div>
        <button id="before">before</button>
        <true-false-question question="Ducks have wings.">
          <input data-correct="true" value="True" />
          <input value="False" />
        </true-false-question>
        <button id="after">after</button>
      </div>`,
    );
  });

  it("select an answer, submit, and the result is announced", async () => {
    const status = await answerAndCheck(fx, /^true$/i);
    expect(fx.q.isCorrect()).to.equal(true);
    expect(status.textContent).to.include(fx.q.correctText);
  });
});
