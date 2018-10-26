import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "material-word/material-word.js";
/**
`lrndesign-materialwordart`
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
