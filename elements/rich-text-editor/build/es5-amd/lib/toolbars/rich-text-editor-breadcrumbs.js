define([
  "exports",
  "../../node_modules/@polymer/polymer/polymer-element.js",
  "./rich-text-editor-breadcrumb.js",
  "../rich-text-editor-styles.js",
  "../buttons/rich-text-editor-button-styles.js"
], function(
  _exports,
  _polymerElement,
  _richTextEditorBreadcrumb,
  _richTextEditorStyles,
  _richTextEditorButtonStyles
) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.RichTextEditorBreadcrumbs = void 0;
  function _templateObject_a625e2607cbb11e98cbdc9dc12e6ca7b() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n      <style include="rich-text-editor-styles"></style>\n      <style include="rich-text-editor-button-styles">\n        :host([sticky]) {\n          position: sticky;\n          bottom: 0;\n        }\n        :host {\n          display: block;\n          background-color: var(--rich-text-editor-bg);\n          color: var(--rich-text-editor-button-color);\n          border: var(--rich-text-editor-border);\n          padding: 3px 10px;\n\n          --rich-text-editor-breadcrumb: {\n            font-family: monospace;\n            display: inline-block;\n            text-align: center;\n            min-width: 30px;\n            line-height: 30px;\n            margin: 0;\n            padding: 2px 5px;\n          }\n        }\n        :host .selectednode {\n          background-color: var(--rich-text-editor-bg);\n          @apply --rich-text-editor-breadcrumb;\n        }\n      </style>\n      [[label]]\n      <template is="dom-repeat" items="[[ancestorNodes]]" as="crumb">\n        <rich-text-editor-breadcrumb\n          controls$="[[controls]]"\n          tag$="[[crumb.tag]]"\n          target="[[crumb.target]]"\n        >\n        </rich-text-editor-breadcrumb>\n      </template>\n    '
    ]);
    _templateObject_a625e2607cbb11e98cbdc9dc12e6ca7b = function _templateObject_a625e2607cbb11e98cbdc9dc12e6ca7b() {
      return data;
    };
    return data;
  }
  /**
   * `rich-text-editor-breadcrumbs`
   * `A utility that manages the state of multiple rich-text-prompts on one page.`
   *
   * @microcopy - language worth noting:
   *  -
   *
   * @customElement
   * @polymer
   */ var RichTextEditorBreadcrumbs = /*#__PURE__*/ (function(_PolymerElement) {
    babelHelpers.inherits(RichTextEditorBreadcrumbs, _PolymerElement);
    function RichTextEditorBreadcrumbs() {
      babelHelpers.classCallCheck(this, RichTextEditorBreadcrumbs);
      return babelHelpers.possibleConstructorReturn(
        this,
        babelHelpers
          .getPrototypeOf(RichTextEditorBreadcrumbs)
          .apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      RichTextEditorBreadcrumbs,
      [
        {
          key: "connectedCallback",
          /**
           * life cycle, element is afixed to the DOM
           * Makes sure there is a utility ready and listening for elements.
           */ value: function connectedCallback() {
            babelHelpers
              .get(
                babelHelpers.getPrototypeOf(
                  RichTextEditorBreadcrumbs.prototype
                ),
                "connectedCallback",
                this
              )
              .call(this);
          }
          /**
           * updates the breadcrumbs
           * @param {object} the selected range
           */
        },
        {
          key: "_getAncestorNodes",
          value: function _getAncestorNodes(selection, controls) {
            var nodes = [],
              node = "",
              ancestor = !1,
              parent = !1;
            if (selection) ancestor = selection.commonAncestorContainer;
            if (ancestor) parent = ancestor;
            this.hidden = !ancestor;
            while (parent && "RICH-TEXT-EDITOR" !== parent.nodeName) {
              nodes.unshift({
                tag: parent.nodeName.toLowerCase(),
                target: parent
              });
              parent = parent.parentNode;
            }
            return nodes;
          }
        }
      ],
      [
        {
          key: "template" /* REQUIRED FOR TOOLING DO NOT TOUCH */, // render function
          get: function get() {
            return (0, _polymerElement.html)(
              _templateObject_a625e2607cbb11e98cbdc9dc12e6ca7b()
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
            return "rich-text-editor-breadcrumbs";
          } // properties available to the custom element for data binding
        },
        {
          key: "properties",
          get: function get() {
            return {
              /**
               * fields for the prompt popover.
               */ ancestorNodes: {
                type: Array,
                computed: "_getAncestorNodes(selection,controls)"
              },
              /**
               * The active rict-text-editor.
               */ controls: { type: String, value: null },
              /**
               * Hide breadcrumbs
               */ hidden: { type: Boolean, value: !1, reflectToAttribute: !0 },
              /**
               * The breadcrumb labels.
               */ label: {
                name: "label",
                type: String,
                value: "Expand selection: "
              },
              /**
               * The selected text.
               */ selection: { type: Object, value: null },
              /**
               * Should the breadcrumbs stick to the top so that it is always visible?
               */ sticky: {
                name: "sticky",
                type: Boolean,
                value: !1,
                reflectToAttribute: !0
              }
            };
          }
        }
      ]
    );
    return RichTextEditorBreadcrumbs;
  })(_polymerElement.PolymerElement);
  _exports.RichTextEditorBreadcrumbs = RichTextEditorBreadcrumbs;
  window.customElements.define(
    RichTextEditorBreadcrumbs.tag,
    RichTextEditorBreadcrumbs
  );
});
