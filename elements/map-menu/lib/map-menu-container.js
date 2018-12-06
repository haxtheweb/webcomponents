import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "./map-menu-item.js";
import "./map-menu-submenu.js";
/**
`map-menu`
A LRN element

@demo demo/index.html
*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
      #container {
        padding: 16px 32px;
      }
      :host > ::slotted(map-menu-submenu + map-menu-submenu) {
        margin-top: 16px;
      }
    </style>
    <slot></slot>
  `,

  is: "map-menu-container",

  properties: {}
});
