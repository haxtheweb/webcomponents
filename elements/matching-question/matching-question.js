/**
 * Copyright 2024
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { QuestionElement } from "@lrnwebcomponents/multiple-choice/lib/QuestionElement.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";

/**
 * `matching-question`
 * `Match concepts question type`
 * @demo demo/index.html
 * @element matching-question
 */
class MatchingQuestion extends QuestionElement {
  /**
   * Convention we use
   */
  static get tag() {
    return "matching-question";
  }

  static get styles() {
    return [
      super.styles,
      css`

      :host {
        display: block;
      }

      simple-icon-button-lite {
        right: 0;
        top: 0;
        display: block;
        position: absolute;
        padding: var(--ddd-spacing-2);
      }
      label {
        margin-top: var(--ddd-spacing-6);
        margin-bottom: var(--ddd-spacing-4);
        display: block;
      }
      
      #target-container {
        transition: all .3s ease-in-out;
        justify-content: center;
        overflow-y: auto;
        background-color: light-dark(var(--simple-colors-default-theme-grey-2),var(--simple-colors-default-theme-grey-10));
      }

      .target {
        height: 100px;
        padding: 4px;
      }
      .match {
        min-height: 100px;
        padding: 4px;
      }

      .tag-option {
        margin: 4px;
      }

      #matches-container {
        transition: all .3s ease-in-out;
        justify-content: center;
        overflow-y: auto;
        background-color: light-dark(var(--simple-colors-default-theme-grey-2),var(--simple-colors-default-theme-grey-10));
      }

      #possible-container {
        display: flex;
        justify-content: start;
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

      :host(:not([show-answer])) .tag-option:hover, :host(:not([show-answer])) .tag-option:focus {
        background-color: var(--simple-colors-default-theme-grey-3);
      }

      .tag-option.correct {
        outline: 4px solid var(--ddd-theme-default-opportunityGreen);
      }

      .tag-option.incorrect {
        outline: 4px solid var(--ddd-theme-default-original87Pink);
      }

      :host([show-answer]) .tag-option {
        cursor: unset;
      }

      :host([dragging]) #user-choice-container {
        border-style: dashed;
        border-color: gray;
      }
      :host([drag-enter-matches][dragging]) #matches-container {
        border-style: dashed;
        border-color: black;
        background-color: light-dark(var(--simple-colors-default-theme-grey-3),var(--simple-colors-default-theme-grey-9));
      }
      :host([drag-enter-target][dragging]) #target-container {
        border-style: dashed;
        border-color: black;
        background-color: light-dark(var(--simple-colors-default-theme-grey-3),var(--simple-colors-default-theme-grey-9));
      }
      :host([drag-enter][dragging]) #possible-container {
        border-color: black;
        border-style: dashed;
        background-color: light-dark(var(--simple-colors-default-theme-grey-2),var(--simple-colors-default-theme-grey-8));
      }

      .tag-option {
        font-size: var(--ddd-font-size-s);
        height: fit-content;
        display: inline-block;
        font-family: var(--ddd-font-navigation);
        padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
        border: var(--ddd-border-sm);
        border-radius: var(--ddd-radius-sm);
        background-color: var(--simple-colors-default-theme-grey-2);
        cursor: pointer;
        user-select: none;
        transition: background-color 0.3s ease;
      }
      table {
        width: 100%;
        border: var(--ddd-border-sm);
      }
      td,th {
        padding: var(--ddd-spacing-2);
        border: var(--ddd-border-sm);
        margin: 0;
        width: 50%;
      }
      tr {
        margin: 0;
        border: var(--ddd-border-sm);
      }
      `]
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.guessDataValue = "matchAnswers";
    this.__tagOption = {};
    this.dragEnter = false;
    this.dragEnterMatches = false;
    this.dragEnterTarget = false;
    this.dragging = false;
    this.matchAnswers = [];
    this.targetAnswers = [];
    // allow for requiring the user to place the targets in the right place as well
    this.matchTarget = false;
  }

  processInput(index, inputs, priorData) {
    let data = super.processInput(index, inputs);
    // implies previous index is the matching target
    if (data.correct === false) {
      data.matchOption = true;
      // look back until we find a target
      for (let i=priorData.length; i>=0; i--) {
        if (!data.match && priorData[i] && priorData[i].target === true) {
          data.match = priorData[i].order;
        }
      }
    }
    else {
      data.target = true;
    }
    return data;
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
      this.displayedAnswers = [];
      this.matchAnswers = [];
      const answers = JSON.parse(JSON.stringify(this.answers));
      this.answers = [...answers];
    }
  }

  isCorrect() {
    let gotRight = true;
    for (var i=0; i< this.matchAnswers.length; i++) {
      // if the match index does not line up with the guess index we got it wrong
      if (this.matchAnswers[i].guess !== this.matchAnswers[i].match) {
        gotRight = false;
        this.matchAnswers[i].correct = false;
      }
      else {
        this.matchAnswers[i].correct = true;
      }
    }
    // this implies we left correct answers off the table
    // we don't show correctness though when not in matchAnswers tho
    for (var i=0; i< this.displayedAnswers.length; i++) {
      if (this.displayedAnswers[i].match) {
        gotRight = false;
      }
    }
    return gotRight;
  }

  selectTargetChange(e) {
    let order = parseInt(e.target.value);
    this.__tagOption.guess = order;
    let index = this.matchAnswers.findIndex(answer => answer.order === this.__tagOption.order);
    if (index > -1) {
      this.matchAnswers.splice(index, 1); // Remove one item only
    }
    index = this.displayedAnswers.findIndex(answer => answer.order === this.__tagOption.order);
    if (index > -1) {
      this.displayedAnswers.splice(index, 1); // Remove one item only
    }
    if (e.target.value === '') {
      this.__tagOption.guess = null;
      this.displayedAnswers.push(this.__tagOption);
    }
    else {
      this.matchAnswers.push(this.__tagOption);
    }
    this.__tagOption = {guess: null};
    let options = Array.from(this.shadowRoot.querySelectorAll("#selecttarget option"));
    for (var i in options) {
      options[i].removeAttribute('selected');
    }
    setTimeout(() => {
      this.shadowRoot.querySelector(`#selecttarget option[value=""]`).setAttribute('selected', 'selected');
    }, 0);
    this.shadowRoot.querySelector('#selecttarget').close();
    this.requestUpdate();
  }

  renderInteraction() {
    return html`
    <dialog id="selecttarget">
      <simple-icon-button-lite icon="close" @click="${() => {this.shadowRoot.querySelector('#selecttarget').close()}}">Close</simple-icon-button-lite>
      <label>Match <em>${this.__tagOption.label}</em> to:</label>
      <select @change="${this.selectTargetChange}" autofocus>
        <option value="">-- Possible options --</option>
        ${this.answers.filter(answer => answer.target).map(answer => html`<option value="${answer.order}">${answer.label}</option>`)}
      </select>
    </dialog>
    <div class="option-container">
      <table class="top">
        <thead>
          <th>Target</th>
          <th>Matches</th>
        </thead>
        <tbody>
      ${this.answers.filter(answer => answer.target).map(answer => html`
      <tr class="matches-container">
        ${!this.matchTarget ? html`<td class="target">${answer.label}</td>` : html`
        <td class="target" id="target-${answer.order}" @drop="${this.handleDrop}" @dragover="${this.allowDropAnswerMatches}">
        ${this.matchAnswers.filter(tag => tag.guess === answer.order).map(tagOption => html`
          <button ?disabled="${this.disabled || this.showAnswer}" class="tag-option ${this.showAnswer ? (tagOption.correct ? 'correct' : 'incorrect') : ''}" draggable="${this.showAnswer ? "false" : "true"}" @dragstart="${this.handleDrag}" @dragend="${this.handleDragEnd}" @click="${(e) => this.handleTagClick(tagOption, e)}">${tagOption.label}</button>
        `)}
        </td>`}
        <td class="match" id="match-${answer.order}" @drop="${this.handleDrop}" @dragover="${this.allowDropAnswerMatches}">
        ${this.matchAnswers.filter(tag => tag.guess === answer.order).map(tagOption => html`
          <button ?disabled="${this.disabled || this.showAnswer}" class="tag-option ${this.showAnswer ? (tagOption.correct ? 'correct' : 'incorrect') : ''}" draggable="${this.showAnswer ? "false" : "true"}" @dragstart="${this.handleDrag}" @dragend="${this.handleDragEnd}" @click="${(e) => this.handleTagClick(tagOption, e)}">${tagOption.label}</button>
        `)}
        </td>
      </tr>
      `)}
      </tbody>
        </table>
      <div id="possible-container" class="possible" @drop="${this.handleDrop}" @dragover="${this.allowDrop}">
      ${this.displayedAnswers.filter(answer => !this.matchTarget ? answer.matchOption : true).map(tagOption => html`
        <button ?disabled="${this.disabled || this.showAnswer}" class="tag-option" draggable="${this.showAnswer ? "false" : "true"}" @dragstart="${this.handleDrag}" @dragend="${this.handleDragEnd}" @click="${(e) => this.handleTagClick(tagOption, e)}">${tagOption.label}</button>
      `)}
    </div>
  </div>`;
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
    this.dragEnterTarget = false;
    this.dragEnterMatches = false;
  }

  allowDrop(e) {
    e.preventDefault();
    this.dragEnter = true;
    this.dragEnterTarget = false;
    this.dragEnterMatches = false;
  }
  allowDropAnswerMatches(e) {
    e.preventDefault();
    this.dragEnterTarget = false;
    this.dragEnterMatches = true;
    this.dragEnter = false;
  }

  allowDropAnswerTarget(e) {
    e.preventDefault();
    this.dragEnterTarget = true;
    this.dragEnterMatches = false;
    this.dragEnter = false;
  }

  handleDrop(e) {
    e.preventDefault();
    this.dragging = false;
    this.dragEnter = false;
    this.dragEnterTarget = false;
    this.dragEnterMatches = false;
    const text = e.dataTransfer.getData("text/plain");
    let tagOption = this.answers.find(answer => answer.label === text);
    let guess, index;
    let target = e.target;
    // resolve drop onto a button element in the listing already
    if (target.tagName === "BUTTON") {
      target = target.parentNode;
    }
    if (target && target.getAttribute && target.getAttribute('id')) {
      switch (target.getAttribute('id').split('-')[0]) {
        case "possible":
          // we have a drop event on a match. put it in the right listing
          tagOption.guess = null;
          index = this.displayedAnswers.findIndex(answer => answer.label === text);
          if (index > -1) {
            this.displayedAnswers.splice(index, 1); // Remove one item only
          }
          index = this.matchAnswers.findIndex(answer => answer.label === text);
          if (index > -1) {
            this.matchAnswers.splice(index, 1); // Remove one item only
          }
          this.displayedAnswers.push(tagOption);
        break;
        case "match":
          // we have a drop event on a match. put it in the right listing
          guess = target.getAttribute('id').split('-')[1];
          tagOption.guess = parseInt(guess);
          index = this.displayedAnswers.findIndex(answer => answer.label === text);
          if (index > -1) {
            this.displayedAnswers.splice(index, 1); // Remove one item only
          }
          index = this.matchAnswers.findIndex(answer => answer.label === text);
          if (index > -1) {
            this.matchAnswers.splice(index, 1); // Remove one item only
          }
          this.matchAnswers.push(tagOption);
        break;
      }
      this.requestUpdate();
    }
  }
  
  
  handleTagClick(tagOption, e) {
    this.__tagOption = {...tagOption};
    let options = Array.from(this.shadowRoot.querySelectorAll("#selecttarget option"));
    for (var i in options) {
      options[i].removeAttribute('selected');
    }
    // buggy assessment of selected so we have to manually build it
    // @todo need to switch this to use .selectedIndex
    if (tagOption.guess) {
      this.shadowRoot.querySelector(`#selecttarget option[value="${tagOption.guess}"]`).setAttribute('selected', 'selected');
    }
    else {
      this.shadowRoot.querySelector(`#selecttarget option[value=""]`).setAttribute('selected', 'selected');
    }
    this.shadowRoot.querySelector('#selecttarget').showModal();
  }

  static get properties() {
    return {
      ...super.properties,
      dragging: { type: Boolean, reflect: true },
      dragEnter: { type: Boolean, reflect: true, attribute: "drag-enter" },
      dragEnterMatches: { type: Boolean, reflect: true, attribute: "drag-enter-matches" },
      dragEnterTarget: { type: Boolean, reflect: true, attribute: "drag-enter-target" },
      matchTarget: { type: Boolean, reflect: true, attribute: "match-target" },
      matchAnswers: { type: Array },
      targetAnswers: { type: Array },
      __tagOption: { type: Object },
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
globalThis.customElements.define(MatchingQuestion.tag, MatchingQuestion);
export { MatchingQuestion };
