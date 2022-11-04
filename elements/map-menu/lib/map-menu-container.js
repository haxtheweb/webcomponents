import { LitElement, html, css } from "lit";
import "./map-menu-item.js";
import "./map-menu-submenu.js";
/**
`map-menu`
A LRN element

* @demo demo/index.html
*/
class MapMenuContainer extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        #container {
          padding: 16px 32px;
        }
        :host > ::slotted(map-menu-submenu + map-menu-submenu) {
          margin-top: 16px;
        }
      `,
    ];
  }
  /**
   * LitElement life cycle - render
   */
  render() {
    return html` <slot></slot> `;
  }
  static get tag() {
    return "map-menu-container";
  }
}
customElements.define(MapMenuContainer.tag, MapMenuContainer);
export { MapMenuContainer };
