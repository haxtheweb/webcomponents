define([
  "exports",
  "../../node_modules/@polymer/polymer/polymer-element.js",
  "./rich-text-editor-toolbar.js",
  "./rich-text-editor-breadcrumbs.js"
], function(
  _exports,
  _polymerElement,
  _richTextEditorToolbar,
  _richTextEditorBreadcrumbs
) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.RichTextEditorToolbarFull = void 0;
  function _templateObject_a50afc807cbb11e98cbdc9dc12e6ca7b() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n      ",
      " ",
      " ",
      "\n    "
    ]);
    _templateObject_a50afc807cbb11e98cbdc9dc12e6ca7b = function _templateObject_a50afc807cbb11e98cbdc9dc12e6ca7b() {
      return data;
    };
    return data;
  }
  /**
   * `rich-text-editor-toolbar-full`
   * `a full toolbar with breadcrumbs for the rich text editor`
   *
   * @microcopy - language worth noting:
   *  -
   *
   * @customElement
   * @polymer
   * @demo ../demo/index.html demo
   * @demo demo/full.html toolbar with breadcrumb
   */ var RichTextEditorToolbarFull = /*#__PURE__*/ (function(
    _RichTextEditorToolba
  ) {
    babelHelpers.inherits(RichTextEditorToolbarFull, _RichTextEditorToolba);
    function RichTextEditorToolbarFull() {
      babelHelpers.classCallCheck(this, RichTextEditorToolbarFull);
      return babelHelpers.possibleConstructorReturn(
        this,
        babelHelpers.getPrototypeOf(RichTextEditorToolbarFull).call(this)
      );
    } // render function for template
    babelHelpers.createClass(
      RichTextEditorToolbarFull,
      [
        {
          key: "ready",
          /**
           * life cycle, element is ready
           */ value: function ready() {
            babelHelpers
              .get(
                babelHelpers.getPrototypeOf(
                  RichTextEditorToolbarFull.prototype
                ),
                "ready",
                this
              )
              .call(this);
            var root = this;
            root.__breadcrumbs = document.createElement(
              "rich-text-editor-breadcrumbs"
            );
            document.body.appendChild(root.__breadcrumbs);
            root.__breadcrumbs.addEventListener(
              "breadcrumb-tap",
              root._handleBreadcrumb.bind(root)
            );
            this._stickyChanged();
          }
          /**
           * Gets the updated selection.
           */
        },
        {
          key: "editTarget",
          value: function editTarget(editableElement) {
            babelHelpers
              .get(
                babelHelpers.getPrototypeOf(
                  RichTextEditorToolbarFull.prototype
                ),
                "editTarget",
                this
              )
              .call(this, editableElement);
            var root = this;
            root.__breadcrumbs.controls = editableElement.getAttribute("id");
            editableElement.parentNode.insertBefore(
              root.__breadcrumbs,
              editableElement.nextSibling
            );
            if (!this.sticky) {
              editableElement.classList.add("heightmax");
            } else {
              editableElement.classList.remove("heightmax");
            }
            console.log(this.sticky, editableElement.classList);
          }
          /**
           * Gets the updated selection.
           */
        },
        {
          key: "getUpdatedSelection",
          value: function getUpdatedSelection() {
            babelHelpers
              .get(
                babelHelpers.getPrototypeOf(
                  RichTextEditorToolbarFull.prototype
                ),
                "getUpdatedSelection",
                this
              )
              .call(this);
            if (this.__breadcrumbs)
              this.__breadcrumbs.selection = this.selection;
          }
          /**
           * handle a breadcrumb tap by updating the selected text
           *
           * @param {object} e the breadcrumb tap event
           * @returns {void}
           */
        },
        {
          key: "_handleBreadcrumb",
          value: function _handleBreadcrumb(e) {
            if (e.detail.target) this.selection.selectNode(e.detail.target);
            this.getUpdatedSelection();
          }
          /**
           * Preserves the selection when a button is pressed
           *
           * @param {object} the button
           * @returns {void}
           */
        },
        {
          key: "_preserveSelection",
          value: function _preserveSelection() {
            babelHelpers
              .get(
                babelHelpers.getPrototypeOf(
                  RichTextEditorToolbarFull.prototype
                ),
                "_preserveSelection",
                this
              )
              .call(this);
            if (this.__breadcrumbs) this.__breadcrumbs.selection = temp;
          }
        }
      ],
      [
        {
          key: "template",
          get: function get() {
            return (0, _polymerElement.html)(
              _templateObject_a50afc807cbb11e98cbdc9dc12e6ca7b(),
              this.styleTemplate,
              this.stickyTemplate,
              this.toolbarTemplate
            );
          } // properties available to the custom element for data binding
        },
        {
          key: "properties",
          get: function get() {
            return {
              /**
               * The label for the breadcrums area.
               */ breadcrumbsLabel: {
                name: "breadcrumbsLabel",
                type: String,
                value: "Expand selection: "
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
            return "rich-text-editor-toolbar-full";
          }
        }
      ]
    );
    return RichTextEditorToolbarFull;
  })(_richTextEditorToolbar.RichTextEditorToolbar);
  _exports.RichTextEditorToolbarFull = RichTextEditorToolbarFull;
  window.customElements.define(
    RichTextEditorToolbarFull.tag,
    RichTextEditorToolbarFull
  );
});
