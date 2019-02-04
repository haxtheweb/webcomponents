import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";class SimpleIconPicker extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>`}static get properties(){return{}}static get tag(){return"simple-icon-picker"}connectedCallback(){super.connectedCallback()}}window.customElements.define(SimpleIconPicker.tag,SimpleIconPicker);export{SimpleIconPicker};