"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RichTextEditorToolbarBehaviors = exports.RichTextEditorToolbar = void 0;

var _lit = require("lit");

var _templateContent = require("lit-html/directives/template-content.js");

var _simpleToolbar = require("@lrnwebcomponents/simple-toolbar/simple-toolbar.js");

var _simpleToolbarButton = require("@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-button.js");

var _richTextEditorButton = require("@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-button.js");

var _richTextEditorRangeBehaviors = require("@lrnwebcomponents/rich-text-editor/lib/singletons/rich-text-editor-range-behaviors.js");

require("@lrnwebcomponents/rich-text-editor/lib/singletons/rich-text-editor-prompt.js");

require("@lrnwebcomponents/absolute-position-behavior/absolute-position-behavior.js");

var shadow = _interopRequireWildcard(require("shadow-selection-polyfill/shadow.js"));

var _utils = require("@lrnwebcomponents/utils/utils.js");

var _richTextEditorDefaultPatterns = require("@lrnwebcomponents/rich-text-editor/lib/markdown/rich-text-editor-default-patterns.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _templateObject6() {
  var data = _taggedTemplateLiteral([" <div id=\"container\">", "</div> "]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["", ""]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["<kbd>", "</kbd>"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n          :host {\n            border: var(--rich-text-editor-border-width, 1px) solid\n              var(--rich-text-editor-border-color, #ddd);\n            background-color: var(--rich-text-editor-bg, #ffffff);\n          }\n        \n          #morebutton::part(button) {\n            border-radius: var(\n              --rich-text-editor-button-disabled-border-radius,\n              0px\n            );\n          }\n        "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n          :host {\n            position: relative;\n            height: 0;\n            margin: 0 auto;\n            padding: 0;\n            border: none;\n            background-color: none;\n          }\n          #container {\n            display: flex;\n            position: absolute;\n            bottom: 0;\n            margin: 0 auto;\n            padding: 0;\n            border: var(--rich-text-editor-border-width, 1px) solid\n              var(--rich-text-editor-border-color, #ddd);\n            background-color: var(\n              --rich-text-editor-bg,\n              var(--rich-text-editor-bg, #ffffff)\n            );\n          }\n        "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["", ""]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

window.RichTextEditorToolbars = window.RichTextEditorToolbars || [];
/**
 * RichTextEditorToolbarBehaviors
 *
 * @extends SimpleToolbarBehaviors
 * @extends RichTextToolbarStyles
 * @customElement
 * @class
 * @lit-html
 * @lit-element
 *
 *
 */

var RichTextEditorToolbarBehaviors = function RichTextEditorToolbarBehaviors(SuperClass) {
  return (
    /*#__PURE__*/
    function (_RichTextEditorRangeB) {
      _inherits(_class, _RichTextEditorRangeB);

      _createClass(_class, [{
        key: "render",
        // render function for template
        value: function render() {
          return (0, _lit.html)(_templateObject(), this.toolbarTemplate);
        } // properties available to custom element for data binding

      }], [{
        key: "tag",

        /**
         * Store tag name to make it easier to obtain directly.
         */
        get: function get() {
          return "rich-text-editor-toolbar";
        }
        /**
         * styles for small floating toolbar
         *
         * @readonly
         * @static
         */

      }, {
        key: "miniStyles",
        get: function get() {
          return [(0, _lit.css)(_templateObject2())];
        }
        /**
         * base styles toolbar: simple toolbar base styles + custom styles for rich text
         *
         * @readonly
         * @static
         */

      }, {
        key: "baseStyles",
        get: function get() {
          return [].concat(_toConsumableArray(_get(_getPrototypeOf(_class), "baseStyles", this)), _toConsumableArray(_richTextEditorButton.RichTextStyles), [(0, _lit.css)(_templateObject3())]);
        }
        /**
         * default styles for toolbar: base + simple-toolbar sticky styles
         *
         * @readonly
         * @static
         */

      }, {
        key: "styles",
        get: function get() {
          return [].concat(_toConsumableArray(this.baseStyles), _toConsumableArray(_get(_getPrototypeOf(_class), "stickyStyles", this)));
        }
      }, {
        key: "properties",
        get: function get() {
          return _objectSpread({}, _get(_getPrototypeOf(_class), "properties", this), {
            /**
             * The label for the breadcrums area.
             */
            breadcrumbsLabel: {
              name: "breadcrumbsLabel",
              type: String,
              attribute: "breadcrumbs-label"
            },

            /**
             * The label for the breadcrums area.
             */
            breadcrumbsSelectAllLabel: {
              name: "breadcrumbsSelectAllLabel",
              type: String,
              attribute: "breadcrumbs-select-all-label"
            },

            /**
             * `rich-text-editor` element that is currently in `editing` mode
             */
            target: {
              name: "target",
              type: Object
            },

            /**
             * `rich-text-editor` unique id
             */
            id: {
              name: "id",
              type: String,
              attribute: "id",
              reflect: true
            },

            /**
             * current text selected range.
             */
            savedSelection: {
              name: "savedSelection",
              type: Object
            },

            /**
             * selection singleton
             */
            registered: {
              type: Boolean
            },

            /**
             * currently selected node
             */
            selectedNode: {
              type: Object
            },

            /**
             * array of ancestors of currently selected node
             */
            selectionAncestors: {
              type: Array
            },

            /**
             * when to make toolbar visible:
             * "always" to keep it visible,
             * "selection" when there is an active selection,
             * or defaults to only when connected to a toolbar
             */
            show: {
              type: String,
              attribute: "show",
              reflect: true
            },

            /**
             * Tracks inline widgets that require selection data
             */
            clickableElements: {
              name: "clickableElements",
              type: Object
            },

            /**
             * endables markdown and other replacement patterns
             */
            enableMarkdown: {
              name: "enableMarkdown",
              attribute: "enable-markdown",
              type: Boolean
            },

            /**
             * array of allowed replacement patterns
             */
            markdownPatterns: {
              name: "markdownPatterns",
              type: Object
            },

            /**
             * sets a maximum amount of undo/redo steps in history
             */
            historyMax: {
              name: "historyMax",
              attribute: "history-max",
              type: Number
            },

            /**
             * Tracks history for undo/redo
             */
            history: {
              name: "history",
              type: Array
            },

            /**
             * pauses history when multiple mutations must count as one change
             */
            historyPaused: {
              name: "historyPaused",
              type: Boolean
            },

            /**
             * location of undo in history
             */
            historyLocation: {
              name: "historyLocation",
              type: Number
            },

            /**
             * contains cancelled edits
             */
            __canceledEdits: {
              type: Object
            },

            /**
             * hides paste button in Firefox
             */
            __pasteDisabled: {
              name: "__pasteDisabled",
              type: Boolean,
              attribute: "paste-disabled",
              reflect: true
            },

            /**
             * prompt object called by prompt buttons
             */
            __prompt: {
              type: Object
            },

            /**
             * whether prompt is open
             */
            __promptOpen: {
              name: "__promptOpen",
              type: Boolean
            },

            /**
             * list of replacements patterns
             */
            __patternList: {
              name: "__patternList",
              type: Array
            },

            /**
             * documentation schema for markdown object
             */
            __markdownDocsuments: {
              name: "__markdownDocsuments",
              type: Object
            }
          });
        }
      }]);

      function _class() {
        var _this;

        _classCallCheck(this, _class);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this)); // prettier-ignore

        Promise.resolve().then(function () {
          return _interopRequireWildcard(require("@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-source-code.js"));
        }); // prettier-ignore

        Promise.resolve().then(function () {
          return _interopRequireWildcard(require("@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-heading-picker.js"));
        }); // prettier-ignore

        Promise.resolve().then(function () {
          return _interopRequireWildcard(require("@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-underline.js"));
        }); // prettier-ignore

        Promise.resolve().then(function () {
          return _interopRequireWildcard(require("@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-image.js"));
        }); // prettier-ignore

        Promise.resolve().then(function () {
          return _interopRequireWildcard(require("@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-link.js"));
        }); // prettier-ignore

        Promise.resolve().then(function () {
          return _interopRequireWildcard(require("@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-unlink.js"));
        }); // prettier-ignore

        _this.resetHistory();

        _this.config = _this.defaultConfig;
        _this.markdownPatterns = _richTextEditorDefaultPatterns.rteDefaultPatterns;
        _this.clickableElements = {};
        _this.breadcrumbsLabel = "Select";
        _this.breadcrumbsSelectAllLabel = "All";
        _this.__toolbar = _assertThisInitialized(_this);
        _this.__patternList = [];
        _this.historyMax = 10;
        document.addEventListener(shadow.eventName, _this._handleTargetSelection.bind(_this.__toolbar));

        _this.addEventListener("mousedown", _this._handleToolbarMousedown);

        _this.addEventListener("mouseover", _this._handleToolbarMouseover);

        return _this;
      }

      _createClass(_class, [{
        key: "connectedCallback",
        value: function connectedCallback() {
          _get(_getPrototypeOf(_class.prototype), "connectedCallback", this).call(this);

          window.RichTextEditorToolbars.push(this);
        }
        /**
         * life cycle, element is disconnected
         * @returns {void}
         */

      }, {
        key: "disconnectedCallback",
        value: function disconnectedCallback() {
          var _this2 = this;

          _get(_getPrototypeOf(_class.prototype), "disconnectedCallback", this).call(this);

          window.RichTextEditorToolbars = window.RichTextEditorToolbars.filter(function (toolbar) {
            return toolbar !== _this2;
          });
        }
      }, {
        key: "firstUpdated",
        value: function firstUpdated(changedProperties) {
          var _this3 = this;

          if (!this.id) this.id = this._generateUUID();

          _get(_getPrototypeOf(_class.prototype), "firstUpdated", this).call(this, changedProperties);

          if (this.hasBreadcrumbs && this.editor) this.positionByTarget(this.editor); //this.__dialog = window.RichTextEditorDialog.requestAvailability();

          this.__prompt = window.RichTextEditorPrompt.requestAvailability();

          this.__prompt.addEventListener("open", function (e) {
            _this3.__promptOpen = true;
          });

          this.__prompt.addEventListener("close", function (e) {
            _this3.__promptOpen = false;
          });
        }
      }, {
        key: "updated",
        value: function updated(changedProperties) {
          var _this4 = this;

          _get(_getPrototypeOf(_class.prototype), "updated", this).call(this, changedProperties);

          changedProperties.forEach(function (oldValue, propName) {
            if (propName === "historyMax") {
              var offset = _this4.history.length - _this4.historyLocation;
              _this4.history = _this4.history.slice(0 - _this4.historyMax);
              _this4.historyLocation = Math.min(0, _this4.history.length - offset);
            }

            if (propName === "range" || propName == "historyPaused") _this4._rangeChanged(_this4.range, oldValue);
            if (propName === "config") _this4.updateToolbar();
            if (propName === "editor") _this4._editorChange();
            if (["editor", "show", "range"].includes(propName)) _this4.hidden = _this4.disconnected;
            if (["breadcrumbs", "sticky"].includes(propName) && !!_this4.breadcrumbs) _this4.breadcrumbs.sticky = _this4.sticky;
            if (["history", "historyLocation"].includes(propName)) _this4._updateUndoRedoButtons();
          });
          this.checkDocSection(changedProperties, "markdownPatterns", "__markdownDocs", '_getMarkdownDocs', "enableMarkdown");
        }
      }, {
        key: "_getMarkdownDocs",

        /**
         * updates markdown patterns list and documentation
         * @returns 
         */
        value: function _getMarkdownDocs() {
          var _this5 = this;

          // get custom patterns or falback to defaults
          if (!this.markdownPatterns) this.markdownPatterns = _richTextEditorDefaultPatterns.rteDefaultPatterns;
          if (!this.markdownPatterns) return; // skeleton schema for markdown section of docs

          var schema = this.markdownPatterns.documentation;
          schema.contents = [];
          this.__patternList = []; // for each group of patterns, make a schema for a cheatsheet table in docs

          var groups = this.markdownPatterns.patterns;
          (groups || []).forEach(function (group) {
            // skeleton schema for cheatsheet
            var mdDoc = group.documentation;
            if (!mdDoc) return;
            var mdCheat = mdDoc.cheatsheet || {};

            if (mdCheat) {
              var cheat = {
                columns: mdCheat.columns ? mdCheat.columns : _this5.markdownPatterns.cheatsheetHeadings ? _toConsumableArray(_this5.markdownPatterns.cheatsheetHeadings) : ["Pattern", "Result"]
              };
              var mdRows = cheat.rows || [];

              var rows = [],
                  flattenPatterns = function flattenPatterns(group) {
                return group.match ? group : (group.patterns || []).map(function (p) {
                  return flattenPatterns(p);
                }).flat();
              },
                  sheetPatterns = flattenPatterns(group);

              (sheetPatterns || []).forEach(function (pattern) {
                (pattern.examples || []).forEach(function (example) {
                  if (example) {
                    //convert result to html
                    var result = document.createElement('template');
                    result.innerHTML = example;
                    result.innerHTML = example.replace(pattern.match, pattern.replace);
                    rows.push([//cell that shows example code for pattern
                    (0, _lit.html)(_templateObject4(), example), //cell that shows example's result when replacement runs
                    (0, _lit.html)(_templateObject5(), (0, _templateContent.templateContent)(result))]);
                  }
                });

                _this5.__patternList.push(pattern);
              }); //add rows to cheat sheet

              cheat.rows = [].concat(_toConsumableArray(mdRows), rows); // add each pattern to patterns list

              schema.contents.push(_objectSpread({}, mdDoc, {
                cheatsheet: cheat
              }));
            }
          }); // update markdown section of documentation 

          return schema;
        }
        /**
         * default config for an undo button
         *
         * @readonly
         */

      }, {
        key: "_isRangeInScope",

        /**
         * determines if range is in scope of editor
         *
         * @param {object} [range=this.range] range object
         * @returns {boolean}
         */
        value: function _isRangeInScope() {
          var range = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.range;
          var rangeParent = range ? this.rangeNodeOrParentNode(range) : false,
              targetIsRangeParent = this.target && this.target == rangeParent,
              targetIsRangeAncestor = this.target && rangeParent && this.target.contains(rangeParent);
          return targetIsRangeParent || targetIsRangeAncestor;
        }
        /**
         * cancels edits to active editor
         * @returns {void}
         * @event cancel
         */

      }, {
        key: "cancel",
        value: function cancel() {
          this.resetHistory();
          this.dispatchEvent(new CustomEvent("cancel", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this
          }));
        }
        /**
         * closes toolbar
         * @returns {void}
         * @event disableediting
         *
         */

      }, {
        key: "close",
        value: function close() {
          this.resetHistory();
          this.target = undefined;
          this.positionByTarget(false);
          this.dispatchEvent(new CustomEvent("close", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this
          }));
        }
        /**
         * fires when editor changed
         * @event editor-change
         */

      }, {
        key: "_editorChanged",
        value: function _editorChanged() {
          this.resetHistory();
          this.updateHistory();
          this.dispatchEvent(new CustomEvent("editor-change", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this
          }));
        }
        /* ------- RANGES -------- */

        /**
         * function for getting range;
         * can be overriden
         */

      }, {
        key: "getRange",
        value: function getRange() {
          var shadowRoot = function shadowRoot(el) {
            var parent = el.parentNode;
            return parent ? shadowRoot(parent) : el;
          };

          try {
            this.range = shadowRoot(this.target) ? shadow.getRange(shadowRoot(this.target)) : undefined;
          } catch (e) {
            this.range = undefined;
          }

          return this.range;
        }
      }, {
        key: "getSelection",
        value: function (_getSelection) {
          function getSelection() {
            return _getSelection.apply(this, arguments);
          }

          getSelection.toString = function () {
            return _getSelection.toString();
          };

          return getSelection;
        }(function () {
          return window, getSelection();
        })
        /**
         * maintains consistent range info across toolbar and target
         *
         * @param {object} editor
         * @param {range} range
         * @memberof RichTextEditorManager
         */

      }, {
        key: "updateRange",
        value: function updateRange(target) {
          var range = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.range;
          if (!target) return;
          if (!target.range) target.range = range;
        }
        /**
         * updates buttons and fires when rane changes
         * @event range-changed
         * @param {event} e
         */

      }, {
        key: "_rangeChanged",
        value: function _rangeChanged(newValue, oldValue) {
          if (newValue !== oldValue && !this.historyPaused) this._updateButtonRanges(this._isRangeInScope(oldValue));
          this.dispatchEvent(new CustomEvent("range-changed", {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: this
          }));
        }
        /* ------- BUTTONS AND BREADCRUMBS -------- */

        /**
         * clears toolbar and resets shortcuts
         *
         * @returns
         * @memberof SimpleToolbar
         */

      }, {
        key: "clearToolbar",
        value: function clearToolbar() {
          if (_get(_getPrototypeOf(_class.prototype), "clearToolbar", this)) _get(_getPrototypeOf(_class.prototype), "clearToolbar", this).call(this);
          this.clickableElements = {};
        }
        /**
         * registers button when appended to toolbar
         *
         * @param {object} button button node
         * @memberof SimpleToolbar
         */

      }, {
        key: "deregisterButton",
        value: function deregisterButton(button) {
          if (_get(_getPrototypeOf(_class.prototype), "deregisterButton", this)) _get(_getPrototypeOf(_class.prototype), "deregisterButton", this).call(this, button);
        }
        /**
         * registers button when appended to toolbar
         *
         * @param {object} button button node
         * @memberof SimpleToolbar
         */

      }, {
        key: "registerButton",
        value: function registerButton(button) {
          var _this6 = this;

          if (_get(_getPrototypeOf(_class.prototype), "registerButton", this)) _get(_getPrototypeOf(_class.prototype), "registerButton", this).call(this, button); //firefox doesn't allow for clipboard button

          if (button.command === "paste" && !navigator.clipboard) {
            button.remove();
            return;
          }

          button.__toolbar = this;
          button.disabled = !this.target;
          (button.tagsArray || []).forEach(function (tag) {
            if (!!tag && !!button.tagClickCallback) _this6.clickableElements[tag] = _this6.clickableElements[tag] || button;
          });

          this._updateUndoRedoButton(button);
        }
        /**
         * updates end-user-doc when it is registered
         */

      }, {
        key: "updateEndUserDoc",
        value: function updateEndUserDoc() {
          if (_get(_getPrototypeOf(_class.prototype), "updateEndUserDoc", this)) _get(_getPrototypeOf(_class.prototype), "updateEndUserDoc", this).call(this); //add end-user-doc markdown schema if there is one

          this.updateDocSection("__markdownDocs", '_getMarkdownDocs', true, true);
        }
        /**
         * adds breadcrumbfeature
         *
         */

      }, {
        key: "_addBreadcrumbs",
        value: function _addBreadcrumbs() {
          if (!this.breadcrumbs) {
            this.breadcrumbs = document.createElement("rich-text-editor-breadcrumbs");
            document.body.appendChild(this.breadcrumbs);
          }

          this.breadcrumbs.label = this.breadcrumbsLabel;
          return this.breadcrumbs;
        }
        /**
         * Generate a UUID
         * @returns {string} unique id
         */

      }, {
        key: "_generateUUID",
        value: function _generateUUID() {
          var hex = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
          return "rte-" + "ss-s-s-s-sss".replace(/s/g, hex);
        }
        /**
         * handles updated button
         *
         * @param {event} e
         */

      }, {
        key: "_handleButtonUpdate",
        value: function _handleButtonUpdate(e) {
          if (_get(_getPrototypeOf(_class.prototype), "_handleButtonUpdate", this)) _get(_getPrototypeOf(_class.prototype), "_handleButtonUpdate", this).call(this, e);
        }
        /**
         * creates a div element to contain/group buttons based on config object
         *
         * @param {object} config object containing configuration for a group of buttons
         * @returns {object} div element as a button group
         * @memberof SimpleToolbar
         */

      }, {
        key: "_renderButtonGroup",
        value: function _renderButtonGroup(config) {
          var group = _get(_getPrototypeOf(_class.prototype), "_renderButtonGroup", this).call(this, config);

          if (config.subtype) group.classList.add(config.subtype);
          return group;
        }
        /**
         * updates disabled property of undo and redo buttons based on history
         */

      }, {
        key: "_updateUndoRedoButtons",
        value: function _updateUndoRedoButtons() {
          var _this7 = this;

          (this.buttons || []).forEach(function (button) {
            return _this7._updateUndoRedoButton(button);
          });
        }
        /**
         *
         * updates disabled property of an undo or redo button based on history
         *
         * @param {*} button
         */

      }, {
        key: "_updateUndoRedoButton",
        value: function _updateUndoRedoButton(button) {
          if (button.command == "undo") {
            button.disabled = !this.history || this.historyLocation < 1;
          } else if (button.command == "redo") {
            button.disabled = !this.history || this.historyLocation > this.history.length - 2;
          }
        }
        /**
         * updates buttons with selected range
         * @returns {void}
         */

      }, {
        key: "_updateButtonRanges",
        value: function _updateButtonRanges(clearEmptyRanges) {
          var _this8 = this;

          if (this.isRangeInScope) {
            var nodes = [],
                getParentNode = function getParentNode(node) {
              if ((node.tagName || "").toLowerCase() !== "rich-text-editor-highlight") nodes.push(node);
              if (node.parentNode && node.parentNode !== _this8.target) getParentNode(node.parentNode);
            };

            if (this.rangeNodeOrParentNode(this.range) !== this.target) getParentNode(this.rangeNodeOrParentNode(this.range));
            nodes.push({
              nodeName: this.breadcrumbsSelectAllLabel,
              selectAll: this.target
            });
            this.selectedNode = nodes[0];
            this.selectionAncestors = nodes.reverse();

            if (this.breadcrumbs) {
              this.breadcrumbs.selectionAncestors = this.selectionAncestors;
              this.breadcrumbs.hidden = this.disconnected;
              this.breadcrumbs.editor = this.editor;
            }

            (this.buttons || []).forEach(function (button) {
              button.range = undefined;
              button.range = _this8.range;
              button.selectedNode = _this8.selectedNode;
              button.selectionAncestors = _this8.selectionAncestors;
            });
          } else if (clearEmptyRanges) {
            if (this.breadcrumbs) {
              this.breadcrumbs.selectionAncestors = undefined;
            }

            (this.buttons || []).forEach(function (button) {
              button.range = undefined;
            });
          }
        }
        /* ------- TARGET -------- */

        /**
         * undo for canceled edits
         *
         * @param {object} editor
         * @memberof RichTextEditorManager
         */

      }, {
        key: "cancelEdits",
        value: function cancelEdits() {
          var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.target;
          this.revertTarget(target);
          this.target(editor, false);
        }
      }, {
        key: "positionByTarget",

        /**
         * moves toolbar into position before the target
         * (can be overriden for custom positioning)
         * @param {object} target
         */
        value: function positionByTarget(target) {
          if (!!target) {
            target.parentNode.insertBefore(this, target);
            this.slot = target.slot;

            if (this.hasBreadcrumbs) {
              this.breadcrumbs = this.breadcrumbs || this._addBreadcrumbs();
              this.target.parentNode.insertBefore(this.breadcrumbs, this.target.nextSibling);
              this.breadcrumbs.slot = target.slot;
            }
          } else {
            document.body.append(this);
            this.slot = undefined;

            if (this.breadcrumbs) {
              document.body.append(this.breadcrumbs);
              this.breadcrumbs.slot = undefined;
            }
          }
        }
        /**
         * disables editing
         *
         * @param {object} editor
         * @memberof RichTextEditorManager
         */

      }, {
        key: "enableEditing",
        value: function enableEditing() {
          var _this9 = this;

          var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.editor;
          var handlers = this.enabledTargetHandlers;

          if (!!target && !target.hidden && !target.disabled) {
            if (target.makeSticky) target.makeSticky(this.sticky);
            this.positionByTarget(target);
            if (!target.getAttribute("contenteditable") || target.getAttribute("contenteditable") == true) target.setAttribute("contenteditable", "true");
            Object.keys(handlers).forEach(function (handler) {
              return target.addEventListener(handler, handlers[handler]);
            });
            this.setCanceledEdits();
            this.updateRange(target);
            this.observeChanges(true);

            this.getRoot(target).onselectionchange = function (e) {
              if (!_this9.__promptOpen) _this9.updateRange(target, _this9.getRange());
            };

            this.dispatchEvent(new CustomEvent("enabled", {
              bubbles: true,
              composed: true,
              cancelable: true,
              detail: (this.target.innerHTML || "").replace(/<!--[^(-->)]*-->/g, "").trim()
            }));
            target.tabindex = 0;
            if (this.history.length < 1) this.updateHistory();
          }
        }
      }, {
        key: "disableEditing",
        value: function disableEditing() {
          var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.target;
          var handlers = this.enabledTargetHandlers,
              range = this.getRange();

          if (!!target) {
            if (!!range) range.collapse(false);

            this.__highlight.emptyContents();

            this.getRoot(target).onselectionchange = undefined;
            this.observeChanges(false);
            if (this.__source) this.__source.toggle(false);
            if (!!target.getAttribute("contenteditable") || target.getAttribute("contenteditable") == true) target.removeAttribute("contenteditable");
            Object.keys(handlers).forEach(function (handler) {
              return target.removeEventListener(handler, handlers[handler]);
            });
            if (target.makeSticky) target.makeSticky(false);
            this.dispatchEvent(new CustomEvent("disabled", {
              bubbles: true,
              composed: true,
              cancelable: true,
              detail: (this.target.innerHTML || "").replace(/<!--[^(-->)]*-->/g, "").trim()
            }));
            target.tabindex = -1;
          }
        }
        /**
         * make an new editable element
         *
         * @param {object} editor an HTML object that can be edited
         * @returns {void}
         */

      }, {
        key: "insertNew",
        value: function insertNew(target) {
          var content = document.createElement("rich-text-editor");
          target.parentNode.insertBefore(content, target);
          content.appendChild(target);
        }
        /**
         * set observer on or off
         *
         * @param {boolean} [on=true]
         * @memberof RichTextEditor
         */

      }, {
        key: "observeChanges",
        value: function observeChanges() {
          var on = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

          if (on) {
            this.observer.observe(this.target, {
              attributes: true,
              childList: true,
              subtree: true,
              characterData: false
            });
          } else {
            if (this.observer) this.observer.disconnect;
          }
        }
        /**
         * revert content to before editing=true
         *
         * @memberof RichTextEditor
         */

      }, {
        key: "revertTarget",
        value: function revertTarget() {
          var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.target;
          if (this.target) this.target.innerHTML = this.__canceledEdits;
        }
        /**
         * sanitizesHTML
         * override this function to make your own filters
         *
         * @param {string} html html to be pasted
         * @returns {string} filtered html as string
         */

      }, {
        key: "sanitizeHTML",
        value: function sanitizeHTML() {
          var html = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
          var regex = "<body(.*\n)*>(.*\n)*</body>";
          if (html.match(regex) && html.match(regex).length > 0) html = html.match(regex)[0].replace(/<\?body(.*\n)*\>/i);
          return html;
        }
        /**
         * holds on to edits so cancel willwork
         *
         * @param {string} [html=this.innerHTML]
         * @memberof RichTextEditor
         */

      }, {
        key: "setCanceledEdits",
        value: function setCanceledEdits(html) {
          this.__canceledEdits = html ? html : this.target && this.target.innerHTML ? this.target.innerHTML : "";
        }
      }, {
        key: "setTarget",
        value: function setTarget(target) {
          var _this10 = this;

          var handlers = this.targetHandlers(target),
              oldTarget = this.target;

          if (!!target) {
            var _oldTarget = this.target;
            if (_oldTarget && _oldTarget.getAttribute("role") == "textbox") _oldTarget.removeAttribute("role");
            target.setAttribute("role", "textbox");

            if (_oldTarget !== target) {
              if (!!_oldTarget) this.unsetTarget(_oldTarget);
              Object.keys(handlers).forEach(function (handler) {
                return target.addEventListener(handler, handlers[handler]);
              });

              this.getRoot(target).onselectionchange = function (e) {
                if (!_this10.__promptOpen) _this10.updateRange(target, _this10.getRange());
              };

              this.target = target;
              this.enableEditing(target);
            }
          }

          this.updateRange(this.target);
          if (this.breadcrumbs) this.breadcrumbs.controls = this.controls;
          this.buttons.forEach(function (button) {
            if (button.command !== "close") button.disabled = !_this10.target;
          });

          if (target !== oldTarget) {
            this.range = undefined;

            this._rangeChanged();
          }
        }
      }, {
        key: "unsetTarget",
        value: function unsetTarget() {
          var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.target;
          var handlers = this.targetHandlers(target);
          this.disableEditing(target);
          Object.keys(handlers).forEach(function (handler) {
            return target.removeEventListener(handler, handlers[handler]);
          });
          this.target = undefined;
        }
        /**
         * determines if target is empty
         *
         * @returns {string}
         * @memberof RichTextEditor
         */

      }, {
        key: "targetEmpty",
        value: function targetEmpty() {
          return !this.target || !this.target.innerHTML || this.trimHTML(this.target) == "";
        }
        /**
         * list of event handlers for a given target
         *
         * @param {*} target
         * @returns
         */

      }, {
        key: "targetHandlers",
        value: function targetHandlers(target) {
          var _this11 = this;

          return {
            dblclick: function dblclick(e) {
              return _this11._handleTargetClick(target, e);
            },
            focus: function focus(e) {
              return _this11._handleTargetFocus(target, e);
            },
            blur: function blur(e) {
              return _this11._handleTargetBlur(e);
            },
            keydown: function keydown(e) {
              return _this11._handleTargetKeydown(e);
            },
            keyup: function keyup(e) {
              return _this11._handlePatterns(e);
            },
            paste: function paste(e) {
              return _this11._handlePaste(e);
            }
          };
        }
        /**
         * gets cleaned HTML from the target
         *
         * @returns {string}
         * @memberof RichTextEditor
         */

      }, {
        key: "htmlMatchesTarget",
        value: function htmlMatchesTarget(html) {
          var outdentedHTML = !!html ? this.outdentHTML(html) : undefined,
              cleanHTML = outdentedHTML ? outdentedHTML.replace(/\s+/gm, "") : undefined,
              cleanTarget = this.targetHTML ? this.targetHTML.replace(/\s+/gm, "") : undefined;
          return cleanHTML && cleanTarget && cleanTarget.localeCompare(cleanHTML);
        }
      }, {
        key: "_handleTargetClick",
        value: function _handleTargetClick(target, e) {
          var _this12 = this;

          var eventPath = (0, _utils.normalizeEventPath)(e);
          if (!target || target.disabled) return;

          if (this.target !== target) {
            e.preventDefault();
            this.setTarget(target);
          } else {
            var els = Object.keys(this.clickableElements || {}),
                matched = false;
            eventPath.forEach(function (target) {
              if (matched) return;
              var tagname = (target.tagName || "").toLowerCase();

              if (tagname && els.includes(tagname)) {
                matched = true;
                e.preventDefault();

                var ee = _objectSpread({}, e, {
                  detail: target,
                  eventPath: eventPath
                });

                _this12.clickableElements[tagname].tagClickCallback(ee);
              }
            });
          }

          this.range = this.getRange();
          this.updateRange();
        }
        /**
         * handles when an editor assigned to toolbar loses focus
         * saves highlighted selection until a new editor receives focus
         * @param {*} e 
         */

      }, {
        key: "_handleTargetBlur",
        value: function _handleTargetBlur(e) {
          if (this.target && !this.__highlight.isActiveForEditor(this.target)) {
            this._addHighlight();
          }
        }
        /**
         * handles when an editor assigned to toolbar receives focus
         * removes highlight from other editor targets
         * @param {object} target 
         * @param {event} e 
         */

      }, {
        key: "_handleTargetFocus",
        value: function _handleTargetFocus(target, e) {
          this._removeHighlight();

          if (!this.__promptOpen && !target.disabled) {
            this.setTarget(target);
          }
        }
        /**
         * handles when target editor has mousedown event
         * @param {event} e 
         */

      }, {
        key: "_handleTargetKeydown",
        value: function _handleTargetKeydown(e) {
          this._handleShortcutKeys(e);
        }
        /**
         * handles when toolbar has mousedown event
         * @param {event} e 
         */

      }, {
        key: "_handleToolbarMousedown",
        value: function _handleToolbarMousedown(e) {
          //stops mousedown from bubbling up and triggering other focus logic
          e.stopImmediatePropagation();
        }
        /**
         * handles when toolbar has mouseover event
         * @param {event} e 
         */

      }, {
        key: "_handleToolbarMouseover",
        value: function _handleToolbarMouseover(e) {
          //makes sure toolbar is enabled
          if (!!this.target) this.target.tabindex = 0;
        }
        /**
         * checks for markdown and replaces
         *
         * @param {event} e keypress event
         */

      }, {
        key: "_handlePatterns",
        value: function _handlePatterns(e) {
          var _this13 = this;

          if (!this.enableMarkdown) return;
          var range = this.getRange(); //ensures there will always be a child node to check

          if (_toConsumableArray(this.target.children).length < 1) {
            var p = document.createElement("p");

            _toConsumableArray(this.target.childNodes).forEach(function (node) {
              return p.append(node);
            });

            this.target.append(p);
            range.selectNodeContents(p);
            range.collapse();
            return;
          }

          var keepPaused = this.historyPaused;
          this.historyPaused = true; //drop a placeholder into editor so we know where range is

          var node = !range ? false : this.rangeNodeOrParentNode(range),
              id = "range-placeholder-" + Date.now(),
              span = document.createElement("span"),
              spanHTML = "<span id=\"".concat(id, "\"></span>"),
              placeholderSearch = new RegExp(spanHTML.replace(/([\+\*\?\^\$\\\.\[\]\{\}\(\)\|\/])/g, '\\$1')),
              target = node,
              found = false,
              rangeClone;
          span.id = id;
          if (this.target !== node && !this.target.contains(node)) return;

          if (e.key == "Enter" && range.commonAncestorContainer.previousElementSibling) {
            range.commonAncestorContainer.previousElementSibling.append(span);
          } else {
            range.insertNode(span);
          }

          rangeClone = range.cloneRange(); //adjust range if last key was enter key

          rangeClone.setStartBefore(rangeClone.startContainer); //gets a list of regexes filtered by matching last key so we don't have to text every regex

          var listByLastKey = function listByLastKey(list) {
            if (!cloneSplit || !cloneSplit[0] || cloneSplit.length < 2) return []; //last key

            var _char = e.key == "Enter" ? cloneSplit[0].charAt(cloneSplit[0].length - 1) : cloneSplit[0].charAt(cloneSplit[0].length - 2).replace(/\s/, 'space'),
                //list items for last key
            charKey = list[_char] ? list[_char] : [],
                //list items for enter key
            enterKey = e.key == "Enter" && list["enter"] ? list["enter"] : [],
                //everything that does not specify a key
            noKey = list["any"] || [];

            return [].concat(_toConsumableArray(charKey), _toConsumableArray(enterKey), _toConsumableArray(noKey));
          },
              //make a clone of specficied node to search for matches
          searchNodeClone,
              cloneHTML,
              cloneSplit,
              cloneSearch,
              makeSearchClone = function makeSearchClone(searchNode) {
            rangeClone.selectNode(node);
            if (searchNodeClone) searchNodeClone.remove();
            searchNodeClone = searchNode.cloneNode(true);
            var html = searchNodeClone && searchNodeClone.nodeType == 1;
            cloneHTML = searchNodeClone && html ? searchNodeClone.innerHTML : searchNodeClone ? searchNodeClone.textContent : false; //clean up extra spacing

            if (html && cloneHTML) cloneHTML = cloneHTML.replace(/&nbsp;/g, " ");
            if (cloneHTML) cloneHTML = cloneHTML.replace(/\s+/, " ").replace(/\s*\n\s*/, "\n");
            cloneSplit = cloneHTML ? cloneHTML.split(placeholderSearch) : [];
            cloneSearch = cloneSplit[0] ? cloneSplit[0] : false;
            if (!cloneSearch) cloneSplit[1] = ''; //convert &nbsp;

            if (html && cloneSearch) cloneSearch = cloneSearch.replace(/&nbsp;/g, " ");
          },
              match,
              //ignore matches is excluded ancestors
          isIgnored = function isIgnored(regex, searchNode) {
            var excludeAncestors = (regex.excludeAncestors || []).join();
            return searchNode && excludeAncestors.length > 0 ? searchNode.closest && searchNode.closest(excludeAncestors) : false;
          },
              checkMatch = function checkMatch(regex, searchNode) {
            var search = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : cloneSearch;
            var ignoreMatches = isIgnored(regex, searchNode);
            return !!search && search.length > 1 && regex.match && !ignoreMatches ? search.match(regex.match) : false;
          }; //main node of the range for matching commands


          makeSearchClone(node); //regex commands to text

          var commands = e.key == "Enter" ? this.commandsByLastKey['enter'] : listByLastKey(this.commandsByLastKey);
          commands.forEach(function (regex) {
            if (!node || !node.cloneNode) return;
            var ignoreMatches = isIgnored(regex, node),
                current = range.commonAncestorContainer,
                prev = current ? current.previousElementSibling : false;
            searchNodeClone = prev ? prev.cloneNode(true) : false;
            if (span) span.remove();
            var search = e.key == "Enter" ? searchNodeClone.innerHTML : cloneSplit[0] || '';
            match = !ignoreMatches && regex.match && search.length > 1 ? "".concat(search).match(regex.match) : false; //run the matching command

            if (match && match[0]) {
              var commandVal = regex.commandVal,
                  isToggled = (range.commonAncestorContainer.tagName || '').toLowerCase() == commandVal.toLowerCase() || range.commonAncestorContainer.closest(commandVal);

              if (e.key == "Enter") {
                range.setStartBefore(prev);
                prev.innerHTML = searchNodeClone.innerHTML.replace(regex.match, '');
                range.setEndAfter(current); //clean up extra stuff

                span = range.commonAncestorContainer ? range.commonAncestorContainer.querySelector("#".concat(id)) : false;
                span.parentElement.remove();
              }

              if (regex.command === "formatBlock" && isToggled) {
                commandVal = "p";
              } else if (regex.command === "wrapRange" && isToggled) {
                commandVal = "span";
              }

              _this13._handleCommand(regex.command, commandVal, _this13.getRange());

              range = _this13.getRange();
              found = true;
            }
          }); //handle multline patterns, usch as lists and headings

          if (!found && e.key == "Enter" && range.commonAncestorContainer.previousElementSibling) {
            var current = range.commonAncestorContainer,
                prev = current ? current.previousElementSibling : false;
            searchNodeClone = prev ? prev.cloneNode(true) : false;
            span = searchNodeClone ? searchNodeClone.querySelector("#".concat(id)) : false;
            if (span) span.remove();
            var search = searchNodeClone ? searchNodeClone.innerHTML.replace(/&nbsp;/, ' ') : false,
                multiline = search ? this.replacementsByLastKey["enter"] : [];
            if (searchNodeClone) searchNodeClone.remove();
            multiline.forEach(function (regex) {
              if (found) return;
              match = checkMatch(regex, node, search);

              if (match) {
                found = true;
                var replacement = search.replace(regex.match, regex.replace),
                    tags = /^(<([-a-zA-Z0-9]+)[^>]*>)(<([-a-zA-Z0-9]+)[^>]*>)(.*)(<\/\4>)(<\/\2>)$/; //for nested tags like with lists next lin should be same as nested tag

                if (replacement.match(tags)) {
                  replacement = replacement.replace(tags, "$1$3$5$6$3<br>$6$7");
                  range.setStartBefore(prev);
                  range.setEndAfter(current);

                  _this13._handleCommand('insertHTML', replacement, range); //update previous node and then select current node again

                } else {
                  range.selectNode(prev);

                  _this13._handleCommand('insertHTML', replacement + current.outerHTML, range);
                }
              }
            });
          }

          ; //search a given node for regex replacements

          var searchReplacements = function searchReplacements(searchNode) {
            makeSearchClone(searchNode); //regex replacement patterns to test

            var replacements = listByLastKey(_this13.replacementsByLastKey);
            replacements.forEach(function (regex) {
              if (!searchNode || !searchNode.cloneNode) return;
              var matchIndex = e.key == "Enter" ? 0 : 1;
              match = checkMatch(regex, searchNode);

              if (match && match[0] && cloneSearch.length - match[0].length - cloneSearch.lastIndexOf(match[0]) == matchIndex) {
                found = true;
                if (found && regex.replace) cloneSplit[0] = cloneSplit[0].replace(regex.match, regex.replace);
              }
            }); //update HTML with replacement

            if (found) {
              if (e.key == "Enter") {
                cloneSplit[1] = cloneSplit[1].replace(/(<\/[^<]+><[^<]+>.*)(<\/\S+>)/g, "$1".concat(spanHTML, "$2"));
                searchNode.innerHTML = cloneSplit.join('').replace(/\s(?![^<]+>)/g, '&nbsp;');
              } else {
                var prepend = new RegExp("".concat(e.key.replace(/([\+\*\?\^\$\\\.\[\]\{\}\(\)\|\/])/g, '\\$1'), "$"));
                cloneSplit[0] = cloneSplit[0].replace(prepend, '').replace(/\s$/, '&nbsp;');
                cloneSplit[1] = e.key.replace(/\s/, '&nbsp;') + spanHTML + cloneSplit[1].replace(/^\s/, '&nbsp;');
                searchNode.innerHTML = cloneSplit.join('').replace(/\s(?![^<]+>)/g, '&nbsp;');
              }

              span = searchNode.querySelector("#".concat(id));

              _this13.selectNode(span);

              range.collapse();
              span.remove();
            }
          }; //only search replacements if we didn't alread execute a comand
          //starting with a target, check for matches
          //expand search to parent if not found


          while (!found && !!target && target !== this.target && !!target.parentNode) {
            searchReplacements(target);
            target = target.parentNode;
          }

          if (!found) searchReplacements(this.target); //remove placeholder and clone

          if (span) span.remove();
          if (searchNodeClone) searchNodeClone.remove();
          this.historyPaused = keepPaused;
          if (found) this.updateHistory();
        }
      }, {
        key: "_handleTargetKeypress",
        value: function _handleTargetKeypress(e) {
          if (this.targetEmpty() && e.key) {
            this.innerHTML = e.key.replace(">", "&gt;").replace("<", "&lt;").replace("&", "&amp;");
            this.range = this.getRange();
            this.range.selectNodeContents(this);
            this.range.collapse();
          }
        }
      }, {
        key: "_handleTargetMutation",
        value: function _handleTargetMutation() {
          var _this14 = this;

          var mutations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

          this._handleTargetSelection();

          var target = this.target,
              update = false;
          (mutations || []).forEach(function (mutation) {
            if (mutation.type == "attributes" && ["disabled", "hidden", "contenteditable"].includes(mutation.attributeName)) {
              if ((target.disabled || target.hidden) && target.contenteditable) {
                _this14.disableEditing(target);
              } else if (!target.disabled && !target.hidden && target.contenteditable) {
                _this14.enableEditing(target);
              }
            } else if (!_this14.historyPaused) {
              var nodes = [].concat(_toConsumableArray(mutation.addedNodes || []), _toConsumableArray(mutation.removedNodes || [])),
                  filtered;
              filtered = nodes.filter(function (node) {
                return !node.getAttribute || !node.getAttribute("id") || node.getAttribute("id").indexOf("range-placeholder") < 0;
              });
              if (filtered.length > 0) update = true;
            }
          });
          if (update && !this.pauseHistoryUpdates) this.updateHistory();
        }
      }, {
        key: "_handleTargetSelection",
        value: function _handleTargetSelection(e) {
          if (!this.__promptOpen) this.range = this.getRange();
        }
      }, {
        key: "_handlePaste",
        value: function _handlePaste(e) {
          e.preventDefault();
          e.stopImmediatePropagation();
          this.pasteFromClipboard();
          return false;
        }
        /**
         * undo last action
         *
         */

      }, {
        key: "undo",
        value: function undo() {
          this._restoreFromHistory();
        }
        /**
         * redo last action
         *
         */

      }, {
        key: "redo",
        value: function redo() {
          this._restoreFromHistory(1);
        }
        /**
         * resets history, pausing, and location
         *
         */

      }, {
        key: "resetHistory",
        value: function resetHistory() {
          this.historyLocation = -1;
          this.history = [];
          this.historyPaused = false;
        }
        /**
         * adds new changes to history as long as history is not paused for complex changes
         *
         * @param {string} [description="change"] description of the type of change (to eventually allow for multi-step undo)
         * @param {string} [changes=this.targetHTML] html to save as a change
         * @param {object} [range=this.getRange()] current range
         * @returns
         */

      }, {
        key: "updateHistory",
        value: function updateHistory() {
          var description = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "change";
          //only update history if not paused
          if (this.pauseHistoryUpdates) return; //get range details

          this.getRange();
          var range = this.getRangeForCopy(this.target); //get start and end of history based on maximum amount saved

          var prev = this.history[this.historyLocation],
              html = this.target.innerHTML;
          if (prev && prev.html == html) return; //clear history after current location and add changes

          this.history = [].concat(_toConsumableArray(this.history.slice(0 - (this.historyMax - 1))), [{
            type: description,
            html: html,
            range: range
          }]); //set location to current changes

          this.historyLocation = this.history.length - 1;
        }
        /**
         * restores target HTML from history before or after the current point
         *
         * @param {number} [direction=-1] direction relative to current location of history, eg. -1 for undo
         */

      }, {
        key: "_restoreFromHistory",
        value: function _restoreFromHistory() {
          var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
          this.historyLocation = this.historyLocation + direction;

          if (-1 < this.historyLocation < this.history.length) {
            var history = this.history[this.historyLocation],
                inRange = this._isRangeInScope(this.range);

            if (!history || !history.html) return;
            this.historyPaused = true;
            this.target.innerHTML = history.html;
            var range = this.getRangeFromCopy(this.target, history.range);

            if (range && this._isRangeInScope(range)) {
              this._removeHighlight();

              this.selectRange(range);
              this.range = range;

              this._updateButtonRanges(inRange);
            }

            this.historyPaused = false;
          }
        }
        /**
         * handles keydown
         *
         * @param {event} e keydown event
         */

      }, {
        key: "_handleTargetKeyDown",
        value: function _handleTargetKeyDown(e) {
          var modifier = window.navigator.platform === "MacIntel" ? e.metaKey : e.ctrlKey;

          if (modifier && e.key == "z") {
            e.preventDefault();
            this.undo();
            return false;
          } else if (modifier && e.key == "y") {
            e.preventDefault();
            this.redo();
            return false;
          }

          this._removeHighlight();
        }
      }, {
        key: "_addHighlight",
        value: function _addHighlight() {
          this.range = this.getRange();
          if (!this.target || !this.target.getAttribute("contenteditable") == "true") return;

          this.__highlight.wrap(this.range || this.getRange());
        }
      }, {
        key: "_removeHighlight",
        value: function _removeHighlight() {
          this.__highlight.unwrap();
        }
      }, {
        key: "debugMD",
        get: function get() {
          return {
            contents: JSON.parse(JSON.stringify(this.endUserDocContents || {})),
            docs: JSON.parse(JSON.stringify(this.__markdownDocs || {})),
            patterns: JSON.parse(JSON.stringify(this.markdownPatterns || {})),
            schema: JSON.parse(JSON.stringify(this.__endUserDocSchema || {}))
          };
        }
      }, {
        key: "undoButton",
        get: function get() {
          return {
            command: "undo",
            icon: "undo",
            label: "Undo",
            shortcutKeys: "ctrl+z",
            type: "rich-text-editor-button"
          };
        }
        /**
         * default config for a redo button
         *
         * @readonly
         */

      }, {
        key: "redoButton",
        get: function get() {
          return {
            command: "redo",
            icon: "redo",
            label: "Redo",
            shortcutKeys: "ctrl+shift+z",
            type: "rich-text-editor-button"
          };
        }
        /**
         * default config for a history button group: undo + redo
         *
         * @readonly
         */

      }, {
        key: "historyButtonGroup",
        get: function get() {
          return {
            type: "button-group",
            subtype: "history-button-group",
            buttons: [this.undoButton, this.redoButton]
          };
        }
        /**
         * default config for a format button
         *
         * @readonly
         */

      }, {
        key: "formatButton",
        get: function get() {
          return {
            label: "Format",
            type: "rich-text-editor-heading-picker"
          };
        }
        /**
         * default config for a bold button
         *
         * @readonly
         */

      }, {
        key: "boldButton",
        get: function get() {
          return {
            command: "bold",
            icon: "editor:format-bold",
            label: "Bold",
            shortcutKeys: "ctrl+b",
            toggles: true,
            type: "rich-text-editor-button"
          };
        }
        /**
         * default config for an italic button
         *
         * @readonly
         */

      }, {
        key: "italicButton",
        get: function get() {
          return {
            command: "italic",
            icon: "editor:format-italic",
            label: "Italics",
            shortcutKeys: "ctrl+i",
            toggles: true,
            type: "rich-text-editor-button"
          };
        }
        /**
         * default config for an underline button
         *
         * @readonly
         */

      }, {
        key: "underlineButton",
        get: function get() {
          return {
            type: "rich-text-editor-underline"
          };
        }
        /**
         * default config for a remove format button
         *
         * @readonly
         */

      }, {
        key: "strikethroughButton",
        get: function get() {
          return {
            command: "strikeThrough",
            icon: "editor:format-strikethrough",
            label: "Strike Through",
            type: "rich-text-editor-button"
          };
        }
        /**
         * default config for a remove format button
         *
         * @readonly
         */

      }, {
        key: "removeFormatButton",
        get: function get() {
          return {
            command: "removeFormat",
            icon: "editor:format-clear",
            label: "Erase Format",
            type: "rich-text-editor-button"
          };
        }
        /**
         * default config for a remove format button
         *
         * @readonly
         */

      }, {
        key: "codeButton",
        get: function get() {
          return {
            command: "wrapRange",
            commandVal: "CODE",
            toggles: true,
            label: "Code",
            type: "rich-text-editor-button"
          };
        }
        /**
         * default config for a style button group: format, bold, italic, and remove format
         *
         * @readonly
         */

      }, {
        key: "basicInlineButtonGroup",
        get: function get() {
          return {
            type: "button-group",
            subtype: "basic-inline-button-group",
            buttons: [this.formatButton, this.boldButton, this.italicButton, this.removeFormatButton]
          };
        }
        /**
         * default config for a link button
         *
         * @readonly
         */

      }, {
        key: "linkButton",
        get: function get() {
          return {
            icon: "link",
            label: "Link",
            shortcutKeys: "ctrl+k",
            type: "rich-text-editor-link"
          };
        }
        /**
         * default config for a unlink button
         *
         * @readonly
         */

      }, {
        key: "unlinkButton",
        get: function get() {
          return {
            icon: "mdextra:unlink",
            label: "Remove Link",
            type: "rich-text-editor-unlink"
          };
        }
        /**
         * default config for a link button group: link
         *
         * @readonly
         */

      }, {
        key: "linkButtonGroup",
        get: function get() {
          return {
            type: "button-group",
            subtype: "link-button-group",
            buttons: [this.linkButton, this.unlinkButton]
          };
        }
        /**
         * default config for a cut button
         *
         * @readonly
         */

      }, {
        key: "cutButton",
        get: function get() {
          return {
            command: "cut",
            icon: "content-cut",
            label: "Cut",
            shortcutKeys: "ctrl+x",
            type: "rich-text-editor-button"
          };
        }
        /**
         * default config for a copy button
         *
         * @readonly
         */

      }, {
        key: "copyButton",
        get: function get() {
          return {
            command: "copy",
            icon: "content-copy",
            label: "Copy",
            shortcutKeys: "ctrl+c",
            type: "rich-text-editor-button"
          };
        }
        /**
         * default config for a paste button
         *
         * @readonly
         */

      }, {
        key: "pasteButton",
        get: function get() {
          return {
            command: "paste",
            icon: "content-paste",
            label: "Paste",
            shortcutKeys: "ctrl+v",
            type: "rich-text-editor-button"
          };
        }
        /**
         * default config for a clipboard button group: cut, copy, and paste
         *
         * @readonly
         */

      }, {
        key: "clipboardButtonGroup",
        get: function get() {
          return {
            type: "button-group",
            subtype: "clipboard-button-group",
            buttons: [this.cutButton, this.copyButton, this.pasteButton]
          };
        }
        /**
         * default config for a subscript button
         *
         * @readonly
         */

      }, {
        key: "subscriptButton",
        get: function get() {
          return {
            command: "subscript",
            icon: "mdextra:subscript",
            label: "Subscript",
            radio: true,
            type: "rich-text-editor-button"
          };
        }
        /**
         * default config for a superscript button
         *
         * @readonly
         */

      }, {
        key: "superscriptButton",
        get: function get() {
          return {
            command: "superscript",
            icon: "mdextra:superscript",
            label: "Superscript",
            radio: true,
            type: "rich-text-editor-button"
          };
        }
        /**
         * default config for a script button group: subscript & superscript
         *
         * @readonly
         */

      }, {
        key: "scriptButtonGroup",
        get: function get() {
          return {
            type: "simple-toolbar-button-group",
            subtype: "script-button-group",
            "aria-label": "Subscript and Superscript",
            buttons: [this.subscriptButton, this.superscriptButton]
          };
        }
        /**
         * default config for a symbol button
         *
         * @readonly
         */

      }, {
        key: "symbolButton",
        get: function get() {
          // prettier-ignore
          Promise.resolve().then(function () {
            return _interopRequireWildcard(require("@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-symbol-picker.js"));
          });
          return {
            symbolTypes: ["symbols"],
            type: "rich-text-editor-symbol-picker"
          };
        }
        /**
         * default config for a symbol button
         *
         * @readonly
         */

      }, {
        key: "iconButton",
        get: function get() {
          return {
            type: "rich-text-editor-icon-picker"
          };
        }
        /**
         * default config for an emoji button
         *
         * @readonly
         */

      }, {
        key: "emojiButton",
        get: function get() {
          // prettier-ignore
          Promise.resolve().then(function () {
            return _interopRequireWildcard(require("@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-emoji-picker.js"));
          });
          return {
            type: "rich-text-editor-emoji-picker"
          };
        }
        /**
         * default config for an image button
         *
         * @readonly
         */

      }, {
        key: "imageButton",
        get: function get() {
          return {
            type: "rich-text-editor-image"
          };
        }
        /**
         * default config for an insert button group: image
         *
         * @readonly
         */

      }, {
        key: "insertButtonGroup",
        get: function get() {
          return {
            type: "button-group",
            subtype: "insert-button-group",
            buttons: [this.imageButton, this.symbolButton]
          };
        }
        /**
         * default config for an insert button group: image
         *
         * @readonly
         */

      }, {
        key: "advancedInsertButtonGroup",
        get: function get() {
          return {
            type: "button-group",
            subtype: "advanced-insert-button-group",
            buttons: [this.emojiButton]
          };
        }
        /**
         * default config for a justify left button
         *
         * @readonly
         */

      }, {
        key: "justifyLeftButton",
        get: function get() {
          return {
            command: "justifyLeft",
            icon: "editor:format-align-left",
            label: "Align Left",
            radio: true,
            type: "rich-text-editor-button"
          };
        }
        /**
         * default config for a justify center button
         *
         * @readonly
         */

      }, {
        key: "justifyCenterButton",
        get: function get() {
          return {
            command: "justifyCenter",
            icon: "editor:format-align-center",
            label: "Align Center",
            radio: true,
            type: "rich-text-editor-button"
          };
        }
        /**
         * default config for a justify left button
         *
         * @readonly
         */

      }, {
        key: "justifyRightButton",
        get: function get() {
          return {
            command: "justifyRight",
            icon: "editor:format-align-right",
            label: "Align Right",
            radio: true,
            type: "rich-text-editor-button"
          };
        }
        /**
         * default config for a justify center button
         *
         * @readonly
         */

      }, {
        key: "justifyFullButton",
        get: function get() {
          return {
            command: "justifyFull",
            icon: "editor:format-align-justify",
            label: "Justify",
            radio: true,
            type: "rich-text-editor-button"
          };
        }
        /**
         * default config for an insert button group: image
         *
         * @readonly
         */

      }, {
        key: "justifyButtonGroup",
        get: function get() {
          return {
            type: "simple-toolbar-button-group",
            subtype: "advanced-insert-button-group",
            "aria-label": "Text Alignment",
            required: true,
            buttons: [this.justifyLeftButton, this.justifyCenterButton, this.justifyRightButton, this.justifyFullButton]
          };
        }
        /**
         * default config for an ordered list button
         *
         * @readonly
         */

      }, {
        key: "orderedListButton",
        get: function get() {
          return {
            command: "insertOrderedList",
            icon: "editor:format-list-numbered",
            label: "Ordered List",
            radio: true,
            type: "rich-text-editor-button"
          };
        }
        /**
         * default config for an unordered list button
         *
         * @readonly
         */

      }, {
        key: "unorderedListButton",
        get: function get() {
          return {
            command: "insertUnorderedList",
            icon: "editor:format-list-bulleted",
            label: "Unordered List",
            radio: true,
            type: "rich-text-editor-button"
          };
        }
        /**
         * default config for a blockquote button
         *
         * @readonly
         */

      }, {
        key: "blockquoteButton",
        get: function get() {
          return {
            command: "formatBlock",
            commandVal: "blockquote",
            label: "Blockquote",
            icon: "editor:format-quote",
            shortcutKeys: "ctrl+'",
            toggles: true,
            type: "rich-text-editor-button"
          };
        }
        /**
         * default config for an indent button
         *
         * @readonly
         */

      }, {
        key: "indentButton",
        get: function get() {
          return {
            command: "indent",
            icon: "editor:format-indent-increase",
            label: "Increase Indent",
            shortcutKeys: "ctrl+]",
            type: "rich-text-editor-button"
          };
        }
        /**
         * default config for an outdent button
         *
         * @readonly
         */

      }, {
        key: "outdentButton",
        get: function get() {
          return {
            command: "outdent",
            icon: "editor:format-indent-decrease",
            label: "Decrease Indent",
            shortcutKeys: "ctrl+[",
            type: "rich-text-editor-button"
          };
        }
        /**
         * default config for a list and indent button group:
         * ordered, unordered, blockquote, indent, outdent
         *
         * @readonly
         */

      }, {
        key: "listButtonGroup",
        get: function get() {
          return {
            type: "simple-toolbar-button-group",
            subtype: "list-button-group",
            "aria-label": "List Type",
            buttons: [this.orderedListButton, this.unorderedListButton]
          };
        }
        /**
         * default config for a list and indent button group:
         * ordered, unordered, blockquote, indent, outdent
         *
         * @readonly
         */

      }, {
        key: "listIndentButtonGroup",
        get: function get() {
          return {
            type: "button-group",
            subtype: "list-indent-button-group",
            buttons: [this.listButtonGroup, this.blockquoteButton, this.indentButton, this.outdentButton]
          };
        }
        /**
         * default config for an save button
         *
         * @readonly
         */

      }, {
        key: "saveButton",
        get: function get() {
          return {
            command: "save",
            icon: "save",
            label: "Save",
            type: "rich-text-editor-button"
          };
        }
        /**
         * default config for a close button
         *
         * @readonly
         */

      }, {
        key: "closeButton",
        get: function get() {
          return {
            command: "cancel",
            icon: "close",
            label: "Cancel",
            type: "rich-text-editor-button"
          };
        }
        /**
         * default config for a save and close button group: save and close
         *
         * @readonly
         */

      }, {
        key: "saveCloseButtonGroup",
        get: function get() {
          return {
            type: "button-group",
            subtype: "save-close-button-group",
            buttons: [this.saveButton]
          };
        }
        /**
         * default config for a view source button
         *
         * @readonly
         */

      }, {
        key: "sourceButton",
        get: function get() {
          return {
            type: "rich-text-editor-source-code"
          };
        }
        /**
         * default config for a source button group: view source
         *
         * @readonly
         */

      }, {
        key: "sourceButtonGroup",
        get: function get() {
          return {
            type: "button-group",
            subtype: "source-button-group",
            buttons: [this.sourceButton]
          };
        }
      }, {
        key: "helpButton",
        get: function get() {
          Promise.resolve().then(function () {
            return _interopRequireWildcard(require("../buttons/rich-text-editor-help-button.js"));
          });
          return {
            type: "rich-text-editor-help-button"
          };
        }
        /**
         * default config for toolbar with
         * default history, style, link, clipboard, script, insert, and list button groups
         *
         * @readonly
         */

      }, {
        key: "defaultConfig",
        get: function get() {
          return [this.historyButtonGroup, this.basicInlineButtonGroup, this.linkButtonGroup, this.clipboardButtonGroup, this.scriptButtonGroup, this.insertButtonGroup, this.listIndentButtonGroup, this.helpButton];
        }
        /**
         * default config for toolbar with
         * default a custom group of style buttons,
         * default link button group,
         * default script button group,
         * and a custom list button groups
         *
         * @readonly
         */

      }, {
        key: "miniConfig",
        get: function get() {
          return [{
            type: "button-group",
            buttons: [this.boldButton, this.italicButton, this.removeFormatButton]
          }, this.linkButtonGroup, this.scriptButtonGroup, {
            type: "button-group",
            buttons: [this.orderedListButton, this.unorderedListButton]
          }];
        }
        /**
         * a template that places toolbar in a container
         * so that it can be positioned absolutely
         *
         * @readonly
         */

      }, {
        key: "miniTemplate",
        get: function get() {
          return (0, _lit.html)(_templateObject6(), _get(_getPrototypeOf(_class.prototype), "toolbarTemplate", this));
        }
        /**
         * default toolbar template uses simple-toolbar
         *
         * @readonly
         */

      }, {
        key: "toolbarTemplate",
        get: function get() {
          return _get(_getPrototypeOf(_class.prototype), "toolbarTemplate", this);
        }
        /**
         * id of editor currently being controlled
         * @readonly
         * @returns {string}
         */

      }, {
        key: "controls",
        get: function get() {
          var controls = !this.target ? undefined : this.target.getAttribute("id");
          if (!!this.target) this.setAttribute("controls", controls);
          return controls;
        }
        /**
         * determines if the toolbar is hidden
         *
         * @readonly
         * @returns {boolean}
         */

      }, {
        key: "disconnected",
        get: function get() {
          return this.show == "always" ? false : this.show != "selection" ? !this.target : this.noSelection;
        }
        /**
         * determines if the toolbar has an extive selection
         *
         * @readonly
         * @returns {boolean}
         */

      }, {
        key: "noSelection",
        get: function get() {
          return !this.range || this.range.collapsed;
        }
        /**
         * mutation observer
         *
         * @readonly
         * @memberof RichTextEditor
         */

      }, {
        key: "observer",
        get: function get() {
          return new MutationObserver(this._handleTargetMutation.bind(this));
        }
        /**
         * determines if current range is in scope of the target
         *
         * @readonly
         */

      }, {
        key: "isRangeInScope",
        get: function get() {
          return this._isRangeInScope();
        }
        /**
         * object with lists of regexes by last key so only applicable regexes are checked
         *
         * @readonly
         */

      }, {
        key: "replacementsByLastKey",
        get: function get() {
          var regexes = {};

          this.__patternList.forEach(function (regex) {
            var keys = !regex.lastChars || regex.lastChars.length == 0 ? [""] : regex.lastChars;
            keys.forEach(function (key) {
              if (!regex.replace || !regex.match) return;

              var _char2 = key == "" ? "any" : key == " " ? "space" : key;

              regexes[_char2] = regexes[_char2] || [];

              regexes[_char2].push(regex);
            });
          });

          return regexes;
        }
        /**
         *
         * object with lists of commands by last key so only applicable commands are checked
         *
         * @readonly
         */

      }, {
        key: "commandsByLastKey",
        get: function get() {
          var regexes = {};

          this.__patternList.forEach(function (regex) {
            var keys = !regex.lastChars || regex.lastChars.length == 0 ? [""] : regex.lastChars;
            keys.forEach(function (key) {
              if (!!regex.replace || !regex.match) return;

              var _char3 = key == "" ? "any" : key == " " ? "space" : key;

              regexes[_char3] = regexes[_char3] || [];

              regexes[_char3].push(regex);
            });
          });

          return regexes;
        }
      }, {
        key: "pauseHistoryUpdates",
        get: function get() {
          return this.historyPaused || !this.target || !this.target.getAttribute("contenteditable") || this.target.getAttribute("contenteditable") != "true" || !!this.__prompt && !this.__prompt.hidden || !!this.__highlight && !this.__highlight.hidden || !!this.__highlight && this.__highlight.isActiveForEditor(this.target);
        }
      }, {
        key: "enabledTargetHandlers",
        get: function get() {
          return {
            keydown: this._handleTargetKeyDown.bind(this)
          };
        }
      }, {
        key: "targetHTML",
        get: function get() {
          return !!this.target ? this.outdentHTML(this.target.innerHTML) : undefined;
        }
      }]);

      return _class;
    }((0, _richTextEditorRangeBehaviors.RichTextEditorRangeBehaviors)((0, _simpleToolbar.SimpleToolbarBehaviors)(SuperClass)))
  );
};
/**
  * `rich-text-editor-toolbar`
  * is a default toolbar for rich text editor 
  * (can customize by extending RichTextEditorToolbarBehaviors)
  *
  * ### Styling
 `<rich-text-editor-toolbar>` uses RichTextToolbarStyles constant to set 
 SimpleToolbarBehaviors's simple-toolbar/simple-toolbar-button variables.
 
 To further customize a toolbar and its buttons:
 
 Custom property | Description | Default
 ----------------|-------------|----------
 --rich-text-editor-border-color | default border color | #ddd
 --rich-text-editor-border-width | default border width | 1px
 --rich-text-editor-bg | default toolbar background | #ffffff
 --rich-text-editor-button-opacity | default button opacity | 1
 --rich-text-editor-button-color | default button color | #444
 --rich-text-editor-button-bg | default button background | #ffffff
 --rich-text-editor-button-border-color | overrides default border-color for buttons | transparent
 --rich-text-editor-button-toggled-opacity | overrides default opacity when button is toggled | 1
 --rich-text-editor-button-toggled-color | overrides default text color when button is toggled | #222
 --rich-text-editor-button-toggled-bg | overrides default background when button is toggled | #ddd
 --rich-text-editor-button-toggled-border-color | overrides default border-color when button is toggled | transparent
 --rich-text-editor-button-hover-opacity | overrides default opacity when button is hovered or focused | 1
 --rich-text-editor-button-hover-color | overrides default text color when button is hovered or focused  | #000
 --rich-text-editor-button-hover-bg | overrides default background when button is hovered or focused | #f0f0f0
 --rich-text-editor-button-hover-border-color | overrides default border-color when button is hovered or focused | unset
 --rich-text-editor-button-disabled-opacity | overrides default opacity when button is disabled | 1
 --rich-text-editor-button-disabled-color | overrides default text color when button is disabled | #666
 --rich-text-editor-button-disabled-bg | overrides default background when button is disabled | transparent
 --rich-text-editor-button-disabled-border-color | overrides default border-color when button is toggled | transparent
  *
  * @extends RichTextEditorToolbarBehaviors
  * @extends LitElement
  * @customElement
  * @lit-html
  * @lit-element
  * @element rich-text-editor-toolbar
  * @demo ./demo/toolbar.html
  */


exports.RichTextEditorToolbarBehaviors = RichTextEditorToolbarBehaviors;

var RichTextEditorToolbar =
/*#__PURE__*/
function (_RichTextEditorToolba) {
  _inherits(RichTextEditorToolbar, _RichTextEditorToolba);

  function RichTextEditorToolbar() {
    _classCallCheck(this, RichTextEditorToolbar);

    return _possibleConstructorReturn(this, _getPrototypeOf(RichTextEditorToolbar).apply(this, arguments));
  }

  return RichTextEditorToolbar;
}(RichTextEditorToolbarBehaviors(_lit.LitElement));

exports.RichTextEditorToolbar = RichTextEditorToolbar;
window.customElements.define(RichTextEditorToolbar.tag, RichTextEditorToolbar);