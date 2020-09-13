/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorButtonStyles } from "../buttons/rich-text-editor-button-styles.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "../buttons/rich-text-editor-button-styles.js";
/**
 * `rich-text-editor-breadcrumb`
 * `a button for rich text editor breadcrumbs`
 *
 *  @element rich-text-editor-breadcrumb
 */
class RichTextEditorBreadcrumb extends RichTextEditorButtonStyles(LitElement) {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "rich-text-editor-breadcrumb";
  }

  static get styles() {
    return [
      ...super.styles,
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
      <iron-a11y-keys
        id="a11y"
        .target="${this.__a11y}"
        keys="enter"
        on-keys-pressed="_buttonTap"
      >
      </iron-a11y-keys>
      <paper-button
        id="button"
        class="rtebutton rtebreadcrumb"
        controls="${this.controls}"
        @click="${this._buttonTap}"
        tabindex="0"
        part="button"
      >
        ${this.tag}
      </paper-button>
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
      tag: {
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
    this.tag = "";
    this.addEventListener("mousedown", function (e) {
      e.preventDefault();
    });
    this.addEventListener("keypress", function (e) {
      e.preventDefault();
    });
  }

  /**
   * life cycle, element is afixed to the DOM
   * @returns {void}
   */
  connectedCallback() {
    super.connectedCallback();
    this.__a11y = this.shadowRoot.querySelector("#button");
  }
  /**
   * Handles button tap;
   * @param {event} e the button tab event
   * @returns {void}
   */
  _buttonTap(e) {
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
