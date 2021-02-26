/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";

// register globally so we can make sure there is only one
window.I18NManagerStore = window.I18NManagerStore || {};
window.I18NManagerStore.requestAvailability = () => {
  if (!window.I18NManagerStore.instance) {
    window.I18NManagerStore.instance = document.createElement("i18n-manager");
    document.body.appendChild(window.I18NManagerStore.instance);
  }
  return window.I18NManagerStore.instance;
};
export const I18NManagerStore = window.I18NManagerStore.requestAvailability();
const FALLBACK_LANG = "en";
/**
 * `i18n-manager`
 * `internationalization management singleton and helper classes`
 * @demo demo/index.html
 * @element i18n-manager
 */
class I18NManager extends LitElement {
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.fetchTargets = {};
    this.elements = [];
    // set initially based on document
    this.lang = this.documentLang;
  }
  get documentLang() {
    return (
      document.body.getAttribute("xml:lang") ||
      document.body.getAttribute("lang") ||
      document.documentElement.getAttribute("xml:lang") ||
      document.documentElement.getAttribute("lang") ||
      navigator.language ||
      FALLBACK_LANG
    );
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(
      "register-i18n",
      this.registerTranslationEvent.bind(this)
    );
    window.addEventListener(
      "languagechange",
      this.changeLanguageEvent.bind(this)
    );
  }

  disconnectedCallback() {
    window.removeEventListener(
      "register-i18n",
      this.registerTranslationEvent.bind(this)
    );
    window.removeEventListener(
      "languagechange",
      this.changeLanguageEvent.bind(this)
    );
    super.disconnectedCallback();
  }
  changeLanguageEvent(e) {
    this.lang = e.detail;
  }
  registerTranslationEvent(e) {
    if (
      e.detail.import &&
      e.detail.context &&
      e.detail.locales &&
      e.detail.basePath
    ) {
      this.registerTranslation(e.detail);
    }
  }
  registerTranslation(detail) {
    // ensure no dual registration of context
    if (
      this.elements.filter((e) => {
        return e.context === detail.context;
      }).length === 0
    ) {
      this.elements.push(detail);
    }
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "i18n-manager";
  }
  /**
   * LitElement convention
   */
  static get properties() {
    return {
      ...super.properties,
      lang: {
        type: String,
        reflect: true,
        attribute: "lang",
      },
    };
  }
  /**
   * trigger an update of the language after loading everything
   */
  async updateLanguage(lang) {
    if (lang) {
      const langPieces = lang.split("-");
      // get all exact matches as well as partial matches
      const processList = this.elements.filter((el) => {
        return el.locales.includes(lang) || el.locales.includes(langPieces[0]);
      });
      const fallBack = this.elements.filter((el) => {
        return (
          !el.locales.includes(lang) && !el.locales.includes(langPieces[0])
        );
      });
      // no matches found, now we should fallback to defaults in the elements
      if (fallBack.length !== 0) {
        // fallback to documentLanguage
        for (var i in fallBack) {
          let el = fallBack[i];
          el.context.t = { ...el.context._t };
          // support a forced update / function to run when it finishes
          if (el.updateCallback) {
            el.context[el.updateCallback]();
          }
        }
      }
      // run through and match exact matches
      for (var i in processList) {
        let el = processList[i];
        var fetchTarget = "";
        if (el.locales.includes(lang)) {
          fetchTarget = `${el.localesPath}/${el.tagName}.${lang}.json`;
        } else if (el.locales.includes(langPieces[0])) {
          fetchTarget = `${el.localesPath}/${el.tagName}.${langPieces[0]}.json`;
        }
        // see if we had this previous to avoid another request
        if (this.fetchTargets[fetchTarget]) {
          let data = this.fetchTargets[fetchTarget];
          for (var id in data) {
            el.context.t[id] = data[id];
          }
          el.context.t = { ...el.context.t };
          // support a forced update / function to run when it finishes
          if (el.updateCallback) {
            el.context[el.updateCallback]();
          }
        } else {
          // request the json backing, then make JSON and set the associated values
          // @todo catch this if fetch target was previously requested
          this.fetchTargets[fetchTarget] = await fetch(fetchTarget).then(
            (response) => {
              if (response && response.json) return response.json();
              return false;
            }
          );
          for (var id in this.fetchTargets[fetchTarget]) {
            el.context.t[id] = this.fetchTargets[fetchTarget][id];
          }
          el.context.t = { ...el.context.t };
          // support a forced update / function to run when it finishes
          if (el.updateCallback) {
            el.context[el.updateCallback]();
          }
        }
      }
    }
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.__ready = true;
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      // notify
      if (propName == "lang") {
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            composed: true,
            bubbles: true,
            cancelable: false,
            detail: {
              value: this[propName],
            },
          })
        );
        // we are NOT moving to the default from something
        if (this[propName] && this.__ready) {
          this.updateLanguage(this[propName]);
        }
      }
    });
  }
}
customElements.define(I18NManager.tag, I18NManager);
export { I18NManager };
