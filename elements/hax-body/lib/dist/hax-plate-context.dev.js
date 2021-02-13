"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxPlateContext = void 0;

var _litElement = require("lit-element/lit-element.js");

var _SimpleTourFinder2 = require("@lrnwebcomponents/simple-popover/lib/SimpleTourFinder");

var _haxToolbar = require("@lrnwebcomponents/hax-body/lib/hax-toolbar.js");

var _haxStore = require("./hax-store.js");

require("./hax-button-menu.js");

require("./hax-button-menu-item.js");

require("./hax-context-item.js");

var _mobx = require("mobx");

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
    "\n        :host,\n        #buttons {\n          flex-wrap: nowrap;\n          flex: 0 0 auto;\n          align-self: flex-end;\n        }\n      ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
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

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n      <div class="area" id="buttons">\n        <hax-button-menu\n          ?disabled="',
    '"\n          id="drag"\n          action\n          icon="hax:arrow-all"\n          label="Drag handle"\n          draggable="true"\n          reset-on-select\n          data-simple-tour-stop\n          data-stop-title="label"\n        >\n          <hax-button-menu-item slot="menuitem">\n            <hax-context-item\n              action\n              ?disabled="',
    '"\n              show-text-label\n              role="menuitem"\n              icon="hax:keyboard-arrow-up"\n              label="Move up"\n              event-name="hax-plate-up"\n            ></hax-context-item>\n          </hax-button-menu-item>\n          <hax-button-menu-item slot="menuitem">\n            <hax-context-item\n              action\n              ?disabled="',
    '"\n              role="menuitem"\n              show-text-label\n              icon="hax:keyboard-arrow-down"\n              label="Move down"\n              event-name="hax-plate-down"\n            ></hax-context-item>\n          </hax-button-menu-item>\n          <div slot="tour" data-stop-content>\n            Click the drag handle once to show a menu to just move up or down\n            one item in the content OR click and drag to place the item exactly\n            where you want it to go.\n          </div>\n        </hax-button-menu>\n        <hax-context-item\n          action\n          id="right"\n          class="paddle"\n          icon="hax:table-column-remove"\n          label="Add column"\n          ?disabled="',
    '"\n          event-name="hax-plate-create-right"\n          data-simple-tour-stop\n          data-stop-title="label"\n        >\n          <div slot="tour" data-stop-content>\n            Add a column to split the current column into two pieces. This can\n            be done up to six pieces columns. For differnet layouts see Grid\n            settings panel.\n          </div>\n        </hax-context-item>\n        <hax-context-item\n          action\n          class="paddle"\n          icon="hax:table-column-plus-after"\n          label="Remove column"\n          ?disabled="',
    '"\n          event-name="hax-plate-remove-right"\n          id="rightremove"\n          data-simple-tour-stop\n          data-stop-title="label"\n        >\n          <div slot="tour" data-stop-content>\n            Remove a column from the split column layout. If at two columns and\n            removing it will remove the layout split and make it 100% width.\n          </div>\n        </hax-context-item>\n        <hax-context-item\n          action\n          ?disabled="',
    '"\n          label="Duplicate"\n          icon="icons:content-copy"\n          event-name="hax-plate-duplicate"\n          data-simple-tour-stop\n          data-stop-title="label"\n        >\n          <div slot="tour" data-stop-content>\n            Duplicate the active piece of content and place it below the current\n            item.\n          </div>\n        </hax-context-item>\n        <hax-button-menu\n          id="drag"\n          danger\n          action\n          ?disabled="',
    '"\n          icon="delete"\n          label="Remove"\n          reset-on-select\n          data-simple-tour-stop\n          data-stop-title="label"\n        >\n          <hax-button-menu-item slot="menuitem">\n            <hax-context-item\n              action\n              danger\n              ?disabled="',
    '"\n              show-text-label\n              role="menuitem"\n              icon="delete"\n              label="Confirm Delete"\n              event-name="hax-plate-delete"\n            ></hax-context-item>\n          </hax-button-menu-item>\n          <div slot="tour" data-stop-content>\n            Delete the current item. You can always use the undo arrow to bring\n            this back.\n          </div>\n        </hax-button-menu>\n      </div>\n    ',
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

/**
 * `hax-plate-context`
 * `A context menu that provides common grid plate based authoring options.`
 * @microcopy - the mental model for this element
 * - context menu - this is a menu of text based buttons and events for use in a larger solution.
 * - grid plate - the container / full HTML tag which can have operations applied to it.
 */
var HaxPlateContext =
  /*#__PURE__*/
  (function (_SimpleTourFinder) {
    _inherits(HaxPlateContext, _SimpleTourFinder);

    /**
     * LitElement constructable styles enhancement
     */
    function HaxPlateContext() {
      var _this;

      _classCallCheck(this, HaxPlateContext);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxPlateContext).call(this)
      );
      _this.hasActiveEditingElement = false;
      _this.haxUIElement = true;
      _this.tourName = "hax";
      return _this;
    }

    _createClass(
      HaxPlateContext,
      [
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(
              _templateObject(),
              this.hasActiveEditingElement,
              this.hasActiveEditingElement,
              this.hasActiveEditingElement,
              this.hasActiveEditingElement,
              this.hasActiveEditingElement,
              this.hasActiveEditingElement,
              this.hasActiveEditingElement,
              this.hasActiveEditingElement
            );
          },
        },
        {
          key: "__updatePlatePosition",
          value: function __updatePlatePosition(active) {
            var right = this.shadowRoot.querySelector("#right");
            var rightremove = this.shadowRoot.querySelector("#rightremove"); // support for enabling or disabling

            right.disabled = false;
            rightremove.disabled = false;

            if (active && active.tagName == "GRID-PLATE") {
              if (active.layout == "1-1-1-1-1-1") {
                right.disabled = true;
              }
            } else {
              rightremove.disabled = true;
            }
          },
        },
        {
          key: "firstUpdated",
          value: function firstUpdated(changedProperties) {
            var _this2 = this;

            _get(
              _getPrototypeOf(HaxPlateContext.prototype),
              "firstUpdated",
              this
            ).call(this, changedProperties);

            (0, _mobx.autorun)(function () {
              var activeNode = (0, _mobx.toJS)(_haxStore.HAXStore.activeNode);

              if (activeNode && _this2.getAttribute("on-screen")) {
                _this2.__updatePlatePosition(activeNode);
              }
            });
            (0, _mobx.autorun)(function () {
              if ((0, _mobx.toJS)(_haxStore.HAXStore.activeEditingElement)) {
                _this2.hasActiveEditingElement = true;
              } else {
                _this2.hasActiveEditingElement = false;
              }
            });
            this.shadowRoot
              .querySelector("#drag")
              .addEventListener("dragstart", this._dragStart);
            this.shadowRoot
              .querySelector("#drag")
              .addEventListener("dragend", this._dragEnd);
          },
          /**
           * When we end dragging ensure we remove the mover class.
           */
        },
        {
          key: "_dragEnd",
          value: function _dragEnd(e) {
            _haxStore.HAXStore._lockContextPosition = false;
          },
          /**
           * Drag start so we know what target to set
           */
        },
        {
          key: "_dragStart",
          value: function _dragStart(e) {
            var target = (0, _mobx.toJS)(_haxStore.HAXStore.activeNode);
            _haxStore.HAXStore.__dragTarget = target;
            _haxStore.HAXStore._lockContextPosition = true; // wipe the add context menu for motion

            _haxStore.HAXStore.activeHaxBody.__activeHover = null;

            _haxStore.HAXStore.activeHaxBody._hideContextMenu(
              _haxStore.HAXStore.activeHaxBody.contextMenus.add
            );

            if (e.dataTransfer) {
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.dropEffect = "move";
              e.dataTransfer.setDragImage(target, -20, -20);
            }

            e.stopPropagation();
            e.stopImmediatePropagation();
          },
          /**
           * LitElement / popular convention
           */
        },
      ],
      [
        {
          key: "tag",
          get: function get() {
            return "hax-plate-context";
          },
        },
        {
          key: "styles",
          get: function get() {
            return [].concat(
              _toConsumableArray(
                _get(_getPrototypeOf(HaxPlateContext), "styles", this)
              ),
              [(0, _litElement.css)(_templateObject2())]
            );
          },
        },
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              _get(_getPrototypeOf(HaxPlateContext), "properties", this),
              {
                hasActiveEditingElement: {
                  type: Boolean,
                },
              }
            );
          },
        },
      ]
    );

    return HaxPlateContext;
  })(
    (0, _SimpleTourFinder2.SimpleTourFinder)(
      (0, _haxToolbar.HaxToolbarBehaviors)(_litElement.LitElement)
    )
  );

exports.HaxPlateContext = HaxPlateContext;
window.customElements.define(HaxPlateContext.tag, HaxPlateContext);
