"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleCameraSnap = void 0;

require("./simple-login-avatar.js");

require("./simple-login-camera.js");

require("@lrnwebcomponents/simple-icon/simple-icon.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icons.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js");

require("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");

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

var SimpleCameraSnap =
  /*#__PURE__*/
  (function (_HTMLElement) {
    _inherits(SimpleCameraSnap, _HTMLElement);

    function SimpleCameraSnap() {
      var _this;

      var delayRender =
        arguments.length > 0 && arguments[0] !== undefined
          ? arguments[0]
          : false;

      _classCallCheck(this, SimpleCameraSnap);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimpleCameraSnap).call(this)
      );
      _this.tag = SimpleCameraSnap.tag;
      _this.template = document.createElement("template");

      _this.attachShadow({
        mode: "open",
      });

      if (!delayRender) {
        _this.render();
      }

      return _this;
    }

    _createClass(
      SimpleCameraSnap,
      [
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
          key: "connectedCallback",
          value: function connectedCallback() {
            // ensure support for the camera snap functionality...
            // this would be an environment like http that doesn't support camera functionality
            if (!navigator.mediaDevices) {
              this.shadowRoot.querySelector("#snap").style.display = "none";
            }

            this.shadowRoot
              .querySelector("#snap")
              .addEventListener("click", this.snapPhoto.bind(this));
          },
        },
        {
          key: "disconnectedCallback",
          value: function disconnectedCallback() {
            this.shadowRoot
              .querySelector("#snap")
              .removeEventListener("click", this.snapPhoto.bind(this));
          },
        },
        {
          key: "snapPhoto",
          value: function snapPhoto(e) {
            var camera, raw, img, selfie;
            return regeneratorRuntime.async(
              function snapPhoto$(_context) {
                while (1) {
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      camera = this.shadowRoot.querySelector("#camera");

                      if (!camera.hasAttribute("autoplay")) {
                        _context.next = 16;
                        break;
                      }

                      _context.next = 4;
                      return regeneratorRuntime.awrap(camera.takeASnap());

                    case 4:
                      raw = _context.sent;
                      _context.next = 7;
                      return regeneratorRuntime.awrap(
                        camera.takeASnap().then(camera.renderImage)
                      );

                    case 7:
                      img = _context.sent;
                      camera.removeAttribute("autoplay");
                      selfie = this.shadowRoot.querySelector("#selfie");
                      selfie.innerHTML = "";
                      selfie.appendChild(img); // throw up event for other things to find the image

                      this.dispatchEvent(
                        new CustomEvent("simple-camera-snap-image", {
                          bubbles: true,
                          composed: true,
                          cancelable: true,
                          detail: {
                            img: img,
                            raw: raw,
                          },
                        })
                      );
                      selfie.classList.add("has-snap");
                      _context.next = 17;
                      break;

                    case 16:
                      this.clearPhoto(e);

                    case 17:
                    case "end":
                      return _context.stop();
                  }
                }
              },
              null,
              this
            );
          },
        },
        {
          key: "clearPhoto",
          value: function clearPhoto(e) {
            var camera = this.shadowRoot.querySelector("#camera");
            camera.setAttribute("autoplay", "autoplay");
            var selfie = this.shadowRoot.querySelector("#selfie");
            selfie.innerHTML = "";
            selfie.classList.remove("has-snap");
          },
        },
        {
          key: "html",
          get: function get() {
            return '\n    <style>\n      :host {\n        display: flex;\n        align-items: center;\n        justify-content: space-between;\n        flex-direction: column;\n        /* style simple-login-camera according to simple-login-snap styles */\n        --simple-login-camera-background: var(--simple-camera-snap-color, #36bed4);\n        --simple-login-camera-error: var(--simple-camera-snap-error, red);\n        --simple-login-avatar-color: var(--simple-camera-snap-color, #36bed4);\n        --simple-login-camera-size: var(--simple-camera-snap-height, calc(var(--simple-camera-snap-width, unset) * 16/9));\n\n        /* style simple-login-avatar according to simple-login-snap styles */\n        --simple-login-avatar-background: var(--simple-camera-snap-background, white);\n        --simple-login-avatar-border-radius: var(--simple-camera-snap-border-radius,100%);\n      }\n      :host([hidden]) {\n        display: none !important;\n      }\n      #selfie {\n        position: absolute;\n        margin: 0;\n        display: flex;\n        justify-content: center;\n      }\n      #snap {\n        color: var(--simple-camera-snap-color, #36bed4);\n        background-color: var(--simple-camera-snap-background, white);\n        border-radius: var(--simple-camera-snap-button-border-radius);\n        opacity: var(--simple-camera-snap-button-opacity);\n\n      }\n      .has-snap {\n        z-index: 3;\n      }\n      #selfie img {\n        z-index: 2;\n        position: absolute;\n      }\n      .buttons {\n        display: flex;\n        width: 100%;\n        justify-content: space-around;\n        position: var(--simple-camera-snap-button-container-position);\n        bottom: var(--simple-camera-snap-button-container-bottom);\n        z-index: var(--simple-camera-snap-button-container-z-index);\n      }\n    </style>\n    <simple-login-avatar part="avatar">\n      <div id="selfie" part="selfie"></div>\n      <simple-login-camera id="camera" autoplay part="camera"></simple-login-camera>\n    </simple-login-avatar>\n    <div class="buttons">\n      <simple-icon-button-lite id="snap" icon="image:camera-alt" part="snap-button"></simple-icon-button-lite>\n      <simple-tooltip for="snap" part="snap-tooltip">Take Photo</simple-tooltip>\n    </div>\n    ';
          },
        },
      ],
      [
        {
          key: "tag",
          get: function get() {
            return "simple-camera-snap";
          },
        },
      ]
    );

    return SimpleCameraSnap;
  })(_wrapNativeSuper(HTMLElement));

exports.SimpleCameraSnap = SimpleCameraSnap;
window.customElements.define(SimpleCameraSnap.tag, SimpleCameraSnap);
