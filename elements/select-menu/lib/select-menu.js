import "@polymer/polymer/polymer.js";
import "@polymer/paper-dropdown-menu/paper-dropdown-menu.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/paper-listbox/paper-listbox.js";
import "@polymer/iron-demo-helpers/demo-pages-shared-styles.js";
import { Polymer } from "@polymer/polymer/lib/legacy/polymer-fn.js";
import "@webcomponents/webcomponentsjs/webcomponents-lite.js";
/**
 * `select-menu`
 * accepts an array of values and human-readable text and creates a paper-dropdown-menu, provides the value fo the selected item
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
/*link rel="import" href="../neon-animation/web-animations.html"*/
Polymer({
  _template: `
    <style is="custom-style" include="demo-pages-shared-styles">
      paper-dropdown-menu, paper-listbox {
        width: 250px;
      }
      paper-dropdown-menu {
        height: 200px;
        margin: auto;
        display: block;
      }
    </style>
    <paper-dropdown-menu id="menu" label\$="[[label]]" on-selected-item-changed="_setSelectedValue">
      <paper-listbox id="listbox" slot="dropdown-content" selected="{{selectedIndex}}">
        <slot></slot>
      </paper-listbox>
    </paper-dropdown-menu>
`,

  is: "select-menu",

  listeners: {
    "menubutton.tap": "_menubuttonTap"
  },

  properties: {
    /**
     * The label of the select menu
     */
    label: {
      type: String,
      value: "Select an option."
    },
    /**
     * The default value
     */
    value: {
      type: String,
      value: null
    },
    /**
     * The index of the selected item
     */
    selectedIndex: {
      type: Number,
      reflectToAttribute: true,
      notify: true,
      computed: "_getSelectedIndex()"
    }
  },

  /**
   * Get the value of the selected item.
   */
  _setSelectedValue: function(e) {
    if (e.detail.value !== null) {
      let val = e.detail.value.getAttribute("value");
      this.setAttribute("value", val);
      this.fire("change", { value: val });
    }
  },

  /**
   * Get the index of the default value.
   */
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
