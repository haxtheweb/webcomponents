"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RichTextEditorRangeBehaviors = void 0;

require("./rich-text-editor-highlight.js");

require("./rich-text-editor-clipboard.js");

require("./rich-text-editor-source.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var RichTextEditorRangeBehaviors = function RichTextEditorRangeBehaviors(SuperClass) {
  return (
    /*#__PURE__*/
    function (_SuperClass) {
      _inherits(_class, _SuperClass);

      _createClass(_class, null, [{
        key: "properties",

        /**
         * Declared properties and their corresponding attributes
         */
        get: function get() {
          return {
            /**
             * current text selected range, which is actually a range.
             */
            range: {
              name: "range",
              type: Object
            },
            __toolbar: {
              name: toolbar,
              type: Object
            },
            __highlight: {
              type: Object
            },
            __clipboard: {
              type: Object
            },
            __source: {
              type: Object
            }
          };
        }
      }]);

      function _class() {
        var _this;

        _classCallCheck(this, _class);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this));
        _this.haxUIElement = true;
        _this.__highlight = window.RichTextEditorHighlight.requestAvailability();
        _this.__clipboard = window.RichTextEditorClipboard.requestAvailability();
        return _this;
      }

      _createClass(_class, [{
        key: "closeToolbar",

        /**
         * closes the toolbar
         *
         * @param {object} toolbar
         * @param {object} editor
         * @memberof RichTextEditorManager
         */
        value: function closeToolbar() {
          var toolbar = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.__toolbar;
          var editor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.__toolbar.target;
          if (editor) toolbar.disableEditing(editor);
          toolbar.target = undefined;
          document.body.append(toolbar);
        }
        /* ------ HANDLES CLIPBOARD AND HTML ------------------------- */

      }, {
        key: "sanitizeHTML",
        value: function sanitizeHTML(html) {
          return this.__toolbar.sanitizeHTML(html);
        }
        /**
         * gets trimmed version of innerHTML
         *
         * @param {obj} node
         * @returns {string}
         * @memberof RichTextEditor
         */

      }, {
        key: "trimHTML",
        value: function trimHTML(node) {
          var str = node ? node.innerHTML : undefined;
          return this.trimString(str);
        }
        /**
         * cleans and trims a string of HTML so that it has no extra spaces
         *
         * @param {string} str
         * @returns {string}
         */

      }, {
        key: "trimString",
        value: function trimString(str) {
          return (str || "").replace(/<!--[^(-->)]*-->/g, "").replace(/[\s\t\r\n]/gim, "");
        }
        /**
         * cleans up indents and extra spaces in HTML string for source code editor
         *
         * @param {string} [str=""]
         * @returns {string}
         */

      }, {
        key: "outdentHTML",
        value: function outdentHTML() {
          var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
          str = (this.sanitizeHTML(str) || "").replace(/[\s]*$/, "").replace(/^[\n\r]*/, "").replace(/[\n\r]+/gm, "\n");
          var match = str.match(/^\s+/),
              find = match ? match[0] : false,
              regex = !find ? false : new RegExp("\\n".concat(find), "gm");
          str = str.replace(/^\s+/, "");
          str = regex ? str.replace(regex, "\n ") : str;
          return str;
        }
        /**
         * pastes sanitized clipboard contents into current editor's selected range
         * @param {object} editor an HTML object that can be edited
         * @returns {void}
         */

      }, {
        key: "pasteFromClipboard",
        value: function pasteFromClipboard() {
          var _this2 = this;

          var range = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.range;

          this.__clipboard.setClipboard();

          setTimeout(function _callee() {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _this2.paste(_this2.__clipboard.value, range, true);

                  case 1:
                  case "end":
                    return _context.stop();
                }
              }
            });
          }, 100);
        }
        /**
         * pastes content into editor's selected range
         *
         * @param {obj} editor editor
         * @param {obj} pasteContent content to paste
         * @memberof RichTextEditorSelection
         */

      }, {
        key: "paste",
        value: function paste(pasteContent) {
          var range = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.range;
          var sanitize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
          this.dispatchEvent(new CustomEvent("paste", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this.target
          }));
          var target = this.__toolbar.target;

          if (target) {
            var _range = this.range,
                div = document.createElement("div"),
                parent = _range.commonAncestorContainer.parentNode,
                closest = parent.closest("[contenteditable=true]:not([disabled]),input:not([disabled]),textarea:not([disabled])");

            if (target = closest) {
              div.innerHTML = sanitize ? this.sanitizeHTML(pasteContent || this.__clipboard.value) : pasteContent;

              if (_range && _range.extractContents) {
                _range.extractContents();
              }

              _range.insertNode(div);

              while (div.firstChild) {
                div.parentNode.insertBefore(div.firstChild, div);
              }

              div.parentNode.removeChild(div);
            }

            target.normalize();
          }
        }
        /* ------ GETS SELECTION / RANGE ------------------------- */

        /**
         * determines if range is being preserved by highlight
         *
         * @readonly
         */

      }, {
        key: "getRange",
        value: function getRange() {
          var sel = this.getSelection();
          return this.__toolbar ? this.__toolbar.getRange() : sel.getRangeAt(0);
        }
      }, {
        key: "getSelection",
        value: function getSelection() {
          return this.__toolbar ? this.__toolbar.getSelection() : window.getSelection();
        }
        /**
         * gets closest shadowRoot or document from node
         *
         * @param {object} node
         * @returns object
         * @memberof RichTextEditorManager
         */

      }, {
        key: "getRoot",
        value: function getRoot(node) {
          return !node || node === document ? document : node.parentNode ? this.getRoot(node.parentNode) : node;
        }
      }, {
        key: "debugRange",
        value: function debugRange() {
          var range = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getRange();
          var contents = !range || range.collapsed || !range.cloneContents ? false : range.cloneContents(),
              ancestor = !range ? false : range.commonAncestorContainer,
              elementSiblings = !ancestor ? [] : ancestor.children,
              siblings = !ancestor ? [] : ancestor.childNodes,
              ancestorHTML = !ancestor ? "" : ancestor.innerHTML;
          return {
            range: range,
            contents: contents,
            html: contents.innerHTML,
            text: !contents ? false : contents.textContent,
            siblngs: siblings,
            elementSiblings: elementSiblings,
            ancestorHTML: ancestorHTML
          };
        }
        /**
         * determines if command should be toggled on for a specfified range.
         * Example: if range is bold, returns 'b'
         *
         * @param {*} [range=this.range || this.getRange()]
         * @param {*} [command=this.command]
         * @returns
         */

      }, {
        key: "commandToggledForRange",
        value: function commandToggledForRange() {
          var range = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.range || this.getRange();
          var command = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.command;
          var commandVal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.commandVal;
          var query = !!range && !!command ? document.queryCommandState(this.command) : false,

          /* workaround because queryCommandState("underline") returns true on links */
          block = command === "underline" ? !!this.rangeOrMatchingAncestor("u") : command === "wrapRange" ? !!this.rangeOrMatchingAncestor(commandVal) : command === "insertOrderedList" ? !!this.rangeOrMatchingAncestor('OL') : command === "insertUnorderedList" ? !!this.rangeOrMatchingAncestor('UL') : query;
          return !!block ? true : false;
        }
        /**
         * returns an array of all toggled commands for a range.
         * Example: if range is bold and italicized, returns ['b','i']
         *
         * @param {range} [range=this.range || this.getRange()]
         * @returns {array}
         */

      }, {
        key: "toggledCommandsForRange",
        value: function toggledCommandsForRange() {
          var _this3 = this;

          var range = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.range || this.getRange();
          return this.validCommands.filter(function (command) {
            _this3.commandToggledForRange(range, command);
          });
        }
        /**
         * selects command element that contains range.
         * Example: if command is 'a' and range is text inside <a/>, returns <a>
         *
         * @param {string} [cssQuery=this.tagsList || '']
         * @param {range} [range=this.range || this.getRange()]
         * @returns {node}
         */

      }, {
        key: "rangeOrMatchingAncestor",
        value: function rangeOrMatchingAncestor() {
          var cssQuery = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.tagsList || "";
          var range = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.range || this.getRange();
          var start = this.rangeElementOrParentElement(range);
          return !start || cssQuery == "" ? undefined : start.matches(cssQuery) ? start : start.closest(cssQuery);
        }
        /**
         * returns elmement that includes range
         *
         * @param {object} [range=this.range || this.getRange()]
         * @returns {node}
         */

      }, {
        key: "rangeElementOrParentElement",
        value: function rangeElementOrParentElement() {
          var range = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.range || this.getRange();
          return this.rangeIsElement(range) ? range.startContainer : this.rangeParentElement(range);
        }
        /**
         * returns node that includes range
         *
         * @param {*} [range=this.range || this.getRange()]
         * @returns
         */

      }, {
        key: "rangeNodeOrParentNode",
        value: function rangeNodeOrParentNode() {
          var range = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.range || this.getRange();
          return this.rangeIsNode(range) ? range.startContainer : this.rangeParentNode(range);
        }
        /**
         * returns a an array ancestor nodes of range to use for breadcrumbs
         *
         * @param {range} [range=this.range || this.getRange()]
         * @returns {array}
         */

      }, {
        key: "rangeBreadcrumbs",
        value: function rangeBreadcrumbs() {
          var _this4 = this;

          var range = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.range || this.getRange();

          var nodes = [],
              getParentNode = function getParentNode(node) {
            nodes.push(node);
            if (node.parentNode && node.parentNode !== _this4.target) getParentNode(node.parentNode);
          };

          nodes.push({
            nodeName: false
          });
          return nodes.reverse();
        }
        /**
         * determines if range is a single node
         *
         * @param {range} [range=this.range || this.getRange()]
         * @returns {boolean}
         */

      }, {
        key: "rangeIsNode",
        value: function rangeIsNode() {
          var range = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.range || this.getRange();
          var startContainer = !range ? undefined : range.startContainer,
              startOffset = !range ? undefined : range.startOffset,
              endContainer = !range ? undefined : range.endContainer,
              endOffset = !range ? undefined : range.endOffset;
          return !!startContainer && startContainer === endContainer && endOffset - startOffset === 1;
        }
        /**
         * determines if range is a single element
         *
         * @param {*} [range=this.range || this.getRange()]
         * @returns {boolean}
         */

      }, {
        key: "rangeIsElement",
        value: function rangeIsElement() {
          var range = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.range || this.getRange();
          return this.rangeIsNode(range) && range.startContainer.nodeType == 1;
        }
        /**
         * gets parent element of range
         *
         * @param {range} [range=this.range || this.getRange()]
         * @returns {node}
         */

      }, {
        key: "rangeParentElement",
        value: function rangeParentElement() {
          var range = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.range || this.getRange();
          var common = !range ? undefined : range.commonAncestorContainer;
          return !common ? undefined : common.nodeType == 1 ? common : common.parentElement;
        }
        /**
         * gets parent node of range
         *
         * @param {range} [range=this.range || this.getRange()]
         * @returns {node}
         */

      }, {
        key: "rangeParentNode",
        value: function rangeParentNode() {
          var range = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.range || this.getRange();
          var common = !range ? undefined : range.commonAncestorContainer;
          return !common ? undefined : common.parentNode;
        }
        /**
         * returns an array of all node in a range
         *
         * @param {range} [range=this.range || this.getRange()]
         * @returns {array}
         */

      }, {
        key: "rangeNodes",
        value: function rangeNodes() {
          var range = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.range || this.getRange();
          var node = this.rangeFirstNode(range),
              nodes = [];

          while (!!node) {
            nodes.push(node);
            node = node.nextSibling;
          }

          return nodes;
        }
        /**
         * captures information about a range so same range can be found
         * if target HTML is same as saved HTML
         *
         * @param {object} target target element (usually an editor)
         * @param {object} [range=this.getRange()] current range to save
         * @returns {object} saved offsets and node traversal to start and end containers
         */

      }, {
        key: "getRangeForCopy",
        value: function getRangeForCopy(target) {
          var range = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.getRange();

          var startLocation,
              endLocation,
              getOffsets = function getOffsets(node) {
            var offsets = [];

            while (!!node && (!!node.parentNode || !!node.host) && node !== target) {
              offsets.push(_toConsumableArray(node.parentNode.childNodes).indexOf(node));
              node = node.parentNode || node.host;
            }

            return offsets;
          };

          if (range && (range.commonAncestorContainer === target || target.contains(range.commonAncestorContainer))) {
            startLocation = getOffsets(range.startContainer, range.startOffset);
            endLocation = getOffsets(range.endContainer, range.endOffset);
          }

          return !startLocation || !endLocation ? undefined : {
            startOffset: range.startOffset,
            startLocation: startLocation,
            endOffset: range.endOffset,
            endLocation: endLocation
          };
        }
        /**
         * given as saved range and target html,
         * gets range when target html matches html
         * from when range info was collected
         *
         * @param {object} target target element (usually an editor)
         * @param {object} rangeInfo object containing saved offsets and node traversal to start and end containers
         * @returns {object} range
         */

      }, {
        key: "getRangeFromCopy",
        value: function getRangeFromCopy(target, rangeInfo) {
          if (!rangeInfo || !target) return;

          var range = new Range(),
              getContainer = function getContainer(offsets) {
            var node = target;
            offsets.reverse().forEach(function (i) {
              var childNodes = !node ? undefined : _toConsumableArray(node.childNodes);
              if (childNodes) node = childNodes[i];
            });
            return node;
          },
              startContainer = getContainer(rangeInfo.startLocation),
              endContainer = getContainer(rangeInfo.endLocation);

          if (startContainer && endContainer) {
            range.setStart(startContainer, rangeInfo.startOffset);
            range.setEnd(endContainer, rangeInfo.endOffset);
          }

          return range;
        }
        /**
         * gets first node of range
         *
         * @param {range} [range=this.range || this.getRange()]
         * @returns {node}
         */

      }, {
        key: "rangeFirstNode",
        value: function rangeFirstNode() {
          var range = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.range || this.getRange();
          return !!range && !!range.startContainer && !!range.startContainer.childNodes ? range.startContainer.childNodes[range.startOffset - 1] : undefined;
        }
        /**
         * gets last node of range
         *
         * @param {range} [range=this.range || this.getRange()]
         * @returns {node}
         */

      }, {
        key: "rangeLastNode",
        value: function rangeLastNode() {
          var range = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.range || this.getRange();
          return !!range && !!range.endContainer && !!range.endContainer.childNodes ? range.endContainer.childNodes[range.endOffset - 1] : undefined;
        }
        /* ------ CONTROLS RANGE ------------------------- */

        /**
         * sets selection range to specified node
         * @param {object} node node to select
         * @returns {void}
         */

      }, {
        key: "selectNode",
        value: function selectNode(node) {
          var range = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.range;
          if (!node || !node.parentNode) return;

          if (!range) {
            var sel = this.getSelection();
            range = document.createRange();
            sel.removeAllRanges();
            sel.addRange(range);
          }

          if (range) {
            range.selectNode(node);

            this._rangeChanged(range);
          }
        }
        /**
         * sets selection range to specified node's contents
         * @param {object} node node to select
         * @returns {void}
         */

      }, {
        key: "selectNodeContents",
        value: function selectNodeContents(node) {
          var range = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.range;

          if (node) {
            if (!range) {
              var sel = this.getSelection();
              range = document.createRange();
              sel.removeAllRanges();
              sel.addRange(range);
            }

            if (range) {
              range.selectNodeContents(node);

              this._rangeChanged(range);
            }
          }
        }
        /**
         * selects and highlights a node
         *
         * @param {object} node
         * @param {object} range object
         */

      }, {
        key: "highlightNode",
        value: function highlightNode(node) {
          var range = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.range;
          var keepPaused = this.__toolbar.historyPaused;
          this.__toolbar.historyPaused = true;
          var element = node || this.rangeOrMatchingAncestor();
          if (!!element) this.selectNode(node, range);

          this.__toolbar.updateRange();

          this.__highlight.wrap(range);

          this.__toolbar.historyPaused = keepPaused;
        }
        /**
         * selects or deselects(collapses) a range
         *
         * @param {object} range
         * @param {boolean} [select=true] select range?
         * @memberof RichTextEditorSelection
         */

      }, {
        key: "selectRange",
        value: function selectRange() {
          var range = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.range;
          var select = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

          if (range) {
            if (select) {
              var sel = this.getSelection();
              sel.removeAllRanges();
              sel.addRange(range);
            } else {
              if (!range.isCollapsed) range.collapse();
            } //this._rangeChanged(range);

          }

          return range;
        }
        /**
         * sets range to content within a node
         *
         * @param {object} node
         * @param {range} range
         * @returns
         * @memberof RichTextEditorSelection
         */

      }, {
        key: "surroundRange",
        value: function surroundRange(node) {
          var range = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.range;

          if (range) {
            range.surroundContents(node); //this._rangeChanged(range);
          }
        }
      }, {
        key: "_rangeChanged",
        value: function _rangeChanged(range) {
          this.dispatchEvent(new CustomEvent("rangechange", {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
              element: this,
              range: range
            }
          }));
        }
        /**
         * only initialises view source if needed
         *
         */

      }, {
        key: "initViewSource",
        value: function initViewSource() {
          this.__source = this.__source || window.RichTextEditorSource.requestAvailability();
        }
        /**
         * handles commands sent from toolbar
         *
         * @param {object} toolbar toolbar element
         * @param {string} command command string
         * @param {string} commandVal string for command
         * @param {object} range
         * @memberof RichTextEditorManager
         */

      }, {
        key: "_handleCommand",
        value: function _handleCommand(command, commandVal) {
          var range = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.getRange();
          var toolbar = this.__toolbar,
              target = toolbar.target,
              keepPaused = toolbar && toolbar.historyPaused,
              el = this.__highlight == this.rangeElementOrParentElement() ? this.__highlight.parentNode : this.rangeElementOrParentElement(),
              tagName = el.tagName,
              ul = 'insertUnorderedList',
              ol = 'insertOrderedList';
          if (!toolbar || !target || target.disabled || !target.getAttribute("contenteditable") || target.getAttribute("contenteditable") != "true") return;

          if (command === "cancel") {
            //custom cancel source command
            toolbar.revertTarget(target);
            toolbar.close(target);
          } else if (command === "close") {
            //custom close source command
            toolbar.close(target);
          } else if (command === "viewSource") {
            //custom view source command
            this.__source.toggle(toolbar);
          } else if (command == "undo") {
            //overrides default undo
            toolbar.undo();
            return;
          } else if (command == "redo") {
            //overrides default redo
            toolbar.redo();
            return;
          } else if (["UL", "OL", "LI"].includes(tagName) && [ul, ol].includes(command)) {
            //handle list toggling
            var parent = el.parentNode,
                listType = ["UL", "OL"].includes(tagName) ? tagName.toLowerCase() : parent && parent.tagName ? parent.tagName.toLowerCase() : '',
                toggle = listType == 'ul' && command == ul || listType == 'ol' && command == ol,
                swap = listType == 'ol' && command == ul || listType == 'ul' && command == ol,
                switchListStyles = function switchListStyles(node) {
              var newNode = document.createElement(node.tagName == 'OL' ? 'ul' : 'ol');
              node.parentNode.insertBefore(newNode, node);

              _toConsumableArray(node.children).forEach(function (li) {
                return newNode.append(li);
              });

              node.remove();
              range.selectNode(newNode);
              range.collapse();
            },
                unwapListItem = function unwapListItem(list, li) {
              var block = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "p";
              var reverse = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
              var blockEl = document.createElement(block);

              _toConsumableArray(li.childNodes).forEach(function (child) {
                return blockEl.append(child);
              });

              if (reverse) {
                list.parentNode.insertBefore(blockEl, list.nextSibling);
              } else {
                list.parentNode.insertBefore(blockEl, list);
              }

              range.selectNode(blockEl);
              li.remove();
            },
                unwapLists = function unwapLists(list, block) {
              _toConsumableArray(list.children).forEach(function (li) {
                return unwapListItem(list, li, block);
              });

              list.remove();
              range.collapse();
            };

            if (tagName == "LI" && toggle && parent.firstChild == el) {
              unwapListItem(parent, el);
            } else if (tagName == "LI" && toggle && parent.lastChild == el) {
              unwapListItem(parent, el, 'p', true);
            } else if (toggle) {
              unwapLists(parent);
            } else if (swap) {
              switchListStyles(parent);
            }
          } else if (command == "wrapRange" && !!commandVal) {
            //custom command wraps a range in element specified by commandVal
            var toggled = this.commandToggledForRange(range, "wrapRange", commandVal),
                node = this.rangeOrMatchingAncestor(commandVal);
            this.keepPaused = toolbar.historyPaused;
            toolbar.historyPaused = true; //if range not wrapped in specified element, nwrap it

            if (!toggled) {
              // if button is not toggled, wrap the range
              this.__highlight.wrap(range);

              var html = this.__highlight.innerHTML;
              this.__highlight.innerHTML = "<".concat(commandVal, ">").concat(html.trim(), "</").concat(commandVal, ">");
              node = this.__highlight.querySelector(commandVal);
              range.selectNode(node);

              this.__highlight.unwrap(range); //if range is already wrapped in specified element, unwrap it

            } else if (toggled) {
              //if button is toggled, unwrap the range
              var nodes = node ? _toConsumableArray(node.childNodes).reverse() : [];
              if (range) range.setStartBefore(node);
              nodes.forEach(function (node) {
                if (range) range.insertNode(node);
              });
              if (node) node.parentElement.normalize();
              if (node) range.selectNodeContents(node);
              if (node) node.remove();
            }

            toolbar.historyPaused = keepPaused;
            target.normalize();
          } else if (this.validCommands.includes(command)) {
            commandVal = toolbar && commandVal ? toolbar.sanitizeHTML(commandVal) : commandVal;
            this.keepPaused = toolbar.historyPaused;
            toolbar.historyPaused = true;

            if (!this.__highlight.hidden) {
              range = this.__highlight.range || this.getRange();
            }

            this.selectRange(range); //override default paste

            if (command == "paste") {
              if (navigator.clipboard) this.pasteFromClipboard(); //execute other commands as normal until I update deprecated execCommand
            } else {
              document.execCommand(command, false, commandVal);
            }

            this.__highlight.unwrap();

            target.normalize();
            toolbar.historyPaused = keepPaused;
            toolbar.range = this.getRange();
          }
        }
      }, {
        key: "commandIsToggled",
        get: function get() {
          return this.commandToggledForRange();
        }
        /**
         * whether or not toolbar breadcrumbs
         * (override to force a toolbar to always use or not use them)
         *
         * @readonly
         */

      }, {
        key: "hasBreadcrumbs",
        get: function get() {
          return false;
        }
        /**
         * an array of all the valid commands that are toggled
         *
         * @readonly
         */

      }, {
        key: "toggledCommands",
        get: function get() {
          return this.toggledCommandsForRange();
        }
        /**
         * gets valid commands list
         *
         * @readonly
         */

      }, {
        key: "validCommands",
        get: function get() {
          return ["backColor", "bold", "copy", "createLink", "cut", "decreaseFontSize", "defaultParagraphSeparator", "delete", "fontName", "fontSize", "foreColor", "formatBlock", "forwardDelete", "hiliteColor", "increaseFontSize", "indent", "insertBrOnReturn", "insertHorizontalRule", "insertHTML", "insertImage", "insertLineBreak", "insertOrderedList", "insertUnorderedList", "insertParagraph", "insertText", "italic", "justifyCenter", "justifyFull", "justifyLeft", "justifyRight", "outdent", "paste", "redo", "removeFormat", "selectAll", "strikeThrough", "styleWithCss", "subscript", "superscript", "underline", "undo", "unlink", "useCSS", "wrapRange"];
        }
      }, {
        key: "highlighted",
        get: function get() {
          return !!this.__highlight && !this.__highlight.hidden;
        }
      }]);

      return _class;
    }(SuperClass)
  );
};

exports.RichTextEditorRangeBehaviors = RichTextEditorRangeBehaviors;