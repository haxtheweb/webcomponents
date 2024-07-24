import { I18NManagerStore } from "../i18n-manager.js";
export { I18NManagerStore };
// SuperClass to simplify wiring up and noticing changes to t values
// this is not required as you can simply use the event system
// to keep to 0 dependencies but this helps simplify and standardize
// integration with lots of downstream i18n files
export const I18NMixin = function (SuperClass) {
  return class extends SuperClass {
    /**
     * Life cycle
     */
    constructor() {
      super();
      if (!this.t) {
        this.t = {};
      }
    }
    /**
     * Enhanced data reactivity for LitElement if available
     */
    static get properties() {
      return {
        ...super.properties,
        t: {
          type: Object,
        },
      };
    }
    // pass through to the manager, automatically adding some namespace values
    registerLocalization(detail) {
      // ensure we have a namespace for later use
      if (
        !detail.namespace &&
        detail.context &&
        detail.context.tagName &&
        detail.context.tagName
      ) {
        detail.namespace = detail.context.tagName.toLowerCase();
      }
      // support fallback calls for requestUpdate; you can always supply one
      if (!detail.updateCallback) {
        if (detail.context.requestUpdate) {
          detail.updateCallback = "requestUpdate";
          // automatically set for common VanillaJS convention
        } else if (detail.context.render) {
          detail.updateCallback = "render";
        }
      }
      // auto-detect localePath if we have a basePath
      // this is another short hand that allows for enforcing the location
      // of the locales bucket of files. You can define where these are
      // per request but this helps simplify the original implementation
      if (!detail.localesPath && detail.basePath) {
        // clean up path and force adding locales. part security thing as well
        detail.localesPath = `${decodeURIComponent(
          detail.basePath,
        )}/../locales`;
      }
      // register the localization directly, skipping event
      // this also ensures that things leveraging the Mixin will never miss
      // the singleton being registered
      if (I18NManagerStore) {
        I18NManagerStore.registerLocalization(detail);
      }
    }
  };
};
