"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxGizmoBrowser = void 0;

var _litElement = require("lit-element/lit-element.js");

var _simpleFilter = require("@lrnwebcomponents/simple-filter/simple-filter.js");

var _utils = require("@lrnwebcomponents/utils/utils.js");

var _haxStore = require("./hax-store.js");

var _mobx = require("mobx");

require("@lrnwebcomponents/simple-fields/lib/simple-fields-field.js");

require("@lrnwebcomponents/simple-toolbar/lib/simple-button-grid.js");

var _I18NMixin2 = require("@lrnwebcomponents/i18n-manager/lib/I18NMixin.js");

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

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
  );
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _iterableToArray(iter) {
  if (
    Symbol.iterator in Object(iter) ||
    Object.prototype.toString.call(iter) === "[object Arguments]"
  )
    return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
}

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    '\n            <hax-tray-button\n              show-text-label\n              voice-command="insert ',
    '"\n              draggable="true"\n              @dragstart="',
    '"\n              @dragend="',
    '"\n              index="',
    '"\n              label="',
    '"\n              event-name="insert-tag"\n              event-data="',
    '"\n              data-demo-schema="true"\n              icon-position="top"\n              icon="',
    '"\n              part="grid-button"\n            ></hax-tray-button>\n          ',
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n      <div class="toolbar-inner" part="toolbar">\n        <simple-fields-field\n          id="inputfilter"\n          @value-changed="',
    '"\n          aria-controls="filter"\n          label="',
    '"\n          type="text"\n          auto-validate=""\n          part="filter"\n        ></simple-fields-field>\n      </div>\n      <simple-button-grid .cols="',
    '" .columns="',
    '" always-expanded part="grid">\n        ',
    "\n      </simple-button-grid>\n    ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key)
        );
      });
    }
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    "\n        :host {\n          display: flex;\n          flex-direction: column;\n          align-items: stretch;\n          flex: 0 1 auto;\n          overflow-y: auto;\n        }\n        :host > * {\n          max-width: 100%;\n        }\n        .toolbar-inner {\n          display: flex;\n          flex-direction: column;\n          align-items: stretch;\n          width: 100%;\n          flex: 0 0 auto;\n        }\n        hax-tray-button::part(button) {\n          font-size: var(hax-ui-font-size-xs);\n        }\n        simple-fields-field {\n          margin-top: 0;\n        }\n      ",
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

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
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

/* `hax-gizmo-browser`
 * `Browse a list of gizmos. This provides a listing of custom elements for people to search and select based on what have been defined as gizmos for users to select.`
 * @microcopy - the mental model for this element
 * - gizmo - silly name for the general public when talking about custom elements and what it provides in the end.
 */
var HaxGizmoBrowser =
  /*#__PURE__*/
  (function (_I18NMixin) {
    _inherits(HaxGizmoBrowser, _I18NMixin);

    _createClass(HaxGizmoBrowser, null, [
      {
        key: "styles",
        get: function get() {
          return [(0, _litElement.css)(_templateObject())];
        },
      },
      {
        key: "properties",
        get: function get() {
          return _objectSpread(
            {},
            _get(_getPrototypeOf(HaxGizmoBrowser), "properties", this),
            {
              isModal: {
                type: Boolean,
                attribute: "is-modal",
              },
            }
          );
        },
      },
    ]);

    function HaxGizmoBrowser() {
      var _this;

      _classCallCheck(this, HaxGizmoBrowser);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxGizmoBrowser).call(this)
      );
      _this.where = "title";
      _this.t = {
        filterContentTypes: "Filter Content Types",
      };

      _this.registerLocalization({
        context: _assertThisInitialized(_this),
        namespace: "hax",
      });

      return _this;
    }

    _createClass(
      HaxGizmoBrowser,
      [
        {
          key: "render",
          value: function render() {
            var _this2 = this;

            return (0, _litElement.html)(
              _templateObject2(),
              this.inputfilterChanged,
              this.t.filterContentTypes,
              this.isModal ? undefined : "100px",
              this.isModal ? undefined : 3,
              this.filtered.map(function (gizmo, i) {
                return (0,
                _litElement.html)(_templateObject3(), gizmo.title, _this2._dragStart, _this2._dragEnd, i, gizmo.title, gizmo.tag, gizmo.icon);
              })
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
            var schema = _haxStore.HAXStore.haxSchemaFromTag(
              e.target.eventData
            );

            var target;

            if (schema.gizmo.tag && schema.demoSchema && schema.demoSchema[0]) {
              target = (0, _utils.haxElementToNode)(schema.demoSchema[0]);
            } else {
              target = document.createElement(e.target.eventData);
            }

            _haxStore.HAXStore.__dragTarget = target;

            if (e.dataTransfer) {
              this.crt = target.cloneNode(true);

              if (
                schema.gizmo.tag &&
                schema.demoSchema &&
                schema.demoSchema[0]
              ) {
                this.crt.style.width = "200px";
                this.crt.style.height = "200px";
              } else {
                this.crt.style.position = "absolute";
                this.crt.style.top = "-1000px";
                this.crt.style.right = "-1000px";
                this.crt.style.transform = "scale(0.25)";
              }

              this.crt.style.opacity = ".8";
              this.crt.style.backgroundColor = e.target.getAttribute(
                "drag-color"
              );
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.dropEffect = "move"; //document.body.appendChild(this.crt);

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
            this.crt.remove();
          },
        },
        {
          key: "inputfilterChanged",
          value: function inputfilterChanged(e) {
            this.like = e.target.value;
          },
        },
        {
          key: "updated",
          value: function updated(changedProperties) {
            var _this3 = this;

            changedProperties.forEach(function (oldValue, propName) {
              if (propName == "activeApp") {
                _this3._activeAppChanged(_this3[propName], oldValue);
              }

              if (propName == "filtered") {
                _this3.requestUpdate();
              }
            });
          },
        },
        {
          key: "firstUpdated",
          value: function firstUpdated(changedProperties) {
            var _this4 = this;

            if (
              _get(
                _getPrototypeOf(HaxGizmoBrowser.prototype),
                "firstUpdated",
                this
              )
            ) {
              _get(
                _getPrototypeOf(HaxGizmoBrowser.prototype),
                "firstUpdated",
                this
              ).call(this, changedProperties);
            }

            (0, _mobx.autorun)(function () {
              _this4.resetList((0, _mobx.toJS)(_haxStore.HAXStore.gizmoList));
            });
          },
          /**
           * Reset this browser.
           */
        },
        {
          key: "resetList",
          value: function resetList(list) {
            _get(
              _getPrototypeOf(HaxGizmoBrowser.prototype),
              "resetList",
              this
            ).call(this, list);

            if (list) {
              this.items = _toConsumableArray(
                list.filter(function (gizmo, i) {
                  // remove inline and hidden references
                  if (
                    gizmo &&
                    gizmo.meta &&
                    (gizmo.meta.inlineOnly || gizmo.meta.hidden)
                  ) {
                    return false;
                  }

                  return true;
                })
              );
            }
          },
        },
      ],
      [
        {
          key: "tag",
          get: function get() {
            return "hax-gizmo-browser";
          },
        },
      ]
    );

    return HaxGizmoBrowser;
  })(
    (0, _I18NMixin2.I18NMixin)(
      (0, _simpleFilter.SimpleFilterMixin)(_litElement.LitElement)
    )
  );

exports.HaxGizmoBrowser = HaxGizmoBrowser;
window.customElements.define(HaxGizmoBrowser.tag, HaxGizmoBrowser);
