/**
 * Keyboard flow: fill-in-the-blanks. Answer with real keys, Tab to Check answer, Enter
 * submits, Tab to Try again, Enter resets and focus stays in the question.
 * See scripts/test-setup/keyboard-flow-question.js.
 */
import { html } from "@open-wc/testing";
import "../fill-in-the-blanks.js";
import { type } from "../../../scripts/test-setup/keyboard-flow.js";
import { describeQuestionKeyboardFlow } from "../../../scripts/test-setup/keyboard-flow-question.js";

describeQuestionKeyboardFlow(
  "fill-in-the-blanks",
  () =>
    html`<fill-in-the-blanks
      statement="Ducks [quack] and cows [moo|bark]."
    ></fill-in-the-blanks>`,
  async (fx) => {
    await fx.tabTo(/blank 1/i);
    await type("quack", 100);
  },
);
