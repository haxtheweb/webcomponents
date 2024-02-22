/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";

const A11yMenuButtonItemBehaviors = function (SuperClass) {
  return class extends SuperClass {
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
              var(--a11y-menu-button-color, currentColor)
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
            border: var(--a11y-menu-button-item-border, none);
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
            color: var(--a11y-menu-button-item-focus-color, currentColor);
            background-color: var(
              --a11y-menu-button-item-focus-bg-color,
              #e0e0ff
            );
            border-left: var(--a11y-menu-button-item-focus-border-left, unset);
            border-right: var(
              --a11y-menu-button-item-focus-border-right,
              unset
            );
            border-top: var(--a11y-menu-button-item-focus-border-top, unset);
            border-bottom: var(
              --a11y-menu-button-item-focus-border-bottom,
              unset
            );
            border: var(--a11y-menu-button-item-focus-border, unset);
          }
        `,
      ];
    }
    render() {
      return this.href && this.href.trim() !== ""
        ? this.linkTemplate
        : this.buttonTemplate;
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
        slot: {
          type: String,
          attribute: "slot",
          reflect: true,
        },
      };
    }
    constructor() {
      super();
      this.slot = "menuitem";
    }
    /**
     * renders item as a link
     *
     * @readonly
     */
    get linkTemplate() {
      return html` <li role="none">
        <a
          role="menuitem"
          href="${this.href}"
          ?disabled="${this.disabled}"
          part="button"
        >
          <slot></slot>
        </a>
      </li>`;
    }
    /**
     * renders item as a button
     *
     * @readonly
     */
    get buttonTemplate() {
      return html`
        <li role="none">
          <button
            role="menuitem"
            controls="${this.controls}"
            ?disabled="${this.disabled}"
            part="button"
          >
            <slot></slot>
          </button>
        </li>
      `;
    }
    /**
     * gets item with role="menuitem"
     *
     * @readonly
     */
    get menuItem() {
      return this.shadowRoot && this.shadowRoot.querySelector("[role=menuitem]")
        ? this.shadowRoot.querySelector("[role=menuitem]")
        : undefined;
    }
    /**
     * allows link or button to get focus
     *
     * @memberof A11yMenuButtonItem
     */
    focus() {
      if (this.menuItem) this.menuItem.focus();
    }
    connectedCallback() {
      super.connectedCallback();
      /**
       * Fires when menu item is added to dom
       * @event add-a11y-menu-button-item
       */
      this.dispatchEvent(
        new CustomEvent("add-a11y-menu-button-item", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this,
        }),
      );
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      /**
       * Fires when menu item is removed from dom
       * @event remove-a11y-menu-button-item
       */
      this.dispatchEvent(
        new CustomEvent("remove-a11y-menu-button-item", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this,
        }),
      );
    }
  };
};
/**
 * a11y-menu-button-item
 * A toggle button for an property in editable-table interface (editable-table.html).
 *
### Styling

`<a11y-menu-button-item>` provides custom properties for styling:

Custom property | Description | Default
----------------|-------------|----------
--a11y-menu-button-item-text-decoration | button or link text decoration | none
--a11y-menu-button-item-color | button or link text color | --a11y-menu-button-color
--a11y-menu-button-item-text-align | button or link text alignment | left
--a11y-menu-button-item-vertical-padding | button or link vertical padding | --a11y-menu-button-vertical-padding
--a11y-menu-button-item-horizontal-padding | button or link horizontal padding | --a11y-menu-button-horizontal-padding
--a11y-menu-button-item-bg-color | button or link background color | --a11y-menu-button-bg-color
--a11y-menu-button-item-border | default button or link border  | none
--a11y-menu-button-item-border-left | overrides button or link left border  | none
--a11y-menu-button-item-border-right | overrides button or link right border | none
--a11y-menu-button-item-border-top | overrides button or link top border | none
--a11y-menu-button-item-border-bottom | overrides button or link bottom border | none
--a11y-menu-button-item-focus-text-decoration | button or link text decoration when focused | none
--a11y-menu-button-item-focus-color | button or link text color when focused | black
--a11y-menu-button-item-focus-bg-color | button or link background color when focused | #e0e0ff
--a11y-menu-button-item-focus-border-left | overrides button or link left border when focused | unset
--a11y-menu-button-item-focus-border-right | overrides button or link left border when focused | unset)
--a11y-menu-button-item-focus-border-top | overrides button or link left border when focused | unset
--a11y-menu-button-item-focus-border-bottom | overrides button or link left border when focused | unset
--a11y-menu-button-item-focus-border | button or link border when focused | unset
 *
 * @demo ./demo/index.html
 * @element a11y-menu-button-item
 * @extends A11yMenuButtonItemBehaviors
 */
class A11yMenuButtonItem extends A11yMenuButtonItemBehaviors(LitElement) {}
customElements.define(A11yMenuButtonItem.tag, A11yMenuButtonItem);
export { A11yMenuButtonItem, A11yMenuButtonItemBehaviors };
