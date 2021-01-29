"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.RichTextEditorSelection = void 0;

var _litElement = require("lit-element/lit-element.js");

var _richTextEditorButton = require("../buttons/rich-text-editor-button.js");

var _utils = require("@lrnwebcomponents/utils/utils.js");

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
    "\n        :host {\n  background-color: var(--rich-text-editor-selection-bg, rgb(146, 197, 255));\n          margin: 0;\n          padding: 0;\n          display: inline-block;\n        }\n        :host([hidden]) {\n          display: none;\n        }\n        :host([collapsed]):after {\n          content: '|';\n          color: var(--simple-toolbar-selection-bg);\n          background-color: transparent;\n        }\n        :host + *,\n        ::slotted(*) {\n  background-color: var(--rich-text-editor-selection-bg, rgb(146, 197, 255));\n        }\n\xA0\xA0\xA0\xA0\xA0\xA0",
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
  var data = _taggedTemplateLiteral(["<slot></slot>"]);

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
 * `rich-text-editor-selection`
 * `a button for rich text editor (custom buttons can extend this)`
 *
 * @element rich-text-editor-selection
 * @demo ./demo/selection.html
 */
var RichTextEditorSelection =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(RichTextEditorSelection, _LitElement);

    _createClass(RichTextEditorSelection, [
      {
        key: "validCommands",

        /**
         * gets valid commands list
         *
         * @readonly
         * @memberof RichTextEditorButton
         */
        get: function get() {
          return [
            "backColor",
            "bold",
            "copy",
            "createLink",
            "cut",
            "decreaseFontSize",
            "defaultParagraphSeparator",
            "delete",
            "fontName",
            "fontSize",
            "foreColor",
            "formatBlock",
            "forwardDelete",
            "hiliteColor",
            "increaseFontSize",
            "indent",
            "insertBrOnReturn",
            "insertHorizontalRule",
            "insertHTML",
            "insertImage",
            "insertLineBreak",
            "insertOrderedList",
            "insertUnorderedList",
            "insertParagraph",
            "insertText",
            "italic",
            "justifyCenter",
            "justifyFull",
            "justifyLeft",
            "justifyRight",
            "outdent",
            "paste",
            "redo",
            "removeFormat",
            "selectAll",
            "strikethrough",
            "styleWithCss",
            "subscript",
            "superscript",
            "undo",
            "unlink",
            "useCSS",
          ];
        },
      },
    ]);

    function RichTextEditorSelection() {
      var _this;

      _classCallCheck(this, RichTextEditorSelection);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(RichTextEditorSelection).call(this)
      );

      var sel = _assertThisInitialized(_this);

      _this.hidden = true;
      _this.__toolbars = [];
      _this.__clipboard = document.createElement("textarea");

      _this.__clipboard.setAttribute("aria-hidden", true);

      _this.__clipboard.style.position = "absolute";
      _this.__clipboard.style.left = "-9999px";
      _this.__clipboard.style.top = "0px";
      _this.__clipboard.style.width = "0px";
      _this.__clipboard.style.height = "0px";
      _this.id = _this._generateUUID();
      document.body.appendChild(_this.__clipboard);
      window.addEventListener("register", _this._handleRegistration.bind(sel));
      /*
    extendForward.addEventListener('click', () => {
      window.getSelection().modify('extend', 'forward', 'character');
    });
     extendBackward.addEventListener('click', () => {
      window.getSelection().modify('extend', 'backward', 'character');
    });*/

      return _this;
    }

    _createClass(
      RichTextEditorSelection,
      [
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(_templateObject());
          },
        },
        {
          key: "updated",
          value: function updated(changedProperties) {
            _get(
              _getPrototypeOf(RichTextEditorSelection.prototype),
              "updated",
              this
            ).call(this, changedProperties);

            changedProperties.forEach(function (oldValue, propName) {});
          },
          /**
           * life cycle, element is disconnected
           */
        },
        {
          key: "disconnectedCallback",
          value: function disconnectedCallback() {
            _get(
              _getPrototypeOf(RichTextEditorSelection.prototype),
              "disconnectedCallback",
              this
            ).call(this);
          },
          /**
           * undo for canceled edits
           *
           * @param {object} editor
           * @memberof RichTextEditorSelection
           */
        },
        {
          key: "cancelEdits",
          value: function cancelEdits(editor) {
            editor.revert();
            this.edit(editor, false);
          },
          /**
           * closes the toolbar
           *
           * @param {object} toolbar
           * @param {object} editor
           * @memberof RichTextEditorSelection
           */
        },
        {
          key: "closeToolbar",
          value: function closeToolbar(toolbar) {
            var editor =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : toolbar.editor;
            if (editor) this.disableEditing(editor);
            toolbar.editor = undefined;
            document.body.append(toolbar);
          },
          /**
           * disables editing
           *
           * @param {object} editor
           * @memberof RichTextEditorSelection
           */
        },
        {
          key: "disableEditing",
          value: function disableEditing(editor) {
            if (!!editor) {
              this.getRoot(editor).onselectionchange = undefined;
              editor.viewSource = false;
              editor.disableEditing();
              editor.makeSticky(false);
            }
          },
          /**
           * Updates selected range based on toolbar and editor
           * @param {event} e editor change event
           * @param {deselect} if editor is being deselected
           * @returns {void}
           */
        },
        {
          key: "edit",
          value: function edit(editor) {
            var editable =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : true;

            if (!!editor) {
              var toolbar = !editor
                  ? undefined
                  : this.getConnectedToolbar(editor),
                oldEditor = editable ? toolbar.editor : undefined;
              this.highlight(toolbar, false);

              if (toolbar && oldEditor !== editor) {
                if (!!oldEditor) this.disableEditing(oldEditor);
                toolbar.editor = editor;
                this.enableEditing(editor, toolbar);
              }
            }
          },
          /**
           * enables content editable
           *
           * @param {*} editor
           * @param {*} [toolbar=this.getConnectedToolbar(editor)]
           * @memberof RichTextEditorSelection
           */
        },
        {
          key: "enableEditing",
          value: function enableEditing(editor) {
            var _this2 = this;

            var toolbar =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : this.getConnectedToolbar(editor);

            if (!!editor) {
              editor.makeSticky(toolbar.sticky);
              editor.parentNode.insertBefore(toolbar, editor);
              editor.enableEditing();
              this.updateRange(editor); //editor.observeChanges(this.getRoot(editor));

              this.getRoot(editor).onselectionchange = function (e) {
                if (!toolbar.__promptOpen) _this2.updateRange(editor);
              };
            }
          },
          /**
           * expands selection to a specific ancestor
           * @param {string} selectors comma-separated list of selectors
           * @param {object} range
           * @returns {object} updated range
           */
        },
        {
          key: "expandRangeTo",
          value: function expandRangeTo() {
            var selectors =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : "";
            var range = arguments.length > 1 ? arguments[1] : undefined;
            var node = range ? this.getRangeNode(range) : undefined,
              tagName =
                node && node.tagName ? node.tagName.toLowerCase() : undefined,
              selectorsList = selectors
                .toLowerCase()
                .replace(/\s*/g, "")
                .split(",");

            if (selectorsList.includes(tagName)) {
              return node;
            } else if (node.closest(selectors)) {
              range.selectNode(node.closest(selectors));
              return range;
            }
          },
          /**
           * node selected or its parent node
           *
           * @param {object} range
           * @returns object
           * @memberof RichTextEditorSelection
           */
        },
        {
          key: "getRangeNode",
          value: function getRangeNode(range) {
            var common = !range ? undefined : range.commonAncestorContainer,
              startContainer = !range ? undefined : range.startContainer,
              startOffset = !range ? undefined : range.startOffset,
              endContainer = !range ? undefined : range.endContainer,
              endOffset = !range ? undefined : range.endOffset,
              startNode =
                !startContainer || !startContainer.children
                  ? undefined
                  : startContainer.children[startOffset - 1],
              rootNode =
                startContainer === endContainer && endOffset - startOffset === 1
                  ? startNode
                  : common;
            return rootNode;
          },
          /**
           * gets closest shadowRoot or document from node
           *
           * @param {object} node
           * @returns object
           * @memberof RichTextEditorSelection
           */
        },
        {
          key: "getRoot",
          value: function getRoot(node) {
            return !node || node === document
              ? document
              : node.parentNode
              ? this.getRoot(node.parentNode)
              : node;
          },
          /**
           * gets toolbar currently assocatied with given editor
           *
           * @param {*} editor
           * @returns
           * @memberof RichTextEditorSelection
           */
        },
        {
          key: "getConnectedToolbar",
          value: function getConnectedToolbar(editor) {
            if (!editor.id) editor.id = this._generateUUID();

            if (!editor.__connectedToolbar) {
              //get toolbar by id
              var toolbar,
                filter = !editor.toolbar
                  ? []
                  : (this.__toolbars || []).filter(function (toolbar) {
                      return editor.toolbar && toolbar.id === editor.toolbar;
                    }); //get toolbar by type

              if (filter.length === 0) {
                filter = !editor.type
                  ? []
                  : (this.__toolbars || []).filter(function (toolbar) {
                      return editor.type && toolbar.type === editor.type;
                    });
              } //get any toolbar

              if (filter.length === 0) filter = this.__toolbars;

              if (filter[0]) {
                toolbar = filter[0];
              } else if (filter.length === 0) {
                //make toolbar
                toolbar = document.createElement(
                  editor.type || "rich-text-editor-toolbar"
                );
                editor.parentNode.insertBefore(toolbar, editor);
              }

              toolbar.id = toolbar.id || editor.toolbar || this._generateUUID();
              editor.__connectedToolbar = toolbar;
            }

            return editor.__connectedToolbar;
          },
          /**
           * adds or removes hightlight
           * @param {object} contents contents to be highlighted
           * @param {boolean} [add=true] add highlight?
           * @returns {void}
           */
        },
        {
          key: "highlight",
          value: function highlight(toolbar) {
            var add =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : true;
            var node = arguments.length > 2 ? arguments[2] : undefined;
            this.toolbar = toolbar;
            var editor = toolbar ? toolbar.editor : undefined;
            if (!editor) return;

            if (add !== false) {
              if (toolbar.range) {
                this.hidden = false;
                toolbar.range.insertNode(this);
                if (node) this.append(node);
                toolbar.range.setStartAfter(this);
                this.range = toolbar.range;
              }
            } else {
              this.updateRange(toolbar.editor, toolbar.range);
              this.hidden = true;
              this.toolbar = undefined;
              this.range = undefined;
              document.body.appendChild(this);
            }

            this.dispatchEvent(
              new CustomEvent("change", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: add,
              })
            );
          },
          /**
           * selects and highlights a node
           *
           * @param {object} node
           * @param {object} toolbar
           * @returns {void}
           * @memberof RichTextEditorSelection
           */
        },
        {
          key: "highlightNode",
          value: function highlightNode(node, toolbar) {
            this.selectNode(node, toolbar.range, toolbar.editor);
            this.highlight(toolbar);
          },
          /**
           * gets clipboard data and pastes into an editor's range
           *
           * @param {obj} editor
           * @memberof RichTextEditorSelection
           */
        },
        {
          key: "pasteFromClipboard",
          value: function pasteFromClipboard(editor) {
            var _this3 = this;

            setTimeout(function _callee() {
              var sel, range, text;
              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      sel = window.getSelection();
                      range = editor.range;
                      _context.next = 4;
                      return regeneratorRuntime.awrap(
                        navigator.clipboard.readText()
                      );

                    case 4:
                      text = _context.sent;
                      _this3.__clipboard.value = text;

                      _this3.__clipboard.focus();

                      _this3.__clipboard.select();

                      document.execCommand("paste");
                      sel.removeAllRanges();
                      sel.addRange(range);

                      _this3.pasteIntoEditor(editor, _this3.__clipboard.value);

                    case 12:
                    case "end":
                      return _context.stop();
                  }
                }
              });
            }, 2000);
          },
          /**
           * pastes content into editor's selected range
           *
           * @param {obj} editor editor
           * @param {obj} pasteContent content to paste
           * @memberof RichTextEditorSelection
           */
        },
        {
          key: "pasteIntoEditor",
          value: function pasteIntoEditor(editor, pasteContent) {
            if (editor) {
              var range = editor.range,
                div = document.createElement("div"),
                parent = range.commonAncestorContainer.parentNode,
                closest = parent.closest(
                  "[editing=true]:not([disabled]),input:not([disabled]),textarea:not([disabled])"
                );

              if ((editor = closest)) {
                div.innerHTML = editor.sanitizeHTML(pasteContent);

                if (range && range.extractContents) {
                  range.extractContents();
                }

                range.insertNode(div);

                while (div.firstChild) {
                  div.parentNode.insertBefore(div.firstChild, div);
                }

                div.parentNode.removeChild(div);
              }
            }
          },
          /**
           * sets up editor's event listeners
           *
           * @param {object} editor
           * @param {boolean} [add=true]
           * @returns {object} toolbar
           * @memberof RichTextEditorSelection
           */
        },
        {
          key: "registerEditor",
          value: function registerEditor(editor) {
            var _this4 = this;

            var remove =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : false;
            var toolbar = !editor
                ? undefined
                : this.getConnectedToolbar(editor),
              handlers = {
                click: function click(e) {
                  return _this4._handleEditorClick(editor, e);
                },
                focus: function focus(e) {
                  if (!toolbar.__promptOpen) _this4.edit(editor);
                },
                getrange: function getrange(e) {
                  if (!toolbar.__promptOpen) {
                    _this4.toolbar = toolbar;

                    _this4.updateRange(editor, editor.range);
                  }
                },
                keydown: function keydown(e) {
                  return _this4._handleShortcutKeys(editor, e);
                },
                pastefromclipboard: function pastefromclipboard(e) {
                  return _this4.pasteFromClipboard(e.detail);
                },
                pastecontent: function pastecontent(e) {
                  return _this4._handlePaste(e);
                },
              };

            if (!remove) {
              //add event listeners
              Object.keys(handlers).forEach(function (handler) {
                return editor.addEventListener(handler, handlers[handler]);
              });
            } else {
              Object.keys(handlers).forEach(function (handler) {
                return editor.removeEventListener(handler, handlers[handler]);
              });
            }

            if (
              (editor.__connectedToolbar.show =
                "always" && !editor.__connectedToolbar.editor)
            )
              this.edit(editor);
            return editor.__connectedToolbar;
          },
          /**
           * updates toolbar list
           *
           * @param {*} toolbar
           * @param {boolean} [remove=false]
           * @memberof RichTextEditorSelection
           */
        },
        {
          key: "registerToolbar",
          value: function registerToolbar(toolbar) {
            var _this5 = this;

            var remove =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : false;
            var handlers = {
              command: function command(e) {
                e.stopImmediatePropagation();
                var d = e.detail || {};

                _this5._handleCommand(
                  toolbar,
                  d.command,
                  d.commandVal,
                  d.range
                ); // optional callback so that custom buttons can perform
                // custom toolbar and/or editor opperations

                if (d.button && d.button.commandCallback)
                  d.button.commandCallback(toolbar.editor, toolbar, _this5);
              },
              disableediting: function disableediting(e) {
                return _this5.disableEditing((e.detail || {}).editor);
              },
              highlight: function highlight(e) {
                e.stopImmediatePropagation();

                _this5.highlight(toolbar, e.detail);
              },
              highlightnode: function highlightnode(e) {
                e.stopImmediatePropagation();

                _this5.highlightNode(e.detail, toolbar);
              },
              pastefromclipboard: function pastefromclipboard(e) {
                e.stopImmediatePropagation();

                _this5.pasteFromClipboard(e.detail);
              },
              "rich-text-editor-prompt-closed": function richTextEditorPromptClosed(
                e
              ) {
                toolbar.__promptOpen = false;
              },
              "rich-text-editor-prompt-open": function richTextEditorPromptOpen(
                e
              ) {
                toolbar.__promptOpen = true;
              },
              setrange: function setrange(e) {
                (_this5.range = (e.detail || {}).range),
                  _this5.updateRange((e.detail || {}).editor, _this5.range);

                _this5.selectRange(_this5.range, (e.detail || {}).editor);
              },
              selectnode: function selectnode(e) {
                e.stopImmediatePropagation();

                _this5.selectNode(e.detail, toolbar.range);
              },
              selectnodecontents: function selectnodecontents(e) {
                e.stopImmediatePropagation();

                _this5.selectNode(e.detail, toolbar.range);
              },
              selectrange: function selectrange(e) {
                e.stopImmediatePropagation();

                _this5.selectRange(e.detail, toolbar.editor);
              },
              wrapselection: function wrapselection(e) {
                e.stopImmediatePropagation();

                _this5.surroundRange(e.detail, toolbar.range);
              },
            };

            if (!remove && !toolbar.registered) {
              this.__toolbars.push(toolbar);

              Object.keys(handlers).forEach(function (handler) {
                return toolbar.addEventListener(handler, handlers[handler]);
              });
              toolbar.registered = true;
            } else {
              toolbar.registered = false;
              Object.keys(handlers).forEach(function (handler) {
                return toolbar.removeEventListener(handler, handlers[handler]);
              }); //this.__toolbars = this.__toolbars.filter((bar) => bar !== toolbar);
            }
          },
          /**
           * sets selection range to specified node
           * @param {object} node node to select
           * @returns {void}
           */
        },
        {
          key: "selectNode",
          value: function selectNode(node, range) {
            var editor =
              arguments.length > 2 && arguments[2] !== undefined
                ? arguments[2]
                : this.toolbar.editor;

            if (!range) {
              var sel = window.getSelection();
              range = document.createRange();
              sel.removeAllRanges();
              sel.addRange(range);
            }

            if (range) {
              range.selectNode(node);
              if (editor) this.updateRange(editor, range);
            }
          },
          /**
           * sets selection range to specified node's contents
           * @param {object} node node to select
           * @returns {void}
           */
        },
        {
          key: "selectNodeContents",
          value: function selectNodeContents(node, range) {
            var editor =
              arguments.length > 2 && arguments[2] !== undefined
                ? arguments[2]
                : this.toolbar.editor;

            if (node) {
              if (!range) {
                var sel = window.getSelection();
                range = document.createRange();
                sel.removeAllRanges();
                sel.addRange(range);
              }

              if (editor) this.updateRange(editor);
            }
          },
          /**
           * selects or deselects(collapses) a range
           *
           * @param {object} range
           * @param {boolean} [select=true] select range?
           * @memberof RichTextEditorSelection
           */
        },
        {
          key: "selectRange",
          value: function selectRange(range) {
            var select =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : true;
            var editor = arguments.length > 2 ? arguments[2] : undefined;

            if (range) {
              if (select) {
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
              } else {
                if (!range.isCollapsed) range.collapse();
              }

              if (editor) this.updateRange(editor);
            } //console.log("selectRange", range, select, window.getSelection());

            return range;
          },
        },
        {
          key: "surroundRange",
          value: function surroundRange(node, range) {
            if (range) {
              range.surroundContents(node);
              if (editor) this.updateRange(editor);
            }

            return range;
          },
        },
        {
          key: "updateRange",
          value: function updateRange(editor, range) {
            if (editor) {
              var toolbar = this.getConnectedToolbar(editor);
              this.toolbar = toolbar;
              if (!range) range = editor.range;
              editor.range = range;

              if (toolbar) {
                toolbar.selectedNode = editor.selectedNode;
                toolbar.selectionAncestors = editor.selectionAncestors;
                toolbar.range = range;
              } //console.log("updateRange", editor, range, toolbar.range);
            }
          },
          /**
           * Generate a UUID
           * @returns {string} unique id
           */
        },
        {
          key: "_generateUUID",
          value: function _generateUUID() {
            var hex = Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
            return "rte-" + "ss-s-s-s-sss".replace(/s/g, hex);
          },
          /**
           * preserves highlight on editor selection when editor is not focus
           *
           * @param {*} editor
           * @param {*} e
           * @memberof RichTextEditorSelection
           */
        },
        {
          key: "_handleBlur",
          value: function _handleBlur(editor, e) {
            if (
              e.relatedTarget === null ||
              !e.relatedTarget.startsWith === "rich-text-editor"
            ) {
              this.edit(editor, true);
            } else if (editor) {
              this.highlight(editor.toolbar);
            }
          },
          /**
           *
           *
           * @param {object} toolbar toolbar element
           * @param {string} command command string
           * @param {string} commandVal string for command
           * @param {object} range
           * @memberof RichTextEditorSelection
           */
        },
        {
          key: "_handleCommand",
          value: function _handleCommand(toolbar, command, commandVal, range) {
            var editor = toolbar.editor;

            if (this.validCommands.includes(command)) {
              commandVal = editor
                ? editor.sanitizeHTML(commandVal)
                : commandVal;
              this.range = editor.range;
              this.updateRange(editor, range);
              this.selectRange(range, editor);

              if (command != "paste") {
                document.execCommand(command, false, commandVal);
              } else if (navigator.clipboard) {
                this.pasteFromClipboard(editor);
              }

              this.highlight(toolbar, false);
            } else if (command === "cancel") {
              if (editor) editor.revert();
              toolbar.close(editor);
            } else if (command === "close") {
              toolbar.close(editor);
            } else if (command === "viewSource") {
              if (editor) editor.viewSource = commandVal;
            }
          },
        },
        {
          key: "_handleEditorClick",
          value: function _handleEditorClick(editor, e) {
            if (!editor.__focused) {
              editor.focus();
            } else {
              var toolbar = !editor
                  ? undefined
                  : this.getConnectedToolbar(editor),
                els = !toolbar
                  ? []
                  : Object.keys(toolbar.__clickableElements || {}),
                el = e.target ||
                  e.srcElement || {
                    tagName: "",
                  },
                evt = {
                  detail: el,
                },
                tagname = (el.tagName || "").toLowerCase();

              if (tagname && els.includes(tagname)) {
                e.preventDefault();

                toolbar.__clickableElements[tagname](evt);
              }
            }
          },
          /**
           * registers parts of the editor so that selection can manage them
           *
           * @param {event} e
           * @memberof RichTextEditorSelection
           */
        },
        {
          key: "_handleRegistration",
          value: function _handleRegistration(e) {
            if (e.detail) {
              if (e.detail.toolbar)
                this.registerToolbar(e.detail.toolbar, e.detail.remove);
              if (e.detail.editor)
                this.registerEditor(e.detail.editor, e.detail.remove);
            }
          },
          /**
           * when a shortcut key is pressed, fire keypressed event on button associated with it
           * @param {object} editor editor that detects a shortcut key
           * @param {event} e key event
           */
        },
        {
          key: "_handleShortcutKeys",
          value: function _handleShortcutKeys(editor, e) {
            var toolbar = !editor
              ? undefined
              : this.getConnectedToolbar(editor);

            if (editor.editing) {
              var key = e.key;
              if (e.shiftKey) key = "shift+" + key;
              if (e.altKey) key = "alt+" + key;

              if (
                (window.navigator.platform === "MacIntel" && e.metaKey) ||
                e.ctrlKey
              ) {
                key = "ctrl+" + key;
              }

              if (toolbar.shortcutKeys[key])
                toolbar.shortcutKeys[key]._keysPressed(e);
            }
          },
          /**
           * Store tag name to make it easier to obtain directly.
           */
        },
      ],
      [
        {
          key: "tag",
          get: function get() {
            return "rich-text-editor-selection";
          },
        },
        {
          key: "properties",
          get: function get() {
            return {
              editor: {
                type: Object,
              },
              collapsed: {
                type: Boolean,
                reflect: true,
                attribute: "collapsed",
              },
              hidden: {
                type: Boolean,
                reflect: true,
                attribute: "hidden",
              },
              id: {
                type: String,
                reflect: true,
                attribute: "id",
              },
              observer: {
                type: Object,
              },
              range: {
                type: Object,
              },
              toolbar: {
                type: Object,
              },
              __toolbars: {
                type: Array,
              },
            };
          },
        },
        {
          key: "styles",
          get: function get() {
            return [].concat(
              _toConsumableArray(_richTextEditorButton.RichTextStyles),
              [(0, _litElement.css)(_templateObject2())]
            );
          },
        },
      ]
    );

    return RichTextEditorSelection;
  })(_litElement.LitElement);

exports.RichTextEditorSelection = RichTextEditorSelection;
window.customElements.define(
  RichTextEditorSelection.tag,
  RichTextEditorSelection
);
window.RichTextEditorSelection = {};
window.RichTextEditorSelection.instance = null;
/**
 * Checks to see if there is an instance available, and if not appends one
 */

window.RichTextEditorSelection.requestAvailability = function () {
  if (window.RichTextEditorSelection.instance == null) {
    window.RichTextEditorSelection.instance = document.createElement(
      RichTextEditorSelection.tag
    );
    document.body.appendChild(window.RichTextEditorSelection.instance);
  }

  return window.RichTextEditorSelection.instance;
};
