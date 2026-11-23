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
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/papermod-theme/lib/homage-page-list.js";

/**
 * What the homage themes in this package share: the page head (breadcrumb,
 * title, date, tags), the content slot, the list of pages under the active
 * page, previous and next, search, the dark mode switch and the footer
 * region. HomageColumnTheme and HomageSidebarTheme add a layout; each theme
 * then sets colors, fonts and widths through the --homage-* properties.
 *
 * Not a theme by itself and not registered as an element.
 */
class HomageThemeBase extends HAXCMSOperationButtons(
  HAXCMSThemeParts(DDDSuper(HAXCMSLitElementTheme)),
) {
  // the chrome reads only --ddd-* tokens, so a site can pair any of these
  // layouts with any design system
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
      onThisPage: "On this page",
      pagesInThisSection: "Pages in this section",
      searchSite: "Search site",
      search: "Search",
      toggleDarkMode: "Toggle dark mode",
      pageNavigation: "Page navigation",
      lastUpdated: "Last updated",
    };
    // no I18NMixin in this class chain, so register with the store directly;
    // one namespace for every theme in the package
    I18NManagerStore.registerLocalization({
      context: this,
      namespace: "papermod-theme",
      localesPath: new URL("../locales/", import.meta.url).href,
    });
    this.HAXCMSThemeSettings.autoScroll = true;
    this.prevPage = "";
    this.nextPage = "";
    this.pageCreated = 0;
    this.pageUpdated = 0;
    this.siteTitle = "";
    this.siteDescription = "";
    // how homage-page-list draws the pages under the active page
    this.listVariant = "rows";
    this.hasPageList = false;
    // a theme that is dark by design hides the switch
    this.darkModeSwitch = true;
    this._dark = false;
    this.__homageDisposers = [];
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
      prevPage: { type: String },
      nextPage: { type: String },
      pageCreated: { type: Number },
      pageUpdated: { type: Number },
      siteTitle: { type: String },
      siteDescription: { type: String },
      listVariant: { type: String },
      hasPageList: { type: Boolean, reflect: true, attribute: "has-page-list" },
      darkModeSwitch: { type: Boolean },
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
          --homage-text: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
          --homage-bg: light-dark(var(--ddd-accent-6), var(--ddd-primary-4));
          --homage-surface: var(--homage-bg);
          --homage-accent: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-linkLight)
          );
          --homage-muted: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-slateLight)
          );
          --homage-rule: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          --homage-font-body: var(--ddd-font-primary);
          --homage-font-heading: var(--ddd-font-navigation);
          --homage-radius: var(--ddd-radius-sm);
          --homage-gutter: var(--ddd-spacing-6);
          --homage-top: 0px;
          --ddd-reading-prose-color: var(--homage-text);
          color: var(--homage-text);
          background-color: var(--homage-bg);
          font-family: var(--homage-font-body);
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
          --homage-top: calc(64px + var(--haxcms-top-offset, 0px));
        }
        #haxcms-theme-top {
          scroll-margin-top: var(--homage-top);
        }
        /* a page that introduces a list of pages keeps no reserved height
           between its text and the list */
        :host([has-page-list]) {
          --haxcms-theme-content-min-height: 0px;
          --haxcms-theme-content-min-height-mobile: 0px;
        }
        a:focus-visible,
        button:focus-visible,
        simple-icon-button-lite:focus-visible,
        site-menu-button:focus-within {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset, 2px);
        }

        site-title {
          --site-title-link-text-decoration: none;
          --site-title-link-display: inline;
          --site-title-heading-font-family: var(--homage-font-heading);
          --site-title-heading-font-size: var(--ddd-font-size-s);
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
          --site-modal-icon-color: currentColor;
          color: inherit;
        }
        .tool {
          width: var(--ddd-control-height-sm, 40px);
          height: var(--ddd-control-height-sm, 40px);
          border-radius: var(--ddd-radius-xs);
        }

        /* page head */
        site-breadcrumb {
          --site-breadcrumb-margin: 0 0 var(--ddd-spacing-2) 0;
          --site-breadcrumb-font-size: var(--ddd-font-size-4xs);
          --site-breadcrumb-color: var(--homage-accent);
          --site-breadcrumb-color-hover: var(--homage-accent);
          --site-breadcrumb-last-color: var(--homage-text);
        }
        site-active-title {
          --site-active-title-margin: 0;
          --site-active-title-padding: 0;
        }
        site-active-title h1 {
          margin: 0 0 var(--ddd-spacing-2) 0;
          font-family: var(--homage-font-heading);
          font-size: var(--ddd-font-size-l);
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-120);
          color: var(--homage-text);
        }
        .page-date {
          margin: 0 0 var(--ddd-spacing-4) 0;
          color: var(--homage-muted);
          font-family: var(--homage-font-heading);
          font-size: var(--ddd-font-size-4xs);
        }
        #contentcontainer {
          --ddd-theme-measure: var(--ddd-content-width-md);
          margin-top: var(--ddd-spacing-4);
        }
        #slot {
          padding: 0;
        }

        /* page foot: updated date, edit operations, previous and next */
        .page-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: var(--ddd-spacing-2);
          margin-top: var(--ddd-spacing-10);
          padding-top: var(--ddd-spacing-4);
          border-top: var(--ddd-border-xs);
          border-top-color: var(--homage-rule);
          font-family: var(--homage-font-heading);
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
          --site-menu-button-link-color: var(--homage-accent);
          --site-menu-button-button-hover-color: var(--homage-accent);
          --site-menu-button-icon-width: var(--ddd-icon-xxs);
          --site-menu-button-icon-height: var(--ddd-icon-xxs);
          color: var(--homage-accent);
          font-family: var(--homage-font-heading);
          font-size: var(--ddd-font-size-4xs);
          border-radius: var(--ddd-radius-xs);
          min-width: 0;
        }
        site-menu-button .label {
          color: var(--homage-accent);
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
        .site-footer {
          margin-top: var(--ddd-spacing-8);
          padding: var(--ddd-spacing-6) 0;
          border-top: var(--ddd-border-xs);
          border-top-color: var(--homage-rule);
          color: var(--homage-muted);
          font-family: var(--homage-font-heading);
          font-size: var(--ddd-font-size-4xs);
        }

        /* edit mode keeps the theme chrome out of the way of the editor */
        :host([edit-mode]) .tools,
        :host([edit-mode]) .pager,
        :host([edit-mode]) homage-page-list {
          opacity: 0.4;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            transition: none !important;
          }
        }
      `,
    ];
  }

  // search and the dark mode switch
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
        ${
          this.darkModeSwitch
            ? html`<simple-icon-button-lite
                class="tool"
                icon="${
                  this._dark ? "image:brightness-7" : "image:brightness-3"
                }"
                title="${this.t.toggleDarkMode}"
                aria-pressed="${this._dark ? "true" : "false"}"
                @click="${this.toggleDarkMode}"
                part="dark-mode-btn"
              ></simple-icon-button-lite>`
            : ``
        }
      </div>
    `;
  }

  // breadcrumb, title, date written and tags of the active page
  renderPageHead() {
    return html`
      <site-breadcrumb part="page-breadcrumb"></site-breadcrumb>
      <site-active-title part="page-title"></site-active-title>
      ${
        this.pageCreated
          ? html`<p class="page-date" part="page-date">
              <simple-datetime
                unix
                .timestamp="${this.pageCreated}"
              ></simple-datetime>
            </p>`
          : ``
      }
      <site-active-tags part="page-tags" auto-accent-color></site-active-tags>
    `;
  }

  // the page, then the pages under it
  renderContent() {
    return html`
      <article id="contentcontainer" class="ddd-reading">
        <section id="slot"><slot></slot></section>
      </article>
      <homage-page-list
        variant="${this.listVariant}"
        label="${this.t.pagesInThisSection}"
        part="page-list"
        @empty-changed="${this.__pageListEmptyChanged}"
      ></homage-page-list>
    `;
  }

  // updated date, edit operations, previous and next
  renderPageFoot() {
    return html`
      <div class="page-meta">
        <div part="page-updated">
          ${
            this.pageUpdated
              ? html`${this.t.lastUpdated}
                  <simple-datetime
                    unix
                    .timestamp="${this.pageUpdated}"
                  ></simple-datetime>`
              : ``
          }
        </div>
        <div part="page-operations">${this.HAXCMSRenderOperationButtons()}</div>
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
    `;
  }

  renderFooter() {
    return html`
      <footer class="site-footer" part="footer">
        <site-region name="footerPrimary"></site-region>
      </footer>
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
    this.__homageDisposers.push(
      autorun(() => {
        this._dark = !!toJS(store.darkMode);
      }),
    );
    this.__homageDisposers.push(
      autorun(() => {
        this.siteTitle = toJS(store.siteTitle);
        this.siteDescription = toJS(store.siteDescription);
      }),
    );
    this.__homageDisposers.push(
      autorun(() => {
        const item = toJS(store.activeItem);
        const metadata = item && item.metadata ? item.metadata : {};
        // the date a page was written matters for a page inside a section
        // (a post); a top level page shows none
        this.pageCreated =
          item && item.parent && metadata.created ? metadata.created : 0;
        this.pageUpdated = metadata.updated ? metadata.updated : 0;
      }),
    );
  }

  disconnectedCallback() {
    this.__homageDisposers.forEach((dispose) => dispose());
    this.__homageDisposers = [];
    super.disconnectedCallback();
  }

  __pageListEmptyChanged(e) {
    this.hasPageList = !e.detail.value;
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
export { HomageThemeBase };
