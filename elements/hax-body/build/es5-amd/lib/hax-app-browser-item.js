define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@polymer/paper-card/paper-card.js",
  "../node_modules/@polymer/iron-icon/iron-icon.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "../node_modules/@polymer/iron-icons/editor-icons.js",
  "../node_modules/@polymer/iron-icons/device-icons.js",
  "../node_modules/@polymer/iron-icons/hardware-icons.js",
  "../node_modules/@polymer/iron-icons/communication-icons.js",
  "../node_modules/@polymer/iron-icons/social-icons.js",
  "../node_modules/@polymer/iron-icons/av-icons.js",
  "../node_modules/@polymer/iron-icons/places-icons.js",
  "../node_modules/@polymer/iron-icons/maps-icons.js",
  "../node_modules/@polymer/iron-image/iron-image.js",
  "../node_modules/@lrnwebcomponents/materializecss-styles/lib/colors.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_ac82dc90ee0311e8bb61cd2eef6a9bf2() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style include="materializecss-styles-colors">\n      :host {\n        display: inline-flex;\n      }\n      :host([elevation="1"]) {\n        -webkit-transform: scale(1, 1);\n        transform: scale(1, 1);\n      }\n      :host([elevation="2"]) {\n        -webkit-transform: scale(1.4, 1.4);\n        transform: scale(1.4, 1.4);\n      }\n      paper-card {\n        margin: 4px 0;\n        border-radius: 10px;\n      }\n      paper-button {\n        color: #000000;\n        text-transform: none;\n        margin:0;\n        background-color: #ffffff;\n        height: 72px !important;\n        width: 72px !important;\n        display: flex;\n        border-radius: 10px;\n        border-style: solid;\n        border-width: 4px;\n        font-weight: normal;\n      }\n      paper-button .item-title {\n        font-size: 10px;\n      }\n      paper-button .button-inner {\n        text-align: center;\n      }\n      paper-button iron-icon {\n        height: 32px;\n        width: 32px;\n        display: inline-block;\n      }\n      .flip-icon {\n        transform: rotateY(180deg);\n      }\n    </style>\n    <paper-card id="card" elevation="[[elevation]]">\n      <paper-button id="button" data-voicecommand$="select [[title]]" class$="[[color]] lighten-5 [[color]]-border">\n        <div class="button-inner">\n          <iron-icon icon="[[icon]]" class$="[[color]]-text text-darken-3" hidden$="[[!icon]]"></iron-icon>\n          <iron-image src="[[image]]" preload="" sizing="cover" hidden$="[[!image]]"></iron-image>\n          <div class="item-title">[[title]]</div>\n        </div>\n      </paper-button>\n    </paper-card>\n'
      ],
      [
        '\n    <style include="materializecss-styles-colors">\n      :host {\n        display: inline-flex;\n      }\n      :host([elevation="1"]) {\n        -webkit-transform: scale(1, 1);\n        transform: scale(1, 1);\n      }\n      :host([elevation="2"]) {\n        -webkit-transform: scale(1.4, 1.4);\n        transform: scale(1.4, 1.4);\n      }\n      paper-card {\n        margin: 4px 0;\n        border-radius: 10px;\n      }\n      paper-button {\n        color: #000000;\n        text-transform: none;\n        margin:0;\n        background-color: #ffffff;\n        height: 72px !important;\n        width: 72px !important;\n        display: flex;\n        border-radius: 10px;\n        border-style: solid;\n        border-width: 4px;\n        font-weight: normal;\n      }\n      paper-button .item-title {\n        font-size: 10px;\n      }\n      paper-button .button-inner {\n        text-align: center;\n      }\n      paper-button iron-icon {\n        height: 32px;\n        width: 32px;\n        display: inline-block;\n      }\n      .flip-icon {\n        transform: rotateY(180deg);\n      }\n    </style>\n    <paper-card id="card" elevation="[[elevation]]">\n      <paper-button id="button" data-voicecommand\\$="select [[title]]" class\\$="[[color]] lighten-5 [[color]]-border">\n        <div class="button-inner">\n          <iron-icon icon="[[icon]]" class\\$="[[color]]-text text-darken-3" hidden\\$="[[!icon]]"></iron-icon>\n          <iron-image src="[[image]]" preload="" sizing="cover" hidden\\$="[[!image]]"></iron-image>\n          <div class="item-title">[[title]]</div>\n        </div>\n      </paper-button>\n    </paper-card>\n'
      ]
    );
    _templateObject_ac82dc90ee0311e8bb61cd2eef6a9bf2 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_ac82dc90ee0311e8bb61cd2eef6a9bf2()
    ),
    is: "hax-app-browser-item",
    listeners: {
      tap: "_fireEvent",
      mousedown: "tapEventOn",
      mouseover: "tapEventOn",
      mouseout: "tapEventOff",
      focusin: "tapEventOn",
      focusout: "tapEventOff"
    },
    properties: {
      title: { type: String },
      index: { type: Number },
      icon: { type: String },
      image: { type: String, value: !1 },
      color: { type: String },
      author: { type: String },
      description: { type: String },
      examples: { type: Array },
      status: { type: Array },
      elevation: { type: Number, value: 1, reflectToAttribute: !0 }
    },
    tapEventOn: function tapEventOn() {
      this.elevation = 2;
    },
    tapEventOff: function tapEventOff() {
      this.elevation = 1;
    },
    _fireEvent: function _fireEvent() {
      this.fire("hax-app-selected", this.index);
    }
  });
});
