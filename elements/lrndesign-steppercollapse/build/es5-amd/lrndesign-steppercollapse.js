define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrndesignSteppercollapse = void 0;
  function _templateObject_b00e5ee0d6fa11e8989f4d8ec1045af3() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_b00e5ee0d6fa11e8989f4d8ec1045af3 = function() {
      return data;
    };
    return data;
  }
  var LrndesignSteppercollapse = (function(_PolymerElement) {
    babelHelpers.inherits(LrndesignSteppercollapse, _PolymerElement);
    function LrndesignSteppercollapse() {
      babelHelpers.classCallCheck(this, LrndesignSteppercollapse);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          LrndesignSteppercollapse.__proto__ ||
          Object.getPrototypeOf(LrndesignSteppercollapse)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      LrndesignSteppercollapse,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrndesignSteppercollapse.prototype.__proto__ ||
                  Object.getPrototypeOf(LrndesignSteppercollapse.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrndesignSteppercollapse.haxProperties,
              LrndesignSteppercollapse.tag,
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
              _templateObject_b00e5ee0d6fa11e8989f4d8ec1045af3()
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
                title: "Lrndesign steppercollapse",
                description:
                  "Automated conversion of lrndesign-steppercollapse/",
                icon: "icons:android",
                color: "green",
                groups: ["Steppercollapse"],
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
            return "lrndesign-steppercollapse";
          }
        }
      ]
    );
    return LrndesignSteppercollapse;
  })(_polymerElement.PolymerElement);
  _exports.LrndesignSteppercollapse = LrndesignSteppercollapse;
  window.customElements.define(
    LrndesignSteppercollapse.tag,
    LrndesignSteppercollapse
  );
});
