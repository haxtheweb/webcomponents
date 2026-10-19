import { autorun, toJS } from "mobx";
import { store } from "./haxcms-site-store.js";
import { DarkmodeToggle } from "./ui/darkmode-toggle/darkmode-toggle.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

export class HAXCMSDarkmodeToggle extends I18NMixin(DarkmodeToggle) {
  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      darkModeToast: "I'm ascared of the dark",
      lightModeToast: "Sunny day it is",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../locales/", import.meta.url).href,
    });
    autorun(() => {
      const _mobx_val_0 = toJS(store.darkMode);
      Promise.resolve().then(() => {
        this.checked = _mobx_val_0;
        if (globalThis.matchMedia("(prefers-color-scheme: dark)").matches) {
          this.disabled = true;
        } else {
          this.disabled = false;
        }
      });
    });
  }

  static get tag() {
    return "haxcms-darkmode-toggle";
  }

  toggle() {
    this.checked = !this.checked;
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "checked" && oldValue !== undefined) {
        requestAnimationFrame(() => {
          store.darkMode = this[propName];
          store.playSound("click");
          if (this[propName]) {
            store.toast(this.t.darkModeToast, 2000, { fire: true });
          } else {
            store.toast(this.t.lightModeToast, 2000, { hat: "random" });
          }
        });
      }
    });
  }
}
globalThis.customElements.define(
  HAXCMSDarkmodeToggle.tag,
  HAXCMSDarkmodeToggle,
);
