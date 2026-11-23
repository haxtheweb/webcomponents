/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
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
          /* The fade is declared here, in the stylesheet that holds its
             keyframes, and fed through a custom property. Set as an inline
             style on the host it would be looked up in the tree the host
             sits in, where fadein and fadeout do not exist, and nothing
             would play. */
          animation: var(--simple-toast-el-animation, none);
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
  /**
   * Play (or stop, with "none") the toast's animations. Use this, not
   * style.animation: see the note on :host.
   */
  _setAnimation(value) {
    this.style.setProperty("--simple-toast-el-animation", value);
  }
  _getAnimation(duration = this.duration) {
    // reduced motion: the same animations at a near-zero duration instead
    // of none, so animationend still fires and the toast still hides
    const reduced = this._prefersReducedMotion()
      ? "var(--ddd-duration-reduced, 0.01ms)"
      : "";
    if (!this.alwaysvisible && !this.awaitingMerlinInput) {
      return (
        "fadein " +
        (reduced || "0.3s") +
        ", fadeout " +
        (reduced || "0.6s") +
        " " +
        duration / 1000 +
        "s forwards"
      );
    }
    return "fadein " + (reduced || "0.3s");
  }
  constructor() {
    super();
    this.text = "";
    this.alwaysvisible = false;
    this.awaitingMerlinInput = false;
    this.duration = 3000;
    this.opened = false;
    this.__dismissTimer = null;
    this.addEventListener("animationend", this._onAnimationEnd);
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "opened" && oldValue !== undefined) {
        if (this.__dismissTimer) {
          clearTimeout(this.__dismissTimer);
          this.__dismissTimer = null;
        }
        this.dispatchEvent(
          new CustomEvent("opened-changed", {
            detail: {
              value: this[propName],
            },
          }),
        );
        if (this[propName]) {
          this._setAnimation("none");
          this.show(this.text);
          setTimeout(() => {
            this._setAnimation(this._getAnimation());
          }, 0);
          if (
            !this.alwaysvisible &&
            !this.awaitingMerlinInput &&
            this.duration > 0
          ) {
            // backup only: the end of the fade out hides the toast (it
            // starts when the time is up and takes 600ms). This catches
            // the cases where that event never arrives.
            this.__dismissTimer = setTimeout(() => {
              this.__dismissTimer = null;
              this.hide();
            }, this.duration + 900);
          }
        } else {
          this.hide();
        }
      }
      if (propName === "duration" && this[propName]) {
        this._setAnimation(this._getAnimation(this[propName]));
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
    if (this.__dismissTimer) {
      clearTimeout(this.__dismissTimer);
      this.__dismissTimer = null;
    }
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
