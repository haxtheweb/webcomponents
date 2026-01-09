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
import "@haxtheweb/scroll-button/scroll-button.js";
import { autorun, toJS } from "mobx";
/**
 * `Terrible 90s - productionz theme`
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
class TerribleProductionzThemes extends HAXCMSRememberRoute(
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
    autorun((reaction) => {
      this.activeItem = toJS(store.activeItem);
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      const manifest = toJS(store.manifest);
      if (
        manifest &&
        manifest.metadata &&
        manifest.metadata.author &&
        manifest.metadata.author.name
      ) {
        this.author = manifest.metadata.author.name;
      } else if (manifest && manifest.author) {
        this.author = manifest.author;
      } else {
        this.author = "Ac|d-$CoRpI()";
      }
      this.author = manifest.author;
      this.__disposer.push(reaction);
    });
    globalThis.document.body.style.backgroundColor = "#000000";
    globalThis.document.body.style.color = "#D2D2D2";
    globalThis.document.body.style.backgroundImage = `url(${
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
      styles,
      css`
        :host {
          display: block;
          --simple-tooltip-background: #000000;
          --simple-tooltip-opacity: 1;
          --simple-tooltip-text-color: #ffffff;
          --simple-tooltip-delay-in: 0;
          --simple-tooltip-border-radius: 0;
        }
        scroll-button {
          position: fixed;
          bottom: 0;
          --simple-icon-height: 100px;
          --simple-icon-width: 100px;
          right: 16px;
          color: lime;
          --scroll-button-color: lime;
          --scroll-button-background-color: black;
          --scroll-button-tooltip-background-color: black;
          --scroll-button-tooltip-color: lime;
        }
        .title-text {
          display: block;
          font-family: "Caveat", cursive;
          color: lime;
          background-position-x: -75px;
          background-repeat: repeat-x;
          background-position-y: center;
        }
        .title-text h1 {
          margin: 0;
          padding: 0;
        }
        .title-text h1 .site-active-title-icon {
          margin-top: -8px;
        }

        site-menu {
          color: white;
          --site-menu-active-color: lime;
          --site-menu-item-active-item-color: forestgreen;
          --haxcms-tooltip-color: lime;
          --haxcms-tooltip-background-color: var(
            --haxcms-user-styles-color-theme-color-1
          );
          --map-menu-item-a-active-color: black;
          --map-menu-item-a-active-background-color: lime;
        }
        section {
          padding: 25px;
        }
        #slot {
          max-width: 530px;
          width: 530px;
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
        simple-datetime {
          font-size: 8pt;
          display: inline-block;
        }
      `,
    ];
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
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
                  alt=""
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
                <site-menu></site-menu>
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
                        vspace="3"
                        alt="Acid Scorpio website" /></a
                    ><br />
                  </div>
                </font>
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
                <site-active-title
                  class="title-text"
                  style="background-image: url(${new URL(
                    "assets/header.jpg",
                    import.meta.url,
                  ).href}/../movies.jpg)"
                ></site-active-title>
                <table border="1" cellpadding="0" cellspacing="0" width="100%">
                  <tbody>
                    <tr>
                      <td>
                        <table width="100%">
                          <tbody>
                            <tr>
                              <td align="left">
                                <p class="posted">
                                  Posted:
                                  ${this.activeItem &&
                                  this.activeItem.metadata &&
                                  this.activeItem.metadata.created
                                    ? html`<simple-datetime
                                        unix
                                        .timestamp="${this.activeItem.metadata
                                          .created}"
                                      ></simple-datetime>`
                                    : ``}
                                </p>
                              </td>
                              <td>
                                <p class="posted">
                                  Title:
                                  ${this.activeItem && this.activeItem.title
                                    ? this.activeItem.title
                                    : ``}
                                </p>
                              </td>
                              <td align="right">
                                <p class="posted">By: ${this.author}</p>
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
      <scroll-button></scroll-button>
    `;
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * The active item to render
       */
      activeItem: { type: Object },
      /**
       * The author of the item
       */
      author: { type: String },
    };
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
    this.__link = globalThis.document.createElement("link");
    this.__link.rel = "stylesheet";
    this.__link.href =
      "https://fonts.googleapis.com/css2?family=Caveat&family=Open+Sans&family=Press+Start+2P&display=swap";
    globalThis.document.head.appendChild(this.__link);
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
}
globalThis.customElements.define(
  TerribleProductionzThemes.tag,
  TerribleProductionzThemes,
);
export { TerribleProductionzThemes };
