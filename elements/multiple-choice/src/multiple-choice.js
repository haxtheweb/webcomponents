import { LitElement, html, css } from "lit";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import { DDDSuper } from "@lrnwebcomponents/d-d-d/d-d-d.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-fields/lib/simple-fields-field.js";
import "@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-button.js";
import "@lrnwebcomponents/simple-toast/simple-toast.js";
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
  render() {
    return html`
      <confetti-container id="confetti">
        <meta property="oer:assessing" content="${this.relatedResource}" />
        <h3 property="oer:name">${this.question}</h3>
          <fieldset id="answers">
            ${this.displayedAnswers.map(
              (answer, index) => html`
                <simple-fields-field
                  type="${this.singleOption ? "radio" : "checkbox"}"
                  ?disabled="${this.disabled}"
                  property="oer:answer"
                  name="${index}"
                  @mousedown="${this.clickSingle}"
                  @keydown="${this.clickSingle}"
                  .value="${answer ? answer.userGuess : ""}"
                  @value-changed="${this.checkedEvent}"
                  label="${answer && answer.label ? answer.label : ""}"
                ></simple-fields-field>
              `,
            )}
          </fieldset>
        ${!this.hideButtons
          ? html`
              <div id="buttons">
                <simple-toolbar-button
                  id="check"
                  ?disabled="${this.disabled}"
                  @click="${this._verifyAnswers}"
                  label="${this.checkLabel}"
                >
                </simple-toolbar-button>
                <simple-toolbar-button
                  id="reset"
                  ?disabled="${this.disabled}"
                  @click="${this.resetAnswers}"
                  label="${this.resetLabel}"
                >
                </simple-toolbar-button>
              </div>
            `
          : ``}
      </confetti-container>
    `;
  }
  clickSingle(e) {  
    // single option shortcut only bc we have to wipe all others
    if (this.singleOption) {
      let proceed = false;
      // ensure if it's a keyboard it was enter or space
      if (e.key) {
        if (e.key === " " || e.key === "Enter") {
          proceed = true;
        }
        else if (e.key === "ArrowUp") {
          e.preventDefault();
          if (e.target.previousElementSibling) {
            e.target.previousElementSibling.focus();
          }
          else {
            e.target.parentNode.lastElementChild.focus();
          }
        }
        else if (e.key === "ArrowDown") {
          e.preventDefault();
          if (e.target.nextElementSibling) {
            e.target.nextElementSibling.focus();
          }
          else {
            e.target.parentNode.firstElementChild.focus();
          }
        }
      }
      // if click then we process regardless
      else {
        proceed = true;
      }
      // wipe answer data, THEN update will happen later when all the values change
      if (proceed) {
        for (let i in this.displayedAnswers) {
          if (i === e.target.name) {
            if (e.key) {
              if (this.displayedAnswers[i].userGuess) {
                this.displayedAnswers[i].userGuess = "";
              }
              else {
                this.displayedAnswers[i].userGuess = true;
              }
            }
          }
          else {
            this.displayedAnswers[i].userGuess = (i === e.target.name) ? true : "";
          }
        }
      }
    }
    else {
      if (e.key) {
        if (e.key === "ArrowUp") {
          e.preventDefault();
          if (e.target.previousElementSibling) {
            e.target.previousElementSibling.focus();
          }
          else {
            e.target.parentNode.lastElementChild.focus();
          }
        }
        else if (e.key === "ArrowDown") {
          e.preventDefault();
          if (e.target.nextElementSibling) {
            e.target.nextElementSibling.focus();
          }
          else {
            e.target.parentNode.firstElementChild.focus();
          }
        }
        else if (e.key === "Enter") {
          this.displayedAnswers[e.target.name].userGuess = (this.displayedAnswers[e.target.name].userGuess) ? "" : true;
        }
      }
    }
    this.requestUpdate();
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      ...super.haxHooks,
      inlineContextMenu: "haxinlineContextMenu",
    };
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
    ];
  }
  haxClickInlineAdd(e) {
    this.resetAnswers();
    let d = this.answers;
    d.push({ label: "New answer", correct: false });
    this.answers = [...d];
    return true;
  }
  haxClickInlineRemove(e) {
    if (this.answers.length > 0) {
      this.resetAnswers();
      let d = this.answers;
      d.pop();
      this.answers = [...d];
      return true;
    }
  }
}
globalThis.customElements.define(MultipleChoice.tag, MultipleChoice);
export { MultipleChoice };
