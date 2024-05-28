/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css, unsafeCSS } from "lit";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSThemeParts } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { HAXCMSRememberRoute } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSRememberRoute.js";
import { QRCodeMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/QRCodeMixin.js";
import { HAXCMSMobileMenuMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSMobileMenu.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/scroll-button/scroll-button.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-tags.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js";
import { SimpleColorsSuper } from "@haxtheweb/simple-colors/simple-colors.js";
import { PrintBranchMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/PrintBranchMixin.js";
import { PDFPageMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/PDFPageMixin.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu-button.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

/**
 * `clean-one`
 * `Clean HAXcms theme, one.`
 *
 * @microcopy - language worth noting:
 *  - HAXcms - A headless content management system
 *  - HAXCMSTheme - A super class that provides correct baseline wiring to build a new theme
 *
 * @demo demo/index.html
 * @element clean-one
 */
class AppHaxTheme extends HAXCMSRememberRoute(
  PrintBranchMixin(
    PDFPageMixin(
      QRCodeMixin(
        HAXCMSThemeParts(
          HAXCMSMobileMenuMixin(
            SimpleColorsSuper(DDDSuper(HAXCMSLitElementTheme)),
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
          color: #242a31;
          width: 100%;
          margin: 0;
          display: flex;
          padding: 0;
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
        #haxcmsmobilemenunav {
          height: 100vh;
          overflow-y: auto;
        }
        scroll-button,
        site-breadcrumb {
          color: var(--haxcms-user-styles-color-theme-color-1);
        }
        * {
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          -webkit-overflow-scrolling: touch;
          -webkit-tap-highlight-color: transparent;
          -webkit-text-size-adjust: none;
          -webkit-touch-callout: none;
          -webkit-font-smoothing: antialiased;
        }
        /* links */

        a {
          text-decoration: none;
        }
        a:hover,
        a:focus,
        a:active {
          outline: thin dotted;
        }
        a:-webkit-any-link {
          color: -webkit-link;
          cursor: pointer;
          text-decoration: underline;
        }
        :host([menu-open]) .menu-outline {
          left: 0;
        }
        .menu-outline {
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          position: absolute;
          top: 0;
          left: -300px;
          bottom: 0;
          z-index: 1;
          overflow-y: hidden;
          width: 300px;
          color: #364149;
          background-color: #ffffffee;
          border-right: 1px solid rgba(0, 0, 0, 0.07);
          transition: left 0.3s ease;
        }
        :host([dark]) .menu-outline {
          color: white;
          background-color: #000000aa;
        }
        /* content */
        .main-section h1 {
          font-size: 2em;
        }
        :host([edit-mode]) .main-section {
          outline: 1px solid grey;
          outline-offset: 20px;
        }
        .main-content h1,
        .main-content h2,
        .main-content h3,
        .main-content h4,
        .main-content h5,
        .main-content h6 {
          margin-top: 1.275em;
          margin-bottom: 0.85em;
          font-weight: 700;
        }
        .main-content h1,
        .main-content h2,
        .main-content h3,
        .main-content h4,
        .main-content h5 {
          page-break-after: avoid;
        }
        :host([responsive-size="xs"][menu-open]) .pull-right {
          display: none;
        }
        .pull-right {
          top: 0px;
          right: 16px;
          position: fixed;
        }
        .main-content *,
        .main-content ::slotted(*) {
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          font-size: inherit;
        }
        @media (prefers-reduced-motion: reduce) {
          .site-body,
          .navigation,
          .menu-outline {
            transition: none !important;
          }
        }

        :host([menu-open]) .site-body {
          left: 300px;
        }
        .site-body {
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          min-width: 400px;
          overflow-y: auto;
          transition: left 0.3s ease;
        }

        :host([responsive-size="xs"]) .page-inner,
        :host([responsive-size="sm"]) .page-inner,
        :host([responsive-size="md"]) .page-inner,
        :host([responsive-size="lg"]) .page-inner {
          padding: 48px 0px 48px 28px;
        }
        :host([responsive-size="sm"]) .site-inner {
          padding: 0px 24px;
        }

        :host([responsive-size="xs"]) .page-inner {
          overflow-x: auto;
        }
        @media screen and (max-width: 640px) {
          site-breadcrumb {
            display: none;
          }
          .site-header {
            padding: 0px;
          }
          .header {
            height: 0px;
          }
          .main-content site-active-title h1 {
            height: 48px;
            overflow: hidden;
            margin-top: 64px;
            text-overflow: ellipsis;
            word-break: break-all;
            margin-top: 64px;
            margin-bottom: 8px;
          }
        }
        h1 {
          font-size: 2em;
          margin: 0.67em 0;
        }
        .main-content h2 {
          font-size: 1.75em;
        }
        .main-content h3 {
          font-size: 1.5em;
        }
        .main-content h4 {
          font-size: 1.25em;
        }
        .main-content h5 {
          font-size: 1em;
        }
        .main-content h6 {
          font-size: 1em;
          color: #777;
        }
        .main-content h1,
        .main-content h2,
        .main-content h3,
        .main-content h4,
        .main-content h5,
        .main-content h6 {
          margin-top: 1.275em;
          margin-bottom: 0.85em;
          font-weight: 700;
        }

        .main-content h1,
        .main-content h2,
        .main-content h3,
        .main-content h4,
        .main-content h5 {
          page-break-after: avoid;
        }
        .main-content h2,
        .main-content h3,
        .main-content h4,
        .main-content h5,
        .main-content p {
          orphans: 3;
          widows: 3;
        }
        .main-content blockquote,
        .main-content dl,
        .main-content ol,
        .main-content p,
        .main-content table,
        .main-content ul {
          margin-top: 0;
          margin-bottom: 0.85em;
        }
        .main-content ol,
        .main-content ul {
          padding: 0;
          margin: 0;
          margin-bottom: 0.85em;
          padding-left: 2em;
        }
        .main-content h2,
        .main-content h3,
        .main-content h4,
        .main-content h5,
        .main-content p {
          orphans: 3;
          widows: 3;
        }
        article,
        aside,
        details,
        figcaption,
        figure,
        header,
        hgroup,
        main,
        nav,
        section,
        summary {
          display: block;
        }
        footer {
          display: flex;
          max-width: 860px;
          padding-bottom: 24px;
        }
        .site-header {
          overflow: visible;
          z-index: 2;
          background: transparent;
          position: fixed;
          display: block;
          padding: 0 16px;
        }
        @media (max-width: 1200px) {
          .site-header {
            height: 50px;
            position: fixed;
            width: 100vw;
            background-color: white;
          }
        }
        @media (max-width: 900px) {
          footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
          }
          :host([menu-open]) footer {
            left: 300px;
          }
        }

        @media (max-width: 700px) {
          .link-actions {
            display: none;
          }
        }
        @media (max-width: 1240px) {
          .site-body .body-inner {
            position: static;
            min-height: calc(100% - 98px);
          }
        }
        @media (max-width: 1240px) {
          .site-body {
            padding-bottom: 20px;
          }
        }
        .site-body .site-inner {
          position: relative;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          overflow-y: auto;
        }
        .main-content * {
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          font-size: inherit;
        }
        .page-wrapper {
          position: relative;
          outline: 0;
        }
        .page-inner {
          position: relative;
          max-width: 840px;
          margin: 0 24px;
          min-height: 90vh;
          padding: 20px 15px 40px 15px;
          background-color: #ffffffaa;
        }
        :host([dark]) .page-inner {
          color: white;
          background-color: #000000aa;
        }
        .main-section {
          display: block;
          word-wrap: break-word;
          color: var(--haxcms-user-styles-color-theme-color-color);
          line-height: 1.7;
          text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
          -moz-text-size-adjust: 100%;
        }
        /* Navigation arrows */
        site-menu-button {
          --site-menu-button-icon-width: 48px;
          --site-menu-button-icon-height: 48px;
        }
        .main-content site-active-title h1 {
          font-size: 36px;
          margin: 20px 0;
          text-rendering: optimizeLegibility;
        }
        .navigation {
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-content: center;
          flex-direction: column;
          font-size: 40px;
          color: #ccc;
          text-align: center;
        }
        @media screen and (max-width: 600px) {
          #slot ::slotted(iframe) {
            width: auto;
          }
          #slot ::slotted(h1),
          #slot ::slotted(h2),
          #slot ::slotted(h3) {
            font-size: 1.5em !important;
          }
          #slot ::slotted(h4),
          #slot ::slotted(h5),
          #slot ::slotted(h6) {
            font-size: 1.2em !important;
          }
          #slot ::slotted(replace-tag) {
            overflow: hidden;
          }
        }
        @media (max-width: 1240px) {
          .navigation {
            position: static;
            margin: 0 auto;
            display: inline-flex;
          }
        }
        /* color,font,size switchers */

        .site-header .font-settings .font-enlarge {
          line-height: 30px;
          font-size: 1.4em;
        }
        .site-header .font-settings .font-reduce {
          line-height: 30px;
          font-size: 1em;
        }
        .site-header .font-settings .font-reduce {
          line-height: 30px;
          font-size: 1em;
        }

        .site-body {
          overflow-y: scroll;
          color: var(--haxcms-user-styles-color-theme-color-color);
        }
        button,
        select {
          text-transform: none;
        }
        button,
        input {
          line-height: normal;
        }
        button,
        input,
        select,
        textarea {
          font-family: inherit;
          font-size: 100%;
          margin: 0;
        }
        scroll-button {
          position: absolute;
          bottom: 0;
          right: 16px;
        }
      `,
    ];
  }

  // render function
  render() {
    return html`
      <div class="site">
        <div class="menu-outline">${this.HAXCMSMobileMenu()}</div>
        <div id="body" class="site-body" part="site-body">
          <div id="haxcms-theme-top"></div>
          <div class="site-inner">
            <main class="page-wrapper" role="main">
              <article class="main-content page-inner">
                ${this.HAXCMSMobileMenuButton()}

                <site-breadcrumb
                  part="page-breadcrumb ${this.editMode
                    ? `edit-mode-active`
                    : ``}"
                ></site-breadcrumb>
                <site-active-title part="page-title"></site-active-title>
                <site-active-tags
                  part="page-tags"
                  auto-accent-color
                ></site-active-tags>
                <div class="normal main-section">
                  <section id="contentcontainer">
                    <div id="slot">
                      <slot></slot>
                    </div>
                  </section>
                </div>
              </article>
            </main>
          </div>
          <footer>
            <!-- These two buttons allow you to go left and right through the pages in the manifest -->
            <site-menu-button
              type="prev"
              position="right"
              class="navigation"
            ></site-menu-button>
            <site-menu-button
              type="next"
              position="left"
              class="navigation"
            ></site-menu-button>
          </footer>
        </div>
        <scroll-button
          .part="${this.editMode ? `edit-mode-active` : ``}"
        ></scroll-button>
      </div>
    `;
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "app-hax-theme";
  }
  /**
   * Add elements to cheat on initial paint here
   */
  constructor() {
    super();
    this.HAXCMSThemeSettings.autoScroll = true;
    this.__disposer = this.__disposer ? this.__disposer : [];
    autorun((reaction) => {
      this.activeManifestIndex = toJS(store.activeManifestIndex);
      this.__disposer.push(reaction);
    });
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // only way to hit this
    globalThis.document.body.style.overflow = "hidden";
    this.HAXCMSThemeSettings.scrollTarget =
      this.shadowRoot.querySelector("#body");
    globalThis.AbsolutePositionStateManager.requestAvailability().scrollTarget =
      this.HAXCMSThemeSettings.scrollTarget;

    // hook up the scroll target
    this.shadowRoot.querySelector("scroll-button").target =
      this.shadowRoot.querySelector("#haxcms-theme-top");
  }
  HAXCMSGlobalStyleSheetContent() {
    const LMGridBox = new URL("./assets/images/LMGridBox.svg", import.meta.url)
      .href;
    const DMGridBox = new URL("./assets/images/DMGridBox.svg", import.meta.url)
      .href;
    const DesignLightModeLeft = new URL(
      "./assets/images/DesignLightModeLeft.svg",
      import.meta.url,
    ).href;
    const DesignLightModeRight = new URL(
      "./assets/images/DesignLightModeRight.svg",
      import.meta.url,
    ).href;
    const DesignDarkModeLeft = new URL(
      "./assets/images/DesignDarkModeLeft.svg",
      import.meta.url,
    ).href;
    const DesignDarkModeRight = new URL(
      "./assets/images/DesignDarkModeRight.svg",
      import.meta.url,
    ).href;
    return [
      ...super.HAXCMSGlobalStyleSheetContent(),
      css`
        body {
          margin: 0;
          padding: 0;
          font-family: "Press Start 2P", sans-serif;
          overflow-x: hidden;
          background-image: url("${unsafeCSS(LMGridBox)}");
          background-repeat: repeat;
          background-position: center center;
          background-size:
            auto,
            20% auto,
            20% auto;
          --app-hax-accent-color: black;
          --app-hax-background-color: white;
          --simple-tooltip-background: #000000;
          --simple-tooltip-opacity: 1;
          --simple-tooltip-text-color: #ffffff;
          --simple-tooltip-delay-in: 0;
          --simple-tooltip-duration-in: 200ms;
          --simple-tooltip-duration-out: 0;
          --simple-tooltip-border-radius: 0;
          --simple-tooltip-font-size: 14px;
        }
        body.app-hax-create {
          overflow: hidden;
        }
        body.dark-mode {
          background-color: black;
          background-image: url("${unsafeCSS(DMGridBox)}");
          --app-hax-accent-color: white;
          --app-hax-background-color: black;
        }
        body:not(.bad-device) {
          background-image: url("${unsafeCSS(LMGridBox)}"),
            url("${unsafeCSS(DesignLightModeLeft)}"),
            url("${unsafeCSS(DesignLightModeRight)}");
          background-repeat: repeat, repeat-y, repeat-y;
          background-position:
            center center,
            top left,
            top right;
          background-size:
            auto,
            20% auto,
            20% auto;
          background-attachment: fixed, fixed, fixed;
        }
        div[slot="externalproviders"] {
          display: none;
        }
        body div[slot="externalproviders"] {
          display: unset;
        }
        body.dark-mode {
          background-image: url("${unsafeCSS(DMGridBox)}"),
            url("${unsafeCSS(DesignDarkModeLeft)}"),
            url("${unsafeCSS(DesignDarkModeRight)}");
        }

        #loading {
          font-family: "Press Start 2P", sans-serif;
          text-align: center;
          margin-top: 100px;
        }

        #loading .title {
          -webkit-text-stroke: 1px
            var(--app-hax-accent-color, var(--accent-color));
          -webkit-text-fill-color: var(
            --app-hax-background-color,
            var(--background-color)
          );
          font-weight: normal;
          font-size: 4vw;
          display: inline-flex;
          align-items: center;
        }

        #loading .subtitle {
          color: var(--app-hax-accent-color, var(--accent-color));
          font-weight: normal;
          margin-top: 2.5px;
          font-size: 2vw;
        }

        #loading .bracket {
          font-size: 10vw;
          font-weight: normal;
          vertical-align: middle;
          -webkit-text-stroke: 0px;
          -webkit-text-fill-color: var(
            --app-hax-accent-color,
            var(--accent-color)
          );
        }

        @media (min-width: 721px) {
          :root {
            background-size:
              auto,
              23% auto,
              23% auto;
          }
        }

        @media (min-width: 601px) and (max-width: 720px) {
          :root {
            background-size:
              auto,
              26% auto,
              26% auto;
          }
        }

        @media (min-width: 481px) and (max-width: 600px) {
          :root {
            background-size:
              auto,
              30% auto,
              30% auto;
          }
        }

        @media (min-width: 371px) and (max-width: 480px) {
          :root {
            background-size:
              auto,
              35% auto,
              35% auto;
          }
        }

        @media (max-width: 370px) {
          :root {
            background-size:
              auto,
              37% auto,
              37% auto;
          }
        }
        .version {
          position: fixed;
          left: 0;
          bottom: 0;
          background-color: var(--simple-colors-default-theme-yellow-6);
          display: inline-block;
          padding: 8px;
          color: var(--simple-colors-default-theme-grey-12);
          border-right: 3px solid var(--simple-colors-default-theme-grey-12);
          border-top: 3px solid var(--simple-colors-default-theme-grey-12);
        }
        body.dark-mode .version {
          background-color: var(--simple-colors-default-theme-yellow-8);
          color: var(--simple-colors-default-theme-grey-1);
          border-right: 3px solid var(--simple-colors-default-theme-grey-1);
          border-top: 3px solid var(--simple-colors-default-theme-grey-1);
        }
        simple-modal::part(title) {
          background-color: transparent;
          margin: 0;
          padding: 0;
          text-align: center;
          font-size: 20px;
          line-height: 20px;
          color: black;
        }
        simple-modal button.hax-modal-btn {
          font-size: 30px;
          padding: 8px;
          margin: 4px;
          color: white;
          background-color: green;
          border: 4px solid black;
          border-radius: 8px;
          font-family: "Press Start 2P", sans-serif;
        }
        simple-modal button.hax-modal-btn.cancel {
          background-color: red;
        }
        simple-modal button.hax-modal-btn:hover,
        simple-modal button.hax-modal-btn:focus {
          outline: 2px solid black;
          cursor: pointer;
          background-color: darkgreen;
        }
        simple-modal button.hax-modal-btn.cancel:hover,
        simple-modal button.hax-modal-btn.cancel:focus {
          background-color: darkred;
        }
      `,
    ];
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
customElements.define(AppHaxTheme.tag, AppHaxTheme);
export { AppHaxTheme };
