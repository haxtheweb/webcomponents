/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * `rich-text-editor-styles`
 * `a shared set of styles for rich-text-editor`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @pseudoElement
 * @polymer
 * @demo demo/index.html
 * @see lib/rich-text-editor-styles-demo.js
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
const styleElement = document.createElement("dom-module");

const css = html`
  <style>
    :host([hidden]) {
      display: none;
    }
    :host(rich-text-editor-emoji-picker),
    :host(rich-text-editor-symbol-picker) {
      --simple-picker-option: {
        width: 24px;
        max-width: 24px;
      }
    }
    :host #button {
      text-transform: unset;
      padding: 0;
      transition: all 0.5s;
      min-width: 24px;
      height: 24px;
      color: var(--rich-text-editor-button-color);
      border-color: var(--rich-text-editor-button-border);
      --simple-picker-color: var(--rich-text-editor-button-color);
      --simple-picker-background-color: var(--rich-text-editor-bg);
      --simple-picker-border-color: var(--rich-text-editor-picker-border);
      --simple-picker-icon-tranform: rotate(0deg);
      --simple-picker-expanded-icon-tranform: rotate(-90deg);
      --simple-picker-option-null: {
        display: none;
      }
      --simple-picker-collapse: {
        top: 26px;
      }
      --simple-picker-sample-null-label: {
        display: none;
      }
      @apply --rich-text-editor-button;
    }
    :host([disabled]) #button {
      cursor: not-allowed;
      color: var(--rich-text-editor-button-disabled-color);
      background-color: var(--rich-text-editor-button-disabled-bg);
      @apply --rich-text-editor-button-disabled;
    }
    :host #button[toggled] {
      color: var(--rich-text-editor-button-toggled-color);
      background-color: var(--rich-text-editor-button-toggled-bg);
      @apply --rich-text-editor-button-toggled;
    }
    :host #button:focus,
    :host #button:hover {
      color: var(--rich-text-editor-button-hover-color);
      background-color: var(--rich-text-editor-button-hover-bg);
    }
    :host #button #icon:not([icon]) {
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
  </style>
`;
styleElement.appendChild(css);

styleElement.register("rich-text-editor-styles");
