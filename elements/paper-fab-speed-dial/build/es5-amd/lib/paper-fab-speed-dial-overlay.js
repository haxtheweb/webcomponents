define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-overlay-behavior/iron-overlay-behavior.js"
], function(_polymerLegacy, _ironOverlayBehavior) {
  "use strict";
  function _templateObject_d0e64570f32d11e88810396e06a9a5d7() {
    var data = babelHelpers.taggedTemplateLiteral(["\n\t\t<slot></slot>\n"]);
    _templateObject_d0e64570f32d11e88810396e06a9a5d7 = function _templateObject_d0e64570f32d11e88810396e06a9a5d7() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_d0e64570f32d11e88810396e06a9a5d7()
    ),
    is: "paper-fab-speed-dial-overlay",
    behaviors: [_ironOverlayBehavior.IronOverlayBehavior]
  });
});
