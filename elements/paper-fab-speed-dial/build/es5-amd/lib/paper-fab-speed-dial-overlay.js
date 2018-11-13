define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-overlay-behavior/iron-overlay-behavior.js"
], function(_polymerLegacy, _ironOverlayBehavior) {
  "use strict";
  function _templateObject_5e28f550e70711e89f177d0b354f1791() {
    var data = babelHelpers.taggedTemplateLiteral(["\n\t\t<slot></slot>\n"]);
    _templateObject_5e28f550e70711e89f177d0b354f1791 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_5e28f550e70711e89f177d0b354f1791()
    ),
    is: "paper-fab-speed-dial-overlay",
    behaviors: [_ironOverlayBehavior.IronOverlayBehavior]
  });
});
