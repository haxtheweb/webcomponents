import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
/**
`lrnapp-gallery-grid`
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

  is: "lrnapp-gallery-grid",

  properties: {
    title: {
      type: String,
      value: "lrnapp-gallery-grid"
    }
  }
});
