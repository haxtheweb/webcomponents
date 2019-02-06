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
    :host {
      --rich-text-editor-bg: #fafafa;
      --rich-text-editor-border: 1px solid #ddd;
    }
  </style>
`;
styleElement.appendChild(css);

styleElement.register("rich-text-editor-styles");
