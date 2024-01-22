import { LitElement, html, css, svg } from "lit";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import { lazyImageLoader } from "@lrnwebcomponents/lazy-image-helpers/lazy-image-helpers.js";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
import { DDD } from "@lrnwebcomponents/d-d-d/d-d-d.js";
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
class SelfCheckProposed extends I18NMixin(
  lazyImageLoader(SchemaBehaviors(DDD))
) {
  constructor() {
    super();
    this.correct = false;
    this.alt = "";
    this.image = "";
    this.question = "";
    this.accentColor = "blue";
    this.title = "Self-Check";
    this.t = {
      revealAnswer: "Reveal Answer",
      close: "Close",
      moreInformation: "More information",
    };
    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
      locales: ["he", "ja", "es"],
    });
  }
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          margin: var(--ddd-spacing-4) 0;
          max-width: 60%;
        }
        :host([hidden]),
        *[hidden] {
          display: none !important;
        }

        div.card {
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
          --simple-icon-width: var(--ddd-icon-xs);
          --simple-icon-height: var(--ddd-icon-xs);
          padding: var(--ddd-spacing-0);
          margin: var(--ddd-spacing-0);
        }

        .check_button {
          display: flex;
          justify-content: flex-end;
        }
        :host([link]) .close_button {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .close_button {
          display: flex;
          justify-content: flex-end;
        }

        simple-icon#questionmark {
          --simple-icon-width: var(--ddd-icon-sm);
          --simple-icon-height: var(--ddd-icon-sm);
          padding-left: var(--ddd-spacing-1);
          color: var(
            --self-check-heading-text,
            var(--simple-colors-default-theme-grey-1, #fff)
          );
        }

        .heading {
          text-transform: uppercase;
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-primary-medium);
          margin: var(--ddd-spacing-2);
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
          margin:  calc(var(--ddd-spacing-6) * -1) 0 0;
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
          font-size: var(--ddd-font-size-3xs);
          line-height: var(--ddd-lh-120);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-2) var(--ddd-spacing-2) var(--ddd-spacing-3);
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
            var(--simple-colors-default-theme-light-green-11, #00762e)
          );
          width: 100%;
          top: 0;
          left: calc(100%);
          transition: all 0.2s ease;
          position: absolute;
        }

        :host([correct]) #answer_wrap {
          visibility: visible;
          opacity: 1;
          position: relative;
          left: 0;
        }

        .answer {
          font-size: var(--ddd-font-size-3xs);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-2) var(--ddd-spacing-2) var(--ddd-spacing-3);
          line-height: var(--ddd-lh-120);
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
          border-left: var(--ddd-spacing-6) solid transparent;
          border-right: var(--ddd-spacing-6) solid transparent;
          border-bottom: var(--ddd-spacing-6) solid
            var(
              --self-check-heading-color,
              var(--simple-colors-default-theme-accent-8, #444)
            );
          position: relative;
          top: calc(var(--ddd-spacing-5) * -1);
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
        ::slotted([slot="heading"]) {
          margin: 0;
        }
        ::slotted(p:first-child) {
          margin-top: 0;
        }
        ::slotted(p:last-child) {
          margin-top: 0;
        }
      `,
    ];
  }
  render() {
    return html`
      <div class="card bs-lg b-xs">
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
          <div class="heading" id="title">
            <slot name="heading">${this.title}</slot>
          </div>
        </div>
        <div id="question_wrap">
          <div
            class="question"
            aria-hidden="${this.correct ? "true" : "false"}"
          >
            <slot name="question"></slot>
            <div class="check_button">
              <simple-icon-button
                controls="answer_wrap"
                label="${this.t.revealAnswer}"
                id="checkBtn"
                class="check-btn"
                icon="image:remove-red-eye"
                ?dark="${this.dark}"
                @click="${this.openAnswer}"
              ></simple-icon-button>
              <simple-tooltip aria-hidden="true" for="checkBtn" position="left">
                ${this.t.revealAnswer}
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
              <div class="close_button">
              ${this.link
                ? html`
                    <div class="more_info">
                      <user-action track="click" every="every"
                        ><a href="${this.link}" target="_blank" rel="noopener"
                          >${this.t.moreInformation}...</a
                        ></user-action
                      >
                    </div>
                  `
                : ``}
                <simple-icon-button
                  label="${this.t.close}"
                  id="closeBtn"
                  ?dark="${!this.dark}"
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
    return "self-check-proposed";
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
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}
customElements.define(SelfCheckProposed.tag, SelfCheckProposed);
export { SelfCheckProposed };
