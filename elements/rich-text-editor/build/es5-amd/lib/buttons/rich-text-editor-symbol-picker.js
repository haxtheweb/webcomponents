define([
  "exports",
  "meta",
  "./rich-text-editor-picker.js",
  "../../node_modules/@polymer/polymer/lib/utils/resolve-url.js",
  "../../node_modules/@lrnwebcomponents/es-global-bridge/es-global-bridge.js"
], function(
  _exports,
  meta,
  _richTextEditorPicker,
  _resolveUrl,
  _esGlobalBridge
) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.RichTextEditorSymbolPicker = void 0;
  meta = babelHelpers.interopRequireWildcard(meta);
  /**
   * Copyright 2019 Penn State University
   * @license Apache-2.0, see License.md for full text.
   */ /**
   * `rich-text-editor-symbol-picker`
   * `a symbol picker for the rich-text-editor`
   *
   * @microcopy - language worth noting:
   *  -
   *
   * @customElement
   * @polymer
   */ var RichTextEditorSymbolPicker = /*#__PURE__*/ (function(
    _RichTextEditorPicker
  ) {
    babelHelpers.inherits(RichTextEditorSymbolPicker, _RichTextEditorPicker);
    function RichTextEditorSymbolPicker() {
      var _this;
      babelHelpers.classCallCheck(this, RichTextEditorSymbolPicker);
      _this = babelHelpers.possibleConstructorReturn(
        this,
        babelHelpers.getPrototypeOf(RichTextEditorSymbolPicker).call(this)
      );
      _this.icon = "editor:functions";
      _this.label = "Insert symbol";
      return _this;
    } // properties available to the custom element for data binding
    babelHelpers.createClass(
      RichTextEditorSymbolPicker,
      [
        {
          key: "connectedCallback",
          /**
           * life cycle, element is afixed to the DOM
           */ value: function connectedCallback() {
            babelHelpers
              .get(
                babelHelpers.getPrototypeOf(
                  RichTextEditorSymbolPicker.prototype
                ),
                "connectedCallback",
                this
              )
              .call(this);
            var basePath = (0, _resolveUrl.pathFromUrl)(
                decodeURIComponent(meta.url)
              ),
              src = this.optionsSrc,
              location = "".concat(basePath).concat(src);
            window.addEventListener(
              "es-bridge-symbols-loaded",
              this._setOptions.bind(this)
            );
            window.ESGlobalBridge.requestAvailability();
            window.ESGlobalBridge.instance.load("symbols", location);
          }
        },
        {
          key: "disconnectedCallback",
          value: function disconnectedCallback() {
            window.removeEventListener(
              "es-bridge-symbols-loaded",
              this._setOptions.bind(this)
            );
            babelHelpers
              .get(
                babelHelpers.getPrototypeOf(
                  RichTextEditorSymbolPicker.prototype
                ),
                "disconnectedCallback",
                this
              )
              .call(this);
          }
          /**
           * Handles default options loaded from an external js file
           */
        },
        {
          key: "_setOptions",
          value: function _setOptions() {
            var optData = [];
            this.symbolTypes.forEach(function(type) {
              optData = optData.concat(symbols[type]);
            });
            this.set(
              "options",
              this._getPickerOptions(optData, this.allowNull, this.icon)
            );
          }
          /**
           * Converts option data to picker option data;
           * can be overridden in extended elements
           *
           * @param {object} data about the option
           * @returns {object} picker dato for the option
           */
        },
        {
          key: "_getOptionData",
          value: function _getOptionData(option) {
            return { value: option, alt: option, icon: null, style: null };
          }
        }
      ],
      [
        {
          key: "properties",
          get: function get() {
            return {
              /**
               * An optional JSON file with default options.
               */ optionsSrc: {
                name: "optionsSrc",
                type: String,
                value: "data/symbols.js"
              },
              /**
               * Symbol types to include
               */ symbolTypes: {
                name: "symbolTypes",
                type: Array,
                value: ["symbols", "math", "characters", "greek", "misc"]
              },
              /**
               * Renders html as title. (Good for titles with HTML in them.)
               */ titleAsHtml: {
                name: "titleAsHtml",
                type: Boolean,
                value: !0,
                readOnly: !0
              }
            };
          }
          /**
           * Store the tag name to make it easier to obtain directly.
           * @notice function name must be here for tooling to operate correctly
           *
           */
        },
        {
          key: "tag",
          get: function get() {
            return "rich-text-editor-symbol-picker";
          }
        }
      ]
    );
    return RichTextEditorSymbolPicker;
  })(_richTextEditorPicker.RichTextEditorPicker);
  _exports.RichTextEditorSymbolPicker = RichTextEditorSymbolPicker;
  window.customElements.define(
    RichTextEditorSymbolPicker.tag,
    RichTextEditorSymbolPicker
  );
});
