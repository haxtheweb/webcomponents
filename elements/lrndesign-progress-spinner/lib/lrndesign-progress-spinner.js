import "@polymer/polymer/polymer.js";
/**
`lrndesign-progress-spinner`
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

  is: "lrndesign-progress-spinner",

  properties: {
    title: {
      type: String,
      value: "lrndesign-progress-spinner"
    }
  }
});
