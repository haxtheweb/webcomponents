import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import "@haxtheweb/simple-toast/simple-toast.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "./lib/flash-card-answer-box.js";
import "./lib/flash-card-prompt-img.js";

export class FlashCard extends I18NMixin(SchemaBehaviors(DDD)) {
  static get tag() {
    return "flash-card";
  }

  // HTMLElement life-cycle, built in; use this for setting defaults
  constructor() {
    super();
    this.typeof = "oer:Practice";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      correct: "Correct!",
      tryAgain: "Try again!",
      practice: "Practice",
      flashCard: "Flash card",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
    this.imgKeyword = "";
    this.imgSource = "";
    this.typeOfAction = "";
    this.hasLearningObjective = "";
    this._inSet = false;
  }

  // properties that you wish to use as data in HTML, CSS, and the updated life-cycle
  static get properties() {
    return {
      ...super.properties,
      /**
       * OER Schema type. Reflected (rather than set in firstUpdated) so it is
       * also in server rendered HTML.
       */
      typeof: { type: String, reflect: true },
      inverted: { type: Boolean },
      imgSource: { type: String, attribute: "img-source", reflect: true },
      imgKeyword: { type: String, attribute: "img-keyword" },
      status: { type: String, reflect: true },
      typeOfAction: { type: String, attribute: "type-of-action" },
      hasLearningObjective: {
        type: String,
        attribute: "has-learning-objective",
      },
      /**
       * set by flash-card-set: the set header names the block, so each card
       * inside it drops its own
       */
      _inSet: { type: Boolean, state: true },
    };
  }

  // CSS - specific to Lit
  static get styles() {
    return [
      super.styles,
      css`
        /* the host is the block frame shared with the other DDD learning
           blocks: 1px rounded frame on the page colour, then the header */
        :host {
          display: block;
          box-sizing: content-box !important;
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-md);
          box-shadow: none;
          overflow: hidden;
          min-width: 320px;
          min-height: 155px;
          padding: 0;
          margin: var(--ddd-spacing-4);
          transition: all var(--ddd-duration-normal, 0.3s) ease-in-out;
          /* the frame sits on the page colour (no grey slab in dark mode) */
          background-color: transparent;
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        :host(:focus),
        :host(:focus-within),
        :host(:hover) {
          border-color: light-dark(
            var(--ddd-theme-primary, var(--ddd-theme-default-nittanyNavy)),
            var(--ddd-theme-default-linkLight)
          );
        }
        .frame-header {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          padding-block: var(--ddd-spacing-2);
          padding-inline: var(--ddd-spacing-4) var(--ddd-spacing-2);
          min-height: var(--ddd-control-height-sm);
          border-bottom: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          font-family: var(--ddd-font-primary);
        }
        .frame-header[hidden] {
          display: none;
        }
        .frame-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
          width: var(--ddd-icon-xs);
          height: var(--ddd-icon-xs);
          border-radius: var(--ddd-radius-circle);
          background-color: light-dark(
            var(--ddd-theme-default-beaverBlue),
            var(--ddd-theme-default-skyBlue)
          );
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }
        .frame-label {
          flex: 1 1 auto;
          min-width: 0;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        :host(:lang(ar)) .frame-label,
        :host(:lang(fa)) .frame-label,
        :host(:lang(he)) .frame-label,
        :host(:lang(ur)) .frame-label {
          letter-spacing: 0;
        }
        .frame-body {
          padding: var(--ddd-spacing-4);
        }

        /* Status-based styling for correct/incorrect feedback */
        :host([status="correct"]) {
          outline: 3px solid var(--ddd-theme-default-opportunityGreen);
          outline-offset: -3px;
          animation: correctPulse var(--ddd-duration-slow, 0.6s) ease-in-out;
        }

        :host([status="incorrect"]) {
          outline: 3px dotted var(--ddd-theme-default-wonderPurple);
          outline-offset: -3px;
          animation: incorrectShake var(--ddd-duration-normal, 0.3s) ease-in-out;
        }

        /* Animations for feedback */
        @keyframes correctPulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        @keyframes incorrectShake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        p {
          color: light-dark(
            var(--ddd-theme-primary),
            var(--ddd-theme-default-linkLight)
          );
          font-family: var(--ddd-font-navigation);
        }

        confetti-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all var(--ddd-duration-normal, 0.3s) ease-in-out;
        }

        flash-card-image-prompt {
          align-self: center;
          margin-bottom: var(--ddd-spacing-4);
        }

        flash-card-answer-box {
          display: block;
          width: 100%;
        }
      `,
    ];
  }

  statusChanged(e) {
    this.status = e.detail;
    this.provideFeedback();
  }

  // Provide visual and audio feedback similar to QuestionElement
  provideFeedback() {
    let toastColor, toastIcon, toastText;
    let toastShowEventName = "simple-toast-show";

    if (this.status === "correct") {
      toastColor = "green";
      toastIcon = "icons:thumb-up";
      toastText = this.t.correct;
      this.makeItRain();
      this.playSound("success");
    } else if (this.status === "incorrect") {
      toastColor = "red";
      toastIcon = "icons:thumb-down";
      toastText = this.t.tryAgain;
      this.playSound("error");
    }

    if (this.status === "correct" || this.status === "incorrect") {
      // Create toast notification
      let si = globalThis.document.createElement("simple-icon-lite");
      si.icon = toastIcon;
      si.style.marginLeft = "16px";
      si.style.setProperty("--simple-icon-height", "24px");
      si.style.setProperty("--simple-icon-width", "24px");

      globalThis.dispatchEvent(
        new CustomEvent(toastShowEventName, {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {
            text: toastText,
            accentColor: toastColor,
            duration: 3000,
            slot: si,
          },
        }),
      );
    }
  }

  // Import and trigger confetti animation
  makeItRain() {
    import("@haxtheweb/multiple-choice/lib/confetti-container.js").then(
      (_module) => {
        setTimeout(() => {
          this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
        }, 0);
      },
    );
  }

  // Fire event about wanting to play a sound
  playSound(sound) {
    globalThis.dispatchEvent(
      new CustomEvent("playaudio", {
        detail: {
          sound: sound,
        },
      }),
    );
  }

  // HTML - specific to Lit
  render() {
    return html`
      <meta property="oer:typeOfAction" content="${this.typeOfAction}" />
      <meta
        property="oer:hasLearningObjective"
        content="${this.hasLearningObjective}"
      />
      <div class="frame-header" ?hidden="${this._inSet}">
        <span class="frame-chip" aria-hidden="true"
          ><simple-icon-lite icon="image:style"></simple-icon-lite
        ></span>
        <span class="frame-label"
          >${this.t.practice} · ${this.t.flashCard}</span
        >
      </div>
      <div class="frame-body">
        <confetti-container id="confetti">
          ${!this.imgSource && !this.imgKeyword
            ? ``
            : html`
                <flash-card-image-prompt
                  img-src="${this.imgSource}"
                  img-keyword="${this.imgKeyword}"
                  status="${this.status}"
                ></flash-card-image-prompt>
              `}
          <flash-card-answer-box
            @flash-card-status-change="${this.statusChanged}"
          >
            <div slot="front">
              <slot slot="front" name="front"></slot>
            </div>
            <div slot="back">
              <slot slot="back" name="back"></slot>
            </div>
          </flash-card-answer-box>
        </confetti-container>
      </div>
    `;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(FlashCard.tag, FlashCard);
