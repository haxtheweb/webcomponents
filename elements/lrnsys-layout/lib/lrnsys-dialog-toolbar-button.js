import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: inline-block;
      }
      iron-icon {
        display: inline-block;
        height: 16px;
        width: 16px;
      }
    </style>
    <paper-button raisedon-tap="_onTap" id$="[[id]]" aria-label$="[[title]]">
      <iron-icon icon="[[icon]]"></iron-icon> [[title]]
    </paper-button>
    <paper-tooltip for$="[[id]]" animation-delay="200">[[title]]</paper-tooltip>
  `,

  is: "lrnsys-dialog-toolbar-button",

  properties: {
    /**
     * The title of the button.
     */
    title: {
      type: String
    },
    /**
     * The button icon.
     */
    icon: {
      type: String
    },
    /**
     * The button ID.
     */
    id: {
      type: String
    }
  },

  /**
   * Ready lifecycle
   */
  ready: function() {
    this.fire("button-initialized", { id: this.id });
  },

  /**
   * Button has been tapped.
   */
  _onTap: function(e) {
    var normalizedEvent = dom(e);
    var localTarget = normalizedEvent.localTarget;
    var id = localTarget.getAttribute("id");
    this.fire("dialog-toolbar-button-tapped", { id: id });
  }
});
