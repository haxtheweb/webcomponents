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
      .option-container {
        width: var(--matching-question-tag-option-container-width, 100%);
        border-radius: var(--ddd-radius-sm);
        box-sizing: border-box;
      }

      #target-container,
      #match-container {
        display: flex;
        transition: all .3s ease-in-out;
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
        background-color: light-dark(var(--simple-colors-default-theme-grey-2),var(--simple-colors-default-theme-grey-10));
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
      
      `]
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.dragEnter = false;
    this.dragEnterAnswer = false;
    this.dragging = false;
  }

  renderInteraction() {
    return html`<div class="option-container">
    <div id="target-container" @drop="${this.handleDrop}" @dragover="${this.allowDropAnswer}">
      ${this.matchAnswers.map(answer => html`
        <button ?disabled="${this.disabled || this.showAnswer}" class="tag-option ${this.showAnswer ? (answer.correct ? 'correct' : 'incorrect') : ''}" draggable="${this.showAnswer ? "false" : "true"}" @dragstart="${this.handleDrag}" @dragend="${this.handleDragEnd}" @click="${() => this.handleTagClick(answer)}">${answer.label}</button>
      `)}
    </div>
    <div id="match-container" @drop="${this.handleDrop}" @dragover="${this.allowDrop}">
      ${this.selectedAnswers.map(tagOption => html`
        <button ?disabled="${this.disabled || this.showAnswer}" class="tag-option" draggable="${this.showAnswer ? "false" : "true"}" @dragstart="${this.handleDrag}" @dragend="${this.handleDragEnd}" @click="${() => this.handleTagClick(tagOption)}">${tagOption.label}</button>
      `)}
    </div>
    <div id="possible-container" @drop="${this.handleDrop}" @dragover="${this.allowDrop}">
      ${this.displayedAnswers.map(tagOption => html`
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
    let tagOption = this.answers.find(answer => answer.label === text);
    const isInOptionContainer = this.displayedAnswers.findIndex(answer => answer.label === text);
    const isInUserChoiceContainer = this.selectedAnswers.findIndex(answer => answer.label === text);
    
    if (isInOptionContainer !== -1 && e.target && e.target.getAttribute('id') !== 'possible-container') {
        this.handleTagMove(tagOption, "possible-container");
    } else if (isInUserChoiceContainer !== -1 && e.target && e.target.getAttribute('id') !== 'user-choice-container') {
        this.handleTagMove(tagOption, "user-choice-container");
    }
  }

  static get properties() {
    return {
      ...super.properties,
      dragging: { type: Boolean, reflect: true },
      dragEnter: { type: Boolean, reflect: true, attribute: "drag-enter"},
      dragEnterAnswer: { type: Boolean, reflect: true, attribute: "drag-enter-answer"},
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
