define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrnIcon = void 0;
  function _templateObject_412de050d6f411e8b74d11781ad1ff47() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_412de050d6f411e8b74d11781ad1ff47 = function() {
      return data;
    };
    return data;
  }
  var LrnIcon = (function(_PolymerElement) {
    babelHelpers.inherits(LrnIcon, _PolymerElement);
    function LrnIcon() {
      babelHelpers.classCallCheck(this, LrnIcon);
      return babelHelpers.possibleConstructorReturn(
        this,
        (LrnIcon.__proto__ || Object.getPrototypeOf(LrnIcon)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      LrnIcon,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrnIcon.prototype.__proto__ ||
                  Object.getPrototypeOf(LrnIcon.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrnIcon.haxProperties,
              LrnIcon.tag,
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
              _templateObject_412de050d6f411e8b74d11781ad1ff47()
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
                title: "Lrn icon",
                description: "Automated conversion of lrn-icon/",
                icon: "icons:android",
                color: "green",
                groups: ["Icon"],
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
            return "lrn-icon";
          }
        }
      ]
    );
    return LrnIcon;
  })(_polymerElement.PolymerElement);
  _exports.LrnIcon = LrnIcon;
  window.customElements.define(LrnIcon.tag, LrnIcon);
});
