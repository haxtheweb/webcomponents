"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.AbsolutePositionStateManager = void 0;

var _litElement = require("lit");

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

// register globally so we can make sure there is only one
window.AbsolutePositionStateManager = window.AbsolutePositionStateManager || {}; // request if this exists. This helps invoke element existing in dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through same modal

window.AbsolutePositionStateManager.requestAvailability = function () {
  if (!window.AbsolutePositionStateManager.instance) {
    window.AbsolutePositionStateManager.instance = document.createElement(
      "absolute-position-state-manager"
    );
    var instance = window.AbsolutePositionStateManager.instance;
    document.body.appendChild(instance);
  }

  return window.AbsolutePositionStateManager.instance;
};
/**
 * `absolute-position-state-manager`
 * manages state of multiple absolute-positioned elements on a page
 *
 * @element absolute-position-state-manager
 */

var AbsolutePositionStateManager =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(AbsolutePositionStateManager, _LitElement);

    _createClass(AbsolutePositionStateManager, null, [
      {
        key: "tag",

        /**
         * Store tag name to make it easier to obtain directly.
         */
        get: function get() {
          return "absolute-position-state-manager";
        }, // properties available to custom element for data binding
      },
      {
        key: "properties",
        get: function get() {
          return {
            /**
             * Stores an array of all elements using manager.
             */
            elements: {
              type: Array,
            },

            /**
             * mutation observer
             */
            __observer: {
              type: Object,
            },

            /**
             * resize timeout
             */
            __timeout: {
              type: Object,
            },
          };
        },
        /**
         * Makes sure there is a utility ready and listening for elements.
         */
      },
    ]);

    function AbsolutePositionStateManager() {
      var _this;

      _classCallCheck(this, AbsolutePositionStateManager);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(AbsolutePositionStateManager).call(this)
      );
      _this.elements = [];
      _this.__timeout = false;
      _this.__observer = new MutationObserver(function (mutations) {
        return _this.checkMutations(mutations);
      });
      return _this;
    }
    /**
     * Loads element into array
     * @param {object} element to be added
     */

    _createClass(AbsolutePositionStateManager, [
      {
        key: "loadElement",
        value: function loadElement(el) {
          //only have event listeners when there are elements using manager
          if (this.elements.length < 1) {
            this.__observer.observe(document, {
              attributes: true,
              childList: true,
              subtree: true,
              characterData: true,
            });

            this.updateElements();
            document.addEventListener("load", this.updateElements);
            window.addEventListener("resize", this._handleResize);
          }

          this.elements.push(el);
          el.style.top = 0;
          el.style.left = 0;
          this.positionElement(el);
        },
        /**
         * Unloads element from array
         * @param {object} element to be removed
         */
      },
      {
        key: "unloadElement",
        value: function unloadElement(el) {
          this.elements.filter(function (element) {
            return element === el;
          });
          if (this.elements.length < 1) this.removeEventListeners();
        },
        /**
         * handles resize event
         */
      },
      {
        key: "_handleResize",
        value: function _handleResize() {
          if (this.__timeout) clearTimeout(this.__timeout);
          this.__timeout = setTimeout(
            window.AbsolutePositionStateManager.instance.updateElements(),
            250
          );
        },
        /**
         * Checks if there are any chances other than to
         * element's position and updates accordioning.
         * This is needed so that positioning elements
         * doesn't trigger an infinite loop of updates.
         *
         * @param {array} mutation records
         * @return {void}
         */
      },
      {
        key: "checkMutations",
        value: function checkMutations(mutations) {
          var _this2 = this;

          var update = false;
          mutations.forEach(function (mutation) {
            if (update) return;
            update =
              update ||
              !(
                mutation.type === "attributes" &&
                mutation.attributeName === "style" &&
                _this2.elements.includes(mutation.target)
              );
          });
          if (update) this.updateElements();
        },
        /**
         * Returns target element that this element is anchored to. It is
         * either element given by `for` attribute, or immediate parent
         * of element.
         *
         * Uses `target` object if specified.
         * If not, queries document for elements with id specified in `for` attribute.
         * If there is more than one element that matches, gets closest matching element.
         *
         * @param {object} element using absolute-position behavior
         * @return {object} target element for positioning
         */
      },
      {
        key: "findTarget",
        value: function findTarget(el) {
          var selector = "#" + el["for"],
            target = el.target,
            ancestor = el;

          while (
            !!el["for"] &&
            !target &&
            !!ancestor &&
            !!ancestor.parentNode &&
            ancestor !== document
          ) {
            ancestor = ancestor.parentNode;
            target = ancestor ? ancestor.querySelector(selector) : undefined;
            if (ancestor.nodeType === 11) ancestor = ancestor.host;
            target =
              !target && ancestor ? ancestor.querySelector(selector) : target;
          }

          return target;
        },
        /**
         * Removes event listeners
         * @return {void}
         */
      },
      {
        key: "removeEventListeners",
        value: function removeEventListeners() {
          if (this.__observer && this.__observer.disconnect)
            this.__observer.disconnect();
          document.removeEventListener("load", this.updateElements);
          window.removeEventListener("resize", this._handleResize);
        },
        /**
         * Updates position for all elements on page.
         * @return {void}
         */
      },
      {
        key: "updateElements",
        value: function updateElements() {
          var _this3 = this;

          this.elements.forEach(function (element) {
            return _this3.positionElement(element);
          });
        },
      },
      {
        key: "_getParentNode",
        value: function _getParentNode(node) {
          var parent = node.parentNode;

          if (
            parent !== undefined &&
            parent !== null &&
            parent.nodeType === Node.DOCUMENT_FRAGMENT_NODE
          ) {
            parent = parent.host;
          }

          return parent;
        },
        /**
         * Gets an updated position based on target.
         * @param {object} element using absolute-position behavior
         * @return {void}
         */
      },
      {
        key: "positionElement",
        value: function positionElement(el) {
          if (!el.position) {
            el.position = "bottom";
          }

          var target = this.findTarget(el),
            parent = el.offsetParent,
            t = !target || target.getBoundingClientRect();
          if (!target || !parent) return;
          if (el.justify) el.style.width = "".concat(t.width, "px");

          var offset = parseFloat(el.offset),
            w = document.body.getBoundingClientRect(),
            p = parent.getBoundingClientRect(),
            e = el.getBoundingClientRect(),
            //place element before vertically?
            vertical = function vertical() {
              var pos =
                arguments.length > 0 && arguments[0] !== undefined
                  ? arguments[0]
                  : el.position;
              return pos !== "left" && pos !== "right";
            },
            //place element before target?
            before = function before() {
              var pos =
                arguments.length > 0 && arguments[0] !== undefined
                  ? arguments[0]
                  : el.position;
              return pos === "left" || pos === "top";
            },
            /**
             * aligns horizontally if position is vertical
             * or aligns vertically if position is horizontal
             */
            setAlign = function setAlign() {
              var v =
                arguments.length > 0 && arguments[0] !== undefined
                  ? arguments[0]
                  : vertical(el.position);

              //fits element within parent's boundaries
              var pxToNum = function pxToNum(px) {
                  return parseFloat(px.replace("px", ""));
                },
                min = v
                  ? pxToNum(el.style.left) - e.left
                  : pxToNum(el.style.top) - e.top,
                startAt = v ? "left" : "top",
                distance = function distance(rect) {
                  return v ? rect.width : rect.height;
                },
                max = min + distance(w) - distance(e),
                align = min;

              if (el.positionAlign === "end") {
                align += t[startAt] - distance(e) + distance(t);
              } else if (el.positionAlign === "start") {
                align += t[startAt];
              } else {
                align += t[startAt] - distance(e) / 2 + distance(t) / 2;
              }

              return el.fitToVisibleBounds
                ? Math.max(min, Math.min(max, align)) + "px"
                : align + "px"; //if element size > parent, align where parent begins
            },
            getCoord = function getCoord() {
              var pos =
                arguments.length > 0 && arguments[0] !== undefined
                  ? arguments[0]
                  : el.position;

              var pxToNum = function pxToNum(px) {
                  return parseFloat(px.replace("px", ""));
                },
                adjust = vertical(pos)
                  ? pxToNum(el.style.top) - e.top
                  : pxToNum(el.style.left) - e.left,
                eh =
                  window.getComputedStyle(el, null).overflowY == "visible"
                    ? Math.max(e.height, el.scrollHeight)
                    : e.height,
                ew =
                  window.getComputedStyle(el, null).overflowX == "visible"
                    ? Math.max(e.width, el.scrollWidth)
                    : e.width;

              return pos === "top"
                ? t.top + adjust - eh - offset + "px"
                : pos === "left"
                ? t.left + adjust - ew - offset + "px"
                : t[pos] + adjust + offset + "px";
            },
            isFit = function isFit() {
              var pos =
                arguments.length > 0 && arguments[0] !== undefined
                  ? arguments[0]
                  : el.position;

              //determines if room for element between parent and target
              var distance = function distance(rect) {
                return vertical(pos) ? e.height + offset : e.width + offset;
              };

              return before(pos)
                ? t[pos] - w[pos] > distance
                : w[pos] - t[pos] > distance; //if no room, return original position
            },
            flip = el.fitToVisibleBounds !== false && !isFit(el.position),
            flipData = {
              top: ["bottom", "left", "right"],
              left: ["right", "top", "bottom"],
              bottom: ["top", "right", "left"],
              right: ["left", "bottom", "top"],
            };

          el.style.position = "absolute";
          /*
           * fits element according to specified postion,
           * or finds an alternative position that fits
           */

          if (flip && isFit(flipData[el.position][0])) {
            el.position = flipData[el.position][0];
          } else if (flip && isFit(flipData[el.position][1])) {
            el.position = flipData[el.position][1];
          } else if (flip && isFit(flipData[el.position][2])) {
            el.position = flipData[el.position][2];
          } else {
            el.style.top = vertical(el.position) ? getCoord() : setAlign();
            el.style.left = vertical(el.position) ? setAlign() : getCoord(); //provide positions for element and target (in case furthor positioning adjustments are needed)

            el.__positions = {
              self: e,
              parent: p,
              target: t,
            };
          }
        },
        /**
         * life cycle, element is removed from DOM
         */
      },
      {
        key: "disconnectedCallback",
        value: function disconnectedCallback() {
          this.removeEventListeners();

          _get(
            _getPrototypeOf(AbsolutePositionStateManager.prototype),
            "disconnectedCallback",
            this
          ).call(this);
        },
      },
    ]);

    return AbsolutePositionStateManager;
  })(_litElement.LitElement);

exports.AbsolutePositionStateManager = AbsolutePositionStateManager;
window.customElements.define(
  AbsolutePositionStateManager.tag,
  AbsolutePositionStateManager
);
