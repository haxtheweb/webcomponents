import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import "./node_modules/@polymer/iron-flex-layout/iron-flex-layout.js";
import "./node_modules/@polymer/paper-icon-button/paper-icon-button.js";
import "./node_modules/@polymer/paper-item/paper-item.js";
import "./node_modules/@polymer/paper-styles/color.js";
import "./node_modules/@polymer/paper-listbox/paper-listbox.js";
import "./node_modules/@polymer/paper-menu-button/paper-menu-button.js";
import "./node_modules/@polymer/iron-list/iron-list.js";
import "./node_modules/@polymer/iron-icon/iron-icon.js";
import { IronMeta } from "./node_modules/@polymer/iron-meta/iron-meta.js";
import "./node_modules/@polymer/neon-animation/neon-animation.js";
import "./node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "./node_modules/@polymer/paper-tooltip/paper-tooltip.js";
import "./node_modules/@polymer/iron-iconset-svg/iron-iconset-svg.js";
import "./lib/paper-icon-picker-icon.js";
Polymer({
  _template: html`
    <style is="custom-style">
      :host {
        display: inline-block;
        position: relative;
      }

      :host(:focus) {
        outline: none;
      }

      .icon {
        box-sizing: border-box;
        width: var(--paper-icon-picker-icon-size, 26px);
        height: var(--paper-icon-picker-icon-size, 26px);
        color: #888888;
        display: inline-block;
        padding: 0;
        margin: 0;
        cursor: pointer;
        font-size: 0;
        position: absolute;
      }
      .icon iron-icon {
        width: var(--paper-icon-picker-icon-size, 26px);
        height: var(--paper-icon-picker-icon-size, 26px);
      }

      /* If we just scale the paper-item when hovering, this will end up
       * adding scrollbars to the paper-listbox that are hard to get rid of.
       * An easy workaround is to use an :after pseudo element instead. */
      .icon:after {
        @apply --layout-fit;
        content: '';
        -webkit-transition: -webkit-transform 0.2s;
        transition: transform .2s;
        z-index: 0;
      }

      .icon:hover, .icon:focus {
        -webkit-transform: scale(1.8, 1.8);
        transform: scale(1.8, 1.8);
        outline: none;
        z-index: 1;
        background-color: #FFFFFF;
        border-radius: 0;
        border: 1px solid #888888;
        color: orange !important;
      }

      paper-item {
        --paper-item: {
          margin: 0;
          padding: 0;
          min-height: 0;
        };

        --paper-item-focused-before: {
          opacity: 0;
        };
      }

      paper-listbox {
        margin: 8px;
        font-size: 0;
        @apply --layout-vertical;
        @apply --layout-wrap;
      }
      paper-tooltip {
        z-index: 1;
      }
      .icon-group-1 {
        color: var(--paper-pink-700);
      }
      .icon-group-2 {
        color: var(--google-green-700);
      }
      .icon-group-3 {
        color: var(--google-blue-700);
      }
      .icon-group-4 {
        color: var(--paper-grey-700);
      }
      .icon-group-5 {
        color: var(--paper-pink-700);
      }
      .icon-group-6 {
        color: var(--google-green-700);
      }
      .icon-group-7 {
        color: var(--google-blue-700);
      }
      .icon-group-8 {
        color: var(--paper-grey-700);
      }
      .icon-group-9 {
        color: var(--paper-pink-700);
      }
      .icon-group-10 {
        color: var(--google-green-700);
      }
      .icon-group-11 {
        color: var(--google-blue-700);
      }
      .icon-group-12 {
        color: var(--paper-grey-700);
      }
      .icon-group-13 {
        color: var(--paper-pink-700);
      }
      .icon-group-14 {
        color: var(--google-green-700);
      }
      .icon-group-15 {
        color: var(--google-blue-700);
      }
      .icon-group-16 {
        color: var(--paper-grey-700);
      }
      .icon-group-17 {
        color: var(--paper-pink-700);
      }
      .icon-group-18 {
        color: var(--google-green-700);
      }
      .icon-group-19 {
        color: var(--google-blue-700);
      }
    </style>

    <paper-menu-button id="iconpicker" on-tap="_onOpen" vertical-align="[[verticalAlign]]" horizontal-align="[[horizontalAlign]]" opened="{{opened}}">
      <paper-icon-button id="iconButton" icon="swatch:perm-media" class="dropdown-trigger" alt="icon picker" noink$="[[noink]]" slot="dropdown-trigger">
      </paper-icon-button>
      <iron-list grid items="[[renderIconList]]" id="container" slot="dropdown-content">
      <template>
        <paper-item class$="icon-group-[[item.index]] icon" value="[[item.icon]]">
          <iron-icon icon="[[item.icon]]"></iron-icon>
        </paper-item>
      </template>
      </iron-list>
    </paper-menu-button>
    <paper-tooltip for="iconpicker" position="bottom" offset="14">
      [[iconText]]
    </paper-tooltip>
    <iron-a11y-keys target="[[iconpicker]]" keys="escape" on-keys-pressed="close" stop-keyboard-event-propagation></iron-a11y-keys>
`,
  is: "paper-icon-picker",
  listeners: { tap: "_onIconTap" },
  properties: {
    opened: { type: Boolean },
    icon: { type: String, notify: !0, observer: "_iconChanged" },
    iconText: { type: String, computed: "_computedIconText(icon)" },
    iconList: {
      type: Array,
      notify: !0,
      value: function() {
        return [];
      }
    },
    renderIconList: {
      type: Array,
      computed: "_computeRenderIconList(iconList)"
    },
    columnCount: { type: Number, value: 8 },
    maxRows: { type: Number, value: 6 },
    horizontalAlign: { type: String, value: "left", reflectToAttribute: !0 },
    verticalAlign: { type: String, value: "top", reflectToAttribute: !0 },
    noink: { type: Boolean }
  },
  _onOpen: function() {
    setTimeout(() => {
      try {
        this.shadowRoot.querySelector("paper-item").focus();
      } catch (error) {}
    }, 500);
  },
  close: function() {
    this.opened = !1;
  },
  _computeRenderIconList: function(list) {
    var renderList = [],
      item = {};
    for (var i in list) {
      item = {};
      if (typeof list[i].icon === typeof void 0) {
        item.icon = list[i];
      } else {
        item.icon = list[i].icon;
      }
      if (typeof list[i].index === typeof void 0) {
        item.index = 0;
      } else {
        item.index = list[i].index;
      }
      renderList.push(item);
    }
    return renderList;
  },
  _computedIconText: function(icon) {
    if ("" == icon) {
      return "Select an icon";
    }
    return icon;
  },
  created: function() {
    this._renderedIcons = !1;
  },
  attached: function() {
    const iconSets = new IronMeta({ type: "iconset" });
    if (
      0 === this.iconList.length &&
      typeof iconSets !== typeof void 0 &&
      iconSets.list &&
      iconSets.list.length
    ) {
      var iconList = [],
        index = 0;
      iconSets.list.forEach(function(item) {
        index++;
        item.getIconNames().forEach(icon => {
          iconList.push({ icon: icon, index: index });
        });
      });
      this.set("iconList", iconList);
    }
    var sizeOfAIconDiv;
    if (window.ShadyCSS) {
      sizeOfAIconDiv = ShadyCSS.getComputedStyleValue(
        this,
        "--paper-icon-picker-icon-size"
      );
    } else {
      sizeOfAIconDiv = getComputedStyle(this).getPropertyValue(
        "--paper-icon-picker-icon-size"
      );
    }
    if (!sizeOfAIconDiv || "" == sizeOfAIconDiv) {
      sizeOfAIconDiv = 26;
    } else {
      sizeOfAIconDiv = sizeOfAIconDiv.replace("px", "");
    }
    var rowCount = Math.round(this.iconList.length / this.columnCount) + 1;
    if (rowCount > this.maxRows) {
      rowCount = this.maxRows;
    }
    this.$.container.style.height = rowCount * sizeOfAIconDiv + "px";
    this.$.container.style.width = this.columnCount * sizeOfAIconDiv + "px";
  },
  _addOverflowClass: function() {
    this.$.container.toggleClass("opened", !0);
  },
  _removeOverflowClass: function() {
    this.$.container.toggleClass("opened", !1);
  },
  _onIconTap: function(e) {
    var normalizedEvent = dom(e),
      target = normalizedEvent.rootTarget;
    if ("PAPER-ITEM" === target.tagName) {
      this.icon = target.value;
      this.fire("icon-picker-selected", { icon: this.icon });
      this.$.container.fire("iron-select", this.icon);
    }
  },
  _iconChanged: function() {
    if (this.icon) {
      this.$.iconButton.icon = this.icon;
    } else {
      this.$.iconButton.icon = "swatch:perm-media";
    }
  }
});
