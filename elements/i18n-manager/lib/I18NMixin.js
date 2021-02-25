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
    registerI18N() {}
  };
};
