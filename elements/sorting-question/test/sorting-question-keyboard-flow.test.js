/**
 * Keyboard flow: sorting-question. Answer with real keys, Tab to Check answer, Enter
 * submits, Tab to Try again, Enter resets and focus stays in the question.
 * See scripts/test-setup/keyboard-flow-question.js.
 */
import { html } from "@open-wc/testing";
import "../sorting-question.js";
import { press } from "../../../scripts/test-setup/keyboard-flow.js";
import { describeQuestionKeyboardFlow } from "../../../scripts/test-setup/keyboard-flow-question.js";

describeQuestionKeyboardFlow(
  "sorting-question",
  () =>
    html`<sorting-question question="Put these in order">
      <input value="First" />
      <input value="Second" />
      <input value="Third" />
    </sorting-question>`,
  async (fx) => {
    // move the first option down one place
    await fx.tabTo(/arrow-downward|move down/i);
    await press("Enter", 150);
  },
);
