import "@polymer/polymer/polymer.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/iron-icons/device-icons.js";
import "@polymer/iron-icons/hardware-icons.js";
import "@polymer/iron-icons/social-icons.js";
import "@polymer/iron-icons/av-icons.js";
import "@polymer/iron-icons/image-icons.js";
import "@polymer/iron-icons/maps-icons.js";
import "@polymer/neon-animation/web-animations.js";
import "./hax-toolbar-item.js";
/**
`hax-context-item`
A single button in the hax context menu for consistency.

@demo demo/index.html

@microcopy - the mental model for this element
 - context - menu in the page the user can select an item from, this being 1 option in that list
 - button - an item that expresses what interaction you will have with the content.

*/
Polymer({
  _template: `
    <style>
      :host {
        display: inline-flex;
      }
      :host[menu] {
        display: flex;
        width: 100%;
      }
    </style>
    <hax-toolbar-item disabled="[[disabled]]" light="[[light]]" mini="[[mini]]" id="button" icon="[[icon]]" hidden\$="[[!icon]]" icon-class="[[iconClass]]" on-tap="_fireEvent" tooltip="[[label]]" tooltip-direction="[[direction]]" default="[[default]]" menu="[[menu]]">
      <slot></slot>
    </hax-toolbar-item>
`,

  is: "hax-context-item",

  properties: {
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
      value: "editor:text-fields",
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
  },

  /**
   * Fire an event that includes the eventName of what was just pressed.
   */
  _fireEvent: function(e) {
    this.fire("hax-context-item-selected", {
      target: this,
      eventName: this.eventName,
      value: this.value
    });
  }
});
