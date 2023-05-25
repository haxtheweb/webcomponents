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
class TerribleProductionzThemes extends HAXCMSRememberRoute(
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
    document.body.style.backgroundColor = "#000000";
    document.body.style.color = "#D2D2D2";
    document.body.style.backgroundImage = `url(${
      new URL("assets/header.jpg", import.meta.url).href
    }/../productionzbg.jpg)`;
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

        .title-text {
          font-family: "Caveat", cursive;
          color: lime;
          background-position-x: -75px;
          background-repeat: no-repeat;
          background-position-y: center;
        }

        a {
          color: lime;
          text-decoration: none;
        }
        a:active {
          color: white;
          text-decoration: none;
        }
        a:hover {
          color: green;
          text-decoration: none;
        }

        a.sidebar {
          font-size: 14pt;
          text-decoration: none;
        }

        .posted {
          font-size: 8pt;
        }
      `,
    ];
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
      <a name="#top"></a>
      <div align="center">
        <table width="800" border="0" cellpadding="0" cellspacing="0">
          <tbody>
            <tr>
              <td width="800" colspan="5" align="center">
                <img
                  src="${new URL("assets/header.jpg", import.meta.url)
                    .href}/../HEADER.jpg"
                  border="0"
                  align="absbottom"
                />
              </td>
            </tr>
            <tr>
              <td
                width="8"
                background="${new URL("assets/header.jpg", import.meta.url)
                  .href}/../sidefilm.jpg"
                valign="top"
              ></td>
              <td width="128" valign="top">
                <br />
                &nbsp;&nbsp;&nbsp;<a href="index.html" class="sidebar">Home</a
                ><br /><br />
                <hr color="#252F26" />
                <font size="4"
                  >&nbsp;Productionz
                  <hr color="#252F26" />
                  &nbsp;&nbsp;&nbsp;<a href="movies.html" class="sidebar"
                    >Movies</a
                  ><br />
                  &nbsp;&nbsp;&nbsp;<a href="animations.html" class="sidebar"
                    >Animations</a
                  ><br />
                  &nbsp;&nbsp;&nbsp;<a href="artwork.html" class="sidebar"
                    >Artwork</a
                  ><br />
                  &nbsp;&nbsp;&nbsp;<a href="intheworks.html" class="sidebar"
                    >In The Works</a
                  ><br />
                  &nbsp;&nbsp;&nbsp;<a href="upncoming.html" class="sidebar"
                    >Up &amp; Coming</a
                  ><br />
                  &nbsp;&nbsp;&nbsp;<a
                    href="http://www.cafepress.com/acidscorpio/"
                    class="sidebar"
                    target="_blank"
                    >Store</a
                  ><br />
                  <br />
                  <hr color="#252F26" />
                  <font size="4"
                    >&nbsp;Site map
                    <hr color="#252F26" />
                    &nbsp;&nbsp;&nbsp;<a
                      href="http://www.personal.psu.edu/bto108/outlet/index.html"
                      class="sidebar"
                      >Ac|d's Outlet</a
                    ><br />
                    &nbsp;&nbsp;&nbsp;<a
                      href="http://www.personal.psu.edu/bto108/portfolio/index.html"
                      class="sidebar"
                      >Portfolio</a
                    ><br />
                    <br />
                    <hr color="#252F26" />
                    <font size="4"
                      >&nbsp;Sites of Interest
                      <hr color="#252F26" />
                      <div align="center">
                        <a href="http://www.acidscorpio.com/" target="_blank"
                          ><img
                            src="${new URL("assets/header.jpg", import.meta.url)
                              .href}/../acid88.gif"
                            border="0"
                            width="88"
                            height="31"
                            vspace="3" /></a
                        ><br />
                      </div>
                      <br /><br /><br /> </font></font
                ></font>
              </td>
              <td
                width="8"
                background="${new URL("assets/header.jpg", import.meta.url)
                  .href}/../sidefilm.jpg"
                valign="top"
              ></td>

              <td width="20"></td>

              <td width="636" valign="top">
                <!-- *******************************************************
		THIS IS THE PLACE WHERE THE MAIN BODY FOR THE DOCs GOES
		********************************************************-->
                <br /><br />
                <h1
                  class="title-text"
                  style="background-image: url(${new URL(
                    "assets/header.jpg",
                    import.meta.url
                  ).href}/../movies.jpg)"
                >
                  Movies
                </h1>
                <table border="1" cellpadding="0" cellspacing="0" width="500">
                  <!--This is the begining of a block of code for the posting "system"-->
                  <!--<script language="JavaScript">
			 for(x=news.length-1; x>=news.length-10; x--)
			{
				document.write("<tr> <td> <table width=100%> <tr> <td align=left> <p class=posted>Posted: ")
				document.write(news[x].posted)
				document.write("</p> </td> <td> <p class=posted>Title: ")
				document.write(news[x].title)
				document.write("</p> </td> <td align=right> <p class=posted>By: ")
				document.write(news[x].by)
				document.write("</p> </td> </tr> </table> </td> </tr> <tr> <td>")
				document.write(news[x].text)
				document.write("<br><br> </td> </tr>")
			}
			</script> -->
                  <tbody>
                    <tr>
                      <td>
                        <table width="100%">
                          <tbody>
                            <tr>
                              <td align="left">
                                <p class="posted">Posted: 5/04/2004</p>
                              </td>
                              <td>
                                <p class="posted">Title: The 2nd coming</p>
                              </td>
                              <td align="right">
                                <p class="posted">By: Ac|d-$CoRpI()</p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td id="contentcontainer">
                        <section id="slot">
                          <slot></slot>
                        </section>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <!-- *******************************************************
		THIS IS WHERE THE MAIN BODY FOR THE DOCs ENDS
		********************************************************-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        id="divStayTopLeft"
        style="position: absolute; left: 780px; top: 734px;"
      >
        <a href="#top" class="top"><b>Top</b></a>
      </div>
    `;
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "terrible-productionz-themes";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.__link = document.createElement("link");
    this.__link.rel = "stylesheet";
    this.__link.href =
      "https://fonts.googleapis.com/css2?family=Caveat&family=Open+Sans&family=Press+Start+2P&display=swap";
    document.head.appendChild(this.__link);
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    if (this.__link) {
      this.__link.remove();
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
customElements.define(TerribleProductionzThemes.tag, TerribleProductionzThemes);
export { TerribleProductionzThemes };
