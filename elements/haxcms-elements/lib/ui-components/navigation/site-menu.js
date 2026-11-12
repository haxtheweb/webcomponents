/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/map-menu/map-menu.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { HAXCMSThemeParts } from "../../core/utils/HAXCMSThemeParts.js";
import { LearnerProgress } from "../../core/haxcms-learner-progress.js";
/**
 * `site-menu`
 * `Menu hierarchy`
 *
 * Learner progress (haxtheweb/issues#3267): only the item of the page open
 * now shows a ring around its icon area, filled to that page's percent as
 * the visitor reads and engages, and a filled disc with a check once the
 * page is done (it bursts once the first time that happens while it is
 * open). The percent is the item's hover text and is spoken after its
 * title. Other items show no mark and there is no pages done summary here;
 * that moved into My learning (progress/my-learning-button.js). Vertical
 * menus only, never while editing; set hide-progress to turn it off.
 * Progress is read from the learner profile on this device (see
 * core/haxcms-learner-progress.js).
 */
class SiteMenu extends I18NMixin(HAXCMSThemeParts(LitElement)) {
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
    this.hideProgress = false;
    this._activePercent = null;
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../../locales/", import.meta.url).href,
    });
    this.__operationsLoaded = false;
    this.__disposer = [];
    LearnerProgress.start();
    // percent of the page open now, from the profile on this device; live
    // as the visitor reads and engages
    this.__disposer.push(
      autorun((_reaction) => {
        const id = store.activeId;
        const item = store.activeItem;
        const percent =
          id && item && !item._internalRoute
            ? LearnerProgress.pageProgress(id).percent
            : null;
        Promise.resolve().then(() => {
          this._activePercent = typeof percent === "number" ? percent : null;
        });
      }),
    );
    this.__disposer.push(
      autorun((_reaction) => {
        const _mobx_val_0 = toJS(store.routerManifest);
        Promise.resolve().then(() => {
          this.routerManifest = Object.assign({}, _mobx_val_0);
        });
      }),
    );
    this.__disposer.push(
      autorun((_reaction) => {
        const _mobx_val_0 = toJS(store.isLoggedIn);
        const _mobx_val_1 = toJS(store.previewMode);
        Promise.resolve().then(() => {
          // Flex / horizontal site menus (polaris-flex, etc.) must never show
          // in-menu outline action pencils — they overlap nav labels. Preview
          // hides them too, as a visitor never sees them.
          this.editControls = !!_mobx_val_0 && !_mobx_val_1 && !this.isFlex;
          // dynamic import if we are logged in and controls are active
          if (this.editControls && !this.__operationsLoaded) {
            this.__operationsLoaded = true;
            import("../../core/micros/haxcms-page-operations.js");
          }
        });
      }),
    );
    // executing this here ensures that the timing is correct with highlighting the active item in the menu
    this.__disposer.push(
      autorun((_reaction) => {
        const _mobx_val_0 = toJS(store.activeId);
        Promise.resolve().then(() => {
          this.activeId = _mobx_val_0;
          this.updateComplete.then(() => {
            const mapMenu =
              this.shadowRoot && this.shadowRoot.querySelector("map-menu");
            if (mapMenu && mapMenu.selected !== this.activeId) {
              mapMenu.selected = this.activeId;
            }
          });
        });
      }),
    );
  }
  /**
   * Keep edit controls in sync when flex mode changes after login state.
   * isFlex is not a MobX value, so the login autorun alone cannot react to it.
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("isFlex") && this.isFlex && this.editControls) {
      this.editControls = false;
    }
  }
  /**
   * LitElement life cycle - render callback
   */
  _showProgress() {
    if (
      typeof this._activePercent !== "number" ||
      this.hideProgress ||
      this.editMode
    ) {
      return false;
    }
    return !this.isFlex && !this.isHorizontal;
  }
  render() {
    const progress = this._showProgress();
    return html`
      <map-menu
        .activeProgress="${progress ? this._activePercent : null}"
        .part="map-menu ${this.editMode ? `edit-mode-active` : ``}"
        ?inert="${this.editMode}"
        aria-disabled="${this.editMode ? `true` : `false`}"
        lazy-children
        .manifest="${this.routerManifest}"
        ?edit-controls="${this.editControls && !this.isFlex}"
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
        reflect: true,
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
      /**
       * Do not show the learner progress ring on the item of the page open
       * now
       */
      hideProgress: {
        type: Boolean,
        attribute: "hide-progress",
      },
      _activePercent: { type: Number, state: true },
    };
  }

  disconnectedCallback() {
    for (let i in this.__disposer) {
      const disposer = this.__disposer[i];
      if (typeof disposer === "function") {
        disposer();
      } else if (disposer && typeof disposer.dispose === "function") {
        disposer.dispose();
      }
    }
    super.disconnectedCallback();
  }
  /**
   * When map menu changes let's set a track icon internal to it. Page visits
   * are recorded in the learner profile by core/haxcms-learner-progress.js;
   * the old HAXCMSSystemData accessData write never ran (that object was
   * never given a manifests key) and has been removed.
   */
  mapMenuActiveChanged(e) {
    // update the UI directly
    if (e && e.detail) {
      e.detail.trackIcon = this.trackIcon;
    }
  }
  mapMenuHoveredChanged(e) {
    console.log(e.detail);
  }
}
globalThis.customElements.define(SiteMenu.tag, SiteMenu);
export { SiteMenu };
