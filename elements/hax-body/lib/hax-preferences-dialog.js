import { html, css, LitElement } from "lit-element/lit-element.js";
import {
  HaxSchematizer,
  HaxElementizer,
} from "@lrnwebcomponents/hax-body-behaviors/lib/HAXFields.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
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
        #link {
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
    this.hideLink = false;
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
        <simple-icon-lite icon="hax:settings"></simple-icon-lite>
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
      ${!this.hideLink
        ? html`<a
            href="https://haxtheweb.org/"
            rel="noopener"
            id="link"
            target="_blank"
            >Learn more about HAX</a
          >`
        : ``}
    `;
  }
  static get tag() {
    return "hax-preferences-dialog";
  }
  static get properties() {
    return {
      /**
       * Developer prop to hide the link
       */
      hideLink: {
        type: Boolean,
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
