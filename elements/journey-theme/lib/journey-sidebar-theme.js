/**
 * Copyright 2025 btopro
 * @license Apache-2.0, see License.md for full text.
 */
import { css, html } from "lit";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "./journey-menu.js";
// import "./journey-scroll-top.js";
import "@haxtheweb/scroll-button/scroll-button.js";
import { JourneySidebarThemeStyles } from "./journey-sidebar-theme-styles.js"; // custom styles for this theme

/**
 * `Journey Sidebar theme`
 * `JourneySidebarTheme based on HAXCMS theming ecosystem`
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
 * @element journey-sidebar-theme
 */
class JourneySidebarTheme extends HAXCMSLitElementTheme {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "journey-sidebar-theme";
  }

  // set defaults or tie into the store
  constructor() {
    super();
    this._items = [];
    this.activeId = null;
    autorun(() => {
      this.activeId = toJS(store.activeId);
      this._items = toJS(store.manifest.items);
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
          --journey-theme-bg-light: var(--ddd-theme-default-white);
          --journey-theme-bg-dark: var(--ddd-theme-default-coalyGray);
          --journey-theme-text-light: var(--ddd-theme-default-nittanyNavy);
          --journey-theme-text-dark: var(--ddd-theme-default-white);
          color-scheme: light dark;
        }
        
        body {
          padding: var(--ddd-spacing-0);
          margin: var(--ddd-spacing-0);
          background-color: light-dark(var(--journey-theme-bg-light), var(--journey-theme-bg-dark));
          color: light-dark(var(--journey-theme-text-light), var(--journey-theme-text-dark));
          transition: background-color var(--ddd-duration-rapid, 0.3s) ease, color var(--ddd-duration-rapid, 0.3s) ease;
        }
        
        body.dark-mode {
          background-color: var(--journey-theme-bg-dark);
          color: var(--journey-theme-text-dark);
          color-scheme: only dark;
        }
        
        @media (prefers-color-scheme: dark) {
          body:not(.light-mode) {
            background-color: var(--journey-theme-bg-dark);
            color: var(--journey-theme-text-dark);
            color-scheme: only dark;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          body {
            transition: none;
          }
        }
      `,
    ];
  }

  //styles function
  static get styles() {
    return [super.styles, JourneySidebarThemeStyles];
  }

  render() {
    return html`
      <journey-menu .items="${this._items}" .activeId="${this.activeId}">
      </journey-menu>

      <main>
        <site-active-title></site-active-title>
        <article>
          <!-- this block and names are required for HAX to edit the content of the page. contentcontainer, slot, and wrapping the slot. -->
          <div id="contentcontainer">
            <div id="slot"><slot></slot></div>
          </div>
        </article>
      </main>
      <scroll-button></scroll-button>
    `;
  }
}
globalThis.customElements.define(JourneySidebarTheme.tag, JourneySidebarTheme);
export { JourneySidebarTheme };
