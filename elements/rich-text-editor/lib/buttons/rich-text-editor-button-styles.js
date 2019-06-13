/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * `rich-text-editor-button-styles`
 * `a shared set of styles for rich-text-editor toolbar items`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @pseudoElement
 * @polymer
 * @demo demo/index.html
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
const styleElement = document.createElement("dom-module");

const css = html`
  <style>
    :host {
      --rich-text-editor-button-min-width: 24px;
      --rich-text-editor-button-height: 24px;
      --rich-text-editor-button-margin: 3px;
      --rich-text-editor-button-padding: 0;
      --simple-picker-option-size: 18px;
      --simple-picker-color: var(--rich-text-editor-button-color);
      --simple-picker-background-color: var(--rich-text-editor-bg);
      --simple-picker-sample-border-color: var(--rich-text-editor-bg);
      --simple-picker-border-color: var(--rich-text-editor-button-color);
      --simple-picker-icon-transform: rotate(0deg);
      --simple-picker-expanded-icon-transform: rotate(0deg);
      --rich-text-editor-picker-small: {
      }
      /*--simple-picker-option-null: {
        display: none;
      }
      --simple-picker-sample-null-label: {
        display: none;
      }*/
    }
    :host([hidden]) {
      display: none;
    }
    :host .offscreen {
      position: absolute;
      left: -999999px;
      top: 0;
      height: 0;
      width: 0;
      overflow: hidden;
    }
    :host(rich-text-editor-emoji-picker),
    :host(rich-text-editor-symbol-picker) {
      --simple-picker-option: {
        width: var(--simple-picker-option-size);
        min-width: var(--simple-picker-option-size);
        max-width: var(--simple-picker-option-size);
      }
      --simple-picker-option-label: {
        padding: 2px;
      }
    }
    :host(rich-text-editor-heading-picker) {
      --simple-picker-option: {
        width: unset;
        max-width: unset;
        height: unset;
        max-height: unset;
        padding-top: 3px;
        padding-bottom: 3px;
      }
    }
    :host paper-tooltip {
      z-index: 2;
    }
    :host .rtebutton {
      text-transform: unset;
      transition: all 0.5s;
      color: var(--rich-text-editor-button-color);
      border-color: var(--rich-text-editor-button-border);
      @apply --rich-text-editor-button;
    }
    :host([disabled]) .rtebutton {
      cursor: not-allowed;
      color: var(--rich-text-editor-button-disabled-color);
      background-color: var(--rich-text-editor-button-disabled-bg);
      @apply --rich-text-editor-button-disabled;
    }
    :host .rtebutton[toggled] {
      color: var(--rich-text-editor-button-toggled-color);
      background-color: var(--rich-text-editor-button-toggled-bg);
      @apply --rich-text-editor-button-toggled;
    }
    :host .rtebutton:focus,
    :host .rtebutton:hover {
      color: var(--rich-text-editor-button-hover-color);
      background-color: var(--rich-text-editor-button-hover-bg);
    }
    :host .rtebutton #icon:not([icon]) {
      display: none;
    }
  </style>
`;
styleElement.appendChild(css);

styleElement.register("rich-text-editor-button-styles");
