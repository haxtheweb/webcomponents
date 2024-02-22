/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { RichTextEditorToolbarBehaviors } from "./rich-text-editor-toolbar.js";
import "./rich-text-editor-breadcrumbs.js";
/**
 * `rich-text-editor-toolbar-full`
 * `a full toolbar with breadcrumbs for the rich text editor`
 *
 * @customElement
 * @extends RichTextEditorToolbarBehaviors
 * @extends LitElement
 * @lit-html
 * @lit-element
 * @element rich-text-editor-toolbar-full
 * @demo ./demo/index.html demo
 * @demo ./demo/full.html toolbar with breadcrumb
 */
class RichTextEditorToolbarFull extends RichTextEditorToolbarBehaviors(
  LitElement,
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
    };
  }

  constructor() {
    super();
  }
  /**
   * overriden default to enable breadcrums
   *
   * @readonly
   * @memberof RichTextEditorToolbarFull
   */
  get hasBreadcrumbs() {
    return true;
  }
}

export { RichTextEditorToolbarFull };

customElements.define(RichTextEditorToolbarFull.tag, RichTextEditorToolbarFull);
