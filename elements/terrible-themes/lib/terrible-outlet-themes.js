/**
 * Copyright 2023
 * @license , see License.md for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSRememberRoute } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSRememberRoute.js";
import { HAXCMSThemeParts } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/layout/site-footer.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/site/site-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@haxtheweb/scroll-button/scroll-button.js";
import { autorun, toJS } from "mobx";
/**
 * `Terrible 90s - blog theme`
 * `themes inspired by creations by btopro from his youth. legitimate, terrible websites.`
 *
 * @microcopy - language worth noting:
 *  - HAXcms - A headless content management system
 *  - HAXCMSTheme - A super class that provides correct baseline wiring to build a new theme
 *
 * @haxcms-theme-category Fun, Website
 * @haxcms-theme-internal false
 * @demo demo/index.html
 * @element terrible-themes
 */
class TerribleOutletThemes extends HAXCMSRememberRoute(
  HAXCMSThemeParts(HAXCMSLitElementTheme),
) {
  /**
   * Add elements to cheat on initial paint here
   */
  constructor() {
    super();

    this.__disposer = [];
    autorun((reaction) => {
      this.activeManifestIndex = toJS(store.activeManifestIndex);
      this.__disposer.push(reaction);
    });
  }

  HAXCMSGlobalStyleSheetContent() {
    return [
      ...super.HAXCMSGlobalStyleSheetContent(),
      css`
        body {
          background-color: #e6fbff;
        }
        body.dark-mode {
          background-color: #020613;
          color: #f5f5f5;
        }
      `,
    ];
  }

  static get styles() {
    // support for using in other classes
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      styles,
      css`
        :host {
          display: block;
        }
        :host([dark-mode]) {
          color: #f5f5f5;
        }
        site-menu {
          color: blue;
          --site-menu-active-color: blue;
          --site-menu-item-active-item-color: white;
          --map-menu-item-a-active-color: black;
          --map-menu-item-a-active-background-color: lightblue;
        }
        :host([dark-mode]) site-menu {
          color: #9bbcff;
          --site-menu-active-color: #9bbcff;
          --site-menu-item-active-item-color: #020613;
          --map-menu-item-a-active-color: #020613;
          --map-menu-item-a-active-background-color: #9bbcff;
        }
        site-title {
          color: black;
          --site-title-link-text-decoration: none;
          --site-title-heading-font-size: 28px;
          --site-title-heading-margin: 0;
          --site-title-heading-padding: 0;
          --site-title-heading-text-align: center;
          --site-title-heading-text-rendering: optimizelegibility;
          --site-title-heading-font-weight: 100;
        }
        :host([dark-mode]) site-title {
          color: #f5f5f5;
        }
        scroll-button {
          position: fixed;
          bottom: 0;
          --simple-icon-height: 50px;
          --simple-icon-width: 50px;
          right: 16px;
          color: blue;
          --scroll-button-color: white;
          --scroll-button-background-color: blue;
          --scroll-button-tooltip-background-color: white;
          --scroll-button-tooltip-color: black;
        }
        :host([dark-mode]) scroll-button {
          color: #9bbcff;
          --scroll-button-color: #020613;
          --scroll-button-background-color: #9bbcff;
          --scroll-button-tooltip-background-color: #020613;
          --scroll-button-tooltip-color: #9bbcff;
        }
      `,
    ];
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
      <table align="left" border="0" width="1024">
        <tbody>
          <tr>
            <td colspan="2">
              <img
                src="${new URL("assets/header.jpg", import.meta.url)
                  .href}/../lips.jpg"
                width="125"
                height="74"
                border="0"
                alt=""
              />
            </td>
            <td valign="middle"><site-title></site-title></td>
          </tr>
          <tr>
            <td colspan="3" height="10"></td>
          </tr>
          <tr>
            <td width="125" valign="top">
              <site-menu></site-menu>
            </td>
            <td width="10"></td>
            <td valign="top">
              <br />
              <!--Hey look stupid this is where the text go-->
              <main id="contentcontainer">
                <site-active-title></site-active-title>
                <section id="slot">
                  <slot></slot>
                </section>
              </main>

              <div align="center">
                <site-footer></site-footer>
                <scroll-button
                  position="right"
                  label="Back to top"
                ></scroll-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    `;
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "terrible-outlet-themes";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
  }
}
globalThis.customElements.define(
  TerribleOutletThemes.tag,
  TerribleOutletThemes,
);
export { TerribleOutletThemes };
