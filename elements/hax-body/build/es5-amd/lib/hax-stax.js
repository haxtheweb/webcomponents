define(["../node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  var $_documentContainer = document.createElement("div");
  $_documentContainer.setAttribute("style", "display: none;");
  $_documentContainer.innerHTML =
    '<dom-module id="hax-stax">\n  <template>\n    <style>\n    :host {\n      display:none;\n    }\n  </style>\n  </template>\n\n  \n</dom-module>';
  document.head.appendChild($_documentContainer);
  (0, _polymerLegacy.Polymer)({
    is: "hax-stax",
    properties: { data: { type: Object } },
    attached: function attached() {
      if (babelHelpers.typeof(this.data) !== "undefined") {
        this.fire("hax-register-stax", this.data);
      }
    }
  });
});
