/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "./a11y-menu-button-item.js";
import "./a11y-menu-button-link.js";

/**
 * `a11y-menu-button`
 * A toggle button for an property in the editable-table interface (editable-table.html).
 *
 *
 * @demo ./demo/index.html
 *
 * @polymer
 * @element a11y-menu-button
 */
class A11yMenuButton extends LitElement {
  static get styles() {
    return [css``];
  }
  render() {
    return html`
      <button
        id="menubutton"
        aria-haspopup="true"
        aria-controls="menu"
        aria-expanded="${this.expanded}"
      >
        <slot name="button"></slot>
      </button>
      <ul
        id="menu"
        role="menu"
        aria-labelledby="menubutton"
        @mousover="${(e) => (this.hover = true)}"
        @mousout="${(e) => (this.hover = false)}"
      >
        <slot></slot>
      </ul>
    `;
  }

  static get tag() {
    return "a11y-menu-button";
  }
  static get properties() {
    return {
      /**
       * Whether toggle is disabled
       */
      activeItem: {
        type: Object,
      },
      /**
       * Whether toggle is disabled
       */
      disabled: {
        attribute: "disabled",
        type: Boolean,
      },
      /**
       * Whether the button is toggled
       */
      toggled: {
        attribute: "toggled",
        type: Boolean,
      },
      /**
       * Whether the button is toggled
       */
      focus: {
        attribute: "focus",
        type: Boolean,
      },
      /**
       * Whether the button is toggled
       */
      hover: {
        attribute: "hover",
        type: Boolean,
      },
    };
  }
  constructor() {
    this.addEventListener("click", this._handleClick);
    this.addEventListener("keydown", this._handleKeydown);
    this.addEventListener("focus", this._handleFocus);
    this.addEventListener("blur", this._handleBlur);
    this.addEventListener("mouseover", this._handleMouseover);
    this.addEventListener("mouseout", this._handleMouseout);
  }
  get keyCode() {
    return {
      TAB: 9,
      RETURN: 13,
      ESC: 27,
      SPACE: 32,
      PAGEUP: 33,
      PAGEDOWN: 34,
      END: 35,
      HOME: 36,
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40,
    };
  }
  focusOn(selector) {
    this.expanded = true;
    this.querySelector("a11y-menu-button-item,a11y-menu-button-link").focus();
  }
  _handleKeydown(event) {
    var flag = false;

    switch (event.keyCode) {
      case this.keyCode.SPACE:
      case this.keyCode.RETURN:
      case this.keyCode.DOWN:
        this.focusOn("a11y-menu-button-item,a11y-menu-button-link");
        flag = true;
        break;

      case this.keyCode.UP:
        if (this.popupMenu) {
          this.focusOn(
            "a11y-menu-button-item:last-of-type,a11y-menu-button-link:last-of-type"
          );
          flag = true;
        }
        break;

      default:
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
  _handleClick(event) {
    if (this.expanded) {
      this.popupMenu.close(true);
    } else {
      this.focusOn("a11y-menu-button-item,a11y-menu-button-link");
    }
  }
  _handleFocus(event) {
    this.hasFocus = true;
  }

  _handleBlur(event) {
    this.hasFocus = false;
  }
  _handleMouseover(event) {
    this.hasHover = true;
    this.expanded = true;
  }

  _handleMouseout(event) {
    this.hasHover = false;
    setTimeout(this.popupMenu.close.bind(this.popupMenu, false), 300);
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
window.customElements.define(A11yMenuButton.tag, A11yMenuButton);
export { A11yMenuButton };
