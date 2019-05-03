/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";/**
`lrnsys-render-html`
A legacy element which just directly renders HTML.
WARNING: DO NOT USE THIS UNLESS YOU KNOW WHAT YOU ARE DOING!

This element is meant to render html from a source that has already been sanitized.
Polymer will, by design, not render html for security reasons. This element gets around
that. Do not render raw user input through this element! This would allow XSS attacks for
your users.

* @demo demo/index.html
*/class LrnsysRenderHtml extends PolymerElement{static get template(){return html`
    <style>
      :host {
        display: block;
      }
    </style>
    <div id="container"></div>`}static get tag(){return"lrnsys-render-html"}static get properties(){return{/**
       * String to render as HTML directly
       * @type {Object}
       */html:{type:String}}}/**
   * When HTML changes, inject it directly.
   */static get observers(){return["_render(html)"]}/**
   * Render the HTML by just injecting it directly.
   */_render(html){this.$.container.innerHTML=html}}window.customElements.define(LrnsysRenderHtml.tag,LrnsysRenderHtml);export{LrnsysRenderHtml};