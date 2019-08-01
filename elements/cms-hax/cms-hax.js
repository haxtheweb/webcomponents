import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { FlattenedNodesObserver } from "@polymer/polymer/lib/utils/flattened-nodes-observer.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@lrnwebcomponents/h-a-x/h-a-x.js";
import "@lrnwebcomponents/simple-toast/simple-toast.js";
/**
 * `cms-hax`
 * @demo ../../demo/index.html
 */
class CmsHax extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          font-size: 16px;
          box-sizing: content-box;
        }
      </style>
      <iron-ajax
        id="pageupdateajax"
        url="[[endPoint]]"
        method="[[method]]"
        body="[[updatePageData]]"
        content-type="application/json"
        handle-as="json"
        on-response="_handleUpdateResponse"
      ></iron-ajax>
      <h-a-x app-store$="[[appStoreConnection]]"></h-a-x>
    `;
  }

  static get tag() {
    return "cms-hax";
  }
  static get observers() {
    return [
      "_noticeTagChanges(openDefault, allowedTags, hideExportButton, hidePanelOps, hidePreferencesButton, align)"
    ];
  }
  static get properties() {
    return {
      /**
       * Default the panel to open
       */
      openDefault: {
        type: Boolean,
        reflectToAttribute: true,
        value: false
      },
      /**
       * Hide the export button, showing it is good for developers
       * or those doing QA testing of new elements.
       */
      hideExportButton: {
        type: Boolean,
        value: true
      },
      /**
       * Hide the panel operations (save and cancel),
       */
      hidePanelOps: {
        type: Boolean,
        value: false
      },
      /**
       * Hide preferences button
       */
      hidePreferencesButton: {
        type: Boolean,
        value: false
      },
      /**
       * Direction to align the hax edit panel
       */
      align: {
        type: String,
        value: "right"
      },
      /**
       * allowed Tags, usually as dictated by the input filtering
       * layer of the backend system that HAX is riding on.
       * While not fullproof, this at least will enforce front-end
       * filtering to match what actually is going to be allowed
       * to be saved in the first place.
       */
      allowedTags: {
        type: Array
      },
      /**
       * Location to save content to.
       */
      endPoint: {
        type: String
      },
      /**
       * Method to save content.
       */
      method: {
        type: String,
        value: "PUT"
      },
      /**
       * Page data, body of text as a string.
       */
      updatePageData: {
        type: String
      },
      /**
       * Connection object for talking to an app store.
       */
      appStoreConnection: {
        type: Object
      },
      /**
       * State of the panel
       */
      editMode: {
        type: Boolean,
        reflectToAttribute: true
      },
      /**
       * syncBody
       */
      syncBody: {
        type: Boolean,
        value: false
      },
      /**
       * Only available if syncBody is true; this allows data binding to the value being worked on in hax-body tag
       */
      bodyValue: {
        type: String,
        value: ""
      },
      /**
       * Flag to hide the toast.
       */
      hideMessage: {
        type: Boolean,
        value: false
      },
      /**
       * Optional URL to redirect to once we save.
       */
      redirectLocation: {
        type: String
      },
      /**
       * Option to redirect once we save successfully
       */
      redirectOnSave: {
        type: Boolean,
        computed: "_computeRedirectOnSave(redirectLocation)"
      },
      /**
       * Reference to activeBody.
       */
      activeHaxBody: {
        type: Object,
        observer: "_activeHaxBodyUpdated"
      },
      __imported: {
        type: Boolean,
        value: false
      }
    };
  }

  /**
   * Ensure we've imported our content on initial setup
   */
  _activeHaxBodyUpdated(newValue, oldValue) {
    // ensure we import our content once we get an initial registration of active body
    if (newValue != null && !this.__imported) {
      this.__imported = true;
      // see what's inside of this, in a template tag
      let children = this.querySelector("template");
      // convert this template content into the real thing
      // this helps with correctly preserving everything on the way down
      if (children != null) {
        newValue.importContent(children.innerHTML);
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
   * Break the shadow root for this element (by design)
   */
  _attachDom(dom) {
    this.appendChild(dom);
  }
  /**
   * Set certain data bound values to the store once it's ready
   */
  _noticeTagChanges(
    openDefault,
    allowedTags,
    hideExportButton,
    hidePanelOps,
    hidePreferencesButton,
    align
  ) {
    if (window.HaxStore.ready) {
      // double check because this can cause issues
      if (allowedTags) {
        window.HaxStore.instance.validTagList = allowedTags;
      }
      window.HaxStore.instance.haxPanel.hideExportButton = hideExportButton;
      window.HaxStore.instance.haxPanel.hidePanelOps = hidePanelOps;
      window.HaxStore.instance.haxPanel.hidePreferencesButton = hidePreferencesButton;
      window.HaxStore.instance.haxPanel.align = align;
      if (openDefault) {
        window.HaxStore.write("editMode", openDefault, this);
      }
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
        this.openDefault,
        this.allowedTags,
        this.hideExportButton,
        this.hidePanelOps,
        this.hidePreferencesButton,
        this.align
      );
    }, 250);
  }
  /**
   * Created life cycle
   */
  constructor() {
    super();
    import("@lrnwebcomponents/cms-hax/lib/cms-token.js");
    import("@lrnwebcomponents/cms-hax/lib/cms-block.js");
    import("@lrnwebcomponents/cms-hax/lib/cms-views.js");
    import("@lrnwebcomponents/cms-hax/lib/cms-entity.js");
  }
  /**
   * detached life cycle
   */
  disconnectedCallback() {
    window.removeEventListener("hax-store-ready", this._storeReady.bind(this));
    window.removeEventListener("hax-save", this._saveFired.bind(this));
    super.disconnectedCallback();
  }
  /**
   * Attached to the DOM; now we can fire event to the store that
   * we exist and are the thing being edited.
   */
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
    window.addEventListener("hax-store-ready", this._storeReady.bind(this));
    window.SimpleToast.requestAvailability();
    this.__lock = false;
    window.addEventListener("hax-save", this._saveFired.bind(this));
    // notice ANY change to body and bubble up, only when we are attached though
    if (this.syncBody) {
      FlattenedNodesObserver(window.HaxStore.instance.activeHaxBody, info => {
        if (!this.__lock) {
          this.__lock = true;
          this.dispatchEvent(
            new CustomEvent("hax-body-content-changed", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: window.HaxStore.instance.activeHaxBody.haxToContent()
            })
          );
          setTimeout(() => {
            this.__lock = false;
          }, 100);
        }
      });
    }
  }

  /**
   * Store updated, sync.
   */
  _haxStorePropertyUpdated(e) {
    if (
      e.detail &&
      typeof e.detail.value !== typeof undefined &&
      e.detail.property
    ) {
      if (typeof e.detail.value === "object") {
        this.set(e.detail.property, null);
      }
      this.set(e.detail.property, e.detail.value);
      this.notifyPath(e.detail.property);
    }
  }

  /**
   * _saveFired
   */
  _saveFired(e) {
    // generate sanitized content
    this.updatePageData = window.HaxStore.instance.activeHaxBody.haxToContent();
    // send the request
    this.$.pageupdateajax.generateRequest();
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
          duration: 3000
        }
      });
      this.dispatchEvent(evt);
      // support auto redirecting on save if that's been requested
      // in the integration point
      if (this.redirectOnSave) {
        setTimeout(() => {
          // toggle so state is correct when we go to save
          window.HaxStore.instance.haxPanel.toggle();
          // trigger redirect
          window.location = this.redirectLocation;
        }, 1000);
      }
    }
  }
}
window.customElements.define(CmsHax.tag, CmsHax);
export { CmsHax };
