import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";

function localStorageGet(name) {
  try {
    return localStorage.getItem(name);
  } catch (e) {
    return false;
  }
}

function localStorageSet(name, newItem) {
  try {
    return localStorage.setItem(name, newItem);
  } catch (e) {
    return false;
  }
}

const HAXCMSRememberRoute = function (SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
      const resumeMessage = "Resume where you left off last session?";
      this.__evaluateRoute = false;
      if (!this.t) {
        this.t = {};
      }
      if (this.t) {
        this.t = {
          ...this.t,
          resumeMessage: resumeMessage,
          resume: "Resume",
        };
      }
      autorun((reaction) => {
        const activePathName = toJS(store.location.pathname);
        if (activePathName && this.__evaluateRoute) {
          localStorageSet(
            `HAXCMSlastRoute-${store.manifest.metadata.site.name}`,
            activePathName
          );
        }
      });
    }
    firstUpdated(changedProperties) {
      if (super.firstUpdated) {
        super.firstUpdated(changedProperties);
      }
      setTimeout(() => {
        if (
          store &&
          store.location &&
          store.location.pathname &&
          localStorageGet(
            `HAXCMSlastRoute-${store.manifest.metadata.site.name}`
          ) &&
          localStorageGet(
            `HAXCMSlastRoute-${store.manifest.metadata.site.name}`
          ) != toJS(store.location.pathname)
        ) {
          import("@lrnwebcomponents/simple-toast/simple-toast.js").then(() => {
            window.SimpleToast.requestAvailability();
            let slot = document.createElement("a");
            slot.setAttribute(
              "href",
              localStorageGet(
                `HAXCMSlastRoute-${store.manifest.metadata.site.name}`
              )
            );
            slot.addEventListener("click", this.resumeLastRoute.bind(this));
            slot.innerHTML = `<button>${this.t.resume}</button>`;
            const urlParams = new URLSearchParams(window.location.search);
            const format = urlParams.get("format");
            // ensure we don't show this if we have an alternate format request
            if (!format) {
              store.toast(
                this.t.resumeMessage,
                8000,
                "capsule",
                null,
                null,
                slot
              );
            }
          });
        }
        this.__evaluateRoute = true;
      }, 1000);
    }
    /**
     * Respond to confirmation of wanting to resume the previous route
     */
    resumeLastRoute(e) {
      window.dispatchEvent(
        new CustomEvent("simple-toast-hide", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: false,
        })
      );
    }
  };
};

export { HAXCMSRememberRoute };
