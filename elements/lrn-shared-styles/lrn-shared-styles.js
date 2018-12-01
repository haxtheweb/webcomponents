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
 * @pseudoElement
 * @polymer
 * @demo demo/index.html
 * @see lib/lrn-shared-styles-demo.js
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-flex-layout/iron-flex-layout.js";
const styleElement = document.createElement("dom-module");

const css = html`
  <style include="iron-flex-layout">
    lrn-icon,
    iron-icon {
      --layout-inline: {
        display: inline-flex;
      }
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
  </style>
`;
styleElement.appendChild(css);

styleElement.register("lrn-shared-styles");
console.log(styleElement);
