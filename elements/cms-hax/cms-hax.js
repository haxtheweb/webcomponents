import { LitElement, html, css } from "lit";
import "@polymer/iron-ajax/iron-ajax.js";
import "@haxtheweb/h-a-x/h-a-x.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
/**
 * `cms-hax`
 * @element cms-hax
 * @demo ../../demo/index.html
 */
class CmsHax extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          font-size: 16px;
          box-sizing: content-box;
        }
      `,
    ];
  }
  render() {
    return html`
      <iron-ajax
        id="pageupdateajax"
        url="${this.endPoint}"
        method="${this.method}"
        content-type="application/json"
        handle-as="json"
        @response="${this._handleUpdateResponse}"
      ></iron-ajax>
      <h-a-x app-store="${this.__appStore}"></h-a-x>
    `;
  }

  static get tag() {
    return "cms-hax";
  }

  decodeHTMLEntities(text) {
    var entities = [
      ["amp", "&"],
      ["apos", "'"],
      ["#x27", "'"],
      ["#x2F", "/"],
      ["#39", "'"],
      ["#47", "/"],
      ["lt", "<"],
      ["gt", ">"],
      ["nbsp", " "],
      ["quot", '"'],
    ];

    for (var i = 0, max = entities.length; i < max; ++i)
      text = text.replace(
        new RegExp("&" + entities[i][0] + ";", "g"),
        entities[i][1],
      );

    return text;
  }
  static get properties() {
    return {
      ready: {
        type: Boolean,
      },
      /**
       * Default the panel to open
       */
      openDefault: {
        type: Boolean,
        reflect: true,
        attribute: "open-default",
      },
      /**
       * Hide the panel operations (save and cancel),
       */
      hidePanelOps: {
        type: Boolean,
        attribute: "hide-panel-ops",
      },
      offsetMargin: {
        type: String,
        reflect: true,
        attribute: "offset-margin",
      },
      /**
       * Direction to elementAlign the hax edit panel
       */
      elementAlign: {
        type: String,
        attribute: "element-align",
      },
      /**
       * allowed Tags, usually as dictated by the input filtering
       * layer of the backend system that HAX is riding on.
       * While not fullproof, this at least will enforce front-end
       * filtering to match what actually is going to be allowed
       * to be saved in the first place.
       */
      allowedTags: {
        type: Array,
        attribute: "allowed-tags",
      },
      /**
       * Location to save content to.
       */
      endPoint: {
        type: String,
        attribute: "end-point",
      },
      /**
       * Method to save content.
       */
      method: {
        type: String,
      },
      /**
       * Connection object for talking to an app store.
       */
      appStoreConnection: {
        type: String,
        attribute: "app-store-connection",
      },
      __appStore: {
        type: String,
      },
      /**
       * syncBody
       */
      syncBody: {
        type: Boolean,
        attribute: "sync-body",
      },
      /**
       * Only available if syncBody is true; this allows data binding to the value being worked on in hax-body tag
       */
      bodyValue: {
        type: String,
        attribute: "body-value",
      },
      /**
       * Flag to hide the toast.
       */
      hideMessage: {
        type: Boolean,
        attribute: "hide-message",
      },
      /**
       * Optional URL to redirect to once we save.
       */
      redirectLocation: {
        type: String,
        attribute: "redirect-location",
      },
      /**
       * Option to redirect once we save successfully
       */
      redirectOnSave: {
        type: Boolean,
        attribute: "redirect-on-save",
      },
      __imported: {
        type: Boolean,
      },
    };
  }

  /**
   * Ensure we've imported our content on initial setup
   */
  _activeHaxBodyUpdated(ready) {
    // ensure we import our content once we get an initial registration of active body
    if (!this.__imported) {
      this.__imported = true;
      // see what's inside of this, in a template tag
      let children = this.querySelector("template");
      // convert this template content into the real thing
      // this helps with correctly preserving everything on the way down
      if (children != null) {
        HAXStore.activeHaxBody.importContent(children.innerHTML);
        setTimeout(() => {
          // NOW we have the data imported
          if (this.openDefault) {
            HAXStore.editMode = true;
          }
        }, 2000);
      }
    }
  }

  /**
   * Calculate if we have anywhere to redirect to.
   */
  _computeRedirectOnSave(redirectLocation) {
    if (typeof redirectLocation !== typeof undefined) {
      return true;
    }
    return false;
  }
  /**
   * Set certain data bound values to the store once it's ready
   */
  _noticeTagChanges(allowedTags, hidePanelOps, offsetMargin, elementAlign) {
    if (HAXStore.ready) {
      // double check because this can cause issues
      if (allowedTags) {
        const defaultTags = HAXStore.validTagList;
        HAXStore.validTagList = [...defaultTags, ...allowedTags];
      }
      setTimeout(() => {
        HAXStore.haxTray.hidePanelOps = hidePanelOps;
        HAXStore.haxTray.offsetMargin = offsetMargin;
        HAXStore.elementAlign = elementAlign;
        setTimeout(() => {
          // NOW we have the data imported
          if (this.openDefault) {
            HAXStore.editMode = true;
          }
        }, 2000);
      }, 0);
    }
  }
  /**
   * Set certain data bound values to the store once it's ready
   */
  _storeReady(e) {
    // delay as there can be some timing issues with attributes in CMSs
    setTimeout(() => {
      // trigger the update of different parts of the global state
      this._noticeTagChanges(
        this.allowedTags,
        this.hidePanelOps,
        this.offsetMargin,
        this.elementAlign,
      );
      this.__applyMO();
      this.windowControllersReady.abort();
    }, 0);
  }
  _appstoreLoaded(e) {
    setTimeout(() => {
      this.ready = true;
      this.windowControllersLoaded.abort();
    }, 0);
  }
  /**
   * Created life cycle
   */
  constructor() {
    super();
    this.windowControllers = new AbortController();
    this.windowControllersReady = new AbortController();
    this.windowControllersLoaded = new AbortController();

    this.ready = false;
    globalThis.addEventListener(
      "hax-store-ready",
      this._storeReady.bind(this),
      {
        once: true,
        passive: true,
        signal: this.windowControllersReady.signal,
      },
    );

    globalThis.addEventListener(
      "hax-store-app-store-loaded",
      this._appstoreLoaded.bind(this),
      {
        once: true,
        passive: true,
        signal: this.windowControllersLoaded.signal,
      },
    );
    globalThis.addEventListener(
      "hax-save-body-value",
      this._saveFired.bind(this),
      {
        signal: this.windowControllers.signal,
      },
    );

    globalThis.addEventListener("hax-cancel", this._cancelFired.bind(this), {
      signal: this.windowControllers.signal,
    });

    this.__lock = false;
    this.endPoint = null;
    this.openDefault = false;
    this.hidePanelOps = false;
    this.elementAlign = "left";
    this.method = "PUT";
    this.syncBody = false;
    this.bodyValue = "";
    this.hideMessage = false;
    this.__imported = false;
    setTimeout(() => {
      import("@haxtheweb/cms-hax/lib/cms-token.js");
      import("@haxtheweb/cms-hax/lib/cms-block.js");
      import("@haxtheweb/cms-hax/lib/cms-views.js");
      import("@haxtheweb/cms-hax/lib/cms-entity.js");
    }, 0);
  }
  _makeAppStore(val) {
    this.__appStore = this.decodeHTMLEntities(val);
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "redirectLocation") {
        this.redirectOnSave = this._computeRedirectOnSave(this[propName]);
      }
      if (propName == "ready" && this.ready && this.shadowRoot) {
        this._activeHaxBodyUpdated(this.ready);
      }
      if (propName == "appStoreConnection") {
        this._makeAppStore(this[propName]);
      }
      if (
        [
          "allowedTags",
          "hidePanelOps",
          "offsetMargin",
          "elementAlign",
        ].includes(propName)
      ) {
        this._noticeTagChanges(
          this.allowedTags,
          this.hidePanelOps,
          this.offsetMargin,
          this.elementAlign,
        );
      }
    });
  }
  /**
   * detached life cycle
   */
  disconnectedCallback() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    this.windowControllers.abort();
    super.disconnectedCallback();
  }

  async __applyMO() {
    // notice ANY change to body and bubble up, only when we are attached though
    if (!this._observer && this.syncBody && HAXStore.activeHaxBody) {
      this._observer = new MutationObserver(async (mutations) => {
        if (!this.__lock) {
          this.__lock = true;
          this.dispatchEvent(
            new CustomEvent("hax-body-content-changed", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: await HAXStore.activeHaxBody.haxToContent(),
            }),
          );
          setTimeout(() => {
            this.__lock = false;
          }, 100);
        }
      });
      this._observer.observe(HAXStore.activeHaxBody, {
        childList: true,
        subtree: true,
      });
    }
  }
  /**
   * _cancelFired
   */
  _cancelFired(e) {
    // cancel
    HAXStore.skipExitTrap = true;
    HAXStore.editMode = false;
    // if there's a redirect on save, then redirect to it bc of the cancel event
    if (this.redirectOnSave) {
      setTimeout(() => {
        // trigger redirect
        globalThis.location = this.redirectLocation;
      }, 0);
    }
  }

  /**
   * _saveFired
   */
  async _saveFired(e) {
    // generate sanitized content
    if (this.endPoint) {
      HAXStore.skipExitTrap = true;
      // Only exit edit mode if keepEditMode is not explicitly set to true
      if (HAXStore.editMode && !e.detail.keepEditMode) {
        HAXStore.editMode = false;
      }
      this.shadowRoot.querySelector("#pageupdateajax").body = e.detail.value;
      // send the request
      this.shadowRoot.querySelector("#pageupdateajax").generateRequest();
    }
  }

  /**
   * _handleUpdateResponse
   */
  _handleUpdateResponse(e) {
    if (!this.hideMessage) {
      const evt = new CustomEvent("simple-toast-show", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          text: "Saved!",
          duration: 3000,
        },
      });
      globalThis.dispatchEvent(evt);
      // custom event for things that want to know we just saved
      this.dispatchEvent(
        new CustomEvent("cms-hax-saved", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: true,
        }),
      );
      // support auto redirecting on save if that's been requested
      // in the integration point
      if (this.redirectOnSave) {
        setTimeout(() => {
          // trigger redirect
          globalThis.location = this.redirectLocation;
        }, 2000);
      }
    }
  }
}
globalThis.customElements.define(CmsHax.tag, CmsHax);
export { CmsHax };
