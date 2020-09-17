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
    this.__breadcrumbs.onselectnode = e => this._selectNode(e.detail);
    document.body.appendChild(this.__breadcrumbs);
  }
}

export { RichTextEditorToolbarFull };

window.customElements.define(
  RichTextEditorToolbarFull.tag,
  RichTextEditorToolbarFull
);
