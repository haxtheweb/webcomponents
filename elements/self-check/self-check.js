import { LitElement, html, css, svg } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import { lazyImageLoader } from "@lrnwebcomponents/lazy-image-helpers/lazy-image-helpers.js";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
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
class SelfCheck extends I18NMixin(
  lazyImageLoader(SchemaBehaviors(SimpleColors))
) {
  constructor() {
    super();
    this.correct = false;
    this.alt = "";
    this.image = "";
    this.question = "";
    this.title = "Self-Check";
    this.t = {
      reveal: "Reveal Answer",
      close: "Close",
      more: "More information",
    };
    this.registerTranslation({
      context: this,
      basePath: import.meta.url,
      locales: ["en-UK", "ja"],
    });
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

        div.card {
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
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

        simple-icon-button {
          --simple-icon-width: 24px;
          --simple-icon-height: 24px;
          position: relative;
          left: 10px;
          bottom: -10px;
          padding: 2px;
        }

        .check_button {
          display: flex;
          justify-content: flex-end;
        }
        .close_button {
          display: flex;
          justify-content: flex-end;
        }

        simple-icon#questionmark {
          --simple-icon-width: 35px;
          --simple-icon-height: 35px;
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
          display: flex;
          align-items: center;
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
        .image-wrap {
          max-height: 400px;
          overflow: hidden;
        }
      `,
    ];
  }
  render() {
    return html`
      <div class="card">
        <div class="image-wrap">
          ${this.renderSVGLoader()}
          <img
            src="${this.image}"
            alt="${this.alt}"
            aria-describedby="${this.describedBy || ""}"
            loading="lazy"
          />
        </div>
        <div class="triangle"></div>
        <div id="header_wrap">
          <simple-icon
            id="questionmark"
            icon="icons:help"
            ?dark="${!this.dark}"
            contrast="4"
          ></simple-icon>
          <div class="heading" id="title">${this.title}</div>
        </div>
        <div id="question_wrap">
          <div class="question" aria-hidden="${this.correct}">
            <slot name="question"></slot>
            <div class="check_button">
              <simple-icon-button
                controls="answer_wrap"
                aria-label="${this.t.reveal}"
                id="checkBtn"
                class="check-btn"
                icon="icons:check-circle"
                ?dark="${this.dark}"
                @click="${this.openAnswer}"
              ></simple-icon-button>
              <simple-tooltip aria-hidden="true" for="checkBtn" position="left">
                ${this.t.reveal}
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
                          >${this.t.more}...</a
                        ></user-action
                      >
                    </div>
                  `
                : ``}
              <div class="close_button">
                <simple-icon-button
                  aria-label="${this.t.close}"
                  id="closeBtn"
                  dark
                  icon="icons:close"
                  @click="${this.openAnswer}"
                >
                </simple-icon-button>
                <simple-tooltip
                  aria-hidden="true"
                  for="closeBtn"
                  position="left"
                >
                  ${this.t.close}
                </simple-tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "elementVisible" && this.elementVisible) {
        import("@lrnwebcomponents/user-action/user-action.js");
        import("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");
      }
    });
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
        type: String,
      },
      /**
       * Question.
       */
      question: {
        type: String,
      },
      /**
       * Image.
       */
      image: {
        type: String,
        reflect: true,
      },
      /**
       * Alt text for image.
       */
      alt: {
        type: String,
        reflect: true,
      },
      /**
       * Aria-describedby data passed down to appropriate tag
       */
      describedBy: {
        type: String,
        attribute: "described-by",
      },
      /**
       * Link for more information.
       */
      link: {
        type: String,
        reflect: true,
      },
      /**
       * Property for toggling "checkbtn".
       */
      correct: {
        type: Boolean,
        reflect: true,
      },
    };
  }
  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      activeElementChanged: "haxactiveElementChanged",
    };
  }
  /**
   * double-check that we are set to inactivate click handlers
   * this is for when activated in a duplicate / adding new content state
   */
  haxactiveElementChanged(el, val) {
    // flag for HAX to not trigger active on changes
    let container = this.shadowRoot.querySelector("#title");
    if (val) {
      container.setAttribute("contenteditable", true);
    } else {
      container.removeAttribute("contenteditable");
      this.title = container.innerText;
    }
    return false;
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
      canEditSource: true,
      contentEditable: true,
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
            description: "answer",
            ariaDescribedby: "describedBy",
          },
        ],
        meta: {
          author: "ELMS:LN",
        },
      },
      settings: {
        configure: [
          {
            property: "title",
            title: "Title",
            description: "The title of the element",
            inputMethod: "textfield",
          },
          {
            property: "accentColor",
            title: "Accent Color",
            description: "The accent color of the self-check",
            inputMethod: "colorpicker",
            icon: "editor:format-color-fill",
          },
          {
            property: "dark",
            title: "Dark Theme",
            description: "Enable Dark Theme",
            inputMethod: "boolean",
            icon: "icons:invert-colors",
          },
          {
            property: "image",
            title: "Image",
            description: "The image of the element",
            inputMethod: "haxupload",
            validationType: "url",
          },
          {
            property: "link",
            title: "More link",
            description: "Link to additional information",
            inputMethod: "haxupload",
            validationType: "url",
          },
          {
            property: "alt",
            title: "Alt Text",
            description: "Add alt text to the image",
            inputMethod: "alt",
          },
        ],
        advanced: [
          {
            property: "describedBy",
            title: "aria-describedby",
            description:
              "Space-separated list of IDs for elements that describe the image.",
            inputMethod: "textfield",
          },
        ],
      },
      saveOptions: {
        unsetAttributes: ["colors", "image-loaded"],
      },
      demoSchema: [
        {
          tag: "self-check",
          properties: {
            "accent-color": "light-blue",
            title: "Sharks Self Check",
            image:
              "https://kids.nationalgeographic.com/content/dam/kids/photos/animals/Fish/A-G/great-white-shark-teeth.ngsversion.1396530884408.adapt.1900.1.jpg",
            alt: "Great White Shark",
          },
          content: `<span slot="question">How large can the average great white shark grow to be?</span>
          The Great White shark can grow to be 15 ft to more than 20 ft in length and weigh 2.5 tons or more.`,
        },
      ],
    };
  }
}
window.customElements.define(SelfCheck.tag, SelfCheck);
export { SelfCheck };
