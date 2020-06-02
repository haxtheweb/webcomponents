/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";
/**
 * `site-menu`
 * `Menu hierarchy`
 */
class SiteMenu extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          height: 100vh;
        }
        map-menu {
          padding: var(--site-menu-padding);
          background-color: var(--site-menu-background-color);
          color: var(--site-menu-color);
          --map-menu-active-color: var(--site-menu-active-color);
          --map-menu-container-padding: var(--site-menu-container-padding);
          --map-menu-container-background-color: var(--site-menu-container-background-color);
          --map-menu-container-color: var(--site-menu-container-color);
          --map-menu-item-active-item-color: var(--site-menu-item-active-item-color);
        }
        map-menu[disabled] {
          pointer-events: none;
          opacity: 0.5;
          background-color: grey;
        }
        map-menu:not(:defined) {
          display: none;
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
      `
    ];
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "site-menu";
  }
  /**
   * HTMLElement life cycle
   */
  constructor() {
    super();
    import("@lrnwebcomponents/map-menu/map-menu.js");
    this.hideActiveIndicator = false;
    this.preventAutoScroll = false;
    this.trackIcon = "";
    this.__disposer = [];
    autorun(reaction => {
      this.routerManifest = Object.assign({}, toJS(store.routerManifest));
      this.__disposer.push(reaction);
    });
    autorun(reaction => {
      this.editMode = toJS(store.editMode);
      this.__disposer.push(reaction);
    });
  }
  /**
   * LitElement life cycle - render callback
   */
  render() {
    return html`
      <map-menu
        ?disabled="${this.editMode}"
        .selected="${this.activeId}"
        .manifest="${this.routerManifest}"
        ?active-indicator="${!this.hideActiveIndicator}"
        selected="${this.activeId}"
        ?auto-scroll="${!this.preventAutoScroll}"
        @active-item="${this.mapMenuActiveChanged}"
      ></map-menu>
    `;
  }
  firstUpdated(changedProperties) {
    // executing this here ensures that the timing is correct with highlighting the active item in the menu
    autorun(reaction => {
      this.activeId = toJS(store.activeId);
      this.__disposer.push(reaction);
    });
  }
  /**
   * LitElement life cycle - properties definition
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
        type: String,
        attribute: "active-id"
      },
      /**
       * Binding for active indicator and auto scrolling
       */
      hideActiveIndicator: {
        type: Boolean,
        attribute: "hide-active-indicator"
      },
      /**
       * prevent the automatic scrolling when items become active
       */
      preventAutoScroll: {
        type: Boolean,
        attribute: "prevent-auto-scroll"
      },
      /**
       * allow for visualizing the tracking of page requests
       */
      trackIcon: {
        type: String,
        attribute: "track-icon"
      }
    };
  }

  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
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
