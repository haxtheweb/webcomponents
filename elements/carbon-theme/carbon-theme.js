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
import { CarbonTokens } from "@haxtheweb/carbon-theme/lib/CarbonTokens.js";
import { CarbonDDDMap } from "@haxtheweb/carbon-theme/lib/CarbonDDDMap.js";
import { activateCarbonDesignSystem } from "@haxtheweb/carbon-theme/lib/CarbonDesignSystem.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/haxcms-elements/lib/ui-components/site/site-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";

/**
 * `carbon-theme`
 * A HAXcms theme in the IBM Carbon UI Shell layout (dark 48px header,
 * side navigation, content area), built on the Carbon DDD bridge: every HAX
 * block reads --ddd-* tokens, which point at Carbon tokens while this theme
 * is active.
 *
 * @title Carbon
 * @haxcms-theme-category Website, Course, Documentation
 * @haxcms-theme-priority 50
 * @demo demo/index.html
 * @element carbon-theme
 */
class CarbonTheme extends HAXCMSThemeParts(DDDSuper(HAXCMSLitElementTheme)) {
  static get tag() {
    return "carbon-theme";
  }

  HAXCMSGlobalStyleSheetContent() {
    return [
      ...super.HAXCMSGlobalStyleSheetContent(),
      css`
        body {
          margin: 0;
          background-color: light-dark(#ffffff, #161616);
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
    this.__carbonDisposers = [];
    activateCarbonDesignSystem();
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
      CarbonTokens,
      CarbonDDDMap,
      css`
        :host {
          display: block;
          min-height: 100vh;
          color: var(--cds-text-primary);
          background-color: var(--cds-background);
          font-family: var(--ddd-font-primary);
          --carbon-theme-header-height: 48px;
          --carbon-theme-sidenav-width: 256px;
        }
        :host([hidden]) {
          display: none;
        }
        a:focus-visible,
        button:focus-visible,
        simple-icon-button-lite:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: -2px;
        }

        /* UI Shell header, light as on carbondesignsystem.com; it follows
           the theme into g100 in dark mode */
        .header {
          position: sticky;
          top: 0;
          z-index: 3;
          display: flex;
          align-items: center;
          height: var(--carbon-theme-header-height);
          background-color: var(--cds-background);
          color: var(--cds-text-primary);
          border-bottom: 1px solid var(--cds-border-subtle-01);
        }
        .header-name {
          flex: 1 1 auto;
          min-width: 0;
          padding: 0 var(--ddd-spacing-4);
        }
        site-title {
          --site-title-link-text-decoration: none;
          --site-title-heading-font-size: var(--ddd-font-size-5xs);
          --site-title-heading-font-weight: var(--ddd-font-weight-bold);
          --site-title-heading-margin: 0;
          --site-title-link-display: inline;
          --site-title-link-color: var(--cds-text-primary);
          color: var(--cds-text-primary);
          letter-spacing: 0.1px;
        }
        .header-action,
        site-modal {
          --simple-icon-width: 20px;
          --simple-icon-height: 20px;
          --simple-icon-button-border-radius: 0;
          --site-modal-icon-color: var(
            --cds-icon-primary,
            var(--cds-text-primary)
          );
          color: var(--cds-icon-primary, var(--cds-text-primary));
        }
        .header-action {
          width: var(--carbon-theme-header-height);
          height: var(--carbon-theme-header-height);
          border-radius: 0;
        }
        .header-action:hover,
        .header-action:focus-visible {
          background-color: var(--cds-background-hover);
        }
        .header-actions {
          display: flex;
          align-items: center;
        }

        /* side nav + content */
        .shell {
          display: flex;
          align-items: flex-start;
        }
        .sidenav {
          position: sticky;
          top: var(--carbon-theme-header-height);
          flex: 0 0 var(--carbon-theme-sidenav-width);
          width: var(--carbon-theme-sidenav-width);
          height: calc(100vh - var(--carbon-theme-header-height));
          overflow-y: auto;
          padding: var(--ddd-spacing-4) 0;
          box-sizing: border-box;
          background-color: var(--cds-background);
          border-right: 1px solid var(--cds-border-subtle-01);
        }
        :host(:not([sidebar-open])) .sidenav {
          display: none;
        }
        site-menu {
          height: auto;
          --site-menu-background-color: transparent;
          --site-menu-container-background-color: transparent;
          --site-menu-color: var(--cds-text-secondary);
          --site-menu-font-size: var(--ddd-font-size-5xs);
          --map-menu-container-padding: 0 var(--ddd-spacing-2);
          --map-menu-gap: 0;
          --map-menu-item-border-radius: 0;
          --map-menu-item-a-color: var(--cds-text-secondary);
          --map-menu-item-a-active-color: var(--cds-text-primary);
          --map-menu-item-a-active-background-color: var(
            --cds-background-selected
          );
          /* --cds-background-selected is translucent, so the check on the
             done progress disc would fade into the disc; draw it in the
             opaque page background, which contrasts with the
             --cds-text-primary disc in light and dark */
          --map-menu-progress-ring-on-color: var(--cds-background);
          --map-menu-item-active-item-color: var(--cds-text-primary);
          /* Carbon marks the selected side nav item with a 3px bar */
          --map-menu-item-active-accent-width: 3px;
          --map-menu-item-active-accent-color: var(--cds-interactive);
          --map-menu-item-icon-active-color: var(--cds-text-primary);
          --map-menu-item-button-active-font-weight: var(
            --ddd-font-weight-bold
          );
          --map-menu-font-weight: var(--ddd-font-weight-regular);
          --map-menu-parent-background-color: transparent;
          /* parents carry the chevron (and the progress ring around it) at
             the start of the row, so their titles start after it */
          --map-menu-header-title-margin: var(--ddd-spacing-4);
          font-family: var(--ddd-font-primary);
        }

        main {
          flex: 1 1 auto;
          min-width: 0;
          background-color: var(--cds-layer-01);
          min-height: calc(100vh - var(--carbon-theme-header-height));
          display: flex;
          flex-direction: column;
        }
        .content {
          padding: 0 var(--ddd-spacing-16) 0;
          max-width: var(--carbon-theme-content-max-width, 1056px);
          box-sizing: border-box;
          width: 100%;
          flex: 1 1 auto;
        }
        site-breadcrumb {
          --site-breadcrumb-margin: 0 0 var(--ddd-spacing-2) 0;
          --site-breadcrumb-font-size: var(--ddd-font-size-5xs);
          --site-breadcrumb-color: var(--cds-link-primary);
          --site-breadcrumb-color-hover: var(--cds-link-primary-hover);
          --site-breadcrumb-last-color: var(--cds-text-primary);
          --site-breadcrumb-separator-color: var(--cds-text-secondary);
        }
        site-active-title {
          --site-active-title-margin: 0 0 var(--ddd-spacing-8) 0;
          --site-active-title-padding: 0;
        }
        /* page header: a background-colored panel with a light display
           title and the page description as lead text */
        .page-header {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 18rem;
          margin: 0 var(--ddd-spacing-8) var(--ddd-spacing-12);
          padding: var(--ddd-spacing-12) var(--ddd-spacing-8)
            var(--ddd-spacing-8);
          box-sizing: border-box;
          max-width: var(--carbon-theme-content-max-width, 1056px);
          background-color: var(--cds-background);
        }
        site-active-title h1 {
          margin: 0;
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-xl);
          font-weight: var(--ddd-font-weight-light);
          line-height: 1.2;
          color: var(--cds-text-primary);
        }
        .lead {
          max-width: 40rem;
          margin: var(--ddd-spacing-12) 0 0;
          font-size: var(--ddd-font-size-xs);
          font-weight: var(--ddd-font-weight-regular);
          line-height: 1.4;
          color: var(--cds-text-primary);
        }
        #slot {
          padding: 0;
        }

        /* previous / next as Carbon ghost buttons on a full-width rule */
        .pager {
          display: flex;
          justify-content: space-between;
          gap: var(--ddd-spacing-4);
          margin-top: var(--ddd-spacing-12);
          padding: var(--ddd-spacing-4) var(--ddd-spacing-8);
          border-top: 1px solid var(--cds-border-subtle-01);
        }
        site-menu-button {
          --site-menu-button-icon-fill-color: var(--cds-link-primary);
          --site-menu-button-link-color: var(--cds-link-primary);
          --site-menu-button-link-decoration: none;
          --site-menu-button-button-border-radius: 0;
          --site-menu-button-button-hover-background-color: var(
            --cds-background-hover
          );
        }
        site-menu-button[disabled] {
          visibility: hidden;
        }
        footer {
          padding: var(--ddd-spacing-4) var(--ddd-spacing-8);
          color: var(--cds-text-secondary);
          font-size: var(--ddd-font-size-5xs);
          background-color: var(--cds-layer-01);
        }

        :host([edit-mode]) .header-actions,
        :host([edit-mode]) .pager {
          opacity: 0.4;
          pointer-events: none;
        }

        /* Carbon's lg breakpoint: below it the side nav overlays the page */
        @media (max-width: 1056px) {
          .sidenav {
            position: fixed;
            left: 0;
            top: var(--carbon-theme-header-height);
            z-index: 2;
            box-shadow: var(--ddd-boxShadow-md);
          }
        }
        @media (max-width: 672px) {
          .content {
            padding: 0 var(--ddd-spacing-4) 0;
          }
          .page-header {
            min-height: 12rem;
            margin: 0 0 var(--ddd-spacing-8);
            padding: var(--ddd-spacing-8) var(--ddd-spacing-4)
              var(--ddd-spacing-6);
          }
          .lead {
            margin-top: var(--ddd-spacing-6);
          }
          .pager,
          footer {
            padding-left: var(--ddd-spacing-4);
            padding-right: var(--ddd-spacing-4);
          }
          .sidenav {
            width: min(var(--carbon-theme-sidenav-width), 85vw);
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
          aria-controls="sidenav"
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
        <div
          class="sidenav"
          id="sidenav"
          part="sidenav"
          ?inert="${!this.sidebarOpen}"
        >
          <nav aria-label="${this.t.siteNavigation}">
            <site-menu part="site-menu"></site-menu>
          </nav>
        </div>
        <main>
          <div class="page-header" part="page-header">
            <div>
              <site-breadcrumb part="page-breadcrumb"></site-breadcrumb>
              <site-active-title part="page-title"></site-active-title>
            </div>
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
    this.__mq = globalThis.matchMedia("(max-width: 1056px)");
    this.__mqHandler = (e) => {
      this._mobile = e.matches;
      // the side nav overlays the page below the lg breakpoint, so start closed
      this.sidebarOpen = !e.matches;
    };
    this.__mq.addEventListener("change", this.__mqHandler);
    this.__mqHandler(this.__mq);
    this.__carbonDisposers.push(
      autorun(() => {
        this._dark = !!toJS(store.darkMode);
      }),
    );
    this.__carbonDisposers.push(
      autorun(() => {
        // the page description is the page header's lead text
        const item = toJS(store.activeItem);
        this._lead = item && item.description ? item.description : "";
      }),
    );
    this.__carbonDisposers.push(
      autorun(() => {
        // close the overlay side nav after navigating on small screens
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
    this.__carbonDisposers.forEach((dispose) => dispose());
    this.__carbonDisposers = [];
    super.disconnectedCallback();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleDarkMode() {
    store.darkMode = !store.darkMode;
  }
}
globalThis.customElements.define(CarbonTheme.tag, CarbonTheme);
export { CarbonTheme };
