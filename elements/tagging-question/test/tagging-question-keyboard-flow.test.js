/**
 * Keyboard flow: tagging-question. Answer with real keys, Tab to Check answer, Enter
 * submits, Tab to Try again, Enter resets and focus stays in the question.
 * See scripts/test-setup/keyboard-flow-question.js.
 */
import { html } from "@open-wc/testing";
import "../tagging-question.js";
import { press } from "../../../scripts/test-setup/keyboard-flow.js";
import { describeQuestionKeyboardFlow } from "../../../scripts/test-setup/keyboard-flow-question.js";

describeQuestionKeyboardFlow(
  "tagging-question",
  () =>
    html`<tagging-question question="Which are ducks?">
      <input value="Huey" />
      <input data-correct="true" value="Donald" />
      <input value="Pluto" />
    </tagging-question>`,
  async (fx) => {
    await fx.tabTo(/^donald$/i);
    await press("Enter", 150);
  },
);
