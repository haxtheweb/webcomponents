define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js",
  "../node_modules/@polymer/paper-input/paper-textarea.js",
  "../node_modules/@polymer/paper-input/paper-input.js",
  "../node_modules/@polymer/paper-checkbox/paper-checkbox.js",
  "../node_modules/@lrnwebcomponents/simple-colors/lib/simple-colors-picker.js",
  "./hax-context-item-menu.js",
  "./hax-context-item.js",
  "./hax-toolbar.js"
], function(
  _polymerLegacy,
  _polymerDom,
  _appToolbar,
  _paperTextarea,
  _paperInput,
  _paperCheckbox,
  _simpleColorsPicker,
  _haxContextItemMenu,
  _haxContextItem,
  _haxToolbar
) {
  "use strict";
  function _templateObject_f7ad3910f32e11e8a4700dcc21fbc61a() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n        height: 32px;\n        background-color: white;\n      }\n      hax-context-item {\n        margin: 0;\n        height: 32px;\n      }\n      .human-name {\n        font-size: 16px;\n        border-top-left-radius: 25%;\n        border-top-right-radius: 25%;\n        line-height: 16px;\n        font-family: sans-serif;\n        width: -webkit-fit-content;\n        width: -moz-max-content;\n        width: fit-content;\n        background-color: white;\n      }\n      .human-name-inner {\n        font-size: 16px;\n        border-top-left-radius: 25%;\n        border-top-right-radius: 25%;\n        margin: -32px 0px 0 34px;\n        line-height: 16px;\n        padding: 8px 16px 8px 8px;\n        font-family: sans-serif;\n        width: -webkit-fit-content;\n        width: -moz-max-content;\n        width: fit-content;\n        background-color: black;\n        color: white;\n        opacity: .4;\n        transition: .6s all ease;\n      }\n      :host(:hover) .human-name-inner {\n        opacity: 1;\n      }\n      :host(.hax-context-pin-top) hax-toolbar {\n        position: fixed;\n        top: 64px;\n        opacity: .95;\n      }\n      :host(.hax-context-pin-bottom) hax-toolbar {\n        position: fixed;\n        bottom: 0;\n        opacity: .95;\n      }\n    </style>\n    <div class="human-name">\n      <div class="human-name-inner">[[humanName]]</div>\n    </div>\n    <hax-toolbar hax-properties="[[haxProperties]]" size="{{ceSize}}">\n      <slot slot="primary"></slot>\n      <hax-context-item slot="primary" icon="icons:settings" label="Settings" event-name="hax-manager-configure" hidden$="[[!__hasSettingsForm]]"></hax-context-item>\n      <hax-context-item slot="primary" icon="icons:view-quilt" label="[[__parentName]]" event-name="hax-manager-configure-container" hidden$="[[!__hasParentSettingsForm]]"></hax-context-item>\n    </hax-toolbar>\n'
    ]);
    _templateObject_f7ad3910f32e11e8a4700dcc21fbc61a = function _templateObject_f7ad3910f32e11e8a4700dcc21fbc61a() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_f7ad3910f32e11e8a4700dcc21fbc61a()
    ),
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
    setHaxProperties: function setHaxProperties(props) {
      this.set("haxProperties", {});
      this.set("haxProperties", props);
    },
    _ceSizeChanged: function _ceSizeChanged(newValue, oldValue) {
      if (
        babelHelpers.typeof(newValue) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0)) &&
        babelHelpers.typeof(oldValue) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
      ) {
        this.fire("hax-context-item-selected", {
          eventName: "hax-size-change",
          value: newValue
        });
      }
    },
    _haxPropertiesChanged: function _haxPropertiesChanged(newValue, oldValue) {
      if (
        babelHelpers.typeof(oldValue) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0)) &&
        babelHelpers.typeof(newValue.settings) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
      ) {
        var slot = (0, _polymerDom.dom)(this);
        while (null !== slot.firstChild) {
          slot.removeChild(slot.firstChild);
        }
        var settings = newValue.settings.quick,
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
              +" settings";
              break;
          }
        }
        if (
          babelHelpers.typeof(newValue.gizmo.title) ===
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
        ) {
          this.humanName = window.HaxStore.instance.activeNode.tagName
            .replace("-", " ")
            .toLowerCase();
        } else {
          this.humanName = newValue.gizmo.title;
        }
        for (var item, i = 0, setting; i < settings.length; i++) {
          setting = settings[i];
          item = document.createElement("hax-context-item");
          item.eventName = "hax-edit-property";
          item.label = setting.title;
          item.options = setting.options;
          item.icon = setting.icon;
          item.inputMethod = setting.inputMethod;
          item.required = setting.required;
          item.options = setting.options;
          item.validation = setting.validation;
          item.validationType = setting.validationType;
          item.description = setting.description;
          if (
            babelHelpers.typeof(setting.property) !==
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0))
          ) {
            item.propertyToBind = setting.property;
          } else if (
            babelHelpers.typeof(setting.attribute) !==
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0))
          ) {
            item.propertyToBind = setting.attribute;
          } else {
            item.slotToBind = setting.slot;
          }
          slot.appendChild(item);
        }
      }
    }
  });
});
