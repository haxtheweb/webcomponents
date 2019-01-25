import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import"./lib/wysiwyg-hello.js";export{WysiwygRedux};class WysiwygRedux extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>`}static get properties(){return{}}static get tag(){return"wysiwyg-redux"}connectedCallback(){super.connectedCallback();window.addEventListener("hello-world",function(e){console.log("hello window")});this.addEventListener("hello-world",function(e){console.log("hello element")})}ready(){super.ready()}}window.customElements.define(WysiwygRedux.tag,WysiwygRedux);