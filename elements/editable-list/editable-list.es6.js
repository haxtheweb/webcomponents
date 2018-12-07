import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";class EditableList extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>
<div>[[editMode]]</div>
<div>[[items]]</div>`}static get properties(){return{editMode:{name:"editMode",type:"Boolean",value:"false",reflectToAttribute:!0,observer:"_editModeChanged"},items:{name:"items",type:"Array",value:"",reflectToAttribute:!1,observer:"_itemsChanged"}}}static get tag(){return"editable-list"}connectedCallback(){super.connectedCallback()}_editModeChanged(newValue,oldValue){if(typeof newValue!==typeof void 0){console.log(newValue)}}_itemsChanged(newValue,oldValue){if(typeof newValue!==typeof void 0){console.log(newValue)}}}window.customElements.define(EditableList.tag,EditableList);export{EditableList};