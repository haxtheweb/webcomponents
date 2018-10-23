import "@polymer/polymer/polymer.js";
import "@polymer/iron-flex-layout/iron-flex-layout.js";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "../lrnapp-studio-projectboard/lrnapp-studio-projectboard.js";
import "../lrnapp-studio-displayboard/lrnapp-studio-displayboard.js";
Polymer({
  _template: `
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

  properties: {
    prop1: {
      type: String,
      value: "lrnapp-studio-app"
    }
  }
});
