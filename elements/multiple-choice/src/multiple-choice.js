import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-checkbox/paper-checkbox.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-toast/paper-toast.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
/**
`multiple-choice`
Ask the user a question from a set of possible answers.

@demo demo/index.html

@microcopy - the mental model for this element
 -

*/
Polymer({
  _template: html`
    <style include="materializecss-styles">
      :host {
        display: block;
        padding: 16px 16px 54px 16px;
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
      paper-checkbox {
        padding: 8px;
      }
      iron-icon {
        display: inline-flex;
      }
    </style>
    <meta property="oer:assessing" content\$="[[relatedResource]]">
    <h3 hidden\$="[[hideTitle]]"><span property="oer:name">[[title]]</span></h3>
    <div>[[question]]</div>
    <ul>
      <template is="dom-repeat" items="[[displayedAnswers]]" as="answer">
        <li><paper-checkbox disabled\$="[[disabled]]" property="oer:answer" checked="{{answer.userGuess}}">[[answer.label]]</paper-checkbox></li>
      </template>
    </ul>
    <div hidden\$="[[hideButtons]]">
      <paper-button disabled\$="[[disabled]]" raised="" on-tap="_verifyAnswers">[[checkLabel]]</paper-button>
      <paper-button disabled\$="[[disabled]]" raised="" on-tap="_resetAnswers">[[resetLabel]]</paper-button>
    </div>
    <paper-toast id="toast" duration="6000" class\$="fit-bottom [[__toastColor]]">
    [[__toastText]]
    <iron-icon icon="[[__toastIcon]]" style="margin-left:16px;"></iron-icon>
    </paper-toast>
`,

  is: "multiple-choice",

  hostAttributes: {
    typeof: "oer:Assessment"
  },

  behaviors: [
    HAXBehaviors.PropertiesBehaviors,
    MaterializeCSSBehaviors.ColorBehaviors,
    SchemaBehaviors.Schema
  ],

  observers: ["_valueChanged(displayedAnswers.*)"],

  properties: {
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
  },

  /**
   * Notice an answer has changed and update the DOM.
   */
  _valueChanged: function(e) {
    for (var i in e.base) {
      for (var j in e.base[i]) {
        this.notifyPath("displayedAnswers." + i + "." + j);
      }
    }
  },

  /**
   * Reset user answers and shuffle the board again.
   */
  _resetAnswers: function(e) {
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
  },

  /**
   * Return if the current answers are correct
   */
  checkAnswers: function() {
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
  },

  /**
   * Verify the answers of the user based on their saying
   * that they want to see how they did.
   */
  _verifyAnswers: function(e) {
    let gotRight = this.checkAnswers();
    // see if they got this correct based on their answers
    if (gotRight) {
      this.$.toast.hide();
      this.__toastColor = "green darken-4";
      this.__toastIcon = "thumb-up";
      this.__toastText = this.correctText;
      this.$.toast.show();
    } else {
      this.$.toast.hide();
      this.__toastColor = "red darken-4";
      this.__toastIcon = "thumb-down";
      this.__toastText = this.incorrectText;
      this.$.toast.show();
    }
  },

  /**
   * Figure out the order of the answers which will be displayed
   */
  _computeDisplayedAnswers: function(answers, randomize) {
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
  },

  /**
   * Attached to the DOM, now fire.
   */
  attached: function() {
    this.$.toast.fitInto = this;
    // Establish hax property binding
    let props = {
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
    this.setHaxProperties(props);
  }
});
