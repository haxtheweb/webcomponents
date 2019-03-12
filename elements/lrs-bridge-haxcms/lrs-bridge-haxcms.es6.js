import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";export{LrsBridgeHaxcms};class LrsBridgeHaxcms extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>`}static get properties(){return{}}static get tag(){return"lrs-bridge-haxcms"}connectedCallback(){super.connectedCallback()}}window.customElements.define(LrsBridgeHaxcms.tag,LrsBridgeHaxcms);