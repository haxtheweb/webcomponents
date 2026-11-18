/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { HomageThemeBase } from "@haxtheweb/papermod-theme/lib/HomageThemeBase.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu-content.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-top-menu.js";

// the sidebar stacks over the page at and below this width
const STACK_QUERY = "(max-width: 900px)";

/**
 * The sidebar layout: a fixed column with the site name, its description,
 * the site menu and the tools, beside one column for the page.
 *
 * withToc adds the headings of the active page as a right column. masthead
 * adds a top bar with the site name and the top level pages, leaving the
 * description and the menu in the sidebar. On small screens the sidebar
 * stacks over the page and the menu folds behind a button.
 * Not a theme by itself and not registered as an element.
 */
class HomageSidebarTheme extends HomageThemeBase {
  constructor() {
    super();
    this.withToc = false;
    this.masthead = false;
    this.menuOpen = true;
    this._stacked = false;
    this._folded = false;
  }

  static get properties() {
    return {
      ...super.properties,
      withToc: { type: Boolean, reflect: true, attribute: "with-toc" },
      masthead: { type: Boolean, reflect: true },
      menuOpen: { type: Boolean, reflect: true, attribute: "menu-open" },
      _stacked: { type: Boolean, state: true },
      _folded: { type: Boolean, state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --homage-sidebar-width: 288px;
          --homage-sidebar-bg: var(--homage-bg);
          --homage-sidebar-text: var(--homage-text);
          --homage-sidebar-accent: var(--homage-accent);
          --homage-column-width: 720px;
          --homage-toc-width: 240px;
          --homage-masthead-height: 0px;
          --homage-header-bg: var(--homage-bg);
          --homage-header-text: var(--homage-text);
        }
        :host([masthead]) {
          --homage-masthead-height: 64px;
        }
        .masthead {
          position: sticky;
          top: var(--homage-top);
          z-index: 2;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-4);
          min-height: var(--homage-masthead-height);
          padding: 0 var(--homage-gutter);
          border-bottom: var(--ddd-border-xs);
          border-bottom-color: var(--homage-rule);
          color: var(--homage-header-text);
          background-color: var(--homage-header-bg);
        }
        .masthead .topnav {
          flex: 1 1 auto;
          min-width: 0;
        }
        site-top-menu {
          font-family: var(--homage-font-heading);
          --site-top-menu-bg: transparent;
          --site-top-menu-link-color: var(--homage-header-text);
          --site-top-menu-link-color-hover: var(--homage-header-text);
          --site-top-menu-link-active-color: var(--homage-header-text);
          --site-top-menu-link-bg-color: transparent;
        }
        .shell {
          display: flex;
          align-items: flex-start;
        }
        .sidebar {
          position: sticky;
          top: calc(var(--homage-top) + var(--homage-masthead-height));
          flex: 0 0 var(--homage-sidebar-width);
          width: var(--homage-sidebar-width);
          height: calc(
            100vh - var(--homage-top) - var(--homage-masthead-height)
          );
          overflow-y: auto;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-4);
          padding: var(--ddd-spacing-8) var(--ddd-spacing-6);
          color: var(--homage-sidebar-text);
          background-color: var(--homage-sidebar-bg);
        }
        .identity {
          display: flex;
          align-items: flex-start;
          gap: var(--ddd-spacing-2);
        }
        .identity .names {
          flex: 1 1 auto;
          min-width: 0;
        }
        .description {
          margin: var(--ddd-spacing-2) 0 0;
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
        }
        .menu-toggle {
          display: none;
        }
        .sidebar .tools {
          margin-top: auto;
        }
        site-menu {
          height: auto;
          font-family: var(--homage-font-heading);
          --site-menu-background-color: transparent;
          --site-menu-container-background-color: transparent;
          --site-menu-color: var(--homage-sidebar-text);
          --site-menu-font-size: var(--ddd-font-size-4xs);
          --map-menu-container-padding: 0;
          --map-menu-parent-background-color: transparent;
          --map-menu-item-a-color: var(--homage-sidebar-text);
          --map-menu-item-a-active-color: var(--homage-sidebar-accent);
          --map-menu-item-a-active-background-color: transparent;
          --map-menu-item-active-item-color: var(--homage-sidebar-accent);
          --map-menu-item-icon-active-color: var(--homage-sidebar-accent);
          --map-menu-item-button-active-font-weight: var(
            --ddd-font-weight-bold
          );
          --map-menu-font-weight: var(--ddd-font-weight-regular);
        }
        main {
          flex: 1 1 auto;
          min-width: 0;
          box-sizing: border-box;
          max-width: calc(
            var(--homage-column-width) + var(--homage-gutter) * 2
          );
          padding: var(--ddd-spacing-8) var(--homage-gutter);
        }
        .page-top {
          display: flex;
          justify-content: flex-end;
        }
        .toc {
          position: sticky;
          top: calc(var(--homage-top) + var(--homage-masthead-height));
          flex: 0 0 var(--homage-toc-width);
          width: var(--homage-toc-width);
          max-height: calc(
            100vh - var(--homage-top) - var(--homage-masthead-height)
          );
          overflow-y: auto;
          box-sizing: border-box;
          margin-left: auto;
          padding: var(--ddd-spacing-8) var(--ddd-spacing-4);
        }
        site-menu-content {
          font-family: var(--homage-font-heading);
          --page-contents-menu-link: var(--homage-text);
          --page-contents-menu-link-color-focus: var(--homage-accent);
          --page-contents-menu-link-font-size: var(--ddd-font-size-4xs);
          --page-contents-menu-link-font-size-active: var(--ddd-font-size-4xs);
          --page-contents-menu-link-font-size-focus: var(--ddd-font-size-4xs);
        }
        @media (max-width: 1200px) {
          .toc {
            display: none;
          }
        }
        @media (max-width: 900px) {
          :host {
            --homage-gutter: var(--ddd-spacing-4);
          }
          .shell {
            display: block;
          }
          .sidebar {
            position: static;
            width: auto;
            height: auto;
            padding: var(--ddd-spacing-4);
          }
          .menu-toggle {
            display: inline-flex;
          }
          :host(:not([menu-open])) .sidenav {
            display: none;
          }
          .sidebar .tools {
            margin-top: 0;
          }
          main {
            max-width: none;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <a class="skip-link" href="#contentcontainer">${this.t.skipToContent}</a>
      <div id="haxcms-theme-top"></div>
      ${
        this.masthead
          ? html`<header class="masthead" part="header">
              <site-title
                ?disabled="${this.editMode}"
                part="site-title"
              ></site-title>
              <nav class="topnav" aria-label="${this.t.siteNavigation}">
                <site-top-menu indicator="none"></site-top-menu>
              </nav>
              ${this.renderTools()}
            </header>`
          : ``
      }
      <div class="shell">
        <aside class="sidebar" part="sidebar">
          <div class="identity">
            <div class="names">
              ${
                this.masthead
                  ? ``
                  : html`<site-title
                      ?disabled="${this.editMode}"
                      part="site-title"
                    ></site-title>`
              }
              ${
                this.siteDescription
                  ? html`<p class="description">${this.siteDescription}</p>`
                  : ``
              }
            </div>
            <simple-icon-button-lite
              class="tool menu-toggle"
              icon="menu"
              title="${this.t.toggleSiteMenu}"
              aria-expanded="${this.menuOpen ? "true" : "false"}"
              aria-controls="sidenav"
              @click="${this.toggleMenu}"
            ></simple-icon-button-lite>
          </div>
          <nav
            class="sidenav"
            id="sidenav"
            aria-label="${
              this.masthead ? this.t.pagesInThisSection : this.t.siteNavigation
            }"
          >
            <site-menu part="site-menu"></site-menu>
          </nav>
          ${this.masthead ? `` : this.renderTools()}
        </aside>
        <main>
          ${
            this.withToc && this._folded
              ? html`<div class="page-top">
                  <site-menu-content
                    mobile
                    part="page-contents"
                  ></site-menu-content>
                </div>`
              : ``
          }
          ${this.renderPageHead()} ${this.renderContent()}
          ${this.renderPageFoot()} ${this.renderFooter()}
        </main>
        ${
          this.withToc && !this._folded
            ? html`<aside
                class="toc"
                part="toc"
                aria-label="${this.t.onThisPage}"
              >
                <site-menu-content part="page-contents"></site-menu-content>
              </aside>`
            : ``
        }
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.__stackMq = globalThis.matchMedia(STACK_QUERY);
    this.__stackHandler = (e) => {
      this._stacked = e.matches;
      // stacked over the page, the menu starts folded
      this.menuOpen = !e.matches;
    };
    this.__stackMq.addEventListener("change", this.__stackHandler);
    this.__stackHandler(this.__stackMq);
    this.__foldMq = globalThis.matchMedia("(max-width: 1200px)");
    this.__foldHandler = (e) => {
      this._folded = e.matches;
    };
    this.__foldMq.addEventListener("change", this.__foldHandler);
    this.__foldHandler(this.__foldMq);
  }

  disconnectedCallback() {
    if (this.__stackMq) {
      this.__stackMq.removeEventListener("change", this.__stackHandler);
    }
    if (this.__foldMq) {
      this.__foldMq.removeEventListener("change", this.__foldHandler);
    }
    super.disconnectedCallback();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
export { HomageSidebarTheme };
