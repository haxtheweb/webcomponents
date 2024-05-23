/**
 * Copyright 2018 Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "./lib/a11y-menu-button-item.js";
import "@haxtheweb/absolute-position-behavior/absolute-position-behavior.js";
import { normalizeEventPath } from "@haxtheweb/utils/utils.js";

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
            transition: z-index 0s;
          }
          :host([expanded]) absolute-position-behavior {
            z-index: var(--a11y-menu-button-focus-z-index, 1000);
            transition: z-index 0s;
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
         * overrides default behavior of closing
         * menu after an item is clicked
         */
        keepOpenOnClick: {
          attribute: "keep-open-on-click",
          type: Boolean,
        },
        /**
         * menu items in array form to move from prev to next
         */
        menuItems: {
          type: Array,
        },
        /**
         * disables menu i=opening on hover
         */
        noOpenOnHover: {
          attribute: "no-open-on-hover",
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
      };
    }
    constructor() {
      super();
      this.position = "bottom";
      this.positionAlign = "start";
      this.offset = 0;
      this.expanded = false;
      this.menuItems = [];
      this.keepOpenOnClick = false;
      this.noOpenOnHover = false;
      [...this.children]
        .filter((n) => n.slot === "menuitem")
        .forEach((item) => this.addItem(item));
      this.addEventListener("keydown", this._handleKeydown);
      this.addEventListener("click", this._handleClick);
      this.addEventListener("focus", this._handleFocus);
      this.addEventListener("blur", this._handleBlur);
      this.addEventListener("mouseover", this._handleMouseover);
      this.addEventListener("mouseout", this._handleMouseout);
      this.addEventListener("add-a11y-menu-button-item", this._handleAddItem);
      this.addEventListener(
        "remove-a11y-menu-button-item",
        this._handleRemoveItem,
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
      return html`<slot name="menuitem"></slot><slot></slot>`;
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
    close(force = false) {
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
            detail: this,
          }),
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
          detail: this,
        }),
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
      item = item || this.firstItem;
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
      start = this.menuItems.indexOf(this.currentItem) + 1;
      if (start === this.menuItems.length) {
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
        this.menuItems[index].focus();
      }
    }
    /**
     * gets first menu item
     *
     * @returns {object}
     * @memberof A11yMenuButton
     */
    get firstItem() {
      return this.menuItems[0];
    }
    /**
     * gets previous menu item
     *
     * @returns {object}
     * @memberof A11yMenuButton
     */
    get previousItem() {
      return this.getItem(-1);
    }
    /**
     * gets next menu item
     *
     * @returns {object}
     * @memberof A11yMenuButton
     */
    get nextItem() {
      return this.getItem();
    }
    /**
     * gets last menu item
     *
     * @returns {object}
     * @memberof A11yMenuButton
     */
    get lastItem() {
      return this.menuItems[this.menuItems.length - 1];
    }
    /**
     * gets list of menu item first characters
     *
     * @readonly
     */
    get firstChars() {
      return this.menuItems.map((item) => {
        let textContent = (item.textContent || "").trim();
        return (textContent || " ").substring(0, 1).toLowerCase();
      });
    }
    /**
     * gets index of a menuitem
     *
     * @returns {number}
     */
    getItemIndex() {
      let index = -1;
      this.menuItems.forEach((b, i) => {
        if (b === this.currentItem) index = i;
      });
      return index;
    }
    /**
     * gets a menuitem relative to the current item
     *
     * @param {number} [offset=1] number of items after current menuitem in order, -1 for item before
     * @returns
     */
    getItem(offset = 1) {
      let index = this.getItemIndex(this.currentItem) + offset;
      return !this.menuItems || index < 0 || this.menuItems.length <= index
        ? undefined
        : this.menuItems[index];
    }
    /**
     * menuitem event listeners and their handlers
     *
     * @readonly {object}
     */
    get itemListeners() {
      return {
        click: this._handleItemClick,
        focus: this._handleFocus,
        blur: this._handleBlur,
        mouseover: this._handleMouseover,
        mouseout: this._handleMouseout,
        keydown: this._handleItemKeydown,
      };
    }
    /**
     * adds a menuitem to lists and sets up its listeners
     *
     * @param {ibject} item menu item element
     */
    addItem(item) {
      let listeners = this.itemListeners;
      this.menuItems = this.menuItems || [];
      Object.keys(listeners).forEach((evt) =>
        item.addEventListener(evt, listeners[evt].bind(this)),
      );
      this.menuItems.push(item);
    }
    /**
     * removes a menuitem's listners and menuitem istelf from list
     *
     * @param {ibject} item menu item element
     */
    removeItem(item) {
      let listeners = this.itemListeners;
      if (this.menuItems)
        this.menuItems = [...this.menuItems.filter((i) => item !== i)];
      Object.keys(listeners).forEach((evt) =>
        item.removeEventListener(evt, listeners[evt].bind(this)),
      );
    }
    /**
     * when a new menu item is added to slot,
     * updates menu items list and adds event listeners for item
     *
     * @param {event} event
     * @memberof A11yMenuButton
     */
    _handleAddItem(event) {
      if (event.stopPropagation) event.stopPropagation();
      if (event.detail) this.addItem(event.detail);
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
      if (event.detail) this.addItem(event.detail);
    }
    /**
     * when menu item is clicked,
     * focus on menu button and close menu
     *
     * @param {event} event
     * @memberof A11yMenuButton
     */
    _handleItemClick(event) {
      if (!this.keepOpenOnClick) {
        this.focus();
        this.close(true);
      }
      this.dispatchEvent(
        new CustomEvent("item-click", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: event,
        }),
      );
      event.stopPropagation();
    }
    /**
     * can be overridden when extending this button,
     * so that certain elements in menuitems are excluded from keyboard handling
     *
     * @param {event} event
     * @returns
     */
    _excludeEvent(event) {
      return false;
    }
    /**
     * handles menu item keydown, as prescribed in
     * {@link https://www.w3.org/TR/wai-aria-practices/examples/menu-button/menu-button-links.html} and
     * {@link https://www.w3.org/TR/wai-aria-practices/examples/menu-button/menu-button-actions-active-descendant.html}
     *
     * @param {event} event
     * @memberof A11yMenuButton
     */
    _handleItemKeydown(event) {
      let flag = false,
        char = event.key,
        isPrintableCharacter = (str) => str.length === 1 && str.match(/\S/),
        path = normalizeEventPath(event) || [],
        target = path[0];

      //don't handle form field keystrokes
      if (
        !isPrintableCharacter(char) &&
        (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) ||
          this._excludeEvent(event))
      )
        return;
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
          this.focusByCharacter(char);
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
            this.focusOn(this.previousItem || this.lastItem);
            flag = true;
            break;

          case this.keyCode.DOWN:
            this.focusOn(this.nextItem || this.firstItem);
            flag = true;
            break;

          case this.keyCode.HOME:
          case this.keyCode.PAGEUP:
            this.currentItem = this.firstItem;
            flag = true;
            break;

          case this.keyCode.END:
          case this.keyCode.PAGEDOWN:
            this.currentItem = this.lastItem;
            flag = true;
            break;

          case this.keyCode.TAB:
            this.focus();
            this.close(true);
            break;

          default:
            if (isPrintableCharacter(char)) {
              this.focusByCharacter(char);
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
          this.focusOn(this.firstItem);
          flag = true;
          break;

        case this.keyCode.UP:
          if (this.popupMenu) {
            this.focusOn(this.lastItem);
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
      // resolve touch vs pointer input
      if (event.pointerType === "touch") {
      } else {
        if (this.expanded) {
          this.close(true);
        } else {
          this.focusOn(this.firstItem);
        }
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
      if (!this.noOpenOnHover) this.open();
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
customElements.define(A11yMenuButton.tag, A11yMenuButton);
export { A11yMenuButton, A11yMenuButtonBehaviors };
