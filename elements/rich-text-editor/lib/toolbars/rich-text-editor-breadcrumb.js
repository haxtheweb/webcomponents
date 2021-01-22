/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextStyles } from "../buttons/rich-text-editor-button.js";
/**
 * `rich-text-editor-breadcrumb`
 * `a button for rich text editor breadcrumbs`
 *
 *  @element rich-text-editor-breadcrumb
 */
class RichTextEditorBreadcrumb extends LitElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "rich-text-editor-breadcrumb";
  }

  static get styles() {
    return [
      ...RichTextStyles,
      css`
        #button {
          font-family: monospace;
          display: inline-block;
          text-align: center;
          min-width: 30px;
          line-height: 30px;
          margin: 0;
          padding: 2px 5px;
        }
      `,
    ];
  }
  render() {
    return html`
      <button
        id="button"
        class="rtebutton rtebreadcrumb"
        aria-controls="${this.controls}"
        @click="${this._handleClick}"
        tabindex="0"
        part="button"
      >
        ${this.label}
      </button>
    `;
  }

  static get properties() {
    return {
      /**
       * The text-editor that this breadcrumb controls.
       */
      controls: {
        type: String,
      },
      /**
       * The tag for this breadcrumb.
       */
      label: {
        type: String,
      },
      /**
       * The target node that this breadcrumb selects.
       */
      target: {
        type: Object,
      },
    };
  }

  constructor() {
    super();
    this.label = "";
    this.addEventListener("mousedown", function (e) {
      e.preventDefault();
    });
    this.addEventListener("keypress", function (e) {
      e.preventDefault();
    });
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.__a11y = this.shadowRoot.querySelector("#button");
    this.__a11y.addEventListener("keypress", (e) => {
      switch (e.key) {
        case "Enter":
          this._handleClick(e);
          break;
      }
    });
  }
  /**
   * Handles button tap;
   * @param {event} e the button tab event
   * @returns {void}
   */
  _handleClick(e) {
    e.preventDefault();
    this.dispatchEvent(
      new CustomEvent("breadcrumb-tap", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this,
      })
    );
  }
}
window.customElements.define(
  RichTextEditorBreadcrumb.tag,
  RichTextEditorBreadcrumb
);
export { RichTextEditorBreadcrumb };
