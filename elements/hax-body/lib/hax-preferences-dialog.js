import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * @deprecatedApply - required for @apply / invoking @apply css var convention
 */
import "@polymer/polymer/lib/elements/custom-style.js";
/**
 * `hax-export-dialog`
 * `Export dialog with all export options and settings provided.`
 */
class HaxPreferencesDialog extends SimpleColors {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
        }
        iron-icon:not(:defined),
        paper-button:not(:defined),
        app-drawer:not(:defined) {
          display: none;
        }
        #dialog {
          z-index: 1000;
          margin-top: 56px;
        }
        #closedialog {
          float: right;
          top: 124px;
          right: 0;
          position: absolute;
          padding: 8px;
          margin: 0;
          background-color: var(--hax-color-menu-heading-bg, #eeeeee);
          color: var(--hax-color-menu-heading-color, black);
          width: 40px;
          height: 40px;
          min-width: unset;
        }
        .title {
          position: relative;
          padding: 16px;
          outline: 0;
          font-weight: 600;
          text-align: left;
          margin: 0;
          background-color: var(--hax-color-menu-heading-bg, #eeeeee);
          color: var(--hax-color-menu-heading-color, black);
          font-size: 18px;
          line-height: 18px;
          font-family: "Noto Serif", serif;
        }
        eco-json-schema-object {
          color: white;
        }
        .pref-container {
          text-align: left;
          padding: 16px;
        }
      `
    ];
  }
  constructor() {
    super();
    this.title = "Editor preferences";
    import("@polymer/iron-icon/iron-icon.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/paper-button/paper-button.js");
    import("@lrnwebcomponents/eco-json-schema-form/eco-json-schema-form.js");
    import("@lrnwebcomponents/eco-json-schema-form/lib/eco-json-schema-object.js");
    import("@polymer/app-layout/app-drawer/app-drawer.js");
    // add event listener
    document.body.addEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      // notify when any of these change
      if (propName == "preferences") {
        this._preferencesChanged(this[propName]);
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            detail: {
              value: this[propName]
            }
          })
        );
      }
    });
  }
  render() {
    return html`
      <custom-style>
        <style>
          app-drawer {
            --app-drawer-content-container: {
              background-color: #ffffff;
            }
            --app-drawer-width: 320px;
          }
          eco-json-schema-object {
            --eco-json-schema-object-form : {
              -ms-flex: unset;
              -webkit-flex: unset;
              flex: unset;
              -webkit-flex-basis: unset;
              flex-basis: unset;
            }
            --paper-checkbox-size: 16px;
            --paper-checkbox-checked-ink-color: var(--hax-color-accent1);
            --paper-checkbox-label: {
              font-size: 16px;
              line-height: 16px;
            }
          }
        </style>
      </custom-style>
      <app-drawer id="dialog" align="right" transition-duration="300">
        <h3 class="title">
          <iron-icon icon="icons:settings"></iron-icon> ${this.title}
        </h3>
        <div style="height: 100%; overflow: auto;" class="pref-container">
          <eco-json-schema-object
            .schema="${this.schema}"
            @value-changed="${this.valueChanged}"
          ></eco-json-schema-object>
        </div>
        <paper-button id="closedialog" @click="${this.close}">
          <iron-icon icon="icons:cancel" title="Close dialog"></iron-icon>
        </paper-button>
      </app-drawer>
    `;
  }
  static get tag() {
    return "hax-preferences-dialog";
  }
  static get properties() {
    return {
      /**
       * Title when open.
       */
      title: {
        type: String
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
    };
  }

  firstUpdated(changedProperties) {
    // JSON schema object needs delayed to ensure page repaints the form
    var schema = {
      $schema: "http://json-schema.org/schema#",
      title: "HAX preferences",
      type: "object",
      properties: {
        haxShowExportButton: {
          title: "View source button",
          type: "boolean",
          value: true
        },
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
        haxVoiceCommands: {
          title: "Voice commands",
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
              rel: "noopener",
              style:
                "color: #81a3a9;font-size: 18px;top: 100vh;position: fixed;right: 0;padding: 16px;font-style: italic;",
              id: "reportghissue",
              href:
                "https://github.com/elmsln/lrnwebcomponents/issues/new?body=URL%20base:%20" +
                window.location.pathname +
                "&title=[hax] Bug%20report%20from%20preference%20panel",
              target: "_blank"
            },
            slot: "Report an issue with HAX"
          }
        }
      }
    };
    this.schema = { ...schema };
    // fire an event that this is a core piece of the system
    this.dispatchEvent(
      new CustomEvent("hax-register-core-piece", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          piece: "haxPreferences",
          object: this
        }
      })
    );
  }
  /**
   * Store updated, sync.
   */
  _haxStorePropertyUpdated(e) {
    if (
      e.detail &&
      typeof e.detail.value !== typeof undefined &&
      e.detail.property &&
      e.detail.property === "globalPreferences" &&
      e.detail.owner !== this
    ) {
      this.preferences = { ...e.detail.value };
    }
  }

  /**
   * Notice preferences have changed.
   */
  _preferencesChanged(newValue) {
    if (this.schema && this.schema.properties && window.HaxStore.ready) {
      window.HaxStore.write("globalPreferences", newValue, this);
    }
  }
  valueChanged(e) {
    if (e.detail.value) {
      this.preferences = { ...e.detail.value };
    }
  }
  /**
   * Toggle state.
   */
  toggleDialog() {
    if (this.shadowRoot.querySelector("#dialog").opened) {
      this.close();
    } else {
      window.HaxStore.instance.closeAllDrawers(this);
      var schema = this.schema;
      // enforce property values to be the schema value
      for (var key in this.preferences) {
        this.schema.properties[key].value = this.preferences[key];
      }
      // force the form to rebuild
      this.schema = { ...schema };
    }
  }
  /**
   * open the dialog
   */
  open() {
    this.shadowRoot.querySelector("#dialog").open();
  }
  /**
   * close the dialog
   */
  close() {
    this.shadowRoot.querySelector("#dialog").close();
  }
}
window.customElements.define(HaxPreferencesDialog.tag, HaxPreferencesDialog);
export { HaxPreferencesDialog };
