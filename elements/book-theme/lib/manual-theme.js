/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { css } from "lit";
import { BookTheme } from "@haxtheweb/book-theme/book-theme.js";

/**
 * `manual-theme`
 * Documentation theme with a light top bar over a bordered menu column,
 * a green accent, and previous and next links drawn as cards.
 *
 * The layout pays homage to the classic theme of Docusaurus (MIT,
 * Copyright Facebook, Inc. and its affiliates). None of its code, styles
 * or assets are used, and it is named apart from it on purpose; see NOTICE.
 *
 * A HAXCMSLitElementTheme built on book-theme: same parts and behavior,
 * its own layout options and colors, all from DDD tokens.
 *
 * @title Manual
 * @haxcms-theme-category Documentation, Course, Website
 * @haxcms-theme-layout Sidebar
 * @haxcms-theme-inspired-by Docusaurus
 * @haxcms-theme-priority 0
 * @demo ../demo/manual-theme/index.html
 * @element manual-theme
 */
class ManualTheme extends BookTheme {
  static get tag() {
    return "manual-theme";
  }

  constructor() {
    super();
    this.bookLayout = "topbar";
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --book-theme-header-height: 60px;
          --book-theme-link: light-dark(
            var(--ddd-theme-default-opportunityGreen),
            var(--ddd-theme-default-futureLime)
          );
        }
        :host([book-layout="topbar"]) .header {
          box-shadow: var(--ddd-boxShadow-sm);
        }
        .menu {
          border-right: var(--ddd-border-xs);
          border-right-color: var(--book-theme-rule);
        }
        .pager {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        site-menu-button {
          border: var(--ddd-border-xs);
          border-color: var(--book-theme-rule);
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-3);
        }
        site-menu-button:hover,
        site-menu-button:focus-within {
          border-color: var(--book-theme-link);
        }
        site-menu-button[type="next"] {
          grid-column: 2;
        }
      `,
    ];
  }
}
globalThis.customElements.define(ManualTheme.tag, ManualTheme);
export { ManualTheme };
