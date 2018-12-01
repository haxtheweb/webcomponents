import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { IronMeta } from "@polymer/iron-meta/iron-meta.js";
import "@polymer/iron-flex-layout/iron-flex-layout.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/paper-styles/color.js";
import "@polymer/paper-listbox/paper-listbox.js";
import "@polymer/paper-menu-button/paper-menu-button.js";
import "@polymer/iron-list/iron-list.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/neon-animation/neon-animation.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/iron-iconset-svg/iron-iconset-svg.js";
import "./lib/paper-icon-picker-icon.js";
/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
/**
This is a simple icon picker element that will allow you to choose one
of the Material Design icons from a list of available swatches.

Example:

    <paper-icon-picker></paper-icon-picker>

    <paper-icon-picker icon="{{selectedIcon}}"></paper-icon-picker>

You can configure the icon palette being used using the `iconList` array and
the `columnCount` property, which specifies how many "generic" icons (i.e. columns
in the picker) you want to display.

    <paper-icon-picker column-count=5 icon-list='["icons:cloud", "icons:face", "icons:work", "icons:pets", "icons:perm-contact-calendar"]'></paper-icon-picker>

### Styling

The following custom properties and mixins are available for styling:

Custom property | Description | Default
----------------|-------------|----------
`--paper-icon-picker-icon-size` | The size of each of the icon boxes | `26px`
`--paper-icon-picker-size` | The size of the icon picker | `24px`

@element paper-icon-picker
@demo demo/index.html
*/
let PaperIconPicker = Polymer({
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
        content: "";
        -webkit-transition: -webkit-transform 0.2s;
        transition: transform 0.2s;
        z-index: 0;
      }

      .icon:hover,
      .icon:focus {
        -webkit-transform: scale(1.8, 1.8);
        transform: scale(1.8, 1.8);
        outline: none;
        z-index: 1;
        background-color: #ffffff;
        border-radius: 0;
        border: 1px solid #888888;
        color: orange !important;
      }

      paper-item {
        --paper-item: {
          margin: 0;
          padding: 0;
          min-height: 0;
        }

        --paper-item-focused-before: {
          opacity: 0;
        }
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
    <paper-menu-button
      id="iconpicker"
      on-tap="_onOpen"
      vertical-align="[[verticalAlign]]"
      horizontal-align="[[horizontalAlign]]"
      opened="{{opened}}"
    >
      <paper-icon-button
        id="iconButton"
        icon="swatch:perm-media"
        class="dropdown-trigger"
        alt="icon picker"
        noink$="[[noink]]"
        slot="dropdown-trigger"
      ></paper-icon-button>
      <iron-list
        grid
        items="[[renderIconList]]"
        id="container"
        slot="dropdown-content"
      >
        <template>
          <paper-item
            on-tap="_onIconTap"
            class$="icon-group-[[item.index]] icon"
            value="[[item.icon]]"
          >
            <iron-icon icon="[[item.icon]]" value="[[item.icon]]"></iron-icon>
          </paper-item>
        </template>
      </iron-list>
    </paper-menu-button>
    <paper-tooltip for="iconpicker" position="bottom" offset="14">
      [[iconText]]
    </paper-tooltip>
    <iron-a11y-keys
      target="[[iconpicker]]"
      keys="escape"
      on-keys-pressed="close"
      stop-keyboard-event-propagation
    ></iron-a11y-keys>
  `,

  is: "paper-icon-picker",
  /**
   * Fired when a icon has been selected
   *
   * @event icon-picker-selected
   */

  properties: {
    /**
     * opened state
     */
    opened: {
      type: Boolean
    },
    /**
     * The selected icon, as string (i.e. 'icons:add-box').
     * value.
     */
    icon: {
      type: String,
      notify: true,
      observer: "_iconChanged"
    },
    /**
     * icon text off of icon
     */
    iconText: {
      type: String,
      computed: "_computedIconText(icon)"
    },
    /**
     * The icons to be displayed. By default, these are the Material Design
     * icons.
     */
    iconList: {
      type: Array,
      notify: true,
      value: function() {
        return [];
      }
    },
    /**
     * Build a list of icons to render based on
     * what has been found.
     */
    renderIconList: {
      type: Array,
      computed: "_computeRenderIconList(iconList)"
    },
    /**
     * The number of icons to display in the picker.
     * the Material Design palette has 18 icons
     */
    columnCount: {
      type: Number,
      value: 8
    },
    /**
     * max rows to display to increase performance of large lists
     * of icons being loaded
     */
    maxRows: {
      type: Number,
      value: 6
    },
    /**
     * The orientation against which to align the menu dropdown
     * horizontally relative to the dropdown trigger.
     */
    horizontalAlign: {
      type: String,
      value: "left",
      reflectToAttribute: true
    },

    /**
     * The orientation against which to align the menu dropdown
     * vertically relative to the dropdown trigger.
     */
    verticalAlign: {
      type: String,
      value: "top",
      reflectToAttribute: true
    },

    /**
     * If true, the icon picker button will not produce a ripple effect when interacted
     * with via the pointer.
     */
    noink: {
      type: Boolean
    }
  },

  /**
   * on open event
   */
  _onOpen: function(e) {
    setTimeout(() => {
      try {
        this.shadowRoot.querySelector("paper-item").focus();
      } catch (error) {}
    }, 500);
  },

  /**
   * Close list.
   */
  close: function() {
    this.opened = false;
  },

  /**
   * List that we will output to the screen
   */
  _computeRenderIconList: function(list) {
    var renderList = [];
    var item = {};
    for (var i in list) {
      item = {};
      if (typeof list[i].icon === typeof undefined) {
        item.icon = list[i];
      } else {
        item.icon = list[i].icon;
      }
      if (typeof list[i].index === typeof undefined) {
        item.index = 0;
      } else {
        item.index = list[i].index;
      }
      renderList.push(item);
    }
    return renderList;
  },

  /**
   * Icon text from icon selected
   */
  _computedIconText: function(icon) {
    if (icon == "") {
      return "Select an icon";
    }
    return icon;
  },

  created: function() {
    // Note: we won't actually render these icon boxes unless the menu is
    // actually tapped.
    this._renderedIcons = false;
  },

  /**
   * Attached life cycle
   */
  attached: function() {
    // need to access iconset imperatively now
    const iconSets = new IronMeta({ type: "iconset" });
    if (
      this.iconList.length === 0 &&
      typeof iconSets !== typeof undefined &&
      iconSets.list &&
      iconSets.list.length
    ) {
      var iconList = [];
      var index = 0;
      iconSets.list.forEach(function(item) {
        index++;
        item.getIconNames().forEach(icon => {
          iconList.push({
            icon: icon,
            index: index
          });
        });
      });
      this.set("iconList", iconList);
    }
    // Fit the icon boxes in columns. We first need to get the width of
    // a icon box (which is customizable), and then change the box's
    // width to fit all the columns.
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
    if (!sizeOfAIconDiv || sizeOfAIconDiv == "") {
      // Default value case
      sizeOfAIconDiv = 26;
    } else {
      sizeOfAIconDiv = sizeOfAIconDiv.replace("px", "");
    }

    var rowCount = Math.round(this.iconList.length / this.columnCount) + 1;
    // ensure that we don't go beyond 100 shown if this is an insane list
    if (rowCount > this.maxRows) {
      rowCount = this.maxRows;
    }
    this.$.container.style.height = rowCount * sizeOfAIconDiv + "px";
    this.$.container.style.width = this.columnCount * sizeOfAIconDiv + "px";
  },

  _addOverflowClass: function() {
    this.$.container.toggleClass("opened", true);
  },

  _removeOverflowClass: function() {
    this.$.container.toggleClass("opened", false);
  },

  _onIconTap: function(e) {
    this.icon = e.target.value;
    this.fire("icon-picker-selected", { icon: this.icon });
    this.$.container.fire("iron-select", this.icon);
    this.close();
  },

  _iconChanged: function() {
    if (this.icon) {
      this.$.iconButton.icon = this.icon;
    } else {
      this.$.iconButton.icon = "swatch:perm-media";
    }
  }
});
export { PaperIconPicker };
