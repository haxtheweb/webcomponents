/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";

/**
 * `editable-table-editor-toggle`
 * A toggle button for an property in editable-table interface (editable-table.html).
 *
 * @demo ./demo/editor.html
 * @customElement
 * @extends LitElement
 */
class EditableTableEditorToggle extends LitElement {
  static get styles() {
    return [
      ...(super.styles || []),
      css`
        :host([hidden]) {
          display: none;
        }
        button {
          padding: 2px;
          margin: 0;
          width: 100%;
          min-width: unset;
          display: inline-flex;
          justify-content: space-between;
          align-items: center;
          align-content: stretch;
          text-transform: unset;
          font-family: var(
            --editable-table-secondary-font-family,
            "Roboto",
            "Noto",
            sans-serif
          );
          background-color: var(
            --editable-table-button-bg-color,
            var(--editable-table-bg-color, #fff)
          );
          color: var(--editable-table-border-color, #999);
          border: none;
          border-radius: 0;
        }
        :host([toggled]) button {
          background-color: var(--editable-table-button-toggled-bg-color);
          color: var(
            --editable-table-button-toggled-color,
            var(--editable-table-color, #222)
          );
        }
        :host(:not([disabled])) button:focus,
        :host(:not([disabled])) button:hover {
          background-color: var(
            --editable-table-button-hover-bg-color,
            var(--editable-table-heading-bg-color, #e8e8e8)
          );
          color: var(
            --editable-table-button-hover-color,
            var(--editable-table-border-color, #999)
          );
          cursor: pointer;
        }
        :host([toggled]:not([disabled])) button:focus,
        :host([toggled]:not([disabled])) button:hover {
          background-color: var(
            --editable-table-button-toggled-hover-bg-color,
            var(--editable-table-heading-bg-color, #e8e8e8)
          );
          color: var(
            --editable-table-button-toggled-hover-color,
            var(--editable-table-heading-color)
          );
          cursor: pointer;
        }
        :host([disabled]) button {
          background-color: var(
            --editable-table-button-disabled-bg-color,
            var(--editable-table-bg-color, #fff)
          );
          color: var(--editable-table-button-disabled-color);
          cursor: not-allowed;
        }
        button > div {
          flex-grow: 1;
        }
        .sr-only {
          position: absolute;
          left: -9999px;
          font-size: 0;
          height: 0;
          width: 0;
          overflow: hidden;
        }
        #filter-off {
          opacity: 0.25;
        }
      `,
    ];
  }
  render() {
    return html`
      <button
        id="button"
        ?active="${this.toggled}"
        ?disabled="${this.disabled}"
        label="${this.label}"
        toggles
        @click="${this._onClick}"
      >
        <span class="sr-only">${this.label}</span>
        <simple-icon-lite
          icon="${this.icon}"
          aria-hidden="true"
        ></simple-icon-lite>
      </button>
      <simple-tooltip id="tooltip" for="button" aria-hidden="true"
        >${this.label}</simple-tooltip
      >
    `;
  }

  static get tag() {
    return "editable-table-editor-toggle";
  }
  static get properties() {
    return {
      /**
       * Whether toggle is disabled
       */
      disabled: {
        attribute: "disabled",
        type: Boolean,
        value: false,
        reflect: true,
      },
      /**
       * Table id for accessibility
       */
      controls: {
        attribute: "controls",
        type: String,
        value: "table",
        readOnly: true,
        reflect: true,
      },
      /**
       * Button id that matches table property to toggle
       */
      id: {
        attribute: "id",
        type: String,
        value: null,
      },
      /**
       * Button icon
       */
      icon: {
        type: String,
        value: null,
      },
      /**
       * Button label
       */
      label: {
        type: String,
        value: null,
      },
      /**
       * Whether button is toggled
       */
      toggled: {
        attribute: "toggled",
        type: Boolean,
        value: false,
        reflect: true,
      },
    };
  }

  /**
   * Fires when button is clicked
   * @event change
   */
  _onClick() {
    this.toggled = !this.toggled;
    this.dispatchEvent(
      new CustomEvent("change", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this,
      })
    );
  }
}
window.customElements.define(
  EditableTableEditorToggle.tag,
  EditableTableEditorToggle
);
export { EditableTableEditorToggle };
