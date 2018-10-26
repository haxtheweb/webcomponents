import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js";
import "./node_modules/@polymer/paper-item/paper-item.js";
import "./node_modules/@polymer/paper-listbox/paper-listbox.js";
import "./node_modules/@polymer/iron-demo-helpers/demo-pages-shared-styles.js";
Polymer({
  _template: html`
  <custom-style>
    <style is="custom-style">
      paper-dropdown-menu, paper-listbox {
        width: 250px;
      }
      paper-dropdown-menu {
        height: 200px;
        margin: auto;
        display: block;
      }
    </style>
  </custom-style>
  <paper-dropdown-menu id="menu" label\$="[[label]]" on-selected-item-changed="_setSelectedValue">
    <paper-listbox id="listbox" slot="dropdown-content" selected="{{selectedIndex}}">
      <slot></slot>
    </paper-listbox>
  </paper-dropdown-menu>
`,
  is: "select-menu",
  listeners: { "menubutton.tap": "_menubuttonTap" },
  properties: {
    label: { type: String, value: "Select an option." },
    value: { type: String, value: null },
    selectedIndex: {
      type: Number,
      reflectToAttribute: !0,
      notify: !0,
      computed: "_getSelectedIndex()"
    }
  },
  _setSelectedValue: function(e) {
    if (null !== e.detail.value) {
      let val = e.detail.value.getAttribute("value");
      this.setAttribute("value", val);
      this.fire("change", { value: val });
    }
  },
  _getSelectedIndex: function() {
    this.__items = this.getElementsByTagName("paper-item");
    for (var i = 0; i < this.__items.length; i++) {
      console.log(
        this.value,
        this.__items[i],
        this.__items[i].getAttribute("value")
      );
      if (this.value == this.__items[i].getAttribute("value")) {
        return i;
      }
    }
    return null;
  }
});
