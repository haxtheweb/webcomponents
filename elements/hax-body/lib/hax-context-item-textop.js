import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
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
 * `hax-context-item-textop`
 * @customElement hax-context-item-textop
 * `A single button in the hax context menus for consistency. This one uses the mousedown event becasue tap won't work in safari / firefox / IE while maintaining focus inside the contenteditable area (stupid, I know)`
 * @microcopy - the mental model for this element
 * - context - menu in the page the user can select an item from, this being 1 option in that list
 * - button - an item that expresses what interaction you will have with the content.
 */
class HaxContextItemTextop extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: inline-flex;
          box-sizing: border-box;
          height: 36px;
          width: 36px;
        }
        :host([menu]) {
          display: flex;
          width: 100%;
        }
      `
    ];
  }
  constructor() {
    super();
    this.label = "";
    this.light = false;
    this.mini = false;
    this.menu = false;
    this.direction = "top";
    this.icon = "editor:text-fields";
    this.eventName = "button";
    this.inputMethod = null;
    this.propertyToBind = null;
    this.slotToBind = null;
    this.value = "";
  }
  render() {
    return html`
      <iron-a11y-keys
        id="a11y"
        keys="enter"
        @keys-pressed="${this._fireEvent}"
      ></iron-a11y-keys>
      <hax-toolbar-item
        id="button"
        icon="${this.icon}"
        .hidden="${!this.icon}"
        tooltip-direction="${this.direction}"
        tooltip="${this.label}"
        @mousedown="${this._fireEvent}"
        .mini="${this.mini}"
        .menu="${this.menu}"
        .light="${this.light}"
      >
        <slot></slot>
      </hax-toolbar-item>
    `;
  }
  static get tag() {
    return "hax-context-item-textop";
  }
  static get properties() {
    return {
      /**
       * Light theme for toolbar item.
       */
      light: {
        type: Boolean,
        value: false
      },
      /**
       * an optional value to send along in the press. Allows for
       * reusing events more easily
       */
      value: {
        type: String
      },
      /**
       * Mini theme for making things small and round.
       */
      mini: {
        type: Boolean,
        value: false
      },
      /**
       * Style to be presented in a menu
       */
      menu: {
        type: Boolean,
        value: false
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
      }
    };
  }

  /**
   * attached life cycle
   */
  firstUpdated(changedProperties) {
    // bind keyboard to button press
    this.shadowRoot.querySelector(
      "#a11y"
    ).target = this.shadowRoot.querySelector("#button");
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
window.customElements.define(HaxContextItemTextop.tag, HaxContextItemTextop);
export { HaxContextItemTextop };
