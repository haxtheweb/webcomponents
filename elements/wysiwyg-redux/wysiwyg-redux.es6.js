import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";export{WysiwygRedux};class WysiwygRedux extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>`}static get properties(){return{}}static get tag(){return"wysiwyg-redux"}connectedCallback(){super.connectedCallback()}}window.customElements.define(WysiwygRedux.tag,WysiwygRedux);