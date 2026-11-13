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
import { ShadcnTokens } from "@haxtheweb/shadcn-theme/lib/ShadcnTokens.js";
import { ShadcnDDDMap } from "@haxtheweb/shadcn-theme/lib/ShadcnDDDMap.js";
import { activateShadcnDesignSystem } from "@haxtheweb/shadcn-theme/lib/ShadcnDesignSystem.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/haxcms-elements/lib/ui-components/site/site-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";

/**
 * `shadcn-theme`
 * A HAXcms theme in the shadcn/ui sidebar layout (sidebar, inset panel,
 * header with a breadcrumb), built on the shadcn DDD bridge: every HAX block
 * reads --ddd-* tokens, which point at shadcn and Tailwind tokens while it
 * is active.
 *
 * @title shadcn/ui
 * @haxcms-theme-category Website, Course, Documentation
 * @haxcms-theme-priority 50
 * @demo demo/index.html
 * @element shadcn-theme
 */
class ShadcnTheme extends HAXCMSThemeParts(DDDSuper(HAXCMSLitElementTheme)) {
  static get tag() {
    return "shadcn-theme";
  }

  HAXCMSGlobalStyleSheetContent() {
    return [
      ...super.HAXCMSGlobalStyleSheetContent(),
      css`
        body {
          margin: 0;
          background-color: light-dark(#fafafa, #171717);
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
    activateShadcnDesignSystem();
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
      ShadcnTokens,
      ShadcnDDDMap,
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
          color: var(--sidebar-foreground);
          background-color: var(--sidebar);
          font-family: var(--ddd-font-primary);
          --shadcn-theme-nav-width: 256px;
          --shadcn-theme-inset: var(--ddd-spacing-2);
        }
        .nav {
          top: 0;
          flex: 0 0 var(--shadcn-theme-nav-width);
          width: var(--shadcn-theme-nav-width);
          height: 100vh;
          padding: var(--ddd-spacing-2);
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
          background-color: var(--sidebar);
          color: var(--sidebar-foreground);
        }
        .nav-header {
          padding: var(--ddd-spacing-2);
        }
        site-title {
          --site-title-heading-font-size: var(--text-sm);
          --site-title-heading-font-weight: var(--font-weight-semibold);
          color: var(--sidebar-foreground);
        }
        site-menu {
          --site-menu-color: var(--sidebar-foreground);
          --site-menu-font-size: var(--text-sm);
          --map-menu-container-padding: 0;
          --map-menu-gap: var(--ddd-spacing-1);
          --map-menu-item-border-radius: var(--ddd-radius-sm);
          --map-menu-item-a-color: var(--sidebar-foreground);
          --map-menu-item-a-active-color: var(--sidebar-accent-foreground);
          --map-menu-item-a-active-background-color: var(--sidebar-accent);
          --map-menu-item-active-item-color: var(--sidebar-accent-foreground);
          --map-menu-item-icon-active-color: var(--sidebar-accent-foreground);
          --map-menu-item-button-active-font-weight: var(
            --ddd-font-weight-medium
          );
          --map-menu-font-weight: var(--ddd-font-weight-regular);
        }
        main {
          margin: var(--shadcn-theme-inset) var(--shadcn-theme-inset)
            var(--shadcn-theme-inset) 0;
          min-height: calc(100vh - 2 * var(--shadcn-theme-inset));
          display: flex;
          flex-direction: column;
          border-radius: var(--ddd-radius-lg);
          background-color: var(--background);
          color: var(--foreground);
          box-shadow: var(--ddd-boxShadow-sm);
        }
        :host(:not([sidebar-open])) main {
          margin-left: var(--shadcn-theme-inset);
        }
        .inset-header {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          height: 64px;
          padding: 0 var(--ddd-spacing-4);
          border-bottom: 1px solid var(--border);
        }
        .separator {
          width: 1px;
          height: var(--ddd-spacing-4);
          margin-right: var(--ddd-spacing-2);
          background-color: var(--border);
        }
        site-breadcrumb {
          flex: 1 1 auto;
          min-width: 0;
          --site-breadcrumb-margin: 0;
          --site-breadcrumb-font-size: var(--text-sm);
          --site-breadcrumb-color: var(--muted-foreground);
          --site-breadcrumb-color-hover: var(--foreground);
          --site-breadcrumb-last-color: var(--foreground);
          --site-breadcrumb-separator-color: var(--muted-foreground);
        }
        .mobile-brand {
          display: none;
          flex: 1 1 auto;
          min-width: 0;
        }
        .actions {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
        }
        .icon-button {
          --simple-icon-width: 16px;
          --simple-icon-height: 16px;
          --simple-icon-button-border-radius: var(--ddd-radius-sm);
          --site-modal-icon-color: var(--foreground);
          color: var(--foreground);
        }
        simple-icon-button-lite.icon-button {
          width: 28px;
          height: 28px;
          border-radius: var(--ddd-radius-sm);
        }
        simple-icon-button-lite.icon-button:hover {
          background-color: var(--accent);
          color: var(--accent-foreground);
        }
        .content {
          flex: 1 1 auto;
          padding: var(--ddd-spacing-6) var(--ddd-spacing-8) 0;
          max-width: var(--shadcn-theme-content-max-width, 896px);
          box-sizing: border-box;
        }
        site-active-title h1 {
          margin: 0 0 var(--ddd-spacing-6) 0;
          font-family: var(--ddd-font-secondary);
          font-size: var(--ddd-font-size-m);
          font-weight: var(--font-weight-semibold);
          letter-spacing: -0.025em;
          line-height: 1.2;
          color: var(--foreground);
        }
        .pager {
          margin-top: var(--ddd-spacing-10);
          padding: var(--ddd-spacing-4) var(--ddd-spacing-8);
          border-top: 1px solid var(--border);
        }
        site-menu-button {
          --site-menu-button-icon-fill-color: var(--foreground);
          --site-menu-button-link-color: var(--foreground);
          --site-menu-button-button-border-radius: var(--ddd-radius-sm);
          --site-menu-button-button-hover-background-color: var(--accent);
        }
        footer {
          padding: var(--ddd-spacing-4) var(--ddd-spacing-8);
          color: var(--muted-foreground);
          font-size: var(--text-sm);
        }
        @media (max-width: 768px) {
          .mobile-brand {
            display: block;
          }
          .inset-header site-breadcrumb {
            display: none;
          }
          .nav {
            position: fixed;
            left: 0;
            z-index: 3;
            border-right: 1px solid var(--sidebar-border);
            box-shadow: var(--ddd-boxShadow-lg);
          }
          main,
          :host(:not([sidebar-open])) main {
            margin: 0;
            border-radius: 0;
            box-shadow: none;
            min-height: 100vh;
          }
          .content,
          .pager,
          footer {
            padding-left: var(--ddd-spacing-4);
            padding-right: var(--ddd-spacing-4);
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
      <div class="layout">
        <div class="nav" id="nav" part="nav" ?inert="${!this.sidebarOpen}">
          <div class="nav-header">
            <site-title
              ?disabled="${this.editMode}"
              part="site-title"
            ></site-title>
          </div>
          <nav aria-label="${this.t.siteNavigation}">
            <site-menu part="site-menu"></site-menu>
          </nav>
        </div>
        <main>
          <header class="inset-header" part="header">
            ${this.renderNavToggle()}
            <div class="separator" aria-hidden="true"></div>
            <div class="mobile-brand">
              <site-title ?disabled="${this.editMode}"></site-title>
            </div>
            <site-breadcrumb part="page-breadcrumb"></site-breadcrumb>
            ${this.renderActions()}
          </header>
          <div class="content">
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
    this.__mq = globalThis.matchMedia("(max-width: 768px)");
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
globalThis.customElements.define(ShadcnTheme.tag, ShadcnTheme);
export { ShadcnTheme };
