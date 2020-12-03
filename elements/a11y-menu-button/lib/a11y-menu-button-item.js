/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";

/**
 * `a11y-menu-button-item`
 * A toggle button for an property in the editable-table interface (editable-table.html).
 *
 *
 * @demo ./demo/index.html
 *
 * @polymer
 * @element a11y-menu-button-item
 */
class A11yMenuButtonItem extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          margin: 0;
          padding: 0;
          display: block;
        }
        :host([hidden]) {
          display: none;
        }
        *[role="menuitem"][disabled] {
          cursor: not-allowed;
        }

        *[role="menuitem"],
        *[role="menuitem"]:visited {
          display: block;
          margin: 0;
          border-radius: 0;
          font-family: inherit;
          font-size: inherit;
          text-decoration: var(--a11y-menu-button-item-text-decoration, none);
          color: var(
            --a11y-menu-button-item-color,
            var(--a11y-menu-button-color, black)
          );
          width: calc(
            100% - 2 *
              var(
                --a11y-menu-button-item-horizontal-padding,
                var(--a11y-menu-button-horizontal-padding, 5px)
              )
          );
          text-align: var(--a11y-menu-button-item-text-align, left);
          padding: var(
              --a11y-menu-button-item-vertical-padding,
              var(--a11y-menu-button-vertical-padding, 0)
            )
            var(
              --a11y-menu-button-item-horizontal-padding,
              var(--a11y-menu-button-horizontal-padding, 5px)
            );
          background-color: var(
            --a11y-menu-button-item-bg-color,
            var(--a11y-menu-button-bg-color, white)
          );
          border-left: var(--a11y-menu-button-item-border-left, none);
          border-right: var(--a11y-menu-button-item-border-right, none);
          border-top: var(--a11y-menu-button-item-border-top, none);
          border-bottom: var(--a11y-menu-button-item-border-bottom, none);
          transition: all 0.25s ease-in-out;
        }
        button[role="menuitem"],
        button[role="menuitem"]:visited {
          width: 100%;
        }

        :host(:focus-within) *[role="button"],
        *[role="menuitem"]:focus,
        *[role="menuitem"]:hover {
          text-decoration: var(
            --a11y-menu-button-item-focus-text-decoration,
            none
          );
          color: var(--a11y-menu-button-item-focus-color, black);
          background-color: var(
            --a11y-menu-button-item-focus-bg-color,
            #e0e0ff
          );
          border-left: var(--a11y-menu-button-item-focus-border-left, unset);
          border-right: var(--a11y-menu-button-item-focus-border-right, unset);
          border-top: var(--a11y-menu-button-item-focus-border-top, unset);
          border-bottom: var(
            --a11y-menu-button-item-focus-border-bottom,
            unset
          );
        }
      `,
    ];
  }
  render() {
    return this.href && this.href.trim() !== ""
      ? html` <li role="none">
          <a role="menuitem" href="${this.href}" ?disabled="${this.disabled}">
            <slot></slot>
          </a>
        </li>`
      : html`
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
    return "a11y-menu-button-item";
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
      /**
       * Whether toggle is disabled
       */
      controls: {
        attribute: "controls",
        type: String,
      },
    };
  }
  constructor() {
    super();
  }
  focus() {
    console.log(
      "focus",
      this,
      !this.shadowRoot,
      this.shadowRoot.querySelector("[role=menuitem]")
    );
    if (this.shadowRoot && this.shadowRoot.querySelector("[role=menuitem]"))
      this.shadowRoot.querySelector("[role=menuitem]").focus();
  }
  connectedCallback() {
    super.connectedCallback();
    this.dispatchEvent(
      new CustomEvent("add-a11y-menu-button-item", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this,
      })
    );
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.dispatchEvent(
      new CustomEvent("remove-a11y-menu-button-item", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this,
      })
    );
  }
}
window.customElements.define(A11yMenuButtonItem.tag, A11yMenuButtonItem);
export { A11yMenuButtonItem };
