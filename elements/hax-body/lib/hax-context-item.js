import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
/**
 * `hax-context-item`
 * `A single button in the hax context menu for consistency.`
 * @microcopy - the mental model for this element
 * - context - menu in the page the user can select an item from, this being 1 option in that list
 * - button - an item that expresses what interaction you will have with the content.
 */
class HaxContextItem extends PolymerElement {
  constructor() {
    super();
    import("@lrnwebcomponents/hax-body/lib/hax-toolbar-item.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/iron-icons/editor-icons.js");
    import("@polymer/iron-icons/device-icons.js");
    import("@polymer/iron-icons/hardware-icons.js");
    import("@polymer/iron-icons/social-icons.js");
    import("@polymer/iron-icons/av-icons.js");
    import("@polymer/iron-icons/image-icons.js");
    import("@polymer/iron-icons/maps-icons.js");
    import("@polymer/neon-animation/neon-animation.js");
  }
  static get template() {
    return html`
      <style>
        :host {
          display: inline-flex;
          height: 36px;
          width: 36px;
        }
        :host([mini]) {
          height: unset;
          width: unset;
        }
        :host([menu]) {
          display: flex;
          width: 100%;
        }
      </style>
      <hax-toolbar-item
        disabled="[[disabled]]"
        light="[[light]]"
        mini="[[mini]]"
        id="button"
        icon="[[icon]]"
        hidden\$="[[!icon]]"
        icon-class="[[iconClass]]"
        on-mousedown="_storeSelection"
        on-click="_fireEvent"
        tooltip="[[label]]"
        tooltip-direction="[[direction]]"
        default="[[default]]"
        menu="[[menu]]"
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
        type: Boolean,
        value: false
      },
      /**
       * disabled state
       */
      disabled: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
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
       * Icon for the button.
       */
      iconClass: {
        type: String,
        value: "",
        reflectToAttribute: true
      },
      /**
       * Label for the button.
       */
      label: {
        type: String,
        value: "",
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
      },
      /**
       * Is this button concidered a primary interaction
       */
      default: {
        type: Boolean,
        value: false
      },
      /**
       * an optional value to send along in the press. Allows for
       * reusing events more easily
       */
      value: {
        type: String,
        value: ""
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
