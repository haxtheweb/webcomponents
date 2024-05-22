/**
 * Copyright 2024
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { MarkTheWords } from "@lrnwebcomponents/mark-the-words/mark-the-words.js";

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

  // this manages the directions that are rendered and hard coded for the interaction
  renderDirections() {
    return html`<p>Read the sentance and type or select the answer at each input. Once you set all your answers you can press <strong>${this.t.checkAnswer}</strong> to test your answers.
    You will get feedback just below here indicating correctness of your answer.
  </p>`;
  }
  

  static get styles() {
    return [super.styles, css`
    
    simple-fields-field {
      display: inline-block;
      margin-bottom: 0;
      vertical-align: middle;
    }
    simple-fields-field[type="textfield"] {
      width: 140px;
      padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
    }
    `];
  }

  isCorrect() {
    let gotRight = true;
    this.numberCorrect = 0;
    this.numberGuessed = 0;
    for (var i in this.answers) {
      let input = this.shadowRoot.querySelector(`[data-answer-index="${i}"]`);
      if (typeof this.answers[i].answer === "object" && input && typeof input.value !== "undefined" && input.value !== "") {
        this.numberGuessed++;
        for (var j in this.answers[i].answer) {
          if (input.value.toLowerCase().trim() === this.answers[i].answer[j].toLowerCase().trim()) {
            this.numberCorrect++;
          }
        }
      }
      else if (input &&  typeof input.value !== "undefined" && input.value !== "") {
        this.numberGuessed++;
        if (input.value.toLowerCase().trim() === this.answers[i].answer.toLowerCase().trim()) {
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
      let inputs = Array.from(this.shadowRoot.querySelectorAll('[data-answer-index]'));
      for (var i in inputs) {
        inputs[i].value = '';
        if (inputs[i].selectedIndex) {
          inputs[i].selectedIndex = 0;
        }
      }
    }
    super.resetAnswer(e);
  }

  rebuildWordList(statement) {
    this.answers = [];
    this.wordList = [];
    const wordList = statement.trim().split(/\s+/g);
    const answerList = wordList.filter(word => word.startsWith('[') && word.endsWith(']'));
    for (var i in answerList) {
      let answer = {
        text: answerList[i],
        correct: true // all answers are correct in this setup
      };
      let word = answerList[i].replace('[','').replace(']','');
      // implies we have synonyms
      if (word.split('~').length > 1) {
        answer.answer = word.split('~');
      }
      // implies we have multiple options, 1st option is the correct answer
      else {
        answer.answer = word.split('|')[0];
        answer.possible = word.split('|');
        // shuffle happens in place
        this.shuffleArray(answer.possible);
      }
      this.answers.push(answer);
    }
    for (var i in wordList) {
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
  }

  renderInteraction() {
    return html`<div class="text-wrap"><div class="text">
      ${this.wordList.map(word => html`
      ${word.text.startsWith('[') && word.text.endsWith(']') ? this.renderFillInBlankField(word) : html`${word.text} `}
      `)}
      </div></div>`;
  }

  shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // at random index
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  renderFillInBlankField(word) {
    const index = this.answers.findIndex(answer => word.text === answer.text);
    if (this.answers[index].possible) {
      let selectItems = [{
        text: "",
        value: "",
      }, ...this.answers[index].possible.map((item) => {
        return {
          text: item,
          value: item
        };
      })];
      return html`<simple-fields-field data-answer-index="${index}" type="select" .itemsList="${selectItems}"></simple-fields-field>`;
    }
    else {
      return html`
      <simple-fields-field type="textfield" data-answer-index="${index}"></simple-fields-field>`;
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
