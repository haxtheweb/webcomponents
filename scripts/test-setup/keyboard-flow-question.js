/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Shared keyboard flow for question types built on QuestionElement
 * (elements/multiple-choice/lib/QuestionElement.js). A keyboard-only learner
 * must be able to answer, reach "Check answer" with Tab and submit with
 * Enter, hear the result (focus moves to the polite status region), reach
 * "Try again" with Tab, and stay inside the question after the reset hides
 * that button. Every stop is checked with the invariants in
 * keyboard-flow.js. Used from elements/<question>/test/*-keyboard-flow.test.js.
 */
/* global describe, it, beforeEach -- mocha globals from web-test-runner */
import { fixture, expect, html } from "@open-wc/testing";

import {
  press,
  settle,
  waitFor,
  deepActiveElement,
  composedContains,
  expectGoodFocusStop,
  expectFocusOn,
  positiveTabindexIn,
  describeEl,
} from "./keyboard-flow.js";

/**
 * Accessible-ish label of a focus stop: aria-label, label attribute, the
 * label of the host it lives in, or its text.
 */
export const questionLabel = (el) =>
  el && el.getAttribute
    ? el.getAttribute("aria-label") ||
      el.getAttribute("label") ||
      (el.getRootNode().host &&
        el.getRootNode().host.getAttribute &&
        el.getRootNode().host.getAttribute("label")) ||
      el.value ||
      (el.textContent || "").trim()
    : "";

/**
 * Tab forward until the focused control's label matches `wanted`, checking
 * the focus invariants at every stop. Fails if `stopAt` is reached first.
 */
export async function tabToQuestionControl(wanted, stopAt, max = 25) {
  for (let i = 0; i < max; i++) {
    await press("Tab");
    const el = expectGoodFocusStop(expect, `Tab toward ${wanted} (${i + 1})`);
    if (wanted.test(questionLabel(el))) return el;
    if (el === stopAt) break;
  }
  throw new Error(
    `no focusable control labelled ${wanted} before ${describeEl(stopAt)}`,
  );
}

/**
 * Register the question keyboard-flow suite.
 * @param {string} name element name for the describe block
 * @param {function} template () => lit template of the question alone
 * @param {function} answer async (fx) => void; answers the question with
 *   real keys starting from focus on the "before" button. fx has
 *   { q, before, after, tabTo(regex) }.
 */
export function describeQuestionKeyboardFlow(name, template, answer) {
  describe(`keyboard flow: ${name} check and try again`, function () {
    this.timeout(15000);
    let fx;

    beforeEach(async () => {
      const wrapper = await fixture(
        html`<div>
          <button id="before">before</button>
          ${template()}
          <button id="after">after</button>
        </div>`,
      );
      const q = wrapper.children[1];
      await q.updateComplete;
      // QuestionElement briefly locks answers after first render
      await settle(400);
      const before = wrapper.querySelector("#before");
      const after = wrapper.querySelector("#after");
      before.focus();
      fx = {
        q,
        before,
        after,
        tabTo: (wanted, max) => tabToQuestionControl(wanted, after, max),
      };
    });

    it("no positive tabindex", async () => {
      expect(positiveTabindexIn(fx.q)).to.deep.equal([]);
    });

    it("answer, Tab to Check answer, Enter submits and the result is announced", async () => {
      await answer(fx);
      await fx.tabTo(/check answer/i);
      await press("Enter", 300);
      await waitFor(() => fx.q.showAnswer, 2000);
      expect(fx.q.showAnswer, "Enter on Check answer submits").to.equal(true);
      const status = fx.q.shadowRoot.querySelector("#feedback");
      await waitFor(() => deepActiveElement() === status, 1000);
      expectFocusOn(expect, status, "focus after submit");
      expectGoodFocusStop(expect, "feedback status");
    });

    it("Tab reaches Try again, Enter resets and focus stays in the question", async () => {
      await answer(fx);
      await fx.tabTo(/check answer/i);
      await press("Enter", 300);
      await waitFor(() => fx.q.showAnswer, 2000);
      fx.before.focus();
      await fx.tabTo(/try again/i, 40);
      await press("Enter", 300);
      await waitFor(() => !fx.q.showAnswer, 2000);
      expect(fx.q.showAnswer, "Try again clears the result").to.equal(false);
      await waitFor(() => composedContains(fx.q, deepActiveElement()), 1000);
      const active = expectGoodFocusStop(expect, "after Try again");
      expect(
        composedContains(fx.q, active),
        `focus left the question for ${describeEl(active)}`,
      ).to.equal(true);
    });
  });
}
