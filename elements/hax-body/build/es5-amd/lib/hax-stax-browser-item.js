define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@polymer/paper-card/paper-card.js",
  "../node_modules/@polymer/iron-image/iron-image.js",
  "../node_modules/@lrnwebcomponents/materializecss-styles/lib/colors.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_ab37bef0ee0311e8bb61cd2eef6a9bf2() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style include="materializecss-styles-colors">\n      :host {\n        display: inline-flex;\n      }\n      :host([elevation="1"]) {\n        -webkit-transform: scale(1, 1);\n        transform: scale(1, 1);\n      }\n      :host([elevation="2"]) {\n        -webkit-transform: scale(1.4, 1.4);\n        transform: scale(1.4, 1.4);\n      }\n      paper-card {\n        margin: 4px 0;\n        border-radius: 10px;\n      }\n      paper-button {\n        color: #222222;\n        text-transform: none;\n        margin:0;\n        background-color: #FFFFFF;\n        height: 80px !important;\n        width: 200px !important;\n        display: flex;\n        border-radius: 10px;\n        border: 4px solid #CCCCCC;\n        min-width: unset;\n      }\n      paper-button .item-title {\n        font-size: 14px;\n        display: inline-flex;\n      }\n      paper-button .button-inner {\n        text-align: center;\n      }\n      .flip-icon {\n        transform: rotateY(180deg);\n      }\n      @media screen and (max-width: 550px) {\n        paper-button .item-title {\n          font-size: 10px;\n        }\n      }\n    </style>\n    <paper-card id="card" elevation="[[elevation]]">\n      <paper-button id="button" on-tap="_fireEvent" data-voicecommand$="select [[title]]">\n        <div class="button-inner">\n          <iron-image src="[[image]]" preload="" sizing="cover" hidden$="[[!image]]"></iron-image>\n          <div class="item-title">[[title]]</div>\n        </div>\n      </paper-button>\n    </paper-card>\n'
      ],
      [
        '\n    <style include="materializecss-styles-colors">\n      :host {\n        display: inline-flex;\n      }\n      :host([elevation="1"]) {\n        -webkit-transform: scale(1, 1);\n        transform: scale(1, 1);\n      }\n      :host([elevation="2"]) {\n        -webkit-transform: scale(1.4, 1.4);\n        transform: scale(1.4, 1.4);\n      }\n      paper-card {\n        margin: 4px 0;\n        border-radius: 10px;\n      }\n      paper-button {\n        color: #222222;\n        text-transform: none;\n        margin:0;\n        background-color: #FFFFFF;\n        height: 80px !important;\n        width: 200px !important;\n        display: flex;\n        border-radius: 10px;\n        border: 4px solid #CCCCCC;\n        min-width: unset;\n      }\n      paper-button .item-title {\n        font-size: 14px;\n        display: inline-flex;\n      }\n      paper-button .button-inner {\n        text-align: center;\n      }\n      .flip-icon {\n        transform: rotateY(180deg);\n      }\n      @media screen and (max-width: 550px) {\n        paper-button .item-title {\n          font-size: 10px;\n        }\n      }\n    </style>\n    <paper-card id="card" elevation="[[elevation]]">\n      <paper-button id="button" on-tap="_fireEvent" data-voicecommand\\$="select [[title]]">\n        <div class="button-inner">\n          <iron-image src="[[image]]" preload="" sizing="cover" hidden\\$="[[!image]]"></iron-image>\n          <div class="item-title">[[title]]</div>\n        </div>\n      </paper-button>\n    </paper-card>\n'
      ]
    );
    _templateObject_ab37bef0ee0311e8bb61cd2eef6a9bf2 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_ab37bef0ee0311e8bb61cd2eef6a9bf2()
    ),
    is: "hax-stax-browser-item",
    listeners: {
      mousedown: "tapEventOn",
      mouseover: "tapEventOn",
      mouseout: "tapEventOff",
      focusin: "tapEventOn",
      focusout: "tapEventOff"
    },
    properties: {
      title: { type: String },
      staxReference: { type: Object },
      image: { type: String, value: !1 },
      author: { type: String },
      description: { type: String },
      examples: { type: Array },
      status: { type: Array },
      tag: { type: String },
      elevation: { type: Number, value: 1, reflectToAttribute: !0 }
    },
    tapEventOn: function tapEventOn() {
      this.elevation = 2;
    },
    tapEventOff: function tapEventOff() {
      this.elevation = 1;
    },
    _fireEvent: function _fireEvent() {
      for (var i = 0; i < this.stax.length; i++) {
        this.fire("hax-insert-content", this.stax[i]);
      }
      window.HaxStore.instance.haxStaxPicker.close();
    }
  });
});
