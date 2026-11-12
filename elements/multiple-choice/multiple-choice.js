/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html } from "lit";
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
  /**
   * xAPI statements this element sends (see scripts/generate-xapi-vocabulary.mjs)
   */
  static get xapiVocabulary() {
    return {
      tag: "multiple-choice",
      event: "user-engagement",
      verbs: ["answered"],
      objectType: "http://adlnet.gov/expapi/activities/cmi.interaction",
      interactionType: "choice",
      definition: [
        "name",
        "interactionType",
        "choices",
        "correctResponsesPattern",
      ],
      response: "ids of the selected choices joined by [,]",
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
  constructor() {
    super();
    this.t = {
      ...this.t,
      questionType: "Multiple choice",
      selectAllThatApply: "Select all that apply",
      selectTheAnswer: "Select the answer",
      multipleChoiceDirections:
        "{selection}, then press {checkAnswer}. You will get feedback indicating correctness of your answer and how to proceed.",
    };
    // QuestionElement's shared strings live in each question type's own namespace
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
  }

  // this manages the directions that are rendered and hard coded for the interaction
  renderDirections() {
    return html`<p>
      ${this._tParts(this.t.multipleChoiceDirections, {
        selection: html`<strong
          >${
            !this.singleOption
              ? this.t.selectAllThatApply
              : this.t.selectTheAnswer
          }</strong
        >`,
        checkAnswer: html`<strong>${this.t.checkAnswer}</strong>`,
      })}
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
        label: this.t.addAnswer,
      },
      {
        icon: "icons:remove",
        callback: "haxClickInlineRemove",
        label: this.t.removeAnswer,
      },
      {
        icon: "lrn:edit",
        callback: "haxToggleEdit",
        label: this.t.toggleEditingFeedbackBlocks,
      },
    ];
  }
  haxClickInlineAdd(_e) {
    this.resetAnswer();
    let d = this.answers;
    d.push({ label: "New answer", correct: false });
    this.answers = [...d];
    return true;
  }
  haxClickInlineRemove(_e) {
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
