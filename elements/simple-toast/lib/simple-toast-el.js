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
          color: var(--ddd-theme-primary, var(--ddd-theme-default-white));
          background-color: var(--ddd-theme-default-coalyGray);
          border-radius: var(--simple-toast-border-radius, 2px);
          border: var(--simple-toast-border, none);
          font-size: var(--simple-toast-font-size, 1em);
          font-family: var(--simple-toast-font-family, sans-serif);
          transform: translateY(0);
          will-change: transform, opacity;
        }
        :host(.show) {
          display: flex;
        }
        @-webkit-keyframes fadein {
          from {
            opacity: 0;
            transform: translateY(
              var(--simple-toast-slide-offset-y, var(--ddd-spacing-5, 20px))
            );
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadein {
          from {
            opacity: 0;
            transform: translateY(
              var(--simple-toast-slide-offset-y, var(--ddd-spacing-5, 20px))
            );
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @-webkit-keyframes fadeout {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(
              var(--simple-toast-slide-offset-y, var(--ddd-spacing-5, 20px))
            );
          }
        }
        @keyframes fadeout {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(
              var(--simple-toast-slide-offset-y, var(--ddd-spacing-5, 20px))
            );
          }
        }
        @-webkit-keyframes forcedfadeout {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(
              var(--simple-toast-slide-offset-y, var(--ddd-spacing-5, 20px))
            );
          }
        }
        @keyframes forcedfadeout {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(
              var(--simple-toast-slide-offset-y, var(--ddd-spacing-5, 20px))
            );
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
  _prefersReducedMotion() {
    return (
      globalThis.matchMedia &&
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }
  _getAnimation(duration = this.duration) {
    if (this._prefersReducedMotion()) {
      return "none";
    }
    if (!this.alwaysvisible && !this.awaitingMerlinInput) {
      return "fadein 0.3s, fadeout 0.6s " + duration / 1000 + "s";
    }
    return "fadein 0.3s";
  }
  constructor() {
    super();
    this.text = "";
    this.alwaysvisible = false;
    this.awaitingMerlinInput = false;
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
            this.style.animation = this._getAnimation();
          }, 600);
        }
      }
      if (propName === "duration" && this[propName]) {
        this.style.animation = this._getAnimation(this[propName]);
      }
    });
  }

  render() {
    return html`<span><span>${this.text}</span><slot></slot></span>`;
  }

  // To read out loud the toast
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.setAttribute("aria-live", "polite");
    this.setAttribute("role", "status");
    this.setAttribute("aria-atomic", "true");
    this.setAttribute("aria-relevant", "additions text");
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

globalThis.customElements.define(SimpleToastEl.tag, SimpleToastEl);
export { SimpleToastEl };
