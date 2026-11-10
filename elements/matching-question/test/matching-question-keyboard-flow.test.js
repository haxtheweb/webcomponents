/**
 * Keyboard flow: matching-question. Answer with real keys, Tab to Check answer, Enter
 * submits, Tab to Try again, Enter resets and focus stays in the question.
 * See scripts/test-setup/keyboard-flow-question.js.
 */
import { html } from "@open-wc/testing";
import "../matching-question.js";
import { press } from "../../../scripts/test-setup/keyboard-flow.js";
import { describeQuestionKeyboardFlow } from "../../../scripts/test-setup/keyboard-flow-question.js";

describeQuestionKeyboardFlow(
  "matching-question",
  () =>
    html`<matching-question question="Match the labels">
      <input data-correct="true" value="Purpose" />
      <input value="Temple" />
      <input data-correct="true" value="Design" />
      <input value="Dome" />
    </matching-question>`,
  async (fx) => {
    // Enter on an option opens the "match to" dialog with its select focused
    await fx.tabTo(/^temple$/i);
    await press("Enter", 200);
    await press("ArrowDown", 200);
  },
);
