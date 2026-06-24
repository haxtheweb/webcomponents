/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/site/site-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button.js";
import { LTIResizingMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/LTIResizingMixin.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
/**
 * @title Learn2
 * @element learn-two-theme
 * `Learn2 theme for HAXcms`
 *
 * @demo demo/index.html
 */
class LearnTwoTheme extends LTIResizingMixin(DDDSuper(HAXCMSLitElementTheme)) {
  //styles function
  static get styles() {
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      styles,
      css`
        :host {
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --__learn-two-theme-default-background: var(
            --learn-two-theme-default-background,
            light-dark(
              var(--ddd-theme-default-white),
              var(--ddd-theme-default-coalyGray)
            )
          );
          display: block;
          letter-spacing: var(--learn-two-theme-letter-spacing, -0.03rem);
          font-weight: var(--learn-two-theme-font-weight, 400);
          background: var(
            --learn-two-theme-background,
            var(--__learn-two-theme-default-background)
          );
          --learn-two-theme-menu-toggle-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --learn-two-theme-menu-toggle-background: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          --learn-two-theme-menu-toggle-border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
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
          line-height: var(--learn-two-theme-headers-line-height);
          letter-spacing: var(--learn-two-theme-headers-letter-spacing);
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
          background: var(
            --learn-two-theme-header-background,
            var(
              --learn-two-theme-menu-color,
              light-dark(
                var(--ddd-theme-default-coalyGray),
                var(--ddd-theme-default-potentialMidnight)
              )
            )
          );
          color: var(--learn-two-theme-header-color, var(--ddd-theme-default-white));
          text-align: center;
          padding: 0 0 16px;
        }
        @media (min-width: 901px) {
          :host([is-logged-in]) .drawer {
            top: 56px;
            height: calc(100vh - 56px);
          }
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
          --site-breadcrumb-color: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-slateLight)
          );
          --site-breadcrumb-color-hover: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-white)
          );
          --site-breadcrumb-decoration-color-hover: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-white)
          );
          --site-breadcrumb-last-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --site-breadcrumb-separator-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        :host([responsive-size="xs"]) site-breadcrumb,
        :host([responsive-size="sm"]) site-breadcrumb {
          display: none;
        }
        site-rss-button {
          color: var(--ddd-theme-default-white);
        }

        site-print-button {
          color: var(
            --site-print-button-color,
            var(--ddd-theme-default-white)
          );
          margin: var(--ddd-spacing-1);
        }
        site-modal {
          margin: var(--ddd-spacing-1);
          display: inline-flex;
        }

        simple-icon-button,
        site-rss-button,
        site-print-button {
          color: var(--ddd-theme-default-white);
          --simple-icon-fill-color: var(--ddd-theme-default-white);
          --haxcms-tooltip-color: var(--ddd-theme-default-white);
          --haxcms-tooltip-background-color: var(--ddd-theme-default-coalyGray);
        }

        h-a-x {
          padding: 0 !important;
        }

        :host([edit-mode]) {
          opacity: 1;
        }

        :host([edit-mode]) .drawer {
          opacity: 0.2;
          pointer-events: none;
        }

        git-corner {
          float: right;
        }

        .drawer {
          opacity: 1;
          position: fixed;
          top: 0;
          left: 0;
          width: 300px;
          height: 100vh;
          overflow-y: auto;
          transition: 0.2s linear all;
          box-shadow: var(--learn-two-theme-drawer-box-shadow, var(--ddd-boxShadow-sm));
          background-color: var(
            --learn-two-theme-menu-color,
            light-dark(
              var(--ddd-theme-default-coalyGray),
              var(--ddd-theme-default-potentialMidnight)
            )
          );
          z-index: 1000;
        }


        #menubutton,
        #menubutton2 {
          display: none;
          color: var(--learn-two-theme-menu-toggle-color);
          --simple-icon-color: var(--learn-two-theme-menu-toggle-color);
          --simple-icon-fill-color: var(--learn-two-theme-menu-toggle-color);
          background-color: var(--learn-two-theme-menu-toggle-background);
          border: 1px solid var(--learn-two-theme-menu-toggle-border-color);
          border-radius: var(--ddd-radius-sm);
        }


        site-menu-button:not([disabled]):hover,
        site-menu-button:not([disabled]):active,
        site-menu-button:not([disabled]):focus {
          opacity: 1;
          background-color: var(
            --site-menu-button-button-hover-background-color,
            var(--ddd-theme-default-limestoneLight)
          );
        }
        site-menu-button {
          --site-menu-button-icon-fill-color: var(
            --haxcms-user-styles-color-theme-color-1
          );
          --haxcms-tooltip-color: var(--haxcms-user-styles-color-theme-color-2);
          --haxcms-tooltip-background-color: var(
            --haxcms-user-styles-color-theme-color-1
          );
          --site-menu-button-button-hover-background-color: var(
            --learn-two-theme-menu-button-hover-background-color,
            var(--ddd-theme-default-limestoneLight)
          );
        }
        site-menu-button {
          --site-menu-button-icon-width: var(--ddd-icon-xl);
          --site-menu-button-icon-height: var(--ddd-icon-xl);
        }
        site-menu-button[type="next"] {
          right: 0;
        }


        site-menu-button[type="next"] {
          right: 0;
          left: unset;
        }


        site-title {
          position: relative;
          overflow: hidden;
          color: var(--ddd-theme-default-white);
        }

        site-menu {
          background-color: var(
            --learn-two-theme-menu-color,
            light-dark(
              var(--ddd-theme-default-coalyGray),
              var(--ddd-theme-default-potentialMidnight)
            )
          );
          color: var(--ddd-theme-default-white);
          padding: 0;
          height: calc(100vh - 116px);
          --site-menu-color: var(--ddd-theme-default-white);
          --map-menu-item-a-active-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          overflow: auto;

          --site-menu-active-color: var(
            --haxcms-user-styles-color-theme-color-3
          );
          --site-menu-item-active-item-color: var(
            --learn-two-theme-menu-item-active-item-color,
            light-dark(
              var(--ddd-theme-default-limestoneLight),
              var(--ddd-theme-default-limestoneGray)
            )
          );
          --haxcms-tooltip-color: var(--ddd-theme-default-infoLight);
          --haxcms-tooltip-background-color: var(--ddd-theme-default-info);
          --map-menu-item-a-active-background-color: var(
            --learn-two-theme-menu-item-active-background-color,
            light-dark(
              var(--ddd-theme-default-limestoneLight),
              var(--ddd-theme-default-limestoneGray)
            )
          );
          font-family: var(--ddd-font-navigation);
          --site-menu-font-size: var(--ddd-font-size-3xs);
        }

        :host([is-logged-in]) site-menu {
          height: calc(100vh - 162px);
        }

        .layout {
          position: relative;
          min-height: -moz-available;
          min-height: -webkit-fill-available;
          min-height: fill-available;
        }
        main {
          margin-left: 300px;
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
          --site-menu-button-icon-width: var(--ddd-icon-xl);
          --site-menu-button-icon-height: var(--ddd-icon-xl);
          --site-menu-button-icon-fill-color: var(--ddd-theme-default-coalyGray);
        }


        site-title {
          padding: var(--ddd-spacing-4);
          color: var(--ddd-theme-default-white);
          --site-title-link-display: inline-block;
          --site-title-link-h1-display: inline-block;
          --site-title-link-text-decoration: none;
          --site-title-heading-font-family: var(
            --__learn-two-theme-default-font-family
          );
          --site-title-heading-font-size: var(--ddd-font-size-ms);
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
          margin: var(--ddd-spacing-4) 0;
          padding: 0;
          font-size: var(--ddd-font-size-ml);
        }
        @media (max-width: 900px) {
          #contentcontainer {
            padding: var(--ddd-spacing-4) var(--ddd-spacing-6);
          }
          #menubutton {
            display: inline-flex;
            margin: var(--ddd-spacing-3);
          }
          #menubutton2 {
            display: inline-flex;
            position: absolute;
            z-index: 1;
            margin: var(--ddd-spacing-3);
          }
          site-menu-button {
            bottom: 0;
            top: unset;
          }
          site-menu-button[type="prev"] {
            left: 0;
          }
          :host([opened]) site-menu-button[type="prev"],
          :host([opened]) site-menu-button[type="next"] {
            display: none;
          }
          main {
            margin-left: 0;
          }
          .drawer {
            transform: translateX(-100%);
            z-index: 1000000;
          }
          .drawer.opened {
            transform: translateX(0);
          }
          .scrim {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(80, 80, 80, 0.8);
            z-index: 999999;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s linear;
          }
          .scrim.opened {
            opacity: 1;
            pointer-events: auto;
          }
        }
      `,
    ];
  }

  constructor() {
    super();
    this.HAXCMSThemeSettings.autoScroll = true;
    // prettier-ignore
    import(
        "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js"
      );
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js"
    );
    // prettier-ignore
    import(
        "@haxtheweb/haxcms-elements/lib/ui-components/site/site-rss-button.js"
      );
    // prettier-ignore
    import(
        "@haxtheweb/haxcms-elements/lib/ui-components/site/site-print-button.js"
      );
    // prettier-ignore
    import(
        "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu-button.js"
      );
    // prettier-ignore
    import(
        "@haxtheweb/haxcms-elements/lib/ui-components/layout/site-modal.js"
      );
    // prettier-ignore
    import(
        "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-git-corner.js"
      );
  }
  /**
   * Delay importing site-search until we click to open it directly
   */
  siteModalClick(e) {
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/site/site-search.js"
    ).then((m) => {
      // weird looking but forces focus when it opens the search form
      globalThis.SimpleModal.requestAvailability().querySelector("site-search").shadowRoot.querySelector("simple-fields-field").focus();
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
      <div class="layout">
         <simple-icon-button
           id="menubutton"
           icon="menu"
           @click="${this.toggleDrawer}"
           title="Toggle site menu"
         ></simple-icon-button>
           <div class="drawer ${this.opened ? 'opened' : ''}" id="drawer">
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
         </div>
         <div class="scrim ${this.opened ? 'opened' : ''}" @click="${this._closeDrawer}"></div>
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
           <site-menu-button type="next" position="left"></site-menu-button>
         </main>
      </div>
    `;
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
  toggleDrawer(e) {
    this.opened = !this.opened;
  }
  _closeDrawer(e) {
    this.opened = false;
  }
}
globalThis.customElements.define(LearnTwoTheme.tag, LearnTwoTheme);
export { LearnTwoTheme };
