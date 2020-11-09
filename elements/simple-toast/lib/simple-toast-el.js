import { html, css } from "lit-element";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";

class SimpleToastEl extends SimpleColors {
  static get tag() {
    return "simple-toast-el";
  }
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: none;
          justify-content: center;
          position: fixed;
          min-width: 100px;
          text-align: center;
          color: var(--simple-colors-default-theme-accent-1, white);
          background-color: var(--simple-colors-default-theme-accent-12, black);
          border-radius: var(--simple-toast-border-radius, 2px);
          border: var(--simple-toast-border, none);
          font-size: var(--simple-toast-font-size, 1em);
          font-family: var(--simple-toast-font-family, sans-serif);
        }
        :host(.show) {
          display: flex;
        }
        @-webkit-keyframes fadein {
          from {
            bottom: 0;
            opacity: 0;
          }
          to {
            bottom: var(--simple-toast-bottom, 40px);
            opacity: 1;
          }
        }
        @keyframes fadein {
          from {
            bottom: 0;
            opacity: 0;
          }
          to {
            bottom: var(--simple-toast-bottom, 40px);
            opacity: 1;
          }
        }
        @-webkit-keyframes fadeout {
          from {
            bottom: var(--simple-toast-bottom, 40px);
            opacity: 1;
          }
          to {
            bottom: 0;
            opacity: 0;
          }
        }
        @keyframes fadeout {
          from {
            bottom: var(--simple-toast-bottom, 40px);
            opacity: 1;
          }
          to {
            bottom: 0;
            opacity: 0;
          }
        }
      `,
    ];
  }

  static get properties() {
    return {
      ...super.properties,
      text: { type: String },
      duration: { type: Number },
      opened: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.text = "";
    this.duration = 3000;
    this.opened = false;
    this.addEventListener("animationend", (e) => {
      if (e.animationName == "fadeout") {
        this.opened = false;
      }
    });
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "opened") {
        // notify for others listening
        this.dispatchEvent(
          new CustomEvent("opened-changed", {
            detail: {
              value: this[propName],
            },
          })
        );
        if (this[propName]) {
          this.show(this.text);
        } else {
          this.hide();
        }
      }
      if (propName === "duration" && this[propName]) {
        this.style.animation =
          "fadein 0.2s, fadeout 0.2s " + this[propName] / 1000 + "s";
      }
    });
  }

  render() {
    return html`<span><span>${this.text}</span><slot></slot></span>`;
  }

  // To read out loud the toast
  firstUpdated(changedProperties) {
    super.updated(changedProperties);
    this.style.setProperty("aria-live", "assertive");
    this.style.setProperty("role", "alert");
    this.style.setProperty("aria-atomic", "true");
    this.style.setProperty("aria-relevant", "all");
  }
  hide() {
    this.classList.remove("show");
  }
  show(text = "") {
    this.text = text;
    this.classList.add("show");
  }
}

customElements.define(SimpleToastEl.tag, SimpleToastEl);
export { SimpleToastEl };
