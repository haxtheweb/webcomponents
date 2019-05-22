define([
  "exports",
  "../../node_modules/@polymer/polymer/polymer-element.js",
  "../../node_modules/@polymer/paper-button/paper-button.js",
  "../../node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js",
  "../buttons/rich-text-editor-button-styles.js"
], function(
  _exports,
  _polymerElement,
  _paperButton,
  _ironA11yKeys,
  _richTextEditorButtonStyles
) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.RichTextEditorBreadcrumb = void 0;
  function _templateObject_a78dd6d07cbb11e98cbdc9dc12e6ca7b() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n      <style include="rich-text-editor-button-styles">\n        :host #button {\n          @apply --rich-text-editor-breadcrumb;\n        }\n      </style>\n      <iron-a11y-keys\n        id="a11y"\n        target="[[__a11y]]"\n        keys="enter"\n        on-keys-pressed="_buttonTap"\n      >\n      </iron-a11y-keys>\n      <paper-button\n        id="button"\n        class="rtebutton rtebreadcrumb"\n        controls$="[[controls]]"\n        on-tap="_buttonTap"\n        tabindex="0"\n      >\n        [[tag]]\n      </paper-button>\n    '
    ]);
    _templateObject_a78dd6d07cbb11e98cbdc9dc12e6ca7b = function _templateObject_a78dd6d07cbb11e98cbdc9dc12e6ca7b() {
      return data;
    };
    return data;
  }
  /**
   * `rich-text-editor-breadcrumb`
   * `a button for rich text editor breadcrumbs`
   *
   * @microcopy - language worth noting:
   *  -
   *
   * @customElement
   * @polymer
   */ var RichTextEditorBreadcrumb = /*#__PURE__*/ (function(_PolymerElement) {
    babelHelpers.inherits(RichTextEditorBreadcrumb, _PolymerElement);
    function RichTextEditorBreadcrumb() {
      babelHelpers.classCallCheck(this, RichTextEditorBreadcrumb);
      return babelHelpers.possibleConstructorReturn(
        this,
        babelHelpers
          .getPrototypeOf(RichTextEditorBreadcrumb)
          .apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      RichTextEditorBreadcrumb,
      [
        {
          key: "ready",
          /**
           * life cycle, element is ready
           */ value: function ready() {
            babelHelpers
              .get(
                babelHelpers.getPrototypeOf(RichTextEditorBreadcrumb.prototype),
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
                babelHelpers.getPrototypeOf(RichTextEditorBreadcrumb.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.__a11y = this.$.button;
          }
          /**
           * Handles button tap;
           */
        },
        {
          key: "_buttonTap",
          value: function _buttonTap(e) {
            e.preventDefault();
            this.dispatchEvent(
              new CustomEvent("breadcrumb-tap", {
                bubbles: !0,
                cancelable: !0,
                composed: !0,
                detail: this
              })
            );
          }
        }
      ],
      [
        {
          key: "template", // render function
          get: function get() {
            return (0, _polymerElement.html)(
              _templateObject_a78dd6d07cbb11e98cbdc9dc12e6ca7b()
            );
          } // properties available to the custom element for data binding
        },
        {
          key: "properties",
          get: function get() {
            return {
              /**
               * The text-editor that this breadcrumb controls.
               */ controls: { name: "controls", type: String, value: null },
              /**
               * The tag for this breadcrumb.
               */ tag: { name: "tag", type: String, value: "" },
              /**
               * The target node that this breadcrumb selects.
               */ target: { name: "target", type: Object, value: null }
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
            return "rich-text-editor-breadcrumb";
          }
        }
      ]
    );
    return RichTextEditorBreadcrumb;
  })(_polymerElement.PolymerElement);
  _exports.RichTextEditorBreadcrumb = RichTextEditorBreadcrumb;
  window.customElements.define(
    RichTextEditorBreadcrumb.tag,
    RichTextEditorBreadcrumb
  );
});
