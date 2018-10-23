import "@polymer/polymer/polymer.js";
import "material-word/material-word.js";
/**
`lrndesign-materialwordart`
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
    <material-word></material-word>
`,

  is: "lrndesign-materialwordart",

  properties: {
    word: {
      type: String,
      value: "a"
    }
  }
});
