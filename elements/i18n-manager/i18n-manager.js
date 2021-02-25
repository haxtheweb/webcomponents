/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";

// register globally so we can make sure there is only one
window.I18NManagerStore = window.I18NManagerStore || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
export const I18NManagerStore = (window.I18NManagerStore.requestAvailability = () => {
  if (!window.I18NManagerStore.instance) {
    window.I18NManagerStore.instance = document.createElement("i18n-manager");
    document.body.appendChild(window.I18NManagerStore.instance);
  }
  return window.I18NManagerStore.instance;
});
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
    if (e.detail.import && e.detail.context && e.detail.locales) {
      this.registerTranslation(
        e.detail.importPath,
        e.detail.context,
        e.detail.locales,
        e.detail.updateCallback
      );
    }
  }
  registerTranslation(importPath, context, locales, updateCallback) {
    e.detail.element;
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
   * LitElement render callback
   */
  render() {
    return html`
      <div>
        <slot></slot>
      </div>
    `;
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
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
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
