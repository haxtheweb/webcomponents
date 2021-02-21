import { html, css, LitElement } from "lit-element/lit-element.js";
import {
  HaxSchematizer,
  HaxElementizer,
} from "@lrnwebcomponents/hax-body-behaviors/lib/HAXFields.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
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
        .pref-container {
          text-align: left;
        }
        simple-icon-button {
          float: right;
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
        property: "haxVoiceCommands",
        title: "Voice commands",
        description: "Experimental: Voice based control system",
        inputMethod: "boolean",
        value: false,
      },
    ];
    this.schemaValues = {
      haxVoiceCommands: false,
    };
    autorun(() => {
      this.globalPreferences = toJS(HAXStore.globalPreferences);
      this.schemaValues = toJS(HAXStore.globalPreferences);
    });
  }
  closeBtn(e) {
    this.dispatchEvent(
      new CustomEvent("hax-tray-button-click", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          eventName: "open-preferences",
          index: 0,
          value: true,
        },
      })
    );
  }
  render() {
    return html`
      <div style="height: 100%; overflow: auto;" class="pref-container">
        <simple-fields
          id="settingsform"
          .schematizer="${HaxSchematizer}"
          .elementizer="${HaxElementizer}"
        >
        </simple-fields>
      </div>
      <hr />
      <br />
      <br />
      ${!this.hideLink
        ? html`<a
            href="https://haxtheweb.org/"
            rel="noopener"
            id="link"
            target="_blank"
            part="haxlink"
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
