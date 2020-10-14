import { html, css, LitElement } from "lit-element/lit-element.js";
import { winEventsElement } from "@lrnwebcomponents/utils/utils.js";
import {
  HaxSchematizer,
  HaxElementizer,
} from "@lrnwebcomponents/hax-body-behaviors/lib/HAXFields.js";
import "@polymer/iron-icon/iron-icon.js";
import "@lrnwebcomponents/simple-fields/simple-fields.js";
import { HAXStore } from "./hax-store.js";

/**
 * `hax-preferences-dialog`
 * @element hax-preferences-dialog
 * `Export dialog with all export options and settings provided.`
 */
class HaxPreferencesDialog extends winEventsElement(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        iron-icon:not(:defined) {
          display: none;
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
      `,
    ];
  }
  constructor() {
    super();
    this.__winEvents = {
      "hax-store-property-updated": "_haxStorePropertyUpdated",
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
        value: false,
      },
      {
        property: "haxVoiceCommands",
        title: "Voice commands",
        description: "Experimental: Voice based control system",
        inputMethod: "boolean",
        value: false,
      },
    ];
    this.schemaValues = {
      haxRayMode: false,
      haxVoiceCommands: false,
    };
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      // notify when any of these change
      if (propName == "preferences") {
        this._preferencesChanged(this[propName]);
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            detail: {
              value: this[propName],
              bubbles: true,
              composed: true,
            },
          })
        );
      }
    });
  }
  render() {
    return html`
      <h3 class="title">
        <iron-icon icon="icons:settings"></iron-icon> ${this.title}
      </h3>
      <div style="height: 100%; overflow: auto;" class="pref-container">
        <simple-fields
          id="settingsform"
          .schematizer="${HaxSchematizer}"
          .elementizer="${HaxElementizer}"
        >
        </simple-fields>
      </div>
      <a href="${this.ghLink}" rel="noopener" id="reportghissue" target="_blank"
        >Report an issue with HAX</a
      >
    `;
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
        type: String,
      },
      /**
       * Title.
       */
      title: {
        type: String,
      },
      /**
       * Schema that has all of inputs / manages state
       */
      schema: {
        type: Object,
      },
      /**
       * Preferences managed for everything global about HAX.
       */
      preferences: {
        type: Object,
      },
    };
  }

  firstUpdated(changedProperties) {
    this.shadowRoot.querySelector("#settingsform").fields = [...this.schema];
    this.shadowRoot.querySelector("#settingsform").value = {
      ...this.schemaValues,
    };
    this.shadowRoot
      .querySelector("#settingsform")
      .addEventListener("value-changed", this.__valueChangedEvent.bind(this));
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
    if (this.schema && HAXStore.ready) {
      this.schemaValues = newValue;
      HAXStore.write("globalPreferences", newValue, this);
    }
  }
  __valueChangedEvent(e) {
    if (e.detail.value) {
      this.preferences = { ...e.detail.value };
    }
  }

  /**
   * force an update of settings
   */
  reloadPreferencesForm() {
    this.shadowRoot.querySelector("#settingsform").fields = [...this.schema];
    this.shadowRoot.querySelector("#settingsform").value = {
      ...this.schemaValues,
    };
  }
}
window.customElements.define(HaxPreferencesDialog.tag, HaxPreferencesDialog);
export { HaxPreferencesDialog };
