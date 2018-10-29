define(["../node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  function _templateObject_faea3c30db3311e8bfe1ff12b4128aab() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        position: relative;\n        min-height: 1px;\n        float: left;\n      }\n      :host:after {\n        clear: both;\n      }\n      #col-inner {\n        padding-left: 15px;\n        padding-right: 15px;\n        @apply --responsive-grid-col-inner;\n      }\n      /* Hide Print-Only on Screen */\n      @media screen {\n        :host[print-only] {\n          display: none;\n        }\n      }\n      /* Hide Screen-Only on Print */\n      @media print {\n        :host[screen-only] {\n          display: none;\n        }\n      }\n    </style>\n    <div id="col-inner"><slot></slot></div>\n'
    ]);
    _templateObject_faea3c30db3311e8bfe1ff12b4128aab = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_faea3c30db3311e8bfe1ff12b4128aab()
    ),
    is: "responsive-grid-col",
    properties: {
      xl: { type: Number, value: 1 },
      lg: { type: Number, value: 1 },
      md: { type: Number, value: 1 },
      sm: { type: Number, value: 1 },
      xs: { type: Number, value: 1 }
    }
  });
});
