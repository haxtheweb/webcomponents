import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import "../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js";
import "../node_modules/@polymer/paper-input/paper-textarea.js";
import "../node_modules/@polymer/paper-input/paper-input.js";
import "../node_modules/@polymer/paper-checkbox/paper-checkbox.js";
import "../node_modules/@lrnwebcomponents/simple-colors/lib/simple-colors-picker.js";
import "./hax-context-item-menu.js";
import "./hax-context-item.js";
import "./hax-toolbar.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        height: 32px;
        background-color: white;
      }
      hax-context-item {
        margin: 0;
        height: 32px;
      }
      .human-name {
        font-size: 16px;
        border-top-left-radius: 25%;
        border-top-right-radius: 25%;
        line-height: 16px;
        font-family: sans-serif;
        width: -webkit-fit-content;
        width: -moz-max-content;
        width: fit-content;
        background-color: white;
      }
      .human-name-inner {
        font-size: 16px;
        border-top-left-radius: 25%;
        border-top-right-radius: 25%;
        margin: -32px 0px 0 34px;
        line-height: 16px;
        padding: 8px 16px 8px 8px;
        font-family: sans-serif;
        width: -webkit-fit-content;
        width: -moz-max-content;
        width: fit-content;
        background-color: black;
        color: white;
        opacity: .4;
        transition: .6s all ease;
      }
      :host:hover .human-name-inner {
        opacity: 1;
      }
      :host.hax-context-pin-top hax-toolbar {
        position: fixed;
        top: 64px;
        opacity: .95;
      }
      :host.hax-context-pin-bottom hax-toolbar {
        position: fixed;
        bottom: 0;
        opacity: .95;
      }
    </style>
    <div class="human-name">
      <div class="human-name-inner">[[humanName]]</div>
    </div>
    <hax-toolbar hax-properties="[[haxProperties]]" size="{{ceSize}}">
      <slot></slot>
      <hax-context-item slot="primary" icon="icons:settings" label="Settings" event-name="hax-manager-configure" hidden\$="[[!__hasSettingsForm]]"></hax-context-item>
      <hax-context-item slot="primary" icon="icons:view-quilt" label="[[__parentName]]" event-name="hax-manager-configure-container" hidden\$="[[!__hasParentSettingsForm]]"></hax-context-item>
    </hax-toolbar>
`,
  is: "hax-ce-context",
  properties: {
    ceSize: { type: Number, value: 100, observer: "_ceSizeChanged" },
    haxProperties: {
      type: Object,
      value: {},
      observer: "_haxPropertiesChanged"
    },
    humanName: { type: String }
  },
  setHaxProperties: function(props) {
    this.set("haxProperties", {});
    this.set("haxProperties", props);
  },
  _ceSizeChanged: function(newValue, oldValue) {
    if (
      typeof newValue !== typeof void 0 &&
      typeof oldValue !== typeof void 0
    ) {
      this.fire("hax-context-item-selected", {
        eventName: "hax-size-change",
        value: newValue
      });
    }
  },
  _haxPropertiesChanged: function(newValue, oldValue) {
    if (
      typeof oldValue !== typeof void 0 &&
      typeof newValue.settings !== typeof void 0
    ) {
      let slot = dom(this);
      while (null !== slot.firstChild) {
        slot.removeChild(slot.firstChild);
      }
      let settings = newValue.settings.quick,
        configure = newValue.settings.configure,
        advanced = newValue.settings.advanced;
      if (
        (configure.length || advanced.length) &&
        "HR" !== newValue.element.tagName
      ) {
        this.__hasSettingsForm = !0;
      } else {
        this.__hasSettingsForm = !1;
      }
      this.__hasParentSettingsForm = !1;
      if (
        window.HaxStore.instance.activeContainerNode !==
        window.HaxStore.instance.activeNode
      ) {
        this.__hasParentSettingsForm = !0;
        switch (window.HaxStore.instance.activeContainerNode.tagName) {
          case "P":
          case "UL":
          case "OL":
          case "DIV":
            this.__parentName = "Text block settings";
            break;
          case "GRID-PLATE":
            this.__parentName = "Layout settings";
            break;
          default:
            this.__parentName = window.HaxStore.instance.activeContainerNode.tagName
              .replace("-", " ")
              .toLowerCase();
            break;
        }
      }
      if (typeof newValue.gizmo.title === typeof void 0) {
        this.humanName = window.HaxStore.instance.activeNode.tagName
          .replace("-", " ")
          .toLowerCase();
      } else {
        this.humanName = newValue.gizmo.title;
      }
      var item;
      for (i = 0; i < settings.length; i++) {
        let setting = settings[i];
        item = document.createElement("hax-context-item");
        item.eventName = "hax-edit-property";
        item.label = setting.title;
        item.setAttribute("slot", "primary");
        item.options = setting.options;
        item.icon = setting.icon;
        item.inputMethod = setting.inputMethod;
        item.required = setting.required;
        item.options = setting.options;
        item.validation = setting.validation;
        item.validationType = setting.validationType;
        item.description = setting.description;
        if (typeof setting.property !== typeof void 0) {
          item.propertyToBind = setting.property;
        } else if (typeof setting.attribute !== typeof void 0) {
          item.propertyToBind = setting.attribute;
        } else {
          item.slotToBind = setting.slot;
        }
        slot.appendChild(item);
      }
    }
  }
});
