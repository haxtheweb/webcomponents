define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrndesignContentsequencer = void 0;
  function _templateObject_1cf82ca0d6f811e89ccdb56f6f6479da() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_1cf82ca0d6f811e89ccdb56f6f6479da = function() {
      return data;
    };
    return data;
  }
  var LrndesignContentsequencer = (function(_PolymerElement) {
    babelHelpers.inherits(LrndesignContentsequencer, _PolymerElement);
    function LrndesignContentsequencer() {
      babelHelpers.classCallCheck(this, LrndesignContentsequencer);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          LrndesignContentsequencer.__proto__ ||
          Object.getPrototypeOf(LrndesignContentsequencer)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      LrndesignContentsequencer,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrndesignContentsequencer.prototype.__proto__ ||
                  Object.getPrototypeOf(LrndesignContentsequencer.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrndesignContentsequencer.haxProperties,
              LrndesignContentsequencer.tag,
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
              _templateObject_1cf82ca0d6f811e89ccdb56f6f6479da()
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
                title: "Lrndesign contentsequencer",
                description:
                  "Automated conversion of lrndesign-contentsequencer/",
                icon: "icons:android",
                color: "green",
                groups: ["Contentsequencer"],
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
            return "lrndesign-contentsequencer";
          }
        }
      ]
    );
    return LrndesignContentsequencer;
  })(_polymerElement.PolymerElement);
  _exports.LrndesignContentsequencer = LrndesignContentsequencer;
  window.customElements.define(
    LrndesignContentsequencer.tag,
    LrndesignContentsequencer
  );
});
