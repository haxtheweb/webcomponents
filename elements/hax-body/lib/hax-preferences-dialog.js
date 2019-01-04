import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/eco-json-schema-form/eco-json-schema-form.js";
import "@lrnwebcomponents/eco-json-schema-form/lib/eco-json-schema-object.js";
import "@polymer/app-layout/app-drawer/app-drawer.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
`hax-export-dialog`
Export dialog with all export options and settings provided.

* @demo demo/index.html

@microcopy - the mental model for this element
 -
*/
Polymer({
  _template: html`
    <style is="custom-style" include="simple-colors">
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
        color: var(--simple-colors-default-theme-light-green-1, green);
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
        }
        --app-drawer-width: 320px;
      }
      eco-json-schema-object {
        color: white;
        --eco-json-schema-object-form : {
          -ms-flex: unset;
          -webkit-flex: unset;
          flex: unset;
          -webkit-flex-basis: unset;
          flex-basis: unset;
        }
        --paper-icon-button: {
          background-color: rgba(0, 0, 0, 0.9) !important;
          border-radius: 50%;
        }
        --code-pen-title-color: #ffffff;
        --paper-checkbox-size: 22px;
        --paper-checkbox-checked-ink-color: #ffffff;
        --paper-checkbox-unchecked-ink-color: #ffffff;
        --paper-checkbox-label-color: var(
          --simple-colors-blue-grey-background1
        );
        --paper-checkbox-label: {
          font-size: 22px;
          line-height: 32px;
        }
        --paper-input-container-invalid-color: var(
          --simple-colors-red-foreground3
        );
        --secondary-text-color: #ffffff;
        --primary-text-color: #ffffff;
        --paper-input-container-input-color: #ffffff;
        --paper-input-container-color: #ffffff !important;
        --paper-input-container-focus-color: var(
          --simple-colors-default-theme-light-green-1
        ) !important;
        --paper-listbox-color: #000000;
      }
    </style>
    <app-drawer id="dialog" align="right" transition-duration="300">
      <h3 class="title">[[title]]</h3>
      <div style="height: 100%; overflow: auto;" class="pref-container">
        <eco-json-schema-object
          schema="[[schema]]"
          value="{{preferences}}"
        ></eco-json-schema-object>
      </div>
      <paper-button id="closedialog" on-tap="close">
        <iron-icon icon="icons:cancel" title="Close dialog"></iron-icon>
      </paper-button>
    </app-drawer>
  `,

  is: "hax-preferences-dialog",

  observers: ["_preferencesChanged(preferences.*)"],

  properties: {
    /**
     * Title when open.
     */
    title: {
      type: String,
      value: "Preferences"
    },
    /**
     * Schema that has all of inputs / manages state
     */
    schema: {
      type: Object
    },
    /**
     * Preferences managed for everything global about HAX.
     */
    preferences: {
      type: Object
    }
  },

  /**
   * Detached life cycle
   */
  detached: function() {
    document.body.removeEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
  },

  /**
   * Attached to the DOM, now fire that we exist.
   */
  attached: function() {
    // JSON schema object needs delayed to ensure page repaints the form
    var schema = {
      $schema: "http://json-schema.org/schema#",
      title: "HAX preferences",
      type: "object",
      properties: {
        haxRayMode: {
          title: "X-Ray vision",
          type: "boolean",
          value: false
        },
        haxDeveloperMode: {
          title: "Developer mode",
          type: "boolean",
          value: false
        },
        haxShowExportButton: {
          title: "Show Export Panel",
          type: "boolean",
          value: false
        },
        haxGithubReport: {
          title: "Report issue",
          type: "string",
          value: false,
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
    this.set("schema", {});
    this.set("schema", schema);
    // register this with hax as the preference pane
    this.fire("hax-register-preferences", this);
    // add event listener
    document.body.addEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
    // force color values to apply
    this.updateStyles();
  },

  /**
   * Store updated, sync.
   */
  _haxStorePropertyUpdated: function(e) {
    if (
      e.detail &&
      typeof e.detail.value !== typeof undefined &&
      e.detail.property &&
      typeof this[e.detail.property] !== typeof undefined
    ) {
      this.set(e.detail.property, e.detail.value);
    }
  },

  /**
   * Notice preferences have changed.
   */
  _preferencesChanged: function(prop) {
    window.HaxStore.write("globalPreferences", this.preferences, this);
  },

  /**
   * Toggle state.
   */
  toggleDialog: function() {
    if (this.$.dialog.opened) {
      this.close();
    } else {
      window.HaxStore.instance.closeAllDrawers(this);
    }
  },

  /**
   * open the dialog
   */
  open: function() {
    this.$.dialog.open();
  },

  /**
   * close the dialog
   */
  close: function() {
    this.$.dialog.close();
  }
});
