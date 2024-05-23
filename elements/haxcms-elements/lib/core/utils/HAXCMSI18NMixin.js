import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
/**
 * registration normalization so that we can ensure the entire HAXcms
 * base layer implements a uniform series of localizations
 */
export const HAXCMSI18NMixin = function (SuperClass) {
  return class extends I18NMixin(SuperClass) {
    constructor() {
      super();
      this.HAXCMSI18NMixinBase = "../../";
    }
    firstUpdated(changedProperties) {
      if (super.firstUpdated) {
        super.firstUpdated(changedProperties);
      }
      // register a centralized namespace so that everything in HAXcms
      // can leverage the same localization bucket
      this.registerLocalization({
        context: this,
        localesPath: new URL(
          this.HAXCMSI18NMixinBase + "locales/haxcms.es.json",
          import.meta.url,
        ).href.replace("/haxcms.es.json", "/"),
        namespace: "haxcms",
      });
    }
  };
};
