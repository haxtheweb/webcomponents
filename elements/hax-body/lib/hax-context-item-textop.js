import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
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
 * `A single button in the hax context menus for consistency. This one uses the mousedown event becasue tap won't work in safari / firefox / IE while maintaining focus inside the contenteditable area (stupid, I know)`
 * @microcopy - the mental model for this element
 * - context - menu in the page the user can select an item from, this being 1 option in that list
 * - button - an item that expresses what interaction you will have with the content.
 */
class HaxContextItemTextop extends PolymerElement {
  constructor() {
    super();
  }
  static get template() {
    return html`
      <style>
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
      </style>
      <iron-a11y-keys
        id="a11y"
        target="[[target]]"
        keys="enter"
        on-keys-pressed="_fireEvent"
      ></iron-a11y-keys>
      <hax-toolbar-item
        id="button"
        icon="[[icon]]"
        hidden\$="[[!icon]]"
        tooltip-direction="[[direction]]"
        tooltip="[[label]]"
        on-mousedown="_fireEvent"
        mini="[[mini]]"
        menu="[[menu]]"
        light="[[light]]"
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
       * target for the iron-a11y-keys element.
       */
      target: {
        type: Object
      },
      /**
       * Light theme for toolbar item.
       */
      light: {
        type: Boolean,
        value: false
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
        type: String,
        value: "top"
      },
      /**
       * Icon for the button.
       */
      icon: {
        type: String,
        value: "editor:text-fields",
        reflectToAttribute: true
      },
      /**
       * Label for the button.
       */
      label: {
        type: String,
        reflectToAttribute: true
      },
      /**
       * Name of the event to bubble up as being tapped.
       * This can be used to tell other elements what was
       * clicked so it can take action appropriately.
       */
      eventName: {
        type: String,
        value: "button",
        reflectToAttribute: true
      },
      /**
       * Method of input to display when activated. This is
       * only used when triggered as part of haxProperties
       */
      inputMethod: {
        type: String,
        value: null,
        reflectToAttribute: true
      },
      /**
       * Optional slot to bind this value to.
       */
      propertyToBind: {
        type: String,
        value: null,
        reflectToAttribute: true
      },
      /**
       * Optional slot to bind this value to.
       */
      slotToBind: {
        type: String,
        value: null,
        reflectToAttribute: true
      },
      /**
       * Optional description for this item.
       */
      description: {
        type: String,
        reflectToAttribute: true
      }
    };
  }

  /**
   * attached life cycle
   */
  connectedCallback() {
    super.connectedCallback();
    // bind keyboard to button press
    this.target = this.shadowRoot.querySelector("#button");
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
          eventName: this.eventName
        }
      })
    );
  }
}
window.customElements.define(HaxContextItemTextop.tag, HaxContextItemTextop);
export { HaxContextItemTextop };
