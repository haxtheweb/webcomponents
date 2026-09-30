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
      Read the sentance and type or select the answer at each input. Once you
      set all your answers you can press
      <strong>${this.t.checkAnswer}</strong> to test your answers. You will get
      feedback indicating correctness of your answer.
    </p>`;
  }

  static get styles() {
    return [
      super.styles,
      css`
        simple-fields-field {
          display: inline-block;
          margin-bottom: 0;
          vertical-align: middle;
        }
        simple-fields-field[type="textfield"],
        simple-fields-field[type="text"] {
          width: 140px;
          min-height: unset;
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
        }
        simple-fields-field[type="select"] {
          width: 140px;
          min-height: unset;
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
        }
        /* keep a label available to screen readers without breaking
           the inline sentence layout of the blanks */
        simple-fields-field::part(label) {
          position: absolute;
          width: 1px;
          height: 1px;
          margin: -1px;
          padding: 0;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `,
    ];
  }

  isCorrect() {
    let gotRight = true;
    this.numberCorrect = 0;
    this.numberGuessed = 0;
    for (var i in this.answers) {
      let input = this.shadowRoot.querySelector(`[data-answer-index="${i}"]`);
      if (
        typeof this.answers[i].answer === "object" &&
        input &&
        typeof input.value !== "undefined" &&
        input.value !== ""
      ) {
        this.numberGuessed++;
        for (var j in this.answers[i].answer) {
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
      for (var i in inputs) {
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
    for (var i in this.answers) {
      let input = this.shadowRoot.querySelector(`[data-answer-index="${i}"]`);
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
    for (var i in wordList) {
      // a blank is a token with a closing bracket; punctuation may trail
      // the bracket and malformed input may lack the opening bracket
      const blank = wordList[i].match(/^\[?([^\[\]]*)\]/);
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
            ${word.text.match(/^\[?[^\[\]]*\]/)
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

  refreshEvent(e) {
    this.requestUpdate();
  }

  renderFillInBlankField(word) {
    const blank = word.text.match(/^\[?([^\[\]]*)\](.*)$/);
    const index = this.answers.findIndex(
      (answer) => blank && answer.text === `[${blank[1]}]`,
    );
    if (index < 0) {
      return html`${word.text} `;
    }
    // punctuation that trailed the closing bracket renders after the field
    const trailing = blank[2] ? html`${blank[2]}` : html``;
    if (this.answers[index].possible) {
      let selectItems = [
        {
          text: "",
          value: "",
        },
        ...this.answers[index].possible.map((item) => {
          return {
            text: item,
            value: item,
          };
        }),
      ];
      return html`<simple-fields-field
          data-answer-index="${index}"
          label="Blank ${index + 1}"
          @value-changed="${this.refreshEvent}"
          type="select"
          .itemsList="${selectItems}"
          ?disabled="${this.showAnswer}"
          class="tag-option ${this.showAnswer
            ? this.answers[index].userGuessCorrect
              ? "correct"
              : "incorrect"
            : ""}"
        ></simple-fields-field
        >${trailing}`;
    } else {
      return html` <simple-fields-field
          type="text"
          label="Blank ${index + 1}"
          @value-changed="${this.refreshEvent}"
          data-answer-index="${index}"
          ?disabled="${this.showAnswer}"
          class="tag-option ${this.showAnswer
            ? this.answers[index].userGuessCorrect
              ? "correct"
              : "incorrect"
            : ""}"
        ></simple-fields-field
        >${trailing}`;
    }
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
