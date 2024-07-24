/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html } from "@polymer/polymer/polymer-element.js";
import { HAXCMSPolymerElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSPolymerElementTheme.js";
import { MinimalistTemplate } from "@haxtheweb/haxcms-elements/lib/ui-components/templates/minimalist-template.js";
/**
 * `haxcms-minimalist-theme`
 * `Minimalist design, just a whole page really.
 *

 * @polymer
 * @demo demo/index.html
 */
class HAXCMSMinimalistTheme extends MinimalistTemplate(
  HAXCMSPolymerElementTheme,
) {
  // render function
  static get template() {
    let template = super.template;
    return html`
      <style>
        :host {
          display: block;
          font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial,
            sans-serif;
          background-color: white;
          --haxcms-basic-theme-accent-color: var(--haxcms-color, yellow);
        }
        header.masthead {
          margin-bottom: 50px;
          background: no-repeat center center;
          background-color: #868e96;
          background-attachment: scroll;
          position: relative;
          -webkit-background-size: cover;
          -moz-background-size: cover;
          -o-background-size: cover;
          background-size: cover;
        }

        header.masthead .overlay {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background-color: #212529;
          opacity: 0.6;
        }

        header.masthead .page-heading,
        header.masthead .post-heading,
        header.masthead .site-heading {
          padding: 200px 0 150px;
          color: #fff;
        }

        @media only screen and (min-width: 768px) {
          header.masthead .page-heading,
          header.masthead .post-heading,
          header.masthead .site-heading {
            padding: 200px 0;
          }
        }

        header.masthead .page-heading,
        header.masthead .site-heading {
          text-align: center;
        }

        header.masthead .page-heading h1,
        header.masthead .site-heading h1 {
          font-size: 50px;
          margin-top: 0;
        }

        header.masthead .page-heading .subheading,
        header.masthead .site-heading .subheading {
          font-size: 24px;
          font-weight: 300;
          line-height: 1.1;
          display: block;
          margin: 10px 0 0;
          font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial,
            sans-serif;
        }

        @media only screen and (min-width: 768px) {
          header.masthead .page-heading h1,
          header.masthead .site-heading h1 {
            font-size: 80px;
          }
        }

        header.masthead .post-heading h1 {
          font-size: 35px;
        }

        header.masthead .post-heading .meta,
        header.masthead .post-heading .subheading {
          line-height: 1.1;
          display: block;
        }

        header.masthead .post-heading .subheading {
          font-size: 24px;
          font-weight: 600;
          margin: 10px 0 30px;
          font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial,
            sans-serif;
        }

        header.masthead .post-heading .meta {
          font-size: 20px;
          font-weight: 300;
          font-style: italic;
          font-family: Lora, "Times New Roman", serif;
        }

        header.masthead .post-heading .meta a {
          color: #fff;
        }

        @media only screen and (min-width: 768px) {
          header.masthead .post-heading h1 {
            font-size: 55px;
          }

          header.masthead .post-heading .subheading {
            font-size: 30px;
          }
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

        site-menu-button {
          --site-menu-button-button-hover-background-color: #dee2e6;
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
        site-top-menu[sticky] {
          font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial,
            sans-serif;
          font-weight: 800;
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
          font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial,
            sans-serif;
          --simple-tooltip-background: #000000;
          --simple-tooltip-opacity: 1;
          --simple-tooltip-text-color: #ffffff;
          --simple-tooltip-delay-in: 0;
          --simple-tooltip-border-radius: 0;
          color: #007bff;
          --site-top-menu-bg: white;
        }
        site-print-button simple-tooltip {
          --simple-tooltip-background: #000000;
          --simple-tooltip-opacity: 1;
          --simple-tooltip-text-color: #ffffff;
          --simple-tooltip-delay-in: 0;
          --simple-tooltip-border-radius: 0;
        }

        scroll-button {
          position: fixed;
          right: 0;
          bottom: 50px;
          z-index: 10000;
        }
        .spacing {
          height: 50px;
        }
      </style>
      ${template}
    `;
  }
}
customElements.define("haxcms-minimalist-theme", HAXCMSMinimalistTheme);
export { HAXCMSMinimalistTheme };
