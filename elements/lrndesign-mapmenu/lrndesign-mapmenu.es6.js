/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./lib/lrndesign-mapmenu-item.js";import"./lib/lrndesign-mapmenu-submenu.js";/**
`lrndesign-mapmenu`
A LRN element

* @demo demo/index.html
*/let LrndesignMapmenu=Polymer({_template:html`
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
  `,is:"lrndesign-mapmenu",properties:{}});export{LrndesignMapmenu};