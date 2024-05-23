import { autorun, toJS } from "mobx";
import { store } from "./haxcms-site-store.js";
import { RPGCharacterToast } from "@haxtheweb/app-hax/lib/rpg-character-toast/rpg-character-toast.js";

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
    globalThis.addEventListener(
      "haxcms-toast-hide",
      this.hideSimpleToast.bind(this),
      { signal: this.windowControllers.signal },
    );
    globalThis.addEventListener(
      "haxcms-toast-show",
      this.showSimpleToast.bind(this),
      { signal: this.windowControllers.signal },
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
globalThis.HAXCMSToast = globalThis.HAXCMSToast || {};

globalThis.HAXCMSToast.requestAvailability = () => {
  if (!globalThis.HAXCMSToast.instance) {
    globalThis.HAXCMSToast.instance = globalThis.document.createElement(
      HAXCMSToast.tag,
    );
    globalThis.document.body.appendChild(globalThis.HAXCMSToast.instance);
  }
  return globalThis.HAXCMSToast.instance;
};
export const HAXCMSToastInstance = globalThis.HAXCMSToast.requestAvailability();
