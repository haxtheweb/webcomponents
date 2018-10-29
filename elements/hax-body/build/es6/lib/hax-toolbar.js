import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/paper-slider/paper-slider.js";
import "../node_modules/@polymer/paper-tooltip/paper-tooltip.js";
import "../node_modules/@polymer/paper-item/paper-item.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
import "../node_modules/@polymer/iron-icons/editor-icons.js";
import "../node_modules/@lrnwebcomponents/materializecss-styles/lib/colors.js";
import "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";
import "./hax-toolbar-item.js";
import "./hax-toolbar-menu.js";
import "./hax-context-item.js";
import "./hax-context-item-menu.js";
Polymer({
  _template: html`
    <style is="custom-style" include="materializecss-styles-colors">
      :host {
        display: flex;
        font-family: "Roboto", sans-serif;
        justify-content: flex-start;
        opacity: .4;
        visibility: visible;
        transition: .6s all ease;
        box-sizing: border-box;
        height: 32px;
        pointer-events: none;
      }
      :host ::slotted(*) {
        font-family: "Roboto", sans-serif;
        pointer-events: all;
      }
      :host:hover,
      :host[selected] {
        opacity: 1;
      }
      .close-cap {
        margin: 8px;
        padding: 0;
      }
      paper-item {
        height: 32px;
        min-height: 32px;
        padding: 0 8px;
      }
      paper-item:hover {
        background-color: #d3d3d3;
        cursor: pointer;
      }
      paper-slider {
        background-color: #3e3e3e;
        color: #000000;
        height: 32px;
        min-width: 100px;
        --paper-slider-font-color: #000000;
        --paper-slider-active-color: var(--simple-colors-light-green-background1);
        --paper-slider-knob-color: var(--simple-colors-light-green-background1);
        --paper-slider-pin-color: var(--simple-colors-light-green-background1);
      }
      .convert-button {
        border-top: 1px solid #d3d3d3;
      }
    </style>
    <hax-context-item hidden\$="[[inline]]" mini="" light="" icon="close" label="Close" event-name="close-menu" class="close-cap" direction="left"></hax-context-item>
    <hax-context-item-menu hidden\$="[[!haxProperties.canPosition]]" selected-value="{{justifyValue}}" id="justify" icon="[[justifyIcon]]" label="Alignment">
      <paper-item value="hax-align-left">
        <iron-icon icon="editor:format-align-left"></iron-icon>
      </paper-item>
      <paper-item value="hax-align-center">
        <iron-icon icon="editor:format-align-center"></iron-icon>
      </paper-item>
      <paper-item value="hax-align-right">
        <iron-icon icon="editor:format-align-right"></iron-icon>
      </paper-item>
    </hax-context-item-menu>
    <paper-slider hidden\$="[[!haxProperties.canScale]]" id="slider" pin="" min="25" step="25" max="100" value="{{size}}"></paper-slider>
    <paper-tooltip hidden\$="[[inline]]" for="slider" position="top" offset="10">
      Resize
    </paper-tooltip>
    <slot name="primary"></slot>
    <hax-context-item hidden\$="[[inline]]" icon="delete" icon-class="red-text text-darken-1" label="Remove" event-name="grid-plate-delete"></hax-context-item>
    <hax-context-item-menu corner="right" hidden\$="[[hideMore]]" icon="more-vert" label="More" id="moremenu" event-name="grid-plate-op" reset-on-select="">
      <paper-item value="" hidden=""></paper-item>
      <slot name="more"></slot>
      <hax-context-item menu="" slot="more" icon="icons:content-copy" icon-class="green-text" event-name="grid-plate-duplicate">Duplicate</hax-context-item>
      <hax-context-item hidden\$="[[hideTransform]]" menu="" slot="more" icon="image:transform" class="convert-button" icon-class="orange-text" event-name="grid-plate-convert">Transform to..</hax-context-item>
    </hax-context-item-menu>
`,
  is: "hax-toolbar",
  listeners: { "hax-context-item-selected": "_haxContextOperation" },
  behaviors: [simpleColorsBehaviors],
  properties: {
    hideTransform: { type: Boolean, value: !1 },
    selected: { type: Boolean, value: !1, reflectToAttritue: !0 },
    haxProperties: {
      type: Object,
      value: {},
      observer: "_haxPropertiesChanged"
    },
    hideMore: { type: Boolean, value: !1 },
    size: { type: Number, value: 100, notify: !0 },
    justifyIcon: { type: String, value: "editor:format-align-left" },
    inline: { type: Boolean, value: !1, reflectToAttritue: !0 },
    justifyValue: { type: String, value: "", notify: !0 }
  },
  _haxPropertiesChanged: function() {
    if (typeof window.HaxStore.instance.activeNode !== typeof void 0) {
      if ("" != window.HaxStore.instance.activeNode.style.width) {
        this.size = window.HaxStore.instance.activeNode.style.width.replace(
          "%",
          ""
        );
      } else {
        this.size = 100;
      }
      if ("right" == window.HaxStore.instance.activeNode.style.float) {
        this.justifyValue = "hax-align-right";
        this.justifyIcon = "editor:format-align-right";
      } else if (
        "0px auto" == window.HaxStore.instance.activeNode.style.margin &&
        "block" == window.HaxStore.instance.activeNode.style.display
      ) {
        this.justifyValue = "hax-align-center";
        this.justifyIcon = "editor:format-align-center";
      } else {
        this.justifyValue = "hax-align-left";
        this.justifyIcon = "editor:format-align-left";
      }
    }
  },
  _haxContextOperation: function(e) {
    let detail = e.detail;
    switch (detail.eventName) {
      case "hax-align-left":
        this.justifyIcon = detail.target.children[0].attributes[0].value;
        break;
      case "hax-align-center":
        this.justifyIcon = detail.target.children[0].attributes[0].value;
        break;
      case "hax-align-right":
        this.justifyIcon = detail.target.children[0].attributes[0].value;
        break;
      case "close-menu":
        this.$.moremenu.$.menu.hideMenu();
        this.$.justify.$.menu.hideMenu();
        break;
    }
  }
});
