import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";export{LrndesignPanelcard};class LrndesignPanelcard extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>`}static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Lrndesign panelcard",description:"Automated conversion of lrndesign-panelcard/",icon:"icons:android",color:"green",groups:["Panelcard"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"btopro",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[],advanced:[]}}}static get properties(){return{}}static get tag(){return"lrndesign-panelcard"}connectedCallback(){super.connectedCallback();this.HAXWiring=new HAXWiring;this.HAXWiring.setHaxProperties(LrndesignPanelcard.haxProperties,LrndesignPanelcard.tag,this)}}window.customElements.define(LrndesignPanelcard.tag,LrndesignPanelcard);