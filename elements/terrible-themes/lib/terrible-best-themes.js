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
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu-button.js";
import "@haxtheweb/scroll-button/scroll-button.js";
import { autorun, toJS } from "mobx";
/**
 * `terrible-themes`
 * `themes inspired by creations by btopro from his youth. legitimate, terrible websites.`
 *
 * @microcopy - language worth noting:
 *  - HAXcms - A headless content management system
 *  - HAXCMSTheme - A super class that provides correct baseline wiring to build a new theme
 *
 * @demo demo/index.html
 * @element terrible-themes
 */
const skater = new URL("./assets/SKATER.gif", import.meta.url).href;
class TerribleBestThemes extends HAXCMSRememberRoute(
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
    globalThis.document.body.style.backgroundColor = "#e6fbff";
  }
  /**
   * LitElement style callback
   */
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
        table {
          padding: 25px 10vw;
        }
        site-menu {
          --site-menu-active-color: navy;
          --site-menu-item-active-item-color: white;
          --map-menu-item-a-active-color: navy;
          --map-menu-item-a-active-background-color: white;
        }
        scroll-button {
          position: fixed;
          bottom: 0;
          --simple-icon-height: 100px;
          --simple-icon-width: 100px;
          right: 16px;
          color: navy;
          --scroll-button-color: navy;
          --scroll-button-background-color: white;
          --scroll-button-tooltip-background-color: white;
          --scroll-button-tooltip-color: navy;
        }
      `,
    ];
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tbody>
          <tr valign="top">
            <td style="background-image:url('${skater}')">
              <img src="${skater}" width="68" height="72" border="0" alt="" />
            </td>
            <td align="center">
              <main id="contentcontainer">
                <site-active-title></site-active-title>
                <section id="slot">
                  <slot></slot>
                </section>
              </main>
            </td>
            <td style="background-image:url('${skater}')">
              <img src="${skater}" width="68" height="72" border="0" alt="" />
            </td>
          </tr>
          <tr>
            <td style="background-image:url('${skater}')"></td>
            <td align="center">
              <site-menu-button
                type="prev"
                position="right"
                class="navigation"
              ></site-menu-button>
              <site-menu-button
                type="next"
                position="left"
                class="navigation"
              ></site-menu-button>
              <site-menu></site-menu>
            </td>
            <td style="background-image:url('${skater}')"></td>
          </tr>
        </tbody>
      </table>
      <scroll-button></scroll-button>
    `;
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "terrible-best-themes";
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
customElements.define(TerribleBestThemes.tag, TerribleBestThemes);
export { TerribleBestThemes };
