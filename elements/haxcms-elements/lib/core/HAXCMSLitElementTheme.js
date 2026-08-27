/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { css, LitElement, render, unsafeCSS, html, svg, mathml } from "lit";
import { HAXCMSTheme } from "./HAXCMSThemeWiring.js";
import { ResponsiveUtilityBehaviors } from "@haxtheweb/responsive-utility/lib/responsive-utility-behaviors.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import { SimpleIconsetStore } from "@haxtheweb/simple-icon/lib/simple-iconset.js";
import { editableTableDisplayStyles } from "@haxtheweb/editable-table/lib/editable-table-behaviors.js";
import { copyToClipboard } from "@haxtheweb/utils/lib/clipboard.js";
import "@haxtheweb/absolute-position-behavior/lib/absolute-position-state-manager.js";

/**
 * LitElement Version of HAXCMSTheme
 */
class HAXCMSLitElementTheme extends HAXCMSTheme(
  ResponsiveUtilityBehaviors(LitElement),
) {
  constructor() {
    super();
    this.isSafari = globalThis.safari !== undefined;
    this.editMode = false;
    this.trayStatus = "";
    this.isLoggedIn = false;
    this.emptyContent = false;
    // set true once this theme instance has completed its first render and
    // is safe to reveal; distinct from haxcms-site-builder's `themeLoaded`
    // (module import resolved) which fires before this element ever paints
    this.themeReady = false;
    this.HAXSiteCustomRenderRoutes = {};
    this.__headingNodes = [];
    this.__copyLinkHandler = this.copyLink.bind(this);
    this.__hoverIntentEnterHandler = this.hoverIntentEnter.bind(this);
    this.__hoverIntentLeaveHandler = this.hoverIntentLeave.bind(this);
    this.__disposer = this.__disposer ? this.__disposer : [];
    this.__disposer.push(
      autorun((reaction) => {
        const _mobx_val_0 = toJS(store.editMode);
        Promise.resolve().then(() => {
          this.editMode = _mobx_val_0;
        });
      }),
    );
    this.__disposer.push(
      autorun((reaction) => {
        const _mobx_val_0 = toJS(store.trayStatus);
        Promise.resolve().then(() => {
          this.trayStatus = _mobx_val_0;
        });
      }),
    );
    // when this changes, query our light dom children and apply a click hanlder to copy a link to the item
    this.__disposer.push(
      autorun((reaction) => {
        const _mobx_val_0 = toJS(store.activeItemContent);
        Promise.resolve().then(() => {
          let tmp = _mobx_val_0;
          this.emptyContent = !tmp || tmp.trim() === "";
          if (
            this.HAXCMSThemeSettings.autoScroll &&
            this.shadowRoot &&
            this.HAXCMSThemeSettings.scrollTarget &&
            this.HAXCMSThemeSettings.scrollTarget.scrollIntoView
          ) {
            if (this.isSafari) {
              this.HAXCMSThemeSettings.scrollTarget.scrollIntoView();
            } else {
              setTimeout(() => {
                this.HAXCMSThemeSettings.scrollTarget.scrollIntoView(
                  this.HAXCMSThemeSettings.scrollSettings,
                );
              }, 0);
            }
          }
          // delay bc this shouldn't block page load in any way
          setTimeout(() => {
            if (typeof this.__refreshHeadingListeners === "function") {
              this.__refreshHeadingListeners();
            }
          }, 100);
        });
      }),
    );
  }
  // Render method
  render() {
    return html` <div id="contentcontainer">
      <div id="slot"><slot></slot></div>
    </div>`;
  }

  hoverIntentEnter(e) {
    e.target.classList.add("haxcms-copyable");
  }
  hoverIntentLeave(e) {
    e.target.classList.remove("haxcms-copyable");
  }
  __removeHeadingListeners() {
    if (this.__headingNodes && this.__headingNodes.length > 0) {
      this.__headingNodes.forEach((node) => {
        node.removeEventListener("click", this.__copyLinkHandler);
        node.removeEventListener(
          "pointerenter",
          this.__hoverIntentEnterHandler,
        );
        node.removeEventListener(
          "pointerleave",
          this.__hoverIntentLeaveHandler,
        );
      });
    }
    this.__headingNodes = [];
  }
  __refreshHeadingListeners() {
    this.__removeHeadingListeners();
    let kidHeadings = this.querySelectorAll("h1,h2,h3,h4,h5,h6");
    this.__headingNodes = Array.from(kidHeadings);
    if (this.__headingNodes.length > 0) {
      this.__headingNodes.forEach((node) => {
        node.addEventListener("click", this.__copyLinkHandler);
        node.addEventListener("pointerenter", this.__hoverIntentEnterHandler);
        node.addEventListener("pointerleave", this.__hoverIntentLeaveHandler);
      });
    }
  }

  HAXCMSGlobalStyleSheetContent() {
    return [
      css`
        .haxcms-copyable::after {
          display: block;
          content: "";
          background-image: url("${unsafeCSS(
            SimpleIconsetStore.getIcon("icons:link"),
          )}");
          background-repeat: no-repeat;
          float: right;
          height: 36px;
          width: 36px;
        }
        body.dark-mode .haxcms-copyable::after {
          filter: invert(1);
        }
        @media (prefers-color-scheme: dark) {
          .haxcms-copyable::after {
            filter: invert(1);
          }
        }
      `,
      editableTableDisplayStyles,
    ];
  }

  copyLink(e) {
    let target = e.target;
    if (!target) {
      target = e.path[0];
    }
    if (!target.id && target.parentNode && target.parentNode.id) {
      target = target.parentNode;
    }
    if (this.isSafari) {
      target.scrollIntoView();
    } else {
      target.scrollIntoView(this.HAXCMSThemeSettings.scrollSettings);
    }
    // alter URL state
    let headingLink =
      globalThis.location.origin +
      globalThis.location.pathname +
      "#" +
      target.getAttribute("id");
    globalThis.history.pushState({}, null, headingLink);
    globalThis.dispatchEvent(new PopStateEvent("popstate"));
    copyToClipboard(headingLink, "Anchor link copied!");
  }
  _syncResponsiveStoreState() {
    if (
      typeof this.responsiveSize === "string" &&
      this.responsiveSize !== "" &&
      store.responsiveSize !== this.responsiveSize
    ) {
      store.responsiveSize = this.responsiveSize;
    }
  }
  static get properties() {
    let props = {};
    if (super.properties) {
      props = super.properties;
    }
    return {
      ...props,
      // safari is terrible, fml
      isSafari: {
        type: Boolean,
        reflect: true,
        attribute: "is-safari",
      },
      /**
       * Class for the color
       */
      hexColor: {
        type: String,
        attribute: "hex-color",
      },
      /**
       * Color class work to apply
       */
      color: {
        type: String,
        reflect: true,
      },
      /**
       * editting state for the page
       */
      editMode: {
        type: Boolean,
        reflect: true,
        attribute: "edit-mode",
      },
      trayStatus: {
        type: String,
        reflect: true,
        attribute: "tray-status",
      },
      /**
       * editting state for the page
       */
      isLoggedIn: {
        type: Boolean,
        reflect: true,
        attribute: "is-logged-in",
      },
      /**
       * DOM node that wraps the slot
       */
      contentContainer: {
        type: Object,
      },
      /**
       * Indicates the active page has no meaningful rendered body content.
       */
      emptyContent: {
        type: Boolean,
        reflect: true,
        attribute: "empty-content",
      },
      /**
       * location as object
       */
      _location: {
        type: Object,
      },
      /**
       * True once this theme instance has completed its first render and
       * its content is safe to reveal (used to gate the initial FOUC fade-in).
       */
      themeReady: {
        type: Boolean,
        reflect: true,
        attribute: "theme-ready",
      },
    };
  }
  static get styles() {
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      styles,
      css`
        /* Skip link (WCAG 2.4.1 Bypass Blocks) — visually hidden until focused */
        .skip-link {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        .skip-link:focus {
          position: fixed;
          top: 0;
          left: 0;
          width: auto;
          height: auto;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          margin: var(--ddd-spacing-2);
          overflow: visible;
          clip: auto;
          white-space: normal;
          z-index: 10000;
          background: var(--ddd-theme-default-white, #fff);
          color: var(--ddd-theme-default-coalyGray, #000);
          border: 2px solid currentColor;
          text-decoration: none;
          font-family: var(--ddd-font-primary, sans-serif);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        /*
         * In edit mode the slotted content is replaced by the HAX editor, so
         * the skip-to-content link has no valid target. Hide it and remove it
         * from the tab order so the user can't Tab to it and jump focus into
         * the editor / hidden content area while modifying the page. Mirrors
         * the edit-mode blocking applied to site-breadcrumb and site-menu.
         */
        :host([edit-mode]) .skip-link {
          display: none;
        }
        :host([edit-mode]) {
          opacity: 1;
        }
        :host([hidden]) {
          display: none;
        }
        [hidden] {
          display: none !important;
        }
        /*
         * Initial-load-only fade-in: hidden until this theme instance has
         * completed its first render (theme-ready), to reduce FOUC. This
         * never re-triggers on in-app navigation since themeReady only
         * flips once, on first paint. visibility is toggled alongside
         * opacity (mirroring haxcms-site-builder's own theme-loaded gate)
         * so hidden content also isn't focusable/interactive in the interim.
         */
        :host {
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.6s ease-in-out;
        }
        :host([theme-ready]) {
          opacity: 1;
          visibility: visible;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            transition-delay: 0ms !important;
            scroll-behavior: auto !important;
          }
        }
        /**
        * Hide the slotted content during edit mode. This must be here to work.
        */
        :host([edit-mode]) #slot {
          display: none;
        }
        #slot {
          min-height: var(--haxcms-theme-content-min-height, 50vh);
        }
        :host([empty-content]) #slot {
          min-height: var(--haxcms-theme-empty-content-min-height, 40vh);
        }
        @media (max-width: 900px) {
          #slot {
            min-height: var(--haxcms-theme-content-min-height-mobile, 38vh);
          }
          :host([empty-content]) #slot {
            min-height: var(
              --haxcms-theme-empty-content-min-height-mobile,
              22vh
            );
          }
        }
      `,
    ];
  }
  // LitElement life cycle
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }

    if (this.contentContainer == null) {
      this.contentContainer =
        this.shadowRoot.querySelector("#contentcontainer");
    }
    this._syncResponsiveStoreState();
    // update the global managed CSS styles so we can "theme" the content
    // witout leaning on ::slotted which doesn't work always
    render(this.HAXCMSGlobalStyleSheetContent(), store.themeStyleElement);
    // delay bc this shouldn't block page load in any way
    setTimeout(() => {
      setTimeout(() => {
        if (
          this._location &&
          this._location.hash &&
          this.HAXCMSThemeSettings.autoScroll
        ) {
          let target = this.querySelector(this._location.hash);
          if (target) {
            if (this.isSafari) {
              target.scrollIntoView();
            } else {
              target.scrollIntoView(this.HAXCMSThemeSettings.scrollSettings);
            }
          }
        }
      }, 0);
      if (typeof this.__refreshHeadingListeners === "function") {
        this.__refreshHeadingListeners();
      }
    }, 1500);
    // wait a couple of frames past firstUpdated so the browser has actually
    // painted this theme's first render before revealing it; this is what
    // distinguishes theme-ready from firstUpdated firing (which happens
    // before paint is guaranteed to have settled)
    globalThis.requestAnimationFrame(() => {
      globalThis.requestAnimationFrame(() => {
        this.themeReady = true;
      });
    });
  }
  disconnectedCallback() {
    this.__removeHeadingListeners();
    super.disconnectedCallback();
  }
  // LitElement life cycle
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "_location") {
        // skip the transition on the very first location assignment (initial
        // page load); there's no meaningful prior visual state to animate
        // from and the browser is still settling, which is what causes the
        // benign but noisy `AbortError: Transition was skipped` rejection.
        const hadPriorLocation = typeof oldValue !== typeof undefined;
        const reduceMotion =
          globalThis.matchMedia &&
          globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (
          this.HAXCMSThemeSettings.locationStartViewTransition &&
          globalThis.document &&
          globalThis.document.startViewTransition &&
          hadPriorLocation &&
          !reduceMotion
        ) {
          const transition = globalThis.document.startViewTransition(() => {
            this._locationChanged(this[propName], oldValue);
          });
          // a superseded/skipped transition rejects `ready`; this is expected
          // per spec so swallow it instead of letting it surface as an
          // unhandled promise rejection in the console.
          transition.ready.catch(() => {});
        } else {
          this._locationChanged(this[propName], oldValue);
        }
        setTimeout(() => {
          if (
            this._location &&
            this._location.hash &&
            this.HAXCMSThemeSettings.autoScroll
          ) {
            let target = this.querySelector(this._location.hash);
            if (target) {
              if (this.isSafari) {
                target.scrollIntoView();
              } else {
                target.scrollIntoView(this.HAXCMSThemeSettings.scrollSettings);
              }
            }
          }
        }, 0);
      }
      if (propName == "color") {
        this._colorChanged(this[propName], oldValue);
      }
      if (propName == "responsiveSize") {
        this._syncResponsiveStoreState();
      }
      if (propName == "themeReady" && this.themeReady) {
        // this replaces the old `haxcms-theme-ready` global event, which used
        // to fire from haxcms-site-builder at module-import/registration time
        // (before this theme instance had painted anything). This event fires
        // once, at the exact moment `theme-ready` is set on this instance
        // (post first-paint), and bubbles/composes up through the DOM so any
        // ecosystem code can listen for it at `globalThis`/`window` level
        // without haxcms-site-builder needing to relay it.
        this.dispatchEvent(
          new CustomEvent("theme-ready-changed", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this,
          }),
        );
      }
      if (propName == "contentContainer") {
        // fire an to match notify
        this.dispatchEvent(
          new CustomEvent("content-container-changed", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this[propName],
          }),
        );
        this._contentContainerChanged(this[propName], oldValue);
      }
      if (propName == "isLoggedIn") {
        // fire an to match notify
        this.dispatchEvent(
          new CustomEvent("is-logged-in-changed", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this[propName],
          }),
        );
      }
      if (propName == "editMode") {
        // fire an to match notify
        this.dispatchEvent(
          new CustomEvent("edit-mode-changed", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this[propName],
          }),
        );
        this._editModeChanged(this[propName], oldValue);
      }
    });
  }
}

export {
  HAXCMSLitElementTheme,
  css,
  unsafeCSS,
  html,
  svg,
  mathml,
  store,
  autorun,
  toJS,
};
