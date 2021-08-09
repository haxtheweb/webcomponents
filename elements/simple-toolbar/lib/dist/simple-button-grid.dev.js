"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleButtonGridBehaviors = exports.SimpleButtonGrid = void 0;

var _litElement = require("lit");

var _simpleToolbar = require("../simple-toolbar.js");

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

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    "\n          :host {\n            padding: 0;\n            margin: 0;\n            max-width: 100%;\n            display: flex;\n            overflow: hidden;\n            flex-direction: column;\n            align-items: stretch;\n            overflow: hidden !important;\n            --simple-button-grid-cols: var(\n              --simple-toolbar-button-min-width,\n              var(\n                --simple-toolbar-button-width,\n                var(--simple-toolbar-button-height, 24px)\n              )\n            );\n            transition: all 0.5s;\n          }\n          :host([hidden]) {\n            z-index: -1;\n            visibility: hidden;\n            opacity: 0;\n            height: 0;\n          }\n          #grid {\n            flex: 1 1 auto;\n            max-width: 100%;\n            overflow: auto;\n          }\n\n          #buttons {\n            flex: 0 1 100%;\n            max-width: 100%;\n            display: flex;\n            flex-wrap: wrap;\n            --simple-toolbar-button-flex: var(\n              --simple-toolbar-button-grid-flex,\n              1 1 100%\n            );\n          }\n          #buttons {\n            display: grid;\n            overflow: visible;\n            grid-gap: var(--simple-button-grid-margin, 4px);\n            grid-template-columns: repeat(\n              auto-fill,\n              minmax(\n                calc(\n                  var(--simple-button-grid-cols) - 2 *\n                    var(--simple-button-grid-margin, 4px)\n                ),\n                1fr\n              )\n            );\n          }\n          :host([collapsed]:not([always-expanded]))\n            ::slotted(*[collapse-hide]) {\n            display: none !important;\n          }\n        ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n        <div id="grid">\n          <div\n            id="buttons"\n            class="',
    '"\n            style="',
    '"\n            part="buttons"\n          >\n            <slot></slot>\n            ',
    "\n          </div>\n        </div>\n      ",
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
 * @customElement
 * @extends SimpleToolbarBehaviors
 * @class
 */
var SimpleButtonGridBehaviors = function SimpleButtonGridBehaviors(SuperClass) {
  return (
    /*#__PURE__*/
    (function (_SimpleToolbarBehavio) {
      _inherits(_class, _SimpleToolbarBehavio);

      _createClass(
        _class,
        [
          {
            key: "tag",

            /**
             * Store the tag name to make it easier to obtain directly.
             * @notice function name must be here for tooling to operate correctly
             */
            value: function tag() {
              return "simple-toolbar-grid";
            }, // render function for styles
          },
          {
            key: "_bottom",
            value: function _bottom(item) {
              return !!item && !!item.offsetTop && !!item.clientHeight
                ? item.offsetTop + item.clientHeight
                : undefined;
            },
          },
          {
            key: "resizeToolbar",
            value: function resizeToolbar() {
              var _this = this;

              if (this.alwaysExpanded) return;

              var more = !this.shadowRoot
                  ? undefined
                  : this.shadowRoot.querySelector("#morebutton"),
                morebottom = this._bottom(more),
                max = this._bottom(this),
                items = _toConsumableArray(this.children || []),
                shown = true,
                lastVisible,
                rows = [];

              items.forEach(function (item) {
                if (item.removeAttribute) item.removeAttribute("collapse-hide");

                if (rows.length == 0) {
                  rows.unshift(item.offsetTop);
                } else {
                  var newrow = item.offsetTop > rows[0];
                  if (newrow) rows.unshift(item.offsetTop);

                  if (
                    (!!_this.rows && rows.length > _this.rows) ||
                    (!_this.rows && newrow && _this._bottom(item) > max)
                  ) {
                    item.setAttribute("collapse-hide", true);
                    shown = false;
                  } else if (!shown) {
                    item.setAttribute("collapse-hide", true);
                  } else {
                    lastVisible = item;
                  }
                }
              });
              this.collapseDisabled =
                shown && !(more && lastVisible && this._bottom(more) > max);
              if (!this.collapseDisabled && lastVisible)
                lastVisible.setAttribute("collapse-hide", true);
            }, // life cycle
          },
          {
            key: "gridStyles",
            get: function get() {
              var styles = [];
              if (!!this.columns)
                styles.push(
                  "--simple-button-grid-cols:".concat(100 / this.columns, "%")
                );
              return styles.join(";");
            },
            /**
             * toolbar element's template
             *
             * @readonly
             * @memberof SimpleToolbar
             */
          },
          {
            key: "toolbarTemplate",
            get: function get() {
              return (0, _litElement.html)(
                _templateObject(),
                !this.alwaysExpanded && this.collapsed ? "collapsed" : "",
                this.gridStyles,
                this.alwaysExpanded ? "" : this.moreButton
              );
            },
          },
        ],
        [
          {
            key: "baseStyles",
            get: function get() {
              return [(0, _litElement.css)(_templateObject2())];
            }, // properties available to custom element for data binding
          },
          {
            key: "properties",
            get: function get() {
              return _objectSpread(
                {},
                _get(_getPrototypeOf(_class), "properties", this),
                {
                  columns: {
                    type: Number,
                    attribute: "columns",
                  },
                  rows: {
                    type: Number,
                    attribute: "rows",
                  },
                  disableAutogrow: {
                    type: Boolean,
                    attribute: "disable-autogrow",
                    reflect: true,
                  },
                }
              );
            },
          },
        ]
      );

      function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(
          this,
          _getPrototypeOf(_class).call(this)
        );
      }

      return _class;
    })((0, _simpleToolbar.SimpleToolbarBehaviors)(SuperClass))
  );
};
/**
 * `simple-toolbar`
 * a customizable toolbar
 *
### Styling

`<simple-toolbar>` provides following custom properties and mixins
for styling:

Custom property | Description | Default
----------------|-------------|----------
--simple-toolbar-border-color | default border color | transparent
--simple-toolbar-border-width | default border width | 1px
--simple-toolbar-group-border-color | border color for button groups | --simple-toolbar-border-color
--simple-toolbar-group-border-width | border width for button groups | --simple-toolbar-border-width
--simple-toolbar-group-padding | padding for button groups | 0 3px
 * 
 * @customElement
 * @extends SimpleButtonGridBehaviors
 * @extends LitElement
 * @lit-html
 * @lit-element
 * @demo demo/grid.html
 */

exports.SimpleButtonGridBehaviors = SimpleButtonGridBehaviors;

var SimpleButtonGrid =
  /*#__PURE__*/
  (function (_SimpleButtonGridBeha) {
    _inherits(SimpleButtonGrid, _SimpleButtonGridBeha);

    function SimpleButtonGrid() {
      _classCallCheck(this, SimpleButtonGrid);

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimpleButtonGrid).apply(this, arguments)
      );
    }

    return SimpleButtonGrid;
  })(SimpleButtonGridBehaviors(_litElement.LitElement));

exports.SimpleButtonGrid = SimpleButtonGrid;
customElements.define("simple-button-grid", SimpleButtonGrid);
