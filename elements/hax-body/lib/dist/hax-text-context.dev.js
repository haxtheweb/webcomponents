"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxTextContext = void 0;

var _litElement = require("lit-element/lit-element.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js");

require("@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js");

require("@lrnwebcomponents/hax-body/lib/hax-toolbar-menu.js");

require("@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-menu-item.js");

require("@lrnwebcomponents/hax-body/lib/hax-context-item.js");

require("@lrnwebcomponents/hax-body/lib/hax-context-item-textop.js");

require("@lrnwebcomponents/hax-body/lib/hax-toolbar.js");

var _haxStore = require("./hax-store.js");

var _mobx = require("mobx");

var _haxContextBehaviors = require("./hax-context-behaviors.js");

var _I18NMixin2 = require("@lrnwebcomponents/i18n-manager/lib/I18NMixin.js");

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

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    ' <simple-toolbar-menu-item slot="menuitem">\n                    <hax-context-item-textop\n                      action\n                      align-horizontal="left"\n                      role="menuitem"\n                      icon="',
    '"\n                      label="',
    '"\n                      show-text-label\n                      ?hidden="',
    '"\n                      event-name="',
    '"\n                      show-text-label\n                      @click="',
    '"\n                    ></hax-context-item-textop>\n                  </simple-toolbar-menu-item>',
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n      <div id="toolbar">\n        <hax-toolbar>\n          <div class="group">\n            <hax-toolbar-menu\n              id="textformat"\n              icon="',
    '"\n              label="Format"\n              show-text-label\n              data-simple-tour-stop\n              data-stop-title="label"\n            >\n              ',
    '\n              <div slot="tour" data-stop-content>\n                Change how the text is structured and visualized in the page.\n              </div>\n            </hax-toolbar-menu>\n            <!-- comment this in when rich-text-editor is viable -->\n            <!--\n            <hax-context-item\n              action\n              hidden\n              icon="icons:flip-to-back"\n              label="Full text editor"\n              event-name="hax-full-text-editor-toggle"\n            ></hax-context-item> -->\n            <slot name="primary"></slot>\n            <hax-context-item-textop\n              mini\n              action\n              icon="editor:format-list-bulleted"\n              event-name="text-tag-ul"\n              label="',
    '"\n              ?hidden="',
    '"\n            ></hax-context-item-textop>\n            <hax-context-item-textop\n              mini\n              action\n              icon="editor:format-list-numbered"\n              label="',
    '"\n              event-name="text-tag-ol"\n              ?hidden="',
    '"\n            ></hax-context-item-textop>\n            <hax-context-item-textop\n              mini\n              action\n              icon="editor:format-indent-decrease"\n              label="',
    '"\n              event-name="text-outdent"\n              ?hidden="',
    '"\n            ></hax-context-item-textop>\n            <hax-context-item-textop\n              mini\n              action\n              icon="editor:format-indent-increase"\n              label="',
    '"\n              event-name="text-indent"\n              ?hidden="',
    '"\n            ></hax-context-item-textop>\n          </div>\n          <div class="group" ?hidden="',
    '">\n            <hax-context-item-textop\n              mini\n              action\n              icon="editor:format-bold"\n              label="',
    '"\n              class="selected-buttons"\n              event-name="text-bold"\n              ?hidden="',
    '"\n            ></hax-context-item-textop>\n            <hax-context-item-textop\n              mini\n              action\n              icon="editor:format-italic"\n              label="',
    '"\n              class="selected-buttons"\n              event-name="text-italic"\n              ?hidden="',
    '"\n            ></hax-context-item-textop>\n          </div>\n          <div class="group" ?hidden="',
    '">\n            <hax-context-item-textop\n              mini\n              action\n              icon="editor:insert-link"\n              label="',
    '"\n              class="selected-buttons"\n              event-name="text-link"\n              ?hidden="',
    '"\n            ></hax-context-item-textop>\n            <hax-context-item-textop\n              mini\n              action\n              icon="mdextra:unlink"\n              label="',
    '"\n              class="selected-buttons"\n              event-name="text-unlink"\n              ?hidden="',
    '"\n            ></hax-context-item-textop>\n          </div>\n          <div class="group" ?hidden="',
    '">\n            <hax-context-item-textop\n              mini\n              action\n              icon="editor:format-clear"\n              label="',
    '"\n              class="selected-buttons"\n              event-name="text-remove-format"\n              ?hidden="',
    '"\n            ></hax-context-item-textop>\n            <slot name="secondary"></slot>\n          </div>\n          <div class="group" ?hidden="',
    '">\n            <hax-context-item-textop\n              action\n              menu\n              icon="editor:format-underlined"\n              label="',
    '"\n              event-name="text-underline"\n              ?hidden="',
    '"\n            ></hax-context-item-textop>\n            <hax-context-item-textop\n              action\n              menu\n              icon="editor:format-strikethrough"\n              event-name="text-strikethrough"\n              ?hidden="',
    '"\n              label="',
    '"\n            ></hax-context-item-textop>\n            <slot name="more"></slot>\n          </div>\n          <div class="group" ?hidden="',
    '">\n            <hax-context-item-textop\n              action\n              menu\n              icon="mdextra:subscript"\n              event-name="text-subscript"\n              ?hidden="',
    '"\n              label="',
    '"\n            ></hax-context-item-textop>\n            <hax-context-item-textop\n              action\n              menu\n              icon="mdextra:superscript"\n              event-name="text-superscript"\n              ?hidden="',
    '"\n              label="',
    '"\n            ></hax-context-item-textop>\n          </div>\n          <div class="group" ?hidden="',
    '">\n            <hax-context-item\n              mini\n              action\n              icon="hax:add-brick"\n              label="',
    '"\n              class="selected-buttons"\n              event-name="insert-inline-gizmo"\n              ?hidden="',
    '"\n            ></hax-context-item>\n            <hax-context-item-textop\n              mini\n              action\n              icon="hax:add-brick"\n              label="',
    '"\n              class="selected-buttons"\n              event-name="insert-inline-gizmo"\n              ?hidden="',
    '"\n            ></hax-context-item-textop>\n          </div>\n          <div class="group">\n            <hax-context-item\n              action\n              icon="icons:code"\n              label="',
    '"\n              ?hidden="',
    '"\n              event-name="hax-source-view-toggle"\n              toggles\n              ?toggled="',
    '"\n              @click="',
    '"\n            ></hax-context-item>\n          </div>\n          <div class="group">\n            <hax-toolbar-menu\n              icon="add"\n              label="',
    '"\n            >\n              <simple-toolbar-menu-item slot="menuitem">\n                <hax-context-item\n                  action\n                  align-horizontal="left"\n                  role="menuitem"\n                  show-text-label\n                  icon="hardware:keyboard-arrow-up"\n                  event-name="insert-above-active"\n                  label="',
    '"\n                ></hax-context-item>\n              </simple-toolbar-menu-item>\n              <simple-toolbar-menu-item slot="menuitem">\n                <hax-context-item\n                  action\n                  align-horizontal="left"\n                  role="menuitem"\n                  show-text-label\n                  icon="hardware:keyboard-arrow-down"\n                  event-name="insert-below-active"\n                  label="',
    '"\n                ></hax-context-item>\n              </simple-toolbar-menu-item>\n            </hax-toolbar-menu>\n          </div>\n        </hax-toolbar>\n      </div>\n    ',
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    "\n        .group,\n        .group > * {\n          flex: 1 1 auto;\n        }\n      ",
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
 * `hax-text-context`
 * @element hax-text-context
 * `A context menu that provides common text based authoring options.`
 * @microcopy - the mental model for this element
 * - context menu - this is a menu of text based buttons and events for use in a larger solution.
 */
var HaxTextContext =
  /*#__PURE__*/
  (function (_I18NMixin) {
    _inherits(HaxTextContext, _I18NMixin);

    _createClass(HaxTextContext, null, [
      {
        key: "styles",
        get: function get() {
          return [].concat(
            _toConsumableArray(
              _get(_getPrototypeOf(HaxTextContext), "styles", this)
            ),
            [(0, _litElement.css)(_templateObject())]
          );
        },
      },
    ]);

    function HaxTextContext() {
      var _this;

      _classCallCheck(this, HaxTextContext);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxTextContext).call(this)
      );
      _this.t = {
        modifyHTMLSource: "Modify HTML source",
        bulledList: "Bulleted list",
        numberedList: "Numbered list",
        indent: "Indent",
        outdent: "Outdent",
        bold: "Bold",
        italic: "Italic",
        link: "Link",
        removeLink: "Remove link",
        removeFormat: "Remove format",
        addElementToSelection: "Add element to selection",
        subscript: "Subscript",
        superscript: "Superscript",
        underline: "Underline",
        crossOut: "Cross out",
        insertItemAbove: "Insert item above",
        insertItemAboveOrBelow: "Insert item above or below",
        insertItemBelow: "Insert item below",
      };

      _this.registerLocalization({
        context: _assertThisInitialized(_this),
        namespace: "hax",
      });

      _this.sourceView = false;
      _this.haxUIElement = true;
      _this.tourName = "hax";
      setTimeout(function () {
        _this.addEventListener(
          "hax-context-item-selected",
          _this._haxContextOperation.bind(_assertThisInitialized(_this))
        );

        window.addEventListener(
          "hax-context-item-selected",
          _this._haxInMenuContextOperation.bind(_assertThisInitialized(_this))
        );
      }, 0);
      _this.formattingList = [
        {
          value: "p",
          icon: "hax:paragraph",
          text: "Paragraph",
        },
        {
          value: "ul",
          icon: "editor:format-list-bulleted",
          text: "Bulleted list",
        },
        {
          value: "ol",
          icon: "editor:format-list-numbered",
          text: "Numbered list",
        },
        {
          value: "h2",
          icon: "hax:h2",
          text: "Title",
        },
        {
          value: "h3",
          icon: "hax:h3",
          text: "Content heading",
        },
        {
          value: "h4",
          icon: "hax:h4",
          text: "Subheading",
        },
        {
          value: "h5",
          icon: "hax:h5",
          text: "Deep subheading",
        },
        {
          value: "blockquote",
          icon: "editor:format-quote",
          text: "Blockquote",
        },
        {
          value: "code",
          icon: "icons:code",
          text: "Code",
        },
      ];
      _this.realSelectedValue = "p";
      _this.formatIcon = "hax:paragraph";
      _this.isSafari = _this._isSafari();
      (0, _mobx.autorun)(function () {
        _this.hasSelectedText =
          (0, _mobx.toJS)(_haxStore.HAXStore.haxSelectedText).length > 0;
      });
      (0, _mobx.autorun)(function () {
        // this just forces this block to run when editMode is modified
        var editMode = (0, _mobx.toJS)(_haxStore.HAXStore.editMode);
        var activeNode = (0, _mobx.toJS)(_haxStore.HAXStore.activeNode);
        _this.viewSource = false;

        if (activeNode && activeNode.tagName) {
          var schema = _haxStore.HAXStore.haxSchemaFromTag(activeNode.tagName);

          _this.sourceView = schema.canEditSource;
        }

        if (_this.shadowRoot && _this.shadowRoot.querySelector("#textformat")) {
          _this.shadowRoot.querySelector("#textformat").collapsed = true;
        } // update our icon if global changes what we are pointing to

        if (
          activeNode &&
          _haxStore.HAXStore.isTextElement(activeNode) &&
          _this.shadowRoot.querySelector(
            'button[event-name="' + activeNode.tagName.toLowerCase() + '"]'
          )
        ) {
          _this.updateTextIconSelection(activeNode.tagName.toLowerCase());
        } else if (
          activeNode &&
          activeNode.tagName === "LI" &&
          activeNode.parentNode &&
          activeNode.parentNode.tagName &&
          _this.shadowRoot.querySelector(
            'button[event-name="' +
              activeNode.parentNode.tagName.toLowerCase() +
              '"]'
          )
        ) {
          _this.updateTextIconSelection(
            activeNode.parentNode.tagName.toLowerCase()
          );
        }
      });
      return _this;
    }

    _createClass(
      HaxTextContext,
      [
        {
          key: "render",

          /**
           *
           *
           * @returns
           * @memberof HaxTextContext
           */
          value: function render() {
            var _this2 = this;

            return (0, _litElement.html)(
              _templateObject2(),
              this._formatIcon(this.realSelectedValue),
              this.formattingList.map(function (val) {
                return (0,
                _litElement.html)(_templateObject3(), val.icon, val.text, !_this2.sourceView, val.value, function (e) {
                  return _this2.textFormatChanged(val.value);
                });
              }),
              this.t.bulledList,
              !this._showLists,
              this.t.numberedList,
              !this._showLists,
              this.t.outdent,
              !this._showIndent,
              this.t.indent,
              !this._showIndent,
              !this.hasSelectedText,
              this.t.bold,
              !this.hasSelectedText,
              this.t.italic,
              !this.hasSelectedText,
              !this.hasSelectedText,
              this.t.link,
              !this.hasSelectedText,
              this.t.removeLink,
              !this.hasSelectedText,
              !this.hasSelectedText,
              this.t.removeFormat,
              !this.hasSelectedText,
              !this.hasSelectedText,
              this.t.underline,
              !this.hasSelectedText,
              !this.hasSelectedText,
              this.t.crossOut,
              !this.hasSelectedText,
              !this.hasSelectedText,
              this.t.subscript,
              !this.hasSelectedText,
              this.t.superscript,
              !this.hasSelectedText,
              this.t.addElementToSelection,
              this.isSafari || !this.hasSelectedText,
              this.t.addElementToSelection,
              !this.isSafari || !this.hasSelectedText,
              this.t.modifyHTMLSource,
              !this.sourceView,
              this.viewSource,
              function (e) {
                return (_this2.viewSource = !_this2.viewSource);
              },
              this.t.insertItemAboveOrBelow,
              this.t.insertItemAbove,
              this.t.insertItemBelow
            );
          },
        },
        {
          key: "textFormatChanged",
          value: function textFormatChanged(tag) {
            // set internally
            this.shadowRoot.querySelector("#textformat").collapsed = true;
            this.updateTextIconSelection(tag); // notify up above that we want to change the tag

            this.dispatchEvent(
              new CustomEvent("hax-context-item-selected", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: {
                  eventName: "text-tag",
                  value: this.realSelectedValue,
                },
              })
            );
          },
        },
        {
          key: "updateTextIconSelection",
          value: function updateTextIconSelection(tag) {
            this.realSelectedValue = tag;
            var localItem = this.shadowRoot.querySelector(
              'button[event-name="' + this.realSelectedValue + '"]'
            );

            if (localItem) {
              this.formatIcon = localItem.icon;
            }
          },
        },
        {
          key: "_formatIcon",
          value: function _formatIcon() {
            var tag =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : this.realSelectedValue || "p";
            var icon = this.textFormatLookup[tag];
            return icon || "hax:paragraph";
          },
        },
        {
          key: "updated",
          value: function updated(changedProperties) {
            var _this3 = this;

            changedProperties.forEach(function (oldValue, propName) {
              // computed based on these changing
              if (propName == "realSelectedValue") {
                _this3._showIndent = _this3._computeShowIndent(
                  _this3.realSelectedValue
                );

                if (_this3.realSelectedValue == "p") {
                  _this3._showLists = true;
                } else {
                  _this3._showLists = false;
                }
              }

              if (propName == "hasSelectedText") {
                _this3.dispatchEvent(
                  new CustomEvent("hax-context-menu-changed", {
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                    detail: _this3,
                  })
                );
              }
            });
          },
        },
        {
          key: "firstUpdated",
          value: function firstUpdated(changedProperties) {
            if (
              _get(
                _getPrototypeOf(HaxTextContext.prototype),
                "firstUpdated",
                this
              )
            ) {
              _get(
                _getPrototypeOf(HaxTextContext.prototype),
                "firstUpdated",
                this
              ).call(this, changedProperties);
            }

            if (
              (0, _mobx.toJS)(_haxStore.HAXStore.activeNode) &&
              (0, _mobx.toJS)(_haxStore.HAXStore.activeNode).tagName
            ) {
              this.updateTextIconSelection(
                (0, _mobx.toJS)(
                  _haxStore.HAXStore.activeNode
                ).tagName.toLowerCase()
              );
            }
          },
          /**
           * Show indentation on lists
           */
        },
        {
          key: "_computeShowIndent",
          value: function _computeShowIndent(realSelectedValue) {
            if (
              _haxStore.HAXStore.computePolyfillSafe() &&
              (realSelectedValue == "li" ||
                realSelectedValue == "ol" ||
                realSelectedValue == "ul")
            ) {
              return true;
            }

            return false;
          },
          /**
           * Respond to simple modifications.
           */
        },
        {
          key: "_haxInMenuContextOperation",
          value: function _haxInMenuContextOperation(e) {
            var detail = e.detail;
            var prevent = false; // support a simple insert event to bubble up or everything else

            switch (detail.eventName) {
              case "insert-above-active":
              case "insert-below-active":
                if (this.shadowRoot.querySelector("simple-popover-selection")) {
                  this.shadowRoot.querySelector(
                    "simple-popover-selection"
                  ).opened = false;
                }

                break;

              case "text-underline":
                document.execCommand("underline");
                prevent = true;
                break;

              case "text-subscript":
                document.execCommand("subscript");
                prevent = true;
                break;

              case "text-superscript":
                document.execCommand("superscript");
                prevent = true;
                break;

              case "text-strikethrough":
                document.execCommand("strikeThrough");
                prevent = true;
                break;
            }

            if (prevent) {
              if (
                this.shadowRoot.querySelector("simple-popover-selection") &&
                this.shadowRoot.querySelector("simple-popover-selection").opened
              ) {
                this.shadowRoot.querySelector(
                  "simple-popover-selection"
                ).opened = false;
              }

              e.preventDefault();
              e.stopPropagation();
            }
          },
          /**
           * Respond to simple modifications.
           */
        },
        {
          key: "_haxContextOperation",
          value: function _haxContextOperation(e) {
            var detail = e.detail;

            var selection = _haxStore.HAXStore.getSelection();

            var prevent = false; // support a simple insert event to bubble up or everything else

            switch (detail.eventName) {
              case "insert-inline-gizmo":
                if (
                  _haxStore.HAXStore._tmpSelection &&
                  _haxStore.HAXStore.editMode
                ) {
                  try {
                    if (
                      _haxStore.HAXStore._tmpRange.startContainer.parentNode
                        .parentNode.tagName === "HAX-BODY" ||
                      _haxStore.HAXStore._tmpRange.startContainer.parentNode
                        .parentNode.parentNode.tagName === "HAX-BODY"
                    ) {
                      _haxStore.HAXStore.activePlaceHolder =
                        _haxStore.HAXStore._tmpRange;
                    }
                  } catch (err) {}
                }

                if (_haxStore.HAXStore.activePlaceHolder != null) {
                  // store placeholder because if this all goes through we'll want
                  // to kill the originating text
                  var values = {
                    text: _haxStore.HAXStore.activePlaceHolder.toString(),
                  };
                  var type = "inline";

                  var haxElements = _haxStore.HAXStore.guessGizmo(type, values); // see if we got anything

                  if (haxElements.length > 0) {
                    // hand off to hax-app-picker to deal with the rest of this
                    _haxStore.HAXStore.haxAppPicker.presentOptions(
                      haxElements,
                      type,
                      "Transform selected text to..",
                      "gizmo"
                    );
                  }
                }

                break;
              // wow these are way too easy

              case "text-bold":
                document.execCommand("bold");
                prevent = true;
                break;

              case "text-italic":
                document.execCommand("italic");
                prevent = true;
                break;

              case "text-remove-format":
                document.execCommand("removeFormat");
                prevent = true;
                break;

              case "text-link":
                var href = "";

                if (
                  selection &&
                  selection.focusNode &&
                  selection.focusNode.parentNode &&
                  _typeof(selection.focusNode.parentNode.href) !==
                    (typeof undefined === "undefined"
                      ? "undefined"
                      : _typeof(undefined))
                ) {
                  href = selection.focusNode.parentNode.href;
                } // @todo put in a dialog instead of this

                var url = prompt("Enter a URL:", href);

                if (url) {
                  document.execCommand("createLink", false, url);

                  if (selection.focusNode.parentNode) {
                    selection.focusNode.parentNode.setAttribute(
                      "contenteditable",
                      true
                    ); // just to be safe

                    selection.focusNode.parentNode.removeEventListener(
                      "click",
                      function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                      }
                    );
                    selection.focusNode.parentNode.addEventListener(
                      "click",
                      function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                      }
                    );
                  }

                  prevent = true;
                }

                break;

              case "text-unlink":
                document.execCommand("unlink");
                prevent = true;
                break;

              /**
               * Our bad actors when it comes to polyfill'ed shadowDOM.
               * Naughty, naughty shadyDOM. Fortunately this is only IE11/Edge
               */

              case "text-indent":
                _haxStore.HAXStore.activeHaxBody.__indentTrap = true;
                document.execCommand("indent");
                prevent = true;
                break;

              case "text-outdent":
                _haxStore.HAXStore.activeHaxBody.__indentTrap = true;
                document.execCommand("outdent");
                prevent = true;
                break;
            }

            if (prevent) {
              e.preventDefault();
              e.stopPropagation();
            }
          },
          /**
           * Test for safari, if it is don't place things in the menu
           */
        },
        {
          key: "_isSafari",
          value: function _isSafari() {
            var ua = navigator.userAgent.toLowerCase(); // test to find safari to account for it's handling
            // of what's been selected. This isn't great UX but
            // there's literally nothing we can do for Safari
            // because of https://github.com/LRNWebComponents/hax-body/issues/38

            if (ua.indexOf("safari") != -1) {
              if (ua.indexOf("chrome") > -1) {
              } else {
                return true;
              }
            }

            return false;
          },
        },
        {
          key: "textFormatLookup",
          get: function get() {
            var lookup = {};
            this.formattingList.forEach(function (item) {
              lookup[item.value] = item.icon;
            });
            return lookup;
          },
        },
      ],
      [
        {
          key: "tag",
          get: function get() {
            return "hax-text-context";
          },
        },
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              _get(_getPrototypeOf(HaxTextContext), "properties", this),
              {
                _showIndent: {
                  type: Boolean,
                },
                _showLists: {
                  type: Boolean,
                },
                realSelectedValue: {
                  type: String,
                },
                sourceView: {
                  type: Boolean,
                },
                formattingList: {
                  type: Array,
                },

                /**
                 * calculated boolean off of if there is currently text
                 */
                hasSelectedText: {
                  type: Boolean,
                  attribute: "has-selected-text",
                  reflect: true,
                },

                /**
                 * Selected item icon
                 */
                formatIcon: {
                  type: String,
                  attribute: "format-icon",
                },

                /**
                 * Is this safari
                 */
                isSafari: {
                  type: Boolean,
                  attribute: "is-safari",
                },
                viewSource: {
                  type: Boolean,
                },
              }
            );
          },
        },
      ]
    );

    return HaxTextContext;
  })(
    (0, _I18NMixin2.I18NMixin)(
      (0, _haxContextBehaviors.HaxContextBehaviors)(_litElement.LitElement)
    )
  );

exports.HaxTextContext = HaxTextContext;
window.customElements.define(HaxTextContext.tag, HaxTextContext);
