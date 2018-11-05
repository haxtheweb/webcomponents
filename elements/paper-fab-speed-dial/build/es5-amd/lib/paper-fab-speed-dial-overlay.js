define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-overlay-behavior/iron-overlay-behavior.js"
], function(_polymerLegacy, _ironOverlayBehavior) {
  "use strict";
  function _templateObject_c68272f0e11911e8979c8b3b1f0736d2() {
    var data = babelHelpers.taggedTemplateLiteral(["\n\t\t<slot></slot>\n"]);
    _templateObject_c68272f0e11911e8979c8b3b1f0736d2 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_c68272f0e11911e8979c8b3b1f0736d2()
    ),
    is: "paper-fab-speed-dial-overlay",
    behaviors: [_ironOverlayBehavior.IronOverlayBehavior]
  });
});
