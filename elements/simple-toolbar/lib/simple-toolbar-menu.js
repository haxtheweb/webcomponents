import { LitElement, html, css } from "lit";
import { A11yMenuButtonBehaviors } from "@lrnwebcomponents/a11y-menu-button/a11y-menu-button.js";
import { SimpleToolbarButtonBehaviors } from "./simple-toolbar-button.js";
import "./simple-toolbar-menu-item.js";
/**
 * `simple-toolbar-menu`
 * `An icon / button that has support for multiple options via drop down.`
 *
 * @microcopy - the mental model for this element
 * - panel - the flyout from left or right side that has elements that can be placed
 * - button - an item that expresses what interaction you will have with the content.
 *
 * @extends A11yMenuButtonBehaviors
 * @extends SimpleToolbarButtonBehaviors
 * @element simple-toolbar-menu
 *
 */
const SimpleToolbarMenuBehaviors = function (SuperClass) {
  return class extends A11yMenuButtonBehaviors(
    SimpleToolbarButtonBehaviors(SuperClass)
  ) {
    static get simpleButtonCoreStyles() {
      return [
        ...super.simpleButtonCoreStyles,
        css`
          #menubutton {
            display: flex;
            flex-wrap: none;
            align-items: center;
            min-width: 42px;
          }
          .label {
            padding: 0 5px;
          }
          #dropdownicon {
            --simple-icon-height: 18px;
            --simple-icon-width: 18px;
            margin-left: -2px;
          }
        `,
      ];
    }
    constructor() {
      super();
      this.tooltipDirection = "top";
    }
    static get simpleButtonLayoutStyles() {
      return [
        ...super.simpleButtonLayoutStyles,
        css`
          #menu {
            width: var(--simple-toolbar-button-width);
            min-width: var(--simple-toolbar-button-min-width);
          }
        `,
      ];
    }

    static get simpleButtonThemeStyles() {
      return [
        ...super.simpleButtonThemeStyles,
        css`
          :host([expanded]) absolute-position-behavior {
            border-style: solid;
            border-width: var(
              --simple-toolbar-button-border-width,
              var(--simple-toolbar-border-width, 1px)
            );
            border-color: var(
              --simple-toolbar-button-border-color,
              var(--simple-toolbar-border-color, inherit)
            );
            background-color: var(--simple-toolbar-button-bg, white);
            box-shadow: var(--simple-toolbar-menu-list-box-shadow, unset);
          }
        `,
      ];
    }
    static get styles() {
      return [
        ...super.menuButtonCoreStyles,
        ...this.simpleButtonCoreStyles,
        ...this.iconStyles,
        ...this.labelStyles,
        ...this.tooltipStyles,
        ...this.simpleButtonLayoutStyles,
        ...this.simpleButtonThemeStyles,
      ];
    }

    get buttonTemplate() {
      return html`
        <button
          id="menubutton"
          aria-haspopup="true"
          aria-controls="menu"
          aria-expanded="${this.expanded ? "true" : "false"}"
          @blur="${this._handleBlur}"
          part="button"
          tabindex="${this.isCurrentItem ? 1 : -1}"
        >
          ${this.buttonInnerTemplate}
          <simple-icon-lite
            id="dropdownicon"
            icon="arrow-drop-down"
            aria-hidden="true"
            part="dropdown-icon"
          ></simple-icon-lite>
        </button>
        ${this.tooltipTemplate}
      `;
    }
    /**
     * template for button tooltip
     *
     * @readonly
     */
    get tooltipTemplate() {
      return !this.tooltipVisible
        ? ""
        : html`<simple-tooltip
            id="tooltip"
            for="menubutton"
            position="${this.tooltipDirection || "top"}"
            part="tooltip"
            fit-to-visible-bounds
            >${this.currentTooltip || this.currentLabel}</simple-tooltip
          >`;
    }

    static get tag() {
      return "simple-toolbar-menu";
    }
    static get properties() {
      return {
        ...super.properties,
      };
    }
    get focusableElement() {
      return this.shadowRoot && this.shadowRoot.querySelector("#menubutton")
        ? this.shadowRoot.querySelector("#menubutton")
        : undefined;
    }

    /**
     * handles when menu has focus
     *
     * @param {event} event
     * @memberof A11yMenuButton
     */
    _handleFocus(event) {
      if (SimpleToolbarButtonBehaviors._handleFocus)
        SimpleToolbarButtonBehaviors._handleFocus(event);
      if (A11yMenuButtonBehaviors._handleFocus)
        A11yMenuButtonBehaviors._handleFocus(event);
    }

    /**
     * handles when menu loses focus
     *
     * @param {event} event
     * @memberof A11yMenuButton
     */
    _handleBlur(event) {
      if (SimpleToolbarButtonBehaviors._handleBlur)
        SimpleToolbarButtonBehaviors._handleBlur(event);
      if (A11yMenuButtonBehaviors._handleBlur)
        A11yMenuButtonBehaviors._handleBlur(event);
      if (!this.isCurrentItem) setTimeout(this.close(), 300);
    }
    addItem(item) {
      if (this.getItemIndex(item) < 0) {
        let listeners = this.itemListeners;
        this.__menuItems = this.__menuItems || [];
        this.__menuItems.push(item);
        Object.keys(listeners).forEach((evt) =>
          (item.focusableElement || item).addEventListener(
            evt,
            listeners[evt].bind(this)
          )
        );
      }
    }
    removeItem(item) {
      if (this.getItemIndex(item) < 0) {
        let listeners = this.itemListeners;
        Object.keys(listeners).forEach((evt) =>
          (item.focusableElement || item).removeEventListener(
            evt,
            listeners[evt].bind(this)
          )
        );
        if (this.__menuItems)
          this.__menuItems = [...this.menuItems.filter((i) => item !== i)];
      }
    }
  };
};
/**
 *
 *
 * @class SimpleToolbarMenu
 * @extends {SimpleToolbarMenuBehaviors(LitElement)}
 * @customElement
 * @extends SimpleToolbarButtonBehaviors
 * @extends LitElement
 * @lit-html
 * @lit-element
 * @demo ./demo/menu.html
 */
class SimpleToolbarMenu extends SimpleToolbarMenuBehaviors(LitElement) {}
window.customElements.define(SimpleToolbarMenu.tag, SimpleToolbarMenu);
export { SimpleToolbarMenu, SimpleToolbarMenuBehaviors };
