define([
  "meta",
  "require",
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "../node_modules/@polymer/polymer/lib/utils/flattened-nodes-observer.js",
  "../node_modules/@polymer/polymer/lib/utils/resolve-url.js"
], function(
  meta,
  _require,
  _polymerLegacy,
  _polymerDom,
  _flattenedNodesObserver,
  _resolveUrl
) {
  "use strict";
  meta = babelHelpers.interopRequireWildcard(meta);
  _require = babelHelpers.interopRequireWildcard(_require);
  function _templateObject_718cc460edbe11e883a5d91bd26efb3f() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n    <style>\n      :host {\n        display: none;\n      }\n    </style>\n    <slot></slot>\n"
    ]);
    _templateObject_718cc460edbe11e883a5d91bd26efb3f = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_718cc460edbe11e883a5d91bd26efb3f()
    ),
    is: "hax-autoloader",
    properties: { processedList: { type: Object, value: {} } },
    attached: function attached() {
      this.fire("hax-register-autoloader", this);
    },
    ready: function ready() {
      var _this = this;
      this._observer = new _flattenedNodesObserver.FlattenedNodesObserver(
        this,
        function(info) {
          if (0 < info.addedNodes.length) {
            _this.processNewElements(info.addedNodes);
          }
        }
      );
    },
    processNewElements: function processNewElements() {
      for (
        var effectiveChildren = _flattenedNodesObserver.FlattenedNodesObserver.getFlattenedNodes(
            this
          ).filter(function(n) {
            return n.nodeType === Node.ELEMENT_NODE;
          }),
          i = 0;
        i < effectiveChildren.length;
        i++
      ) {
        if (
          babelHelpers.typeof(effectiveChildren[i].tagName) !== "undefined" &&
          babelHelpers.typeof(
            this.processedList[effectiveChildren[i].tagName]
          ) === "undefined"
        ) {
          try {
            var name = effectiveChildren[i].tagName.toLowerCase();
            this.processedList[name] = name;
            var basePath = (0, _resolveUrl.pathFromUrl)(meta.url);
            this.importHref(
              ""
                .concat(basePath, "../../")
                .concat(name, "/")
                .concat(name, ".js")
            );
          } catch (err) {}
        }
      }
    },
    importHref: function importHref(url) {
      new Promise(function(res, rej) {
        return _require.default([url], res, rej);
      });
    }
  });
});
