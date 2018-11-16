define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js"
], function(_exports, _polymerElement) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.SimpleColors = void 0;
  function _templateObject_835bca50e94b11e8a8216df3bc0e546b() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_835bca50e94b11e8a8216df3bc0e546b = function() {
      return data;
    };
    return data;
  }
  var SimpleColors = (function(_PolymerElement) {
    babelHelpers.inherits(SimpleColors, _PolymerElement);
    function SimpleColors() {
      babelHelpers.classCallCheck(this, SimpleColors);
      return babelHelpers.possibleConstructorReturn(
        this,
        babelHelpers.getPrototypeOf(SimpleColors).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      SimpleColors,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                babelHelpers.getPrototypeOf(SimpleColors.prototype),
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
              _templateObject_835bca50e94b11e8a8216df3bc0e546b()
            );
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
            return "simple-colors";
          }
        }
      ]
    );
    return SimpleColors;
  })(_polymerElement.PolymerElement);
  _exports.SimpleColors = SimpleColors;
  window.customElements.define(SimpleColors.tag, SimpleColors);
});
