/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
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
  /**
   * xAPI statements this element sends (see scripts/generate-xapi-vocabulary.mjs)
   */
  static get xapiVocabulary() {
    return {
      tag: "true-false-question",
      event: "user-engagement",
      verbs: ["answered"],
      objectType: "http://adlnet.gov/expapi/activities/cmi.interaction",
      interactionType: "true-false",
      definition: ["name", "interactionType", "correctResponsesPattern"],
      response: "true or false",
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
  // xAPI true-false: the first authored option is "true", the second "false"
  // (the same convention _tfanswer uses); response and pattern are the spec
  // literals, so there are no components
  _xapiLiteral(option) {
    const order =
      option && typeof option.order === "number"
        ? option.order
        : (this.answers || []).findIndex(
            (a) => a && option && a.label === option.label,
          );
    return order === 0 ? "true" : order === 1 ? "false" : "";
  }
  xapiDefinition() {
    const correct = (this.answers || []).find((a) => a && a.correct === true);
    const literal = this._xapiLiteral(correct);
    return literal ? { correctResponsesPattern: [literal] } : {};
  }
  learnerResponse() {
    const guess = this.getGuess();
    return Array.isArray(guess) && guess.length === 1
      ? this._xapiLiteral(guess[0])
      : "";
  }
  // "true" / "false" (an older saved label still works)
  restoreLearnerResponse(response) {
    if (response !== "true" && response !== "false") {
      return super.restoreLearnerResponse(response);
    }
    let matched = 0;
    (this.displayedAnswers || []).forEach((a) => {
      const pick = this._xapiLiteral(a) === response;
      a.userGuess = pick ? true : "";
      if (pick) {
        matched++;
      }
    });
    return matched > 0;
  }
  constructor() {
    super();
    this.t = {
      ...this.t,
      questionType: "True or false",
    };
    // QuestionElement's shared strings live in each question type's own namespace
    this.registerLocalization({
      context: this,
      localesPath: new URL("../locales/", import.meta.url).href,
    });
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

  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    // internal flag so we can bridge hax setting for end user easily
    if (changedProperties.has("_tfanswer")) {
      // initial setting when answers updates just prior
      // derive in willUpdate so the reactive _tfanswer set batches into
      // this update instead of scheduling a second one from inside
      // updated (Lit change-in-update warning)
      if (this.answers.length > 0 && this._tfanswer === null) {
        let index = this.answers.findIndex((item) => item.correct === true);
        if (index === 0) {
          this._tfanswer = "true";
        } else if (index === 1) {
          this._tfanswer = "false";
        }
      }
    }
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    // in-place array mutations do not schedule updates so they stay in updated
    if (changedProperties.has("_tfanswer")) {
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
