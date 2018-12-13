import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
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
import "@lrnwebcomponents/materializecss-styles/lib/colors.js";
import "@polymer/neon-animation/neon-animation.js";
import "./hax-toolbar-item.js";
/**
`hax-context-item-textop`
A single button in the hax context menus for consistency. This one uses the mousedown event becasue tap won't work in safari / firefox / IE while maintaining focus inside the contenteditable area (stupid, I know)

* @demo demo/index.html

@microcopy - the mental model for this element
 - context - menu in the page the user can select an item from, this being 1 option in that list
 - button - an item that expresses what interaction you will have with the content.

*/
Polymer({
  _template: html`
    <style include="materializecss-styles-colors">
      :host {
        display: inline-flex;
        box-sizing: border-box;
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
      corner="[[corner]]"
      id="button"
      icon="[[icon]]"
      hidden\$="[[!icon]]"
      tooltip-direction="[[direction]]"
      tooltip="[[label]]"
      class\$="[[iconClass]]"
      on-mousedown="_fireEvent"
      icon-class="[[iconClass]]"
      mini="[[mini]]"
      menu="[[menu]]"
      light="[[light]]"
    >
      <slot></slot>
    </hax-toolbar-item>
  `,

  is: "hax-context-item-textop",

  properties: {
    /**
     * corner
     */
    corner: {
      type: String,
      value: ""
    },
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
    }
  },

  /**
   * Ready.
   */
  ready: function() {
    // bind keyboard to button press
    this.target = this.$.button;
  },

  /**
   * Fire an event that includes the eventName of what was just pressed.
   */
  _fireEvent: function(e) {
    this.fire("hax-context-item-selected", {
      target: this,
      eventName: this.eventName
    });
  }
});
