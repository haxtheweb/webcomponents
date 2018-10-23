define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.SimpleTimer = void 0;
  function _templateObject_8278a380d70611e8817dc9e7fa33a100() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_8278a380d70611e8817dc9e7fa33a100 = function() {
      return data;
    };
    return data;
  }
  var SimpleTimer = (function(_PolymerElement) {
    babelHelpers.inherits(SimpleTimer, _PolymerElement);
    function SimpleTimer() {
      babelHelpers.classCallCheck(this, SimpleTimer);
      return babelHelpers.possibleConstructorReturn(
        this,
        (SimpleTimer.__proto__ || Object.getPrototypeOf(SimpleTimer)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      SimpleTimer,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                SimpleTimer.prototype.__proto__ ||
                  Object.getPrototypeOf(SimpleTimer.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              SimpleTimer.haxProperties,
              SimpleTimer.tag,
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
              _templateObject_8278a380d70611e8817dc9e7fa33a100()
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
                title: "Simple timer",
                description: "Automated conversion of simple-timer/",
                icon: "icons:android",
                color: "green",
                groups: ["Timer"],
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
            return "simple-timer";
          }
        }
      ]
    );
    return SimpleTimer;
  })(_polymerElement.PolymerElement);
  _exports.SimpleTimer = SimpleTimer;
  window.customElements.define(SimpleTimer.tag, SimpleTimer);
});
