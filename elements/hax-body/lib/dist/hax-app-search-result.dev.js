"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxAppSearchResult = void 0;

var _litElement = require("lit-element/lit-element.js");

var _haxStore = require("./hax-store.js");

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    "\n        :host {\n          display: flex;\n          flex-direction: column;\n          align-items: stretch;\n          justify-content: space-evenly;\n          height: 100%;\n        }\n        button {\n          font-size: var(--hax-tray-font-size-xs, 11px);\n          margin: 0;\n          padding: 0;\n          display: flex;\n          flex-direction: column;\n          align-items: stretch;\n          border-radius: 0;\n          border: none;\n          width: 100%;\n          outline: 1px solid var(--hax-toolbar-border-color, #ddd);\n          opacity: 0.8;\n          background-color: var(--hax-toolbar-button-bg, #fff);\n          transition: 0.2s opacity ease-in-out, 0.2s outline-color ease-in-out;\n          flex: 1 0 auto;\n        }\n        button:hover,\n        button:focus,\n        button:active {\n          outline-color: var(--hax-tray-accent-color, #000);\n          outline-width: 4px;\n          outline-style: solid;\n          opacity: 1;\n        }\n        .detail-wrapper {\n          flex: 1 0 auto;\n          max-height: 30px;\n          overflow: hidden;\n          text-align: center;\n          text-overflow: ellipsis;\n        }\n        .image {\n          flex: 0 0 auto;\n          width: 100%;\n          background-color: var(--hax-toolbar-border-color, #ddd);\n        }\n        @media screen and (max-width: 1000px) {\n          :host {\n            width: 100%;\n          }\n          .title {\n            font-size: 12px;\n          }\n        }\n      ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

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

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n      <button\n        draggable="true"\n        @click="',
    '"\n        @dragstart="',
    '"\n        @dragend="',
    '"\n        title="',
    '"\n      >\n        <img loading="lazy" class="image" src="',
    '" />\n        <div class="detail-wrapper">',
    "<</div>\n      </button>\n    ",
  ]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }
  return Object.freeze(
    Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })
  );
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

/**
 * `hax-source`
 * @element hax-source
 * `An element that brokers the visual display of a listing of material from an end point. The goal is to normalize data from some location which is media centric. This expects to get at least enough data in order to form a grid of items which are selectable. It's also generically implemented so that anything can be hooked up as a potential source for input (example: youtube API or custom in-house solution). The goal is to return enough info via fired event so that we can tell hax-body that the user selected a tag, properties, slot combination so that hax-body can turn the selection into a custom element / element injected into the hax-body slot.`
 */
var HaxAppSearchResult =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(HaxAppSearchResult, _LitElement);

    function HaxAppSearchResult() {
      _classCallCheck(this, HaxAppSearchResult);

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxAppSearchResult).call(this)
      );
    }

    _createClass(
      HaxAppSearchResult,
      [
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(
              _templateObject(),
              this._itemSelected,
              this._dragStart,
              this._dragEnd,
              this.details,
              this.image,
              this.title.substr(0, 40)
            );
          },
        },
        {
          key: "_dragStart",

          /**
           * Drag start so we know what target to set
           */
          value: function _dragStart(e) {
            // create the tag
            var target = this.cloneNode(true);
            _haxStore.HAXStore.__dragTarget = target;

            if (e.dataTransfer) {
              this.crt = target;
              this.crt.style.position = "absolute";
              this.crt.style.top = "-1000px";
              this.crt.style.right = "-1000px";
              this.crt.style.transform = "scale(0.25)";
              this.crt.style.opacity = ".8";
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.dropEffect = "move";
              document.body.appendChild(this.crt);
              e.dataTransfer.setDragImage(this.crt, 0, 0);
            }

            e.stopPropagation();
            e.stopImmediatePropagation();
          },
          /**
           * When we end dragging ensure we remove the mover class.
           */
        },
        {
          key: "_dragEnd",
          value: function _dragEnd(e) {
            var _this = this;

            this.crt.remove();
            setTimeout(function () {
              _this._itemSelected(e);
            }, 0);
          },
          /**
           * Handle media item selected.
           */
        },
        {
          key: "_itemSelected",
          value: function _itemSelected(e) {
            var map = this.map;
            var gizmoType = this.type; // sanity check as well as guessing based on type if we absolutely have to

            if (
              (!gizmoType ||
                gizmoType == null ||
                gizmoType == "" ||
                gizmoType == "undefined") &&
              map.source
            ) {
              gizmoType = _haxStore.HAXStore.guessGizmoType(map);
            }

            var haxElements = _haxStore.HAXStore.guessGizmo(
              gizmoType,
              map,
              false,
              true
            ); // see if we got anything

            if (haxElements.length > 0) {
              if (haxElements.length === 1) {
                if (
                  _typeof(haxElements[0].tag) !==
                  (typeof undefined === "undefined"
                    ? "undefined"
                    : _typeof(undefined))
                ) {
                  haxElements[0].nextToActive = true;
                  this.dispatchEvent(
                    new CustomEvent("hax-insert-content", {
                      bubbles: true,
                      cancelable: true,
                      composed: true,
                      detail: haxElements[0],
                    })
                  );
                }
              } else {
                // hand off to hax-app-picker to deal with the rest of this
                _haxStore.HAXStore.haxAppPicker.presentOptions(
                  haxElements,
                  gizmoType,
                  "How would you like to display this " + gizmoType + "?",
                  "gizmo"
                );
              }
            } else {
              _haxStore.HAXStore.toast(
                "Sorry, HAX can't handle that link yet."
              );
            }
          },
        },
      ],
      [
        {
          key: "styles",
          get: function get() {
            return [(0, _litElement.css)(_templateObject2())];
          },
        },
        {
          key: "tag",
          get: function get() {
            return "hax-app-search-result";
          },
        },
        {
          key: "properties",
          get: function get() {
            return {
              image: {
                type: String,
              },
              title: {
                type: String,
              },
              details: {
                type: String,
              },
              map: {
                type: Object,
              },
              type: {
                type: String,
              },
            };
          },
        },
      ]
    );

    return HaxAppSearchResult;
  })(_litElement.LitElement);

exports.HaxAppSearchResult = HaxAppSearchResult;
window.customElements.define(HaxAppSearchResult.tag, HaxAppSearchResult);
