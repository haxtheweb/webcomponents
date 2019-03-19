/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXCMSTheme } from "@lrnwebcomponents/haxcms-elements/lib/core/HAXCMSThemeWiring.js";
import { MinimalistTemplate } from "@lrnwebcomponents/haxcms-elements/lib/ui-components/templates/minimalist-template.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `haxcms-minimalist-theme`
 * `Minimalist design, just a whole page really.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class HAXCMSMinimalistTheme extends HAXCMSTheme(
  MinimalistTemplate(PolymerElement)
) {
  // render function
  static get template() {
    let template = super.template;
    return html`
      <style include="simple-colors">
        :host {
          display: block;
          font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial,
            sans-serif;
          background-color: white;
          --haxcms-basic-theme-accent-color: var(--haxcms-color, yellow);
        }
        /**
         * Hide the slotted content during edit mode. This must be here to work.
         */
        :host([edit-mode]) #slot {
          display: none;
        }
        :host #slot ::slotted(p) {
          line-height: 1.5;
          margin: 30px 0;
        }
        @media (min-width: 1200px) {
          .container {
            max-width: 1140px;
          }
        }
        @media (min-width: 992px) {
          .container {
            max-width: 960px;
          }
        }
        @media (min-width: 768px) {
          .container {
            max-width: 720px;
          }
        }
        @media (min-width: 576px) {
          .container {
            max-width: 540px;
          }
        }
        .container {
          width: 100%;
          min-height: 80vh;
          padding: 0 16px;
          margin: 48px auto;
        }

        site-title {
          --site-title-link: {
            color: black;
            display: inline-flex;
          }
          --site-title-tooltip: {
            --paper-tooltip-background: #000000;
            --paper-tooltip-opacity: 1;
            --paper-tooltip-text-color: #ffffff;
            --paper-tooltip-delay-in: 0;
            --paper-tooltip: {
              border-radius: 0;
            }
          }
          --site-title-link-hover: {
            background-color: #dee2e6;
          }
        }
        site-top-menu:not([sticky]) site-title {
          --site-title-link: {
            color: black;
            display: inline-flex;
            border: 1px solid #dee2e6;
            padding: 0.75rem 1.5rem;
            font-size: 1.25rem;
            line-height: 1.5;
          }
          --site-title-link-hover: {
            background-color: #dee2e6;
          }
        }
        site-menu-button {
          --site-menu-button-button: {
            color: black;
            display: inline-flex;
            border: 1px solid #dee2e6;
            padding: 0;
            font-size: 1.25rem;
            margin: 0;
            height: 50px;
            width: 50px;
            min-width: unset;
            line-height: 1.5;
          }
          --site-menu-button-button-hover: {
            background-color: #dee2e6;
          }
        }
        site-top-menu[sticky] {
          --site-top-menu-wrapper: {
            font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial,
              sans-serif;
            border-bottom: 1px solid #fff;
            max-width: 1140px;
            font-weight: 800;
          }
          height: 50px;
          line-height: 50px;
          color: black;
          font-size: 20px;
          --site-top-menu-bg: rgba(255, 255, 255, 0.9);
        }
        hr {
          margin-top: 1rem;
          margin-bottom: 1rem;
          border: 0;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          box-sizing: content-box;
          height: 0;
          overflow: visible;
        }
        site-top-menu:not([sticky]) {
          --site-top-menu-wrapper: {
            font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial,
              sans-serif;
            justify-content: center;
          }
          --site-top-menu-tooltip: {
            --paper-tooltip-background: #000000;
            --paper-tooltip-opacity: 1;
            --paper-tooltip-text-color: #ffffff;
            --paper-tooltip-delay-in: 0;
            --paper-tooltip: {
              border-radius: 0;
            }
          }
          color: #007bff;
          --site-top-menu-bg: white;
          --site-top-menu-button: {
            border: 1px solid #dee2e6;
            padding: 0;
            margin: 0;
            height: 50px;
            width: 50px;
            min-width: unset;
            border-radius: 0;
            font-size: 1.25rem;
            line-height: 1.5;
          }
          --site-top-menu-button-hover: {
            background-color: #dee2e6;
          }
        }
        site-print-button {
          --site-print-button-button: {
            color: black;
            display: inline-flex;
            height: 50px;
            width: 50px;
          }
          --site-print-button-tooltip: {
            --paper-tooltip-background: #000000;
            --paper-tooltip-opacity: 1;
            --paper-tooltip-text-color: #ffffff;
            --paper-tooltip-delay-in: 0;
            --paper-tooltip: {
              border-radius: 0;
            }
          }
          --site-print-button-button-hover: {
            background-color: #dee2e6;
          }
        }
        site-top-menu:not([sticky]) site-print-button {
          --site-print-button-button: {
            color: black;
            display: inline-flex;
            border: 1px solid #dee2e6;
            height: 50px;
            width: 50px;
            line-height: 1.5;
          }
        }
        scroll-button {
          position: fixed;
          right: 0;
          bottom: 50px;
          z-index: 10000;
          --scroll-button-button: {
            border-radius: 10px;
          }
        }
      </style>
      ${template}
    `;
  }
}
window.customElements.define("haxcms-minimalist-theme", HAXCMSMinimalistTheme);
export { HAXCMSMinimalistTheme };
