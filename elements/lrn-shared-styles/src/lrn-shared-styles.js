/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * `lrn-shared-styles`
 * `a shared set of styles for @lrnwebcomponents`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
const styleElement = document.createElement("dom-module");

const css = html`<style>
  lrn-icon, iron-icon {
    --layout-inline: {
      display: inline-flex;
    }; 
  }
  .sr-only {
    position: absolute;
    left: -9999999px;
    top: 0;
    height: 0;
    width: 0;
    overflow: hidden;
  }
  @media screen {
    .print-only {
      display: none;
    }
  }
  @media print {
    .screen-only {
      display: none;
    }
  }
</style>`;
console.log(css);
styleElement.appendChild(css);

styleElement.register("lrn-shared-styles");
console.log(styleElement);
