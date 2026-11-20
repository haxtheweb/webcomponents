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
import { PrimerTokens } from "@haxtheweb/primer-theme/lib/PrimerTokens.js";
import { PrimerDDDMap } from "@haxtheweb/primer-theme/lib/PrimerDDDMap.js";
import { activatePrimerDesignSystem } from "@haxtheweb/primer-theme/lib/PrimerDesignSystem.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/haxcms-elements/lib/ui-components/site/site-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";

/**
 * `primer-theme`
 * A HAXcms theme in the layout of the Primer documentation site: a 64px
 * header on the default background with a hairline border, a NavList
 * sidebar whose current item is a muted pill with Primer's accent bar, and
 * page content in a 1012px column with a muted lead. Built on the Primer
 * DDD bridge: every HAX block reads --ddd-* tokens, which point at Primer
 * tokens while this theme is active.
 *
 * @title Primer
 * @haxcms-theme-category Website, Course, Documentation, Organization
 * @haxcms-theme-layout Sidebar
 * @haxcms-theme-design-system Primer
 * @haxcms-theme-priority 50
 * @demo demo/index.html
 * @element primer-theme
 */
class PrimerTheme extends HAXCMSThemeParts(DDDSuper(HAXCMSLitElementTheme)) {
  static get tag() {
    return "primer-theme";
  }

  HAXCMSGlobalStyleSheetContent() {
    return [
      ...super.HAXCMSGlobalStyleSheetContent(),
      css`
        body {
          margin: 0;
          background-color: light-dark(#ffffff, #0d1117);
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
    this.__primerDisposers = [];
    activatePrimerDesignSystem();
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
      _lead: { type: String, state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      PrimerTokens,
      PrimerDDDMap,
      css`
        :host {
          display: block;
          min-height: 100vh;
          color: var(--fgColor-default);
          background-color: var(--bgColor-default);
          font-family: var(--ddd-font-primary);
          --primer-theme-header-height: 64px;
          --primer-theme-nav-width: 272px;
        }
        :host([hidden]) {
          display: none;
        }
        /* Primer's focus: a 2px outline in the focus color, -2px inset on
           controls and 0 on links so it stays visible around text */
        a:focus-visible,
        button:focus-visible,
        simple-icon-button-lite:focus-visible {
          outline: 2px solid var(--focus-outlineColor);
          outline-offset: -2px;
          border-radius: 6px;
        }

        /* header */
        .header {
          position: sticky;
          top: 0;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          height: var(--primer-theme-header-height);
          padding: 0 var(--ddd-spacing-4);
          box-sizing: border-box;
          background-color: var(--bgColor-default);
          color: var(--fgColor-default);
          border-bottom: 1px solid var(--borderColor-default);
        }
        .header-name {
          flex: 1 1 auto;
          min-width: 0;
        }
        site-title {
          --site-title-link-text-decoration: none;
          --site-title-heading-font-size: var(--ddd-font-size-4xs);
          --site-title-heading-font-weight: var(--base-text-weight-semibold);
          --site-title-heading-margin: 0;
          --site-title-link-display: inline;
          --site-title-link-color: var(--fgColor-default);
          color: var(--fgColor-default);
        }
        .header-action,
        site-modal {
          --simple-icon-width: 16px;
          --simple-icon-height: 16px;
          --simple-icon-button-border-radius: 6px;
          --site-modal-icon-color: var(--fgColor-muted);
          color: var(--fgColor-muted);
        }
        /* Primer IconButton (invisible variant): 32px, 6px corners, no
           border or fill until hovered */
        .header-action {
          width: 32px;
          height: 32px;
          border-radius: 6px;
        }
        .header-action:hover,
        .header-action:focus-visible {
          background-color: var(--control-transparent-bgColor-hover);
          color: var(--fgColor-default);
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
        }

        /* NavList sidebar + content */
        .shell {
          display: flex;
          align-items: flex-start;
        }
        .nav {
          position: sticky;
          top: var(--primer-theme-header-height);
          flex: 0 0 var(--primer-theme-nav-width);
          width: var(--primer-theme-nav-width);
          height: calc(100vh - var(--primer-theme-header-height));
          overflow-y: auto;
          padding: var(--ddd-spacing-4) var(--ddd-spacing-2);
          box-sizing: border-box;
          background-color: var(--bgColor-default);
          border-right: 1px solid var(--borderColor-default);
        }
        :host(:not([sidebar-open])) .nav {
          display: none;
        }
        site-menu {
          height: auto;
          --site-menu-background-color: transparent;
          --site-menu-container-background-color: transparent;
          --site-menu-color: var(--fgColor-default);
          --site-menu-font-size: var(--ddd-font-size-4xs);
          --map-menu-container-padding: 0;
          --map-menu-gap: 2px;
          --map-menu-item-border-radius: 6px;
          --map-menu-item-a-color: var(--fgColor-default);
          --map-menu-item-a-active-color: var(--fgColor-default);
          --map-menu-item-a-active-background-color: var(
            --control-transparent-bgColor-selected
          );
          /* the current-item background is translucent, so the check on a
             done progress disc is drawn in the opaque page background */
          --map-menu-progress-ring-on-color: var(--bgColor-default);
          --map-menu-item-active-item-color: var(--fgColor-default);
          /* NavList marks the current item with a 4px accent bar */
          --map-menu-item-active-accent-width: 4px;
          --map-menu-item-active-accent-color: var(--fgColor-accent);
          --map-menu-item-icon-active-color: var(--fgColor-default);
          --map-menu-item-button-active-font-weight: var(
            --base-text-weight-semibold
          );
          --map-menu-font-weight: var(--ddd-font-weight-regular);
          --map-menu-parent-background-color: transparent;
          --map-menu-header-title-margin: var(--ddd-spacing-4);
          font-family: var(--ddd-font-primary);
        }

        main {
          flex: 1 1 auto;
          min-width: 0;
          min-height: calc(100vh - var(--primer-theme-header-height));
          display: flex;
          flex-direction: column;
        }
        .page-header {
          padding: var(--ddd-spacing-10) var(--ddd-spacing-12)
            var(--ddd-spacing-6);
          max-width: var(--primer-theme-content-max-width, 1012px);
          box-sizing: border-box;
          width: 100%;
        }
        site-breadcrumb {
          --site-breadcrumb-margin: 0 0 var(--ddd-spacing-2) 0;
          --site-breadcrumb-font-size: var(--ddd-font-size-4xs);
          --site-breadcrumb-color: var(--fgColor-accent);
          --site-breadcrumb-color-hover: var(--fgColor-accent);
          --site-breadcrumb-last-color: var(--fgColor-muted);
          --site-breadcrumb-separator-color: var(--fgColor-muted);
        }
        site-active-title {
          --site-active-title-margin: 0;
          --site-active-title-padding: 0;
        }
        site-active-title h1 {
          margin: 0;
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-xl);
          font-weight: var(--base-text-weight-semibold);
          line-height: 1.25;
          color: var(--fgColor-default);
        }
        /* the page description as Primer's muted lead under a hairline */
        .lead {
          max-width: 40rem;
          margin: var(--ddd-spacing-2) 0 0;
          font-size: var(--ddd-font-size-xs);
          line-height: 1.5;
          color: var(--fgColor-muted);
        }
        .page-header::after {
          content: "";
          display: block;
          margin-top: var(--ddd-spacing-6);
          border-bottom: 1px solid var(--borderColor-muted);
        }
        .content {
          padding: 0 var(--ddd-spacing-12);
          max-width: var(--primer-theme-content-max-width, 1012px);
          box-sizing: border-box;
          width: 100%;
          flex: 1 1 auto;
        }
        #slot {
          padding: 0;
        }

        /* previous / next as Primer default buttons */
        .pager {
          display: flex;
          justify-content: space-between;
          gap: var(--ddd-spacing-4);
          max-width: var(--primer-theme-content-max-width, 1012px);
          box-sizing: border-box;
          margin-top: var(--ddd-spacing-12);
          padding: var(--ddd-spacing-6) var(--ddd-spacing-12);
        }
        site-menu-button {
          --site-menu-button-icon-fill-color: var(--fgColor-default);
          --site-menu-button-link-color: var(--fgColor-default);
          --site-menu-button-link-decoration: none;
          --site-menu-button-button-border-radius: 6px;
          --site-menu-button-button-hover-background-color: var(
            --button-default-bgColor-hover
          );
        }
        site-menu-button[disabled] {
          visibility: hidden;
        }
        footer {
          padding: var(--ddd-spacing-6) var(--ddd-spacing-12);
          color: var(--fgColor-muted);
          font-size: var(--ddd-font-size-4xs);
          border-top: 1px solid var(--borderColor-default);
        }

        :host([edit-mode]) .header-actions,
        :host([edit-mode]) .pager {
          opacity: 0.4;
          pointer-events: none;
        }

        /* below Primer's large breakpoint (1012px) the sidebar overlays */
        @media (max-width: 1011px) {
          .nav {
            position: fixed;
            left: 0;
            top: var(--primer-theme-header-height);
            z-index: 2;
            box-shadow: var(--shadow-floating-small);
          }
        }
        @media (max-width: 543px) {
          .page-header {
            padding: var(--ddd-spacing-8) var(--ddd-spacing-4)
              var(--ddd-spacing-4);
          }
          .content,
          .pager,
          footer {
            padding-left: var(--ddd-spacing-4);
            padding-right: var(--ddd-spacing-4);
          }
          .nav {
            width: min(var(--primer-theme-nav-width), 85vw);
          }
          site-active-title h1 {
            font-size: var(--ddd-font-size-l);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            transition: none !important;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <a class="skip-link" href="#contentcontainer">${this.t.skipToContent}</a>
      <header class="header" part="header">
        <simple-icon-button-lite
          class="header-action"
          icon="${this.sidebarOpen ? "close" : "menu"}"
          title="${this.t.toggleSiteMenu}"
          aria-expanded="${this.sidebarOpen ? "true" : "false"}"
          aria-controls="nav"
          @click="${this.toggleSidebar}"
        ></simple-icon-button-lite>
        <div class="header-name">
          <site-title
            ?disabled="${this.editMode}"
            part="site-title"
          ></site-title>
        </div>
        <div class="header-actions">
          <site-modal
            class="header-action"
            ?disabled="${this.editMode}"
            icon="icons:search"
            title="${this.t.searchSite}"
            button-label="${this.t.search}"
            part="search-btn"
          >
            <site-search></site-search>
          </site-modal>
          <simple-icon-button-lite
            class="header-action"
            icon="${this._dark ? "image:brightness-7" : "image:brightness-3"}"
            title="${this.t.toggleDarkMode}"
            aria-pressed="${this._dark ? "true" : "false"}"
            @click="${this.toggleDarkMode}"
            part="dark-mode-btn"
          ></simple-icon-button-lite>
        </div>
      </header>
      <div class="shell">
        <div class="nav" id="nav" part="sidenav" ?inert="${!this.sidebarOpen}">
          <nav aria-label="${this.t.siteNavigation}">
            <site-menu part="site-menu"></site-menu>
          </nav>
        </div>
        <main>
          <div class="page-header" part="page-header">
            <site-breadcrumb part="page-breadcrumb"></site-breadcrumb>
            <site-active-title part="page-title"></site-active-title>
            ${this._lead ? html`<p class="lead">${this._lead}</p>` : ""}
          </div>
          <div class="content">
            <article id="contentcontainer">
              <section id="slot"><slot></slot></section>
            </article>
          </div>
          <nav class="pager" aria-label="${this.t.pageNavigation}">
            <site-menu-button type="prev" position="right"></site-menu-button>
            <site-menu-button type="next" position="left"></site-menu-button>
          </nav>
          <footer part="footer">
            <site-region name="footerPrimary"></site-region>
          </footer>
        </main>
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.__mq = globalThis.matchMedia("(max-width: 1011px)");
    this.__mqHandler = (e) => {
      this._mobile = e.matches;
      // the drawer overlays the page on small screens, so start closed
      this.sidebarOpen = !e.matches;
    };
    this.__mq.addEventListener("change", this.__mqHandler);
    this.__mqHandler(this.__mq);
    this.__primerDisposers.push(
      autorun(() => {
        this._dark = !!toJS(store.darkMode);
      }),
    );
    this.__primerDisposers.push(
      autorun(() => {
        // the page description is the page header's lead text
        const item = toJS(store.activeItem);
        this._lead = item && item.description ? item.description : "";
      }),
    );
    this.__primerDisposers.push(
      autorun(() => {
        // close the overlay drawer after navigating on small screens
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
    this.__primerDisposers.forEach((dispose) => dispose());
    this.__primerDisposers = [];
    super.disconnectedCallback();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleDarkMode() {
    store.darkMode = !store.darkMode;
  }
}
globalThis.customElements.define(PrimerTheme.tag, PrimerTheme);
export { PrimerTheme };
