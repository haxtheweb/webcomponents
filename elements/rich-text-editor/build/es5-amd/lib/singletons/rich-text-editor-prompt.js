define([
  "exports",
  "../../node_modules/@polymer/polymer/polymer-element.js",
  "../../node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js",
  "../../node_modules/@lrnwebcomponents/simple-popover/simple-popover.js",
  "../../node_modules/@lrnwebcomponents/simple-fields/simple-fields.js",
  "../buttons/rich-text-editor-button-styles.js"
], function(
  _exports,
  _polymerElement,
  _ironA11yKeys,
  _simplePopover,
  _simpleFields,
  _richTextEditorButtonStyles
) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.RichTextEditorPrompt = void 0;
  function _templateObject_a75bf1607cbb11e98cbdc9dc12e6ca7b() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n      <style include="rich-text-editor-button-styles">\n        :host {\n          --simple-popover-padding: 0 10px;\n          --paper-input-container-focus-color: var(\n            --rich-text-editor-focus-color,\n            #000\n          );\n          --paper-input-container-invalid-color: var(\n            --rich-text-editor-error-color,\n            #800\n          );\n        }\n        :host #prompt {\n          width: 200px;\n        }\n        :host #prompt:not([hidden]) #form {\n          display: flex;\n          flex-direction: column;\n          align-items: center;\n          justify-content: space-between;\n          z-index: 999999;\n        }\n        :host #prompt paper-input {\n          padding: 0;\n        }\n        :host #confirm, \n        :host #cancel {\n          min-width: unset;\n        }\n        :host #cancel.rtebutton:focus,\n        :host #cancel.rtebutton:hover {\n          color: var(\n            --rich-text-editor-cancel-color,\n            var(--rich-text-editor-error-color)\n          );\n          background-color: var(\n            --rich-text-editor-cancel-hover-color,\n            var(--rich-text-editor-button-hover-bg)\n          );\n        }\n        :host #confirm.rtebutton:focus,\n        :host #confirm.rtebutton:hover {\n          color: var(\n            --rich-text-editor-confirm-color,\n            var(--rich-text-editor-focus-color)\n          );\n          background-color: var(\n            --rich-text-editor-confirm-hover-color,\n            var(--rich-text-editor-button-hover-bg)\n          );\n        }\n        :host .actions {\n          width: 100%;\n          display: flex;\n          align-items: center;\n          justify-content: flex-end;\n        }\n        :host .confirm-or-cancel {\n          min-width: 40px;\n        }\n      </style>\n      <simple-popover\n        id="prompt"\n        auto\n        for$="[[for]]"\n        hidden$="[[!for]]"\n      >\n        <form id="form">\n          <simple-fields\n            id="formfields"\n            autofocus\n            fields="[[fields]]"\n            value="{{value}}"\n          ></simple-fields>\n          <div class="actions">\n            </iron-a11y-keys>\n            <paper-button\n              id="cancel"\n              class="rtebutton"\n              controls="[[__targetId]]"\n              on-tap="_cancel"\n              tabindex="0"\n            >\n              <iron-icon id="icon" aria-hidden icon="clear"> </iron-icon>\n              <span id="label" class="offscreen">Cancel</span>\n            </paper-button>\n            <paper-tooltip id="tooltip" for="cancel">Cancel</paper-tooltip>\n            <paper-button\n              id="confirm"\n              class="rtebutton"\n              controls="[[__targetId]]"\n              on-tap="_confirm"\n              tabindex="0"\n            >\n              <iron-icon id="icon" aria-hidden icon="check"> </iron-icon>\n              <span id="label" class="offscreen">OK</span>\n            </paper-button>\n            <paper-tooltip id="tooltip" for="confirm">OK</paper-tooltip>\n          </div>\n          <iron-a11y-keys\n            id="a11ycancel"\n            target="[[__a11ycancel]]"\n            keys="enter"\n            on-keys-pressed="_cancel"\n          >\n          <iron-a11y-keys\n            id="a11yconfirm"\n            target="[[__a11yconfirm]]"\n            keys="enter"\n            on-keys-pressed="_confirm"\n          >\n          </iron-a11y-keys>\n        </form>\n      </simple-popover>\n    '
    ]);
    _templateObject_a75bf1607cbb11e98cbdc9dc12e6ca7b = function _templateObject_a75bf1607cbb11e98cbdc9dc12e6ca7b() {
      return data;
    };
    return data;
  } // register globally so we can make sure there is only one
  window.RichTextEditorPrompt = window.RichTextEditorPrompt || {}; // request if this exists. This helps invoke the element existing in the dom
  // as well as that there is only one of them. That way we can ensure everything
  // is rendered through the same modal
  window.RichTextEditorPrompt.requestAvailability = function() {
    if (!window.RichTextEditorPrompt.instance) {
      window.RichTextEditorPrompt.instance = document.createElement(
        "rich-text-editor-prompt"
      );
      document.body.appendChild(window.RichTextEditorPrompt.instance);
    }
    return window.RichTextEditorPrompt.instance;
  };
  /**
   * `rich-text-editor-prompt`
   * `A utility that manages the state of multiple rich-text-prompts on one page.`
   *
   * @microcopy - language worth noting:
   *  -
   *
   * @customElement
   * @polymer
   */ var RichTextEditorPrompt = /*#__PURE__*/ (function(_PolymerElement) {
    babelHelpers.inherits(RichTextEditorPrompt, _PolymerElement);
    babelHelpers.createClass(RichTextEditorPrompt, null, [
      {
        key: "template" /* REQUIRED FOR TOOLING DO NOT TOUCH */, // render function
        get: function get() {
          return (0, _polymerElement.html)(
            _templateObject_a75bf1607cbb11e98cbdc9dc12e6ca7b()
          );
        }
        /**
         * Store the tag name to make it easier to obtain directly.
         * @notice function name must be here for tooling to operate correctly
         */
      },
      {
        key: "tag",
        get: function get() {
          return "rich-text-editor-prompt";
        } // properties available to the custom element for data binding
      },
      {
        key: "properties",
        get: function get() {
          return {
            /**
             * Is the  target id.
             */ for: { type: String, value: null },
            /**
             * The selected text.
             */ selection: { type: Object, value: null },
            /**
             * fields for the prompt popover.
             */ fields: { type: Array, value: null },
            /**
             * The prefilled value of the prompt
             */ value: { type: Object, value: null },
            /**
             * The prefilled value of the prompt
             */ __button: { type: Object, value: null }
          };
        }
        /**
         * Makes sure there is a utility ready and listening for elements.
         */
      }
    ]);
    function RichTextEditorPrompt() {
      var _this;
      babelHelpers.classCallCheck(this, RichTextEditorPrompt);
      _this = babelHelpers.possibleConstructorReturn(
        this,
        babelHelpers.getPrototypeOf(RichTextEditorPrompt).call(this)
      );
      var root = babelHelpers.assertThisInitialized(_this); // sets the instance to the current instance
      if (!window.RichTextEditorPrompt.instance) {
        window.RichTextEditorPrompt.instance = babelHelpers.assertThisInitialized(
          _this
        );
        return babelHelpers.possibleConstructorReturn(
          _this,
          babelHelpers.assertThisInitialized(_this)
        );
      }
      return _this;
    }
    /**
     * life cycle, element is afixed to the DOM
     * Makes sure there is a utility ready and listening for elements.
     */ babelHelpers.createClass(RichTextEditorPrompt, [
      {
        key: "connectedCallback",
        value: function connectedCallback() {
          var _this2 = this;
          babelHelpers
            .get(
              babelHelpers.getPrototypeOf(RichTextEditorPrompt.prototype),
              "connectedCallback",
              this
            )
            .call(this);
          this.__a11yconfirm = this.$.confirm;
          this.__a11ycancel = this.$.cancel;
          this.addEventListener("blur", function(e) {
            _this2._cancel(e);
          });
        }
        /**
         * Loads element into array
         */
      },
      {
        key: "setTarget",
        value: function setTarget(button) {
          this.clearTarget();
          this.set("fields", button.fields);
          this.set("value", button.value);
          this.__button = button;
          this.for = button.__selectionContents.getAttribute("id");
        }
        /**
         * Unloads element from array
         */
      },
      {
        key: "clearTarget",
        value: function clearTarget() {
          if (!this.__button) return;
          this.for = null;
          this.set("fields", null);
          this.set("value", null);
          this.__button = null;
        }
        /**
         * Handles button tap;
         */
      },
      {
        key: "_cancel",
        value: function _cancel(e) {
          e.preventDefault();
          if (!this.__button) return;
          this.__button.cancel();
          this.clearTarget();
        }
        /**
         * Handles button tap;
         */
      },
      {
        key: "_confirm",
        value: function _confirm(e) {
          e.preventDefault();
          this.__button.value = this.value;
          this.__button.confirm();
          this.clearTarget();
        }
      }
    ]);
    return RichTextEditorPrompt;
  })(_polymerElement.PolymerElement);
  _exports.RichTextEditorPrompt = RichTextEditorPrompt;
  window.customElements.define(RichTextEditorPrompt.tag, RichTextEditorPrompt);
});
