import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "./map-menu-item.js";
import "./map-menu-header.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }

      :host([collapsable])>map-menu-header {
        cursor: pointer;
        display: block;
      }

      #container {
        margin-left: 16px;
      }

      #container ::slotted(map-menu-item) {
        margin-top: .4em;
      }
    </style>
    <map-menu-header avatar-label="[[avatarLabel]]" id="[[id]]" title="[[title]]" label="[[label]]" opened="[[opened]]" url="[[url]]" icon="[[icon]]"></map-menu-header>
    <iron-collapse id="container">
      <slot id="slot"></slot>
    </iron-collapse>
`,
  is: "map-menu-submenu",
  properties: {
    id: { type: String },
    title: { type: String },
    avatarLabel: { type: String },
    label: { type: String },
    icon: { type: String },
    opened: { type: Boolean, value: !1 },
    collapsable: { type: Boolean, value: !0 },
    expandChildren: { type: Boolean, value: !1 }
  },
  observers: ["_openChanged(opened)"],
  listeners: {
    "child-deactivated": "__childDeactivated",
    "child-activated": "__childActivated",
    "active-item": "__activeChanged",
    "toggle-header": "__toggleHeader",
    "link-clicked": "_headerClickHandler"
  },
  _openChanged: function(opened) {
    var target = this.$.container;
    if (opened) target.show();
    if (!opened) target.hide();
  },
  _headerClickHandler: function() {
    if (!this.opened) {
      this.opened = !this.opened;
    }
  },
  __toggleHeader: function(e) {
    e.stopPropagation();
    this.opened = !this.opened;
    this.fire("toggle-updated");
  },
  __activeChanged: function() {
    this.opened = !0;
  }
});
