/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { QuestionElement } from "./QuestionElement.js";
import { html } from "lit";
import {
  fillInItem,
  fillInResponse,
  fillInText,
  XAPI_ITEM_DELIMITER,
} from "@haxtheweb/user-action/lib/xapi.js";
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
  /**
   * xAPI statements this element sends (see scripts/generate-xapi-vocabulary.mjs)
   */
  static get xapiVocabulary() {
    return {
      tag: "short-answer-question",
      event: "user-engagement",
      verbs: ["answered"],
      objectType: "http://adlnet.gov/expapi/activities/cmi.interaction",
      interactionType: "fill-in",
      definition: ["name", "interactionType", "correctResponsesPattern"],
      response: "the text the learner typed",
      result: [
        "success",
        "completion",
        "response",
        "score",
        "extensions.attempts",
        "extensions.max-attempts",
      ],
      countsTowardCompletion: true,
      done: "answered correctly or out of attempts",
    };
  }
  // xAPI fill-in: the response is what the learner typed (that is the
  // answer, so it is not a component id). Every authored option is an
  // accepted answer, compared without case, which is what a pattern without
  // {case_matters=true} means; options holding the "[,]" delimiter can not
  // be written as one item, so they are left out of the pattern.
  xapiDefinition() {
    const accepted = (this.answers || [])
      .map((a) => (a && typeof a.label === "string" ? a.label : ""))
      .filter((label) => label && !label.includes(XAPI_ITEM_DELIMITER));
    return accepted.length
      ? { correctResponsesPattern: accepted.map((l) => fillInItem(l)) }
      : {};
  }
  learnerResponse() {
    return typeof this.shortanswer === "string" && this.shortanswer
      ? fillInResponse([this.shortanswer])
      : "";
  }
  _canRestoreGuess() {
    return true;
  }
  restoreLearnerResponse(response) {
    if (typeof response !== "string" || !response) {
      return false;
    }
    this.shortanswer = fillInText(response);
    return true;
  }
  forgetLearnerResponse() {
    this.shortanswer = null;
  }
  constructor() {
    super();
    this.t = {
      ...this.t,
      questionType: "Short answer",
      shortAnswerDirections:
        "Type the answer you feel answers the question. When you are done, select {checkAnswer}. You will get feedback indicating correctness of your answer.",
      yourAnswer: "Your answer",
      typeYourAnswerHere: "Type your answer here..",
    };
    // QuestionElement's shared strings live in each question type's own namespace
    this.registerLocalization({
      context: this,
      localesPath: new URL("../locales/", import.meta.url).href,
    });
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
      ${this._tParts(this.t.shortAnswerDirections, {
        checkAnswer: html`<strong>${this.t.checkAnswer}</strong>`,
      })}
    </p>`;
  }

  renderInteraction() {
    return html`
      <simple-fields-field
        type="textarea"
        ?disabled="${this.disabled || this.showAnswer}"
        class="tag-option ${
          this.showAnswer ? (this.isCorrect() ? "correct" : "incorrect") : ""
        }"
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
        aria-label="${this.t.yourAnswer}"
        placeholder="${this.t.typeYourAnswerHere}"
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
    for (let i in this.displayedAnswers) {
      if (
        this.displayedAnswers[i] &&
        this.displayedAnswers[i].label &&
        this.displayedAnswers[i].label.toLowerCase() ===
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
