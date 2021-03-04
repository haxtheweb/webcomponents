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
      "i18n-manager-register-element",
      this.registerTranslationEvent.bind(this)
    );
    window.addEventListener(
      "languagechange",
      this.changeLanguageEvent.bind(this)
    );
  }

  disconnectedCallback() {
    window.removeEventListener(
      "i18n-manager-register-element",
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
  pathFromUrl(url) {
    return url.substring(0, url.lastIndexOf("/") + 1);
  }
  registerTranslationEvent(e) {
    let detail = this.detailNormalize(e.detail);
    // ensure we have a namespace for later use
    if (detail.namespace && detail.localesPath && detail.locales) {
      this.registerTranslation(detail);
    }
  }
  detailNormalize(detail) {
    if (!detail.namespace && detail.context) {
      detail.namespace = detail.context.tagName.toLowerCase();
    }
    // support fallback calls for requestUpdate (LitElement) and render if nothing set
    if (!detail.updateCallback && detail.context) {
      if (detail.context.requestUpdate) {
        detail.updateCallback = "requestUpdate";
      } else if (detail.context.render) {
        detail.render = "render";
      }
    }
    if (!detail.localesPath && detail.basePath) {
      // clean up path and force adding locales. part security thing as well
      detail.localesPath = `${this.pathFromUrl(
        decodeURIComponent(detail.basePath)
      )}locales`;
    }
    // minimum requirement to operate but still
    // should pull from other namespace if exists
    if (detail.context && detail.namespace) {
      let match = this.elements.filter((el) => {
        if (el.namespace == detail.namespace && el.localesPath && el.locales) {
          return true;
        }
      });
      if (match && match.length && match[0]) {
        detail.localesPath = match[0].localesPath;
        detail.locales = match[0].locales;
      }
    }
    return detail;
  }
  registerTranslation(detail) {
    // ensure no dual registration of context; meaning same object twice
    if (
      (!detail.context &&
        this.elements.filter((e) => {
          return e.namespace === detail.namespace;
        }).length === 0) ||
      this.elements.filter((e) => {
        return e.context === detail.context;
      }).length === 0
    ) {
      detail = this.detailNormalize(detail);
      this.elements.push(detail);
      // timing issue, see if we are ready + a language and that it happened PRIOR
      // to registration just now but match against locales we support
      // and it being the set language already
      if (this.lang && this.__ready && detail.locales.includes(this.lang)) {
        // prevent flooding w/ lots of translatable elements
        clearTimeout(this._debounce);
        this._debounce = setTimeout(() => {
          this.updateLanguage(this.lang);
        }, 0);
      }
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
   * Return language file for a specific context
   */
  async loadNamespaceFile(ns, lang = this.lang) {
    const langPieces = lang.split("-");
    let nsMatch = this.elements.filter((el) => {
      return (
        el.namespace === ns &&
        (el.locales.includes(lang) || el.locales.includes(langPieces[0]))
      );
    });
    if (nsMatch && nsMatch.length === 1) {
      const el = nsMatch[0];
      var fetchTarget = "";
      if (el.locales.includes(lang)) {
        fetchTarget = `${el.localesPath}/${el.namespace}.${lang}.json`;
      } else if (el.locales.includes(langPieces[0])) {
        fetchTarget = `${el.localesPath}/${el.namespace}.${langPieces[0]}.json`;
      }
      if (fetchTarget == "") {
        return {};
      }
      // see if we had this previous to avoid another request
      if (!this.fetchTargets[fetchTarget]) {
        // request the json backing, then make JSON and set the associated values
        // @todo catch this if fetch target was previously requested
        this.fetchTargets[fetchTarget] = await fetch(fetchTarget).then(
          (response) => {
            if (response && response.json) return response.json();
            return false;
          }
        );
      }
      return this.fetchTargets[fetchTarget];
    }
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
          // verify we have a context
          if (el.context) {
            el.context.t = { ...el.context._t };
            // support a forced update / function to run when it finishes
            if (el.updateCallback) {
              el.context[el.updateCallback]();
            }
          }
        }
      }
      // run through and match exact matches
      for (var i in processList) {
        let el = processList[i];
        var fetchTarget = "";
        if (el.locales.includes(lang)) {
          fetchTarget = `${el.localesPath}/${el.namespace}.${lang}.json`;
        } else if (el.locales.includes(langPieces[0])) {
          fetchTarget = `${el.localesPath}/${el.namespace}.${langPieces[0]}.json`;
        }
        // see if we had this previous to avoid another request
        if (this.fetchTargets[fetchTarget]) {
          if (el.context) {
            let data = this.fetchTargets[fetchTarget];
            for (var id in data) {
              el.context.t[id] = data[id];
            }
            el.context.t = { ...el.context.t };
            // support a forced update / function to run when it finishes
            if (el.updateCallback) {
              el.context[el.updateCallback]();
            }
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
          if (el.context) {
            for (var id in this.fetchTargets[fetchTarget]) {
              el.context.t[id] = this.fetchTargets[fetchTarget][id];
            }
            el.context.t = { ...el.context.t };
            // support a forced update / function to run when it finishes
            if (el.updateCallback && el.context) {
              el.context[el.updateCallback]();
            }
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
