/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-flex-layout/iron-flex-layout.js";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "./lrnapp-studio-projectboard.js";
import "./lrnapp-studio-displayboard.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
     
    <!-- THIS IS FAKE ROUTING: toggle commenting below -->
     <lrnapp-studio-projectboard></lrnapp-studio-projectboard>
    <!-- <lrnapp-studio-displayboard></lrnapp-studio-displayboard> -->
`,

  is: "lrnapp-studio-app",

  properties: {}
});
