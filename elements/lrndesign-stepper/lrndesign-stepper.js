/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/lrndesign-stepper/lib/lrndesign-stepper-button.js";
/**
`lrndesign-stepper`
visualization of steps

* @demo demo/index.html
*/
class LrndesignStepper extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <div class="buttons"><slot></slot></div>
    `;
  }
  static get tag() {
    return "lrndesign-stepper";
  }
  ready() {
    super.ready();
    var children = this.shadowRoot
      .querySelector("slot")
      .assignedNodes({ flatten: true })
      .filter((n) => n.nodeType === Node.ELEMENT_NODE);
    if (children.length > 1) {
      children.forEach(function (child, index) {
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
}
window.customElements.define(LrndesignStepper.tag, LrndesignStepper);
export { LrndesignStepper };
