define(["../node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  var $_documentContainer = document.createElement("div");
  $_documentContainer.setAttribute("style", "display: none;");
  $_documentContainer.innerHTML =
    '<dom-module id="data-table-column-filter">\n  <style is="custom-style">\n    :host([hidden]) {\n      display: none;\n    }\n\n    paper-input {\n      --paper-input-container: {\n        margin-bottom: 20px;\n      };\n      --paper-input-container-label: {\n        font-size: inherit;\n      }\n    }\n  </style>\n\n  <template>\n    <paper-input label="[[label]]" value="[[value]]" on-value-changed="_valueChanged"></paper-input>\n  </template>\n  \n</dom-module>';
  document.head.appendChild($_documentContainer);
  (0, _polymerLegacy.Polymer)({
    is: "data-table-column-filter",
    properties: {
      label: String,
      value: { type: String, notify: !0 },
      hidden: Boolean
    },
    _valueChanged: function _valueChanged(e) {
      var value = e.detail.value;
      this.debounce(
        "value",
        function() {
          this.value = value;
        }.bind(this),
        250
      );
    }
  });
});
