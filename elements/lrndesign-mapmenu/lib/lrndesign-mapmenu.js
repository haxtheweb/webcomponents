import "./imports.js";
import "./lrndesign-mapmenu-item.js";
import "./lrndesign-mapmenu-submenu.js";
/**
`lrndesign-mapmenu`
A LRN element

@demo demo/index.html
*/
Polymer({
  _template: `
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
