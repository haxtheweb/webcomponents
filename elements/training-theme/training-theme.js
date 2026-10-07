/**
 * Copyright 2023
 * @license , see License.md for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSRememberRoute } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSRememberRoute.js";
import { HAXCMSThemeParts } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { PrintBranchMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/PrintBranchMixin.js";
import { PDFPageMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/PDFPageMixin.js";
import { QRCodeMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/QRCodeMixin.js";
import { HAXCMSMobileMenuMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSMobileMenu.js";
import { HAXCMSOperationButtons } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSOperationButtons.js";
import { varGet } from "@haxtheweb/utils/lib/object-path.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-tags.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu-button.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { autorun, toJS } from "mobx";

import "./lib/training-button.js";

/**
 * @title Training
 * `theme for training content in HAXcms`
 * @haxcms-theme-hidden true
 * @demo demo/index.html
 * @element training-theme
 */
class TrainingTheme extends HAXCMSOperationButtons(
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
) {
  constructor() {
    super();
    this.items = [];
    this.manifest = {};
    this.t.next = "Next";
    this.t.previous = "Previous";
    this.t.of = "of";
    this.t.pagesViewed = "pages viewed";
    this.t.trainingTopics = "Training topics";
    this.t.support = "Support";
    this.maxIndex = 0;
    this.activeId = null; // To keep track of the active index
    autorun(() => {
      const _mobx_val_0 = toJS(store.activeId);
      Promise.resolve().then(() => {
        this.activeId = _mobx_val_0;
      });
    });
    autorun(() => {
      const _mobx_val_0 = toJS(
        store.manifest && store.manifest.items ? store.manifest.items : [],
      );
      Promise.resolve().then(() => {
        this.items = _mobx_val_0;
      });
    });
    autorun(() => {
      const _mobx_val_0 = toJS(store.activeManifestIndex);
      Promise.resolve().then(() => {
        const manIn = _mobx_val_0;
        if (manIn > this.maxIndex) {
          this.maxIndex = manIn;
        }
      });
    });
    // mirror site branding (title, description, author) for the sidebar
    autorun(() => {
      const _mobx_val_0 = toJS(store.manifest ? store.manifest : {});
      Promise.resolve().then(() => {
        this.manifest = _mobx_val_0;
      });
    });
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "training-theme";
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      ...super.properties,
      items: { type: Array },
      manifest: { type: Object },
      activeId: { type: String },
      prevPage: {
        type: String,
      },
      nextPage: {
        type: String,
      },
      maxIndex: { type: Number },
    };
  }
  /**
   * Number of pages reached so far; maxIndex is the deepest 0-based manifest
   * index visited, so the count of viewed pages is one past it.
   */
  get visitedCount() {
    return Math.min(this.maxIndex + 1, this.items.length);
  }
  __prevPageLabelChanged(e) {
    this.prevPage = e.detail.value;
  }
  __nextPageLabelChanged(e) {
    this.nextPage = e.detail.value;
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          color: light-dark(
            var(--ddd-theme-default-coalyGray, #262626),
            var(--ddd-theme-default-white, #ffffff)
          );
          /* source colors with no DDD token equivalent, kept theme-local */
          --training-theme-cream: light-dark(
            var(--ddd-theme-default-shrineLight, #fefcf7),
            var(--ddd-theme-default-potentialMidnight, #000321)
          );
          --training-theme-forestGreenLight: var(--ddd-theme-default-futureLime, #4a7729);
          --training-theme-navText: var(
            --ddd-theme-default-slateLight,
            #ccdae6
          );
          --training-theme-sidebar-width: 300px;
        }

        a:focus-visible,
        button:focus-visible {
          outline: 2px solid currentColor;
          outline-offset: 2px;
        }

        /* two-pane layout: fixed navy sidebar + independently scrolling main */
        .alignContent {
          display: flex;
          align-items: stretch;
          min-height: 100vh;
          min-height: 100dvh;
        }

        .training-column {
          display: flex;
          flex-direction: column;
          flex: none;
          width: var(--training-theme-sidebar-width, 300px);
          position: sticky;
          top: var(--ddd-spacing-0, 0px);
          height: 100vh;
          height: 100dvh;
          overflow: auto;
          overscroll-behavior: contain;
          background-color: var(--ddd-theme-default-nittanyNavy, #001e44);
          color: var(--ddd-theme-default-slateLight, #ccdae6);
          scrollbar-width: thin;
          scrollbar-color: var(--ddd-theme-default-slateGray, #314d64)
            transparent;
        }

        .sidebar-header {
          padding: var(--ddd-spacing-8, 32px) var(--ddd-spacing-6, 24px)
            var(--ddd-spacing-5, 20px);
        }
        .sidebar-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--ddd-spacing-2, 8px);
        }
        .sidebar-top-row simple-icon-button-lite {
          color: var(--ddd-theme-default-white, #ffffff);
        }
        .eyebrow {
          flex: 1;
          min-width: 0;
          font-size: var(--ddd-font-size-6xs, 12px);
          font-weight: var(--ddd-font-weight-bold, 700);
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--ddd-theme-default-slateLight, #ccdae6);
          opacity: 0.75;
        }
        .sidebar-title {
          margin-top: var(--ddd-spacing-2, 8px);
          font-family: var(--ddd-font-secondary);
          font-size: var(--ddd-font-size-s, 24px);
          font-weight: var(--ddd-font-weight-medium, 500);
          line-height: var(--ddd-lh-120, 120%);
          color: var(--ddd-theme-default-white, #ffffff);
        }
        .sidebar-subtitle {
          margin-top: var(--ddd-spacing-1, 4px);
          font-size: var(--ddd-font-size-6xs, 12px);
          line-height: var(--ddd-lh-140, 140%);
          color: var(--ddd-theme-default-slateLight, #ccdae6);
        }

        /* progress ring: deepest page visited of the whole outline */
        .progress {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-4, 16px);
          margin: var(--ddd-spacing-1, 4px) var(--ddd-spacing-5, 20px)
            var(--ddd-spacing-4, 16px);
          padding: var(--ddd-spacing-4, 16px) var(--ddd-spacing-5, 20px);
          background: rgba(255, 255, 255, 0.055);
          border-radius: var(--ddd-radius-md, 12px);
        }
        .ring {
          position: relative;
          flex: none;
          width: var(--ddd-spacing-14, 56px);
          height: var(--ddd-spacing-14, 56px);
        }
        .ring svg {
          display: block;
          width: 100%;
          height: 100%;
        }
        .ring-track {
          stroke: rgba(255, 255, 255, 0.16);
        }
        .ring-progress {
          stroke: var(
            --training-theme-forestGreenLight,
            var(--ddd-theme-default-forestGreen, #4a7729)
          );
        }
        @media (prefers-reduced-motion: no-preference) {
          .ring-progress {
            transition: stroke-dashoffset 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          }
        }
        .ring-count {
          position: absolute;
          inset: var(--ddd-spacing-0, 0px);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--ddd-font-size-4xs, 16px);
          font-weight: var(--ddd-font-weight-bold, 700);
          color: var(--ddd-theme-default-white, #ffffff);
        }
        .progress-text {
          font-size: var(--ddd-font-size-6xs, 12px);
          line-height: var(--ddd-lh-140, 140%);
          color: var(--ddd-theme-default-slateLight, #ccdae6);
        }

        /* outline of numbered topic buttons */
        .training-topics {
          flex: 1;
          display: flex;
          flex-direction: column;
          margin: var(--ddd-spacing-0, 0px);
          padding: var(--ddd-spacing-1, 4px) var(--ddd-spacing-4, 16px)
            var(--ddd-spacing-4, 16px);
        }
        .nav-section-label {
          padding: var(--ddd-spacing-4, 16px) var(--ddd-spacing-3, 12px)
            var(--ddd-spacing-2, 8px);
          font-size: var(--ddd-font-size-6xs, 12px);
          font-weight: var(--ddd-font-weight-bold, 700);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--ddd-theme-default-slateLight, #ccdae6);
          opacity: 0.7;
        }

        .sidebar-footer {
          padding: var(--ddd-spacing-4, 16px) var(--ddd-spacing-6, 24px)
            var(--ddd-spacing-6, 24px);
          font-size: var(--ddd-font-size-6xs, 12px);
          line-height: var(--ddd-lh-140, 140%);
          color: var(--ddd-theme-default-slateLight, #ccdae6);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .sidebar-footer a {
          color: var(--ddd-theme-default-inventOrange, #e98300);
          text-decoration: none;
        }
        .sidebar-footer a:focus-visible {
          outline: 2px solid currentColor;
          outline-offset: 2px;
        }

        /* main pane: cream, centered reading column, own scroll */
        .main {
          flex: 1;
          min-width: 0;
          width: auto;
          height: 100%;
          max-height: 100vh;
          max-height: 100dvh;
          margin: var(--ddd-spacing-0, 0px);
          padding: var(--ddd-spacing-0, 0px);
          overflow: auto;
          overscroll-behavior: contain;
          background-color: var(--training-theme-cream);
          scrollbar-width: thin;
          scrollbar-color: light-dark(
              var(--ddd-theme-default-limestoneGray, #a2aaad),
              var(--ddd-theme-default-slateGray, #314d64)
            )
            transparent;
          -webkit-font-smoothing: antialiased;
          text-size-adjust: 100%;
          font-family: var(--ddd-font-primary);
        }
        .content-column {
          max-width: 820px;
          margin: 0 auto;
          padding: var(--ddd-spacing-15, 60px) var(--ddd-spacing-14, 56px)
            var(--ddd-spacing-25, 100px);
        }

        site-active-title h1 {
          font-family: var(--ddd-font-secondary);
          font-size: var(--ddd-font-size-l, 40px);
          font-weight: var(--ddd-font-weight-medium, 500);
          line-height: var(--ddd-lh-120, 120%);
          letter-spacing: -0.01em;
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy, #001e44),
            var(--ddd-theme-default-white, #ffffff)
          );
          margin: 0 0 var(--ddd-spacing-6, 24px);
        }

        ::slotted(h2),
        ::slotted(h3),
        ::slotted(h4) {
          font-family: var(--ddd-font-secondary);
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy, #001e44),
            var(--ddd-theme-default-white, #ffffff)
          );
        }

        .link-actions {
          margin: var(--ddd-spacing-7, 28px) 0 0;
          padding-top: var(--ddd-spacing-7, 28px);
          border-top: 1px solid
            light-dark(
              var(--ddd-theme-default-limestoneLight, #e4e5e7),
              var(--ddd-theme-default-slateGray, #314d64)
            );
          display: flex;
          justify-content: flex-end;
          flex-direction: row;
        }
        .link-actions .inner {
          width: auto;
          margin: var(--ddd-spacing-0, 0px);
          display: grid;
          padding: var(--ddd-spacing-0, 0px);
          grid-column-gap: var(--ddd-spacing-6, 24px);
          grid-template-rows: auto;
          grid-template-areas: "previous next";
          grid-template-columns: 1fr 3fr;
        }

        site-menu-button {
          --site-menu-button-link-decoration: none;
          border: 1px solid
            light-dark(
              var(--ddd-theme-default-limestoneLight, #e4e5e7),
              var(--ddd-theme-default-slateGray, #314d64)
            );
          margin: var(--ddd-spacing-0, 0px);
          display: block;
          padding: var(--ddd-spacing-3, 12px) var(--ddd-spacing-4, 16px);
          position: relative;
          align-self: stretch;
          justify-self: stretch;
          text-overflow: ellipsis;
          border-radius: var(--ddd-radius-sm, 8px);
          flex-direction: row;
          text-decoration: none;
          page-break-inside: avoid;
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-5xs, 14px);
          font-weight: var(--ddd-font-weight-medium, 500);
          transition: all 0.2s ease;
        }
        site-menu-button[type="prev"] {
          grid-area: previous;
          background-color: light-dark(
            var(--ddd-theme-default-white, #ffffff),
            var(--ddd-theme-default-potentialMidnight, #000321)
          );
          color: light-dark(
            var(--ddd-theme-default-beaverBlue, #1e407c),
            var(--ddd-theme-default-slateLight, #ccdae6)
          );
          pointer-events: auto;
          text-transform: none;
        }
        site-menu-button[type="next"] {
          grid-area: next;
          background-color: light-dark(
            var(--ddd-theme-default-beaverBlue, #1e407c),
            var(--ddd-theme-default-slateLight, #ccdae6)
          );
          border: none;
          color: light-dark(
            var(--ddd-theme-default-white, #ffffff),
            var(--ddd-theme-default-nittanyNavy, #001e44)
          );
          box-shadow: var(--ddd-boxShadow-sm);
          pointer-events: auto;
          text-transform: none;
          --site-menu-button-icon-fill-color: light-dark(var(--ddd-theme-default-white, #ffffff), var(--ddd-theme-default-nittanyNavy, #001e44));
        }
        site-menu-button[type="next"]::part(button) {
          color: inherit;
          background-color: inherit;
        }
        site-menu-button div.wrapper {
          flex: 1;
          margin: var(--ddd-spacing-0, 0px);
          display: block;
          padding: var(--ddd-spacing-0, 0px);
          text-overflow: ellipsis;
          text-decoration: none;
          font-size: var(--ddd-font-size-5xs, 14px);
          font-weight: var(--ddd-font-weight-medium, 500);
          line-height: var(--ddd-lh-140, 140%);
          text-transform: none;
        }
        site-menu-button div .top {
          font-size: var(--ddd-font-size-6xs, 12px);
          font-weight: var(--ddd-font-weight-regular, 400);
          line-height: var(--ddd-lh-140, 140%);
          letter-spacing: 0.04em;
          opacity: 0.75;
        }
        site-menu-button div .bottom {
          font-size: var(--ddd-font-size-5xs, 14px);
          font-weight: var(--ddd-font-weight-medium, 500);
          line-height: var(--ddd-lh-150, 150%);
          max-height: 50px;
          overflow: hidden;
        }
        site-menu-button[type="next"] div {
          text-align: left;
        }
        site-menu-button[type="prev"] div {
          text-align: right;
        }
        site-menu-button[edit-mode][disabled] {
          display: block;
        }

        replace-tag[with="site-git-corner"],
        site-git-corner {
          height: 40px;
          width: 40px;
          padding: var(--ddd-spacing-2, 8px);
          display: block;
          --github-corner-size: 40px;
          --site-git-corner-background: transparent;
          background-color: var(--ddd-theme-default-potential0, transparent);
        }
        .email-btn,
        .print-branch-btn simple-icon-button-lite,
        .pdf-page-btn simple-icon-button-lite {
          --simple-icon-height: 24px;
          --simple-icon-width: 24px;
          padding: var(--ddd-spacing-2, 8px);
          display: block;
          color: inherit;
        }

        /* small screens: stack the panes and collapse the topic list behind
           the mobile menu toggle, mirroring the source ergonomics */
        :host([responsive-size="xs"]) .alignContent,
        :host([responsive-size="sm"]) .alignContent {
          flex-direction: column;
        }
        :host([responsive-size="xs"]) .training-column,
        :host([responsive-size="sm"]) .training-column {
          position: static;
          width: 100%;
          height: auto;
          overflow: visible;
        }
        :host([responsive-size="xs"]) .main,
        :host([responsive-size="sm"]) .main {
          max-height: none;
        }
        :host([responsive-size="xs"]) .content-column,
        :host([responsive-size="sm"]) .content-column {
          padding: var(--ddd-spacing-8, 32px) var(--ddd-spacing-4, 16px)
            var(--ddd-spacing-15, 60px);
        }
        :host([responsive-size="xs"]) .training-topics,
        :host([responsive-size="sm"]) .training-topics {
          display: none;
        }
        :host([responsive-size="xs"][menu-open]) .training-topics,
        :host([responsive-size="sm"][menu-open]) .training-topics {
          display: flex;
        }

        /* print: content only, matching the source print styles */
        @media print {
          .training-column,
          .link-actions {
            display: none;
          }
          .main {
            overflow: visible;
            max-height: none;
            background-color: var(--ddd-theme-default-white, #ffffff);
          }
          .content-column {
            max-width: none;
            padding: var(--ddd-spacing-0, 0px);
          }
        }
      `,
    ];
  }

  render() {
    // ring geometry matches the source companion: r 24 in a 56 unit box
    const ringCircumference = 2 * Math.PI * 24;
    const total = this.items.length;
    const visited = this.visitedCount;
    const ringOffset =
      total > 0 ? ringCircumference * (1 - visited / total) : ringCircumference;
    const authorName = varGet(this, "manifest.metadata.author.name", "");
    const authorEmail = varGet(this, "manifest.metadata.author.email", "");
    return html`
      <a class="skip-link" href="#contentcontainer">Skip to content</a>
      <div class="alignContent">
        <aside class="training-column">
          <div class="sidebar-header">
            <div class="sidebar-top-row">
              <div class="eyebrow">${authorName}</div>
              ${["xs", "sm"].includes(this.responsiveSize)
                ? this.HAXCMSMobileMenuButton("bottom")
                : ``}
            </div>
            <div class="sidebar-title">
              ${varGet(this, "manifest.title", "")}
            </div>
            <div class="sidebar-subtitle">
              ${varGet(this, "manifest.description", "")}
            </div>
          </div>
          ${total > 0
            ? html`
                <div
                  class="progress"
                  role="progressbar"
                  aria-valuemin="0"
                  aria-valuemax="${total}"
                  aria-valuenow="${visited}"
                  aria-label="${visited} ${this.t.of} ${total} ${this.t
                    .pagesViewed}"
                >
                  <div class="ring" aria-hidden="true">
                    <svg viewBox="0 0 56 56">
                      <circle
                        class="ring-track"
                        cx="28"
                        cy="28"
                        r="24"
                        fill="none"
                        stroke-width="5"
                      ></circle>
                      <circle
                        class="ring-progress"
                        cx="28"
                        cy="28"
                        r="24"
                        fill="none"
                        stroke-width="5"
                        stroke-linecap="round"
                        stroke-dasharray="${ringCircumference}"
                        stroke-dashoffset="${ringOffset}"
                        transform="rotate(-90 28 28)"
                      ></circle>
                    </svg>
                    <div class="ring-count">${visited}</div>
                  </div>
                  <div class="progress-text">
                    <div>${visited} ${this.t.of} ${total}</div>
                    <div>${this.t.pagesViewed}</div>
                  </div>
                </div>
              `
            : ``}
          <nav
            id="haxcmsmobilemenunav"
            aria-label="${this.t.trainingTopics}"
            class="training-topics"
          >
            <div class="nav-section-label">${this.t.trainingTopics}</div>
            ${this.items.map(
              (item, index) => html`
                <training-button
                  title="${item.title}"
                  slug="${item.slug}"
                  index="${index + 1}"
                  ?visited="${index <= this.maxIndex}"
                  ?disabled="${this.maxIndex < index}"
                  ?active="${item.id === this.activeId}"
                >
                </training-button>
              `,
            )}
          </nav>
          ${authorName || authorEmail
            ? html`
                <div class="sidebar-footer">
                  ${authorName
                    ? html`<div class="footer-name">${authorName}</div>`
                    : ``}
                  ${authorEmail
                    ? html`
                        <div class="footer-support">
                          ${this.t.support}:
                          <a href="mailto:${authorEmail}">${authorEmail}</a>
                        </div>
                      `
                    : ``}
                </div>
              `
            : ``}
        </aside>
        <main class="main">
          <div class="content-column">
            <site-active-title></site-active-title>
            <article id="contentcontainer">
              <section id="slot">
                <slot></slot>
              </section>
            </article>
            <div class="link-actions">
              <div class="inner">
                <replace-tag with="site-menu-button" import-only></replace-tag>
                <site-menu-button
                  hide-label
                  type="prev"
                  position="right"
                  class="navigation"
                  @label-changed="${this.__prevPageLabelChanged}"
                >
                  <div slot="suffix" class="wrapper">
                    <div class="top">${this.t.previous}</div>
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
                    <div class="top">${this.t.next}</div>
                    <div class="bottom">${this.nextPage}</div>
                  </div>
                </site-menu-button>
              </div>
            </div>
          </div>
        </main>
      </div>
    `;
  }
}
globalThis.customElements.define(TrainingTheme.tag, TrainingTheme);
export { TrainingTheme };
