import "@polymer/polymer/polymer.js";
/**
`lrnapp-gallery-grid`
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

  is: "lrnapp-gallery-grid",

  properties: {
    title: {
      type: String,
      value: "lrnapp-gallery-grid"
    }
  }
});
