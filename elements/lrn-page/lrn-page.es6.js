import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";/**
`lrn-page`
A LRN element for a "page" of material. This ensures there's an OERSchema wrapper
so that all content produced has a baseline level of being identified as OER.

* @demo demo/index.html
*/class LrnPage extends PolymerElement{constructor(){super();import("./node_modules/@lrnwebcomponents/oer-schema/oer-schema.js")}static get template(){return html`
    <style>
      :host {
        display: block;
      }
    </style>
    <oer-schema><slot></slot></oer-schema>`}static get tag(){return"lrn-page"}}window.customElements.define(LrnPage.tag,LrnPage);export{LrnPage};