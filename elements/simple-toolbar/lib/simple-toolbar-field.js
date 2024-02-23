/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { SimpleToolbarButtonBehaviors } from "./simple-toolbar-button.js";
/**
 * `simple-toolbar-field`
 * a more button to toggle collapsed buttons in the rich text editor
 *
 * @customElement
 * @extends SimpleToolbarButtonBehaviors
 * @extends LitElement
 * @lit-html
 * @lit-element
 * @demo ./demo/buttons.html
 */
class SimpleToolbarField extends SimpleToolbarButtonBehaviors(LitElement) {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "simple-toolbar-field";
  }
  static get styles() {
    return [
      super.styles,
      css`
        :host([full-display]) {
          min-width: 100px;
          display: block;
          padding-right: 3px;
          overflow: visible;
        }
        *[part="button"] {
          height: auto;
          width: auto;
          align-self: stretch;
          flex: 1 1 auto;
        }
        *[part="button"]:hover {
          opacity: 1;
        }
        *[part="button"]:hover > *:not([part="field"]) {
          opacity: var(--simple-toolbar-button-hover-opacity, 0.8);
        }
        :host([full-display]) *[part="button"] {
          border-width: 0;
        }
        :host(:focus-within) *[part="button"] {
          color: var(--simple-toolbar-button-hover-color);
          background-color: var(--simple-toolbar-button-hover-bg);
          border-color: var(--simple-toolbar-button-hover-border-color);
          opacity: var(--simple-toolbar-button-hover-opacity, 0.8);
        }
        *[part="field"] {
          width: 0;
          height: 0;
          flex: 0 0 0px;
          display: flex;
          align-items: center;
          overflow: visible;
        }
        :host([icon-position="top"]) *[part="field"],
        :host([icon-position="bottom"]) *[part="field"] {
          flex-direction: column;
        }
        :host([align-horizontal="left"]) *[part="field"] {
          align-items: flex-start;
        }
        :host([align-horizontal="right"]) *[part="field"] {
          align-items: flex-end;
        }
        ::slotted(*) {
          width: 10px;
          flex: 1 1 auto;
        }
        :host(:not([full-display])) ::slotted(*) {
          flex: 0 0 auto;
          width: 0px;
          opacity: 0;
          padding: 0;
          transition:
            width ease-in-out 0.5s,
            opacity 0.5s ease-in-out 0s;
        }
        :host([is-current-item]:not([full-display])) ::slotted(:focus) {
          width: 100px;
          opacity: 1;
          padding: unset;
          transition: width ease-in-out 0.5s;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.fullDisplay = false;
    this.addEventListener("click", this.toggleFocus);
    this.observer.observe(this, { childList: true, subtree: true });
  }
  static get properties() {
    return {
      ...super.properties,
      fullDisplay: {
        type: Boolean,
        attribute: "full-display",
        reflect: true,
      },
    };
  }
  /**
   * template for button, based on whether or not the button toggles
   *
   * @readonly
   */
  get buttonTemplate() {
    return this.fullDisplay
      ? html` <div
            id="button"
            class="simple-toolbar-button"
            ?disabled="${this.disabled}"
            part="button"
          >
            ${this.buttonInnerTemplate}
            <slot></slot>
          </div>
          ${this.tooltipFullDisplayTemplate}`
      : html` <div
            id="button"
            class="simple-toolbar-button"
            ?disabled="${this.disabled}"
            part="button"
          >
            ${this.buttonInnerTemplate}
            <span part="field">
              <slot></slot>
            </span>
          </div>
          ${this.tooltipTemplate}`;
  }
  /**
   * template for button tooltip
   *
   * @readonly
   */
  get tooltipFullDisplayTemplate() {
    return !this.tooltipVisible
      ? ""
      : html`<simple-tooltip
          id="tooltip"
          for="${!this.hasIcon ? "label" : "icon"}"
          offset="5"
          position="right"
          part="tooltip"
          fit-to-visible-bounds
          >${this.currentTooltip || this.currentLabel}</simple-tooltip
        >`;
  }
  get focusableElement() {
    return this.querySelector("*:not([disabled]):not([hidden])");
  }
  toggleFocus(e) {
    if (this.focusableElement.clientWidth > 10) {
      this.focusableElement.blur();
    } else {
      this.focus();
    }
  }
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "isCurrentItem" && this.focusableElement) {
        this.focusableElement.setAttribute(
          "tabindex",
          this.isCurrentItem ? 0 : -1,
        );
      }
    });
  }

  /**
   * mutation observer for a11y-details
   * @readonly
   * @returns {object}
   */
  get observer() {
    let callback = (mutationsList) => this._watchChildren(mutationsList);
    return new MutationObserver(callback);
  }

  _watchChildren(mutationsList) {
    if (this.focusableElement)
      this.focusableElement.setAttribute(
        "tabindex",
        this.isCurrentItem ? 0 : -1,
      );
  }
}
customElements.define(SimpleToolbarField.tag, SimpleToolbarField);
export { SimpleToolbarField };
