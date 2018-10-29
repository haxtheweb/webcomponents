import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/iron-flex-layout/iron-flex-layout.js";
var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");
$_documentContainer.innerHTML = `<dom-module id="layout-style">
  <template>
    <style>
      .layout {
        @apply(--layout);
      }
      .layout.horizontal {
        @apply(--layout-horizontal);
      }
      .layout.vertical {
        @apply(--layout-vertical);
      }
      .layout.center {
        @apply(--layout-center);
      }
      .layout.center-center {
        @apply(--layout-center-center);
      }
      .flex {
        @apply(--layout-flex);
      }
      .two {
        @apply(--layout-flex-2);
      }
      .end-justified {
        @apply(--layout-end-justified);
      }
      .end {
        @apply(--layout-end);
      }
      .justified {
        @apply(--layout-justified);
      }
      .self-center {
        @apply(--layout-self-center);
      }
      .wrap {
         @apply(--layout-wrap);
      }
    </style>
  </template>
</dom-module>`;
document.head.appendChild($_documentContainer);
