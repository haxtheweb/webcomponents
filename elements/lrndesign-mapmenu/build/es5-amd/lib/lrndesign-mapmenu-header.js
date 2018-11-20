define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js",
  "../node_modules/@polymer/iron-collapse/iron-collapse.js",
  "../node_modules/@polymer/iron-icon/iron-icon.js",
  "../node_modules/@polymer/iron-behaviors/iron-button-state.js"
], function(
  _polymerLegacy,
  _lrndesignAvatar,
  _ironCollapse,
  _ironIcon,
  _ironButtonState
) {
  "use strict";
  function _templateObject_8beb7740ecf411e893fb0b59370b06e7() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n      }\n      #container {\n        display: flex;\n        align-items: center;\n      }\n      #icon {\n        margin-right: 10px;\n      }\n      #center {\n        flex: 1 1 auto;\n      }\n      lrndesign-avatar {\n        display: inline-block;\n        background: #fff;\n        border-radius: 50%;\n        box-shadow: 0 1px 1px rgba(0,0,0,0.3);\n        padding: 2px;\n        position: relative;\n        margin-top: -2px;\n      }\n      lrndesign-avatar ::slotted(*) {\n        transform: translateY(2px);\n      }\n      #title {\n        font-size: 19.2px;\n      }\n      #right iron-icon {\n        color: gray;\n        display: inline-flex;\n      }\n    </style>\n    <div id="container">\n      <template is="dom-if" if="[[avatarLabel]]">\n        <div id="icon">\n          <lrndesign-avatar label="[[avatarLabel]]"></lrndesign-avatar>\n        </div>\n      </template>\n      <div id="center">\n        <div id="label">[[label]]</div>\n        <div id="title">[[title]]</div>\n      </div>\n      <div id="right">\n        <template is="dom-if" if="[[!opened]]">\n          <iron-icon icon="arrow-drop-down"></iron-icon>\n        </template>\n        <template is="dom-if" if="[[opened]]">\n          <iron-icon icon="arrow-drop-up"></iron-icon>\n        </template>\n      </div>\n    </div>\n'
    ]);
    _templateObject_8beb7740ecf411e893fb0b59370b06e7 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_8beb7740ecf411e893fb0b59370b06e7()
    ),
    is: "lrndesign-mapmenu-header",
    behaviors: [_ironButtonState.IronButtonState],
    properties: {
      title: { type: String },
      label: { type: String },
      avatarLabel: { type: String, value: "" },
      opened: { type: Boolean }
    },
    hostAttributes: { role: "button", tabindex: 0 }
  });
});
