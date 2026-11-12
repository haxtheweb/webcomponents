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
import { PatternflyTokens } from "@haxtheweb/patternfly-theme/lib/PatternflyTokens.js";
import { PatternflyDDDMap } from "@haxtheweb/patternfly-theme/lib/PatternflyDDDMap.js";
import { activatePatternflyDesignSystem } from "@haxtheweb/patternfly-theme/lib/PatternflyDesignSystem.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/haxcms-elements/lib/ui-components/site/site-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";

/**
 * `patternfly-theme`
 * A HAXcms theme in the PatternFly 6 page layout (masthead, sidebar
 * navigation, inset main container), built on the PatternFly DDD bridge:
 * every HAX block reads --ddd-* tokens, which point at PatternFly tokens
 * while this theme is active.
 *
 * @title PatternFly
 * @haxcms-theme-category Website, Course, Documentation
 * @haxcms-theme-priority 50
 * @demo demo/index.html
 * @element patternfly-theme
 */
class PatternflyTheme extends HAXCMSThemeParts(
  DDDSuper(HAXCMSLitElementTheme),
) {
  static get tag() {
    return "patternfly-theme";
  }

  HAXCMSGlobalStyleSheetContent() {
    return [
      ...super.HAXCMSGlobalStyleSheetContent(),
      css`
        body {
          margin: 0;
          background-color: light-dark(#f2f2f2, #151515);
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
    this.__pfDisposers = [];
    activatePatternflyDesignSystem();
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
      PatternflyTokens,
      PatternflyDDDMap,
      css`
        :host {
          display: block;
          min-height: 100vh;
          color: var(--pf-t--global--text--color--regular);
          background-color: var(
            --pf-t--global--background--color--secondary--default
          );
          font-family: var(--pf-t--global--font--family--body);
          --patternfly-theme-masthead-height: 72px;
          --patternfly-theme-sidebar-width: 290px;
          --patternfly-theme-gutter: var(--pf-t--global--spacer--lg);
        }
        :host([hidden]) {
          display: none;
        }
        a:focus-visible,
        button:focus-visible,
        simple-icon-button-lite:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset, 2px);
        }

        /* masthead */
        .masthead {
          position: sticky;
          top: 0;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: var(--pf-t--global--spacer--md);
          min-height: var(--patternfly-theme-masthead-height);
          padding: 0 var(--patternfly-theme-gutter);
          background-color: var(
            --pf-t--global--background--color--secondary--default
          );
          color: var(--pf-t--global--text--color--regular);
        }
        .masthead .brand {
          flex: 1 1 auto;
          min-width: 0;
          font-family: var(--pf-t--global--font--family--heading);
          font-size: var(--pf-t--global--font--size--heading--h3);
          font-weight: var(--pf-t--global--font--weight--heading--default);
        }
        site-title {
          --site-title-link-text-decoration: none;
          --site-title-heading-font-size: var(
            --pf-t--global--font--size--heading--h3
          );
          --site-title-heading-font-weight: var(
            --pf-t--global--font--weight--heading--default
          );
          --site-title-heading-margin: 0;
          --site-title-link-display: inline;
          color: var(--pf-t--global--text--color--regular);
        }
        .masthead .toolbar {
          display: flex;
          align-items: center;
          gap: var(--pf-t--global--spacer--xs);
        }
        .plain-button,
        site-modal {
          --simple-icon-button-border-radius: var(
            --pf-t--global--border--radius--small
          );
          --simple-icon-width: 20px;
          --simple-icon-height: 20px;
          color: var(--pf-t--global--icon--color--regular);
        }
        .plain-button {
          width: 40px;
          height: 40px;
          border-radius: var(--pf-t--global--border--radius--small);
        }
        .plain-button:hover,
        .plain-button:focus-visible {
          background-color: var(
            --pf-t--global--background--color--primary--hover
          );
        }
        site-modal {
          --site-modal-icon-color: var(--pf-t--global--icon--color--regular);
        }

        /* page body: sidebar + main container */
        .page {
          display: flex;
          align-items: flex-start;
        }
        .sidebar {
          position: sticky;
          top: var(--patternfly-theme-masthead-height);
          flex: 0 0 var(--patternfly-theme-sidebar-width);
          width: var(--patternfly-theme-sidebar-width);
          height: calc(100vh - var(--patternfly-theme-masthead-height));
          overflow-y: auto;
          padding: var(--pf-t--global--spacer--sm)
            var(--pf-t--global--spacer--md) var(--pf-t--global--spacer--lg);
          box-sizing: border-box;
          background-color: var(
            --pf-t--global--background--color--secondary--default
          );
        }
        :host(:not([sidebar-open])) .sidebar {
          display: none;
        }
        site-menu {
          height: auto;
          --site-menu-background-color: transparent;
          --site-menu-container-background-color: transparent;
          --site-menu-color: var(--pf-t--global--text--color--regular);
          --site-menu-font-size: var(--pf-t--global--font--size--body--default);
          --map-menu-container-padding: 0;
          --map-menu-gap: var(--pf-t--global--spacer--xs);
          --map-menu-item-border-radius: var(
            --pf-t--global--border--radius--small
          );
          --map-menu-item-a-color: var(--pf-t--global--text--color--regular);
          --map-menu-item-a-active-color: var(
            --pf-t--global--text--color--regular
          );
          --map-menu-item-a-active-background-color: var(
            --pf-t--global--background--color--primary--default
          );
          --map-menu-item-active-item-color: var(
            --pf-t--global--color--brand--default
          );
          --map-menu-item-icon-active-color: var(
            --pf-t--global--color--brand--default
          );
          --map-menu-item-button-active-font-weight: var(
            --pf-t--global--font--weight--body--bold
          );
          --map-menu-font-weight: var(
            --pf-t--global--font--weight--body--default
          );
          --map-menu-parent-background-color: transparent;
          font-family: var(--pf-t--global--font--family--body);
        }

        main {
          flex: 1 1 auto;
          min-width: 0;
          padding: 0 var(--patternfly-theme-gutter)
            var(--patternfly-theme-gutter) 0;
        }
        :host(:not([sidebar-open])) main {
          padding-left: var(--patternfly-theme-gutter);
        }
        .main-container {
          min-height: calc(
            100vh - var(--patternfly-theme-masthead-height) - var(
                --patternfly-theme-gutter
              )
          );
          border-radius: var(--pf-t--global--border--radius--large);
          background-color: var(
            --pf-t--global--background--color--primary--default
          );
          display: flex;
          flex-direction: column;
        }
        .page-section {
          padding: var(--pf-t--global--spacer--lg)
            var(--pf-t--global--spacer--xl);
        }
        .page-header {
          padding-bottom: 0;
        }
        .page-header + #contentcontainer {
          padding-top: 0;
        }
        site-breadcrumb {
          --site-breadcrumb-margin: 0 0 var(--pf-t--global--spacer--md) 0;
          --site-breadcrumb-font-size: var(
            --pf-t--global--font--size--body--sm
          );
          --site-breadcrumb-color: var(
            --pf-t--global--text--color--link--default
          );
          --site-breadcrumb-color-hover: var(
            --pf-t--global--text--color--link--hover
          );
          --site-breadcrumb-last-color: var(
            --pf-t--global--text--color--regular
          );
          --site-breadcrumb-separator-color: var(
            --pf-t--global--text--color--subtle
          );
        }
        site-active-title {
          --site-active-title-margin: 0;
          --site-active-title-padding: 0;
        }
        site-active-title h1 {
          margin: 0;
          font-family: var(--pf-t--global--font--family--heading);
          font-size: var(--pf-t--global--font--size--heading--h1);
          font-weight: var(--pf-t--global--font--weight--heading--default);
          color: var(--pf-t--global--text--color--regular);
        }
        #contentcontainer {
          flex: 1 1 auto;
          max-width: var(--patternfly-theme-content-max-width, 1080px);
        }
        #slot {
          padding: 0;
        }

        /* previous / next, as PatternFly secondary buttons */
        .pager {
          display: flex;
          justify-content: space-between;
          gap: var(--pf-t--global--spacer--md);
          border-top: 1px solid var(--pf-t--global--border--color--default);
        }
        site-menu-button {
          --site-menu-button-icon-fill-color: var(
            --pf-t--global--color--brand--default
          );
          --site-menu-button-link-color: var(
            --pf-t--global--color--brand--default
          );
          --site-menu-button-link-decoration: none;
          --site-menu-button-button-border-radius: var(
            --pf-t--global--border--radius--pill
          );
          --site-menu-button-button-hover-background-color: var(
            --pf-t--global--background--color--primary--hover
          );
        }
        site-menu-button[disabled] {
          visibility: hidden;
        }

        footer {
          padding: var(--pf-t--global--spacer--md)
            var(--pf-t--global--spacer--xl);
          color: var(--pf-t--global--text--color--subtle);
          font-size: var(--pf-t--global--font--size--body--sm);
        }

        /* edit mode keeps the editor out of the way of the chrome */
        :host([edit-mode]) .masthead .toolbar,
        :host([edit-mode]) .pager {
          opacity: 0.4;
          pointer-events: none;
        }

        /* below the PatternFly xl breakpoint the sidebar overlays the page */
        @media (max-width: 1200px) {
          .sidebar {
            position: fixed;
            left: 0;
            top: var(--patternfly-theme-masthead-height);
            z-index: 2;
            box-shadow: var(--pf-t--global--box-shadow--md);
          }
          main,
          :host(:not([sidebar-open])) main {
            padding-left: var(--patternfly-theme-gutter);
          }
        }
        @media (max-width: 768px) {
          :host {
            --patternfly-theme-gutter: var(--pf-t--global--spacer--sm);
            --patternfly-theme-masthead-height: 56px;
          }
          .sidebar {
            width: min(var(--patternfly-theme-sidebar-width), 85vw);
          }
          .page-section {
            padding: var(--pf-t--global--spacer--md);
          }
          .masthead .brand,
          site-title {
            --site-title-heading-font-size: var(
              --pf-t--global--font--size--body--lg
            );
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
      <header class="masthead" part="masthead">
        <simple-icon-button-lite
          class="plain-button"
          icon="menu"
          title="${this.t.toggleSiteMenu}"
          aria-expanded="${this.sidebarOpen ? "true" : "false"}"
          aria-controls="sidebar"
          @click="${this.toggleSidebar}"
        ></simple-icon-button-lite>
        <div class="brand">
          <site-title
            ?disabled="${this.editMode}"
            part="site-title"
          ></site-title>
        </div>
        <div class="toolbar">
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
            class="plain-button"
            icon="${this._dark ? "image:brightness-7" : "image:brightness-3"}"
            title="${this.t.toggleDarkMode}"
            aria-pressed="${this._dark ? "true" : "false"}"
            @click="${this.toggleDarkMode}"
            part="dark-mode-btn"
          ></simple-icon-button-lite>
        </div>
      </header>
      <div class="page">
        <div
          class="sidebar"
          id="sidebar"
          part="sidebar"
          ?inert="${!this.sidebarOpen}"
        >
          <nav aria-label="${this.t.siteNavigation}">
            <site-menu part="site-menu"></site-menu>
          </nav>
        </div>
        <main>
          <div class="main-container">
            <div class="page-section page-header">
              <site-breadcrumb part="page-breadcrumb"></site-breadcrumb>
              <site-active-title part="page-title"></site-active-title>
            </div>
            <article id="contentcontainer" class="page-section">
              <section id="slot"><slot></slot></section>
            </article>
            <nav
              class="page-section pager"
              aria-label="${this.t.pageNavigation}"
            >
              <site-menu-button type="prev" position="right"></site-menu-button>
              <site-menu-button type="next" position="left"></site-menu-button>
            </nav>
            <footer part="footer">
              <site-region name="footerPrimary"></site-region>
            </footer>
          </div>
        </main>
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.__mq = globalThis.matchMedia("(max-width: 1200px)");
    this.__mqHandler = (e) => {
      this._mobile = e.matches;
      // the sidebar overlays the page below the xl breakpoint, so start closed
      this.sidebarOpen = !e.matches;
    };
    this.__mq.addEventListener("change", this.__mqHandler);
    this.__mqHandler(this.__mq);
    this.__pfDisposers.push(
      autorun(() => {
        this._dark = !!toJS(store.darkMode);
      }),
    );
    this.__pfDisposers.push(
      autorun(() => {
        // close the overlay sidebar after navigating on small screens
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
    this.__pfDisposers.forEach((dispose) => dispose());
    this.__pfDisposers = [];
    super.disconnectedCallback();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleDarkMode() {
    store.darkMode = !store.darkMode;
  }
}
globalThis.customElements.define(PatternflyTheme.tag, PatternflyTheme);
export { PatternflyTheme };
