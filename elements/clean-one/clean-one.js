/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { HAXCMSLitElementTheme } from "@lrnwebcomponents/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSThemeParts } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { HAXCMSMobileMenuMixin } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSMobileMenu.js";
import { HAXCMSUserStylesMenuMixin } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSUserStylesMenu.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";

import "@lrnwebcomponents/scroll-button/scroll-button.js";

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
class CleanOne extends HAXCMSThemeParts(
  HAXCMSUserStylesMenuMixin(
    HAXCMSMobileMenuMixin(
      HAXCMSLitElementTheme
    )
  )
) {
  //styles function
  static get styles() {
    return [
      ...super.styles,
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
          --haxcms-base-styles-body-font-size:14px;
          --hax-base-styles-a-font-size: 14px;
          --hax-base-styles-p-font-size: 14px;
          --hax-base-styles-list-font-size: 14px;
          --haxcms-base-styles-body-font-family: "Helvetica Neue",Helvetica,Arial,sans-serif
          --haxcms-base-styles-body-line-height: 1.7;
          --hax-base-styles-list-line-height: 1.7;
          --hax-base-styles-p-line-height: 1.7;
          --hax-base-styles-p-letter-spacing: .2px;
          --haxcms-base-styles-body-letter-spacing : .2px;
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
        site-git-corner {
          --site-git-corner-background: black;
        }
        simple-tooltip {
          --simple-tooltip-background: var(
            --haxcms-tooltip-background-color,
            #000000
          );
          --simple-tooltip-text-color: var(
            --haxcms-tooltip-color,
            #ffffff
          );
          --simple-tooltip-opacity: 1;
          --simple-tooltip-delay-in: 0;
          --simple-tooltip-border-radius: 0;
        }

        :host([hidden]) {
          display: none;
        }
        [hidden] {
          display: none;
        }
        site-menu-button:not(:defined) {
          display: none;
        }
        .btn-container {
          z-index: 2;
          height: 50px;
          padding: 6px;
        }
        simple-tooltip {
          --simple-tooltip-background: var(--haxcms-user-styles-color-theme-color-1);
          --simple-tooltip-text-color: var(--haxcms-user-styles-color-theme-color-2);
        }
        site-menu {
          --site-menu-active-color: var(--haxcms-user-styles-color-theme-color-3);
          --site-menu-item-active-item-color: var(--haxcms-user-styles-color-theme-color-4);
          --haxcms-tooltip-color: var(--haxcms-user-styles-color-theme-color-2);
          --haxcms-tooltip-background-color: var(--haxcms-user-styles-color-theme-color-1);
        }
        scroll-button {
          --scroll-button-color: var(--haxcms-user-styles-color-theme-color-1);
          --scroll-button-background-color: var(--haxcms-user-styles-color-theme-color-2);
          --scroll-button-tooltip-background-color:var(--haxcms-user-styles-color-theme-color-1);
          --scroll-button-tooltip-color: var(--haxcms-user-styles-color-theme-color-2);
        }
        paper-icon-button,
        site-rss-button,
        site-print-button,
        site-git-corner {
          --site-git-corner-background: var(--haxcms-user-styles-color-theme-color-1);
          --site-git-corner-color: var(--haxcms-user-styles-color-theme-color-2);
          --iron-icon-fill-color: var(--haxcms-user-styles-color-theme-color-1);
          --haxcms-tooltip-color: var(--haxcms-user-styles-color-theme-color-2);
          --haxcms-tooltip-background-color: var(--haxcms-user-styles-color-theme-color-1);
        }
        site-menu-button {
          --site-menu-button-icon-fill-color: var(--haxcms-user-styles-color-theme-color-1);
          --haxcms-tooltip-color: var(--haxcms-user-styles-color-theme-color-2);
          --haxcms-tooltip-background-color: var(--haxcms-user-styles-color-theme-color-1);
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
        :host([is-logged-in][menu-open]) .menu-outline {
          left: 48px;
        }
        .menu-outline {
          font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
          position: absolute;
          top: 0;
          left: -300px;
          bottom: 0;
          z-index: 1;
          overflow-y: auto;
          width: 300px;
          color: #364149;
          background: #fafafa;
          border-right: 1px solid rgba(0,0,0,.07);
          transition: left 250ms ease;
        }
        /* content */
        .main-content>:first-child {
          margin-top: 0!important;
        }
        .main-section h1 {
          font-size: 2em;
        }
        :host([edit-mode]) .main-section {
          outline: 1px solid grey;
          outline-offset: 20px;
        }
        .main-content h1, .main-content h2, .main-content h3, .main-content h4, .main-content h5, .main-content h6 {
          margin-top: 1.275em;
          margin-bottom: .85em;
          font-weight: 700;
        }
        .main-content h1, .main-content h2, .main-content h3, .main-content h4, .main-content h5 {
          page-break-after: avoid;
        }
        .pull-right {
          float: right;
        }
        .main-content *,
        .main-content ::slotted(*) {
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          font-size: inherit;
        }
        @media (prefers-reduced-motion: reduce) {
          #site-search-input,
          .site-body,
          .navigation,
          .site-header site-active-title h1,
          .menu-outline {
            transition: none !important;
          }
        }

        :host([menu-open]) .site-body {
          left: 300px;
        }
        :host([is-logged-in][menu-open]) .site-body {
          left: 348px;
        }
        :host([is-logged-in]) .site-body {
          left: 48px;
        }
        .site-body {
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          min-width: 400px;
          overflow-y: auto;
          transition: left 250ms ease;
        }
        h1 {
          font-size: 2em;
          margin: .67em 0;
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
        .main-content h1, .main-content h2, .main-content h3, .main-content h4, .main-content h5, .main-content h6 {
          margin-top: 1.275em;
          margin-bottom: .85em;
          font-weight: 700;
        }

        .main-content h1, .main-content h2, .main-content h3, .main-content h4, .main-content h5 {
          page-break-after: avoid;
        }
        .main-content h2, .main-content h3, .main-content h4, .main-content h5, .main-content p {
          orphans: 3;
          widows: 3;
        }
        .main-content blockquote, .main-content dl, .main-content ol, .main-content p, .main-content table, .main-content ul {
          margin-top: 0;
          margin-bottom: .85em;
        }
        .main-content ol, .main-content ul {
          padding: 0;
          margin: 0;
          margin-bottom: .85em;
          padding-left: 2em;
        }
        .main-content h2, .main-content h3, .main-content h4, .main-content h5, .main-content p {
          orphans: 3;
          widows: 3;
        }
        article, aside, details, figcaption, figure, footer, header, hgroup, main, nav, section, summary {
          display: block;
        }
        .site-header {
          font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
          overflow: visible;
          height: 50px;
          padding: 0 8px;
          z-index: 2;
          font-size: .85em;
          color: #7e888b;
          background: 0 0;
        }
        .site-header site-active-title h1 {
          color: inherit;
          text-decoration: none;
          position: absolute;
          z-index: 1;
          top: 0;
          left: 0;
          right: 0;
          margin: 10px 200px;
          font-size: 20px;
          font-weight: 200;
          text-align: center;
          line-height: 50px;
          opacity: 0;
          transition: opacity .2s ease;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .site-header site-active-title h1:hover {
          opacity: 1;
        }
        @media (max-width: 700px){
          .link-actions {
            display: none;
          }
        }
        @media (max-width: 1000px){
          .site-header site-active-title {
              display: none;
          }
        }
        @media (max-width: 1240px){
          .site-body .body-inner {
            position: static;
            min-height: calc(100% - 50px);
          }
        }
        @media (max-width: 1240px){
          .site-body {
            transition: transform 200ms ease;
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
          max-width: 800px;
          margin: 0 auto;
          min-height: 90vh;
          padding: 20px 15px 40px 15px;
        }
        .main-section {
          display: block;
          word-wrap: break-word;
          color: #333;
          line-height: 1.7;
          text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
          -moz-text-size-adjust: 100%;
        }
        /* Navigation arrows */
        site-menu-button {
          --site-menu-button-icon-width: 64px;
          --site-menu-button-icon-height: 64px;
        }
        :host([is-logged-in][menu-open]) site-menu-button[type="prev"] {
          left: 348px;
        }
        :host([is-logged-in]) site-menu-button[type="prev"] {
          left: 48px;
        }
        :host([menu-open]) site-menu-button[type="prev"] {
          left: 300px;
        }
        site-menu-button[type="prev"] {
          left: 0;
        }
        site-menu-button[type="next"] {
          right: 0;
        }
        .navigation {
          position: fixed;
          top: 50px;
          bottom: 0;
          margin: 0;
          max-width: 150px;
          min-width: 90px;
          display: flex;
          justify-content: center;
          align-content: center;
          flex-direction: column;
          font-size: 40px;
          color: #ccc;
          text-align: center;
          transition: all .35s ease;
        }
        @media (max-width: 1240px) {
          .navigation {
            position: static;
            top: auto;
            max-width: 50%;
            width: 50%;
            display: inline-block;
            float: left;
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
            color: var(--haxcms-user-styles-color-theme-color-color);
            background: var(--haxcms-user-styles-color-theme-color-background);
          }
          :host([color-theme="1"]) .site-header {
            color: #afa790;
            background: transparent;
          }
          :host([color-theme="1"]) .site-header .btn {
            color: #eee8e0;
          }
          :host([color-theme="1"]) .site-header .btn:hover,
          :host([color-theme="1"]) .site-header .btn:focus,
          :host([color-theme="1"]) .site-header .btn:active {
            color: #eee8e0;
            background: none;
          }
          :host([color-theme="1"]) .site-header site-active-title {
            color: #704214;
          }
          :host([color-theme="2"]) .site-header {
            color: #7e888b;
            background: transparent;
          }
          :host([color-theme="2"]) .site-header .btn {
            color: #3b3f54;
          }
          :host([color-theme="2"]) .site-header .btn:hover,
          :host([color-theme="2"]) .site-header .btn:focus,
          :host([color-theme="2"]) .site-header .btn:active {
            color: #fffff5;
            background: none;
          }
          :host([color-theme="2"]) .site-header site-active-title {
            color: var(--simple-colors-default-theme-light-blue-1,#CFD4E3);
          }
          :host([color-theme="1"]) .site-body .navigation {
            color: #afa790;
          }
          :host([color-theme="1"]) .site-body .navigation:hover,
          :host([color-theme="1"]) .site-body .navigation:focus,
          :host([color-theme="1"]) .site-body .navigation:active {
            color: #eee8e0;
          }
          :host([color-theme="2"]) .site-body .navigation {
            color: #383f52;
          }
          :host([color-theme="2"]) .site-body .navigation:hover,
          :host([color-theme="2"]) .site-body .navigation:focus,
          :host([color-theme="2"]) .site-body .navigation:active {
            color: #fffff5;
          }
          /*
          * Theme 1
          */
          :host([color-theme="1"]) .menu-outline {
            color: #afa790;
            background: #111111;
            border-right: 1px solid rgba(0, 0, 0, 0.07);
          }
          :host([color-theme="1"]) .menu-outline ul.summary li.divider {
            background: #7e888b;
            box-shadow: none;
          }
          :host([color-theme="1"]) .menu-outline ul.summary li.done > a {
            color: #877f6a;
          }
          :host([color-theme="1"]) .menu-outline ul.summary li a,
          :host([color-theme="1"]) .menu-outline ul.summary li span {
            color: #877f6a;
            background: transparent;
            font-weight: normal;
          }
          :host([color-theme="1"]) .menu-outline ul.summary li.active > a,
          :host([color-theme="1"]) .menu-outline ul.summary li a:hover,
          :host([color-theme="1"]) .menu-outline ul.summary li a:focus,
          :host([color-theme="1"]) .menu-outline ul.summary li a:active {
            color: #704214;
            background: transparent;
            font-weight: normal;
          }
          /*
          * Theme 2
          */
          :host([color-theme="2"]) .menu-outline {
            color: #bcc1d2;
            background: #2d3143;
            border-right: none;
          }
          :host([color-theme="2"]) .menu-outline ul.summary li.divider {
            background: #272a3a;
            box-shadow: none;
          }
          :host([color-theme="2"]) .menu-outline ul.summary li.done > a {
            color: #62687f;
          }
          :host([color-theme="2"]) .menu-outline ul.summary li a,
          :host([color-theme="2"]) .menu-outline ul.summary li span {
            color: #c1c6d7;
            background: transparent;
            font-weight: 600;
          }
          :host([color-theme="2"]) .menu-outline ul.summary li.active > a,
          :host([color-theme="2"]) .menu-outline ul.summary li a:hover,
          :host([color-theme="2"]) .menu-outline ul.summary li a:focus,
          :host([color-theme="2"]) .menu-outline ul.summary li a:active {
            color: #f4f4f5;
            background: #252737;
            font-weight: 600;
          }
          button, select {
            text-transform: none;
          }
           button, input {
            line-height: normal;
          }
          button, input, select, textarea {
            font-family: inherit;
            font-size: 100%;
            margin: 0;
          }
          scroll-button {
            position: absolute;
            bottom: 0;
            right: 16px;
          }
          .link-actions {
            top: 0;
            right: 16px;
          }
          #site-search-input {
            padding: 6px;
            background: 0 0;
            transition: top .5s ease;
            background: #fff;
            border-bottom: 1px solid rgba(0,0,0,.07);
            border-top: 1px solid rgba(0,0,0,.07);
            margin-bottom: 10px;
            margin-top: -1px;
          }
          #site-search-input input, #site-search-input input:focus, #site-search-input input:hover {
            width: 100%;
            background: 0 0;
            border: 1px solid transparent;
            box-shadow: none;
            outline: 0;
            line-height: 22px;
            padding: 7px 7px;
            color: inherit;
          }
          site-search {
            height: auto;
            width: auto;
            font-size: inherit;
          }
          :host([color-theme="0"]) site-search {
            color: #252737;
            --site-search-result-background-color: transparent;
            --site-search-result-background-color-hover: #F5F5F5;
            --site-search-link-color-hover: #252737;
            --site-search-link-text-color: #252737;
            --site-search-link-color: #252737;
            --site-search-result-color: #252737;
          }
          :host([color-theme="1"]) site-search {
            color: #704214;
            --site-search-result-background-color: transparent;
            --site-search-result-background-color-hover: transparent;
            --site-search-link-color-hover: #704214;
            --site-search-link-text-color: #704214;
            --site-search-link-color: #704214;
            --site-search-result-color: #704214;
          }
          :host([color-theme="2"]) site-search {
            color: var(--simple-colors-default-theme-light-blue-1,#CFD4E3);
            --site-search-result-background-color: transparent;
            --site-search-result-background-color-hover: transparent;
            --site-search-link-color-hover: var(--simple-colors-default-theme-light-blue-1,#CFD4E3);
            --site-search-link-text-color: var(--simple-colors-default-theme-light-blue-1,#CFD4E3);
            --site-search-link-color: var(--simple-colors-default-theme-light-blue-1,#CFD4E3);
            --site-search-result-color: var(--simple-colors-default-theme-light-blue-1,#CFD4E3);
          }
      `
    ];
  }

  // render function
  render() {
    return html`
      <div
        class="site"
      >
        <div class="menu-outline">
          <div id="site-search-input" role="search">
            <input
              type="text"
              placeholder="Type to search"
              .value="${this.searchTerm}"
              id="search"
              @input="${this.searchChanged}"
            />
          </div>
          ${this.HAXCMSMobileMenu()}
        </div>
        <div id="body" class="site-body">
          <div id="top"></div>
          <div class="site-inner">
            <div
              class="site-header"
              role="navigation"
              .part="${this.editMode ? `edit-mode-active` : ``}"
            >
              <div class="btn-container">
              ${this.HAXCMSMobileMenuButton()}
              ${this.HAXCMSUserStylesMenu()}
                <div class="pull-right link-actions">
                  <site-print-button
                    class="btn js-toolbar-action"
                  ></site-print-button>
                  <site-rss-button type="rss"></site-rss-button>
                  <site-git-corner size="small"></site-git-corner>
                </div>
              </div>
              <site-active-title></site-active-title>
            </div>
            <div class="page-wrapper" role="main">
              <div class="main-content page-inner">
                <section class="normal main-section">
                  <site-search
                    hide-input
                    search="${this.searchTerm}"
                    ?hidden="${this.searchTerm != "" ? false : true}"
                  ></site-search>
                  <div
                    id="contentcontainer"
                    ?hidden="${this.searchTerm != "" ? true : false}"
                  >
                    <div id="slot">
                      <slot></slot>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
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
        </div>
        <scroll-button
          .part="${this.editMode ? `edit-mode-active` : ``}"
        ></scroll-button>
      </div>
    `;
  }

  searchChanged(e) {
    if (e.path[0].value) {
      import("@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-search.js").then(
        () => {
          this.searchTerm = e.path[0].value;
        }
      );
    } else {
      this.searchTerm = "";
    }
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      searchTerm: {
        type: String
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "clean-one";
  }
  /**
   * Add elements to cheat on initial paint here
   */
  constructor() {
    super();
    this.HAXCMSThemeSettings.autoScroll = true;
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-active-title.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-menu-button.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-print-button.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-rss-button.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-git-corner.js");
    this.__disposer = this.__disposer ? this.__disposer : [];
    autorun(reaction => {
      this.activeManifestIndex = toJS(store.activeManifestIndex);
      this.searchTerm = "";
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
    this.HAXCMSThemeSettings.scrollTarget = this.shadowRoot.querySelector('#body');
    // hook up the scroll target
    this.shadowRoot.querySelector(
      "scroll-button"
    ).target = this.shadowRoot.querySelector("#top");
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
window.customElements.define(CleanOne.tag, CleanOne);
export { CleanOne };
