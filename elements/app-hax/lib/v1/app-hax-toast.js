import { store } from "./AppHaxStore.js";
import { autorun, toJS } from "mobx";
import { RPGCharacterToast } from "../rpg-character-toast/rpg-character-toast.js";

export class AppHaxToast extends RPGCharacterToast {
  static get tag() {
    return "app-hax-toast";
  }

  constructor() {
    super();
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
      "app-hax-toast-hide",
      this.hideSimpleToast.bind(this)
    );
    window.addEventListener(
      "app-hax-toast-show",
      this.showSimpleToast.bind(this)
    );
  }

  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    window.removeEventListener(
      "app-hax-toast-hide",
      this.hideSimpleToast.bind(this)
    );
    window.removeEventListener(
      "app-hax-toast-show",
      this.showSimpleToast.bind(this)
    );
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
