/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { HomageThemeBase } from "@haxtheweb/papermod-theme/lib/HomageThemeBase.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-top-menu.js";

/**
 * The single column layout: a header with the site name, the top level
 * pages and the tools, then one centered column for the page.
 *
 * headerLayout "split" puts the site name and the navigation on one line;
 * "stack" puts the navigation under the site name. --homage-column-width
 * sets the column. Not a theme by itself and not registered as an element.
 */
class HomageColumnTheme extends HomageThemeBase {
  constructor() {
    super();
    this.headerLayout = "split";
    this.stickyHeader = false;
  }

  static get properties() {
    return {
      ...super.properties,
      headerLayout: { type: String, reflect: true, attribute: "header-layout" },
      stickyHeader: {
        type: Boolean,
        reflect: true,
        attribute: "sticky-header",
      },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --homage-column-width: 720px;
          --homage-header-bg: var(--homage-bg);
          --homage-header-text: var(--homage-text);
        }
        .inner {
          box-sizing: border-box;
          max-width: calc(
            var(--homage-column-width) + var(--homage-gutter) * 2
          );
          margin: 0 auto;
          padding: 0 var(--homage-gutter);
        }
        .header {
          color: var(--homage-header-text);
          background-color: var(--homage-header-bg);
        }
        :host([sticky-header]) .header {
          position: sticky;
          top: var(--homage-top);
          z-index: 2;
        }
        .bar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-2) var(--ddd-spacing-4);
          min-height: 64px;
          padding-top: var(--ddd-spacing-2);
          padding-bottom: var(--ddd-spacing-2);
        }
        .bar site-title {
          flex: 0 1 auto;
          min-width: 0;
        }
        .topnav {
          /* takes the room left by the site name and the tools, and wraps
             inside it, so a long menu never pushes the tools to a new row */
          flex: 1 1 0;
          min-width: 0;
          display: flex;
          justify-content: flex-end;
        }
        :host([header-layout="stack"]) .bar site-title {
          flex: 1 1 auto;
        }
        :host([header-layout="stack"]) .bar {
          padding-bottom: 0;
        }
        :host([header-layout="stack"]) .topnav {
          order: 3;
          flex: 1 1 100%;
          justify-content: flex-start;
        }
        site-top-menu {
          font-family: var(--homage-font-heading);
          --site-top-menu-bg: transparent;
          --site-top-menu-link-color: var(--homage-header-text);
          --site-top-menu-link-color-hover: var(--homage-header-text);
          --site-top-menu-link-active-color: var(--homage-header-text);
          --site-top-menu-link-bg-color: transparent;
        }
        main {
          padding-top: var(--ddd-spacing-8);
          padding-bottom: var(--ddd-spacing-8);
        }
        @media (max-width: 640px) {
          :host {
            --homage-gutter: var(--ddd-spacing-4);
          }
          /* the folded navigation takes its own row under the site name */
          .bar site-title {
            flex: 1 1 auto;
          }
          .topnav {
            order: 3;
            flex: 1 1 100%;
            justify-content: flex-start;
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
        <div class="inner bar">
          <site-title
            ?disabled="${this.editMode}"
            part="site-title"
          ></site-title>
          <nav class="topnav" aria-label="${this.t.siteNavigation}">
            <site-top-menu indicator="none" part="site-menu"></site-top-menu>
          </nav>
          ${this.renderTools()}
        </div>
      </header>
      <main class="inner">
        ${this.renderPageHead()} ${this.renderContent()}
        ${this.renderPageFoot()}
      </main>
      <div class="inner">${this.renderFooter()}</div>
    `;
  }
}
export { HomageColumnTheme };
