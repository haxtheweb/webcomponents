/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";/**
`lrndesign-stepper`
visualization of steps

* @demo demo/index.html
*/class LrndesignStepper extends PolymerElement{constructor(){super();import("./node_modules/@lrnwebcomponents/lrndesign-stepper/lib/lrndesign-stepper-button.js")}static get template(){return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <div class="buttons"><slot id="stepper-children"> </slot></div>
    `}static get tag(){return"lrndesign-stepper"}ready(){super.ready();var root=this,children=root.getContentChildren("#stepper-children");if(1<children.length){children.forEach(function(child,index){if(0===index){child.setAttribute("location","start")}else if(index===children.length-1){child.setAttribute("location","end")}else{child.setAttribute("location","middle")}console.log(child,index)})}}}window.customElements.define(LrndesignStepper.tag,LrndesignStepper);export{LrndesignStepper};