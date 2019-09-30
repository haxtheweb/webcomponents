/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * `extensible-toolbar-button-styles`
 * `a shared set of styles for extensible-toolbar toolbar items`
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
      --extensible-toolbar-button-min-width: 24px;
      --extensible-toolbar-button-height: 24px;
      --extensible-toolbar-button-margin: 3px;
      --extensible-toolbar-button-padding: 0;
      --simple-picker-option-size: 18px;
      --simple-picker-color: var(--extensible-toolbar-button-color);
      --simple-picker-background-color: var(--extensible-toolbar-bg);
      --simple-picker-sample-border-color: var(--extensible-toolbar-bg);
      --simple-picker-border-color: var(--extensible-toolbar-border-color);
      --simple-picker-icon-transform: rotate(0deg);
      --simple-picker-expanded-icon-transform: rotate(0deg);
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
    :host paper-tooltip {
      z-index: 2;
    }
    :host .toolbar-button {
      text-transform: unset;
      transition: all 0.5s;
      color: var(--extensible-toolbar-button-color);
      border-color: var(--extensible-toolbar-border-color);
      @apply --extensible-toolbar-button;
    }
    :host([disabled]) .toolbar-button {
      cursor: not-allowed;
      color: var(--extensible-toolbar-button-disabled-color);
      background-color: var(--extensible-toolbar-button-disabled-bg);
      @apply --extensible-toolbar-button-disabled;
    }
    :host .toolbar-button[toggled] {
      color: var(--extensible-toolbar-button-toggled-color);
      background-color: var(--extensible-toolbar-button-toggled-bg);
      @apply --extensible-toolbar-button-toggled;
    }
    :host .toolbar-button:focus,
    :host .toolbar-button:hover {
      color: var(--extensible-toolbar-button-hover-color);
      background-color: var(--extensible-toolbar-button-hover-bg);
    }
    :host .toolbar-button #icon:not([icon]) {
      display: none;
    }
    :host .group-label {
      margin: auto 5px auto 0;
    }
  </style>
`;
styleElement.appendChild(css);

styleElement.register("extensible-toolbar-button-styles");
