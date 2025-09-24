import { LitElement, html, css, svg } from "lit";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import { lazyImageLoader } from "@haxtheweb/lazy-image-helpers/lazy-image-helpers.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
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
class SelfCheck extends I18NMixin(lazyImageLoader(SchemaBehaviors(DDD))) {
  constructor() {
    super();
    this.correct = false;
    this.alt = "";
    this.image = "";
    this.question = "";
    this.accentColor = "primary";
    this.title = "Self-Check";
    this.fullWidthImage = false;
    this.t = {
      revealAnswer: "Reveal Answer",
      close: "Close",
      moreInformation: "More information",
    };
    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
    });
  }
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          margin: var(--ddd-spacing-4) 0;
          transition: all 0.3s ease-in-out;
        }

        :host([correct]) {
          animation: answerReveal 0.5s ease-in-out;
        }
        :host([hidden]),
        *[hidden] {
          display: none !important;
        }

        div.card {
          overflow: hidden;
          container-type: inline-size;
          container-name: card;
          border: var(--ddd-border-sm);
          border-radius: var(--ddd-radius-lg);
          box-shadow: var(--ddd-boxShadow-sm);
          transition: all 0.3s ease-in-out;
        }

        :host([correct]) div.card {
          border-color: var(--ddd-theme-default-opportunityGreen);
          box-shadow: 0 0 8px
            rgba(var(--ddd-theme-default-opportunityGreen-rgb), 0.3);
        }

        simple-icon-button-lite {
          display: flex;
          --simple-icon-width: var(--ddd-icon-sm);
          --simple-icon-height: var(--ddd-icon-sm);
          height: var(--ddd-icon-xl);
          width: var(--ddd-icon-xl);
          margin: 0 var(--ddd-spacing-4) 0 var(--ddd-spacing-3);
          padding: var(--ddd-spacing-1);
          transition: all 0.3s ease-in-out;
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }

        simple-icon-button-lite:hover,
        simple-icon-button-lite:focus {
          box-shadow: var(--ddd-boxShadow-sm);
          transform: scale(1.05);
          background-color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-sm);
        }

        .check_button {
          display: flex;
          justify-content: flex-end;
          align-items: flex-start;
          margin-top: var(--ddd-spacing-1);
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

        simple-icon-lite#questionmark {
          --simple-icon-width: var(--ddd-icon-lg);
          --simple-icon-height: var(--ddd-icon-lg);
          margin: 0 var(--ddd-spacing-4) 0 var(--ddd-spacing-3);
          padding: var(--ddd-spacing-2);
          color: var(
            --ddd-component-self-check-title-color,
            light-dark(var(--ddd-theme-bgContrast, black), var(--ddd-theme-bgContrast, var(--ddd-theme-default-white)))
          );
        }

        .heading {
          display: flex;
          align-items: center;
          text-transform: uppercase;
          font-size: var(--ddd-font-size-ms);
          font-weight: var(--ddd-font-weight-medium);
          color: var(
            --ddd-component-self-check-title-color,
            light-dark(var(--ddd-theme-bgContrast, black), var(--ddd-theme-bgContrast, var(--ddd-theme-default-white)))
          );
        }

        #header_wrap {
          background-color: var(
            --ddd-component-self-check-title-background,
            var(--ddd-theme-primary)
          );
          display: flex;
          align-items: center;
          margin: calc(var(--ddd-spacing-7) * -1) 0 0;
          padding: 0 var(--ddd-spacing-3);
        }

        :host([accent-color="accent"]) #header_wrap {
          background-color: var(
            --ddd-component-self-check-title-background,
            var(--ddd-theme-accent)
          );
        }

        :host([accent-color="success"]) #header_wrap {
          background-color: var(
            --ddd-component-self-check-title-background,
            var(--ddd-theme-default-success)
          );
        }

        :host([accent-color="warning"]) #header_wrap {
          background-color: var(
            --ddd-component-self-check-title-background,
            var(--ddd-theme-default-warning)
          );
        }

        :host([accent-color="error"]) #header_wrap {
          background-color: var(
            --ddd-component-self-check-title-background,
            var(--ddd-theme-default-error)
          );
        }

        :host([accent-color="info"]) #header_wrap {
          background-color: var(
            --ddd-component-self-check-title-background,
            var(--ddd-theme-default-info)
          );
        }

        #question_wrap {
          color: var(
            --ddd-component-self-check-question-text,
            light-dark(
              var(--ddd-theme-default-coalyGray),
              var(--ddd-theme-default-white)
            )
          );
          background-color: var(
            --ddd-component-self-check-question-background,
            light-dark(
              var(--ddd-theme-default-white),
              var(--ddd-theme-default-coalyGray)
            )
          );
          position: relative;
        }

        .question {
          display: grid;
          grid-template-columns: 1fr 0.1fr;
          font-size: var(--ddd-theme-body-font-size);
          line-height: var(--ddd-lh-120);
          padding: var(--ddd-spacing-5) var(--ddd-spacing-3)
            var(--ddd-spacing-5) var(--ddd-spacing-6);
          min-height: calc(var(--ddd-spacing-20) + var(--ddd-spacing-4));
          align-items: start;
        }

        :host([correct]) .question {
          display: none;
        }

        #answer_wrap {
          visibility: hidden;
          opacity: 0;
          color: var(
            --ddd-component-self-check-answer-text,
            light-dark(
              var(--ddd-theme-default-coalyGray),
              var(--ddd-theme-default-white)
            )
          );
          background-color: var(
            --ddd-component-self-check-answer-background,
            light-dark(
              var(--ddd-theme-default-successLight),
              var(--ddd-theme-default-success)
            )
          );
          width: 100%;
          top: 0;
          left: calc(100%);
          transition: all 0.3s ease-in-out;
          position: absolute;
          border-left: 4px solid var(--ddd-theme-default-opportunityGreen);
        }

        :host([correct]) #answer_wrap {
          visibility: visible;
          opacity: 1;
          position: relative;
          left: 0;
          animation: slideInAnswer 0.4s ease-out;
        }

        /* Animations for smooth answer reveal */
        @keyframes answerReveal {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.01);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes slideInAnswer {
          0% {
            opacity: 0;
            transform: translateX(20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .answer {
          display: grid;
          grid-template-columns: 1fr 0.1fr;
          font-size: var(--ddd-font-size-3xs);
          padding: var(--ddd-spacing-5) var(--ddd-spacing-3)
            var(--ddd-spacing-5) var(--ddd-spacing-6);
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
              --ddd-component-self-check-title-background,
              var(--ddd-theme-primary)
            );
          position: relative;
          top: calc(var(--ddd-spacing-5) * -1);
          left: var(--ddd-spacing-9);
        }

        :host([accent-color="accent"]) .triangle {
          border-bottom-color: var(
            --ddd-component-self-check-title-background,
            var(--ddd-theme-accent)
          );
        }

        :host([accent-color="success"]) .triangle {
          border-bottom-color: var(
            --ddd-component-self-check-title-background,
            var(--ddd-theme-default-success)
          );
        }

        :host([accent-color="warning"]) .triangle {
          border-bottom-color: var(
            --ddd-component-self-check-title-background,
            var(--ddd-theme-default-warning)
          );
        }

        :host([accent-color="error"]) .triangle {
          border-bottom-color: var(
            --ddd-component-self-check-title-background,
            var(--ddd-theme-default-error)
          );
        }

        :host([accent-color="info"]) .triangle {
          border-bottom-color: var(
            --ddd-component-self-check-title-background,
            var(--ddd-theme-default-info)
          );
        }

        .more_info {
          display: inline;
        }

        .more_info a:hover {
          text-decoration: none;
        }
        .image-wrap {
          max-height: 400px;
          overflow: hidden;
          min-height: 20px;
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
        #header_wrap {
          margin: calc(var(--ddd-spacing-1) * -1) 0 0;
        }
        .r-circle {
          border-radius: var(--ddd-radius-circle);
        }
        @container card (width > 600px) {
          .image-wrap {
            max-height: 600px;
          }
        }
      `,
    ];
  }
  render() {
    return html`
      <div class="card">
        <div class="image-wrap">
          ${this.image
            ? html` ${this.renderSVGLoader()}
                <img
                  src="${this.image}"
                  alt="${this.alt}"
                  aria-describedby="${this.describedBy || ""}"
                  loading="lazy"
                />`
            : ``}
        </div>
        <div class="triangle"></div>
        <div id="header_wrap">
          <simple-icon-lite
            class="r-circle"
            id="questionmark"
            icon="icons:help"
            ?dark="${!this.dark}"
            contrast="4"
          ></simple-icon-lite>
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
              <simple-icon-button-lite
                controls="answer_wrap"
                label="${this.t.revealAnswer}"
                id="checkBtn"
                class="check-btn"
                icon="image:remove-red-eye"
                @click="${this.openAnswer}"
              ></simple-icon-button-lite>
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
                <simple-icon-button-lite
                  label="${this.t.close}"
                  id="closeBtn"
                  icon="icons:close"
                  @click="${this.openAnswer}"
                >
                </simple-icon-button-lite>
                <simple-tooltip
                  aria-hidden="true"
                  for="closeBtn"
                  position="left"
                >
                  ${this.t.close}
                </simple-tooltip>
              </div>
              ${this.link
                ? html`
                    <div class="more_info">
                      <user-action track="click" every="every"
                        ><a href="${this.link}" target="_blank" rel="noopener"
                          >${this.t.moreInformation}..</a
                        ></user-action
                      >
                    </div>
                  `
                : ``}
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
        import("@haxtheweb/user-action/user-action.js");
        import("@haxtheweb/simple-tooltip/simple-tooltip.js");
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
      },
      /**
       * Property for toggling "checkbtn".
       */
      correct: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Theme color for header background.
       */
      accentColor: {
        type: String,
        attribute: "accent-color",
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
globalThis.customElements.define(SelfCheck.tag, SelfCheck);
export { SelfCheck };
