import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";export{A11yMediaPlayer};class A11yMediaPlayer extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>`}static get properties(){return{}}static get tag(){return"a11y-media-player"}connectedCallback(){super.connectedCallback()}}window.customElements.define(A11yMediaPlayer.tag,A11yMediaPlayer);