import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js";
import "@polymer/iron-collapse/iron-collapse.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-behaviors/iron-button-state.js";
import "@polymer/paper-button/paper-button.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }

      :host([active]) {
        background: var(--map-menu-active-color);
      }

      #container {
        display: flex;
        align-items: center;
      }

      #avatarLabel {
        margin-right: 10px;
      }

      #center {
        flex: 1 1 auto;
      }

      a,
      a:hover,
      a:visited,
      a:focus {
        color: inherit;
      }

      lrndesign-avatar {
        display: inline-block;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
        padding: 2px;
        position: relative;
        margin-top: -2px;
        transform: translateY(2px);
      }

      #link {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-direction: column;
      }

      #right iron-icon {
        display: inline-block;
        color: gray;
      }

      /* @todo this is a hack */
      #icon iron-icon {
        display: inline-block;
        --iron-icon-height: 16px;
        transform: translateX(10px);
      }

      paper-button {
        text-transform: none;
      }
    </style>
    <div id="container">
      <template is="dom-if" if="[[avatarLabel]]">
        <div id="avatarLabel">
          <lrndesign-avatar label="[[avatarLabel]]"></lrndesign-avatar>
        </div>
      </template>
      <template is="dom-if" if="[[icon]]">
        <div id="icon"><iron-icon icon="[[icon]]"></iron-icon></div>
      </template>
      <div id="center">
        <a href$="[[url]]">
          <paper-button id="title" noink="" role\$="[[__titleRole()]]">
            <div id="label">[[label]]</div>
            <div id="title">[[title]]</div>
          </paper-button>
        </a>
      </div>
      <div id="right">
        <template is="dom-if" if="[[!opened]]">
          <iron-icon
            id="toggle"
            icon="arrow-drop-down"
            aria-role="button"
            aria-label="expand menu"
            tabindex="0"
          ></iron-icon>
        </template>
        <template is="dom-if" if="[[opened]]">
          <iron-icon
            id="toggle"
            icon="arrow-drop-up"
            aria-role="button"
            aria-label="collapse menu"
            tabindex="0"
          ></iron-icon>
        </template>
      </div>
    </div>
  `,

  is: "map-menu-header",

  properties: {
    title: {
      type: String
    },
    label: {
      type: String
    },
    avatarLabel: {
      type: String,
      value: ""
    },
    opened: {
      type: Boolean
    },
    url: {
      type: String,
      value: ""
    },
    id: {
      type: String,
      reflectToAttribute: true
    },
    icon: {
      type: String
    },
    active: {
      type: Boolean,
      value: false
    },
    selected: {
      type: String
    }
  },

  listeners: {
    tap: "__tap",
    keypress: "__keypress"
  },

  observers: ["__selectedChanged(selected, id)"],

  __selectedChanged: function(selected, id) {
    if (selected === id) {
      this.fire("active-item", this);
    }
  },

  attached: function() {
    this.fire("child-attached", { id: this.id });
  },

  __tap: function(e) {
    // send to toggle event
    this.__toggleEventHandler(e);
  },

  __keypress: function(e) {
    // send to toggle event
    if (e.code === "Enter") {
      this.__toggleEventHandler(e);
    }
  },

  __toggleEventHandler: function(e) {
    let rootTarget = dom(e).rootTarget;
    if (typeof rootTarget !== "undefined") {
      if (typeof rootTarget.id !== "undefined" && rootTarget.id === "toggle") {
        this.fire("toggle-header");
      }
    }
  }
});
