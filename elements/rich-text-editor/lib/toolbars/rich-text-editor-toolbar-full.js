/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorToolbarBehaviors } from "./rich-text-editor-toolbar.js";
import "./rich-text-editor-breadcrumbs.js";
/**
 * `rich-text-editor-toolbar-full`
 * `a full toolbar with breadcrumbs for the rich text editor`
 *
 * @element rich-text-editor-toolbar-full
 * @demo ./demo/index.html demo
 * @demo ./demo/full.html toolbar with breadcrumb
 */
class RichTextEditorToolbarFull extends RichTextEditorToolbarBehaviors(
  LitElement
) {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "rich-text-editor-toolbar-full";
  }

  static get styles() {
    return [...super.baseStyles, ...super.stickyStyles];
  }

  // render function for template
  render() {
    return super.render();
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      /**
       * The label for the breadcrums area.
       */
      breadcrumbsLabel: {
        name: "breadcrumbsLabel",
        type: String,
        attribute: "breadcrumbs-label"
      }
    };
  }

  constructor() {
    super();
    this.breadcrumbsLabel = "Expand selection: ";
    this.__breadcrumbs = document.createElement("rich-text-editor-breadcrumbs");
    document.body.appendChild(this.__breadcrumbs);
    this.__breadcrumbs.addEventListener(
      "breadcrumb-tap",
      this._handleBreadcrumb.bind(this)
    );
    this._stickyChanged();
  }

  /**
   * Gets the updated selected range.
   *
   * @param {object} editableElement the editable element
   * @returns {void}
   */
  editTarget(editableElement) {
    super.editTarget(editableElement);
    if (editableElement) {
      this.__breadcrumbs.controls = editableElement.getAttribute("id");
      editableElement.parentNode.insertBefore(
        this.__breadcrumbs,
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
   * Gets the updated selected range.
   * @returns {void}
   */
  _rangeChange(e) {
    super._rangeChange(e);
    if (this.__breadcrumbs) this.__breadcrumbs.range = this.range;
  }

  /**
   * handle a breadcrumb tap by updating the selected text
   *
   * @param {object} e the breadcrumb tap event
   * @returns {void}
   */
  _handleBreadcrumb(e) {
    if (e.detail.target) this.range.selectNode(e.detail.target);
  }

  /**
   * Preserves the selected range when a button is pressed
   *
   * @param {object} the button
   * @returns {void}
   */
  _preserveSelection() {
    super._preserveSelection();
    if (this.__breadcrumbs) this.__breadcrumbs.range = temp;
  }
}

export { RichTextEditorToolbarFull };

window.customElements.define(
  RichTextEditorToolbarFull.tag,
  RichTextEditorToolbarFull
);
