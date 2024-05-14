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
        display: grid; 
        grid-template-columns: 1fr; 
        grid-template-rows: 1fr 1fr; 
        gap: 0px 0px; 
        grid-template-areas: 
          "."
          "possible"; 
      }
      .top {
        display: grid; 
        grid-template-columns: 1fr 1fr; 
        grid-template-rows: 1fr; 
        gap: 0px 0px; 
        grid-template-areas: 
          "targets matches"; 
      }
      .matches { grid-area: matches; }
      .targets { grid-area: targets; }
      .possible { grid-area: possible; }
      
      #target-container {
        transition: all .3s ease-in-out;
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

      #matches-container {
        transition: all .3s ease-in-out;
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
          height: auto;
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
      `]
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.dragEnter = false;
    this.dragEnterMatches = false;
    this.dragEnterTarget = false;
    this.dragging = false;
    this.matchesAnswers = [];
    this.targetAnswers = [];
  }

  processInput(index, inputs, priorData) {
    let data = super.processInput(index, inputs);
    // implies previous index is the matching target
    if (data.correct === false) {
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
      <div class="top">
        <div id="target-container" class="targets" @drop="${this.handleDrop}" @dragover="${this.allowDropAnswerTarget}">
          ${this.targetAnswers.map(answer => html`
          <button ?disabled="${this.disabled || this.showAnswer}" class="tag-option ${this.showAnswer ? (answer.correct ? 'correct' : 'incorrect') : ''}" draggable="${this.showAnswer ? "false" : "true"}" @dragstart="${this.handleDrag}" @dragend="${this.handleDragEnd}" @click="${() => this.handleTagClick(answer)}">${answer.label}</button>
        `)}
        </div>
        <div id="matches-container" class="matches" @drop="${this.handleDrop}" @dragover="${this.allowDropAnswerMatches}">
          ${this.matchesAnswers.map(tagOption => html`
          <button ?disabled="${this.disabled || this.showAnswer}" class="tag-option" draggable="${this.showAnswer ? "false" : "true"}" @dragstart="${this.handleDrag}" @dragend="${this.handleDragEnd}" @click="${() => this.handleTagClick(tagOption)}">${tagOption.label}</button>
        `)}
        </div>

      </div>
      <div id="possible-container" class="possible" @drop="${this.handleDrop}" @dragover="${this.allowDrop}">
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
      switch (e.target.getAttribute('id')) {
        case "target-container":
          if (this.targetAnswers.findIndex(answer => answer.label === text) === -1) {
            this.targetAnswers.push(tagOption);
            let index = this.displayedAnswers.findIndex(answer => answer.label === text);
            if (index > -1) {
              this.displayedAnswers.splice(index, 1); // Remove one item only
            }
            index = this.matchesAnswers.findIndex(answer => answer.label === text);
            if (index > -1) {
              this.matchesAnswers.splice(index, 1); // Remove one item only
            }
          }
        break;
        case "matches-container":
          if (this.matchesAnswers.findIndex(answer => answer.label === text) === -1) {
            this.matchesAnswers.push(tagOption);
            let index = this.displayedAnswers.findIndex(answer => answer.label === text);
            if (index > -1) {
              this.displayedAnswers.splice(index, 1); // Remove one item only
            }
            index = this.targetAnswers.findIndex(answer => answer.label === text);
            if (index > -1) {
              this.targetAnswers.splice(index, 1); // Remove one item only
            }
          }
        break;
        case "possible-container":
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
      dragEnter: { type: Boolean, reflect: true, attribute: "drag-enter"},
      dragEnterMatches: { type: Boolean, reflect: true, attribute: "drag-enter-matches"},
      dragEnterTarget: { type: Boolean, reflect: true, attribute: "drag-enter-target"},
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
