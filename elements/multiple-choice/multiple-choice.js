import { LitElement, html, css } from "lit";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import "@haxtheweb/simple-toast/simple-toast.js";
import { QuestionElement } from "./lib/QuestionElement.js";
/**
 * `multiple-choice`
 * `Ask the user a question from a set of possible answers.`
 * @demo demo/index.html
 * @element multiple-choice
 */
class MultipleChoice extends QuestionElement {
  static get tag() {
    return "multiple-choice";
  }
  constructor() {
    super();
  }

  // this manages the directions that are rendered and hard coded for the interaction
  renderDirections() {
    return html`<p>
      <strong>
        ${!this.singleOption
          ? html`Select all that apply`
          : html`Select the answer`}</strong
      >, then press <strong>${this.t.checkAnswer}</strong>. You will get
      feedback indicating correctness of your answer and how to proceed.
    </p>`;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }

  /**
   * add buttons when it is in context
   */
  haxinlineContextMenu(ceMenu) {
    ceMenu.ceButtons = [
      {
        icon: "icons:add",
        callback: "haxClickInlineAdd",
        label: "Add answer",
      },
      {
        icon: "icons:remove",
        callback: "haxClickInlineRemove",
        label: "Remove answer",
      },
      {
        icon: "lrn:edit",
        callback: "haxToggleEdit",
        label: "Toggle editing feedback blocks",
      },
    ];
  }
  haxClickInlineAdd(e) {
    this.resetAnswer();
    let d = this.answers;
    d.push({ label: "New answer", correct: false });
    this.answers = [...d];
    return true;
  }
  haxClickInlineRemove(e) {
    if (this.answers.length > 0) {
      this.resetAnswer();
      let d = this.answers;
      d.pop();
      this.answers = [...d];
      return true;
    }
  }
}
globalThis.customElements.define(MultipleChoice.tag, MultipleChoice);
export { MultipleChoice };
