/**
 * Copyright 2023 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";

class ModelOption extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      url: { type: String },
      src: { type: String },
    };
  }
  constructor() {
    super();
    this.title = "";
    this.url = "";
    this.src = "";
  }
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        button.option {
          text-decoration: none;
          color: var(--ddd-theme-default-white, #fff);
          display: block;
          width: 100%;
          margin: 0;
          padding: 0;
          border: none;
          border-radius: 0;
          font: inherit;
          text-align: start;
          cursor: pointer;
          background: var(--ddd-theme-default-coalyGray, #262626);
        }

        /* drawn like the h2 it was; a heading inside a button loses its
           heading role, so this is plain text */
        .title-text {
          display: block;
          font-size: 1.5em;
          font-weight: bold;
          margin-block: 0.83em var(--ddd-spacing-2);
        }

        @media screen and (min-width: 320px) {
          .title-text {
            font-size: var(--ddd-font-size-s);
          }
        }

        @media screen and (min-width: 920px) {
          .title-text {
            font-size: var(--ddd-font-size-ml);
          }
        }

        #option-wrap {
          padding: var(--ddd-spacing-4) var(--ddd-spacing-6)
            var(--ddd-spacing-4);
        }

        #accent-color {
          background-color: var(--ddd-theme-default-inventOrange);
          width: 80px;
          height: 5px;
        }

        .button {
          width: 100%;
        }
      `,
    ];
  }

  render() {
    return html`
      <button type="button" class="option" @click="${this._handleClick}">
        <div class="button">
          <div id="option-wrap">
            <div id="accent-color"></div>
            <div id="title">
              <span class="title-text">${this.title}</span>
            </div>
            <slot></slot>
          </div>
        </div>
      </button>
    `;
  }

  /**
   * Sends custom event 'model-select' to 'course-model'.
   */
  _handleClick(_e) {
    let modelSelect = new CustomEvent("model-select", {
      detail: this,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(modelSelect);
  }

  static get tag() {
    return "model-option";
  }
}

globalThis.customElements.define("model-option", ModelOption);

export { ModelOption };
