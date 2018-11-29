/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "./lib/lrndesign-stepper-button.js";
/**
`lrndesign-stepper`
visualization of steps

@demo demo/index.html
*/
let LrndesignStepper = Polymer({
  _template: html`
    <style>
       :host {
        display: block;
      }
    </style>

    <div class="buttons">
      <slot id="stepper-children">
      </slot>
    </div>
`,

  is: "lrndesign-stepper",

  properties: {},

  ready: function() {
    var root = this;
    var children = root.getContentChildren("#stepper-children");
    if (children.length > 1) {
      children.forEach(function(child, index) {
        if (index === 0) {
          child.setAttribute("location", "start");
        } else if (index === children.length - 1) {
          child.setAttribute("location", "end");
        } else {
          child.setAttribute("location", "middle");
        }
        console.log(child, index);
      });
    }
  }
});
export { LrndesignStepper };
