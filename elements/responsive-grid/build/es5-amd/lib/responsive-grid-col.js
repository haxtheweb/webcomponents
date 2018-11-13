define(["../node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  function _templateObject_84541390e70711e8a640098f1654c700() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        position: relative;\n        min-height: 1px;\n        float: left;\n      }\n      :host:after {\n        clear: both;\n      }\n      #col-inner {\n        padding-left: 15px;\n        padding-right: 15px;\n        @apply --responsive-grid-col-inner;\n      }\n      /* Hide Print-Only on Screen */\n      @media screen {\n        :host([print-only]) {\n          display: none;\n        }\n      }\n      /* Hide Screen-Only on Print */\n      @media print {\n        :host([screen-only]) {\n          display: none;\n        }\n      }\n    </style>\n    <div id="col-inner"><slot></slot></div>\n'
    ]);
    _templateObject_84541390e70711e8a640098f1654c700 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_84541390e70711e8a640098f1654c700()
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
