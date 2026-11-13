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
import { WebawesomeTokens } from "@haxtheweb/webawesome-theme/lib/WebawesomeTokens.js";
import { WebawesomeDDDMap } from "@haxtheweb/webawesome-theme/lib/WebawesomeDDDMap.js";
import { activateWebawesomeDesignSystem } from "@haxtheweb/webawesome-theme/lib/WebawesomeDesignSystem.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/haxcms-elements/lib/ui-components/site/site-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu-content.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";

/**
 * `webawesome-theme`
 * A HAXcms theme laid out like Web Awesome's own documentation: a two-row
 * header (site bar, then top-level section links), a sidebar for the outline,
 * a reading column whose title carries the page's tags and lead text, and an
 * "On this page" list. Built on the Web Awesome DDD bridge: every HAX block
 * reads --ddd-* tokens, which point at Web Awesome tokens while it is active.
 *
 * @title Web Awesome
 * @haxcms-theme-category Website, Course, Documentation
 * @haxcms-theme-priority 50
 * @demo demo/index.html
 * @element webawesome-theme
 */
class WebawesomeTheme extends HAXCMSThemeParts(
  DDDSuper(HAXCMSLitElementTheme),
) {
  static get tag() {
    return "webawesome-theme";
  }

  HAXCMSGlobalStyleSheetContent() {
    return [
      ...super.HAXCMSGlobalStyleSheetContent(),
      css`
        body {
          margin: 0;
          background-color: light-dark(#ffffff, #101219);
        }
        /* images in page content never overflow the reading column */
        webawesome-theme img {
          max-width: 100%;
          height: auto;
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
      sections: "Sections",
      searchSite: "Search site",
      search: "Search",
      toggleDarkMode: "Toggle dark mode",
      pageNavigation: "Page navigation",
      onThisPage: "On this page",
      tags: "Tags",
    };
    // no I18NMixin in this class chain, so register with the store directly
    I18NManagerStore.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
    this.HAXCMSThemeSettings.autoScroll = true;
    this.sidebarOpen = true;
    this._mobile = false;
    this._topItems = [];
    this._currentTop = "";
    this._activeId = "";
    this._tags = [];
    this._lead = "";
    this.__themeDisposers = [];
    activateWebawesomeDesignSystem();
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
      _topItems: { type: Array, state: true },
      _currentTop: { type: String, state: true },
      _activeId: { type: String, state: true },
      _tags: { type: Array, state: true },
      _lead: { type: String, state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      WebawesomeTokens,
      WebawesomeDDDMap,
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
        :host([edit-mode]) .sections,
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
          color: var(--wa-color-text-normal);
          background-color: var(--wa-color-surface-default);
          font-family: var(--ddd-font-primary);
          --webawesome-theme-bar-height: 64px;
          --webawesome-theme-sections-height: 44px;
          --webawesome-theme-header-height: calc(
            var(--webawesome-theme-bar-height) +
              var(--webawesome-theme-sections-height)
          );
          --webawesome-theme-nav-width: 272px;
        }
        header {
          position: sticky;
          top: 0;
          z-index: 3;
        }
        .bar {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          height: var(--webawesome-theme-bar-height);
          padding: 0 var(--ddd-spacing-6);
          background-color: var(--wa-color-surface-lowered);
        }
        .brand {
          flex: 1 1 auto;
          min-width: 0;
        }
        site-title {
          --site-title-heading-font-size: var(--ddd-font-size-4xs);
          --site-title-heading-font-weight: var(--wa-font-weight-heading);
          color: var(--wa-color-text-normal);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .actions {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
        }
        .icon-button {
          --simple-icon-width: 20px;
          --simple-icon-height: 20px;
          --simple-icon-button-border-radius: var(--wa-border-radius-m);
          --site-modal-icon-color: var(--wa-color-text-quiet);
          color: var(--wa-color-text-quiet);
        }
        simple-icon-button-lite.icon-button {
          width: 40px;
          height: 40px;
          border-radius: var(--wa-border-radius-m);
        }
        simple-icon-button-lite.icon-button:hover {
          color: var(--wa-color-text-normal);
          background-color: var(--wa-color-neutral-fill-quiet);
        }
        /* second header row: one link per top-level page */
        .sections {
          display: flex;
          align-items: stretch;
          height: var(--webawesome-theme-sections-height);
          padding: 0 var(--ddd-spacing-6);
          overflow-x: auto;
          background-color: var(--wa-color-surface-default);
          border-bottom: var(--wa-panel-border-width) solid
            var(--wa-color-surface-border);
        }
        .sections ul {
          display: flex;
          flex-direction: row;
          gap: var(--ddd-spacing-1);
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .sections li {
          display: flex;
        }
        .section {
          display: flex;
          align-items: center;
          padding: 0 var(--ddd-spacing-3);
          border-bottom: var(--wa-border-width-m) solid transparent;
          color: var(--wa-color-text-quiet);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-5xs);
          font-weight: var(--ddd-font-weight-medium);
          text-decoration: none;
          white-space: nowrap;
        }
        .section:hover {
          color: var(--wa-color-text-normal);
        }
        .section.current {
          color: var(--wa-color-text-normal);
          font-weight: var(--wa-font-weight-heading);
          border-bottom-color: var(--wa-color-brand-fill-loud);
        }
        .section:focus-visible {
          outline-offset: calc(-1 * var(--wa-focus-ring-width, 3px));
        }
        .nav {
          top: var(--webawesome-theme-header-height);
          flex: 0 0 var(--webawesome-theme-nav-width);
          width: var(--webawesome-theme-nav-width);
          height: calc(100vh - var(--webawesome-theme-header-height));
          padding: var(--ddd-spacing-6) var(--ddd-spacing-4);
          background-color: var(--wa-color-surface-default);
          border-right: var(--wa-panel-border-width) solid
            var(--wa-color-surface-border);
        }
        site-menu {
          --site-menu-color: var(--wa-color-text-normal);
          --site-menu-font-size: var(--ddd-font-size-5xs);
          --map-menu-container-padding: 0;
          --map-menu-gap: 0;
          --map-menu-item-border-radius: var(--wa-border-radius-m);
          --map-menu-item-a-color: var(--wa-color-text-normal);
          --map-menu-item-a-active-color: var(--wa-color-brand-on-quiet);
          --map-menu-item-a-active-background-color: var(
            --wa-color-brand-fill-quiet
          );
          --map-menu-item-active-item-color: var(--wa-color-brand-on-quiet);
          --map-menu-item-icon-active-color: var(--wa-color-brand-on-quiet);
          --map-menu-item-button-active-font-weight: var(
            --wa-font-weight-heading
          );
          --map-menu-font-weight: var(--ddd-font-weight-regular);
        }
        /* reading column plus an "on this page" list on wide screens */
        .page {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: var(--ddd-spacing-12);
          padding: var(--ddd-spacing-10) var(--ddd-spacing-12) 0;
        }
        .content {
          flex: 0 1 var(--webawesome-theme-content-max-width, 800px);
          min-width: 0;
        }
        .toc {
          display: none;
          position: sticky;
          top: calc(
            var(--webawesome-theme-header-height) + var(--ddd-spacing-10)
          );
          flex: 0 0 13rem;
          font-size: var(--ddd-font-size-5xs);
          --page-contents-menu-link: var(--wa-color-text-quiet);
          --page-contents-menu-link-color-focus: var(--wa-color-text-normal);
        }
        @media (min-width: 1280px) {
          .toc {
            display: block;
          }
        }
        site-active-title h1 {
          margin: 0 0 var(--ddd-spacing-4) 0;
          font-family: var(--ddd-font-heading, var(--ddd-font-secondary));
          font-size: var(--ddd-font-size-l);
          font-weight: var(--wa-font-weight-heading);
          line-height: 1.2;
          color: var(--wa-color-text-normal);
        }
        /* the page's tags, as Web Awesome docs badge a component page */
        .tags {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2);
          margin: 0 0 var(--ddd-spacing-4) 0;
          padding: 0;
          list-style: none;
        }
        .tags li {
          flex: 0 0 auto;
          padding: var(--ddd-spacing-1) var(--ddd-spacing-3);
          border-radius: var(--wa-border-radius-pill);
          background-color: var(--wa-color-neutral-fill-normal);
          color: var(--wa-color-neutral-on-normal);
          font-size: var(--ddd-font-size-5xs);
          font-weight: var(--ddd-font-weight-medium);
          line-height: 1.4;
        }
        .tags li:first-child {
          background-color: var(--wa-color-brand-fill-loud);
          color: var(--ddd-theme-default-white);
        }
        .lead {
          margin: 0 0 var(--ddd-spacing-8) 0;
          font-size: var(--ddd-font-size-xs);
          line-height: 1.6;
          color: var(--wa-color-text-normal);
        }
        .pager {
          max-width: var(--webawesome-theme-content-max-width, 800px);
          box-sizing: border-box;
          margin: var(--ddd-spacing-12) auto 0;
          padding: var(--ddd-spacing-6) var(--ddd-spacing-12);
          border-top: var(--wa-panel-border-width) solid
            var(--wa-color-surface-border);
        }
        site-menu-button {
          --site-menu-button-icon-fill-color: var(--wa-color-text-link);
          --site-menu-button-link-color: var(--wa-color-text-link);
          --site-menu-button-button-border-radius: var(--wa-border-radius-m);
          --site-menu-button-button-hover-background-color: var(
            --wa-color-neutral-fill-quiet
          );
        }
        footer {
          padding: var(--ddd-spacing-6) var(--ddd-spacing-12);
          color: var(--wa-color-text-quiet);
          font-size: var(--ddd-font-size-5xs);
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
          .bar,
          .sections {
            padding: 0 var(--ddd-spacing-4);
          }
          .page,
          .pager,
          footer {
            padding-left: var(--ddd-spacing-4);
            padding-right: var(--ddd-spacing-4);
          }
          .nav {
            width: min(var(--webawesome-theme-nav-width), 85vw);
          }
          site-active-title h1 {
            font-size: var(--ddd-font-size-m);
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <a class="skip-link" href="#contentcontainer">${this.t.skipToContent}</a>
      <header part="header">
        <div class="bar">
          ${this.renderNavToggle()}
          <div class="brand">
            <site-title
              ?disabled="${this.editMode}"
              part="site-title"
            ></site-title>
          </div>
          ${this.renderActions()}
        </div>
        ${this.renderSections()}
      </header>
      <div class="layout">
        ${this.renderNav()}
        <main>
          <div class="page">
            <div class="content">
              <site-active-title part="page-title"></site-active-title>
              ${
                this._tags.length
                  ? html`<ul
                      class="tags"
                      part="tags"
                      aria-label="${this.t.tags}"
                    >
                      ${this._tags.map((tag) => html`<li>${tag}</li>`)}
                    </ul>`
                  : ""
              }
              ${
                this._lead
                  ? html`<p class="lead" part="lead">${this._lead}</p>`
                  : ""
              }
              <article id="contentcontainer">
                <section id="slot"><slot></slot></section>
              </article>
            </div>
            <aside class="toc" part="toc">
              <site-menu-content
                label="${this.t.onThisPage}"
              ></site-menu-content>
            </aside>
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

  /**
   * Second header row: one link per top-level page, the current section
   * underlined in the brand color
   */
  renderSections() {
    return html`<nav
      class="sections"
      part="sections"
      aria-label="${this.t.sections}"
    >
      <ul>
        ${this._topItems.map((item) => {
          const current = item.id === this._currentTop;
          return html`<li>
            <a
              class="section${current ? " current" : ""}"
              href="${item.slug}"
              aria-current="${
                current
                  ? item.id === this._activeId
                    ? "page"
                    : "true"
                  : "false"
              }"
              >${item.title}</a
            >
          </li>`;
        })}
      </ul>
    </nav>`;
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
        const manifest = toJS(store.manifest);
        const active = toJS(store.activeItem);
        const items = manifest && manifest.items ? manifest.items : [];
        this._topItems = items.filter(
          (i) =>
            !i.parent &&
            !(i.metadata && i.metadata.hideInMenu) &&
            !(i.metadata && i.metadata.published === false),
        );
        const ancestor = toJS(store.ancestorItem);
        this._activeId = active ? active.id : "";
        this._currentTop = ancestor ? ancestor.id : this._activeId;
        // tags (metadata.tags, comma separated) and lead text (description)
        const tags =
          active && active.metadata && active.metadata.tags
            ? String(active.metadata.tags)
            : "";
        this._tags = tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag);
        this._lead = active && active.description ? active.description : "";
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
globalThis.customElements.define(WebawesomeTheme.tag, WebawesomeTheme);
export { WebawesomeTheme };
