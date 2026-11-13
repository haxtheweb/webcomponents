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
import { TailwindTokens } from "@haxtheweb/tailwind-theme/lib/TailwindTokens.js";
import { TailwindDDDMap } from "@haxtheweb/tailwind-theme/lib/TailwindDDDMap.js";
import { activateTailwindDesignSystem } from "@haxtheweb/tailwind-theme/lib/TailwindDesignSystem.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/haxcms-elements/lib/ui-components/site/site-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";

/**
 * `tailwind-theme`
 * A HAXcms theme in a Tailwind-style documentation layout (top bar, sidebar,
 * reading column), built on the Tailwind DDD bridge: every HAX block reads
 * --ddd-* tokens, which point at Tailwind theme tokens while it is active.
 * Authored content uses no utility classes.
 *
 * @title Tailwind
 * @haxcms-theme-category Website, Course, Documentation
 * @haxcms-theme-priority 50
 * @demo demo/index.html
 * @element tailwind-theme
 */
class TailwindTheme extends HAXCMSThemeParts(DDDSuper(HAXCMSLitElementTheme)) {
  static get tag() {
    return "tailwind-theme";
  }

  HAXCMSGlobalStyleSheetContent() {
    return [
      ...super.HAXCMSGlobalStyleSheetContent(),
      css`
        body {
          margin: 0;
          background-color: light-dark(#ffffff, #030712);
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
    activateTailwindDesignSystem();
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
      TailwindTokens,
      TailwindDDDMap,
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
          color: light-dark(var(--color-gray-950), var(--color-white));
          background-color: light-dark(
            var(--color-white),
            var(--color-gray-950)
          );
          font-family: var(--ddd-font-primary);
          --tailwind-theme-header-height: 56px;
          --tailwind-theme-nav-width: 288px;
          --tailwind-theme-line: light-dark(
            var(--color-gray-200),
            var(--color-gray-800)
          );
          --tailwind-theme-muted: light-dark(
            var(--color-gray-600),
            var(--color-gray-400)
          );
          --tailwind-theme-accent: light-dark(
            var(--color-blue-600),
            var(--color-blue-400)
          );
        }
        .header {
          position: sticky;
          top: 0;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          height: var(--tailwind-theme-header-height);
          padding: 0 var(--ddd-spacing-6);
          background-color: light-dark(
            var(--color-white),
            var(--color-gray-950)
          );
          border-bottom: 1px solid var(--tailwind-theme-line);
        }
        .brand {
          flex: 1 1 auto;
          min-width: 0;
        }
        site-title {
          --site-title-heading-font-size: var(--ddd-font-size-4xs);
          --site-title-heading-font-weight: var(--font-weight-semibold);
          color: light-dark(var(--color-gray-950), var(--color-white));
        }
        .actions {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
        }
        .icon-button {
          --simple-icon-width: 20px;
          --simple-icon-height: 20px;
          --simple-icon-button-border-radius: var(--ddd-radius-sm);
          --site-modal-icon-color: var(--tailwind-theme-muted);
          color: var(--tailwind-theme-muted);
        }
        simple-icon-button-lite.icon-button {
          width: 36px;
          height: 36px;
          border-radius: var(--ddd-radius-sm);
        }
        simple-icon-button-lite.icon-button:hover {
          color: light-dark(var(--color-gray-950), var(--color-white));
          background-color: light-dark(
            var(--color-gray-100),
            var(--color-gray-800)
          );
        }
        .nav {
          top: var(--tailwind-theme-header-height);
          flex: 0 0 var(--tailwind-theme-nav-width);
          width: var(--tailwind-theme-nav-width);
          height: calc(100vh - var(--tailwind-theme-header-height));
          padding: var(--ddd-spacing-8) var(--ddd-spacing-6);
          background-color: light-dark(
            var(--color-white),
            var(--color-gray-950)
          );
          border-right: 1px solid var(--tailwind-theme-line);
        }
        site-menu {
          --site-menu-color: var(--tailwind-theme-muted);
          --site-menu-font-size: var(--text-sm);
          --map-menu-container-padding: 0;
          --map-menu-gap: 0;
          --map-menu-item-border-radius: var(--ddd-radius-sm);
          --map-menu-item-a-color: var(--tailwind-theme-muted);
          --map-menu-item-a-active-color: var(--tailwind-theme-accent);
          --map-menu-item-a-active-background-color: transparent;
          --map-menu-item-active-item-color: var(--tailwind-theme-accent);
          --map-menu-item-icon-active-color: var(--tailwind-theme-accent);
          --map-menu-item-button-active-font-weight: var(
            --font-weight-semibold
          );
          --map-menu-font-weight: var(--ddd-font-weight-regular);
        }
        .content {
          padding: var(--ddd-spacing-10) var(--ddd-spacing-10) 0;
          max-width: var(--tailwind-theme-content-max-width, 768px);
          box-sizing: border-box;
        }
        site-breadcrumb {
          --site-breadcrumb-margin: 0 0 var(--ddd-spacing-2) 0;
          --site-breadcrumb-font-size: var(--text-sm);
          --site-breadcrumb-color: var(--tailwind-theme-accent);
          --site-breadcrumb-color-hover: light-dark(
            var(--color-gray-950),
            var(--color-white)
          );
          --site-breadcrumb-last-color: var(--tailwind-theme-muted);
          --site-breadcrumb-separator-color: var(--tailwind-theme-muted);
        }
        site-active-title h1 {
          margin: 0 0 var(--ddd-spacing-8) 0;
          font-family: var(--ddd-font-secondary);
          font-size: var(--ddd-font-size-m);
          font-weight: var(--font-weight-semibold);
          letter-spacing: -0.025em;
          line-height: 1.2;
          color: light-dark(var(--color-gray-950), var(--color-white));
        }
        .pager {
          max-width: var(--tailwind-theme-content-max-width, 768px);
          box-sizing: border-box;
          margin: var(--ddd-spacing-12) var(--ddd-spacing-10) 0;
          padding: var(--ddd-spacing-6) 0;
          border-top: 1px solid var(--tailwind-theme-line);
        }
        site-menu-button {
          --site-menu-button-icon-fill-color: var(--tailwind-theme-muted);
          --site-menu-button-link-color: light-dark(
            var(--color-gray-950),
            var(--color-white)
          );
          --site-menu-button-button-border-radius: var(--ddd-radius-sm);
          --site-menu-button-button-hover-background-color: light-dark(
            var(--color-gray-100),
            var(--color-gray-800)
          );
        }
        footer {
          padding: var(--ddd-spacing-6) var(--ddd-spacing-10);
          color: var(--tailwind-theme-muted);
          font-size: var(--text-sm);
        }
        @media (max-width: 1024px) {
          .nav {
            position: fixed;
            left: 0;
            z-index: 2;
            box-shadow: var(--ddd-boxShadow-lg);
          }
        }
        @media (max-width: 640px) {
          .header {
            padding: 0 var(--ddd-spacing-4);
          }
          .content,
          footer {
            padding-left: var(--ddd-spacing-4);
            padding-right: var(--ddd-spacing-4);
          }
          .pager {
            margin-left: var(--ddd-spacing-4);
            margin-right: var(--ddd-spacing-4);
          }
          .nav {
            width: min(var(--tailwind-theme-nav-width), 85vw);
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
      <header class="header" part="header">
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
    this.__mq = globalThis.matchMedia("(max-width: 1024px)");
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
globalThis.customElements.define(TailwindTheme.tag, TailwindTheme);
export { TailwindTheme };
