define([
  "exports",
  "../../node_modules/@polymer/polymer/polymer-element.js",
  "../../node_modules/@polymer/paper-button/paper-button.js",
  "../../node_modules/@polymer/paper-tooltip/paper-tooltip.js",
  "../../node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js",
  "../../node_modules/@polymer/iron-icons/iron-icons.js",
  "./rich-text-editor-button-styles.js",
  "../singletons/rich-text-editor-selection.js"
], function(
  _exports,
  _polymerElement,
  _paperButton,
  _paperTooltip,
  _ironA11yKeys,
  _ironIcons,
  _richTextEditorButtonStyles,
  _richTextEditorSelection
) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.RichTextEditorButton = void 0;
  function _templateObject_a5d63bc07cbb11e98cbdc9dc12e6ca7b() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n      <style include="rich-text-editor-button-styles">\n        :host .rtebutton {\n          min-width: var(--rich-text-editor-button-min-width);\n          height: var(--rich-text-editor-button-height);\n          margin: var(--rich-text-editor-button-margin);\n          padding: var(--rich-text-editor-button-padding);\n        }\n      </style>\n      <iron-a11y-keys\n        id="a11y"\n        target="[[__a11y]]"\n        keys="enter"\n        on-keys-pressed="_buttonTap"\n      >\n      </iron-a11y-keys>\n      <paper-button\n        id="button"\n        class="rtebutton"\n        disabled$="[[disabled]]"\n        controls="[[controls]]"\n        on-tap="_buttonTap"\n        tabindex="0"\n        toggled$="[[toggled]]"\n      >\n        <iron-icon\n          id="icon"\n          aria-hidden\n          icon$="[[_regOrToggled(icon,toggledIcon,toggled)]]"\n        >\n        </iron-icon>\n        <span id="label" class$="[[labelStyle]]">[[__label]]</span>\n      </paper-button>\n      <paper-tooltip id="tooltip" for="button">[[__label]]</paper-tooltip>\n    '
    ]);
    _templateObject_a5d63bc07cbb11e98cbdc9dc12e6ca7b = function _templateObject_a5d63bc07cbb11e98cbdc9dc12e6ca7b() {
      return data;
    };
    return data;
  }
  /**
   * `rich-text-editor-button`
   * `a button for rich text editor (custom buttons can extend this)`
   *
   * @microcopy - language worth noting:
   *  -
   *
   * @customElement
   * @polymer
   */ var RichTextEditorButton = /*#__PURE__*/ (function(_PolymerElement) {
    babelHelpers.inherits(RichTextEditorButton, _PolymerElement);
    function RichTextEditorButton() {
      babelHelpers.classCallCheck(this, RichTextEditorButton);
      return babelHelpers.possibleConstructorReturn(
        this,
        babelHelpers.getPrototypeOf(RichTextEditorButton).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      RichTextEditorButton,
      [
        {
          key: "ready",
          /**
           * life cycle, element is ready
           */ value: function ready() {
            babelHelpers
              .get(
                babelHelpers.getPrototypeOf(RichTextEditorButton.prototype),
                "ready",
                this
              )
              .call(this);
            var root = this;
            root.addEventListener("mousedown", function(e) {
              e.preventDefault();
            });
            root.addEventListener("keypress", function(e) {
              e.preventDefault();
            });
          }
          /**
           * life cycle, element is afixed to the DOM
           */
        },
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                babelHelpers.getPrototypeOf(RichTextEditorButton.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.__a11y = this.$.button;
          }
          /**
           * life cycle, element is detatched
           */
        },
        {
          key: "disconnectedCallback",
          value: function disconnectedCallback() {
            babelHelpers
              .get(
                babelHelpers.getPrototypeOf(RichTextEditorButton.prototype),
                "disconnectedCallback",
                this
              )
              .call(this);
          }
          /**
           * excutes the button's command
           */
        },
        {
          key: "doTextOperation",
          value: function doTextOperation() {
            var root = this,
              selection = root.selection;
            if (root.toggled && null !== root.toggledCommand) {
              document.execCommand(
                root.toggledCommand,
                !1,
                root.toggledCommand || ""
              );
            } else if (null !== root.command) {
              root.dispatchEvent(
                new CustomEvent(root.command + "-button", {
                  bubbles: !0,
                  cancelable: !0,
                  composed: !0,
                  detail: root
                })
              );
              document.execCommand(root.command, !1, root.commandVal || "");
              root.selection = selection;
            }
          }
          /**
           * determine if the button is toggled
           *
           * @param {object} the text selection
           * @returns {boolean} whether the button is toggled
           *
           */
        },
        {
          key: "_isToggled",
          value: function _isToggled(selection) {
            var toggled =
              null !== this.command && this.toggles
                ? document.queryCommandState(this.command)
                : !1;
            /*,
      label = this._regOrToggled(this.label, this.toggledLabel, toggled);
    if (this.$.label !== undefined) this.$.label.innerHTML = label;
    if (this.$.tooltip !== undefined) this.$.tooltip.innerHTML = label*/ return toggled;
          }
          /**
           * determine if the button is toggled
           *
           * @param {object} the text selection
           * @param {string} the default command
           * @param {boolean} whether the button toggles
           * @returns {string} the label based on whether or not the button is toggled
           *
           */
        },
        {
          key: "_getLabel",
          value: function _getLabel(selection, command, toggles) {
            var toggled =
                null !== this.command && toggles
                  ? document.queryCommandState(command)
                  : !1,
              label = this._regOrToggled(
                this.label,
                this.toggledLabel,
                toggled
              );
            return label;
          }
          /**
           * Handles button tap;
           */
        },
        {
          key: "_buttonTap",
          value: function _buttonTap(e) {
            e.preventDefault();
            this.doTextOperation();
          }
          /**
           * updates a button value based on whether or not button is toggled
           *
           * @param {string} the value when toggled off
           * @param {string} the value when toggled on
           * @param {boolean} whether the button is toggled
           * @returns {string} the correct value based on
           * whether or not the button is toggled
           */
        },
        {
          key: "_regOrToggled",
          value: function _regOrToggled(toggledOff, toggledOn, toggled) {
            return null !== toggledOn && toggled ? toggledOn : toggledOff;
          }
          /**
           * Determines if an iron icon has been named for the button.
           *
           * @param {string} the name of the icon
           * @returns {boolean} if an icon is named
           */
        },
        {
          key: "_labelStyle",
          value: function _labelStyle(icon, showTextLabel) {
            return icon !== void 0 &&
              null !== icon &&
              "" !== icon &&
              !1 === showTextLabel
              ? "offscreen"
              : null;
          }
        }
      ],
      [
        {
          key: "template", // render function
          get: function get() {
            return (0, _polymerElement.html)(
              _templateObject_a5d63bc07cbb11e98cbdc9dc12e6ca7b()
            );
          } // properties available to the custom element for data binding
        },
        {
          key: "properties",
          get: function get() {
            return {
              /**
               * The command used for document.execCommand.
               */ command: { name: "command", type: String, value: null },
              /**
               * Optional parameter for the command.
               */ commandVal: {
                name: "commandVal",
                type: Object,
                value: null,
                notify: !0
              },
              /**
               * Is the button disabled? Default is false.
               */ disabled: { name: "disabled", type: Boolean, value: !1 },
              /**
               * Optional iron icon name for the button.
               */ icon: { name: "icon", type: String, value: null },
              /**
               * Label for the icon.
               */ label: { name: "label", type: String, value: null },
              /**
               * Hide the label offscreen?
               */ labelStyle: {
                name: "labelStyle",
                type: String,
                computed: "_labelStyle(icon,showTextLabel)",
                readOnly: !0
              },
              /**
               * The active selection, inherited from the toolbar
               */ selection: {
                name: "selection",
                type: Object,
                notify: !0,
                value: null
              },
              /**
               * Show text label even if an icon is named?
               */ showTextLabel: {
                name: "showTextLabel",
                type: Boolean,
                value: !1
              },
              /**
               * Is this button toggled?
               */ toggled: {
                name: "toggled",
                type: Boolean,
                computed: "_isToggled(selection)",
                notify: !0
              },
              /**
               * The label for the button based on its toggled state
               */ __label: {
                name: "__label",
                type: String,
                computed: "_getLabel(selection,command,toggles)",
                notify: !0
              },
              /**
               * The command used for document.execCommand when toggled.
               */ toggledCommand: {
                name: "toggledCommand",
                type: String,
                value: null
              },
              /**
               * Optional parameter for the command when toggled.
               */ toggledCommandVal: {
                name: "toggledCommandVal",
                type: Object,
                value: null
              },
              /**
               * Optional iron icon name for the button if it is toggled.
               */ toggledIcon: {
                name: "toggledIcon",
                type: String,
                value: null
              },
              /**
               * Label for the icon, if button is toggled.
               */ toggledLabel: {
                name: "toggledLabel",
                type: String,
                value: null
              },
              /**
               * Can this button toggle?
               */ toggles: { name: "toggles", type: Boolean, value: !1 },
              /**
               * List of valid commands
               */ validCommands: {
                name: "validCommands",
                type: Array,
                value: [
                  "backColor",
                  "bold",
                  "createLink",
                  "copy",
                  "cut",
                  "defaultParagraphSeparator",
                  "delete",
                  "fontName",
                  "fontSize",
                  "foreColor",
                  "formatBlock",
                  "forwardDelete",
                  "insertHorizontalRule",
                  "insertHTML",
                  "insertImage",
                  "insertLineBreak",
                  "insertOrderedList",
                  "insertParagraph",
                  "insertText",
                  "insertUnorderedList",
                  "justifyCenter",
                  "justifyFull",
                  "justifyLeft",
                  "justifyRight",
                  "outdent",
                  "paste",
                  "redo",
                  "selectAll",
                  "strikethrough",
                  "styleWithCss",
                  "superscript",
                  "undo",
                  "unlink",
                  "useCSS"
                ],
                readOnly: !0
              }
            };
          }
          /**
           * Store the tag name to make it easier to obtain directly.
           * @notice function name must be here for tooling to operate correctly
           */
        },
        {
          key: "tag",
          get: function get() {
            return "rich-text-editor-button";
          }
        }
      ]
    );
    return RichTextEditorButton;
  })(_polymerElement.PolymerElement);
  _exports.RichTextEditorButton = RichTextEditorButton;
  window.customElements.define(RichTextEditorButton.tag, RichTextEditorButton);
});
