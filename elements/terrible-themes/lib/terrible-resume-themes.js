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
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-top-menu.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/site/site-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/blocks/site-children-block.js";
import { autorun, toJS } from "mobx";
/**
 * @title Terrible Resume
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
class TerribleResumeThemes extends HAXCMSRememberRoute(
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
        a {
          color: blue;
          text-decoration: none;
        }
        a:active {
          color: #2b2b5a;
          text-decoration: none;
        }
        a:visited {
          color: blue;
          text-decoration: none;
        }
        a:hover {
          color: #cc0000;
          text-decoration: none;
        }
        :host([dark-mode]) a {
          color: #9bbcff;
        }
        :host([dark-mode]) a:hover {
          color: #ffcc66;
        }
        a.menu {
          color: black;
          text-decoration: none;
          font-weight: bold;
          font-size: 150%;
        }
        a.menu:visited {
          color: black;
          text-decoration: none;
        }
        a.menu:hover {
          color: #555555;
          text-decoration: none;
        }
        site-top-menu {
          font-size: 18px;
          --site-top-menu-bg: #005a9e;
          --site-top-menu-link-color: #ffffff;
          --site-top-menu-indicator-color: #ffffff;
          --site-top-menu-link-active-color: var(
            --haxcms-basic-theme-accent-color
          );
        }
        :host([dark-mode]) site-top-menu {
          --site-top-menu-bg: #111827;
          --site-top-menu-link-color: #ffffff;
          --site-top-menu-indicator-color: #ffcc66;
        }
        :host([dark-mode]) table[bgcolor],
        :host([dark-mode]) td[bgcolor] {
          background-color: #111827;
        }
        site-top-menu::part(button) {
          font-size: 18px;
        }
        a:focus-visible,
        button:focus-visible {
          outline: 2px solid currentColor;
          outline-offset: 2px;
        }
        table {
          max-width: 100%;
        }
        @media (max-width: 820px) {
          :host table {
            width: 100% !important;
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
      <table
        role="presentation"
        align="center"
        cellspacing="0"
        cellpadding="0"
        border="3"
        frame="box"
      >
        <tbody>
          <tr>
            <td>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="800">
                <tbody>
                  <tr>
                    <td bgcolor="white">
                      <table
                        role="presentation"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        height="104"
                        width="100%"
                      >
                        <tbody>
                          <tr>
                            <td align="center">
                              <site-top-menu indicator="arrow" arrow-size="8">
                                <site-title
                                  slot="prefix"
                                  class="spacing"
                                ></site-title>
                              </site-top-menu>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table
                        role="presentation"
                        border="0"
                        cellpadding="0"
                        align="center"
                        width="800"
                        bgcolor="white"
                      >
                        <tbody>
                          <tr>
                            <td height="8"></td>
                          </tr>
                          <tr>
                            <td width="25"></td>
                            <td>
                              <main id="contentcontainer" role="main" tabindex="-1">
                                <site-active-title
                                  dynamic-methodology="ancestor"
                                ></site-active-title>
                                <section id="slot">
                                  <slot></slot>
                                </section>
                              </main>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <aside aria-label="Sub-pages">
                        <site-children-block
                          dynamic-methodology="ancestor"
                        ></site-children-block>
                      </aside>
                    </td>
                  </tr>
                </tbody>
              </table>
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
    return "terrible-resume-themes";
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
globalThis.customElements.define(
  TerribleResumeThemes.tag,
  TerribleResumeThemes,
);
export { TerribleResumeThemes };
