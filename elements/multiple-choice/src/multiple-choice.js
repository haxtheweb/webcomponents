import { html, css } from "lit-element/lit-element.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `multiple-choice`
 * `Ask the user a question from a set of possible answers.`
 * @demo demo/index.html
 * @element multiple-choice
 */
class MultipleChoice extends SchemaBehaviors(SimpleColors) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          padding: 16px 16px 54px 16px;
          background-color: var(--simple-colors-default-theme-grey-1);
          color: var(--simple-colors-default-theme-grey-12);
          --paper-checkbox-unchecked-color: var(
            --simple-colors-default-theme-grey-12
          );
          --paper-checkbox-unchecked-ink-color: var(
            --simple-colors-default-theme-grey-12
          );
          --paper-checkbox-checked-color: var(
            --simple-colors-default-theme-accent-8
          );
          --paper-checkbox-checked-ink-color: var(
            --simple-colors-default-theme-accent-8
          );
          --paper-checkbox-checkmark-color: var(
            --simple-colors-default-theme-grey-1
          );
          --paper-checkbox-label-color: var(
            --simple-colors-default-theme-grey-12
          );
          --paper-checkbox-error-color: var(
            --simple-colors-default-theme-red-8
          );
        }
        :host([accent-color="grey"]),
        :host([accent-color="red"]),
        :host([accent-color="green"]) {
          --paper-checkbox-checked-color: var(
            --simple-colors-default-theme-blue-8
          );
          --paper-checkbox-checked-ink-color: var(
            --simple-colors-default-theme-blue-8
          );
        }
        :host #check {
          background-color: var(--simple-colors-default-theme-accent-8);
          color: var(--simple-colors-default-theme-grey-1);
        }
        :host #check:hover {
          background-color: var(--simple-colors-default-theme-accent-9);
        }
        :host([accent-color="red"]) #check,
        :host([accent-color="green"]) #check {
          background-color: var(--simple-colors-default-theme-blue-8);
          color: var(--simple-colors-default-theme-grey-1);
        }
        :host([accent-color="red"]) #check:hover,
        :host([accent-color="green"]) #check:hover {
          background-color: var(--simple-colors-default-theme-blue-9);
        }
        :host([accent-color="grey"]) #check,
        :host paper-button {
          background-color: var(--simple-colors-default-theme-grey-1);
          color: var(--simple-colors-default-theme-grey-12);
        }
        :host([accent-color="grey"]) #check:hover,
        :host paper-button:hover {
          cursor: pointer;
          background-color: var(--simple-colors-default-theme-grey-2);
          color: var(--simple-colors-default-theme-grey-12);
        }
        .red {
          background-color: var(--simple-colors-default-theme-red-8);
        }
        .green {
          background-color: var(--simple-colors-default-theme-green-8);
        }
        h3 {
          margin: 8px;
        }
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        ul li {
          padding: 8px;
        }
        paper-radio-button {
          padding: 8px;
          display: block;
        }
        paper-checkbox {
          padding: 8px;
        }
        iron-icon {
          display: inline-flex;
        }
      `
    ];
  }
  static get tag() {
    return "multiple-choice";
  }
  constructor() {
    super();
    import("@polymer/paper-toast/paper-toast.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/iron-icon/iron-icon.js");
    import("@polymer/paper-button/paper-button.js");
    this.randomize = false;
    this.hideButtons = false;
    this.title = "";
    this.disabled = false;
    this.singleOption = false;
    this.checkLabel = "Check answer";
    this.resetLabel = "Reset";
    this.hideTitle = false;
    this.question = "";
    this.answers = [];
    this.displayedAnswers = [];
    this.correctText = "Great job!";
    this.correctIcon = "icons:thumb-up";
    this.incorrectText = "Better luck next time!";
    this.incorrectIcon = "icons:thumb-down";
    this.quizName = "default";
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
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
              value: this[propName]
            }
          })
        );
      }
      if (["answers", "randomize"].includes(propName)) {
        this.displayedAnswers = [
          ...this._computeDisplayedAnswers(this.answers, this.randomize)
        ];
      }
      // single option implies it's a radio group or if multiple, do check boxes
      if (propName == "singleOption") {
        this.singleOptionChanged(this[propName]);
      }
    });
  }
  singleOptionChanged(singleOption) {
    if (singleOption) {
      import("@polymer/paper-radio-group/paper-radio-group.js");
      import("@polymer/paper-radio-button/paper-radio-button.js");
    } else {
      import("@polymer/paper-checkbox/paper-checkbox.js");
    }
  }
  render() {
    return html`
      <meta property="oer:assessing" content="${this.relatedResource}" />
      ${!this.hideTitle
        ? html`
            <h3><span property="oer:name">${this.title}</span></h3>
          `
        : ``}
      <div>${this.question}</div>
      ${this.singleOption
        ? html`
            <paper-radio-group>
              ${this.displayedAnswers.map(
                (answer, index) => html`
                  <paper-radio-button
                    ?disabled="${this.disabled}"
                    property="oer:answer"
                    name="${index}"
                    ?checked="${answer.userGuess}"
                    @checked-changed="${this.checkedEvent}"
                    >${answer.label}</paper-radio-button
                  >
                `
              )}
            </paper-radio-group>
          `
        : html`
            <ul>
              ${this.displayedAnswers.map(
                (answer, index) => html`
                  <li>
                    <paper-checkbox
                      ?disabled="${this.disabled}"
                      property="oer:answer"
                      name="${index}"
                      ?checked="${answer.userGuess}"
                      @checked-changed="${this.checkedEvent}"
                      >${answer.label}</paper-checkbox
                    >
                  </li>
                `
              )}
            </ul>
          `}
      ${!this.hideButtons
        ? html`
            <div id="buttons">
              <paper-button
                id="check"
                ?disabled="${this.disabled}"
                raised
                @click="${this._verifyAnswers}"
                >${this.checkLabel}</paper-button
              >
              <paper-button
                id="reset"
                ?disabled="${this.disabled}"
                raised
                @click="${this.resetAnswers}"
                >${this.resetLabel}</paper-button
              >
            </div>
          `
        : ``}
      <paper-toast
        id="toast"
        scroll-action="cancel"
        duration="6000"
        position-target="${this.positionTarget}"
        class="fit-bottom ${this.__toastColor}"
      >
        ${this.__toastText}
        <iron-icon
          icon="${this.__toastIcon}"
          style="margin-left:16px;"
        ></iron-icon>
      </paper-toast>
    `;
  }
  checkedEvent(e) {
    let attr = this.displayedAnswers;
    attr[e.target.name].userGuess = e.detail.value;
    this.displayedAnswers = [...attr];
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * Title
       */
      title: {
        type: String
      },
      positionTarget: {
        type: Object
      },
      /**
       * Support disabling interaction with the entire board
       */
      disabled: {
        type: Boolean
      },
      /**
       * Simple option, otherwise allow multiple via checkbox
       */
      singleOption: {
        type: Boolean,
        attribute: "single-option"
      },
      /**
       * Text of the label to check your answer
       */
      checkLabel: {
        type: String,
        attribute: "check-label"
      },
      /**
       * Text of the reset button
       */
      resetLabel: {
        type: String,
        attribute: "reset-label"
      },
      /**
       * Related Resource ID
       */
      relatedResource: {
        type: String,
        attribute: "related-resource"
      },
      /**
       * Flag to hide the title
       */
      hideTitle: {
        type: Boolean,
        attribute: "hide-title"
      },
      /**
       * Question to ask
       */
      question: {
        type: String
      },
      /**
       * Array of possible answers
       */
      answers: {
        type: Array
      },
      /**
       * Displayed Answer set.
       */
      displayedAnswers: {
        type: Array
      },
      /**
       * Correct answer text to display
       */
      correctText: {
        type: String,
        attribute: "correct-text"
      },
      /**
       * Incorrect answer text to display
       */
      incorrectText: {
        type: String,
        attribute: "incorrect-text"
      },
      /**
       * Correct answer text to display
       */
      correctIcon: {
        type: String,
        attribute: "correct-icon"
      },
      /**
       * Incorrect answer text to display
       */
      incorrectIcon: {
        type: String,
        attribute: "incorrect-icon"
      },
      /**
       * Name of the quiz - hardcoded for now from HTML
       */
      quizName: {
        type: String,
        attribute: "quiz-name"
      },
      /**
       * Randomize the display of the answers
       */
      randomize: {
        type: Boolean,
        reflect: true
      },
      /**
       * flag to hide buttons
       */
      hideButtons: {
        type: Boolean,
        attribute: "hide-buttons"
      },
      __toastText: {
        type: String
      },
      __toastColor: {
        type: String
      },
      __toastIcon: {
        type: String
      }
    };
  }

  /**
   * Reset user answers and shuffle the board again.
   */
  resetAnswers(e) {
    this.shadowRoot.querySelector("#toast").hide();
    this.displayedAnswers = [];
    const answers = this.answers;
    this.answers.forEach(el => {
      el.userGuess = false;
    });
    this.answers = [...answers];
  }

  /**
   * Return if the current answers are correct
   */
  checkAnswers() {
    let gotRight = true;
    // see that they got them all right
    for (var i in this.displayedAnswers) {
      if (
        gotRight != false &&
        this.displayedAnswers[i].correct &&
        this.displayedAnswers[i].userGuess
      ) {
        gotRight = true;
      } else if (
        this.displayedAnswers[i].correct &&
        !this.displayedAnswers[i].userGuess
      ) {
        gotRight = false;
      } else if (
        !this.displayedAnswers[i].correct &&
        this.displayedAnswers[i].userGuess
      ) {
        gotRight = false;
      }
    }
    return gotRight;
  }
  /**
   * Verify the answers of the user based on their saying
   * that they want to see how they did.
   */
  _verifyAnswers(e) {
    this.shadowRoot.querySelector("#toast").hide();
    let gotRight = this.checkAnswers();
    // see if they got this correct based on their answers
    if (gotRight) {
      this.__toastColor = "green";
      this.__toastIcon = this.correctIcon;
      this.__toastText = this.correctText;
    } else {
      this.__toastColor = "red";
      this.__toastIcon = this.incorrectIcon;
      this.__toastText = this.incorrectText;
    }
    this.shadowRoot.querySelector("#toast").show();
    // start of data passing, this is a prototype atm
    let eventData = {
      activityDisplay: "answered",
      objectName: this.quizName,
      resultSuccess: gotRight
    };
    this.dispatchEvent(
      new CustomEvent("user-engagement", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: eventData
      })
    );
  }

  /**
   * Figure out the order of the answers which will be displayed
   */
  _computeDisplayedAnswers(answers, randomize) {
    if (
      typeof answers !== typeof undefined &&
      answers != null &&
      answers.length > 0 &&
      randomize
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
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Multiple choice",
        description: "Multiple choice self check",
        icon: "hax:multiple-choice",
        color: "purple",
        groups: ["Instructional"],
        handles: [],
        meta: {
          author: "ELMS:LN"
        }
      },
      settings: {
        quick: [
          {
            property: "title",
            title: "Title",
            description: "The title of the element",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "question",
            title: "Question",
            description: "Question for users to respond to.",
            inputMethod: "textfield",
            icon: "icons:help"
          }
        ],
        configure: [
          {
            property: "title",
            title: "Title",
            description: "The title of the element",
            inputMethod: "textfield"
          },
          {
            property: "hideTitle",
            title: "Hide title",
            description: "Whether or not to display the title",
            inputMethod: "boolean"
          },
          {
            property: "question",
            title: "Question",
            description: "Question for users to respond to.",
            inputMethod: "textfield"
          },
          {
            property: "randomize",
            title: "Randomize",
            description: "Randomize the answers dynamically",
            inputMethod: "boolean"
          },
          {
            property: "answers",
            title: "Answer set",
            description: "Answers in a multiple choice",
            inputMethod: "array",
            itemLabel: "label",
            properties: [
              {
                property: "correct",
                title: "Correct",
                description: "If this is correct or not",
                inputMethod: "boolean"
              },
              {
                property: "label",
                title: "Answer",
                description: "Possible answer to the question",
                inputMethod: "textfield",
                required: true
              }
            ]
          },
          {
            property: "correctText",
            title: "Correct feedback",
            description: "Feedback when they get it right",
            inputMethod: "textfield"
          },
          {
            property: "correctIcon",
            title: "Correct icon",
            description: "Icon to display when correct answer happens",
            inputMethod: "iconpicker",
            options: [
              "icons:trending-flat",
              "icons:launch",
              "icons:pan-tool",
              "icons:link",
              "icons:check",
              "icons:favorite",
              "icons:thumb-up",
              "icons:thumb-down",
              "icons:send"
            ]
          },
          {
            property: "incorrectText",
            title: "Incorrect feedback",
            description: "Feedback when they get it wrong",
            inputMethod: "textfield"
          },
          {
            property: "incorrectIcon",
            title: "Incorrect icon",
            description: "Icon to display when wrong answer happens",
            inputMethod: "iconpicker",
            options: [
              "icons:trending-flat",
              "icons:launch",
              "icons:pan-tool",
              "icons:link",
              "icons:check",
              "icons:favorite",
              "icons:thumb-up",
              "icons:thumb-down",
              "icons:send"
            ]
          },
          {
            property: "quizName",
            title: "Name of the quiz",
            description: "Quiz name passed in",
            inputMethod: "textfield"
          }
        ],
        advanced: [
          {
            property: "checkLabel",
            title: "Check answers label",
            description: "Label for getting solution feedback",
            inputMethod: "textfield"
          },
          {
            property: "resetLabel",
            title: "Reset label",
            description: "label for the reset button",
            inputMethod: "textfield"
          }
        ]
      },
      saveOptions: {
        unsetAttributes: [
          "__utils",
          "displayed-answers",
          "displayedAnswers",
          "colors"
        ]
      }
    };
  }
  /**
   * HAX preprocess Node to Content hook
   */
  preProcessHaxNodeToContent(node) {
    // ensure we dont accidently have the answer displayed!
    if (node.answers) {
      var answers = [];
      for (var i = 0; i < node.answers.length; i++) {
        let val = node.answers[i];
        // remove userGuess if its set in the DOM
        if (val.userGuess) {
          delete val.userGuess;
        }
        answers.push(val);
      }
      node.answers = [...answers];
    }
    return node;
  }
  /**
   * HAX preprocess insert content hook
   */
  preProcessHaxInsertContent(detail) {
    // ensure we dont accidently have the answer displayed!
    if (detail.properties.answers) {
      detail.properties.answers = detail.properties.answers.map(function(val) {
        if (val.userGuess) {
          delete val.userGuess;
        }
        return val;
      });
    }
    return detail;
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    if (this.shadowRoot.querySelector("#positionTarget")) {
      this.positionTarget = this.shadowRoot.querySelector("#positionTarget");
    }
    this.setAttribute("typeof", "oer:Assessment");
    this.shadowRoot.querySelector("#toast").fitInto = this;
  }
}
window.customElements.define(MultipleChoice.tag, MultipleChoice);
export { MultipleChoice };
