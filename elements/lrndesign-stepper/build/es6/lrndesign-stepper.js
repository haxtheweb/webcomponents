import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./lib/lrndesign-stepper-button.js";
Polymer({
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
    var root = this,
      children = root.getContentChildren("#stepper-children");
    if (1 < children.length) {
      children.forEach(function(child, index) {
        if (0 === index) {
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
