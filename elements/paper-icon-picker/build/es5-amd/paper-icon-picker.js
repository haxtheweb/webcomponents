define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "./node_modules/@polymer/iron-flex-layout/iron-flex-layout.js",
  "./node_modules/@polymer/paper-icon-button/paper-icon-button.js",
  "./node_modules/@polymer/paper-item/paper-item.js",
  "./node_modules/@polymer/paper-listbox/paper-listbox.js",
  "./node_modules/@polymer/paper-menu-button/paper-menu-button.js",
  "./node_modules/@polymer/iron-list/iron-list.js",
  "./node_modules/@polymer/iron-icon/iron-icon.js",
  "./node_modules/@polymer/iron-meta/iron-meta.js",
  "./node_modules/@polymer/neon-animation/neon-animation.js",
  "./node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js",
  "./node_modules/@polymer/paper-tooltip/paper-tooltip.js",
  "./lib/paper-icon-picker-icon.js"
], function(_polymerLegacy, _polymerDom) {
  "use strict";
  function _templateObject_aa157dc0e11811e8aa9335c6128bc6b3() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        display: inline-block;\n        position: relative;\n      }\n\n      :host(:focus) {\n        outline: none;\n      }\n\n      .icon {\n        box-sizing: border-box;\n        width: var(--paper-icon-picker-icon-size, 26px);\n        height: var(--paper-icon-picker-icon-size, 26px);\n        color: #888888;\n        display: inline-block;\n        padding: 0;\n        margin: 0;\n        cursor: pointer;\n        font-size: 0;\n        position: relative;\n      }\n      .icon iron-icon {\n        width: var(--paper-icon-picker-icon-size, 26px);\n        height: var(--paper-icon-picker-icon-size, 26px);\n      }\n\n      /* If we just scale the paper-item when hovering, this will end up\n       * adding scrollbars to the paper-listbox that are hard to get rid of.\n       * An easy workaround is to use an :after pseudo element instead. */\n      .icon:after {\n        @apply(--layout-fit);\n        content: \'\';\n        -webkit-transition: -webkit-transform 0.2s;\n        transition: transform .2s;\n        z-index: 0;\n      }\n\n      .icon:hover, .icon:focus {\n        -webkit-transform: scale(1.8, 1.8);\n        transform: scale(1.8, 1.8);\n        outline: none;\n        z-index: 1;\n        background-color: #FFFFFF;\n        border-radius: 0;\n        border: 1px solid #888888;\n        color: orange !important;\n      }\n\n      paper-item {\n        --paper-item: {\n          margin: 0;\n          padding: 0;\n          min-height: 0;\n        };\n\n        --paper-item-focused-before: {\n          opacity: 0;\n        };\n      }\n\n      paper-listbox {\n        margin: 8px;\n        font-size: 0;\n        @apply(--layout-vertical);\n        @apply(--layout-wrap);\n      }\n      paper-tooltip {\n        z-index: 1;\n      }\n      .icon-group-1 {\n        color: var(--paper-pink-700);\n      }\n      .icon-group-2 {\n        color: var(--google-green-700);\n      }\n      .icon-group-3 {\n        color: var(--google-blue-700);\n      }\n      .icon-group-4 {\n        color: var(--paper-grey-700);\n      }\n      .icon-group-5 {\n        color: var(--paper-pink-700);\n      }\n      .icon-group-6 {\n        color: var(--google-green-700);\n      }\n      .icon-group-7 {\n        color: var(--google-blue-700);\n      }\n      .icon-group-8 {\n        color: var(--paper-grey-700);\n      }\n      .icon-group-9 {\n        color: var(--paper-pink-700);\n      }\n      .icon-group-10 {\n        color: var(--google-green-700);\n      }\n      .icon-group-11 {\n        color: var(--google-blue-700);\n      }\n      .icon-group-12 {\n        color: var(--paper-grey-700);\n      }\n      .icon-group-13 {\n        color: var(--paper-pink-700);\n      }\n      .icon-group-14 {\n        color: var(--google-green-700);\n      }\n      .icon-group-15 {\n        color: var(--google-blue-700);\n      }\n      .icon-group-16 {\n        color: var(--paper-grey-700);\n      }\n      .icon-group-17 {\n        color: var(--paper-pink-700);\n      }\n      .icon-group-18 {\n        color: var(--google-green-700);\n      }\n      .icon-group-19 {\n        color: var(--google-blue-700);\n      }\n    </style>\n\n    <paper-menu-button id="iconpicker" vertical-align="[[verticalAlign]]" horizontal-align="[[horizontalAlign]]" opened="{{opened}}">\n      <paper-icon-button id="iconButton" icon="swatch:perm-media" class="dropdown-trigger" alt="icon picker" noink$="[[noink]]" slot="dropdown-trigger">\n      </paper-icon-button>\n      <iron-list grid="" items="[[renderIconList]]" id="container" slot="dropdown-content">\n      <template>\n        <paper-item class$="icon-group-[[item.index]] icon" value="[[item.icon]]">\n          <iron-icon icon="[[item.icon]]"></iron-icon>\n        </paper-item>\n      </template>\n      </iron-list>\n    </paper-menu-button>\n    <paper-tooltip for="iconpicker" position="bottom" offset="14">\n      [[iconText]]\n    </paper-tooltip>\n    <iron-a11y-keys target="[[iconpicker]]" keys="escape" on-keys-pressed="close" stop-keyboard-event-propagation=""></iron-a11y-keys>\n'
      ],
      [
        '\n    <style>\n      :host {\n        display: inline-block;\n        position: relative;\n      }\n\n      :host(:focus) {\n        outline: none;\n      }\n\n      .icon {\n        box-sizing: border-box;\n        width: var(--paper-icon-picker-icon-size, 26px);\n        height: var(--paper-icon-picker-icon-size, 26px);\n        color: #888888;\n        display: inline-block;\n        padding: 0;\n        margin: 0;\n        cursor: pointer;\n        font-size: 0;\n        position: relative;\n      }\n      .icon iron-icon {\n        width: var(--paper-icon-picker-icon-size, 26px);\n        height: var(--paper-icon-picker-icon-size, 26px);\n      }\n\n      /* If we just scale the paper-item when hovering, this will end up\n       * adding scrollbars to the paper-listbox that are hard to get rid of.\n       * An easy workaround is to use an :after pseudo element instead. */\n      .icon:after {\n        @apply(--layout-fit);\n        content: \'\';\n        -webkit-transition: -webkit-transform 0.2s;\n        transition: transform .2s;\n        z-index: 0;\n      }\n\n      .icon:hover, .icon:focus {\n        -webkit-transform: scale(1.8, 1.8);\n        transform: scale(1.8, 1.8);\n        outline: none;\n        z-index: 1;\n        background-color: #FFFFFF;\n        border-radius: 0;\n        border: 1px solid #888888;\n        color: orange !important;\n      }\n\n      paper-item {\n        --paper-item: {\n          margin: 0;\n          padding: 0;\n          min-height: 0;\n        };\n\n        --paper-item-focused-before: {\n          opacity: 0;\n        };\n      }\n\n      paper-listbox {\n        margin: 8px;\n        font-size: 0;\n        @apply(--layout-vertical);\n        @apply(--layout-wrap);\n      }\n      paper-tooltip {\n        z-index: 1;\n      }\n      .icon-group-1 {\n        color: var(--paper-pink-700);\n      }\n      .icon-group-2 {\n        color: var(--google-green-700);\n      }\n      .icon-group-3 {\n        color: var(--google-blue-700);\n      }\n      .icon-group-4 {\n        color: var(--paper-grey-700);\n      }\n      .icon-group-5 {\n        color: var(--paper-pink-700);\n      }\n      .icon-group-6 {\n        color: var(--google-green-700);\n      }\n      .icon-group-7 {\n        color: var(--google-blue-700);\n      }\n      .icon-group-8 {\n        color: var(--paper-grey-700);\n      }\n      .icon-group-9 {\n        color: var(--paper-pink-700);\n      }\n      .icon-group-10 {\n        color: var(--google-green-700);\n      }\n      .icon-group-11 {\n        color: var(--google-blue-700);\n      }\n      .icon-group-12 {\n        color: var(--paper-grey-700);\n      }\n      .icon-group-13 {\n        color: var(--paper-pink-700);\n      }\n      .icon-group-14 {\n        color: var(--google-green-700);\n      }\n      .icon-group-15 {\n        color: var(--google-blue-700);\n      }\n      .icon-group-16 {\n        color: var(--paper-grey-700);\n      }\n      .icon-group-17 {\n        color: var(--paper-pink-700);\n      }\n      .icon-group-18 {\n        color: var(--google-green-700);\n      }\n      .icon-group-19 {\n        color: var(--google-blue-700);\n      }\n    </style>\n\n    <paper-menu-button id="iconpicker" vertical-align="[[verticalAlign]]" horizontal-align="[[horizontalAlign]]" opened="{{opened}}">\n      <paper-icon-button id="iconButton" icon="swatch:perm-media" class="dropdown-trigger" alt="icon picker" noink\\$="[[noink]]" slot="dropdown-trigger">\n      </paper-icon-button>\n      <iron-list grid="" items="[[renderIconList]]" id="container" slot="dropdown-content">\n      <template>\n        <paper-item class\\$="icon-group-[[item.index]] icon" value="[[item.icon]]">\n          <iron-icon icon="[[item.icon]]"></iron-icon>\n        </paper-item>\n      </template>\n      </iron-list>\n    </paper-menu-button>\n    <paper-tooltip for="iconpicker" position="bottom" offset="14">\n      [[iconText]]\n    </paper-tooltip>\n    <iron-a11y-keys target="[[iconpicker]]" keys="escape" on-keys-pressed="close" stop-keyboard-event-propagation=""></iron-a11y-keys>\n'
      ]
    );
    _templateObject_aa157dc0e11811e8aa9335c6128bc6b3 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_aa157dc0e11811e8aa9335c6128bc6b3()
    ),
    is: "paper-icon-picker",
    listeners: { "iconpicker.tap": "_onOpen", "container.tap": "_onIconTap" },
    properties: {
      opened: { type: Boolean },
      icon: { type: String, notify: !0, observer: "_iconChanged" },
      iconText: { type: String, computed: "_computedIconText(icon)" },
      iconList: {
        type: Array,
        notify: !0,
        value: function value() {
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
    _onOpen: function _onOpen() {
      var _this = this;
      setTimeout(function() {
        _this.shadowRoot.querySelector("paper-item").focus();
      }, 500);
    },
    close: function close() {
      this.opened = !1;
    },
    _computeRenderIconList: function _computeRenderIconList(list) {
      var renderList = [],
        item = {};
      for (var i in list) {
        item = {};
        if (babelHelpers.typeof(list[i].icon) === "undefined") {
          item.icon = list[i];
        } else {
          item.icon = list[i].icon;
        }
        if (babelHelpers.typeof(list[i].index) === "undefined") {
          item.index = 0;
        } else {
          item.index = list[i].index;
        }
        renderList.push(item);
      }
      return renderList;
    },
    _computedIconText: function _computedIconText(icon) {
      if ("" == icon) {
        return "Select an icon";
      }
      return icon;
    },
    created: function created() {
      this._renderedIcons = !1;
    },
    attached: function attached() {
      var iconSets = document.createElement("iron-meta", { type: "iconset" });
      if (0 === this.iconList.length && iconSets.list && iconSets.list.length) {
        var iconList = [],
          index = 0;
        iconSets.list.forEach(function(item) {
          index++;
          item.getIconNames().forEach(function(icon) {
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
    _addOverflowClass: function _addOverflowClass() {
      this.$.container.toggleClass("opened", !0);
    },
    _removeOverflowClass: function _removeOverflowClass() {
      this.$.container.toggleClass("opened", !1);
    },
    _onIconTap: function _onIconTap(e) {
      var normalizedEvent = (0, _polymerDom.dom)(e),
        local = normalizedEvent.localTarget;
      this.icon = local.value;
      this.fire("icon-picker-selected", { icon: this.icon });
      this.$.container.fire("iron-select", this.icon);
    },
    _iconChanged: function _iconChanged() {
      if (this.icon) {
        this.$.iconButton.icon = this.icon;
      } else {
        this.$.iconButton.icon = "swatch:perm-media";
      }
    }
  });
});
