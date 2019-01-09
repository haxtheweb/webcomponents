import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";class JsonEditor extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>
<div>[[value]]</div>`}static get properties(){return{value:{name:"value",type:"String",value:"",reflectToAttribute:!1,observer:"_valueChanged"}}}static get tag(){return"json-editor"}connectedCallback(){super.connectedCallback()}_valueChanged(newValue,oldValue){if(typeof newValue!==typeof void 0){console.log(newValue)}}}window.customElements.define(JsonEditor.tag,JsonEditor);export{JsonEditor};