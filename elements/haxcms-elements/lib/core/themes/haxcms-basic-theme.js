/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { css } from "lit";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { BasicTemplate } from "@haxtheweb/haxcms-elements/lib/ui-components/templates/basic-template.js";
/**
 * `haxcms-basic-theme`
 * `An incredibly basic theme.
 * @demo demo/index.html
 */
class HAXCMSBasicTheme extends BasicTemplate(HAXCMSLitElementTheme) {
  static get styles() {
    return [
      super.styles,
      css`
      :host {
        display: block;
        background-color: white;
        --haxcms-basic-theme-accent-color: var(--haxcms-color, yellow);
      }
      scroll-button:not(:defined),
      site-active-title:not(:defined),
      site-children-block:not(:defined),
      site-outline-block:not(:defined),
      site-recent-content-block:not(:defined),
      site-footer:not(:defined),
      site-modal:not(:defined),
      site-breadcrumb:not(:defined),
      site-dot-indicator:not(:defined),
      site-menu-button:not(:defined),
      site-menu:not(:defined),
      site-top-menu:not(:defined),
      site-print-button:not(:defined),
      site-rss-button:not(:defined) {
        display: none;
      }
      :host([edit-mode]) .left-col {
        pointer-events: none;
        opacity: 0.2;
      }
      .container {
        margin: 24px auto;
        max-width: 1280px;
        width: 90%;
      }
      site-breadcrumb {
        margin-left: 16px;
      }
      /**
        * Hide the slotted content during edit mode. This must be here to work.
        */
      :host([edit-mode]) #slot {
        display: none;
      }
      site-top-menu {
        --site-top-menu-bg: var(
          --simple-colors-default-theme-blue-grey-7,
          #37474f
        );
        --site-top-menu-link-color: #ffffff;
        --site-top-menu-indicator-color: #ffffff;
        --site-top-menu-link-active-color: var(
          --haxcms-basic-theme-accent-color
        );
        --site-top-menu-indicator-arrow: 8px;
      }
      site-children-block {
        --site-children-block-button: {
          color: #ffffff;
        }
        --site-children-block-button-active: {
          background-color: var(
            --simple-colors-default-theme-blue-grey-7,
            #37474f
          );
          color: var(--haxcms-basic-theme-accent-color);
        }
      }
      .grid-wrapper {
        --grid-plate-col-transition: none;
        min-height: 85vh;
      }
      .left-col {
        min-height: 250px;
        border: 2px solid black;
        background-color: var(
          --simple-colors-default-theme-blue-grey-7,
          #37474f
        );
        color: white;
        padding: 16px;
        transition: 0.2s opacity linear;
        opacity: 1;
      }
      site-active-title {
        display: inline-flex;
        font-family: "Montserrat", "Helvetica", "Tahoma", "Geneva", "Arial",
          sans-serif;
        font-size: 16px;
        line-height: 32px;
        margin-bottom: 8px;
        text-rendering: optimizelegibility;
        font-weight: 600;
        color: white;
      }
      site-title {
        margin: 0 32px;
        overflow: hidden;
      }
      .buttons {
        margin-top: 36px;
        display: flex;
      }
      .buttons site-rss-button {
        display: inline-flex;
      }
      .menu-buttons {
        display: flex;
      }
      site-menu-button {
        --site-menu-button-button-hover-color: var(
          --haxcms-basic-theme-accent-color
        );
        --site-menu-button-icon-fill-color: white;
      }
      site-footer {
        padding: 32px 64px;
        background-color: var(
          --simple-colors-default-theme-blue-grey-7,
          #37474f
        );
      }
      site-modal {
        --site-modal-icon-color: white;
        --site-modal-tooltip: {
          --simple-tooltip-background: #000000;
          --simple-tooltip-opacity: 1;
          --simple-tooltip-text-color: #ffffff;
          --simple-tooltip-delay-in: 0;
          --simple-tooltip-border-radius: 0;
        }
      }
      scroll-button {
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 10000000;
      }
      site-print-button {
        color: white;
      }
      site-print-button simple-tooltip {
        --simple-tooltip-background: #000000;
        --simple-tooltip-opacity: 1;
        --simple-tooltip-text-color: #ffffff;
        --simple-tooltip-delay-in: 0;
        --simple-tooltip-border-radius: 0;
      }
    `,
    ];
  }
}
customElements.define("haxcms-basic-theme", HAXCMSBasicTheme);
export { HAXCMSBasicTheme };
