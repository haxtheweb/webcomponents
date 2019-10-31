/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";
/**
 * `site-menu`
 * `Menu hierarchy`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SiteMenu extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "site-menu";
  }
  constructor() {
    super();
    import("@lrnwebcomponents/map-menu/map-menu.js");
  }
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          height: 100vh;
        }
        map-menu[disabled] {
          pointer-events: none;
          opacity: 0.5;
          background-color: grey;
        }
        map-menu:not(:defined) {
          display: none;
        }
        map-menu {
          @apply --site-menu;
          --map-menu-active-color: var(--site-menu-active-color);
          --map-menu-container: var(--site-menu-container);
          --map-menu-item-active-item: var(--site-menu-item-active-item);
        }

        map-menu::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 4px
            var(--site-menu-scrolltrack-bg-color, rgba(56, 63, 69, 0.9));
          border-radius: 0;
          background-color: var(--site-menu-bg-color, #383f45);
        }
        map-menu::-webkit-scrollbar {
          width: 2px;
          background-color: var(--site-menu-bg-color, #383f45);
        }
        map-menu::-webkit-scrollbar-thumb {
          border-radius: 1px;
          -webkit-box-shadow: inset 0 0 4px var(--site-menu-bg-shadow, #747474);
          background-color: var(--site-menu-bg-color, #383f45);
        }
      </style>
      <map-menu
        disabled="[[editMode]]"
        selected="[[activeId]]"
        manifest="[[routerManifest]]"
        active-indicator="[[!hideActiveIndicator]]"
        auto-scroll="[[!preventAutoScroll]]"
      ></map-menu>
    `;
  }
  /**
   * Props
   */
  static get properties() {
    return {
      /**
       * Manifest with router / location enhancements
       */
      routerManifest: {
        type: Object
      },
      /**
       * acitvely selected item
       */
      activeId: {
        type: String
      },
      /**
       * Binding for active indicator and auto scrolling
       */
      hideActiveIndicator: {
        type: Boolean,
        value: false
      },
      /**
       * prevent the automatic scrolling when items become active
       */
      preventAutoScroll: {
        type: Boolean,
        value: false
      },
      /**
       * allow for visualizing the tracking of page requests
       */
      trackIcon: {
        type: String,
        value: ""
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.__disposer = autorun(() => {
      this.routerManifest = Object.assign({}, toJS(store.routerManifest));
    });
    // silly but delay to ensure highlighting happens
    setTimeout(() => {
      this.__disposer2 = autorun(() => {
        this.activeId = toJS(store.activeId);
      });
    }, 100);
    this.__disposer3 = autorun(() => {
      this.editMode = toJS(store.editMode);
    });
    this.shadowRoot
      .querySelector("map-menu")
      .addEventListener("active-item", this.mapMenuActiveChanged.bind(this));
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.__disposer();
    this.__disposer3();
    if (this.__disposer2) {
      this.__disposer2();
    }
    this.shadowRoot
      .querySelector("map-menu")
      .removeEventListener("active-item", this.mapMenuActiveChanged.bind(this));
  }
  /**
   * When map menu changes let's set a track icon internal to it.
   */
  mapMenuActiveChanged(e) {
    // update the UI directly
    e.detail.trackIcon = this.trackIcon;
    // now work on the user data object in the theme layer
    let userData = JSON.parse(window.localStorage.getItem("HAXCMSSystemData"));
    if (
      userData.manifests &&
      typeof userData.manifests[this.routerManifest.id] === typeof undefined
    ) {
      userData.manifests[this.routerManifest.id] = {
        accessData: {}
      };
    }
    // edge case when switching rapidly
    if (!userData.manifests[this.routerManifest.id].accessData) {
      userData.manifests[this.routerManifest.id].accessData = {};
    }
    userData.manifests[this.routerManifest.id].accessData[e.detail.id] = {
      timestamp: Math.floor(Date.now() / 1000),
      trackIcon: this.trackIcon
    };
    for (var i in this.routerManifest.items) {
      if (this.routerManifest.items[i].id === e.detail.id) {
        this.routerManifest.items[i].metadata.accessData =
          userData.manifests[this.routerManifest.id].accessData[e.detail.id];
      }
    }
    // save this back to the system data
    window.localStorage.setItem("HAXCMSSystemData", JSON.stringify(userData));
  }
}
window.customElements.define(SiteMenu.tag, SiteMenu);
export { SiteMenu };
