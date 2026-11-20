/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { css } from "lit";
import { HomageSidebarTheme } from "@haxtheweb/papermod-theme/lib/HomageSidebarTheme.js";

/**
 * `hyde-theme`
 * Blog theme with a dark sidebar that holds the site name, its
 * description and the menu at the foot of the column, beside a narrow page.
 *
 * The layout pays homage to the Hyde Jekyll theme by Mark Otto (MIT).
 * None of its code, styles or assets are used; see NOTICE.
 *
 * A HAXCMSLitElementTheme built on HomageSidebarTheme: HAXcms theme parts in
 * that layout, with colors, fonts and widths from DDD tokens.
 *
 * @title Hyde
 * @haxcms-theme-category Blog, Website
 * @haxcms-theme-layout Sidebar
 * @haxcms-theme-inspired-by Jekyll Hyde
 * @haxcms-theme-priority 0
 * @demo ../demo/hyde-theme/index.html
 * @element hyde-theme
 */
class HydeTheme extends HomageSidebarTheme {
  static get tag() {
    return "hyde-theme";
  }

  constructor() {
    super();
    this.listVariant = "plain";
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --homage-sidebar-width: 288px;
          --homage-column-width: 640px;
          --homage-bg: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-black)
          );
          --homage-sidebar-bg: var(--ddd-theme-default-coalyGray);
          --homage-sidebar-text: var(--ddd-theme-default-white);
          --homage-sidebar-accent: var(--ddd-theme-default-linkLight);
        }
        /* the sidebar's contents sit at its foot; an auto margin (not
           justify-content) so a long menu still scrolls from its top */
        .identity {
          margin-top: auto;
        }
        .sidebar .tools {
          margin-top: 0;
        }
        site-title {
          --site-title-heading-font-size: var(--ddd-font-size-ms);
        }
        @media (max-width: 900px) {
          .identity {
            margin-top: 0;
          }
        }
      `,
    ];
  }
}
globalThis.customElements.define(HydeTheme.tag, HydeTheme);
export { HydeTheme };
