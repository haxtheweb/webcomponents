import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/hax-body/lib/hax-toolbar-item.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/iron-icons/device-icons.js";
import "@polymer/iron-icons/hardware-icons.js";
import "@polymer/iron-icons/social-icons.js";
import "@polymer/iron-icons/av-icons.js";
import "@polymer/iron-icons/image-icons.js";
import "@polymer/iron-icons/maps-icons.js";
import "@polymer/neon-animation/neon-animation.js";
/**
 * `hax-context-item`
 * @customElement hax-context-item
 * `A single button in the hax context menu for consistency.`
 * @microcopy - the mental model for this element
 * - context - menu in the page the user can select an item from, this being 1 option in that list
 * - button - an item that expresses what interaction you will have with the content.
 */
class HaxContextItem extends LitElement {
  constructor() {
    super();
    this.light = false;
    this.large = false;
    this.disabled = false;
    this.mini = false;
    this.menu = false;
    this.direction = "top";
    this.icon = "editor:text-fields";
    this.iconClass = "";
    this.label = "";
    this.eventName = "button";
    this.inputMethod = null;
    this.propertyToBind = null;
    this.slotToBind = null;
    this.default = false;
    this.value = "";
  }
  static get styles() {
    return [
      css`
        :host {
          display: inline-flex;
          height: 36px;
          width: 36px;
        }
        :host([large]),
        :host([mini]) {
          height: unset;
          width: unset;
        }
        :host([menu]) {
          display: flex;
          width: 100%;
        }
      `
    ];
  }

  render() {
    return html`
      <hax-toolbar-item
        ?disabled="${this.disabled}"
        ?light="${this.light}"
        ?mini="${this.mini}"
        ?large="${this.large}"
        id="button"
        height="${this.height}"
        icon="${this.icon}"
        ?hidden="${!this.icon}"
        icon-class="${this.iconClass}"
        @mousedown="${this._storeSelection}"
        @click="${this._fireEvent}"
        tooltip="${this.label}"
        tooltip-direction="${this.direction}"
        ?default="${this.default}"
        ?menu="${this.menu}"
      >
        <slot></slot>
      </hax-toolbar-item>
    `;
  }
  static get tag() {
    return "hax-context-item";
  }

  static get properties() {
    return {
      /**
       * Light theme for toolbar item.
       */
      light: {
        type: Boolean
      },
      height: {
        type: String
      },
      /**
       * disabled state
       */
      disabled: {
        type: Boolean,
        reflect: true
      },
      /**
       * Mini theme for making things small and round.
       */
      mini: {
        type: Boolean
      },
      /**
       * Style to be presented in a menu
       */
      menu: {
        type: Boolean
      },
      /**
       * Direction for the tooltip
       */
      direction: {
        type: String
      },
      /**
       * Icon for the button.
       */
      icon: {
        type: String,
        reflect: true
      },
      /**
       * Icon for the button.
       */
      iconClass: {
        type: String,
        reflect: true,
        attribute: "icon-class"
      },
      /**
       * Label for the button.
       */
      label: {
        type: String,
        reflect: true
      },
      /**
       * Name of the event to bubble up as being tapped.
       * This can be used to tell other elements what was
       * clicked so it can take action appropriately.
       */
      eventName: {
        type: String,
        reflect: true,
        attribute: "event-name"
      },
      /**
       * Method of input to display when activated. This is
       * only used when triggered as part of haxProperties
       */
      inputMethod: {
        type: String,
        reflect: true,
        attribute: "input-method"
      },
      /**
       * Optional slot to bind this value to.
       */
      propertyToBind: {
        type: String,
        reflect: true,
        attribute: "property-to-bind"
      },
      /**
       * Optional slot to bind this value to.
       */
      slotToBind: {
        type: String,
        reflect: true,
        attribute: "slot-to-bind"
      },
      /**
       * Optional description for this item.
       */
      description: {
        type: String,
        reflect: true
      },
      large: {
        type: Boolean,
        reflect: true
      },
      /**
       * Is this button concidered a primary interaction
       */
      default: {
        type: Boolean
      },
      /**
       * an optional value to send along in the press. Allows for
       * reusing events more easily
       */
      value: {
        type: String
      }
    };
  }
  /**
   * Store the selection object. This helps fix issues with safari
   * and holding focus on non-text elements actually stealing
   * the selection priority, making it impossible to know what's
   * been selected if clicking a button to try and apply something to.
   */
  _storeSelection(e) {
    window.HaxStore._tmpSelection = window.HaxStore.getSelection();
  }
  /**
   * Fire an event that includes the eventName of what was just pressed.
   */
  _fireEvent(e) {
    this.dispatchEvent(
      new CustomEvent("hax-context-item-selected", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          target: this,
          eventName: this.eventName,
          value: this.value
        }
      })
    );
  }
}

window.customElements.define(HaxContextItem.tag, HaxContextItem);
export { HaxContextItem };
