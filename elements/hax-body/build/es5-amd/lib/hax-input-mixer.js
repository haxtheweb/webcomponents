define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js",
  "../node_modules/@polymer/paper-input/paper-textarea.js",
  "../node_modules/@polymer/paper-input/paper-input.js",
  "../node_modules/@polymer/paper-checkbox/paper-checkbox.js",
  "../node_modules/@lrnwebcomponents/simple-colors/lib/simple-colors-picker.js",
  "../node_modules/@polymer/paper-slider/paper-slider.js",
  "../node_modules/@polymer/paper-tooltip/paper-tooltip.js",
  "./hax-context-item-menu.js",
  "./hax-context-item.js"
], function(_polymerLegacy, _polymerDom) {
  "use strict";
  function _templateObject_ebf27bd0dbb911e89b94f594419eb4d2() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        display: block;\n        color: #FFFFFF;\n      }\n      app-toolbar {\n        background-color: #3e3e3e;\n        color: white;\n        padding: 0 0 0 16px;\n      }\n      hax-context-item {\n        margin: 0;\n        width: 40px;\n        height: 40px;\n      }\n      #elementoptions {\n        height: inherit;\n      }\n      #input {\n        color: #FFFFFF;\n      }\n      paper-checkbox {\n        --paper-checkbox-label-color: #FFFFFF;\n      }\n      .input-mixer-label {\n        padding-left: 4px;\n      }\n      paper-textarea,\n      paper-input {\n        --paper-input-container-color: #BBBBFF;\n        --paper-input-container-focus-color: #FFFFFF;\n        --paper-input-container-invalid-color: #FFAAAA;\n        --paper-input-container-input-color: #FFFFFF;\n        --paper-input-container-shared-input-style: {\n          color: #FFFFFF;\n          background: transparent;\n          margin: 0;\n          padding: 0;\n          min-width: 20em;\n          line-height: 1em;\n          font-size: 1em;\n          margin-top: -8px;\n          margin-bottom: 8px;\n          outline: none;\n          border: none;\n        }\n      }\n      .input-method {\n        color: #FFFFFF;\n      }\n    </style>\n    <app-toolbar>\n      <template is="dom-if" if="[[__inputselect]]">\n        <span class="input-mixer-label">[[label]]</span>\n        <hax-context-item-menu selected="{{value}}" icon="[[icon]]" id="input">\n          <slot></slot>\n        </hax-context-item-menu>\n      </template>\n      <span class="input-method">\n      <template is="dom-if" if="[[__inputtextarea]]">\n        <paper-textarea id="input" label="[[label]]" value="{{value}}" auto-validate="" pattern="[[validation]]" required="[[required]]"></paper-textarea>\n      </template>\n      <template is="dom-if" if="[[__inputtextfield]]">\n        <paper-input id="input" type="[[validationType]]" label="[[label]]" value="{{value}}" auto-validate="" pattern="[[validation]]" required="[[required]]"></paper-input>\n      </template>\n      <template is="dom-if" if="[[__inputboolean]]">\n        <paper-checkbox id="input" checked="{{value}}">[[label]]</paper-checkbox>\n      </template>\n      <template is="dom-if" if="[[__inputflipboolean]]">\n        <paper-checkbox id="input" checked="{{value}}">[[label]]</paper-checkbox>\n      </template>\n      <template is="dom-if" if="[[__inputcolorpicker]]">\n        <span>[[label]]</span>\n        <simple-colors-picker id="input" value="{{value}}"></simple-colors-picker>\n      </template>\n      </span>\n      <paper-tooltip for="input" position="top" offset="14">\n        [[description]]\n      </paper-tooltip>\n      <hax-context-item id="updatebutton" icon="subdirectory-arrow-right" label$="Update [[label]]" event-name="hax-update-tap"></hax-context-item>\n    </app-toolbar>\n'
      ],
      [
        '\n    <style>\n      :host {\n        display: block;\n        color: #FFFFFF;\n      }\n      app-toolbar {\n        background-color: #3e3e3e;\n        color: white;\n        padding: 0 0 0 16px;\n      }\n      hax-context-item {\n        margin: 0;\n        width: 40px;\n        height: 40px;\n      }\n      #elementoptions {\n        height: inherit;\n      }\n      #input {\n        color: #FFFFFF;\n      }\n      paper-checkbox {\n        --paper-checkbox-label-color: #FFFFFF;\n      }\n      .input-mixer-label {\n        padding-left: 4px;\n      }\n      paper-textarea,\n      paper-input {\n        --paper-input-container-color: #BBBBFF;\n        --paper-input-container-focus-color: #FFFFFF;\n        --paper-input-container-invalid-color: #FFAAAA;\n        --paper-input-container-input-color: #FFFFFF;\n        --paper-input-container-shared-input-style: {\n          color: #FFFFFF;\n          background: transparent;\n          margin: 0;\n          padding: 0;\n          min-width: 20em;\n          line-height: 1em;\n          font-size: 1em;\n          margin-top: -8px;\n          margin-bottom: 8px;\n          outline: none;\n          border: none;\n        }\n      }\n      .input-method {\n        color: #FFFFFF;\n      }\n    </style>\n    <app-toolbar>\n      <template is="dom-if" if="[[__inputselect]]">\n        <span class="input-mixer-label">[[label]]</span>\n        <hax-context-item-menu selected="{{value}}" icon="[[icon]]" id="input">\n          <slot></slot>\n        </hax-context-item-menu>\n      </template>\n      <span class="input-method">\n      <template is="dom-if" if="[[__inputtextarea]]">\n        <paper-textarea id="input" label="[[label]]" value="{{value}}" auto-validate="" pattern="[[validation]]" required="[[required]]"></paper-textarea>\n      </template>\n      <template is="dom-if" if="[[__inputtextfield]]">\n        <paper-input id="input" type="[[validationType]]" label="[[label]]" value="{{value}}" auto-validate="" pattern="[[validation]]" required="[[required]]"></paper-input>\n      </template>\n      <template is="dom-if" if="[[__inputboolean]]">\n        <paper-checkbox id="input" checked="{{value}}">[[label]]</paper-checkbox>\n      </template>\n      <template is="dom-if" if="[[__inputflipboolean]]">\n        <paper-checkbox id="input" checked="{{value}}">[[label]]</paper-checkbox>\n      </template>\n      <template is="dom-if" if="[[__inputcolorpicker]]">\n        <span>[[label]]</span>\n        <simple-colors-picker id="input" value="{{value}}"></simple-colors-picker>\n      </template>\n      </span>\n      <paper-tooltip for="input" position="top" offset="14">\n        [[description]]\n      </paper-tooltip>\n      <hax-context-item id="updatebutton" icon="subdirectory-arrow-right" label\\$="Update [[label]]" event-name="hax-update-tap"></hax-context-item>\n    </app-toolbar>\n'
      ]
    );
    _templateObject_ebf27bd0dbb911e89b94f594419eb4d2 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_ebf27bd0dbb911e89b94f594419eb4d2()
    ),
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
    ready: function ready() {
      this._resetInputMethods();
    },
    _inputMethodChanged: function _inputMethodChanged(newValue, oldValue) {
      var _this = this;
      if (null != newValue && babelHelpers.typeof(oldValue) !== "undefined") {
        var method = newValue,
          methods = this.validInputMethods();
        if (methods.includes(method)) {
          this._resetInputMethods();
          this["__input" + method] = !0;
          var slot = (0, _polymerDom.dom)(this);
          while (null !== slot.firstChild) {
            slot.removeChild(slot.firstChild);
          }
          if (
            "select" === method &&
            babelHelpers.typeof(this.options) !== "undefined"
          ) {
            for (val in this.options) {
              item = document.createElement("paper-item");
              item.attributes.value = val;
              item.innerHTML = this.options[val];
              slot.appendChild(item);
            }
          }
          setTimeout(function() {
            if (
              "function" ===
              typeof _this.shadowRoot.querySelector("#input").hideMenu
            ) {
              _this.shadowRoot.querySelector("#input").hideMenu();
            }
            _this.shadowRoot.querySelector("#input").focus();
          }, 200);
        }
      }
    },
    validInputMethods: function validInputMethods() {
      return [
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
    },
    _resetInputMethods: function _resetInputMethods() {
      for (
        var methods = this.validInputMethods(), i = 0;
        i < methods.length;
        i++
      ) {
        this["__input" + methods[i]] = !1;
      }
    },
    _haxContextOperation: function _haxContextOperation(e) {
      var detail = e.detail;
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
          var mixer = {
            value: this.value,
            propertyToBind: this.propertyToBind,
            slotToBind: this.slotToBind
          };
          this.fire("hax-input-mixer-update", { inputMixer: mixer });
          break;
      }
    }
  });
});
