define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "../node_modules/@polymer/iron-icons/editor-icons.js",
  "../node_modules/@polymer/iron-icons/device-icons.js",
  "../node_modules/@polymer/iron-icons/hardware-icons.js",
  "../node_modules/@polymer/iron-icons/communication-icons.js",
  "../node_modules/@polymer/iron-icons/social-icons.js",
  "../node_modules/@polymer/iron-icons/av-icons.js",
  "../node_modules/@polymer/iron-icons/maps-icons.js",
  "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js",
  "../node_modules/@lrnwebcomponents/materializecss-styles/lib/colors.js"
], function(
  _polymerLegacy,
  _polymerDom,
  _paperButton,
  _ironIcons,
  _editorIcons,
  _deviceIcons,
  _hardwareIcons,
  _communicationIcons,
  _socialIcons,
  _avIcons,
  _mapsIcons,
  _simpleColors,
  _colors
) {
  "use strict";
  function _templateObject_f69e8830f32e11e8a4700dcc21fbc61a() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style is="custom-style" include="materializecss-styles-colors">\n      :host {\n        display: inline-flex;\n        margin: 0;\n        padding: 0;\n        --hax-panel-hover: var(--simple-colors-light-green-background1);\n      }\n      paper-button {\n        color: rgba(0,0,0,0.66);\n        margin: 0;\n        text-transform: none;\n        background-color: #2e2e2e !important;\n        color: #eeeeee;\n        display: flex;\n        padding: 0;\n        border-radius: 0;\n        border: none;\n        height: 64px;\n        width: 80px;\n        min-width: unset;\n      }\n      :host([edged="left"]) paper-button {\n        border-bottom-right-radius: 16px;\n      }\n      :host([edged="right"]) paper-button {\n        border-bottom-left-radius: 16px;\n      }\n      paper-button .label {\n        font-size: 14px;\n        margin: 0;\n        max-height: 16px;\n        background: transparent;\n        vertical-align: unset;\n        border-radius: unset;\n        height: unset;\n        min-width: unset;\n        line-height: unset;\n        display: unset;\n        text-align: unset;\n        margin-right: unset;\n        display: block;\n      }\n      paper-button .button-inner {\n        padding: 0;\n        text-align: center;\n        margin: 0 auto;\n      }\n      paper-button iron-icon {\n        height: 32px;\n        width: 24px;\n        display: inline-flex;\n      }\n      paper-button:hover .label,\n      paper-button:focus .label {\n        color: var(--hax-panel-hover);\n      }\n      paper-button:hover iron-icon,\n      paper-button:focus iron-icon {\n        color: var(--hax-panel-hover) !important;\n      }\n      paper-button[disabled] {\n        opacity: .5;\n      }\n      .flip-icon {\n        transform: rotateY(180deg);\n      }\n      @media screen and (max-width: 550px) {\n        paper-button {\n          height: 40px;\n          width: 48px;\n          overflow: hidden;\n        }\n        paper-button iron-icon {\n          height: 20px;\n          width: 20px;\n        }\n        paper-button .label {\n          max-height: 8px;\n          font-size: 11px;\n        }\n      }\n      :host([light]) paper-button {\n        height: 32px !important;\n        border-radius: 6px;\n        margin-top: 8px;\n        margin-left: 8px;\n        border: solid #2196f3 2px;\n        background-color:#ffffff !important;\n        color: #2196f3;\n        text-transform:uppercase;\n        font-weight:800;\n      }\n      :host([light]) paper-button iron-icon {\n        display: none;\n      }\n      :host([light]) paper-button:hover{\n        border: solid #1e88e5 2px;\n        background-color:#f5f5f5 !important;\n      }\n    </style>\n    <paper-button disabled="[[disabled]]" data-voicecommand$="[[voiceCommand]]">\n      <div class="button-inner">\n        <iron-icon icon="[[icon]]" class$="[[iconClass]]"></iron-icon>\n        <div class="label">[[label]]</div>\n      </div>\n    </paper-button>\n'
      ],
      [
        '\n    <style is="custom-style" include="materializecss-styles-colors">\n      :host {\n        display: inline-flex;\n        margin: 0;\n        padding: 0;\n        --hax-panel-hover: var(--simple-colors-light-green-background1);\n      }\n      paper-button {\n        color: rgba(0,0,0,0.66);\n        margin: 0;\n        text-transform: none;\n        background-color: #2e2e2e !important;\n        color: #eeeeee;\n        display: flex;\n        padding: 0;\n        border-radius: 0;\n        border: none;\n        height: 64px;\n        width: 80px;\n        min-width: unset;\n      }\n      :host([edged="left"]) paper-button {\n        border-bottom-right-radius: 16px;\n      }\n      :host([edged="right"]) paper-button {\n        border-bottom-left-radius: 16px;\n      }\n      paper-button .label {\n        font-size: 14px;\n        margin: 0;\n        max-height: 16px;\n        background: transparent;\n        vertical-align: unset;\n        border-radius: unset;\n        height: unset;\n        min-width: unset;\n        line-height: unset;\n        display: unset;\n        text-align: unset;\n        margin-right: unset;\n        display: block;\n      }\n      paper-button .button-inner {\n        padding: 0;\n        text-align: center;\n        margin: 0 auto;\n      }\n      paper-button iron-icon {\n        height: 32px;\n        width: 24px;\n        display: inline-flex;\n      }\n      paper-button:hover .label,\n      paper-button:focus .label {\n        color: var(--hax-panel-hover);\n      }\n      paper-button:hover iron-icon,\n      paper-button:focus iron-icon {\n        color: var(--hax-panel-hover) !important;\n      }\n      paper-button[disabled] {\n        opacity: .5;\n      }\n      .flip-icon {\n        transform: rotateY(180deg);\n      }\n      @media screen and (max-width: 550px) {\n        paper-button {\n          height: 40px;\n          width: 48px;\n          overflow: hidden;\n        }\n        paper-button iron-icon {\n          height: 20px;\n          width: 20px;\n        }\n        paper-button .label {\n          max-height: 8px;\n          font-size: 11px;\n        }\n      }\n      :host([light]) paper-button {\n        height: 32px !important;\n        border-radius: 6px;\n        margin-top: 8px;\n        margin-left: 8px;\n        border: solid #2196f3 2px;\n        background-color:#ffffff !important;\n        color: #2196f3;\n        text-transform:uppercase;\n        font-weight:800;\n      }\n      :host([light]) paper-button iron-icon {\n        display: none;\n      }\n      :host([light]) paper-button:hover{\n        border: solid #1e88e5 2px;\n        background-color:#f5f5f5 !important;\n      }\n    </style>\n    <paper-button disabled="[[disabled]]" data-voicecommand\\$="[[voiceCommand]]">\n      <div class="button-inner">\n        <iron-icon icon="[[icon]]" class\\$="[[iconClass]]"></iron-icon>\n        <div class="label">[[label]]</div>\n      </div>\n    </paper-button>\n'
      ]
    );
    _templateObject_f69e8830f32e11e8a4700dcc21fbc61a = function _templateObject_f69e8830f32e11e8a4700dcc21fbc61a() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_f69e8830f32e11e8a4700dcc21fbc61a()
    ),
    is: "hax-panel-item",
    listeners: { tap: "_fireEvent" },
    properties: {
      light: { type: Boolean, reflectToAttribute: !0 },
      voiceCommand: { type: String },
      disabled: { type: Boolean, value: !1 },
      edged: { type: String, value: "", reflectToAttribute: !0 },
      icon: {
        type: String,
        value: "editor:text-fields",
        reflectToAttribute: !0
      },
      iconClass: { type: String, value: "white-text", reflectToAttribute: !0 },
      label: {
        type: String,
        value: "editor:text-fields",
        reflectToAttribute: !0
      },
      eventName: { type: String, value: "button", reflectToAttribute: !0 },
      value: { type: String, value: "", reflectToAttribute: !0 }
    },
    _fireEvent: function _fireEvent(e) {
      var normalizedEvent = (0, _polymerDom.dom)(e),
        local = normalizedEvent.localTarget;
      this.fire("hax-item-selected", {
        target: local,
        value: this.value,
        eventName: this.eventName
      });
    }
  });
});
