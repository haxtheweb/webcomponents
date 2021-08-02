"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxContextBehaviors = void 0;

var _litElement = require("lit-element/lit-element.js");

var _SimpleTourFinder2 = require("@lrnwebcomponents/simple-popover/lib/SimpleTourFinder");

var _mobx = require("mobx");

var _haxStore = require("./hax-store.js");

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
  var data = _taggedTemplateLiteral(["<slot></slot> "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    "\n          :host {\n            display: block;\n            pointer-events: none;\n            --hax-ui-spacing-sm: 1px;\n          }\n          :host [hidden] {\n            display: none;\n          }\n          .selected-buttons {\n            transition: 0.1s all ease-in-out;\n            width: 0;\n          }\n          :host([has-selected-text]) .selected-buttons {\n            width: 100%;\n          }\n          :host(.hax-context-pin-top) #toolbar {\n            position: fixed;\n            top: 0px;\n          }\n          :host(:hover),\n          :host(:focus-within) {\n            z-index: var(--hax-ui-focus-z-index) !important;\n          }\n          .group {\n            padding: 0;\n            background-color: var(--hax-ui-background-color);\n          }\n          hax-toolbar {\n            flex: 0 1 auto;\n            border: none !important;\n          }\n          hax-toolbar[collapse-disabled]::part(morebutton) {\n            display: none !important;\n          }\n          hax-toolbar *[hidden] {\n            display: none !important;\n          }\n          hax-toolbar[collapse-disabled]::part(morebutton) {\n            display: none !important;\n          }\n        ",
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
 *
 * @customElement
 * @extends LitElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
var HaxContextBehaviors = function HaxContextBehaviors(SuperClass) {
  return (
    /*#__PURE__*/
    (function (_SimpleTourFinder) {
      _inherits(_class, _SimpleTourFinder);

      _createClass(_class, null, [
        {
          key: "styles",

          /**
           * LitElement constructable styles enhancement
           */
          get: function get() {
            return [(0, _litElement.css)(_templateObject())];
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
        _this.viewSource = false;
        (0, _mobx.autorun)(function () {
          _this.hasSelectedText =
            (0, _mobx.toJS)(_haxStore.HAXStore.haxSelectedText).length > 0;
        });
        (0, _mobx.autorun)(function () {
          // this just forces this block to run when editMode is modified
          var editMode = (0, _mobx.toJS)(_haxStore.HAXStore.editMode);
          var activeNode = (0, _mobx.toJS)(_haxStore.HAXStore.activeNode); //this.viewSource = false;

          if (activeNode && activeNode.tagName) {
            var schema = _haxStore.HAXStore.haxSchemaFromTag(
              activeNode.tagName
            );

            _this.parentSchema =
              activeNode && activeNode.parentNode
                ? _haxStore.HAXStore.haxSchemaFromTag(
                    activeNode.parentNode.tagName
                  )
                : undefined; //this.sourceView = schema.canEditSource;
          }
        });
        return _this;
      }

      _createClass(
        _class,
        [
          {
            key: "render",
            value: function render() {
              return (0, _litElement.html)(_templateObject2());
            },
          },
          {
            key: "updated",
            value: function updated(changedProperties) {
              var _this2 = this;

              if (_get(_getPrototypeOf(_class.prototype), "updated", this))
                _get(_getPrototypeOf(_class.prototype), "updated", this).call(
                  this,
                  changedProperties
                );
              changedProperties.forEach(function (oldValue, propName) {
                if (propName === "activeNode" && _this2.activeNode !== oldValue)
                  _this2.setTarget(_this2.activeNode);
              });
            },
          },
          {
            key: "setTarget",
            value: function setTarget() {
              var node =
                arguments.length > 0 && arguments[0] !== undefined
                  ? arguments[0]
                  : this.activeNode;
              if (_get(_getPrototypeOf(_class.prototype), "setTarget", this))
                _get(_getPrototypeOf(_class.prototype), "setTarget", this).call(
                  this,
                  node
                );
              this.parentSchema =
                node && node.parentNode
                  ? _haxStore.HAXStore.haxSchemaFromTag(node.parentNode.tagName)
                  : undefined;
            },
          },
          {
            key: "slotSchema",
            get: function get() {
              var _this3 = this;

              var schema;

              if (this.activeNode && this.parentSchema) {
                var slot = this.activeNode.slot || "";
                Object.keys(this.parentSchema.settings || {}).forEach(function (
                  type
                ) {
                  (_this3.parentSchema.settings[type] || []).forEach(function (
                    setting
                  ) {
                    if (setting.slot && setting.slot === slot) schema = setting;
                  });
                });
              }

              return schema;
            },
          },
        ],
        [
          {
            key: "tag",
            get: function get() {
              return "hax-context-behaviors";
            },
          },
          {
            key: "properties",
            get: function get() {
              return _objectSpread(
                {},
                _get(_getPrototypeOf(_class), "properties", this),
                {
                  activeNode: {
                    type: Object,
                  },
                  parentSchema: {
                    type: Object,
                  },
                  realSelectedValue: {
                    type: String,
                  },
                  sourceView: {
                    type: Boolean,
                  },
                  viewSource: {
                    type: Boolean,
                    reflect: true,
                    attribute: "view-source",
                  },
                }
              );
            },
          },
        ]
      );

      return _class;
    })((0, _SimpleTourFinder2.SimpleTourFinder)(SuperClass))
  );
};

exports.HaxContextBehaviors = HaxContextBehaviors;
