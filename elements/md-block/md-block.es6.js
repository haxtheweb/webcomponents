import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import"./node_modules/@polymer/marked-element/marked-element.js";class MdBlock extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<div>
<marked-element markdown="[[markdown]]">
    <div slot="markdown-html"></div>
    <script type="text/markdown" src$="[[source]]"></script>
</marked-element>
</div>`}static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Markdown",description:"A block of markdown content directly or remote loaded",icon:"icons:code",color:"yellow",groups:["Block"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"btopro",owner:"The Pennsylvania State University"}},settings:{quick:[{property:"source",title:"Source",description:"Source file for markdown",inputMethod:"textfield",icon:"icons:link"}],configure:[{property:"markdown",title:"Markdown",description:"Raw markdown",inputMethod:"code-editor"},{property:"source",title:"Source",description:"Source file for markdown",inputMethod:"textfield"}],advanced:[]}}}static get properties(){return{source:{name:"source",type:"String"},markdown:{name:"markdown",type:"String"}}}static get tag(){return"md-block"}connectedCallback(){super.connectedCallback();this.HAXWiring=new HAXWiring;this.HAXWiring.setup(MdBlock.haxProperties,MdBlock.tag,this)}}window.customElements.define(MdBlock.tag,MdBlock);export{MdBlock};