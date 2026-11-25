/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSThemeParts } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { HAXCMSOperationButtons } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSOperationButtons.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import {
  DDDReadingSurface,
  dddReadingProse,
} from "@haxtheweb/d-d-d/lib/DDDReading.js";
import { I18NManagerStore } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/haxcms-elements/lib/ui-components/site/site-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu-content.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";

// the site menu overlays the page at and below this width
const MENU_OVERLAY_QUERY = "(max-width: 900px)";
// the on-this-page column folds into a popover at and below this width
const TOC_FOLD_QUERY = "(max-width: 1200px)";

/**
 * `book-theme`
 * A quiet documentation theme for HAXcms: the site menu down the left, the
 * page in the middle, the headings of the page down the right, and nothing
 * else. Built from DDD tokens and the shared HAXcms theme parts.
 *
 * The layout pays homage to the Hugo Book theme by Alex Shpak (MIT). None of
 * its code, styles or assets are used here; see NOTICE.
 *
 * @title Book
 * @haxcms-theme-category Documentation, Course, Website
 * @haxcms-theme-layout Sidebar
 * @haxcms-theme-inspired-by Hugo
 * @haxcms-theme-inspired-by-theme Book
 * @haxcms-theme-priority 0
 * @demo demo/index.html
 * @element book-theme
 */
class BookTheme extends HAXCMSOperationButtons(
  HAXCMSThemeParts(DDDSuper(HAXCMSLitElementTheme)),
) {
  static get tag() {
    return "book-theme";
  }

  // the chrome reads only --ddd-* tokens, so a site can pair this layout
  // with any design system
  static get acceptsDesignSystems() {
    return true;
  }

  HAXCMSGlobalStyleSheetContent() {
    return [
      ...super.HAXCMSGlobalStyleSheetContent(),
      dddReadingProse(this.constructor.tag, "start"),
      css`
        body {
          margin: 0;
          background-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
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
      closeSiteMenu: "Close site menu",
      siteNavigation: "Site navigation",
      onThisPage: "On this page",
      searchSite: "Search site",
      search: "Search",
      toggleDarkMode: "Toggle dark mode",
      pageNavigation: "Page navigation",
      lastUpdated: "Last updated",
    };
    // no I18NMixin in this class chain, so register with the store directly
    I18NManagerStore.registerLocalization({
      context: this,
      namespace: "book-theme",
      localesPath:
        new URL("./locales/book-theme.en.json", import.meta.url).href + "/../",
    });
    this.HAXCMSThemeSettings.autoScroll = true;
    this.menuOpen = true;
    this.prevPage = "";
    this.nextPage = "";
    this.pageTimestamp = 0;
    this.siteTitle = "";
    this._overlay = false;
    this._tocFolded = false;
    // layout options for themes built on this one (see lib/):
    // bookLayout "topbar" keeps the header on every screen size and moves
    // the site name, search and dark mode switch into it; tocFold keeps the
    // on this page list in its button at every width
    this.bookLayout = "columns";
    this.tocFold = false;
    this._dark = false;
    this.__bookDisposers = [];
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
      "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-tags.js"
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
    // prettier-ignore
    import(
      "@haxtheweb/simple-datetime/simple-datetime.js"
    );
  }

  static get properties() {
    return {
      ...super.properties,
      menuOpen: { type: Boolean, reflect: true, attribute: "menu-open" },
      bookLayout: { type: String, reflect: true, attribute: "book-layout" },
      tocFold: { type: Boolean, reflect: true, attribute: "toc-fold" },
      prevPage: { type: String },
      nextPage: { type: String },
      pageTimestamp: { type: Number },
      siteTitle: { type: String },
      _overlay: { type: Boolean, state: true },
      _tocFolded: { type: Boolean, state: true },
      _dark: { type: Boolean, state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      DDDReadingSurface,
      css`
        :host {
          display: block;
          min-height: 100vh;
          color-scheme: light dark;
          color: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
          background-color: var(--book-theme-surface);
          font-family: var(--ddd-font-primary);
          --book-theme-menu-width: 272px;
          --book-theme-toc-width: 240px;
          --book-theme-container-width: 1320px;
          --book-theme-header-height: 56px;
          --book-theme-gutter: var(--ddd-spacing-8);
          --book-theme-top: 0px;
          --book-theme-surface: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
          --book-theme-menu-surface: var(--book-theme-surface);
          --book-theme-header-surface: var(--book-theme-surface);
          --book-theme-header-color: inherit;
          --book-theme-rule: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          --book-theme-link: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-linkLight)
          );
        }
        :host([hidden]) {
          display: none;
        }
        /* edit mode: move over for the HAX tray, as it sets on the page */
        :host([edit-mode]) {
          margin: var(
            --hax-tray-element-align-margin,
            0 0 0
              calc(var(--hax-tray-width) - var(--hax-tray-menubar-min-width))
          );
          transition: margin var(--ddd-duration-slow, 0.6s) ease-in-out;
        }
        :host([edit-mode][tray-status="collapsed"]) {
          margin: 0;
        }
        @media (max-width: 800px) {
          :host([edit-mode]) {
            margin: 0;
          }
        }
        /* logged in, the HAXcms top bar is fixed over the page */
        :host([is-logged-in]) {
          --book-theme-top: calc(64px + var(--haxcms-top-offset, 0px));
        }
        a:focus-visible,
        button:focus-visible,
        simple-icon-button-lite:focus-visible,
        site-menu-button:focus-within {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset, 2px);
        }

        #haxcms-theme-top {
          scroll-margin-top: var(--book-theme-top);
        }
        .container {
          display: flex;
          align-items: flex-start;
          max-width: var(--book-theme-container-width);
          margin: 0 auto;
        }

        /* left column: site name, tools, site menu */
        .menu {
          position: sticky;
          top: var(--book-theme-top);
          flex: 0 0 var(--book-theme-menu-width);
          width: var(--book-theme-menu-width);
          height: calc(100vh - var(--book-theme-top));
          overflow-y: auto;
          box-sizing: border-box;
          padding: var(--ddd-spacing-6) var(--ddd-spacing-4);
          background-color: var(--book-theme-menu-surface);
        }
        .brand {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          margin-bottom: var(--ddd-spacing-4);
        }
        site-title {
          flex: 1 1 auto;
          min-width: 0;
          --site-title-link-text-decoration: none;
          --site-title-link-display: inline;
          --site-title-heading-font-family: var(--ddd-font-navigation);
          --site-title-heading-font-size: var(--ddd-font-size-xs);
          --site-title-heading-font-weight: var(--ddd-font-weight-bold);
          --site-title-heading-margin: 0;
          --site-title-heading-padding: 0;
          color: inherit;
        }
        .tools {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
        }

        .tool,
        site-modal {
          --simple-icon-width: var(--ddd-icon-xxs);
          --simple-icon-height: var(--ddd-icon-xxs);
          --simple-icon-button-border-radius: var(--ddd-radius-xs);
          --site-modal-icon-color: light-dark(
            var(--ddd-primary-4),
            var(--ddd-accent-6)
          );
          color: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
        }
        .tool {
          width: var(--ddd-control-height-sm, 40px);
          height: var(--ddd-control-height-sm, 40px);
          border-radius: var(--ddd-radius-xs);
        }
        .tool:hover,
        .tool:focus-visible {
          background-color: var(--book-theme-rule);
        }
        site-menu {
          height: auto;
          font-family: var(--ddd-font-navigation);
          --site-menu-background-color: transparent;
          --site-menu-container-background-color: transparent;
          --site-menu-color: light-dark(
            var(--ddd-primary-4),
            var(--ddd-accent-6)
          );
          --site-menu-font-size: var(--ddd-font-size-4xs);
          --map-menu-container-padding: 0;
          --map-menu-parent-background-color: transparent;
          --map-menu-item-a-color: light-dark(
            var(--ddd-primary-4),
            var(--ddd-accent-6)
          );
          --map-menu-item-a-active-color: var(--book-theme-link);
          --map-menu-item-a-active-background-color: transparent;
          --map-menu-item-active-item-color: var(--book-theme-link);
          --map-menu-item-icon-active-color: var(--book-theme-link);
          --map-menu-item-button-active-font-weight: var(
            --ddd-font-weight-bold
          );
          --map-menu-font-weight: var(--ddd-font-weight-regular);
        }

        /* small screen header, hidden until the menu overlays the page */
        .header {
          display: none;
        }

        /* middle column */
        main {
          flex: 1 1 auto;
          min-width: 0;
          box-sizing: border-box;
          padding: var(--ddd-spacing-6) var(--book-theme-gutter)
            var(--ddd-spacing-8);
        }
        .page-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--ddd-spacing-2);
        }
        site-breadcrumb {
          flex: 1 1 auto;
          min-width: 0;
          --site-breadcrumb-margin: 0 0 var(--ddd-spacing-2) 0;
          --site-breadcrumb-font-size: var(--ddd-font-size-4xs);
          --site-breadcrumb-color: var(--book-theme-link);
          --site-breadcrumb-color-hover: var(--book-theme-link);
          --site-breadcrumb-last-color: light-dark(
            var(--ddd-primary-4),
            var(--ddd-accent-6)
          );
        }
        site-active-title {
          --site-active-title-margin: 0;
          --site-active-title-padding: 0;
        }
        site-active-title h1 {
          margin: 0 0 var(--ddd-spacing-4) 0;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-l);
          font-weight: var(--ddd-font-weight-bold);
          color: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
        }
        #contentcontainer {
          --ddd-theme-measure: var(--ddd-content-width-md);
        }
        #slot {
          padding: 0;
        }

        /* page footer: updated date, edit operations, previous and next */
        .page-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: var(--ddd-spacing-2);
          margin-top: var(--ddd-spacing-10);
          padding-top: var(--ddd-spacing-4);
          border-top: var(--ddd-border-xs);
          border-top-color: var(--book-theme-rule);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
        }
        simple-datetime {
          display: inline-block;
          color: inherit;
        }
        .pager {
          display: flex;
          justify-content: space-between;
          gap: var(--ddd-spacing-4);
          margin-top: var(--ddd-spacing-4);
        }
        site-menu-button {
          --site-menu-button-link-decoration: none;
          --site-menu-button-link-color: var(--book-theme-link);
          --site-menu-button-button-hover-color: var(--book-theme-link);
          --site-menu-button-icon-width: var(--ddd-icon-xxs);
          --site-menu-button-icon-height: var(--ddd-icon-xxs);
          color: var(--book-theme-link);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          border-radius: var(--ddd-radius-xs);
          min-width: 0;
        }
        site-menu-button .label {
          color: var(--book-theme-link);
          padding: 0 var(--ddd-spacing-1);
          overflow-wrap: anywhere;
        }
        site-menu-button[type="next"] {
          margin-left: auto;
          text-align: end;
        }
        site-menu-button[disabled] {
          visibility: hidden;
        }
        footer {
          margin-top: var(--ddd-spacing-8);
          font-size: var(--ddd-font-size-4xs);
        }

        /* right column: headings of the active page */
        .toc {
          position: sticky;
          top: var(--book-theme-top);
          flex: 0 0 var(--book-theme-toc-width);
          width: var(--book-theme-toc-width);
          max-height: calc(100vh - var(--book-theme-top));
          overflow-y: auto;
          box-sizing: border-box;
          padding: var(--ddd-spacing-6) var(--ddd-spacing-4);
        }
        site-menu-content {
          font-family: var(--ddd-font-navigation);
          --page-contents-menu-link: light-dark(
            var(--ddd-primary-4),
            var(--ddd-accent-6)
          );
          --page-contents-menu-link-color-focus: var(--book-theme-link);
          --page-contents-menu-link-font-size: var(--ddd-font-size-4xs);
          --page-contents-menu-link-font-size-active: var(--ddd-font-size-4xs);
          --page-contents-menu-link-font-size-focus: var(--ddd-font-size-4xs);
        }

        .scrim {
          display: none;
        }
        .header .tool,
        .header site-modal {
          --site-modal-icon-color: var(--book-theme-header-color);
          color: var(--book-theme-header-color);
        }

        /* topbar layout: the header stays on every screen size */
        :host([book-layout="topbar"]) .header {
          position: sticky;
          top: var(--book-theme-top);
          z-index: 2;
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          min-height: var(--book-theme-header-height);
          /* the bar runs edge to edge; what is in it lines up with the
             columns under it */
          padding: 0
            max(
              var(--ddd-spacing-4),
              calc(
                (100% - var(--book-theme-container-width)) / 2 +
                  var(--ddd-spacing-4)
              )
            );
          border-bottom: var(--ddd-border-xs);
          border-bottom-color: var(--book-theme-rule);
          color: var(--book-theme-header-color);
          background-color: var(--book-theme-header-surface);
        }
        :host([book-layout="topbar"]) .header .header-title {
          flex: 1 1 auto;
          min-width: 0;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-xs);
          font-weight: var(--ddd-font-weight-bold);
        }
        :host([book-layout="topbar"]) .header .menu-toggle {
          display: none;
        }
        :host([book-layout="topbar"]) .brand {
          display: none;
        }
        :host([book-layout="topbar"]) .menu,
        :host([book-layout="topbar"]) .toc {
          top: calc(var(--book-theme-top) + var(--book-theme-header-height));
        }
        :host([book-layout="topbar"]) .menu {
          height: calc(
            100vh - var(--book-theme-top) - var(--book-theme-header-height)
          );
        }
        :host([book-layout="topbar"]) .toc {
          max-height: calc(
            100vh - var(--book-theme-top) - var(--book-theme-header-height)
          );
        }

        /* edit mode keeps the theme chrome out of the way of the editor */
        :host([edit-mode]) .tools,
        :host([edit-mode]) .pager {
          opacity: 0.4;
          pointer-events: none;
        }

        @media (max-width: 1200px) {
          .toc {
            display: none;
          }
        }
        @media (max-width: 900px) {
          :host {
            --book-theme-gutter: var(--ddd-spacing-4);
          }
          .container {
            display: block;
          }
          .header {
            position: sticky;
            top: var(--book-theme-top);
            z-index: 2;
            display: flex;
            align-items: center;
            gap: var(--ddd-spacing-2);
            min-height: var(--book-theme-header-height);
            padding: 0 var(--ddd-spacing-2);
            border-bottom: var(--ddd-border-xs);
            border-bottom-color: var(--book-theme-rule);
            color: var(--book-theme-header-color);
            background-color: var(--book-theme-header-surface);
          }
          .header .header-title {
            flex: 1 1 auto;
            min-width: 0;
            font-family: var(--ddd-font-navigation);
            font-size: var(--ddd-font-size-xxs);
            font-weight: var(--ddd-font-weight-bold);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .menu {
            position: fixed;
            left: 0;
            top: var(--book-theme-top);
            z-index: 4;
            width: min(var(--book-theme-menu-width), 85vw);
            box-shadow: var(--ddd-boxShadow-md);
          }
          :host(:not([menu-open])) .menu {
            display: none;
          }
          :host([book-layout="topbar"]) .header {
            padding: 0 var(--ddd-spacing-2);
          }
          :host([book-layout="topbar"]) .header .menu-toggle {
            display: inline-flex;
          }
          :host([menu-open]) .scrim {
            display: block;
            position: fixed;
            inset: 0;
            z-index: 3;
            border: 0;
            padding: 0;
            background-color: var(--ddd-theme-default-coalyGray);
            opacity: 0.6;
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
      <div id="haxcms-theme-top"></div>
      <header class="header" part="header">
        <simple-icon-button-lite
          class="tool menu-toggle"
          icon="menu"
          title="${this.t.toggleSiteMenu}"
          aria-expanded="${this.menuOpen ? "true" : "false"}"
          aria-controls="menu"
          @click="${this.toggleMenu}"
        ></simple-icon-button-lite>
        <div class="header-title">${this.siteTitle}</div>
        ${this.bookLayout === "topbar" ? this.renderTools() : ``}
      </header>
      <div class="container">
        <aside
          class="menu"
          id="menu"
          part="menu"
          ?inert="${this._overlay && !this.menuOpen}"
          @keydown="${this.__menuKeydown}"
        >
          <div class="brand">
            <site-title
              ?disabled="${this.editMode}"
              part="site-title"
            ></site-title>
            ${this.bookLayout === "topbar" ? `` : this.renderTools()}
          </div>

          <nav aria-label="${this.t.siteNavigation}">
            <site-menu part="site-menu"></site-menu>
          </nav>
        </aside>
        <main>
          <div class="page-top">
            <site-breadcrumb part="page-breadcrumb"></site-breadcrumb>
            ${
              this._tocFolded
                ? html`<site-menu-content
                    mobile
                    part="page-contents"
                  ></site-menu-content>`
                : ``
            }
          </div>
          <site-active-title part="page-title"></site-active-title>
          <site-active-tags
            part="page-tags"
            auto-accent-color
          ></site-active-tags>
          <article id="contentcontainer" class="ddd-reading">
            <section id="slot"><slot></slot></section>
          </article>
          <div class="page-meta">
            <div part="page-updated">
              ${
                this.pageTimestamp
                  ? html`${this.t.lastUpdated}
                      <simple-datetime
                        unix
                        .timestamp="${this.pageTimestamp}"
                      ></simple-datetime>`
                  : ``
              }
            </div>
            <div part="page-operations">
              ${this.HAXCMSRenderOperationButtons()}
            </div>
          </div>
          <nav class="pager" aria-label="${this.t.pageNavigation}">
            <site-menu-button
              hide-label
              type="prev"
              position="right"
              @label-changed="${this.__prevPageLabelChanged}"
            >
              <span slot="suffix" class="label">${this.prevPage}</span>
            </site-menu-button>
            <site-menu-button
              hide-label
              type="next"
              position="left"
              @label-changed="${this.__nextPageLabelChanged}"
            >
              <span slot="prefix" class="label">${this.nextPage}</span>
            </site-menu-button>
          </nav>
          <footer part="footer">
            <site-region name="footerPrimary"></site-region>
          </footer>
        </main>
        ${
          this._tocFolded
            ? ``
            : html`<aside
                class="toc"
                part="toc"
                aria-label="${this.t.onThisPage}"
              >
                <site-menu-content part="page-contents"></site-menu-content>
              </aside>`
        }
      </div>
      <button
        class="scrim"
        tabindex="-1"
        aria-label="${this.t.closeSiteMenu}"
        @click="${this.closeMenu}"
      ></button>
    `;
  }

  // search and the dark mode switch: beside the site name in the menu, or in
  // the header under the topbar layout
  renderTools() {
    return html`
      <div class="tools">
        <site-modal
          ?disabled="${this.editMode}"
          icon="icons:search"
          title="${this.t.searchSite}"
          button-label="${this.t.search}"
          part="search-btn"
        >
          <site-search></site-search>
        </site-modal>
        <simple-icon-button-lite
          class="tool"
          icon="${this._dark ? "image:brightness-7" : "image:brightness-3"}"
          title="${this.t.toggleDarkMode}"
          aria-pressed="${this._dark ? "true" : "false"}"
          @click="${this.toggleDarkMode}"
          part="dark-mode-btn"
        ></simple-icon-button-lite>
      </div>
    `;
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    const themeTop = this.shadowRoot.querySelector("#haxcms-theme-top");
    this.HAXCMSThemeSettings.themeTop = themeTop;
    this.HAXCMSThemeSettings.scrollTarget = themeTop;
  }

  connectedCallback() {
    super.connectedCallback();
    this.__overlayMq = globalThis.matchMedia(MENU_OVERLAY_QUERY);
    this.__overlayHandler = (e) => {
      this._overlay = e.matches;
      // the menu overlays the page on small screens, so it starts closed
      this.menuOpen = !e.matches;
    };
    this.__overlayMq.addEventListener("change", this.__overlayHandler);
    this.__overlayHandler(this.__overlayMq);
    this.__tocMq = globalThis.matchMedia(TOC_FOLD_QUERY);
    this.__tocHandler = (e) => {
      this._tocFolded = this.tocFold || e.matches;
    };
    this.__tocMq.addEventListener("change", this.__tocHandler);
    this.__tocHandler(this.__tocMq);
    this.__bookDisposers.push(
      autorun(() => {
        this._dark = !!toJS(store.darkMode);
      }),
    );
    this.__bookDisposers.push(
      autorun(() => {
        this.siteTitle = toJS(store.siteTitle);
      }),
    );
    this.__bookDisposers.push(
      autorun(() => {
        // close the overlay menu after navigating on small screens
        toJS(store.activeId);
        if (this._overlay) {
          this.menuOpen = false;
        }
      }),
    );
    this.__bookDisposers.push(
      autorun(() => {
        const item = toJS(store.activeItem);
        this.pageTimestamp =
          item && item.metadata && item.metadata.updated
            ? item.metadata.updated
            : 0;
      }),
    );
  }

  disconnectedCallback() {
    if (this.__overlayMq) {
      this.__overlayMq.removeEventListener("change", this.__overlayHandler);
    }
    if (this.__tocMq) {
      this.__tocMq.removeEventListener("change", this.__tocHandler);
    }
    this.__bookDisposers.forEach((dispose) => dispose());
    this.__bookDisposers = [];
    super.disconnectedCallback();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
    const toggle = this.shadowRoot.querySelector(".header .menu-toggle");
    if (toggle) {
      toggle.focus();
    }
  }

  // Escape closes the menu only while it overlays the page
  __menuKeydown(e) {
    if (e.key === "Escape" && this._overlay && this.menuOpen) {
      this.closeMenu();
    }
  }

  __prevPageLabelChanged(e) {
    this.prevPage = e.detail.value;
  }

  __nextPageLabelChanged(e) {
    this.nextPage = e.detail.value;
  }

  toggleDarkMode() {
    store.darkMode = !store.darkMode;
  }
}
globalThis.customElements.define(BookTheme.tag, BookTheme);
export { BookTheme };
