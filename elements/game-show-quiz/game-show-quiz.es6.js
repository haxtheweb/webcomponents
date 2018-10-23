import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";export{GameShowQuiz};class GameShowQuiz extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>`}static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Game show-quiz",description:"Automated conversion of game-show-quiz/",icon:"icons:android",color:"green",groups:["Show"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"btopro",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[],advanced:[]}}}static get properties(){return{}}static get tag(){return"game-show-quiz"}connectedCallback(){super.connectedCallback();this.HAXWiring=new HAXWiring;this.HAXWiring.setHaxProperties(GameShowQuiz.haxProperties,GameShowQuiz.tag,this)}}window.customElements.define(GameShowQuiz.tag,GameShowQuiz);