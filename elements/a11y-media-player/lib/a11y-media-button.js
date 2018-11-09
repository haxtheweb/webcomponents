import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/av-icons.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "./a11y-media-behaviors.js";
/**
`a11y-media-button`
A button used in a11y-media-controls

@demo demo/index.html

@microcopy - the mental model for this element
 -
 -
 -

*/
Polymer({
  _template: html`
    <style>
      :host {
        margin: 0;
        padding: 0;
      }
      :host #button {
        margin: 0;
        padding: 8px;
        line-height: 1;
        border: none;
        transition: color 0.25s;
        color: var(--a11y-media-button-color);
        background-color: var(--a11y-media-button-bg-color);
      }
      :host([toggle]) #button {
        color: var(--a11y-media-button-toggle-color);
        background-color: var(--a11y-media-button-toggle-bg-color);
      }
      :host([toggle]:active) #button,
      :host([toggle]:focus) #button,
      :host([toggle]:hover) #button,
      :host(:active) #button,
      :host(:focus) #button,
      :host(:hover) #button {
        cursor: pointer;
        color: var(--a11y-media-button-hover-color);
        background-color: var(--a11y-media-button-hover-bg-color);
      }
      :host .sr-only {
        position: absolute;
        left: -99999;
        top: 0;
        height: 0;
        width: 0;
        overflow: hidden;
      }
      :host paper-tooltip {
        z-index: 100;
      }
      iron-icon {
        display: inline-block;
      }
    </style>
    <button id="button" aria-role="button" aria-pressed$="[[toggle]]" tabindex="0" aria-label$="[[label]]" controls="[[controls]]" disabled$="[[disabled]]" toggle$="[[toggle]]">
      <iron-icon icon$="[[icon]]"></iron-icon>
    </button>
    <paper-tooltip for="button">[[label]]</paper-tooltip>
`,

  is: "a11y-media-button",

  behaviors: [a11yMediaBehaviors.PlayerBehaviors],

  listeners: {
    tap: "_buttonTap"
  },

  properties: {
    /*
     * id of element button controls
     */
    controls: {
      type: String,
      value: "video"
    },
    /*
     * iron-icon type
     */
    icon: {
      type: String,
      value: null
    },
    /*
     * button label
     */
    label: {
      type: String,
      value: null
    },
    /*
     * Is it toggled on?
     */
    toggle: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },
    /*
     * Is it disabled?
     */
    disabled: {
      type: Boolean,
      value: null
    }
  },

  // sets target for a11y keys
  ready: function() {
    this.__target = this.$.button;
  },

  // lets player know this button was clicked
  _buttonTap: function() {
    this.fire("button-clicked", this);
  }
});
