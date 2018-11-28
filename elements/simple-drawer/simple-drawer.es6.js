import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";export{SimpleDrawer};class SimpleDrawer extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>`}static get properties(){return{opened:{name:"opened",type:Boolean,value:!1,reflectToAttribute:!0,observer:"_openedChanged"},closeLabel:{name:"closeLabel",type:String,value:"Close"},closeIcon:{name:"closeIcon",type:String,value:"cancel"},invokedBy:{name:"invokedBy",type:Object}}}static get tag(){return"simple-drawer"}connectedCallback(){super.connectedCallback()}}window.customElements.define(SimpleDrawer.tag,SimpleDrawer);