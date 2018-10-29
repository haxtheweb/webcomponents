import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";Polymer({_template:html`
    <style>
      :host {
        display: block;
      }
    </style>
    <h2>[[title]]</h2>
`,is:"lrnapp-gallery-grid",properties:{title:{type:String,value:"lrnapp-gallery-grid"}}});