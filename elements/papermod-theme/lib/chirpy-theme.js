/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { css } from "lit";
import { HomageSidebarTheme } from "@haxtheweb/papermod-theme/lib/HomageSidebarTheme.js";

/**
 * `chirpy-theme`
 * Blog theme with a tinted sidebar, the page in the middle, the headings
 * of the page on the right and section pages listed as cards.
 *
 * The layout pays homage to the Chirpy Jekyll theme by Cotes Chung (MIT).
 * None of its code, styles or assets are used; see NOTICE.
 *
 * A HAXCMSLitElementTheme built on HomageSidebarTheme: HAXcms theme parts in
 * that layout, with colors, fonts and widths from DDD tokens.
 *
 * @title Chirpy
 * @haxcms-theme-category Blog, Website
 * @haxcms-theme-layout Sidebar
 * @haxcms-theme-inspired-by Jekyll Chirpy
 * @haxcms-theme-priority 0
 * @demo ../demo/chirpy-theme/index.html
 * @element chirpy-theme
 */
class ChirpyTheme extends HomageSidebarTheme {
  static get tag() {
    return "chirpy-theme";
  }

  constructor() {
    super();
    this.withToc = true;
    this.listVariant = "cards";
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --homage-sidebar-width: 260px;
          --homage-column-width: 800px;
          --homage-sidebar-bg: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-black)
          );
        }
        .sidebar {
          border-right: var(--ddd-border-xs);
          border-right-color: var(--homage-rule);
        }
        .names {
          text-align: center;
        }
        .toc {
          border-left: var(--ddd-border-xs);
          border-left-color: var(--homage-rule);
        }
      `,
    ];
  }
}
globalThis.customElements.define(ChirpyTheme.tag, ChirpyTheme);
export { ChirpyTheme };
