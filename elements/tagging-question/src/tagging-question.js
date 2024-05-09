/**
 * Copyright 2024
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { QuestionElement } from "@lrnwebcomponents/multiple-choice/lib/QuestionElement.js";

// @TODO
// - work feedback for there or not there into multiple choice beyond just initial data load
// - support video / image for loading in place. this is via HAX settings in all of multiple choice

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
    this.__primaryGuess = "selectedAnswers";
    this.dragEnter = false;
    this.dragEnterAnswer = false;
    this.dragging = false;
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          border-radius: var(--ddd-radius-sm);
          box-shadow: var(--ddd-boxShadow-sm);
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
          transition: height 0.3s ease;
        }

        .tag-question {
          text-align: center;
          font-weight: bold;
          font-size: var(--ddd-spacing-6);
        }

        .tag-option-container {
          width: var(--tagging-question-tag-option-container-width, 100%);
          border-radius: var(--ddd-radius-sm);
          box-sizing: border-box;
        }

        #user-choice-container {
          display: flex;
          transition: all .3s ease-in-out;
          flex-wrap: wrap;
          justify-content: center;
          overflow-y: auto;
          gap: var(--ddd-spacing-2);
          min-height: var(--ddd-spacing-18);
          margin-bottom: var(--ddd-spacing-5);
          padding: var(--ddd-spacing-15);
          border: var(--ddd-border-sm);
          border-radius: var(--ddd-radius-sm);
          box-sizing: border-box;
          background-color: var(--simple-colors-default-theme-grey-2);
        }

        #submit-button, #reset-button {
          margin-top: var(--ddd-spacing-5);
          padding: var(--ddd-spacing-4) var(--ddd-spacing-5);
          color: var(--ddd-theme-default-white);
          border: none;
          border-radius: var(--ddd-radius-sm);
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        #possible-container {
          display: flex;
          padding: var(--ddd-spacing-3);
          border: var(--ddd-border-xs);
          flex-wrap: wrap;
          justify-content: center;
          gap: var(--ddd-spacing-2);
          min-height: var(--ddd-spacing-12);
        }


        :host([show-answer]) .tag-option {
          cursor: unset;
        }

        :host(:not([show-answer])) .tag-option:hover, :host(:not([show-answer])) .tag-option:focus {
          background-color: var(--simple-colors-default-theme-grey-3);
        }

        .tag-option.correct {
          outline: 2px solid var(--simple-colors-default-theme-green-7);
        }

        .tag-option.incorrect {
          outline: 2px solid var(--simple-colors-default-theme-red-7);;
        }

        .feedback-container h3 {
          margin-top: var(--ddd-spacing-5);
          font-size: var(--ddd-spacing-6);
          font-weight: bold;
          text-align: center;
        }

        .feedback-container p {
          text-align: center;
          margin-top: var(--ddd-spacing-0);
        }

        .feedback {
          text-align: left;
          margin-top: var(--ddd-spacing-5);
        }

        .feedback.correct {
          color: var(--simple-colors-default-theme-green-7);
        }

        .feedback.incorrect {
          color: var(--simple-colors-default-theme-red-7);
        }

        .tag-slot ::slotted(img) {
          max-height: 200px;
        }
        :host([dragging]) #user-choice-container {
          border-style: dashed;
          border-color: gray;
        }
        :host([drag-enter-answer][dragging]) #user-choice-container {
          border-style: dashed;
          border-color: black;
          background-color: var(--simple-colors-default-theme-grey-3);
        }
        :host([drag-enter][dragging]) #possible-container {
          border-color: black;
          border-style: dashed;
          background-color: var(--simple-colors-default-theme-grey-2);
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
      `
    ];
  }

  render() {
    return html`
      <confetti-container id="confetti">
        <div class="tag-container">
          <div class="tag-question">
            <meta property="oer:assessing" content="${this.relatedResource}" />
            <h3 property="oer:name">${this.question}</h3>
            <div class="tag-slot"><slot></slot></div>
          </div>
          <div class="tag-option-container">
            <div id="user-choice-container" @drop="${this.handleDrop}" @dragover="${this.allowDropAnswer}">
              ${this.selectedAnswers.map(answer => html`
                <button ?disabled="${this.showAnswer}" class="tag-option ${this.showAnswer ? (answer.correct ? 'correct' : 'incorrect') : ''}" draggable="${this.showAnswer ? "false" : "true"}" @dragstart="${this.handleDrag}" @dragend="${this.handleDragEnd}" @click="${() => this.handleTagClick(answer)}">${answer.label}</button>
              `)}
            </div>
            <div id="possible-container" @drop="${this.handleDrop}" @dragover="${this.allowDrop}">
              ${this.displayedAnswers.map(tagOption => html`
                <button ?disabled="${this.showAnswer}" class="tag-option" draggable="${this.showAnswer ? "false" : "true"}" @dragstart="${this.handleDrag}" @dragend="${this.handleDragEnd}" @click="${() => this.handleTagClick(tagOption)}">${tagOption.label}</button>
              `)}
            </div>
          </div>
          ${!this.hideButtons ? this.renderButtons() : ``}
          ${this.showAnswer ? html`
          <div class="feedback-container">
            <h3>Answers selected</h3>
            <p>${this.selectedAnswers.filter(answer => answer.correct).length} out of ${this.answers.filter(answer => answer.correct).length} correct options selected</p>
            <ul>
            ${this.selectedAnswers.map(answer => html`
              <li class="feedback ${answer.correct ? 'correct' : 'incorrect'}"><strong>${answer.label}:</strong> ${answer.selectedFeedback}</li>              
            `)}
            </ul>
            <h3>Answers not selected</h3>
            <ul>
            ${this.displayedAnswers.map(answer => html`
              ${answer.unselectedFeedback ? html`<li class="feedback ${!answer.correct ? 'correct' : 'incorrect'}">${answer.unselectedFeedback}</li>` : ``}
            `)}
            </ul>
          </div>
        ` : ''}
        </div>
      </confetti-container>
    `;
  }  
  
  shuffleArray(array) {
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
    let tagOption = this.answers.find(answer => answer.label === text);
    const isInOptionContainer = this.displayedAnswers.findIndex(answer => answer.label === text);
    const isInUserChoiceContainer = this.selectedAnswers.findIndex(answer => answer.label === text);
    
    if (isInOptionContainer !== -1 && e.target && e.target.getAttribute('id') !== 'possible-container') {
        this.handleTagMove(tagOption, "possible-container");
    } else if (isInUserChoiceContainer !== -1 && e.target && e.target.getAttribute('id') !== 'user-choice-container') {
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
    if (this.selectedAnswers.filter(answer => answer.label === targetTag.label).length === 1) {
      this.handleTagMove(targetTag, "user-choice-container");
    } else if (this.displayedAnswers.filter(answer => answer.label === targetTag.label).length === 1) {
      this.handleTagMove(targetTag, "possible-container");
    }
  }

  addTag(targetTag) {
    if (!this.showAnswer) {
      this.selectedAnswers.push(targetTag);
      this.displayedAnswers = this.displayedAnswers.filter(answer => answer.label !== targetTag.label);
      this.requestUpdate();
    }
  }

  removeTag(targetTag) {
    if (!this.showAnswer) {
      this.selectedAnswers = this.selectedAnswers.filter(answer => answer.label !== targetTag.label);
      this.displayedAnswers.push(targetTag);
      this.requestUpdate();
    }
  }

  checkAnswer() {
    this.showAnswer = true;
    const allCorrect = this.answers.filter(answer => answer.correct).length === this.selectedAnswers.filter(answer => answer.correct).length && this.selectedAnswers.filter(answer => answer.correct).length === this.selectedAnswers.length;
    if (allCorrect) {
      this.makeItRain();
    }
  }

  resetAnswer() {
    this.showAnswer = false;
    const allCorrect = this.answers.filter(answer => answer.correct).length === this.selectedAnswers.filter(answer => answer.correct).length && this.selectedAnswers.filter(answer => answer.correct).length === this.selectedAnswers.length;
    if (allCorrect) {
      this.displayedAnswers = [...this.answers];
      this.selectedAnswers = [];
      this.shuffleArray(this.displayedAnswers);  
      this.randomizeOptions();
    }
  }

  makeItRain() {
    import('@lrnwebcomponents/multiple-choice/lib/confetti-container.js').then((module) => {
      setTimeout(() => {
        this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
      }, 0);
    });
  }
  
  static get properties() {
    return {
      ...super.properties,
      dragging: { type: Boolean, reflect: true },
      dragEnter: { type: Boolean, reflect: true, attribute: "drag-enter"},
      dragEnterAnswer: { type: Boolean, reflect: true, attribute: "drag-enter-answer"},
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
