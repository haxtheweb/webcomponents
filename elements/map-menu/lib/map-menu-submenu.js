import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "./map-menu-item.js";
import "./map-menu-header.js";
import "@polymer/iron-collapse/iron-collapse.js";
import "@polymer/paper-button/paper-button.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }

      :host([collapsable]) > map-menu-header {
        cursor: pointer;
        display: block;
      }

      #container {
        margin-left: 16px;
      }

      #container ::slotted(map-menu-item) {
        margin-top: 0.4em;
      }
    </style>
    <map-menu-header
      avatar-label="[[avatarLabel]]"
      id="[[id]]"
      title="[[title]]"
      label="[[label]]"
      opened="[[opened]]"
      url="[[url]]"
      icon="[[icon]]"
      selected="[[selected]]"
    ></map-menu-header>
    <iron-collapse id="container"> <slot></slot> </iron-collapse>
  `,

  is: "map-menu-submenu",

  properties: {
    id: {
      type: String
    },
    title: {
      type: String
    },
    avatarLabel: {
      type: String
    },
    label: {
      type: String
    },
    icon: {
      type: String
    },
    opened: {
      type: Boolean,
      value: false
    },
    collapsable: {
      type: Boolean,
      value: true
    },
    expandChildren: {
      type: Boolean,
      value: false
    },
    selected: {
      type: String
    }
  },

  observers: ["_openChanged(opened)"],

  listeners: {
    "child-deactivated": "__childDeactivated",
    "child-activated": "__childActivated",
    "active-item": "__activeChanged",
    "toggle-header": "__toggleHeader",
    "link-clicked": "_headerClickHandler",
    "map-menu-active-item-changed": "_mapMenuActiveItemChangedHandler",
    "map-menu-item-hidden-check": "_mapMenuItemHiddenCheckHandler"
  },

  _openChanged: function(opened) {
    var target = this.$.container;
    if (opened) target.show();
    if (!opened) target.hide();
  },

  _headerClickHandler: function(e) {
    if (!this.opened) {
      this.opened = !this.opened;
    }
  },

  _mapMenuItemHiddenCheckHandler: function(e) {
    const action = e.detail.action;
    const target = e.detail.target;
    const hiddenChild = e.detail.hiddenChild;
    let detail = Object.assign({}, e.detail);

    if (hiddenChild !== true && this.opened === false) {
      detail = Object.assign({}, detail, { hiddenChild: true });
    } else {
      detail = Object.assign({}, detail, { hiddenChild: false });
    }

    this.fire("map-meu-item-hidden-check", detail);
  },

  __toggleHeader: function(e) {
    // catch the event and end propagation
    e.stopPropagation();
    this.opened = !this.opened;
    this.fire("toggle-updated", { opened: this.opened });
  },

  __activeChanged: function(e) {
    this.opened = true;
  }
});
