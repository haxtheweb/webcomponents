define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "../../node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.SimplePicker = void 0;
  function _templateObject_c1a381d0ecee11e88fad33157e503dcd() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_c1a381d0ecee11e88fad33157e503dcd = function() {
      return data;
    };
    return data;
  }
  var SimplePicker = (function(_PolymerElement) {
    babelHelpers.inherits(SimplePicker, _PolymerElement);
    function SimplePicker() {
      babelHelpers.classCallCheck(this, SimplePicker);
      return babelHelpers.possibleConstructorReturn(
        this,
        babelHelpers.getPrototypeOf(SimplePicker).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      SimplePicker,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                babelHelpers.getPrototypeOf(SimplePicker.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              SimplePicker.haxProperties,
              SimplePicker.tag,
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
              _templateObject_c1a381d0ecee11e88fad33157e503dcd()
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
                title: "Simple picker",
                description: "a simple picker for swatches, icons, etc.",
                icon: "icons:android",
                color: "green",
                groups: ["Picker"],
                handles: [{ type: "todo:read-the-docs-for-usage" }],
                meta: {
                  author: "nikkimk",
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
            return "simple-picker";
          }
        }
      ]
    );
    return SimplePicker;
  })(_polymerElement.PolymerElement);
  _exports.SimplePicker = SimplePicker;
  window.customElements.define(SimplePicker.tag, SimplePicker);
});
