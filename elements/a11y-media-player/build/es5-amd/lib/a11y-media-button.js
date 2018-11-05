define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "../node_modules/@polymer/iron-icons/av-icons.js",
  "../node_modules/@polymer/paper-tooltip/paper-tooltip.js",
  "./a11y-media-behaviors.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_ed49c6a0e11811e890362723497a45ce() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        margin: 0;\n        padding: 0;\n      }\n      :host #button {\n        margin: 0;\n        padding: 8px;\n        line-height: 1;\n        border: none;\n        transition: color 0.25s;\n        color: var(--a11y-media-button-color);\n        background-color: var(--a11y-media-button-bg-color);\n      }\n      :host([toggle]) #button {\n        color: var(--a11y-media-button-toggle-color);\n        background-color: var(--a11y-media-button-toggle-bg-color);\n      }\n      :host([toggle]:active) #button,\n      :host([toggle]:focus) #button,\n      :host([toggle]:hover) #button,\n      :host(:active) #button,\n      :host(:focus) #button,\n      :host(:hover) #button {\n        cursor: pointer;\n        color: var(--a11y-media-button-hover-color);\n        background-color: var(--a11y-media-button-hover-bg-color);\n      }\n      :host .sr-only {\n        position: absolute;\n        left: -99999;\n        top: 0;\n        height: 0;\n        width: 0;\n        overflow: hidden;\n      }\n      :host paper-tooltip {\n        z-index: 100;\n      }\n    </style>\n    <button id="button" aria-role="button" aria-pressed$="[[toggle]]" tabindex="0" aria-label$="[[label]]" controls="[[controls]]" disabled$="[[disabled]]" toggle$="[[toggle]]">\n      <iron-icon icon$="[[icon]]"></iron-icon>\n    </button>\n    <paper-tooltip for="button">[[label]]</paper-tooltip>\n'
      ],
      [
        '\n    <style>\n      :host {\n        margin: 0;\n        padding: 0;\n      }\n      :host #button {\n        margin: 0;\n        padding: 8px;\n        line-height: 1;\n        border: none;\n        transition: color 0.25s;\n        color: var(--a11y-media-button-color);\n        background-color: var(--a11y-media-button-bg-color);\n      }\n      :host([toggle]) #button {\n        color: var(--a11y-media-button-toggle-color);\n        background-color: var(--a11y-media-button-toggle-bg-color);\n      }\n      :host([toggle]:active) #button,\n      :host([toggle]:focus) #button,\n      :host([toggle]:hover) #button,\n      :host(:active) #button,\n      :host(:focus) #button,\n      :host(:hover) #button {\n        cursor: pointer;\n        color: var(--a11y-media-button-hover-color);\n        background-color: var(--a11y-media-button-hover-bg-color);\n      }\n      :host .sr-only {\n        position: absolute;\n        left: -99999;\n        top: 0;\n        height: 0;\n        width: 0;\n        overflow: hidden;\n      }\n      :host paper-tooltip {\n        z-index: 100;\n      }\n    </style>\n    <button id="button" aria-role="button" aria-pressed\\$="[[toggle]]" tabindex="0" aria-label\\$="[[label]]" controls="[[controls]]" disabled\\$="[[disabled]]" toggle\\$="[[toggle]]">\n      <iron-icon icon\\$="[[icon]]"></iron-icon>\n    </button>\n    <paper-tooltip for="button">[[label]]</paper-tooltip>\n'
      ]
    );
    _templateObject_ed49c6a0e11811e890362723497a45ce = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_ed49c6a0e11811e890362723497a45ce()
    ),
    is: "a11y-media-button",
    behaviors: [a11yMediaBehaviors.PlayerBehaviors],
    listeners: { "button.tap": "_buttonTap" },
    properties: {
      controls: { type: String, value: "video" },
      icon: { type: String, value: null },
      label: { type: String, value: null },
      toggle: { type: Boolean, value: !1, reflectToAttribute: !0 },
      disabled: { type: Boolean, value: null }
    },
    ready: function ready() {
      this.__target = this.$.button;
    },
    _buttonTap: function _buttonTap() {
      this.fire("button-clicked", this);
    }
  });
});
