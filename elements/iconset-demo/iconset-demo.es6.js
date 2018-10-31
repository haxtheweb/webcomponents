import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";export{IconsetDemo};class IconsetDemo extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>
<div>[[icons]]</div>`}static get properties(){return{icons:{name:"icons",type:"Array",value:"[]",reflectToAttribute:!1,observer:!1}}}static get tag(){return"iconset-demo"}connectedCallback(){super.connectedCallback()}}window.customElements.define(IconsetDemo.tag,IconsetDemo);