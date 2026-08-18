/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSThemeParts } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { HAXCMSMobileMenuMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSMobileMenu.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu-button.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/layout/site-region.js";
import "@haxtheweb/scroll-button/scroll-button.js";

/**
 * @title Chamfer
 * `Fixed-width HAXcms theme with a left navigation column and a chamfered
 * (notched) top-left corner on the body area.`
 *
 * @microcopy - language worth noting:
 *  - HAXcms - A headless content management system
 *  - HAXCMSLitElementTheme - A class that provides correct baseline wiring to build a new theme that HAX can use
 *  - chamfer - the cut/notched corner detail this theme is named for
 *
 * @haxcms-theme-category Website
 * @haxcms-theme-internal false
 * @haxcms-theme-hidden true
 * @haxcms-theme-priority 0
 * @demo demo/index.html
 * @element chamfer-theme
 */
class ChamferTheme extends HAXCMSThemeParts(
  HAXCMSMobileMenuMixin(DDDSuper(HAXCMSLitElementTheme)),
) {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "chamfer-theme";
  }

  constructor() {
    super();
    this.image = "";
    this.imageAlt = "";
    this.imageLink = "";
    this.t = {
      ...this.t,
      skipToContent: "Skip to content",
    };
    this.__disposer = this.__disposer ? this.__disposer : [];
    this.__disposer.push(
      autorun((reaction) => {
        // guard for contexts where the store isn't fully hydrated yet
        const _mobx_val_0 = toJS(
          store.themeData && store.themeData.variables,
        );
        Promise.resolve().then(() => {
          if (store.themeData && store.themeData.variables) {
            const vars = _mobx_val_0;
            this.image = vars.image;
            this.imageAlt = vars.imageAlt;
            this.imageLink = vars.imageLink;
          }
        });
      }),
    );
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.HAXCMSThemeSettings.autoScroll = true;
    this.HAXCMSThemeSettings.scrollTarget =
      this.shadowRoot.querySelector("#contentcontainer");
    globalThis.AbsolutePositionStateManager.requestAvailability().scrollTarget =
      this.HAXCMSThemeSettings.scrollTarget;
  }

  // allows for global styles to be set against the entire document
  HAXCMSGlobalStyleSheetContent() {
    return [
      ...super.HAXCMSGlobalStyleSheetContent(),
      css`
        body {
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
        }
      `,
    ];
  }

  //styles function
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          color-scheme: light dark;
          --chamfer-notch-size: var(--ddd-spacing-8);
          --chamfer-max-width: 1100px;
          --chamfer-menu-width: 300px;
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          background-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-coalyGray)
          );
          font-family: var(--ddd-font-primary);
        }
        :host([edit-mode]) {
          margin: var(
            --hax-tray-element-align-margin,
            0 0 0
              calc(var(--hax-tray-width) - var(--hax-tray-menubar-min-width))
          );
          transition: margin 0.6s ease-in-out;
        }
        :host([edit-mode][tray-status="collapsed"]) {
          margin: var(--ddd-spacing-0);
        }
        @media (max-width: 800px) {
          :host([edit-mode]) {
            margin: var(--ddd-spacing-0);
          }
        }
        a:focus-visible,
        button:focus-visible {
          outline: var(--ddd-border-size-sm) solid currentColor;
          outline-offset: var(--ddd-spacing-1);
        }

        .chamfer-wrapper {
          max-width: var(--chamfer-max-width);
          margin: var(--ddd-spacing-0) auto;
        }

        /* Banner region: site-wide, sourced from the site manifest */
        .banner {
          position: relative;
          overflow: hidden;
          background-color: var(--ddd-theme-default-coalyGray);
        }
        .banner img {
          display: block;
          width: 100%;
          height: 100%;
          max-height: 340px;
          object-fit: cover;
        }
        .banner:empty,
        .banner:not(:has(img, ::slotted(*))) {
          display: none;
        }

        /* Body area: left navigation column + main content, with a chamfered
           top-left corner as the defining visual detail of this theme */
        .body-area {
          display: flex;
          align-items: stretch;
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          clip-path: polygon(
            var(--chamfer-notch-size) 0,
            100% 0,
            100% 100%,
            0 100%,
            0 var(--chamfer-notch-size)
          );
        }

        .site-menu-col {
          flex: 0 0 auto;
          width: var(--chamfer-menu-width);
          max-width: 80vw;
          background-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-coalyGray)
          );
          border-right: var(--ddd-border-sm);
        }
        site-menu {
          --site-menu-padding: var(--ddd-spacing-3) 0;
          --site-menu-font-size: var(--ddd-font-size-3xs);
          --site-menu-item-active-item-color: var(
            --ddd-theme-default-inventOrange
          );
        }
        .below-menu-region {
          padding: var(--ddd-spacing-4);
        }
        #haxcmsmobilemenubutton {
          display: none;
          margin: var(--ddd-spacing-2);
        }

        main {
          flex: 1 1 auto;
          min-width: 0;
        }
        article {
          display: block;
          padding: var(--ddd-spacing-6);
        }
        site-breadcrumb {
          display: flex;
          margin: 0 0 var(--ddd-spacing-2) 0;
        }
        site-active-title h1 {
          font-size: var(--ddd-font-size-3xl);
          margin: 0 0 var(--ddd-spacing-4) 0;
        }

        footer {
          padding: var(--ddd-spacing-6);
          background-color: var(--ddd-theme-default-coalyGray);
          color: var(--ddd-theme-default-white);
          text-align: center;
        }
        footer:empty {
          display: none;
        }

        scroll-button {
          position: fixed;
          right: var(--ddd-spacing-0);
          bottom: var(--ddd-spacing-0);
          z-index: 10000;
          --simple-icon-width: var(--ddd-icon-sm);
          --simple-icon-height: var(--ddd-icon-sm);
          --simple-icon-button-border-radius: none;
        }

        @media (max-width: 900px) {
          .chamfer-wrapper {
            max-width: 100%;
          }
          .body-area {
            --chamfer-notch-size: var(--ddd-spacing-4);
          }
          #haxcmsmobilemenubutton {
            display: inline-flex;
          }
          .site-menu-col {
            position: fixed;
            top: var(--ddd-spacing-0);
            left: var(--ddd-spacing-0);
            bottom: var(--ddd-spacing-0);
            z-index: 20;
            transition: transform 0.3s ease-in-out;
            overflow-y: auto;
          }
          :host(:not([menu-open])) .site-menu-col {
            transform: translateX(calc(-1 * var(--chamfer-menu-width)));
          }
          article {
            padding: var(--ddd-spacing-4);
          }
        }
      `,
    ];
  }

  // render function
  render() {
    return html`
      <a class="skip-link" href="#contentcontainer"
        >${this.t.skipToContent}</a
      >
      <div class="chamfer-wrapper">
        <div class="banner" part="banner">
          <site-region name="banner"></site-region>
          <slot name="banner">
            ${this.image
              ? html`
                  <a href="${this.imageLink}">
                    <img
                      src="${this.image}"
                      alt="${this.imageAlt}"
                      loading="lazy"
                      decoding="async"
                      fetchpriority="low"
                    />
                  </a>
                `
              : ``}
          </slot>
        </div>
        <div class="body-area" part="body-area">
          <div class="site-menu-col" part="site-menu">
            ${this.HAXCMSMobileMenuButton()} ${this.HAXCMSMobileMenu()}
            <div class="below-menu-region" part="below-menu">
              <site-region name="belowMenu"></site-region>
              <slot name="below-menu"></slot>
            </div>
          </div>
          <main>
            <article id="contentcontainer" tabindex="-1">
              <site-breadcrumb part="page-breadcrumb"></site-breadcrumb>
              <site-active-title part="page-title"></site-active-title>
              <div id="slot"><slot></slot></div>
            </article>
          </main>
        </div>
        <footer part="footer">
          <site-region name="footerPrimary"></site-region>
          <slot name="footer"></slot>
        </footer>
      </div>
      <scroll-button></scroll-button>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      image: { type: String },
      imageAlt: { type: String },
      imageLink: { type: String },
    };
  }
}
globalThis.customElements.define(ChamferTheme.tag, ChamferTheme);
export { ChamferTheme };
