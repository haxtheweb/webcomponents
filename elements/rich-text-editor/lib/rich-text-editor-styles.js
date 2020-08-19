/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";

const RichTextEditorStyles = function(SuperClass) {
  return class extends SuperClass {
    static get tag() {
      return "rich-text-editor-styles";
    }

    static get styles() {
      return [
        css`
          :host, html {
            --rich-text-editor-bg: #fafafa;
            --rich-text-editor-button-color: #444;
            --rich-text-editor-border-color: #ddd;
            --rich-text-editor-border: 1px solid
              var(--rich-text-editor-border-color, #ddd);
            --rich-text-editor-button-border: transparent;
            --rich-text-editor-button-disabled-color: #666;
            --rich-text-editor-button-disabled-bg: transparent;
            --rich-text-editor-button-toggled-color: #222;
            --rich-text-editor-button-toggled-bg: #ddd;
            --rich-text-editor-button-hover-color: #000;
            --rich-text-editor-button-hover-bg: #f0f0f0;
            --rich-text-editor-picker-border: #fafafa;
            --rich-text-editor-selection-bg: #b3d9ff;
          }
          .rich-text-editor-selection {
            background-color: var(--rich-text-editor-selection-bg);
          }
        `
      ];
    }
  };
};
/**
 * `rich-text-editor-styles`
 * @element rich-text-editor-styles
 * `a shared set of styles for rich-text-editor`
 */
/**
 * `fullscreen-behaviors`
 * abstracted fullscreen behaviors
 *
 * @element fullscreen-behaviors
 */
class RichTextEditorStyleManager extends RichTextEditorStyles(LitElement) {}
window.customElements.define(
  RichTextEditorStyleManager.tag,
  RichTextEditorStyleManager
);
export { RichTextEditorStyleManager, RichTextEditorStyles };

window.RichTextEditorStyleManager = {};
window.RichTextEditorStyleManager.instance = null;
/**
 * Checks to see if there is an instance available, and if not appends one
 */
window.RichTextEditorStyleManager.requestAvailability = function() {
  if (window.RichTextEditorStyleManager.instance == null) {
    window.RichTextEditorStyleManager.instance = new RichTextEditorStyleManager();
    document.head.append(window.RichTextEditorStyleManager.instance);
  }
  return window.RichTextEditorStyleManager.instance;
};
