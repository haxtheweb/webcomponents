import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";let LrnContent=Polymer({_template:html`
    <style>
      :host {
        display: block;
      }
    </style>
    <div typeof="oer:SupportingMaterial">
      <h2 property="oer:name" hidden$="[[!title]]">[[title]]</h2>
      <div property="oer:description"><slot></slot></div>
    </div>
  `,is:"lrn-content",properties:{title:{type:String,value:!1}}});export{LrnContent};