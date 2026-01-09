/**
 * Copyright 2023
 * @license , see License.md for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSRememberRoute } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSRememberRoute.js";
import { HAXCMSThemeParts } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-top-menu.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/layout/site-footer.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu-button.js";
/**
 * `Terrible 90s - Room 407 theme`
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
class TerribleThemes extends HAXCMSRememberRoute(
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
          color: #242a31;
          width: 100%;
          margin: 0;
          display: flex;
          padding: 0;
          background: #f5f7f9;
          min-height: 100vh;
          flex-direction: column;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
          --simple-tooltip-background: #000000;
          --simple-tooltip-opacity: 1;
          --simple-tooltip-text-color: #ffffff;
          --simple-tooltip-delay-in: 0;
          --simple-tooltip-border-radius: 0;
        }

        :host([dark-mode]) {
          background: #111111;
          color: #f5f7f9;
        }

        :host([dark-mode]) table {
          background-color: #111111;
          color: inherit;
        }

        :host([dark-mode]) tr[bgcolor],
        :host([dark-mode]) td[bgcolor] {
          background-color: transparent;
        }

        site-active-title {
          display: block;
          padding: 0;
          flex-wrap: wrap;
          align-items: baseline;
          flex-direction: row;
          -webkit-box-align: baseline;
          -webkit-box-lines: multiple;
          -webkit-box-orient: horizontal;
          -webkit-box-direction: normal;
          flex: auto;
          margin: 0;
        }
        site-active-title h1 {
          margin: 0;
        }
        site-menu-button {
          --site-menu-button-link-decoration: none;
          --site-menu-button-button-hover-color: pink;
          color: #242a31;
          border: 1px solid #e6ecf1;
          margin: 0;
          display: block;
          padding: 0;
          position: relative;
          align-self: stretch;
          box-shadow: 0 3px 8px 0 rgba(116, 129, 141, 0.1);
          transition: border 0.3s ease;
          align-items: center;
          justify-self: stretch;
          text-overflow: ellipsis;
          border-radius: 3px;
          flex-direction: row;
          text-decoration: none;
          background-color: #ffffff;
          -webkit-box-align: center;
          page-break-inside: avoid;
          -ms-grid-row-align: stretch;
          -webkit-box-orient: horizontal;
          -ms-grid-column-align: stretch;
          -webkit-box-direction: normal;
        }
        :host([dark-mode]) site-menu-button {
          color: #f5f7f9;
          border-color: #333333;
          background-color: #1a1a1a;
          box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.6);
        }
        site-menu-button div.wrapper {
          flex: 1;
          margin: 0;
          display: block;
          padding: 16px;
          text-overflow: ellipsis;
          text-decoration: none;
          font-size: 16px;
          font-weight: 500;
          line-height: 1.5;
          text-transform: none;
        }
        site-menu-button div .top {
          font-size: 12px;
          font-weight: 400;
          line-height: 1.625;
          color: #444444;
        }
        simple-datetime {
          color: #444444;
        }
        :host([dark-mode]) simple-datetime {
          color: #cccccc;
        }
        site-menu-button div .bottom {
          font-size: 16px;
          font-weight: 500;
          line-height: 1.5;
          max-height: 50px;
          overflow: hidden;
        }
        site-menu-button[type="next"] div {
          text-align: left;
        }
        site-menu-button[type="prev"] div {
          text-align: right;
        }
        /*ASP Message passed between pages*/
        p.message {
          color: #ff0000;
          font-size: 12px;
          font-weight: bold;
          font-family: Arial, Helvetica, sans-serif;
        }
        /*ASP login status passed between pages*/
        p.loginState {
          font-size: 11px;
          font-weight: bold;
          font-family: Arial, Helvetica, sans-serif;
        }

        /*    */
        pre.blog_post {
          font-size: 10px;
          font-weight: bold;
          font-family: Arial, Helvetica, sans-serif;
          width: 380;
        }

        /*Generic table*/
        table {
          font-size: 12px;
          font-family: Arial, Helvetica, sans-serif;
        }
        /*Description Text for apt shot*/
        table.photofooter {
          font-size: 12px;
          font-weight: bold;
        }
        /*Top Text for Log in*/
        table.topText {
          font-size: 12px;
          font-weight: bold;
        }
        /*Heading for news stand*/
        table.happeningHeading {
          font-size: 10px;
          font-weight: bold;
        }
        /*Heading for news stand*/
        table.mediaTable {
          font-size: 12px;
          font-weight: bold;
        }
        /*Generic link*/
        a {
          font-weight: bold;
          text-decoration: none;
          font-family: Arial, Helvetica, sans-serif;
        }
        a:hover {
          color: #4444ff;
          text-decoration: underline;
        }
        :host([dark-mode]) a {
          color: #9bbcff;
        }
        :host([dark-mode]) a:hover {
          color: #ff8ad4;
        }
        /*Log out link at top right*/
        a.loginState:visited {
          color: #0000ff;
        }
        /*Menu*/
        a.menu {
          font-size: 14px;
          color: #000000;
          text-decoration: underline;
        }
        a.menu:hover {
          color: #0000ff;
          text-decoration: none;
        }
        a.menu:active {
          color: #ff0000;
        }
        site-top-menu {
          font-size: 18px;
          --site-top-menu-bg: pink;
          --site-top-menu-link-color: #ffffff;
          --site-top-menu-indicator-color: #ffffff;
          --site-top-menu-link-active-color: var(
            --haxcms-basic-theme-accent-color
          );
        }
        :host([dark-mode]) site-top-menu {
          --site-top-menu-bg: #222233;
          --site-top-menu-link-color: #ffffff;
          --site-top-menu-indicator-color: #ff8ad4;
        }
        site-top-menu::part(button) {
          font-size: 18px;
          background-color: pink;
          color: #000000;
        }
        :host([dark-mode]) site-top-menu::part(button) {
          background-color: #222233;
          color: #ffffff;
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
        role="presentation"
        border="4"
        cellspacing="0"
        cellpadding="0"
        align="center"
        width="750"
        bgcolor="#FFEFF4"
      >
        <tbody>
          <tr bgcolor="#FFFFFF">
            <td>
              <!-- Header -->
              <table
                border="0"
                cellspacing="0"
                cellpadding="3"
                class="topText"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td align="left">
                      "If you're flammable and have legs, you are never blocking
                      a fire exit." - Mitch Hedberg
                    </td>
                    <td align="right" width="100">
                      <p class="loginState">
                        <a href="" class="loginState">Log in</a>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <a href=""
                ><img
                  src="${new URL("lib/assets/header.jpg", import.meta.url)
                    .href}/../header-room407.jpg"
                  width="100%"
                  height="200"
                  border="0"
                  alt="Room 407"
                  align="absbottom"
                  vspace="0"
                  hspace="0"
              /></a>
            </td>
          </tr>
          <tr>
            <!-- Menu -->
            <td>
              <table
                width="100%"
                height="26"
                cellspacing="0"
                cellpadding="0"
                border="0"
              >
                <tbody>
                  <tr>
                    <td valign="middle" align="center">
                      <site-top-menu
                        indicator="arrow"
                        arrow-size="10"
                      ></site-top-menu>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <!-- Main body of text -->
            <td>
              <table border="0" cellspacing="0" cellpadding="5" width="100%">
                <tbody>
                  <tr>
                    <td>
                      <table border="0" cellspacing="0" cellpadding="0">
                        <tbody>
                          <tr valign="top">
                            <td>
                              <table
                                width="100%"
                                cellspacing="0"
                                cellpadding="0"
                                border="0"
                              >
                                <tbody>
                                  <tr>
                                    <td id="contentcontainer">
                                      <site-active-title></site-active-title>
                                      <section id="slot" role="main" aria-label="Page content">
                                        <slot></slot>
                                      </section>
                                      <aside aria-label="Page navigation">
                                        <site-menu-button
                                          hide-label
                                          type="prev"
                                          position="right"
                                          class="navigation"
                                          @label-changed="${this
                                            .__prevPageLabelChanged}"
                                        >
                                          <div slot="suffix" class="wrapper">
                                            <div class="top">Previous</div>
                                            <div class="bottom">
                                              ${this.prevPage}
                                            </div>
                                          </div>
                                        </site-menu-button>
                                        <site-menu-button
                                          hide-label
                                          type="next"
                                          position="left"
                                          class="navigation"
                                          @label-changed="${this
                                            .__nextPageLabelChanged}"
                                        >
                                          <div slot="prefix" class="wrapper">
                                            <div class="top">Next</div>
                                            <div class="bottom">
                                              ${this.nextPage}
                                            </div>
                                          </div>
                                        </site-menu-button>
                                      </aside>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <!-- Footer -->
            <td align="center">
              <site-footer></site-footer>
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
    return "terrible-themes";
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
  __prevPageLabelChanged(e) {
    this.prevPage = e.detail.value;
  }
  __nextPageLabelChanged(e) {
    this.nextPage = e.detail.value;
  }
}
globalThis.customElements.define(TerribleThemes.tag, TerribleThemes);
export { TerribleThemes };
