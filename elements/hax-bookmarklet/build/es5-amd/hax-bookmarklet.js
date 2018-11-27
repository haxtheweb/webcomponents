define([
  "meta",
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/polymer/lib/utils/resolve-url.js",
  "./node_modules/@lrnwebcomponents/cms-hax/cms-hax.js"
], function(meta, _polymerLegacy, _resolveUrl, _cmsHax) {
  "use strict";
  meta = babelHelpers.interopRequireWildcard(meta);
  function _templateObject_d4844350f1e611e896fe3b5ddf766fff() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n        font-size: 16px;\n      }\n    </style>\n    <cms-hax open-default="" app-store-connection="[[storeData]]" body-offset-left="">\n    <template><slot></slot></template>\n    </cms-hax>\n'
    ]);
    _templateObject_d4844350f1e611e896fe3b5ddf766fff = function _templateObject_d4844350f1e611e896fe3b5ddf766fff() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_d4844350f1e611e896fe3b5ddf766fff()
    ),
    is: "hax-bookmarklet",
    properties: { storeData: { type: Object } },
    ready: function ready() {
      var json = {
        url: (0, _resolveUrl.pathFromUrl)(meta.url) + "appstore.json"
      };
      this.storeData = json;
    }
  });
});
