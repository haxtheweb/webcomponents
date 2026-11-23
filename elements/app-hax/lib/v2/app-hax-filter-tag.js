/**
 * Copyright 2025 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";

export class AppHaxFilterTag extends I18NMixin(LitElement) {
  static get tag() {
    return "app-hax-filter-tag";
  }

  constructor() {
    super();
    this.label = "";
    this.t = {
      removeTag: "Remove {label}",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../locales/", import.meta.url).href,
    });
  }

  static get properties() {
    return {
      label: { type: String },
    };
  }

  updated(_changedProperties) {}

  static get styles() {
    return [
      css`
        :host {
          display: inline-flex;
          font-family: var(--ddd-font-primary);
          color: var(--simple-colors-default-theme-grey-1, var(--accent-color));
          padding-left: 8px;
          padding-right: 8px;
          height: 32px;
          background-color: var(
            --simple-colors-default-theme-light-blue-12,
            var(--accent-color)
          );
          border-radius: 8px;
          font-size: 16px;
          align-items: center;
          justify-content: flex-start;
        }
        div {
          display: flex;
          align-items: center;
        }
        .tag-label {
          margin: 0;
        }
        .remove {
          cursor: pointer;
          margin-left: 6px;
          display: inline-block;
          font: inherit;
          font-weight: bold;
          color: inherit;
          background: transparent;
          border: none;
          padding: 0;
          min-width: 24px;
          min-height: 24px;
        }
      `,
    ];
  }

  removeTag() {
    this.dispatchEvent(
      new CustomEvent("remove-tag", {
        detail: this.label,
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <div>
        <span class="tag-label">${this.label}</span>
        <button
          type="button"
          class="remove"
          aria-label="${this.t.removeTag.replace("{label}", () => this.label)}"
          @click="${this.removeTag}"
        >
          <span aria-hidden="true">✖</span>
        </button>
      </div>
    `;
  }
}
customElements.define(AppHaxFilterTag.tag, AppHaxFilterTag);
