"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxTextContext = void 0;

var _litElement = require("lit-element/lit-element.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js");

require("@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js");

require("@lrnwebcomponents/hax-body/lib/hax-context-item-menu.js");

require("@lrnwebcomponents/hax-body/lib/hax-context-item-menu-li.js");

require("@lrnwebcomponents/hax-body/lib/hax-context-item.js");

require("@lrnwebcomponents/hax-body/lib/hax-context-item-textop.js");

var _haxToolbar = require("@lrnwebcomponents/hax-body/lib/hax-toolbar.js");

var _SimpleTourFinder2 = require("@lrnwebcomponents/simple-popover/lib/SimpleTourFinder");

var _haxStore = require("./hax-store.js");

var _mobx = require("mobx");

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

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n      "]);

  _templateObject3 = function _templateObject3() {
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

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n                  <hax-context-item-menu-li slot="menuitem">\n                    <hax-context-item\n                      action\n                      role="menuitem"\n                      label="',
    '"\n                      show-text-label\n                      ?hidden="',
    '"\n                      event-name="',
    '"\n                      @click="',
    '"\n                    ></hax-context-item>\n                  </hax-context-item-menu-li>',
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n      <div id="buttons">\n        <div class="group">\n          <hax-context-item-menu\n            id="textformat"\n            icon="',
    '"\n            label="Text format"\n            show-text-label\n            data-simple-tour-stop\n            data-stop-title="label"\n            @simple-popover-selection-changed="',
    '">\n            \n            ',
    '\n            <div slot="tour" data-stop-content>\n              Change how the text is structured and visualized in the page.\n            </div>\n          </hax-context-item-menu>\n          <!-- comment this in when rich-text-editor is viable -->\n          <!--\n          <hax-context-item\n            action\n            hidden\n            icon="icons:flip-to-back"\n            label="Full text editor"\n            event-name="hax-full-text-editor-toggle"\n          ></hax-context-item> -->\n          <slot name="primary"></slot>\n          <hax-context-item\n            mini\n            action\n            icon="icons:code"\n            label="Modify HTML source"\n            ?hidden="',
    '"\n            event-name="hax-source-view-toggle"\n          ></hax-context-item>\n          <hax-context-item-textop\n            mini\n            action\n            icon="editor:format-list-bulleted"\n            event-name="text-tag-ul"\n            label="Bulleted list"\n            .hidden="',
    '"\n          ></hax-context-item-textop>\n          <hax-context-item-textop\n            mini\n            action\n            icon="editor:format-list-numbered"\n            label="Numbered list"\n            event-name="text-tag-ol"\n            .hidden="',
    '"\n          ></hax-context-item-textop>\n          <hax-context-item-textop\n            mini\n            action\n            icon="editor:format-indent-decrease"\n            label="Outdent"\n            event-name="text-outdent"\n            .hidden="',
    '"\n          ></hax-context-item-textop>\n          <hax-context-item-textop\n            mini\n            action\n            icon="editor:format-indent-increase"\n            label="Indent"\n            event-name="text-indent"\n            .hidden="',
    '"\n          ></hax-context-item-textop>\n          <hax-context-item-textop\n            mini\n            action\n            icon="editor:format-bold"\n            label="Bold"\n            class="selected-buttons"\n            event-name="text-bold"\n            ?hidden="',
    '"\n          ></hax-context-item-textop>\n          <hax-context-item-textop\n            mini\n            action\n            icon="editor:format-italic"\n            label="Italic"\n            class="selected-buttons"\n            event-name="text-italic"\n            ?hidden="',
    '"\n          ></hax-context-item-textop>\n          <hax-context-item-textop\n            mini\n            action\n            icon="editor:insert-link"\n            label="Link"\n            class="selected-buttons"\n            event-name="text-link"\n            ?hidden="',
    '"\n          ></hax-context-item-textop>\n          <hax-context-item-textop\n            mini\n            action\n            icon="mdextra:unlink"\n            label="Remove link"\n            class="selected-buttons"\n            event-name="text-unlink"\n            ?hidden="',
    '"\n          ></hax-context-item-textop>\n          <hax-context-item-textop\n            mini\n            action\n            icon="editor:format-clear"\n            label="Remove format"\n            class="selected-buttons"\n            event-name="text-remove-format"\n            ?hidden="',
    '"\n          ></hax-context-item-textop>\n          <hax-context-item\n            mini\n            action\n            icon="hax:add-brick"\n            label="Add element to selection"\n            class="selected-buttons"\n            event-name="insert-inline-gizmo"\n            ?hidden="',
    '"\n          ></hax-context-item>\n          <hax-context-item-textop\n            mini\n            action\n            icon="hax:add-brick"\n            label="Add element to selection"\n            class="selected-buttons"\n            event-name="insert-inline-gizmo"\n            ?hidden="',
    '"\n          ></hax-context-item-textop>\n          <hax-context-item-textop\n            action\n            menu\n            icon="mdextra:subscript"\n            event-name="text-subscript"\n            ?hidden="',
    '"\n            label="Subscript"\n            ></hax-context-item-textop\n          >\n          <hax-context-item-textop\n            action\n            menu\n            icon="mdextra:superscript"\n            event-name="text-superscript"\n            ?hidden="',
    '"\n            label="Superscript"\n            ></hax-context-item-textop\n          >\n          <hax-context-item-textop\n            action\n            menu\n            icon="editor:format-underlined"\n            label="Underline"\n            event-name="text-underline"\n            ?hidden="',
    '"\n            ></hax-context-item-textop\n          >\n          <hax-context-item-textop\n            action\n            menu\n            icon="editor:format-strikethrough"\n            event-name="text-strikethrough"\n            ?hidden="',
    '"\n            label="Cross out"\n            ></hax-context-item-textop>\n          <hax-context-item-menu\n              icon="add"\n              label="Insert item above or below">\n            <hax-context-item-menu-li slot="menuitem">\n              <hax-context-item\n                action\n                role="menuitem"\n                show-text-label\n                icon="hardware:keyboard-arrow-up"\n                event-name="insert-above-active"\n                label="Insert item above"\n                ></hax-context-item\n              >\n            </hax-context-item-menu-li>\n            <hax-context-item-menu-li slot="menuitem">\n              <hax-context-item\n                action\n                role="menuitem"\n                show-text-label\n                icon="hardware:keyboard-arrow-down"\n                event-name="insert-below-active"\n                label="Insert item below"\n                ></hax-context-item\n              >\n            </hax-context-item-menu-li>\n          </hax-context-item-menu>\n          <slot name="secondary"></slot>\n          <slot name="more"></slot>\n        </div>\n      </div>\n      ',
    "\n    ",
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
 * `hax-text-context`
 * @element hax-text-context
 * `A context menu that provides common text based authoring options.`
 * @microcopy - the mental model for this element
 * - context menu - this is a menu of text based buttons and events for use in a larger solution.
 */
var HaxTextContext =
  /*#__PURE__*/
  (function (_SimpleTourFinder) {
    _inherits(HaxTextContext, _SimpleTourFinder);

    function HaxTextContext() {
      var _this;

      _classCallCheck(this, HaxTextContext);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxTextContext).call(this)
      );
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
          text: "Paragraph (p)",
        },
        {
          value: "ul",
          text: "Bulleted list",
        },
        {
          value: "ol",
          text: "Numbered list",
        },
        {
          value: "h2",
          text: "Title (h2)",
        },
        {
          value: "h3",
          text: "Content heading (h3)",
        },
        {
          value: "h4",
          text: "Subheading (h4)",
        },
        {
          value: "h5",
          text: "Deep subheading (h5)",
        },
        {
          value: "blockquote",
          text: "Blockquote",
        },
        {
          value: "code",
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

        if (activeNode && activeNode.tagName) {
          var schema = _haxStore.HAXStore.haxSchemaFromTag(activeNode.tagName);

          _this.sourceView = schema.canEditSource;
        }

        if (
          _this.shadowRoot &&
          _this.shadowRoot.querySelector("simple-popover-selection")
        ) {
          _this.shadowRoot.querySelector(
            "simple-popover-selection"
          ).opened = false;
        } // update our icon if global changes what we are pointing to

        if (
          activeNode &&
          _haxStore.HAXStore.isTextElement(activeNode) &&
          _this.shadowRoot.querySelector(
            'button[value="' + activeNode.tagName.toLowerCase() + '"]'
          )
        ) {
          _this.updateTextIconSelection(activeNode.tagName.toLowerCase());
        } else if (
          activeNode &&
          activeNode.tagName === "LI" &&
          _this.shadowRoot.querySelector(
            'button[value="' +
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
              _templateObject(),
              this.formatIcon,
              this.textFormatChanged,
              this.formattingList.map(function (val) {
                return (0,
                _litElement.html)(_templateObject2(), val.text, !_this2.sourceView, val.value, _this2.textFormatChanged);
              }),
              !this.sourceView,
              !this._showLists,
              !this._showLists,
              !this._showIndent,
              !this._showIndent,
              !this.hasSelectedText,
              !this.hasSelectedText,
              !this.hasSelectedText,
              !this.hasSelectedText,
              !this.hasSelectedText,
              this.isSafari || !this.hasSelectedText,
              !this.isSafari || !this.hasSelectedText,
              !this.hasSelectedText,
              !this.hasSelectedText,
              !this.hasSelectedText,
              !this.hasSelectedText,
              this.moreButton
            );
          },
        },
        {
          key: "textFormatChanged",
          value: function textFormatChanged(e) {
            // set internally
            this.shadowRoot.querySelector(
              "simple-popover-selection"
            ).opened = false;
            this.updateTextIconSelection(e.detail.getAttribute("value")); // notify up above that we want to change the tag

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
            this.realSelectedValue = tag; // clear active if there is one

            if (
              this.shadowRoot.querySelector(
                "[data-simple-popover-selection-active]"
              )
            ) {
              this.shadowRoot
                .querySelector("[data-simple-popover-selection-active]")
                .removeAttribute("data-simple-popover-selection-active");
            }

            var localItem = this.shadowRoot.querySelector(
              'button[value="' + this.realSelectedValue + '"]'
            );

            if (localItem) {
              localItem.setAttribute(
                "data-simple-popover-selection-active",
                true
              );
              this.formatIcon = localItem
                .querySelector("simple-icon-lite")
                .getAttribute("icon");
            }
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
                this.shadowRoot.querySelector(
                  "simple-popover-selection"
                ).opened = false;
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
      ],
      [
        {
          key: "styles",
          get: function get() {
            return [].concat(
              _toConsumableArray(
                _get(_getPrototypeOf(HaxTextContext), "styles", this)
              ),
              [(0, _litElement.css)(_templateObject3())]
            );
          },
        },
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
              }
            );
          },
        },
      ]
    );

    return HaxTextContext;
  })(
    (0, _SimpleTourFinder2.SimpleTourFinder)(
      (0, _haxToolbar.HaxToolbarBehaviors)(_litElement.LitElement)
    )
  );

exports.HaxTextContext = HaxTextContext;
window.customElements.define(HaxTextContext.tag, HaxTextContext);
