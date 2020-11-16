/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";

const RichTextEditorButtonStyles = function (SuperClass) {
  return class extends SuperClass {
    static get tag() {
      return "rich-text-editor-button-styles";
    }

    static get styles() {
      return [
        css`
          :host {
            --rich-text-editor-button-min-width: 24px;
            --rich-text-editor-button-height: 24px;
            --rich-text-editor-button-margin: 3px;
            --rich-text-editor-button-padding: 0;
            --simple-icon-color: var(--rich-text-editor-button-color);
          }
          :host([hidden]) {
            display: none;
          }
          .offscreen {
            position: absolute;
            left: -999999px;
            top: 0;
            height: 0;
            width: 0;
            overflow: hidden;
          }
          :host(rich-text-editor-emoji-picker),
          :host(rich-text-editor-symbol-picker) {
            --simple-picker-option-label-padding: 2px;
          }
          simple-tooltip {
            z-index: 2;
          }
          .rtebutton {
            text-transform: unset;
            transition: all 0.5s;
            color: var(--rich-text-editor-button-color);
            margin: 0;
            border-width: 0px;
            border-style: solid;
            border-color: var(--rich-text-editor-border-color, transparent);
            background-color: var(--rich-text-editor-button-bg, transparent);
          }
          .rtebutton[toggled] {
            color: var(--rich-text-editor-button-toggled-color);
            background-color: var(--rich-text-editor-button-toggled-bg);
          }
          .rtebutton:focus,
          .rtebutton:hover {
            color: var(--rich-text-editor-button-hover-color);
            background-color: var(--rich-text-editor-button-hover-bg);
          }
          :host([disabled]) .rtebutton {
            cursor: not-allowed;
            color: var(--rich-text-editor-button-disabled-color);
            background-color: var(--rich-text-editor-button-disabled-bg);
          }
          .rtebutton #icon:not([icon]) {
            display: none;
          }
        `,
      ];
    }
  };
};
/**
 * `rich-text-editor-button-styles`
 * @element rich-text-editor-button-styles
 * `a shared set of button styles for rich-text-editor`
 */
class RichTextEditorButtonStylesEl extends RichTextEditorButtonStyles(
  LitElement
) {}
window.customElements.define(
  RichTextEditorButtonStylesEl.tag,
  RichTextEditorButtonStylesEl
);
export { RichTextEditorButtonStylesEl, RichTextEditorButtonStyles };
