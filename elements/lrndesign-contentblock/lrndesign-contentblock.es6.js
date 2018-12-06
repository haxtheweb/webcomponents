import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";let LrndesignContentblock=Polymer({_template:html`
    <style>
      :host {
        display: inline-block;
        position: relative;
        box-sizing: border-box;
      }
    </style>
    <h3>[[title]]</h3>
    <slot></slot>
  `,is:"lrndesign-contentblock",properties:{title:{type:String}}});export{LrndesignContentblock};