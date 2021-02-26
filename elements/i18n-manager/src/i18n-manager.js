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
    this.locales = {};
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
      FALLBACK_LANG
    );
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(
      "register-i18n",
      this.registerTranslationEvent.bind(this)
    );
  }

  disconnectedCallback() {
    window.removeEventListener(
      "register-i18n",
      this.registerTranslationEvent.bind(this)
    );
    super.disconnectedCallback();
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
   * LitElement style callback
   */
  static get styles() {
    // support for using in other classes
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      ...styles,
      css`
        :host {
          display: block;
        }
      `,
    ];
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
  async updateLanguage(lang, context = "*") {
    if (lang) {
      const processList = this.elements.filter((el) => {
        return el.locales.includes(lang);
      });
      await processList.forEach((el, i) => {
        fetch(`${el.localesPath}/${el.tagName}.${lang}.json`)
          .then((response) => {
            if (response && response.json) return response.json();
            return false;
          })
          .then((data) => {
            console.log(data);
            for (var id in data) {
              el.context.elText[id] = data[id];
            }
            // support a forced update / function to run when it finishes
            if (el.updateCallback) {
              el.context[el.updateCallback]();
            }
          });
      });
    }
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
        if (this[propName]) {
          this.updateLanguage(this[propName]);
        }
      }
      /* observer example
      if (propName == 'activeNode') {
        this._activeNodeChanged(this[propName], oldValue);
      }
      */
      /* computed example
      if (['id', 'selected'].includes(propName)) {
        this.__selectedChanged(this.selected, this.id);
      }
      */
    });
  }
}
customElements.define(I18NManager.tag, I18NManager);
export { I18NManager };
