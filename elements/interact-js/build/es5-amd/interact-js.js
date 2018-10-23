define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.InteractJs = void 0;
  function _templateObject_86d13f50d6f211e8b4a76d9d57a294a0() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_86d13f50d6f211e8b4a76d9d57a294a0 = function() {
      return data;
    };
    return data;
  }
  var InteractJs = (function(_PolymerElement) {
    babelHelpers.inherits(InteractJs, _PolymerElement);
    function InteractJs() {
      babelHelpers.classCallCheck(this, InteractJs);
      return babelHelpers.possibleConstructorReturn(
        this,
        (InteractJs.__proto__ || Object.getPrototypeOf(InteractJs)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      InteractJs,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                InteractJs.prototype.__proto__ ||
                  Object.getPrototypeOf(InteractJs.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              InteractJs.haxProperties,
              InteractJs.tag,
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
              _templateObject_86d13f50d6f211e8b4a76d9d57a294a0()
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
                title: "Interact js",
                description: "Automated conversion of interact-js/",
                icon: "icons:android",
                color: "green",
                groups: ["Js"],
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
            return "interact-js";
          }
        }
      ]
    );
    return InteractJs;
  })(_polymerElement.PolymerElement);
  _exports.InteractJs = InteractJs;
  window.customElements.define(InteractJs.tag, InteractJs);
});
