"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleSymbolPicker = void 0;

var _litElement = require("lit-element/lit-element.js");

var _simplePicker = require("@lrnwebcomponents/simple-picker/simple-picker.js");

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

function _templateObject() {
  var data = _taggedTemplateLiteral([
    "\n        simple-picker-option {\n          justify-content: space-around;\n        }\n        #icon {\n          margin-left: calc(-0.125 * var(--simple-picker-icon-size, 16px));\n        }\n      ",
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
 * `simple-symbol-picker`
 * @element simple-symbol-picker
 * Uses simple-picker to create an icon picker
 *

 * @demo ./demo/index.html
 */
var SimpleSymbolPicker =
  /*#__PURE__*/
  (function (_SimplePicker) {
    _inherits(SimpleSymbolPicker, _SimplePicker);

    _createClass(SimpleSymbolPicker, null, [
      {
        key: "styles",
        //styles function
        get: function get() {
          return [].concat(
            _toConsumableArray(
              _get(_getPrototypeOf(SimpleSymbolPicker), "styles", this)
            ),
            [(0, _litElement.css)(_templateObject())]
          );
        }, // properties available to the custom element for data binding
      },
      {
        key: "properties",
        get: function get() {
          return _objectSpread(
            {},
            _get(_getPrototypeOf(SimpleSymbolPicker), "properties", this),
            {
              /**
               * Symbol types to include
               */
              symbolTypes: {
                name: "symbolTypes",
                type: Array,
                attribute: "symbol-types",
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
          return "simple-symbol-picker";
        },
      },
    ]);

    function SimpleSymbolPicker() {
      var _this;

      _classCallCheck(this, SimpleSymbolPicker);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimpleSymbolPicker).call(this)
      );
      _this.icon = "editor:functions";
      _this.label = "Symbol";
      _this.symbolTypes = ["symbols", "math", "characters", "greek", "misc"];
      _this.titleAsHtml = true;
      return _this;
    }
    /**
     * LitElement life cycle - ready callback
     */

    _createClass(SimpleSymbolPicker, [
      {
        key: "firstUpdated",
        value: function firstUpdated(changedProperties) {
          if (
            _get(
              _getPrototypeOf(SimpleSymbolPicker.prototype),
              "firstUpdated",
              this
            )
          ) {
            _get(
              _getPrototypeOf(SimpleSymbolPicker.prototype),
              "firstUpdated",
              this
            ).call(this, changedProperties);
          }

          var optData = [
            {
              alt: null,
              icon: this.icon,
              value: null,
            },
          ];
          this.symbolTypes.forEach(function (type) {
            return window.SimplePickerSymbols[type].forEach(function (symbol) {
              return optData.push(symbol);
            });
          });
          optData = this._setPickerOptions(optData);
          this.options = optData;
        },
        /**
         * gets a list of icons and load them in a format
         * that simple-picker can take;
         * if no icons are provided, loads a list from iron-meta
         *
         * @param {array} a list of custom icons for picker
         * @returns {array}
         */
      },
      {
        key: "_setPickerOptions",
        value: function _setPickerOptions() {
          var options =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : this.options || [];
          var items = [],
            cols =
              Math.sqrt(options.length) < 11
                ? Math.ceil(Math.sqrt(options.length))
                : 10;
          options.forEach(function (option, i) {
            var row = Math.floor(i / cols),
              col = i - row * cols;
            if (!items[row]) items[row] = [];
            items[row][col] = option;
          });
          return items;
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
              _getPrototypeOf(SimpleSymbolPicker.prototype),
              "_setSelectedOption",
              this
            ).call(this);
        },
      },
    ]);

    return SimpleSymbolPicker;
  })(_simplePicker.SimplePicker);

exports.SimpleSymbolPicker = SimpleSymbolPicker;
window.SimplePickerSymbols = window.SimplePickerSymbols || {
  symbols: [
    {
      value: "&iexcl;",
      alt: "&iexcl;",
    },
    {
      value: "&cent;",
      alt: "&cent;",
    },
    {
      value: "&pound;",
      alt: "&pound;",
    },
    {
      value: "&curren;",
      alt: "&curren;",
    },
    {
      value: "&yen;",
      alt: "&yen;",
    },
    {
      value: "&brvbar;",
      alt: "&brvbar;",
    },
    {
      value: "&sect;",
      alt: "&sect;",
    },
    {
      value: "&uml;",
      alt: "&uml;",
    },
    {
      value: "&copy;",
      alt: "&copy;",
    },
    {
      value: "&ordf;",
      alt: "&ordf;",
    },
    {
      value: "&laquo;",
      alt: "&laquo;",
    },
    {
      value: "&not;",
      alt: "&not;",
    },
    {
      value: "&shy;",
      alt: "&shy;",
    },
    {
      value: "&reg;",
      alt: "&reg;",
    },
    {
      value: "&macr;",
      alt: "&macr;",
    },
    {
      value: "&deg;",
      alt: "&deg;",
    },
    {
      value: "&plusmn;",
      alt: "&plusmn;",
    },
    {
      value: "&sup2;",
      alt: "&sup2;",
    },
    {
      value: "&sup3;",
      alt: "&sup3;",
    },
    {
      value: "&acute;",
      alt: "&acute;",
    },
    {
      value: "&micro;",
      alt: "&micro;",
    },
    {
      value: "&para;",
      alt: "&para;",
    },
    {
      value: "&cedil;",
      alt: "&cedil;",
    },
    {
      value: "&sup1;",
      alt: "&sup1;",
    },
    {
      value: "&ordm;",
      alt: "&ordm;",
    },
    {
      value: "&raquo;",
      alt: "&raquo;",
    },
    {
      value: "&frac14;",
      alt: "&frac14;",
    },
    {
      value: "&frac12;",
      alt: "&frac12;",
    },
    {
      value: "&frac34;",
      alt: "&frac34;",
    },
    {
      value: "&iquest;",
      alt: "&iquest;",
    },
    {
      value: "&times;",
      alt: "&times;",
    },
    {
      value: "&divide;",
      alt: "&divide;",
    },
  ],
  math: [
    {
      value: "&forall;",
      alt: "&forall;",
    },
    {
      value: "&part;",
      alt: "&part;",
    },
    {
      value: "&exist;",
      alt: "&exist;",
    },
    {
      value: "&empty;",
      alt: "&empty;",
    },
    {
      value: "&nabla;",
      alt: "&nabla;",
    },
    {
      value: "&isin;",
      alt: "&isin;",
    },
    {
      value: "&notin;",
      alt: "&notin;",
    },
    {
      value: "&ni;",
      alt: "&ni;",
    },
    {
      value: "&prod;",
      alt: "&prod;",
    },
    {
      value: "&sum;",
      alt: "&sum;",
    },
    {
      value: "&minus;",
      alt: "&minus;",
    },
    {
      value: "&lowast;",
      alt: "&lowast;",
    },
    {
      value: "&radic;",
      alt: "&radic;",
    },
    {
      value: "&prop;",
      alt: "&prop;",
    },
    {
      value: "&infin;",
      alt: "&infin;",
    },
    {
      value: "&ang;",
      alt: "&ang;",
    },
    {
      value: "&and;",
      alt: "&and;",
    },
    {
      value: "&or;",
      alt: "&or;",
    },
    {
      value: "&cap;",
      alt: "&cap;",
    },
    {
      value: "&cup;",
      alt: "&cup;",
    },
    {
      value: "&int;",
      alt: "&int;",
    },
    {
      value: "&there4;",
      alt: "&there4;",
    },
    {
      value: "&sim;",
      alt: "&sim;",
    },
    {
      value: "&cong;",
      alt: "&cong;",
    },
    {
      value: "&asymp;",
      alt: "&asymp;",
    },
    {
      value: "&ne;",
      alt: "&ne;",
    },
    {
      value: "&equiv;",
      alt: "&equiv;",
    },
    {
      value: "&le;",
      alt: "&le;",
    },
    {
      value: "&ge;",
      alt: "&ge;",
    },
    {
      value: "&sub;",
      alt: "&sub;",
    },
    {
      value: "&sup;",
      alt: "&sup;",
    },
    {
      value: "&nsub;",
      alt: "&nsub;",
    },
    {
      value: "&sube;",
      alt: "&sube;",
    },
    {
      value: "&supe;",
      alt: "&supe;",
    },
    {
      value: "&oplus;",
      alt: "&oplus;",
    },
    {
      value: "&otimes;",
      alt: "&otimes;",
    },
    {
      value: "&perp;",
      alt: "&perp;",
    },
    {
      value: "&sdot;",
      alt: "&sdot;",
    },
  ],
  characters: [
    {
      value: "&Agrave;",
      alt: "&Agrave;",
    },
    {
      value: "&Aacute;",
      alt: "&Aacute;",
    },
    {
      value: "&Acirc;",
      alt: "&Acirc;",
    },
    {
      value: "&Atilde;",
      alt: "&Atilde;",
    },
    {
      value: "&Auml;",
      alt: "&Auml;",
    },
    {
      value: "&Aring;",
      alt: "&Aring;",
    },
    {
      value: "&AElig;",
      alt: "&AElig;",
    },
    {
      value: "&Ccedil;",
      alt: "&Ccedil;",
    },
    {
      value: "&Egrave;",
      alt: "&Egrave;",
    },
    {
      value: "&Eacute;",
      alt: "&Eacute;",
    },
    {
      value: "&Ecirc;",
      alt: "&Ecirc;",
    },
    {
      value: "&Euml;",
      alt: "&Euml;",
    },
    {
      value: "&Igrave;",
      alt: "&Igrave;",
    },
    {
      value: "&Iacute;",
      alt: "&Iacute;",
    },
    {
      value: "&Icirc;",
      alt: "&Icirc;",
    },
    {
      value: "&Iuml;",
      alt: "&Iuml;",
    },
    {
      value: "&ETH;",
      alt: "&ETH;",
    },
    {
      value: "&Ntilde;",
      alt: "&Ntilde;",
    },
    {
      value: "&Ograve;",
      alt: "&Ograve;",
    },
    {
      value: "&Oacute;",
      alt: "&Oacute;",
    },
    {
      value: "&Ocirc;",
      alt: "&Ocirc;",
    },
    {
      value: "&Otilde;",
      alt: "&Otilde;",
    },
    {
      value: "&Ouml;",
      alt: "&Ouml;",
    },
    {
      value: "&Oslash;",
      alt: "&Oslash;",
    },
    {
      value: "&Ugrave;",
      alt: "&Ugrave;",
    },
    {
      value: "&Uacute;",
      alt: "&Uacute;",
    },
    {
      value: "&Ucirc;",
      alt: "&Ucirc;",
    },
    {
      value: "&Uuml;",
      alt: "&Uuml;",
    },
    {
      value: "&Yacute;",
      alt: "&Yacute;",
    },
    {
      value: "&THORN;",
      alt: "&THORN;",
    },
    {
      value: "&szlig;",
      alt: "&szlig;",
    },
    {
      value: "&agrave;",
      alt: "&agrave;",
    },
    {
      value: "&aacute;",
      alt: "&aacute;",
    },
    {
      value: "&acirc;",
      alt: "&acirc;",
    },
    {
      value: "&atilde;",
      alt: "&atilde;",
    },
    {
      value: "&auml;",
      alt: "&auml;",
    },
    {
      value: "&aring;",
      alt: "&aring;",
    },
    {
      value: "&aelig;",
      alt: "&aelig;",
    },
    {
      value: "&ccedil;",
      alt: "&ccedil;",
    },
    {
      value: "&egrave;",
      alt: "&egrave;",
    },
    {
      value: "&eacute;",
      alt: "&eacute;",
    },
    {
      value: "&ecirc;",
      alt: "&ecirc;",
    },
    {
      value: "&euml;",
      alt: "&euml;",
    },
    {
      value: "&igrave;",
      alt: "&igrave;",
    },
    {
      value: "&iacute;",
      alt: "&iacute;",
    },
    {
      value: "&icirc;",
      alt: "&icirc;",
    },
    {
      value: "&iuml;",
      alt: "&iuml;",
    },
    {
      value: "&eth;",
      alt: "&eth;",
    },
    {
      value: "&ntilde;",
      alt: "&ntilde;",
    },
    {
      value: "&ograve;",
      alt: "&ograve;",
    },
    {
      value: "&oacute;",
      alt: "&oacute;",
    },
    {
      value: "&ocirc;",
      alt: "&ocirc;",
    },
    {
      value: "&otilde;",
      alt: "&otilde;",
    },
    {
      value: "&ouml;",
      alt: "&ouml;",
    },
    {
      value: "&oslash;",
      alt: "&oslash;",
    },
    {
      value: "&ugrave;",
      alt: "&ugrave;",
    },
    {
      value: "&uacute;",
      alt: "&uacute;",
    },
    {
      value: "&ucirc;",
      alt: "&ucirc;",
    },
    {
      value: "&uuml;",
      alt: "&uuml;",
    },
    {
      value: "&yacute;",
      alt: "&yacute;",
    },
    {
      value: "&thorn;",
      alt: "&thorn;",
    },
    {
      value: "&yuml;",
      alt: "&yuml;",
    },
  ],
  greek: [
    {
      value: "&Alpha;",
      alt: "&Alpha;",
    },
    {
      value: "&Beta;",
      alt: "&Beta;",
    },
    {
      value: "&Gamma;",
      alt: "&Gamma;",
    },
    {
      value: "&Delta;",
      alt: "&Delta;",
    },
    {
      value: "&Epsilon;",
      alt: "&Epsilon;",
    },
    {
      value: "&Zeta;",
      alt: "&Zeta;",
    },
    {
      value: "&Eta;",
      alt: "&Eta;",
    },
    {
      value: "&Theta;",
      alt: "&Theta;",
    },
    {
      value: "&Iota;",
      alt: "&Iota;",
    },
    {
      value: "&Kappa;",
      alt: "&Kappa;",
    },
    {
      value: "&Lambda;",
      alt: "&Lambda;",
    },
    {
      value: "&Mu;",
      alt: "&Mu;",
    },
    {
      value: "&Nu;",
      alt: "&Nu;",
    },
    {
      value: "&Xi;",
      alt: "&Xi;",
    },
    {
      value: "&Omicron;",
      alt: "&Omicron;",
    },
    {
      value: "&Pi;",
      alt: "&Pi;",
    },
    {
      value: "&Rho;",
      alt: "&Rho;",
    },
    {
      value: "&Sigma;",
      alt: "&Sigma;",
    },
    {
      value: "&Tau;",
      alt: "&Tau;",
    },
    {
      value: "&Upsilon;",
      alt: "&Upsilon;",
    },
    {
      value: "&Phi;",
      alt: "&Phi;",
    },
    {
      value: "&Chi;",
      alt: "&Chi;",
    },
    {
      value: "&Psi;",
      alt: "&Psi;",
    },
    {
      value: "&Omega;",
      alt: "&Omega;",
    },
    {
      value: "&alpha;",
      alt: "&alpha;",
    },
    {
      value: "&beta;",
      alt: "&beta;",
    },
    {
      value: "&gamma;",
      alt: "&gamma;",
    },
    {
      value: "&delta;",
      alt: "&delta;",
    },
    {
      value: "&epsilon;",
      alt: "&epsilon;",
    },
    {
      value: "&zeta;",
      alt: "&zeta;",
    },
    {
      value: "&eta;",
      alt: "&eta;",
    },
    {
      value: "&theta;",
      alt: "&theta;",
    },
    {
      value: "&iota;",
      alt: "&iota;",
    },
    {
      value: "&kappa;",
      alt: "&kappa;",
    },
    {
      value: "&lambda;",
      alt: "&lambda;",
    },
    {
      value: "&mu;",
      alt: "&mu;",
    },
    {
      value: "&nu;",
      alt: "&nu;",
    },
    {
      value: "&xi;",
      alt: "&xi;",
    },
    {
      value: "&omicron;",
      alt: "&omicron;",
    },
    {
      value: "&pi;",
      alt: "&pi;",
    },
    {
      value: "&rho;",
      alt: "&rho;",
    },
    {
      value: "&sigmaf;",
      alt: "&sigmaf;",
    },
    {
      value: "&sigma;",
      alt: "&sigma;",
    },
    {
      value: "&tau;",
      alt: "&tau;",
    },
    {
      value: "&upsilon;",
      alt: "&upsilon;",
    },
    {
      value: "&phi;",
      alt: "&phi;",
    },
    {
      value: "&chi;",
      alt: "&chi;",
    },
    {
      value: "&psi;",
      alt: "&psi;",
    },
    {
      value: "&omega;",
      alt: "&omega;",
    },
    {
      value: "&thetasym;",
      alt: "&thetasym;",
    },
    {
      value: "&upsih;",
      alt: "&upsih;",
    },
    {
      value: "&piv;",
      alt: "&piv;",
    },
    {
      value: "&otilde;",
      alt: "&otilde;",
    },
    {
      value: "&ouml;",
      alt: "&ouml;",
    },
    {
      value: "&oslash;",
      alt: "&oslash;",
    },
    {
      value: "&ugrave;",
      alt: "&ugrave;",
    },
    {
      value: "&uacute;",
      alt: "&uacute;",
    },
    {
      value: "&ucirc;",
      alt: "&ucirc;",
    },
    {
      value: "&uuml;",
      alt: "&uuml;",
    },
    {
      value: "&yacute;",
      alt: "&yacute;",
    },
    {
      value: "&thorn;",
      alt: "&thorn;",
    },
    {
      value: "&yuml;",
      alt: "&yuml;",
    },
  ],
  misc: [
    {
      value: "&OElig;",
      alt: "&OElig;",
    },
    {
      value: "&oelig;",
      alt: "&oelig;",
    },
    {
      value: "&Scaron;",
      alt: "&Scaron;",
    },
    {
      value: "&scaron;",
      alt: "&scaron;",
    },
    {
      value: "&Yuml;",
      alt: "&Yuml;",
    },
    {
      value: "&fnof;",
      alt: "&fnof;",
    },
    {
      value: "&circ;",
      alt: "&circ;",
    },
    {
      value: "&tilde;",
      alt: "&tilde;",
    },
    {
      value: "&ensp;",
      alt: "&ensp;",
    },
    {
      value: "&emsp;",
      alt: "&emsp;",
    },
    {
      value: "&thinsp;",
      alt: "&thinsp;",
    },
    {
      value: "&zwnj;",
      alt: "&zwnj;",
    },
    {
      value: "&zwj;",
      alt: "&zwj;",
    },
    {
      value: "&lrm;",
      alt: "&lrm;",
    },
    {
      value: "&rlm;",
      alt: "&rlm;",
    },
    {
      value: "&ndash;",
      alt: "&ndash;",
    },
    {
      value: "&mdash;",
      alt: "&mdash;",
    },
    {
      value: "&lsquo;",
      alt: "&lsquo;",
    },
    {
      value: "&rsquo;",
      alt: "&rsquo;",
    },
    {
      value: "&sbquo;",
      alt: "&sbquo;",
    },
    {
      value: "&ldquo;",
      alt: "&ldquo;",
    },
    {
      value: "&rdquo;",
      alt: "&rdquo;",
    },
    {
      value: "&bdquo;",
      alt: "&bdquo;",
    },
    {
      value: "&dagger;",
      alt: "&dagger;",
    },
    {
      value: "&Dagger;",
      alt: "&Dagger;",
    },
    {
      value: "&bull;",
      alt: "&bull;",
    },
    {
      value: "&hellip;",
      alt: "&hellip;",
    },
    {
      value: "&permil;",
      alt: "&permil;",
    },
    {
      value: "&prime;",
      alt: "&prime;",
    },
    {
      value: "&Prime;",
      alt: "&Prime;",
    },
    {
      value: "&lsaquo;",
      alt: "&lsaquo;",
    },
    {
      value: "&rsaquo;",
      alt: "&rsaquo;",
    },
    {
      value: "&oline;",
      alt: "&oline;",
    },
    {
      value: "&euro;",
      alt: "&euro;",
    },
    {
      value: "&trade;",
      alt: "&trade;",
    },
    {
      value: "&larr;",
      alt: "&larr;",
    },
    {
      value: "&uarr;",
      alt: "&uarr;",
    },
    {
      value: "&rarr;",
      alt: "&rarr;",
    },
    {
      value: "&darr;",
      alt: "&darr;",
    },
    {
      value: "&harr;",
      alt: "&harr;",
    },
    {
      value: "&crarr;",
      alt: "&crarr;",
    },
    {
      value: "&lceil;",
      alt: "&lceil;",
    },
    {
      value: "&rceil;",
      alt: "&rceil;",
    },
    {
      value: "&lfloor;",
      alt: "&lfloor;",
    },
    {
      value: "&rfloor;",
      alt: "&rfloor;",
    },
    {
      value: "&loz;",
      alt: "&loz;",
    },
    {
      value: "&spades;",
      alt: "&spades;",
    },
    {
      value: "&clubs;",
      alt: "&clubs;",
    },
    {
      value: "&hearts;",
      alt: "&hearts;",
    },
    {
      value: "&diams;",
      alt: "&diams;",
    },
    {
      value: "&upsih;",
      alt: "&upsih;",
    },
    {
      value: "&piv;",
      alt: "&piv;",
    },
    {
      value: "&otilde;",
      alt: "&otilde;",
    },
    {
      value: "&ouml;",
      alt: "&ouml;",
    },
    {
      value: "&oslash;",
      alt: "&oslash;",
    },
    {
      value: "&ugrave;",
      alt: "&ugrave;",
    },
    {
      value: "&uacute;",
      alt: "&uacute;",
    },
    {
      value: "&ucirc;",
      alt: "&ucirc;",
    },
    {
      value: "&uuml;",
      alt: "&uuml;",
    },
    {
      value: "&yacute;",
      alt: "&yacute;",
    },
    {
      value: "&thorn;",
      alt: "&thorn;",
    },
    {
      value: "&yuml;",
      alt: "&yuml;",
    },
  ],
};
window.customElements.define(SimpleSymbolPicker.tag, SimpleSymbolPicker);
