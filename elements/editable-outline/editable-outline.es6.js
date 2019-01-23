import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";class EditableOutline extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>
<div>[[manifest]]</div>
<div>[[editMode]]</div>`}static get properties(){return{manifest:{name:"manifest",type:"Object",value:"",reflectToAttribute:!1,observer:"_manifestChanged"},editMode:{name:"editMode",type:"Boolean",value:"false",reflectToAttribute:!0,observer:"_editModeChanged"}}}static get tag(){return"editable-outline"}connectedCallback(){super.connectedCallback()}_manifestChanged(newValue,oldValue){if(typeof newValue!==typeof void 0){console.log(newValue)}}_editModeChanged(newValue,oldValue){if(typeof newValue!==typeof void 0){console.log(newValue)}}}window.customElements.define(EditableOutline.tag,EditableOutline);export{EditableOutline};