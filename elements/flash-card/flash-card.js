import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import "@haxtheweb/simple-toast/simple-toast.js";
import "./lib/flash-card-answer-box.js";
import "./lib/flash-card-prompt-img.js";

export class FlashCard extends DDD {
  static get tag() {
    return "flash-card";
  }

  // HTMLElement life-cycle, built in; use this for setting defaults
  constructor() {
    super();
    this.imgKeyword = "";
    this.imgSource = "";
  }

  // properties that you wish to use as data in HTML, CSS, and the updated life-cycle
  static get properties() {
    return {
      ...super.properties,
      inverted: { type: Boolean },
      imgSource: { type: String, attribute: "img-source", reflect: true },
      imgKeyword: { type: String, attribute: "img-keyword" },
      status: { type: String, reflect: true },
    };
  }

  // CSS - specific to Lit
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          box-sizing: content-box !important;
          border: var(--ddd-border-md);
          border-radius: var(--ddd-radius-sm);
          box-shadow: var(--ddd-boxShadow-sm);
          min-width: 320px;
          min-height: 155px;
          padding: var(--ddd-spacing-4);
          margin: var(--ddd-spacing-4);
          transition: all 0.3s ease-in-out;
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        :host(:focus),
        :host(:focus-within),
        :host(:hover) {
          border-color: var(--ddd-theme-primary);
        }

        /* Status-based styling for correct/incorrect feedback */
        :host([status="correct"]) {
          outline: 3px solid var(--ddd-theme-default-opportunityGreen);
          outline-offset: -3px;
          animation: correctPulse 0.6s ease-in-out;
        }

        :host([status="incorrect"]) {
          outline: 3px dotted var(--ddd-theme-default-wonderPurple);
          outline-offset: -3px;
          animation: incorrectShake 0.4s ease-in-out;
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
          transition: all 0.3s ease-in-out;
        }

        flash-card-image-prompt {
          align-self: center;
          margin-bottom: var(--ddd-spacing-4);
        }

        flash-card-answer-box {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
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
      toastText = "Correct!";
      this.makeItRain();
      this.playSound("success");
    } else if (this.status === "incorrect") {
      toastColor = "red";
      toastIcon = "icons:thumb-down";
      toastText = "Try again!";
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
      (module) => {
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
