import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-slider/paper-slider.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/iron-icons/iron-icons.js";
import "@lrnwebcomponents/materializecss-styles/lib/colors.js";
import "@polymer/iron-icons/editor-icons.js";
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
        opacity: .9;
        visibility: visible;
        transition: .6s all ease;
        box-sizing: border-box;
        height: 40px;
        pointer-events: none;
      }
      :host ::slotted(*) {
        font-family: "Roboto", sans-serif;
        pointer-events: all;
      }
      :host:hover {
        opacity: 1;
      }
      .hax-arrowclip {
        position: absolute;
        bottom: -10px;
        left: 48px;
        clip: rect(10px 20px 20px 0);
      }
      .hax-arrowclip .hax-arrow {
        display: block;
        width: 20px;
        height: 20px;
        background-color: #2e2e2e;
        -webkit-transform: rotate(45deg) scale(.5);
        transform: rotate(45deg) scale(.5);
      }
      :host[inline] .hax-arrowclip {
        left: calc(50% - 10px);
      }
      .close-cap {
        margin: 10px;
        padding: 0;
      }
      paper-item:hover {
        background-color: #d3d3d3;
        cursor: pointer;
      }
      paper-slider {
        background-color: #3e3e3e;
        color: #000000;
        height: 40px;
        min-width: 100px;
        --paper-slider-font-color: #000000;
        --paper-slider-active-color: var(--simple-colors-light-green-background1);
        --paper-slider-knob-color: var(--simple-colors-light-green-background1);
        --paper-slider-pin-color: var(--simple-colors-light-green-background1);
      }
      .duplicate-button {
        border-bottom: 1px solid #d3d3d3;
      }
    </style>
    <hax-context-item hidden\$="[[inline]]" mini="" icon="close" label="Close menu" event-name="close-menu" class="close-cap" direction="left"></hax-context-item>
    <hax-context-item hidden\$="[[!inline]]" mini="" icon="close" label="Close" event-name="close-inline-context" class="close-cap" direction="left"></hax-context-item>
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
    <hax-context-item hidden\$="[[inline]]" icon="delete" icon-class="red-text text-darken-1" label="Delete" event-name="grid-plate-delete"></hax-context-item>
    <hax-context-item-menu hidden\$="[[hideMore]]" icon="more-vert" label="More" id="moremenu" event-name="grid-plate-op" reset-on-select="">
      <paper-item value="" hidden=""></paper-item>
      <paper-item value="grid-plate-convert" hidden\$="[[inline]]"><iron-icon icon="image:transform" class="orange-text"></iron-icon>Convert gizmo</paper-item>
      <paper-item value="grid-plate-duplicate" class="duplicate-button" hidden\$="[[inline]]"><iron-icon icon="icons:content-copy" class="green-text"></iron-icon>Duplicate</paper-item>
      <slot name="more"></slot>
    </hax-context-item-menu>
    <div class="hax-arrowclip"><span class="hax-arrow"></span></div>
`,

  is: "hax-toolbar",

  listeners: {
    "hax-context-item-selected": "_haxContextOperation"
  },

  properties: {
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
    if (typeof Polymer.HaxStore.instance.activeNode !== typeof undefined) {
      if (Polymer.HaxStore.instance.activeNode.style.width != "") {
        this.size = Polymer.HaxStore.instance.activeNode.style.width.replace(
          "%",
          ""
        );
      } else {
        this.size = 100;
      }

      if (Polymer.HaxStore.instance.activeNode.style.float == "right") {
        this.justifyValue = "hax-align-right";
        this.justifyIcon = "editor:format-align-right";
      } else if (
        Polymer.HaxStore.instance.activeNode.style.margin == "0px auto" &&
        Polymer.HaxStore.instance.activeNode.style.display == "block"
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
