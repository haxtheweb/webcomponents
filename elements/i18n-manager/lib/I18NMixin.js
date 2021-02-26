import { I18NManagerStore } from "../i18n-manager.js";
export const I18NMixin = function (SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
      this.t = {};
    }
    pathFromUrl(url) {
      return url.substring(0, url.lastIndexOf("/") + 1);
    }
    // pass through to the manager
    registerTranslation(detail) {
      // ensure we have a tagName for later use
      if (!detail.tagName) {
        detail.tagName = detail.context.tagName.toLowerCase();
      }
      // support fallback calls for requestUpdate (LitElement) and render if nothing set
      if (!detail.updateCallback) {
        if (detail.context.requestUpdate) {
          detail.updateCallback = "requestUpdate";
        } else if (detail.context.render) {
          detail.render = "render";
        }
      }
      // clean up path and force adding locales. part security thing as well
      detail.localesPath = `${this.pathFromUrl(
        decodeURIComponent(detail.basePath)
      )}/locales`;
      // register the translation directly
      I18NManagerStore.registerTranslation(detail);
    }
    connectedCallback() {
      super.connectedCallback();
      // store this for later if language is switched back to default
      this._t = { ...this.t };
    }
  };
};
