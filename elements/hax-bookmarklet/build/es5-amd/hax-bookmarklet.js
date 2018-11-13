define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@lrnwebcomponents/cms-hax/cms-hax.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_8d1b2b10e70911e8ae31318e807f60ac() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n        font-size: 16px;\n      }\n    </style>\n    <cms-hax open-default="" app-store-connection="[[storeData]]" body-offset-left="">\n    <template><slot></slot></template>\n    </cms-hax>\n'
    ]);
    _templateObject_8d1b2b10e70911e8ae31318e807f60ac = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_8d1b2b10e70911e8ae31318e807f60ac()
    ),
    is: "hax-bookmarklet",
    properties: { storeData: { type: Object } },
    ready: function ready() {
      var json = { url: this.resolveUrl("appstore.json") };
      this.storeData = json;
    }
  });
});
