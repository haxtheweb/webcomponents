import "@polymer/polymer/polymer.js";
/**
`lrnsys-layout`
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

  is: "lrnsys-layout",

  properties: {
    title: {
      type: String,
      value: "lrnsys-layout"
    }
  }
});
