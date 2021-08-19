/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@lrnwebcomponents/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import "@polymer/app-layout/app-drawer/app-drawer.js";
import "@polymer/app-layout/app-drawer-layout/app-drawer-layout.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-title.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
/**
 * @deprecatedApply - required for @apply / invoking @apply css var convention
 */
import "@polymer/polymer/lib/elements/custom-style.js";
/**
  * `learn-two-theme`
  * @element learn-two-theme
  * `Learn2 theme for HAXcms`
  *
 
  * @demo demo/index.html
  */
class LearnTwoTheme extends HAXCMSLitElementTheme {
  //styles function
  static get styles() {
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      ...styles,
      css`
        :host {
          --__learn-two-theme-default-font-family: var(
            --learn-two-theme-default-font-family,
            "Muli, Helvetica, Tahoma, Geneva, Arial, sans-serif"
          );
          --__learn-two-theme-default-background: var(
            --learn-two-theme-default-background,
            #ffffff
          );
          display: block;
          font-family: var(
            --learn-two-theme-font-family,
            var(--__learn-two-theme-default-font-family)
          );
          letter-spacing: var(--learn-two-theme-letter-spacing, -0.03rem);
          font-weight: var(--learn-two-theme-font-weight, 400);
          background: var(
            --learn-two-theme-background,
            var(--__learn-two-theme-default-background)
          );
        }

        html,
        body {
          background: var(
            --learn-two-theme-html-body-background,
            var(--__learn-two-theme-default-background)
          );
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: var(
            --learn-two-theme-headers-font-family,
            var(--__learn-two-theme-default-font-family)
          );
          font-weight: var(--learn-two-theme-headers-font-weight, 400);
          text-rendering: var(
            --learn-two-theme-headers-text-rendering,
            optimizeLegibility
          );
          line-height: var(--learn-two-theme-headers-line-height, 150%);
          letter-spacing: var(--learn-two-theme-headers-letter-spacing, 150%);
        }

        :host([hidden]) {
          display: none;
        }

        :host([edit-mode]) #slot {
          display: none;
        }

        #contentcontainer {
          padding: var(--learn-two-theme-contentcontainer-padding, 48px 96px);
          max-width: var(--learn-two-theme-contentcontainer-max-width, 900px);
          margin: var(--learn-two-theme-contentcontainer-margin, auto);
        }

        .header {
          background: #747474;
          color: #fafafa;
          text-align: center;
          padding: 0 0 16px;
        }

        site-git-corner {
          top: 0;
          right: 0;
          position: absolute;
          z-index: 1000;
        }

        simple-icon-button:not(:defined),
        site-breadcrumb:not(:defined),
        site-rss-button:not(:defined),
        site-print-button:not(:defined),
        site-modal:not(:defined),
        site-git-corner:not(:defined),
        site-menu-button:not(:defined) {
          display: none;
        }
        site-breadcrumb {
          display: block;
        }
        :host([responsive-size="xs"]) site-breadcrumb,
        :host([responsive-size="sm"]) site-breadcrumb {
          display: none;
        }
        site-rss-button {
          color: white;
        }

        site-print-button {
          color: var(--site-print-button-color, white);
          margin: 4px;
        }
        site-modal {
          margin: 4px;
          display: inline-flex;
        }

        simple-icon-button,
        site-rss-button,
        site-print-button {
          color: white;
          --simple-icon-fill-color: white;
          --haxcms-tooltip-color: #f5f5f5;
          --haxcms-tooltip-background-color: #252737;
        }

        h-a-x {
          padding: 0 !important;
        }

        :host([edit-mode]) {
          opacity: 1;
        }

        :host([edit-mode]) app-drawer {
          opacity: 0.2;
          pointer-events: none;
        }

        :host([is-logged-in]) app-drawer {
          left: 48px;
        }

        :host([is-logged-in]) app-drawer-layout[narrow] {
          margin: 0 0 0 48px;
        }

        git-corner {
          float: right;
        }

        app-drawer {
          opacity: 1;
          position: fixed;
          top: 0;
          transition: 0.2s linear all;
          box-shadow: 0 0 6px -3px var(--haxcms-color, black);
          overflow: hidden;
          width: 300px;
          --app-drawer-content-padding: 0;
        }

        app-drawer-layout[narrow] #contentcontainer {
          padding: 0 16px;
        }

        #menubutton,
        #menubutton2 {
          display: none;
        }

        app-drawer-layout[narrow] #menubutton {
          display: inline-flex;
          margin: 12px;
        }

        app-drawer-layout[narrow] #menubutton2 {
          display: inline-flex;
          position: absolute;
          z-index: 1;
          margin: 12px;
        }

        :host([is-logged-in]) site-menu-button[type="prev"] {
          left: 348px;
        }

        site-menu-button:not([disabled]):hover,
        site-menu-button:not([disabled]):active,
        site-menu-button:not([disabled]):focus {
          opacity: 1;
          background-color: rgba(0, 0, 0, 0.1);
        }
        site-menu-button {
          --site-menu-button-icon-fill-color: var(
            --haxcms-user-styles-color-theme-color-1
          );
          --haxcms-tooltip-color: var(--haxcms-user-styles-color-theme-color-2);
          --haxcms-tooltip-background-color: var(
            --haxcms-user-styles-color-theme-color-1
          );
          --site-menu-button-button-hover-background-color: rgba(0, 0, 0, 0.1);
        }
        site-menu-button {
          --site-menu-button-icon-width: 64px;
          --site-menu-button-icon-height: 64px;
        }
        site-menu-button[type="prev"] {
          left: 0;
        }
        site-menu-button[type="next"] {
          right: 0;
        }

        app-drawer-layout[narrow] site-menu {
          max-height: calc(100vh - 100px);
        }

        site-menu-button[type="next"] {
          right: 0;
          left: unset;
        }

        :host([is-logged-in])
          app-drawer-layout[narrow]
          site-menu-button[type="prev"],
        app-drawer-layout[narrow] site-menu-button[type="prev"] {
          left: unset;
        }

        :host([opened]) app-drawer-layout[narrow] site-menu-button[type="prev"],
        :host([opened])
          app-drawer-layout[narrow]
          site-menu-button[type="next"] {
          display: none;
        }

        site-title {
          position: relative;
          overflow: hidden;
          color: white;
        }

        site-menu {
          background-color: var(--learn-two-theme-menu-color, #383f45);
          color: #ffffff;
          padding: 0;
          max-height: calc(100vh - 100px);
          --site-menu-active-color: #ffffff;
          --site-menu-item-active-item-color: goldenrod;
          overflow: auto;
        }

        app-drawer-layout {
          min-height: -moz-available;
          min-height: -webkit-fill-available;
          min-height: fill-available;
          --app-drawer-width: 300px;
          --app-drawer-scrim-background: rgba(80, 80, 80, 0.8);
        }

        site-menu-button {
          position: fixed;
          top: 40vh;
          bottom: 20vh;
          margin: 0 20px;
          max-width: 150px;
          min-width: 90px;
          justify-content: center;
          align-content: center;
          flex-direction: column;
          font-size: 40px;
          text-align: center;
          transition: all 0.35s ease;
          display: flex;
          align-items: center;
          left: 300px;
          z-index: 1;
          --site-menu-button-icon-width: 64px;
          --site-menu-button-icon-height: 64px;
          --site-menu-button-icon-fill-color: #2d3237;
        }

        app-drawer-layout[narrow] site-menu-button {
          bottom: 0;
          top: unset;
        }

        site-title {
          color: #fafafa;
          --site-title-link-display: inline-block;
          --site-title-link-text-decoration: none;
          --site-title-heading-font-family: var(
            --__learn-two-theme-default-font-family
          );
          --site-title-heading-font-size: 28px;
          --site-title-heading-margin: 0;
          --site-title-heading-padding: 0;
          --site-title-heading-text-align: center;
          --site-title-heading-text-rendering: optimizelegibility;
          --site-title-heading-font-weight: 100;
        }
        site-active-title {
          --site-active-title-margin: 0px;
          --site-active-title-padding: 0px;
          margin: 0;
          padding: 0;
          display: block;
        }
        site-active-title h1 {
          margin: 16px 0;
          padding: 0;
          font-size: 36px;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.HAXCMSThemeSettings.autoScroll = true;
    // prettier-ignore
    import(
        "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js"
      );
    // prettier-ignore
    import(
      "@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-active-title.js"
    );
    // prettier-ignore
    import(
        "@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-rss-button.js"
      );
    // prettier-ignore
    import(
        "@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-print-button.js"
      );
    // prettier-ignore
    import(
        "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-menu-button.js"
      );
    // prettier-ignore
    import(
        "@lrnwebcomponents/haxcms-elements/lib/ui-components/layout/site-modal.js"
      );
    // prettier-ignore
    import(
        "@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-git-corner.js"
      );
  }
  /**
   * Delay importing site-search until we click to open it directly
   */
  siteModalClick(e) {
    // prettier-ignore
    import(
      "@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-search.js"
    ).then((m) => {
      // weird looking but forces focus when it opens the search form
      window.SimpleModal.requestAvailability().querySelector("site-search").shadowRoot.querySelector("simple-fields-field").focus();
    });
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "learn-two-theme";
  }

  // render function
  render() {
    return html`
      <custom-style>
        <style>
          app-drawer-layout {
            --app-drawer-content-container: {
              overflow: hidden;
              background-color: var(--learn-two-theme-menu-color, #383f45);
              position: relative;
            }
          }
        </style>
      </custom-style>
      <app-drawer-layout responsive-width="900px">
         <simple-icon-button
           id="menubutton"
           icon="menu"
           @click="${this.toggleDrawer}"
           title="Toggle site menu"
         ></simple-icon-button>
           <app-drawer
             swipe-open
             part="app-drawer"
             slot="drawer"
             .opened="${this.opened}"
             @opened="${this.__openedChanged}"
           >
           <simple-icon-button
             id="menubutton2"
             icon="menu"
             @click="${this.toggleDrawer}"
             title="Toggle site menu"
           ></simple-icon-button>
           <header class="header-wrapper">
             <div class="header">
               <site-title ?disabled="${this.editMode}" part="site-title"></site-title>
               <site-modal
                 @site-modal-click="${this.siteModalClick}"
                 ?disabled="${this.editMode}"
                 icon="icons:search"
                 title="Search site"
                 button-label="Search"
                 part="search-btn"
               >
                 <site-search></site-search>
               </site-modal>
               <site-print-button
               ?disabled="${this.editMode}"
               position="top"
               part="print-btn"
             ></site-print-button>
             <site-rss-button
               ?disabled="${this.editMode}"
               type="atom"
               part="rss-btn"
             ></site-rss-button>
             <site-rss-button
               ?disabled="${this.editMode}"
               type="rss"
               part="rss-btn"
             ></site-rss-button>
             </div>
           </header>
           <nav>
             <site-menu part="site-menu"></site-menu>
           </nav>
         </app-drawer>
         </nav>
         <main>
           <site-menu-button type="prev"></site-menu-button>
           <article id="contentcontainer">
             <site-git-corner part="git-corner-btn"></site-git-corner>
             <site-breadcrumb part="page-breadcrumb"></site-breadcrumb>
             <site-active-title part="page-title"></site-active-title>
             <section id="slot">
               <slot></slot>
             </section>
           </article>
           <site-menu-button type="next"></site-menu-button>
         </main>
      </app-drawer-layout>`;
  }

  /**
   * Mix in an opened status
   */
  static get properties() {
    return {
      ...super.properties,
      opened: {
        type: Boolean,
        reflect: true,
      },
    };
  }
  __openedChanged(e) {
    this.opened = e.detail.value;
  }
  toggleDrawer(e) {
    this.shadowRoot.querySelector("app-drawer").toggle();
  }
}
window.customElements.define(LearnTwoTheme.tag, LearnTwoTheme);
export { LearnTwoTheme };
