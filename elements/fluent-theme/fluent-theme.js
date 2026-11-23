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
import { FluentTokens } from "@haxtheweb/fluent-theme/lib/FluentTokens.js";
import { FluentDDDMap } from "@haxtheweb/fluent-theme/lib/FluentDDDMap.js";
import { activateFluentDesignSystem } from "@haxtheweb/fluent-theme/lib/FluentDesignSystem.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/haxcms-elements/lib/ui-components/site/site-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";

/**
 * `fluent-theme`
 * A HAXcms theme in the layout of the Fluent 2 documentation site: a light
 * 56px header, a navigation drawer on the neutral background 2 surface whose
 * selected item carries Fluent's brand pill, and page content on a rounded
 * card surface. Built on the Fluent 2 DDD bridge: every HAX block reads
 * --ddd-* tokens, which point at Fluent tokens while this theme is active.
 *
 * @title Fluent 2
 * @haxcms-theme-category Website, Course, Documentation, Organization
 * @haxcms-theme-layout Sidebar
 * @haxcms-theme-design-system Fluent
 * @haxcms-theme-priority 50
 * @demo demo/index.html
 * @element fluent-theme
 */
class FluentTheme extends HAXCMSThemeParts(DDDSuper(HAXCMSLitElementTheme)) {
  static get tag() {
    return "fluent-theme";
  }

  HAXCMSGlobalStyleSheetContent() {
    return [
      ...super.HAXCMSGlobalStyleSheetContent(),
      css`
        body {
          margin: 0;
          background-color: light-dark(#fafafa, #1f1f1f);
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
    this.__fluentDisposers = [];
    activateFluentDesignSystem();
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
      FluentTokens,
      FluentDDDMap,
      css`
        :host {
          display: block;
          min-height: 100vh;
          color: var(--colorNeutralForeground1);
          background-color: var(--colorNeutralBackground2);
          font-family: var(--ddd-font-primary);
          --fluent-theme-header-height: 56px;
          --fluent-theme-nav-width: 280px;
        }
        :host([hidden]) {
          display: none;
        }
        /* Fluent's focus indicator: a 2px stroke in colorStrokeFocus2,
           drawn just inside the control's rounded corners */
        a:focus-visible,
        button:focus-visible,
        simple-icon-button-lite:focus-visible {
          outline: 2px solid var(--colorStrokeFocus2);
          outline-offset: 1px;
          border-radius: var(--borderRadiusMedium);
        }

        /* header */
        .header {
          position: sticky;
          top: 0;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          height: var(--fluent-theme-header-height);
          padding: 0 var(--ddd-spacing-3);
          box-sizing: border-box;
          background-color: var(--colorNeutralBackground1);
          color: var(--colorNeutralForeground1);
          border-bottom: 1px solid var(--colorNeutralStroke2);
        }
        .header-name {
          flex: 1 1 auto;
          min-width: 0;
        }
        site-title {
          --site-title-link-text-decoration: none;
          --site-title-heading-font-size: var(--ddd-font-size-4xs);
          --site-title-heading-font-weight: var(--fontWeightSemibold);
          --site-title-heading-margin: 0;
          --site-title-link-display: inline;
          --site-title-link-color: var(--colorNeutralForeground1);
          color: var(--colorNeutralForeground1);
        }
        .header-action,
        site-modal {
          --simple-icon-width: 20px;
          --simple-icon-height: 20px;
          --simple-icon-button-border-radius: var(--borderRadiusMedium);
          --site-modal-icon-color: var(--colorNeutralForeground2);
          color: var(--colorNeutralForeground2);
        }
        /* Fluent subtle icon button: 32px, transparent until hovered */
        .header-action {
          width: 40px;
          height: 40px;
          border-radius: var(--borderRadiusMedium);
        }
        .header-action:hover,
        .header-action:focus-visible {
          background-color: var(--colorSubtleBackgroundHover);
          color: var(--colorNeutralForeground1);
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
        }

        /* navigation drawer + content */
        .shell {
          display: flex;
          align-items: flex-start;
        }
        .nav {
          position: sticky;
          top: var(--fluent-theme-header-height);
          flex: 0 0 var(--fluent-theme-nav-width);
          width: var(--fluent-theme-nav-width);
          height: calc(100vh - var(--fluent-theme-header-height));
          overflow-y: auto;
          padding: var(--ddd-spacing-3) var(--ddd-spacing-2);
          box-sizing: border-box;
          background-color: var(--colorNeutralBackground2);
        }
        :host(:not([sidebar-open])) .nav {
          display: none;
        }
        site-menu {
          height: auto;
          --site-menu-background-color: transparent;
          --site-menu-container-background-color: transparent;
          --site-menu-color: var(--colorNeutralForeground2);
          --site-menu-font-size: var(--ddd-font-size-4xs);
          --map-menu-container-padding: 0;
          --map-menu-gap: 2px;
          --map-menu-item-border-radius: var(--borderRadiusMedium);
          --map-menu-item-a-color: var(--colorNeutralForeground2);
          --map-menu-item-a-active-color: var(--colorNeutralForeground1);
          --map-menu-item-a-active-background-color: var(
            --colorSubtleBackgroundSelected
          );
          /* the selected-item background is translucent, so the check on a
             done progress disc is drawn in the opaque page surface */
          --map-menu-progress-ring-on-color: var(--colorNeutralBackground2);
          --map-menu-item-active-item-color: var(--colorNeutralForeground1);
          /* Fluent's nav item selection indicator: a brand pill */
          --map-menu-item-active-accent-width: 4px;
          --map-menu-item-active-accent-color: var(--colorBrandForeground1);
          --map-menu-item-icon-active-color: var(--colorBrandForeground1);
          --map-menu-item-button-active-font-weight: var(--fontWeightSemibold);
          --map-menu-font-weight: var(--ddd-font-weight-regular);
          --map-menu-parent-background-color: transparent;
          --map-menu-header-title-margin: var(--ddd-spacing-4);
          font-family: var(--ddd-font-primary);
        }

        /* the footer sits beside main, not inside it, so it is the page's
           contentinfo landmark; .main-col keeps the layout main had */
        .main-col > main {
          display: flex;
          flex-direction: column;
          flex: 1 0 auto;
          min-width: 0;
        }
        .main-col {
          flex: 1 1 auto;
          min-width: 0;
          min-height: calc(100vh - var(--fluent-theme-header-height));
          padding: var(--ddd-spacing-4) var(--ddd-spacing-4) 0 0;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }
        /* the content surface: neutral background 1 on a rounded card, as
           the Fluent 2 site sets its pages apart from the drawer */
        .surface {
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
          background-color: var(--colorNeutralBackground1);
          border-radius: var(--borderRadiusXLarge) var(--borderRadiusXLarge) 0 0;
          box-shadow:
            0 0 2px var(--colorNeutralShadowAmbient),
            0 2px 4px var(--colorNeutralShadowKey);
        }
        .page-header {
          padding: var(--ddd-spacing-12) var(--ddd-spacing-12)
            var(--ddd-spacing-8);
          max-width: var(--fluent-theme-content-max-width, 960px);
          box-sizing: border-box;
        }
        site-breadcrumb {
          --site-breadcrumb-margin: 0 0 var(--ddd-spacing-3) 0;
          --site-breadcrumb-font-size: var(--ddd-font-size-4xs);
          --site-breadcrumb-color: var(--colorBrandForegroundLink);
          --site-breadcrumb-color-hover: var(--colorBrandForegroundLinkHover);
          --site-breadcrumb-last-color: var(--colorNeutralForeground1);
          --site-breadcrumb-separator-color: var(--colorNeutralForeground3);
        }
        site-active-title {
          --site-active-title-margin: 0;
          --site-active-title-padding: 0;
        }
        /* Fluent hero title: semibold, tight line height */
        site-active-title h1 {
          margin: 0;
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-xl);
          font-weight: var(--fontWeightSemibold);
          line-height: 1.2;
          color: var(--colorNeutralForeground1);
        }
        .lead {
          max-width: 40rem;
          margin: var(--ddd-spacing-4) 0 0;
          font-size: var(--ddd-font-size-xs);
          line-height: 1.5;
          color: var(--colorNeutralForeground2);
        }
        .content {
          padding: 0 var(--ddd-spacing-12);
          max-width: var(--fluent-theme-content-max-width, 960px);
          box-sizing: border-box;
          width: 100%;
          flex: 1 1 auto;
        }
        #slot {
          padding: 0;
        }

        /* previous / next as Fluent outline buttons */
        .pager {
          display: flex;
          justify-content: space-between;
          gap: var(--ddd-spacing-4);
          margin-top: var(--ddd-spacing-12);
          padding: var(--ddd-spacing-6) var(--ddd-spacing-12);
          border-top: 1px solid var(--colorNeutralStroke2);
        }
        site-menu-button {
          --site-menu-button-icon-fill-color: var(--colorNeutralForeground1);
          --site-menu-button-link-color: var(--colorNeutralForeground1);
          --site-menu-button-link-decoration: none;
          --site-menu-button-button-border-radius: var(--borderRadiusMedium);
          --site-menu-button-button-hover-background-color: var(
            --colorNeutralBackground1Hover
          );
        }
        site-menu-button[disabled] {
          visibility: hidden;
        }
        footer {
          padding: var(--ddd-spacing-4) var(--ddd-spacing-12);
          color: var(--colorNeutralForeground3);
          font-size: var(--ddd-font-size-4xs);
        }

        :host([edit-mode]) .header-actions,
        :host([edit-mode]) .pager {
          opacity: 0.4;
          pointer-events: none;
        }

        /* below 1024px the drawer overlays the page, as Fluent's overlay
           NavDrawer does */
        @media (max-width: 1023px) {
          .nav {
            position: fixed;
            left: 0;
            top: var(--fluent-theme-header-height);
            z-index: 2;
            box-shadow:
              0 0 8px var(--colorNeutralShadowAmbient),
              0 14px 28px var(--colorNeutralShadowKey);
          }
          .main-col {
            padding: 0;
          }
          .surface {
            border-radius: 0;
            box-shadow: none;
          }
        }
        @media (max-width: 640px) {
          .page-header {
            padding: var(--ddd-spacing-8) var(--ddd-spacing-4)
              var(--ddd-spacing-6);
          }
          .content,
          .pager,
          footer {
            padding-left: var(--ddd-spacing-4);
            padding-right: var(--ddd-spacing-4);
          }
          .nav {
            width: min(var(--fluent-theme-nav-width), 85vw);
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
        <div class="main-col">
          <main>
            <div class="surface">
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
                <site-menu-button
                  type="prev"
                  position="right"
                ></site-menu-button>
                <site-menu-button
                  type="next"
                  position="left"
                ></site-menu-button>
              </nav>
            </div>
          </main>
          <footer part="footer">
            <site-region name="footerPrimary"></site-region>
          </footer>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.__mq = globalThis.matchMedia("(max-width: 1023px)");
    this.__mqHandler = (e) => {
      this._mobile = e.matches;
      // the drawer overlays the page on small screens, so start closed
      this.sidebarOpen = !e.matches;
    };
    this.__mq.addEventListener("change", this.__mqHandler);
    this.__mqHandler(this.__mq);
    this.__fluentDisposers.push(
      autorun(() => {
        this._dark = !!toJS(store.darkMode);
      }),
    );
    this.__fluentDisposers.push(
      autorun(() => {
        // the page description is the page header's lead text
        const item = toJS(store.activeItem);
        this._lead = item && item.description ? item.description : "";
      }),
    );
    this.__fluentDisposers.push(
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
    this.__fluentDisposers.forEach((dispose) => dispose());
    this.__fluentDisposers = [];
    super.disconnectedCallback();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleDarkMode() {
    store.darkMode = !store.darkMode;
  }
}
globalThis.customElements.define(FluentTheme.tag, FluentTheme);
export { FluentTheme };
