import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
/**
 * `self-check`
 * 
### Styling

`<self-check>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--a11y-collapse-margin` | margin around a11y-collapse | 15px 0
`--self-check-question-color` | question background color | var(--simple-colors-default-theme-grey-1, #fff)
`--self-check-question-text` | question text color  | var(--simple-colors-default-theme-grey-12, #000)
`--self-check-heading-color` | heading background color | var(--simple-colors-default-theme-accent-8, #444)
`--self-check-heading-text` | heading text color | var(--simple-colors-default-theme-grey-1, #fff)
`--self-check-answer-color` | answer background color | var(--simple-colors-default-theme-light-green-8, #00762e)
`--self-check-answer-text` | answer text color | var(--simple-colors-default-theme-grey-1, #fff)
 * 

 * @extends LitElement
 * @extends SimpleColors
 * @extends SchemaBehaviors
 * @demo ./demo/index.html
 * @element self-check
 * 
 */
class SelfCheck extends SchemaBehaviors(SimpleColors) {
  constructor() {
    super();
    this.correct = false;
    this.alt = "";
    this.image = "";
    this.question = "";
    this.title = "Self-Check";
    import("@lrnwebcomponents/user-action/user-action.js");
    import("@polymer/paper-card/paper-card.js");
    import("@polymer/paper-icon-button/paper-icon-button.js");
    import("@polymer/iron-icons/editor-icons.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");
  }
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          margin: 15px 0;
        }
        :host([hidden]),
        *[hidden] {
          display: none !important;
        }

        paper-card {
          width: 100%;
          color: var(
            --self-check-question-text,
            var(--simple-colors-default-theme-grey-12, #000)
          );
          background-color: var(
            --self-check-question-color,
            var(--simple-colors-default-theme-grey-1, #fff)
          );
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
          color: var(
            --self-check-heading-text,
            var(--simple-colors-default-theme-grey-1, #fff)
          );
        }

        .heading {
          text-transform: uppercase;
          font-size: 22px;
          margin: 10px;
          color: var(
            --self-check-heading-text,
            var(--simple-colors-default-theme-grey-1, #fff)
          );
        }

        #header_wrap {
          color: var(
            --self-check-heading-text,
            var(--simple-colors-default-theme-grey-1, #fff)
          );
          background-color: var(
            --self-check-heading-color,
            var(--simple-colors-default-theme-accent-8, #444)
          );
          display: inline-flex;
          width: 100%;
          margin: -20px 0 0;
        }

        #question_wrap {
          color: var(
            --self-check-question-text,
            var(--simple-colors-default-theme-grey-12, #000)
          );
          background-color: var(
            --self-check-question-color,
            var(--simple-colors-default-theme-grey-1, #fff)
          );
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
          color: var(
            --self-check-answer-text,
            var(--simple-colors-default-theme-grey-1, #fff)
          );
          background-color: var(
            --self-check-answer-color,
            var(--simple-colors-default-theme-light-green-8, #00762e)
          );
          border-top: 2px solid
            var(
              --self-check-answer-text,
              var(--simple-colors-default-theme-grey-1, #fff)
            );
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
          border-bottom: 20px solid
            var(
              --self-check-heading-color,
              var(--simple-colors-default-theme-accent-8, #444)
            );
          position: relative;
          top: -20px;
          left: -1px;
        }

        .more_info {
          display: inline;
        }

        .more_info a {
          color: var(
            --self-check-answer-text,
            var(--simple-colors-default-theme-grey-1, #fff)
          );
        }

        .more_info a:hover {
          text-decoration: none;
        }
      `
    ];
  }
  render() {
    return html`
      <paper-card image="${this.image}" alt="${this.alt}">
        <div class="triangle"></div>
        <div id="header_wrap">
          <iron-icon id="questionmark" icon="icons:help"></iron-icon>
          <div class="heading">${this.title}</div>
        </div>
        <div id="question_wrap">
          <div class="question" aria-hidden="${this.correct}">
            <slot name="question"></slot>
            <div class="check_button">
              <paper-icon-button
                controls="answer_wrap"
                aria-label="Reveal Answer"
                id="checkBtn"
                icon="icons:check-circle"
                noink
                @click="${this.openAnswer}"
              ></paper-icon-button>
              <simple-tooltip aria-hidden="true" for="checkBtn" position="left">
                Reveal Answer
              </simple-tooltip>
            </div>
          </div>
          <div
            id="answer_wrap"
            aria-hidden="${this.correct ? "false" : "true"}"
            aria-live="polite"
          >
            <div class="answer">
              <user-action track="visibility">
                <slot></slot>
              </user-action>
              ${this.link
                ? html`
                    <div class="more_info">
                      <user-action track="click" every
                        ><a href="${this.link}" target="_blank"
                          >More info...</a
                        ></user-action
                      >
                    </div>
                  `
                : ``}
              <div class="close_button">
                <paper-icon-button
                  aria-label="Close"
                  id="closeBtn"
                  icon="icons:close"
                  @click="${this.openAnswer}"
                  noink
                >
                </paper-icon-button>
                <simple-tooltip
                  aria-hidden="true"
                  for="closeBtn"
                  position="left"
                >
                  Close
                </simple-tooltip>
              </div>
            </div>
          </div>
        </div>
      </paper-card>
    `;
  }

  static get tag() {
    return "self-check";
  }
  static get properties() {
    return {
      ...super.properties,

      /**
       * Title.
       */
      title: {
        type: String
      },
      /**
       * Question.
       */
      question: {
        type: String
      },
      /**
       * Image.
       */
      image: {
        type: String,
        reflect: true
      },
      /**
       * Alt text for image.
       */
      alt: {
        type: String,
        reflect: true
      },
      /**
       * Link for more information.
       */
      link: {
        type: String,
        reflect: true
      },
      /**
       * Property for toggling "checkbtn".
       */
      correct: {
        type: Boolean,
        reflect: true
      }
    };
  }

  /**
   * Property for toggling "checkbtn".
   */

  openAnswer(e) {
    this.correct = !this.correct;
  }
  static get haxProperties() {
    return {
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
            inputMethod: "haxupload",
            validationType: "url"
          },
          {
            property: "link",
            title: "More link",
            description: "Link to additional information",
            inputMethod: "haxupload",
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
      },
      saveOptions: {
        unsetAttributes: ["colors"]
      }
    };
  }
}
window.customElements.define(SelfCheck.tag, SelfCheck);
export { SelfCheck };
