/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text
 */
import { LitElement } from "lit";
// register globally so we can make sure there is only one
globalThis.I18NManagerStore = globalThis.I18NManagerStore || {};
globalThis.I18NManagerStore.requestAvailability = () => {
  if (
    !globalThis.I18NManagerStore.instance &&
    globalThis.document &&
    globalThis.document.body
  ) {
    globalThis.I18NManagerStore.instance =
      globalThis.document.createElement("i18n-manager");
    globalThis.document.body.appendChild(globalThis.I18NManagerStore.instance);
  }
  return globalThis.I18NManagerStore.instance;
};
export const I18NManagerStore =
  globalThis.I18NManagerStore.requestAvailability();
const FALLBACK_LANG = "en";
const FALLBACK_DIR = "ltr";
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
    this.windowControllers = new AbortController();
    // fetch caching to reduce calls for json files
    this.fetchTargets = {};
    // reference to all elements that care about localization
    this.elements = [];
    // quick set of all locales
    this.locales = new Set([]);
    // set initially based on document
    this.lang = this.documentLang;
    this.dir = this.documentDir;
  }
  /**
   * Set document language from these common sources
   */
  get documentLang() {
    return (
      globalThis.document.body.getAttribute("xml:lang") ||
      globalThis.document.body.getAttribute("lang") ||
      globalThis.document.documentElement.getAttribute("xml:lang") ||
      globalThis.document.documentElement.getAttribute("lang") ||
      globalThis.navigator.language ||
      FALLBACK_LANG
    );
  }
  /**
   * Set document direction from these common sources
   */
  get documentDir() {
    return (
      globalThis.document.body.getAttribute("xml:dir") ||
      globalThis.document.body.getAttribute("dir") ||
      globalThis.document.documentElement.getAttribute("xml:dir") ||
      globalThis.document.documentElement.getAttribute("dir") ||
      FALLBACK_DIR
    );
  }
  /**
   * Life cycle
   */
  connectedCallback() {
    this.__ready = true;
    globalThis.addEventListener(
      "i18n-manager-register-element",
      this.registerLocalizationEvent.bind(this),
      { signal: this.windowControllers.signal },
    );

    globalThis.addEventListener(
      "languagechange",
      this.changeLanguageEvent.bind(this),
      { signal: this.windowControllers.signal },
    );
  }
  /**
   * Life cycle
   */
  disconnectedCallback() {
    this.windowControllers.abort();
  }
  /**
   * Browser level languagechange event
   */
  changeLanguageEvent(e) {
    // will trigger the language to update in all related elements
    // @see attributeChangedCallback
    this.lang = e.detail;
  }
  /**
   * Register a localization via event; this allow for a 0 dependency solution!
   */
  registerLocalizationEvent(e) {
    let detail = this.detailNormalize(e.detail);
    // ensure we have a namespace for later use
    if (detail.namespace && detail.localesPath && detail.locales) {
      this.registerLocalization(detail);
    }
  }
  /**
   * Apply normalization to all details bubbling up to improve
   * flexibility and patching to how other people implement our
   * API. This also can improve DX downstream by making educated
   * guesses as to intent (like namespace, localesPath, updateCallback)
   */
  detailNormalize(detail) {
    if (!detail.namespace && detail.context) {
      detail.namespace = detail.context.tagName.toLowerCase();
    }
    // support fallback calls for requestUpdate (LitElement) and render if nothing set
    if (!detail.updateCallback && detail.context) {
      if (detail.context.requestUpdate) {
        detail.updateCallback = "requestUpdate";
      } else if (detail.context.render) {
        detail.updateCallback = "render";
      }
    }
    if (!detail.localesPath && detail.basePath) {
      // clean up path and force adding locales. part security thing as well
      detail.localesPath = `${decodeURIComponent(detail.basePath)}/../locales`;
    }
    // minimum requirement to operate but still
    // should pull from other namespace if exists
    if (detail.context && detail.namespace) {
      // establish the fallback automatically if we are supplied defaults
      if (detail.context.t) {
        detail.context._t = { ...detail.context.t };
      }
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
  /**
   * Register a localization with the manager
   */
  registerLocalization(detail) {
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
      // store in this.locales for quick "do we support this" look up
      if (detail && detail.locales) {
        detail.locales.forEach(this.locales.add, this.locales);
      }
      // timing issue, see if we are ready + a language and that it happened PRIOR
      // to registration just now but match against locales we support
      // and it being the set language already
      if (
        this.lang &&
        this.__ready &&
        detail.locales &&
        detail.locales.includes(this.lang)
      ) {
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
          },
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
        try {
          return (
            el.locales.includes(lang) || el.locales.includes(langPieces[0])
          );
        } catch (e) {
          console.error("i18n registration incorrect in:", el, e);
        }
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
            // reset to the fallback language t value
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
            },
          );
          if (el.context) {
            // set values
            for (var id in this.fetchTargets[fetchTarget]) {
              el.context.t[id] = this.fetchTargets[fetchTarget][id];
            }
            // spread can generate notify statements in downstream elements
            // this probably makes updateCallback irrelevant in reactive
            // projects like LitElement but just to be double sure
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
  /**
   * Life cycle
   */
  static get observedAttributes() {
    return ["lang", "dir"];
  }
  /**
   * Life cycle
   */
  attributeChangedCallback(attr, oldValue, newValue) {
    // notify of attr change
    if (attr === "lang" || attr === "dir") {
      this.dispatchEvent(
        new CustomEvent(`${attr}-changed`, {
          detail: {
            value: newValue,
          },
        }),
      );
    }
    // we are NOT moving to the default from something
    if (attr === "lang" && newValue && this.__ready) {
      this.updateLanguage(newValue);
    }
  }
  // getters and setters to map props to attributes
  get lang() {
    return this.getAttribute("lang");
  }
  set lang(val) {
    if (!val) {
      this.removeAttribute("lang");
    } else {
      this.setAttribute("lang", val);
    }
  }
  get dir() {
    return this.getAttribute("dir");
  }
  set dir(val) {
    if (!val) {
      this.removeAttribute("dir");
    } else {
      this.setAttribute("dir", val);
    }
  }
}
globalThis.customElements.define(I18NManager.tag, I18NManager);
export { I18NManager };
