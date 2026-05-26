/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSThemeParts } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/site/site-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu-button.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/query/site-query.js";
import "@haxtheweb/simple-datetime/simple-datetime.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";

/**
 * @title Twenty Six
 * `A HAXcms blog theme inspired by the Twenty Fifteen layout`
 *
 * @microcopy - language worth noting:
 *  - HAXcms - A headless content management system
 *  - HAXCMSTheme - A super class that provides correct baseline wiring to build a new theme
 *
 * @haxcms-theme-category Website
 * @haxcms-theme-internal false
 * @haxcms-theme-priority 0
 * @element twenty-six-theme
 */
class TwentySixTheme extends HAXCMSThemeParts(DDDSuper(HAXCMSLitElementTheme)) {
  static get tag() {
    return "twenty-six-theme";
  }

  static get properties() {
    return {
      ...super.properties,
      siteDescription: {
        type: String,
      },
      activeId: {
        type: String,
      },
      topMenuItems: {
        type: Array,
      },
      pageCreated: {
        type: Number,
      },
      activeTags: {
        type: String,
      },
      prevPage: {
        type: String,
      },
      nextPage: {
        type: String,
      },
      editMode: {
        type: Boolean,
        reflect: true,
        attribute: "edit-mode",
      },
    };
  }

  constructor() {
    super();
    this.HAXCMSThemeSettings.autoScroll = true;
    this.siteDescription = "";
    this.activeId = null;
    this.topMenuItems = [];
    this.pageCreated = null;
    this.activeTags = "";
    this.prevPage = "";
    this.nextPage = "";
    this.editMode = false;
    this.__contrastFrame = null;
    this.__contrastWatchersReady = false;
    this.__prefersDarkMedia = null;
    this.__prefersDarkMediaListener = null;
    this.__paletteMutationObserver = null;
    this.topMenuConditions = {
      parent: null,
    };
    this.topMenuSort = {
      order: "ASC",
    };
    this.__disposer = this.__disposer ? this.__disposer : [];
    this.__disposer.push(
      autorun((reaction) => {
        this.siteDescription = toJS(store.siteDescription);
      }),
    );
    this.__disposer.push(
      autorun((reaction) => {
        this.activeId = toJS(store.activeId);
      }),
    );
    this.__disposer.push(
      autorun((reaction) => {
        this.editMode = toJS(store.editMode);
      }),
    );
    this.__disposer.push(
      autorun((reaction) => {
        this.activeTags = toJS(store.activeTags);
      }),
    );
    this.__disposer.push(
      autorun((reaction) => {
        const activeItem = toJS(store.activeItem);
        if (activeItem && activeItem.metadata) {
          if (activeItem.metadata.created) {
            this.pageCreated = activeItem.metadata.created;
          } else if (activeItem.metadata.updated) {
            this.pageCreated = activeItem.metadata.updated;
          } else {
            this.pageCreated = null;
          }
        } else {
          this.pageCreated = null;
        }
      }),
    );
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          color-scheme: light dark;
          min-height: 100vh;
          --twenty-six-page-bg: light-dark(
            var(--ddd-palette-color-5),
            var(--ddd-palette-color-1)
          );
          --twenty-six-sidebar-bg: light-dark(
            var(--ddd-palette-color-5),
            var(--ddd-palette-color-2)
          );
          --twenty-six-post-bg: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-palette-color-2)
          );
          --twenty-six-post-meta-bg: light-dark(
            var(--ddd-palette-color-5),
            var(--ddd-palette-color-3)
          );
          --twenty-six-border: light-dark(
            var(--ddd-palette-color-4),
            var(--ddd-palette-color-3)
          );
          --twenty-six-page-text: var(--ddd-theme-default-black);
          --twenty-six-sidebar-text: var(--ddd-theme-default-black);
          --twenty-six-post-text: var(--ddd-theme-default-black);
          --twenty-six-post-hover-bg: color-mix(
            in srgb,
            var(--twenty-six-post-bg) 84%,
            var(--ddd-theme-default-black)
          );
          --twenty-six-post-hover-text: var(--twenty-six-post-text);
          --twenty-six-post-meta-text: var(--ddd-theme-default-black);
          --twenty-six-link-hover-bg: light-dark(
            color-mix(in srgb, var(--ddd-palette-color-4) 18%, transparent),
            color-mix(in srgb, var(--ddd-palette-color-4) 28%, transparent)
          );
          background-color: var(--twenty-six-page-bg);
          color: var(--twenty-six-page-text);
          font-family: var(--ddd-font-body);
          --ddd-theme-body-font-size: var(--ddd-font-size-xxs);
        }

        :host(:not([data-palette])) {
          --ddd-palette-color-1: var(--ddd-theme-default-coalyGray);
          --ddd-palette-color-2: var(--simple-colors-fixed-theme-grey-9);
          --ddd-palette-color-3: var(--simple-colors-fixed-theme-grey-7);
          --ddd-palette-color-4: var(--simple-colors-fixed-theme-grey-5);
          --ddd-palette-color-5: var(--simple-colors-fixed-theme-grey-3);
          --ddd-palette-color-6: var(--simple-colors-fixed-theme-grey-11);
          --ddd-palette-color-7: var(--simple-colors-fixed-theme-amber-6);
          --ddd-palette-text-color-1: var(
            --simple-colors-fixed-theme-blue-grey-2
          );
          --ddd-palette-text-color-2: var(--simple-colors-fixed-theme-grey-3);
          --ddd-palette-text-color-3: var(--simple-colors-fixed-theme-grey-1);
          --ddd-palette-text-color-4: var(--simple-colors-fixed-theme-grey-10);
          --ddd-palette-text-color-5: var(--simple-colors-fixed-theme-grey-8);
          --ddd-palette-text-color-6: var(--simple-colors-fixed-theme-grey-5);
          --ddd-palette-text-color-7: var(
            --simple-colors-fixed-theme-orange-10
          );
        }

        :host([dark-mode]) {
          --twenty-six-page-bg: var(--ddd-palette-color-1);
          --twenty-six-sidebar-bg: var(--ddd-palette-color-2);
          --twenty-six-post-bg: color-mix(
            in srgb,
            var(--ddd-palette-color-2) 90%,
            black
          );
          --twenty-six-post-meta-bg: color-mix(
            in srgb,
            var(--ddd-palette-color-3) 78%,
            black
          );
        }

        .layout {
          margin: 0 auto;
          max-width: 1480px;
          min-height: 100vh;
          display: grid;
          grid-template-columns: minmax(240px, 320px) minmax(0, 1fr);
          gap: var(--ddd-spacing-12);
          padding: var(--ddd-spacing-8) var(--ddd-spacing-7);
          box-sizing: border-box;
        }

        .sidebar {
          align-self: start;
        }

        .sidebar-inner {
          position: sticky;
          top: var(--ddd-spacing-8);
          padding: var(--ddd-spacing-9) var(--ddd-spacing-5);
          border-right: var(--ddd-border-sm);
          border-color: var(--twenty-six-border);
          background-color: var(--twenty-six-sidebar-bg);
          color: var(--twenty-six-sidebar-text);
          min-height: calc(100vh - var(--ddd-spacing-16));
          box-sizing: border-box;
        }

        site-title {
          --site-title-link-text-decoration: none;
          --site-title-heading-font-family: var(--ddd-font-navigation);
          --site-title-heading-font-size: var(--ddd-font-size-l);
          --site-title-heading-font-weight: var(--ddd-font-weight-bold);
          --site-title-heading-line-height: 1.1;
          --site-title-heading-margin: 0;
          --site-title-heading-padding: 0;
          --site-title-heading-text-align: left;
          color: inherit;
        }

        .site-description {
          margin: var(--ddd-spacing-3) 0 var(--ddd-spacing-8);
          color: inherit;
          font-size: var(--ddd-font-size-2xs);
          line-height: 1.45;
          max-width: 32ch;
        }

        .top-menu ul {
          list-style: none;
          margin: 0;
          padding: 0;
          border-top: var(--ddd-border-xs);
          border-color: var(--twenty-six-border);
        }

        .top-menu li {
          margin: 0;
          padding: 0;
        }

        .top-menu a {
          display: block;
          text-decoration: none;
          color: inherit;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-xs);
          line-height: 1.4;
          padding: var(--ddd-spacing-3) var(--ddd-spacing-1);
          border-bottom: var(--ddd-border-xs);
          border-color: var(--twenty-six-border);
          transition:
            background-color 0.2s ease,
            color 0.2s ease;
        }

        .top-menu a:hover,
        .top-menu a:focus-visible {
          background-color: var(--twenty-six-link-hover-bg);
          text-decoration: underline;
          text-underline-offset: 0.14em;
        }

        .top-menu a.active {
          color: inherit;
          font-weight: var(--ddd-font-weight-medium);
        }

        .main-col {
          min-width: 0;
        }

        .content-shell {
          max-width: 820px;
          width: 100%;
          margin: 0 auto;
          padding-bottom: var(--ddd-spacing-10);
        }

        .post {
          margin: 0;
          border: var(--ddd-border-sm);
          border-color: var(--twenty-six-border);
          background-color: var(--twenty-six-post-bg);
          color: var(--twenty-six-post-text);
          box-shadow: var(--ddd-boxShadow-sm);
        }

        site-active-title {
          display: block;
          padding: var(--ddd-spacing-10) var(--ddd-spacing-10)
            var(--ddd-spacing-6);
        }

        site-active-title h1 {
          margin: 0;
          font-family: var(--ddd-font-navigation);
          font-size: clamp(
            var(--ddd-font-size-l),
            2.6vw,
            var(--ddd-font-size-xxl)
          );
          line-height: 1.18;
        }

        #slot {
          display: block;
          padding: 0 var(--ddd-spacing-10) var(--ddd-spacing-8);
          line-height: 1.7;
          font-size: var(--ddd-font-size-xs);
        }

        #slot a {
          color: inherit;
          text-decoration-color: currentColor;
        }

        .post-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-4);
          border-top: var(--ddd-border-xs);
          border-color: var(--twenty-six-border);
          background-color: var(--twenty-six-post-meta-bg);
          color: var(--twenty-six-post-meta-text);
          padding: var(--ddd-spacing-5) var(--ddd-spacing-10);
          font-size: var(--ddd-font-size-3xs);
        }

        .meta-group {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          color: inherit;
        }

        .meta-group simple-icon-lite {
          color: currentColor;
          --simple-icon-height: var(--ddd-icon-4xs);
          --simple-icon-width: var(--ddd-icon-4xs);
        }

        .category-list {
          display: inline-flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-1);
        }

        .category-list a {
          color: inherit;
          text-decoration: none;
          border-bottom: var(--ddd-border-xs);
          border-color: transparent;
        }

        .category-list a:hover,
        .category-list a:focus-visible {
          border-color: currentColor;
          text-decoration: none;
        }

        .separator {
          color: inherit;
          margin-right: var(--ddd-spacing-1);
        }

        .link-actions {
          margin-top: var(--ddd-spacing-8);
        }

        .link-actions-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--ddd-spacing-4);
        }

        site-menu-button {
          --site-menu-button-link-decoration: none;
          --site-menu-button-link-color: var(--twenty-six-post-text);
          --site-menu-button-button-background-color: var(--twenty-six-post-bg);
          --site-menu-button-button-hover-background-color: var(
            --twenty-six-post-hover-bg
          );
          --site-menu-button-button-hover-color: var(
            --twenty-six-post-hover-text
          );
          --site-menu-button-icon-fill-color: var(--twenty-six-post-text);
          border: var(--ddd-border-sm);
          border-color: var(--twenty-six-border);
          border-radius: var(--ddd-radius-sm);
          box-shadow: var(--ddd-boxShadow-sm);
          min-height: 112px;
        }

        site-menu-button .wrapper {
          display: block;
          padding: var(--ddd-spacing-4);
          color: var(--twenty-six-post-text);
        }

        site-menu-button:hover .wrapper,
        site-menu-button:focus-within .wrapper {
          color: var(--twenty-six-post-hover-text);
        }

        site-menu-button .top {
          display: block;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          text-transform: uppercase;
          letter-spacing: var(--ddd-ls-16-sm);
          color: inherit;
        }

        site-menu-button .bottom {
          display: block;
          margin-top: var(--ddd-spacing-2);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: 1.35;
          max-height: 4.2em;
          overflow: hidden;
        }

        site-menu-button[type="prev"] .wrapper {
          text-align: right;
        }

        site-menu-button[type="next"] .wrapper {
          text-align: left;
        }

        @media (max-width: 1080px) {
          .layout {
            gap: var(--ddd-spacing-6);
            grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
          }
          .sidebar-inner {
            padding: var(--ddd-spacing-6) var(--ddd-spacing-4);
          }
          site-active-title,
          #slot,
          .post-meta {
            padding-left: var(--ddd-spacing-7);
            padding-right: var(--ddd-spacing-7);
          }
        }

        @media (max-width: 900px) {
          .layout {
            grid-template-columns: 1fr;
            gap: var(--ddd-spacing-4);
            padding: var(--ddd-spacing-4);
          }
          .sidebar-inner {
            position: static;
            min-height: 0;
            border-right: 0;
            border-bottom: var(--ddd-border-sm);
            border-color: var(--twenty-six-border);
            padding: var(--ddd-spacing-5) 0;
          }
          .site-description {
            max-width: 100%;
          }
        }

        @media (max-width: 640px) {
          .link-actions-inner {
            grid-template-columns: 1fr;
          }
          site-active-title,
          #slot,
          .post-meta {
            padding-left: var(--ddd-spacing-5);
            padding-right: var(--ddd-spacing-5);
          }
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.__setupContrastWatchers();
    this.__queueContrastSync();
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    this.__queueContrastSync();
  }

  render() {
    const visibleMenuItems = this.topMenuItems.filter(
      (item) => !this._isHiddenMenuItem(item),
    );
    const tags = this._tagsArray(this.activeTags);
    const hasMetadata = this.pageCreated || tags.length > 0;
    return html`
      <site-query
        @result-changed="${this.__topMenuResultChanged}"
        .conditions="${this.topMenuConditions}"
        .sort="${this.topMenuSort}"
      ></site-query>
      <div class="layout">
        <aside class="sidebar" part="sidebar">
          <div class="sidebar-inner">
            <site-title
              .part="${this.editMode ? `edit-mode-active` : ``}"
              ?disabled="${this.editMode}"
              part="site-title"
            ></site-title>
            ${this.siteDescription
              ? html`<p class="site-description">${this.siteDescription}</p>`
              : ``}
            <nav class="top-menu" aria-label="Top menu links" part="top-menu">
              <ul>
                ${visibleMenuItems.map(
                  (item) => html`
                    <li>
                      <a
                        href="${item.slug}"
                        class="${item.id === this.activeId ? "active" : ""}"
                        @click="${this._preventInEditMode}"
                      >
                        ${item.title}
                      </a>
                    </li>
                  `,
                )}
              </ul>
            </nav>
          </div>
        </aside>
        <div class="main-col">
          <main class="content-shell" part="content-shell">
            <article class="post" id="contentcontainer" part="post">
              <site-active-title part="page-title"></site-active-title>
              <section id="slot">
                <slot></slot>
              </section>
              ${hasMetadata
                ? html`
                    <footer class="post-meta" part="post-meta">
                      ${this.pageCreated
                        ? html`
                            <span class="meta-group">
                              <simple-icon-lite
                                icon="icons:date-range"
                                aria-hidden="true"
                              ></simple-icon-lite>
                              <simple-datetime
                                format="F j, Y"
                                unix
                                .timestamp="${this.pageCreated}"
                              ></simple-datetime>
                            </span>
                          `
                        : ``}
                      ${tags.length > 0
                        ? html`
                            <span class="meta-group">
                              <simple-icon-lite
                                icon="icons:folder-open"
                                aria-hidden="true"
                              ></simple-icon-lite>
                              <span class="category-list">
                                ${tags.map(
                                  (tag, index) => html`
                                    <a
                                      href="${this._tagLink(tag)}"
                                      @click="${this._preventInEditMode}"
                                    >
                                      ${tag}
                                    </a>
                                    ${index < tags.length - 1
                                      ? html`<span class="separator">,</span>`
                                      : ``}
                                  `,
                                )}
                              </span>
                            </span>
                          `
                        : ``}
                    </footer>
                  `
                : ``}
            </article>
            <nav class="link-actions" aria-label="Post navigation">
              <div class="link-actions-inner">
                <site-menu-button
                  hide-label
                  type="prev"
                  position="right"
                  @label-changed="${this.__prevPageLabelChanged}"
                >
                  <div slot="suffix" class="wrapper">
                    <span class="top">Previous</span>
                    <span class="bottom">${this.prevPage}</span>
                  </div>
                </site-menu-button>
                <site-menu-button
                  hide-label
                  type="next"
                  position="left"
                  @label-changed="${this.__nextPageLabelChanged}"
                >
                  <div slot="prefix" class="wrapper">
                    <span class="top">Next</span>
                    <span class="bottom">${this.nextPage}</span>
                  </div>
                </site-menu-button>
              </div>
            </nav>
          </main>
        </div>
      </div>
    `;
  }

  __setupContrastWatchers() {
    if (this.__contrastWatchersReady) {
      return;
    }
    this.__contrastWatchersReady = true;
    if (globalThis.MutationObserver) {
      this.__paletteMutationObserver = new MutationObserver(() => {
        this.__queueContrastSync();
      });
      const observerConfig = {
        attributes: true,
        attributeFilter: ["data-palette", "dark-mode"],
      };
      this.__paletteMutationObserver.observe(this, observerConfig);
      if (globalThis.document && globalThis.document.documentElement) {
        this.__paletteMutationObserver.observe(
          globalThis.document.documentElement,
          observerConfig,
        );
      }
      if (globalThis.document && globalThis.document.body) {
        this.__paletteMutationObserver.observe(
          globalThis.document.body,
          observerConfig,
        );
      }
    }
    if (globalThis.matchMedia) {
      this.__prefersDarkMedia = globalThis.matchMedia(
        "(prefers-color-scheme: dark)",
      );
      this.__prefersDarkMediaListener = () => {
        this.__queueContrastSync();
      };
      if (this.__prefersDarkMedia.addEventListener) {
        this.__prefersDarkMedia.addEventListener(
          "change",
          this.__prefersDarkMediaListener,
        );
      } else if (this.__prefersDarkMedia.addListener) {
        this.__prefersDarkMedia.addListener(this.__prefersDarkMediaListener);
      }
    }
    this.__disposer.push(() => {
      if (this.__contrastFrame !== null && globalThis.cancelAnimationFrame) {
        globalThis.cancelAnimationFrame(this.__contrastFrame);
        this.__contrastFrame = null;
      }
      if (this.__paletteMutationObserver) {
        this.__paletteMutationObserver.disconnect();
        this.__paletteMutationObserver = null;
      }
      if (this.__prefersDarkMedia && this.__prefersDarkMediaListener) {
        if (this.__prefersDarkMedia.removeEventListener) {
          this.__prefersDarkMedia.removeEventListener(
            "change",
            this.__prefersDarkMediaListener,
          );
        } else if (this.__prefersDarkMedia.removeListener) {
          this.__prefersDarkMedia.removeListener(this.__prefersDarkMediaListener);
        }
      }
      this.__prefersDarkMedia = null;
      this.__prefersDarkMediaListener = null;
      this.__contrastWatchersReady = false;
    });
  }

  __queueContrastSync() {
    if (this.__contrastFrame !== null) {
      return;
    }
    if (globalThis.requestAnimationFrame) {
      this.__contrastFrame = globalThis.requestAnimationFrame(() => {
        this.__contrastFrame = null;
        this.__syncContrastTextColors();
      });
    } else {
      this.__syncContrastTextColors();
    }
  }

  __syncContrastTextColors() {
    const pageBg = this.__resolveBackgroundColor(this, "rgb(255, 255, 255)");
    const sidebarBg = this.__resolveBackgroundColor(
      this.shadowRoot ? this.shadowRoot.querySelector(".sidebar-inner") : null,
      pageBg,
    );
    const postBg = this.__resolveBackgroundColor(
      this.shadowRoot ? this.shadowRoot.querySelector(".post") : null,
      pageBg,
    );
    const postMetaBg = this.__resolveBackgroundColor(
      this.shadowRoot ? this.shadowRoot.querySelector(".post-meta") : null,
      postBg,
    );
    const postText = this.__pickBlackOrWhite(postBg);
    const postHoverBg = this.__buildHoverBackgroundColor(postBg, postText);
    const postHoverText = this.__pickBlackOrWhite(postHoverBg);
    this.style.setProperty(
      "--twenty-six-page-text",
      this.__pickBlackOrWhite(pageBg),
    );
    this.style.setProperty(
      "--twenty-six-sidebar-text",
      this.__pickBlackOrWhite(sidebarBg),
    );
    this.style.setProperty("--twenty-six-post-text", postText);
    this.style.setProperty("--twenty-six-post-hover-bg", postHoverBg);
    this.style.setProperty("--twenty-six-post-hover-text", postHoverText);
    this.style.setProperty(
      "--twenty-six-post-meta-text",
      this.__pickBlackOrWhite(postMetaBg),
    );
  }

  __resolveBackgroundColor(node, fallbackColor) {
    if (!node) {
      return fallbackColor;
    }
    const style = getComputedStyle(node);
    const backgroundColor = style.backgroundColor
      ? style.backgroundColor.trim()
      : "";
    if (
      backgroundColor === "" ||
      backgroundColor === "transparent" ||
      backgroundColor === "rgba(0, 0, 0, 0)"
    ) {
      return fallbackColor;
    }
    return backgroundColor;
  }

  __pickBlackOrWhite(backgroundColor) {
    const rgb = this.__parseColorToRgb(backgroundColor);
    if (!rgb) {
      return "var(--ddd-theme-default-black)";
    }
    const backgroundLuminance = this.__relativeLuminance(rgb);
    const blackContrast = this.__contrastRatio(backgroundLuminance, 0);
    const whiteContrast = this.__contrastRatio(backgroundLuminance, 1);
    return whiteContrast >= blackContrast
      ? "var(--ddd-theme-default-white)"
      : "var(--ddd-theme-default-black)";
  }

  __buildHoverBackgroundColor(backgroundColor, textColor) {
    const backgroundRgb = this.__parseColorToRgb(backgroundColor);
    if (!backgroundRgb) {
      return backgroundColor;
    }
    const contrastTargetColor =
      textColor === "var(--ddd-theme-default-black)"
        ? { r: 255, g: 255, b: 255 }
        : { r: 0, g: 0, b: 0 };
    const hoverRgb = this.__mixRgb(backgroundRgb, contrastTargetColor, 0.16);
    return `rgb(${hoverRgb.r} ${hoverRgb.g} ${hoverRgb.b})`;
  }

  __mixRgb(baseColor, overlayColor, overlayAmount) {
    const clampedAmount = Math.max(0, Math.min(1, overlayAmount));
    const baseAmount = 1 - clampedAmount;
    return {
      r: Math.round(baseColor.r * baseAmount + overlayColor.r * clampedAmount),
      g: Math.round(baseColor.g * baseAmount + overlayColor.g * clampedAmount),
      b: Math.round(baseColor.b * baseAmount + overlayColor.b * clampedAmount),
    };
  }

  __parseColorToRgb(colorValue) {
    const color = colorValue ? colorValue.trim().toLowerCase() : "";
    if (color === "") {
      return null;
    }
    if (color.indexOf("rgb(") === 0 || color.indexOf("rgba(") === 0) {
      const values = color
        .replace(/^rgba?\(/, "")
        .replace(/\)$/, "")
        .replace(/\//g, " ")
        .replace(/,/g, " ")
        .trim()
        .split(/\s+/)
        .slice(0, 3)
        .map((value) => Number(value));
      if (
        values.length === 3 &&
        values.every((value) => Number.isFinite(value))
      ) {
        return {
          r: values[0],
          g: values[1],
          b: values[2],
        };
      }
    }
    const hex = color.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hex) {
      const value = hex[1];
      if (value.length === 3) {
        return {
          r: parseInt(value[0] + value[0], 16),
          g: parseInt(value[1] + value[1], 16),
          b: parseInt(value[2] + value[2], 16),
        };
      }
      return {
        r: parseInt(value.substring(0, 2), 16),
        g: parseInt(value.substring(2, 4), 16),
        b: parseInt(value.substring(4, 6), 16),
      };
    }
    const srgb = color.match(
      /^color\(srgb\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)(?:\s*\/\s*[0-9.]+)?\)$/,
    );
    if (srgb) {
      return {
        r: Math.round(Number(srgb[1]) * 255),
        g: Math.round(Number(srgb[2]) * 255),
        b: Math.round(Number(srgb[3]) * 255),
      };
    }
    return null;
  }

  __relativeLuminance(color) {
    const red = this.__channelToLinear(color.r);
    const green = this.__channelToLinear(color.g);
    const blue = this.__channelToLinear(color.b);
    return red * 0.2126 + green * 0.7152 + blue * 0.0722;
  }

  __channelToLinear(channel) {
    const normalized = channel / 255;
    if (normalized <= 0.03928) {
      return normalized / 12.92;
    }
    return Math.pow((normalized + 0.055) / 1.055, 2.4);
  }

  __contrastRatio(luminanceA, luminanceB) {
    const brighter = Math.max(luminanceA, luminanceB);
    const darker = Math.min(luminanceA, luminanceB);
    return (brighter + 0.05) / (darker + 0.05);
  }

  _isHiddenMenuItem(item) {
    if (!item || !item.metadata) {
      return false;
    }
    return (
      item.metadata.hideInMenu === true || item.metadata.published === false
    );
  }

  _tagsArray(tags) {
    if (!tags || typeof tags !== "string") {
      return [];
    }
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
  }

  _tagLink(tag) {
    return `x/tags?tag=${encodeURIComponent(tag)}`;
  }

  _preventInEditMode(e) {
    if (this.editMode) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }

  __topMenuResultChanged(e) {
    if (e.detail && e.detail.value) {
      this.topMenuItems = [...e.detail.value];
    } else {
      this.topMenuItems = [];
    }
  }

  __prevPageLabelChanged(e) {
    this.prevPage = e.detail && e.detail.value ? e.detail.value : "";
  }

  __nextPageLabelChanged(e) {
    this.nextPage = e.detail && e.detail.value ? e.detail.value : "";
  }

  disconnectedCallback() {
    for (var i in this.__disposer) {
      const disposer = this.__disposer[i];
      if (typeof disposer === "function") {
        disposer();
      } else if (disposer && typeof disposer.dispose === "function") {
        disposer.dispose();
      }
    }
    this.__disposer = [];
    super.disconnectedCallback();
  }
}

globalThis.customElements.define(TwentySixTheme.tag, TwentySixTheme);
export { TwentySixTheme };
