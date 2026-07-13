import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { HAXCMSI18NMixin } from "./HAXCMSI18NMixin.js";
import { autorun, toJS } from "mobx";
import { localStorageGet, localStorageSet } from "@haxtheweb/utils/utils.js";

const HAXCMSRememberRoute = function (SuperClass) {
  return class extends HAXCMSI18NMixin(SuperClass) {
    constructor() {
      super();
      const resumeMessage = "Resume where you left off last session?";
      this.__evaluateRoute = false;
      this.__disposer = this.__disposer ? this.__disposer : [];
      this.t.resumeMessage = resumeMessage;
      this.t.resume = "Resume";
      this.__disposer.push(
        autorun((reaction) => {
          const _mobx_val_0 = toJS(
            store && store.location && store.location.pathname
              ? store.location.pathname
              : null,
          );
          Promise.resolve().then(() => {
            if (_mobx_val_0 && this.__evaluateRoute) {
              const siteName =
                store.manifest &&
                store.manifest.metadata &&
                store.manifest.metadata.site
                  ? store.manifest.metadata.site.name
                  : null;
              if (siteName) {
                localStorageSet(
                  `HAXCMSlastRoute-${siteName}`,
                  _mobx_val_0,
                );
              }
            }
          });
        }),
      );
    }
    firstUpdated(changedProperties) {
      if (super.firstUpdated) {
        super.firstUpdated(changedProperties);
      }
      setTimeout(() => {
        const siteName =
          store.manifest &&
          store.manifest.metadata &&
          store.manifest.metadata.site
            ? store.manifest.metadata.site.name
            : null;
        if (
          siteName &&
          store &&
          store.location &&
          store.location.pathname &&
          localStorageGet(
            `HAXCMSlastRoute-${siteName}`,
          ) &&
          localStorageGet(
            `HAXCMSlastRoute-${siteName}`,
          ) != toJS(store.location.pathname)
        ) {
          let btn = globalThis.document.createElement("a");
          btn.setAttribute(
            "href",
            localStorageGet(
              `HAXCMSlastRoute-${siteName}`,
            ),
          );
          btn.addEventListener("click", this.resumeLastRoute.bind(this));
          btn.innerHTML = `<button style="padding:4px;font-weight:bold;background-color: black; color: white; border: 4px solid black; border-radius:none;margin-left:4px;cursor: pointer;">${this.t.resume}</button>`;
          const urlParams = new URLSearchParams(globalThis.location.search);
          const format = urlParams.get("format");
          // ensure we don't show this if we have an alternate format request
          if (!format) {
            store.toast(
              this.t.resumeMessage,
              5000,
              {},
              "capsule",
              null,
              null,
              btn,
            );
          }
        }
        this.__evaluateRoute = true;
      }, 500);
    }
    disconnectedCallback() {
      for (var i in this.__disposer) {
        const disposer = this.__disposer[i];
        if (typeof disposer === "function") {
          disposer();
        } else if (disposer && typeof disposer.dispose === "function") {
          disposer.dispose();
        }
      }
      this.__disposer = [];
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
    }
    /**
     * Respond to confirmation of wanting to resume the previous route
     */
    resumeLastRoute(e) {
      globalThis.dispatchEvent(
        new CustomEvent("haxcms-toast-hide", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: false,
        }),
      );
    }
  };
};

export { HAXCMSRememberRoute };
