define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_polymerLegacy, _polymerDom) {
  "use strict";
  function _templateObject_6aae1a10db3311e88b560fbe08bd221c() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n       :host {\n        display: inline;\n      }\n    </style>\n    [[prefix]] [[math]] [[suffix]]\n    <span hidden=""><slot id="content"></slot></span>\n'
    ]);
    _templateObject_6aae1a10db3311e88b560fbe08bd221c = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_6aae1a10db3311e88b560fbe08bd221c()
    ),
    is: "lrn-math",
    behaviors: [HAXBehaviors.PropertiesBehaviors],
    properties: {
      prefix: { type: String, value: "$$" },
      suffix: { type: String, value: "$$" },
      inline: { type: Boolean, value: !0, reflectToAttribute: !0 },
      math: { type: String },
      mathText: { type: String, observer: "_mathChanged" }
    },
    observers: ["_inlineChanged(inline)"],
    _inlineChanged: function _inlineChanged(inline) {
      if (inline) {
        this.prefix = "\\(";
        this.suffix = "\\)";
      }
    },
    _mathChanged: function _mathChanged(newValue, oldValue) {
      if (newValue !== oldValue) {
        while (null !== (0, _polymerDom.dom)(this).firstChild) {
          (0, _polymerDom.dom)(this).removeChild(
            (0, _polymerDom.dom)(this).firstChild
          );
        }
        var frag = document.createTextNode(newValue);
        (0, _polymerDom.dom)(this).appendChild(frag);
      }
    },
    attached: function attached() {
      this.setHaxProperties({
        canScale: !0,
        canPosition: !0,
        canEditSource: !0,
        gizmo: {
          title: "Math",
          description: "Present math in a nice looking way.",
          icon: "places:all-inclusive",
          color: "grey",
          groups: ["Content"],
          handles: [
            { type: "math", math: "mathText" },
            { type: "inline", text: "mathText" }
          ],
          meta: { author: "LRNWebComponents" }
        },
        settings: {
          quick: [
            {
              property: "inline",
              title: "Inline",
              description: "Display this math inline",
              inputMethod: "boolean",
              icon: "remove"
            }
          ],
          configure: [
            {
              property: "mathText",
              title: "Math",
              description: "Math",
              inputMethod: "textfield",
              icon: "editor:format-quote"
            },
            {
              property: "inline",
              title: "Inline",
              description: "Display this math inline",
              inputMethod: "boolean",
              icon: "remove"
            }
          ],
          advanced: []
        }
      });
    },
    ready: function ready() {
      var _this = this;
      if (babelHelpers.typeof(window.__mathJaxLoaded) === "undefined") {
        var mathjaxCDN = document.createElement("script");
        mathjaxCDN.src =
          "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS_HTML";
        document.body.appendChild(mathjaxCDN);
        window.__mathJaxLoaded = !0;
      }
      this._observer = (0, _polymerDom.dom)(this.$.content).observeNodes(
        function(info) {
          _this.math = info.addedNodes
            .map(function(node) {
              return node.textContent;
            })
            .toString();
          setTimeout(function() {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
          }, 100);
        }
      );
    }
  });
});
