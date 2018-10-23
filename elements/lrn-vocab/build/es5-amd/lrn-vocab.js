define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrnVocab = void 0;
  function _templateObject_2b64ad70d6f511e886fc6964488b8c74() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_2b64ad70d6f511e886fc6964488b8c74 = function() {
      return data;
    };
    return data;
  }
  var LrnVocab = (function(_PolymerElement) {
    babelHelpers.inherits(LrnVocab, _PolymerElement);
    function LrnVocab() {
      babelHelpers.classCallCheck(this, LrnVocab);
      return babelHelpers.possibleConstructorReturn(
        this,
        (LrnVocab.__proto__ || Object.getPrototypeOf(LrnVocab)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      LrnVocab,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrnVocab.prototype.__proto__ ||
                  Object.getPrototypeOf(LrnVocab.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrnVocab.haxProperties,
              LrnVocab.tag,
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
              _templateObject_2b64ad70d6f511e886fc6964488b8c74()
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
                title: "Lrn vocab",
                description: "Automated conversion of lrn-vocab/",
                icon: "icons:android",
                color: "green",
                groups: ["Vocab"],
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
            return "lrn-vocab";
          }
        }
      ]
    );
    return LrnVocab;
  })(_polymerElement.PolymerElement);
  _exports.LrnVocab = LrnVocab;
  window.customElements.define(LrnVocab.tag, LrnVocab);
});
