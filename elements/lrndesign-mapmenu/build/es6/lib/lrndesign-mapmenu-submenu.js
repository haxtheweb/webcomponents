import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
import "./lrndesign-mapmenu-item.js";
import "./lrndesign-mapmenu-header.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
      :host([collapsable]) > lrndesign-mapmenu-header {
        cursor: pointer;
        display: block;
      }
      #container {
        padding: 1em;
      }
      #container ::slotted(lrndesign-mapmenu-item) {
        margin-top: .4em;
      }
    </style>
    <lrndesign-mapmenu-header on-tap="_headerClickHandler" avatar-label="[[avatarLabel]]" title="[[title]]" label="[[label]]" opened="[[opened]]"></lrndesign-mapmenu-header>
    <iron-collapse id="container">
      <slot id="slot"></slot>
    </iron-collapse>
`,
  is: "lrndesign-mapmenu-submenu",
  properties: {
    title: { type: String },
    avatarLabel: { type: String },
    label: { type: String },
    opened: { type: Boolean, value: !1 },
    collapsable: { type: Boolean, value: !0 },
    expandChildren: { type: Boolean, value: !1 }
  },
  observers: ["_openChanged(opened)"],
  _openChanged: function(opened) {
    var target = this.$.container;
    if (opened) target.show();
    if (!opened) target.hide();
  },
  _headerClickHandler: function() {
    if (this.collapsable) {
      this.opened = !this.opened;
    }
  },
  ready: function() {
    this._observer = dom(this.$.slot).observeNodes(info => {
      var submenus = info.addedNodes.filter(
        item => "LRNDESIGN-MAPMENU-SUBMENU" === item.nodeName
      );
      if (this.expandChildren) {
        for (let menu of submenus) {
          menu.setAttribute("opened", !0);
        }
      }
    });
  }
});
