define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/paper-item/paper-item.js",
  "../node_modules/@polymer/iron-icon/iron-icon.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "../node_modules/@polymer/iron-icons/editor-icons.js",
  "../node_modules/@polymer/iron-icons/device-icons.js",
  "../node_modules/@polymer/iron-icons/hardware-icons.js",
  "../node_modules/@polymer/iron-icons/social-icons.js",
  "../node_modules/@polymer/iron-icons/av-icons.js",
  "../node_modules/@polymer/iron-icons/maps-icons.js",
  "../node_modules/@polymer/paper-listbox/paper-listbox.js",
  "../node_modules/@polymer/paper-menu-button/paper-menu-button.js",
  "../node_modules/@polymer/paper-icon-button/paper-icon-button.js",
  "./hax-toolbar-item.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_9de03260edcb11e88aa8b5030f652492() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        display: block;\n        box-sizing: border-box;\n      }\n      paper-menu-button {\n        color: rgba(0, 0, 0, 0.66);\n        margin: 0;\n        padding: 0;\n        text-transform: none;\n        background-color: #ffffff;\n        display: flex;\n        min-width: 24px;\n      }\n\n      paper-menu-button .label {\n        font-size: 12px;\n        margin-top: 4px;\n      }\n\n      paper-menu-button .button-inner {\n        padding-top: 8px;\n        text-align: center;\n      }\n\n      paper-icon-button {\n        color: rgba(0, 0, 0, 0.66);\n        margin: 0;\n        text-transform: none;\n        background-color: #ffffff;\n        min-width: 24px;\n        display: flex;\n        padding: 0;\n        border-radius: 0;\n      }\n\n      paper-icon-button ::shadow iron-icon {\n        padding: 8px;\n        margin: 0;\n        box-sizing: border-box;\n      }\n\n      paper-icon-button:hover {\n        background-color: var(--paper-grey-300, grey);\n      }\n\n      .flip-icon {\n        transform: rotateY(180deg);\n      }\n\n      paper-tooltip {\n        pointer-events: none;\n      }\n      paper-listbox {\n        padding: 0;\n      }\n    </style>\n    <paper-menu-button>\n      <hax-toolbar-item corner="[[corner]]" id="button" slot="dropdown-trigger" icon="[[icon]]" hidden$="[[!icon]]" class$="[[iconClass]]" tooltip="[[tooltip]]"></hax-toolbar-item>\n      <paper-listbox id="listbox" slot="dropdown-content" selected="{{selected}}">\n        <slot></slot>\n      </paper-listbox>\n    </paper-menu-button>\n'
      ],
      [
        '\n    <style>\n      :host {\n        display: block;\n        box-sizing: border-box;\n      }\n      paper-menu-button {\n        color: rgba(0, 0, 0, 0.66);\n        margin: 0;\n        padding: 0;\n        text-transform: none;\n        background-color: #ffffff;\n        display: flex;\n        min-width: 24px;\n      }\n\n      paper-menu-button .label {\n        font-size: 12px;\n        margin-top: 4px;\n      }\n\n      paper-menu-button .button-inner {\n        padding-top: 8px;\n        text-align: center;\n      }\n\n      paper-icon-button {\n        color: rgba(0, 0, 0, 0.66);\n        margin: 0;\n        text-transform: none;\n        background-color: #ffffff;\n        min-width: 24px;\n        display: flex;\n        padding: 0;\n        border-radius: 0;\n      }\n\n      paper-icon-button ::shadow iron-icon {\n        padding: 8px;\n        margin: 0;\n        box-sizing: border-box;\n      }\n\n      paper-icon-button:hover {\n        background-color: var(--paper-grey-300, grey);\n      }\n\n      .flip-icon {\n        transform: rotateY(180deg);\n      }\n\n      paper-tooltip {\n        pointer-events: none;\n      }\n      paper-listbox {\n        padding: 0;\n      }\n    </style>\n    <paper-menu-button>\n      <hax-toolbar-item corner="[[corner]]" id="button" slot="dropdown-trigger" icon="[[icon]]" hidden\\$="[[!icon]]" class\\$="[[iconClass]]" tooltip="[[tooltip]]"></hax-toolbar-item>\n      <paper-listbox id="listbox" slot="dropdown-content" selected="{{selected}}">\n        <slot></slot>\n      </paper-listbox>\n    </paper-menu-button>\n'
      ]
    );
    _templateObject_9de03260edcb11e88aa8b5030f652492 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_9de03260edcb11e88aa8b5030f652492()
    ),
    is: "hax-toolbar-menu",
    listeners: { tap: "_menubuttonTap" },
    properties: {
      corner: { type: String, reflectToAttribute: !0, value: "" },
      resetOnSelect: { type: Boolean, value: !1 },
      tooltip: { type: String, value: "" },
      tooltipDirection: { type: String, value: "" },
      selected: {
        type: String,
        value: "",
        notify: !0,
        observer: "_selectChanged"
      }
    },
    _selectChanged: function _selectChanged() {
      this.$.button.focus();
    },
    _menubuttonTap: function _menubuttonTap() {
      this.$.listbox.style.display = "inherit";
      if (this.resetOnSelect) {
        this.selected = "";
      }
    },
    hideMenu: function hideMenu() {
      this.$.listbox.style.display = "none";
    }
  });
});
