/**
 * Copyright 2025 The Pennsylvania State University
 * Copyright 2025 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu-button.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/site/site-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";

/**
 * `ExampleHaxcmsTheme`
 * `ExampleHaxcmsTheme based on HAXCMS theming ecosystem`
 * `This theme is an example of extending an existing theme component`
 *
 * @microcopy - language worth noting:
 *  - HAXcms - A headless content management system
 *  - HAXCMSLitElementTheme - A class that provides correct baseline wiring to build a new theme that HAX can use
 *
 * @documentation - see HAX docs to learn more about theming
 *  - Custom theme development - https://haxtheweb.org/documentation/developers/haxsite/custom-theme-development
 *  - Theme Blocks - https://haxtheweb.org/documentation/developers/theme-blocks
 *  - DDD - https://haxtheweb.org/documentation/ddd
 *  - Data Store - https://haxtheweb.org/documentation/developers/haxsite/data-store
 * @element example-haxcms-theme
 */
class ExampleHaxcmsTheme extends HAXCMSLitElementTheme {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "example-haxcms-theme";
  }

  // set defaults or tie into the store
  constructor() {
    super();
    this.t = {
      ...(this.t || {}),
      skipToContent: "Skip to content",
      pages: "Pages",
      pageNumber: "Page {number}: {title}",
    };
    this._items = [];
    this.activeId = null;
    autorun(() => {
      const _mobx_val_0 = toJS(store.activeId);
      const _mobx_val_1 = toJS(
        store.manifest && store.manifest.items ? store.manifest.items : [],
      );
      Promise.resolve().then(() => {
        this.activeId = _mobx_val_0;
        this._items = _mobx_val_1;
      });
    });
  }

  // properties to respond to the activeID and list of items
  static get properties() {
    return {
      ...super.properties,
      activeId: { type: String },
      _items: { type: Array },
    };
  }

  // allows for global styles to be set against the entire document
  // you can also use this to cascade styles down to the theme
  // but the more common reason is to influence the body or other things
  // put into the global index.html context by the system itself
  HAXCMSGlobalStyleSheetContent() {
    return [
      ...super.HAXCMSGlobalStyleSheetContent(),
      css`
        :root {
          --my-theme-low-tone: var(--ddd-theme-default-slateMaxLight);
          --my-theme-high-tone: var(--ddd-theme-default-coalyGray);
        }
        body {
          padding: var(--ddd-spacing-0);
          margin: var(--ddd-spacing-0);
          background-color: var(--my-theme-low-tone);
        }
        body.dark-mode {
          background-color: var(--my-theme-high-tone);
        }
      `,
    ];
  }

  //styles function
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          /* side padding and minimum width give way on narrow screens so
             the page reflows at 320px (WCAG 1.4.10) */
          padding: var(--ddd-spacing-10)
            clamp(var(--ddd-spacing-4), 5vw, var(--ddd-spacing-20));
          max-width: 960px;
          min-width: min(400px, 100%);
          box-sizing: border-box;
          margin: var(--ddd-spacing-0) auto;
          border: var(--ddd-border-lg);
          border-width: var(--ddd-spacing-5);
          border-radius: var(--ddd-radius-lg);
          background-color: light-dark(
            var(--my-theme-low-tone),
            var(--my-theme-high-tone)
          );
          color: light-dark(
            var(--my-theme-high-tone),
            var(--my-theme-low-tone)
          );
        }
        .wrapper {
          border-radius: var(--ddd-radius-lg);
        }

        site-title {
          font-size: var(--ddd-font-size-l);
        }

        header {
          display: flex;
        }
        ul {
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
        }
        ul li {
          display: inline-block;
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
          list-style-type: none;
          vertical-align: top;
        }
        /* page numbers are links (they go to a page), drawn as the
           buttons they used to be */
        ul li a.page-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          border: 2px outset ButtonBorder;
          background-color: ButtonFace;
          color: ButtonText;
          text-decoration: none;
        }
        a.page-link,
        button {
          height: var(--ddd-spacing-8);
          width: var(--ddd-spacing-8);
          margin: var(--ddd-spacing-0);
          padding: 0;
          font-size: var(--ddd-font-size-3xs);
          cursor: pointer;
        }

        .active a.page-link,
        .active button {
          background-color: light-dark(
            var(--my-theme-low-tone),
            var(--my-theme-high-tone)
          );
          color: light-dark(
            var(--my-theme-high-tone),
            var(--my-theme-low-tone)
          );
          font-weight: bold;
        }

        site-menu-button {
          display: inline-block;
          vertical-align: top;
        }
      `,
    ];
  }

  render() {
    return html`
      <a class="skip-link" href="#contentcontainer">${this.t.skipToContent}</a>
      <div class="wrapper">
        <header>
          <nav aria-label="${this.t.pages}">
            <ul>
              <li>
                <site-menu-button type="prev" position="top"></site-menu-button>
              </li>
              ${this._items.map((item, index) => {
                return html`
                  <li class="${item.id === this.activeId ? "active" : ""}">
                    <a
                      class="page-link"
                      href="${item.slug}"
                      title="${item.title}"
                      aria-label="${this.t.pageNumber
                        .replace("{number}", () => index + 1)
                        .replace("{title}", () => item.title)}"
                      aria-current="${item.id === this.activeId ? "page" : "false"}"
                      >${index + 1}</a
                    >
                  </li>
                `;
              })}
              <li>
                <site-menu-button type="next" position="top"></site-menu-button>
              </li>
            </ul>
          </nav>
        </header>
        <main>
          <site-active-title></site-active-title>
          <article>
            <!-- this block and names are required for HAX to edit the content of the page. contentcontainer, slot, and wrapping the slot. -->
            <div id="contentcontainer" tabindex="-1">
              <div id="slot"><slot></slot></div>
            </div>
          </article>
        </main>
        <footer>
          <slot name="footer"></slot>
        </footer>
      </div>
    `;
  }
}

globalThis.customElements.define(ExampleHaxcmsTheme.tag, ExampleHaxcmsTheme);
