define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrndesignAnimationctrl = void 0;
  function _templateObject_9bd0ee60d6f611e8956cbdf44692ce7d() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_9bd0ee60d6f611e8956cbdf44692ce7d = function() {
      return data;
    };
    return data;
  }
  var LrndesignAnimationctrl = (function(_PolymerElement) {
    babelHelpers.inherits(LrndesignAnimationctrl, _PolymerElement);
    function LrndesignAnimationctrl() {
      babelHelpers.classCallCheck(this, LrndesignAnimationctrl);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          LrndesignAnimationctrl.__proto__ ||
          Object.getPrototypeOf(LrndesignAnimationctrl)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      LrndesignAnimationctrl,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrndesignAnimationctrl.prototype.__proto__ ||
                  Object.getPrototypeOf(LrndesignAnimationctrl.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrndesignAnimationctrl.haxProperties,
              LrndesignAnimationctrl.tag,
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
              _templateObject_9bd0ee60d6f611e8956cbdf44692ce7d()
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
                title: "Lrndesign animationctrl",
                description: "Automated conversion of lrndesign-animationctrl/",
                icon: "icons:android",
                color: "green",
                groups: ["Animationctrl"],
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
            return "lrndesign-animationctrl";
          }
        }
      ]
    );
    return LrndesignAnimationctrl;
  })(_polymerElement.PolymerElement);
  _exports.LrndesignAnimationctrl = LrndesignAnimationctrl;
  window.customElements.define(
    LrndesignAnimationctrl.tag,
    LrndesignAnimationctrl
  );
});
