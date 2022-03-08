"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimpleToolbarBehaviors = exports.SimpleToolbar = void 0;

var _lit = require("lit");

require("./lib/simple-toolbar-more-button.js");

require("./lib/simple-toolbar-help-button.js");

require("./lib/simple-toolbar-field.js");

require("./lib/simple-toolbar-button-group.js");

require("@lrnwebcomponents/end-user-doc/end-user-doc.js");

var _simpleToolbarButton = require("./lib/simple-toolbar-button.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _templateObject5() {
  var data = _taggedTemplateLiteral(["<code>", "</code>"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n          :host {\n            position: relative;\n            display: flex;\n            align-items: flex-start;\n            opacity: 1;\n            z-index: 2;\n            margin: 0;\n            justify-content: space-between;\n            background-color: var(--simple-toolbar-bg);\n            font-size: inherit;\n            margin: 0;\n            padding: 0;\n            transition: all 0.5s;\n            transition: z-index 0s;\n          }\n          :host([hidden]) {\n            z-index: -1;\n            visibility: hidden;\n            opacity: 0;\n            height: 0;\n          }\n          :host([disabled]) {\n            opacity: 0.6;\n            pointer-events: none;\n            z-index: 0;\n          }\n          :host(:focus-within) {\n            border: 1px solid\n              var(\n                --simple-toolbar-hover-border-color,\n                var(--simple-toolbar-button-hover-border-color)\n              );\n          }\n          #buttons {\n            flex-wrap: wrap;\n            display: flex;\n            justify-content: flex-start;\n            flex: 1 1 auto;\n            overflow-y: visible;\n          }\n          #morebutton {\n            flex: 0 0 auto;\n          }\n          ::slotted(.group) {\n            display: flex;\n            flex-wrap: wrap;\n            justify-content: space-evenly;\n            align-items: stretch;\n            margin: 0;\n            flex: 0 1 auto;\n            overflow-y: visible;\n            border-width: 0px;\n            border-style: solid;\n            padding: var(--simple-toolbar-group-padding, 0 3px);\n            border-color: var(\n              --simple-toolbar-border-color,\n              var(--simple-toolbar-group-border-color, transparent)\n            );\n          }\n          ::slotted(.group:not(:last-child)) {\n            border-right-width: var(\n              --simple-toolbar-group-border-width,\n              var(--simple-toolbar-border-width, 1px)\n            );\n          }\n          ::slotted(*:hover),\n          ::slotted(*:focus-wthin) {\n            z-index: var(--simple-toolbar-focus-z-index, 100);\n            transition: z-index 0s;\n          }\n          :host([collapsed]:not([always-expanded]))\n            ::slotted(*[collapse-hide]) {\n            display: none !important;\n          }\n        "]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n          :host([sticky]) {\n            position: sticky;\n            top: 0;\n          }\n        "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n        <div\n          id=\"buttons\"\n          class=\"", "\"\n          part=\"buttons\"\n        >\n          <slot></slot>\n        </div>\n        ", "\n      "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([" <simple-toolbar-more-button\n        id=\"morebutton\"\n        .align-horizontal=\"", "\"\n        .align-vertical=\"", "\"\n        aria-controls=\"buttons\"\n        class=\"button\"\n        @click=\"", "\"\n        ?disabled=", "\n        @toggle=\"", "\"\n        ?hidden=", "\n        .icon=\"", "\"\n        .icon-position=\"", "\"\n        .label=\"", "\"\n        .shortcut=\"", "\"\n        ?show-text-label=\"", "\"\n        ?toggled=\"", "\"\n        .toggled-icon=\"", "\"\n        .toggled-label=\"", "\"\n        .toggled-tooltip=\"", "\"\n        .tooltip-direction=\"", "\"\n        part=\"morebutton\"\n      >\n      </simple-toolbar-more-button>"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @customElement
 * @class
 */
var SimpleToolbarBehaviors = function SimpleToolbarBehaviors(SuperClass) {
  return (
    /*#__PURE__*/
    function (_SuperClass) {
      _inherits(_class, _SuperClass);

      _createClass(_class, [{
        key: "tag",

        /**
         * Store the tag name to make it easier to obtain directly.
         * @notice function name must be here for tooling to operate correctly
         */
        value: function tag() {
          return "simple-toolbar";
        } // render function for styles

      }, {
        key: "render",
        // render function for template
        value: function render() {
          return this.toolbarTemplate;
        }
        /**
         * array of rendered buttons
         *
         * @readonly
         * @memberof SimpleToolbar
         */

      }, {
        key: "buttons",
        get: function get() {
          return this.__buttons;
        }
        /**
         * does toolbar have focus
         *
         * @readonly
         * @memberof SimpleToolbar
         */

      }, {
        key: "focused",
        get: function get() {
          return this.__focused;
        }
        /**
         * is mouseover toolbar
         *
         * @readonly
         * @memberof SimpleToolbar
         */

      }, {
        key: "hovered",
        get: function get() {
          return this.__hovered;
        }
        /**
         * more button's template
         *
         * @readonly
         * @memberof SimpleToolbar
         */

      }, {
        key: "moreButton",
        get: function get() {
          var _this2 = this;

          return (0, _lit.html)(_templateObject(), this.alignHorizontal, this.alignVertical, function (e) {
            return _this2.collapsed = !_this2.collapsed;
          }, this.collapseDisabled, function (e) {
            return _this2.collapsed = !_this2.collapsed;
          }, this.collapseDisabled, this.icon, this.iconPosition, this.label, this.shortcut, this.showTextLabel, !this.collapsed, this.toggledIcon, this.toggledLabel, this.toggledTooltip, this.tooltipDirection);
        }
        /**
         * toolbar element's template
         *
         * @readonly
         * @memberof SimpleToolbar
         */

      }, {
        key: "toolbarTemplate",
        get: function get() {
          return (0, _lit.html)(_templateObject2(), !this.alwaysExpanded && this.collapsed ? "collapsed" : "", this.alwaysExpanded ? "" : this.moreButton);
        } // life cycle

      }], [{
        key: "stickyStyles",
        get: function get() {
          return [(0, _lit.css)(_templateObject3())];
        } // render function for styles

      }, {
        key: "baseStyles",
        get: function get() {
          return [(0, _lit.css)(_templateObject4())];
        }
      }, {
        key: "styles",
        get: function get() {
          return [].concat(_toConsumableArray(this.baseStyles), _toConsumableArray(this.stickyStyles));
        } // properties available to custom element for data binding

      }, {
        key: "properties",
        get: function get() {
          return _objectSpread({}, _simpleToolbarButton.SimpleToolbarGlobalProperties, {
            /**
             * always expanded so more button is unnecessary?
             */
            alwaysExpanded: {
              name: "alwaysExpanded",
              type: Boolean,
              attribute: "always-expanded",
              reflect: true
            },

            /**
             * id of element controlled by toolbar
             */
            ariaControls: {
              name: "ariaControls",
              type: String,
              attribute: "aria-controls",
              reflect: true
            },

            /**
             * label for the toolbar
             */
            ariaLabel: {
              name: "ariaLabel",
              type: String,
              attribute: "aria-label",
              reflect: true
            },

            /**
             * is toolbar collapsed?
             */
            collapsed: {
              name: "collapsed",
              type: Boolean,
              attribute: "collapsed",
              reflect: true
            },

            /**
             * collection of documentation for help button modal 
             */
            documentation: {
              attribute: "documentation",
              type: Object
            },

            /**
             * Custom configuration of toolbar groups and buttons.
             * (See default value for example using default configuration.)
             */
            config: {
              name: "config",
              type: Array,
              attribute: "config"
            },

            /**
             * unique id
             */
            id: {
              name: "id",
              type: String,
              attribute: "id",
              reflect: true
            },

            /**
             * Optional space-sperated list of keyboard shortcuts for editor
             * to fire this button, see iron-a11y-keys for more info.
             */
            moreShortcuts: {
              name: "moreShortcuts",
              attribute: "more-shortcuts",
              type: Object
            },

            /**
             * Optional space-sperated list of keyboard shortcuts for editor
             * to fire this button, see iron-a11y-keys for more info.
             */
            shortcutKeys: {
              name: "shortcutKeys",
              attribute: "shortcut-keys",
              type: Object
            },

            /**
             * Should toolbar stick to top so that it is always visible?
             */
            sticky: {
              name: "sticky",
              type: Boolean,
              attribute: "sticky",
              reflect: true
            },

            /**
             * raw array of buttons
             */
            __buttons: {
              name: "__buttons",
              type: Array
            },

            /**
             * first simple-toolbar-help-button
             */
            __helpModalButton: {
              name: "__helpModalButton",
              type: Object
            },

            /**
             * end-user-doc element
             */
            __helpDocs: {
              name: "__helpDocs",
              type: Object
            },

            /**
             * schema for shortcutDocs
             */
            __shortcutDocs: {
              name: "__shortcutDocs",
              type: Object
            },

            /**
             * whether there is no need to collapse
             */
            collapseDisabled: {
              type: Boolean,
              attribute: "collapse-disabled",
              reflect: true
            },

            /**
             * whether toolbar has focus
             */
            __focused: {
              name: "__focused",
              type: Boolean
            },

            /**
             * whether toolbar is hovered
             */
            __hovered: {
              name: "__hovered",
              type: Boolean
            }
          });
        }
      }]);

      function _class() {
        var _this;

        _classCallCheck(this, _class);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this));
        _this.collapsed = true;
        _this.collapseDisabled = false;
        _this.config = [];
        _this.__buttons = [];
        _this.__focused = false;
        _this.__hovered = false;
        _this.icon = "more-vert";
        _this.label = "More Buttons";
        _this.toggledLabel = "Fewer Buttons";
        _this.showTextLabel = false;
        _this.shortcut = "ctrl+shift+;";
        _this.sticky = false;
        _this.shortcutKeys = {};
        _this.__helpDocs = document.createElement('end-user-doc');

        _this.addEventListener("register-button", _this._handleButtonRegister);

        _this.addEventListener("deregister-button", _this._handleButtonDeregister);

        _this.addEventListener("end-user-docs-connected", _this._handleHelpDocsRegister);

        _this.addEventListener("end-user-docs-disconnected", _this._handleHelpDocsDeregister);

        _this.addEventListener("update-button-registry", _this._handleButtonUpdate);

        _this.addEventListener("toggle-toolbar", _this._handleToggleToolbar);

        return _this;
      }
      /**
       * Called every time the element is inserted into the DOM. Useful for
       * running setup code, such as fetching resources or rendering.
       * Generally, you should try to delay work until this time.
       */


      _createClass(_class, [{
        key: "connectedCallback",
        value: function connectedCallback() {
          _get(_getPrototypeOf(_class.prototype), "connectedCallback", this).call(this);

          if (this.collapsed) window.addEventListener("resize", this._handleResize.bind(this));
          this.addEventListener("keypress", this._handleShortcutKeys);
        }
        /**
         * Called every time the element is removed from the DOM. Useful for
         * running clean up code (removing event listeners, etc.).
         */

      }, {
        key: "disconnectedCallback",
        value: function disconnectedCallback() {
          if (this.collapsed) window.removeEventListener("resize", this._handleResize.bind(this));

          _get(_getPrototypeOf(_class.prototype), "disconnectedCallback", this).call(this);

          this.addEventListener("keypress", this._handleShortcutKeys);
        }
      }, {
        key: "firstUpdated",
        value: function firstUpdated(changedProperties) {
          var _this3 = this;

          this.setAttribute("aria-live", "polite");
          this.setAttribute("role", "toolbar");

          this.onfocus = function (e) {
            return _this3.__focused = true;
          };

          this.onblur = function (e) {
            return _this3.__focused = false;
          };

          this.onmouseover = function (e) {
            return _this3.__hovered = true;
          };

          this.onmouseout = function (e) {
            return _this3.__hovered = false;
          };

          this.addEventListener("keydown", this._handleKeydown);
          if (_get(_getPrototypeOf(_class.prototype), "firstUpdated", this)) _get(_getPrototypeOf(_class.prototype), "firstUpdated", this).call(this, changedProperties);
          this.__endUserDocSchema = {
            id: 'main',
            title: 'Documentation',
            contents: []
          };
        }
        /**
         * end-user-doc component
         *
         * @readonly
         */

      }, {
        key: "updated",
        value: function updated(changedProperties) {
          var _this4 = this;

          if (_get(_getPrototypeOf(_class.prototype), "updated", this)) _get(_getPrototypeOf(_class.prototype), "updated", this).call(this, changedProperties);
          changedProperties.forEach(function (oldValue, propName) {
            if (propName === "config") _this4.updateToolbar();

            if (propName === "collapsed") {
              if (_this4.collapsed) {
                _this4.resizeToolbar();

                window.addEventListener("resize", _this4._handleResize.bind(_this4));
              } else {
                window.removeEventListener("resize", _this4._handleResize.bind(_this4));
              }
            }

            if (propName === "hidden") _this4.setAttribute("aria-hidden", _this4.hidden ? "true" : "false");
          });
          this.checkDocSection(changedProperties, "shortcutKeys", "__shortcutDocs", '_getShortcutDocs');
          if (!this.currentItem && this.buttons) this.setCurrentItem(this.buttons[0]);
          this.resizeToolbar();
        }
        /**
         * adds a button to a div
         *
         * @param {object} config object containing configuration for a button
         * @param {object} div element that acts as a button group
         * @returns {object} button element
         * @memberof SimpleToolbar
         */

      }, {
        key: "addButton",
        value: function addButton(config, div) {
          var button = this._renderButton(config);

          div = div || this;
          div.appendChild(button);
          return button;
        }
        /**
         * adds a group of buttons to a parent container
         *
         * @param {object} config object containing configuration for a group of buttons
         * @param {object} container parent node
         * @returns {object} div element as a button group
         * @memberof SimpleToolbar
         */

      }, {
        key: "addButtonGroup",
        value: function addButtonGroup() {
          var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          var parent = arguments.length > 1 ? arguments[1] : undefined;
          if (!config.buttons || config.buttons.length < 1) return;

          var group = this._renderButtonGroup(config);

          (parent || this).appendChild(group);

          this._addConfigItems(config.buttons, group);

          return group;
        }
        /**
         * empties toolbar and registered buttons
         *
         * @returns
         * @memberof SimpleToolbar
         */

      }, {
        key: "clearToolbar",
        value: function clearToolbar() {
          this.innerHTML = "";
          this.__buttons = [];
          this.shortcutKeys = {};
          this.shortcutKeys[this.shortcut] = this.shadowRoot ? this.shadowRoot.querySelector("#morebutton") : undefined;
        }
        /**
         * removes registered button when moved/removed
         *
         * @param {object} button button node
         * @memberof SimpleToolbar
         */

      }, {
        key: "deregisterButton",
        value: function deregisterButton(button) {
          var _this5 = this;

          //remove button from list of buttons
          this.__buttons = this.__buttons.filter(function (b) {
            return b !== button;
          }); //remove button shortcut keys

          (button.shortcutKeys || "").split(" ").forEach(function (key) {
            if (_this5.shortcutKeys[key] === button) delete _this5.shortcutKeys[key];
          }); //add end-user-doc shortcut schema if there is none

          if (!this.endUserDocId) this.updateDocSection('__shortcutDocs', '_getShortcutDocs', true, true); //remove button event listeners

          button.removeEventListener("blur", function (e) {
            return _this5._handleFocusChange(button);
          });
          button.removeEventListener("focus", function (e) {
            return _this5._handleFocusChange(button);
          });
        }
        /**
         * deregisters help docs when removed
         * 
         * @param {object} docs simple-toolbar-help-docs component
         */

      }, {
        key: "deregisterHelpDocs",
        value: function deregisterHelpDocs(docs) {
          this.__helpDocs = undefined;
        }
        /**
         * registers button when appended
         *
         * @param {object} button button node
         * @memberof SimpleToolbar
         */

      }, {
        key: "registerButton",
        value: function registerButton(button) {
          var _this6 = this;

          //add button to list of buttons
          this.__buttons.push(button);

          this.__buttons = _toConsumableArray(new Set(this.__buttons)); //get all button shortcut keys

          (button.shortcutKeys || "").split(" ").forEach(function (key) {
            if (key && key != '') _this6.shortcutKeys[key] = button;
          });
          if (button.role !== "menuitem") button.isCurrentItem = false; //add end-user-doc schema if there is none

          if (!this.endUserDocId) this.updateDocSection('__shortcutDocs', '_getShortcutDocs', true, true); //add button event listeners

          button.addEventListener("blur", function (e) {
            return _this6._handleFocusChange(button);
          });
          button.addEventListener("focus", function (e) {
            return _this6._handleFocusChange(button);
          });
          if (!this.currentItem) this.setCurrentItem(button);
        }
        /**
         * registers help docs when appended
         * 
         * @param {object} docs simple-toolbar-help-docs component
         */

      }, {
        key: "registerHelpDocs",
        value: function registerHelpDocs(docs) {
          this.__helpDocs = docs; //add end-user-doc shortcut schema if there is none

          if (!this.endUserDocId) this.updateDocSection('__shortcutDocs', '_getShortcutDocs', true, true);
        }
        /**
         * gets all shortcut key documentation into a single cheatsheet
         */

      }, {
        key: "_getShortcutDocs",
        value: function _getShortcutDocs() {
          var _this7 = this;

          if (!this.shortcutKeys) return undefined;
          var keys = Object.keys(this.shortcutKeys || {}),
              schema = {
            id: "keyboard-shortcuts",
            title: "Keyboard Shortcuts",
            cheatsheet: {
              columns: ["Keys", "Shortcut"],
              rows: []
            }
          };
          if (keys.length > 0) keys.forEach(function (key) {
            if (_this7.shortcutKeys[key]) schema.cheatsheet.rows.push([(0, _lit.html)(_templateObject5(), key), _this7.shortcutKeys[key].label]);
          });
          console.log(schema);
          return schema;
        }
        /**
         * 
         * @param {array} changedProperties changed properties fomr lifecycle update
         * @param {string} dataProp name of property for section data
         * @param {string} sectionProp name of property for section of end-user-doc contents schema object
         * @param {string} updateFunction name of function to return new content schema object to replace section
         * @param {string} enabledProp name of property for whether or not section is enabled
         * @param {string} parentId id of parent section
         * @returns 
         */

      }, {
        key: "checkDocSection",
        value: function checkDocSection(changedProperties, dataProp, sectionProp, updateFunction, enabledProp, parentId) {
          if (!updateFunction) return;
          var enabledChanged = false,
              docsChanged = false;
          changedProperties.forEach(function (oldValue, propName) {
            if (!!enabledProp && propName === enabledProp) {
              enabledChanged = true;
            }

            if (propName === dataProp) {
              docsChanged = true;
              enabledChanged = true;
            }
          });
          if (enabledChanged) this.updateDocSection(sectionProp, updateFunction, docsChanged, enabledChanged, parentId);
        }
        /**
         * shows or hides a documentation section based on whether or not section is enabled
         * 
         * @param {string} sectionProp name of property for section of end-user-doc contents schema object
         * @param {string} updateFunction name of function to return new content schema object to replace section
         * @param {boolean} changed whether or not section content has changed
         * @param {boolean} enabled whether or not section is enabled
         * @param {string} [parentId=this.endUserDocId] id of parent section
         * @returns 
         */

      }, {
        key: "updateDocSection",
        value: function updateDocSection(sectionProp, updateFunction, changed, enabled, parentId) {
          console.log('updateDocSection', sectionProp, updateFunction, changed, enabled, parentId);
          if (!this.endUserDoc || !updateFunction) return; //add end user doc schema if there is none

          if (!this.endUserDocId) this.endUserDoc.contents = this.__endUserDocSchema;

          if ((!enabled || changed) && !!this[sectionProp]) {
            //remove markdown section from docs
            if (!!this[sectionProp] && this[sectionProp].id && this.endUserDoc.contentsById[this[sectionProp].id]) this.endUserDoc.removeSectionContent(this[sectionProp].id);
          }

          if (enabled) {
            //add markdown patterns and add markdown section to docs
            if (!this[sectionProp] || changed) this[sectionProp] = this[updateFunction](); //add markdown section schema exists add it to docs

            if (!!this[sectionProp]) this.endUserDoc.appendToSection(_objectSpread({}, this[sectionProp]), parentId || this.endUserDocId);
            console.log('updateDocSection', this[sectionProp], this.endUserDocId, this.endUserDocContents);
          }
        }
        /**
         * resizes toolbar based on element positions
         *
         */

      }, {
        key: "resizeToolbar",
        value: function resizeToolbar() {
          if (this.alwaysExpanded) return;
          if (!this.collapsed) return;

          var items = _toConsumableArray(this.children || []),
              shown = true;

          items.forEach(function (item) {
            if (item.removeAttribute) item.removeAttribute("collapse-hide");

            if (item.offsetTop && item.offsetTop > 0) {
              item.setAttribute("collapse-hide", true);
              shown = false;
            } else if (!shown) {
              item.setAttribute("collapse-hide", true);
            }
          });
          this.collapseDisabled = !!shown;
          if (!this.currentItem) this.setCurrentItem(this.firstItem);
        }
        /**
         * gets first main menu item
         *
         * @readonly
         */

      }, {
        key: "getItemIndex",

        /**
         * gets button's index in main menu
         *
         * @param {object} [item=this.currentItem]
         * @returns
         */
        value: function getItemIndex() {
          var item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.currentItem;
          var index = -1;
          this.mainItems.forEach(function (b, i) {
            if (b === item) index = i;
          });
          return index;
        }
        /**
         * gets previous or next item based on offset
         *
         * @param {number} [offset=1]
         * @returns
         */

      }, {
        key: "getItem",
        value: function getItem() {
          var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
          var index = this.getItemIndex(this.currentItem) + offset;
          return !this.mainItems || index < 0 || this.mainItems.length <= index ? undefined : this.mainItems[index];
        }
        /**
         * sets current item
         *
         * @param {object} item
         */

      }, {
        key: "setCurrentItem",
        value: function setCurrentItem(item) {
          if (this.currentItem) this.currentItem.isCurrentItem = false;
          if (item && item.closest("[collapse-hide=true]")) this.collapsed = false;
          this.currentItem = item;
          if (this.currentItem) this.currentItem.isCurrentItem = true;
        }
        /**
         * focuses on an item
         *
         * @param {object} item
         */

      }, {
        key: "focusOn",
        value: function focusOn(item) {
          var _this8 = this;

          var delay = item && item.closest("[collapse-hide=true]");
          if (this.currentItem.close) this.currentItem.close(true);
          this.setCurrentItem(item);

          if (delay) {
            setTimeout(function () {
              return _this8.currentItem.focus();
            }, 300);
          } else {
            this.currentItem.focus();
          }
        }
        /**
         * updates registered button, it needed
         *
         * @param {object} button button node
         * @memberof SimpleToolbar
         */

      }, {
        key: "updateButton",
        value: function updateButton(button) {
          if (button) this.deregisterButton(button);
          if (button) this.registerButton(button);
        }
        /**
         * updates buttons based on change in config
         */

      }, {
        key: "updateToolbar",
        value: function updateToolbar() {
          var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.config;
          if (!this || !this.config || this.config.length == 0) return;
          this.clearToolbar();
          if (_typeof(this.config) != _typeof([])) this.config = JSON.parse(config);

          this._addConfigItems(this.config);

          this.resizeToolbar();
        }
        /**
         * loops through config to add items
         *
         * @param {array} items
         */

      }, {
        key: "_addConfigItems",
        value: function _addConfigItems() {
          var _this9 = this;

          var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.config;
          var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;
          (items || []).forEach(function (config) {
            if (config.type === "button-group" || config.type === "simple-toolbar-button-group") {
              _this9.addButtonGroup(config, parent);
            } else {
              _this9.addButton(config, parent);
            }
          });
        }
        /**
         * key codes by key
         *
         * @readonly
         */

      }, {
        key: "_handleKeydown",

        /**
         * handles keydown events, as prescribed in
         * {@link https://www.w3.org/TR/wai-aria-practices/examples/toolbar/toolbar.html}
         *
         * @param {event} e
         * @returns
         */
        value: function _handleKeydown(e) {
          var finished = false;

          var key = this._shortcutKeysMatch(e);

          if (key) return;

          switch (e.keyCode) {
            case this.keyCode.RIGHT:
              this.focusOn(this.nextItem || this.firstItem);
              finished = true;
              break;

            case this.keyCode.LEFT:
              this.focusOn(this.previousItem || this.lastItem);
              finished = true;
              break;

            case this.keyCode.HOME:
              this.focusOn(this.firstItem);
              finished = true;
              break;

            case this.keyCode.END:
              this.focusOn(this.lastItem);
              finished = true;
              break;

            case this.keyCode.UP:
              this.focusOn(this.previousItem || this.lastItem);
              finished = true;
              break;

            case this.keyCode.DOWN:
              this.focusOn(this.nextItem || this.firstItem);
              finished = true;
              break;

            default:
              break;
          }

          if (finished) {
            e.stopPropagation();
            e.preventDefault();
          }
        }
        /**
         * handles focus changes and determines if toolbar still has focus;
         *
         */

      }, {
        key: "_handleFocusChange",
        value: function _handleFocusChange() {
          this.__focused = this.contains(document.activeElement);
        }
        /**
         * handles appended help documentation
         *
         * @param {event} e
         */

      }, {
        key: "_handleHelpDocsRegister",
        value: function _handleHelpDocsRegister(e) {
          console.log('reg', e);
          e.stopPropagation();
          this.registerHelpDocs(e.detail);
        }
        /**
         * handles moved/removed help documentation
         *
         * @param {event} e
         */

      }, {
        key: "_handleHelpDocsDeregister",
        value: function _handleHelpDocsDeregister(e) {
          e.stopPropagation();
          this.deregisterHelpDocs(e.detail);
        }
        /**
         * handles appended button
         *
         * @param {event} e
         */

      }, {
        key: "_handleButtonRegister",
        value: function _handleButtonRegister(e) {
          e.stopPropagation();
          this.registerButton(e.detail);
          this.resizeToolbar();
        }
        /**
         * handles moved/removed button
         *
         * @param {event} e
         */

      }, {
        key: "_handleButtonDeregister",
        value: function _handleButtonDeregister(e) {
          e.stopPropagation();
          this.deregisterButton(e.detail);
          this.resizeToolbar();
        }
        /**
         * handles updated button
         *
         * @param {event} e
         */

      }, {
        key: "_handleButtonUpdate",
        value: function _handleButtonUpdate(e) {
          e.stopPropagation();
          this.updateButton(e.detail);
        }
        /**
         * resizes toolbar on window resize
         *
         */

      }, {
        key: "_handleResize",
        value: function _handleResize(e) {
          this.resizeToolbar();
        }
        /**
         * handles shortcut keys for buttons
         *
         * @param {event} e
         * @event shortcut-key-pressed
         */

      }, {
        key: "_handleShortcutKeys",
        value: function _handleShortcutKeys(e) {
          var key = this._shortcutKeysMatch(e);

          if (key) {
            e.preventDefault();

            this.shortcutKeys[key]._handleShortcutKeys(e, key);

            this.dispatchEvent(new CustomEvent("shortcut-key-pressed", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: _objectSpread({}, e.detail, {
                button: this,
                shortcutKey: this
              })
            }));
          }
        }
      }, {
        key: "_handleToggleToolbar",
        value: function _handleToggleToolbar(e) {
          this.collapsed = e.detail && _typeof(e.detail) !== (typeof undefined === "undefined" ? "undefined" : _typeof(undefined)) ? e.detail : !this.collapsed;
        }
        /**
         * creates a button element based on config object
         *
         * @param {object} config configuration object
         * @returns {object} button node
         * @memberof SimpleToolbar
         */

      }, {
        key: "_renderButton",
        value: function _renderButton(config) {
          var button = document.createElement(config.type);
          Object.keys(config).forEach(function (key) {
            return button[key] = config[key];
          });
          button.addEventListener("button-command", this._handleButton);
          return button;
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
          var type = !!config.type && config.type === "simpletoolbar-button-group" ? config.type : "div";
          var group = document.createElement(type);
          group.setAttribute("class", "group");
          Object.keys(config).forEach(function (key) {
            return group[key] = config[key];
          });
          return group;
        }
        /**
         * determines if a keyup event matches a shortcut
         *
         * @param {*} keyEvt
         * @returns
         */

      }, {
        key: "_shortcutKeysMatch",
        value: function _shortcutKeysMatch(keyEvt) {
          var shortcutKey = false;
          Object.keys(this.shortcutKeys || {}).forEach(function (shortcut) {
            var keys = (shortcut || "").toLowerCase().split("+"),
                altKey = keys.includes("alt"),
                ctrlKey = keys.includes("ctrl"),
                metaKey = keys.includes("meta") || keys.includes("cmd"),
                shiftKey = keys.includes("shift"),
                uppercase = keyEvt.shiftKey && keyEvt.code > 65 && keyEvt.code < 91,
                filter = keys.filter(function (key) {
              return key.length == 1;
            }).map(function (key) {
              return !!uppercase ? key.toUpperCase() : key;
            }),
                key = filter[0],
                match = altKey === keyEvt.altKey && (ctrlKey === keyEvt.ctrlKey || ctrlKey === window.navigator.platform === "MacIntel" && e.metaKey) && metaKey === keyEvt.metaKey && shiftKey === keyEvt.shiftKey && (keyEvt.key ? keyEvt.key === key : !key);
            if (match) shortcutKey = shortcut;
            return;
          });
          return shortcutKey;
        }
      }, {
        key: "endUserDoc",
        get: function get() {
          return this.__helpDocs;
        }
        /**
         * end-user-doc component's content schema
         *
         * @readonly
         */

      }, {
        key: "endUserDocContents",
        get: function get() {
          return !this.endUserDoc ? undefined : this.endUserDoc.contents;
        }
        /**
         * top-level id for end-user-doc component's content
         *
         * @readonly
         */

      }, {
        key: "endUserDocId",
        get: function get() {
          return !this.endUserDocContents ? undefined : this.endUserDocContents.id;
        }
      }, {
        key: "firstItem",
        get: function get() {
          return !this.mainItems ? undefined : this.mainItems[0];
        }
        /**
         * gets next main menu item
         *
         * @readonly
         */

      }, {
        key: "nextItem",
        get: function get() {
          return this.getItem();
        }
        /**
         * gets next main menu item
         *
         * @readonly
         */

      }, {
        key: "previousItem",
        get: function get() {
          return this.getItem(-1);
        }
        /**
         * gets last main menu item
         *
         * @readonly
         */

      }, {
        key: "lastItem",
        get: function get() {
          return !this.buttons ? undefined : this.mainItems[this.mainItems.length - 1];
        }
        /**
         * gets main menu items
         *
         * @readonly
         */

      }, {
        key: "mainItems",
        get: function get() {
          return this.buttons.filter(function (b) {
            return b.role !== "menuitem";
          });
        }
      }, {
        key: "keyCode",
        get: function get() {
          return {
            TAB: 9,
            ENTER: 13,
            ESC: 27,
            SPACE: 32,
            PAGEUP: 33,
            PAGEDOWN: 34,
            END: 35,
            HOME: 36,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40
          };
        }
      }]);

      return _class;
    }(SuperClass)
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
 * @extends SimpleToolbarBehaviors
 * @extends LitElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 * @demo demo/grid.html Grid
 * @demo ./demo/buttons.html Buttons
 * @demo ./demo/menu.html Menu
 */


exports.SimpleToolbarBehaviors = SimpleToolbarBehaviors;

var SimpleToolbar =
/*#__PURE__*/
function (_SimpleToolbarBehavio) {
  _inherits(SimpleToolbar, _SimpleToolbarBehavio);

  function SimpleToolbar() {
    _classCallCheck(this, SimpleToolbar);

    return _possibleConstructorReturn(this, _getPrototypeOf(SimpleToolbar).apply(this, arguments));
  }

  return SimpleToolbar;
}(SimpleToolbarBehaviors(_lit.LitElement));

exports.SimpleToolbar = SimpleToolbar;
customElements.define("simple-toolbar", SimpleToolbar);