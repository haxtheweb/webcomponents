/**
 * Copyright 2024
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import { QuestionElement } from "@haxtheweb/multiple-choice/lib/QuestionElement.js";
import "@haxtheweb/d-d-d/d-d-d.js";

/**
 * `tagging-question`
 * `Answer question by applying related tags`
 * @demo demo/index.html
 * @element tagging-question
 */
class TaggingQuestion extends QuestionElement {
  static get tag() {
    return "tagging-question";
  }

  constructor() {
    super();
    this.t = {
      ...this.t,
      questionType: "Tagging",
      selectAllDirections:
        "Select all that apply. When you are done, press {checkAnswer}. You will get feedback indicating correctness of your answer and how to proceed.",
      numCorrectOutOfTotal: "{correct} out of {total} correct.",
      numCorrectOutOfTotalTooMany:
        "{correct} out of {total} correct, {warning}",
      tooManyOptionsPresent: "but too many options present!",
      answersSelected: "Answers selected",
      answersNotSelected: "Answers not selected",
      answersNotSelectedDescription:
        "Incorrectness implies it should have been selected. Correctness implies it was correctly {not} selected",
      not: "not",
      yourTags: "Your answer",
      availableTags: "Tags to choose from",
      dropTagsHere: "Choose tags below or drag them here",
    };
    // QuestionElement's shared strings live in each question type's own namespace
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
    this.guessDataValue = "selectedAnswers";
    this.dragEnter = false;
    this.dragEnterAnswer = false;
    this.dragging = false;
    this.selectedAnswers = [];
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
        .tag-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
          margin: var(--tagging-question-tag-container-margin, auto);
          padding: var(--ddd-spacing-5);
          height: var(--tagging-question-tag-container-height, auto);
          max-width: var(--tagging-question-tag-container-max-width, 600px);
          transition: height var(--ddd-duration-normal, 0.3s) ease;
        }

        .tag-option-container {
          width: var(--tagging-question-tag-option-container-width, 100%);
          border-radius: var(--ddd-radius-sm);
          box-sizing: border-box;
        }

        #user-choice-container {
          display: flex;
          transition: all var(--ddd-duration-normal, 0.3s) ease-in-out;
          flex-wrap: wrap;
          justify-content: center;
          overflow-y: auto;
          gap: var(--ddd-spacing-4);
          min-height: var(--ddd-spacing-18);
          margin-bottom: var(--ddd-spacing-5);
          padding: var(--ddd-spacing-5);
          border: var(--ddd-border-sm);
          border-radius: var(--ddd-radius-sm);
          box-sizing: border-box;
          background-color: var(--ddd-theme-default-coalyGray);
        }

        #possible-container {
          display: flex;
          padding: var(--ddd-spacing-3);
          border-radius: var(--ddd-radius-sm);
          border: var(--ddd-border-xs);
          flex-wrap: wrap;
          justify-content: center;
          gap: var(--ddd-spacing-4);
          min-height: var(--ddd-spacing-12);
        }

        :host([show-answer]) .tag-option {
          cursor: unset;
        }

        /* hover affordance on a defined token pair; the previous rule
           silently no-oped on an undefined token name */
        :host(:not([show-answer])) .tag-option:hover,
        :host(:not([show-answer])) .tag-option:focus {
          background-color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateGray)
          );
        }

        /* drag feedback stays visible on both schemes */
        :host([dragging]) #user-choice-container {
          border-style: dashed;
          border-color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateGray)
          );
        }
        :host([drag-enter-answer][dragging]) #user-choice-container {
          border-style: dashed;
          border-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          background-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-coalyGray)
          );
        }
        :host([drag-enter][dragging]) #possible-container {
          border-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          border-style: dashed;
          background-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-coalyGray)
          );
        }

        .tag-option {
          font-size: var(--ddd-font-size-s);
          height: auto;
          display: inline-block;
          font-family: var(--ddd-font-navigation);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          border: var(--ddd-border-sm);
          border-radius: var(--ddd-radius-sm);
          background-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-coalyGray)
          );
          cursor: pointer;
          user-select: none;
          transition: background-color var(--ddd-duration-normal, 0.3s) ease;
        }

        /* ---------- visitor shell: two compact labelled zones ---------- */
        .tag-zone-label {
          display: none;
        }
        .shell .tag-zone-label {
          display: block;
          margin-block: var(--ddd-spacing-2) var(--ddd-spacing-1);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        .shell .tag-zone-label:first-child {
          margin-top: 0;
        }
        :host(:lang(ar)) .shell .tag-zone-label,
        :host(:lang(fa)) .shell .tag-zone-label,
        :host(:lang(he)) .shell .tag-zone-label,
        :host(:lang(ur)) .shell .tag-zone-label {
          letter-spacing: 0;
        }
        .shell #user-choice-container,
        .shell #possible-container {
          justify-content: flex-start;
          gap: var(--ddd-spacing-2);
          min-height: var(--ddd-control-height-md);
          margin: 0;
          padding: var(--ddd-spacing-2);
          border: var(--ddd-border-xs);
          border-radius: var(--ddd-radius-sm);
          background-color: transparent;
          overflow: visible;
        }
        .shell #user-choice-container {
          border-style: dashed;
          border-color: var(--ddd-status-answered-signal);
          background-color: var(--ddd-status-answered-bg);
        }
        .shell #user-choice-container.empty::before {
          content: attr(data-empty-label);
          align-self: center;
          padding-inline: var(--ddd-spacing-1);
          font-size: var(--ddd-font-size-4xs);
          color: var(--ddd-status-disabled-ink);
        }
        .shell #possible-container {
          border-color: var(--ddd-status-default-signal);
        }
        .shell .tag-option {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          min-height: var(--ddd-control-height-sm);
          margin: 0;
          padding-block: 0;
          padding-inline: var(--ddd-spacing-3);
          border: var(--ddd-border-xs);
          border-color: var(--ddd-status-default-signal);
          border-radius: var(--ddd-radius-rounded);
          background-color: transparent;
          color: var(--ddd-status-default-ink);
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-4xs);
          outline: none;
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
        }
        .shell #user-choice-container .tag-option {
          border-color: var(--ddd-status-answered-signal);
          background-color: var(--ddd-status-answered-signal);
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        :host(:not([show-answer])) .shell .tag-option:hover,
        :host(:not([show-answer])) .shell .tag-option:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .shell #user-choice-container .tag-option.correct,
        .shell #user-choice-container .tag-option.incorrect {
          background-color: transparent;
          border-width: var(--ddd-border-size-sm);
          outline: none;
        }
        .shell #user-choice-container .tag-option.correct {
          border-style: var(--ddd-status-correct-line);
          border-color: var(--ddd-status-correct-signal);
          color: var(--ddd-status-correct-ink);
        }
        .shell #user-choice-container .tag-option.incorrect {
          border-style: var(--ddd-status-incorrect-line);
          border-color: var(--ddd-status-incorrect-signal);
          color: var(--ddd-status-incorrect-ink);
        }
        .shell .tag-option[disabled] {
          opacity: 1;
          cursor: default;
        }
        .tag-notes {
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-140);
          margin: var(--ddd-spacing-1) 0 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
        }
        .tag-note-label {
          display: inline-block;
          margin-inline-end: var(--ddd-spacing-2);
          padding-inline: var(--ddd-spacing-2);
          border: var(--ddd-border-xs);
          border-radius: var(--ddd-radius-rounded);
          font-weight: var(--ddd-font-weight-medium);
        }
        .tag-note-label.correct {
          border-style: var(--ddd-status-correct-line);
          border-color: var(--ddd-status-correct-signal);
          color: var(--ddd-status-correct-ink);
        }
        .tag-note-label.incorrect {
          border-style: var(--ddd-status-incorrect-line);
          border-color: var(--ddd-status-incorrect-signal);
          color: var(--ddd-status-incorrect-ink);
        }
        .tag-note-label.unselected {
          border-style: var(--ddd-status-disabled-line);
          border-color: var(--ddd-status-disabled-signal);
        }
      `,
    ];
  }

  // this manages the directions that are rendered and hard coded for the interaction
  renderDirections() {
    return html`<p>
      ${this._tParts(this.t.selectAllDirections, {
        checkAnswer: html`<strong>${this.t.checkAnswer}</strong>`,
      })}
    </p>`;
  }

  renderInteraction() {
    return html`<div class="tag-option-container">
      <div class="tag-zone-label" id="your-tags-label">${this.t.yourTags}</div>
      <div
        id="user-choice-container"
        class="${this.selectedAnswers.length ? "" : "empty"}"
        role="group"
        aria-labelledby="your-tags-label"
        data-empty-label="${this.t.dropTagsHere}"
        @drop="${this.handleDrop}"
        @dragover="${this.allowDropAnswer}"
      >
        ${this.selectedAnswers.map(
          (answer) => html`
            <button
              ?disabled="${this.disabled || this.showAnswer}"
              aria-pressed="true"
              class="tag-option ${this.showAnswer
                ? answer.correct
                  ? "correct"
                  : "incorrect"
                : ""}"
              draggable="${this.showAnswer ? "false" : "true"}"
              @dragstart="${this.handleDrag}"
              @dragend="${this.handleDragEnd}"
              @click="${() => this.handleTagClick(answer)}"
            >
              ${this.showAnswer
                ? html`<simple-icon-lite
                      icon="${answer.correct ? "icons:check" : "icons:close"}"
                      aria-hidden="true"
                    ></simple-icon-lite
                    ><span class="sr-only"
                      >${answer.correct ? this.t.correct : this.t.incorrect}:
                    </span>`
                : ""}${answer.label}
            </button>
          `,
        )}
      </div>
      <div class="tag-zone-label" id="available-tags-label">
        ${this.t.availableTags}
      </div>
      <div
        id="possible-container"
        role="group"
        aria-labelledby="available-tags-label"
        @drop="${this.handleDrop}"
        @dragover="${this.allowDrop}"
      >
        ${this.displayedAnswers.map(
          (tagOption) => html`
            <button
              ?disabled="${this.disabled || this.showAnswer}"
              aria-pressed="false"
              class="tag-option"
              draggable="${this.showAnswer ? "false" : "true"}"
              @dragstart="${this.handleDrag}"
              @dragend="${this.handleDragEnd}"
              @click="${() => this.handleTagClick(tagOption)}"
            >
              ${tagOption.label}
            </button>
          `,
        )}
      </div>
    </div>`;
  }

  isCorrect() {
    return (
      this.answers.filter((answer) => answer.correct).length ===
        this.selectedAnswers.filter((answer) => answer.correct).length &&
      this.selectedAnswers.filter((answer) => answer.correct).length ===
        this.selectedAnswers.length
    );
  }

  // tags carry their own correct / incorrect marks once checked and the
  // action bar says the overall result, so this panel only adds the
  // count, any per-tag feedback the author wrote, and the slots
  renderFeedback() {
    if (this.edit) {
      return this.renderEditModeFeedbackAreas();
    }
    if (!this.showAnswer) {
      return html``;
    }
    const correctTotal = this.answers.filter((answer) => answer.correct).length;
    const selectedCorrect = this.selectedAnswers.filter(
      (answer) => answer.correct,
    ).length;
    const tooMany =
      this.selectedAnswers.length > correctTotal &&
      this.selectedAnswers.length > selectedCorrect;
    const notes = [
      ...this.selectedAnswers
        .filter((answer) => answer.selectedFeedback)
        .map((answer) => ({
          label: answer.label,
          status: answer.correct ? "correct" : "incorrect",
          text: answer.selectedFeedback,
        })),
      ...this.displayedAnswers
        .filter((answer) => answer.unselectedFeedback)
        .map((answer) => ({
          label: answer.label,
          status: "unselected",
          text: answer.unselectedFeedback,
        })),
    ];
    const correct = this.isCorrect();
    return html`
      <p class="feedback">
        ${this._tParts(
          tooMany
            ? this.t.numCorrectOutOfTotalTooMany
            : this.t.numCorrectOutOfTotal,
          {
            correct: selectedCorrect,
            total: correctTotal,
            warning: html`<strong>${this.t.tooManyOptionsPresent}</strong>`,
          },
        )}
      </p>
      ${notes.length
        ? html`<ul class="tag-notes">
            ${notes.map(
              (note) =>
                html`<li>
                  <span class="tag-note-label ${note.status}"
                    >${note.status === "unselected"
                      ? html`<span class="sr-only"
                          >${this.t.answersNotSelected}:
                        </span>`
                      : html`<span class="sr-only"
                          >${note.status === "correct"
                            ? this.t.correct
                            : this.t.incorrect}:
                        </span>`}${note.label}</span
                  >
                  ${note.text}
                </li>`,
            )}
          </ul>`
        : ""}
      ${!correct &&
      this.querySelector &&
      this.querySelector('[slot="feedbackIncorrect"]')
        ? html`<slot
            name="feedbackIncorrect"
            property="oer:incorrectFeedback"
          ></slot>`
        : ``}
      ${correct &&
      this.querySelector &&
      this.querySelector('[slot="feedbackCorrect"]')
        ? html`<slot
            name="feedbackCorrect"
            property="oer:correctFeedback"
          ></slot>`
        : ``}
      ${!correct && this.querySelector && this.querySelector('[slot="hint"]')
        ? html`<h4>${this.t.needAHint}</h4>
            <div><slot name="hint"></slot></div>`
        : ``}
      ${correct && this.querySelector && this.querySelector('[slot="evidence"]')
        ? html`<h4>${this.t.evidence}</h4>
            <div><slot name="evidence"></slot></div>`
        : ``}
    `;
  }

  randomizeOptions(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  handleDrag(e) {
    const tagOption = e.target.textContent.trim();
    e.dataTransfer.setData("text/plain", tagOption);
    this.dragging = true;
  }

  handleDragEnd(e) {
    const tagOption = e.target.textContent.trim();
    e.dataTransfer.setData("text/plain", tagOption);
    this.dragging = false;
    this.dragEnter = false;
    this.dragEnterAnswer = false;
  }

  allowDrop(e) {
    e.preventDefault();
    this.dragEnter = true;
    this.dragEnterAnswer = false;
  }
  allowDropAnswer(e) {
    e.preventDefault();
    this.dragEnterAnswer = true;
    this.dragEnter = false;
  }

  handleDrop(e) {
    e.preventDefault();
    this.dragging = false;
    this.dragEnter = false;
    this.dragEnterAnswer = false;
    const text = e.dataTransfer.getData("text/plain");
    let tagOption = this.answers.find((answer) => answer.label === text);
    const isInOptionContainer = this.displayedAnswers.findIndex(
      (answer) => answer.label === text,
    );
    const isInUserChoiceContainer = this.selectedAnswers.findIndex(
      (answer) => answer.label === text,
    );

    if (
      isInOptionContainer !== -1 &&
      e.target &&
      e.target.getAttribute("id") !== "possible-container"
    ) {
      this.handleTagMove(tagOption, "possible-container");
    } else if (
      isInUserChoiceContainer !== -1 &&
      e.target &&
      e.target.getAttribute("id") !== "user-choice-container"
    ) {
      this.handleTagMove(tagOption, "user-choice-container");
    }
  }

  handleTagMove(tagOption, source) {
    if (source === "user-choice-container") {
      this.removeTag(tagOption);
    } else {
      this.addTag(tagOption);
    }
  }

  handleTagClick(targetTag) {
    if (
      this.selectedAnswers.filter((answer) => answer.label === targetTag.label)
        .length === 1
    ) {
      this.handleTagMove(targetTag, "user-choice-container");
    } else if (
      this.displayedAnswers.filter((answer) => answer.label === targetTag.label)
        .length === 1
    ) {
      this.handleTagMove(targetTag, "possible-container");
    }
  }

  addTag(targetTag) {
    if (!this.showAnswer) {
      this.selectedAnswers.push(targetTag);
      this.displayedAnswers = this.displayedAnswers.filter(
        (answer) => answer.label !== targetTag.label,
      );
      this.requestUpdate();
    }
  }

  removeTag(targetTag) {
    if (!this.showAnswer) {
      this.selectedAnswers = this.selectedAnswers.filter(
        (answer) => answer.label !== targetTag.label,
      );
      this.displayedAnswers.push(targetTag);
      this.requestUpdate();
    }
  }

  resetAnswer() {
    this.showAnswer = false;
    globalThis.dispatchEvent(
      new CustomEvent("simple-toast-hide", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: false,
      }),
    );
    if (this.isCorrect()) {
      this.displayedAnswers = [...this.answers];
      this.selectedAnswers = [];
      this.randomizeOptions(this.displayedAnswers);
    }
  }

  static get properties() {
    return {
      ...super.properties,
      dragging: { type: Boolean, reflect: true },
      dragEnter: { type: Boolean, reflect: true, attribute: "drag-enter" },
      dragEnterAnswer: {
        type: Boolean,
        reflect: true,
        attribute: "drag-enter-answer",
      },
      selectedAnswers: { type: Array },
    };
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(TaggingQuestion.tag, TaggingQuestion);
export { TaggingQuestion };
