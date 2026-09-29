import { QuestionElement } from "./QuestionElement.js";
import { html } from "lit";
/**
 * `short-answer-question`
 * `Ask the user a question from a set of possible answers.`
 * @demo demo/index.html
 * @element short-answer-question
 */
class ShortAnswerQuestion extends QuestionElement {
  static get tag() {
    return "short-answer-question";
  }
  constructor() {
    super();
    this.guessDataValue = "shortanswer";
    this.shortanswer = null;
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
      shortanswer: { type: String },
    };
  }

  inactiveCase() {
    return this.shortanswer;
  }

  renderDirections() {
    return html`<p>
      Type the answer you feel answers the question. When you are done, select
      <strong>${this.t.checkAnswer}</strong>. You will get feedback indicating
      correctness of your answer.
    </p>`;
  }

  renderInteraction() {
    return html`
      <simple-fields-field
        type="textarea"
        ?disabled="${this.disabled || this.showAnswer}"
        class="tag-option ${this.showAnswer
          ? this.isCorrect()
            ? "correct"
            : "incorrect"
          : ""}"
        property="oer:answer"
        name="0"
        @keydown="${(e) => {
          // only check once an answer exists; Enter in the empty textarea
          // would otherwise evaluate a null answer and throw
          if (e.key === "Enter" && this.shortanswer) {
            this.checkAnswer(e);
          }
        }}"
        @value-changed="${this.valueUpdate}"
        .value="${this.shortanswer}"
        aria-label="Your answer"
        placeholder="Type your answer here.."
      ></simple-fields-field>
    `;
  }

  resetAnswer(e) {
    // if we got it right, reset the whole interaction in case they want to take it again
    if (this.isCorrect()) {
      this.shortanswer = null;
    }

    super.resetAnswer(e);
    setTimeout(() => {
      this.shadowRoot.querySelector('simple-fields-field[name="0"]').focus();
      this.shadowRoot.querySelector('simple-fields-field[name="0"]').select();
    }, 0);
  }

  valueUpdate(e) {
    this.shortanswer = e.detail.value;
  }

  /**
   * Return if the current answers are correct
   */
  isCorrect() {
    // a null / empty / non-string answer can never be correct, and must not throw
    if (!this.shortanswer || typeof this.shortanswer !== "string") {
      return false;
    }
    for (var i in this.displayedAnswers) {
      if (
        this.displayedAnswers[i] &&
        this.displayedAnswers[i].label &&
        this.displayedAnswers[i].label.toLowerCase() ==
          this.shortanswer.toLowerCase()
      ) {
        return true;
      }
    }
    return false;
  }
}
globalThis.customElements.define(ShortAnswerQuestion.tag, ShortAnswerQuestion);
export { ShortAnswerQuestion };
