/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSRememberRoute } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSRememberRoute.js";
import { HAXCMSThemeParts } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { PrintBranchMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/PrintBranchMixin.js";
import { EmailPageMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/EmailPageMixin.js";
import { PDFPageMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/PDFPageMixin.js";
import { QRCodeMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/QRCodeMixin.js";
import { HAXCMSMobileMenuMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSMobileMenu.js";
import { HAXCMSOperationButtons } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSOperationButtons.js";
import { LTIResizingMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/LTIResizingMixin.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-tags.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import { normalizeEventPath } from "@haxtheweb/utils/utils.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/layout/site-modal.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu-content.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
/**
 * `clean-two`
 * `A 2nd clean theme`
 *
 * @microcopy - language worth noting:
 *  - HAXcms - A headless content management system
 *  - HAXCMSTheme - A super class that provides correct baseline wiring to build a new theme
 *
 * @demo demo/index.html
 * @element clean-two
 */
class CleanTwo extends LTIResizingMixin(
  HAXCMSOperationButtons(
    HAXCMSRememberRoute(
      EmailPageMixin(
        PDFPageMixin(
          PrintBranchMixin(
            QRCodeMixin(
              HAXCMSThemeParts(
                HAXCMSMobileMenuMixin(DDDSuper(HAXCMSLitElementTheme)),
              ),
            ),
          ),
        ),
      ),
    ),
  ),
) {
  //styles function
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --ddd-theme-body-font-size: var(--ddd-font-size-xxs);
          display: block;
          color: light-dark(black, var(--ddd-accent-6));
          background-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
          --simple-tooltip-background: #000000;
          --simple-tooltip-opacity: 1;
          --simple-tooltip-text-color: #ffffff;
          --simple-tooltip-delay-in: 0;
          --simple-tooltip-border-radius: 0;
        }
        .link-actions {
          margin: 0;
          display: block;
          padding: 0;
          border-top: 2px solid #e6ecf1;
          margin-top: 24px;
          align-items: center;
          padding-top: 24px;
          flex-direction: row;
          -webkit-box-align: center;
          -webkit-box-orient: horizontal;
          -webkit-box-direction: normal;
        }
        .link-actions .inner {
          width: auto;
          margin: 0;
          display: grid;
          padding: 0;
          -ms-grid-rows: auto;
          grid-column-gap: 24px;
          -ms-grid-columns: 1fr 1fr;
          grid-template-rows: auto;
          grid-template-areas: "previous next";
          grid-template-columns: 1fr 1fr;
        }
        site-menu-button {
          --site-menu-button-link-decoration: none;
          --site-menu-button-button-hover-color: var(
            --ddd-theme-default-info,
            #383f45
          );
          transition: all 0.3s ease-in-out;
          color: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
          border: var(--ddd-border-sm);
          margin: 0;
          display: block;
          padding: 0;
          position: relative;
          align-self: stretch;
          box-shadow: var(--ddd-boxShadow-sm);
          transition: border 0.3s ease;
          align-items: center;
          justify-self: stretch;
          text-overflow: ellipsis;
          border-radius: 3px;
          flex-direction: row;
          text-decoration: none;
          background-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
          -webkit-box-align: center;
          page-break-inside: avoid;
          -ms-grid-row-align: stretch;
          -webkit-box-orient: horizontal;
          -ms-grid-column-align: stretch;
          -webkit-box-direction: normal;
        }

        site-git-corner {
          height: 40px;
          width: 40px;
          margin-left: -66px;
          padding: 0;
          --github-corner-size: 40px;
          --site-git-corner-color: light-dark(
            var(--ddd-primary-4),
            var(--ddd-accent-6)
          );
          --site-git-corner-background: transparent;
          background-color: transparent;
          color: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
          padding: 8px;
          display: block;
          float: unset;
        }
        .email-btn,
        .print-branch-btn simple-icon-button-lite,
        .pdf-page-btn simple-icon-button-lite {
          --simple-icon-height: var(--ddd-icon-xxs);
          --simple-icon-width: var(--ddd-icon-xxs);
          color: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
          padding: 8px;
          display: block;
          width: 36px;
          margin-left: -60px;
        }
        site-menu-button * {
          font-family: var(--ddd-font-navigation);
        }
        site-menu-button[edit-mode][disabled] {
          display: block;
        }
        site-menu-button[type="prev"] {
          grid-area: previous;
        }
        site-menu-button[type="next"] {
          grid-area: next;
        }
        site-menu-button div.wrapper {
          flex: 1;
          margin: 0;
          display: block;
          padding: 16px;
          text-overflow: ellipsis;
          text-decoration: none;
          font-weight: var(--ddd-font-weight-bold);
          text-transform: none;
        }
        site-menu-button div .top {
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-regular);
        }
        simple-datetime {
          color: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
        }
        site-menu-button div .bottom {
          font-size: var(--ddd-font-size-xxs);
          font-weight: var(--ddd-font-weight-bold);
          margin-top: var(--ddd-spacing-2);
          max-height: 50px;
          overflow: hidden;
        }
        site-menu-button:focus,
        site-menu-button:focus-within,
        site-menu-button:hover {
          color: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
          background-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
        }
        site-menu-button[type="next"] div {
          text-align: left;
        }
        site-menu-button[type="prev"] div {
          text-align: right;
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
          margin: 0 0 var(--ddd-spacing-4) 0;
        }

        .body-wrapper {
          flex: 1;
          height: auto;
          height: 100vh;
          position: absolute;
          width: 100%;
          margin: 0 auto;
          display: flex;
          background-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
          padding: 0;
          transition: margin-bottom 0.3s ease;
          align-items: stretch;
          -moz-transition: margin-bottom 0.3s ease;
          -webkit-box-align: stretch;
          overflow-x: hidden;
        }
        :host([is-logged-in]) .body-wrapper {
          height: calc(100vh - 48px);
        }
        :host([menu-open]) .body-wrapper .left-col {
          margin-left: 0px;
          position: sticky;
          top: 0px;
        }
        .body-wrapper .content-wrapper .content {
          margin: 0;
          padding: 0 var(--ddd-spacing-2) var(--ddd-spacing-8)
            var(--ddd-spacing-16);
        }

        nav {
          display: -webkit-box;
          display: -moz-box;
          display: -ms-flexbox;
          display: -webkit-flex;
          flex: 0 0 auto;
          display: flex;
          z-index: 15;
          min-width: 332px;
          background: light-dark(var(--ddd-accent-6), var(--ddd-primary-4));
          align-items: stretch;
          border-right: 1px solid
            light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
          flex-direction: column;
          -webkit-box-align: stretch;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
        }
        .left-col {
          display: -webkit-box;
          display: -moz-box;
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
          flex: 0 1 0%;
          margin: 0;
          padding: 0;
          margin-left: -332px;
          transition: margin 0.3s ease;
          height: fit-content;
        }
        @media screen and (min-width: 900px) {
          .left-col {
            flex: 0 0 auto;
            width: auto;
            z-index: 15;
            width: 332px;
            align-items: stretch;
            flex-direction: column;
            -webkit-box-align: stretch;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
          }
        }
        site-menu {
          --site-menu-color: light-dark(
            var(--ddd-primary-4),
            var(--ddd-accent-6)
          );
          --site-menu-active-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
          --site-menu-item-active-item-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
          background-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
          color: light-dark(black, var(--ddd-accent-6));
          --map-menu-item-a-active-background-color: light-dark(
            var(--ddd-primary-4),
            var(--ddd-accent-6)
          );
          --map-menu-item-a-active-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
          --map-menu-item-icon-active-color: light-dark(
            var(--ddd-primary-4),
            var(--ddd-accent-6)
          );
          --site-menu-container-background-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
          font-family: var(--ddd-font-navigation);
          font-weight: var(--ddd-font-weight-light);
          --site-menu-font-size: var(--ddd-font-size-3xs);
          overflow-y: auto;
          flex: 1 1 auto;
          height: calc(100vh - var(--ddd-spacing-10));
          left: 0;
          margin: 0;
          display: block;
          padding: var(--ddd-spacing-5) 0 0 0;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
        }

        site-menu::part(map-menu) {
          margin-right: -16px;
          padding-right: 8px;
        }

        :host([is-logged-in]) site-menu {
          height: calc(100vh - 48px);
        }

        main {
          margin: 0 auto;
          max-width: 800px;
          padding: 0 32px;
        }
        :host([responsive-size="xl"]) footer,
        :host([responsive-size="xl"]) main {
          width: 900px;
          max-width: 900px;
          padding: 0 5vw;
        }
        :host([responsive-size="lg"]) footer,
        :host([responsive-size="lg"]) main {
          width: 800px;
        }

        .qr-code-btn {
          padding: 8px;
          display: block;
          margin-left: -60px;
          width: 36px;
        }
        .content-wrapper {
          max-width: 100%;
          margin: 0;
          display: flex;
          padding: 0;
          flex-direction: column;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
        }
        .header {
          z-index: 2;
          height: 0;
          margin-top: var(--ddd-spacing-5);
        }
        :host([edit-mode]) .header {
          z-index: unset;
        }
        .header #haxcmsmobilemenubutton {
          margin-left: -52px;
          padding: 4px;
          color: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
          --simple-icon-height: var(--ddd-icon-xs);
          --simple-icon-width: var(--ddd-icon-xs);
        }
        .header site-menu-content {
          display: inline-flex;
          float: right;
          color: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
          margin-right: -52px;
          --simple-popover-background-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
          --page-contents-menu-link: light-dark(
            var(--ddd-primary-4),
            var(--ddd-accent-6)
          );
        }
        :host([responsive-size="xs"]) site-menu-content[mobile] {
          right: 24px;
          width: 24px;
          height: 24px;
          top: 48px;
        }
        :host([responsive-size="xs"][is-logged-in]) site-menu-content[mobile] {
          top: 72px;
        }
        .header site-menu-content[mobile] {
          position: fixed;
          right: 72px;
          width: 32px;
          height: 32px;
          margin-right: 0px;
          display: block;
          background-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
        }
        .content {
          flex: 1 1 auto;
          margin: 0px 16px;
          display: block;
          padding: 0;
        }
        @media screen and (max-width: 640px) {
          site-breadcrumb {
            display: none;
          }
          .header {
            height: 0px;
          }
          site-active-title h1 {
            width: 100%;
            word-break: break-all;
          }
        }
        @media screen and (max-width: 400px) {
          .content {
            min-width: 200px;
          }
          .body-wrapper {
            overflow-x: hidden;
          }

          :host([menu-open]) #haxcmsmobilemenubutton {
            margin-left: -52px;
          }
          .link-actions .inner {
            display: block;
          }
          site-menu-button {
            margin: 10px 0;
          }
          #slot ::slotted(iframe) {
            width: auto;
          }
        }
        @media screen and (max-width: 600px) {
          .link-actions .inner {
            display: block;
          }
          site-menu-button {
            margin: 10px 0;
          }
          #slot ::slotted(iframe) {
            width: auto;
          }
          #slot ::slotted(h1),
          #slot ::slotted(h2),
          #slot ::slotted(h3) {
            font-size: 1.1em !important;
          }
          #slot ::slotted(h4),
          #slot ::slotted(h5),
          #slot ::slotted(h6) {
            font-size: 0.9em !important;
          }
          #slot ::slotted(replace-tag) {
            overflow: hidden;
          }
        }
        .right-col {
          margin: 0;
          padding: 0;
          position: relative;
          margin-right: auto;
          max-width: 100%;
          flex-direction: column;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
          min-height: 100%;
        }
        .site-menu-content-wrapper {
          display: -webkit-box;
          display: -moz-box;
          display: -ms-flexbox;
          display: -webkit-flex;
          flex: 0 0 auto;
          padding-right: 0;
          width: 200px;
          flex: 1;
          margin: 0;
          display: block;
          max-height: 976px;
          z-index: 1;
          display: -webkit-box;
          display: -moz-box;
          display: -ms-flexbox;
          display: -webkit-flex;
          height: 100%;
          margin: 0;
          display: flex;
          margin-top: 24px;
          flex-direction: column;
          padding-bottom: 40px;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
        }
        .right-col site-menu-content {
          flex: 1;
          margin: 0;
          display: flex;
          padding: 0;
          background-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
          overflow: hidden;
          position: fixed;
          counter-reset: toc;
          flex-direction: column;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
        }
        .right-col site-menu-content::before {
          top: 0;
          left: 0;
          height: 100%;
          content: " ";
          position: absolute;
        }
        .footer {
          margin: 0;
          display: flex;
          padding: 0;
          border-top: 2px solid #e6ecf1;
          margin-top: 24px;
          align-items: center;
          padding-top: 24px;
          flex-direction: row;
          -webkit-box-align: center;
          -webkit-box-orient: horizontal;
          -webkit-box-direction: normal;
        }
        .footer-left {
          flex: 1;
          margin: 0;
          display: block;
          padding: 0;
          font-size: 12px;
        }
        .footer-right {
          flex: 1;
          margin: 0;
          display: block;
          padding: 0;
        }
        simple-icon-button,
        site-rss-button,
        replace-tag[with="site-rss-button"],
        replace-tag[with="site-print-button"],
        site-print-button {
          color: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
        }
        replace-tag[with="site-rss-button"],
        replace-tag[with="site-print-button"],
        replace-tag[with="site-git-corner"] {
          display: none;
        }
        site-rss-button,
        site-print-button,
        site-modal {
          --simple-icon-height: var(--ddd-icon-xxs);
          --simple-icon-width: var(--ddd-icon-xxs);
          padding: 8px;
          display: block;
          margin-left: -52px;
          width: 36px;
        }
        site-breadcrumb {
          --site-breadcrumb-margin: var(--ddd-spacing-2) 0 var(--ddd-spacing-7);
          color: light-dark(black, var(--ddd-accent-6));
          --site-breadcrumb-color: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-linkLight)
          );
          --site-breadcrumb-last-color: light-dark(black, var(--ddd-accent-6));
        }
        .search-modal-btn {
          margin-top: 16px;
        }
      `,
    ];
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    globalThis.document.body.style.overflow = "hidden";
    this.HAXCMSThemeSettings.themeTop =
      this.shadowRoot.querySelector("#haxcms-theme-top");
    this.HAXCMSThemeSettings.siteMenuContent =
      this.shadowRoot.querySelector(".body-wrapper");
    this.HAXCMSThemeSettings.scrollTarget =
      this.shadowRoot.querySelector(".content-wrapper");
    globalThis.AbsolutePositionStateManager.requestAvailability().scrollTarget =
      this.HAXCMSThemeSettings.scrollTarget;
    // shadow ready which means we should be able to open this even on a slow load
    // if we are the route in question
    store.internalRoutes["search"].callback = this.siteModalForceClick;
  }

  searchItemSelected(e) {
    // an item was picked, let's just make the UI jump to that item
    this.searchTerm = "";
  }
  searchChanged(e) {
    var target = normalizeEventPath(e)[0];
    if (target.value) {
      // prettier-ignore
      import(
        "@haxtheweb/haxcms-elements/lib/ui-components/site/site-search.js"
      ).then(() => {
        this.searchTerm = target.value;
      });
    } else {
      this.searchTerm = "";
    }
  }

  // render function
  render() {
    return html`
      <div class="body-wrapper">
        <div class="left-col" part="left-col">${this.HAXCMSMobileMenu()}</div>
        <div class="content-wrapper">
          <div class="content">
            <div id="haxcms-theme-top"></div>
            <header class="header">
              ${!["xl"].includes(this.responsiveSize)
                ? html`
                    <div part="site-menu-content">
                      <site-menu-content
                        .part="${this.editMode ? `edit-mode-active` : ``}"
                        mobile
                      ></site-menu-content>
                    </div>
                  `
                : ``}
              ${this.HAXCMSMobileMenuButton("right")}
              <site-modal
                @site-modal-click="${this.siteModalClick}"
                ?disabled="${this.editMode}"
                icon="icons:search"
                title="Search site"
                class="search-modal-btn"
                button-label="Search"
                part="search-btn"
                position="right"
              >
                <site-search></site-search>
              </site-modal>
              ${MicroFrontendRegistry.has("@core/htmlToPdf")
                ? this.PDFPageButton()
                : ``}
              ${MicroFrontendRegistry.has("@haxcms/siteToHtml")
                ? this.PrintBranchButton()
                : html`<replace-tag
                    with="site-print-button"
                    position="right"
                    class="btn js-toolbar-action"
                    import-method="view"
                    part="print-btn"
                  ></replace-tag>`}
              ${this.EmailPageButton("right")} ${this.QRCodeButton("right")}
              <replace-tag
                with="site-rss-button"
                type="rss"
                import-method="view"
                part="rss-btn"
                position="right"
              ></replace-tag>
              <replace-tag
                with="site-git-corner"
                size="small"
                circle
                position="right"
                direction="right"
                import-method="view"
                part="git-corner-btn"
              ></replace-tag>
            </header>
            <site-search
              hide-input
              part="search-btn"
              search="${this.searchTerm}"
              @search-item-selected="${this.searchItemSelected}"
              ?hidden="${this.searchTerm != "" ? false : true}"
            ></site-search>
            <main>
              <site-breadcrumb part="page-breadcrumb"></site-breadcrumb>
              <site-active-title part="page-title"></site-active-title>
              <site-active-tags
                part="page-tags"
                auto-accent-color
              ></site-active-tags>
              <article
                id="contentcontainer"
                ?hidden="${this.searchTerm != "" ? true : false}"
              >
                <section id="slot">
                  <slot></slot>
                </section>
              </article>
            </main>
            <footer>
              <div class="link-actions">
                <div class="inner">
                  <replace-tag
                    with="site-menu-button"
                    import-only
                  ></replace-tag>
                  <site-menu-button
                    hide-label
                    type="prev"
                    position="right"
                    class="navigation"
                    @label-changed="${this.__prevPageLabelChanged}"
                  >
                    <div slot="suffix" class="wrapper">
                      <div class="top">Previous</div>
                      <div class="bottom">${this.prevPage}</div>
                    </div>
                  </site-menu-button>
                  <site-menu-button
                    hide-label
                    type="next"
                    position="left"
                    class="navigation"
                    @label-changed="${this.__nextPageLabelChanged}"
                  >
                    <div slot="prefix" class="wrapper">
                      <div class="top">Next</div>
                      <div class="bottom">${this.nextPage}</div>
                    </div>
                  </site-menu-button>
                </div>
              </div>
              <div class="footer" part="footer">
                <div class="footer-left" part="footer-left">
                  Last updated
                  <replace-tag with="simple-datetime" import-only></replace-tag>
                  <simple-datetime
                    unix
                    .timestamp="${this.pageTimestamp}"
                  ></simple-datetime>
                </div>
                <div class="footer-right" part="footer-right">
                  ${this.HAXCMSRenderOperationButtons()}
                </div>
              </div>
            </footer>
          </div>
        </div>
        ${["xl"].includes(this.responsiveSize)
          ? html`
              <div class="right-col" part="site-menu-content right-col">
                <div class="site-menu-content-wrapper">
                  <site-menu-content
                    .part="${this.editMode ? `edit-mode-active` : ``}"
                  ></site-menu-content>
                </div>
              </div>
            `
          : ``}
      </div>
    `;
  }

  __prevPageLabelChanged(e) {
    this.prevPage = e.detail.value;
  }
  __nextPageLabelChanged(e) {
    this.nextPage = e.detail.value;
  }
  // properties available to the custom element for data binding
  static get properties() {
    let props = {};
    if (super.properties) {
      props = super.properties;
    }
    return {
      ...props,
      searchTerm: {
        type: String,
      },
      prevPage: {
        type: String,
      },
      nextPage: {
        type: String,
      },
      pageTimestamp: {
        type: Number,
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "clean-two";
  }
  /**
   * Add elements to cheat on initial paint here
   */
  constructor() {
    super();
    this.HAXCMSThemeSettings.autoScroll = true;
    this.searchTerm = "";
    this.__disposer = this.__disposer ? this.__disposer : [];
    autorun((reaction) => {
      this.activeManifestIndex = toJS(store.activeManifestIndex);
      this.__disposer.push(reaction);
    });

    autorun((reaction) => {
      if (
        store.activeItem &&
        store.activeItem.metadata &&
        store.activeItem.metadata.updated
      ) {
        this.pageTimestamp = toJS(store.activeItem.metadata.updated);
      }
      this.__disposer.push(reaction);
    });
  }
  siteModalForceClick(e) {
    setTimeout(() => {
      const theme = globalThis.document.querySelector("clean-two");
      // edge cases where we're switching themes and this callback is not valid
      if (
        theme &&
        theme.shadowRoot &&
        theme.shadowRoot.querySelector("site-modal") &&
        theme.shadowRoot.querySelector("site-modal").shadowRoot &&
        theme.shadowRoot
          .querySelector("site-modal")
          .shadowRoot.querySelector("simple-icon-button-lite")
      ) {
        theme.shadowRoot
          .querySelector("site-modal")
          .shadowRoot.querySelector("simple-icon-button-lite")
          .click();
      }
    }, 500);
  }
  /**
   * Delay importing site-search until we click to open it directly
   */
  siteModalClick(e) {
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/site/site-search.js"
    ).then((m) => {
      if (store.getInternalRoute() !== 'search') {
        globalThis.history.replaceState({}, null, "x/search");
      }
      const params = new URLSearchParams(store.currentRouterLocation.search);
      const input = globalThis.SimpleModal.requestAvailability().querySelector("site-search").shadowRoot.querySelector("simple-fields-field");
      input.focus();
      // if we have a search param already, set it to the field on open
      if (params.get("search")) {
        input.value = params.get("search");
        // stall to allow value to be set
        setTimeout(() => {
          input.select();          
        }, 0);
      }
    });
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
customElements.define(CleanTwo.tag, CleanTwo);
export { CleanTwo };
