import { DisqusEmbed } from "../disqus-embed";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";

class HAXCMSSiteDisqus extends DisqusEmbed {
  constructor() {
    super();
    autorun(() => {
      const _mobx_val_0 = toJS(store.activeTitle);
      Promise.resolve().then(() => {
        this.pageTitle = _mobx_val_0;
      });
    });
    autorun(() => {
      const _mobx_val_0 = toJS(store.activeId);
      Promise.resolve().then(() => {
        this.pageIdentifier = _mobx_val_0;
      });
    });
    autorun(() => {
      const _mobx_val_0 = toJS(store.location);
      Promise.resolve().then(() => {
        const location = _mobx_val_0;
        if (location && location.route && location.route.path) {
          this.pageURL = location.route.path;
        }
      });
    });
    autorun(() => {
      const _mobx_val_0 = toJS(store.manifest);
      Promise.resolve().then(() => {
        const manifest = _mobx_val_0;
        if (
          manifest &&
          manifest.metadata &&
          manifest.metadata.site &&
          manifest.metadata.site.lang
        ) {
          this.lang = manifest.metadata.site.lang;
        }
      });
    });
  }
  static get tag() {
    return "haxcms-site-disqus";
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}

globalThis.customElements.define(HAXCMSSiteDisqus.tag, HAXCMSSiteDisqus);
export { HAXCMSSiteDisqus };
