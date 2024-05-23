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
import { varExists, varGet } from "@haxtheweb/utils/utils.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-tags.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu-button.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { autorun, toJS } from "mobx";

import "./lib/training-button.js";
import "./lib/training-top.js";

/**
 * `training-theme`
 * `theme for training content in HAXcms`
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
    this.t.next = "Next";
    this.t.previous = "Previous";
    this.maxIndex = 0;
    this.activeId = null; // To keep track of the active index
    this.time = 0; // To store the timecode of the content
    autorun(() => {
      this.activeId = toJS(store.activeId);
    });
    autorun(() => {
      this.items = toJS(store.manifest.items);
    });
    autorun(() => {
      const manIn = toJS(store.activeManifestIndex);
      if (manIn > this.maxIndex) {
        this.maxIndex = manIn;
      }
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
      activeId: { type: String },
      time: { type: String },
      prevPage: {
        type: String,
      },
      nextPage: {
        type: String,
      },
      maxIndex: { type: Number },
    };
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
        }

        .alignContent {
          display: grid;
          grid-template-columns: 0.5fr 1.5fr;
          grid-template-rows: 1fr;
          gap: 16px;
          grid-template-areas: ". .";
        }

        .training-topics {
          margin: 0;
          padding: 16px;
          flex-direction: column;
          display: sticky;
        }
        .training-column {
          height: 100vh;
        }

        .main {
          margin: 16px 0;
          padding: 16px;
          width: 80%;
          height: 100%;
          border: 1px solid #dadce0;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          background-color: #f8f9fa;
          -webkit-font-smoothing: antialiased;
          text-size-adjust: 100%;
          color: #4e5256;
          font-family: var(--devsite-primary-font-family);
          background: #f8f9fa;
        }

        site-active-title h1 {
          border-left: 4px solid blue;
          padding-left: 4px;
        }

        site-menu-button[type="prev"] {
          border-radius: 4px;
          font-family:
            Google Sans,
            Arial,
            sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.6px;
          line-height: 24px;
          padding-bottom: 6px;
          padding-left: 24px;
          padding-right: 24px;
          padding-top: 6px;
          pointer-events: auto;
          text-transform: none;
          border: 0;
          box-shadow:
            0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12),
            0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }
        site-menu-button[type="next"] {
          border-radius: 4px;
          font-family:
            Google Sans,
            Arial,
            sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.6px;
          line-height: 24px;
          padding-bottom: 6px;
          padding-left: 24px;
          padding-right: 24px;
          padding-top: 6px;
          pointer-events: auto;
          text-transform: none;
          border: 0;
          box-shadow:
            0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12),
            0 3px 1px -2px rgba(0, 0, 0, 0.2);
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
            --haxcms-color,
            var(--simple-colors-default-theme-purple-7)
          );
          color: #242a31;
          border: 1px solid #e6ecf1;
          margin: 0;
          display: block;
          padding: 0;
          position: relative;
          align-self: stretch;
          box-shadow: 0 3px 8px 0 rgba(116, 129, 141, 0.1);
          transition: border 0.3s ease;
          align-items: center;
          justify-self: stretch;
          text-overflow: ellipsis;
          border-radius: 3px;
          flex-direction: row;
          text-decoration: none;
          background-color: #ffffff;
          -webkit-box-align: center;
          page-break-inside: avoid;
          -ms-grid-row-align: stretch;
          -webkit-box-orient: horizontal;
          -ms-grid-column-align: stretch;
          -webkit-box-direction: normal;
        }
        replace-tag[with="site-git-corner"],
        site-git-corner {
          height: 40px;
          width: 40px;
          margin-left: -66px;
          padding: 0;
          --github-corner-size: 40px;
          --site-git-corner-color: black;
          --site-git-corner-background: transparent;
          background-color: transparent;
          color: black;
          padding: 8px;
          display: block;
          float: unset;
        }
        .email-btn,
        .print-branch-btn simple-icon-button-lite,
        .pdf-page-btn simple-icon-button-lite {
          --simple-icon-height: 24px;
          --simple-icon-width: 24px;
          color: black;
          padding: 8px;
          display: block;
          width: 36px;
          margin-left: -60px;
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
          font-size: 16px;
          font-weight: 500;
          line-height: 1.5;
          text-transform: none;
        }
        site-menu-button div .top {
          font-size: 12px;
          font-weight: 400;
          line-height: 1.625;
          color: #444444;
        }
        simple-datetime {
          color: #444444;
        }
        site-menu-button div .bottom {
          font-size: 16px;
          font-weight: 500;
          line-height: 1.5;
          max-height: 50px;
          overflow: hidden;
        }
        site-menu-button[type="next"] div {
          text-align: left;
        }
        site-menu-button[type="prev"] div {
          text-align: right;
        }
      `,
    ];
  }

  render() {
    return html`
      <training-top time="${this.time}"></training-top>
      <div class="alignContent">
        <div class="training-column">
          <div class="training-topics">
            ${this.items.map(
              (item, index) => html`
                <training-button
                  title="${item.title}"
                  slug="${item.slug}"
                  index="${index + 1}"
                  ?disabled="${this.maxIndex < index}"
                  ?active="${item.id === this.activeId}"
                >
                </training-button>
              `,
            )}
          </div>
        </div>
        <main class="main">
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
        </main>
      </div>
    `;
  }
}
customElements.define(TrainingTheme.tag, TrainingTheme);
export { TrainingTheme };
