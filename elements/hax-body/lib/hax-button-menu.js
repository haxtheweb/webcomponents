import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import { A11yMenuButtonBehaviors } from "@lrnwebcomponents/a11y-menu-button/a11y-menu-button.js";
/**
 * `hax-button-menu`
 * `An icon / button that has support for multiple options via drop down.`
 *
 * @microcopy - the mental model for this element
 * - panel - the flyout from left or right side that has elements that can be placed
 * - button - an item that expresses what interaction you will have with the content.
 *
 * Eextends A11yMenuButtonBehaviors
 * @element hax-button-menu
 *
 */
class HaxButtonMenu extends A11yMenuButtonBehaviors(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      ...super.styles,
      css`
        .sr-only {
          position: absolute;
          left: -99999999px;
          width: 0;
          height: 0;
          overflow: hidden;
        }
        :host([disabled]) {
          pointer-events: none;
        }
        :host([danger]) {
          --a11y-menu-button-focus-color: var(
            --hax-toolbar-button-danger-color,
            #882222
          );
          --a11y-menu-button-focus-border: 1px solid
            var(--hax-toolbar-button-danger-color, #882222);
        }
        button {
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
        absolute-position-behavior {
          --a11y-menu-button-border: 1px solid
            var(--hax-toolbar-button-hover-border-color, #000);
          z-index: 1001;
        }
      `,
    ];
  }
  constructor() {
    super();
    this._blockEvent = false;
    this.disabled = false;
    this.direction = "top";
    this.label = "";
  }

  get buttonTemplate() {
    return html`
      <button
        id="menubutton"
        aria-haspopup="true"
        aria-controls="menu"
        aria-expanded="${this.expanded ? "true" : "false"}"
      >
        <simple-icon-lite
          icon="${this.icon}"
          aria-hidden="true"
          ?hidden=${!this.icon}
        ></simple-icon-lite>
        <span class="${!this.icon || this.showTextLabel ? "label" : "sr-only"}"
          >${this.label}</span
        >
        <simple-icon-lite
          id="dropdownicon"
          icon="arrow-drop-down"
          aria-hidden="true"
        ></simple-icon-lite>
      </button>
      <simple-tooltip for="menubutton" ?hidden="${!this.icon}"
        >${this.label}</simple-tooltip
      >
    `;
  }
  /**
   * template for slotted list items
   *
   * @readonly
   */
  get listItemTemplate() {
    return html`<slot name="menuitem"></slot>`;
  }
  selectedValueChanged(e) {
    this.selectedValue = e.detail;
  }
  static get tag() {
    return "hax-button-menu";
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * disabled state
       */
      disabled: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Internal flag to allow blocking the event firing if machine selects tag.
       */
      _blockEvent: {
        type: Boolean,
      },

      /**
       * Show text label even if an icon is named?
       */
      showTextLabel: {
        attribute: "show-text-label",
        type: Boolean,
        reflect: true,
      },
      /**
       * Direction for the tooltip
       */
      direction: {
        type: String,
      },
      /**
       * Icon for the button.
       */
      icon: {
        type: String,
        reflect: true,
      },
      /**
       * Label for the button.
       */
      label: {
        type: String,
        reflect: true,
      },
      /**
       * Name of the event to bubble up as being tapped.
       * This can be used to tell other elements what was
       * clicked so it can take action appropriately.
       */
      eventName: {
        type: String,
        attribute: "event-name",
      },
    };
  }
}
window.customElements.define(HaxButtonMenu.tag, HaxButtonMenu);
export { HaxButtonMenu };
