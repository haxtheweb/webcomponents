/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "../../core/micros/haxcms-button-add.js";
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
        .ops {
          position: absolute;
          display: block;
          left: 0px;
          height: 40px;
          bottom: -40px;
          z-index: 2;
          margin: 0 4px 0 0;
        }
        .ops .op {
          --simple-icon-height: 16px;
          --simple-icon-width: 16px;
          margin: 4px;
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
    this.__disposer = [];
    autorun((reaction) => {
      this.routerManifest = Object.assign({}, toJS(store.routerManifest));
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.editControls = toJS(store.isLoggedIn);
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
        ?active-indicator="${!this.hideActiveIndicator}"
        ?auto-scroll="${!this.preventAutoScroll}"
        @active-item="${this.mapMenuActiveChanged}"
        @map-menu-operation-selected="${this.mapMenuOperationSelected}"
      ></map-menu>
      ${this.editControls
        ? html` <div class="ops">
            <haxcms-button-add
              class="op"
              type="sibling"
              label="Add page"
              action-id="null"
            ></haxcms-button-add>
          </div>`
        : ``}
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
    // ability to search pages in the manifest
    this.dispatchEvent(
      new CustomEvent("super-daemon-define-option", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          title: "Go to page in this site",
          icon: "link",
          tags: ["Site", "navigation"],
          eventName: "super-daemon-run-program",
          context: ["CMS"],
          path: "/site/navigation",
          value: {
            name: "Go to page",
            context: ["CMS"],
            program: async (input, values) => {
              let results = [];
              const manifest = this.routerManifest;
              if (manifest && manifest.items.length > 0) {
                manifest.items.forEach(async (item) => {
                  if (
                    item.title.toLowerCase().includes(input.toLowerCase()) ||
                    input === ""
                  ) {
                    results.push({
                      title: item.title,
                      icon: "link",
                      tags: ["CMS", "page"],
                      value: {
                        target: this,
                        method: "clickLink",
                        args: [item.id],
                      },
                      context: ["CMS"],
                      eventName: "super-daemon-element-method",
                      path: "site/navigation/page",
                    });
                  }
                });
              }
              return results;
            },
          },
        },
      }),
    );
    // similar but this makes page addresses available as a media source
    this.dispatchEvent(
      new CustomEvent("super-daemon-define-option", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          title: "Link to site page",
          icon: "hax:file-link-outline",
          tags: ["Search", "pages", "links"],
          eventName: "super-daemon-run-program",
          path: "/sources/site-pages",
          context: ["HAX", "/"],
          priority: -1,
          value: {
            name: "Search pages",
            context: ["HAX", "/"],
            program: async (input, values) => {
              let results = [];
              const manifest = this.routerManifest;
              if (manifest && manifest.items.length > 0) {
                manifest.items.forEach(async (item) => {
                  if (
                    item.title.toLowerCase().includes(input.toLowerCase()) ||
                    input === ""
                  ) {
                    results.push({
                      title: item.title,
                      icon: "link",
                      tags: ["CMS", "page"],
                      value: {
                        value: "a",
                        eventName: "insert-tag",
                        properties: {
                          href: item.slug,
                          "data-uuid": item.id,
                        },
                        content: item.title,
                      },
                      context: ["HAX", "/", "/sources/site-pages"],
                      eventName: "hax-super-daemon-insert-tag",
                      path: "/sources/site-pages",
                    });
                  }
                });
              }
              return results;
            },
          },
        },
      }),
    );
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
customElements.define(SiteMenu.tag, SiteMenu);
export { SiteMenu };
