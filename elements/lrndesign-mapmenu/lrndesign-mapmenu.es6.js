/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import"./lib/lrndesign-mapmenu-item.js";import"./lib/lrndesign-mapmenu-submenu.js";/**
`lrndesign-mapmenu`
A LRN element

* @demo demo/index.html
*/class LrndesignMapmenu extends PolymerElement{static get template(){return html`
    <style>
      :host {
        display: block;
      }
      #container {
        padding: 16px 32px;
      }
      :host > ::slotted(lrndesign-mapmenu-submenu + lrndesign-mapmenu-submenu) {
        margin-top: 16px;
      }
    </style>
    <slot></slot>
  `}static get tag(){return"lrndesign-mapmenu"}static get properties(){return{}}}window.customElements.define(LrndesignMapmenu.tag,LrndesignMapmenu);export{LrndesignMapmenu};