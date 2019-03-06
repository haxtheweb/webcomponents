import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/simple-datetime/simple-datetime.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
/**
`simple-blog-footer`
A simple blog and associated elements

* @demo demo/index.html

@microcopy - the mental model for this element
 - footer of the page for blog posts relating back to the main overview page
 -

*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        width: 100%;
        position: relative;
        overflow: hidden;
      }
      :host *[hidden] {
        display: none;
      }
      .background-closer-image {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        text-indent: -9999px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        opacity: 0.4;
        transition: all 0.6s linear;
      }
      .background-closer-image-wrap {
        position: absolute;
        background-color: rgba(0, 0, 0, 0.9);
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        text-indent: -9999px;
        transition: all 0.6s linear;
        opacity: 1;
      }
      :host([active]) .background-closer-image {
        opacity: 0.8;
      }
      :host([active]) .background-closer-image-wrap {
        background-color: rgba(0, 0, 0, 0.2);
      }
      .inner {
        width: 100%;
        position: relative;
        z-index: 99;
        max-width: 640px;
        padding: 32px 0;
        text-align: center;
        margin: 0 auto;
      }
      .blog-title {
        margin: 0;
        padding: 0 0 10px;
        font-size: 50px;
        text-align: center;
        font-weight: 700;
        letter-spacing: -2px;
        outline: 0;
        line-height: 50px;
        word-break: break-word;
        color: white;
        text-shadow: 0 1px 16px rgba(0, 0, 0, 0.5), 0 0 1px rgba(0, 0, 0, 0.5);
      }
      .blog-description {
        margin: 0 0 50px;
        padding: 0 32px;
        font-size: 18px;
        line-height: 1.5;
        color: white;
        text-align: center;
        font-weight: 400;
        text-shadow: 0 1px 16px rgba(0, 0, 0, 0.5), 0 0 1px rgba(0, 0, 0, 0.5);
      }
      paper-button:not([disabled]) {
        display: block;
        text-align: center;
        letter-spacing: -0.32px;
        font-size: 15px;
        font-weight: 400;
        font-style: normal;
        text-decoration: none;
        cursor: pointer;
        height: 44px;
        background-color: var(--haxcms-color);
        color: black;
        vertical-align: middle;
        box-sizing: border-box;
        border-radius: none;
        line-height: 44px;
        margin: 16px 0;
        padding: 0;
      }
      paper-button:focus,
      paper-button:active,
      paper-button:hover {
        outline: 2px solid var(--haxcms-color);
        outline-offset: 8px;
      }
      simple-datetime {
        letter-spacing: -0.32px;
        font-weight: 300;
        font-style: normal;
        font-size: 16px;
        line-height: 1.3;
        color: black;
        display: inline-flex;
      }
    </style>
    <div class="background-closer-image-wrap">
      <div
        class="background-closer-image"
        style\$="background-image: url([[manifest.metadata.image]])"
      ></div>
    </div>
    <div class="inner">
      <paper-button
        disabled="[[disableNextPage(activeManifestIndex)]]"
        on-click="nextPage"
        raised="[[!disableNextPage(activeManifestIndex)]]"
      >
        <simple-datetime
          hidden$="[[disableNextPage(activeManifestIndex)]]"
          format="M jS"
          timestamp="[[nextChanged]]"
          unix
        ></simple-datetime>
        [[nextTitle]]
      </paper-button>
      <paper-button
        disabled="[[disablePrevPage(activeManifestIndex)]]"
        on-click="prevPage"
        raised="[[!disablePrevPage(activeManifestIndex)]]"
      >
        <simple-datetime
          hidden$="[[disablePrevPage(activeManifestIndex)]]"
          format="M jS"
          timestamp="[[prevChanged]]"
          unix
        ></simple-datetime>
        [[prevTitle]]
      </paper-button>
      <paper-button raised on-tap="_backButtonTap">Back to list</paper-button>
      <h2 class="blog-title">[[manifest.title]]</h2>
      <h3 class="blog-description">[[manifest.description]]</h3>
    </div>
  `,

  is: "simple-blog-footer",

  properties: {
    /**
     * active manifest index, key to location in the manifest itemsarray
     */
    activeManifestIndex: {
      type: Number,
      value: -1
    },
    /**
     * Manifest, JSON Outline Schema object
     */
    manifest: {
      type: Object
    },
    activeItemId: {
      type: String,
      observer: "_activeItemIdChanged"
    }
  },
  _activeItemIdChanged: function(newValue, oldValue) {
    const item = this.manifest.items
      .filter((d, i) => {
        if (newValue === d.id) {
          this.activeManifestIndex = i;
          return d;
        }
      })
      .pop();
    if (!this.disablePrevPage(this.activeManifestIndex)) {
      this.prevTitle =
        " - " + this.manifest.items[this.activeManifestIndex - 1].title;
      this.prevChanged = this.manifest.items[
        this.activeManifestIndex - 1
      ].metadata.created;
    } else {
      this.prevTitle = "";
      this.prevChanged = "";
    }
    if (!this.disableNextPage(this.activeManifestIndex)) {
      this.nextTitle =
        " - " + this.manifest.items[this.activeManifestIndex + 1].title;
      this.nextChanged = this.manifest.items[
        this.activeManifestIndex + 1
      ].metadata.created;
    } else {
      this.nextTitle = "";
      this.nextChanged = "";
    }
  },
  /**
   * attached life cycle
   */
  attached: function() {
    // subscribe to manifest changes
    this.__disposer = autorun(() => {
      this.manifest = toJS(store.routerManifest);
      this.activeItemId = toJS(store.activeItem);
    });
  },
  /**
   * detatched life cycle
   */
  detached: function() {
    this.__disposer();
  },

  /**
   * disablePrevPage
   */
  disablePrevPage: function(index) {
    if (index === 0 || index === -1) {
      return true;
    }
    return false;
  },
  /**
   * disableNextPage
   */
  disableNextPage: function(index) {
    if (index >= this.manifest.items.length - 1) {
      return true;
    }
    return false;
  },
  /**
   * Go back a page (if we can)
   */
  prevPage: function(e) {
    this.changePage("previous");
  },
  /**
   * Advance a page (if we can)
   */
  nextPage: function(e) {
    this.changePage("next");
  },
  /**
   * Go forward a page
   */
  changePage: function(direction) {
    if (
      direction == "next" &&
      this.activeManifestIndex < this.manifest.items.length - 1
    ) {
      window.history.pushState(
        {},
        null,
        this.manifest.items[this.activeManifestIndex + 1].location
      );
      window.dispatchEvent(new PopStateEvent("popstate"));
      this.dispatchEvent(
        new CustomEvent("haxcms-active-item-changed", {
          bubbles: true,
          cancelable: true,
          detail: this.manifest.items[this.activeManifestIndex + 1]
        })
      );
    } else if (direction == "previous" && this.activeManifestIndex > 0) {
      window.history.pushState(
        {},
        null,
        this.manifest.items[this.activeManifestIndex - 1].location
      );
      window.dispatchEvent(new PopStateEvent("popstate"));
      this.dispatchEvent(
        new CustomEvent("haxcms-active-item-changed", {
          bubbles: true,
          cancelable: true,
          detail: this.manifest.items[this.activeManifestIndex - 1]
        })
      );
    }
  },

  /**
   * Fire event to unset the global activeItem.
   */
  _backButtonTap: function(e) {
    window.history.pushState(null, null, store.location.baseUrl);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
});
