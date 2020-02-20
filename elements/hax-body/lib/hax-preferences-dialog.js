import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { winEventsElement } from "@lrnwebcomponents/utils/utils.js";
/**
 * @deprecatedApply - required for @apply / invoking @apply css var convention
 */
import "@polymer/polymer/lib/elements/custom-style.js";
/**
 * `hax-export-dialog`
 * @customElement hax-export-dialog
 * `Export dialog with all export options and settings provided.`
 */
class HaxPreferencesDialog extends winEventsElement(SimpleColors) {
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
          z-index: 100000;
          margin-top: 56px;
        }
        #closedialog {
          float: right;
          top: 68px;
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
          --paper-checkbox-size: 16px;
          --paper-checkbox-checked-ink-color: var(--hax-color-accent1);
        }
        .pref-container {
          text-align: left;
          padding: 16px;
        }
        app-drawer {
          --app-drawer-width: 320px;
        }
      `
    ];
  }
  constructor() {
    super();
    this.__winEvents = {
      "hax-store-property-updated": "_haxStorePropertyUpdated"
    };
    this.title = "Editor preferences";
    import("@polymer/iron-icon/iron-icon.js");
    import("@polymer/paper-button/paper-button.js");
    import("@lrnwebcomponents/eco-json-schema-form/eco-json-schema-form.js");
    import("@lrnwebcomponents/eco-json-schema-form/lib/eco-json-schema-object.js");
    import("@polymer/app-layout/app-drawer/app-drawer.js");
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
              padding: 64px 0;
            }
          }
          eco-json-schema-object {
            --eco-json-schema-object-form : {
              -ms-flex: unset;
              -webkit-flex: unset;
              flex: unset;
              -webkit-flex-basis: unset;
              flex-basis: unset;
            }
            --paper-checkbox-label: {
              font-size: 16px;
              line-height: 16px;
            }
          }
        </style>
      </custom-style>
      <app-drawer
        id="dialog"
        align="right"
        transition-duration="300"
        ?opened="${this.opened}"
        @opened-changed="${this.openedChanged}"
      >
        <h3 class="title">
          <iron-icon icon="icons:settings"></iron-icon> ${this.title}
        </h3>
        <div style="height: 100%; overflow: auto;" class="pref-container">
          <eco-json-schema-object
            .schema="${this.schema}"
            @value-changed="${this.valueChanged}"
          ></eco-json-schema-object>
        </div>
        <paper-button id="closedialog" @click="${this.closeEvent}">
          <iron-icon icon="icons:cancel" title="Close dialog"></iron-icon>
        </paper-button>
      </app-drawer>
    `;
  }
  openedChanged(e) {
    // force close event to align data model if clicking away
    if (!e.detail.value && window.HaxStore.instance.openDrawer === this) {
      window.HaxStore.write("openDrawer", false, this);
    }
  }
  closeEvent(e) {
    this.opened = false;
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
      },
      opened: {
        type: Boolean
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
   * open the dialog
   */
  open() {
    this.opened = true;
  }
  /**
   * close the dialog
   */
  close() {
    this.opened = false;
  }
}
window.customElements.define(HaxPreferencesDialog.tag, HaxPreferencesDialog);
export { HaxPreferencesDialog };
