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
    this._tfanswer = null;
    // force this to true and use can't set
    this.singleOption = true;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }

  static get properties() {
    return {
      ...super.properties,
      _tfanswer: { type: String }, // string bc of data binding on frontend
    };
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    // internal flag so we can bridge hax setting for end user easily
    if (changedProperties.has("_tfanswer")) {
      // initial setting when answers updates just prior
      if (this.answers.length > 0 && this._tfanswer === null) {
        let index = this.answers.findIndex((item) => item.correct === true);
        if (index === 0) {
          this._tfanswer = "true";
        } else if (index === 1) {
          this._tfanswer = "false";
        }
      }
      if (this._tfanswer !== null) {
        if (this._tfanswer === "true") {
          this.answers[0].correct = true;
          this.answers[1].correct = false;
        } else if (this._tfanswer === "false") {
          this.answers[0].correct = false;
          this.answers[1].correct = true;
        }
      }
    }
  }
}
globalThis.customElements.define(TrueFalseQuestion.tag, TrueFalseQuestion);
export { TrueFalseQuestion };
