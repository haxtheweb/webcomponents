import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js";
import "../node_modules/@polymer/iron-collapse/iron-collapse.js";
import "../node_modules/@polymer/iron-icon/iron-icon.js";
import "../node_modules/@polymer/iron-behaviors/iron-button-state.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }

      :host[active] {
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

      lrndesign-avatar {
        display: inline-block;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
        padding: 2px;
        position: relative;
        margin-top: -2px;
      }

      lrndesign-avatar ::shadow>* {
        transform: translateY(2px);
      }

      #link {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-direction: column;
      }

      #title {
        font-size: 1.0em;
      }

      #right iron-icon {
        color: gray;
      }

      /* @todo this is a hack */
      #icon iron-icon {
        --iron-icon-height: 16px;
        transform: translateX(10px);
      }
    </style>
    <div id="container">
      <template is="dom-if" if="[[avatarLabel]]">
        <div id="avatarLabel">
          <lrndesign-avatar label="[[avatarLabel]]"></lrndesign-avatar>
        </div>
      </template>
      <template is="dom-if" if="[[icon]]">
        <div id="icon">
          <iron-icon icon="[[icon]]"></iron-icon>
        </div>
      </template>
      <div id="center">
        <paper-button id="title" noink="" role\$="[[__titleRole()]]" on-tap="__linkClickHandler">
          <div id="label">[[label]]</div>
          <div id="title">[[title]]</div>
        </paper-button>
      </div>
      <div id="right">
        <template is="dom-if" if="[[!opened]]">
          <iron-icon id="toggle" icon="arrow-drop-down" aria-role="button" aria-label="expand menu" tabindex="0"></iron-icon>
        </template>
        <template is="dom-if" if="[[opened]]">
          <iron-icon id="toggle" icon="arrow-drop-up" aria-role="button" aria-label="collapse menu" tabindex="0"></iron-icon>
        </template>
      </div>
    </div>
`,
  is: "map-menu-header",
  properties: {
    title: { type: String },
    label: { type: String },
    avatarLabel: { type: String, value: "" },
    opened: { type: Boolean },
    url: { type: String, value: "" },
    id: { type: String, reflectToAttribute: !0 },
    icon: { type: String },
    active: { type: Boolean, value: !1, observer: "__activeChanged" }
  },
  listeners: { tap: "__tap", keypress: "__keypress" },
  __titleRole: function() {
    if (this.url) {
      return "link";
    } else {
      return !1;
    }
  },
  __linkClickHandler: function() {
    if (this.id) {
      this.fire("link-clicked", { id: this.id });
    }
  },
  attached: function() {
    this.fire("child-attached", { id: this.id });
  },
  __activeChanged: function(active, oldActive) {
    if (active === oldActive) return;
    if (!0 === active) {
      this.fire("active-item", { id: this.id });
    }
  },
  __tap: function(e) {
    this.__toggleEventHandler(e);
  },
  __keypress: function(e) {
    if ("Enter" === e.code) {
      this.__toggleEventHandler(e);
    }
  },
  __toggleEventHandler: function(e) {
    if ("undefined" !== typeof e.target) {
      if ("undefined" !== typeof e.target.id) {
        if ("toggle" === e.target.id) {
          this.fire("toggle-header");
        }
      }
    }
  }
});
