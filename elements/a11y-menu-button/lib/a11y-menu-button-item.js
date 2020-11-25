/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";

/**
 * `a11y-menu-item`
 * A toggle button for an property in the editable-table interface (editable-table.html).
 *
 *
 * @demo ./demo/index.html
 *
 * @polymer
 * @element a11y-menu-item
 */
class A11yMenuButtonItem extends LitElement {
  static get styles() {
    return [
      css`
        :host([hidden]) {
          display: none;
        }
        button[disabled] {
          cursor: not-allowed;
        }
      `,
    ];
  }
  render() {
    return html`
      <li role="none">
        <button
          role="menuitem"
          controls="${this.controls}"
          ?disabled="${this.disabled}"
        >
          <slot></slot>
        </button>
      </li>
    `;
  }

  static get tag() {
    return "a11y-menu-item";
  }
  static get properties() {
    return {
      /**
       * Whether toggle is disabled
       */
      disabled: {
        attribute: "disabled",
        type: Boolean,
      },
      /**
       * Whether toggle is disabled
       */
      hidden: {
        attribute: "hidden",
        type: Boolean,
        reflect: true,
      },
      /**
       * Whether toggle is disabled
       */
      controls: {
        attribute: "controls",
        type: String,
      },
    };
  }
}
window.customElements.define(A11yMenuButtonItem.tag, A11yMenuButtonItem);
export { A11yMenuButtonItem };
