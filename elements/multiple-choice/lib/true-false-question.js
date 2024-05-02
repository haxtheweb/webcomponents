import {  html } from "lit";
import "@lrnwebcomponents/simple-fields/lib/simple-fields-field.js";
import { QuestionElement } from "./QuestionElement.js";
/**
 * `true-false-question`
 * `Ask the user a question from a set of possible answers.`
 * @demo demo/index.html
 * @element true-false-question
 */
class TrueFalseQuestion extends QuestionElement {

  static get tag() {
    return "true-false-question";
  }
  constructor() {
    super();
    this.tfAnswer = null;
    this.singleOption = true;
    this.randomize = false;
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
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }

  static get properties() {
    return {
      ...super.properties,
      tfAnswer: { type: Boolean, }
    };
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('tfAnswer')) {
      // initial setting when answers updates just prior
      if (this.answers.length > 0 && this.tfAnswer === null) {
        let index = this.answers.findIndex((item) => item.correct === true );
        if (index === 0) {
          this.tfAnswer = true;
        }
        else if (index === 1) {
          this.tfAnswer = false;
        }
      }
      if (this.tfAnswer !== null) {
        console.log('ensure normalization');
        if (this.tfAnswer) {
          this.answers[0].correct = true;
          this.answers[1].correct = false;
        }
        else {
          this.answers[0].correct = false;
          this.answers[1].correct = true;
        }
      }
    }
  }

}
globalThis.customElements.define(TrueFalseQuestion.tag, TrueFalseQuestion);
export { TrueFalseQuestion };
