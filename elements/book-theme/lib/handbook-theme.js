/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { css } from "lit";
import { BookTheme } from "@haxtheweb/book-theme/book-theme.js";

/**
 * `handbook-theme`
 * Documentation theme with a solid top bar holding the site name, search
 * and the dark mode switch, over the menu, page and on this page columns.
 *
 * The layout pays homage to Docsy, the documentation theme for Hugo
 * (Apache-2.0, Copyright 2018 Google LLC). None of its code, styles or
 * assets are used, and it is named apart from it on purpose; see NOTICE.
 *
 * A HAXCMSLitElementTheme built on book-theme: same parts and behavior,
 * its own layout options and colors, all from DDD tokens.
 *
 * @title Handbook
 * @haxcms-theme-category Documentation, Course, Website
 * @haxcms-theme-priority 0
 * @demo ../demo/index.html
 * @element handbook-theme
 */
class HandbookTheme extends BookTheme {
  static get tag() {
    return "handbook-theme";
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
          --book-theme-header-height: 64px;
          --book-theme-header-surface: var(--ddd-theme-default-nittanyNavy);
          --book-theme-header-color: var(--ddd-theme-default-white);
        }
        .menu {
          border-right: var(--ddd-border-xs);
          border-right-color: var(--book-theme-rule);
        }
        .toc {
          border-left: var(--ddd-border-xs);
          border-left-color: var(--book-theme-rule);
        }
      `,
    ];
  }
}
globalThis.customElements.define(HandbookTheme.tag, HandbookTheme);
export { HandbookTheme };
