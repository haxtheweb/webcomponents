/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
/**
 * `haxcms-dev-theme`
 * `A theme intended as the starting point to fork from and build new themes for HAXCMS
 *  which allows you to build things that just work using JSON Outline Schema as it's "backend"
 * and then IF hax is around it'll show up :)`
 *

 * @demo demo/index.html
 */
class HAXCMSDevTheme extends HAXCMSLitElementTheme {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "haxcms-dev-theme";
  }
  constructor() {
    super();
    import("@haxtheweb/simple-icon/simple-icon.js");
    import("@haxtheweb/simple-icon/lib/simple-icons.js");
    import("@haxtheweb/simple-tooltip/simple-tooltip.js");
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js"
    );
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/blocks/site-children-block.js"
    );
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js"
    );
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu.js"
    );
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu-button.js"
    );
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-top-menu.js"
    );
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/query/site-query.js"
    );
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/query/site-query-menu-slice.js"
    );
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/site/site-rss-button.js"
    );
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/site/site-title.js"
    );
  }
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          /* theme color which is dictated by the manifest */
          background-color: var(--haxcms-color, black);
        }
        div.card {
          width: 200px;
          color: black;
          background-color: blue;
          padding: 8px;
          font-size: 10px;
        }
        /**
         * Hide the slotted content during edit mode. This must be here to work.
         */
        :host([edit-mode]) #slot {
          display: none;
        }
        .manifest,
        .activeitem {
          width: 49%;
          min-height: 300px;
          height: 300px;
          overflow: scroll;
          border: 4px solid black;
          margin: 0;
          padding: 0;
          display: inline-block;
          vertical-align: text-top;
        }
        .buttons {
          display: flex;
        }
        site-top-menu {
          --site-top-menu-bg: var(
            --simple-colors-default-theme-blue-grey-7,
            #37474f
          );
          --site-top-menu-link-color: #ffffff;
          --site-top-menu-indicator-color: var(--haxcms-color, #ffffff);
          --site-top-menu-link-active-color: yellow;
          --site-top-menu-indicator-arrow: 8px;
        }
        .spacing button {
          min-width: unset;
          text-transform: unset;
          background-color: var(--haxcms-color, #000000);
          color: #ffffff;
          margin: 0;
          border-radius: 0;
        }
        site-children-block {
          --site-children-block-button-active: {
            background-color: var(
              --simple-colors-default-theme-blue-grey-7,
              #37474f
            );
            color: #ffffff;
          };
        }
      `,
    ];
  }
  // render function
  render() {
    return html`
      <site-top-menu noink indicator="arrow" arrow-size="8">
        <div slot="suffix" class="spacing">
          <a
            rel="noopener noreferrer"
            target="_blank"
            tabindex="-1"
            href="https://github.com/haxtheweb/haxcms-php"
            data-title="Get it. Got it? Good."
          >
            <button noink>Get HAXcms</button>
          </a>
          <site-print-button></site-print-button>
          <site-print-button type="parent"></site-print-button>
          <site-print-button type="ancestor"></site-print-button>
          <site-print-button type="site"></site-print-button>
        </div>
      </site-top-menu>
      <site-children-block
        fixed-id
        parent="item-14e9e811-8d92-41ee-b2f1-8248eacc3138"
      >
      </site-children-block>
      <h1 style="margin:0;">HAXCMS DEVELOPMENT THEME</h1>
      <site-title></site-title>
      <div class="buttons">
        <site-menu-button type="prev"></site-menu-button>
        <site-menu-button type="next"></site-menu-button>
        <button id="unset" on-click="resetActive">Unset activeItem</button>
        <site-rss-button type="atom"></site-rss-button>
        <site-rss-button type="rss"></site-rss-button>
      </div>
      <div class="manifest">
        <h2>title: ${manifest.title}</h2>
        <div>description: ${manifest.description}</div>
        <div>
          icon:
          <simple-icon
            icon="${manifest.metadata.theme.variables.icon}"
          ></simple-icon>
        </div>
        <div>
          image:
          <img
            src="${manifest.metadata.theme.variables.image}"
            height="200px"
            width="200px"
          />
        </div>
      </div>
      <div class="activeitem">
        <site-breadcrumb></site-breadcrumb>
        <h2>ACTIVE ITEM</h2>
        <site-active-title></site-active-title>
        <div id="contentcontainer">
          <div id="slot"><slot></slot></div>
        </div>
      </div>
      ${this.items.map(
        (item) => html`
          <div style="padding:8px;">
            <div class="card">
              <div class="card-content">
                <div>title: ${item.title}</div>
                <div>description: ${item.description}</div>
                <div>slug: ${item.slug}</div>
                <div>location: ${item.location}</div>
                <div>changed: ${item.metadata.updated}</div>
              </div>
              <div class="card-actions">
                <a tabindex="-1" href$="${item.slug}"
                  ><button data-id$="${item.id}" @click="${this._itemTapped}">
                    Set as active
                  </button></a
                >
              </div>
            </div>
          </div>
        `,
      )}
      <site-menu></site-menu>
    `;
  }
  /**
   * Item tapped, let's set it as active by searching the manifest array
   * Your theme is in charge of ensuring that when activeItem needs changed
   * that it ensures that happens
   */
  _itemTapped(e) {
    var local = e.target;
    var activeId = local.getAttribute("data-id");
    if (local.tagName === "BUTTON" && typeof activeId !== typeof undefined) {
      // console log these so you can debug easily as you build out
      console.warn(this.manifest);
    }
  }
}
customElements.define(HAXCMSDevTheme.tag, HAXCMSDevTheme);
export { HAXCMSDevTheme };
