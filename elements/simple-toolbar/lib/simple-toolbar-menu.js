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
          part="button"
        >
          ${this.iconTemplate} ${this.labelTemplate}
          <simple-icon-lite
            id="dropdownicon"
            icon="arrow-drop-down"
            aria-hidden="true"
            part="dropdown-icon"
          ></simple-icon-lite>
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
    static get tag() {
      return "simple-toolbar-menu";
    }
    static get properties() {
      return {
        ...super.properties,
      };
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
