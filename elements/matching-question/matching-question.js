/**
 * Copyright 2024
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { QuestionElement } from "@haxtheweb/multiple-choice/lib/QuestionElement.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";

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
          transition: all 0.3s ease-in-out;
          justify-content: center;
          overflow-y: auto;
          background-color: light-dark(
            var(--simple-colors-default-theme-grey-2),
            var(--simple-colors-default-theme-grey-10)
          );
        }

        .target {
          height: 100px;
          padding: 4px;
          font-weight: var(--ddd-font-weight-bold);
        }
        .match {
          min-height: 100px;
          padding: 4px;
        }

        .tag-option {
          margin: 4px;
        }

        #matches-container {
          transition: all 0.3s ease-in-out;
          justify-content: center;
          overflow-y: auto;
          background-color: light-dark(
            var(--simple-colors-default-theme-grey-2),
            var(--simple-colors-default-theme-grey-10)
          );
        }

        #possible-container {
          display: flex;
          justify-content: start;
          padding: var(--ddd-spacing-3);
          border: var(--ddd-border-xs);
          flex-wrap: wrap;
          justify-content: center;
          gap: var(--ddd-spacing-4);
          min-height: var(--ddd-spacing-12);
        }

        :host([show-answer]) .tag-option {
          cursor: unset;
        }

        :host(:not([show-answer])) .tag-option:hover,
        :host(:not([show-answer])) .tag-option:focus {
          background-color: var(--simple-colors-default-theme-grey-3);
        }

        :host([show-answer]) .tag-option {
          cursor: unset;
        }

        :host([dragging]) .match,
        :host([dragging]) #possible-container {
          border: var(--ddd-border-md);
          border-style: dashed;
        }
        :host([drag-enter][dragging]) #possible-container.drag-enter,
        :host([drag-enter][dragging]) .drag-enter {
          border-style: dashed;
          border-color: black;
          background-color: light-dark(
            var(--simple-colors-default-theme-grey-3),
            var(--simple-colors-default-theme-grey-9)
          );
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
        td,
        th {
          padding: var(--ddd-spacing-2);
          border: var(--ddd-border-sm);
          margin: 0;
          width: 50%;
        }
        tr {
          margin: 0;
          border: var(--ddd-border-sm);
        }
      `,
    ];
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.guessDataValue = "matchAnswers";
    this.__activeOption = {};
    this.dragEnter = false;
    this.dragging = false;
    this.matchAnswers = [];
    // allow for requiring the user to place the targets in the right place as well
    this.matchTarget = false;
  }

  processInput(index, inputs, priorData) {
    let data = super.processInput(index, inputs);
    // implies previous index is the matching target
    if (data.correct === false) {
      data.matchOption = true;
      // look back until we find a target
      for (let i = priorData.length; i >= 0; i--) {
        if (!data.match && priorData[i] && priorData[i].target === true) {
          data.match = priorData[i].order;
        }
      }
    } else {
      data.target = true;
    }
    return data;
  }
  // ensure data model of the answers is normalized
  cleanAnswerData(answers) {
    // when this is called, we have to clean up any movement on the board or it'll cause duplications
    this.matchAnswers = [];
    // force reset bc data changed
    this.showAnswer = false;
    let newAnswers = [];
    for (let i in answers) {
      let tmpA = { ... this.answerPrototype(), ...answers[i]};
      tmpA.order = parseInt(i);
      // unset match and target details so they get rebuilt every time the data changes in any way
      tmpA.match = false;
      tmpA.matchOption = false;
      tmpA.target = false;
      newAnswers.push({...this.cleanAnswerDataBeforeSend(tmpA, parseInt(i), newAnswers)});
    }
    return newAnswers;
  }
  cleanAnswerDataBeforeSend(answer, index, answers) {
    // implies previous index is the matching target
    if (answer.correct === false) {
      answer.matchOption = true;
      // look back until we find a target
      for (let i = index; i >= 0; i--) {
        if (!answer.match && answers[i] && answers[i].target === true) {
          answer.match = answers[i].order;
        }
      }
    } else {
      answer.target = true;
    }
    return answer;
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
    setTimeout(() => {
      this.requestUpdate();
    }, 0);
  }

  isCorrect() {
    let gotRight = true;
    for (var i = 0; i < this.matchAnswers.length; i++) {
      // if the match index does not line up with the guess index we got it wrong
      if (this.matchAnswers[i].guess !== this.matchAnswers[i].match) {
        gotRight = false;
        this.matchAnswers[i].correct = false;
      } else {
        this.matchAnswers[i].correct = true;
      }
    }
    // this implies we left correct answers off the table
    // we don't show correctness though when not in matchAnswers tho
    for (var i = 0; i < this.displayedAnswers.length; i++) {
      if (this.displayedAnswers[i].match) {
        gotRight = false;
      }
    }
    return gotRight;
  }

  renderInteraction() {
    return html` <dialog id="selecttarget">
        <simple-icon-button-lite
          icon="close"
          @click="${() => {
            this.shadowRoot.querySelector("dialog").close();
          }}"
          >Close</simple-icon-button-lite
        >
        <label>Match <em>${this.__activeOption.label}</em> to:</label>
        <select @change="${this.selectTargetChange}" autofocus>
          <option value="">-- Possible options --</option>
          ${this.answers
            .filter((answer) => answer.target)
            .map(
              (answer) =>
                html`<option value="${answer.order}">${answer.label}</option>`,
            )}
        </select>
      </dialog>
      <div class="option-container">
        <table class="top">
          <thead>
            <th>Target</th>
            <th>Match</th>
          </thead>
          <tbody>
            ${this.answers
              .filter((answer) => answer.target)
              .map(
                (answer) => html`
                  <tr class="matches-container">
                    ${!this.matchTarget
                      ? html`<td class="target">${answer.label}</td>`
                      : html` <td
                          class="target"
                          id="target-${answer.order}"
                          @drop="${this.handleDrop}"
                          @dragleave="${this.dragTargetLeave}"
                          @dragover="${this.dragTargetOver}"
                        >
                          ${this.matchAnswers
                            .filter((tag) => tag.guess === answer.order)
                            .map(
                              (tagOption) => html`
                                ${this.renderOption(tagOption, "target")}
                              `,
                            )}
                        </td>`}
                    <td
                      class="match"
                      id="match-${answer.order}"
                      @drop="${this.handleDrop}"
                      @dragleave="${this.dragTargetLeave}"
                      @dragover="${this.dragTargetOver}"
                    >
                      ${this.matchAnswers
                        .filter((tag) => tag.guess === answer.order)
                        .map(
                          (tagOption) => html`
                            ${this.renderOption(tagOption, "match")}
                          `,
                        )}
                    </td>
                  </tr>
                `,
              )}
          </tbody>
        </table>
        <div
          id="possible-container"
          class="possible"
          @drop="${this.handleDrop}"
          @dragover="${this.dragTargetOver}"
          @dragleave="${this.dragTargetLeave}"
        >
          ${this.displayedAnswers
            .filter((answer) => (!this.matchTarget ? answer.matchOption : true))
            .map(
              (tagOption) => html`
                ${this.renderOption(tagOption, "possible")}
              `,
            )}
        </div>
      </div>`;
  }

  renderOption(tagOption, container) {
    return html`<button
      ?disabled="${this.disabled || this.showAnswer}"
      class="tag-option ${container != "possible" && this.showAnswer
        ? tagOption.correct
          ? "correct"
          : "incorrect"
        : ""}"
      draggable="${this.showAnswer ? "false" : "true"}"
      @dragstart="${this.handleDrag}"
      @dragend="${this.handleDragEnd}"
      data-label="${tagOption.label}"
      @click="${() => this.handleTagClick(tagOption)}"
    >
      ${tagOption.label}
    </button>`;
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
  }

  dragTargetOver(e) {
    e.preventDefault();
    e.target.classList.add("drag-enter");
    this.dragEnter = true;
  }

  dragTargetLeave(e) {
    e.preventDefault();
    e.target.classList.remove("drag-enter");
  }

  handleDrop(e) {
    e.preventDefault();
    this.dragging = false;
    this.dragEnter = false;
    let dragNodes = Array.from(this.shadowRoot.querySelectorAll(".drag-enter"));
    for (var i in dragNodes) {
      dragNodes[i].classList.remove("drag-enter");
    }
    const text = e.dataTransfer.getData("text/plain");
    let tagOption = this.answers.find((answer) => answer.label === text);
    let guess, index;
    let target = e.target;
    // resolve drop onto a button element in the listing already
    if (target.tagName === "BUTTON") {
      target = target.parentNode;
    }
    if (target && target.getAttribute && target.getAttribute("id")) {
      switch (target.getAttribute("id").split("-")[0]) {
        case "possible":
          // we have a drop event on a match. put it in the right listing
          tagOption.guess = null;
          index = this.displayedAnswers.findIndex(
            (answer) => answer.label === text,
          );
          if (index > -1) {
            this.displayedAnswers.splice(index, 1); // Remove one item only
          }
          index = this.matchAnswers.findIndex(
            (answer) => answer.label === text,
          );
          if (index > -1) {
            this.matchAnswers.splice(index, 1); // Remove one item only
          }
          this.displayedAnswers.push(JSON.parse(JSON.stringify(tagOption)));
          break;
        case "match":
          // we have a drop event on a match. put it in the right listing
          guess = target.getAttribute("id").split("-")[1];
          tagOption.guess = parseInt(guess);
          index = this.displayedAnswers.findIndex(
            (answer) => answer.label === text,
          );
          if (index > -1) {
            this.displayedAnswers.splice(index, 1); // Remove one item only
          }
          index = this.matchAnswers.findIndex(
            (answer) => answer.label === text,
          );
          if (index > -1) {
            this.matchAnswers.splice(index, 1); // Remove one item only
          }
          this.matchAnswers.push(JSON.parse(JSON.stringify(tagOption)));

          break;
      }
      this.requestUpdate();
      setTimeout(() => {
        this.focusActive(tagOption);
      }, 0);
    }
  }

  // this manages the directions that are rendered and hard coded for the interaction
  renderDirections() {
    return html`<p>
      Select all that apply. When you are done, press
      <strong>${this.t.checkAnswer}</strong>. You will get feedback indicating
      correctness of your answer and how to proceed.
    </p>`;
  }

  focusActive(tagOption) {
    this.shadowRoot
      .querySelector(`button[data-label="${tagOption.label}"]`)
      .focus();
  }
  // support clicking the tag to invoke a menu to make the change
  handleTagClick(tagOption) {
    let active = 0;
    this.__activeOption = { ...tagOption };
    let options = Array.from(this.shadowRoot.querySelectorAll("dialog option"));
    for (var i in options) {
      if (parseInt(options[i].value) === tagOption.guess) {
        active = i;
      }
    }
    this.shadowRoot.querySelector("dialog select").selectedIndex = active;
    this.shadowRoot.querySelector("dialog").showModal();
  }
  // target selected from dialog based selection menu
  selectTargetChange(e) {
    let order = parseInt(e.target.value);
    this.__activeOption.guess = order;
    let index = this.matchAnswers.findIndex(
      (answer) => answer.order === this.__activeOption.order,
    );
    if (index > -1) {
      this.matchAnswers.splice(index, 1); // Remove one item only
    }
    index = this.displayedAnswers.findIndex(
      (answer) => answer.order === this.__activeOption.order,
    );
    if (index > -1) {
      this.displayedAnswers.splice(index, 1); // Remove one item only
    }
    if (e.target.value === "") {
      this.__activeOption.guess = null;
      this.displayedAnswers.push(JSON.parse(JSON.stringify(this.__activeOption)));
    } else {
      this.matchAnswers.push(JSON.parse(JSON.stringify(this.__activeOption)));
    }
    this.shadowRoot.querySelector("dialog select").selectedIndex = 0;
    this.shadowRoot.querySelector("dialog").close();
    this.requestUpdate();
    // need to delay this one because tag option needs set to nothing after selection
    setTimeout(() => {
      this.focusActive(this.__activeOption);
      this.__activeOption = { guess: null };
    }, 0);
  }

  static get properties() {
    return {
      ...super.properties,
      dragging: { type: Boolean, reflect: true },
      dragEnter: { type: Boolean, reflect: true, attribute: "drag-enter" },
      matchTarget: { type: Boolean, reflect: true, attribute: "match-target" },
      matchAnswers: { type: Array },
      __activeOption: { type: Object },
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
globalThis.customElements.define(MatchingQuestion.tag, MatchingQuestion);
export { MatchingQuestion };
