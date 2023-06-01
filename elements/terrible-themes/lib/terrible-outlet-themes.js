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
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/layout/site-footer.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-title.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
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
class TerribleOutletThemes extends HAXCMSRememberRoute(
  HAXCMSThemeParts(HAXCMSLitElementTheme)
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
    document.body.style.backgroundColor = "#e6fbff";
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
      ...styles,
      css`
        :host {
          display: block;
        }
        site-menu {
          color: blue;
          --site-menu-active-color: blue; 
           --site-menu-item-active-item-color: white;
           --map-menu-item-a-active-color: black;
           --map-menu-item-a-active-background-color: lightblue;
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
              <scroll-button position="right" label="Back to top"></scroll-button>
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
customElements.define(TerribleOutletThemes.tag, TerribleOutletThemes);
export { TerribleOutletThemes };
