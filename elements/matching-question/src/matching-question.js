/**
 * Copyright 2024
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { QuestionElement } from "@lrnwebcomponents/multiple-choice/lib/QuestionElement.js";

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
      
      #target-container {
        transition: all .3s ease-in-out;
        justify-content: center;
        overflow-y: auto;
        background-color: light-dark(var(--simple-colors-default-theme-grey-2),var(--simple-colors-default-theme-grey-10));
      }

      .targets .target {
        height: 100px;
      }
      .matches .match {
        min-height: 100px;
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
    this.guessDataValue = "matchesAnswers";
    this.dragEnter = false;
    this.dragEnterMatches = false;
    this.dragEnterTarget = false;
    this.dragging = false;
    this.matchesAnswers = [];
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
          data.match = inputs[i].value;
        }
      }
    }
    else {
      data.target = true;
    }
    return data;
  }

  renderInteraction() {
    return html`
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
        ${this.matchesAnswers.filter(tag => tag.guess === answer.order).map(tagOption => html`
          <button ?disabled="${this.disabled || this.showAnswer}" class="tag-option" draggable="${this.showAnswer ? "false" : "true"}" @dragstart="${this.handleDrag}" @dragend="${this.handleDragEnd}" @click="${() => this.handleTagClick(tagOption)}">${tagOption.label}</button>
        `)}
        </td>`}
        <td class="match" id="match-${answer.order}" @drop="${this.handleDrop}" @dragover="${this.allowDropAnswerMatches}">
        ${this.matchesAnswers.filter(tag => tag.guess === answer.order).map(tagOption => html`
          <button ?disabled="${this.disabled || this.showAnswer}" class="tag-option" draggable="${this.showAnswer ? "false" : "true"}" @dragstart="${this.handleDrag}" @dragend="${this.handleDragEnd}" @click="${() => this.handleTagClick(tagOption)}">${tagOption.label}</button>
        `)}
        </td>
      </tr>
      `)}
      </tbody>
        </table>
      <div id="possible-container" class="possible" @drop="${this.handleDrop}" @dragover="${this.allowDrop}">
      ${this.displayedAnswers.filter(answer => !this.matchTarget ? answer.matchOption : true).map(tagOption => html`
        <button ?disabled="${this.disabled || this.showAnswer}" class="tag-option" draggable="${this.showAnswer ? "false" : "true"}" @dragstart="${this.handleDrag}" @dragend="${this.handleDragEnd}" @click="${() => this.handleTagClick(tagOption)}">${tagOption.label}</button>
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
    if (e.target && e.target.getAttribute && e.target.getAttribute('id')) {
      console.log(e.target.getAttribute('id').split('-')[0]);
      switch (e.target.getAttribute('id').split('-')[0]) {
        case "possible":
          if (this.displayedAnswers.findIndex(answer => answer.label === text) === -1) {
            this.displayedAnswers.push(tagOption);
            let index = this.targetAnswers.findIndex(answer => answer.label === text);
            if (index > -1) {
              this.targetAnswers.splice(index, 1); // Remove one item only
            }
            index = this.matchesAnswers.findIndex(answer => answer.label === text);
            if (index > -1) {
              this.matchesAnswers.splice(index, 1); // Remove one item only
            }
          }
        break;
        case "match":
          // we have a drop event on a match. put it in the right listing
          let guess = e.target.getAttribute('id').split('-')[1];
          tagOption.guess = parseInt(guess);
          let index = this.targetAnswers.findIndex(answer => answer.label === text);
          if (index > -1) {
            this.targetAnswers.splice(index, 1); // Remove one item only
          }
          index = this.displayedAnswers.findIndex(answer => answer.label === text);
          if (index > -1) {
            this.displayedAnswers.splice(index, 1); // Remove one item only
          }
          index = this.matchesAnswers.findIndex(answer => answer.label === text);
          if (index > -1) {
            this.matchesAnswers.splice(index, 1); // Remove one item only
          }
          this.matchesAnswers.push(tagOption);
        break;
        
        case "target":

        break;
      }
      this.requestUpdate();
    }
  }
  
  
  handleTagClick(targetTag) {
    alert('need to do a popover menu up');
  }

  static get properties() {
    return {
      ...super.properties,
      dragging: { type: Boolean, reflect: true },
      dragEnter: { type: Boolean, reflect: true, attribute: "drag-enter" },
      dragEnterMatches: { type: Boolean, reflect: true, attribute: "drag-enter-matches" },
      dragEnterTarget: { type: Boolean, reflect: true, attribute: "drag-enter-target" },
      matchTarget: { type: Boolean, reflect: true, attribute: "match-target" },
      matchesAnswers: { type: Array },
      targetAnswers: { type: Array },
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
