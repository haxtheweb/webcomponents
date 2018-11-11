import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "./map-menu-item.js";
import "./map-menu-submenu.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
      #container {
        padding: 16px 32px;
      }
      :host > ::shadow map-menu-submenu + map-menu-submenu {
        margin-top: 16px;
      }
    </style>
    <slot></slot>
`,
  is: "map-menu-container",
  properties: {}
});
