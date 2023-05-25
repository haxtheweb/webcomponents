/**
 * Copyright 2023
 * @license , see License.md for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@lrnwebcomponents/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSRememberRoute } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSRememberRoute.js";
import { HAXCMSThemeParts } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
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
            <td>
              <img
                src="${skater}"
                width="68"
                height="72"
                border="0"
                alt=""
              /><br /><br /><br />
              <img
                src="${skater}"
                width="68"
                height="72"
                border="0"
                alt=""
              /><br /><br /><br />
              <img
                src="${skater}"
                width="68"
                height="72"
                border="0"
                alt=""
              /><br /><br /><br />
              <img
                src="${skater}"
                width="68"
                height="72"
                border="0"
                alt=""
              /><br /><br /><br />
              <img
                src="${skater}"
                width="68"
                height="72"
                border="0"
                alt=""
              /><br /><br /><br />
            </td>
            <td align="center">
              <main id="contentcontainer">
                <h2><blink>UPDATED 07/27/2006 - TRADING CARDS ADDED</blink></h2>
                <section id="slot">
                  <slot></slot>
                </section>
              </main>
            </td>
            <td>
              <img
                src="${skater}"
                width="68"
                height="72"
                border="0"
                alt=""
              /><br /><br /><br />
              <img
                src="${skater}"
                width="68"
                height="72"
                border="0"
                alt=""
              /><br /><br /><br />
              <img
                src="${skater}"
                width="68"
                height="72"
                border="0"
                alt=""
              /><br /><br /><br />
              <img
                src="${skater}"
                width="68"
                height="72"
                border="0"
                alt=""
              /><br /><br /><br />
              <img
                src="${skater}"
                width="68"
                height="72"
                border="0"
                alt=""
              /><br /><br /><br />
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
  /**
   * Previous page to hook into when prev is hit
   */
  prevPage(e) {
    super.prevPage(e);
  }
  /**
   * Next page to hook into when next is hit
   */
  nextPage(e) {
    super.nextPage(e);
  }
}
customElements.define(TerribleBestThemes.tag, TerribleBestThemes);
export { TerribleBestThemes };
