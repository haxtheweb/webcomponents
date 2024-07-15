/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 * @demo demo/index.html
 */
// dependencies / things imported
import { html, css, nothing } from "lit";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import { QuestionElement } from "@haxtheweb/multiple-choice/lib/QuestionElement.js";

export class MarkTheWords extends QuestionElement {
  static get tag() {
    return "mark-the-words";
  }

  constructor() {
    super();
    this.guessDataValue = "displayedAnswers";
    this.displayedAnswers = [];
    this.wordList = [];
    this.question = "Mark the words that are correct";
    this.statement = "";
    this.numberCorrect = 0;
    this.numberGuessed = 0;
    this.isMarkTheWords = true;
  }

  getGuess() {
    return this.displayedAnswers.length > 0;
  }

  static get properties() {
    return {
      ...super.properties,
      wordList: { type: Array },
      statement: { type: String },
      missedAnswers: { type: Array },
      numberCorrect: { type: Number },
      numberGuessed: { type: Number },
    };
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    // THIS NEEDS A TRAP TO ONLY REACT TO ITSELF OR ELSE THINGS THAT DON'T HAVE ANSWERS INFINITE LOOP
    if (this.isMarkTheWords && this.shadowRoot && this.statement && (changedProperties.has("statement") || changedProperties.has('answers'))) {
      this.rebuildWordList(this.statement);
    }
  }

  rebuildWordList(statement) {
    this.wordList = [];
    const wordList = statement.trim().split(/\s+/g);
    for (var i in wordList) {
      let answerMatch = this.displayedAnswers.find(
        (answer) => answer.label && wordList[i].toLowerCase() === answer.label.toLowerCase(),
      );
      this.wordList.push({
        text: wordList[i],
        selected: false,
        correct: null,
        selectedFeedback: answerMatch ? answerMatch.selectedFeedback : null,
        unselectedFeedback: answerMatch ? answerMatch.unselectedFeedback : null,
      });
    }
    this.requestUpdate();
  }

  // CSS - specific to Lit
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        button.selected,
        button.selected:focus,
        button.selected:hover {
          outline: 2px solid
            light-dark(
              var(
                --lowContrast-override,
                var(--ddd-theme-primary, var(--ddd-theme-default-nittanyNavy))
              ),
              var(--ddd-theme-default-link)
            );
        }
        button:focus,
        button:hover {
          outline: 1px solid
            light-dark(
              var(
                --lowContrast-override,
                var(--ddd-theme-primary, var(--ddd-theme-default-nittanyNavy))
              ),
              var(--ddd-theme-default-link)
            );
        }

        button {
          outline: none;
          border: none;
          margin: 0 4px;
          padding: 0 4px;
        }

        .text {
          margin: var(--ddd-spacing-4);
          padding: var(--ddd-spacing-4);
          border: var(--ddd-border-sm);
          line-height: 2.2;
        }

        @media (max-width: 600px) {
          .text {
            margin: var(--ddd-spacing-1);
            padding: var(--ddd-spacing-1);
          }
        }

        .tag-option {
          font-size: var(--ddd-font-size-s);
          height: auto;
          display: inline-block;
          font-family: var(--ddd-font-navigation);
          border-radius: var(--ddd-radius-md);
          background-color: var(--simple-colors-default-theme-grey-2);
          margin: 0;
          cursor: pointer;
          user-select: none;
          transition: background-color 0.3s ease;
        }

        :host([show-answer]) .tag-option {
          cursor: unset;
          pointer-events: none;
        }

        :host(:not([show-answer])) .tag-option:hover,
        :host(:not([show-answer])) .tag-option:focus {
          background-color: var(--simple-colors-default-theme-grey-3);
        }
      `,
    ];
  }

  selectWord(e) {
    let i = this.wordList.findIndex((word) => e.target.innerText === word.text);
    this.wordList[i].selected = !this.wordList[i].selected;
    this.requestUpdate();
  }

  isCorrect() {
    this.numberGuessed = 0;
    this.numberCorrect = 0;
    let gotRight = true;

    for (var i in this.wordList) {
      for (var j in this.displayedAnswers) {
        if (
          this.wordList[i].selected &&
          this.displayedAnswers[j].correct &&
          this.displayedAnswers[j].label.toLowerCase() ===
            this.wordList[i].text.toLowerCase()
        ) {
          this.wordList[i].correct = true;
          this.numberCorrect++;
        }
      }
      // we selected something
      if (this.wordList[i].selected) {
        // it wasn't correct though
        if (!this.wordList[i].correct) {
          gotRight = false;
        }
        this.numberGuessed++;
      }
    }
    if (gotRight && this.numberCorrect !== this.numberGuessed) {
      gotRight = false;
    }
    if (
      this.numberCorrect !==
      this.displayedAnswers.filter((answer) => answer.correct).length
    ) {
      gotRight = false;
    }
    return gotRight;
    // evaluate all the wordList selected vs if they are the correct answer
  }

  /**
   * Reset user answers and shuffle the board again.
   */
  resetAnswer(e) {
    if (this.isCorrect()) {
      this.wordList = [];
      this.rebuildWordList(this.statement);
    }
    super.resetAnswer(e);
  }
  // overload so we can process wordList for this
  // major thing this provides is disabling answer checking until we've made a selection
  guessCount() {
    return this.wordList.filter(word => word.selected).length;
  }
  renderInteraction() {
    return html`<div class="text-wrap">
      <div class="text">
        ${this.wordList.map(
          (word) => html`
            <button
              ?disabled="${this.showAnswer}"
              class="tag-option ${word.selected ? "selected" : ""} ${this
                .showAnswer && word.selected
                ? word.correct
                  ? "correct"
                  : "incorrect"
                : ""}"
              @click="${this.selectWord}"
            >
              ${word.text}
            </button>
          `,
        )}
      </div>
    </div>`;
  }

  // this manages the directions that are rendered and hard coded for the interaction
  renderDirections() {
    return html`<p>
      <strong>Select all</strong> the words that apply. Then press
      <strong>${this.t.checkAnswer}</strong> to test your answers. You will get
      feedback indicating correctness of your answer.
    </p>`;
  }

  // this manages the output of the feedback area
  renderFeedback() {
    return html`
    ${!this.edit ? html`
      ${this.showAnswer
        ? html` <p class="feedback">
              ${this.t.numCorrectLeft}
              ${this.numberCorrect} out of ${this.displayedAnswers.filter(
                (answer) => answer.correct,
              ).length}
              ${this.t.numCorrectRight} (${this.numberGuessed} guessed)
            </p>
            ${this.wordList.filter((word) => word.selected).length > 0
              ? html`
                  <h4>Words selected feedback</h4>
                  <dl>
                    ${this.wordList
                      .filter((word) => word.selected)
                      .map(
                        (answer) => html`
                          <dt
                            class="${answer.correct ? "correct" : "incorrect"}"
                          >
                            ${answer.text}
                          </dt>
                          <dd>${answer.selectedFeedback}</dd>
                        `,
                      )}
                  </dl>
                `
              : nothing}
            ${this.wordList.filter(
              (word) => !word.selected && word.unselectedFeedback,
            ).length > 0
              ? html`
                  <h4>Words not selected feedback</h4>
                  <dl>
                    ${this.wordList
                      .filter(
                        (word) => !word.selected && word.unselectedFeedback,
                      )
                      .map(
                        (answer) => html`
                          <dd>${answer.unselectedFeedback}</dd>
                        `,
                      )}
                  </dl>
                `
              : nothing}
            ${this.querySelector('[slot="feedbackIncorrect"]')
              ? html`<slot name="feedbackIncorrect"></slot>`
              : ``}`
        : ``}
      ${this.showAnswer &&
      this.numberCorrect ===
        this.displayedAnswers.filter((answer) => answer.correct).length
        ? html` <p class="feedback">${this.correctText}</p>
            ${this.querySelector('[slot="feedbackCorrect"]')
              ? html`<slot name="feedbackCorrect"></slot>`
              : ``}`
        : ``}
      ${this.querySelector('[slot="hint"]') &&
      this.showAnswer &&
      this.numberCorrect !==
        this.displayedAnswers.filter((answer) => answer.correct).length
        ? html`
            <h4>Need a hint?</h4>
            <div>
              <slot name="hint"></slot>
            </div>
          `
        : ``}
      ${this.querySelector('[slot="evidence"]') &&
      this.showAnswer &&
      this.numberCorrect ===
        this.displayedAnswers.filter((answer) => answer.correct).length
        ? html`
            <h4>Evidence</h4>
            <div>
              <slot name="evidence"></slot>
            </div>
          `
        : ``}
      <simple-toolbar-button
        ?disabled="${this.disabled || !this.showAnswer}"
        @click="${this.resetAnswer}"
        label="${this.t.tryAgain}"
      >
      </simple-toolbar-button>
    ` : this.renderEditModeFeedbackAreas()}`;
  }

  // HAX specific callback
  // This teaches HAX how to edit and work with your web component
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

customElements.define(MarkTheWords.tag, MarkTheWords);
