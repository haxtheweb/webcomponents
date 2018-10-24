import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-flex-layout/iron-flex-layout.js";
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

/*
Copyright (c) 2016 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
