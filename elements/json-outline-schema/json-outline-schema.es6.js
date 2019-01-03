import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";window.JsonOutlineSchema=window.JsonOutlineSchema||{};window.JsonOutlineSchema.requestAvailability=()=>{if(!window.JsonOutlineSchema.instance){window.JsonOutlineSchema.instance=document.createElement("json-outline-schema");document.body.appendChild(window.JsonOutlineSchema.instance)}return window.JsonOutlineSchema.instance};class JsonOutlineSchema extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>
<div>[[id]]</div>
<div>[[title]]</div>
<div>[[author]]</div>
<div>[[description]]</div>
<div>[[license]]</div>
<div>[[metadata]]</div>
<div>[[items]]</div>`}static get properties(){return{id:{name:"id",type:"String",value:"",reflectToAttribute:!1,observer:!1},title:{name:"title",type:"String",value:"",reflectToAttribute:!1,observer:!1},author:{name:"author",type:"String",value:"",reflectToAttribute:!1,observer:!1},description:{name:"description",type:"String",value:"",reflectToAttribute:!1,observer:!1},license:{name:"license",type:"String",value:"by-sa",reflectToAttribute:!1,observer:!1},metadata:{name:"metadata",type:"Object",value:"{}",reflectToAttribute:!1,observer:!1},items:{name:"items",type:"Array",value:"[]",reflectToAttribute:!1,observer:!1}}}static get tag(){return"json-outline-schema"}connectedCallback(){super.connectedCallback();window.addEventListener("json-outline-schema-hide",this.hideJsonOutlineSchema.bind(this));window.addEventListener("json-outline-schema-show",this.showJsonOutlineSchema.bind(this))}disconnectedCallback(){super.connectedCallback();window.removeEventListener("json-outline-schema-hide",this.hideJsonOutlineSchema.bind(this));window.removeEventListener("json-outline-schema-show",this.showJsonOutlineSchema.bind(this))}hideJsonOutlineSchema(e){}showJsonOutlineSchema(e){}}window.customElements.define(JsonOutlineSchema.tag,JsonOutlineSchema);export{JsonOutlineSchema};