define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.HaxEditable = void 0;
  function _templateObject_82e331b0d6f111e8873897996beb5d88() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_82e331b0d6f111e8873897996beb5d88 = function() {
      return data;
    };
    return data;
  }
  var HaxEditable = (function(_PolymerElement) {
    babelHelpers.inherits(HaxEditable, _PolymerElement);
    function HaxEditable() {
      babelHelpers.classCallCheck(this, HaxEditable);
      return babelHelpers.possibleConstructorReturn(
        this,
        (HaxEditable.__proto__ || Object.getPrototypeOf(HaxEditable)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      HaxEditable,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                HaxEditable.prototype.__proto__ ||
                  Object.getPrototypeOf(HaxEditable.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              HaxEditable.haxProperties,
              HaxEditable.tag,
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
              _templateObject_82e331b0d6f111e8873897996beb5d88()
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
                title: "Hax editable",
                description: "Automated conversion of hax-editable/",
                icon: "icons:android",
                color: "green",
                groups: ["Editable"],
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
            return "hax-editable";
          }
        }
      ]
    );
    return HaxEditable;
  })(_polymerElement.PolymerElement);
  _exports.HaxEditable = HaxEditable;
  window.customElements.define(HaxEditable.tag, HaxEditable);
});
