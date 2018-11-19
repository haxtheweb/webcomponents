define(["exports", "./lib/hex-a-gon.js"], function(_exports) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.HexagonLoader = void 0;
  var HexagonLoader = (function(_HTMLElement) {
    babelHelpers.inherits(HexagonLoader, _HTMLElement);
    babelHelpers.createClass(
      HexagonLoader,
      [
        {
          key: "html",
          get: function get() {
            return '\n<style>:host {\n  display: block;\n   --hexagon-loader-color: orange;\n}\n\n:host([hidden]) {\n  display: none;\n}\n\n.loader {\n  position: relative;\n  width: 255px;\n  height: 232.5px;\n  margin: 0 auto;\n}\n\nhex-a-gon:nth-of-type(1) {\n  display: block;\n  margin-left: -56.25px;\n  margin-top: -97.875px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0s;\n          animation-delay: 0s;\n}\nhex-a-gon:nth-of-type(2) {\n  display: block;\n  margin-left: -18.75px;\n  margin-top: -97.875px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.05s;\n          animation-delay: 0.05s;\n}\nhex-a-gon:nth-of-type(3) {\n  display: block;\n  margin-left: 18.75px;\n  margin-top: -97.875px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.1s;\n          animation-delay: 0.1s;\n}\nhex-a-gon:nth-of-type(4) {\n  display: block;\n  margin-left: 56.25px;\n  margin-top: -97.875px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.15s;\n          animation-delay: 0.15s;\n}\nhex-a-gon:nth-of-type(5) {\n  display: block;\n  margin-left: -75px;\n  margin-top: -65.25px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0s;\n          animation-delay: 0s;\n}\nhex-a-gon:nth-of-type(6) {\n  display: block;\n  margin-left: -37.5px;\n  margin-top: -65.25px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.05s;\n          animation-delay: 0.05s;\n}\nhex-a-gon:nth-of-type(7) {\n  display: block;\n  margin-left: 0px;\n  margin-top: -65.25px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.1s;\n          animation-delay: 0.1s;\n}\nhex-a-gon:nth-of-type(8) {\n  display: block;\n  margin-left: 37.5px;\n  margin-top: -65.25px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.15s;\n          animation-delay: 0.15s;\n}\nhex-a-gon:nth-of-type(9) {\n  display: block;\n  margin-left: 75px;\n  margin-top: -65.25px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.2s;\n          animation-delay: 0.2s;\n}\nhex-a-gon:nth-of-type(10) {\n  display: block;\n  margin-left: -93.75px;\n  margin-top: -32.625px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0s;\n          animation-delay: 0s;\n}\nhex-a-gon:nth-of-type(11) {\n  display: block;\n  margin-left: -56.25px;\n  margin-top: -32.625px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.05s;\n          animation-delay: 0.05s;\n}\nhex-a-gon:nth-of-type(12) {\n  display: block;\n  margin-left: -18.75px;\n  margin-top: -32.625px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.1s;\n          animation-delay: 0.1s;\n}\nhex-a-gon:nth-of-type(13) {\n  display: block;\n  margin-left: 18.75px;\n  margin-top: -32.625px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.15s;\n          animation-delay: 0.15s;\n}\nhex-a-gon:nth-of-type(14) {\n  display: block;\n  margin-left: 56.25px;\n  margin-top: -32.625px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.2s;\n          animation-delay: 0.2s;\n}\nhex-a-gon:nth-of-type(15) {\n  display: block;\n  margin-left: 93.75px;\n  margin-top: -32.625px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.25s;\n          animation-delay: 0.25s;\n}\nhex-a-gon:nth-of-type(16) {\n  display: block;\n  margin-left: -112.5px;\n  margin-top: 0px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0s;\n          animation-delay: 0s;\n}\nhex-a-gon:nth-of-type(17) {\n  display: block;\n  margin-left: -75px;\n  margin-top: 0px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.05s;\n          animation-delay: 0.05s;\n}\nhex-a-gon:nth-of-type(18) {\n  display: block;\n  margin-left: -37.5px;\n  margin-top: 0px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.1s;\n          animation-delay: 0.1s;\n}\nhex-a-gon:nth-of-type(19) {\n  display: block;\n  margin-left: 0px;\n  margin-top: 0px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.15s;\n          animation-delay: 0.15s;\n}\nhex-a-gon:nth-of-type(20) {\n  display: block;\n  margin-left: 37.5px;\n  margin-top: 0px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.2s;\n          animation-delay: 0.2s;\n}\nhex-a-gon:nth-of-type(21) {\n  display: block;\n  margin-left: 75px;\n  margin-top: 0px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.25s;\n          animation-delay: 0.25s;\n}\nhex-a-gon:nth-of-type(22) {\n  display: block;\n  margin-left: 112.5px;\n  margin-top: 0px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.3s;\n          animation-delay: 0.3s;\n}\nhex-a-gon:nth-of-type(23) {\n  display: block;\n  margin-left: -93.75px;\n  margin-top: 32.625px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0s;\n          animation-delay: 0s;\n}\nhex-a-gon:nth-of-type(24) {\n  display: block;\n  margin-left: -56.25px;\n  margin-top: 32.625px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.05s;\n          animation-delay: 0.05s;\n}\nhex-a-gon:nth-of-type(25) {\n  display: block;\n  margin-left: -18.75px;\n  margin-top: 32.625px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.1s;\n          animation-delay: 0.1s;\n}\nhex-a-gon:nth-of-type(26) {\n  display: block;\n  margin-left: 18.75px;\n  margin-top: 32.625px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.15s;\n          animation-delay: 0.15s;\n}\nhex-a-gon:nth-of-type(27) {\n  display: block;\n  margin-left: 56.25px;\n  margin-top: 32.625px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.2s;\n          animation-delay: 0.2s;\n}\nhex-a-gon:nth-of-type(28) {\n  display: block;\n  margin-left: 93.75px;\n  margin-top: 32.625px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.25s;\n          animation-delay: 0.25s;\n}\nhex-a-gon:nth-of-type(29) {\n  display: block;\n  margin-left: -75px;\n  margin-top: 65.25px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0s;\n          animation-delay: 0s;\n}\nhex-a-gon:nth-of-type(30) {\n  display: block;\n  margin-left: -37.5px;\n  margin-top: 65.25px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.05s;\n          animation-delay: 0.05s;\n}\nhex-a-gon:nth-of-type(31) {\n  display: block;\n  margin-left: 0px;\n  margin-top: 65.25px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.1s;\n          animation-delay: 0.1s;\n}\nhex-a-gon:nth-of-type(32) {\n  display: block;\n  margin-left: 37.5px;\n  margin-top: 65.25px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.15s;\n          animation-delay: 0.15s;\n}\nhex-a-gon:nth-of-type(33) {\n  display: block;\n  margin-left: 75px;\n  margin-top: 65.25px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.2s;\n          animation-delay: 0.2s;\n}\nhex-a-gon:nth-of-type(34) {\n  display: block;\n  margin-left: -56.25px;\n  margin-top: 97.875px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0s;\n          animation-delay: 0s;\n}\nhex-a-gon:nth-of-type(35) {\n  display: block;\n  margin-left: -18.75px;\n  margin-top: 97.875px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.05s;\n          animation-delay: 0.05s;\n}\nhex-a-gon:nth-of-type(36) {\n  display: block;\n  margin-left: 18.75px;\n  margin-top: 97.875px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.1s;\n          animation-delay: 0.1s;\n}\nhex-a-gon:nth-of-type(37) {\n  display: block;\n  margin-left: 56.25px;\n  margin-top: 97.875px;\n  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;\n          animation: scaleIt 1.5s ease-in-out infinite both;\n  -webkit-animation-delay: 0.15s;\n          animation-delay: 0.15s;\n}\n\n@-webkit-keyframes scaleIt {\n  25%,100% {\n    -webkit-transform: scale(1) translate(-50%, -50%);\n            transform: scale(1) translate(-50%, -50%);\n  }\n  50% {\n    -webkit-transform: scale(0) translate(-50%, -50%);\n            transform: scale(0) translate(-50%, -50%);\n  }\n}\n\n@keyframes scaleIt {\n  25%,100% {\n    -webkit-transform: scale(1) translate(-50%, -50%);\n            transform: scale(1) translate(-50%, -50%);\n  }\n  50% {\n    -webkit-transform: scale(0) translate(-50%, -50%);\n            transform: scale(0) translate(-50%, -50%);\n  }\n}</style>\n<div class="loader">\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n    <hex-a-gon></hex-a-gon>\n</div>';
          }
        }
      ],
      [
        {
          key: "properties",
          get: function get() {
            return {
              color: { name: "color", type: "String", value: "orange" },
              size: { name: "size", type: "String", value: "medium" }
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
    function HexagonLoader() {
      var _this,
        delayRender =
          0 < arguments.length && arguments[0] !== void 0 ? arguments[0] : !1;
      babelHelpers.classCallCheck(this, HexagonLoader);
      _this = babelHelpers.possibleConstructorReturn(
        this,
        (HexagonLoader.__proto__ || Object.getPrototypeOf(HexagonLoader)).call(
          this
        )
      );
      _this.tag = HexagonLoader.tag;
      var obj = HexagonLoader.properties;
      for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
          if (_this.hasAttribute(p)) {
            _this[p] = _this.getAttribute(p);
          } else {
            _this.setAttribute(p, obj[p].value);
            _this[p] = obj[p].value;
          }
        }
      }
      _this._queue = [];
      _this.template = document.createElement("template");
      _this.attachShadow({ mode: "open" });
      if (!delayRender) {
        _this.render();
      }
      return _this;
    }
    babelHelpers.createClass(HexagonLoader, [
      {
        key: "connectedCallback",
        value: function connectedCallback() {
          if (window.ShadyCSS) {
            window.ShadyCSS.styleElement(this);
          }
          if (this._queue.length) {
            this._processQueue();
          }
        }
      },
      {
        key: "_copyAttribute",
        value: function _copyAttribute(name, to) {
          var recipients = this.shadowRoot.querySelectorAll(to),
            value = this.getAttribute(name),
            fname = null == value ? "removeAttribute" : "setAttribute",
            _iteratorNormalCompletion = !0,
            _didIteratorError = !1,
            _iteratorError = void 0;
          try {
            for (
              var _iterator = recipients[Symbol.iterator](), _step, node;
              !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
              _iteratorNormalCompletion = !0
            ) {
              node = _step.value;
              node[fname](name, value);
            }
          } catch (err) {
            _didIteratorError = !0;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && null != _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
      },
      {
        key: "_queueAction",
        value: function _queueAction(action) {
          this._queue.push(action);
        }
      },
      {
        key: "_processQueue",
        value: function _processQueue() {
          var _this2 = this;
          this._queue.forEach(function(action) {
            _this2["_".concat(action.type)](action.data);
          });
          this._queue = [];
        }
      },
      {
        key: "_setProperty",
        value: function _setProperty(_ref) {
          var name = _ref.name,
            value = _ref.value;
          this[name] = value;
        }
      },
      {
        key: "render",
        value: function render() {
          this.shadowRoot.innerHTML = null;
          this.template.innerHTML = this.html;
          if (window.ShadyCSS) {
            window.ShadyCSS.prepareTemplate(this.template, this.tag);
          }
          this.shadowRoot.appendChild(this.template.content.cloneNode(!0));
        }
      }
    ]);
    return HexagonLoader;
  })(HTMLElement);
  _exports.HexagonLoader = HexagonLoader;
  window.customElements.define(HexagonLoader.tag, HexagonLoader);
});
