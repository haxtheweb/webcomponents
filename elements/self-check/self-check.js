import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@lrnwebcomponents/a11y-behaviors/a11y-behaviors.js";
/**
`self-check`
A LRN element

* @demo demo/index.html

@microcopy - the mental model for this element
 -
 CSS Variables that override accent color:
 --self-check-question-color //overrides the question background color
 --self-check-question-text //overrides the question text color
 --self-check-heading-color //overrides the heading background color
 --self-check-heading-text //overrides the heading text color
 --self-check-answer-color //overrides the answer background color
 --self-check-answer-text //overrides the answer text color

*/
let SelfCheck = Polymer({
  _template: html`
    <style is="custom-style" include="simple-colors">
      :host {
        display: block;
        margin: 15px 0;
        --self-check-question-color: var(
          --simple-colors-default-theme-grey-1,
          #fff
        );
        --self-check-question-text: var(
          --simple-colors-default-theme-grey-12,
          #000
        );
        --self-check-heading-color: var(
          --simple-colors-default-theme-accent-8,
          #444
        );
        --self-check-heading-text: var(
          --simple-colors-default-theme-grey-1,
          #fff
        );
        --self-check-answer-color: var(
          --simple-colors-default-theme-light-green-8,
          #00762e
        );
        --self-check-answer-text: var(
          --simple-colors-default-theme-grey-1,
          #fff
        );
      }
      [hidden] {
        display: none !important;
      }

      paper-card {
        width: 100%;
        color: var(--self-check-question-text);
        background-color: var(--self-check-question-color);
        overflow: hidden;
      }

      paper-icon-button#checkbtn {
        width: 50px;
        height: 50px;
        position: relative;
        left: 16px;
        bottom: -10px;
      }

      .check_button {
        display: flex;
        justify-content: flex-end;
      }

      paper-icon-button#closeBtn {
        width: 50px;
        height: 50px;
        position: relative;
        left: 16px;
        bottom: -16px;
      }

      .close_button {
        display: flex;
        justify-content: flex-end;
      }

      iron-icon#questionmark {
        width: 35px;
        height: 35px;
        padding: 5px;
        color: #ffffff;
      }

      .heading {
        text-transform: uppercase;
        font-size: 22px;
        margin: 10px;
        color: #ffffff;
      }

      #header_wrap {
        color: var(--self-check-heading-text);
        background-color: var(--self-check-heading-color);
        display: inline-flex;
        width: 100%;
        margin: -20px 0 0;
      }

      #question_wrap {
        color: var(--self-check-question-text);
        background-color: var(--self-check-question-color);
        position: relative;
      }

      .question {
        font-size: 16px;
        padding: 15px 15px;
      }

      :host([correct]) .question {
        display: none;
      }

      #answer_wrap {
        visibility: hidden;
        opacity: 0;
        color: var(--self-check-answer-text);
        background-color: var(--self-check-answer-color);
        border-top: 2px solid var(--self-check-answer-text);
        width: 100%;
        top: 0;
        transition: all 0.2s ease;
        left: calc(100%);
        position: absolute;
      }

      :host([correct]) #answer_wrap {
        visibility: visible;
        opacity: 1;
        position: relative;
        left: 0;
      }

      .answer {
        font-size: 16px;
        padding: 15px;
        line-height: 19.2px;
      }

      #quote_start {
        display: inline-flex;
        transform: rotateY(180deg);
      }

      #quote_end {
        display: inline-flex;
      }

      .triangle {
        width: 0;
        height: 0;
        border-left: 20px solid transparent;
        border-right: 20px solid transparent;
        border-bottom: 20px solid var(--self-check-heading-color);
        position: relative;
        top: -20px;
        left: -1px;
      }

      .more_info {
        display: inline;
      }

      .more_info a {
        color: var(--self-check-answer-text);
      }

      .more_info a:hover {
        text-decoration: none;
      }
    </style>

    <paper-card image$="[[image]]" alt$="[[alt]]">
      <div class="triangle"></div>
      <div id="header_wrap">
        <iron-icon id="questionmark" icon="icons:help"></iron-icon>
        <div class="heading">[[title]]</div>
      </div>
      <div id="question_wrap">
        <div class="question" aria-hidden$="[[correct]]">
          <slot name="question"></slot>
          <div class="check_button">
            <paper-icon-button
              controls="answer_wrap"
              aria-label="Reveal Answer"
              id="checkBtn"
              icon="icons:check-circle"
              on-click="openAnswer"
              noink
            >
            </paper-icon-button>
            <paper-tooltip aria-hidden="true" for="checkBtn" position="left">
              Reveal Answer
            </paper-tooltip>
          </div>
        </div>

        <div id="answer_wrap" aria-hidden$="[[!correct]]" aria-live="polite">
          <div class="answer">
            <slot></slot>
            <div class="more_info" hidden$="[[!link]]">
              <a href$="[[link]]" target="_blank">More info...</a>
            </div>
            <div class="close_button">
              <paper-icon-button
                aria-label="Close"
                id="closeBtn"
                icon="icons:close"
                on-click="openAnswer"
                noink
              >
              </paper-icon-button>
              <paper-tooltip aria-hidden="true" for="closeBtn" position="left">
                Close
              </paper-tooltip>
            </div>
          </div>
        </div>
      </div>
    </paper-card>
  `,

  is: "self-check",

  behaviors: [
    HAXBehaviors.PropertiesBehaviors,
    SchemaBehaviors.Schema,
    A11yBehaviors.A11y,
    SimpleColors
  ],

  properties: {
    /**
     * Title.
     */
    title: {
      type: String,
      value: "Self-Check"
    },
    /**
     * Question.
     */
    question: {
      type: String,
      value: ""
    },
    /**
     * Image.
     */
    image: {
      type: String,
      value: "",
      reflectToAttribute: true
    },
    /**
     * Alt text for image.
     */
    alt: {
      type: String,
      value: "",
      reflectToAttribute: true
    },
    /**
     * Link for more information.
     */
    link: {
      type: String,
      reflectToAttribute: true
    },
    /**
     * Property for toggling "checkbtn".
     */
    correct: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    }
  },

  /**
   * Property for toggling "checkbtn".
   */

  openAnswer: function(e) {
    this.correct = !this.correct;
  },

  /**
   * Attached to the DOM, now fire.
   */
  attached: function() {
    // Establish hax property binding
    let props = {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Self-Check",
        description: "The user will be able to complete a self-check.",
        icon: "icons:check-circle",
        color: "orange",
        groups: ["Image", "Assessment"],
        handles: [
          {
            type: "image",
            source: "image",
            title: "question",
            description: "answer"
          }
        ],
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
            property: "image",
            title: "Image",
            description: "The image of the element",
            inputMethod: "textfield",
            icon: "editor:insert-photo"
          },
          {
            property: "link",
            title: "More link",
            description: "Link to additional information",
            inputMethod: "textfield",
            validationType: "url",
            icon: "icons:link"
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
            property: "accentColor",
            title: "Accent Color",
            description: "The accent color of the self-check",
            inputMethod: "colorpicker",
            icon: "editor:format-color-fill"
          },
          {
            property: "dark",
            title: "Dark Theme",
            description: "Enable Dark Theme",
            inputMethod: "boolean",
            icon: "icons:invert-colors"
          },
          {
            property: "image",
            title: "Image",
            description: "The image of the element",
            inputMethod: "textfield",
            validationType: "url"
          },
          {
            property: "link",
            title: "More link",
            description: "Link to additional information",
            inputMethod: "textfield",
            validationType: "url"
          },
          {
            property: "alt",
            title: "Alt Text",
            description: "Add alt text to the image",
            inputMethod: "alt"
          },
          {
            slot: "question",
            title: "Question to ask",
            description:
              "This is where you enter a question for the self-check.",
            inputMethod: "code-editor",
            required: true
          },
          {
            slot: "",
            title: "Answer",
            description:
              "This is where you enter a question for the self-check.",
            inputMethod: "code-editor",
            required: true
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(props);
  }
});
export { SelfCheck };
