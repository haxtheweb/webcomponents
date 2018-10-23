define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrndesignStepper = void 0;
  function _templateObject_91507f60d6fa11e89ad55705cb98ef50() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_91507f60d6fa11e89ad55705cb98ef50 = function() {
      return data;
    };
    return data;
  }
  var LrndesignStepper = (function(_PolymerElement) {
    babelHelpers.inherits(LrndesignStepper, _PolymerElement);
    function LrndesignStepper() {
      babelHelpers.classCallCheck(this, LrndesignStepper);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          LrndesignStepper.__proto__ || Object.getPrototypeOf(LrndesignStepper)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      LrndesignStepper,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrndesignStepper.prototype.__proto__ ||
                  Object.getPrototypeOf(LrndesignStepper.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrndesignStepper.haxProperties,
              LrndesignStepper.tag,
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
              _templateObject_91507f60d6fa11e89ad55705cb98ef50()
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
                title: "Lrndesign stepper",
                description: "Automated conversion of lrndesign-stepper/",
                icon: "icons:android",
                color: "green",
                groups: ["Stepper"],
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
            return "lrndesign-stepper";
          }
        }
      ]
    );
    return LrndesignStepper;
  })(_polymerElement.PolymerElement);
  _exports.LrndesignStepper = LrndesignStepper;
  window.customElements.define(LrndesignStepper.tag, LrndesignStepper);
});
