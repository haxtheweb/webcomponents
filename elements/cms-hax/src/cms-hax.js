import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { FlattenedNodesObserver } from "@polymer/polymer/lib/utils/flattened-nodes-observer.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@lrnwebcomponents/hax-body/lib/hax-store.js";
import "@lrnwebcomponents/hax-body/hax-body.js";
import "@lrnwebcomponents/hax-body/lib/hax-autoloader.js";
import "@lrnwebcomponents/hax-body/lib/hax-manager.js";
import "@lrnwebcomponents/hax-body/lib/hax-panel.js";
import "@lrnwebcomponents/hax-body/lib/hax-app-picker.js";
import "@lrnwebcomponents/hax-body/lib/hax-export-dialog.js";
import "@lrnwebcomponents/simple-toast/simple-toast.js";
import "./lib/cms-token.js";
import "./lib/cms-block.js";
import "./lib/cms-views.js";
import "./lib/cms-entity.js";
/**
`cms-hax`
A LRN polymer app

@demo ../../demo/index.html

@microcopy - the mental model for this app
 -
 -

*/
let CmsHax = Polymer({
  _template: html`
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
    <hax-store
      hidden=""
      app-store="[[appStoreConnection]]"
      valid-tag-list="[[allowedTags]]"
    ></hax-store>
    <hax-autoloader id="loader" hidden=""></hax-autoloader>
    <hax-panel
      id="panel"
      hide-export-button="{{hideExportButton}}"
      hide-panel-ops="[[hidePanelOps]]"
      hide-preferences-button="[[hidePreferencesButton]]"
      align="[[align]]"
    ></hax-panel>
    <hax-body id="body" context-offset-left="[[bodyOffsetLeft]]"></hax-body>
    <hax-manager></hax-manager>
    <hax-app-picker></hax-app-picker>
    <hax-export-dialog></hax-export-dialog>
    <cms-token></cms-token>
    <cms-views></cms-views>
    <cms-block></cms-block>
    <cms-entity></cms-entity>
  `,

  is: "cms-hax",

  properties: {
    /**
     * Default the panel to open
     */
    openDefault: {
      type: Boolean,
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
     * Offset from the left of the body field
     */
    bodyOffsetLeft: {
      type: Number,
      value: -164
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
  },

  /**
   * Ensure we've imported our content on initial setup
   */
  _activeHaxBodyUpdated: function(newValue, oldValue) {
    // ensure we import our content once we get an initial registration of active body
    if (newValue != null && !this.__imported) {
      this.__imported = true;
      // see what's inside of this, in a template tag
      let children = this.queryEffectiveChildren("template");
      // convert this template content into the real thing
      // this helps with correctly preserving everything on the way down
      if (typeof children !== typeof undefined) {
        newValue.importContent(children.innerHTML);
      }
    }
  },

  /**
   * Calculate if we have anywhere to redirect to.
   */
  _computeRedirectOnSave: function(redirectLocation) {
    if (typeof redirectLocation !== typeof undefined) {
      return true;
    }
    return false;
  },
  /**
   * Break the shadow root for this element (by design)
   */
  _attachDom(dom) {
    this.appendChild(dom);
  },
  /**
   * Created life cycle
   */
  created: function() {
    document.body.addEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
  },

  /**
   * Attached to the DOM; now we can fire event to the store that
   * we exist and are the thing being edited.
   */
  attached: function() {
    this.__lock = false;
    document.body.addEventListener("hax-save", this._saveFired.bind(this));
    // open things by default and set state for edit mode
    if (this.openDefault) {
      window.HaxStore.write("editMode", true, this);
    }
    // notice ANY change to body and bubble up, only when we are attached though
    if (this.syncBody) {
      FlattenedNodesObserver(this.$.body, info => {
        if (!this.__lock) {
          this.__lock = true;
          this.fire(
            "hax-body-content-changed",
            window.HaxStore.instance.activeHaxBody.haxToContent()
          );
          setTimeout(() => {
            this.__lock = false;
          }, 100);
        }
      });
    }
  },

  /**
   * Store updated, sync.
   */
  _haxStorePropertyUpdated: function(e) {
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
  },

  /**
   * _saveFired
   */
  _saveFired: function(e) {
    // generate sanitized content
    this.updatePageData = window.HaxStore.instance.activeHaxBody.haxToContent();
    // send the request
    this.$.pageupdateajax.generateRequest();
  },

  /**
   * _handleUpdateResponse
   */
  _handleUpdateResponse: function(e) {
    if (!this.hideMessage) {
      const evt = new CustomEvent("simple-toast-show", {
        bubbles: true,
        cancelable: true,
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
          this.$.panel.toggle();
          // trigger redirect
          window.location = this.redirectLocation;
        }, 1000);
      }
    }
  }
});
export { CmsHax };
