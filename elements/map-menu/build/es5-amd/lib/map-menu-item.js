define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "../node_modules/@polymer/iron-icon/iron-icon.js",
  "../node_modules/@polymer/paper-button/paper-button.js"
], function(_polymerLegacy) {
  "use strict";
  var _properties;
  function _templateObject_026a5610e11b11e8b51fdde26072d36e() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        display: block;\n        --map-menu-item-height: 16px;\n      }\n\n      :host([active]) {\n        background: var(--map-menu-active-color);\n      }\n\n      iron-icon {\n        --iron-icon-height: var(--map-menu-item-height);\n      }\n\n      #title {\n        font-size: .9em;\n        text-transform: none;\n      }\n    </style>\n      <paper-button id="wrapper" href$="[[url]]" role="link" noink="" on-tap="_click">\n        <template is="dom-if" if="[[__hasIcon(icon)]]">\n          <iron-icon icon="[[icon]]"></iron-icon>\n        </template>\n        <span id="title">[[title]]</span>\n      </paper-button>\n'
      ],
      [
        '\n    <style>\n      :host {\n        display: block;\n        --map-menu-item-height: 16px;\n      }\n\n      :host([active]) {\n        background: var(--map-menu-active-color);\n      }\n\n      iron-icon {\n        --iron-icon-height: var(--map-menu-item-height);\n      }\n\n      #title {\n        font-size: .9em;\n        text-transform: none;\n      }\n    </style>\n      <paper-button id="wrapper" href\\$="[[url]]" role="link" noink="" on-tap="_click">\n        <template is="dom-if" if="[[__hasIcon(icon)]]">\n          <iron-icon icon="[[icon]]"></iron-icon>\n        </template>\n        <span id="title">[[title]]</span>\n      </paper-button>\n'
      ]
    );
    _templateObject_026a5610e11b11e8b51fdde26072d36e = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_026a5610e11b11e8b51fdde26072d36e()
    ),
    is: "map-menu-item",
    properties: ((_properties = {
      icon: { type: String, value: "" },
      title: { type: String, value: "" },
      url: { type: String, value: "" }
    }),
    babelHelpers.defineProperty(_properties, "icon", { type: String }),
    babelHelpers.defineProperty(_properties, "id", {
      type: String,
      reflectToAttribute: !0
    }),
    babelHelpers.defineProperty(_properties, "active", {
      type: Boolean,
      value: !1,
      observer: "__activeChanged"
    }),
    _properties),
    _click: function _click() {
      this.fire("link-clicked", { id: this.id });
    },
    attached: function attached() {
      this.fire("child-attached", { id: this.id });
    },
    __activeChanged: function __activeChanged(active, oldActive) {
      if (active === oldActive) return;
      if (!0 === active) {
        this.fire("active-item", { id: this.id });
      }
    },
    __hasIcon: function __hasIcon(icon) {
      return icon || "" === icon ? !0 : !1;
    }
  });
});
