/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { HaxUiAdminTokens } from "@haxtheweb/d-d-d/lib/HaxUiAdminTokens.js";

const sun = new URL("./images/sunIcon.png", import.meta.url).href;
const moon = new URL("./images/moonIcon.png", import.meta.url).href;

export class DarkmodeToggle extends LitElement {
  constructor() {
    super();
    this.checked = false;
    this.label = "Dark mode";
    this.disabled = false;
  }

  static get tag() {
    return "darkmode-toggle";
  }

  _toggle() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  }

  _handleKeydown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this._toggle();
    }
  }

  static get properties() {
    return {
      checked: {
        type: Boolean,
        reflect: true,
      },
      disabled: {
        type: Boolean,
        reflect: true,
      },
      label: {
        type: String,
      },
    };
  }

  render() {
    const iconSrc = this.checked ? moon : sun;
    return html`
      <button
        class="darkmode-toggle-btn"
        ?disabled="${this.disabled}"
        aria-pressed="${this.checked}"
        aria-label="${this.label}"
        @click="${this._toggle}"
        @keydown="${this._handleKeydown}"
      >
        <img class="icon" src="${iconSrc}" alt="" aria-hidden="true" />
        <span class="label">${this.label}</span>
        <span class="switch" aria-hidden="true"
          ><span class="knob"></span
        ></span>
      </button>
    `;
  }

  static get styles() {
    return [
      ...HaxUiAdminTokens,
      css`
        :host {
          display: block;
          width: 100%;
        }
        /* a HAX UI menu row with a switch at the end */
        .darkmode-toggle-btn {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md, 8px);
          width: 100%;
          border: none;
          margin: 0;
          min-height: var(--hax-ui-row-height-roomy, 40px);
          padding: 0 var(--hax-ui-gap-md, 8px);
          border-radius: var(--hax-ui-radius);
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          font-weight: var(--ddd-font-weight-medium, 500);
          text-align: left;
          color: var(--hax-ui-text);
          background: transparent;
          cursor: pointer;
          transition: background-color var(--hax-ui-duration)
            var(--hax-ui-easing);
          box-sizing: border-box;
        }
        .darkmode-toggle-btn:hover,
        .darkmode-toggle-btn:focus-visible {
          background-color: var(--hax-ui-hover);
        }
        .darkmode-toggle-btn:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: -2px;
        }
        :host([disabled]) .darkmode-toggle-btn {
          opacity: var(--ddd-state-disabled-opacity, 0.5);
          pointer-events: none;
          cursor: not-allowed;
        }
        .icon {
          flex-shrink: 0;
          display: block;
          width: var(--ddd-icon-3xs, 20px);
          height: var(--ddd-icon-3xs, 20px);
        }
        .label {
          flex: 1;
          text-align: left;
        }
        .switch {
          position: relative;
          flex: none;
          width: 36px;
          height: 20px;
          border-radius: var(--hax-ui-radius-pill);
          background-color: var(--hax-ui-line-strong);
          transition: background-color var(--hax-ui-duration)
            var(--hax-ui-easing);
        }
        .knob {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: var(--hax-ui-surface);
          transition: transform var(--hax-ui-duration) var(--hax-ui-easing);
        }
        :host([checked]) .switch {
          background-color: var(--hax-ui-primary);
        }
        :host([checked]) .knob {
          transform: translateX(16px);
          background-color: var(--hax-ui-on-primary);
        }
        @media (prefers-reduced-motion: reduce) {
          .knob,
          .switch {
            transition: none;
          }
        }
      `,
    ];
  }
}
globalThis.customElements.define(DarkmodeToggle.tag, DarkmodeToggle);
