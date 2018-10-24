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
        padding: 1em 2em;
      }
      :host > ::shadow map-menu-submenu + map-menu-submenu {
        margin-top: 1em;
      }
    </style>
    <slot></slot>
`,

  is: "map-menu-container",

  properties: {}
});
