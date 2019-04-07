import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/iron-icon/iron-icon.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "./hax-shared-styles.js";
/**
 * `hax-panel-item`
 * `A single button in the hax panel for consistency.`
 * @microcopy - the mental model for this element
 * - panel - the flyout from left or right side that has elements that can be placed
 * - button - an item that expresses what interaction you will have with the content.
 */
Polymer({
  _template: html`
    <style include="simple-colors hax-shared-styles">
      :host {
        display: inline-flex;
      }
      paper-button {
        height: 36px;
        width: 36px;
        overflow: hidden;
        margin: 0;
        text-transform: none;
        background-color: var(--hax-color-bg-accent);
        color: var(--hax-color-accent-text);
        display: flex;
        padding: 8px;
        border-radius: 4px;
        border: 1px solid var(--hax-color-bg-accent);
        min-width: unset;
        --paper-button-ink-color: var(--hax-color-accent1);
      }
      :host([edged="left"]) paper-button {
        border-bottom-right-radius: 16px;
      }
      :host([edged="right"]) paper-button {
        border-bottom-left-radius: 16px;
      }
      paper-button .button-inner {
        text-align: center;
        margin: 0 auto;
      }
      paper-button iron-icon {
        height: 20px;
        width: 20px;
        display: inline-flex;
      }
      paper-button:hover,
      paper-button:focus {
        color: var(--hax-color-text-active);
        border: 1px solid var(--hax-color-accent1);
      }

      paper-button[disabled] {
        opacity: 0.5;
      }
      .flip-icon {
        transform: rotateY(180deg);
      }
      :host([dark]) paper-button {
        border: solid 2px #000000;
        background-color: #000000 !important;
        color: var(--hax-color-bg-accent);
      }
      :host([large]) paper-button {
        height: 40px;
        width: 40px;
      }
      :host([dark]) paper-button:hover iron-icon,
      :host([dark]) paper-button:focus iron-icon {
        color: #ffffff !important;
      }
      :host([dark]) paper-button:hover {
        border: solid #0085ba 1px;
      }
      paper-tooltip {
        --paper-tooltip-background: #000000;
        --paper-tooltip-opacity: 1;
        --paper-tooltip-text-color: #ffffff;
        --paper-tooltip-delay-in: 0;
        --paper-tooltip: {
          border-radius: 0;
        }
      }
    </style>
    <paper-button raised id="button" disabled="[[disabled]]">
      <div class="button-inner"><iron-icon icon="[[icon]]"></iron-icon></div>
    </paper-button>
    <paper-tooltip
      animation-delay="0"
      for="button"
      position="bottom"
      offset="10"
    >
      [[label]]
    </paper-tooltip>
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
