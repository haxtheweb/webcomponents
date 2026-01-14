/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSThemeParts } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { HAXCMSMobileMenuMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSMobileMenu.js";
import { HAXCMSOperationButtons } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSOperationButtons.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { HAXCMSRememberRoute } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSRememberRoute.js";
import { QRCodeMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/QRCodeMixin.js";
import { PrintBranchMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/PrintBranchMixin.js";
import { PDFPageMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/PDFPageMixin.js";
import "@haxtheweb/scroll-button/scroll-button.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/site/site-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-tags.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-media-banner.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/layout/site-modal.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/layout/site-region.js";
import { autorun, toJS } from "mobx";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { HAXCMSToastInstance } from "@haxtheweb/haxcms-elements/lib/core/haxcms-toast.js";
import { LTIResizingMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/LTIResizingMixin.js";

/**
 * `Polaris Flex Theme`
 * `Polaris theme based on modern flex design system`
 *
 * @microcopy - language worth noting:
 *  - HAXcms - A headless content management system
 *  - HAXCMSTheme - A super class that provides correct baseline wiring to build a new theme
 *
 * @haxcms-theme-category Website
 * @haxcms-theme-internal false
 * @demo demo/index.html
 * @element polaris-flex-theme
 */
class PolarisFlexTheme extends LTIResizingMixin(
  HAXCMSOperationButtons(
    HAXCMSRememberRoute(
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
) {
  //styles function
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          overflow-x: hidden;
          --polaris-content-bg-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
          --polaris-header-bg-color: var(--ddd-theme-default-beaverBlue);
          --polaris-nav-color: var(--ddd-theme-default-white);
          --polaris-nav-bg-color: var(--ddd-theme-default-nittanyNavy);
          --polaris-footer-secondary-bg-color: var(
            --ddd-theme-default-beaverBlue
          );
          --polaris-footer-primary-bg-color: var(
            --ddd-theme-default-nittanyNavy
          );
          --polaris-xs-padding: 26px;
          --polaris-sm-padding: 40px;
          --polaris-md-padding: 46px;
          --polaris-standard-padding: 62px;

          background-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
          color: light-dark(black, var(--ddd-accent-6));

          --video-player-color: var(--ddd-theme-default-white);
          --video-player-bg-color: var(--ddd-theme-default-nittanyNavy);
          --video-player-border-color: var(--ddd-theme-default-limestoneLight);
          --video-player-caption-color: var(--ddd-theme-default-white);
          --video-player-hover-color: var(--ddd-theme-default-inventOrange);
          --video-player-hover-bg-color: var(--ddd-theme-default-beaver80);
          --video-player-accent-color: var(--ddd-theme-default-inventOrange);
          --video-player-faded-accent-color: var(--ddd-theme-default-beaver80);
          --video-player-disabled-color: var(--ddd-theme-default-disabled);
        }

        :host([edit-mode]) {
          /* react to the screen shifting left to right on edit mode w/ tray direction */
          margin: var(
            --hax-tray-element-align-margin,
            0 0 0
              calc(var(--hax-tray-width) - var(--hax-tray-menubar-min-width))
          );
          transition: margin 0.6s ease-in-out;
        }
        :host([is-safari]) {
          background-color: var(--ddd-accent-6);
          color: black;
          --polaris-content-bg-color: var(--ddd-accent-6);
          --polaris-nav-bg-color: var(--ddd-theme-default-skyBlue);
        }

        scroll-button {
          position: fixed;
          right: 0px;
          bottom: 0px;
          z-index: 10000;
          --scroll-button-background-color: var(--polaris-nav-bg-color);
          --simple-icon-width: 32px;
          --simple-icon-height: 32px;
          --simple-icon-button-border-radius: none;
        }
        .entry-content a {
          color: #1173ca;
        }

        header .wrap {
          padding: 0;
        }

        .site-inner {
          display: flex;
          margin: 0 auto;
        }

        .wrap {
          margin: 0 auto;
        }

        main {
          width: 100%;
        }

        article {
          background-color: var(--polaris-content-bg-color);
          font-family: var(--ddd-font-primary);
          min-width: 280px;
          min-height: 50vh;
          padding: 0 0 var(--ddd-spacing-12);
        }

        article > *:not(site-active-media-banner) {
          padding: 0 var(--polaris-standard-padding);
        }

        site-breadcrumb {
          padding: var(--ddd-spacing-12) 0 0;
        }

        /* Theme Header Section */
        header:not(:empty) {
          background-color: var(--polaris-header-bg-color);
        }

        .header-top-menu {
          font-family: var(--ddd-font-navigation);

          display: flex;
          justify-content: flex-end;
          column-gap: var(--ddd-spacing-5);

          color: white;
          margin-left: auto;
          margin-right: auto;
          padding-left: var(--polaris-standard-padding);
          padding-right: var(--polaris-standard-padding);
          padding-top: var(--ddd-spacing-2);
          text-transform: uppercase;
          font-size: var(--ddd-spacing-4);

          padding-bottom: var(--ddd-spacing-2);
        }

        .header-links,
        .header-links p {
          display: inline-flex;
          margin: 0;
          align-items: center;
          column-gap: var(--ddd-spacing-5);
        }

        .header-links a,
        site-title {
          color: var(--polaris-nav-color);
          font-weight: var(--ddd-font-weight-regular);
        }

        .header-links a:hover,
        site-title:hover {
          text-decoration: underline;
        }

        .header-branding {
          display: flex;
          justify-content: space-between;
          max-width: 1080px;
          margin: 0 auto;
          padding: var(--ddd-spacing-7) var(--polaris-standard-padding);
        }

        #mark {
          max-width: 174px;
        }

        #slot {
          line-break: auto;
          min-height: 50vh;
        }

        .nav-section {
          width: 100%;
          background-color: var(--polaris-nav-bg-color);
        }

        site-menu {
          font-family: var(--ddd-font-navigation);
          line-height: 1.5;
          --map-menu-overflow: visible;

          --a11y-collapse-transform-deg: 180deg;
          --a11y-collapse-transform-rotated-deg: 0deg;
          --site-menu-font-size: var(--ddd-font-size-3xs);
          --map-menu-item-button-active-color: var(--polaris-nav-color);
          --site-menu-container-background-color: var(--polaris-nav-bg-color);
          --map-menu-parent-background-color: var(--polaris-nav-bg-color);

          --map-menu-item-a-active-background-color: transparent;
          --map-menu-item-a-active-color: var(--polaris-nav-color);
          --map-menu-item-icon-active-color: var(--polaris-nav-color);
          --map-menu-header-a-text-decoration-hover: underline;

          --map-menu-layer-1-margin: 0 var(--ddd-spacing-9) 0 0;
          --map-menu-layer-1-font-color: var(--polaris-nav-color);
          --map-menu-layer-1-bottom-border-active: var(--ddd-border-size-lg)
            solid var(--ddd-theme-default-pughBlue);
          --map-menu-layer-2-horizontal-padding: 0
            var(--polaris-standard-padding);
          --map-menu-layer-2-active-color: var(--ddd-theme-default-nittanyNavy);
          --map-menu-layer-2-font-weight: var(--ddd-font-weight-medium);
          --map-menu-layer-2-bottom-border-active: none;
          --map-menu-layer-3-horizontal-padding: 0 var(--ddd-spacing-2);
        }

        site-modal {
          --simple-modal-titlebar-background: var(--polaris-nav-bg-color);
          --simple-icon-width: var(--ddd-spacing-9);
          --simple-icon-height: var(--ddd-spacing-9);
          padding: var(--ddd-spacing-2);
          color: var(--polaris-nav-color);
        }

        #haxcmsmobilemenubutton {
          display: none;
          color: var(--polaris-nav-color);
        }

        site-active-media-banner {
          margin: 0;
        }

        /* Theme Footer Section */
        .footer-secondary {
          background-color: var(--ddd-theme-default-nittanyNavy);
          color: white;
          clear: both;

          padding: var(--ddd-spacing-10) 0;
        }

        .footer-secondary .wrap {
          display: flex;
          justify-content: space-between;

          max-width: 1092px;
          margin: 0 auto;
          padding: 0 var(--polaris-standard-padding);
        }

        .footer-secondary-slot {
          display: inline-flex;
          column-gap: var(--ddd-spacing-5);
          flex-wrap: wrap;
        }

        .footer-secondary-slot ul {
          list-style-type: none;
          flex-wrap: wrap;
        }

        .footer-secondary-slot ul ul {
          padding-left: 0;
          line-height: 18px;
          row-gap: var(--ddd-spacing-2);
        }

        .footer-secondary-slot ul li {
          font-size: 20px;
          font-family: var(--ddd-font-navigation);
          font-weight: var(--ddd-font-weight-medium);
        }

        .footer-secondary-slot a {
          font-size: 16px;
          font-family: var(--ddd-font-navigation);
          font-weight: var(--ddd-font-weight-regular);
        }

        .footer-secondary .footer-secondary-contact {
          text-align: left;
          font-weight: var(--ddd-font-weight-regular);
        }

        .footer-secondary #mark {
          display: block;
          float: none;
        }

        .footer-secondary-media {
          max-width: 50%;
        }

        .footer-secondary-media h2 {
          margin-top: 0px;
        }
        .footer-secondary-media a {
          color: var(--ddd-theme-default-linkLight);
          text-decoration: none;
        }
        .footer-secondary-media a:hover {
          text-decoration: underline;
        }

        footer {
          font-family: var(--ddd-font-navigation);
          background-color: var(--ddd-theme-default-beaverBlue);
        }

        .footer-primary {
          color: var(--polaris-nav-color);
          line-height: 22px;
          padding: var(--ddd-spacing-5) 0;
        }

        .footer-primary-slot {
          display: flex;
          justify-content: space-between;

          margin: 0 auto;
          padding: 0 var(--polaris-standard-padding);
        }

        .footer-primary a {
          color: var(--polaris-nav-color);
          text-decoration: none;
          font-weight: var(--ddd-font-weight-regular);
          font-size: 14px;
          font-family: var(--ddd-font-navigation);
        }

        .footer-primary a:hover {
          text-decoration: underline;
        }

        .footer-primary-slot p {
          margin: 0;
        }

        .footer-primary-slot p:first-of-type {
          display: flex;
          column-gap: var(--ddd-spacing-5);
        }

        /* Theme Responsive Section */
        :host([responsive-size="md"]) {
          site-menu {
            --map-menu-layer-1-margin: 0 var(--ddd-spacing-8) 0 0;
            --map-menu-layer-2-horizontal-padding: 0 var(--polaris-md-padding);

            --map-menu-item-button-padding: 10px 0 10px 20px;
          }
          .footer-secondary .wrap {
            max-width: 920px;
            padding: 0 var(--polaris-md-padding);
          }
        }

        :host([responsive-size="sm"]) {
          .header-links {
            display: none;
          }
          .header-top-menu {
            padding: 8px 40px;
          }
          .header-branding {
            display: flex;
            justify-content: space-between;
            padding: 8px 40px;
          }
          #mark {
            margin: 15px 0;
            width: 156px;
          }
          site-modal {
            padding: 6px 0;
          }
          site-menu {
            --map-menu-item-icon-active-color: var(
              --ddd-theme-default-nittanyNavy
            );
            --site-menu-container-background-color: var(
              --ddd-theme-default-white
            );
            --map-menu-parent-background-color: var(--ddd-theme-default-white);
            --a11y-collapse-icon-position: static;

            --map-menu-width: 100%;
            --map-menu-parent-padding: 40px 0px 128px;
            --map-menu-layer-1-margin: 0px 128px;

            --map-menu-layer-1-font-color: var(--ddd-theme-default-nittanyNavy);
            --map-menu-item-a-active-color: var(
              --ddd-theme-default-nittanyNavy
            );
            --map-menu-layer-2-active-color: #262626;
            --map-menu-layer-2-text-transform: none;
          }

          #haxcmsmobilemenubutton {
            display: inline;
          }

          site-active-media-banner {
            --media-banner-height: 400px;
            --media-banner-max-width: 768px;
          }

          .footer-secondary .wrap {
            padding: 0;
            flex-direction: column;
          }

          .footer-secondary-contact #mark {
            margin: 0 auto;
            padding: 0;
          }
          .footer-secondary-contact,
          .footer-secondary-media {
            padding: 0;
            margin: 0 auto;
            text-align: center;
          }
          .footer-secondary-slot {
            justify-content: space-evenly;
          }
          .footer-secondary-media {
            max-width: 60%;
          }
          .footer-secondary-media p,
          .footer-secondary-media li {
            text-align: left;
          }
          .footer-primary {
            text-align: center;
            justify-content: center;
          }
          .footer-primary-slot {
            padding: 0;
            flex-direction: column;
          }
          .footer-primary-slot p {
            margin: 0 auto;
          }
        }

        :host([responsive-size="xs"]) {
          site-menu {
            --map-menu-item-icon-active-color: var(
              --ddd-theme-default-nittanyNavy
            );
            --site-menu-container-background-color: var(
              --ddd-theme-default-white
            );
            --map-menu-parent-background-color: var(--ddd-theme-default-white);
            --a11y-collapse-icon-position: static;

            --map-menu-width: 100%;
            --map-menu-parent-padding: 40px 0px 128px;
            --map-menu-layer-1-margin: 0px var(--polaris-xs-padding);

            --map-menu-layer-1-font-color: var(--ddd-theme-default-nittanyNavy);
            --map-menu-item-a-active-color: var(
              --ddd-theme-default-nittanyNavy
            );
            --map-menu-layer-2-active-color: #262626;
            --map-menu-layer-2-text-transform: none;
          }
          site-modal {
            padding: var(--ddd-spacing-2) 0;
          }
          .header-links {
            display: none;
          }
          .header-top-menu {
            padding: var(--ddd-spacing-2) var(--polaris-xs-padding);
          }
          .header-branding {
            display: flex;
            justify-content: space-between;
            padding: var(--ddd-spacing-2) var(--polaris-xs-padding);
          }
          #mark {
            margin: 15px 0;
            width: 146px;
          }
          #haxcmsmobilemenubutton {
            display: inline;
          }
          site-active-media-banner {
            --media-banner-height: 360px;
            --media-banner-max-width: 360px;
          }
          .footer-secondary .wrap {
            padding: 0;
            flex-direction: column;
          }

          .footer-secondary-contact #mark {
            margin: 0 auto;
            padding: 0;
          }
          .footer-secondary-contact,
          .footer-secondary-media {
            padding: 0;
            margin: 0 auto;
            text-align: center;
          }
          .footer-secondary-slot {
            justify-content: space-evenly;
          }
          .footer-secondary-media {
            max-width: 75%;
          }
          .footer-secondary-media p,
          .footer-secondary-media li {
            text-align: left;
          }
          .footer-primary {
            text-align: center;
            justify-content: center;
          }
          .footer-primary-slot {
            padding: 0;
            flex-direction: column;
          }
          .footer-primary-slot p {
            margin: 0 auto;
          }
        }
        :host([responsive-size="sm"]:not([menu-open])),
        :host([responsive-size="xs"]:not([menu-open])) {
          site-menu {
            display: none;
          }
        }

        :host([responsive-size="xl"]) main {
          width: calc(var(--menu-size) + 70%);
          margin: 0 auto;
        }
        :host([responsive-size="lg"]) main {
          width: calc(var(--menu-size) + 70%);
          margin: 0 auto;
        }
        :host([responsive-size="md"]) main {
          width: calc(var(--menu-size) + 65%);
          margin: 0 auto;
        }
        :host([responsive-size="sm"]) main {
          width: calc(var(--menu-size) + 40%);
          margin: 0 auto;
        }
        :host([responsive-size="xs"]) main {
          width: calc(var(--menu-size) + 20%);
          margin: 0 auto;
        }

        /** stuff to refactor out after this is initially working visually */
        #mark {
          display: inline-flex;
          float: left;
        }
        #mark a {
          display: block;
        }

        img {
          height: auto;
          width: auto;
        }
        embed,
        iframe,
        img,
        object,
        video,
        .wp-caption {
          max-width: 100%;
        }
        .wrap:after {
          clear: both;
          content: " ";
          display: table;
        }
        .wrap:before {
          content: " ";
          display: table;
        }

        .footer-secondary p {
          margin: 0 0 24px;
          padding: 0;
          font-size: 16px;
          line-height: 26px;
        }
        .footer-logo img {
          width: 110px;
        }
        .footer-logo {
          float: left;
          margin-right: 30px;
        }

        a img {
          margin-bottom: -4px;
        }
        img {
          height: auto;
          width: auto;
        }
        .footer_links a {
          margin: 0 8px;
        }
        .footer_links {
          text-align: left;
          padding-top: 3px;
        }

        #haxcmsmobilemenubutton {
          padding: 0px;
          --simple-icon-height: 30px;
          --simple-icon-width: 30px;
          margin: 2px 6px 0 6px;
        }
        @media only screen and (max-width: 1023px) {
          scroll-button {
            --simple-icon-width: 20px;
            --simple-icon-height: 20px;
          }
        }
        /* ensure iframe content doesn't get bigger than the main area */
        :host([responsive-size]) main ::slotted(iframe) {
          max-width: 100%;
        }

        :host {
          --menu-size: 300px;
        }
        :host([menu-open]) {
          --menu-size: 0px;
        }
        :host([menu-open]) .left-col {
          margin-left: 0px;
          position: sticky;
          margin-top: 8px;
        }

        .search-modal-btn {
          --simple-icon-height: 24px;
          --simple-icon-width: 24px;
          transition: 0.3s ease-in all;
        }

        :host([menu-open]) .search-modal-btn {
          display: inline-flex;
        }
      `,
    ];
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.HAXCMSThemeSettings.scrollTarget =
      this.shadowRoot.querySelector("#main");
    globalThis.AbsolutePositionStateManager.requestAvailability().scrollTarget =
      this.HAXCMSThemeSettings.scrollTarget;

    // hook up the scroll target
    this.shadowRoot.querySelector("scroll-button").target =
      this.shadowRoot.querySelector("#main");
  }

  renderBrandMark() {
    return html`
      <div id="mark">
        <a href="${this.imageLink}">
          <img
            src="${this.image}"
            alt="${this.imageAlt}"
            loading="lazy"
            decoding="async"
            fetchpriority="low"
          />
        </a>
      </div>
    `;
  }

  renderHeaderSlot() {
    return html` <p class="site-title" itemprop="headline">
      <site-title
        .part="${this.editMode ? `edit-mode-active` : ``}"
        ?disabled="${this.editMode}"
        part="site-title"
      ></site-title>
    </p>`;
  }

  renderSideBar() {
    return html``;
  }

  renderFooterContactInformation() {
    return html``;
  }

  renderFooterSecondarySlot() {
    return html``;
  }

  renderFooterPrimarySlot() {
    return html``;
  }
  // render function
  render() {
    return html`
      <div id="haxcms-theme-top"></div>
      <header itemtype="http://schema.org/WPHeader">
        <div class="wrap">
          <div class="header-top-menu">
            <site-modal
              @site-modal-click="${this.siteModalClick}"
              .part="${this.editMode ? `edit-mode-active` : ``}"
              ?disabled="${this.editMode}"
              icon="icons:search"
              title="Search site"
              class="search-modal-btn"
              button-label="Search"
              part="search-btn"
              position="left"
            >
              <site-search></site-search>
            </site-modal>
            <site-region name="header"></site-region>
            <div class="header-links">
              <slot name="header"> ${this.renderHeaderSlot()} </slot>
            </div>
          </div>
          <div class="nav-section">
            <div class="header-branding">
              ${this.renderBrandMark()} ${this.HAXCMSMobileMenuButton("left")}
            </div>

            ${this.HAXCMSFlexMenu()}
          </div>
          <site-active-media-banner></site-active-media-banner>
        </div>
      </header>
      <div class="content site-inner">
        ${this.renderSideBar()}
        <main id="main">
          <article id="contentcontainer">
            <site-breadcrumb part="page-breadcrumb"></site-breadcrumb>
            <site-active-tags
              part="page-tags"
              auto-accent-color
            ></site-active-tags>
            <div class="main-section">
              <section id="slot" part="slot">
                <slot></slot>
              </section>
            </div>
          </article>
        </main>
      </div>
      <footer
        itemtype="http://schema.org/WPFooter"
        .part="${this.editMode ? `edit-mode-active` : ``}"
      >
        <section class="footer-secondary">
          <site-region name="footerSecondary"></site-region>
          <div class="wrap">
            <div class="footer-secondary-contact">
              ${this.renderBrandMark()} ${this.renderFooterContactInformation()}
            </div>
            <div class="footer-secondary-media">
              <slot name="footer-secondary" class="footer-secondary-slot">
                ${this.renderFooterSecondarySlot()}
              </slot>
            </div>
          </div>
        </section>
        <section class="footer-primary">
          <div class="wrap">
            <site-region name="footerPrimary"></site-region>
            <slot name="footer-primary" class="footer-primary-slot">
              ${this.renderFooterPrimarySlot()}
            </slot>
          </div>
        </section>
        <scroll-button position="left"></scroll-button>
      </footer>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    let props = {};
    if (super.properties) {
      props = super.properties;
    }
    return {
      ...props,
      haxTrayAlignment: {
        type: String,
        reflect: true,
        attribute: "hax-tray-alignment",
      },
      searchTerm: {
        type: String,
      },
      siteDescription: {
        type: String,
      },
      imageLink: {
        type: String,
      },
      image: {
        type: String,
      },
      imageAlt: {
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
    return "polaris-flex-theme";
  }

  appStoreReady(e) {
    if (globalThis.HaxStore && globalThis.HaxStore.requestAvailability()) {
      let store = globalThis.HaxStore.requestAvailability();
      // elements that are in HAXcms that are injected regardless of what editor says
      // because the CMS controls certain internal connectors
      [
        "polaris-cta",
        "polaris-mark",
        "polaris-story-card",
        "polaris-tile",
        "simple-cta",
        "ddd-card",
        "media-quote",
      ].map((name) => {
        let el = globalThis.document.createElement(name);
        store.haxAutoloader.appendChild(el);
      });
      this.windowControllersLoaded.abort();
    }
  }
  /**
   * Add elements to cheat on initial paint here
   */
  constructor() {
    super();
    // helps with user preference on side of screen for the tray
    this.haxTrayAlignment = localStorageGet("hax-tray-elementAlign");
    // forcibly set things about the RPG toast for this design
    HAXCMSToastInstance.style.setProperty(
      "--rpg-character-toast-display",
      "none",
    );
    HAXCMSToastInstance.style.setProperty(
      "--rpg-character-toast-mid-background-image",
      "none",
    );
    HAXCMSToastInstance.style.setProperty(
      "--rpg-character-toast-right-background-image",
      "none",
    );
    HAXCMSToastInstance.style.setProperty(
      "--rpg-character-toast-left-background-image",
      "none",
    );
    HAXCMSToastInstance.style.setProperty(
      "--rpg-character-toast-mid-padding",
      0,
    );
    HAXCMSToastInstance.style.setProperty(
      "--rpg-character-toast-height",
      "96px",
    );
    HAXCMSToastInstance.style.backgroundColor =
      "light-dark(var(--ddd-accent-6), var(--ddd-primary-4))";
    this.windowControllersLoaded = new AbortController();
    globalThis.addEventListener(
      "hax-store-app-store-loaded",
      this.appStoreReady.bind(this),
      {
        once: true,
        passive: true,
        signal: this.windowControllersLoaded.signal,
      },
    );
    // @todo support injection of blocks specific to polaris
    // this way we can have blocks whos definitions only get
    // loaded in when we have a theme that intentionally
    // has been designed around them
    this.searchTerm = "";
    this.imageAlt = "";
    this.image = "";
    this.imageLink = "";
    this.__disposer = this.__disposer ? this.__disposer : [];

    autorun((reaction) => {
      if (store.themeData && store.themeData.variables) {
        const vars = toJS(store.themeData.variables);
        this.imageAlt = vars.imageAlt;
        this.image = vars.image;
        this.imageLink = vars.imageLink;
      }
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.siteDescription = toJS(store.siteDescription);
      this.__disposer.push(reaction);
    });
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

  /**
   * Handle edit mode changes and force menu to close to prevent clipping
   */
  _editModeChanged(newValue, oldValue) {
    if (super._editModeChanged) {
      super._editModeChanged(newValue, oldValue);
    }
    // Force close the mobile menu when entering edit mode to prevent clipping
    if (newValue === true && this.menuOpen) {
      this.__HAXCMSMobileMenuToggle();
    }
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
globalThis.customElements.define(PolarisFlexTheme.tag, PolarisFlexTheme);
export { PolarisFlexTheme };

function localStorageGet(name, defaultValue = "") {
  try {
    if (localStorage.getItem(name) === null) {
      return defaultValue;
    }
    return JSON.parse(localStorage.getItem(name));
  } catch (e) {
    return false;
  }
}
