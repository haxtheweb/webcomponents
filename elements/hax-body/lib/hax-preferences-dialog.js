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
import {
  I18NMixin,
  I18NManagerStore,
} from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";

/**
 * `hax-preferences-dialog`
 * @element hax-preferences-dialog
 * `Export dialog with all export options and settings provided.`
 */
class HaxPreferencesDialog extends I18NMixin(LitElement) {
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
    this.t = {
      learnMoreAboutHAX: "Learn more about HAX",
      voiceCommands: "Voice commands",
      haxUITheme: "HAX UI Theme",
      language: "Language",
      english: "English",
      spanish: "Spanish",
    };
    this.udpateSchema();
    this.registerTranslation({
      context: this,
      namespace: "hax",
      updateCallback: "udpateSchema",
    });
    autorun(() => {
      this.globalPreferences = toJS(HAXStore.globalPreferences);
      if (
        this.globalPreferences.haxLang &&
        I18NManagerStore.lang != this.globalPreferences.haxLang
      ) {
        I18NManagerStore.lang = this.globalPreferences.haxLang || "en";
        this.udpateSchema();
      }
    });
  }
  udpateSchema() {
    // JSON schema object needs delayed to ensure page repaints the form
    let lang = I18NManagerStore.lang;
    if (lang.indexOf("-")) {
      lang = lang.split("-")[0];
    }
    this.schema = [
      {
        property: "haxVoiceCommands",
        title: this.t.voiceCommands,
        description: "Experimental: Voice based control system",
        inputMethod: "boolean",
        value: false,
      },
      {
        property: "haxUiTheme",
        title: this.t.haxUITheme,
        description:
          "Change the theme of the HAX interface (not the site's content).",
        inputMethod: "radio",
        options: {
          hax: "Default (light)",
          haxdark: "Dark",
          system: "System Default",
        },
        value: "hax",
      },
      {
        property: "haxLang",
        title: this.t.language,
        description:
          "Toggle between supported languages for internationalization",
        inputMethod: "radio",
        options: {
          en: this.t.english,
          es: this.t.spanish,
        },
        value: lang,
      },
    ];
    this.schemaValues = {
      haxVoiceCommands: false,
      haxUiTheme: "hax",
      haxLang: lang,
    };
    if (this.shadowRoot && this.shadowRoot.querySelector("#settingsform")) {
      this.reloadPreferencesForm();
    }
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
            >${this.t.learnMoreAboutHAX}</a
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
    this.reloadPreferencesForm();
    this.shadowRoot
      .querySelector("#settingsform")
      .addEventListener("value-changed", this.__valueChangedEvent.bind(this));
  }
  __valueChangedEvent(e) {
    if (e.detail.value) {
      HAXStore.globalPreferences = { ...e.detail.value };
      this.schemaValues = { ...e.detail.value };
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
