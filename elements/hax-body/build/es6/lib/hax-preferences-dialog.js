import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/iron-icon/iron-icon.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
import "../node_modules/@lrnwebcomponents/eco-json-schema-form/eco-json-schema-form.js";
import "../node_modules/@lrnwebcomponents/eco-json-schema-form/lib/eco-json-schema-object.js";
import "../node_modules/@polymer/app-layout/app-drawer/app-drawer.js";
import "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";
Polymer({
  _template: html`
    <style is="custom-style">
      :host {
        display: block;
      }
      #dialog {
        z-index: 1000;
        margin-top: 64px;
      }
      #closedialog {
        float: right;
        top: 135px;
        right: 0;
        position: absolute;
        padding: 4px;
        margin: 0;
        color: var(--simple-colors-light-green-background1, green);
        background-color: transparent;
        width: 40px;
        height: 40px;
        min-width: unset;
      }
      .title {
        margin-top: 32px;
        text-align: center;
        padding: 16px;
        margin: 0;
        background-color: rgba(0, 0, 0, 0.5);
        font-size: 32px;
        font-weight: bold;
        font-family: sans-serif;
        text-transform: uppercase;
        color: var(--hax-ui-headings, #d4ff77);
      }
      .pref-container {
        text-align: left;
        padding: 16px;
      }
      app-drawer {
        --app-drawer-content-container: {
          background-color: rgba(0, 0, 0, 0.7);
        };
        --app-drawer-width: 320px;
      }
      eco-json-schema-object {
        --eco-json-schema-object-form : {
          -ms-flex: unset;
          -webkit-flex: unset;
          flex: unset;
          -webkit-flex-basis: unset;
          flex-basis: unset;
        };
        --paper-checkbox-size: 22px;
        --paper-checkbox-unchecked-color: var(--simple-colors-blue-grey-background1) !important;
        --paper-checkbox-checked-color: var(--simple-colors-light-green-foreground3) !important;
        --paper-checkbox-checked-ink-color: #FFFFFF !important;
        --paper-checkbox-unchecked-ink-color: #FFFFFF !important;
        --paper-checkbox-label-color: var(--simple-colors-blue-grey-background1) !important;
        --paper-checkbox-label-checked-color: var(--simple-colors-accent-background1) !important;
        --paper-checkbox-label: {
          font-size: 22px;
          line-height: 32px;
        };
      }
    </style>
    <app-drawer id="dialog" align="right">
      <h3 class="title">[[title]]</h3>
      <div style="height: 100%; overflow: auto;" class="pref-container">
        <eco-json-schema-object schema="[[schema]]" value="{{preferences}}"></eco-json-schema-object>
      </div>
      <paper-button id="closedialog" on-tap="close">
        <iron-icon icon="icons:cancel" title="Close dialog"></iron-icon>
      </paper-button>
    </app-drawer>
`,
  is: "hax-preferences-dialog",
  observers: ["_preferencesChanged(preferences.*)"],
  behaviors: [simpleColorsBehaviors],
  properties: {
    title: { type: String, value: "Preferences" },
    schema: { type: Object },
    preferences: { type: Object }
  },
  detached: function() {
    document.body.removeEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
  },
  ready: function() {
    document.body.appendChild(this);
  },
  attached: function() {
    setTimeout(() => {
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
      this.set("schema", schema);
    }, 1e3);
    this.fire("hax-register-preferences", this);
    document.body.addEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
    this.updateStyles();
  },
  _haxStorePropertyUpdated: function(e) {
    if (
      e.detail &&
      typeof e.detail.value !== typeof void 0 &&
      e.detail.property &&
      typeof this[e.detail.property] !== typeof void 0
    ) {
      this.set(e.detail.property, e.detail.value);
    }
  },
  _preferencesChanged: function(prop) {
    window.HaxStore.write("globalPreferences", this.preferences, this);
  },
  toggleDialog: function() {
    if (this.$.dialog.opened) {
      this.close();
    } else {
      window.HaxStore.instance.closeAllDrawers(this);
    }
  },
  open: function() {
    this.$.dialog.open();
  },
  close: function() {
    this.$.dialog.close();
  }
});
