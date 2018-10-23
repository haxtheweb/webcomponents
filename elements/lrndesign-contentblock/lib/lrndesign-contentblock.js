import "@polymer/polymer/polymer.js";
/**
`lrndesign-contentblock`
An incredibly basic content block

@demo demo/index.html
*/
Polymer({
  _template: `
  <style>
      :host {
        display: inline-block;
        position: relative;
        box-sizing: border-box;
      }
    </style>
    <h3>[[title]]</h3>
    <slot></slot>
`,

  is: "lrndesign-contentblock",

  properties: {
    /**
     * Heading for this block
     */
    title: {
      type: String
    }
  }
});
