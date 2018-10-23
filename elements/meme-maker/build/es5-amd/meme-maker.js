define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.MemeMaker = void 0;
  function _templateObject_bc340350d6ff11e898d7af6191bce8c2() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_bc340350d6ff11e898d7af6191bce8c2 = function() {
      return data;
    };
    return data;
  }
  var MemeMaker = (function(_PolymerElement) {
    babelHelpers.inherits(MemeMaker, _PolymerElement);
    function MemeMaker() {
      babelHelpers.classCallCheck(this, MemeMaker);
      return babelHelpers.possibleConstructorReturn(
        this,
        (MemeMaker.__proto__ || Object.getPrototypeOf(MemeMaker)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      MemeMaker,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                MemeMaker.prototype.__proto__ ||
                  Object.getPrototypeOf(MemeMaker.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              MemeMaker.haxProperties,
              MemeMaker.tag,
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
              _templateObject_bc340350d6ff11e898d7af6191bce8c2()
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
                title: "Meme maker",
                description: "Automated conversion of meme-maker/",
                icon: "icons:android",
                color: "green",
                groups: ["Maker"],
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
            return "meme-maker";
          }
        }
      ]
    );
    return MemeMaker;
  })(_polymerElement.PolymerElement);
  _exports.MemeMaker = MemeMaker;
  window.customElements.define(MemeMaker.tag, MemeMaker);
});
