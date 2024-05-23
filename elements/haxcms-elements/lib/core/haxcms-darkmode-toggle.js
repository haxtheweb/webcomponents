import { autorun, toJS } from "mobx";
import { store } from "./haxcms-site-store.js";
import { WiredDarkmodeToggle } from "@haxtheweb/app-hax/lib/wired-darkmode-toggle/wired-darkmode-toggle.js";

export class HAXCMSDarkmodeToggle extends WiredDarkmodeToggle {
  constructor() {
    super();
    autorun(() => {
      this.checked = toJS(store.darkMode);
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
            store.toast("I'm ascared of the dark", 2000, { fire: true });
          } else {
            store.toast("Sunny day it is", 2000, { hat: "random" });
          }
        });
      }
    });
  }
}
customElements.define(HAXCMSDarkmodeToggle.tag, HAXCMSDarkmodeToggle);
