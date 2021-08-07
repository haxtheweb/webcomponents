"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxPlateContext = void 0;

var _litElement = require("lit-element/lit-element.js");

require("@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-menu-item.js");

var _haxStore = require("./hax-store.js");

require("./hax-toolbar-menu.js");

require("./hax-toolbar.js");

require("./hax-context-item.js");

var _utils = require("@lrnwebcomponents/utils/utils");

var _mobx = require("mobx");

var _haxContextBehaviors = require("./hax-context-behaviors.js");

var _utils2 = require("@lrnwebcomponents/utils/utils.js");

var _I18NMixin2 = require("@lrnwebcomponents/i18n-manager/lib/I18NMixin.js");

var _simpleToast = require("@lrnwebcomponents/simple-toast/simple-toast");

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

function _templateObject5() {
  var data = _taggedTemplateLiteral([
    "\n        :host {\n          width: 100%;\n          align-items: stretch;\n        }\n        *::part(morebutton) {\n          --simple-toolbar-button-color: var(--hax-ui-color);\n          --simple-toolbar-button-bg: var(--hax-ui-background-color);\n          --simple-toolbar-button-border-color: transparent;\n          --simple-toolbar-button-hover-color: var(--hax-ui-color);\n          --simple-toolbar-button-hover-bg: var(\n            --hax-ui-background-color-secondary\n          );\n          --simple-toolbar-button-toggled-color: var(--hax-ui-color-accent);\n          --simple-toolbar-button-toggled-bg: var(--hax-ui-background-color);\n          --simple-toolbar-button-toggled-border-color: var(\n            --hax-ui-color-accent\n          );\n          --simple-toolbar-button-disabled-opacity: 1;\n          --simple-toolbar-button-disabled-color: var(\n            --hax-ui-disabled-color\n          );\n          --simple-toolbar-button-disabled-bg: var(--hax-ui-background-color);\n          --simple-toolbar-button-disabled-border-color: transparent;\n          align-self: flex-end;\n        }\n        #remove {\n          max-width: 44px;\n          overflow: visible;\n        }\n        hax-toolbar {\n          max-width: 100%;\n          display: flex;\n          align-items: stretch;\n          justify-content: flex-start;\n          margin-bottom: -1px;\n          margin-left: 1px;\n        }\n        .group {\n          display: flex;\n          align-items: stretch;\n          flex: 1 0 auto;\n          justify-content: center;\n          border: 1px solid var(--rich-text-editor-border-color, #ddd);\n          padding: 0;\n        }\n        .group,\n        .group > * {\n          z-index: 1;\n        }\n        .group:empty {\n          display: none;\n        }\n        .group > *,\n        :host([collapsed]) .group {\n          flex: 0 0 auto;\n        }\n        .group *:not([toggled])::part(button) {\n          border-color: transparent;\n        }\n        :host .group:focus,\n        :host .group:focus-within,\n        :host .group > *:focus,\n        :host .group > *:focus-within {\n          z-index: 2;\n        }\n        :host .group:hover,\n        :host .group > *:hover {\n          z-index: 3;\n        }\n        .first-slot {\n          border-top: 1px solid black;\n        }\n      ",
  ]);

  _templateObject5 = function _templateObject5() {
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

function _templateObject4() {
  var data = _taggedTemplateLiteral([
    ' <hax-context-item\n              action\n              icon="',
    '"\n              label="',
    '"\n              event-name="hax-ce-custom-button"\n              value="',
    '"\n              ?disabled="',
    '"\n            ></hax-context-item>',
  ]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    '\n                <simple-toolbar-menu-item\n                  slot="menuitem"\n                  class="move-to-slot ',
    '"\n                >\n                  <hax-context-item\n                    action\n                    align-horizontal="left"\n                    ?disabled="',
    '"\n                    icon="icons:arrow-forward"\n                    show-text-label\n                    role="menuitem"\n                    event-name="insert-into-active"\n                    data-slot="',
    '"\n                    label="',
    '"\n                  ></hax-context-item>\n                </simple-toolbar-menu-item>\n              ',
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n                <simple-toolbar-menu-item\n                  slot="menuitem"\n                  class="move-to-slot ',
    '"\n                >\n                  <hax-context-item\n                    action\n                    align-horizontal="left"\n                    ?disabled="',
    '"\n                    icon="icons:arrow-forward"\n                    show-text-label\n                    role="menuitem"\n                    data-slot="',
    '"\n                    @click="',
    '"\n                    label="',
    '"\n                  ></hax-context-item>\n                </simple-toolbar-menu-item>\n              ',
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n      <hax-toolbar>\n        <div class="group">\n          <hax-toolbar-menu\n            ?disabled="',
    '"\n            id="drag"\n            action\n            icon="hax:arrow-all"\n            label="',
    '"\n            draggable="true"\n            reset-on-select\n            data-simple-tour-stop\n            data-stop-title="label"\n            ?hidden="',
    '"\n          >\n            <simple-toolbar-menu-item slot="menuitem">\n              <hax-context-item\n                action\n                align-horizontal="left"\n                ?disabled="',
    '"\n                show-text-label\n                role="menuitem"\n                icon="hax:keyboard-arrow-up"\n                label="',
    '"\n                event-name="hax-plate-up"\n              ></hax-context-item>\n            </simple-toolbar-menu-item>\n            <simple-toolbar-menu-item slot="menuitem">\n              <hax-context-item\n                action\n                align-horizontal="left"\n                ?disabled="',
    '"\n                role="menuitem"\n                show-text-label\n                icon="hax:keyboard-arrow-down"\n                label="',
    '"\n                event-name="hax-plate-down"\n              ></hax-context-item>\n            </simple-toolbar-menu-item>\n            ',
    '\n            <div slot="tour" data-stop-content>\n              Click the drag handle once to show a menu to just move up or down\n              one item in the content OR click and drag to place the item\n              exactly where you want it to go.\n            </div>\n          </hax-toolbar-menu>\n          <hax-context-item\n            action\n            align-horizontal="left"\n            ?disabled="',
    '"\n            ?hidden="',
    '"\n            .icon="',
    '"\n            label="',
    " ",
    '"\n            data-simple-tour-stop\n            data-stop-title="label"\n            event-name="select-parent-grid"\n          >\n            <div slot="tour" data-stop-content>\n              Selects the element\'s parent label.\n            </div>\n          </hax-context-item>\n          <hax-context-item\n            action\n            more\n            .icon="',
    '"\n            label="',
    '"\n            tooltip="',
    ", ",
    '"\n            ?disabled="',
    '"\n            event-name="hax-transform-node"\n            show-text-label\n          ></hax-context-item>\n          <slot name="primary"></slot>\n          <hax-toolbar-menu\n            icon="add"\n            label="',
    '"\n            ?disabled="',
    '"\n          >\n            <simple-toolbar-menu-item slot="menuitem">\n              <hax-context-item\n                action\n                align-horizontal="left"\n                show-text-label\n                role="menuitem"\n                icon="hardware:keyboard-arrow-up"\n                event-name="insert-above-active"\n                label="',
    '"\n              ></hax-context-item>\n            </simple-toolbar-menu-item>\n            <simple-toolbar-menu-item slot="menuitem">\n              <hax-context-item\n                action\n                align-horizontal="left"\n                show-text-label\n                role="menuitem"\n                icon="hardware:keyboard-arrow-down"\n                event-name="insert-below-active"\n                label="',
    '"\n                ?disabled="',
    '"\n              ></hax-context-item>\n            </simple-toolbar-menu-item>\n            ',
    '\n          </hax-toolbar-menu>\n          <hax-context-item\n            action\n            ?disabled="',
    '"\n            label="',
    '"\n            icon="icons:content-copy"\n            event-name="hax-plate-duplicate"\n            data-simple-tour-stop\n            data-stop-title="label"\n          >\n            <div slot="tour" data-stop-content>\n              Duplicate the active piece of content and place it below the\n              current item.\n            </div>\n          </hax-context-item>\n        </div>\n        <div class="group">\n          <hax-toolbar-menu\n            id="remove"\n            action\n            ?disabled="',
    '"\n            icon="delete"\n            label="',
    '"\n            reset-on-select\n            data-simple-tour-stop\n            data-stop-title="label"\n          >\n            <simple-toolbar-menu-item slot="menuitem">\n              <hax-context-item\n                action\n                danger\n                align-horizontal="left"\n                show-text-label\n                role="menuitem"\n                icon="delete"\n                label="',
    '"\n                event-name="hax-plate-delete"\n              ></hax-context-item>\n            </simple-toolbar-menu-item>\n            <div slot="tour" data-stop-content>\n              Delete the current item. You can always use the undo arrow to\n              bring this back.\n            </div>\n          </hax-toolbar-menu>\n          ',
    '\n          <hax-context-item\n            action\n            id="right"\n            class="paddle"\n            icon="hax:table-column-remove"\n            label="',
    '"\n            ?disabled="',
    '"\n            event-name="hax-plate-create-right"\n            ?hidden="',
    '"\n            data-simple-tour-stop\n            data-stop-title="label"\n          >\n            <div slot="tour" data-stop-content>\n              Add a column to split the current column into two pieces. This can\n              be done up to six pieces columns. For differnet layouts see Grid\n              settings panel.\n            </div>\n          </hax-context-item>\n          <hax-context-item\n            action\n            class="paddle"\n            icon="hax:table-column-plus-after"\n            label="',
    '"\n            ?disabled="',
    '"\n            event-name="hax-plate-remove-right"\n            ?hidden="',
    '"\n            id="rightremove"\n            data-simple-tour-stop\n            data-stop-title="label"\n          >\n            <div slot="tour" data-stop-content>\n              Remove a column from the split column layout. If at two columns\n              and removing it will remove the layout split and make it 100%\n              width.\n            </div>\n          </hax-context-item>\n          <slot name="secondary"></slot>\n        </div>\n        <div class="group">\n          <hax-context-item\n            action\n            icon="icons:code"\n            label="',
    '"\n            ?disabled="',
    '"\n            event-name="hax-source-view-toggle"\n            toggles\n            ?toggled="',
    '"\n          ></hax-context-item>\n          <slot name="more"></slot>\n          <hax-context-item\n            icon="build"\n            action\n            align-horizontal="left"\n            ?disabled="',
    '"\n            label="',
    '"\n            data-simple-tour-stop\n            data-stop-title="label"\n            event-name="content-edit"\n            toggles\n            ?toggled="',
    '"\n          >\n            <div slot="tour" data-stop-content>\n              Opens the Edit panel for more advanced settings.\n            </div>\n          </hax-context-item>\n        </div>\n      </hax-toolbar>\n    ',
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
  (function (_I18NMixin) {
    _inherits(HaxPlateContext, _I18NMixin);

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
      _this.trayDetail = "content-edit";
      _this.trayStatus = "collapsed";
      _this.t = {
        edit: "Edit",
        dragHandle: "Drag handle",
        moveUp: "Move up",
        moveDown: "Move down",
        addColumn: "Add column",
        removeColumn: "Remove column",
        remove: "Remove",
        duplicate: "Duplicate",
        confirmDelete: "Confirm delete",
        changeTo: "Change to",
        modifyHTMLSource: "Modify HTML source",
        clickToChange: "Click to change",
        regions: "Available regions",
        insertItemAbove: "Insert item above",
        insertItemAboveOrBelow: "Insert item above or below",
        insertItemBelow: "Insert item below",
        selectLayout: "Select",
      };

      _this.registerLocalization({
        context: _assertThisInitialized(_this),
        namespace: "hax",
      }); //this.onScreen = false;

      _this.ceButtons = [];
      _this.activeTagName = "";
      _this.activeTagIcon = "hax:paragraph";

      _this.addEventListener(
        "hax-context-item-selected",
        _this.handleCECustomEvent.bind(_assertThisInitialized(_this))
      );

      return _this;
    }

    _createClass(
      HaxPlateContext,
      [
        {
          key: "render",
          value: function render() {
            var _this2 = this;

            return (0, _litElement.html)(
              _templateObject(),
              this.hasActiveEditingElement ||
                !this.canMoveElement ||
                this.viewSource,
              this.t.dragHandle,
              !this.canMoveElement,
              this.hasActiveEditingElement,
              this.t.moveUp,
              this.hasActiveEditingElement,
              this.t.moveDown,
              (this.siblingSlots || []).map(function (slot, i) {
                return (0, _litElement.html)(
                  _templateObject2(),
                  i < 1 ? "first-slot" : "",
                  _this2.activeNode && slot.slot === _this2.activeNode.slot,
                  slot,
                  function (e) {
                    return _this2._handleMoveSlot(slot);
                  },
                  slot.title || slot.slot
                );
              }),
              this.viewSource,
              !this.isGridLayoutSlot,
              this.gridIcon,
              this.t.selectLayout,
              this.gridLabel,
              this.activeTagIcon,
              this.t.changeTo,
              this.activeTagName,
              this.t.clickToChange,
              this.disableTransform || this.viewSource,
              this.t.insertItemAboveOrBelow,
              this.viewSource,
              this.t.insertItemAbove,
              this.t.insertItemBelow,
              this.viewSource,
              (this.childSlots || []).map(function (slot, i) {
                return (0,
                _litElement.html)(_templateObject3(), i < 1 ? "first-slot" : "", _this2.activeNode && slot.slot === _this2.activeNode.slot, slot.slot, slot.title || slot.slot);
              }),
              this.hasActiveEditingElement || this.viewSource,
              this.t.duplicate,
              this.hasActiveEditingElement || this.viewSource,
              this.t.remove,
              this.t.confirmDelete,
              this.ceButtons.map(function (el) {
                return (0,
                _litElement.html)(_templateObject4(), el.icon, el.label, el.callback, _this2.viewSource);
              }),
              this.t.addColumn,
              this.hasActiveEditingElement || this.viewSource,
              !this.isGridPlate(),
              this.t.removeColumn,
              this.hasActiveEditingElement || this.viewSource,
              !this.isGridPlate(),
              this.t.modifyHTMLSource,
              !this.sourceView,
              this.viewSource,
              this.hasActiveEditingElement || this.viewSource,
              this.t.edit,
              this.trayDetail === "content-edit" &&
                this.trayStatus !== "collapsed"
            );
          },
        },
        {
          key: "isGridPlate",
          value: function isGridPlate() {
            var node =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : this.activeNode;
            return node && node.tagName && node.tagName === "GRID-PLATE";
          },
        },
        {
          key: "gridPlateSlots",
          value: function gridPlateSlots() {
            var layout =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : "1-1-1-1-1-1";

            var slotConfig = function slotConfig(num) {
                var slot = "col-".concat(num),
                  label = "Column ".concat(num),
                  config = {
                    slot: slot,
                    title: label,
                    excludedSlotWrappers: ["grid-plate"],
                  };
                return config;
              },
              slots = layout.split("-");

            slots = slots.map(function (col, num) {
              return slotConfig(num + 1);
            });
            return slots;
          },
        },
        {
          key: "_handleMoveSlot",
          value: function _handleMoveSlot(slot) {
            this.activeNode.slot = slot.slot;
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
          key: "__dblClickFire",
          value: function __dblClickFire(event) {
            if (event.target.id === "remove") {
              this.dispatchEvent(
                new CustomEvent("hax-context-item-selected", {
                  bubbles: true,
                  cancelable: true,
                  composed: true,
                  detail: {
                    target: event.target,
                    eventName: "hax-plate-delete",
                    value: event.target.value,
                  },
                })
              );
            }
          },
        },
        {
          key: "_handleOpen",
          value: function _handleOpen(e) {
            this.dispatchEvent(
              new CustomEvent("ax-transform-node", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: _haxStore.HAXStore.elementList[el],
              })
            );
          },
        },
        {
          key: "handleCECustomEvent",
          value: function handleCECustomEvent(e) {
            var detail = e.detail; // support a simple insert event to bubble up or everything else

            switch (detail.eventName) {
              case "hax-ce-custom-button":
                if (
                  this.activeNode &&
                  typeof this.activeNode[detail.value] === "function"
                ) {
                  if (this.activeNode[detail.value](e)) {
                    _haxStore.HAXStore.refreshActiveNodeForm();
                  }
                }

                break;
            }
          },
        },
        {
          key: "updated",
          value: function updated(changedProperties) {
            var _this3 = this;

            if (
              _get(_getPrototypeOf(HaxPlateContext.prototype), "updated", this)
            ) {
              _get(
                _getPrototypeOf(HaxPlateContext.prototype),
                "updated",
                this
              ).call(this, changedProperties);
            }

            changedProperties.forEach(function (oldValue, propName) {
              if (propName === "onScreen" && _this3.onScreen) {
                _this3._resetCEMenu();
              }

              if (propName === "formatBlocks")
                _this3.disableTransform = _this3.filteredBlocks.length < 1;
            });
          },
        },
        {
          key: "firstUpdated",
          value: function firstUpdated(changedProperties) {
            var _this4 = this;

            _get(
              _getPrototypeOf(HaxPlateContext.prototype),
              "firstUpdated",
              this
            ).call(this, changedProperties);

            (0, _mobx.autorun)(function () {
              _this4.activeNode = (0, _mobx.toJS)(
                _haxStore.HAXStore.activeNode
              );

              if (_this4.activeNode && _this4.activeNode.classList) {
                _this4._resetCEMenu();
              }

              if (_this4.activeNode && _this4.getAttribute("on-screen")) {
                _this4.__updatePlatePosition(_this4.activeNode);
              }
            });
            (0, _mobx.autorun)(function () {
              if ((0, _mobx.toJS)(_haxStore.HAXStore.activeEditingElement)) {
                _this4.hasActiveEditingElement = true;
              } else {
                _this4.hasActiveEditingElement = false;
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
            var menu = (0, _utils2.normalizeEventPath)(e)
              ? (0, _utils2.normalizeEventPath)(e)[0]
              : undefined;
            if (menu) menu.close(true);
            _haxStore.HAXStore._lockContextPosition = false;
          },
          /**
           * Drag start so we know what target to set
           */
        },
        {
          key: "_dragStart",
          value: function _dragStart(e) {
            var target = (0, _mobx.toJS)(_haxStore.HAXStore.activeNode),
              menu = (0, _utils2.normalizeEventPath)(e)
                ? (0, _utils2.normalizeEventPath)(e)[0]
                : undefined;
            if (menu) menu.close(true);
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
           * HAX properties changed, update buttons available.
           */
        },
        {
          key: "_resetCEMenu",
          value: function _resetCEMenu() {
            var schema, elements, tag, primTag;
            return regeneratorRuntime.async(
              function _resetCEMenu$(_context) {
                while (1) {
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      if (this.shadowRoot) {
                        (0, _utils.wipeSlot)(this, "*");
                      } // reset buttons in-case this element has new ones

                      this.ceButtons = [];

                      if (
                        !(
                          _haxStore.HAXStore.activeHaxBody &&
                          this.activeNode != null
                        )
                      ) {
                        _context.next = 19;
                        break;
                      }

                      schema = _haxStore.HAXStore.haxSchemaFromTag(
                        this.activeNode.tagName
                      );
                      this.sourceView = schema.canEditSource;

                      if (!this.activeNode) {
                        _context.next = 16;
                        break;
                      }

                      _context.next = 8;
                      return regeneratorRuntime.awrap(
                        _haxStore.HAXStore.activeHaxBody.replaceElementWorkflow(
                          this.activeNode,
                          true
                        )
                      );

                    case 8:
                      _context.t0 = _context.sent;

                      if (_context.t0) {
                        _context.next = 11;
                        break;
                      }

                      _context.t0 = [];

                    case 11:
                      elements = _context.t0;
                      tag =
                        !!this.activeNode && !!this.activeNode.tagName
                          ? this.activeNode.tagName.toLowerCase()
                          : undefined;
                      primTag = _haxStore.HAXStore.activeHaxBody.primitiveTextBlocks.includes(
                        tag
                      )
                        ? "p"
                        : undefined;
                      this.formatBlocks = !!tag
                        ? elements.filter(function (el) {
                            return el.tag && ![tag, primTag].includes(el.tag);
                          })
                        : elements;
                      this.disableTransform =
                        this.filteredBlocks.length === 0 ? true : false;

                    case 16:
                      if (_haxStore.HAXStore.activeGizmo) {
                        this.activeTagName =
                          _haxStore.HAXStore.activeGizmo.title;
                        this.activeTagIcon =
                          _haxStore.HAXStore.activeGizmo.icon;
                      }

                      _context.next = 20;
                      break;

                    case 19:
                      if (_haxStore.HAXStore.activeGizmo) {
                        this.activeTagName =
                          _haxStore.HAXStore.activeGizmo.title;
                        this.activeTagIcon =
                          _haxStore.HAXStore.activeGizmo.icon;
                      } else {
                        this.activeTagName = "";
                        this.activeTagIcon = "";
                      }

                    case 20:
                      _context.next = 22;
                      return regeneratorRuntime.awrap(
                        _haxStore.HAXStore.runHook(
                          this.activeNode,
                          "inlineContextMenu",
                          [this]
                        )
                      );

                    case 22:
                    case "end":
                      return _context.stop();
                  }
                }
              },
              null,
              this
            );
          },
          /**
           * LitElement / popular convention
           */
        },
        {
          key: "childSlots",
          get: function get() {
            var oldGrid = this.isGridPlate(),
              selfSchema = this.activeNode
                ? _haxStore.HAXStore.haxSchemaFromTag(this.activeNode.tagName)
                : undefined;
            return oldGrid
              ? this.gridPlateSlots(this.activeNode.layout)
              : _haxStore.HAXStore.isGridPlateElement(this.activeNode)
              ? _haxStore.HAXStore.slotsFromSchema(selfSchema || {})
              : [];
          },
        },
        {
          key: "siblingSlots",
          get: function get() {
            var oldGrid = this.isGridPlate(this.activeNode.parentNode);
            return oldGrid
              ? this.gridPlateSlots(this.activeNode.parentNode.layout)
              : _haxStore.HAXStore.isGridPlateElement(
                  this.activeNode.parentNode
                )
              ? _haxStore.HAXStore.slotsFromSchema(this.parentSchema || {})
              : [];
          },
        },
        {
          key: "gridIcon",
          get: function get() {
            return this.gridProperties ? this.gridProperties.icon : undefined;
          },
        },
        {
          key: "gridLabel",
          get: function get() {
            return this.gridProperties
              ? this.gridProperties.title || this.gridProperties.tag
              : "";
          },
        },
        {
          key: "gridProperties",
          get: function get() {
            return this.isGridLayoutSlot && this.parentSchema.gizmo
              ? this.parentSchema.gizmo
              : undefined;
          },
        },
        {
          key: "filteredBlocks",
          get: function get() {
            return this.getFilteredBlocks(this.formatBlocks);
          },
        },
        {
          key: "isGridLayoutSlot",
          get: function get() {
            return _haxStore.HAXStore.isGridPlateElement(
              this.activeNode.parentNode
            );
          },
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
              [(0, _litElement.css)(_templateObject5())]
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
                activeTagIcon: {
                  type: String,
                },
                activeTagName: {
                  type: String,
                },
                canMoveElement: {
                  type: Boolean,
                },
                ceButtons: {
                  type: Array,
                },
                disableTransform: {
                  type: Boolean,
                },
                hasActiveEditingElement: {
                  type: Boolean,
                },
                onScreen: {
                  type: Boolean,
                  attribute: "on-screen",
                  reflect: true,
                },
                sourceView: {
                  type: Boolean,
                },
                formatBlocks: {
                  type: Array,
                },

                /**
                 * is hax tray collapsed, side-panel, or full-panel
                 */
                trayDetail: {
                  type: String,
                  reflect: true,
                  attribute: "tray-detail",
                },

                /**
                 * is hax tray collapsed, side-panel, or full-panel
                 */
                trayStatus: {
                  type: String,
                  reflect: true,
                  attribute: "tray-status",
                },
              }
            );
          },
        },
      ]
    );

    return HaxPlateContext;
  })(
    (0, _I18NMixin2.I18NMixin)(
      (0, _haxContextBehaviors.HaxContextBehaviors)(_litElement.LitElement)
    )
  );

exports.HaxPlateContext = HaxPlateContext;
window.customElements.define(HaxPlateContext.tag, HaxPlateContext);
