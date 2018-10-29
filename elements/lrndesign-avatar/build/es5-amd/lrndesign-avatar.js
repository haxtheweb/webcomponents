define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@lrnwebcomponents/paper-avatar/paper-avatar.js",
  "./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_577926a0db3411e8b5f78b83d63d61a3() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style include="materializecss-styles"></style>\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <paper-avatar label="[[label]]" src="[[src]]" two-chars="[[twoChars]]" class$="[[color]]" jdenticon="[[jdenticon]]"></paper-avatar>\n'
      ],
      [
        '\n    <style include="materializecss-styles"></style>\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <paper-avatar label="[[label]]" src="[[src]]" two-chars="[[twoChars]]" class\\$="[[color]]" jdenticon="[[jdenticon]]"></paper-avatar>\n'
      ]
    );
    _templateObject_577926a0db3411e8b5f78b83d63d61a3 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_577926a0db3411e8b5f78b83d63d61a3()
    ),
    is: "lrndesign-avatar",
    properties: {
      label: { type: String, value: "lrndesign-avatar" },
      src: { type: String },
      twoChars: { type: Boolean, value: !1 },
      color: { type: String, reflectToAttribute: !0 },
      jdenticon: { type: Boolean, value: !1 }
    }
  });
});
