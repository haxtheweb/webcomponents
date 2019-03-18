import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";class ScrollButton extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>
<div>[[target]]</div>
<div>[[icon]]</div>
<div>[[label]]</div>`}static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Scroll button",description:"button to scroll to an area or back to top",icon:"icons:android",color:"green",groups:["Button"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"btopro",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[{property:"target",description:"",inputMethod:"array",required:!1,icon:"icons:android"},{property:"icon",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"},{property:"label",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"}],advanced:[]}}}static get properties(){return{target:{name:"target",type:"Object",value:"",reflectToAttribute:!1,observer:!1},icon:{name:"icon",type:"String",value:"icons:expand-less",reflectToAttribute:!1,observer:!1},label:{name:"label",type:"String",value:"Scroll to top",reflectToAttribute:!1,observer:!1}}}static get tag(){return"scroll-button"}connectedCallback(){super.connectedCallback();this.HAXWiring=new HAXWiring;this.HAXWiring.setup(ScrollButton.haxProperties,ScrollButton.tag,this)}}window.customElements.define(ScrollButton.tag,ScrollButton);export{ScrollButton};