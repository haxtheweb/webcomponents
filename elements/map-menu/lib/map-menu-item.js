import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/paper-button/paper-button.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        --map-menu-item-height: 16px;
      }

      :host[active] {
        background: var(--map-menu-active-color);
      }

      iron-icon {
        --iron-icon-height: var(--map-menu-item-height);
      }

      #title {
        font-size: .9em;
        text-transform: none;
      }
    </style>
      <paper-button id="wrapper" href\$="[[url]]" role="link" noink="" on-tap="_click">
        <template is="dom-if" if="[[__hasIcon(icon)]]">
          <iron-icon icon="[[icon]]"></iron-icon>
        </template>
        <span id="title">[[title]]</span>
      </paper-button>
`,

  is: "map-menu-item",

  properties: {
    icon: {
      type: String,
      value: ""
    },
    title: {
      type: String,
      value: ""
    },
    url: {
      type: String,
      value: ""
    },
    icon: {
      type: String
    },
    id: {
      type: String,
      reflectToAttribute: true
    },
    active: {
      type: Boolean,
      value: false,
      observer: "__activeChanged"
    }
  },

  _click: function() {
    this.fire("link-clicked", { id: this.id });
  },

  attached: function() {
    this.fire("child-attached", { id: this.id });
  },

  __activeChanged: function(active, oldActive) {
    if (active === oldActive) return;
    if (active === true) {
      this.fire("active-item", { id: this.id });
    }
  },

  __hasIcon: function(icon) {
    return icon || icon === "" ? true : false;
  }
});
