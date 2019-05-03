import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "./map-menu-item.js";
import "./map-menu-submenu.js";
/**
`map-menu`
A LRN element

* @demo demo/index.html
*/
class MapMenuContainer extends PolymerElement {
  static get template() {
    return html`
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
    `;
  }
  static get tag() {
    return "map-menu-container";
  }
}
window.customElements.define(MapMenuContainer.tag, MapMenuContainer);
export { MapMenuContainer };
