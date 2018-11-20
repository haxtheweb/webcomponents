define(["../node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  function _templateObject_706a1000ecf211e89695a5d4b8d09223() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <form action="[[endPoint]]" method="POST" target="_blank">\n      <input type="hidden" name="data" value$="[[dataString]]">\n      <input type="image" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-1/cp-arrow-right.svg" width="40" height="40" value="Create New Pen with Prefilled Data" class="codepen-mover-button">\n    </form>\n'
      ],
      [
        '\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <form action="[[endPoint]]" method="POST" target="_blank">\n      <input type="hidden" name="data" value\\$="[[dataString]]">\n      <input type="image" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-1/cp-arrow-right.svg" width="40" height="40" value="Create New Pen with Prefilled Data" class="codepen-mover-button">\n    </form>\n'
      ]
    );
    _templateObject_706a1000ecf211e89695a5d4b8d09223 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_706a1000ecf211e89695a5d4b8d09223()
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
