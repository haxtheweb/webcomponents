import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";export{LrndesignContactcard};class LrndesignContactcard extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>`}static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Lrndesign contactcard",description:"Automated conversion of lrndesign-contactcard/",icon:"icons:android",color:"green",groups:["Contactcard"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"btopro",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[],advanced:[]}}}static get properties(){return{}}static get tag(){return"lrndesign-contactcard"}connectedCallback(){super.connectedCallback();this.HAXWiring=new HAXWiring;this.HAXWiring.setHaxProperties(LrndesignContactcard.haxProperties,LrndesignContactcard.tag,this)}}window.customElements.define(LrndesignContactcard.tag,LrndesignContactcard);