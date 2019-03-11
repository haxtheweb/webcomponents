import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/paper-button/paper-button.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        transition: 0.2s all ease-in-out;
        transition-delay: 0.2s;
        --map-menu-item-height: 16px;
      }
      :host([active]) {
        background: var(--map-menu-active-color);
        @apply --map-menu-item-active-item;
      }
      paper-button {
        width: 100%;
        justify-content: left;
        margin: 0;
      }
      iron-icon {
        display: inline-block;
        --iron-icon-height: var(--map-menu-item-height);
      }
      .title {
        text-transform: none;
      }
      a,
      a:hover,
      a:visited,
      a:focus {
        color: inherit;
      }
      #track {
        transition: 0.2s all ease-in-out;
        transition-delay: 0.5s;
        position: absolute;
        right: 0;

        margin-right: 0px;
        width: 0px;
        height: 0px;
        visibility: hidden;
        opacity: 0;
      }
      #track.show-icon {
        margin-right: 5px;
        width: 18px;
        height: 18px;
        visibility: visible;
        opacity: 1;
      }
    </style>
    <a tabindex="-1" href$="[[url]]">
      <paper-button id="wrapper" role="link" noink>
        <iron-icon hidden$="[[__hasIcon(icon)]]" icon="[[icon]]"></iron-icon>
        <span class="title">[[title]]</span>
        <iron-icon
          id="track"
          hidden$="[[__hasIcon(trackIcon)]]"
          icon="[[trackIcon]]"
        ></iron-icon>
      </paper-button>
    </a>
  `,

  is: "map-menu-item",

  properties: {
    icon: {
      type: String,
      value: ""
    },
    trackIcon: {
      stype: String,
      value: "",
      observer: "_trackIconChanged"
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
      value: false
    },
    selected: {
      type: String
    }
  },

  observers: ["__selectedChanged(selected, id)"],
  _trackIconChanged: function(newValue, oldValue) {
    if (newValue) {
      this.$.track.classList.add("show-icon");
    } else {
      this.$.track.classList.remove("show-icon");
    }
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
