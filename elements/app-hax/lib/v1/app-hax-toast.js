import { autorun, toJS } from "mobx";
import { store } from "./AppHaxStore.js";
import { RPGCharacterToast } from "../rpg-character-toast/rpg-character-toast.js";

export class AppHaxToast extends RPGCharacterToast {
  static get tag() {
    return "app-hax-toast";
  }

  constructor() {
    super();
    this.windowControllers = new AbortController();
    autorun(() => {
      this.userName = toJS(store.user.name);
    });
    autorun(() => {
      this.darkMode = toJS(store.darkMode);
    });
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(
      "haxcms-toast-hide",
      this.hideSimpleToast.bind(this), { signal: this.windowControllers.signal });

    window.addEventListener(
      "haxcms-toast-show",
      this.showSimpleToast.bind(this), { signal: this.windowControllers.signal });
  }

  hideSimpleToast(e) {
    this.hide();
  }

  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    this.windowControllers.abort();
    super.disconnectedCallback();
  }
}
customElements.define(AppHaxToast.tag, AppHaxToast);
window.AppHaxToast = window.AppHaxToast || {};

window.AppHaxToast.requestAvailability = () => {
  if (!window.AppHaxToast.instance) {
    window.AppHaxToast.instance = document.createElement(AppHaxToast.tag);
    document.body.appendChild(window.AppHaxToast.instance);
  }
  return window.AppHaxToast.instance;
};
export const AppHaxToastInstance = window.AppHaxToast.requestAvailability();
