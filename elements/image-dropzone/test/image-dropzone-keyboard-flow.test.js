/**
 * Keyboard flow: image-dropzone. Answer with real keys, Tab to Check answer, Enter
 * submits, Tab to Try again, Enter resets and focus stays in the question.
 * See scripts/test-setup/keyboard-flow-question.js.
 */
import { html } from "@open-wc/testing";
import "../image-dropzone.js";
import { press } from "../../../scripts/test-setup/keyboard-flow.js";
import { describeQuestionKeyboardFlow } from "../../../scripts/test-setup/keyboard-flow-question.js";

describeQuestionKeyboardFlow(
  "image-dropzone",
  () =>
    html`<image-dropzone
      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3C/svg%3E"
      alt="Wireframe of a page"
      question="Label the page regions"
    >
      <input
        type="checkbox"
        value="header"
        data-zone="Top band"
        data-x="3"
        data-y="5"
        data-width="94"
        data-height="30"
      />
      <input
        type="checkbox"
        value="footer"
        data-zone="Bottom band"
        data-x="3"
        data-y="60"
        data-width="94"
        data-height="30"
      />
      <input type="checkbox" value="section" />
    </image-dropzone>`,
  async (fx) => {
    // Enter on a label picks it up and carries focus to the first empty
    // zone; Enter there places it and returns focus to the next label
    await fx.tabTo(/^header$/i);
    await press("Enter", 150);
    await press("Enter", 150);
    // focus is on the next label in the bank: pick it up, place it
    await press("Enter", 150);
    await press("Enter", 150);
  },
);
