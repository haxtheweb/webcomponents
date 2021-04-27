"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.AbsolutePositionBehavior = exports.AbsolutePositionBehaviorClass = void 0;

var _litElement = require("lit-element/lit-element.js");

require("./lib/absolute-position-state-manager.js");

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

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}

/**
 * @customElement
 * @class
 */
var AbsolutePositionBehaviorClass = function AbsolutePositionBehaviorClass(
  SuperClass
) {
  return (
    /*#__PURE__*/
    (function (_SuperClass) {
      _inherits(_class, _SuperClass);

      _createClass(_class, null, [
        {
          key: "tag",

          /* REQUIRED FOR TOOLING DO NOT TOUCH */

          /**
           * Store tag name to make it easier to obtain directly.
           * @notice function name must be here for tooling to operate correctly
           */
          get: function get() {
            return "absolute-position-behavior";
          },
        },
      ]);

      function _class() {
        var _this;

        _classCallCheck(this, _class);

        _this = _possibleConstructorReturn(
          this,
          _getPrototypeOf(_class).call(this)
        );
        _this.auto = false;
        _this.fitToVisibleBounds = false;
        _this["for"] = null;
        _this.offset = 0;
        _this.position = "bottom";
        _this.target = null;
        _this.__positions = {};
        _this.__observe = false;
        _this.__manager = window.AbsolutePositionStateManager.requestAvailability();
        return _this;
      }

      _createClass(_class, [
        {
          key: "updated",
          value: function updated(changedProperties) {
            var _this2 = this;

            changedProperties.forEach(function (oldValue, propName) {
              if (propName === "auto" && _this2.auto) _this2.setPosition();
              if (propName === "auto" && !_this2.auto) _this2.unsetPosition();
              if (propName === "fitToVisibleBounds") _this2.updatePosition();
              if (propName === "for") _this2.updatePosition();
              if (propName === "offset") _this2.updatePosition();
              if (propName === "position") _this2.updatePosition();
              if (propName === "justify") _this2.updatePosition();
              if (propName === "positionAlign") _this2.updatePosition();
              if (propName === "target") _this2.updatePosition();
              if (propName === "hidden") _this2.updatePosition();
            });
          },
          /**
           * Registers element with AbsolutePositionStateManager
           * @returns {void}
           */
        },
        {
          key: "setPosition",
          value: function setPosition() {
            this.__observe = true;

            this.__manager.loadElement(this);
          },
          /**
           * Unregisters element with AbsolutePositionStateManager
           * @returns {void}
           */
        },
        {
          key: "unsetPosition",
          value: function unsetPosition() {
            this.__observe = false;

            this.__manager.unloadElement(this);
          },
          /**
           * Updates  element's position
           * @returns {void}
           */
        },
        {
          key: "updatePosition",
          value: function updatePosition() {
            if (this.__observe === true) {
              this.__manager.positionElement(this);
            }
          },
          /**
           * life cycle, element is removed from DOM
           * @returns {void}
           */
        },
        {
          key: "disconnectedCallback",
          value: function disconnectedCallback() {
            this.unsetPosition();

            _get(
              _getPrototypeOf(_class.prototype),
              "disconnectedCallback",
              this
            ).call(this);
          },
        },
      ]);

      return _class;
    })(SuperClass)
  );
};
/**
 * `absolute-position-behavior`
 * abstracts absolute positioning behavior to be resusable in other elements
 * @demo ./demo/index.html
 * @element absolute-position-behavior
 */

exports.AbsolutePositionBehaviorClass = AbsolutePositionBehaviorClass;

var AbsolutePositionBehavior =
  /*#__PURE__*/
  (function (_AbsolutePositionBeha) {
    _inherits(AbsolutePositionBehavior, _AbsolutePositionBeha);

    function AbsolutePositionBehavior() {
      _classCallCheck(this, AbsolutePositionBehavior);

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(AbsolutePositionBehavior).apply(this, arguments)
      );
    }

    return AbsolutePositionBehavior;
  })(AbsolutePositionBehaviorClass(_litElement.LitElement));

exports.AbsolutePositionBehavior = AbsolutePositionBehavior;
window.customElements.define(
  AbsolutePositionBehavior.tag,
  AbsolutePositionBehavior
);
