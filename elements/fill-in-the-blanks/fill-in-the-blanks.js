/**
 * Copyright 2024
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { MarkTheWords } from "@haxtheweb/mark-the-words/mark-the-words.js";

/**
 * `fill-in-the-blanks`
 * `Fill in the blanks question`
 * @demo demo/index.html
 * @element fill-in-the-blanks
 */
class FillInTheBlanks extends MarkTheWords {
  /**
   * Convention we use
   */
  static get tag() {
    return "fill-in-the-blanks";
  }
  /**
   * xAPI statements this element sends (see scripts/generate-xapi-vocabulary.mjs)
   */
  static get xapiVocabulary() {
    return {
      tag: "fill-in-the-blanks",
      event: "user-engagement",
      verbs: ["answered"],
      objectType: "http://adlnet.gov/expapi/activities/cmi.interaction",
      interactionType: "fill-in",
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
  // what the learner typed in each blank, in order
  learnerResponse() {
    return (this.answers || [])
      .map((_a, i) => {
        const input =
          this.shadowRoot &&
          this.shadowRoot.querySelector(`[data-answer-index="${i}"]`);
        return input && input.value != null ? String(input.value) : "";
      })
      .join("[,]");
  }
  learnerScore() {
    return {
      raw: this.numberCorrect || 0,
      max: (this.answers || []).length || 1,
    };
  }

  static get properties() {
    return {
      ...super.properties,
      // reflect locally (not in shared base classes) so authored
      // values serialize back to the DOM for this element
      question: { type: String, reflect: true },
      statement: { type: String, reflect: true },
    };
  }

  // this manages the directions that are rendered and hard coded for the interaction
  renderDirections() {
    return html`<p>
      ${this._tParts(this.t.fillInTheBlanksDirections, {
        checkAnswer: html`<strong>${this.t.checkAnswer}</strong>`,
      })}
    </p>`;
  }

  static get styles() {
    return [
      super.styles,
      css`
        /* blanks sit inside the sentence as native controls so form-field
           chrome (labels, field rows, helper text) can never break the line */
        .text {
          line-height: 2.3;
        }
        .shell .text {
          font-size: var(--ddd-theme-body-font-size);
        }
        .blank {
          display: inline-flex;
          align-items: baseline;
          gap: var(--ddd-spacing-1);
          white-space: nowrap;
        }
        .blank-number {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
          align-self: flex-start;
          line-height: 1;
        }
        .blank input,
        .blank select {
          font: inherit;
          font-weight: var(--ddd-font-weight-medium);
          color: var(--ddd-status-answered-ink);
          height: var(--ddd-control-height-xs);
          padding-block: 0;
          padding-inline: var(--ddd-spacing-2);
          margin: 0;
          box-sizing: border-box;
          vertical-align: baseline;
        }
        .blank input {
          width: var(--fill-in-the-blanks-input-width, 9ch);
          min-width: 6ch;
          border: none;
          border-bottom: var(--ddd-border-sm);
          border-style: var(--ddd-status-default-line);
          border-color: var(--ddd-theme-default-limestoneGray);
          border-radius: var(--ddd-radius-xs) var(--ddd-radius-xs) 0 0;
          background-color: var(--ddd-status-answered-bg);
        }
        .blank input:not(:placeholder-shown),
        .blank input.filled {
          border-color: var(--ddd-status-answered-signal);
        }
        .blank select {
          max-width: 100%;
          border: var(--ddd-border-xs);
          border-color: var(--ddd-theme-default-limestoneGray);
          border-radius: var(--ddd-radius-rounded);
          background-color: var(--ddd-status-default-bg);
        }
        .blank input:focus-visible,
        .blank select:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .blank.correct input,
        .blank.correct select {
          border-width: var(--ddd-border-size-sm);
          border-style: var(--ddd-status-correct-line);
          border-color: var(--ddd-status-correct-signal);
          color: var(--ddd-status-correct-ink);
          opacity: 1;
        }
        .blank.incorrect input,
        .blank.incorrect select {
          border-width: var(--ddd-border-size-sm);
          border-style: var(--ddd-status-incorrect-line);
          border-color: var(--ddd-status-incorrect-signal);
          color: var(--ddd-status-incorrect-ink);
          opacity: 1;
        }
        .blank .option-status {
          margin-inline-start: 0;
        }
      `,
    ];
  }

  isCorrect() {
    let gotRight = true;
    this.numberCorrect = 0;
    this.numberGuessed = 0;
    for (let i in this.answers) {
      let input =
        this.shadowRoot &&
        this.shadowRoot.querySelector(`[data-answer-index="${i}"]`);
      if (
        typeof this.answers[i].answer === "object" &&
        input &&
        typeof input.value !== "undefined" &&
        input.value !== ""
      ) {
        this.numberGuessed++;
        for (let j in this.answers[i].answer) {
          if (
            input.value.toLowerCase().trim() ===
            this.answers[i].answer[j].toLowerCase().trim()
          ) {
            this.answers[i].userGuessCorrect = true;
            this.numberCorrect++;
          }
        }
      } else if (
        input &&
        typeof input.value !== "undefined" &&
        input.value !== ""
      ) {
        this.numberGuessed++;
        if (
          input.value.toLowerCase().trim() ===
          this.answers[i].answer.toLowerCase().trim()
        ) {
          this.answers[i].userGuessCorrect = true;
          this.numberCorrect++;
        }
      }
    }
    if (this.numberCorrect !== this.answers.length) {
      gotRight = false;
    }
    return gotRight;
  }

  /**
   * Reset user answers and shuffle the board again.
   */
  resetAnswer(e) {
    if (this.isCorrect()) {
      this.rebuildWordList(this.statement);
      let inputs = Array.from(
        this.shadowRoot.querySelectorAll("[data-answer-index]"),
      );
      for (let i in inputs) {
        inputs[i].value = "";
        this.answers[i].userGuessCorrect = false;
        if (inputs[i].selectedIndex) {
          inputs[i].selectedIndex = 0;
        }
      }
    }
    super.resetAnswer(e);
  }

  // overload so we can process wordList for this
  // major thing this provides is disabling answer checking until we've made a selection
  guessCount() {
    let counter = 0;
    for (let i in this.answers) {
      let input =
        this.shadowRoot &&
        this.shadowRoot.querySelector(`[data-answer-index="${i}"]`);
      if (input && input.value) {
        counter++;
      }
    }
    return counter;
  }

  rebuildWordList(statement) {
    this.answers = [];
    this.wordList = [];
    const wordList = statement.trim().split(/\s+/g);
    for (let i in wordList) {
      // a blank is a token with a closing bracket; punctuation may trail
      // the bracket and malformed input may lack the opening bracket
      const blank = wordList[i].match(/^\[?([^[\]]*)\]/);
      if (blank) {
        let answer = {
          text: `[${blank[1]}]`,
          userGuessCorrect: false,
          correct: true, // always is true on this prop bc of mark the words, we use userGuess to eval correctness
        };
        let word = blank[1];
        // implies we have synonyms
        if (word.split("~").length > 1) {
          answer.answer = word.split("~");
        }
        // implies we have multiple options, 1st option is the correct answer
        else {
          // support single answer
          if (word.split("|").length > 1) {
            answer.answer = word.split("|")[0];
            answer.possible = word.split("|");
            // shuffle happens in place
            this.shuffleArray(answer.possible);
          } else {
            answer.answer = word;
          }
        }
        this.answers.push(answer);
      }
      this.wordList.push({
        text: wordList[i],
      });
    }
    this.requestUpdate();
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    // the localization was registered by MarkTheWords' constructor (namespace
    // = this tag), so merge these defaults into its fallback copy as well
    const fillInTheBlanksT = {
      questionType: "Fill in the blanks",
      fillInTheBlanksDirections:
        "Read the sentance and type or select the answer at each input. Once you set all your answers you can press {checkAnswer} to test your answers. You will get feedback indicating correctness of your answer.",
      blankNumber: "Blank {number}",
    };
    this.t = { ...this.t, ...fillInTheBlanksT };
    if (this._t) {
      this._t = { ...this._t, ...fillInTheBlanksT };
    }
    this.question = "Fill in the blanks";
    this.isMarkTheWords = false;
  }

  willUpdate(changedProperties) {
    super.willUpdate(changedProperties);
    // THIS NEEDS TO NOT REACT TO ANSWERS AS ANSWERS ARE BUILT FROM STATEMENTS
    // build the wordList/answers before rendering so the blank fields are
    // part of the same update pass as the statement change (avoids a second
    // render pass where fields briefly do not exist)
    if (this.statement && changedProperties.has("statement")) {
      this.rebuildWordList(this.statement);
    }
  }

  /**
   * Answers here are derived from the statement via rebuildWordList, not
   * authored like multiple choice options. Skip the base class normalization
   * which injects multiple choice keys and force resets showAnswer every
   * time answers change.
   */
  cleanAnswerData(answers) {
    return answers;
  }

  /**
   * The base class reads answers from slot-less <input> children on first
   * paint. This element never authors answers that way (they come from the
   * statement) and its light dom children are feedback/hint/evidence slots,
   * so the base scan would wipe the generated answers to an empty array.
   */
  loadLightDomData() {}

  renderInteraction() {
    return html`<div class="text-wrap">
      <div class="text">
        ${this.wordList.map(
          (word) => html`
            ${word.text.match(/^\[?[^[\]]*\]/)
              ? this.renderFillInBlankField(word)
              : html`${word.text} `}
          `,
        )}
      </div>
    </div>`;
  }

  shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // at random index
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  refreshEvent(_e) {
    this.requestUpdate();
  }

  renderFillInBlankField(word) {
    const blank = word.text.match(/^\[?([^[\]]*)\](.*)$/);
    const index = this.answers.findIndex(
      (answer) => blank && answer.text === `[${blank[1]}]`,
    );
    if (index < 0) {
      return html`${word.text} `;
    }
    // punctuation that trailed the closing bracket renders after the field
    const trailing = blank[2] ? html`${blank[2]}` : html``;
    const label = this.t.blankNumber.replace("{number}", () => index + 1);
    const status = this.showAnswer
      ? this.answers[index].userGuessCorrect
        ? "correct"
        : "incorrect"
      : "";
    const answer = this.answers[index];
    let control;
    if (answer.possible) {
      control = html`<select
        data-answer-index="${index}"
        aria-label="${label}"
        aria-invalid="${status === "incorrect" ? "true" : "false"}"
        class="${status}"
        ?disabled="${this.showAnswer}"
        @change="${this.refreshEvent}"
      >
        <option value=""></option>
        ${answer.possible.map(
          (item) => html`<option value="${item}">${item}</option>`,
        )}
      </select>`;
    } else {
      // size the blank to its longest accepted answer
      const longest = []
        .concat(answer.answer || "")
        .reduce((max, item) => Math.max(max, String(item).length), 0);
      control = html`<input
        type="text"
        data-answer-index="${index}"
        aria-label="${label}"
        aria-invalid="${status === "incorrect" ? "true" : "false"}"
        class="${status}"
        placeholder=" "
        autocomplete="off"
        spellcheck="false"
        style="--fill-in-the-blanks-input-width: ${Math.max(longest + 3, 6)}ch"
        ?disabled="${this.showAnswer}"
        @input="${this.refreshEvent}"
      />`;
    }
    return html`<span class="blank ${status}"
        ><span class="blank-number" aria-hidden="true">${index + 1}</span
        >${control}${status
          ? this.renderOptionStatus(status === "correct")
          : ""}</span
      >${trailing} `;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}
globalThis.customElements.define(FillInTheBlanks.tag, FillInTheBlanks);
export { FillInTheBlanks };
