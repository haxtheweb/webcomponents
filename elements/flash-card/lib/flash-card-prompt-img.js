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
    return css`
      :host {
        display: block;
        width: 320px;
        height: 265px;
      }

      img {
        display: flex;
        margin: 25px auto auto;
        height: 200px;
        width: 275px;
        border: 5px solid
          light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
        border-radius: 19px;
        box-shadow: 0 0 10px
          light-dark(rgba(0, 0, 0, 0.5), rgba(255, 255, 255, 0.3));
      }

      .backgroundbox {
        display: flex;
        background-color: light-dark(
          var(--ddd-theme-default-accent),
          var(--ddd-theme-default-accent8)
        );
        border-radius: 19px 19px 0 0;
        height: 265px;
        width: 320px;
      }

      .overlay {
        position: relative;
      }

      .overlay::before {
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        border: 1px;
        border-radius: 19px 19px 0px 0px;
      }

      simple-icon-lite {
        --simple-icon-height: 100px;
        --simple-icon-width: 100px;
        color: var(--ddd-theme-default-white);
        transform: translate(-50%, -190%);
        top: 50%;
        left: 50%;
        z-index: 100;
        filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5));
        animation: iconPop 0.3s ease-out;
      }

      @keyframes iconPop {
        0% {
          transform: translate(-50%, -190%) scale(0);
        }
        80% {
          transform: translate(-50%, -190%) scale(1.1);
        }
        100% {
          transform: translate(-50%, -190%) scale(1);
        }
      }

      :host([status="pending"]) .overlay::before {
        display: flex;
        background: transparent;
      }

      :host([status="correct"]) .overlay::before {
        display: flex;
        background: var(--ddd-theme-default-opportunityGreen);
        filter: opacity(0.75);
        animation: correctOverlay 0.6s ease-in-out;
      }

      :host([status="incorrect"]) .overlay::before {
        display: flex;
        background: var(--ddd-theme-default-wonderPurple);
        filter: opacity(0.75);
        animation: incorrectOverlay 0.4s ease-in-out;
      }

      /* Feedback animations */
      @keyframes correctOverlay {
        0% {
          opacity: 0;
          transform: scale(0.8);
        }
        50% {
          opacity: 1;
          transform: scale(1.05);
        }
        100% {
          opacity: 0.75;
          transform: scale(1);
        }
      }

      @keyframes incorrectOverlay {
        0% {
          opacity: 0;
        }
        25% {
          opacity: 1;
        }
        75% {
          opacity: 1;
        }
        100% {
          opacity: 0.75;
        }
      }
    `;
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
      <div>
        <div class="overlay">
          <div class="backgroundbox">
            ${this.imgSrc !== ""
              ? html`<img src="${this.imgSrc}" alt="" />`
              : html`<img
                  src="https://loremflickr.com/320/240/${this
                    .imgKeyword}?lock=1"
                  alt=""
                />`}
          </div>
        </div>
        ${this.answerIcon
          ? html`<simple-icon-lite icon="${this.icon}"></simple-icon-lite>`
          : ``}
      </div>
    `;
  }
}
globalThis.customElements.define(FlashCardPromptImg.tag, FlashCardPromptImg);
