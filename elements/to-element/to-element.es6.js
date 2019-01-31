import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";class ToElement extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>
<div>[[element]]</div>
<div>[[name]]</div>`}static get properties(){return{element:{name:"element",type:"Object",value:"",reflectToAttribute:!1,observer:!1},name:{name:"name",type:"String",value:"new-element",reflectToAttribute:!1,observer:!1}}}static get tag(){return"to-element"}connectedCallback(){super.connectedCallback()}}window.customElements.define(ToElement.tag,ToElement);export{ToElement};