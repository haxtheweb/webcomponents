define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js"
], function(_exports, _polymerElement) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.IconsetDemo = void 0;
  function _templateObject_182e0d00dd3011e88440fd532eeba904() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>\n<div>[[icons]]</div>"
    ]);
    _templateObject_182e0d00dd3011e88440fd532eeba904 = function() {
      return data;
    };
    return data;
  }
  var IconsetDemo = (function(_PolymerElement) {
    babelHelpers.inherits(IconsetDemo, _PolymerElement);
    function IconsetDemo() {
      babelHelpers.classCallCheck(this, IconsetDemo);
      return babelHelpers.possibleConstructorReturn(
        this,
        babelHelpers.getPrototypeOf(IconsetDemo).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      IconsetDemo,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                babelHelpers.getPrototypeOf(IconsetDemo.prototype),
                "connectedCallback",
                this
              )
              .call(this);
          }
        }
      ],
      [
        {
          key: "template",
          get: function get() {
            return (0, _polymerElement.html)(
              _templateObject_182e0d00dd3011e88440fd532eeba904()
            );
          }
        },
        {
          key: "properties",
          get: function get() {
            return {
              icons: {
                name: "icons",
                type: "Array",
                value: "[]",
                reflectToAttribute: !1,
                observer: !1
              }
            };
          }
        },
        {
          key: "tag",
          get: function get() {
            return "iconset-demo";
          }
        }
      ]
    );
    return IconsetDemo;
  })(_polymerElement.PolymerElement);
  _exports.IconsetDemo = IconsetDemo;
  window.customElements.define(IconsetDemo.tag, IconsetDemo);
});
