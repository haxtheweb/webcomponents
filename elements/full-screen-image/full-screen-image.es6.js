import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import"./node_modules/@polymer/paper-icon-button/paper-icon-button.js";import"./node_modules/@polymer/iron-icons/hardware-icons.js";class FullScreenImage extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
  font-variant-ligatures: common-ligatures;
}
:host([hidden]) {
  display: none;
}
h2 {
  font-size: 4em;
  font-weight: 200;
  margin: 0px !important;
  line-height: 1em;
  text-transform: lowercase;
  color: white;
  letter-spacing: -0.04em;
  font-family: "Source Sans Pro", Arial, Helvetica, sans-serif;
}
p {
  font-weight: 400;
  color: white;
  line-height: 1.0em;
  font-family: "Source Sans Pro", Arial, Helvetica, sans-serif;
  font-size: 1em;
  letter-spacing: 0.01em;
  margin-top: 0;
  margin-bottom: 1em;
}
img {
  position: absolute;
  margin: 0px;
  padding: 0px;
  border: none;
  width: 1239px;
  height: 774.375px;
  max-width: none;
  z-index: -999999;
  left: 0px;
  top: -57.1875px;
}
paper-icon-button {
  width: 75px;
  height: 45px;
  line-height: 45px;
  bottom: 1px;
  right: 0px;
  display: block;
  position: absolute;
  text-align: center;
  color: white;
  background-color: rgba(0, 0, 0, 0.6);
}
.fullpage-container {
  display: block;
}
.image-wrapper {
  left: 0px;
  top: 0px;
  bottom: 0px;
  right: 0px;
  overflow: hidden;
  margin: 0px;
  padding: 0px;
  width: 100%;
  z-index: -999998;
  position: absolute;
}
.overlay-container {
  display: block;
  position: absolute;
  text-align: right;
  padding: 0.1em 1.5em 0.1em 6.0em;
  bottom: 60px;
  right: 0px;
  background-color: rgba(191, 147, 45, 0.7)
}</style>
<div class="fullpage-container">
  <div class="overlay-container">
    <h2>[[title]]</h2>
    <p>[[subtitle]]</p>
  </div>
  <paper-icon-button id="down" icon="hardware:keyboard-arrow-down"></paper-icon-button>
  <div class="image-wrapper">
    <img id="img" src="[[source]]" />
  </div>
</div>`}static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Full screen-image",description:"full screen banner image with down arrow",icon:"icons:android",color:"green",groups:["Screen"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"btopro",owner:"The Pennsylvania State University"}},settings:{quick:[{property:"source",description:"",inputMethod:"textfield",required:!0,icon:"icons:link",validationType:"url"}],configure:[{property:"title",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"},{property:"subtitle",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"},{property:"source",description:"",inputMethod:"textfield",required:!0,icon:"icons:link",validationType:"url"}],advanced:[]}}}static get properties(){return{title:{name:"title",type:"String",value:"",reflectToAttribute:!1,observer:!1},subtitle:{name:"subtitle",type:"String",value:"",reflectToAttribute:!1,observer:!1},source:{name:"source",type:"String",value:"",reflectToAttribute:!1,observer:!1}}}static get tag(){return"full-screen-image"}connectedCallback(){super.connectedCallback();this.HAXWiring=new HAXWiring;this.HAXWiring.setup(FullScreenImage.haxProperties,FullScreenImage.tag,this);this.$.down.addEventListener("click",e=>{this.nextElementSibling.scrollIntoView({block:"start",inline:"nearest",behavior:"smooth"})})}disconnectedCallback(){super.disconnectedCallback();this.$.down.removeEventListener("click",e=>{this.nextElementSibling.scrollIntoView({block:"start",inline:"nearest",behavior:"smooth"})})}}window.customElements.define(FullScreenImage.tag,FullScreenImage);export{FullScreenImage};