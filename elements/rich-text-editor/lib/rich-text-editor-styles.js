/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * `rich-text-editor-styles`
 * @customElement rich-text-editor-styles
 * `a shared set of styles for rich-text-editor`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @pseudoElement
 * @polymer
 * @demo ./demo/index.html
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
const styleElement = document.createElement("dom-module");

const css = html`
  <style>
    :host {
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
      @apply --rich-text-editor-content-selection;
    }
  </style>
`;
styleElement.appendChild(css);

styleElement.register("rich-text-editor-styles");

window.RichTextEditorStyleManager = {};
window.RichTextEditorStyleManager.instance = null;
/**
 * Checks to see if there is an instance available, and if not appends one
 */
window.RichTextEditorStyleManager.requestAvailability = function() {
  if (window.RichTextEditorStyleManager.instance == null) {
    window.RichTextEditorStyleManager.instance = document.createElement(
      "style"
    );
    window.RichTextEditorStyleManager.instance.setAttribute(
      "is",
      "custom-style"
    );
    window.RichTextEditorStyleManager.instance.setAttribute(
      "include",
      "rich-text-editor-styles"
    );
    document.head.append(window.RichTextEditorStyleManager.instance);
  }
  return window.RichTextEditorStyleManager.instance;
};
