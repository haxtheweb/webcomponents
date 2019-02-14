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
    :host #button {
      text-transform: unset;
      color: var(--rich-text-editor-button-color, #444);
      border-color: var(--rich-text-editor-button-border, transparent);
      padding: 0;
      transition: all 0.5s;
      min-width: 24px;
      height: 24px;
      @apply --rich-text-editor-button;
    }
    :host([disabled]) #button {
      cursor: not-allowed;
      color: var(--rich-text-editor-button-disabled-color, #666);
      background-color: var(--rich-text-editor-button-disabled-bg, transparent);
      @apply --rich-text-editor-button-disabled;
    }
    :host #button[toggled] {
      color: var(--rich-text-editor-button-toggled-color, #222);
      background-color: var(--rich-text-editor-button-toggled-bg, #d8d8d8);
      @apply --rich-text-editor-button-toggled;
    }
    :host #button:focus,
    :host #button:hover {
      color: var(--rich-text-editor-button-hover-color, #000);
      background-color: var(--rich-text-editor-button-hover-bg, #f0f0f0);
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
