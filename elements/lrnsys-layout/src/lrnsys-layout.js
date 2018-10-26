import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
/**
`lrnsys-layout`
A LRN element

@demo demo/index.html
*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <h2>[[title]]</h2>
`,

  is: "lrnsys-layout",

  properties: {
    title: {
      type: String,
      value: "lrnsys-layout"
    }
  }
});
