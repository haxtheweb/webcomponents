define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@polymer/paper-card/paper-card.js",
  "../node_modules/@polymer/iron-icon/iron-icon.js",
  "../node_modules/@lrnwebcomponents/materializecss-styles/lib/colors.js"
], function(_polymerLegacy, _paperButton, _paperCard, _ironIcon, _colors) {
  "use strict";
  function _templateObject_e85e5050f51a11e8a8e7334679f4d101() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style include="materializecss-styles-colors">\n      :host {\n        display: inline-flex;\n      }\n      :host([elevation="1"]) {\n        -webkit-transform: scale(1, 1);\n        transform: scale(1, 1);\n      }\n      :host([elevation="2"]) {\n        -webkit-transform: scale(1.4, 1.4);\n        transform: scale(1.4, 1.4);\n      }\n      paper-card {\n        margin: 4px 0;\n        border-radius: 10px;\n      }\n      paper-button {\n        color: #222222;\n        text-transform: none;\n        margin:0;\n        background-color: #FFFFFF;\n        height: 80px !important;\n        width: 200px !important;\n        display: flex;\n        border-radius: 10px;\n        border: 4px solid #CCCCCC;\n        min-width: unset;\n      }\n      paper-button .item-title {\n        font-size: 14px;\n        display: inline-flex;\n      }\n      .flip-icon {\n        transform: rotateY(180deg);\n      }\n      iron-icon {\n        width: 40px;\n        height: 40px;\n        display: inline-block;\n      }\n      @media screen and (max-width: 550px) {\n        paper-button .item-title {\n          font-size: 12px;\n        }\n      }\n    </style>\n    <paper-card id="card" elevation="[[elevation]]">\n      <paper-button id="button" on-tap="_fireEvent" data-voicecommand$="select [[title]]">\n        <div class="button-inner">\n          <iron-icon icon="[[icon]]"></iron-icon>\n          <div class="item-title">[[title]]</div>\n        </div>\n      </paper-button>\n    </paper-card>\n'
      ],
      [
        '\n    <style include="materializecss-styles-colors">\n      :host {\n        display: inline-flex;\n      }\n      :host([elevation="1"]) {\n        -webkit-transform: scale(1, 1);\n        transform: scale(1, 1);\n      }\n      :host([elevation="2"]) {\n        -webkit-transform: scale(1.4, 1.4);\n        transform: scale(1.4, 1.4);\n      }\n      paper-card {\n        margin: 4px 0;\n        border-radius: 10px;\n      }\n      paper-button {\n        color: #222222;\n        text-transform: none;\n        margin:0;\n        background-color: #FFFFFF;\n        height: 80px !important;\n        width: 200px !important;\n        display: flex;\n        border-radius: 10px;\n        border: 4px solid #CCCCCC;\n        min-width: unset;\n      }\n      paper-button .item-title {\n        font-size: 14px;\n        display: inline-flex;\n      }\n      .flip-icon {\n        transform: rotateY(180deg);\n      }\n      iron-icon {\n        width: 40px;\n        height: 40px;\n        display: inline-block;\n      }\n      @media screen and (max-width: 550px) {\n        paper-button .item-title {\n          font-size: 12px;\n        }\n      }\n    </style>\n    <paper-card id="card" elevation="[[elevation]]">\n      <paper-button id="button" on-tap="_fireEvent" data-voicecommand\\$="select [[title]]">\n        <div class="button-inner">\n          <iron-icon icon="[[icon]]"></iron-icon>\n          <div class="item-title">[[title]]</div>\n        </div>\n      </paper-button>\n    </paper-card>\n'
      ]
    );
    _templateObject_e85e5050f51a11e8a8e7334679f4d101 = function _templateObject_e85e5050f51a11e8a8e7334679f4d101() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_e85e5050f51a11e8a8e7334679f4d101()
    ),
    is: "hax-blox-browser-item",
    listeners: {
      mousedown: "tapEventOn",
      mouseover: "tapEventOn",
      mouseout: "tapEventOff",
      focusin: "tapEventOn",
      focusout: "tapEventOff"
    },
    properties: {
      title: { type: String },
      bloxReference: { type: Object },
      icon: { type: String },
      author: { type: String },
      description: { type: String },
      examples: { type: Array },
      status: { type: Array },
      layout: { type: String },
      tag: { type: String },
      elevation: { type: Number, value: 1, reflectToAttribute: !0 }
    },
    tapEventOn: function tapEventOn(e) {
      this.elevation = 2;
    },
    tapEventOff: function tapEventOff(e) {
      this.elevation = 1;
    },
    _fireEvent: function _fireEvent(e) {
      for (var content = "", i = 0, node; i < this.blox.length; i++) {
        node = window.HaxStore.haxElementToNode(
          this.blox[i].tag,
          this.blox[i].content,
          this.blox[i].properties
        );
        content += window.HaxStore.haxNodeToContent(node);
      }
      var blox = {
        tag: "grid-plate",
        properties: { layout: this.layout },
        content: content
      };
      this.fire("hax-insert-content", blox);
      window.HaxStore.instance.haxBloxPicker.close();
    }
  });
});
