/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { css } from "lit";
import { HomageSidebarTheme } from "@haxtheweb/papermod-theme/lib/HomageSidebarTheme.js";

/**
 * `astrofy-theme`
 * Personal site theme with a centered sidebar and the page on a rounded
 * surface over a tinted ground, with section pages as cards.
 *
 * The layout pays homage to the Astrofy Astro theme by Manuel Ernesto
 * Garcia (MIT).
 * None of its code, styles or assets are used; see NOTICE.
 *
 * A HAXCMSLitElementTheme built on HomageSidebarTheme: HAXcms theme parts in
 * that layout, with colors, fonts and widths from DDD tokens.
 *
 * @title Astrofy
 * @haxcms-theme-category Website
 * @haxcms-theme-priority 0
 * @demo ../demo/astrofy-theme/index.html
 * @element astrofy-theme
 */
class AstrofyTheme extends HomageSidebarTheme {
  static get tag() {
    return "astrofy-theme";
  }

  constructor() {
    super();
    this.listVariant = "cards";
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --homage-sidebar-width: 300px;
          --homage-column-width: 840px;
          --homage-bg: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-black)
          );
          --homage-surface: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          --homage-sidebar-bg: var(--homage-surface);
          --homage-radius: var(--ddd-radius-lg);
        }
        .names {
          text-align: center;
        }
        main {
          margin: var(--ddd-spacing-6);
          border-radius: var(--homage-radius);
          background-color: var(--homage-surface);
        }
        @media (max-width: 900px) {
          main {
            margin: var(--ddd-spacing-2);
          }
        }
      `,
    ];
  }
}
globalThis.customElements.define(AstrofyTheme.tag, AstrofyTheme);
export { AstrofyTheme };
