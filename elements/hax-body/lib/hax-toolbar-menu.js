import "@polymer/polymer/polymer.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/iron-icons/device-icons.js";
import "@polymer/iron-icons/hardware-icons.js";
import "@polymer/iron-icons/social-icons.js";
import "@polymer/iron-icons/av-icons.js";
import "@polymer/iron-icons/maps-icons.js";
import "@polymer/paper-listbox/paper-listbox.js";
import "@polymer/paper-menu-button/paper-menu-button.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "./hax-toolbar-item.js";
Polymer({
  _template: `
    <style>
      :host {
        display: block;
        box-sizing: border-box;
      }
      paper-menu-button {
        color: rgba(0, 0, 0, 0.66);
        margin: 0;
        padding: 0;
        text-transform: none;
        background-color: #ffffff;
        display: flex;
        min-width: 24px;
      }

      paper-menu-button .label {
        font-size: 12px;
        margin-top: 4px;
      }

      paper-menu-button .button-inner {
        padding-top: 8px;
        text-align: center;
      }

      paper-icon-button {
        color: rgba(0, 0, 0, 0.66);
        margin: 0;
        text-transform: none;
        background-color: #ffffff;
        min-width: 24px;
        display: flex;
        padding: 0;
        border-radius: 0;
      }

      paper-icon-button ::shadow iron-icon {
        padding: 8px;
        margin: 0;
        box-sizing: border-box;
      }

      paper-icon-button:hover {
        background-color: var(--paper-grey-300, grey);
      }

      .flip-icon {
        transform: rotateY(180deg);
      }

      paper-tooltip {
        pointer-events: none;
      }
      paper-listbox {
        padding: 0;
      }
    </style>
    <paper-menu-button>
      <hax-toolbar-item corner="[[corner]]" id="button" slot="dropdown-trigger" icon="[[icon]]" hidden\$="[[!icon]]" class\$="[[iconClass]]" tooltip="[[tooltip]]"></hax-toolbar-item>
      <paper-listbox id="listbox" slot="dropdown-content" selected="{{selected}}">
        <slot></slot>
      </paper-listbox>
    </paper-menu-button>
`,

  is: "hax-toolbar-menu",

  listeners: {
    "button.tap": "_menubuttonTap"
  },

  properties: {
    /**
     * corner
     */
    corner: {
      type: String,
      reflectToAttribute: true,
      value: ""
    },
    /**
     * Should we reset the selection after it is made
     */
    resetOnSelect: {
      type: Boolean,
      value: false
    },
    tooltip: {
      type: String,
      value: ""
    },
    tooltipDirection: {
      type: String,
      value: ""
    },
    selected: {
      type: String,
      value: "",
      notify: true,
      observer: "_selectChanged"
    }
  },

  /**
   * Select changed to trip button.
   */
  _selectChanged: function(e) {
    this.$.button.focus();
  },

  /**
   * Ensure menu is visible / default'ed.
   */
  _menubuttonTap: function(e) {
    this.$.listbox.style.display = "inherit";
    if (this.resetOnSelect) {
      this.selected = "";
    }
  },

  /**
   * Ensure menu is hidden.
   */
  hideMenu: function() {
    this.$.listbox.style.display = "none";
  }
});
