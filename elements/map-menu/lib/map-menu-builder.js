import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "./map-menu-submenu.js";
import "./map-menu-item.js";
Polymer({
  _template: html`
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
  `,

  is: "map-menu-builder",

  properties: {
    items: {
      type: Array,
      value: []
    },
    selected: {
      type: String
    }
  },

  /**
   * Determine if a menu item has children
   */
  __hasChildren: function(item) {
    return item.children.length > 0;
  },

  /**
   * Determine if children are active or self
   * is active
   */
  _hasActiveChildren: function() {}
});
