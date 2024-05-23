import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";

class SimpleToastEl extends DDD {
  static get tag() {
    return "simple-toast-el";
  }
  static get styles() {
    return [
      super.styles,
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
            display: flex;
            bottom: var(--simple-toast-bottom-offscreen, 0px);
            opacity: 0;
          }
          to {
            display: flex;
            bottom: var(--simple-toast-bottom, 40px);
            opacity: 1;
          }
        }
        @keyframes fadein {
          from {
            display: flex;
            bottom: var(--simple-toast-bottom-offscreen, 0px);
            opacity: 0;
          }
          to {
            display: flex;
            bottom: var(--simple-toast-bottom, 40px);
            opacity: 1;
          }
        }
        @-webkit-keyframes fadeout {
          from {
            display: flex;
            bottom: var(--simple-toast-bottom, 40px);
            opacity: 1;
          }
          to {
            display: flex;
            bottom: var(--simple-toast-bottom-offscreen, 0px);
            opacity: 0;
          }
        }
        @keyframes fadeout {
          from {
            display: flex;
            bottom: var(--simple-toast-bottom, 40px);
            opacity: 1;
          }
          to {
            display: flex;
            bottom: var(--simple-toast-bottom-offscreen, 0px);
            opacity: 0;
          }
        }
        @-webkit-keyframes forcedfadeout {
          from {
            display: flex;
            bottom: var(--simple-toast-bottom, 40px);
            opacity: 1;
          }
          to {
            display: flex;
            bottom: var(--simple-toast-bottom-offscreen, 0px);
            opacity: 0;
          }
        }
        @keyframes forcedfadeout {
          from {
            display: flex;
            bottom: var(--simple-toast-bottom, 40px);
            opacity: 1;
          }
          to {
            display: flex;
            bottom: var(--simple-toast-bottom-offscreen, 0px);
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
      alwaysvisible: { type: Boolean },
      duration: { type: Number },
      opened: { type: Boolean, reflect: true },
    };
  }

  _onAnimationEnd(e) {
    if (e.animationName == "fadeout" || e.animationName == "forcedfadeout") {
      this.hide();
    }
  }
  constructor() {
    super();
    this.text = "";
    this.alwaysvisible = false;
    this.duration = 3000;
    this.opened = false;
    this.addEventListener("animationend", this._onAnimationEnd);
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "opened" && oldValue !== undefined) {
        // notify for others listening
        this.dispatchEvent(
          new CustomEvent("opened-changed", {
            detail: {
              value: this[propName],
            },
          }),
        );
        if (this[propName]) {
          this.show(this.text);
        } else {
          this.style.animation = "none";
          setTimeout(() => {
            if (!this.alwaysvisible && !this.awaitingMerlinInput) {
              this.style.animation =
                "fadein 0.3s, fadeout 0.6s " + this.duration / 1000 + "s";
            } else {
              this.style.animation = "fadein 0.3s";
            }
          }, 600);
        }
      }
      if (propName === "duration" && this[propName]) {
        if (!this.alwaysvisible && !this.awaitingMerlinInput) {
          this.style.animation =
            "fadein 0.3s, fadeout 0.6s " + this[propName] / 1000 + "s";
        } else {
          this.style.animation = "fadein 0.3s";
        }
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
    this.opened = false;
  }
  show(text = "") {
    this.text = text;
    this.classList.add("show");
  }
}

customElements.define(SimpleToastEl.tag, SimpleToastEl);
export { SimpleToastEl };
