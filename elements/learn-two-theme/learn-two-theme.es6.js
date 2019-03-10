import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";class LearnTwoTheme extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>`}static get properties(){return{}}static get tag(){return"learn-two-theme"}connectedCallback(){super.connectedCallback()}}window.customElements.define(LearnTwoTheme.tag,LearnTwoTheme);export{LearnTwoTheme};