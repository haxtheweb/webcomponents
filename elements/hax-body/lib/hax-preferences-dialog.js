import { html, css, LitElement } from "lit-element/lit-element.js";
import {
  HaxSchematizer,
  HaxElementizer,
} from "@lrnwebcomponents/hax-body-behaviors/lib/HAXFields.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-fields/simple-fields.js";
import { HAXStore } from "./hax-store.js";
import { autorun, toJS } from "mobx";

/**
 * `hax-preferences-dialog`
 * @element hax-preferences-dialog
 * `Export dialog with all export options and settings provided.`
 */
class HaxPreferencesDialog extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
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
    autorun(() => {
      this.globalPreferences = toJS(HAXStore.globalPreferences);
      this.schemaValues = toJS(HAXStore.globalPreferences);
    });
  }
  render() {
    return html`
      <h3 class="title">
        <simple-icon icon="hax:settings" contrast="4"></simple-icon>
        ${this.title}
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
      globalPreferences: {
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
  __valueChangedEvent(e) {
    if (e.detail.value) {
      HAXStore.globalPreferences = { ...e.detail.value };
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
