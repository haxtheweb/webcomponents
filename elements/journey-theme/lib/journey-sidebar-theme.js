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

/**
 * `JourneySidebarTheme`
 * `JourneySidebarTheme based on HAXCMS theming ecosystem`
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
          /* padding: var(--ddd-spacing-0) var(--ddd-spacing-10); */
          margin: 0;
          padding: 0;
          min-width: 400px;
          background-color: light-dark(
            var(--my-theme-low-tone),
            var(--my-theme-high-tone)
          );
          color: light-dark(
            var(--my-theme-high-tone),
            var(--my-theme-low-tone)
          );
        }

        site-title {
          font-size: var(--ddd-font-size-l);
        }

        header {
          display: flex;
        }
        nav {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
          top: 0;
          left: 0;
          bottom: 0;
          width: 300px;
          position: fixed;
          background-color: var(--ddd-primary-3);
          padding: var(--ddd-spacing-4);
        }
        ul {
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-2);
          flex-direction: column;
          display: flex;
        }
        ul li {
          display: block;
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
          list-style-type: none;
        }
        ul li a {
          display: block;
          color: white;
          text-decoration: none;
          font-size: var(--ddd-font-size-m);
          padding: var(--ddd-spacing-0);
          cursor: pointer;
          line-height: normal;
          margin: 20px 0;
          text-overflow: ellipsis;
          overflow: hidden;
          text-align: start;
        }

        ul li a:hover,
        ul li a:focus {
          text-decoration: underline;
          outline-color: var(--ddd-primary-21);
        }

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
        main {
          margin-left: 332px;
        }
        scroll-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }
      `,
    ];
  }

  render() {
    return html`
      <journey-menu .items="${this._items}" .activeID="${this.activeId}">
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
