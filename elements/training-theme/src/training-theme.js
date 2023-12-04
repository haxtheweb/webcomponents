/**
 * Copyright 2023
 * @license , see License.md for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@lrnwebcomponents/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSRememberRoute } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSRememberRoute.js";
import { HAXCMSThemeParts } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { PrintBranchMixin } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/PrintBranchMixin.js";
import { PDFPageMixin } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/PDFPageMixin.js";
import { QRCodeMixin } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/QRCodeMixin.js";
import { HAXCMSMobileMenuMixin } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSMobileMenu.js";
import { HAXCMSOperationButtons } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSOperationButtons.js";
import { varExists, varGet } from "@lrnwebcomponents/utils/utils.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-active-tags.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-menu-button.js";
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
          HAXCMSThemeParts(HAXCMSMobileMenuMixin(HAXCMSLitElementTheme))
        )
      )
    )
  )
) {
  constructor() {
    super();
    this.activeId = null; // To keep track of the active index
    this.time = 0; // To store the timecode of the content
    autorun(() => {
      this.activeId = toJS(store.activeId);
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
      activeId: { type: String },
      time: { type: String },
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return [...super.styles,
      css`
        :host {
          display: block;
          margin: 16px;
          padding: 16px;
        }

        .alignContent {
          display: flex;
          justify-content: flex-start;
          gap: 90px;
        }

        .training-topics {
          margin-left: -36px;
          display: flex;
          flex-direction: column;
          width: 275px;
          margin-right: 1px;
          margin-top: 25px;
          position: fixed;
          padding-top: 8px;
          padding-right: 5px;
        }

        .main {
          margin: 42px 141px 23px 386px;
          padding-top: 8px;
          padding-right: 5px;
          padding-bottom: 1px;
          padding-left: 20px;
          width: calc(100% - 291px);
          height: 100%;
          font-size: 1em;
          border: 1px solid #dadce0;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          background-color: #f8f9fa;
          font: 400 16px/24px var(--devsite-primary-font-family);
          -webkit-font-smoothing: antialiased;
          text-size-adjust: 100%;
          color: #4e5256;
          font-family: var(--devsite-primary-font-family);
          background: #f8f9fa;
        }

        .fabs {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          position: fixed;
          bottom: 0;
          right: 0;
          margin: 19px;
          width: 81vw;
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
          background: #fff;
          color: #1a73e8;
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
          background: #1a73e8;
          color: #fff;
          border: 0;
          box-shadow:
            0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12),
            0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }
      `,
    ];
  }

  render() {
    return html`
      <training-top time="${this.time}"></training-top>
      <div class="alignContent">
        <div class="training-topics">
          ${this.manifest.items.map(
            (item, index) => html`
              <training-button
                title="${item.title}"
                id="${item.id}"
                @click="${this.itemClick}"
                index="${index}"
                ?active="${item.id === this.activeId}"
              >
              </training-button>
            `,
          )}
        </div>
        <main class="main">
          <article id="contentcontainer">
            <section id="slot">
              <slot></slot>
            </section>
          </article>
        </main>
        <footer class="fabs">
          <site-menu-button type="prev"></site-menu-button>
          <site-menu-button type="next"></site-menu-button>
        </footer>
      </div>
    `;
  }

  // Funtion to fetch for the content that is being clicked
  itemClick(e) {
    store.activeId = e.detail.index;
  }
}
customElements.define(TrainingTheme.tag, TrainingTheme);
export { TrainingTheme };
