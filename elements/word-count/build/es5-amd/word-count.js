define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.WordCount = void 0;
  function _templateObject_3be15550d70d11e89dbb9119295de7f9() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_3be15550d70d11e89dbb9119295de7f9 = function() {
      return data;
    };
    return data;
  }
  var WordCount = (function(_PolymerElement) {
    babelHelpers.inherits(WordCount, _PolymerElement);
    function WordCount() {
      babelHelpers.classCallCheck(this, WordCount);
      return babelHelpers.possibleConstructorReturn(
        this,
        (WordCount.__proto__ || Object.getPrototypeOf(WordCount)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      WordCount,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                WordCount.prototype.__proto__ ||
                  Object.getPrototypeOf(WordCount.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              WordCount.haxProperties,
              WordCount.tag,
              this
            );
          }
        }
      ],
      [
        {
          key: "template",
          get: function get() {
            return (0, _polymerElement.html)(
              _templateObject_3be15550d70d11e89dbb9119295de7f9()
            );
          }
        },
        {
          key: "haxProperties",
          get: function get() {
            return {
              canScale: !0,
              canPosition: !0,
              canEditSource: !1,
              gizmo: {
                title: "Word count",
                description: "Automated conversion of word-count/",
                icon: "icons:android",
                color: "green",
                groups: ["Count"],
                handles: [{ type: "todo:read-the-docs-for-usage" }],
                meta: {
                  author: "btopro",
                  owner: "The Pennsylvania State University"
                }
              },
              settings: { quick: [], configure: [], advanced: [] }
            };
          }
        },
        {
          key: "properties",
          get: function get() {
            return {};
          }
        },
        {
          key: "tag",
          get: function get() {
            return "word-count";
          }
        }
      ]
    );
    return WordCount;
  })(_polymerElement.PolymerElement);
  _exports.WordCount = WordCount;
  window.customElements.define(WordCount.tag, WordCount);
});
