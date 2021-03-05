import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";
/**
 * registration normalization so that we can ensure the entire HAXcms
 * base layer implements a uniform series of localizations
 */
export const HAXCMSI18NMixin = function (SuperClass) {
  return class extends I18NMixin(SuperClass) {
    constructor() {
      super();
      // register a centralized namespace so that everything in HAXcms
      // can leverage the same localization bucket
      this.registerLocalization({
        context: this,
        namespace: "haxcms",
      });
    }
  };
};
