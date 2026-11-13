/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSThemeParts } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NManagerStore } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { MaterialTokens } from "@haxtheweb/material-theme/lib/MaterialTokens.js";
import { MaterialDDDMap } from "@haxtheweb/material-theme/lib/MaterialDDDMap.js";
import { activateMaterialDesignSystem } from "@haxtheweb/material-theme/lib/MaterialDesignSystem.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/haxcms-elements/lib/ui-components/site/site-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";

/**
 * `material-theme`
 * A HAXcms theme in the Material Design 3 layout (top app bar, navigation
 * drawer, content surface), built on the Material DDD bridge: every HAX block
 * reads --ddd-* tokens, which point at Material 3 tokens while it is
 * active.
 *
 * @title Material 3
 * @haxcms-theme-category Website, Course, Documentation
 * @haxcms-theme-priority 50
 * @demo demo/index.html
 * @element material-theme
 */
class MaterialTheme extends HAXCMSThemeParts(DDDSuper(HAXCMSLitElementTheme)) {
  static get tag() {
    return "material-theme";
  }

  HAXCMSGlobalStyleSheetContent() {
    return [
      ...super.HAXCMSGlobalStyleSheetContent(),
      css`
        body {
          margin: 0;
          background-color: light-dark(#fef7ff, #141218);
        }
      `,
    ];
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      skipToContent: "Skip to content",
      toggleSiteMenu: "Toggle site menu",
      siteNavigation: "Site navigation",
      searchSite: "Search site",
      search: "Search",
      toggleDarkMode: "Toggle dark mode",
      pageNavigation: "Page navigation",
    };
    // no I18NMixin in this class chain, so register with the store directly
    I18NManagerStore.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
    this.HAXCMSThemeSettings.autoScroll = true;
    this.sidebarOpen = true;
    this._mobile = false;
    this.__themeDisposers = [];
    activateMaterialDesignSystem();
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js"
    );
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js"
    );
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu-button.js"
    );
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/layout/site-modal.js"
    );
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/site/site-search.js"
    );
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/layout/site-region.js"
    );
  }

  static get properties() {
    return {
      ...super.properties,
      sidebarOpen: { type: Boolean, reflect: true, attribute: "sidebar-open" },
      _mobile: { type: Boolean, state: true },
      _dark: { type: Boolean, state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      MaterialTokens,
      MaterialDDDMap,
      css`
        :host([hidden]) {
          display: none;
        }
        a:focus-visible,
        button:focus-visible,
        simple-icon-button-lite:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset, 2px);
        }
        site-title {
          --site-title-link-text-decoration: none;
          --site-title-heading-margin: 0;
          --site-title-link-display: inline;
        }
        .layout {
          display: flex;
          align-items: flex-start;
        }
        .nav {
          position: sticky;
          overflow-y: auto;
          box-sizing: border-box;
        }
        :host(:not([sidebar-open])) .nav {
          display: none;
        }
        site-menu {
          height: auto;
          --site-menu-background-color: transparent;
          --site-menu-container-background-color: transparent;
          --map-menu-parent-background-color: transparent;
          /* parents carry the chevron at the start of the row */
          --map-menu-header-title-margin: var(--ddd-spacing-4);
          font-family: var(--ddd-font-navigation);
        }
        main {
          flex: 1 1 auto;
          min-width: 0;
        }
        #slot {
          padding: 0;
        }
        .pager {
          display: flex;
          justify-content: space-between;
          gap: var(--ddd-spacing-4);
        }
        site-menu-button {
          --site-menu-button-link-decoration: none;
        }
        site-menu-button[disabled] {
          visibility: hidden;
        }
        :host([edit-mode]) .actions,
        :host([edit-mode]) .pager {
          opacity: 0.4;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            transition: none !important;
          }
        }

        :host {
          display: block;
          min-height: 100vh;
          color: var(--md-sys-color-on-surface);
          background-color: var(--md-sys-color-surface);
          font-family: var(--ddd-font-primary);
          --material-theme-bar-height: 64px;
          --material-theme-drawer-width: 304px;
        }
        .top-app-bar {
          position: sticky;
          top: 0;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          height: var(--material-theme-bar-height);
          padding: 0 var(--ddd-spacing-1);
          background-color: var(--md-sys-color-surface-container);
        }
        .brand {
          flex: 1 1 auto;
          min-width: 0;
          padding: 0 var(--ddd-spacing-1);
        }
        site-title {
          --site-title-heading-font-size: var(--ddd-font-size-xs);
          --site-title-heading-font-weight: var(--ddd-font-weight-regular);
          color: var(--md-sys-color-on-surface);
        }
        .actions {
          display: flex;
          align-items: center;
        }
        .icon-button {
          --simple-icon-width: 24px;
          --simple-icon-height: 24px;
          --simple-icon-button-border-radius: var(--md-sys-shape-corner-full);
          --site-modal-icon-color: var(--md-sys-color-on-surface-variant);
          color: var(--md-sys-color-on-surface-variant);
        }
        simple-icon-button-lite.icon-button {
          width: 48px;
          height: 48px;
          border-radius: var(--md-sys-shape-corner-full);
        }
        simple-icon-button-lite.icon-button:hover {
          background-color: color-mix(
            in srgb,
            var(--md-sys-color-on-surface-variant)
              calc(var(--ddd-state-hover-opacity) * 100%),
            transparent
          );
        }
        .nav {
          top: var(--material-theme-bar-height);
          flex: 0 0 var(--material-theme-drawer-width);
          width: var(--material-theme-drawer-width);
          height: calc(100vh - var(--material-theme-bar-height));
          padding: var(--ddd-spacing-3);
          background-color: var(--md-sys-color-surface-container-low);
          border-radius: 0 var(--md-sys-shape-corner-large)
            var(--md-sys-shape-corner-large) 0;
        }
        site-menu {
          --site-menu-color: var(--md-sys-color-on-surface-variant);
          --site-menu-font-size: var(--ddd-font-size-5xs);
          --map-menu-container-padding: 0;
          --map-menu-gap: 0;
          --map-menu-item-height: 48px;
          --map-menu-item-border-radius: var(--md-sys-shape-corner-full);
          --map-menu-item-a-color: var(--md-sys-color-on-surface-variant);
          --map-menu-item-a-active-color: var(
            --md-sys-color-on-secondary-container
          );
          --map-menu-item-a-active-background-color: var(
            --md-sys-color-secondary-container
          );
          --map-menu-item-active-item-color: var(
            --md-sys-color-on-secondary-container
          );
          --map-menu-item-icon-active-color: var(
            --md-sys-color-on-secondary-container
          );
          --map-menu-item-button-active-font-weight: var(
            --ddd-font-weight-bold
          );
          --map-menu-font-weight: var(--ddd-font-weight-medium);
        }
        .content {
          padding: var(--ddd-spacing-6) var(--ddd-spacing-10) 0;
          max-width: var(--material-theme-content-max-width, 960px);
          box-sizing: border-box;
        }
        site-breadcrumb {
          --site-breadcrumb-margin: 0 0 var(--ddd-spacing-2) 0;
          --site-breadcrumb-font-size: var(--ddd-font-size-5xs);
          --site-breadcrumb-color: var(--md-sys-color-primary);
          --site-breadcrumb-color-hover: var(--md-sys-color-on-surface);
          --site-breadcrumb-last-color: var(--md-sys-color-on-surface-variant);
          --site-breadcrumb-separator-color: var(
            --md-sys-color-on-surface-variant
          );
        }
        site-active-title h1 {
          margin: 0 0 var(--ddd-spacing-6) 0;
          font-family: var(--ddd-font-secondary);
          font-size: var(--ddd-font-size-m);
          font-weight: var(--ddd-font-weight-regular);
          line-height: 1.25;
          color: var(--md-sys-color-on-surface);
        }
        .pager {
          margin-top: var(--ddd-spacing-10);
          padding: var(--ddd-spacing-4) var(--ddd-spacing-10);
          border-top: 1px solid var(--md-sys-color-outline-variant);
        }
        site-menu-button {
          --site-menu-button-icon-fill-color: var(--md-sys-color-primary);
          --site-menu-button-link-color: var(--md-sys-color-primary);
          --site-menu-button-button-border-radius: var(
            --md-sys-shape-corner-full
          );
          --site-menu-button-button-hover-background-color: color-mix(
            in srgb,
            var(--md-sys-color-primary)
              calc(var(--ddd-state-hover-opacity) * 100%),
            transparent
          );
        }
        footer {
          padding: var(--ddd-spacing-4) var(--ddd-spacing-10);
          color: var(--md-sys-color-on-surface-variant);
          font-size: var(--ddd-font-size-5xs);
        }
        @media (max-width: 840px) {
          .nav {
            position: fixed;
            left: 0;
            z-index: 2;
            box-shadow: var(--ddd-boxShadow-md);
          }
        }
        @media (max-width: 600px) {
          .content,
          .pager,
          footer {
            padding-left: var(--ddd-spacing-4);
            padding-right: var(--ddd-spacing-4);
          }
          .nav {
            width: min(var(--material-theme-drawer-width), 85vw);
          }
          site-active-title h1 {
            font-size: var(--ddd-font-size-s);
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <a class="skip-link" href="#contentcontainer">${this.t.skipToContent}</a>
      <header class="top-app-bar" part="header">
        ${this.renderNavToggle()}
        <div class="brand">
          <site-title
            ?disabled="${this.editMode}"
            part="site-title"
          ></site-title>
        </div>
        ${this.renderActions()}
      </header>
      <div class="layout">
        ${this.renderNav()}
        <main>
          <div class="content">
            <site-breadcrumb part="page-breadcrumb"></site-breadcrumb>
            <site-active-title part="page-title"></site-active-title>
            <article id="contentcontainer">
              <section id="slot"><slot></slot></section>
            </article>
          </div>
          ${this.renderPager()}
          <footer part="footer">
            <site-region name="footerPrimary"></site-region>
          </footer>
        </main>
      </div>
    `;
  }

  renderNavToggle() {
    return html`<simple-icon-button-lite
      class="icon-button nav-toggle"
      icon="${this.sidebarOpen && this._mobile ? "close" : "menu"}"
      title="${this.t.toggleSiteMenu}"
      aria-expanded="${this.sidebarOpen ? "true" : "false"}"
      aria-controls="nav"
      @click="${this.toggleSidebar}"
    ></simple-icon-button-lite>`;
  }

  renderActions() {
    return html`<div class="actions">
      <site-modal
        class="icon-button"
        ?disabled="${this.editMode}"
        icon="icons:search"
        title="${this.t.searchSite}"
        button-label="${this.t.search}"
        part="search-btn"
      >
        <site-search></site-search>
      </site-modal>
      <simple-icon-button-lite
        class="icon-button"
        icon="${this._dark ? "image:brightness-7" : "image:brightness-3"}"
        title="${this.t.toggleDarkMode}"
        aria-pressed="${this._dark ? "true" : "false"}"
        @click="${this.toggleDarkMode}"
        part="dark-mode-btn"
      ></simple-icon-button-lite>
    </div>`;
  }

  renderNav() {
    return html`<div
      class="nav"
      id="nav"
      part="nav"
      ?inert="${!this.sidebarOpen}"
    >
      <nav aria-label="${this.t.siteNavigation}">
        <site-menu part="site-menu"></site-menu>
      </nav>
    </div>`;
  }

  renderPager() {
    return html`<nav class="pager" aria-label="${this.t.pageNavigation}">
      <site-menu-button type="prev" position="right"></site-menu-button>
      <site-menu-button type="next" position="left"></site-menu-button>
    </nav>`;
  }

  connectedCallback() {
    super.connectedCallback();
    this.__mq = globalThis.matchMedia("(max-width: 840px)");
    this.__mqHandler = (e) => {
      this._mobile = e.matches;
      // below the breakpoint the navigation overlays the page, so start closed
      this.sidebarOpen = !e.matches;
    };
    this.__mq.addEventListener("change", this.__mqHandler);
    this.__mqHandler(this.__mq);
    this.__themeDisposers.push(
      autorun(() => {
        this._dark = !!toJS(store.darkMode);
      }),
    );
    this.__themeDisposers.push(
      autorun(() => {
        // close the overlay navigation after navigating on small screens
        toJS(store.activeId);
        if (this._mobile) {
          this.sidebarOpen = false;
        }
      }),
    );
  }

  disconnectedCallback() {
    if (this.__mq) {
      this.__mq.removeEventListener("change", this.__mqHandler);
    }
    this.__themeDisposers.forEach((dispose) => dispose());
    this.__themeDisposers = [];
    super.disconnectedCallback();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleDarkMode() {
    store.darkMode = !store.darkMode;
  }
}
globalThis.customElements.define(MaterialTheme.tag, MaterialTheme);
export { MaterialTheme };
