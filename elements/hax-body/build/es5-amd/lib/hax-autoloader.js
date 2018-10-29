define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js"
], function(_polymerLegacy, _polymerDom) {
  "use strict";
  function _templateObject_e8fda5d0dbb911e89b94f594419eb4d2() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n    <style>\n      :host {\n        display: none;\n      }\n    </style>\n    <slot></slot>\n"
    ]);
    _templateObject_e8fda5d0dbb911e89b94f594419eb4d2 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_e8fda5d0dbb911e89b94f594419eb4d2()
    ),
    is: "hax-autoloader",
    properties: { processedList: { type: Object, value: {} } },
    attached: function attached() {
      this.fire("hax-register-autoloader", this);
    },
    ready: function ready() {
      this._observer = (0, _polymerDom.dom)(this).observeNodes(function(info) {
        if (0 < info.addedNodes.length) {
          this.processNewElements(info.addedNodes);
        }
      });
    },
    processNewElements: function processNewElements() {
      for (
        var effectiveChildren = (0, _polymerDom.dom)(
            this
          ).getEffectiveChildNodes(),
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
            this.importHref(
              this.resolveUrl("../../".concat(name, "/").concat(name, ".js"))
            );
          } catch (err) {}
        }
      }
    },
    importHref: function importHref(url) {
      return new Promise(function(resolve, reject) {
        var script = document.createElement("script"),
          tempGlobal =
            "__tempModuleLoadingVariable" +
            Math.random()
              .toString(32)
              .substring(2);
        script.type = "module";
        script.textContent = 'import * as m from "'
          .concat(url, '"; window.')
          .concat(tempGlobal, " = m;");
        script.onload = function() {
          resolve(window[tempGlobal]);
          delete window[tempGlobal];
          script.remove();
        };
        script.onerror = function() {
          reject(new Error("Failed to load module script with URL " + url));
          delete window[tempGlobal];
          script.remove();
        };
        document.documentElement.appendChild(script);
      });
    }
  });
});
