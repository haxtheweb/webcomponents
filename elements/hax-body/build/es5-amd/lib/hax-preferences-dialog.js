define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-icon/iron-icon.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@lrnwebcomponents/eco-json-schema-form/eco-json-schema-form.js",
  "../node_modules/@lrnwebcomponents/eco-json-schema-form/lib/eco-json-schema-object.js",
  "../node_modules/@polymer/app-layout/app-drawer/app-drawer.js",
  "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js"
], function(
  _polymerLegacy,
  _ironIcon,
  _ironIcons,
  _paperButton,
  _ecoJsonSchemaForm,
  _ecoJsonSchemaObject,
  _appDrawer,
  _simpleColors
) {
  "use strict";
  function _templateObject_9b61a540f1e611e8b3a2e3a031c18fd0() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style is="custom-style">\n      :host {\n        display: block;\n      }\n      #dialog {\n        z-index: 1000;\n        margin-top: 64px;\n      }\n      #closedialog {\n        float: right;\n        top: 135px;\n        right: 0;\n        position: absolute;\n        padding: 4px;\n        margin: 0;\n        color: var(--simple-colors-light-green-background1, green);\n        background-color: transparent;\n        width: 40px;\n        height: 40px;\n        min-width: unset;\n      }\n      .title {\n        margin-top: 32px;\n        text-align: center;\n        padding: 16px;\n        margin: 0;\n        background-color: rgba(0, 0, 0, 0.5);\n        font-size: 32px;\n        font-weight: bold;\n        font-family: sans-serif;\n        text-transform: uppercase;\n        color: var(--hax-ui-headings, #d4ff77);\n      }\n      .pref-container {\n        text-align: left;\n        padding: 16px;\n      }\n      app-drawer {\n        --app-drawer-content-container: {\n          background-color: rgba(0, 0, 0, 0.7);\n        };\n        --app-drawer-width: 320px;\n      }\n      eco-json-schema-object {\n        --eco-json-schema-object-form : {\n          -ms-flex: unset;\n          -webkit-flex: unset;\n          flex: unset;\n          -webkit-flex-basis: unset;\n          flex-basis: unset;\n        };\n        --paper-checkbox-size: 22px;\n        --paper-checkbox-unchecked-color: var(--simple-colors-blue-grey-background1) !important;\n        --paper-checkbox-checked-color: var(--simple-colors-light-green-foreground3) !important;\n        --paper-checkbox-checked-ink-color: #FFFFFF !important;\n        --paper-checkbox-unchecked-ink-color: #FFFFFF !important;\n        --paper-checkbox-label-color: var(--simple-colors-blue-grey-background1) !important;\n        --paper-checkbox-label-checked-color: var(--simple-colors-accent-background1) !important;\n        --paper-checkbox-label: {\n          font-size: 22px;\n          line-height: 32px;\n        };\n      }\n    </style>\n    <app-drawer id="dialog" align="right">\n      <h3 class="title">[[title]]</h3>\n      <div style="height: 100%; overflow: auto;" class="pref-container">\n        <eco-json-schema-object schema="[[schema]]" value="{{preferences}}"></eco-json-schema-object>\n      </div>\n      <paper-button id="closedialog" on-tap="close">\n        <iron-icon icon="icons:cancel" title="Close dialog"></iron-icon>\n      </paper-button>\n    </app-drawer>\n'
    ]);
    _templateObject_9b61a540f1e611e8b3a2e3a031c18fd0 = function _templateObject_9b61a540f1e611e8b3a2e3a031c18fd0() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_9b61a540f1e611e8b3a2e3a031c18fd0()
    ),
    is: "hax-preferences-dialog",
    observers: ["_preferencesChanged(preferences.*)"],
    behaviors: [simpleColorsBehaviors],
    properties: {
      title: { type: String, value: "Preferences" },
      schema: { type: Object },
      preferences: { type: Object }
    },
    detached: function detached() {
      document.body.removeEventListener(
        "hax-store-property-updated",
        this._haxStorePropertyUpdated.bind(this)
      );
    },
    ready: function ready() {
      document.body.appendChild(this);
    },
    attached: function attached() {
      var _this = this;
      setTimeout(function() {
        var schema = {
          $schema: "http://json-schema.org/schema#",
          title: "HAX preferences",
          type: "object",
          properties: {
            haxRayMode: { title: "X-Ray vision", type: "boolean", value: !1 },
            haxDeveloperMode: {
              title: "Developer mode",
              type: "boolean",
              value: !1
            },
            haxShowExportButton: {
              title: "Show Export Panel",
              type: "boolean",
              value: !1
            },
            haxGithubReport: {
              title: "Report issue",
              type: "string",
              value: !1,
              component: {
                name: "a",
                properties: {
                  style:
                    "color: #81a3a9;font-size: 18px;top: 100vh;position: fixed;right: 0;padding: 16px;font-style: italic;",
                  id: "reportghissue",
                  href:
                    "https://github.com/LRNWebComponents/hax-body/issues/new?body=URL%20base:%20" +
                    window.location.pathname +
                    "&title=HAX%20bug%20report%20from%20preference%20panel",
                  target: "_blank"
                },
                slot: "Report an issue with HAX"
              }
            }
          }
        };
        _this.set("schema", schema);
      }, 1e3);
      this.fire("hax-register-preferences", this);
      document.body.addEventListener(
        "hax-store-property-updated",
        this._haxStorePropertyUpdated.bind(this)
      );
      this.updateStyles();
    },
    _haxStorePropertyUpdated: function _haxStorePropertyUpdated(e) {
      if (
        e.detail &&
        babelHelpers.typeof(e.detail.value) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0)) &&
        e.detail.property &&
        babelHelpers.typeof(this[e.detail.property]) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
      ) {
        this.set(e.detail.property, e.detail.value);
      }
    },
    _preferencesChanged: function _preferencesChanged(prop) {
      window.HaxStore.write("globalPreferences", this.preferences, this);
    },
    toggleDialog: function toggleDialog() {
      if (this.$.dialog.opened) {
        this.close();
      } else {
        window.HaxStore.instance.closeAllDrawers(this);
      }
    },
    open: function open() {
      this.$.dialog.open();
    },
    close: function close() {
      this.$.dialog.close();
    }
  });
});
