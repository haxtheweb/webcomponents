import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/iron-icons/device-icons.js";
import "@polymer/iron-icons/hardware-icons.js";
import "@polymer/iron-icons/communication-icons.js";
import "@polymer/iron-icons/social-icons.js";
import "@polymer/iron-icons/av-icons.js";
import "@polymer/iron-icons/maps-icons.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/materializecss-styles/lib/colors.js";
/**
`hax-panel-item`
A single button in the hax panel for consistency.

* @demo demo/index.html

@microcopy - the mental model for this element
 - panel - the flyout from left or right side that has elements that can be placed
 - button - an item that expresses what interaction you will have with the content.

*/
Polymer({
  _template: html`
    <style is="custom-style" include="materializecss-styles-colors">
      :host {
        display: inline-flex;
        margin: 0;
        padding: 0;
        --hax-panel-hover: var(--simple-colors-default-theme-light-green-1);
      }
      paper-button {
        color: rgba(0, 0, 0, 0.66);
        margin: 0;
        text-transform: none;
        background-color: #2e2e2e !important;
        color: #eeeeee;
        display: flex;
        padding: 0;
        border-radius: 0;
        border: none;
        height: 64px;
        width: 80px;
        min-width: unset;
      }
      :host([edged="left"]) paper-button {
        border-bottom-right-radius: 16px;
      }
      :host([edged="right"]) paper-button {
        border-bottom-left-radius: 16px;
      }
      paper-button .label {
        font-size: 14px;
        margin: 0;
        max-height: 16px;
        background: transparent;
        vertical-align: unset;
        border-radius: unset;
        height: unset;
        min-width: unset;
        line-height: unset;
        display: unset;
        text-align: unset;
        margin-right: unset;
        display: block;
      }
      paper-button .button-inner {
        padding: 0;
        text-align: center;
        margin: 0 auto;
      }
      paper-button iron-icon {
        height: 32px;
        width: 24px;
        display: inline-flex;
      }
      paper-button:hover .label,
      paper-button:focus .label {
        color: var(--hax-panel-hover);
      }
      paper-button:hover iron-icon,
      paper-button:focus iron-icon {
        color: var(--hax-panel-hover) !important;
      }
      paper-button[disabled] {
        opacity: 0.5;
      }
      .flip-icon {
        transform: rotateY(180deg);
      }
      @media screen and (max-width: 550px) {
        paper-button {
          height: 40px;
          width: 48px;
          overflow: hidden;
        }
        paper-button iron-icon {
          height: 20px;
          width: 20px;
        }
        paper-button .label {
          max-height: 8px;
          font-size: 11px;
        }
      }
      :host([light]) paper-button {
        height: 32px !important;
        border-radius: 6px;
        margin-top: 8px;
        margin-left: 8px;
        border: solid #2196f3 2px;
        background-color: #ffffff !important;
        color: #2196f3;
        text-transform: uppercase;
        font-weight: 800;
      }
      :host([light]) paper-button iron-icon {
        display: none;
      }
      :host([light]) paper-button:hover {
        border: solid #1e88e5 2px;
        background-color: #f5f5f5 !important;
      }
    </style>
    <paper-button
      disabled="[[disabled]]"
      data-voicecommand\$="[[voiceCommand]]"
    >
      <div class="button-inner">
        <iron-icon icon="[[icon]]" class\$="[[iconClass]]"></iron-icon>
        <div class="label">[[label]]</div>
      </div>
    </paper-button>
  `,

  is: "hax-panel-item",

  listeners: {
    tap: "_fireEvent"
  },

  properties: {
    /**
     * Variant on button style for light
     */
    light: {
      type: Boolean,
      reflectToAttribute: true
    },
    /**
     * Voice command to append for things that support data-voicecommand.
     */
    voiceCommand: {
      type: String
    },
    /**
     * Support for disabled state buttons
     */
    disabled: {
      type: Boolean,
      value: false
    },
    /**
     * If we should apply a rounded edge to the button, opposite
     * to the direction that it's came from.
     */
    edged: {
      type: String,
      value: "",
      reflectToAttribute: true
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
      value: "white-text",
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
     * Possible value to send along as well with the event.
     * Can help with normalized event names / selection of
     * options.
     */
    value: {
      type: String,
      value: "",
      reflectToAttribute: true
    }
  },

  /**
   * Fire an event that includes the eventName of what was just pressed.
   */
  _fireEvent: function(e) {
    var normalizedEvent = dom(e);
    var local = normalizedEvent.localTarget;
    this.fire("hax-item-selected", {
      target: local,
      value: this.value,
      eventName: this.eventName
    });
  }
});
