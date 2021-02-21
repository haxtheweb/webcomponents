"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleIconPicker = void 0;

var _simplePicker = require("@lrnwebcomponents/simple-picker/simple-picker.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icons.js");

var _simpleIconset = require("@lrnwebcomponents/simple-icon/lib/simple-iconset.js");

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

/**
 * `simple-icon-picker`
 * Uses simple-picker to create an icon picker
 * @element simple-icon-picker
 * @customElement
 *
 * @demo ./demo/index.html
 */
var SimpleIconPicker =
  /*#__PURE__*/
  (function (_SimplePicker) {
    _inherits(SimpleIconPicker, _SimplePicker);

    _createClass(SimpleIconPicker, null, [
      {
        key: "properties",
        // properties available to the custom element for data binding
        get: function get() {
          return _objectSpread(
            {},
            _get(_getPrototypeOf(SimpleIconPicker), "properties", this),
            {
              /**
               * Allow a null option to be selected?
               */
              allowNull: {
                type: Boolean,
              },

              /**
          * An array of icons by name: ```
        [
        "editor:format-paint",
        "content-copy",
        "av:volume-off"
        
        ]```
        */
              icons: {
                type: Array,
              },
              includeSets: {
                type: Array,
                attribute: "include-sets",
              },
              excludeSets: {
                type: Array,
                attribute: "exclude-sets",
              },
              exclude: {
                type: Array,
                attribute: "exclude",
              },

              /**
               * The value of the option.
               */
              value: {
                type: String,
                reflect: true,
              },

              /**
               * the maximum number of options per row
               */
              optionsPerRow: {
                type: Number,
              },

              /**
          * An array of icons by name: ```
        [
        "editor:format-paint",
        "content-copy",
        "av:volume-off"
        
        ]```
        */
              __iconList: {
                type: Array,
              },
            }
          );
        },
        /**
         * Store the tag name to make it easier to obtain directly.
         * @notice function name must be here for tooling to operate correctly
         */
      },
      {
        key: "tag",
        get: function get() {
          return "simple-icon-picker";
        },
      },
    ]);

    function SimpleIconPicker() {
      var _this;

      _classCallCheck(this, SimpleIconPicker);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimpleIconPicker).call(this)
      );
      _this.hideOptionLabels = true;
      _this.allowNull = false;
      _this.icons = [];
      _this.value = null;
      _this.options = [];
      _this.optionsPerRow = 10;
      return _this;
    }
    /**
     * LitElement life cycle - property changed callback
     */

    _createClass(SimpleIconPicker, [
      {
        key: "updated",
        value: function updated(changedProperties) {
          var _this2 = this;

          if (
            _get(_getPrototypeOf(SimpleIconPicker.prototype), "updated", this)
          ) {
            _get(
              _getPrototypeOf(SimpleIconPicker.prototype),
              "updated",
              this
            ).call(this, changedProperties);
          }

          changedProperties.forEach(function (oldValue, propName) {
            if (
              ["optionsPerRow", "icons", "allowNull", "__iconList"].includes(
                propName
              )
            ) {
              clearTimeout(_this2.__rebuild);
              _this2.__rebuild = setTimeout(function () {
                setTimeout(function () {
                  _this2._getOptions();
                }, 100);
              }, 0);
            }

            if (propName == "value") {
              /**
               * fires when value changes
               * @event value-changed
               */
              _this2.dispatchEvent(
                new CustomEvent("value-changed", {
                  detail: {
                    value: _this2[propName],
                  },
                })
              );
            }
          });
        },
        /**
         * LitElement life cycle - ready callback
         */
      },
      {
        key: "firstUpdated",
        value: function firstUpdated(changedProperties) {
          if (
            _get(
              _getPrototypeOf(SimpleIconPicker.prototype),
              "firstUpdated",
              this
            )
          ) {
            _get(
              _getPrototypeOf(SimpleIconPicker.prototype),
              "firstUpdated",
              this
            ).call(this, changedProperties);
          }
        },
        /**
         * gets icons that are registered in SimpleIconsetStore and filters based on include/exclude lists
         *
         * @returns {array}
         * @memberof SimpleIconPicker
         */
      },
      {
        key: "_getStoredIcons",
        value: function _getStoredIcons() {
          var icons =
              _simpleIconset.SimpleIconsetStore &&
              _simpleIconset.SimpleIconsetStore.iconlist
                ? _simpleIconset.SimpleIconsetStore.iconlist
                : [],
            includeSets =
              this.includeSets && this.includeSets.length > 0
                ? _typeof(this.includeSets) !== _typeof([])
                  ? JSON.parse(this.includeSets)
                  : this.includeSets
                : false,
            excludeSets =
              this.excludeSets && this.excludeSets.length > 0
                ? _typeof(this.excludeSets) !== _typeof([])
                  ? JSON.parse(this.excludeSets)
                  : this.excludeSets
                : false,
            exclude =
              this.exclude && this.exclude.length > 0
                ? _typeof(this.exclude) !== _typeof([])
                  ? JSON.parse(this.exclude)
                  : this.exclude
                : false;
          if (includeSets || excludeSets || exclude)
            icons = icons.filter(function (icon) {
              var prefix = icon,
                iconname = icon,
                include = true;
              (prefix = prefix.replace(/:.*/, "")),
                iconname.replace("icons:", "");
              if (
                exclude &&
                (exclude.includes(icon) ||
                  exclude.includes("icons:".concat(iconname)))
              )
                include = false;
              if (includeSets && !includeSets.includes(prefix)) include = false;
              if (excludeSets && excludeSets.includes(prefix)) include = false;
              return include;
            });
          return icons;
        },
        /**
         * gets a list of icons and load them in a format
         * that the simple-picker can take;
         * if no icons are provided, loads a list from iron-meta
         *
         * @param {array} a list of custom icons for the picker
         * @param {array} default list of icons for the picker
         * @param {boolean} allow a null value for the picker
         *
         */
      },
      {
        key: "_getOptions",
        value: function _getOptions() {
          var icons =
              typeof this.icons === "string"
                ? JSON.parse(this.icons)
                : this.icons,
            cols = this.optionsPerRow;
          if (icons.length === 0) icons = this._getStoredIcons();
          var options =
              this.allowNull === false
                ? []
                : [
                    [
                      {
                        alt: "null",
                        value: null,
                      },
                    ],
                  ],
            h = this.allowNull === false ? 0 : 1;
          cols =
            Math.sqrt(icons.length + h) <= this.optionsPerRow
              ? Math.ceil(Math.sqrt(icons.length + h))
              : this.optionsPerRow;

          for (var i = 0; i < icons.length; i++) {
            var j = h + i,
              row = Math.floor(j / cols),
              col = j - row * cols;
            if (options[row] === undefined || options[row] === null)
              options[row] = [];
            options[row][col] = {
              alt: icons[i],
              icon: icons[i],
              value: icons[i],
            };
          }

          this.options = options;
        },
        /**
         * Don't set the selection option until there are options rendered
         */
      },
      {
        key: "_setSelectedOption",
        value: function _setSelectedOption() {
          if (this.options.length > 1)
            _get(
              _getPrototypeOf(SimpleIconPicker.prototype),
              "_setSelectedOption",
              this
            ).call(this);
        },
      },
    ]);

    return SimpleIconPicker;
  })(_simplePicker.SimplePicker);

exports.SimpleIconPicker = SimpleIconPicker;
window.customElements.define(SimpleIconPicker.tag, SimpleIconPicker);
