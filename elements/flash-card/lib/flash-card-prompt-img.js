// dependencies / things imported
import { html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";

// EXPORT (so make available to other documents that reference this file) a class, that extends LitElement

// which has the magic life-cycles and developer experience below added
export class FlashCardPromptImg extends DDD {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "flash-card-image-prompt";
  }

  // CSS - specific to Lit
  static get styles() {
    return [
      super.styles,
      css`
        /* the prompt image sits in a quiet DDD frame; the result tints it
           green (correct) or purple (incorrect) with an icon, never colour
           alone */
        :host {
          display: block;
          width: 100%;
          max-width: 360px;
        }
        .overlay {
          position: relative;
          border-radius: var(--ddd-radius-md);
          overflow: hidden;
        }
        .backgroundbox {
          display: flex;
          align-items: center;
          justify-content: center;
          aspect-ratio: 4 / 3;
          max-width: 100%;
          padding: var(--ddd-spacing-2);
          box-sizing: border-box;
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-md);
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-coalyGray)
          );
        }
        img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: var(--ddd-radius-sm);
        }
        .overlay::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          border-radius: var(--ddd-radius-md);
          pointer-events: none;
          background: transparent;
          transition: background-color var(--ddd-duration-normal) ease;
        }
        :host([status="correct"]) .overlay::before {
          background-color: color-mix(
            in srgb,
            var(--ddd-theme-default-opportunityGreen) 55%,
            transparent
          );
        }
        :host([status="incorrect"]) .overlay::before {
          background-color: color-mix(
            in srgb,
            var(--ddd-theme-default-wonderPurple) 55%,
            transparent
          );
        }
        .wrap {
          position: relative;
        }
        simple-icon-lite {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 2;
          transform: translate(-50%, -50%);
          --simple-icon-height: var(--ddd-icon-lg);
          --simple-icon-width: var(--ddd-icon-lg);
          color: var(--ddd-theme-default-white);
          filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.5));
          animation: iconPop var(--ddd-duration-normal) ease-out;
        }
        @keyframes iconPop {
          0% {
            transform: translate(-50%, -50%) scale(0);
          }
          80% {
            transform: translate(-50%, -50%) scale(1.1);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          simple-icon-lite {
            animation: none;
          }
          .overlay::before {
            transition: none;
          }
        }
      `,
    ];
  }

  // overlay on div tag - wrap image in div & style div
  // HTMLElement life-cycle, built in; use this for setting defaults
  constructor() {
    super();
    this.imgSrc = "";
    this.imgKeyword = "grey box";
    this.status = "pending";
    this.answerIcon = false;
    this.icon = "";
  }

  // properties that you wish to use as data in HTML, CSS, and the updated life-cycle
  static get properties() {
    return {
      ...super.properties,
      imgSrc: { type: String, reflect: true, attribute: "img-src" },
      imgKeyword: { type: String, attribute: "img-keyword" },
      status: { type: String, reflect: true }, // Correct, incorrect, pending
      answerIcon: { type: Boolean, reflect: true },
      icon: { type: String },
    };
  }

  // updated fires every time a property defined above changes
  // this allows you to react to variables changing and use javascript to perform logic
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "status" && this[propName] === "correct") {
        this.answerIcon = true;
        this.icon = "check";
      }
      if (propName === "status" && this[propName] === "incorrect") {
        this.answerIcon = true;
        this.icon = "cancel";
      }
      if (propName === "status" && this[propName] === "pending") {
        this.answerIcon = false;
      }
    });
  }

  // HTML - specific to Lit
  render() {
    return html`
      <div class="wrap">
        <div class="overlay">
          <div class="backgroundbox">
            ${
              this.imgSrc !== ""
                ? html`<img src="${this.imgSrc}" alt="" />`
                : html`<img
                    src="https://loremflickr.com/320/240/${
                      this.imgKeyword
                    }?lock=1"
                    alt=""
                  />`
            }
          </div>
        </div>
        ${
          this.answerIcon
            ? html`<simple-icon-lite icon="${this.icon}"></simple-icon-lite>`
            : ``
        }
      </div>
    `;
  }
}
globalThis.customElements.define(FlashCardPromptImg.tag, FlashCardPromptImg);
