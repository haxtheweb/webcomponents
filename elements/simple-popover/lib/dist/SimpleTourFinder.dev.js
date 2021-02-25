"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleTourFinder = void 0;

var _simpleTour = require("@lrnwebcomponents/simple-popover/lib/simple-tour.js");

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

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(receiver);
      }
      return desc.value;
    };
  }
  return _get(target, property, receiver || target);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
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

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}

var SimpleTourFinder = function SimpleTourFinder(SuperClass) {
  return (
    /*#__PURE__*/
    (function (_SuperClass) {
      _inherits(_class, _SuperClass);

      function _class() {
        var _this;

        _classCallCheck(this, _class);

        _this = _possibleConstructorReturn(
          this,
          _getPrototypeOf(_class).call(this)
        );
        _this.tourName = "default";
        return _this;
      }
      /**
       * Called every time the element is inserted into the DOM. Useful for
       * running setup code, such as fetching resources or rendering.
       * Generally, you should try to delay work until this time.
       */

      _createClass(_class, [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            if (
              _get(_getPrototypeOf(_class.prototype), "connectedCallback", this)
            ) {
              _get(
                _getPrototypeOf(_class.prototype),
                "connectedCallback",
                this
              ).call(this);
            }

            if (
              !_get(_getPrototypeOf(_class.prototype), "firstUpdated", this)
            ) {
              this.discoverSimpleTourStops();
            }
          },
          /**
           * Called every time the element is removed from the DOM. Useful for
           * running clean up code (removing event listeners, etc.).
           */
        },
        {
          key: "disconnectedCallback",
          value: function disconnectedCallback() {
            // @todo make sure we remove the items from the tour if the
            // element they are related to gets removed from the page
            _get(
              _getPrototypeOf(_class.prototype),
              "disconnectedCallback",
              this
            ).call(this);
          },
          /**
           * LitElement ready life cycle
           */
        },
        {
          key: "firstUpdated",
          value: function firstUpdated(changedProperties) {
            if (_get(_getPrototypeOf(_class.prototype), "firstUpdated", this)) {
              _get(
                _getPrototypeOf(_class.prototype),
                "firstUpdated",
                this
              ).call(this, changedProperties);
            }

            this.discoverSimpleTourStops();
          }, // find all items and automatically register with the tour
        },
        {
          key: "discoverSimpleTourStops",
          value: function discoverSimpleTourStops() {
            var _this2 = this;

            var items = this.shadowRoot.querySelectorAll(
              "[data-simple-tour-stop]"
            );
            items.forEach(function (el) {
              try {
                // cascade title selection so it can be an already established attribute
                var title = "";

                if (
                  el.getAttribute("data-stop-title") &&
                  el.getAttribute(el.getAttribute("data-stop-title"))
                ) {
                  title = el.getAttribute(el.getAttribute("data-stop-title"));
                } else if (el.querySelector("[data-stop-title]")) {
                  title = el.querySelector("[data-stop-title]").innerHTML;
                }

                var content = el.querySelector("[data-stop-content]").innerHTML
                  ? el.querySelector("[data-stop-content]").innerHTML
                  : "";

                _simpleTour.SimpleTourManager.createTourStop(
                  _this2.tourName,
                  el,
                  title,
                  content
                );
              } catch (e) {
                console.warn(e);
              }
            });
          },
        },
      ]);

      return _class;
    })(SuperClass)
  );
};

exports.SimpleTourFinder = SimpleTourFinder;
