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
  function _templateObject_97428010f1e611e8b3a2e3a031c18fd0() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n    <style>\n      :host {\n        display: none;\n      }\n    </style>\n    <slot></slot>\n"
    ]);
    _templateObject_97428010f1e611e8b3a2e3a031c18fd0 = function _templateObject_97428010f1e611e8b3a2e3a031c18fd0() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_97428010f1e611e8b3a2e3a031c18fd0()
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
    processNewElements: function processNewElements(e) {
      for (
        var _this2 = this,
          effectiveChildren = _flattenedNodesObserver.FlattenedNodesObserver.getFlattenedNodes(
            this
          ).filter(function(n) {
            return n.nodeType === Node.ELEMENT_NODE;
          }),
          i = 0;
        i < effectiveChildren.length;
        i++
      ) {
        if (
          babelHelpers.typeof(effectiveChildren[i].tagName) !==
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0)) &&
          babelHelpers.typeof(
            this.processedList[effectiveChildren[i].tagName]
          ) ===
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0))
        ) {
          try {
            (function() {
              var name = effectiveChildren[i].tagName.toLowerCase();
              _this2.processedList[name] = name;
              var basePath = (0, _resolveUrl.pathFromUrl)(meta.url);
              new Promise(function(res, rej) {
                return _require.default(
                  ["../../".concat(name, "/").concat(name, ".js")],
                  res,
                  rej
                );
              });
            })();
          } catch (err) {}
        }
      }
    }
  });
});
