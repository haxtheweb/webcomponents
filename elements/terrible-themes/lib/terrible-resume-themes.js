/**
 * Copyright 2023
 * @license , see License.md for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@lrnwebcomponents/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSRememberRoute } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSRememberRoute.js";
import { HAXCMSThemeParts } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-top-menu.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-title.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/blocks/site-children-block.js";
import "@lrnwebcomponents/scroll-button/scroll-button.js";
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
class TerribleResumeThemes extends HAXCMSRememberRoute(
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
          color: red;
          text-decoration: none;
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
          color: gray;
          text-decoration: none;
        }
        site-top-menu {
          font-size: 18px;
          --site-top-menu-bg: lightblue;
          --site-top-menu-link-color: #ffffff;
          --site-top-menu-indicator-color: #ffffff;
          --site-top-menu-link-active-color: var(
            --haxcms-basic-theme-accent-color
          );
        }
        site-top-menu::part(button) {
          font-size: 18px;
        }
      `,
    ];
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
      <table
        align="center"
        cellspacing="0"
        cellpadding="0"
        border="3"
        frame="box"
      >
        <tbody>
          <tr>
            <td>
              <table border="0" cellpadding="0" cellspacing="0" width="800">
                <tbody>
                  <tr>
                    <td bgcolor="white">
                      <table
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
                            <td id="contentcontainer">
                              <site-active-title
                                dynamic-methodology="ancestor"
                              ></site-active-title>
                              <section id="slot">
                                <slot></slot>
                              </section>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <aside>
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
customElements.define(TerribleResumeThemes.tag, TerribleResumeThemes);
export { TerribleResumeThemes };
