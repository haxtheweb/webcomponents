import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";class Hal9000 extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>`}static get properties(){return{}}static get tag(){return"hal-9000"}connectedCallback(){super.connectedCallback()}}window.customElements.define(Hal9000.tag,Hal9000);export{Hal9000};