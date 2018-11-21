define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@polymer/paper-icon-button/paper-icon-button.js",
  "../node_modules/@polymer/paper-tooltip/paper-tooltip.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "../node_modules/@polymer/iron-icons/editor-icons.js",
  "../node_modules/@polymer/iron-icons/device-icons.js",
  "../node_modules/@polymer/iron-icons/hardware-icons.js",
  "../node_modules/@polymer/iron-icons/social-icons.js",
  "../node_modules/@polymer/iron-icons/av-icons.js",
  "../node_modules/@polymer/iron-icons/image-icons.js",
  "../node_modules/@polymer/iron-icons/maps-icons.js",
  "../node_modules/@lrnwebcomponents/materializecss-styles/lib/colors.js",
  "../node_modules/@polymer/neon-animation/neon-animation.js",
  "./hax-toolbar-item.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_a2f32d70edcb11e88aa8b5030f652492() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style include="materializecss-styles-colors">\n      :host {\n        display: inline-flex;\n        box-sizing: border-box;\n      }\n      :host([menu]) {\n        display: flex;\n        width: 100%;\n      }\n    </style>\n    <iron-a11y-keys id="a11y" target="[[target]]" keys="enter" on-keys-pressed="_fireEvent"></iron-a11y-keys>\n    <hax-toolbar-item corner="[[corner]]" id="button" icon="[[icon]]" hidden$="[[!icon]]" tooltip-direction="[[direction]]" tooltip="[[label]]" class$="[[iconClass]]" on-mousedown="_fireEvent" icon-class="[[iconClass]]" mini="[[mini]]" menu="[[menu]]" light="[[light]]">\n      <slot></slot>\n    </hax-toolbar-item>\n'
      ],
      [
        '\n    <style include="materializecss-styles-colors">\n      :host {\n        display: inline-flex;\n        box-sizing: border-box;\n      }\n      :host([menu]) {\n        display: flex;\n        width: 100%;\n      }\n    </style>\n    <iron-a11y-keys id="a11y" target="[[target]]" keys="enter" on-keys-pressed="_fireEvent"></iron-a11y-keys>\n    <hax-toolbar-item corner="[[corner]]" id="button" icon="[[icon]]" hidden\\$="[[!icon]]" tooltip-direction="[[direction]]" tooltip="[[label]]" class\\$="[[iconClass]]" on-mousedown="_fireEvent" icon-class="[[iconClass]]" mini="[[mini]]" menu="[[menu]]" light="[[light]]">\n      <slot></slot>\n    </hax-toolbar-item>\n'
      ]
    );
    _templateObject_a2f32d70edcb11e88aa8b5030f652492 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_a2f32d70edcb11e88aa8b5030f652492()
    ),
    is: "hax-context-item-textop",
    properties: {
      corner: { type: String, value: "" },
      target: { type: Object },
      light: { type: Boolean, value: !1 },
      mini: { type: Boolean, value: !1 },
      menu: { type: Boolean, value: !1 },
      direction: { type: String, value: "top" },
      icon: {
        type: String,
        value: "editor:text-fields",
        reflectToAttribute: !0
      },
      iconClass: { type: String, value: "", reflectToAttribute: !0 },
      label: {
        type: String,
        value: "editor:text-fields",
        reflectToAttribute: !0
      },
      eventName: { type: String, value: "button", reflectToAttribute: !0 },
      inputMethod: { type: String, value: null, reflectToAttribute: !0 },
      propertyToBind: { type: String, value: null, reflectToAttribute: !0 },
      slotToBind: { type: String, value: null, reflectToAttribute: !0 },
      description: { type: String, reflectToAttribute: !0 }
    },
    ready: function ready() {
      this.target = this.$.button;
    },
    _fireEvent: function _fireEvent() {
      this.fire("hax-context-item-selected", {
        target: this,
        eventName: this.eventName
      });
    }
  });
});
