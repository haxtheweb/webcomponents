/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { FutureTerminalTextLiteSuper } from "./FutureTerminalTextSuper.js";
/**
 * `future-terminal-text`
 * `this is to provide a futuristic terminal text type of environment`
 * @demo demo/index.html
 * @element future-terminal-text
 */

class FutureTerminalTextLite extends FutureTerminalTextLiteSuper(LitElement) {
  /**
   * LitElement shadow styling convention
   */
  static get styles() {
    let styles = css``;
    if (super.styles) {
      styles = super.styles;
    }
    return [
      styles,
      css`
        :host {
          font-weight: bold;
          display: inline-flex;
          --flicker-easing: cubic-bezier(0.32, 0.32, 0, 0.92);
          --flicker-duration: 300ms;
          --fade-in-duration: 500ms;
        }
        span {
          color: var(--future-terminal-text-color, #5fa4a5);
          text-shadow: 0 0 4px var(--future-terminal-text-color, #5fa4a5);
          animation: flicker var(--flicker-duration) var(--flicker-easing);
        }
        :host([red]) span {
          color: #b35b5a;
          text-shadow: 0 0 4px #b35b5a;
        }
        :host([fadein]) span {
          animation:
            fade-in var(--fade-in-duration),
            flicker 300ms var(--flicker-easing)
              calc(var(--fade-in-duration) * 0.8);
          transform: translate(0, 0);
          opacity: 1;
        }
        @keyframes flicker {
          0% {
            opacity: 0.75;
          }
          50% {
            opacity: 0.45;
          }
          100% {
            opacity: 1;
          }
        }
        @keyframes fade-in {
          from {
            transform: translate(-30px, 0px);
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          span {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `,
    ];
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (
        propName === "glitch" &&
        this[propName] &&
        typeof oldValue !== "undefined"
      ) {
        this._doGlitch();
      }
    });
  }

  // Template return function
  render() {
    return html`<span part="text"><slot></slot></span>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      glitch: {
        type: Boolean,
      },
      red: {
        type: Boolean,
        reflect: true,
      },
      fadein: {
        type: Boolean,
        reflect: true,
      },
      glitchMax: {
        type: Number,
        attribute: "glitch-max",
      },
      glitchDuration: {
        type: Number,
        attribute: "glitch-duration",
      },
    };
  }

  /**
   * Convention we use
   */
  static get tag() {
    return "future-terminal-text-lite";
  }
}
customElements.define(FutureTerminalTextLite.tag, FutureTerminalTextLite);
export { FutureTerminalTextLite };
