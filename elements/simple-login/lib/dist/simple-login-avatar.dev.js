"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleLoginAvatar = void 0;

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === "function" &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? "symbol"
        : typeof obj;
    };
  }
  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return self;
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true },
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;
  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;
    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }
    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);
      _cache.set(Class, Wrapper);
    }
    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }
    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true,
      },
    });
    return _setPrototypeOf(Wrapper, Class);
  };
  return _wrapNativeSuper(Class);
}

function isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }
  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

/**
 * `simple-login-avatar`
 * @element simple-login-avatar
 * Inspiration from https://clicknathan.com/web-design/css-avatar-icons/
 */
var SimpleLoginAvatar =
  /*#__PURE__*/
  (function (_HTMLElement) {
    _inherits(SimpleLoginAvatar, _HTMLElement);

    _createClass(SimpleLoginAvatar, null, [
      {
        key: "tag",
        get: function get() {
          return "simple-login-avatar";
        },
        /**
         * life cycle
         */
      },
    ]);

    function SimpleLoginAvatar() {
      var _this;

      var delayRender =
        arguments.length > 0 && arguments[0] !== undefined
          ? arguments[0]
          : false;

      _classCallCheck(this, SimpleLoginAvatar);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimpleLoginAvatar).call(this)
      );
      _this.tag = SimpleLoginAvatar.tag;
      _this.template = document.createElement("template");

      _this.attachShadow({
        mode: "open",
      });

      if (!delayRender) {
        _this.render();
      }

      return _this;
    }

    _createClass(SimpleLoginAvatar, [
      {
        key: "connectedCallback",
        value: function connectedCallback() {
          if (window.ShadyCSS) {
            window.ShadyCSS.styleElement(this);
          }
        },
      },
      {
        key: "_copyAttribute",
        value: function _copyAttribute(name, to) {
          var recipients = this.shadowRoot.querySelectorAll(to);
          var value = this.getAttribute(name);
          var fname = value == null ? "removeAttribute" : "setAttribute";
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (
              var _iterator = recipients[Symbol.iterator](), _step;
              !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
              _iteratorNormalCompletion = true
            ) {
              var node = _step.value;
              node[fname](name, value);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                _iterator["return"]();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        },
      },
      {
        key: "render",
        value: function render() {
          this.shadowRoot.innerHTML = null;
          this.template.innerHTML = this.html;

          if (window.ShadyCSS) {
            window.ShadyCSS.prepareTemplate(this.template, this.tag);
          }

          this.shadowRoot.appendChild(this.template.content.cloneNode(true));
        },
      },
      {
        key: "html",
        get: function get() {
          return '\n    <style>\n      :host {\n        margin: 0;\n        display: block;\n        @apply --simple-login-avatar;\n      }\n      :host([hidden]){ \n        display: none;\n      } \n      #svg {\n        position: absolute;\n        left: 0;\n        top: 0;\n        bottom: 0;\n        right: 0;\n        fill: var(--simple-login-avatar-background, white);\n      }\n      .avatar {\n        position:relative;\n        margin: 0 auto;\n        display: block;\n        overflow: hidden;\n        text-decoration: none;\n        line-height: 240%;\n        color: var(--simple-login-avatar-background, white);\n        background: var(--simple-login-avatar-color, #36bed4);\n        border-radius: var(--simple-login-avatar-border-radius, 100%);\n      } \n    </style>\n    <div class="avatar">\n      <svg id="svg" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block;"><g><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></g></svg>\n      <slot></slot>\n    </div>';
        },
      },
    ]);

    return SimpleLoginAvatar;
  })(_wrapNativeSuper(HTMLElement));

exports.SimpleLoginAvatar = SimpleLoginAvatar;
window.customElements.define(SimpleLoginAvatar.tag, SimpleLoginAvatar);
