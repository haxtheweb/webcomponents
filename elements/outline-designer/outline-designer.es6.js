import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";class OutlineDesigner extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>
<div>[[layoutMode]]</div>
<div>[[editMode]]</div>`}static get properties(){return{layoutMode:{name:"layoutMode",type:"String",value:"outline",reflectToAttribute:!1,observer:"_layoutModeChanged"},editMode:{name:"editMode",type:"String",value:"false",reflectToAttribute:!0,observer:"_editModeChanged"}}}static get tag(){return"outline-designer"}connectedCallback(){super.connectedCallback()}_layoutModeChanged(newValue,oldValue){if(typeof newValue!==typeof void 0){console.log(newValue)}}_editModeChanged(newValue,oldValue){if(typeof newValue!==typeof void 0){console.log(newValue)}}}window.customElements.define(OutlineDesigner.tag,OutlineDesigner);export{OutlineDesigner};