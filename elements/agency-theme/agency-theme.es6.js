import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";export{AgencyTheme};class AgencyTheme extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>`}static get properties(){return{}}static get tag(){return"agency-theme"}connectedCallback(){super.connectedCallback()}}window.customElements.define(AgencyTheme.tag,AgencyTheme);