/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { DDDBlockStyles } from "@haxtheweb/d-d-d/lib/DDDBlock.js";
import { DDDStatusTokens } from "@haxtheweb/d-d-d/lib/DDDStatusTokens.js";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-toast/simple-toast.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "./lib/flash-card-answer-box.js";
import "./lib/flash-card-prompt-img.js";
import {
  activityId,
  buildStatement,
  XAPI_EXTENSIONS,
} from "@haxtheweb/user-action/lib/xapi.js";

export class FlashCard extends I18NMixin(SchemaBehaviors(DDD)) {
  static get tag() {
    return "flash-card";
  }

  /**
   * xAPI statements this element sends (see scripts/generate-xapi-vocabulary.mjs)
   */
  static get xapiVocabulary() {
    return {
      tag: "flash-card",
      event: "user-engagement",
      verbs: ["answered"],
      objectType: "http://adlnet.gov/expapi/activities/cmi.interaction",
      interactionType: "fill-in",
      result: ["success", "completion", "response", "score"],
      countsTowardCompletion: true,
      done: "answered correctly",
    };
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
      DDDBlockStyles,
      DDDStatusTokens,
      css`
        /* the host is the block frame (same treatment as the shared
           .ddd-block): 1px rounded frame on the page colour, then the
           shared block header */
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
          margin: var(--ddd-stack-gap, var(--ddd-spacing-4))
            var(--ddd-spacing-4);
          transition: border-color var(--ddd-duration-normal) ease-in-out;
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
        .ddd-block-header[hidden] {
          display: none;
        }
        .ddd-block-body {
          padding: var(--ddd-surface-padding, var(--ddd-spacing-4));
        }

        /* the result shows in the footer action bar and on the image, like
           the other question types; the frame only takes the status line */
        :host([status="correct"]) {
          border-color: var(--ddd-status-correct-signal);
        }
        :host([status="incorrect"]) {
          border-color: var(--ddd-status-incorrect-signal);
          border-style: var(--ddd-status-incorrect-line);
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
        }

        flash-card-image-prompt {
          align-self: center;
          margin-bottom: var(--ddd-spacing-4);
        }
        /* an author picked DDD primary colours the header chip */
        :host([data-primary]) {
          --ddd-block-chip-background: var(--ddd-theme-primary);
          --ddd-block-chip-color: var(--ddd-theme-bgContrast, white);
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
    if (this.status === "correct" || this.status === "incorrect") {
      this._announceAnswer(e);
    }
  }

  // learner data for a checked card (user-engagement with an xAPI statement)
  _announceAnswer(e) {
    const box = e && e.target;
    const correct = this.status === "correct";
    const response = box && box.userAnswer ? String(box.userAnswer) : "";
    this.dispatchEvent(
      new CustomEvent("user-engagement", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          activityDisplay: "answered",
          objectName: this.textContent.trim().slice(0, 120),
          resultSuccess: correct,
          statement: buildStatement({
            verb: "answered",
            object: {
              id: activityId(this),
              name: this.textContent.trim().slice(0, 120),
              interactionType: "fill-in",
            },
            result: {
              success: correct,
              completion: correct,
              response,
              score: { raw: correct ? 1 : 0, max: 1, min: 0 },
            },
            context: {
              extensions: { [XAPI_EXTENSIONS.element]: "flash-card" },
            },
          }),
        },
      }),
    );
  }

  /**
   * Author content that identifies this card for its xAPI activity id
   */
  xapiFingerprint() {
    return this.textContent.trim();
  }

  // Provide visual and audio feedback similar to QuestionElement
  provideFeedback() {
    let toastColor, toastIcon, toastText;
    let toastShowEventName = "simple-toast-show";
    // support for haxcms toast, like QuestionElement: its status shows as a
    // tone (badge and stripe) so the icon isn't slotted in there
    const haxToast = Boolean(globalThis.HAXCMSToast);
    if (haxToast) {
      toastShowEventName = "haxcms-toast-show";
    }

    if (this.status === "correct") {
      toastColor = "green";
      toastIcon = "icons:thumb-up";
      toastText = this.t.correct;
      this.makeItRain();
      this.playSound("success");
    } else if (this.status === "incorrect") {
      toastColor = "purple";
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
      // simple-toast colours the icon from the DDD form-status tokens
      si.setAttribute("data-status", this.status);

      globalThis.dispatchEvent(
        new CustomEvent(toastShowEventName, {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {
            text: toastText,
            accentColor: toastColor,
            duration: 3000,
            slot: haxToast ? undefined : si,
            tone: haxToast
              ? this.status === "correct"
                ? "success"
                : "incorrect"
              : undefined,
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
      <div class="ddd-block-header" ?hidden="${this._inSet}">
        <span class="ddd-block-chip" aria-hidden="true"
          ><simple-icon-lite icon="image:style"></simple-icon-lite
        ></span>
        <span class="ddd-block-text"
          ><span class="ddd-block-label"
            >${this.t.practice} · ${this.t.flashCard}</span
          ></span
        >
      </div>
      <div class="ddd-block-body">
        <confetti-container id="confetti">
          ${
            !this.imgSource && !this.imgKeyword
              ? ``
              : html`
                  <flash-card-image-prompt
                    img-src="${this.imgSource}"
                    img-keyword="${this.imgKeyword}"
                    status="${this.status}"
                  ></flash-card-image-prompt>
                `
          }
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
