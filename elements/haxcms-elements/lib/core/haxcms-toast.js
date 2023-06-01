import { autorun, toJS } from "mobx";
import { store } from "./haxcms-site-store.js";
import { RPGCharacterToast } from "@lrnwebcomponents/app-hax/lib/rpg-character-toast/rpg-character-toast.js";

export class HAXCMSToast extends RPGCharacterToast {
  static get tag() {
    return "haxcms-toast";
  }

  constructor() {
    super();
    this.windowControllers = new AbortController();
    autorun(() => {
      this.userName = toJS(store.userData.userName);
    });
    autorun(() => {
      this.darkMode = toJS(store.darkMode);
    });
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(
      "haxcms-toast-hide",
      this.hideSimpleToast.bind(this),
      { signal: this.windowControllers.signal }
    );
    window.addEventListener(
      "haxcms-toast-show",
      this.showSimpleToast.bind(this),
      { signal: this.windowControllers.signal }
    );
  }

  hideSimpleToast(e) {
    if (!this.alwaysvisible) {
      // tricks into closing via event in a graceful way
      this.style.animation = "forcedfadeout 0.6s .3s";
      this.awaitingMerlinInput = false;
      setTimeout(() => {
        this.hide();
      }, 0);
    }
  }

  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    this.windowControllers.abort();
    super.disconnectedCallback();
  }
}
customElements.define(HAXCMSToast.tag, HAXCMSToast);
window.HAXCMSToast = window.HAXCMSToast || {};

window.HAXCMSToast.requestAvailability = () => {
  if (!window.HAXCMSToast.instance) {
    window.HAXCMSToast.instance = document.createElement(HAXCMSToast.tag);
    document.body.appendChild(window.HAXCMSToast.instance);
  }
  return window.HAXCMSToast.instance;
};
export const HAXCMSToastInstance = window.HAXCMSToast.requestAvailability();
