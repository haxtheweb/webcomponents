import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import "@polymer/polymer/lib/elements/dom-if.js";
class MapMenuBuilder extends PolymerElement {
  constructor() {
    super();
    import("@lrnwebcomponents/map-menu/lib/map-menu-submenu.js");
    import("@lrnwebcomponents/map-menu/lib/map-menu-item.js");
    import("@lrnwebcomponents/map-menu/lib/map-menu-header.js");
  }
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>

      <template id="domRepeat" is="dom-repeat" items="[[items]]" as="item">
        <template is="dom-if" if="[[__hasChildren(item)]]">
          <map-menu-submenu
            title="[[item.title]]"
            id="[[item.id]]"
            url="[[item.location]]"
            icon="[[item.metadata.icon]]"
            open="[[item.metadata.active]]"
            avatar-label="[[item.metadata.avatarLabel]]"
            selected="[[selected]]"
          >
            <map-menu-builder
              items="[[item.children]]"
              selected="[[selected]]"
            ></map-menu-builder>
          </map-menu-submenu>
        </template>
        <template is="dom-if" if="[[!__hasChildren(item)]]">
          <map-menu-item
            title="[[item.title]]"
            id="[[item.id]]"
            url="[[item.location]]"
            icon="[[item.metadata.icon]]"
            track-icon="[[item.metadata.accessData.trackIcon]]"
            active-path="[[activePath]]"
            selected="[[selected]]"
          ></map-menu-item>
        </template>
      </template>
    `;
  }

  static get tag() {
    return "map-menu-builder";
  }

  static get properties() {
    return {
      items: {
        type: Array,
        value: []
      },
      selected: {
        type: String
      }
    };
  }

  /**
   * Determine if a menu item has children
   */
  __hasChildren(item) {
    return item.children.length > 0;
  }

  /**
   * Determine if children are active or self
   * is active
   */
  _hasActiveChildren() {}
}
window.customElements.define(MapMenuBuilder.tag, MapMenuBuilder);
export { MapMenuBuilder };
