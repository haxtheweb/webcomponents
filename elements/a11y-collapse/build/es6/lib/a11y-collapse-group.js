import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "../node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "../a11y-collapse.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        @apply --a11y-collapse-group;
      }
      :host #heading {
        font-weight: bold;
        @apply --a11y-collapse-group-heading;
      }
      :host ::slotted(a11y-collapse){
        margin: 0;
        border-radius: 0em;
      }
      :host ::slotted(a11y-collapse):not(:first-of-type) {
        border-top: none;
      }
    </style>
    <slot id="heading"></slot>
    <slot></slot>
`,
  is: "a11y-collapse-group",
  behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],
  properties: {
    accordion: { type: Boolean, value: !1, reflectToAttribute: !0 },
    disabled: { type: Boolean, value: !1, reflectToAttribute: !0 },
    globalOptions: { type: Object, value: {} },
    radio: { type: Boolean, value: !1 },
    __items: { type: Array, value: [] }
  },
  ready: function() {
    this.addEventListener("a11y-collapse-click", function(e) {
      this.radioToggle(e.detail);
    });
    this.addEventListener("a11y-collapse-attached", function(e) {
      this._attachItem(e.detail);
    });
    this.addEventListener("a11y-collapse-detached", function(e) {
      this._detachItem(e.detail);
    });
  },
  _attachItem: function(item) {
    for (let key in this.globalOptions) {
      if (this.globalOptions.hasOwnProperty(key)) {
        item._overrideProp(key, this.globalOptions[key]);
      }
    }
    this.push("__items", item);
  },
  _detachItem: function() {
    for (let i = 0; i < this.__items.length; i++) {
      if (this.__items[i] === e.detail) this.splice("_items", i, 1);
    }
  },
  radioToggle: function(item) {
    if (this.radio && item.expanded) {
      for (let i = 0; i < this.__items.length; i++) {
        if (this.__items[i] !== item) this.__items[i].toggle(!1);
      }
    }
  },
  detached: function() {
    this.removeEventListener("a11y-collapse-click", function(e) {
      this.radioToggle(e.detail);
    });
    this.removeEventListener("a11y-collapse-attached", function(e) {
      this.push("__items", e.detail);
    });
    this.removeEventListener("a11y-collapse-detached", function(e) {
      this._detachItem(e.detail);
    });
    this.set("__items", []);
  },
  attached: function() {
    this.setHaxProperties({
      canScale: !0,
      canPosition: !0,
      canEditSource: !1,
      gizmo: {
        title: "Sample gizmo",
        description: "The user will be able to see this for selection in a UI.",
        icon: "av:play-circle-filled",
        color: "grey",
        groups: ["Video", "Media"],
        handles: [{ type: "video", url: "source" }],
        meta: { author: "Your organization on github" }
      },
      settings: {
        quick: [
          {
            property: "title",
            title: "Title",
            description: "The title of the element",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        configure: [
          {
            property: "title",
            title: "Title",
            description: "The title of the element",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        advanced: []
      }
    });
  }
});
