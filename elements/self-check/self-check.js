import { html, css } from "lit";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import { lazyImageLoader } from "@haxtheweb/lazy-image-helpers/lazy-image-helpers.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
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
 * @demo demo/index.html
 * @element self-check
 * 
 */
class SelfCheck extends I18NMixin(lazyImageLoader(SchemaBehaviors(DDD))) {
  constructor() {
    super();
    this.typeof = "oer:Assessment";
    this.correct = false;
    this.alt = "";
    this.image = "";
    this.question = "";
    this.accentColor = "primary";
    this.title = "Self-Check";
    this.fullWidthImage = false;
    this.hasLearningObjective = "";
    this.assessing = "";
    this.t = {
      revealAnswer: "Reveal Answer",
      close: "Close",
      hideAnswer: "Hide answer",
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
          /* chip colour follows accent-color like the old header bar did */
          --self-check-chip: var(
            --ddd-component-self-check-title-background,
            var(--ddd-theme-primary, var(--ddd-theme-default-beaverBlue))
          );
        }
        :host([accent-color="accent"]) {
          --self-check-chip: var(
            --ddd-component-self-check-title-background,
            var(--ddd-theme-accent)
          );
        }
        :host([accent-color="success"]) {
          --self-check-chip: var(
            --ddd-component-self-check-title-background,
            var(--ddd-theme-default-success)
          );
        }
        :host([accent-color="warning"]) {
          --self-check-chip: var(
            --ddd-component-self-check-title-background,
            var(--ddd-theme-default-warning)
          );
        }
        :host([accent-color="error"]) {
          --self-check-chip: var(
            --ddd-component-self-check-title-background,
            var(--ddd-theme-default-error)
          );
        }
        :host([accent-color="info"]) {
          --self-check-chip: var(
            --ddd-component-self-check-title-background,
            var(--ddd-theme-default-info)
          );
        }
        :host([hidden]),
        *[hidden] {
          display: none !important;
        }
        .card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: var(--ddd-border-xs);
          border-color: var(--ddd-status-default-signal);
          border-radius: var(--ddd-radius-md);
          background-color: var(--ddd-status-default-bg);
          color: var(--ddd-status-default-ink);
        }
        #header_wrap {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          padding-block: var(--ddd-spacing-2);
          padding-inline: var(--ddd-spacing-4);
          border-bottom: var(--ddd-border-xs);
          border-color: var(--ddd-status-default-signal);
        }
        simple-icon-lite#questionmark {
          flex: none;
          width: var(--ddd-icon-xs);
          height: var(--ddd-icon-xs);
          border-radius: var(--ddd-radius-circle);
          background-color: var(--self-check-chip);
          color: var(--ddd-theme-bgContrast, var(--ddd-theme-default-white));
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }
        .heading {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(
            --ddd-component-self-check-title-color,
            light-dark(
              var(--ddd-theme-default-slateGray),
              var(--ddd-theme-default-limestoneLight)
            )
          );
        }
        :host(:lang(ar)) .heading,
        :host(:lang(fa)) .heading,
        :host(:lang(he)) .heading,
        :host(:lang(ur)) .heading {
          letter-spacing: 0;
        }
        .image-wrap {
          overflow: hidden;
          max-height: var(--self-check-image-max-height, 240px);
          transition: max-height var(--ddd-duration-normal, 0.3s) ease-in-out;
        }
        .image-wrap:empty {
          display: none;
        }
        .image-wrap img,
        .image-wrap svg {
          display: block;
          width: 100%;
          height: auto;
          object-fit: cover;
        }
        :host([correct]) .image-wrap {
          max-height: var(--ddd-spacing-24);
        }
        #question_wrap {
          padding: var(--ddd-spacing-4);
          color: var(
            --ddd-component-self-check-question-text,
            var(--ddd-status-default-ink)
          );
          background-color: var(
            --ddd-component-self-check-question-background,
            transparent
          );
        }
        .question {
          font-size: var(--ddd-theme-h5-font-size);
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-140);
          color: var(
            --ddd-component-self-check-question-text,
            light-dark(
              var(--ddd-theme-default-nittanyNavy),
              var(--ddd-theme-default-white)
            )
          );
        }
        .question ::slotted(*) {
          margin: 0;
        }
        #answer_wrap {
          padding-block: var(--ddd-spacing-3);
          padding-inline: var(--ddd-spacing-4);
          border-top: var(--ddd-border-xs);
          border-color: var(--ddd-status-default-signal);
          color: var(
            --ddd-component-self-check-answer-text,
            light-dark(
              var(--ddd-theme-default-info),
              var(--ddd-theme-default-white)
            )
          );
          background-color: var(
            --ddd-component-self-check-answer-background,
            light-dark(
              var(--ddd-theme-default-infoLight),
              var(--ddd-theme-default-potentialMidnight)
            )
          );
        }
        :host(:not([correct])) #answer_wrap {
          display: none;
        }
        .answer ::slotted(*) {
          margin: 0;
        }
        .more_info {
          margin-top: var(--ddd-spacing-2);
        }
        .more_info a {
          font-weight: var(--ddd-font-weight-bold);
          color: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-linkLight)
          );
        }
        .action-bar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: var(--ddd-spacing-3);
          padding-block: var(--ddd-spacing-2);
          padding-inline: var(--ddd-spacing-4) var(--ddd-spacing-2);
          border-top: var(--ddd-border-xs);
          border-color: var(--ddd-status-default-signal);
          background-color: var(--ddd-status-answered-bg);
        }
        .action-bar button {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          min-height: var(--ddd-control-height-sm);
          padding-block: 0;
          padding-inline: var(--ddd-spacing-4);
          border-radius: var(--ddd-radius-xs);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          cursor: pointer;
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }
        #checkBtn {
          border: none;
          background-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        #closeBtn {
          border: var(--ddd-border-xs);
          border-color: var(--ddd-status-answered-signal);
          background-color: transparent;
          color: var(--ddd-status-answered-ink);
        }
        .action-bar button:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
      `,
    ];
  }
  render() {
    return html`
      ${this.hasLearningObjective
        ? html`<meta
            property="oer:hasLearningObjective"
            content="${this.hasLearningObjective}"
          />`
        : ``}
      ${this.assessing
        ? html`<meta property="oer:assessing" content="${this.assessing}" />`
        : ``}
      <div class="card">
        <div id="header_wrap">
          <simple-icon-lite
            id="questionmark"
            icon="icons:help-outline"
            aria-hidden="true"
          ></simple-icon-lite>
          <div class="heading" id="title">
            <slot name="heading">${this.title}</slot>
          </div>
        </div>
        <div class="image-wrap">
          ${this.image
            ? html`${this.renderSVGLoader()}
                <img
                  src="${this.image}"
                  alt="${this.alt}"
                  aria-describedby="${this.describedBy || ""}"
                  loading="lazy"
                />`
            : ``}
        </div>
        <div id="question_wrap">
          <div class="question" ?inert="${this.correct}">
            <slot name="question"></slot>
          </div>
        </div>
        <div id="answer_wrap" ?inert="${!this.correct}" aria-live="polite">
          <div class="answer">
            <user-action track="visibility">
              <slot></slot>
            </user-action>
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
        <div class="action-bar">
          <button
            id="checkBtn"
            class="check-btn"
            ?hidden="${this.correct}"
            aria-expanded="false"
            aria-controls="answer_wrap"
            @click="${this.openAnswer}"
          >
            <simple-icon-lite
              icon="image:remove-red-eye"
              aria-hidden="true"
            ></simple-icon-lite
            >${this.t.revealAnswer}
          </button>
          <button
            id="closeBtn"
            ?hidden="${!this.correct}"
            aria-expanded="true"
            aria-controls="answer_wrap"
            @click="${this.openAnswer}"
          >
            ${this.t.hideAnswer}
          </button>
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
       * OER Schema type. Reflected (rather than set in firstUpdated) so it is
       * also in server rendered HTML.
       */
      typeof: { type: String, reflect: true },
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
      /**
       * Learning objective reference emitted as oer:hasLearningObjective.
       */
      hasLearningObjective: {
        type: String,
        attribute: "has-learning-objective",
      },
      /**
       * Activity reference emitted as oer:assessing.
       */
      assessing: {
        type: String,
        attribute: "assessing",
      },
    };
  }
  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      activeElementChanged: "haxactiveElementChanged",
      mediaSourceUpdated: "haxmediaSourceUpdated",
    };
  }
  /**
   * #3050: a file backing this image was modified in place (rotate / compress /
   * scale / transform). Refresh the live preview by cache-busting the shadow
   * <img> src directly so the persisted `image` property (and saved content)
   * stays clean.
   */
  haxmediaSourceUpdated(path, store) {
    if (!path || !store || typeof store._mediaSrcMatches !== "function") {
      return;
    }
    if (!store._mediaSrcMatches(this.image, path)) return;
    store._pokeMatchingImgs(this.shadowRoot, path);
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
      // read the DOM text, not the rendered text; .heading is styled
      // text-transform:uppercase so innerText would return the uppercased
      // rendering and lose the authored casing on the HAX round-trip
      this.title = container.textContent.trim();
    }
    return false;
  }
  /**
   * Property for toggling "checkbtn".
   */
  async openAnswer(_e) {
    this.correct = !this.correct;
    // move focus into the panel that just became visible/interactive so
    // keyboard/screen reader users aren't dropped to <body> when the
    // previously-focused button becomes inert
    await this.updateComplete;
    const nextFocusId = this.correct ? "closeBtn" : "checkBtn";
    const nextFocusButton = this.shadowRoot.querySelector(`#${nextFocusId}`);
    if (nextFocusButton) {
      nextFocusButton.focus();
    }
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
