import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./lib/lrndesign-mapmenu-item.js";
import "./lib/lrndesign-mapmenu-submenu.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
      #container {
        padding: 1em 2em;
      }
      :host > ::shadow lrndesign-mapmenu-submenu + lrndesign-mapmenu-submenu {
        margin-top: 1em;
      }
    </style>
    <slot></slot>
`,
  is: "lrndesign-mapmenu",
  properties: {}
});
