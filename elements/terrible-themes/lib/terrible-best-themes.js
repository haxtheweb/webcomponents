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
 * @title Terrible hockey
 * `themes inspired by creations by btopro from his youth. legitimate, terrible websites.`
 *
 * @microcopy - language worth noting:
 *  - HAXcms - A headless content management system
 *  - HAXCMSTheme - A super class that provides correct baseline wiring to build a new theme
 *
 * @haxcms-theme-category Fun, Website
 * @haxcms-theme-internal false
 * @haxcms-theme-terrible true
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
    this.__disposer.push(
      autorun((reaction) => {
        const _mobx_val_0 = toJS(store.activeManifestIndex);
        Promise.resolve().then(() => {
          this.activeManifestIndex = _mobx_val_0;
        });
      }),
    );
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
        @media (prefers-color-scheme: dark) {
          body {
            background-color: #020613;
            color: #f5f5f5;
          }
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
          color-scheme: light dark;
        }
        :host([dark-mode]) {
          color: #f5f5f5;
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
        :host([dark-mode]) site-menu {
          --site-menu-active-color: #9bbcff;
          --site-menu-item-active-item-color: #020613;
          --map-menu-item-a-active-color: #020613;
          --map-menu-item-a-active-background-color: #9bbcff;
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
        :host([dark-mode]) scroll-button {
          color: #9bbcff;
          --scroll-button-color: #9bbcff;
          --scroll-button-background-color: #020613;
          --scroll-button-tooltip-background-color: #020613;
          --scroll-button-tooltip-color: #9bbcff;
        }
        a:focus-visible,
        button:focus-visible {
          outline: 2px solid currentColor;
          outline-offset: 2px;
        }
        table {
          max-width: 100%;
        }
        @media (max-width: 600px) {
          :host table tbody tr td:first-child,
          :host table tbody tr td:last-child {
            display: none;
          }
        }
        @media (prefers-color-scheme: dark) {
          :host {
            color: #f5f5f5;
          }
        }
      `,
    ];
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
      <a class="skip-link" href="#contentcontainer">Skip to content</a>
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tbody>
          <tr valign="top">
            <td style="background-image:url('${skater}')">
              <img src="${skater}" width="68" height="72" border="0" alt="" loading="lazy" decoding="async" />
            </td>
            <td align="center">
              <main id="contentcontainer" tabindex="-1">
                <site-active-title></site-active-title>
                <section id="slot">
                  <slot></slot>
                </section>
              </main>
            </td>
            <td style="background-image:url('${skater}')">
              <img src="${skater}" width="68" height="72" border="0" alt="" loading="lazy" decoding="async" />
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
}
globalThis.customElements.define(TerribleBestThemes.tag, TerribleBestThemes);
export { TerribleBestThemes };
