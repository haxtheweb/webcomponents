import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
/**
`lrndesign-diff2html`
A LRN element

* @demo demo/index.html
*/
let LrndesignDiff2html = Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <h2>[[title]]</h2>
  `,

  is: "lrndesign-diff2html",

  properties: {
    title: {
      type: String,
      value: "lrndesign-diff2html"
    }
  }
});
export { LrndesignDiff2html };
