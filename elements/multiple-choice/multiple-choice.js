import { html, css, LitElement } from "lit";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import { SimpleColorsSuper } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-fields/lib/simple-fields-field.js";
import "@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-button.js";
import { SimpleToastStore } from "@lrnwebcomponents/simple-toast/simple-toast.js";
/**
 * `multiple-choice`
 * `Ask the user a question from a set of possible answers.`
 * @demo demo/index.html
 * @element multiple-choice
 */
class MultipleChoice extends SchemaBehaviors(SimpleColorsSuper(LitElement)) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          min-width: 160px;
          padding: 16px;
          margin-bottom: 16px;
          border: 1px solid var(--simple-colors-default-theme-grey-8);
          border-radius: 3px;
          color: var(--simple-colors-default-theme-grey-12);
          --simple-toolbar-button-border-color: var(
            --simple-colors-default-theme-grey-4
          );
          --simple-fields-field-color: var(
            --simple-colors-default-theme-grey-12
          );
          --simple-fields-field-ink-color: var(
            --simple-colors-default-theme-grey-12
          );
          --simple-fields-field-checked-color: var(
            --simple-colors-default-theme-accent-8
          );
          --simple-fields-field-checked-ink-color: var(
            --simple-colors-default-theme-accent-8
          );
          --simple-fields-field-checkmark-color: var(
            --simple-colors-default-theme-grey-1
          );
          --simple-fields-field-label-color: var(
            --simple-colors-default-theme-grey-12
          );
          --simple-fields-field-error-color: var(
            --simple-colors-default-theme-red-8
          );
          --simple-fields-border-bottom-size: 0px;
          --simple-fields-border-bottom-focus-size: 0px;
        }

        :host button {
          background-color: var(--simple-colors-default-theme-grey-1);
          color: var(--simple-colors-default-theme-grey-12);
        }
        :host button:hover,
        :host button:focus,
        :host button:active {
          cursor: pointer;
          background-color: var(--simple-colors-default-theme-grey-2);
          color: var(--simple-colors-default-theme-grey-12);
        }
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        ul li {
          padding: 0;
        }
        simple-icon {
          display: inline-flex;
        }
        h3 {
          margin-top: 0;
        }
        #buttons {
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        #check {
          margin-right: 8px;
        }
        .feedback {
          background-color: black;
          color: white;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 8px;
          border-radius: 3px;
        }
        .feedback simple-icon {
          margin-right: 8px;
        }
        ::slotted([slot="question"]) {
          margin: 0;
        }
        .feedback,
        ::slotted([slot="correct-answer"]),
        ::slotted([slot="incorrect-answer"]),
        ::slotted([slot="correct-feedback"]),
        ::slotted([slot="incorrect-feedback"]) {
          font-size: var(--simple-fields-font-size, 16px);
          text-align: var(--simple-fields-text-align);
          font-family: var(--simple-fields-font-family, sans-serif);
          line-height: var(--simple-fields-line-height, 22px);
        }
        ::slotted([slot="correct-answer"]):before {
          content: "\u2714 ";
        }
        ::slotted([slot="incorrect-answer"]):before {
          content: "\u2718 ";
        }
      `,
    ];
  }
  static get tag() {
    return "multiple-choice";
  }
  constructor() {
    super();
    this.randomize = false;
    this.hideButtons = false;
    this.disabled = false;
    this.singleOption = false;
    this.checkLabel = "Check Answer";
    this.resetLabel = "Reset";
    this.question = "";
    this.answers = [];
    this.displayedAnswers = [];
    this.editMode = false;
    this.correctText = "Great job!";
    this.correctIcon = "icons:thumb-up";
    this.incorrectText = "Better luck next time!";
    this.incorrectIcon = "icons:thumb-down";
    this.quizName = "default";
  }
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      let notifiedProps = ["answers", "displayedAnswers"];
      if (notifiedProps.includes(propName)) {
        // notify
        let eventName = `${propName
          .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
          .toLowerCase()}-changed`;
        this.dispatchEvent(
          new CustomEvent(eventName, {
            detail: {
              value: this[propName],
            },
          })
        );
      }
      if (propName == "answers" && this.answers && this.answers.length > 0) {
        this._setSlottedAnswers();
        this.displayedAnswers = [
          ...this._computeDisplayedAnswers(this.answers, this.randomize),
        ];
      }
      if (propName == "correctText")
        this._setSlottedText(this.correctText, "correct-feedback");
      if (propName == "incorrectText")
        this._setSlottedText(this.incorrectText, "incorrect-feedback");
      if (propName == "title") this._setSlottedText(this.title, "question");
      //only recheck slots editMode is turned off
      if (propName == "editMode" && !this.editMode) this._handleSlotChange();
    });
  }
  render() {
    return html`
      <confetti-container id="confetti">
        <meta property="oer:assessing" content="${this.relatedResource}" />
        <h3 id="question" property="oer:name"><slot name="question"></slot></h3>
        ${this.editMode
          ? html` <div id="editMode">
              <slot name="question"></slot>
              <slot name="correct-answer"></slot>
              <slot name="incorrect-answer"></slot>
              <p class="feedback">
                <simple-icon
                  icon="${this.correctIcon}"
                  accent-color="green"
                  dark
                ></simple-icon>
                <slot name="correct-feedback"></slot>
              </p>
              <p class="feedback">
                <simple-icon
                  icon="${this.incorrectIcon}"
                  accent-color="red"
                  dark
                ></simple-icon>
                <slot name="incorrect-feedback"></slot>
              </p>
            </div>`
          : html`
              <simple-fields-field
                aria-labelledby="question"
                block-options
                ?disabled="${this.disabled}"
                ?inline="${false}"
                property="oer:answer"
                type="${this.singleOption ? "radio" : "checkbox"}"
                .itemsList="${this.itemsList}"
                .value="${this.userGuess}"
                name="answers"
                @value-changed="${this.checkedEvent}"
              ></simple-fields-field>
              ${!this.hideButtons
                ? html`
                    <div id="buttons">
                      <simple-toolbar-button
                        id="check"
                        ?disabled="${this.disabled}"
                        @click="${this._verifyAnswers}"
                        label="${this.checkLabel}"
                      >
                      </simple-toolbar-button>
                      <simple-toolbar-button
                        id="reset"
                        ?disabled="${this.disabled}"
                        @click="${this.resetAnswers}"
                        label="${this.resetLabel}"
                      >
                      </simple-toolbar-button>
                    </div>
                  `
                : ``}
            `}
      </confetti-container>
    `;
  }
  checkedEvent(e) {
    this.userGuess = e.detail.value;
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * Support disabling interaction with the entire board
       */
      disabled: {
        type: Boolean,
      },
      /**
       * Simple option, otherwise allow multiple via checkbox
       */
      singleOption: {
        type: Boolean,
        attribute: "single-option",
      },
      /**
       * Text of the label to check your answer
       */
      checkLabel: {
        type: String,
        attribute: "check-label",
      },
      /**
       * Text of the reset button
       */
      resetLabel: {
        type: String,
        attribute: "reset-label",
      },
      /**
       * Related Resource ID
       */
      relatedResource: {
        type: String,
        attribute: "related-resource",
      },
      /**
       * Question to ask
       */
      question: {
        type: String,
      },
      /**
       * Array of possible answers
       */
      answers: {
        type: Array,
      },
      /**
       * Displayed Answer set.
       */
      displayedAnswers: {
        type: Array,
      },
      /**
       * Correct answer text to display
       */
      correctText: {
        type: String,
        attribute: "correct-text",
      },
      /**
       * Incorrect answer text to display
       */
      incorrectText: {
        type: String,
        attribute: "incorrect-text",
      },
      /**
       * Correct answer text to display
       */
      correctIcon: {
        type: String,
        attribute: "correct-icon",
      },
      /**
       * Incorrect answer text to display
       */
      incorrectIcon: {
        type: String,
        attribute: "incorrect-icon",
      },
      /**
       * Name of the quiz - hardcoded for now from HTML
       */
      quizName: {
        type: String,
        attribute: "quiz-name",
      },
      /**
       * Randomize the display of the answers
       */
      randomize: {
        type: Boolean,
        reflect: true,
      },
      /**
       * flag to hide buttons
       */
      hideButtons: {
        type: Boolean,
        attribute: "hide-buttons",
      },
      /**
       * flag to hide buttons
       */
      editMode: {
        type: Boolean,
        attribute: "edit-mode",
        reflect: true,
      },
      userGuess: {
        type: Array,
      },
    };
  }

  /**
   * Reset user answers and shuffle the board again.
   */
  resetAnswers(e) {
    SimpleToastStore.hide();
    this.displayedAnswers = [];
    this.userGuess = undefined;
    const answers = JSON.parse(JSON.stringify(this.answers));
    this.answers = [...answers];
  }

  /**
   * if the current answers are correct
   * @returns {boolean}
   * @readonly
   * @memberof MultipleChoice
   */
  get isCorrect() {
    // see that they got them all right
    let guess = this.userGuess || [];
    if (typeof guess === "string") guess = [guess];
    return this.correctAnswers === JSON.stringify(guess.sort());
  }
  /**
   * gets a JSON object of alphabetized correct answers
   * @returns {string}
   * @readonly
   * @memberof MultipleChoice
   */
  get correctAnswers() {
    return JSON.stringify(
      this.displayedAnswers
        .filter((answer) => !!answer.correct)
        .map((answer) => answer.label)
        .sort()
    );
  }
  /**
   * converts displayed answers into an array that the field accepts
   * @returns {array}
   * @readonly
   * @memberof MultipleChoice
   */
  get itemsList() {
    return this.displayedAnswers.map((answer) => {
      return { value: answer.label, text: answer.label };
    });
  }

  /**
   * Verify the answers of the user based on their saying
   * that they want to see how they did.
   */
  _verifyAnswers(e) {
    SimpleToastStore.hide();
    let gotRight = this.isCorrect;
    let si = document.createElement("simple-icon");
    this.__toastColor = "grey";
    si.dark = true;
    // see if they got this correct based on their answers
    if (gotRight) {
      si.accentColor = "green";
      this.__toastIcon = this.correctIcon;
      this.__toastText = this.correctText;
      // make it fun... and performant!
      import("./lib/confetti-container.js").then((module) => {
        setTimeout(() => {
          this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
        }, 0);
      });
    } else {
      this.__toastIcon = this.incorrectIcon;
      this.__toastText = this.incorrectText;
      si.accentColor = "red";
    }
    si.icon = this.__toastIcon;
    si.style.marginLeft = "16px";
    SimpleToastStore.showSimpleToast({
      detail: {
        duration: 3000,
        text: this.__toastText,
        slot: si,
        dark: !si.dark,
        accentColor: this.__toastColor,
      },
    });
    // start of data passing, this is a prototype atm
    let eventData = {
      activityDisplay: "answered",
      objectName: this.quizName,
      resultSuccess: gotRight,
    };
    this.dispatchEvent(
      new CustomEvent("user-engagement", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: eventData,
      })
    );
  }

  /**
   * Figure out the order of the answers which will be displayed
   */
  _computeDisplayedAnswers(answers, randomize) {
    // if we are editing via HAX, don't randomize the answers
    // as we are actively editing the content and this is amazingly jarring
    if (
      typeof answers !== typeof undefined &&
      answers != null &&
      answers.length > 0 &&
      randomize &&
      !this._haxstate
    ) {
      let random = answers;
      var currentIndex = random.length,
        temporaryValue,
        randomIndex;
      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = random[currentIndex];
        random[currentIndex] = random[randomIndex];
        random[randomIndex] = temporaryValue;
      }
      // @todo apply a random sort to the answers array
      return random;
    } else {
      return answers;
    }
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      inlineContextMenu: "haxinlineContextMenu",
    };
  }
  /**
   * add buttons when it is in context
   */
  haxinlineContextMenu(ceMenu) {
    ceMenu.ceButtons = [
      {
        icon: "icons:add",
        callback: "haxClickInlineAdd",
        label: "Add answer",
      },
      {
        icon: "icons:remove",
        callback: "haxClickInlineRemove",
        label: "Remove answer",
      },
    ];
  }
  /**
   * converts answers in slots to an array
   *
   * @returns {array}
   * @memberof MultipleChoice
   */
  _getSlottedAnswers() {
    let slots = Array.from(
      this.querySelectorAll(
        '[slot="correct-answer"],[slot="incorrect-answer"],input'
      )
    );
    let answers = [];
    slots.forEach((slot) => answers.push(this._getSlottedAnswer(slot)));
    return answers;
  }
  /**
   * converts an answer in a slot to an object
   *
   * @returns {object}
   * @memberof MultipleChoice
   */
  _getSlottedAnswer(slot) {
    let answer = {
      label: (slot.value || slot.innerHTML).trim(),
      correct:
        slot.slot == "incorrect-answer" || !!slot.getAttribute("correct")
          ? false
          : true,
    };

    //handle legacy slottes content
    if (slot.tagName === "INPUT") {
      slot.remove();
      this._setSlottedAnswer(answer);
    }
    return answer;
  }

  /**
   * makes sure each answer object is represented by slotted content
   *
   * @param {object} answer object representing a single answer
   * @memberof MultipleChoice
   */
  _setSlottedAnswer(answer) {
    this._setSlottedText(
      answer.label,
      answer.correct ? "correct-answer" : "incorrect-answer"
    );
  }

  /**
   * makes sure all answrs in array are represented by slotted content
   *
   * @param {array}  array array of objects representing answers data
   * @memberof MultipleChoice
   */
  _setSlottedAnswers() {
    let answers =
      typeof this.answers === "string"
        ? JSON.parse(this.answers)
        : this.answers;
    if (answers.length > 0) {
      Array.from(
        this.querySelectorAll(
          '[slot="correct-answer"],[slot="incorrect-answer"],input'
        )
      ).map((slot) => slot.remove());
      answers.forEach((answer) => this._setSlottedAnswer(answer));
      this.answers = answers;
    }
  }
  /**
   * converts properties to actual slots
   *
   * @param {string} text text to be added to a slot
   * @param {string} slotName name of slot
   * @param {boolean} [prepend=false] whether this slot should added at the beginning
   * @returns {string} text
   * @memberof MultipleChoice
   */
  _setSlottedText(text, slotName, prepend = false) {
    //only make a new node if one doesn't exist
    if (
      !["question", "correct-feedback", "incorrect-feedback"].includes(
        slotName
      ) ||
      !this.querySelector(`[slot=${slotName}]`)
    ) {
      let p = document.createElement("p");
      p.slot = slotName;
      p.innerHTML = text;
      if (prepend) {
        this.insertBefore(p, this.firstChild);
      } else {
        this.appendChild(p);
      }
      // otherwise update the exsiting one
    } else {
      this.querySelector(`[slot=${slotName}]`).innerHTML = text;
    }
  }
  /**
   *
   *
   * @param {string} slotName name of slot
   * @param {string} propName name of property that gets updated
   * @memberof MultipleChoice
   */
  _getSlottedText(propName, slotName) {
    let selector = `[slot=${slotName}]`,
      query = this.querySelector(selector),
      text = query && query.innerHTML ? query.innerHTML.trim() : undefined;
    if (!this[propName] || this[propName].trim() !== text)
      this[propName] = text;
  }
  /**
   * updates properties based on slots
   * on first update and in switching form editMode
   *
   * @param {boolean} [init=false] called from firstUpdated()
   * @memberof MultipleChoice
   */
  _handleSlotChange(init = false) {
    this.answers = this._getSlottedAnswers();

    //update all the other proerties from slots
    let others = {
      title: "question",
      correctText: "correct-feedback",
      incorrectText: "incorrect-feedback",
    };
    Object.keys(others).forEach((key) => {
      //when first updating if a property is already set, just add a slot
      if (!!this[key] && init) {
        this._setSlottedText(this[key], others[key], key == "question");

        //otherwise set property based on what's in slot
      } else if (!init || !this[key]) {
        this._getSlottedText(key, others[key]);
      }
    });
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.setAttribute("typeof", "oer:Assessment");
    // check lightdom on setup for answers to be read in
    // this only happens on initial paint
    if (this.children.length > 0) {
      this._handleSlotChange(true);
    } else {
      this._setSlottedAnswers();
      this._setSlottedText(this.correctText, "correct-feedback");
      this._setSlottedText(this.incorrectText, "incorrect-feedback");
      this._setSlottedText(this.title, "question", true);
    }
  }
}
window.customElements.define(MultipleChoice.tag, MultipleChoice);
export { MultipleChoice };
