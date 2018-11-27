define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@polymer/polymer/lib/elements/dom-repeat.js",
  "./lib/hex-a-gon.js"
], function(_exports, _polymerElement, _domRepeat, _hexAGon) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.HexagonLoader = void 0;
  function _templateObject_7fb49a20f1e411e8938f6d1f8705187c() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n<style>:host {\n  display: none;\n}\n:host([hidden]) {\n  display: none;\n}\n:host([loading]) {\n  display: block;\n}\n:host([size="small"]) {\n  transform: scale(.5, .5);\n  -webkit-transform: scale(.5, .5);\n  -moz-transform: scale(.5, .5);\n  -ms-transform: scale(.5, .5);\n  -o-transform: scale(.5, .5);\n}\n:host([size="large"]) {\n  transform: scale(1.25, 1.25);\n  -webkit-transform: scale(1.25, 1.25);\n  -moz-transform: scale(1.25, 1.25);\n  -ms-transform: scale(1.25, 1.25);\n  -o-transform: scale(1.25, 1.25);\n}\n:host([size="epic"]) {\n  transform: scale(2.5, 2.5);\n  -webkit-transform: scale(2.5, 2.5);\n  -moz-transform: scale(2.5, 2.5);\n  -ms-transform: scale(2.5, 2.5);\n  -o-transform: scale(2.5, 2.5);\n}\n\ndiv {\n  position: relative;\n  width: 255px;\n  height: 232.5px;\n  margin: 0 auto;\n}\n\nhex-a-gon {\n  display: none;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 30px;\n  height: 18px;\n  color: #9fb475;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  -webkit-transform-origin: 0 0;\n          transform-origin: 0 0;\n}\n\nhex-a-gon:nth-of-type(1) {\n  display: block;\n  margin-left: -56.25px;\n  margin-top: -97.875px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0s;\n          animation-delay: 0s;\n}\nhex-a-gon:nth-of-type(2) {\n  display: block;\n  margin-left: -18.75px;\n  margin-top: -97.875px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.05s;\n          animation-delay: 0.05s;\n}\nhex-a-gon:nth-of-type(3) {\n  display: block;\n  margin-left: 18.75px;\n  margin-top: -97.875px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.1s;\n          animation-delay: 0.1s;\n}\nhex-a-gon:nth-of-type(4) {\n  display: block;\n  margin-left: 56.25px;\n  margin-top: -97.875px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.15s;\n          animation-delay: 0.15s;\n}\nhex-a-gon:nth-of-type(5) {\n  display: block;\n  margin-left: -75px;\n  margin-top: -65.25px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0s;\n          animation-delay: 0s;\n}\nhex-a-gon:nth-of-type(6) {\n  display: block;\n  margin-left: -37.5px;\n  margin-top: -65.25px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.05s;\n          animation-delay: 0.05s;\n}\nhex-a-gon:nth-of-type(7) {\n  display: block;\n  margin-left: 0px;\n  margin-top: -65.25px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.1s;\n          animation-delay: 0.1s;\n}\nhex-a-gon:nth-of-type(8) {\n  display: block;\n  margin-left: 37.5px;\n  margin-top: -65.25px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.15s;\n          animation-delay: 0.15s;\n}\nhex-a-gon:nth-of-type(9) {\n  display: block;\n  margin-left: 75px;\n  margin-top: -65.25px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.2s;\n          animation-delay: 0.2s;\n}\nhex-a-gon:nth-of-type(10) {\n  display: block;\n  margin-left: -93.75px;\n  margin-top: -32.625px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0s;\n          animation-delay: 0s;\n}\nhex-a-gon:nth-of-type(11) {\n  display: block;\n  margin-left: -56.25px;\n  margin-top: -32.625px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.05s;\n          animation-delay: 0.05s;\n}\nhex-a-gon:nth-of-type(12) {\n  display: block;\n  margin-left: -18.75px;\n  margin-top: -32.625px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.1s;\n          animation-delay: 0.1s;\n}\nhex-a-gon:nth-of-type(13) {\n  display: block;\n  margin-left: 18.75px;\n  margin-top: -32.625px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.15s;\n          animation-delay: 0.15s;\n}\nhex-a-gon:nth-of-type(14) {\n  display: block;\n  margin-left: 56.25px;\n  margin-top: -32.625px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.2s;\n          animation-delay: 0.2s;\n}\nhex-a-gon:nth-of-type(15) {\n  display: block;\n  margin-left: 93.75px;\n  margin-top: -32.625px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.25s;\n          animation-delay: 0.25s;\n}\nhex-a-gon:nth-of-type(16) {\n  display: block;\n  margin-left: -112.5px;\n  margin-top: 0px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0s;\n          animation-delay: 0s;\n}\nhex-a-gon:nth-of-type(17) {\n  display: block;\n  margin-left: -75px;\n  margin-top: 0px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.05s;\n          animation-delay: 0.05s;\n}\nhex-a-gon:nth-of-type(18) {\n  display: block;\n  margin-left: -37.5px;\n  margin-top: 0px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.1s;\n          animation-delay: 0.1s;\n}\nhex-a-gon:nth-of-type(19) {\n  display: block;\n  margin-left: 0px;\n  margin-top: 0px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.15s;\n          animation-delay: 0.15s;\n}\nhex-a-gon:nth-of-type(20) {\n  display: block;\n  margin-left: 37.5px;\n  margin-top: 0px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.2s;\n          animation-delay: 0.2s;\n}\nhex-a-gon:nth-of-type(21) {\n  display: block;\n  margin-left: 75px;\n  margin-top: 0px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.25s;\n          animation-delay: 0.25s;\n}\nhex-a-gon:nth-of-type(22) {\n  display: block;\n  margin-left: 112.5px;\n  margin-top: 0px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.3s;\n          animation-delay: 0.3s;\n}\nhex-a-gon:nth-of-type(23) {\n  display: block;\n  margin-left: -93.75px;\n  margin-top: 32.625px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0s;\n          animation-delay: 0s;\n}\nhex-a-gon:nth-of-type(24) {\n  display: block;\n  margin-left: -56.25px;\n  margin-top: 32.625px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.05s;\n          animation-delay: 0.05s;\n}\nhex-a-gon:nth-of-type(25) {\n  display: block;\n  margin-left: -18.75px;\n  margin-top: 32.625px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.1s;\n          animation-delay: 0.1s;\n}\nhex-a-gon:nth-of-type(26) {\n  display: block;\n  margin-left: 18.75px;\n  margin-top: 32.625px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.15s;\n          animation-delay: 0.15s;\n}\nhex-a-gon:nth-of-type(27) {\n  display: block;\n  margin-left: 56.25px;\n  margin-top: 32.625px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.2s;\n          animation-delay: 0.2s;\n}\nhex-a-gon:nth-of-type(28) {\n  display: block;\n  margin-left: 93.75px;\n  margin-top: 32.625px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.25s;\n          animation-delay: 0.25s;\n}\nhex-a-gon:nth-of-type(29) {\n  display: block;\n  margin-left: -75px;\n  margin-top: 65.25px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0s;\n          animation-delay: 0s;\n}\nhex-a-gon:nth-of-type(30) {\n  display: block;\n  margin-left: -37.5px;\n  margin-top: 65.25px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.05s;\n          animation-delay: 0.05s;\n}\nhex-a-gon:nth-of-type(31) {\n  display: block;\n  margin-left: 0px;\n  margin-top: 65.25px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.1s;\n          animation-delay: 0.1s;\n}\nhex-a-gon:nth-of-type(32) {\n  display: block;\n  margin-left: 37.5px;\n  margin-top: 65.25px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.15s;\n          animation-delay: 0.15s;\n}\nhex-a-gon:nth-of-type(33) {\n  display: block;\n  margin-left: 75px;\n  margin-top: 65.25px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.2s;\n          animation-delay: 0.2s;\n}\nhex-a-gon:nth-of-type(34) {\n  display: block;\n  margin-left: -56.25px;\n  margin-top: 97.875px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0s;\n          animation-delay: 0s;\n}\nhex-a-gon:nth-of-type(35) {\n  display: block;\n  margin-left: -18.75px;\n  margin-top: 97.875px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.05s;\n          animation-delay: 0.05s;\n}\nhex-a-gon:nth-of-type(36) {\n  display: block;\n  margin-left: 18.75px;\n  margin-top: 97.875px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.1s;\n          animation-delay: 0.1s;\n}\nhex-a-gon:nth-of-type(37) {\n  display: block;\n  margin-left: 56.25px;\n  margin-top: 97.875px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.15s;\n          animation-delay: 0.15s;\n}\n\n@-webkit-keyframes scaleIt {\n  25%,100% {\n    -webkit-transform: scale(1) translate(-50%, -50%);\n            transform: scale(1) translate(-50%, -50%);\n  }\n  50% {\n    -webkit-transform: scale(0) translate(-50%, -50%);\n            transform: scale(0) translate(-50%, -50%);\n  }\n}\n\n@keyframes scaleIt {\n  25%,100% {\n    -webkit-transform: scale(1) translate(-50%, -50%);\n            transform: scale(1) translate(-50%, -50%);\n  }\n  50% {\n    -webkit-transform: scale(0) translate(-50%, -50%);\n            transform: scale(0) translate(-50%, -50%);\n  }\n}</style>\n<div>\n    <template is="dom-repeat" items="[[items]]">\n        <hex-a-gon></hex-a-gon>\n    </template>\n</div>'
    ]);
    _templateObject_7fb49a20f1e411e8938f6d1f8705187c = function _templateObject_7fb49a20f1e411e8938f6d1f8705187c() {
      return data;
    };
    return data;
  }
  var HexagonLoader = (function(_PolymerElement) {
    babelHelpers.inherits(HexagonLoader, _PolymerElement);
    function HexagonLoader() {
      babelHelpers.classCallCheck(this, HexagonLoader);
      return babelHelpers.possibleConstructorReturn(
        this,
        babelHelpers.getPrototypeOf(HexagonLoader).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      HexagonLoader,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                babelHelpers.getPrototypeOf(HexagonLoader.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            for (var items = [], i = 0; i < this.itemCount; i++) {
              items.push("");
            }
            this.set("items", items);
          }
        },
        {
          key: "_colorChanged",
          value: function _colorChanged(newValue, oldValue) {
            if (newValue) {
              this.updateStyles({ "--hexagon-color": newValue });
            }
          }
        }
      ],
      [
        {
          key: "template",
          get: function get() {
            return (0, _polymerElement.html)(
              _templateObject_7fb49a20f1e411e8938f6d1f8705187c()
            );
          }
        },
        {
          key: "properties",
          get: function get() {
            return {
              color: {
                name: "color",
                type: "String",
                observer: "_colorChanged",
                reflectToAttribute: !0
              },
              size: { name: "size", type: "String", reflectToAttribute: !0 },
              loading: { name: "loading", type: "Boolean" },
              itemCount: { name: "itemCount", type: "Number", value: 37 }
            };
          }
        },
        {
          key: "tag",
          get: function get() {
            return "hexagon-loader";
          }
        }
      ]
    );
    return HexagonLoader;
  })(_polymerElement.PolymerElement);
  _exports.HexagonLoader = HexagonLoader;
  window.customElements.define(HexagonLoader.tag, HexagonLoader);
});
