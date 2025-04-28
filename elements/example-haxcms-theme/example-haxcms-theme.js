/**
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
          padding: var(--ddd-spacing-10) var(--ddd-spacing-20);
          max-width: 960px;
          min-width: 400px;
          margin: var(--ddd-spacing-0) auto;
          border: var(--ddd-border-lg);
          border-width: var(--ddd-spacing-5);
          border-radius: var(--ddd-radius-lg);
          background-color: light-dark(var(--my-theme-low-tone), var(--my-theme-high-tone));
          color: light-dark(var(--my-theme-high-tone), var(--my-theme-low-tone));
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
        ul li a {
          display: block;
        }

        button {
          height: var(--ddd-spacing-8);
          width: var(--ddd-spacing-8);
          margin: var(--ddd-spacing-0);
          padding: 0;
          font-size: var(--ddd-font-size-sm);
          cursor: pointer;
        }

        .active button {
          background-color: light-dark(var(--my-theme-low-tone), var(--my-theme-high-tone));
          color: light-dark(var(--my-theme-high-tone), var(--my-theme-low-tone));
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
    <div class="wrapper">
    <header>
      <ul>
        <li>
          <site-menu-button
            type="prev"
            position="top"
          ></site-menu-button>
        </li>
    ${this._items.map((item, index) => {
      return html`
        <li class="${item.id === this.activeId ? "active" : ""}">
          <a href="${item.slug}"><button title="${item.title}">${(index+1)}</button></a>
        </li>
      `;
    }
    )}
        <li>
          <site-menu-button
            type="next"
            position="top"
          ></site-menu-button>
        </li>
      </ul>
    </header>
    <main>
      <site-active-title></site-active-title>
      <article>
        <!-- this block and names are required for HAX to edit the content of the page. contentcontainer, slot, and wrapping the slot. -->
        <div id="contentcontainer"><div id="slot"><slot></slot></div></div>
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