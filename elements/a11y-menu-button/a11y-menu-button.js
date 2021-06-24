/**
 * Copyright 2018 Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "./lib/a11y-menu-button-item.js";
import "@lrnwebcomponents/absolute-position-behavior/absolute-position-behavior.js";

const A11yMenuButtonBehaviors = function (SuperClass) {
  return class extends SuperClass {
    /**
     * the core styles needed to make a menu button
     *
     * @readonly
     * @static
     */
    static get menuButtonCoreStyles() {
      return [
        css`
          :host {
            padding: 0;
            display: inline-flex;
            position: relative;
            z-index: 1;
          }
          :host([expanded]) {
            z-index: var(--a11y-menu-button-focus-z-index, 1000);
          }
          button[part="button"] {
            display: block;
            text-decoration: inherit;
            font-family: inherit;
            font-size: inherit;
            margin: 0;
            width: 100%;
          }
          absolute-position-behavior {
            z-index: -1;
            overflow: hidden;
          }
          :host([expanded]) absolute-position-behavior {
            z-index: var(--a11y-menu-button-focus-z-index, 1000);
          }
          :host(:not([expanded])) absolute-position-behavior {
            border-color: none !important;
          }
          ul {
            margin: 0;
            padding: 0;
            list-style: none;
          }
        `,
      ];
    }
    /**
     * styles that can be customized by
     * extending and overriding this getter
     *
     * @readonly
     * @static
     */
    static get menuButtonThemeStyles() {
      return [
        css`
          button[part="button"] {
            padding: var(--a11y-menu-button-vertical-padding, 2px)
              var(--a11y-menu-button-horizontal-padding, 5px);
            text-align: var(--a11y-menu-button-text-align, center);
            background-color: var(--a11y-menu-button-bg-color, white);
            color: var(--a11y-menu-button-color, currentColor);
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
          button[part="button"]:focus,
          button[part="button"]:hover {
            color: var(
              --a11y-menu-button-focus-color,
              var(--a11y-menu-button-color, currentColor)
            );
            background-color: var(
              --a11y-menu-button-focus-bg-color,
              var(--a11y-menu-button-bg-color, white)
            );
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
          :host([expanded]) absolute-position-behavior {
            width: var(--a11y-menu-button-list-width, unset);
            height: var(--a11y-menu-button-list-height, unset);
            border: var(
              --a11y-menu-button-list-border,
              var(--a11y-menu-button-border, 1px solid #ddd)
            );
            background-color: var(
              --a11y-menu-button-bg-color,
              var(--a11y-menu-button-list-bg-color, white)
            );
            box-shadow: var(--a11y-menu-button-list-box-shadow, unset);
          }
        `,
      ];
    }
    static get styles() {
      return [...this.menuButtonCoreStyles, ...this.menuButtonThemeStyles];
    }
    render() {
      return html` ${this.buttonTemplate} ${this.menuTemplate} `;
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
         * Whether button is toggled
         */
        focused: {
          attribute: "focused",
          type: Boolean,
        },
        /**
         * Whether button is toggled
         */
        hovered: {
          attribute: "hovered",
          type: Boolean,
        },
        /**
         * spacing between top of list and menu button
         */
        offset: {
          type: Number,
          attribute: "offset",
        },
        /**
         * Positions list to top, right, bottom, left of its content.
         */
        position: {
          type: String,
          attribute: "position",
          reflect: true,
        },
        /**
         * Aligns list at start, or end fo target. Default is centered.
         */
        positionAlign: {
          type: String,
          attribute: "position-align",
          reflect: true,
        },
        /**
         * menu items in array form to move from prev to next
         */
        __menuItems: {
          type: Array,
        },
      };
    }
    constructor() {
      super();
      this.__menuItems = [];
      this.position = "bottom";
      this.positionAlign = "start";
      this.offset = 0;
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
    /**
     * template for dropdown menu
     *
     * @readonly
     */
    get menuTemplate() {
      return html`
        <absolute-position-behavior
          ?auto="${this.expanded}"
          for="menubutton"
          position="${this.position}"
          position-align="${this.positionAlign}"
          .offset="${this.offset}"
          fit-to-visible-bounds
          part="menu-outer"
        >
          <ul
            id="menu"
            role="menu"
            aria-labelledby="menubutton"
            ?hidden="${!this.expanded}"
            @mousover="${(e) => (this.hover = true)}"
            @mousout="${(e) => (this.hover = false)}"
            part="menu"
          >
            ${this.listItemTemplate}
          </ul>
        </absolute-position-behavior>
      `;
    }
    /**
     * template for button
     *
     * @readonly
     */
    get buttonTemplate() {
      return html`
        <button
          id="menubutton"
          aria-haspopup="true"
          aria-controls="menu"
          aria-expanded="${this.expanded ? "true" : "false"}"
          part="button"
        >
          <slot name="button"></slot>
        </button>
      `;
    }
    /**
     * template for slotted list items
     *
     * @readonly
     */
    get listItemTemplate() {
      return html`<slot></slot>`;
    }
    /**
     * key code translations as object
     *
     * @readonly
     * @memberof A11yMenuButton
     */
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
    /**
     * closes menu
     *
     * @param {boolean} force close even if other items have focus
     * @memberof A11yMenuButton
     */
    close(force) {
      if (force || (!this.focused && !this.hovered)) {
        this.expanded = false;
        /**
         * Fires when menu is closed
         * @event close
         */
        this.dispatchEvent(
          new CustomEvent("close", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: event,
          })
        );
      }
    }
    /**
     * opens menu
     *
     * @memberof A11yMenuButton
     */
    open() {
      this.expanded = true;
      /**
       * Fires when menu is opened
       * @event close
       */
      this.dispatchEvent(
        new CustomEvent("open", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: event,
        })
      );
    }
    /**
     * gives focus to menu
     *
     * @memberof A11yMenuButton
     */
    focus() {
      if (this.shadowRoot && this.shadowRoot.querySelector("#menubutton")) {
        this.shadowRoot.querySelector("#menubutton").focus();
      }
    }
    /**
     * focuses on a menu item
     *
     * @param {object} item menu item
     * @memberof A11yMenuButton
     */
    focusOn(item) {
      item = item || this.firstItem();
      if (item) {
        this.open();
        this.focused = true;
        this.currentItem = item;
        item.focus();
      }
    }
    /**
     * focuses on item based on character pressed
     *
     * @param {string} char character pressed
     * @memberof A11yMenuButton
     */
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

      // Check remaining slots in menu
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
    /**
     * gets first menu item
     *
     * @returns {object}
     * @memberof A11yMenuButton
     */
    firstItem() {
      return this.querySelector("a11y-menu-button-item");
    }
    /**
     * gets previous menu item
     *
     * @returns {object}
     * @memberof A11yMenuButton
     */
    previousItem() {
      return this.currentItem
        ? this.currentItem.previousElementSibling
        : undefined;
    }
    /**
     * gets next menu item
     *
     * @returns {object}
     * @memberof A11yMenuButton
     */
    nextItem() {
      return this.currentItem ? this.currentItem.nextElementSibling : undefined;
    }
    /**
     * gets last menu item
     *
     * @returns {object}
     * @memberof A11yMenuButton
     */
    lastItem() {
      return this.querySelector("a11y-menu-button-item:last-child");
    }
    /**
     * when a new menu item is added to slot,
     * updates menu items list and adds event listeners for item
     *
     * @param {event} event
     * @memberof A11yMenuButton
     */
    _handleAddItem(event) {
      event.stopPropagation();
      this.__menuItems = this.querySelectorAll("a11y-menu-button-item");
      if (event.detail) {
        event.detail.addEventListener("keydown", (e) =>
          this._handleItemKeydown(e, event.detail)
        );
        event.detail.addEventListener(
          "click",
          this._handleItemClick.bind(this)
        );
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
    /**
     * when a new menu item is removed from slot,
     * updates menu items list and removes event listeners for item
     *
     * @param {event} event
     * @memberof A11yMenuButton
     */
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
        event.detail.removeEventListener(
          "blur",
          this._handleItemBlur.bind(this)
        );
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
    /**
     * when menu item is clicked,
     * focus on menu button and close menu
     *
     * @param {event} event
     * @memberof A11yMenuButton
     */
    _handleItemClick(event) {
      this.focus();
      this.close(true);
      this.dispatchEvent(
        new CustomEvent("item-click", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: event,
        })
      );
    }
    /**
     * handles menu item keydown
     *
     * @param {event} event
     * @param {object} item
     * @memberof A11yMenuButton
     */
    _handleItemKeydown(event, item) {
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
    /**
     * handles when menu item loses focus
     *
     * @param {event} event
     * @memberof A11yMenuButton
     */
    _handleItemBlur(event) {
      this.focused = false;
      setTimeout(this.close(), 300);
    }
    /**
     * handles menu button keydown
     *
     * @param {event} event
     * @memberof A11yMenuButton
     */
    _handleKeydown(event) {
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
    /**
     * handles when menu is clicked
     *
     * @param {event} event
     * @memberof A11yMenuButton
     */
    _handleClick(event) {
      if (this.expanded) {
        this.close(true);
      } else {
        this.focusOn(this.firstItem());
      }
    }
    /**
     * handles when menu has focus
     *
     * @param {event} event
     * @memberof A11yMenuButton
     */
    _handleFocus(event) {
      this.focused = true;
    }

    /**
     * handles when menu loses focus
     *
     * @param {event} event
     * @memberof A11yMenuButton
     */
    _handleBlur(event) {
      this.focused = false;
    }
    /**
     * handles menu mouseover
     *
     * @param {event} event
     * @memberof A11yMenuButton
     */
    _handleMouseover(event) {
      this.hovered = true;
      this.open();
    }

    /**
     * handles menu mouseout
     *
     * @param {event} event
     * @memberof A11yMenuButton
     */
    _handleMouseout(event) {
      this.hovered = false;
      setTimeout(this.close(), 300);
    }
  };
};

/**
 * a11y-menu-button
 * A toggle button for an property in editable-table interface (editable-table.html).
 *
### Styling

`<a11y-menu-button>` provides custom properties for styling:

Custom property | Description | Default
----------------|-------------|----------
--a11y-menu-button-vertical-padding | vertical padding for menu button | 2px
--a11y-menu-button-horizontal-padding | horizontal padding for menu button | 5px
--a11y-menu-button-text-align | text alignment for menu button | center
--a11y-menu-button-bg-color | default background color | white
--a11y-menu-button-color | default text color | black
--a11y-menu-button-box-shadow | menu button box-shadow | unset
--a11y-menu-button-border-radius | menu button border-radius | 0
--a11y-menu-button-border | default border | 1px solid #ddd
--a11y-menu-button-border-left | overrides default left-border | unset
--a11y-menu-button-border-top | overrides default top-border | unset
--a11y-menu-button-border-right | overrides default right-border | unset
--a11y-menu-button-border-bottom | overrides default bottom-border | unset
--a11y-menu-button-focus-bg-color | background color for menu button when focused | --a11y-menu-button-bg-color
--a11y-menu-button-focus-color | text color for menu button when focused | --a11y-menu-button-color
--a11y-menu-button-focus-border | border for menu button when focused | --a11y-menu-button-border
--a11y-menu-button-focus-border-left | menu button left-border when focused | --a11y-menu-button-border-left
--a11y-menu-button-focus-border-top | menu button top-border when focused | --a11y-menu-button-border-top
--a11y-menu-button-focus-border-right | menu button right-border when focused | --a11y-menu-button-border-right
--a11y-menu-button-focus-border-bottom | menu button bottom-border when focused | --a11y-menu-button-border-bottom
--a11y-menu-button-focus-box-shadow | menu button box-shadow when focused | --a11y-menu-button-box-shadow
--a11y-menu-button-list-width | width of menu list | unset
--a11y-menu-button-list-height | height of menu list | unset
--a11y-menu-button-list-left | left position of menu list | 0
--a11y-menu-button-list-top | top position of menu list | unset
--a11y-menu-button-list-bottom | bottom position of menu list | unset
--a11y-menu-button-list-right | right position of menu list | unset
--a11y-menu-button-list-bg-color | overrides default background color for list box | --a11y-menu-button-bg-color
--a11y-menu-button-border | overrides default border for list box | --a11y-menu-button-list-border
--a11y-menu-button-list-box-shadow | overrides default box shadow for list box | unset
 *
 * @demo ./demo/index.html
 * @element a11y-menu-button
 */
class A11yMenuButton extends A11yMenuButtonBehaviors(LitElement) {}
window.customElements.define(A11yMenuButton.tag, A11yMenuButton);
export { A11yMenuButton, A11yMenuButtonBehaviors };
