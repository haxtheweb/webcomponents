import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-slider/paper-slider.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/editor-icons.js";
import "@lrnwebcomponents/materializecss-styles/lib/colors.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
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
        pointer-events: all;
      }
      :host ::slotted(*) {
        font-family: "Roboto", sans-serif;
        pointer-events: all;
      }
      :host(:hover),
      :host([selected]) {
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
        width: 100px;
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
    <hax-context-item hidden$="[[inline]]" mini="" light="" icon="close" label="Close" event-name="close-menu" class="close-cap" direction="left"></hax-context-item>
    <hax-context-item-menu hidden$="[[!haxProperties.canPosition]]" selected-value="{{justifyValue}}" id="justify" icon="[[justifyIcon]]" label="Alignment">
      <hax-context-item menu icon="editor:format-align-left" event-name="hax-align-left">Left</hax-context-item>
      <hax-context-item menu icon="editor:format-align-center" event-name="hax-align-center">Center</hax-context-item>
      <hax-context-item menu icon="editor:format-align-right" event-name="hax-align-right">Right</hax-context-item>
    </hax-context-item-menu>
    <paper-slider hidden$="[[!haxProperties.canScale]]" id="slider" pin="" min="25" step="25" max="100" value="{{size}}"></paper-slider>
    <paper-tooltip hidden$="[[inline]]" for="slider" position="top" offset="10">
      Resize
    </paper-tooltip>
    <slot name="primary"></slot>
    <hax-context-item hidden$="[[inline]]" icon="delete" icon-class="red-text text-darken-1" label="Remove" event-name="grid-plate-delete"></hax-context-item>
    <hax-context-item-menu corner="right" hidden$="[[hideMore]]" icon="more-vert" label="More" id="moremenu" event-name="grid-plate-op" reset-on-select="">
      <paper-item value="" hidden></paper-item>
      <slot name="more"></slot>
      <hax-context-item menu icon="icons:content-copy" icon-class="green-text" event-name="grid-plate-duplicate">Duplicate</hax-context-item>
      <hax-context-item hidden$="[[hideTransform]]" menu icon="image:transform" class="convert-button" icon-class="orange-text" event-name="grid-plate-convert">Transform to..</hax-context-item>
    </hax-context-item-menu>
`,

  is: "hax-toolbar",

  listeners: {
    "hax-context-item-selected": "_haxContextOperation"
  },

  behaviors: [simpleColorsBehaviors],

  properties: {
    /**
     * Hide the transform button as its not supported
     */
    hideTransform: {
      type: Boolean,
      value: false
    },
    /**
     * See what's selected
     */
    selected: {
      type: Boolean,
      value: false,
      reflectToAttritue: true
    },
    /**
     * Selected value to match ce direction currently.
     */
    haxProperties: {
      type: Object,
      value: {},
      observer: "_haxPropertiesChanged"
    },
    /**
     * Hide the more menu.
     */
    hideMore: {
      type: Boolean,
      value: false
    },
    /**
     * size of the slider if it exists.
     */
    size: {
      type: Number,
      value: 100,
      notify: true
    },
    /**
     * Justify icon to reflect state.
     */
    justifyIcon: {
      type: String,
      value: "editor:format-align-left"
    },
    /**
     * This is an inline context menu
     */
    inline: {
      type: Boolean,
      value: false,
      reflectToAttritue: true
    },
    /**
     * Selected value to match ce direction currently.
     */
    justifyValue: {
      type: String,
      value: "",
      notify: true
    }
  },

  /**
   * If hax properties changes, let's see what the initial state
   * of the buttons should be.
   */
  _haxPropertiesChanged: function(newValue, oldValue) {
    // value doesn't matter, just look at what's active
    if (typeof window.HaxStore.instance.activeNode !== typeof undefined) {
      if (window.HaxStore.instance.activeNode.style.width != "") {
        this.size = window.HaxStore.instance.activeNode.style.width.replace(
          "%",
          ""
        );
      } else {
        this.size = 100;
      }

      if (window.HaxStore.instance.activeNode.style.float == "right") {
        this.justifyValue = "hax-align-right";
        this.justifyIcon = "editor:format-align-right";
      } else if (
        window.HaxStore.instance.activeNode.style.margin == "0px auto" &&
        window.HaxStore.instance.activeNode.style.display == "block"
      ) {
        this.justifyValue = "hax-align-center";
        this.justifyIcon = "editor:format-align-center";
      } else {
        this.justifyValue = "hax-align-left";
        this.justifyIcon = "editor:format-align-left";
      }
    }
  },

  /**
   * Respond to simple modifications.
   */
  _haxContextOperation: function(e) {
    let detail = e.detail;
    // support a simple insert event to bubble up or everything else
    switch (detail.eventName) {
      case "hax-align-left":
      case "hax-align-center":
      case "hax-align-right":
        this.justifyIcon = detail.target.icon;
        break;
      case "close-menu":
        this.$.moremenu.$.menu.hideMenu();
        this.$.justify.$.menu.hideMenu();
        break;
    }
  }
});
