import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";class SocialShareLink extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>
<div>[[title]]</div>`}static get properties(){return{title:{name:"title",type:"String",value:"",reflectToAttribute:!0,observer:"_titleChanged"}}}static get tag(){return"social-share-link"}connectedCallback(){super.connectedCallback()}_titleChanged(newValue,oldValue){if(typeof newValue!==typeof void 0){console.log(newValue)}}}window.customElements.define(SocialShareLink.tag,SocialShareLink);export{SocialShareLink};