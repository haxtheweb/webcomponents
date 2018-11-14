import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { FlattenedNodesObserver } from "@polymer/polymer/lib/utils/flattened-nodes-observer.js";
import "@polymer/paper-button/paper-button.js";
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
        padding: 16px;
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
    title: {
      type: String
    },
    avatarLabel: {
      type: String
    },
    label: {
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
    }
  },

  observers: ["_openChanged(opened)"],

  _openChanged: function(opened) {
    var target = this.$.container;
    if (opened) target.show();
    if (!opened) target.hide();
  },

  _headerClickHandler: function(e) {
    if (this.collapsable) {
      this.opened = !this.opened;
    }
  },

  ready: function() {
    this._observer = FlattenedNodesObserver(this.$.slot, info => {
      var submenus = info.addedNodes.filter(
        item => item.nodeName === "LRNDESIGN-MAPMENU-SUBMENU"
      );
      if (this.expandChildren) {
        for (let menu of submenus) {
          menu.setAttribute("opened", true);
        }
      }
    });
  }
});
