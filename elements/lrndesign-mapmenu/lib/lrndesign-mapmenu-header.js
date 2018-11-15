import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js";
import "@polymer/iron-collapse/iron-collapse.js";
import "@polymer/iron-icon/iron-icon.js";
import { IronButtonState } from "@polymer/iron-behaviors/iron-button-state.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
      #container {
        display: flex;
        align-items: center;
      }
      #icon {
        margin-right: 10px;
      }
      #center {
        flex: 1 1 auto;
      }
      lrndesign-avatar {
        display: inline-block;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 1px 1px rgba(0,0,0,0.3);
        padding: 2px;
        position: relative;
        margin-top: -2px;
      }
      lrndesign-avatar ::slotted(*) {
        transform: translateY(2px);
      }
      #title {
        font-size: 19.2px;
      }
      #right iron-icon {
        color: gray;
        display: inline-flex;
      }
    </style>
    <div id="container">
      <template is="dom-if" if="[[avatarLabel]]">
        <div id="icon">
          <lrndesign-avatar label="[[avatarLabel]]"></lrndesign-avatar>
        </div>
      </template>
      <div id="center">
        <div id="label">[[label]]</div>
        <div id="title">[[title]]</div>
      </div>
      <div id="right">
        <template is="dom-if" if="[[!opened]]">
          <iron-icon icon="arrow-drop-down"></iron-icon>
        </template>
        <template is="dom-if" if="[[opened]]">
          <iron-icon icon="arrow-drop-up"></iron-icon>
        </template>
      </div>
    </div>
`,

  is: "lrndesign-mapmenu-header",
  behaviors: [IronButtonState],

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
    }
  },

  hostAttributes: {
    role: "button",
    tabindex: 0
  }
});
