/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXCMSTheme } from "@lrnwebcomponents/haxcms-elements/lib/core/HAXCMSThemeWiring.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/query/site-query.js";
import "@polymer/iron-pages/iron-pages.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";

/**
 * `haxor-slevin`
 * `Tech blogger theme`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class HaxorSlevin extends HAXCMSTheme(PolymerElement) {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "haxor-slevin";
  }
  static get properties() {
    return Object.assign(super.properties, {
      manifest: {
        type: Object
      },
      color: {
        type: String,
        computed: "_getColor(manifest)"
      },
      selectedPage: {
        type: Number,
        reflectToAttribute: true,
        value: 0
      }
    });
  }
  _getColor(manifest) {
    if (manifest && manifest.metadata && manifest.metadata.hexCode) {
      return manifest.metadata.hexCode;
    }
  }
  constructor() {
    super();
    import("@polymer/paper-button/paper-button.js");
    import("@polymer/iron-image/iron-image.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-active-title.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-rss-button.js");
    import("@lrnwebcomponents/simple-blog-card/simple-blog-card.js");
    import("@polymer/app-layout/app-header/app-header.js");
    import("@polymer/app-layout/app-toolbar/app-toolbar.js");
    import("@lrnwebcomponents/social-share-link/social-share-link.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-search.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/layout/site-modal.js");
  }
  _showImage(image) {
    if (image) {
      return image;
    }
    if (this.image) {
      return this.image;
    }
    return false;
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.__disposer = [];
    autorun(reaction => {
      let manifest = toJS(store.manifest);
      this.title = manifest.title;
      this.image = manifest.metadata.image;
      this.icon = manifest.metadata.icon;
      this.author = manifest.metadata.author;
      this.__disposer.push(reaction);
    });
    autorun(reaction => {
      this._noticeLocationChange(store.location);
      this.__disposer.push(reaction);
    });
    autorun(reaction => {
      this.activeManifestIndexCounter = toJS(store.activeManifestIndexCounter);
      this.__disposer.push(reaction);
    });
    autorun(reaction => {
      this.activeTitle = toJS(store.activeTitle);
      this.shareUrl = document.location.href;
      this.shareMsg = this.activeTitle + " " + this.shareUrl;
      if (
        store.activeItem &&
        store.activeItem.metadata &&
        store.activeItem.metadata.fields &&
        store.activeItem.metadata.fields.subtitle
      ) {
        this.subtitle = store.activeItem.metadata.fields.subtitle;
      } else {
        this.subtitle = false;
      }
      // look for image on the post and make it the pin share
      if (
        store.activeItem &&
        store.activeItem.metadata &&
        store.activeItem.metadata.fields &&
        store.activeItem.metadata.fields.images &&
        store.activeItem.metadata.fields.images[0] &&
        store.activeItem.metadata.fields.images[0].src
      ) {
        this.activeImage = store.activeItem.metadata.fields.images[0].src;
      }
      this.__disposer.push(reaction);
    });
  }
  /**
   * Listen for router location changes and select page to match
   */
  _noticeLocationChange(location) {
    if (!location || typeof location.route === "undefined") return;
    const name = location.route.name;
    if (name === "home" || name === "404") {
      this.selectedPage = 0;
    } else {
      window.scrollTo({
        top: 0,
        left: 0
      });
      this.selectedPage = 1;
    }
    setTimeout(() => {
      var evt = document.createEvent("UIEvents");
      evt.initUIEvent("resize", true, false, window, 0);
      window.dispatchEvent(evt);
    }, 50);
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
  }
  /**
   * Manage the back button to get to the home page of items
   */
  _goBack(e) {
    window.history.pushState(null, null, store.location.baseUrl);
    window.dispatchEvent(new PopStateEvent("popstate"));
    // should help account for starting on a page where popstate isn't set
    // and also generate data model mirroring
    window.scrollTo({
      top: 0,
      left: 0
    });
    const evt = new CustomEvent("json-outline-schema-active-item-changed", {
      bubbles: true,
      cancelable: true,
      detail: {}
    });
    this.dispatchEvent(evt);
    this.selectedPage = 0;
  }
}
window.customElements.define(HaxorSlevin.tag, HaxorSlevin);
export { HaxorSlevin };
