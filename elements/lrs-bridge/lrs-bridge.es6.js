import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";export{LrsBridge};class LrsBridge extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>`}static get properties(){return{}}static get tag(){return"lrs-bridge"}connectedCallback(){super.connectedCallback()}}window.customElements.define(LrsBridge.tag,LrsBridge);