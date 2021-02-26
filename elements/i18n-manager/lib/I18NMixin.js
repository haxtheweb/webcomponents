import { I18NManagerStore } from "../i18n-manager.js";
export const I18NMixin = function (SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
      this.elText = {};
    }
    pathFromUrl(url) {
      return url.substring(0, url.lastIndexOf("/") + 1);
    }
    // pass through to the manager
    registerTranslation(detail) {
      // clean up path and force adding locales. part security thing as well
      detail.localesPath = `${this.pathFromUrl(
        decodeURIComponent(detail.basePath)
      )}/locales`;
      I18NManagerStore.registerTranslation(detail);
    }
    static get properties() {
      return {
        ...super.properties,
        elText: {
          type: Object,
        },
      };
    }
  };
};
