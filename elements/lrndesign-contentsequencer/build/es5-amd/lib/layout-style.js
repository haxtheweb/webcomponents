define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-flex-layout/iron-flex-layout.js"
], function() {
  "use strict";
  var $_documentContainer = document.createElement("div");
  $_documentContainer.setAttribute("style", "display: none;");
  $_documentContainer.innerHTML =
    '<dom-module id="layout-style">\n  <template>\n    <style>\n      .layout {\n        @apply(--layout);\n      }\n      .layout.horizontal {\n        @apply(--layout-horizontal);\n      }\n      .layout.vertical {\n        @apply(--layout-vertical);\n      }\n      .layout.center {\n        @apply(--layout-center);\n      }\n      .layout.center-center {\n        @apply(--layout-center-center);\n      }\n      .flex {\n        @apply(--layout-flex);\n      }\n      .two {\n        @apply(--layout-flex-2);\n      }\n      .end-justified {\n        @apply(--layout-end-justified);\n      }\n      .end {\n        @apply(--layout-end);\n      }\n      .justified {\n        @apply(--layout-justified);\n      }\n      .self-center {\n        @apply(--layout-self-center);\n      }\n      .wrap {\n         @apply(--layout-wrap);\n      }\n    </style>\n  </template>\n</dom-module>';
  document.head.appendChild($_documentContainer);
});
