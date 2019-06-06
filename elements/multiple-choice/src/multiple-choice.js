import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@polymer/paper-toast/paper-toast.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `multiple-choice`
 * `Ask the user a question from a set of possible answers.`
 * @demo demo/index.html
 */
class MultipleChoice extends SchemaBehaviors(SimpleColors) {
  static get tag() {
    return "multiple-choice";
  }
  constructor() {
    super();
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/iron-icon/iron-icon.js");
    import("@polymer/paper-button/paper-button.js");
  }
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          padding: 16px 16px 54px 16px;
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
      </style>
      <meta property="oer:assessing" content\$="[[relatedResource]]" />
      <h3 hidden\$="[[hideTitle]]">
        <span property="oer:name">[[title]]</span>
      </h3>
      <div>[[question]]</div>
      <template is="dom-if" if="[[singleOption]]" restamp>
        <paper-radio-group>
          <template
            is="dom-repeat"
            items="[[displayedAnswers]]"
            as="answer"
            mutable-data
          >
            <paper-radio-button
              disabled\$="[[disabled]]"
              property="oer:answer"
              name$="[[index]]"
              checked="{{answer.userGuess}}"
              >[[answer.label]]</paper-radio-button
            >
          </template>
        </paper-radio-group>
      </template>
      <template is="dom-if" if="[[!singleOption]]" restamp>
        <ul>
          <template
            is="dom-repeat"
            items="[[displayedAnswers]]"
            as="answer"
            mutable-data
          >
            <li>
              <paper-checkbox
                disabled\$="[[disabled]]"
                property="oer:answer"
                checked="{{answer.userGuess}}"
                >[[answer.label]]</paper-checkbox
              >
            </li>
          </template>
        </ul>
      </template>
      <div hidden\$="[[hideButtons]]">
        <paper-button
          disabled\$="[[disabled]]"
          raised=""
          on-click="_verifyAnswers"
          >[[checkLabel]]</paper-button
        >
        <paper-button
          disabled\$="[[disabled]]"
          raised=""
          on-click="resetAnswers"
          >[[resetLabel]]</paper-button
        >
      </div>
      <paper-toast
        id="toast"
        duration="6000"
        class\$="fit-bottom [[__toastColor]]"
      >
        [[__toastText]]
        <iron-icon icon="[[__toastIcon]]" style="margin-left:16px;"></iron-icon>
      </paper-toast>
    `;
  }
  static get properties() {
    let props = {
      /**
       * Title
       */
      title: {
        type: String,
        value: ""
      },
      /**
       * Support disabling interaction with the entire board
       */
      disabled: {
        type: Boolean,
        value: false
      },
      /**
       * Simple option, otherwise allow multiple via checkbox
       */
      singleOption: {
        type: Boolean,
        value: false
      },
      /**
       * Text of the label to check your answer
       */
      checkLabel: {
        type: String,
        value: "Check answer"
      },
      /**
       * Text of the reset button
       */
      resetLabel: {
        type: String,
        value: "Reset"
      },
      /**
       * Related Resource ID
       */
      relatedResource: {
        type: String
      },
      /**
       * Flag to hide the title
       */
      hideTitle: {
        type: Boolean,
        value: false
      },
      /**
       * Question to ask
       */
      question: {
        type: String,
        value: ""
      },
      /**
       * Array of possible answers
       */
      answers: {
        type: Array,
        value: [],
        notify: true
      },
      /**
       * Displayed Answer set.
       */
      displayedAnswers: {
        type: Array,
        computed: "_computeDisplayedAnswers(answers, randomize)",
        observer: "_valueChanged",
        notify: true
      },
      /**
       * Correct answer text to display
       */
      correctText: {
        type: String,
        value: "Great job!"
      },
      /**
       * Incorrect answer text to display
       */
      incorrectText: {
        type: String,
        value: "Better luck next time!"
      },
      /**
       * Name of the quiz - hardcoded for now from HTML
       */
      quizName: {
        type: String,
        value: "Default Quiz"
      },
      /**
       * Randomize the display of the answers
       */
      randomize: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * flag to hide buttons
       */
      hideButtons: {
        type: Boolean,
        value: false
      }
    };
    if (super.properties) {
      props = Object.assign(props, super.properties);
    }
    return props;
  }
  /**
   * Notice an answer has changed and update the DOM.
   */
  _valueChanged(e) {
    for (var i in e) {
      for (var j in e[i]) {
        this.notifyPath("displayedAnswers." + i + "." + j);
      }
    }
  }
  /**
   * Reset user answers and shuffle the board again.
   */
  resetAnswers(e) {
    this.$.toast.hide();
    // loop and force all answers to false
    for (var i in this.displayedAnswers) {
      if (this.displayedAnswers[i].userGuess) {
        this.displayedAnswers[i].userGuess = false;
      }
    }
    setTimeout(() => {
      const answers = this.answers;
      this.set("answers", []);
      this.set("answers", answers);
    }, 100);
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
    let gotRight = this.checkAnswers();
    // see if they got this correct based on their answers
    if (gotRight) {
      this.$.toast.hide();
      this.__toastColor = "green";
      this.__toastIcon = "thumb-up";
      this.__toastText = this.correctText;
      this.$.toast.show();
    } else {
      this.$.toast.hide();
      this.__toastColor = "red";
      this.__toastIcon = "thumb-down";
      this.__toastText = this.incorrectText;
      this.$.toast.show();
    }
    // start of data passing, this is a prototype atm
    let eventData = [""];
    eventData = {
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
        icon: "icons:list",
        color: "purple",
        groups: ["Instructional"],
        handles: [],
        meta: {
          author: "LRNWebComponents"
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
            property: "incorrectText",
            title: "Incorrect feedback",
            description: "Feedback when they get it wrong",
            inputMethod: "textfield"
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
        unsetAttributes: ["displayed-answers"]
      }
    };
  }
  /**
   * Attached to the DOM, now fire.
   */
  connectedCallback() {
    super.connectedCallback();
    // single option implies it's a radio group or if multiple, do check boxes
    if (this.singleOption) {
      import("@polymer/paper-radio-group/paper-radio-group.js");
      import("@polymer/paper-radio-button/paper-radio-button.js");
    } else {
      import("@polymer/paper-checkbox/paper-checkbox.js");
    }
    this.setAttribute("typeof", "oer:Assessment");
    afterNextRender(this, function() {
      this.$.toast.fitInto = this;
      this.HAXWiring = new HAXWiring();
      this.HAXWiring.setup(
        MultipleChoice.haxProperties,
        MultipleChoice.tag,
        this
      );
    });
  }
}
window.customElements.define(MultipleChoice.tag, MultipleChoice);
export { MultipleChoice };
