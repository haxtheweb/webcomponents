/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "./rich-text-editor-toolbar-styles.js";
import "../rich-text-editor.js";
/**
 * `rich-text-editor-content`
 * `a standalone rich text editor`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/content.html demo
 */
class RichTextEditorContent extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style include="rich-text-editor-toolbar-styles">
        :host {
          display: block;
          min-height: 20px;
          cursor: pointer;
          @apply --rich-text-editor-content;
        }
        :host([contenteditable="true"]) {
          border: var(--rich-text-editor-border);
          border-top: none;
          overflow: hidden;
          @apply --rich-text-editor-content-edit;
        }
        :host([contenteditable="true"]):empty:before {
          content: attr(placeholder);
          display: block;
          @apply --rich-text-editor-content-placeholder;
        }
        :host .rich-text-editor-selection {
          background-color: var(--rich-text-editor-selection-bg);
          @apply --rich-text-editor-content-selection;
        }
      </style>
      <slot></slot>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * The editableElement element for the editor.
       */
      editorId: {
        name: "editableElement",
        type: "Object",
        value: null
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "rich-text-editor-content";
  }
  /**
   * ready
   */
  ready() {
    super.ready();
    //find an editor by id
    let id = document.querySelector("rich-text-editor#" + this.editorId),
      editor = id !== null ? id : document.querySelector("rich-text-editor");
    if (editor === null) {
      editor = document.createElement("rich-text-editor");
      this.parentNode.appendChild(editor);
    }
    editor.addEditableRegion(this);
  }

  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(RichTextEditorContent.tag, RichTextEditorContent);
export { RichTextEditorContent };
