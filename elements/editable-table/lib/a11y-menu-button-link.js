/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";

/**
 * `a11y-menu-link`
 * A toggle button for an property in the editable-table interface (editable-table.html).
 *
 *
 * @demo ./demo/index.html
 *
 * @polymer
 * @element a11y-menu-link
 */
class A11yMenuButtonLink extends LitElement {
  static get styles() {
    return [
      css`
        :host([hidden]) {
          display: none;
        }
      `,
    ];
  }
  render() {
    return html`
      <li role="none">
        <a role="menuitem" href="${this.href}" ?disabled="${this.disabled}">
          <slot></slot>
        </a>
      </li>
    `;
  }

  static get tag() {
    return "a11y-menu-link";
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
      href: {
        attribute: "href",
        type: String,
      },
    };
  }
}
window.customElements.define(A11yMenuButtonLink.tag, A11yMenuButtonLink);
export { A11yMenuButtonLink };
