define(["../node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  function _templateObject_520a6810db1511e8954ba1e516478c79() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <form action="[[endPoint]]" method="POST" target="_blank">\n      <input type="hidden" name="data" value$="[[dataString]]">\n      <input type="image" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-1/cp-arrow-right.svg" width="40" height="40" value="Create New Pen with Prefilled Data" class="codepen-mover-button">\n    </form>\n'
      ],
      [
        '\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <form action="[[endPoint]]" method="POST" target="_blank">\n      <input type="hidden" name="data" value\\$="[[dataString]]">\n      <input type="image" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-1/cp-arrow-right.svg" width="40" height="40" value="Create New Pen with Prefilled Data" class="codepen-mover-button">\n    </form>\n'
      ]
    );
    _templateObject_520a6810db1511e8954ba1e516478c79 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_520a6810db1511e8954ba1e516478c79()
    ),
    is: "code-pen-button",
    properties: {
      endPoint: { type: String, value: "https://codepen.io/pen/define" },
      dataString: { type: String, computed: "_getDataString(data)" },
      data: { type: Object, value: {} }
    },
    _getDataString: function _getDataString(data) {
      return JSON.stringify(data)
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
    }
  });
});
