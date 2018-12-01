import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";class ElmslnApps extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>`}static get properties(){return{}}static get tag(){return"elmsln-apps"}connectedCallback(){super.connectedCallback()}}window.customElements.define(ElmslnApps.tag,ElmslnApps);export{ElmslnApps};