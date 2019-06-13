/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { RichTextEditorToolbar } from "./rich-text-editor-toolbar.js";
import "./rich-text-editor-breadcrumbs.js";
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
 */
class RichTextEditorToolbarFull extends RichTextEditorToolbar {
  constructor() {
    super();
  }

  // render function for template
  static get template() {
    return html`
      ${this.styleTemplate} ${this.stickyTemplate} ${this.toolbarTemplate}
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * The label for the breadcrums area.
       */
      breadcrumbsLabel: {
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
  static get tag() {
    return "rich-text-editor-toolbar-full";
  }
  /**
   * life cycle, element is ready
   * @returns {void}
   */
  ready() {
    super.ready();
    let root = this;
    root.__breadcrumbs = document.createElement("rich-text-editor-breadcrumbs");
    document.body.appendChild(root.__breadcrumbs);
    root.__breadcrumbs.addEventListener(
      "breadcrumb-tap",
      root._handleBreadcrumb.bind(root)
    );
    this._stickyChanged();
  }

  /**
   * Gets the updated selection.
   *
   * @param {object} editableElement the editable element
   * @returns {void}
   */
  editTarget(editableElement) {
    super.editTarget(editableElement);
    let root = this;
    if (editableElement) {
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
    }
  }
  /**
   * Gets the updated selection.
   * @returns {void}
   */
  getUpdatedSelection() {
    super.getUpdatedSelection();
    if (this.__breadcrumbs) this.__breadcrumbs.selection = this.selection;
  }

  /**
   * handle a breadcrumb tap by updating the selected text
   *
   * @param {object} e the breadcrumb tap event
   * @returns {void}
   */
  _handleBreadcrumb(e) {
    if (e.detail.target) this.selection.selectNode(e.detail.target);
    this.getUpdatedSelection();
  }

  /**
   * Preserves the selection when a button is pressed
   *
   * @param {object} the button
   * @returns {void}
   */
  _preserveSelection() {
    super._preserveSelection();
    if (this.__breadcrumbs) this.__breadcrumbs.selection = temp;
  }
}

export { RichTextEditorToolbarFull };

window.customElements.define(
  RichTextEditorToolbarFull.tag,
  RichTextEditorToolbarFull
);
