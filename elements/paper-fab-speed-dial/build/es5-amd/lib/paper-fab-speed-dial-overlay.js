define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-overlay-behavior/iron-overlay-behavior.js"
], function(_polymerLegacy, _ironOverlayBehavior) {
  "use strict";
  function _templateObject_01ae2440e5f811e896d543b388b3ee31() {
    var data = babelHelpers.taggedTemplateLiteral(["\n\t\t<slot></slot>\n"]);
    _templateObject_01ae2440e5f811e896d543b388b3ee31 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_01ae2440e5f811e896d543b388b3ee31()
    ),
    is: "paper-fab-speed-dial-overlay",
    behaviors: [_ironOverlayBehavior.IronOverlayBehavior]
  });
});
