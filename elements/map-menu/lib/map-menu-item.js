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

      :host([active]) {
        background: var(--map-menu-active-color);
      }

      iron-icon {
        display: inline-block;
        --iron-icon-height: var(--map-menu-item-height);
      }

      #title {
        text-transform: none;
      }

      a,
      a:hover,
      a:visited,
      a:focus {
        color: inherit;
      }
    </style>
    <a href$="[[url]]">
      <paper-button id="wrapper" role="link" noink>
        <template is="dom-if" if="[[__hasIcon(icon)]]">
          <iron-icon icon="[[icon]]"></iron-icon>
        </template>
        <span id="title">[[title]]</span>
      </paper-button>
    </a>
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
      observer: "_activeChanged"
    },
    selected: {
      type: String
    }
  },

  observers: ["__selectedChanged(selected, id)"],

  ready: function() {
    this.fire("map-menu-toggle-subscribe", {
      callback: "_mapMenuToggleSubscribeHandler",
      scope: this
    });
  },

  __selectedChanged: function(selected, id) {
    if (selected === id) {
      this.fire("active-item", this);
    }
  },

  _click: function() {
    this.fire("link-clicked", { id: this.id });
  },

  attached: function() {
    this.fire("child-attached", { id: this.id });
  },

  __hasIcon: function(icon) {
    return icon || icon === "" ? true : false;
  }
});
