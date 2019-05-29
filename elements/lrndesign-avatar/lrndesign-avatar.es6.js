import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{SimpleColors}from"./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";/**
 * `lrndesign-avatar`
 * `Visualize a user account eitehr with an image, a label, or as abstract art.`
 * @demo demo/index.html
 */class LrndesignAvatar extends PolymerElement{constructor(){super();import("./node_modules/@lrnwebcomponents/paper-avatar/paper-avatar.js")}static get template(){return html`
      <style>
        :host {
          display: block;
        }
        paper-avatar {
          --paper-avatar-width: var(--lrndesign-avatar-width);
          --paper-avatar-height: var(--lrndesign-avatar-height);
        }
      </style>
      <paper-avatar
        label="[[label]]"
        src="[[src]]"
        two-chars="[[twoChars]]"
        style$="background-color:[[hexColor]];"
        jdenticon="[[jdenticon]]"
      ></paper-avatar>
    `}static get tag(){return"lrndesign-avatar"}_getHexColor(color){let name=color.replace("-text",""),tmp=new SimpleColors;if(tmp.colors[name]){return tmp.colors[name][6]}return"#000000"}static get properties(){return{/**
       * text to use for avatar
       */label:{type:String,value:"lrndesign-avatar"},/**
       * link to an image, optional
       */src:{type:String},/**
       * Mode for presenting 1st two letters
       */twoChars:{type:Boolean,value:!1},/**
       * Class for the color
       */hexColor:{type:String,computed:"_getHexColor(color)"},/**
       * Color class work to apply
       */color:{type:String,value:"blue",reflectToAttribute:!0},/**
       * Form abstract art from hash of label
       */jdenticon:{type:Boolean,value:!1}}}}window.customElements.define(LrndesignAvatar.tag,LrndesignAvatar);export{LrndesignAvatar};