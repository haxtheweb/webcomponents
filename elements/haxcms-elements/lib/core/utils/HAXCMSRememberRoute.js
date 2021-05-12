import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";

const HAXCMSRememberRoute = function (SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
      const resumeMessage = "Resume where you left off last session?";
      this.menuOpen = true;
      this.__evaluateRoute = false;
      if (this.t) {
        this.t.resumeMessage = resumeMessage;
        this.t.resume = "Resume";
      } else {
        this.t = {
          resumeMessage: resumeMessage,
          resume: "Resume",
        };
      }
      autorun((reaction) => {
        const activePathName = toJS(store.location.pathname);
        if (activePathName && this.__evaluateRoute) {
          window.localStorage.setItem("HAXCMSlastRoute", activePathName);
        }
      });
    }
    firstUpdated(changedProperties) {
      if (super.firstUpdated) {
        super.firstUpdated(changedProperties);
      }
      setTimeout(() => {
        if (
          window.localStorage.getItem("HAXCMSlastRoute") &&
          window.localStorage.getItem("HAXCMSlastRoute") !=
            toJS(store.location.pathname)
        ) {
          import("@lrnwebcomponents/simple-toast/simple-toast.js").then(() => {
            window.SimpleToast.requestAvailability();
            let slot = document.createElement("a");
            slot.setAttribute(
              "href",
              window.localStorage.getItem("HAXCMSlastRoute")
            );
            slot.addEventListener("click", this.resumeLastRoute.bind(this));
            slot.innerHTML = `<button>${this.t.resume}</button>`;
            store.toast(
              this.t.resumeMessage,
              4000,
              "capsule",
              null,
              null,
              slot
            );
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
