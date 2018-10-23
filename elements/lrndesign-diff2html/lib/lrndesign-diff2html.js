import "@polymer/polymer/polymer.js";
/**
`lrndesign-diff2html`
A LRN element

@demo demo/index.html
*/
Polymer({
  _template: `
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
