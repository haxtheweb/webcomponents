import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { winEventsElement } from "@lrnwebcomponents/utils/utils.js";
import {
  HaxSchematizer,
  HaxElementizer
} from "@lrnwebcomponents/hax-body-behaviors/lib/HAXFields.js";
/**
 * `hax-export-dialog`
 * @element hax-export-dialog
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
        paper-dialog:not(:defined) {
          display: none;
        }
        #dialog {
          z-index: 100000;
          margin-top: 56px;
        }
        #closedialog {
          top: 6px;
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
        .pref-container {
          text-align: left;
          padding: 16px;
        }
        #reportghissue {
          color: #81a3a9;
          font-size: 18px;
          padding: 16px;
          font-style: italic;
        }
      `
    ];
  }
  constructor() {
    super();
    this.__winEvents = {
      "hax-store-property-updated": "_haxStorePropertyUpdated"
    };
    this.ghLink =
      "https://github.com/elmsln/issues/issues/new?body=URL%20base:%20" +
      window.location.pathname +
      "&title=[hax] Bug%20report%20from%20preference%20panel";
    this.title = "Advanced settings";
    // JSON schema object needs delayed to ensure page repaints the form
    this.schema = [
      {
        property: "haxRayMode",
        title: "X-Ray vision",
        description: "Visualizes the HTML tag powering the area of the page",
        inputMethod: "boolean",
        value: false
      },
      {
        property: "haxVoiceCommands",
        title: "Voice commands",
        description: "Experimental: Voice based control system",
        inputMethod: "boolean",
        value: false
      }
    ];
    this.schemaValues = {
      haxRayMode: false,
      haxVoiceCommands: false
    };
    setTimeout(() => {
      import("@polymer/iron-icon/iron-icon.js");
      import("@polymer/paper-button/paper-button.js");
      import("@lrnwebcomponents/simple-fields/simple-fields.js");
      import("@polymer/paper-dialog/paper-dialog.js");
    }, 0);
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
      <paper-dialog
        id="dialog"
        ?opened="${this.opened}"
        @opened-changed="${this.openedChanged}"
      >
        <h3 class="title">
          <iron-icon icon="icons:settings"></iron-icon> ${this.title}
        </h3>
        <paper-button id="closedialog" @click="${this.closeEvent}">
          <iron-icon icon="icons:cancel" title="Close dialog"></iron-icon>
        </paper-button>
        <div style="height: 100%; overflow: auto;" class="pref-container">
          <simple-fields
            id="settingsform"
            .schematizer="${HaxSchematizer}"
            .elementizer="${HaxElementizer}"
          >
          </simple-fields>
        </div>
        <a
          href="${this.ghLink}"
          rel="noopener"
          id="reportghissue"
          target="_blank"
          >Report an issue with HAX</a
        >
      </paper-dialog>
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
       * github link
       */
      ghLink: {
        type: String
      },
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
    this.shadowRoot.querySelector("#settingsform").fields = [...this.schema];
    this.shadowRoot.querySelector("#settingsform").value = {
      ...this.schemaValues
    };
    this.shadowRoot
      .querySelector("#settingsform")
      .addEventListener("value-changed", this.__valueChangedEvent.bind(this));
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
    if (this.schema && window.HaxStore.ready) {
      window.HaxStore.write("globalPreferences", newValue, this);
    }
  }
  __valueChangedEvent(e) {
    if (e.detail.value) {
      this.preferences = { ...e.detail.value };
    }
  }

  /**
   * open the dialog
   */
  open() {
    this.opened = true;
    this.shadowRoot.querySelector("#settingsform").fields = [...this.schema];
    this.shadowRoot.querySelector("#settingsform").value = {
      ...this.schemaValues
    };
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
