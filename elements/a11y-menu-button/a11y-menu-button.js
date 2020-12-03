/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "./lib/a11y-menu-button-item.js";

/**
 * `a11y-menu-button`
 * A toggle button for an property in the editable-table interface (editable-table.html).
 *
 *
 * @demo ./demo/index.html
 * @element a11y-menu-button
 */
class A11yMenuButton extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          position: relative;
        }
        button {
          display: block;
          padding: var(--a11y-menu-button-vertical-padding, 2px)
            var(--a11y-menu-button-horizontal-padding, 5px);
          text-align: center;
          background-color: var(--a11y-menu-button-bg-color, white);
          text-decoration: inherit;
          font-family: inherit;
          font-size: inherit;
          background-color: var(--a11y-menu-button-bg-color, white);
          border-radius: var(--a11y-menu-button-border-radius, 0);
          border-left: var(--a11y-menu-button-border-left, unset);
          border-top: var(--a11y-menu-button-border-top, unset);
          border-right: var(--a11y-menu-button-border-right, unset);
          border-bottom: var(--a11y-menu-button-border-bottom, unset);
          border: var(--a11y-menu-button-border, 1px solid #ddd);
          box-shadow: var(--a11y-menu-button-box-shadow, unset);
          transition: all 0.25s ease-in-out;
        }
        button:focus,
        button:hover {
          background-color: var(--a11y-menu-button-focus-bg-color, white);
          border-left: var(
            --a11y-menu-button-focus-border-left,
            var(--a11y-menu-button-border-left, unset)
          );
          border-top: var(
            --a11y-menu-button-focus-border-top,
            var(--a11y-menu-button-border-top, unset)
          );
          border-right: var(
            --a11y-menu-button-focus-border-right,
            var(--a11y-menu-button-border-right, unset)
          );
          border-bottom: var(
            --a11y-menu-button-focus-border-bottom,
            var(--a11y-menu-button-border-bottom, unset)
          );
          border: var(
            --a11y-menu-button-focus-border,
            var(--a11y-menu-button-border, 1px solid #ddd)
          );
          box-shadow: var(
            --a11y-menu-button-box-shadow,
            var(--a11y-menu-button-focus-box-shadow, unset)
          );
        }

        ul {
          margin: 0;
          padding: 0;
          z-index: 2;
          list-style: none;
          position: absolute;
          left: var(--a11y-menu-button-box-list-left, 0);
          top: var(--a11y-menu-button-box-list-top, unset);
          bottom: var(--a11y-menu-button-box-list-bottom, unset);
          right: var(--a11y-menu-button-box-list-right, unset);
          background-color: var(
            --a11y-menu-button-bg-color,
            var(--a11y-menu-button-list-bg-color, white)
          );
          border: var(
            --a11y-menu-button-border,
            var(--a11y-menu-button-list-border, 1px solid #ddd)
          );
          box-shadow: var(--a11y-menu-button-box-list-box-shadow, unset);
        }
        ul:not([expanded]) {
          display: none;
        }
      `,
    ];
  }
  render() {
    return html`
      <button
        id="menubutton"
        aria-haspopup="true"
        aria-controls="menu"
        aria-expanded="${this.expanded ? "true" : "false"}"
      >
        <slot name="button"></slot>
      </button>
      <ul
        id="menu"
        role="menu"
        aria-labelledby="menubutton"
        ?expanded="${this.expanded}"
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
      currentItem: {
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
       * Whether toggle is disabled
       */
      expanded: {
        attribute: "expanded",
        type: Boolean,
        reflect: true,
      },
      /**
       * Whether the button is toggled
       */
      focused: {
        attribute: "focused",
        type: Boolean,
      },
      /**
       * Whether the button is toggled
       */
      hovered: {
        attribute: "hovered",
        type: Boolean,
      },
      __menuItems: {
        type: Array,
      },
    };
  }
  constructor() {
    super();
    this.__menuItems = [];
    console.log("constructor", this);
    this.addEventListener("keydown", this._handleKeydown);
    this.addEventListener("click", this._handleClick);
    this.addEventListener("focus", this._handleFocus);
    this.addEventListener("blur", this._handleBlur);
    this.addEventListener("mouseover", this._handleMouseover);
    this.addEventListener("mouseout", this._handleMouseout);
    this.addEventListener("add-a11y-menu-button-item", this._handleAddItem);
    this.addEventListener(
      "remove-a11y-menu-button-item",
      this._handleRemoveItem
    );
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
  focus() {
    console.log("focus", this);
    if (this.shadowRoot && this.shadowRoot.querySelector("#menubutton")) {
      this.shadowRoot.querySelector("#menubutton").focus();
    }
  }
  focusOn(item) {
    console.log("focusOn", item, this.currentItem, this.expanded, this);
    item = item || this.firstItem();
    if (item) {
      this.expanded = true;
      this.focused = true;
      this.currentItem = item;
      item.focus();
      console.log("focusOn", item, this.currentItem, this.expanded, this);
    }
  }
  focusByCharacter(char) {
    var start,
      index,
      char = char.toLowerCase(),
      firstChars = (startIndex, char) => {
        for (var i = startIndex; i < this.firstChars.length; i++) {
          if (char === this.firstChars[i]) {
            return i;
          }
        }
        return -1;
      };

    // Get start index for search based on position of currentItem
    start = this.__menuItems.indexOf(this.currentItem) + 1;
    if (start === this.__menuItems.length) {
      start = 0;
    }

    // Check remaining slots in the menu
    index = firstChars(start, char);

    // If not found in remaining slots, check from beginning
    if (index === -1) {
      index = firstChars(0, char);
    }

    // If match was found...
    if (index > -1) {
      this.__menuItems[index].focus();
    }
  }
  firstItem() {
    return this.querySelector("a11y-menu-button-item");
  }
  previousItem() {
    return this.currentItem
      ? this.currentItem.previousElementSibling
      : undefined;
  }
  nextItem() {
    return this.currentItem ? this.currentItem.nextElementSibling : undefined;
  }
  lastItem() {
    return this.querySelector("a11y-menu-button-item:last-child");
  }
  _handleAddItem(event) {
    event.stopPropagation();
    this.__menuItems = this.querySelectorAll("a11y-menu-button-item");
    if (event.detail) {
      event.detail.addEventListener("keydown", (e) =>
        this._handleItemKeydown(e, event.detail)
      );
      event.detail.addEventListener("click", this._handleItemClick.bind(this));
      event.detail.addEventListener("focus", this._handleFocus.bind(this));
      event.detail.addEventListener("blur", this._handleBlur.bind(this));
      event.detail.addEventListener(
        "mouseover",
        this._handleMouseover.bind(this)
      );
      event.detail.addEventListener(
        "mouseout",
        this._handleMouseout.bind(this)
      );
    }
  }
  _handleRemoveItem(event) {
    event.stopPropagation();
    this.__menuItems = this.querySelectorAll("a11y-menu-button-item");
    if (event.detail) {
      event.detail.removeEventListener("keydown", (e) =>
        this._handleItemKeydown(e, event.detail)
      );
      event.detail.removeEventListener(
        "click",
        this._handleItemClick.bind(this)
      );
      event.detail.removeEventListener("focus", this._handleFocus.bind(this));
      event.detail.removeEventListener("blur", this._handleItemBlur.bind(this));
      event.detail.removeEventListener(
        "mouseover",
        this._handleMouseover.bind(this)
      );
      event.detail.removeEventListener(
        "mouseout",
        this._handleMouseout.bind(this)
      );
    }
  }
  _handleItemClick(event) {
    console.log("_handleItemClick", event);
    this.focus();
    this.close(true);
  }
  _handleItemKeydown(event, item) {
    console.log("_handleItemClick", event, item);
    var flag = false,
      char = event.key,
      isPrintableCharacter = (str) => str.length === 1 && str.match(/\S/);

    if (
      event.ctrlKey ||
      event.altKey ||
      event.metaKey ||
      event.keyCode === this.keyCode.SPACE ||
      event.keyCode === this.keyCode.RETURN
    ) {
      return;
    }

    if (event.shiftKey) {
      if (isPrintableCharacter(char)) {
        this.menu.setFocusByFirstCharacter(this, char);
        flag = true;
      }

      if (event.keyCode === this.keyCode.TAB) {
        this.focus();
        this.close(true);
      }
    } else {
      switch (event.keyCode) {
        case this.keyCode.ESC:
          this.focus();
          this.close(true);
          flag = true;
          break;

        case this.keyCode.UP:
          this.focusOn(this.previousItem() || this.lastItem());
          flag = true;
          break;

        case this.keyCode.DOWN:
          this.focusOn(this.nextItem() || this.firstItem());
          flag = true;
          break;

        case this.keyCode.HOME:
        case this.keyCode.PAGEUP:
          this.currentItem = this.firstItem();
          flag = true;
          break;

        case this.keyCode.END:
        case this.keyCode.PAGEDOWN:
          this.currentItem = this.lastItem();
          flag = true;
          break;

        case this.keyCode.TAB:
          this.focus();
          this.close(true);
          break;

        default:
          if (isPrintableCharacter(char)) {
            this.menu.setFocusByFirstCharacter(this, char);
          }
          break;
      }
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  _handleItemBlur(event) {
    console.log("_handleItemBlur", event, this);
    this.focused = false;
    setTimeout(this.close(), 300);
  }
  _handleKeydown(event) {
    console.log("_handleKeydown", event);
    var flag = false;

    switch (event.keyCode) {
      case this.keyCode.SPACE:
      case this.keyCode.RETURN:
      case this.keyCode.DOWN:
        this.focusOn(this.firstItem());
        flag = true;
        break;

      case this.keyCode.UP:
        if (this.popupMenu) {
          this.focusOn(this.lastItem());
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
    console.log("_handleClick", event);
    if (this.expanded) {
      this.expanded = false;
    } else {
      this.focusOn(this.firstItem());
    }
  }
  _handleFocus(event) {
    //console.log('_handleFocus',event);
    this.focused = true;
  }

  _handleBlur(event) {
    console.log("_handleBlur", event, this);
    this.focused = false;
  }
  _handleMouseover(event) {
    //console.log('_handleMouseover',event);
    this.hovered = true;
    this.expanded = true;
  }

  _handleMouseout(event) {
    //console.log('_handleMouseout',event);
    this.hovered = false;
    setTimeout(this.close(), 300);
  }
  close(force) {
    if (force || (!this.focused && !this.hovered)) this.expanded = false;
  }
  open() {
    this.expanded = true;
  }

  /**
   * Fires when button is clicked
   * @event change
   * /
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
  }*/
}
window.customElements.define(A11yMenuButton.tag, A11yMenuButton);
export { A11yMenuButton };
