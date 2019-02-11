import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";class RichTextEditor extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>
<div>[[title]]</div>`}static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Rich text-editor",description:"a standalone rich text editor",icon:"icons:android",color:"green",groups:["Text"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"nikkimk",owner:"Penn State University"}},settings:{quick:[],configure:[{property:"title",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"}],advanced:[]}}}static get properties(){return{title:{name:"title",type:"String",value:"\"Rich Text Editor\"",reflectToAttribute:!0,observer:!1}}}static get tag(){return"rich-text-editor"}connectedCallback(){super.connectedCallback();this.HAXWiring=new HAXWiring;this.HAXWiring.setup(RichTextEditor.haxProperties,RichTextEditor.tag,this)}}window.customElements.define(RichTextEditor.tag,RichTextEditor);export{RichTextEditor};