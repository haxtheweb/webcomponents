define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-overlay-behavior/iron-overlay-behavior.js"
], function(_polymerLegacy, _ironOverlayBehavior) {
  "use strict";
  function _templateObject_8a857e70dbb811e8a67d6f6e5303882b() {
    var data = babelHelpers.taggedTemplateLiteral(["\n\t\t<slot></slot>\n"]);
    _templateObject_8a857e70dbb811e8a67d6f6e5303882b = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_8a857e70dbb811e8a67d6f6e5303882b()
    ),
    is: "paper-fab-speed-dial-overlay",
    behaviors: [_ironOverlayBehavior.IronOverlayBehavior]
  });
});
