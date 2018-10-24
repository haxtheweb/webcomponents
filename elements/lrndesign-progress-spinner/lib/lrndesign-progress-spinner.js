import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
/**
`lrndesign-progress-spinner`
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

  is: "lrndesign-progress-spinner",

  properties: {
    title: {
      type: String,
      value: "lrndesign-progress-spinner"
    }
  }
});
