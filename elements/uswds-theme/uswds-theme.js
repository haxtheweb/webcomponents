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
import { UswdsTokens } from "@haxtheweb/uswds-theme/lib/UswdsTokens.js";
import { UswdsDDDMap } from "@haxtheweb/uswds-theme/lib/UswdsDDDMap.js";
import { activateUswdsDesignSystem } from "@haxtheweb/uswds-theme/lib/UswdsDesignSystem.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/haxcms-elements/lib/ui-components/site/site-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";

/**
 * `uswds-theme`
 * A HAXcms theme in the U.S. Web Design System layout (basic header, side
 * navigation, slim footer), built on the USWDS DDD bridge: every HAX block
 * reads --ddd-* tokens, which point at the USWDS palette while it is active.
 * An independent integration: it carries no official government banner,
 * seal or identifier.
 *
 * @title USWDS
 * @haxcms-theme-category Website, Course, Documentation
 * @haxcms-theme-priority 50
 * @demo demo/index.html
 * @element uswds-theme
 */
class UswdsTheme extends HAXCMSThemeParts(DDDSuper(HAXCMSLitElementTheme)) {
  static get tag() {
    return "uswds-theme";
  }

  HAXCMSGlobalStyleSheetContent() {
    return [
      ...super.HAXCMSGlobalStyleSheetContent(),
      css`
        body {
          margin: 0;
          background-color: light-dark(#ffffff, #1b1b1b);
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
      menu: "Menu",
      close: "Close",
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
    activateUswdsDesignSystem();
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
      UswdsTokens,
      UswdsDDDMap,
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
          color: light-dark(var(--usa-gray-90), var(--usa-white));
          background-color: light-dark(var(--usa-white), var(--usa-gray-90));
          font-family: var(--ddd-font-primary);
          --uswds-theme-header-height: 64px;
          --uswds-theme-nav-width: 280px;
          /* USWDS default theme roles; the chrome pairs them for dark mode */
          --uswds-theme-primary: light-dark(
            var(--usa-blue-vivid-60),
            var(--usa-blue-vivid-30)
          );
          --uswds-theme-primary-dark: light-dark(
            var(--usa-blue-warm-vivid-70),
            var(--usa-blue-10)
          );
          --uswds-theme-on-primary: light-dark(
            var(--usa-white),
            var(--usa-gray-90)
          );
          --uswds-theme-line: light-dark(
            var(--usa-gray-cool-10),
            var(--usa-gray-70)
          );
          --uswds-theme-muted: light-dark(
            var(--usa-gray-cool-60),
            var(--usa-gray-10)
          );
          --uswds-theme-band: light-dark(var(--usa-gray-5), var(--usa-gray-80));
        }
        .header {
          position: sticky;
          top: 0;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-4);
          min-height: var(--uswds-theme-header-height);
          padding: 0 var(--ddd-spacing-8);
          background-color: light-dark(var(--usa-white), var(--usa-gray-90));
          border-bottom: 1px solid var(--uswds-theme-line);
        }
        .brand {
          flex: 1 1 auto;
          min-width: 0;
        }
        /* usa-logo: header font (ui role), bold */
        site-title {
          --site-title-heading-font-size: var(--ddd-font-size-xs);
          --site-title-heading-font-weight: var(--ddd-font-weight-bold);
          --site-title-heading-font-family: var(--ddd-font-navigation);
          color: light-dark(var(--usa-gray-90), var(--usa-white));
        }
        .actions {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
        }
        .icon-button {
          --simple-icon-width: 24px;
          --simple-icon-height: 24px;
          --simple-icon-button-border-radius: var(--ddd-radius-sm);
          --site-modal-icon-color: var(--uswds-theme-primary);
          color: var(--uswds-theme-primary);
        }
        simple-icon-button-lite.icon-button {
          width: 40px;
          height: 40px;
          border-radius: var(--ddd-radius-sm);
        }
        simple-icon-button-lite.icon-button:hover {
          background-color: var(--uswds-theme-band);
        }
        /* usa-menu-btn: a text button in primary, shown below desktop */
        .menu-btn {
          display: none;
          min-height: 40px;
          padding: 0 var(--ddd-spacing-4);
          border: 0;
          border-radius: 0;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          color: var(--uswds-theme-on-primary);
          background-color: var(--uswds-theme-primary);
          cursor: pointer;
        }
        .menu-btn:hover {
          background-color: var(--uswds-theme-primary-dark);
        }
        /* usa-sidenav: current item bold, primary, with a bar on its start edge */
        .nav {
          top: var(--uswds-theme-header-height);
          flex: 0 0 var(--uswds-theme-nav-width);
          width: var(--uswds-theme-nav-width);
          height: calc(100vh - var(--uswds-theme-header-height));
          padding: var(--ddd-spacing-8) 0 var(--ddd-spacing-8)
            var(--ddd-spacing-8);
          background-color: light-dark(var(--usa-white), var(--usa-gray-90));
        }
        site-menu {
          --site-menu-color: var(--uswds-theme-muted);
          --site-menu-font-size: var(--ddd-font-size-4xs);
          --map-menu-container-padding: 0;
          --map-menu-gap: 0;
          --map-menu-item-border-radius: 0;
          --map-menu-item-a-color: var(--uswds-theme-muted);
          --map-menu-item-a-active-color: var(--uswds-theme-primary);
          --map-menu-item-a-active-background-color: transparent;
          --map-menu-item-active-item-color: var(--uswds-theme-primary);
          --map-menu-item-icon-active-color: var(--uswds-theme-primary);
          --map-menu-item-button-active-font-weight: var(
            --ddd-font-weight-bold
          );
          --map-menu-item-active-accent-width: 4px;
          --map-menu-item-active-accent-color: var(--uswds-theme-primary);
          --map-menu-font-weight: var(--ddd-font-weight-regular);
          border-top: 1px solid var(--uswds-theme-line);
          border-bottom: 1px solid var(--uswds-theme-line);
        }
        .content {
          padding: var(--ddd-spacing-8) var(--ddd-spacing-8) 0;
          max-width: var(--uswds-theme-content-max-width, 880px);
          box-sizing: border-box;
        }
        site-breadcrumb {
          --site-breadcrumb-margin: 0 0 var(--ddd-spacing-4) 0;
          --site-breadcrumb-font-size: var(--ddd-font-size-4xs);
          --site-breadcrumb-color: var(--uswds-theme-primary);
          --site-breadcrumb-color-hover: var(--uswds-theme-primary-dark);
          --site-breadcrumb-last-color: light-dark(
            var(--usa-gray-90),
            var(--usa-white)
          );
          --site-breadcrumb-separator-color: var(--uswds-theme-muted);
        }
        /* headings take the serif heading role */
        site-active-title h1 {
          margin: 0 0 var(--ddd-spacing-6) 0;
          font-family: var(--ddd-font-secondary);
          font-size: var(--ddd-font-size-l);
          font-weight: var(--ddd-font-weight-bold);
          line-height: 1.2;
          color: light-dark(var(--usa-gray-90), var(--usa-white));
        }
        .pager {
          max-width: var(--uswds-theme-content-max-width, 880px);
          box-sizing: border-box;
          margin: var(--ddd-spacing-12) var(--ddd-spacing-8) 0;
          padding: var(--ddd-spacing-6) 0;
          border-top: 1px solid var(--uswds-theme-line);
        }
        site-menu-button {
          --site-menu-button-icon-fill-color: var(--uswds-theme-primary);
          --site-menu-button-link-color: var(--uswds-theme-primary);
          --site-menu-button-button-border-radius: var(--ddd-radius-sm);
          --site-menu-button-button-hover-background-color: var(
            --uswds-theme-band
          );
        }
        /* usa-footer--slim: a base-lightest band */
        footer {
          margin-top: var(--ddd-spacing-12);
          padding: var(--ddd-spacing-6) var(--ddd-spacing-8);
          background-color: var(--uswds-theme-band);
          font-size: var(--ddd-font-size-4xs);
        }
        @media (max-width: 1024px) {
          .menu-btn {
            display: inline-flex;
            align-items: center;
          }
          .nav {
            position: fixed;
            left: 0;
            z-index: 2;
            padding-right: var(--ddd-spacing-6);
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
            width: min(var(--uswds-theme-nav-width), 85vw);
            padding-left: var(--ddd-spacing-4);
          }
          site-active-title h1 {
            font-size: var(--ddd-font-size-ml);
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <a class="skip-link" href="#contentcontainer">${this.t.skipToContent}</a>
      <header class="header" part="header">
        <div class="brand">
          <site-title
            ?disabled="${this.editMode}"
            part="site-title"
          ></site-title>
        </div>
        ${this.renderActions()} ${this.renderNavToggle()}
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
    // usa-menu-btn: a text button, shown below the desktop breakpoint
    return html`<button
      class="menu-btn nav-toggle"
      aria-expanded="${this.sidebarOpen ? "true" : "false"}"
      aria-controls="nav"
      @click="${this.toggleSidebar}"
    >
      ${this.sidebarOpen && this._mobile ? this.t.close : this.t.menu}
    </button>`;
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
globalThis.customElements.define(UswdsTheme.tag, UswdsTheme);
export { UswdsTheme };
