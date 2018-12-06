import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
/**
`lrndesign-contentblock`
An incredibly basic content block

@demo demo/index.html
*/
let LrndesignContentblock = Polymer({
  _template: html`
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
export { LrndesignContentblock };
