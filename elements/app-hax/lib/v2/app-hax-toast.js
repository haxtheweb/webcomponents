import { autorun, toJS } from "mobx";
import { store } from "./AppHaxStore.js";
import {
  HAXCMSToast,
  HAXCMSToastInstance,
} from "@haxtheweb/haxcms-elements/lib/core/haxcms-toast.js";

/**
 * `app-hax-toast`
 * app-hax uses the same HAX UI toast as the rest of the system
 * (haxcms-toast). This module stays so existing imports keep working; it
 * points the shared toast at the app-hax store for the person's character
 * and dark mode instead of drawing a second, older toast.
 *
 * Only one toast listens for haxcms-toast-show: the shared haxcms-toast
 * instance. The app-hax-toast tag is still defined (same element as
 * haxcms-toast) for anything that creates it by name, but it is no longer
 * created on its own.
 * @element app-hax-toast
 */
export class AppHaxToast extends HAXCMSToast {
  static get tag() {
    return "app-hax-toast";
  }
}
if (!globalThis.customElements.get(AppHaxToast.tag)) {
  globalThis.customElements.define(AppHaxToast.tag, AppHaxToast);
}

// app-hax keeps the signed in user and dark mode in its own store; the
// shared toast reads the HAXcms site store, which app-hax does not fill.
// These run after the toast's own autoruns, so app-hax's values win.
autorun(() => {
  const userName = toJS(store.user.name);
  Promise.resolve().then(() => {
    HAXCMSToastInstance.userName = userName;
  });
});
autorun(() => {
  const darkMode = toJS(store.darkMode);
  Promise.resolve().then(() => {
    HAXCMSToastInstance.darkMode = darkMode;
  });
});

globalThis.AppHaxToast = globalThis.AppHaxToast || {};
globalThis.AppHaxToast.requestAvailability = () => HAXCMSToastInstance;
globalThis.AppHaxToast.instance = HAXCMSToastInstance;
export const AppHaxToastInstance = HAXCMSToastInstance;
