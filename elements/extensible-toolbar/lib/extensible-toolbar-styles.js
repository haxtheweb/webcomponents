/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * `extensible-toolbar-styles`
 * `a shared set of styles for extensible-toolbar`
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
      --extensible-toolbar-bg: #fafafa;
      --extensible-toolbar-button-color: #444;
      --extensible-toolbar-border-color: #ddd;
      --extensible-toolbar-border: 1px solid
        var(--extensible-toolbar-border-color, #ddd);
      --extensible-toolbar-button-border: transparent;
      --extensible-toolbar-button-disabled-color: #666;
      --extensible-toolbar-button-disabled-bg: transparent;
      --extensible-toolbar-button-toggled-color: #222;
      --extensible-toolbar-button-toggled-bg: #ddd;
      --extensible-toolbar-button-hover-color: #000;
      --extensible-toolbar-button-hover-bg: #f0f0f0;
      --extensible-toolbar-picker-border: #fafafa;
      --extensible-toolbar-selection-bg: #b3d9ff;
    }
  </style>
`;
styleElement.appendChild(css);

styleElement.register("extensible-toolbar-styles");

window.ExtensibleToolbarStyleManager = {};
window.ExtensibleToolbarStyleManager.instance = null;
/**
 * Checks to see if there is an instance available, and if not appends one
 */
window.ExtensibleToolbarStyleManager.requestAvailability = function() {
  if (window.ExtensibleToolbarStyleManager.instance == null) {
    window.ExtensibleToolbarStyleManager.instance = document.createElement(
      "style"
    );
    window.ExtensibleToolbarStyleManager.instance.setAttribute(
      "is",
      "custom-style"
    );
    window.ExtensibleToolbarStyleManager.instance.setAttribute(
      "include",
      "extensible-toolbar-styles"
    );
    document.head.append(window.ExtensibleToolbarStyleManager.instance);
  }
  return window.ExtensibleToolbarStyleManager.instance;
};
