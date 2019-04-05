import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";class SimpleSchemaForm extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>`}static get properties(){return{}}static get tag(){return"simple-schema-form"}connectedCallback(){super.connectedCallback()}}window.customElements.define(SimpleSchemaForm.tag,SimpleSchemaForm);export{SimpleSchemaForm};