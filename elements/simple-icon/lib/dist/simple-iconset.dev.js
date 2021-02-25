"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.pathResolver = pathResolver;
exports.pathFromUrl = pathFromUrl;
exports.SimpleIconsetStore = exports.SimpleIconset = void 0;

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
 * Singleton to manage iconsets
 * @demo demo/index.html
 */
// polyfill for replaceAll, I hate you Safari / really old stuff
if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function (find, replace) {
    return this.split(find).join(replace);
  };
}
/**
 *
 * @class SimpleIconset
 * @extends HTMLElement
 */

var SimpleIconset =
  /*#__PURE__*/
  (function (_HTMLElement) {
    _inherits(SimpleIconset, _HTMLElement);

    _createClass(SimpleIconset, null, [
      {
        key: "tag",
        get: function get() {
          return "simple-iconset";
        },
      },
    ]);

    function SimpleIconset() {
      var _this;

      _classCallCheck(this, SimpleIconset);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimpleIconset).call(this)
      );
      _this.iconsets = {};
      _this.iconlist = [];
      _this.manifest = {};
      _this.needsHydrated = [];
      return _this;
    }
    /**
     * Manifest.js files can register themselves to create an icon list.
     * These files export an array of iconsets
     * as [{name: iconsetName, icons: [ iconName,iconName2 ]}]
     *
     * @param {array} manifest array of iconsets
     * @memberof SimpleIconset
     */

    _createClass(SimpleIconset, [
      {
        key: "registerManifest",
        value: function registerManifest(manifest) {
          var _this2 = this;

          (manifest || []).forEach(function (iconset) {
            if (!_this2.manifest[iconset.name]) {
              _this2.manifest[iconset.name] = iconset.icons || [];

              _this2.manifest[iconset.name].forEach(function (icon) {
                _this2.iconlist.push("".concat(iconset.name, ":").concat(icon));
              });
            }
          });
        },
        /**
         * Iconsets are to register a namespace in either manner:
         * object notation: key name of the icon with a specific path to the file
         * {
         *   icon: iconLocation,
         *   icon2: iconLocation2
         * }
         * string notation: assumes icon name can be found at ${iconLocationBasePath}${iconname}.svg
         * iconLocationBasePath
         */
      },
      {
        key: "registerIconset",
        value: function registerIconset(name) {
          var _this3 = this;

          var icons =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : {};

          if (_typeof(icons) === "object") {
            this.iconsets[name] = _objectSpread({}, icons);
          } else if (typeof icons === "string") {
            this.iconsets[name] = icons;
          } // try processing anything that might have missed previously

          if (this.needsHydrated.length > 0) {
            var list = [];
            this.needsHydrated.forEach(function (item, index) {
              // set the src from interns of the icon, returns if it matched
              // which will then push it into the list to be removed from processing
              if (item.setSrcByIcon(_this3)) {
                list.push(index);
              }
            }); // process in reverse order to avoid key splicing issues

            list.reverse().forEach(function (val) {
              _this3.needsHydrated.splice(val, 1);
            });
          }
        },
        /**
         * return the icon location on splitting the string on : for position in the object
         * if the icon doesn't exist, it sets a value for future updates in the event
         * that the library for the icon registers AFTER the request to visualize is made
         */
      },
      {
        key: "getIcon",
        value: function getIcon(val, context) {
          var ary = val.replaceAll("/", "-").split(":"); // legacy API used to fill in icons: for lazy devs so let's mirror

          if (ary.length === 1) {
            ary = ["icons", val];
          }

          if (ary.length == 2 && this.iconsets[ary[0]]) {
            if (
              typeof this.iconsets[ary[0]] !== "string" &&
              this.iconsets[ary[0]][ary[1]] &&
              typeof this.iconsets[ary[0]][ary[1]] !== "function"
            ) {
              return this.iconsets[ary[0]][ary[1]];
            } else if (ary[1]) {
              return "".concat(this.iconsets[ary[0]]).concat(ary[1], ".svg");
            }
          } // if we get here we just missed on the icon hydrating which means
          // either it's an invalid icon OR the library to register the icons
          // location will import AFTER (possible microtiming early on)
          // also weird looking by context is either the element asking about
          // itself OR the the iconset state manager checking for hydration

          if (context != this) {
            this.needsHydrated.push(context);
          }

          return null;
        },
      },
    ]);

    return SimpleIconset;
  })(_wrapNativeSuper(HTMLElement));
/**
 * helper function for iconset developers to resolve relative paths
 */

exports.SimpleIconset = SimpleIconset;

function pathResolver(base) {
  var path =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  return pathFromUrl(decodeURIComponent(base)) + path;
} // simple path from url

function pathFromUrl(url) {
  return url.substring(0, url.lastIndexOf("/") + 1);
}

customElements.define(SimpleIconset.tag, SimpleIconset);
window.SimpleIconset = window.SimpleIconset || {};
/**
 * Checks to see if there is an instance available, and if not appends one
 */

window.SimpleIconset.requestAvailability = function () {
  if (window.SimpleIconset.instance == null) {
    window.SimpleIconset.instance = document.createElement("simple-iconset");
  }

  document.body.appendChild(window.SimpleIconset.instance);
  return window.SimpleIconset.instance;
}; // self request so that when this file is referenced it exists in the dom

var SimpleIconsetStore = window.SimpleIconset.requestAvailability();
exports.SimpleIconsetStore = SimpleIconsetStore;
