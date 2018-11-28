define(["exports"], function(_exports) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.Hexagon = void 0;
  var Hexagon = (function(_HTMLElement) {
    babelHelpers.inherits(Hexagon, _HTMLElement);
    babelHelpers.createClass(
      Hexagon,
      [
        {
          key: "html",
          get: function get() {
            return "\n<style>\n:host {\n  display: inline-flex;\n  position: relative;\n  height: 36px;\n  width: 36px;\n}\n\n:host div,\n:host div:before,\n:host div:after {\n background-color: var(--hexagon-color, orange);\n}\n\ndiv {\n  width: 30px;\n  height: 18px;\n  margin: 9px 3px;\n  position: absolute;\n  color: var(--hexagon-color, orange);\n}\ndiv:before, div:after {\n  content: '';\n  position: absolute;\n  width: 30px;\n  height: 18px;\n}\ndiv:before {\n  -webkit-transform: rotate(60deg);\n          transform: rotate(60deg);\n}\ndiv:after {\n  -webkit-transform: rotate(-60deg);\n          transform: rotate(-60deg);\n}\n</style>\n    <div></div>";
          }
        }
      ],
      [
        {
          key: "tag",
          get: function get() {
            return "hex-a-gon";
          }
        }
      ]
    );
    function Hexagon() {
      var _this,
        delayRender =
          0 < arguments.length && arguments[0] !== void 0 ? arguments[0] : !1;
      babelHelpers.classCallCheck(this, Hexagon);
      _this = babelHelpers.possibleConstructorReturn(
        this,
        babelHelpers.getPrototypeOf(Hexagon).call(this)
      );
      _this.tag = Hexagon.tag;
      _this._queue = [];
      _this.template = document.createElement("template");
      _this.attachShadow({ mode: "open" });
      if (!delayRender) {
        _this.render();
      }
      return _this;
    }
    babelHelpers.createClass(Hexagon, [
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
    return Hexagon;
  })(babelHelpers.wrapNativeSuper(HTMLElement));
  _exports.Hexagon = Hexagon;
  window.customElements.define(Hexagon.tag, Hexagon);
});
