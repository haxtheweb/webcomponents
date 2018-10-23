import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";export{GeneratorPolymerInitLrnElement};class GeneratorPolymerInitLrnElement extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>`}static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Generator polymer-init-lrn-element",description:"Automated conversion of generator-polymer-init-lrn-element/",icon:"icons:android",color:"green",groups:["Polymer"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"btopro",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[],advanced:[]}}}static get properties(){return{}}static get tag(){return"generator-polymer-init-lrn-element"}connectedCallback(){super.connectedCallback();this.HAXWiring=new HAXWiring;this.HAXWiring.setHaxProperties(GeneratorPolymerInitLrnElement.haxProperties,GeneratorPolymerInitLrnElement.tag,this)}}window.customElements.define(GeneratorPolymerInitLrnElement.tag,GeneratorPolymerInitLrnElement);