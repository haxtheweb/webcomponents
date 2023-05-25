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
class TerribleThemes extends HAXCMSRememberRoute(
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
          color: #242A31;
          width: 100%;
          margin: 0;
          display: flex;
          padding: 0;
          background: #F5F7F9;
          min-height: 100vh;
          flex-direction: column;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
          font-size: 18px;
          font-family: "Open Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
          letter-spacing: normal;
          line-height: 28.8px;
          --haxcms-base-styles-body-font-size:18px;
          --hax-base-styles-a-font-size: 18px;
          --hax-base-styles-p-font-size: 18px;
          --hax-base-styles-list-font-size: 18px;
          --haxcms-base-styles-body-font-family: "Open Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
          --haxcms-base-styles-body-line-height: 28.8px;
          --hax-base-styles-list-line-height: 28.8px
          --hax-base-styles-p-line-height: 28.8px;
          --hax-base-styles-p-letter-spacing: normal;
          --haxcms-base-styles-body-letter-spacing : normal;
           --hax-base-styles-p-min-height: auto;
           --hax-base-styles-list-max-width: auto;
           --haxcms-base-styles-p-min-height: auto;
           --hax-base-styles-list-padding-bottom: auto;
           --hax-base-styles-h1-font-size: inherit;
           --hax-base-styles-h2-font-size: inherit;
           --hax-base-styles-h3-font-size: inherit;
           --hax-base-styles-h4-font-size: inherit;
           --hax-base-styles-h5-font-size: inherit;
           --hax-base-styles-h6-font-size: inherit;
           --simple-tooltip-background: #000000;
           --simple-tooltip-opacity: 1;
           --simple-tooltip-text-color: #ffffff;
           --simple-tooltip-delay-in: 0;
           --simple-tooltip-border-radius: 0;
         }
        /*ASP Message passed between pages*/
        p.message{
          color : #FF0000;
          font-size : 12px;
          font-weight : bold;
          font-family : Arial, Helvetica, sans-serif;
        }
        /*ASP login status passed between pages*/
        p.loginState{
          font-size : 11px;
          font-weight : bold;
          font-family : Arial, Helvetica, sans-serif;
        }

        /*    */
        pre.blog_post{
          font-size : 10px;
          font-weight : bold;
          font-family : Arial, Helvetica, sans-serif;
          width : 380;
        }

        /*Generic table*/
        table
        {
          font-size : 12px;
          font-family : Arial, Helvetica, sans-serif;
        }
        /*Description Text for apt shot*/
        table.photofooter{  
          font-size: 12px;
          font-weight : bold;
        }
        /*Top Text for Log in*/
        table.topText{
          font-size : 12px;
          font-weight : bold;
        }
        /*Heading for news stand*/
        table.happeningHeading{  
          font-size : 10px;
          font-weight : bold;
        }
        /*Heading for news stand*/
        table.mediaTable{  
          font-size : 12px;
          font-weight : bold;
        }
        /*Generic link*/
        a{
          font-weight : bold;
          text-decoration : none;
          font-family : Arial, Helvetica, sans-serif;
        }
        a:hover{
          color: #4444FF;
          text-decoration : underline;
        }
        /*Log out link at top right*/
        a.loginState:visited{
          color: #0000FF;
        }
        /*Menu*/
        a.menu{
          font-size : 14px;
          color: #000000;
          text-decoration : underline;
        }
        a.menu:hover{ 
          color: #0000FF;
          text-decoration : none;
        }
        a.menu:active { 
          color:#FF0000;
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
                  width="750"
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
                      &nbsp;&nbsp;&nbsp;
                      <a href="" class="menu">Home</a>&nbsp;&nbsp;&nbsp;
                      <a href="" class="menu">Multiple Media</a
                      >&nbsp;&nbsp;&nbsp;
                      <a href="" class="menu">Photographicals</a
                      >&nbsp;&nbsp;&nbsp;
                      <a href="" class="menu">Artwork</a>&nbsp;&nbsp;&nbsp;
                      <a href="" class="menu">Characters</a>&nbsp;&nbsp;&nbsp;
                      <a href="" class="menu">Links</a>&nbsp;&nbsp;&nbsp;
                      <a href="" class="menu">Forums</a>&nbsp;&nbsp;&nbsp;
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
                                      <h3>4-Oh-Shots</h3>

                                      <section id="slot">
                                        <slot></slot>
                                      </section>
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
              © Room 407 Coalition 2004-2005<br />
              Send comments, suggestions, and bugs to
              <a
                href="https://web.archive.org/web/20060205132700/mailto:admin@room407.com"
                >Admin@room407.com</a
              >
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
customElements.define(TerribleThemes.tag, TerribleThemes);
export { TerribleThemes };
