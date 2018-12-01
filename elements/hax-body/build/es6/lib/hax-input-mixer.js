import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import "../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js";
import "../node_modules/@polymer/paper-input/paper-textarea.js";
import "../node_modules/@polymer/paper-input/paper-input.js";
import "../node_modules/@polymer/paper-checkbox/paper-checkbox.js";
import "../node_modules/@polymer/paper-slider/paper-slider.js";
import "../node_modules/@polymer/paper-tooltip/paper-tooltip.js";
import "./simple-colors-picker.js";
import "./hax-context-item-menu.js";
import "./hax-context-item.js";
Polymer({
  _template: html`
    <custom-style>
      <style is="custom-style">
        :host {
          display: block;
          color: #ffffff;
        }
        app-toolbar {
          background-color: #3e3e3e;
          color: white;
          padding: 0 0 0 16px;
        }
        hax-context-item {
          margin: 0;
          width: 40px;
          height: 40px;
        }
        #elementoptions {
          height: inherit;
        }
        #input {
          color: #ffffff;
        }
        paper-checkbox {
          --paper-checkbox-label-color: #ffffff;
        }
        .input-mixer-label {
          padding-left: 4px;
        }
        paper-textarea,
        paper-input {
          --paper-input-container-color: #bbbbff;
          --paper-input-container-focus-color: #ffffff;
          --paper-input-container-invalid-color: #ffaaaa;
          --paper-input-container-input-color: #ffffff;
          --paper-input-container-shared-input-style: {
            color: #ffffff;
            background: transparent;
            margin: 0;
            padding: 0;
            min-width: 320px;
            line-height: 16px;
            font-size: 16px;
            margin-top: -8px;
            margin-bottom: 8px;
            outline: none;
            border: none;
          }
        }
        .input-method {
          color: #ffffff;
        }
      </style>
    </custom-style>
    <app-toolbar>
      <template is="dom-if" if="[[__inputselect]]">
        <span class="input-mixer-label">[[label]]</span>
        <hax-context-item-menu selected="{{value}}" icon="[[icon]]" id="input">
          <slot></slot>
        </hax-context-item-menu>
      </template>
      <span class="input-method">
        <template is="dom-if" if="[[__inputtextarea]]">
          <paper-textarea
            id="input"
            label="[[label]]"
            value="{{value}}"
            auto-validate=""
            pattern="[[validation]]"
            required="[[required]]"
          ></paper-textarea>
        </template>
        <template is="dom-if" if="[[__inputtextfield]]">
          <paper-input
            id="input"
            type="[[validationType]]"
            label="[[label]]"
            value="{{value}}"
            auto-validate=""
            pattern="[[validation]]"
            required="[[required]]"
          ></paper-input>
        </template>
        <template is="dom-if" if="[[__inputboolean]]">
          <paper-checkbox id="input" checked="{{value}}"
            >[[label]]</paper-checkbox
          >
        </template>
        <template is="dom-if" if="[[__inputflipboolean]]">
          <paper-checkbox id="input" checked="{{value}}"
            >[[label]]</paper-checkbox
          >
        </template>
        <template is="dom-if" if="[[__inputcolorpicker]]">
          <span>[[label]]</span>
          <simple-colors-picker
            id="input"
            value="{{value}}"
          ></simple-colors-picker>
        </template>
      </span>
      <paper-tooltip for="input" position="top" offset="14">
        [[description]]
      </paper-tooltip>
      <hax-context-item
        id="updatebutton"
        icon="subdirectory-arrow-right"
        label\$="Update [[label]]"
        event-name="hax-update-tap"
      ></hax-context-item>
    </app-toolbar>
  `,
  is: "hax-input-mixer",
  listeners: { "hax-context-item-selected": "_haxContextOperation" },
  properties: {
    value: { type: String, value: null },
    label: { type: String, reflectToAttribute: !0 },
    validation: { type: String, reflectToAttribute: !0 },
    validationType: { type: String, reflectToAttribute: !0 },
    required: { type: Boolean, reflectToAttribute: !0 },
    options: { type: Object, value: {}, reflectToAttribute: !0 },
    icon: { type: String, value: "android", reflectToAttribute: !0 },
    description: { type: String, reflectToAttribute: !0 },
    inputMethod: {
      type: String,
      value: null,
      reflectToAttribute: !0,
      observer: "_inputMethodChanged"
    },
    propertyToBind: { type: String, reflectToAttribute: !0 },
    slotToBind: { type: String, reflectToAttribute: !0 }
  },
  ready: function() {
    this._resetInputMethods();
  },
  _inputMethodChanged: function(newValue, oldValue) {
    if (null != newValue && typeof oldValue !== typeof void 0) {
      let method = newValue,
        methods = this.validInputMethods();
      if (methods.includes(method)) {
        this._resetInputMethods();
        this["__input" + method] = !0;
        let slot = dom(this);
        while (null !== slot.firstChild) {
          slot.removeChild(slot.firstChild);
        }
        if ("select" === method && typeof this.options !== typeof void 0) {
          for (val in this.options) {
            item = document.createElement("paper-item");
            item.attributes.value = val;
            item.innerHTML = this.options[val];
            slot.appendChild(item);
          }
        }
        setTimeout(() => {
          if (
            "function" ===
            typeof this.shadowRoot.querySelector("#input").hideMenu
          ) {
            this.shadowRoot.querySelector("#input").hideMenu();
          }
          this.shadowRoot.querySelector("#input").focus();
        }, 200);
      }
    }
  },
  validInputMethods: function() {
    var methods = [
      "flipboolean",
      "boolean",
      "select",
      "confirm",
      "textfield",
      "textarea",
      "datepicker",
      "colorpicker",
      "number"
    ];
    return methods;
  },
  _resetInputMethods: function() {
    let methods = this.validInputMethods();
    for (var i = 0; i < methods.length; i++) {
      this["__input" + methods[i]] = !1;
    }
  },
  _haxContextOperation: function(e) {
    let detail = e.detail;
    switch (detail.eventName) {
      case "hax-update-tap":
        if ("boolean" == this.inputMethod) {
          this.value = this.value;
        } else if ("flipboolean" == this.inputMethod) {
          this.value = !this.value;
        } else if ("select" == this.inputMethod) {
          var count = 0;
          for (val in this.options) {
            if (count == this.value) {
              this.value = val;
              continue;
            }
            count++;
          }
        }
        let mixer = {
          value: this.value,
          propertyToBind: this.propertyToBind,
          slotToBind: this.slotToBind
        };
        this.fire("hax-input-mixer-update", { inputMixer: mixer });
        break;
    }
  }
});
