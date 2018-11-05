define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@lrnwebcomponents/cms-hax/cms-hax.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_03b29810e11c11e8a65191a91a438179() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n        font-size: 1em;\n      }\n    </style>\n    <cms-hax open-default="" app-store-connection="[[storeData]]" body-offset-left="">\n    <template><slot></slot></template>\n    </cms-hax>\n'
    ]);
    _templateObject_03b29810e11c11e8a65191a91a438179 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_03b29810e11c11e8a65191a91a438179()
    ),
    is: "hax-bookmarklet",
    properties: { storeData: { type: Object } },
    ready: function ready() {
      var json = { url: this.resolveUrl("appstore.json") };
      this.storeData = json;
    }
  });
});
