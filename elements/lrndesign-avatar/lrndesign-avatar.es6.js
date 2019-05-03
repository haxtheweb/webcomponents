import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@lrnwebcomponents/paper-avatar/paper-avatar.js";import"./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";/**
`lrndesign-avatar`
Visualize a user account eitehr with an image, a label, or as abstract art.

* @demo demo/index.html
*/let LrndesignAvatar=Polymer({_template:html`
    <style include="materializecss-styles">
      :host {
        display: block;
      }
    </style>
    <paper-avatar
      label="[[label]]"
      src="[[src]]"
      two-chars="[[twoChars]]"
      class$="[[color]]"
      jdenticon="[[jdenticon]]"
    ></paper-avatar>
  `,is:"lrndesign-avatar",properties:{/**
     * text to use for avatar
     */label:{type:String,value:"lrndesign-avatar"},/**
     * link to an image, optional
     */src:{type:String},/**
     * Mode for presenting 1st two letters
     */twoChars:{type:Boolean,value:!1},/**
     * Materialize CSS color class names
     */color:{type:String,reflectToAttribute:!0},/**
     * Form abstract art from hash of label
     */jdenticon:{type:Boolean,value:!1}}});export{LrndesignAvatar};