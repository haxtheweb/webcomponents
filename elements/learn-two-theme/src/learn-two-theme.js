/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
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
  /* REQUIRED FOR TOOLING DO NOT TOUCH */
  constructor() {
    super();
    this.HAXCMSThemeSettings.autoScroll = true;
    setTimeout(() => {
      // prettier-ignore
      import(
        "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js"
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
    }, 0);
  }
  /**
   * Delay importing site-search until we click to open it directly
   */
  siteModalClick(e) {
    // prettier-ignore
    import(
      "@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-search.js"
    );
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
    return html` <custom-style>
        <style>
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
          site-menu {
            --site-menu: {
              background-color: #383f45;
            }
            --site-menu-container: {
              padding: 0;
              background-color: #2d3237;
            }
          }
          app-drawer-layout {
            --app-drawer-content-container: {
              overflow: hidden;
              background-color: #383f45;
              position: relative;
            }
          }
          site-menu-button {
            --site-menu-button-button: {
              background-color: rgba(0, 0, 0, 0);
              width: 64px;
              height: 100vh;
              border-radius: 0;
              transition: 0.4s all ease-in-out;
              transition-delay: 0.2s;
              margin: 0;
              padding: 0;
              opacity: 0.8;
              -webkit-transition: 0.4s all ease-in-out;
              -moz-transition: 0.4s all ease-in-out;
              -ms-transition: 0.4s all ease-in-out;
              -o-transition: 0.4s all ease-in-out;
            }
          }
          app-drawer-layout[narrow] site-menu-button {
            --site-menu-button-button: {
              background-color: transparent !important;
              width: 64px;
              height: 64px;
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
              <site-title ?disabled="${this.editMode}"></site-title>
              <site-modal
                @site-modal-click="${this.siteModalClick}"
                ?disabled="${this.editMode}"
                icon="icons:search"
                title="Search site"
                button-label="Search"
              >
                <site-search></site-search>
              </site-modal>
            </div>
          </header>
          <nav>
            <site-menu></site-menu>
          </nav>
          <footer class="rss-buttons">
            <site-rss-button
              ?disabled="${this.editMode}"
              type="atom"
            ></site-rss-button>
            <site-rss-button
              ?disabled="${this.editMode}"
              type="rss"
            ></site-rss-button>
            <site-print-button
              ?disabled="${this.editMode}"
              position="top"
            ></site-print-button>
          </footer>
        </app-drawer>
        </nav>
        <main>
          <site-menu-button type="prev"></site-menu-button>
          <article id="contentcontainer">
            <site-git-corner></site-git-corner>
            <site-breadcrumb></site-breadcrumb>
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
