/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/map-menu/map-menu.js";
import { localStorageGet } from "@haxtheweb/utils/utils.js";
import { HAXCMSThemeParts } from "../../core/utils/HAXCMSThemeParts.js";
/**
 * `site-menu`
 * `Menu hierarchy`
 */
class SiteMenu extends HAXCMSThemeParts(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          position: relative;
        }
        map-menu {
          padding: var(--site-menu-padding);
          background-color: var(--site-menu-background-color);
          color: var(--site-menu-color, inherit);
          --map-menu-container-padding: var(--site-menu-container-padding);
          --map-menu-container-background-color: var(
            --site-menu-container-background-color
          );
          --map-menu-container-color: var(--site-menu-container-color);
          --map-menu-item-active-item-color: var(
            --site-menu-item-active-item-color
          );
          --map-menu-font-size: var(--site-menu-font-size, 18px);
          overflow-y: var(
            --map-menu-overflow,
            var(--map-menu-overflow-y, auto)
          );
          overflow-x: var(
            --map-menu-overflow,
            var(--map-menu-overflow-x, hidden)
          );
          scrollbar-color: var(--site-menu-scrollbar-color, #252737);
          scrollbar-width: thick;
        }
        map-menu:not(:defined) {
          display: none;
        }
        :host([is-flex]) map-menu {
          overflow-y: visible;
          overflow-x: visible;
        }

        map-menu::-webkit-scrollbar-track {
          border-radius: 0;
          background-color: var(--site-menu-scrollbar-color, #252737);
        }

        map-menu::-webkit-scrollbar {
          width: 8px;
          background-color: var(--site-menu-scrollbar-color, #252737);
        }

        map-menu::-webkit-scrollbar-thumb {
          border-radius: 2px;
          -webkit-box-shadow: inset 0 0 4px
            var(--site-menu-scrollbar-thumb-color, #999999);
          box-shadow: inset 0 0 4px
            var(--site-menu-scrollbar-thumb-color, #999999);
          background-color: var(--site-menu-scrollbar-thumb-color, #999999);
        }
      `,
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
    this.hideActiveIndicator = false;
    this.preventAutoScroll = false;
    this.trackIcon = "";
    this.editControls = false;
    this.isFlex = false;
    this.isHorizontal = false;
    this.maxDepth = 5;
    this.__disposer = [];
    autorun((reaction) => {
      this.routerManifest = Object.assign({}, toJS(store.routerManifest));
      this.__disposer.push(reaction);
    });
  }
  /**
   * LitElement life cycle - render callback
   */
  render() {
    return html`
      <map-menu
        .part="map-menu ${this.editMode ? `edit-mode-active` : ``}"
        .manifest="${this.routerManifest}"
        ?edit-controls="${this.editControls}"
        ?is-flex="${this.isFlex}"
        ?is-horizontal="${this.isHorizontal}"
        max-depth="${this.maxDepth}"
        ?active-indicator="${!this.hideActiveIndicator}"
        ?auto-scroll="${!this.preventAutoScroll}"
        @active-item="${this.mapMenuActiveChanged}"
        @map-menu-operation-selected="${this.mapMenuOperationSelected}"
      ></map-menu>
    `;
  }

  clickLink(id) {
    let target = this.shadowRoot
      .querySelector("map-menu")
      .shadowRoot.querySelector("#" + id);
    if (target) {
      if (target.shadowRoot.querySelector("a")) {
        target.shadowRoot.querySelector("a").click();
      }
      // headers are nested
      else if (target.shadowRoot.querySelector("#" + id)) {
        target.shadowRoot
          .querySelector("#" + id)
          .shadowRoot.querySelector("a")
          .click();
      }
    }
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // Navigation programs have been moved to core site-editor-ui
    // This ensures they're available regardless of theme choice
    autorun((reaction) => {
      if (!this.isFlex) {
        this.editControls = toJS(store.isLoggedIn);
        // dynamic import if we are logged in
        if (this.editControls) {
          import("../../core/micros/haxcms-page-operations.js");
        }
      }
    });
    // executing this here ensures that the timing is correct with highlighting the active item in the menu
    autorun((reaction) => {
      this.activeId = toJS(store.activeId);
      this.__disposer.push(reaction);
      setTimeout(() => {
        this.shadowRoot.querySelector("map-menu").selected = this.activeId;
      }, 100);
    });
  }
  /**
   * LitElement life cycle - properties definition
   */
  static get properties() {
    return {
      ...super.properties,
      /**
       * Manifest with router / location enhancements
       */
      routerManifest: {
        type: Object,
      },
      editControls: {
        type: Boolean,
        attribute: "edit-controls",
      },
      /**
       * Track orientation state of flex menu
       */
      isFlex: {
        type: Boolean,
        attribute: "is-flex",
      },
      isHorizontal: {
        type: Boolean,
        attribute: "is-horizontal",
        reflect: true,
      },
      maxDepth: {
        type: Number,
        attribute: "max-depth",
      },
      /**
       * acitvely selected item
       */
      activeId: {
        type: String,
        attribute: "active-id",
      },
      /**
       * Binding for active indicator and auto scrolling
       */
      hideActiveIndicator: {
        type: Boolean,
        attribute: "hide-active-indicator",
      },
      /**
       * prevent the automatic scrolling when items become active
       */
      preventAutoScroll: {
        type: Boolean,
        attribute: "prevent-auto-scroll",
      },
      /**
       * allow for visualizing the tracking of page requests
       */
      trackIcon: {
        type: String,
        attribute: "track-icon",
      },
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
    try {
      // now work on the user data object in the theme layer
      let userData = localStorageGet("HAXCMSSystemData");
      if (userData.manifests) {
        if (
          typeof userData.manifests[this.routerManifest.id] === typeof undefined
        ) {
          userData.manifests[this.routerManifest.id] = {
            accessData: {},
          };
        }
        // edge case when switching rapidly
        if (!userData.manifests[this.routerManifest.id].accessData) {
          userData.manifests[this.routerManifest.id].accessData = {};
        }
        userData.manifests[this.routerManifest.id].accessData[e.detail.id] = {
          timestamp: Math.floor(Date.now() / 1000),
          trackIcon: this.trackIcon,
        };
        for (var i in this.routerManifest.items) {
          if (this.routerManifest.items[i].id === e.detail.id) {
            this.routerManifest.items[i].metadata.accessData =
              userData.manifests[this.routerManifest.id].accessData[
                e.detail.id
              ];
          }
        }
      }
      // save this back to the system data
      globalThis.localStorage.setItem(
        "HAXCMSSystemData",
        JSON.stringify(userData),
      );
    } catch (e) {}
  }
  mapMenuHoveredChanged(e) {
    console.log(e.detail);
  }
}
globalThis.customElements.define(SiteMenu.tag, SiteMenu);
export { SiteMenu };
